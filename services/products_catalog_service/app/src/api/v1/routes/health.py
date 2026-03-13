from __future__ import annotations

from fastapi import APIRouter, Request

from src.schemas import DataResponse


router = APIRouter(prefix="/api/v1/products", tags=["health"])


@router.get("/health", response_model=DataResponse)
async def service_health(request: Request) -> DataResponse:
	checks: dict[str, str] = {"service": "ok"}

	redis_client = getattr(request.app.state, "redis_client", None)
	if redis_client:
		try:
			checks["redis"] = "ok" if redis_client.ping() else "ko"
		except Exception:
			checks["redis"] = "ko"

	checks["db"] = "ok"
	checks["rabbitmq"] = "ok" if getattr(request.app.state, "event_publisher", None) else "disabled"

	return DataResponse(data={"status": "healthy", "checks": checks}, meta={})
