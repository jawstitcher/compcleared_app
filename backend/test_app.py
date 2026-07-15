import os
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import MagicMock, patch

os.environ.pop("DATABASE_URL", None)

import pytest
import backend.app as app_module


def test_generated_pdf_copy_does_not_certify_compliance_or_legal_defensibility():
    source = Path(app_module.__file__).read_text()

    assert "CALIFORNIA SB 553 COMPLIANCE CERTIFICATION" not in source
    assert "In Compliance with California SB 553 / LC 6401.9" not in source
    assert "audit trails for legal defensibility" not in source


class StatefulCheckoutDb:
    """Small in-memory transaction fake for signup/cancellation ordering tests."""

    def __init__(self):
        self.companies = {
            7: {
                "id": 7,
                "subscription_status": "active",
                "stripe_subscription_id": "sub_123",
            }
        }
        self.authorizations = {"cs_paid": {"company_id": 7, "consumed": False}}
        self.canceled_subscriptions = set()
        self.users = []
        self.cursor_instance = StatefulCheckoutCursor(self)

    def cursor(self):
        return self.cursor_instance

    def commit(self):
        pass

    def rollback(self):
        pass

    def close(self):
        pass


class StatefulCheckoutCursor:
    def __init__(self, database):
        self.database = database
        self.result = None

    def execute(self, statement, params=()):
        normalized = " ".join(statement.split())
        self.result = None

        if "SELECT id FROM users WHERE email" in normalized:
            email = params[0]
            self.result = next((user for user in self.database.users if user["email"] == email), None)
        elif "SELECT authorization.company_id, company.stripe_subscription_id" in normalized:
            authorization = self.database.authorizations.get(params[0])
            if authorization:
                company = self.database.companies[authorization["company_id"]]
                self.result = {
                    "company_id": authorization["company_id"],
                    "stripe_subscription_id": company["stripe_subscription_id"],
                }
        elif ("UPDATE checkout_authorizations" in normalized
              and "checkout_session_id = %s" in normalized):
            authorization = self.database.authorizations.get(params[0])
            company = (self.database.companies.get(authorization["company_id"])
                       if authorization else None)
            # The production statement must join the company/cancellation state;
            # without that join, a canceled authorization remains consumable.
            active_and_not_canceled = (
                "FROM companies" not in normalized or (
                    company and company["subscription_status"] == "active"
                    and company["stripe_subscription_id"] not in self.database.canceled_subscriptions
                )
            )
            if authorization and not authorization["consumed"] and active_and_not_canceled:
                authorization["consumed"] = True
                self.result = {"company_id": authorization["company_id"]}
        elif "INSERT INTO users" in normalized:
            user = {"id": len(self.database.users) + 1, "email": params[1]}
            self.database.users.append(user)
            self.result = user
        elif "INSERT INTO canceled_stripe_subscriptions" in normalized:
            self.database.canceled_subscriptions.add(params[0])
        elif "SET subscription_status = %s" in normalized and "stripe_subscription_id = %s" in normalized:
            for company in self.database.companies.values():
                if company["stripe_subscription_id"] == params[1]:
                    company["subscription_status"] = params[0]
        elif "UPDATE checkout_authorizations" in normalized and "stripe_subscription_id" in normalized:
            for authorization in self.database.authorizations.values():
                company = self.database.companies[authorization["company_id"]]
                if company["stripe_subscription_id"] == params[0]:
                    authorization["consumed"] = True

    def fetchone(self):
        return self.result


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


def test_signup_consumes_the_checkout_authorization_once(client):
    connection = MagicMock()
    connection.cursor.return_value.fetchone.side_effect = [
        None,
        {"company_id": 7, "stripe_subscription_id": "sub_123"},
        {"company_id": 7},
        {"id": 22},
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


def test_signup_consumption_is_one_time_in_behavior(client):
    database = StatefulCheckoutDb()
    with client.session_transaction() as flask_session:
        flask_session["verified_checkout_session_id"] = "cs_paid"
    with patch.object(app_module, "get_db", return_value=database):
        first = client.post("/api/signup", json={
            "email": "owner@example.com", "password": "safe-password", "name": "Owner",
        })
        with client.session_transaction() as flask_session:
            flask_session["verified_checkout_session_id"] = "cs_paid"
        second = client.post("/api/signup", json={
            "email": "second@example.com", "password": "safe-password", "name": "Second",
        })

    assert first.status_code == 201
    assert second.status_code == 403
    assert [user["email"] for user in database.users] == ["owner@example.com"]
    assert database.authorizations["cs_paid"]["consumed"] is True


def test_cancellation_before_signup_prevents_user_creation(client):
    database = StatefulCheckoutDb()
    canceled_event = {
        "type": "customer.subscription.deleted",
        "data": {"object": {"id": "sub_123"}},
    }
    with patch.object(app_module.stripe.Webhook, "construct_event", return_value=canceled_event), \
         patch.object(app_module, "get_db", return_value=database):
        cancellation = client.post("/api/webhook", data=b"canceled", headers={"Stripe-Signature": "sig"})
        with client.session_transaction() as flask_session:
            flask_session["verified_checkout_session_id"] = "cs_paid"
        signup = client.post("/api/signup", json={
            "email": "owner@example.com", "password": "safe-password", "name": "Owner",
        })

    assert cancellation.status_code == 200
    assert signup.status_code == 403
    assert database.companies[7]["subscription_status"] == "canceled"
    assert database.authorizations["cs_paid"]["consumed"] is True
    assert database.users == []


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
