from __future__ import annotations

from src.schemas import CartDTO, CheckoutValidationResponse, ValidationIssue
from src.services.integration.products_client import ProductsClient


class PricingService:
	def __init__(self, products_client: ProductsClient) -> None:
		self._products_client = products_client

	@staticmethod
	def _extract_current_price(snapshot: dict, fallback: float) -> float:
		for field in ("price", "unit_price", "sale_price", "current_price"):
			value = snapshot.get(field)
			if value is not None:
				return float(value)
		return float(fallback)

	@staticmethod
	def _extract_available_quantity(snapshot: dict) -> int:
		for field in ("stock", "available_quantity", "quantity", "available"):
			value = snapshot.get(field)
			if value is not None:
				return int(value)
		status = snapshot.get("stock_status") or snapshot.get("availability")
		if isinstance(status, str) and status.lower() in {"unavailable", "out_of_stock"}:
			return 0
		return 0

	async def validate_checkout(self, cart: CartDTO) -> CheckoutValidationResponse:
		issues: list[ValidationIssue] = []

		for item in cart.items:
			snapshot = await self._products_client.get_product_snapshot(item.product_id)
			current_price = self._extract_current_price(snapshot, item.price_snapshot)
			available_quantity = self._extract_available_quantity(snapshot)

			if current_price != item.price_snapshot:
				issues.append(
					ValidationIssue(
						product_id=item.product_id,
						reason="price_changed",
						current_price=current_price,
					)
				)
			if item.quantity > available_quantity:
				issues.append(
					ValidationIssue(
						product_id=item.product_id,
						reason="insufficient_stock",
						requested_quantity=item.quantity,
						available_quantity=available_quantity,
					)
				)

		return CheckoutValidationResponse(valid=len(issues) == 0, issues=issues)

