from __future__ import annotations

from fastapi import FastAPI
from httpx import ASGITransport, AsyncClient
import pytest

from src.api.v1 import dependencies
from src.api.v1.routes.checkout import router as checkout_router


class FakeLockManager:
    async def acquire_for_checkout(self, cart_id: str):
        return {"lock_token": "lock-1", "expires_at": "2026-01-01T00:00:00Z"}

    async def renew(self, cart_id: str, lock_token: str) -> bool:
        return True

    async def release(self, cart_id: str, lock_token: str) -> bool:
        return True


class FakeCartService:
    async def get_or_create_cart(self, *args, **kwargs):
        class _Cart:
            items = []
        return _Cart()

    async def clear_cart(self, cart_key: str) -> None:
        return None


class FakePricingService:
    async def validate_checkout(self, cart):
        class _Validation:
            valid = True
            issues = []
        return _Validation()


class FakeOrdersClient:
    async def create_order(self, checkout_payload, idempotency_key, request_id):
        return {"order_id": "ord-123", "status": "created"}


class FakeIdempotencyManager:
    def __init__(self, cached=None) -> None:
        self._cached = cached
        self.stored = None

    async def get_cached_response(self, key: str):
        return self._cached

    async def store_response(self, key: str, payload):
        self.stored = (key, payload)


@pytest.mark.asyncio
async def test_checkout_returns_cached_response_when_idempotency_key_exists() -> None:
    app = FastAPI()
    app.include_router(checkout_router)

    app.dependency_overrides[dependencies.require_user] = lambda: {"sub": "u-1"}
    app.dependency_overrides[dependencies.get_request_id] = lambda: "req-1"
    app.dependency_overrides[dependencies.get_lock_manager] = lambda: FakeLockManager()
    app.dependency_overrides[dependencies.get_cart_service] = lambda: FakeCartService()
    app.dependency_overrides[dependencies.get_pricing_service] = lambda: FakePricingService()
    app.dependency_overrides[dependencies.get_orders_client] = lambda: FakeOrdersClient()
    app.dependency_overrides[dependencies.get_idempotency_manager] = lambda: FakeIdempotencyManager(
        cached={"order_id": "ord-cached", "status": "created", "idempotency_key": "idem-1"}
    )

    payload = {
        "cart_id": "cart-1",
        "store_id": "store-1",
        "delivery": {"address": "Address", "gps": {"lat": 1.0, "lng": 2.0}},
        "payment_method": "offline",
        "contact_phone": "+000",
    }

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/api/v1/cart/checkout",
            json=payload,
            headers={"Idempotency-Key": "idem-1", "X-Lock-Token": "lock-1"},
        )

    assert response.status_code == 200
    body = response.json()
    assert body["order_id"] == "ord-cached"
    assert body["idempotency_key"] == "idem-1"


@pytest.mark.asyncio
async def test_checkout_stores_response_when_first_execution() -> None:
    app = FastAPI()
    app.include_router(checkout_router)

    idempotency = FakeIdempotencyManager(cached=None)

    app.dependency_overrides[dependencies.require_user] = lambda: {"sub": "u-2"}
    app.dependency_overrides[dependencies.get_request_id] = lambda: "req-2"
    app.dependency_overrides[dependencies.get_lock_manager] = lambda: FakeLockManager()
    app.dependency_overrides[dependencies.get_cart_service] = lambda: FakeCartService()
    app.dependency_overrides[dependencies.get_pricing_service] = lambda: FakePricingService()
    app.dependency_overrides[dependencies.get_orders_client] = lambda: FakeOrdersClient()
    app.dependency_overrides[dependencies.get_idempotency_manager] = lambda: idempotency

    payload = {
        "cart_id": "cart-2",
        "store_id": "store-1",
        "delivery": {"address": "Address", "gps": {"lat": 1.0, "lng": 2.0}},
        "payment_method": "offline",
        "contact_phone": "+111",
    }

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/api/v1/cart/checkout",
            json=payload,
            headers={"Idempotency-Key": "idem-2", "X-Lock-Token": "lock-2"},
        )

    assert response.status_code == 200
    assert idempotency.stored is not None
    assert idempotency.stored[0] == "idem-2"
