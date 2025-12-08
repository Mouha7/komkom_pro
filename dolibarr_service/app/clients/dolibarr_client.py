import typing as t

import httpx
from app.core import settings

ApiResult = t.Dict[str, t.Any]


class DolibarrError(Exception):
    pass


class DolibarrClient:
    """
    Client minimal pour Dolibarr REST API.
    - gère headers d'authentification via clé API
    - exposures: request(), get(), post(), put(), delete()
    Ajuste le nom de l'en-tête si ta version de Dolibarr l'attend différemment.
    """

    def __init__(self, base_url: str = "", api_key: str = "", timeout: int = 10):
        self.base_url = base_url or str(settings.DOLI_API_URL).rstrip("/")
        self.api_key = api_key or settings.DOLI_API_KEY
        self.timeout = timeout
        self._client: t.Optional[httpx.AsyncClient] = None
        # header name commonly used: "DOLAPIKEY" ; si ta instance attend autre chose, change ici
        self._api_key_header = "DOLAPIKEY"

    async def open(self):
        if self._client is None:
            self._client = httpx.AsyncClient(
                base_url=self.base_url, timeout=self.timeout
            )

    async def close(self):
        if self._client:
            await self._client.aclose()
            self._client = None

    async def request(self, method: str, path: str, **kwargs) -> ApiResult:
        if self._client is None:
            await self.open()
        headers = kwargs.pop("headers", {})
        headers.update({self._api_key_header: self.api_key})
        assert self._client is not None
        try:
            resp = await self._client.request(method, path, headers=headers, **kwargs)
        except httpx.HTTPError as e:
            raise DolibarrError(f"HTTP error contacting Dolibarr: {e}") from e

        if resp.status_code >= 400:
            # Propager une erreur riche
            detail = None
            try:
                detail = resp.json()
            except Exception:
                detail = resp.text
            raise DolibarrError(f"Dolibarr returned {resp.status_code}: {detail}")

        # On essaie de parser JSON sinon renvoyer raw text
        try:
            return resp.json()
        except ValueError:
            return {"raw": resp.text}

    # helpers
    async def get(self, path: str, params: t.Optional[dict] = None) -> ApiResult:
        return await self.request("GET", path, params=params)

    async def post(self, path: str, json: t.Optional[dict] = None) -> ApiResult:
        return await self.request("POST", path, json=json)

    async def put(self, path: str, json: t.Optional[dict] = None) -> ApiResult:
        return await self.request("PUT", path, json=json)

    async def delete(self, path: str) -> ApiResult:
        return await self.request("DELETE", path)

    # Exemples de wrappers ciblés (adaptés selon ton Dolibarr API)
    async def list_products(self, params: t.Optional[dict] = None) -> ApiResult:
        # endpoint typique: /products (ajuste suivant ta version)
        return await self.get("/products", params=params)

    async def get_product(self, product_id: t.Union[int, str]) -> ApiResult:
        return await self.get(f"/products/{product_id}")

    async def create_product(self, payload: dict) -> ApiResult:
        return await self.post("/products", json=payload)


# dependency factory: partager le client/service
async def get_client():
    client = DolibarrClient()
    await client.open()
    try:
        yield client
    finally:
        await client.close()
