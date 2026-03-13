from __future__ import annotations

import asyncio

from src.events.consumers.inventory_consumer import InventoryConsumer


class _FakePricingValidator:
    pass


class _FakePublisher:
    pass


def test_inventory_consumer_ignores_invalid_payload() -> None:
    consumer = InventoryConsumer(
        rabbitmq_url=None,
        pricing_validator=_FakePricingValidator(),
        event_publisher=_FakePublisher(),
    )

    # Missing required processedAt field from DTO contract.
    asyncio.run(
        consumer.handle_inventory_response(
            {
                "orderId": "o-1",
                "status": "reserved",
                "details": [],
            },
            correlation_id="c-1",
        )
    )
