from fastapi import HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import ValidationError


# Handler pour les HTTPException (erreurs HTTP personnalisées)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": "HTTP Exception", "detail": exc.detail},
    )


# Handler pour les erreurs de validation de requête (Pydantic)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "error": "Validation Error",
            "detail": exc.errors(),  # Liste des erreurs détaillées
        },
    )


# Handler pour les erreurs de validation Pydantic générales
async def pydantic_validation_handler(request: Request, exc: ValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "error": "Pydantic Validation Error",
            "detail": exc.errors(),
        },
    )


# Handler pour les erreurs générales non gérées (500 Internal Server Error)
async def general_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "detail": "An unexpected error occurred. Please try again later.",
        },
    )
