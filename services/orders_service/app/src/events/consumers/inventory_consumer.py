from __future__ import annotations

import json

import aio_pika
from pydantic import ValidationError

from src.db.session import SessionLocal
from src.schemas import OrderStatusUpdateRequest
from src.services import DeliveryService, OrderService, PricingValidator, SagaManager

try:
	from common_libs.dto import InventoryReserveResponseDTO
except ImportError:  # pragma: no cover
	from services.common_libs.dto import InventoryReserveResponseDTO


class InventoryConsumer:
	def __init__(
		self,
		rabbitmq_url: str | None,
		pricing_validator: PricingValidator,
		event_publisher,
	) -> None:
		self._rabbitmq_url = rabbitmq_url
		self._pricing_validator = pricing_validator
		self._event_publisher = event_publisher
		self._connection: aio_pika.abc.AbstractRobustConnection | None = None
		self._channel: aio_pika.abc.AbstractRobustChannel | None = None
		self._queue: aio_pika.abc.AbstractQueue | None = None
		self._consumer_tag: str | None = None

	async def connect(self) -> None:
		if not self._rabbitmq_url:
			return
		self._connection = await aio_pika.connect_robust(self._rabbitmq_url)
		self._channel = await self._connection.channel()
		exchange = await self._channel.declare_exchange(
			"exchange.inventory",
			aio_pika.ExchangeType.TOPIC,
			durable=True,
		)
		self._queue = await self._channel.declare_queue(
			"orders.inventory.reserve.response",
			durable=True,
		)
		await self._queue.bind(exchange, routing_key="inventory.reserve.response")
		self._consumer_tag = await self._queue.consume(self._handle_message)

	async def close(self) -> None:
		if self._queue and self._consumer_tag:
			await self._queue.cancel(self._consumer_tag)
		if self._connection:
			await self._connection.close()

	async def _handle_message(self, message: aio_pika.abc.AbstractIncomingMessage) -> None:
		async with message.process(requeue=False):
			payload = json.loads(message.body.decode("utf-8")) if message.body else {}
			correlation_id = str(payload.get("correlationId") or message.correlation_id or "-")
			await self.handle_inventory_response(payload, correlation_id)

	async def handle_inventory_response(self, payload: dict, correlation_id: str) -> None:
		try:
			message = InventoryReserveResponseDTO.model_validate(payload)
		except ValidationError:
			return

		order_id = str(message.order_id or "")
		status = str(message.status or "failed").lower()
		if not order_id:
			return

		db = SessionLocal()
		order_service = OrderService(
			db=db,
			pricing_validator=self._pricing_validator,
			saga_manager=SagaManager(self._event_publisher),
			delivery_service=DeliveryService(),
		)

		if status == "reserved":
			update = OrderStatusUpdateRequest(newStatus="Confirmed", note="Inventory reserved")
		else:
			reason = str(message.reason or "Inventory reservation failed")
			update = OrderStatusUpdateRequest(newStatus="Cancelled", note=reason)

		try:
			await order_service.update_status(order_id, update, correlation_id)
		finally:
			db.close()
