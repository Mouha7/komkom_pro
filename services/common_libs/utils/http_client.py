from __future__ import annotations

import asyncio
from typing import Any

import httpx


class HttpClientError(Exception):
	"""Raised when an HTTP call fails after retries."""


class AsyncHttpClient:
	def __init__(self, timeout_seconds: float = 3.0, max_retries: int = 2) -> None:
		self._timeout_seconds = timeout_seconds
		self._max_retries = max_retries
		self._client = httpx.AsyncClient(timeout=timeout_seconds)

	async def close(self) -> None:
		await self._client.aclose()

	async def request(
		self,
		method: str,
		url: str,
		*,
		headers: dict[str, str] | None = None,
		json: dict[str, Any] | None = None,
		params: dict[str, Any] | None = None,
	) -> httpx.Response:
		last_error: Exception | None = None
		for attempt in range(self._max_retries + 1):
			try:
				response = await self._client.request(
					method=method,
					url=url,
					headers=headers,
					json=json,
					params=params,
				)
				response.raise_for_status()
				return response
			except (httpx.HTTPError, httpx.TimeoutException) as exc:
				last_error = exc
				if attempt == self._max_retries:
					break
				await asyncio.sleep(0.2 * (attempt + 1))
		raise HttpClientError(f"HTTP call failed for {method} {url}") from last_error

	async def get(
		self,
		url: str,
		*,
		headers: dict[str, str] | None = None,
		params: dict[str, Any] | None = None,
	) -> httpx.Response:
		return await self.request("GET", url, headers=headers, params=params)

	async def post(
		self,
		url: str,
		*,
		headers: dict[str, str] | None = None,
		json: dict[str, Any] | None = None,
	) -> httpx.Response:
		return await self.request("POST", url, headers=headers, json=json)

	async def put(
		self,
		url: str,
		*,
		headers: dict[str, str] | None = None,
		json: dict[str, Any] | None = None,
	) -> httpx.Response:
		return await self.request("PUT", url, headers=headers, json=json)

	async def patch(
		self,
		url: str,
		*,
		headers: dict[str, str] | None = None,
		json: dict[str, Any] | None = None,
	) -> httpx.Response:
		return await self.request("PATCH", url, headers=headers, json=json)

