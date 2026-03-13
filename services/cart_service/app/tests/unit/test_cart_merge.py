from __future__ import annotations

from datetime import datetime, timezone

import pytest
from fakeredis.aioredis import FakeRedis

from src.redis_cart.repository import CartRepository
from src.schemas import CartDTO, CartItemDTO, Unit
from src.services.cart_service import CartService


@pytest.mark.asyncio
async def test_merge_combines_quantities_and_clears_source() -> None:
    redis_client = FakeRedis(decode_responses=True)
    repository = CartRepository(redis_client, ttl_seconds=3600)
    service = CartService(repository)

    source_key = "cart:session:s1"
    target_key = "cart:store:u1"

    source = CartDTO(
        cart_id="c-source",
        store_id="store-1",
        session_id="s1",
        items=[
            CartItemDTO(product_id="p1", quantity=2, unit=Unit.bag, price_snapshot=10, line_total=20),
            CartItemDTO(product_id="p2", quantity=1, unit=Unit.piece, price_snapshot=5, line_total=5),
        ],
        subtotal=25,
        updated_at=datetime.now(timezone.utc),
    )
    target = CartDTO(
        cart_id="c-target",
        store_id="store-1",
        user_id="u1",
        items=[CartItemDTO(product_id="p1", quantity=1, unit=Unit.bag, price_snapshot=10, line_total=10)],
        subtotal=10,
        updated_at=datetime.now(timezone.utc),
    )

    await repository.save_cart(source_key, source)
    await repository.save_cart(target_key, target)

    merged = await service.merge(source_key, target_key)

    assert merged is not None
    by_product = {item.product_id: item for item in merged.items}
    assert by_product["p1"].quantity == 3
    assert by_product["p2"].quantity == 1
    assert merged.subtotal == 35
    assert await repository.get_cart(source_key) is None


@pytest.mark.asyncio
async def test_merge_is_idempotent_after_source_cleared() -> None:
    redis_client = FakeRedis(decode_responses=True)
    repository = CartRepository(redis_client, ttl_seconds=3600)
    service = CartService(repository)

    source_key = "cart:session:s2"
    target_key = "cart:store:u2"

    target = CartDTO(
        cart_id="c-target-2",
        store_id="store-1",
        user_id="u2",
        items=[],
        subtotal=0,
        updated_at=datetime.now(timezone.utc),
    )
    await repository.save_cart(target_key, target)

    first = await service.merge(source_key, target_key)
    second = await service.merge(source_key, target_key)

    assert first is not None
    assert second is not None
    assert first.model_dump(mode="json") == second.model_dump(mode="json")
