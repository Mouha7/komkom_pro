from __future__ import annotations

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

from src.config import Settings

try:
	from common_libs.auth import TokenValidationError, get_current_user_from_authorization
	from common_libs.utils import set_request_context
except ImportError:  # pragma: no cover
	from services.common_libs.auth import TokenValidationError, get_current_user_from_authorization
	from services.common_libs.utils import set_request_context


class AuthMiddleware(BaseHTTPMiddleware):
	def __init__(self, app, settings: Settings):
		super().__init__(app)
		self._settings = settings

	async def dispatch(self, request: Request, call_next):
		request_id = request.headers.get("X-Request-Id", "-")
		correlation_id = request.headers.get("X-Correlation-Id", request_id)
		set_request_context(request_id=request_id, correlation_id=correlation_id)

		authorization = request.headers.get("Authorization")
		request.state.current_user = None

		if authorization:
			try:
				request.state.current_user = await get_current_user_from_authorization(
					authorization_header=authorization,
					jwks_url=self._settings.keycloak_jwks_url,
					algorithms=self._settings.keycloak_algorithms,
					audience=self._settings.keycloak_audience,
					issuer=self._settings.keycloak_issuer,
				)
			except TokenValidationError:
				request.state.current_user = None

		response = await call_next(request)
		return response
