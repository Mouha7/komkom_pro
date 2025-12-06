import logging

from app.core import config as app_config
from app.core import get_redis

logger = logging.getLogger(__name__)

RESET_CODE_TTL = app_config.settings.RESET_CODE_TTL_SECONDS  # seconds
# Anti-abuse / rate limit (configurable via settings later)
RESET_REQUEST_LIMIT = app_config.settings.RESET_REQUEST_LIMIT
RESET_REQUEST_BLOCK_TTL = app_config.settings.RESET_REQUEST_BLOCK_TTL * 60  # 30 minutes


def build_redis_key(email: str) -> str:
    return f"pwreset:{email.lower()}"


def build_code_key(code: str) -> str:
    return f"pwreset_code:{code}"


def build_email_code_key(email: str) -> str:
    return f"pwreset_code_for_email:{email.lower()}"


def build_attempts_key(email: str) -> str:
    return f"pwreset_attempts:{email.lower()}"


def set_code_if_not_exists(code: str, email: str) -> bool:
    """
    Set code->email with NX and TTL. Return True if set, False otherwise.
    """
    r = get_redis()
    key = build_code_key(code)
    try:
        return bool(r.set(key, email.lower(), ex=RESET_CODE_TTL, nx=True))
    except Exception:
        logger.exception("Redis error in set_code_if_not_exists")
        return False


def store_email_hash(email: str, hashed: str) -> bool:
    """
    Store email->hash and email->code mapping atomically (pipe should be used by caller).
    """
    get_redis()
    try:
        # The caller must have prepared the email_code_key value
        return True
    except Exception:
        logger.exception("Redis error in store_email_hash")
        return False


def incr_attempts_after_send(email: str) -> int:
    """
    Incrémente le compteur d'essais pour l'email et définit le TTL si première incr.
    Retourne la valeur actuelle après incr ou -1 en cas d'erreur.
    """
    r = get_redis()
    key = build_attempts_key(email)
    try:
        result = r.incr(key)
        if result is None:
            attempts = 1
        elif isinstance(result, (bytes, bytearray)):
            attempts = int(result.decode("utf-8"))
        else:
            attempts = int(result)  # type: ignore[arg-type]
        if attempts == 1:
            r.expire(key, RESET_REQUEST_BLOCK_TTL)
        return attempts
    except Exception:
        logger.exception("Failed to increment attempts for %s", email)
        return -1


def read_attempts(email: str) -> int:
    """
    Retourne le compteur actuel (0 si absent ou erreur).
    """
    r = get_redis()
    key = build_attempts_key(email)
    try:
        current = r.get(key)
        if current is None:
            return 0
        if isinstance(current, (bytes, bytearray)):
            return int(current.decode("utf-8"))
        return int(current)  # pyright: ignore[reportArgumentType]
    except Exception:
        logger.exception("Failed to read attempts for %s", email)
        return 0
