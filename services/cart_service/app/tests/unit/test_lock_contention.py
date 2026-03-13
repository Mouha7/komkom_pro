from __future__ import annotations

import pytest

from src.locks.lock_manager import LockManager
from src.locks.redis_lock import LockAcquisitionError


class FakeRedisLock:
    def __init__(self, acquire_results: list[bool]) -> None:
        self._acquire_results = acquire_results
        self.release_calls: list[tuple[str, str]] = []
        self.renew_calls: list[tuple[str, str, int]] = []

    async def acquire(self, lock_key: str, token: str, ttl_seconds: int) -> bool:
        if self._acquire_results:
            return self._acquire_results.pop(0)
        return False

    async def release(self, lock_key: str, token: str) -> bool:
        self.release_calls.append((lock_key, token))
        return True

    async def renew(self, lock_key: str, token: str, ttl_seconds: int) -> bool:
        self.renew_calls.append((lock_key, token, ttl_seconds))
        return True


@pytest.mark.asyncio
async def test_acquire_lock_success() -> None:
    lock = FakeRedisLock([True])
    manager = LockManager(lock, ttl_seconds=5)

    result = await manager.acquire_for_checkout("cart-1")

    assert result.lock_token
    assert result.expires_at


@pytest.mark.asyncio
async def test_acquire_lock_retries_then_success() -> None:
    lock = FakeRedisLock([False, False, True])
    manager = LockManager(lock, ttl_seconds=5)

    result = await manager.acquire_for_checkout("cart-2", max_retries=3)

    assert result.lock_token


@pytest.mark.asyncio
async def test_acquire_lock_raises_when_contention_persists() -> None:
    lock = FakeRedisLock([False, False, False, False])
    manager = LockManager(lock, ttl_seconds=5)

    with pytest.raises(LockAcquisitionError):
        await manager.acquire_for_checkout("cart-3", max_retries=3)
