# Utiliser une image de base légère
FROM python:3.11-slim

WORKDIR /app

RUN useradd --create-home --shell /bin/bash appuser

COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copier le code source
COPY . .

# Copier entrypoint/init dans /app (déjà copié par COPY . . mais reste explicite)
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
COPY init_db.py /app/init_db.py

RUN chmod +x /app/docker-entrypoint.sh && \
    chown -R appuser:appuser /app

USER appuser

EXPOSE 8001

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]
