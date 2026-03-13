from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import Any

import httpx
from jose import JWTError, jwt


class TokenValidationError(Exception):
	"""Raised when a JWT cannot be validated."""


@dataclass
class _JwksCache:
	keys: dict[str, dict[str, Any]]
	expires_at: datetime


_JWKS_CACHE: _JwksCache | None = None


async def _fetch_jwks(jwks_url: str, timeout_seconds: float = 3.0) -> dict[str, dict[str, Any]]:
	global _JWKS_CACHE

	now = datetime.now(timezone.utc)
	if _JWKS_CACHE and _JWKS_CACHE.expires_at > now:
		return _JWKS_CACHE.keys

	async with httpx.AsyncClient(timeout=timeout_seconds) as client:
		response = await client.get(jwks_url)
		response.raise_for_status()
		payload = response.json()

	keys = {
		key["kid"]: key
		for key in payload.get("keys", [])
		if isinstance(key, dict) and key.get("kid")
	}
	if not keys:
		raise TokenValidationError("No JWKS keys available")

	_JWKS_CACHE = _JwksCache(keys=keys, expires_at=now + timedelta(minutes=10))
	return keys


def _extract_bearer_token(authorization_header: str | None) -> str | None:
	if not authorization_header:
		return None
	parts = authorization_header.split(" ", 1)
	if len(parts) != 2:
		return None
	scheme, token = parts
	if scheme.lower() != "bearer" or not token:
		return None
	return token


async def validate_token(
	token: str,
	jwks_url: str,
	algorithms: list[str] | None = None,
	audience: str | None = None,
	issuer: str | None = None,
) -> dict[str, Any]:
	"""Validate a JWT against Keycloak JWKS and return decoded claims."""
	if not token:
		raise TokenValidationError("Missing token")

	algorithms = algorithms or ["RS256"]

	try:
		header = jwt.get_unverified_header(token)
		kid = header.get("kid")
		if not kid:
			raise TokenValidationError("Token header does not contain kid")

		jwks = await _fetch_jwks(jwks_url)
		key = jwks.get(kid)
		if not key:
			raise TokenValidationError("No matching JWKS key for kid")

		claims = jwt.decode(
			token,
			key,
			algorithms=algorithms,
			audience=audience,
			issuer=issuer,
			options={
				"verify_aud": audience is not None,
				"verify_iss": issuer is not None,
			},
		)
		return claims
	except JWTError as exc:
		raise TokenValidationError("Invalid token") from exc
	except httpx.HTTPError as exc:
		raise TokenValidationError("Unable to fetch JWKS") from exc


async def get_current_user_from_authorization(
	authorization_header: str | None,
	jwks_url: str,
	algorithms: list[str] | None = None,
	audience: str | None = None,
	issuer: str | None = None,
) -> dict[str, Any] | None:
	token = _extract_bearer_token(authorization_header)
	if not token:
		return None
	return await validate_token(
		token=token,
		jwks_url=jwks_url,
		algorithms=algorithms,
		audience=audience,
		issuer=issuer,
	)

