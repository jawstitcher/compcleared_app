import os
from types import SimpleNamespace
from unittest.mock import patch

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
