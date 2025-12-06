from enum import Enum


class ErrorCode(str, Enum):
    """
    Enum centralisé des codes d'erreur renvoyés dans le `detail` des HTTPException.
    Utiliser `ErrorCode.X.value` lors de la création des exceptions pour garder
    une source de vérité unique entre backend et frontend.
    """

    INVALID_CREDENTIALS = "invalid_credentials"
    USER_NOT_FOUND = "user_not_found"
    REGISTER_ERROR = "register_error"
    INVALID_REFRESH_TOKEN = "invalid_refresh_token"
    LOGOUT_FAILED = "logout_failed"
    DB_ERROR = "db_error"
    INVALID_RESET_CODE = "invalid_reset_code"
    RESET_FAILED = "reset_failed"
    EMAIL_TAKEN = "email_taken"
    VALIDATION_ERROR = "validation_error"
    RATE_LIMITED = "rate_limited"
    TOO_MANY_REQUESTS = "too_many_requests"
    ACCOUNT_LOCKED = "account_locked"
    REGISTERED = "registered"
    INVALID_TOKEN = "invalid_token"
    INTERNAL_ERROR = "internal_error"
    INVALID_ID_TOKEN = "invalid_id_token"
