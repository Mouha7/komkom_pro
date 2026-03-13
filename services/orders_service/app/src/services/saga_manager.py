from __future__ import annotations

from datetime import datetime, timezone


class SagaManager:
	def __init__(self, event_publisher) -> None:
		self._event_publisher = event_publisher

	async def publish_order_created(self, order_id: str, store_id: str, items: list[dict], correlation_id: str) -> None:
		await self._event_publisher.publish(
			routing_key="order.created",
			payload={
				"orderId": order_id,
				"storeId": store_id,
				"items": items,
				"correlationId": correlation_id,
				"createdAt": datetime.now(timezone.utc).isoformat(),
			},
		)

	async def publish_status_updated(self, order_id: str, status: str, note: str | None, correlation_id: str) -> None:
		await self._event_publisher.publish(
			routing_key="order.status.updated",
			payload={
				"orderId": order_id,
				"status": status,
				"note": note,
				"correlationId": correlation_id,
				"createdAt": datetime.now(timezone.utc).isoformat(),
			},
		)

	async def publish_order_cancelled(self, order_id: str, reason: str, correlation_id: str) -> None:
		await self._event_publisher.publish(
			routing_key="order.cancelled",
			payload={
				"orderId": order_id,
				"reason": reason,
				"correlationId": correlation_id,
				"createdAt": datetime.now(timezone.utc).isoformat(),
			},
		)
