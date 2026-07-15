import os
from types import SimpleNamespace
from unittest.mock import MagicMock, patch

os.environ.pop("DATABASE_URL", None)

import pytest
import backend.app as app_module


@pytest.fixture
def client():
    app_module.app.config.update(TESTING=True, SECRET_KEY="test-secret")
    with app_module.app.test_client() as test_client:
        yield test_client


def test_verify_session_rejects_company_not_owned_by_checkout(client):
    checkout = SimpleNamespace(
        payment_status="paid",
        subscription="sub_123",
        customer="cus_123",
        client_reference_id="7",
        metadata={"company_id": "7"},
    )
    with patch.object(app_module.stripe.checkout.Session, "retrieve", return_value=checkout):
        response = client.get("/api/verify-session?session_id=cs_123&company_id=8")
    assert response.status_code == 403
    assert response.get_json()["error"] == "Checkout session does not match this company"


def test_signup_rejects_client_selected_company_without_verified_checkout(client):
    response = client.post("/api/signup", json={
        "company_id": 999,
        "email": "owner@example.com",
        "password": "safe-password",
        "name": "Owner",
    })
    assert response.status_code == 403
    assert response.get_json()["error"] == "Complete payment verification before creating an account"


def test_billing_portal_requires_login(client):
    response = client.post("/api/billing-portal")
    assert response.status_code == 401


def test_billing_portal_uses_signed_in_company_customer_id(client):
    fake_connection = MagicMock()
    fake_cursor = fake_connection.cursor.return_value
    fake_cursor.fetchone.return_value = {
        "subscription_status": "active",
        "stripe_customer_id": "cus_correct",
    }
    portal = SimpleNamespace(url="https://billing.stripe.com/session/test")
    with client.session_transaction() as flask_session:
        flask_session["user_id"] = 11
        flask_session["company_id"] = 7
    with patch.object(app_module, "get_db", return_value=fake_connection), \
         patch.object(app_module.stripe.billing_portal.Session, "create", return_value=portal) as create:
        response = client.post("/api/billing-portal")
    assert response.status_code == 200
    assert response.get_json()["url"] == portal.url
    create.assert_called_once_with(
        customer="cus_correct",
        return_url=app_module.FRONTEND_URL + "/dashboard",
    )


def test_verify_session_rejects_unpaid_checkout(client):
    checkout = SimpleNamespace(payment_status="unpaid", subscription="sub_123")
    with patch.object(app_module.stripe.checkout.Session, "retrieve", return_value=checkout):
        response = client.get("/api/verify-session?session_id=cs_123&company_id=7")
    assert response.status_code == 400


def test_verify_session_rejects_missing_checkout_reference(client):
    checkout = SimpleNamespace(
        payment_status="paid", subscription="sub_123", customer="cus_123",
        client_reference_id=None, metadata={},
    )
    with patch.object(app_module.stripe.checkout.Session, "retrieve", return_value=checkout):
        response = client.get("/api/verify-session?session_id=cs_123&company_id=7")
    assert response.status_code == 403


def test_checkout_authorization_schema_is_initialized():
    connection = MagicMock()
    with patch.object(app_module, "get_database_url", return_value="postgres://test"), \
         patch.object(app_module.psycopg, "connect", return_value=connection):
        app_module.init_db()
    statements = [call.args[0] for call in connection.cursor.return_value.execute.call_args_list]
    assert any("checkout_authorizations" in statement for statement in statements)


def test_signup_rejects_a_stale_checkout_authorization(client):
    connection = MagicMock()
    connection.cursor.return_value.fetchone.side_effect = [None, None]
    with client.session_transaction() as flask_session:
        flask_session["verified_checkout_session_id"] = "cs_expired"
    with patch.object(app_module, "get_db", return_value=connection):
        response = client.post("/api/signup", json={
            "email": "owner@example.com", "password": "safe-password", "name": "Owner",
        })
    assert response.status_code == 403
    consume = connection.cursor.return_value.execute.call_args_list[1]
    assert "SET consumed_at = NOW()" in consume.args[0]
    assert "consumed_at IS NULL" in consume.args[0]
    assert "expires_at > NOW()" in consume.args[0]


def test_signup_consumes_the_checkout_authorization_once(client):
    connection = MagicMock()
    connection.cursor.return_value.fetchone.side_effect = [
        None, {"company_id": 7}, {"id": 22},
    ]
    with client.session_transaction() as flask_session:
        flask_session["verified_checkout_session_id"] = "cs_paid"
    with patch.object(app_module, "get_db", return_value=connection):
        response = client.post("/api/signup", json={
            "email": "owner@example.com", "password": "safe-password", "name": "Owner",
        })
    assert response.status_code == 201
    assert response.get_json()["user_id"] == 22
    with client.session_transaction() as flask_session:
        assert "verified_checkout_session_id" not in flask_session
    assert client.post("/api/signup", json={}).status_code == 403


def test_consumed_checkout_authorization_cannot_be_reissued(client):
    checkout = SimpleNamespace(
        payment_status="paid", subscription="sub_123", customer="cus_123",
        client_reference_id="7", metadata={"company_id": "7"},
    )
    connection = MagicMock()
    connection.cursor.return_value.fetchone.side_effect = [{
        "id": 7, "subscription_status": "active", "stripe_subscription_id": "sub_123",
    }, None]
    with patch.object(app_module.stripe.checkout.Session, "retrieve", return_value=checkout), \
         patch.object(app_module, "get_db", return_value=connection):
        response = client.get("/api/verify-session?session_id=cs_used&company_id=7")
    assert response.status_code == 200
    authorization_insert = connection.cursor.return_value.execute.call_args_list[-1].args[0]
    assert "ON CONFLICT (checkout_session_id) DO NOTHING" in authorization_insert


def test_browser_verification_accepts_the_matching_active_subscription_after_webhook(client):
    checkout = SimpleNamespace(
        payment_status="paid", subscription="sub_123", customer="cus_123",
        client_reference_id="7", metadata={"company_id": "7"},
    )
    connection = MagicMock()
    connection.cursor.return_value.fetchone.side_effect = [{
        "id": 7, "subscription_status": "active", "stripe_subscription_id": "sub_123",
    }, None]
    with patch.object(app_module.stripe.checkout.Session, "retrieve", return_value=checkout), \
         patch.object(app_module, "get_db", return_value=connection):
        response = client.get("/api/verify-session?session_id=cs_123&company_id=7")
    assert response.status_code == 200
    statements = [call.args[0] for call in connection.cursor.return_value.execute.call_args_list]
    assert any("INSERT INTO checkout_authorizations" in statement for statement in statements)
    assert any("pg_advisory_xact_lock" in statement for statement in statements)


def test_checkout_webhook_cannot_reactivate_a_canceled_company_on_retry(client):
    checkout_event = {
        "type": "checkout.session.completed",
        "data": {"object": {
            "metadata": {"company_id": "7"}, "client_reference_id": "7",
            "payment_status": "paid", "subscription": "sub_123", "customer": "cus_123",
        }},
    }
    canceled_event = {
        "type": "customer.subscription.deleted",
        "data": {"object": {"id": "sub_123"}},
    }
    connection = MagicMock()
    with patch.object(app_module.stripe.Webhook, "construct_event",
                      side_effect=[canceled_event, checkout_event, checkout_event]), \
         patch.object(app_module, "get_db", return_value=connection):
        assert client.post("/api/webhook", data=b"canceled", headers={"Stripe-Signature": "sig"}).status_code == 200
        assert client.post("/api/webhook", data=b"first", headers={"Stripe-Signature": "sig"}).status_code == 200
        assert client.post("/api/webhook", data=b"retry", headers={"Stripe-Signature": "sig"}).status_code == 200
    statements = [call.args[0] for call in connection.cursor.return_value.execute.call_args_list]
    checkout_updates = [statement for statement in statements if "stripe_customer_id = %s" in statement]
    assert len(checkout_updates) == 2
    assert all("subscription_status = 'pending'" in statement for statement in checkout_updates)
    assert all("canceled_stripe_subscriptions" in statement for statement in checkout_updates)
    assert sum("pg_advisory_xact_lock" in statement for statement in statements) == 3
