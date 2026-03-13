from __future__ import annotations

from typing import Any

try:
	from common_libs.utils import AsyncHttpClient
except ImportError:  # pragma: no cover
	from services.common_libs.utils import AsyncHttpClient


class OrdersClient:
	def __init__(
		self,
		base_url: str,
		timeout_seconds: float,
		max_retries: int,
		create_order_path: str = "/api/v1/orders",
	) -> None:
		self._base_url = base_url.rstrip("/")
		self._create_order_path = create_order_path
		self._http = AsyncHttpClient(timeout_seconds=timeout_seconds, max_retries=max_retries)

	async def close(self) -> None:
		await self._http.close()

	async def create_order(
		self,
		checkout_payload: dict[str, Any],
		idempotency_key: str,
		request_id: str | None,
	) -> dict[str, Any]:
		headers = {"Idempotency-Key": idempotency_key}
		if request_id:
			headers["X-Request-Id"] = request_id
		response = await self._http.post(
			f"{self._base_url}{self._create_order_path}",
			json=checkout_payload,
			headers=headers,
		)
		return response.json()

