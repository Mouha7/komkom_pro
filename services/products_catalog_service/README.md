# Products Catalog Service

## Vue d'ensemble

Le service products_catalog_service gere le catalogue produit avec:
- persistence PostgreSQL (SQLAlchemy)
- cache Redis
- publication d'evenements RabbitMQ
- generation d'URL presignees MinIO pour upload image
- API FastAPI versionnee sous /api/v1/products et /api/v1/categories

Le service applique un format d'erreur normalise:

```json
{
  "error": {
    "code": "STRING_CODE",
    "message": "Readable message",
    "details": {}
  }
}
```

## Endpoints implementes

### Produits

- GET /api/v1/products
  - filtres: categoryId, search, page, pageSize, sortBy
- GET /api/v1/products/bulk
  - query: ids
- GET /api/v1/products/sku/{sku}
- GET /api/v1/products/{productId}
- POST /api/v1/products
  - admin only
- PATCH /api/v1/products/{productId}
  - admin only
- DELETE /api/v1/products/{productId}
  - admin only
- GET /api/v1/products/{productId}/availability
- POST /api/v1/products/{productId}/stock/reserve
  - admin only
  - validation metier: refuse reservation si deja reserve ou indisponible
- POST /api/v1/products/{productId}/stock/release
  - admin only
  - validation metier: refuse release si non reserve
- GET /api/v1/products/search/suggestions
- GET /api/v1/products/images/presign
  - admin only
  - query: productId, filename
- POST /api/v1/products/import
  - admin only
  - supporte:
    - JSON: liste ProductCreate
    - multipart/form-data CSV via file
    - multipart/form-data JSON via payloadJson

### Categories

- GET /api/v1/categories
- POST /api/v1/categories
  - admin only
- PATCH /api/v1/categories/{categoryId}
  - admin only
- DELETE /api/v1/categories/{categoryId}
  - admin only

### Health

- GET /health
- GET /ready
- GET /api/v1/products/health

## Variables d'environnement

- DATABASE_URL
- REDIS_URL
- REDIS_TTL_SECONDS
- RABBITMQ_URL
- MINIO_ENDPOINT
- MINIO_ACCESS_KEY
- MINIO_SECRET_KEY
- MINIO_BUCKET_NAME
- MINIO_SECURE
- MINIO_PRESIGN_EXPIRY_SECONDS
- KEYCLOAK_JWKS_URL
- KEYCLOAK_AUDIENCE
- KEYCLOAK_ISSUER
- HTTP_TIMEOUT
- HTTP_MAX_RETRIES
- PAGINATION_DEFAULT_PAGE_SIZE
- PAGINATION_MAX_PAGE_SIZE
- LOG_LEVEL

## Structure actuelle

```text
products_catalog_service/
  alembic/
    versions/
      0001_create_products_schema.py
  app/
    Dockerfile
    src/
      api/
      cache/
      crud/
      db/
      events/
      models/
      schemas/
      services/
      config.py
      logging_config.py
      main.py
    tests/
      conftest.py
      integration/
      unit/
```

## Validation locale rapide

Depuis la racine du repo:

```bash
python3 -m compileall services/products_catalog_service/app/src services/products_catalog_service/app/tests services/common_libs
```

## Validation Docker executee

Commandes utilisees:

```bash
docker-compose -f infra/docker/docker-compose.yml build products_service
docker-compose -f infra/docker/docker-compose.yml up -d postgres redis rabbitmq products_service
docker-compose -f infra/docker/docker-compose.yml up -d --force-recreate products_service
docker-compose -f infra/docker/docker-compose.yml exec -T products_service python -m pytest -q /app/tests
docker-compose -f infra/docker/docker-compose.yml down
```

Resultat tests containerises:
- 5 passed

## Notes implementation

- Le middleware auth injecte current_user depuis JWT Keycloak.
- Les erreurs HTTP, validation et erreurs internes sont normalisees en enveloppe error.
- Le cache produit utilise des cles partagees dans services/common_libs/utils/cache_keys.py.
- Les transitions de stock reserve/release appliquent des verifications metier explicites.
