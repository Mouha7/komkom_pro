from __future__ import annotations

import json
from datetime import datetime, timezone

import aio_pika


class EventPublisher:
	def __init__(self, rabbitmq_url: str | None) -> None:
		self._rabbitmq_url = rabbitmq_url
		self._connection: aio_pika.abc.AbstractRobustConnection | None = None
		self._channel: aio_pika.abc.AbstractRobustChannel | None = None
		self._exchange: aio_pika.abc.AbstractExchange | None = None

	async def connect(self) -> None:
		if not self._rabbitmq_url:
			return
		self._connection = await aio_pika.connect_robust(self._rabbitmq_url)
		connection = self._connection
		if connection is None:
			return
		self._channel = await connection.channel()
		channel = self._channel
		if channel is None:
			return
		self._exchange = await channel.declare_exchange("exchange.events", aio_pika.ExchangeType.TOPIC, durable=True)

	async def close(self) -> None:
		if self._connection:
			await self._connection.close()

	async def publish_cart_updated(self, cart_id: str, request_id: str | None = None) -> None:
		if not self._exchange:
			return
		payload = {
			"cartId": cart_id,
			"event": "cart.updated",
			"requestId": request_id,
			"occurredAt": datetime.now(timezone.utc).isoformat(),
		}
		await self._exchange.publish(
			aio_pika.Message(body=json.dumps(payload).encode("utf-8"), content_type="application/json"),
			routing_key="cart.updated",
		)

