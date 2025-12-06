from app.core import ErrorCode, raise_http_error
from app.services import verify_token
from fastapi import Request


async def auth_middleware(request: Request, call_next):
    # Routes exclues de l'authentification (pas besoin de token valide)
    excluded_paths = {
        "/users/login",
        "/users/register",
        "/users/logout",
        "/users/forgot-password",
        "/users/verify-reset-code",
        "/users/reset-password",
    }

    # Vérifier si le chemin est exclu
    if any(path in request.url.path for path in excluded_paths):
        return await call_next(request)

    token = request.headers.get("Authorization")
    if token and token.startswith("Bearer "):
        token = token[7:]
        user = verify_token(token)
        if not user:
            raise_http_error(401, ErrorCode.INVALID_TOKEN.value, "Invalid token")
        request.state.user = user
    return await call_next(request)
