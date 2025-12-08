import typing as t
import httpx

from app.core.config import settings


class CustomServiceError(Exception):
    pass


class AuthValidationError(CustomServiceError):
    pass


class CustomServiceClient:
    """
    Client HTTP asynchrone pour appeler les endpoints d'auth/user de custom_service.

    - Si settings.CUSTOM_SERVICE_INTERNAL_TOKEN est défini, le client l'enverra automatiquement
      dans le header X-Internal-Token pour les appels internes.
    """

    def __init__(self, base_url: str = "", timeout: int = 5):
        self.base_url = (base_url or str(settings.CUSTOM_SERVICE_URL)).rstrip("/")
        self.timeout = timeout
        self._client: t.Optional[httpx.AsyncClient] = None
        self._internal_token: t.Optional[str] = settings.CUSTOM_SERVICE_INTERNAL_TOKEN

        self._paths = {
            "validate": settings.CUSTOM_SERVICE_AUTH_VALIDATE_PATH,
            "userinfo": settings.CUSTOM_SERVICE_USERINFO_PATH,
        }

    async def open(self) -> None:
        if self._client is None:
            self._client = httpx.AsyncClient(base_url=self.base_url, timeout=self.timeout)

    async def close(self) -> None:
        if self._client:
            await self._client.aclose()
            self._client = None

    async def _request(self, method: str, path: str, headers: dict | None = None, **kwargs) -> t.Any:
        if self._client is None:
            await self.open()
        assert self._client is not None

        hdrs = headers.copy() if headers else {}
        # Si on a un token interne configuré, l'ajouter automatiquement
        if self._internal_token:
            hdrs.setdefault("X-Internal-Token", self._internal_token)

        try:
            resp = await self._client.request(method, path, headers=hdrs, **kwargs)
        except httpx.RequestError as e:
            raise CustomServiceError(f"Network error contacting custom_service: {e}") from e

        if resp.status_code in (401, 403):
            raise AuthValidationError(f"Auth invalid ({resp.status_code})")
        if resp.status_code >= 400:
            raise CustomServiceError(f"custom_service returned {resp.status_code}: {resp.text}")

        try:
            return resp.json()
        except Exception:
            return resp.text

    # validate_token : si appel interne, envoie le token dans le body (JSON) + X-Internal-Token
    async def validate_token(self, token: str) -> t.Optional[dict]:
        path = self._paths["validate"]
        # Si internal token configuré, on passe token dans le body ; sinon on envoie Authorization header
        if self._internal_token:
            res = await self._request("POST", path, json={"token": token})
            return res
        else:
            headers = {"Authorization": f"Bearer {token}"}
            try:
                res = await self._request("POST", path, headers=headers)
                return res
            except AuthValidationError:
                return None
            except CustomServiceError:
                raise

    # get_userinfo : si internal token configuré, on peut appeler ?email=... ; sinon on appelle avec Authorization bearer
    async def get_userinfo(self, token: str | None = None, email: str | None = None) -> t.Optional[dict]:
        path = self._paths["userinfo"]
        if self._internal_token:
            if not email:
                raise ValueError("email must be provided for internal userinfo call")
            # GET /userinfo?email=<email>, internal header automatically added in _request
            res = await self._request("GET", path, params={"email": email})
            return res
        else:
            if not token:
                raise ValueError("token must be provided for external userinfo call")
            headers = {"Authorization": f"Bearer {token}"}
            try:
                res = await self._request("GET", path, headers=headers)
                return res
            except AuthValidationError:
                return None
            except CustomServiceError:
                raise
