from __future__ import annotations

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse


router = APIRouter(tags=["health"])


@router.get("/health")
async def health(request: Request):
	redis_ok = await request.app.state.redis_client.ping()
	status_code = 200 if redis_ok else 503
	payload = {
		"status": "healthy" if redis_ok else "unhealthy",
		"redis": "ok" if redis_ok else "failed",
	}
	return JSONResponse(status_code=status_code, content=payload)


@router.get("/ready")
async def ready(request: Request):
	redis_ok = await request.app.state.redis_client.ping()
	status_code = 200 if redis_ok else 503
	payload = {
		"status": "ready" if redis_ok else "not_ready",
		"redis": "ok" if redis_ok else "failed",
	}
	return JSONResponse(status_code=status_code, content=payload)

