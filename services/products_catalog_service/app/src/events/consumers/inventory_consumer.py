from __future__ import annotations

import aio_pika


class InventoryConsumer:
	def __init__(self, rabbitmq_url: str | None) -> None:
		self._rabbitmq_url = rabbitmq_url
		self._connection: aio_pika.abc.AbstractRobustConnection | None = None
		self._channel: aio_pika.abc.AbstractRobustChannel | None = None
		self._queue: aio_pika.abc.AbstractQueue | None = None
		self._consumer_tag: str | None = None

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
		exchange = await channel.declare_exchange(
			"exchange.inventory",
			aio_pika.ExchangeType.TOPIC,
			durable=True,
		)
		self._queue = await channel.declare_queue("products.inventory.events", durable=True)
		queue = self._queue
		if queue is None:
			return
		await queue.bind(exchange, routing_key="inventory.#")
		self._consumer_tag = await queue.consume(self._handle_message)

	async def close(self) -> None:
		if self._queue and self._consumer_tag:
			await self._queue.cancel(self._consumer_tag)
		if self._connection:
			await self._connection.close()

	async def _handle_message(self, message: aio_pika.abc.AbstractIncomingMessage) -> None:
		async with message.process(requeue=False):
			return
