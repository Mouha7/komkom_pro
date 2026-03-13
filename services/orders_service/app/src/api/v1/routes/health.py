from __future__ import annotations

from fastapi import APIRouter, Request
from redis.asyncio import Redis
from sqlalchemy import text

from src.db.session import SessionLocal
from src.schemas import DataResponse


router = APIRouter(prefix="/api/v1/orders", tags=["orders-health"])


@router.get("/health", response_model=DataResponse)
async def health(request: Request) -> DataResponse:
	db_ok = False
	redis_ok = False
	rabbitmq_ok = bool(request.app.state.event_publisher is not None)

	db = SessionLocal()
	try:
		db.execute(text("SELECT 1"))
		db_ok = True
	finally:
		db.close()

	redis_client = Redis.from_url(request.app.state.settings.redis_url, decode_responses=True)
	try:
		await redis_client.ping()
		redis_ok = True
	finally:
		await redis_client.close()

	status_value = "ok" if db_ok and redis_ok else "degraded"
	return DataResponse(
		data={"status": status_value, "db": db_ok, "redis": redis_ok, "rabbitmqConfigured": rabbitmq_ok},
		meta={},
	)
