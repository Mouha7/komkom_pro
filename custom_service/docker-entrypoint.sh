#!/bin/sh
set -e

echo "[entrypoint] Waiting for database to be available..."

# Optional: export variables if necessary, e.g. POSTGRES_URL from DATABASE_URL
# export POSTGRES_URL="$DATABASE_URL"

# Run DB init script (waits + create_all fallback)
python /app/init_db.py

# If you use alembic and want migrations applied automatically:
if [ -d "/app/alembic" ]; then
  echo "[entrypoint] alembic directory found - running alembic upgrade head"
  # alembic must be installed in requirements.txt
  alembic upgrade head || echo "[entrypoint] alembic upgrade failed (check logs)"
fi

echo "[entrypoint] DB init done. Executing command: $@"
exec "$@"
