from __future__ import annotations

from fastapi import FastAPI

from src.api.middleware.auth_middleware import AuthMiddleware
from src.api.v1.routes import admin_router, health_router, orders_router
from src.config import get_settings
from src.db import init_db
from src.events import EventPublisher
from src.events.consumers.inventory_consumer import InventoryConsumer
from src.logging_config import setup_logging
from src.schemas import DataResponse
from src.services import PricingValidator


settings = get_settings()
setup_logging(settings.log_level)

app = FastAPI(
    title="Orders Service",
    description="Microservice for managing orders",
    version="1.0.0",
)
app.add_middleware(AuthMiddleware, settings=settings)


@app.on_event("startup")
async def on_startup() -> None:
    init_db()
    app.state.settings = settings
    app.state.pricing_validator = PricingValidator(
        products_service_url=settings.products_service_url,
        timeout_seconds=settings.http_timeout_seconds,
        max_retries=settings.http_max_retries,
        item_path_template=settings.products_item_path_template,
    )
    app.state.event_publisher = EventPublisher(settings.rabbitmq_url)
    await app.state.event_publisher.connect()
    app.state.inventory_consumer = InventoryConsumer(
        rabbitmq_url=settings.rabbitmq_url,
        pricing_validator=app.state.pricing_validator,
        event_publisher=app.state.event_publisher,
    )
    await app.state.inventory_consumer.connect()


@app.on_event("shutdown")
async def on_shutdown() -> None:
    await app.state.inventory_consumer.close()
    await app.state.pricing_validator.close()
    await app.state.event_publisher.close()


@app.get("/")
async def root() -> DataResponse:
    return DataResponse(data={"message": "Orders Service", "version": "1.0.0"}, meta={})


@app.get("/health")
async def health_check() -> DataResponse:
    return DataResponse(data={"status": "healthy"}, meta={})


@app.get("/ready")
async def readiness_check() -> DataResponse:
    return DataResponse(data={"status": "ready"}, meta={})


app.include_router(health_router)
app.include_router(orders_router)
app.include_router(admin_router)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
