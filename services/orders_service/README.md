# 📋 Orders Service


### Orders Service — Endpoints, structure et spécifications

---

#### Résumé

Service **orders_service** (FastAPI + PostgreSQL) responsable de la création, gestion et orchestration des commandes. Il persiste les commandes, gère le **saga** d’orchestration (réservation inventaire), publie/consomme des événements RabbitMQ, et déclenche des tâches asynchrones (Celery) pour facturation et notifications. Tous les noms de variables, routes et codes restent en **anglais**.

---

### 1. Endpoints à développer (REST API `/api/v1/orders`)

| **Méthode** | **Route**                              | **But / Comportement clé**                                                                                                                                        |
| -----------------: | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
|           `POST` | `/api/v1/orders`                           | **Créer une commande**. Revalidation prix/stock, créer `order` row, stocker `Idempotency-Key`, publier `order.created`. Header `Idempotency-Key` requis. |
|            `GET` | `/api/v1/orders`                           | **Lister commandes** (scoped par `storeId` ou `userId`). Query: `status`, `page`, `page_size`, `fromDate`, `toDate`.                                 |
|            `GET` | `/api/v1/orders/{orderId}`                 | **Détail commande** (items, delivery, status, invoiceUrl, history).                                                                                               |
|          `PATCH` | `/api/v1/orders/{orderId}/status`          | **Mettre à jour statut** (admin only). Body: `newStatus`, `note`. Publie `order.status.updated`.                                                            |
|           `POST` | `/api/v1/orders/{orderId}/assign-delivery` | **Assigner livraison** (deliveryPersonId, deliveryFee).                                                                                                            |
|           `POST` | `/api/v1/orders/{orderId}/cancel`          | **Annuler commande** (with reason; triggers compensation events).                                                                                                  |
|            `GET` | `/api/v1/orders/{orderId}/timeline`        | **Timeline / tracking** (status history, timestamps).                                                                                                              |
|            `GET` | `/api/v1/orders/{orderId}/invoice`         | **Récupérer facture** (redirect / presigned MinIO URL).                                                                                                          |
|           `POST` | `/api/v1/orders/{orderId}/refund`          | **Demander remboursement** (admin flow; triggers worker).                                                                                                          |
|            `GET` | `/api/v1/orders/health`                    | **Healthcheck** (DB connectivity, RabbitMQ, Redis).                                                                                                                |
|           `POST` | `/api/v1/orders/bulk-export`               | **Demander export** (CSV/JSON) — async job, returns jobId / exportUrl when ready.                                                                                 |
|            `GET` | `/api/v1/orders/search`                    | **Recherche avancée** (by invoiceId, customer phone, external refs).                                                                                              |

**Headers & comportements transverses**

- `Authorization: Bearer <JWT>` required for protected endpoints.
- `X-Request-Id` propagated.
- `Idempotency-Key` required for `POST /orders`.
- Responses standardisées `{ "data":..., "meta":... }` and error envelope `{ "error": { code, message, details } }`.

---

### 2. Arborescence recommandée et rôle des dossiers/fichiers

```
orders_service/
├── app/
│   ├── src/
│   │   ├── api/
│   │   │   ├── v1/
│   │   │   │   ├── routes/
│   │   │   │   │   ├── orders.py
│   │   │   │   │   ├── admin.py
│   │   │   │   │   └── health.py
│   │   │   │   └── dependencies.py
│   │   │   └── middleware/
│   │   │       └── auth_middleware.py
│   │   ├── models/
│   │   │   ├── order.py
│   │   │   ├── order_item.py
│   │   │   ├── order_status_history.py
│   │   │   └── invoice.py
│   │   ├── schemas/
│   │   │   ├── order.py
│   │   │   ├── item.py
│   │   │   ├── status.py
│   │   │   └── export.py
│   │   ├── services/
│   │   │   ├── order_service.py
│   │   │   ├── saga_manager.py
│   │   │   ├── pricing_validator.py
│   │   │   └── delivery_service.py
│   │   ├── events/
│   │   │   ├── consumers/
│   │   │   │   └── inventory_consumer.py
│   │   │   └── publisher.py
│   │   ├── tasks/
│   │   │   ├── celery_app.py
│   │   │   ├── tasks.py
│   │   │   └── invoice_task.py
│   │   ├── db/
│   │   │   ├── base.py
│   │   │   └── session.py
│   │   ├── alembic/
│   │   ├── config.py
│   │   ├── main.py
│   │   └── logging_config.py
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   └── Dockerfile
├── README.md
└── docker-compose.override.yml
```

#### Explication détaillée (fichiers clés)

- **app/src/main.py**Point d’entrée FastAPI : inclut routers (`api.v1.routes`), configure middleware (auth, error handlers), startup/shutdown hooks (DB pool, RabbitMQ connection, Celery).
- **app/src/config.py** `pydantic.BaseSettings` : `DATABASE_URL`, `REDIS_URL`, `RABBITMQ_URL`, `MINIO_URL`, `ORDERS_SERVICE_SETTINGS` (timeouts, retry), `IDEMPOTENCY_STORE` config.
- **app/src/db/session.py** & **base.py**SQLAlchemy engine, session factory, base declarative model, helper `get_db` dependency.
- **app/src/models/**ORM models SQLAlchemy : `Order`, `OrderItem`, `OrderStatusHistory`, `Invoice`, `IdempotencyKey` (unique constraint), `DeliveryAssignment`. Inclure indexes (storeId, createdAt).
- **app/src/schemas/**Pydantic schemas (request/response): `OrderCreate`, `OrderSummary`, `OrderDetail`, `OrderStatusUpdate`, `InvoiceDTO`, `ExportJobDTO`.
- **app/src/services/order_service.py**Logique métier : create_order (transactional), update_status, compute_totals, persist idempotency token, compensation logic on failure. Utilise `pricing_validator` et `saga_manager`.
- **app/src/services/saga_manager.py**Orchestration chorégraphique ou orchestrée : publie `inventory.reserve.request`, attend `inventory.reserve.response` (via events consumer) ; gère timeouts, retries, compensation (release inventory) ; updates order status accordingly.
- **app/src/services/pricing_validator.py**Revalide prix & availability via `products_client` (HTTP) or Redis cache; returns diffs for `422` responses.
- **app/src/services/delivery_service.py**Business logic pour assignation livraison, calcul frais, intégration éventuelle avec provider externe.
- **app/src/events/publisher.py**Wrapper pour publier messages sur RabbitMQ (topic exchange). Standardise envelope (correlationId, timestamp, payload).
- **app/src/events/consumers/inventory_consumer.py**Consumer (aio-pika / kombu) qui consomme `inventory.reserve.response` et notifie `saga_manager` (update order status).
- **app/src/tasks/**

  - `celery_app.py` : configuration Celery (broker RabbitMQ, backend Redis).
  - `tasks.py` : tasks génériques (send_notification, generate_invoice).
  - `invoice_task.py` : génère facture PDF, upload MinIO, met à jour `invoiceUrl` et publie `invoice.generated`.
- **app/src/api/v1/routes/orders.py**Implémente endpoints publics pour stores/users : create, list, get, timeline, invoice retrieval.
- **app/src/api/v1/routes/admin.py**Endpoints admin : list all orders, change status, export, suspend store actions.
- **app/src/api/v1/dependencies.py** `get_current_user`, `require_role('admin')`, `get_db`, `get_request_id`.
- **app/src/middleware/auth_middleware.py**Valide JWT via `common_libs/auth/jwt_validator.py`, injecte claims.
- **app/src/tasks/celery_app.py** & **tasks**Tasks idempotentes, `acks_late=True`, retry/backoff, DLQ handling.
- **app/src/alembic/**Migrations SQL (versions) pour modèles.
- **app/src/tests/**

  - `unit/` : tests services, saga logic, pricing validator.
  - `integration/` : tests end-to-end (Postgres, RabbitMQ, Redis, MinIO) via docker-compose test env.
- **Dockerfile**
  Multi-stage, non-root user, healthcheck, entrypoint `gunicorn -k uvicorn.workers.UvicornWorker app.src.main:app`.

---

### 3. Comportements métier et patterns à implémenter

- **Transaction & idempotence**

  - `POST /orders` doit être idempotent via `Idempotency-Key` stocké en DB (`IdempotencyKey` table) ; unique constraint pour éviter doublons.
  - Création d’order doit être transactionnelle : insert order + items + idempotency token dans une transaction.
- **Saga / orchestration**

  - Après création, publier `order.created` → `exchange.events`.
  - `inventory` (products_service) consomme et répond `inventory.reserve.response`.
  - `saga_manager` met à jour `order.status` selon réponse : `Confirmed` ou `Cancelled` + compensation.
  - Timeout handling : si pas de réponse dans `X` secondes, marquer `Pending` and schedule retry or manual review.
- **Events & messaging**

  - Exchanges : `exchange.events` (topic), `exchange.inventory` (topic), `exchange.worker` (direct), `exchange.dlx`.
  - Messages incluent `correlationId`, `idempotencyToken`, `createdAt`.
- **Tasks asynchrones**

  - `generate_invoice(orderId)` : idempotent (check if invoice exists), generate PDF, upload to MinIO, update `invoiceUrl`, publish `invoice.generated`.
  - `send_notification(userId, payload)` : push / email.
- **Compensation**

  - On inventory reservation failure, revert any partial state, notify user, and optionally refund if payment pre-captured (not in MVP).
- **Security & RBAC**

  - Enforce `role=admin` for admin endpoints. Validate `storeId` ownership for store-scoped endpoints.

---

### 4. Schémas DTO et exemples (Pydantic)

**OrderCreate**

```json
{
  "storeId":"string",
  "items":[{"productId":"string","quantity":123,"unit":"bag|ton|piece","unitPrice":123.45}],
  "delivery":{"address":"string","gps":{"lat":0.0,"lng":0.0},"notes":"string"},
  "paymentMethod":"offline",
  "contactPhone":"string"
}
```

**OrderSummary**

```json
{"orderId":"string","storeId":"string","status":"Pending|Confirmed|Preparing|Out for Delivery|Delivered|Cancelled","totalAmount":123.45,"createdAt":"ISO datetime"}
```

**OrderDetail** — voir section endpoints (inclut `items[]`, `statusHistory[]`, `invoiceUrl`).

**InventoryReserveResponseDTO**

```json
{
  "orderId":"string",
  "status":"reserved|failed",
  "details":[{"productId":"string","reservedQty":123,"availableQty":456}],
  "reason":"string|null",
  "processedAt":"ISO datetime"
}
```

---

### 5. Ce qu’il faut mettre dans `common_libs` pour `orders_service`

```
common_libs/
├── auth/
│   ├── keycloak.py            # Keycloak realm/client helpers
│   ├── jwt_validator.py       # validate_jwt(token) -> claims
│   └── roles.py               # role constants and helpers
├── dto/
│   ├── order.py               # OrderCreate, OrderSummary, OrderDetail DTOs
│   ├── product.py             # ProductDTO used for pricing validation
│   ├── event.py               # Standard event envelope DTOs
│   └── base.py                # BaseModel config (orm_mode, datetime)
└── utils/
    ├── http_client.py         # httpx wrapper with retry/backoff
    ├── idempotency.py         # helpers to validate/store idempotency keys
    ├── time.py                # ISO datetime helpers
    ├── logging.py             # structured logger helpers
    └── db_utils.py            # helpers for transactions, retry on deadlock
```

**Rôles des modules `common_libs`**

- **auth/jwt_validator.py** : récupérer JWKS (`KEYCLOAK_JWKS_URL`), valider signature et claims (`exp`, `aud`, `iss`), helper `get_current_user`.
- **dto/order.py** : Pydantic models partagés entre services (orders, cart, admin).
- **utils/http_client.py** : centralise timeouts, retries, `X-Request-Id` propagation pour appels vers `products_service`, `cart_service`.
- **utils/idempotency.py** : standardise format `Idempotency-Key`, TTL, storage helpers (DB or Redis).
- **utils/db_utils.py** : helper `with_transaction(session)` and retry logic for serialization errors.

---

### 6. Tests, observabilité et déploiement

- **Tests unitaires** : order_service logic, saga_manager, pricing_validator, idempotency behavior.
- **Tests d’intégration** : orchestrer Postgres, RabbitMQ, Redis, MinIO via docker-compose test env ; scénarios : create order → inventory reserved → invoice generated.
- **Métriques** : exposer compteurs Prometheus : `orders_created_total`, `orders_confirmed_total`, `orders_failed_total`, `saga_time_seconds`.
- **Tracing** : propager `X-Request-Id` et `correlation_id` dans events for distributed tracing (OpenTelemetry).
- **CI/CD** : lint, unit tests, build image, scan vuln, run integration smoke tests, deploy via Helm/ArgoCD.

---

### Checklist de livraison minimale (MVP)

- [ ] Endpoints listés implémentés et documentés (OpenAPI).
- [ ] Table `orders`, `order_items`, `order_status_history`, `idempotency_keys` avec migrations Alembic.
- [ ] `POST /orders` idempotent et transactionnel.
- [ ] Publication `order.created` et consumer `inventory.reserve.response` fonctionnels.
- [ ] Celery tasks pour invoice generation et notification.
- [ ] Tests unitaires et intégration pour checkout flow.
- [ ] Logging structuré, metrics et healthcheck.
- [ ] README avec variables d’environnement et commandes dev.
