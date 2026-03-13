from __future__ import annotations


def extract_roles(claims: dict) -> set[str]:
	realm_access = claims.get("realm_access", {})
	roles = realm_access.get("roles", []) if isinstance(realm_access, dict) else []
	return {str(role) for role in roles}


def has_role(claims: dict, role: str) -> bool:
	return role in extract_roles(claims)

