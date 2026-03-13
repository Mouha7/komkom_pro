from __future__ import annotations

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from src.db.base import Base
from src.models import Order
from src.schemas import OrderCreateRequest, OrderStatusUpdateRequest
from src.services import order_service as order_service_module
from src.services import DeliveryService, OrderService


class FakePricingValidator:
    async def validate_and_enrich_items(self, items):
        return [
            {
                "product_id": item.product_id,
                "quantity": float(item.quantity),
                "unit": item.unit,
                "unit_price": float(item.unit_price),
                "line_total": round(float(item.quantity) * float(item.unit_price), 2),
            }
            for item in items
        ]


class FakeSagaManager:
    async def publish_order_created(self, order_id: str, store_id: str, items: list[dict], correlation_id: str) -> None:
        return None

    async def publish_status_updated(self, order_id: str, status: str, note: str | None, correlation_id: str) -> None:
        return None

    async def publish_order_cancelled(self, order_id: str, reason: str, correlation_id: str) -> None:
        return None


@pytest.fixture()
def service() -> OrderService:
    engine = create_engine("sqlite+pysqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    session = sessionmaker(bind=engine, autoflush=False, autocommit=False)()
    return OrderService(
        db=session,
        pricing_validator=FakePricingValidator(),
        saga_manager=FakeSagaManager(),
        delivery_service=DeliveryService(),
    )


@pytest.mark.asyncio
async def test_create_order_and_reuse_idempotency(service: OrderService) -> None:
    payload = OrderCreateRequest(
        storeId="store-1",
        items=[{"productId": "prod-1", "quantity": 2, "unit": "bag", "unitPrice": 15.0}],
        delivery={"address": "Douala", "gps": {"lat": 4.05, "lng": 9.7}, "notes": "Gate A"},
        paymentMethod="offline",
        contactPhone="+237600000000",
    )

    first = await service.create_order(payload, "idem-1", "user-1", "corr-1")
    second = await service.create_order(payload, "idem-1", "user-1", "corr-1")

    assert first.order_id == second.order_id
    assert first.total_amount == 30.0


@pytest.mark.asyncio
async def test_update_status_changes_order_state(service: OrderService) -> None:
    payload = OrderCreateRequest(
        storeId="store-2",
        items=[{"productId": "prod-2", "quantity": 1, "unit": "piece", "unitPrice": 9.0}],
        delivery={"address": "Yaounde"},
        paymentMethod="offline",
        contactPhone="+237611111111",
    )
    created = await service.create_order(payload, "idem-2", "user-2", "corr-2")

    updated = await service.update_status(
        created.order_id,
        OrderStatusUpdateRequest(newStatus="Confirmed", note="validated"),
        "corr-2",
    )

    assert updated.status.value == "Confirmed"
    order = service._db.get(Order, created.order_id)
    assert order is not None
    assert order.status == "Confirmed"


def test_build_presigned_invoice_url(service: OrderService, monkeypatch: pytest.MonkeyPatch) -> None:
    class _FakeSettings:
        minio_endpoint = "minio:9000"
        minio_access_key = "minio"
        minio_secret_key = "minio123"
        minio_secure = False
        minio_presign_expiry_seconds = 3600

    class _FakeMinio:
        def __init__(self, endpoint: str, access_key: str, secret_key: str, secure: bool) -> None:
            self.endpoint = endpoint

        def presigned_get_object(self, bucket_name: str, object_name: str, expires):
            return f"http://signed/{bucket_name}/{object_name}"

    monkeypatch.setattr(order_service_module, "get_settings", lambda: _FakeSettings())
    monkeypatch.setattr(order_service_module, "Minio", _FakeMinio)

    signed = service._build_presigned_invoice_url("/invoices/invoices/order-1.pdf")
    assert signed == "http://signed/invoices/invoices/order-1.pdf"


def test_build_presigned_invoice_url_passthrough_for_http(service: OrderService) -> None:
    url = "https://example.com/invoices/order-1.pdf"
    assert service._build_presigned_invoice_url(url) == url
