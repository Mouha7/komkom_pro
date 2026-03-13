from __future__ import annotations

import asyncio
from datetime import datetime, timedelta, timezone
from uuid import uuid4

from src.locks.redis_lock import LockAcquisitionError, RedisLock
from src.schemas import LockResponse


class LockManager:
	def __init__(self, redis_lock: RedisLock, ttl_seconds: int) -> None:
		self._lock = redis_lock
		self._ttl_seconds = ttl_seconds

	async def acquire_for_checkout(self, cart_id: str, max_retries: int = 3) -> LockResponse:
		lock_key = f"cart_lock:{cart_id}"
		token = str(uuid4())

		for attempt in range(max_retries + 1):
			if await self._lock.acquire(lock_key, token, self._ttl_seconds):
				expires_at = datetime.now(timezone.utc) + timedelta(seconds=self._ttl_seconds)
				return LockResponse(lock_token=token, expires_at=expires_at)
			if attempt < max_retries:
				await asyncio.sleep(0.1 * (attempt + 1))

		raise LockAcquisitionError("Unable to acquire checkout lock")

	async def release(self, cart_id: str, lock_token: str) -> bool:
		lock_key = f"cart_lock:{cart_id}"
		return await self._lock.release(lock_key, lock_token)

	async def renew(self, cart_id: str, lock_token: str) -> bool:
		lock_key = f"cart_lock:{cart_id}"
		return await self._lock.renew(lock_key, lock_token, self._ttl_seconds)

