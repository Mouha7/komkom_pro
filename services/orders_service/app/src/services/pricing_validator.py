from __future__ import annotations

from src.schemas.item import OrderItemCreate

try:
	from common_libs.utils import AsyncHttpClient, HttpClientError
except ImportError:  # pragma: no cover
	from services.common_libs.utils import AsyncHttpClient, HttpClientError


class PricingValidator:
	def __init__(
		self,
		products_service_url: str,
		timeout_seconds: float = 3.0,
		max_retries: int = 2,
		item_path_template: str = "/api/v1/products/{product_id}",
	) -> None:
		self._products_service_url = products_service_url.rstrip("/")
		self._item_path_template = item_path_template
		self._http_client = AsyncHttpClient(timeout_seconds=timeout_seconds, max_retries=max_retries)

	async def close(self) -> None:
		await self._http_client.close()

	async def validate_and_enrich_items(self, items: list[OrderItemCreate]) -> list[dict]:
		enriched: list[dict] = []
		for item in items:
			price = float(item.unit_price)
			url = f"{self._products_service_url}{self._item_path_template.format(product_id=item.product_id)}"
			try:
				response = await self._http_client.get(url)
				payload = response.json()
				candidate_price = payload.get("price") or payload.get("data", {}).get("price")
				if candidate_price is not None:
					price = float(candidate_price)
			except (HttpClientError, ValueError, TypeError, AttributeError):
				# If products service is unavailable, fallback to cart snapshot price.
				price = float(item.unit_price)

			enriched.append(
				{
					"product_id": item.product_id,
					"quantity": float(item.quantity),
					"unit": item.unit,
					"unit_price": price,
					"line_total": round(float(item.quantity) * price, 2),
				}
			)
		return enriched
