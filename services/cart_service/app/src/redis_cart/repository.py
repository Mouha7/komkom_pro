from __future__ import annotations

from datetime import datetime, timezone
from typing import Callable

from redis.asyncio import Redis
from redis.exceptions import WatchError

from src.schemas import CartDTO, CartItemDTO, Unit
from src.redis_cart.serializer import CartSerializer


class CartRepository:
	def __init__(self, redis_client: Redis, ttl_seconds: int) -> None:
		self._redis = redis_client
		self._ttl_seconds = ttl_seconds

	async def get_cart(self, cart_key: str) -> CartDTO | None:
		payload = await self._redis.get(cart_key)
		return CartSerializer.deserialize(payload)

	async def save_cart(self, cart_key: str, cart: CartDTO) -> None:
		cart.updated_at = datetime.now(timezone.utc)
		await self._redis.set(cart_key, CartSerializer.serialize(cart), ex=self._ttl_seconds)

	async def clear_cart(self, cart_key: str) -> None:
		await self._redis.delete(cart_key)

	async def merge_carts(self, source_key: str, target_key: str) -> CartDTO | None:
		source = await self.get_cart(source_key)
		if not source:
			return await self.get_cart(target_key)

		target = await self.get_cart(target_key)
		if not target:
			await self.save_cart(target_key, source)
			await self.clear_cart(source_key)
			return source

		for source_item in source.items:
			matched = False
			for target_item in target.items:
				if target_item.product_id == source_item.product_id and target_item.unit == source_item.unit:
					target_item.quantity += source_item.quantity
					target_item.line_total = target_item.quantity * target_item.price_snapshot
					matched = True
					break
			if not matched:
				target.items.append(source_item)

		target.subtotal = sum(item.line_total for item in target.items)
		await self.save_cart(target_key, target)
		await self.clear_cart(source_key)
		return target

	async def add_or_update_item(
		self,
		cart_key: str,
		*,
		cart_factory: Callable[[], CartDTO],
		product_id: str,
		quantity: int,
		unit: Unit,
		price_snapshot: float,
	) -> CartDTO:
		def _update(existing_cart: CartDTO) -> CartDTO:
			for item in existing_cart.items:
				if item.product_id == product_id and item.unit == unit:
					item.quantity += quantity
					item.price_snapshot = price_snapshot
					item.line_total = item.quantity * item.price_snapshot
					break
			else:
				existing_cart.items.append(
					CartItemDTO(
						product_id=product_id,
						quantity=quantity,
						unit=unit,
						price_snapshot=price_snapshot,
						line_total=quantity * price_snapshot,
					)
				)
			existing_cart.subtotal = sum(item.line_total for item in existing_cart.items)
			return existing_cart

		return await self._transactional_cart_update(cart_key, cart_factory, _update)

	async def update_item(
		self,
		cart_key: str,
		*,
		cart_factory: Callable[[], CartDTO],
		product_id: str,
		quantity: int,
		unit: Unit | None,
	) -> CartDTO:
		def _update(existing_cart: CartDTO) -> CartDTO:
			for item in existing_cart.items:
				if item.product_id == product_id:
					item.quantity = quantity
					if unit is not None:
						item.unit = unit
					item.line_total = item.quantity * item.price_snapshot
					break
			existing_cart.subtotal = sum(item.line_total for item in existing_cart.items)
			return existing_cart

		return await self._transactional_cart_update(cart_key, cart_factory, _update)

	async def remove_item(
		self,
		cart_key: str,
		*,
		cart_factory: Callable[[], CartDTO],
		product_id: str,
	) -> CartDTO:
		def _update(existing_cart: CartDTO) -> CartDTO:
			existing_cart.items = [item for item in existing_cart.items if item.product_id != product_id]
			existing_cart.subtotal = sum(item.line_total for item in existing_cart.items)
			return existing_cart

		return await self._transactional_cart_update(cart_key, cart_factory, _update)

	async def _transactional_cart_update(
		self,
		cart_key: str,
		cart_factory: Callable[[], CartDTO],
		updater: Callable[[CartDTO], "CartDTO"],
		max_retries: int = 3,
	) -> CartDTO:
		for _ in range(max_retries):
			async with self._redis.pipeline(transaction=True) as pipe:
				try:
					await pipe.watch(cart_key)
					payload = await self._redis.get(cart_key)
					cart = CartSerializer.deserialize(payload) or cart_factory()
					updated_cart = updater(cart)
					updated_cart.updated_at = datetime.now(timezone.utc)
					pipe.multi()
					pipe.set(cart_key, CartSerializer.serialize(updated_cart), ex=self._ttl_seconds)
					await pipe.execute()
					return updated_cart
				except WatchError:
					continue
				finally:
					await pipe.reset()
		raise RuntimeError("Failed to update cart due to concurrent changes")

