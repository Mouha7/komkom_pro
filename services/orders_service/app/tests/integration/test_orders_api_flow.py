from __future__ import annotations

from uuid import uuid4

import pytest
from fastapi.testclient import TestClient

from src.api.v1.dependencies import require_admin, require_user
from src.main import app
import src.main as main_module


@pytest.fixture()
def client() -> TestClient:
    original_rabbitmq_url = main_module.settings.rabbitmq_url
    main_module.settings.rabbitmq_url = None
    app.dependency_overrides[require_user] = lambda: {
        "sub": "integration-user",
        "realm_access": {"roles": ["admin"]},
    }
    app.dependency_overrides[require_admin] = lambda: {
        "sub": "integration-user",
        "realm_access": {"roles": ["admin"]},
    }
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
    main_module.settings.rabbitmq_url = original_rabbitmq_url


def test_orders_create_list_get_idempotent(client: TestClient) -> None:
    store_id = f"store-{uuid4().hex[:8]}"
    idempotency_key = f"idem-{uuid4().hex}"
    payload = {
        "storeId": store_id,
        "items": [
            {
                "productId": "prod-integ-1",
                "quantity": 2,
                "unit": "bag",
                "unitPrice": 10.5,
            }
        ],
        "delivery": {
            "address": "Douala",
            "gps": {"lat": 4.0511, "lng": 9.7679},
            "notes": "integration",
        },
        "paymentMethod": "offline",
        "contactPhone": "+237690000000",
    }

    headers = {
        "Idempotency-Key": idempotency_key,
        "X-Request-Id": f"req-{uuid4().hex[:8]}",
    }

    first = client.post("/api/v1/orders", json=payload, headers=headers)
    assert first.status_code == 200
    first_body = first.json()
    first_order_id = first_body["data"]["orderId"]

    second = client.post("/api/v1/orders", json=payload, headers=headers)
    assert second.status_code == 200
    second_body = second.json()
    second_order_id = second_body["data"]["orderId"]

    assert first_order_id == second_order_id

    listing = client.get(f"/api/v1/orders?storeId={store_id}")
    assert listing.status_code == 200
    listed_ids = [item["orderId"] for item in listing.json()["data"]["items"]]
    assert first_order_id in listed_ids

    detail = client.get(f"/api/v1/orders/{first_order_id}")
    assert detail.status_code == 200
    detail_body = detail.json()
    assert detail_body["data"]["storeId"] == store_id
    assert detail_body["data"]["orderId"] == first_order_id
