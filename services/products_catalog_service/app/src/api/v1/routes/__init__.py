from .categories import router as categories_router
from .health import router as health_router
from .products import router as products_router

__all__ = ["products_router", "categories_router", "health_router"]
