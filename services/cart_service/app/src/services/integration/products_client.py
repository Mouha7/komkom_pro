from __future__ import annotations

from typing import Any

try:
	from common_libs.utils import AsyncHttpClient
except ImportError:  # pragma: no cover
	from services.common_libs.utils import AsyncHttpClient


class ProductsClient:
	def __init__(
		self,
		base_url: str,
		timeout_seconds: float,
		max_retries: int,
		item_path_template: str = "/api/v1/products/{product_id}",
	) -> None:
		self._base_url = base_url.rstrip("/")
		self._item_path_template = item_path_template
		self._http = AsyncHttpClient(timeout_seconds=timeout_seconds, max_retries=max_retries)

	async def close(self) -> None:
		await self._http.close()

	async def get_product_snapshot(self, product_id: str) -> dict[str, Any]:
		path = self._item_path_template.format(product_id=product_id)
		response = await self._http.get(f"{self._base_url}{path}")
		payload = response.json()
		if isinstance(payload, dict) and isinstance(payload.get("data"), dict):
			return payload["data"]
		return payload

