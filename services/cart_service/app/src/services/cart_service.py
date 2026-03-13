from __future__ import annotations

from datetime import datetime, timezone

from src.redis_cart.repository import CartRepository
from src.schemas import CartDTO, Unit


class CartService:
	def __init__(self, repository: CartRepository) -> None:
		self._repository = repository

	async def get_or_create_cart(
		self,
		cart_key: str,
		*,
		cart_id: str,
		store_id: str,
		user_id: str | None,
		session_id: str | None,
	) -> CartDTO:
		cart = await self._repository.get_cart(cart_key)
		if cart:
			return cart
		cart = CartDTO(
			cart_id=cart_id,
			store_id=store_id,
			user_id=user_id,
			session_id=session_id,
			items=[],
			subtotal=0,
			delivery_estimate=0,
			updated_at=datetime.now(timezone.utc),
		)
		await self._repository.save_cart(cart_key, cart)
		return cart

	async def add_item(
		self,
		cart_key: str,
		*,
		cart_id: str,
		store_id: str,
		user_id: str | None,
		session_id: str | None,
		product_id: str,
		quantity: int,
		unit: Unit,
		price_snapshot: float,
	) -> CartDTO:
		return await self._repository.add_or_update_item(
			cart_key,
			cart_factory=lambda: CartDTO(
				cart_id=cart_id,
				store_id=store_id,
				user_id=user_id,
				session_id=session_id,
			),
			product_id=product_id,
			quantity=quantity,
			unit=unit,
			price_snapshot=price_snapshot,
		)

	async def update_item(
		self,
		cart_key: str,
		*,
		cart_id: str,
		store_id: str,
		user_id: str | None,
		session_id: str | None,
		product_id: str,
		quantity: int,
		unit: Unit | None,
	) -> CartDTO:
		return await self._repository.update_item(
			cart_key,
			cart_factory=lambda: CartDTO(
				cart_id=cart_id,
				store_id=store_id,
				user_id=user_id,
				session_id=session_id,
			),
			product_id=product_id,
			quantity=quantity,
			unit=unit,
		)

	async def remove_item(
		self,
		cart_key: str,
		*,
		cart_id: str,
		store_id: str,
		user_id: str | None,
		session_id: str | None,
		product_id: str,
	) -> CartDTO:
		return await self._repository.remove_item(
			cart_key,
			cart_factory=lambda: CartDTO(
				cart_id=cart_id,
				store_id=store_id,
				user_id=user_id,
				session_id=session_id,
			),
			product_id=product_id,
		)

	async def clear_cart(self, cart_key: str) -> None:
		await self._repository.clear_cart(cart_key)

	async def merge(self, source_key: str, target_key: str) -> CartDTO | None:
		return await self._repository.merge_carts(source_key, target_key)

	@staticmethod
	def preview_totals(cart: CartDTO) -> tuple[float, float, float]:
		subtotal = cart.subtotal
		delivery = cart.delivery_estimate
		total = subtotal + delivery
		return subtotal, delivery, total

