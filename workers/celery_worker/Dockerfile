FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY workers/celery_worker/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy worker and shared libs
COPY services/common_libs /app/services/common_libs
COPY workers/celery_worker /app/workers/celery_worker

ENV PYTHONPATH=/app
WORKDIR /app/workers/celery_worker

RUN useradd --create-home --shell /bin/bash worker && chown -R worker:worker /app
USER worker

HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
    CMD celery -A tasks inspect ping || exit 1

# Run Celery worker
CMD ["celery", "-A", "tasks", "worker", "--loglevel=info", "--concurrency=4"]
