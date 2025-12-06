# backward compatible shim
from app.services.password_service import (
    perform_password_reset,
    request_password_reset,
    verify_reset_code,
)

__all__ = ["request_password_reset", "verify_reset_code", "perform_password_reset"]
