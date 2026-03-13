from __future__ import annotations

from fastapi import FastAPI

from src.api.middleware.auth_middleware import AuthMiddleware
from src.api.v1.routes import cart_router, checkout_router, health_router
from src.config import get_settings
from src.events.publisher import EventPublisher
from src.locks import LockManager, RedisLock
from src.logging_config import setup_logging
from src.redis_cart import CartRepository, RedisCartClient
from src.services.cart_service import CartService
from src.services.integration.orders_client import OrdersClient
from src.services.integration.products_client import ProductsClient
from src.services.pricing_service import PricingService

try:
    from common_libs.utils import IdempotencyManager
except ImportError:  # pragma: no cover
    from services.common_libs.utils import IdempotencyManager


settings = get_settings()
setup_logging(settings.log_level)

app = FastAPI(
    title="Cart Service",
    description="Microservice for managing shopping carts",
    version="1.0.0",
)

app.add_middleware(AuthMiddleware, settings=settings)


@app.on_event("startup")
async def on_startup() -> None:
    redis_client = RedisCartClient(settings.redis_url)
    repository = CartRepository(redis_client.raw, ttl_seconds=settings.cart_ttl_seconds)

    app.state.redis_client = redis_client
    app.state.cart_service = CartService(repository)
    app.state.products_client = ProductsClient(
        settings.products_service_url,
        timeout_seconds=settings.http_timeout_seconds,
        max_retries=settings.http_max_retries,
        item_path_template=settings.products_item_path_template,
    )
    app.state.orders_client = OrdersClient(
        settings.orders_service_url,
        timeout_seconds=settings.http_timeout_seconds,
        max_retries=settings.http_max_retries,
        create_order_path=settings.orders_create_path,
    )
    app.state.pricing_service = PricingService(app.state.products_client)
    app.state.lock_manager = LockManager(
        RedisLock(redis_client.raw),
        ttl_seconds=settings.lock_ttl_seconds,
    )
    app.state.idempotency_manager = IdempotencyManager(
        redis_client.raw,
        ttl_seconds=settings.idempotency_ttl_seconds,
    )
    app.state.event_publisher = EventPublisher(settings.rabbitmq_url)
    await app.state.event_publisher.connect()


@app.on_event("shutdown")
async def on_shutdown() -> None:
    await app.state.products_client.close()
    await app.state.orders_client.close()
    await app.state.event_publisher.close()
    await app.state.redis_client.close()


@app.get("/")
async def root():
    return {"message": "Cart Service", "version": "1.0.0"}


app.include_router(cart_router)
app.include_router(checkout_router)
app.include_router(health_router)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
