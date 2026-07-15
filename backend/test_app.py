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
