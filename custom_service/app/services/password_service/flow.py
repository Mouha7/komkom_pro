import logging
import time
import uuid

import jwt
import requests
from app.core import ErrorCode, get_redis, raise_http_error
from app.core import config as app_config
from app.services import get_admin_token
from fastapi import status

from .crypto_utils import generate_code, hash_code
from .redis_utils import (
    RESET_CODE_TTL,
    RESET_REQUEST_LIMIT,
    build_attempts_key,
    build_code_key,
    build_email_code_key,
    build_redis_key,
    incr_attempts_after_send,
    read_attempts,
    set_code_if_not_exists,
)
from .smtp import (
    send_password_changed_email,
    send_reset_email,
    send_too_many_requests_email,
)

logger = logging.getLogger(__name__)

KEYCLOAK_BASE_URL = app_config.settings.KEYC_URL
REALM = app_config.settings.KEYC_REALM_NAME
RESET_TOKEN_SECRET = app_config.settings.JWT_SECRET_KEY
RESET_TOKEN_EXP = app_config.settings.RESET_TOKEN_EXP_SECONDS


def _kc_user_exists(email_l: str, kc_admin_token: str | None = None) -> bool:
    """
    Helper: check if a user exists in Keycloak by email.
    If kc_admin_token is provided it will be used; otherwise the function will try to obtain one.
    Returns True if user exists, False otherwise. Exceptions are caught and False returned
    to preserve silent behaviour.
    """
    try:
        token = kc_admin_token or get_admin_token()
        if not token:
            logger.debug(
                "No Keycloak admin token available to check user existence for %s",
                email_l,
            )
            return False
        url_users = f"{KEYCLOAK_BASE_URL}/admin/realms/{REALM}/users"
        resp = requests.get(
            url_users,
            params={"email": email_l},
            headers={"Authorization": f"Bearer {token}"},
            timeout=10,
        )
        if resp.status_code != 200:
            logger.warning(
                "Keycloak users lookup returned non-200 while checking existence: %s %s",
                resp.status_code,
                resp.text,
            )
            return False
        users = resp.json()
        return bool(users)
    except Exception as exc:
        logger.exception(
            "Error while searching user in Keycloak for pw reset existence check: %s",
            exc,
        )
        return False


def request_password_reset(email: str) -> None:
    """
    Main entrypoint to request a password reset for an email.

    Behavior:
    - Normalize email (strip + lower).
    - Check anti-abuse attempts in Redis first.
      - If blocked: try to determine if user exists; only if exists invalidate previous codes and send block email.
      - Return silently (no info leak).
    - If not blocked:
      - Check user existence in Keycloak. If not exists (or cannot determine), return silently.
      - Otherwise generate code (unique via Redis NX), store hashed code/email mapping, send SMTP.
      - Increment attempts counter only on successful send.
    - All responses to the caller are generic (handled by the router).
    """
    email_l = (email or "").strip().lower()
    if not email_l:
        logger.debug("Empty email provided to request_password_reset")
        return

    r = get_redis()

    # 1) Anti-abuse: check attempts first (avoid heavy Keycloak calls when already blocked)
    current_count = read_attempts(email_l)
    if current_count >= RESET_REQUEST_LIMIT:
        logger.info(
            "Password reset request for %s blocked by rate limit (%s >= %s)",
            email_l,
            current_count,
            RESET_REQUEST_LIMIT,
        )
        # We attempt to notify the real user only if the user actually exists.
        # Try to obtain admin token and verify existence; if fails, stay silent.
        user_exists = _kc_user_exists(email_l)
        if not user_exists:
            logger.debug(
                "Email %s blocked but user does not exist (or cannot verify) — silent return",
                email_l,
            )
            return

        # If user exists, invalidate existing code(s) and notify them
        try:
            email_code_key = build_email_code_key(email_l)
            existing_code = r.get(email_code_key)
            if existing_code:
                try:
                    existing_code_str = (
                        existing_code.decode("utf-8")
                        if isinstance(existing_code, (bytes, bytearray))
                        else str(existing_code)
                    )
                    r.delete(build_code_key(existing_code_str))
                except Exception:
                    logger.exception(
                        "Failed to delete existing code_key for email %s during block",
                        email_l,
                    )
            # delete the email->code mapping and email hash (if present) to fully invalidate previous code
            try:
                r.delete(email_code_key)
                r.delete(build_redis_key(email_l))
            except Exception:
                logger.exception(
                    "Failed to cleanup existing email keys for %s during block", email_l
                )
        except Exception:
            logger.exception(
                "Failed to invalidate existing reset code(s) for %s when blocking",
                email_l,
            )

        # compute TTL remaining (optional) and notify user
        ttl_to_send: int | None = None
        try:
            ttl_remaining = r.ttl(build_attempts_key(email_l))
            if (
                ttl_remaining is not None
                and isinstance(ttl_remaining, int)
                and ttl_remaining > 0
            ):
                ttl_to_send = ttl_remaining
        except Exception:
            ttl_to_send = None

        try:
            send_too_many_requests_email(email_l, ttl_to_send)
            logger.info(
                "User %s has exceeded password reset requests; invalidated prior codes and sent block notification",
                email_l,
            )
        except Exception:
            logger.exception("Failed to send too-many-requests email to %s", email_l)
        return

    # 2) Check user existence via Keycloak (silent behavior if we cannot determine / token missing)
    try:
        kc_admin = get_admin_token()
        user_exists = False
        if kc_admin:
            user_exists = _kc_user_exists(email_l, kc_admin_token=kc_admin)
        else:
            logger.debug(
                "No Keycloak admin token available while processing password reset for %s; proceeding silently",
                email_l,
            )
            user_exists = False
        if not user_exists:
            logger.info(
                "Password reset requested for non-existent email (silent): %s", email_l
            )
            # Perform a small timing delay to make timing attacks harder
            time.sleep(0.15)
            return
    except Exception as exc:
        # In case of any unhandled exception, fail silently (do not reveal user existence)
        logger.exception("Error while checking user existence for %s: %s", email_l, exc)
        time.sleep(0.15)
        return

    # 3) Invalidate previous mapping (normal flow) - remove prior code mapping and hashed key
    try:
        email_code_key = build_email_code_key(email_l)
        existing_code = r.get(email_code_key)
        if existing_code:
            existing_code_str = (
                existing_code.decode("utf-8")
                if isinstance(existing_code, (bytes, bytearray))
                else str(existing_code)
            )
            try:
                r.delete(build_code_key(existing_code_str))
            except Exception:
                logger.exception(
                    "Failed to delete old code->email mapping for %s", email_l
                )
        try:
            r.delete(email_code_key)
            r.delete(build_redis_key(email_l))
        except Exception:
            logger.exception("Failed to cleanup existing keys for %s", email_l)
    except Exception:
        logger.exception("Failed to cleanup existing keys for %s", email_l)

    # 4) Generate unique code (try NX)
    code = None
    for _ in range(int(app_config.settings.RESET_REQUEST_LIMIT)):
        candidate = generate_code()
        if set_code_if_not_exists(candidate, email_l):
            code = candidate
            break

    if code is None:
        candidate = uuid.uuid4().hex[:12]
        if not set_code_if_not_exists(candidate, email_l):
            logger.exception(
                "Failed to set fallback code key in redis; aborting reset request"
            )
            return
        code = candidate
        logger.warning("Fallback code used for pw reset (non-numeric): %s", code)

    # 5) Store hashed code + mapping email->code atomically
    try:
        r = get_redis()
        pipe = r.pipeline()
        pipe.set(build_redis_key(email_l), hash_code(code), ex=RESET_CODE_TTL)
        pipe.set(build_email_code_key(email_l), code, ex=RESET_CODE_TTL)
        pipe.execute()
    except Exception:
        # Cleanup code->email if exists
        try:
            r.delete(build_code_key(code))
        except Exception:
            logger.exception("Failed to cleanup code key after email key set failure")
        logger.exception("Failed to store reset key in redis for %s", email_l)
        return

    # 6) Send email; only incr attempts if send OK
    try:
        send_reset_email(email_l, code)
        logger.info("Password reset code sent to %s", email_l)
    except Exception:
        logger.exception("Failed to send reset email to %s", email_l)
        # Clean up keys so no dangling code remains if email couldn't be delivered
        try:
            r.delete(build_redis_key(email_l))
            r.delete(build_email_code_key(email_l))
            r.delete(build_code_key(code))
        except Exception:
            logger.exception(
                "Failed to cleanup redis keys after SMTP failure for %s", email_l
            )
        return

    try:
        attempts = incr_attempts_after_send(email_l)
        logger.debug("pwreset attempts for %s => %s", email_l, attempts)
    except Exception:
        logger.exception("Failed to increment attempts counter for %s", email_l)


def verify_reset_code(email: str, code: str):
    import hmac

    email_l = email.lower()
    r = get_redis()
    key = build_redis_key(email_l)
    stored = r.get(key)
    if not stored:
        raise_http_error(
            status.HTTP_400_BAD_REQUEST,
            ErrorCode.INVALID_RESET_CODE.value,
            "Invalid or expired code",
        )

    code_key = build_code_key(code.strip())
    mapped_email = r.get(code_key)
    if mapped_email is None:
        raise_http_error(
            status.HTTP_400_BAD_REQUEST,
            ErrorCode.INVALID_RESET_CODE.value,
            "Invalid or expired code",
        )
    mapped_email_str = (
        mapped_email.decode("utf-8")
        if isinstance(mapped_email, (bytes, bytearray))
        else str(mapped_email)
    )
    if mapped_email_str.lower() != email_l:
        raise_http_error(
            status.HTTP_400_BAD_REQUEST,
            ErrorCode.INVALID_RESET_CODE.value,
            "Invalid or expired code",
        )

    stored_bytes = (
        bytes(stored)
        if isinstance(stored, (bytes, bytearray))
        else str(stored).encode("utf-8")
    )
    hashed_input_bytes = hash_code(code.strip()).encode("utf-8")
    if not hmac.compare_digest(hashed_input_bytes, stored_bytes):
        raise_http_error(
            status.HTTP_400_BAD_REQUEST,
            ErrorCode.INVALID_RESET_CODE.value,
            "Invalid or expired code",
        )

    # cleanup keys
    try:
        pipe = r.pipeline()
        pipe.delete(key)
        try:
            if r.exists(code_key):
                pipe.delete(code_key)
        except Exception:
            pipe.delete(code_key)
        pipe.delete(build_email_code_key(email_l))
        pipe.execute()
    except Exception:
        logger.exception(
            "Failed to cleanup pwreset keys after successful verification for %s",
            email_l,
        )

    now = int(time.time())
    payload = {
        "email": email_l,
        "iat": now,
        "exp": now + int(RESET_TOKEN_EXP),
        "purpose": "password_reset",
    }
    token = jwt.encode(payload, RESET_TOKEN_SECRET, algorithm="HS256")
    return token


def perform_password_reset(reset_token: str, new_password: str) -> None:
    try:
        decoded = jwt.decode(reset_token, RESET_TOKEN_SECRET, algorithms=["HS256"])
        if decoded.get("purpose") != "password_reset":
            raise_http_error(
                status.HTTP_400_BAD_REQUEST,
                ErrorCode.INVALID_RESET_CODE.value,
                "Invalid reset token",
            )
        email_l = decoded.get("email")
        if not email_l:
            raise_http_error(
                status.HTTP_400_BAD_REQUEST,
                ErrorCode.INVALID_RESET_CODE.value,
                "Invalid reset token",
            )

        kc_admin = get_admin_token()
        if not kc_admin:
            logger.error("Cannot obtain admin token for Keycloak to set password")
            raise_http_error(
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                ErrorCode.DB_ERROR.value,
                "Internal error",
            )

        url_users = f"{KEYCLOAK_BASE_URL}/admin/realms/{REALM}/users"
        resp = requests.get(
            url_users,
            params={"email": email_l},
            headers={"Authorization": f"Bearer {kc_admin}"},
        )
        if resp.status_code != 200:
            logger.error(
                "Keycloak user lookup failed: %s %s", resp.status_code, resp.text
            )
            raise_http_error(
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                ErrorCode.DB_ERROR.value,
                "Keycloak user lookup failed",
            )

        users = resp.json()
        if not users:
            raise_http_error(
                status.HTTP_400_BAD_REQUEST,
                ErrorCode.USER_NOT_FOUND.value,
                "User not found",
            )

        user_id = users[0]["id"]
        # set password
        url_reset = (
            f"{KEYCLOAK_BASE_URL}/admin/realms/{REALM}/users/{user_id}/reset-password"
        )
        payload = {"type": "password", "value": new_password, "temporary": False}
        headers = {
            "Authorization": f"Bearer {kc_admin}",
            "Content-Type": "application/json",
        }
        res = requests.put(url_reset, json=payload, headers=headers)
        if res.status_code not in (204, 200):
            logger.error(
                "Failed to set new password in Keycloak: %s %s",
                res.status_code,
                res.text,
            )
            raise_http_error(
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                ErrorCode.RESET_FAILED.value,
                "Failed to update password",
            )

        # cleanup redis
        r = get_redis()
        try:
            r.delete(build_redis_key(email_l))
            r.delete(build_email_code_key(email_l))
        except Exception:
            logger.exception("Failed to delete pwreset keys for %s", email_l)

        # send confirmation email
        try:
            send_password_changed_email(email_l)
            logger.info(
                "Password-changed confirmation email queued/sent to %s", email_l
            )
        except Exception:
            logger.exception(
                "Failed to send password-changed confirmation email to %s", email_l
            )
    except jwt.ExpiredSignatureError:
        raise_http_error(
            status.HTTP_400_BAD_REQUEST,
            ErrorCode.INVALID_RESET_CODE.value,
            "Reset token expired",
        )
    except Exception:
        raise_http_error(
            status.HTTP_400_BAD_REQUEST,
            ErrorCode.INVALID_RESET_CODE.value,
            "Reset token invalid",
        )
