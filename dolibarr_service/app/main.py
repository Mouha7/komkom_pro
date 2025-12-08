from app.core import (
    general_exception_handler,
    settings,
)
from fastapi import FastAPI

from .routers import general_router, product_router

PREFIX_API = settings.PREFIX_API

app = FastAPI(
    title="Backend App",
    openapi_url=f"{PREFIX_API}/openapi.json",
    docs_url=f"{PREFIX_API}/docs",
    redoc_url=None,
)


# Ajouter les handlers d'erreurs globaux
# app.add_exception_handler(HTTPException, http_exception_handler) # Erreur
# app.add_exception_handler(RequestValidationError, validation_exception_handler) # Erreur
# app.add_exception_handler(ValidationError, pydantic_validation_handler) # Erreur
app.add_exception_handler(Exception, general_exception_handler)

app.include_router(general_router, prefix=PREFIX_API, tags=["General"])
app.include_router(product_router, prefix=f"{PREFIX_API}/product", tags=["Products"])
