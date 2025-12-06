import hashlib
import hmac
import secrets

from app.core import config as app_config

RESET_SALT = app_config.settings.RESET_SALT


def hash_code(code: str) -> str:
    """
    HMAC-SHA256 hex digest using RESET_SALT
    """
    return hmac.new(
        RESET_SALT.encode("utf-8"), code.encode("utf-8"), hashlib.sha256
    ).hexdigest()


def generate_code() -> str:
    return f"{secrets.randbelow(10**6):06d}"
