from typing import Optional

import redis
from app.core import config as app_config

_redis_client: Optional[redis.Redis] = None


def get_redis() -> redis.Redis:
    global _redis_client
    if _redis_client is None:
        # redis.from_url permet d'utiliser REDIS_URL (avec mot de passe si fourni)
        _redis_client = redis.from_url(
            app_config.settings.REDIS_URL, decode_responses=True
        )
    return _redis_client


def save_refresh_token(refresh_token: str, user_id: str, expires_seconds: int) -> None:
    r = get_redis()
    key = f"refresh:{refresh_token}"
    r.set(key, user_id, ex=expires_seconds)


def pop_refresh_token(refresh_token: str) -> Optional[str]:
    r = get_redis()
    key = f"refresh:{refresh_token}"
    # Récupérer et supprimer atomiquement via transaction
    pipeline = r.pipeline()
    pipeline.get(key)
    pipeline.delete(key)
    value, _ = pipeline.execute()
    return value
