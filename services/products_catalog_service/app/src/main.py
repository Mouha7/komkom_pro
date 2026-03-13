from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from src.api.middleware.auth_middleware import AuthMiddleware
from src.api.v1.routes import categories_router, health_router, products_router
from src.cache import ProductCache, RedisClient
from src.config import get_settings
from src.db import init_db
from src.events import EventPublisher
from src.events.consumers import InventoryConsumer
from src.logging_config import setup_logging
from src.schemas import DataResponse
from src.services import ImageService, ProductService, SearchService


settings = get_settings()
setup_logging(settings.log_level)


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    app.state.redis_client = RedisClient(settings.redis_url)
    app.state.product_cache = ProductCache(app.state.redis_client, settings.redis_ttl_seconds)

    app.state.event_publisher = EventPublisher(settings.rabbitmq_url)
    await app.state.event_publisher.connect()

    app.state.inventory_consumer = InventoryConsumer(settings.rabbitmq_url)
    await app.state.inventory_consumer.connect()

    app.state.image_service = ImageService(
        endpoint=settings.minio_endpoint,
        access_key=settings.minio_access_key,
        secret_key=settings.minio_secret_key,
        bucket_name=settings.minio_bucket_name,
        secure=settings.minio_secure,
        presign_expiry_seconds=settings.minio_presign_expiry_seconds,
    )
    try:
        app.state.image_service.ensure_bucket()
    except Exception:
        pass

    app.state.product_service = ProductService(app.state.product_cache, app.state.event_publisher)
    app.state.search_service = SearchService()

    try:
        yield
    finally:
        await app.state.inventory_consumer.close()
        await app.state.event_publisher.close()
        app.state.redis_client.close()


app = FastAPI(
    title="Products Catalog Service",
    description="Microservice for managing products",
    version="1.0.0",
    lifespan=lifespan,
)
app.add_middleware(AuthMiddleware, settings=settings)


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    detail = exc.detail if isinstance(exc.detail, dict) else {}
    code = str(detail.get("code") or f"HTTP_{exc.status_code}")
    message = str(detail.get("message") or "Request failed")
    error_details = detail.get("details") if isinstance(detail.get("details"), dict) else {}
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": {"code": code, "message": message, "details": error_details}},
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    return JSONResponse(
        status_code=422,
        content={
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Request validation failed",
                "details": {"issues": exc.errors()},
            }
        },
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": "INTERNAL_ERROR",
                "message": "Unexpected server error",
                "details": {},
            }
        },
    )


@app.get("/")
async def root() -> DataResponse:
    return DataResponse(data={"message": "Products Catalog Service", "version": "1.0.0"}, meta={})


@app.get("/health")
async def health_check() -> DataResponse:
    return DataResponse(data={"status": "healthy"}, meta={})


@app.get("/ready")
async def readiness_check() -> DataResponse:
    return DataResponse(data={"status": "ready"}, meta={})


app.include_router(products_router)
app.include_router(categories_router)
app.include_router(health_router)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
