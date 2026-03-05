# 📦 Products Catalog Service


### Vue d’ensemble

Service **products_catalog_service** responsable du catalogue produit, recherche, cache, gestion des catégories et publication d’événements d’inventaire. API REST `/api/v1/products` pour lecture et opérations admin CRUD. Stock principal Postgres, cache Redis, stockage images MinIO, events via RabbitMQ. Les noms techniques et routes restent en **anglais**.

---

### Endpoints à développer

| **Méthode** | **Route**                                | **Description**                                                                          |
| -----------------: | ---------------------------------------------- | ---------------------------------------------------------------------------------------------- |
|                GET | `/api/v1/products`                           | Lister produits avec filtres `category_id`, `search`, `page`, `page_size`, `sort_by` |
|                GET | `/api/v1/products/{productId}`               | Récupérer détail produit                                                                    |
|                GET | `/api/v1/products/sku/{sku}`                 | Récupérer produit par SKU                                                                    |
|                GET | `/api/v1/products/bulk`                      | Récupérer plusieurs produits par `ids` query param                                         |
|               POST | `/api/v1/products`                           | Créer produit admin only                                                                      |
|              PATCH | `/api/v1/products/{productId}`               | Mettre à jour produit admin only                                                              |
|             DELETE | `/api/v1/products/{productId}`               | Supprimer produit admin only                                                                   |
|                GET | `/api/v1/categories`                         | Lister catégories                                                                             |
|               POST | `/api/v1/categories`                         | Créer catégorie admin only                                                                   |
|              PATCH | `/api/v1/categories/{categoryId}`            | Mettre à jour catégorie admin only                                                           |
|             DELETE | `/api/v1/categories/{categoryId}`            | Supprimer catégorie admin only                                                                |
|               POST | `/api/v1/products/{productId}/stock/reserve` | Endpoint sync pour réserver stock localement ou forward to inventory service                  |
|               POST | `/api/v1/products/{productId}/stock/release` | Libérer réservation stock                                                                    |
|                GET | `/api/v1/products/{productId}/availability`  | Vérifier disponibilité et lead time                                                          |
|               POST | `/api/v1/products/import`                    | Import CSV/JSON bulk admin only                                                                |
|                GET | `/api/v1/products/health`                    | Healthcheck service DB + Redis + MinIO                                                         |
|                GET | `/api/v1/products/search/suggestions`        | Autocomplete suggestions pour search bar                                                       |
|                GET | `/api/v1/products/images/presign`            | Générer presigned URL pour upload image (admin only)                                         |

---

### Arborescence recommandée et rôle des dossiers

```
products_catalog_service/
├── app/
│   ├── src/
│   │   ├── api/
│   │   │   ├── v1/
│   │   │   │   ├── routes/
│   │   │   │   │   ├── products.py
│   │   │   │   │   ├── categories.py
│   │   │   │   │   └── health.py
│   │   │   │   └── dependencies.py
│   │   │   └── middleware/
│   │   │       └── auth_middleware.py
│   │   ├── models/
│   │   │   ├── product.py
│   │   │   ├── category.py
│   │   │   └── product_image.py
│   │   ├── schemas/
│   │   │   ├── product.py
│   │   │   ├── category.py
│   │   │   └── responses.py
│   │   ├── crud/
│   │   │   ├── product_crud.py
│   │   │   └── category_crud.py
│   │   ├── cache/
│   │   │   ├── redis_client.py
│   │   │   └── product_cache.py
│   │   ├── events/
│   │   │   ├── publisher.py
│   │   │   └── consumers/
│   │   │       └── inventory_consumer.py
│   │   ├── services/
│   │   │   ├── product_service.py
│   │   │   ├── image_service.py
│   │   │   └── search_service.py
│   │   ├── db/
│   │   │   ├── base.py
│   │   │   └── session.py
│   │   ├── config.py
│   │   ├── main.py
│   │   └── logging_config.py
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   └── Dockerfile
├── alembic/
└── README.md
```

---

### Description détaillée des dossiers et fichiers

- **api/v1/routes/products.py**Déclare routes publiques et admin pour produits. Valide requêtes, applique pagination, appelle `product_service` pour logique métier. Retourne réponses paginées et codes standardisés.
- **api/v1/routes/categories.py**Routes CRUD catégories. Utilise `category_crud` et `product_service` pour cohérence.
- **api/v1/routes/health.py**Endpoint `/health` vérifiant Postgres, Redis, MinIO et éventuellement RabbitMQ.
- **api/v1/dependencies.py**Dépendances FastAPI partagées `get_db`, `get_redis`, `get_current_user`, `require_admin`.
- **middleware/auth_middleware.py**Middleware pour valider JWT via `common_libs/auth/jwt_validator.py` et injecter claims.
- **models/**SQLAlchemy models `Product`, `Category`, `ProductImage`. Inclure contraintes uniques, index sur `sku`, `name`, `categoryId`.
- **schemas/**Pydantic DTOs `ProductCreate`, `ProductUpdate`, `ProductResponse`, `CategoryDTO`, `PaginatedResponse`. Config `orm_mode`.
- **crud/**Fonctions d’accès DB encapsulées `create_product`, `update_product`, `get_product_by_id`, `list_products` avec filtres et transactions.
- **cache/redis_client.py**Wrapper connexion Redis pool, gestion TTL, retry.
- **cache/product_cache.py**Logique de cache produit: cache key patterns `product:{id}`, `product:list:{filters_hash}`; invalidation on update/delete.
- **events/publisher.py**Publie événements RabbitMQ `product.created`, `product.updated`, `inventory.change`. Standardise envelope `correlationId`, `timestamp`.
- **events/consumers/inventory_consumer.py**Consomme réponses d’inventaire `inventory.reserve.request/response` si nécessaire pour sync stock.
- **services/product_service.py**Logique métier: validation, composition DTO, gestion image presign via `image_service`, invalidation cache, publication events.
- **services/image_service.py**Intégration MinIO: presigned upload URLs, image transformations recommendations, storage path conventions.
- **services/search_service.py**Search layer: simple DB full text search or integration with search engine (Elasticsearch) for suggestions and autocomplete.
- **db/session.py** et **db/base.py**Engine SQLAlchemy, session factory, Base declarative, helper `get_db` dependency.
- **config.py**`pydantic.BaseSettings` pour `DATABASE_URL`, `REDIS_URL`, `MINIO_URL`, `RABBITMQ_URL`, image bucket, cache TTL, pagination defaults.
- **main.py**FastAPI app creation, include routers, startup/shutdown events to connect DB, Redis, RabbitMQ, MinIO.
- **logging_config.py**Logging structuré JSON, propagation `X-Request-Id`.
- **alembic/**Migrations SQL pour modèles.
- **tests/**Unit tests pour CRUD, cache, services. Integration tests avec Postgres and Redis containers.
- **Dockerfile**
  Multi-stage build, non-root user, healthcheck, expose port 8000.

---

### Contenu recommandé dans common_libs pour réutilisation

```
common_libs/
├── auth/
│   ├── keycloak.py
│   ├── jwt_validator.py
│   └── roles.py
├── dto/
│   ├── product.py
│   ├── category.py
│   └── base.py
└── utils/
    ├── http_client.py
    ├── time.py
    ├── logging.py
    └── cache_keys.py
```

- **auth/jwt_validator.py**Récupère JWKS depuis `KEYCLOAK_JWKS_URL`, valide signature et claims `exp`, `aud`, `iss`. Fournit `get_current_user_from_token`.
- **dto/product.py**Pydantic models partagés `ProductDTO`, `ProductListDTO`, `StockDTO` pour échanges inter-services.
- **utils/http_client.py**Wrapper `httpx.AsyncClient` avec retry/backoff et propagation `X-Request-Id` pour appels vers autres services.
- **utils/cache_keys.py**
  Fonctions utilitaires pour générer clés Redis cohérentes `product:{id}`, `product:list:{hash}`.

---

### Bonnes pratiques et recommandations d’implémentation

- **Cache first read** pour product detail: check Redis then DB fallback. Invalidation immédiate après update/delete.
- **Batch endpoints** pour réduire roundtrips `GET /products/bulk` et `GET /products/list` avec `ids`.
- **Presigned URLs** pour upload images vers MinIO, éviter upload via service. Limiter taille et valider MIME types.
- **Indexation** : indexer `sku`, `name`, `categoryId`, `price` pour requêtes performantes. Utiliser full text search pour `search`.
- **Events** : publier `product.created`, `product.updated`, `product.deleted` pour synchronisation inventory and caches. Messages persistants, include `correlationId`.
- **Pagination** : standardiser `page` and `page_size` with `meta` in response.
- **Rate limiting** : apply at Traefik for public endpoints.
- **Security** : admin endpoints require `role=admin`. Validate inputs via Pydantic. Sanitize text fields.
- **Observabilité** : expose `/metrics` for Prometheus counters `product_cache_hit`, `product_requests_total`, `product_create_total`. Propagate `X-Request-Id` and `correlation_id`.

---

### Checklist de livraison minimale

- [ ] Endpoints listés implémentés et documentés OpenAPI.
- [ ] Modèles SQLAlchemy et migrations Alembic.
- [ ] Cache Redis avec invalidation sur update/delete.
- [ ] Presigned image upload via MinIO.
- [ ] Events publisher RabbitMQ pour product lifecycle.
- [ ] Tests unitaires et d’intégration.
- [ ] Dockerfile et `docker-compose.override.yml` pour dev.
- [ ] README avec variables d’environnement et exemples curl.
