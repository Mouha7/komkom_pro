from __future__ import annotations

from .roles import has_role


def has_scope(claims: dict, scope: str) -> bool:
	scope_value = claims.get("scope", "")
	if not isinstance(scope_value, str):
		return False
	return scope in set(scope_value.split())


def require_role(claims: dict, role: str) -> None:
	if not has_role(claims, role):
		raise PermissionError(f"Missing required role: {role}")


def require_scope(claims: dict, scope: str) -> None:
	if not has_scope(claims, scope):
		raise PermissionError(f"Missing required scope: {scope}")

