from __future__ import annotations

from redis.asyncio import Redis


class RedisCartClient:
	def __init__(self, redis_url: str) -> None:
		self._client = Redis.from_url(redis_url, decode_responses=True)

	@property
	def raw(self) -> Redis:
		return self._client

	async def ping(self) -> bool:
		result = await self._client.ping()
		return bool(result)

	async def close(self) -> None:
		await self._client.close()

