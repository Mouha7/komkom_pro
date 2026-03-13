from __future__ import annotations

import json
from typing import Any

from redis.asyncio import Redis

from .cache_keys import idempotency_key


class IdempotencyManager:
	def __init__(self, redis_client: Redis, ttl_seconds: int = 3600) -> None:
		self._redis = redis_client
		self._ttl_seconds = ttl_seconds

	async def get_cached_response(self, key: str) -> dict[str, Any] | None:
		payload = await self._redis.get(idempotency_key(key))
		if not payload:
			return None
		if isinstance(payload, bytes):
			payload = payload.decode("utf-8")
		return json.loads(payload)

	async def store_response(self, key: str, response_payload: dict[str, Any]) -> None:
		await self._redis.set(
			idempotency_key(key),
			json.dumps(response_payload),
			ex=self._ttl_seconds,
		)

