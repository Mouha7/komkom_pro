from __future__ import annotations

from redis.asyncio import Redis


RELEASE_SCRIPT = """
if redis.call('get', KEYS[1]) == ARGV[1] then
	return redis.call('del', KEYS[1])
else
	return 0
end
"""

RENEW_SCRIPT = """
if redis.call('get', KEYS[1]) == ARGV[1] then
	return redis.call('expire', KEYS[1], ARGV[2])
else
	return 0
end
"""


class LockAcquisitionError(Exception):
	"""Raised when a lock cannot be acquired."""


class RedisLock:
	def __init__(self, redis_client: Redis) -> None:
		self._redis = redis_client

	async def acquire(self, lock_key: str, token: str, ttl_seconds: int) -> bool:
		acquired = await self._redis.set(lock_key, token, ex=ttl_seconds, nx=True)
		return bool(acquired)

	async def release(self, lock_key: str, token: str) -> bool:
		result = await self._redis.eval(RELEASE_SCRIPT, 1, lock_key, token)
		return bool(result)

	async def renew(self, lock_key: str, token: str, ttl_seconds: int) -> bool:
		result = await self._redis.eval(RENEW_SCRIPT, 1, lock_key, token, ttl_seconds)
		return bool(result)

