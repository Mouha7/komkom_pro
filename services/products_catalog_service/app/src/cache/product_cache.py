from __future__ import annotations

import hashlib
import json
from typing import Any

from src.cache.redis_client import RedisClient

try:
	from common_libs.utils import categories_key, product_key, product_list_key, product_sku_key
except ImportError:  # pragma: no cover
	try:
		from services.common_libs.utils import categories_key, product_key, product_list_key, product_sku_key
	except ImportError:  # pragma: no cover
		def product_key(product_id: str) -> str:
			return f"product:{product_id}"

		def product_sku_key(sku: str) -> str:
			return f"product:sku:{sku}"

		def product_list_key(filters_hash: str) -> str:
			return f"product:list:{filters_hash}"

		def categories_key() -> str:
			return "categories:all"


class ProductCache:
	def __init__(self, redis_client: RedisClient, ttl_seconds: int) -> None:
		self._redis = redis_client
		self._ttl = ttl_seconds

	@staticmethod
	def _filters_hash(filters: dict[str, Any]) -> str:
		payload = json.dumps(filters, sort_keys=True)
		return hashlib.sha256(payload.encode("utf-8")).hexdigest()

	def get_product(self, product_id: str) -> dict[str, Any] | None:
		return self._redis.get_json(product_key(product_id))

	def set_product(self, product_id: str, payload: dict[str, Any]) -> None:
		self._redis.set_json(product_key(product_id), payload, self._ttl)

	def get_product_by_sku(self, sku: str) -> dict[str, Any] | None:
		return self._redis.get_json(product_sku_key(sku))

	def set_product_by_sku(self, sku: str, payload: dict[str, Any]) -> None:
		self._redis.set_json(product_sku_key(sku), payload, self._ttl)

	def get_list(self, filters: dict[str, Any]) -> dict[str, Any] | None:
		return self._redis.get_json(product_list_key(self._filters_hash(filters)))

	def set_list(self, filters: dict[str, Any], payload: dict[str, Any]) -> None:
		self._redis.set_json(product_list_key(self._filters_hash(filters)), payload, self._ttl)

	def get_categories(self) -> dict[str, Any] | None:
		return self._redis.get_json(categories_key())

	def set_categories(self, payload: dict[str, Any]) -> None:
		self._redis.set_json(categories_key(), payload, self._ttl)

	def invalidate_product(self, product_id: str, sku: str | None = None) -> None:
		keys = [product_key(product_id)]
		if sku:
			keys.append(product_sku_key(sku))
		self._redis.delete(*keys)

	def invalidate_categories(self) -> None:
		self._redis.delete(categories_key())
