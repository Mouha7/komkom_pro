from __future__ import annotations

import json
from typing import Any

import redis


class RedisClient:
	def __init__(self, redis_url: str) -> None:
		self._client = redis.Redis.from_url(redis_url, decode_responses=True)

	@property
	def raw(self) -> redis.Redis:
		return self._client

	def ping(self) -> bool:
		return bool(self._client.ping())

	def get_json(self, key: str) -> dict[str, Any] | None:
		raw = self._client.get(key)
		if not raw:
			return None
		return json.loads(raw)

	def set_json(self, key: str, value: dict[str, Any], ttl_seconds: int) -> None:
		self._client.set(key, json.dumps(value), ex=ttl_seconds)

	def delete(self, *keys: str) -> None:
		if keys:
			self._client.delete(*keys)

	def close(self) -> None:
		try:
			self._client.close()
		except Exception:
			pass
