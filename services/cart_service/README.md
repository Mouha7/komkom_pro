
### 🛒 Cart Service — Documentation technique

---

## Vue d’ensemble

**But** : fournir un service léger, rapide et résilient pour gérer le panier côté client et magasin. Le **cart_service** est **Redis‑backed**, expose une API REST `/api/v1/cart` et assure : ajout/modification/suppression d’items, fusion de panier, verrouillage pour checkout, validation pré‑checkout et orchestration vers `orders_service`.
**Contraintes** : idempotence pour checkout, atomicité des opérations cart, TTL configurable, support pour utilisateurs authentifiés (`buyer`/`employee`) et sessions anonymes (`sessionId`).

---

## Endpoints à développer

| Méthode | Route                              | Description                                                    | Auth                                    |
| -------: | ---------------------------------- | -------------------------------------------------------------- | --------------------------------------- |
|      GET | `/api/v1/cart`                   | Récupérer le panier courant (user ou session)                | optional (JWT or sessionId)             |
|     POST | `/api/v1/cart/items`             | Ajouter ou mettre à jour un item                              | required for user; optional for session |
|    PATCH | `/api/v1/cart/items/{productId}` | Mettre à jour qty / unit d’un item                           | required                                |
|   DELETE | `/api/v1/cart/items/{productId}` | Supprimer un item                                              | required                                |
|     POST | `/api/v1/cart/merge`             | Fusionner cart client local avec cart serveur (on login)       | required                                |
|     POST | `/api/v1/cart/clear`             | Vider le panier                                                | required                                |
|     POST | `/api/v1/cart/lock`              | Acquérir lock pour checkout → retourne `lockToken`         | required                                |
|     POST | `/api/v1/cart/unlock`            | Libérer lock avec `lockToken`                               | required                                |
|     POST | `/api/v1/cart/checkout/validate` | Revalidation prix & stock avant checkout                       | required                                |
|     POST | `/api/v1/cart/checkout`          | Lancer le flux de création de commande (calls orders_service) | required; supports `Idempotency-Key`  |
|      GET | `/api/v1/cart/preview`           | Calculer totals/taxes/delivery estimate sans persister         | optional                                |
|      GET | `/health`                        | Healthcheck simple (redis ping)                                | none                                    |

**Headers recommandés** : `Authorization: Bearer <JWT>`, `X-Request-Id: <uuid>`, `Idempotency-Key: <uuid>` (pour `POST /cart/checkout`), `sessionId` cookie/header pour anonymous.

---

## Schémas DTO principaux

**CartDTO**

```json
{
  "cartId":"string",
  "storeId":"string",
  "userId":"string|null",
  "items":[
    {"productId":"string","quantity":3,"unit":"bag","priceSnapshot":12.5,"lineTotal":37.5}
  ],
  "subtotal":37.5,
  "deliveryEstimate":0.0,
  "updatedAt":"2026-03-05T14:09:00Z"
}
```

**AddItemRequest**

```json
{"productId":"string","quantity":integer,"unit":"bag|ton|piece"}
```

**CheckoutRequest**

```json
{
  "cartId":"string",
  "storeId":"string",
  "delivery":{"address":"string","gps":{"lat":0.0,"lng":0.0},"notes":"string"},
  "paymentMethod":"offline",
  "contactPhone":"string"
}
```

**LockResponse**

```json
{"lockToken":"string","expiresAt":"ISO datetime"}
```

**Error envelope**

```json
{
  "error": {"code":"string","message":"string","details":{}}
}
```

---

## Arborescence recommandée et rôle des fichiers

```
cart_service/
├── app/
│   ├── src/
│   │   ├── api/
│   │   │   ├── v1/
│   │   │   │   ├── routes/
│   │   │   │   │   ├── cart.py
│   │   │   │   │   ├── checkout.py
│   │   │   │   │   └── health.py
│   │   │   │   └── dependencies.py
│   │   │   └── middleware/
│   │   │       └── auth_middleware.py
│   │   ├── redis_cart/
│   │   │   ├── client.py
│   │   │   ├── repository.py
│   │   │   └── serializer.py
│   │   ├── locks/
│   │   │   ├── redis_lock.py
│   │   │   └── lock_manager.py
│   │   ├── schemas/
│   │   │   ├── cart.py
│   │   │   ├── item.py
│   │   │   └── checkout.py
│   │   ├── services/
│   │   │   ├── cart_service.py
│   │   │   ├── pricing_service.py
│   │   │   └── integration/
│   │   │       ├── orders_client.py
│   │   │       └── products_client.py
│   │   ├── events/
│   │   │   └── publisher.py
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

### Description détaillée des dossiers et fichiers

- **main.py**Point d’entrée FastAPI. Configure routers, middleware, startup/shutdown (connect Redis, init clients).
- **config.py**`pydantic.BaseSettings` : `REDIS_URL`, `ORDERS_SERVICE_URL`, `PRODUCTS_SERVICE_URL`, `LOCK_TTL`, `CART_TTL`, timeouts, retry settings.
- **logging_config.py**Configuration du logging structuré JSON ; propagation `X-Request-Id`.
- **api/v1/routes/**

  - `cart.py` : implémente `GET /cart`, `POST /cart/items`, `PATCH`, `DELETE`, `POST /cart/merge`, `POST /cart/clear`, `GET /cart/preview`.
  - `checkout.py` : `POST /cart/checkout/validate`, `POST /cart/checkout` (acquiert lock, appelle `orders_client`, gère idempotency).
  - `health.py` : `/health` (ping Redis).
  - `dependencies.py` : `get_current_user`, `get_redis`, `get_request_id`.
- **middleware/auth_middleware.py**Vérifie JWT via `common_libs/auth/jwt_validator.py`, injecte `current_user` dans request state.
- **redis_cart/**

  - `client.py` : wrapper connexion Redis (pool, retry).
  - `repository.py` : fonctions CRUD cart en Redis (`get_cart`, `save_cart`, `delete_cart`, `merge_cart`). Utiliser transactions MULTI/EXEC ou Lua pour atomicité.
  - `serializer.py` : sérialisation/désérialisation DTO ↔ Redis (timestamps, priceSnapshot).
- **locks/**

  - `redis_lock.py` : implémentation SETNX + token + TTL ou Redlock si cluster. Fournit `acquire(lock_key, ttl)` et `release(lock_key, token)`.
  - `lock_manager.py` : logique de retry/backoff, renouvellement, exceptions `LockAcquisitionError`.
- **schemas/**Pydantic schemas : `CartDTO`, `CartItemDTO`, `AddItemRequest`, `CheckoutRequest`, `LockResponse`, `ErrorResponse`.
- **services/**

  - `cart_service.py` : logique métier (add_item, update_item, compute_totals, merge, clear). Appelle repository et pricing_service.
  - `pricing_service.py` : revalidation prix (calls `products_client` or cache Redis).
  - `integration/orders_client.py` : client HTTP async vers `orders_service` (POST order) avec retries, timeout, envoi `Idempotency-Key`.
  - `integration/products_client.py` : client pour récupérer price/stock depuis `products_service` ou cache.
- **events/publisher.py**Publication optionnelle d’événements (ex. `cart.updated`) vers RabbitMQ via `aio-pika` ou `kombu`.
- **tests/**

  - `unit/` : tests unitaires (cart logic, locks, serializer).
  - `integration/` : tests d’intégration avec Redis (docker compose) et mocks pour `products_service`/`orders_service`.
- **Dockerfile**Multi‑stage build, user non‑root, expose port 8000, entrypoint `gunicorn -k uvicorn.workers.UvicornWorker app.src.main:app`.
- **README.md**
  Variables d’environnement, commandes `make`, comment lancer tests, exemples d’appels.

---

## Clés d’implémentation et patterns importants

- **Clés Redis**

  - `cart:{storeId}:{userId}` pour user cart.
  - `cart:session:{sessionId}` pour anonymous.
  - `cart_lock:{cartId}` pour lock.
  - TTL configurable `CART_TTL` (ex. 30 days).
- **Atomicité**

  - Utiliser Redis transactions (`MULTI/EXEC`) ou Lua scripts pour opérations add/update/remove afin d’éviter conditions de course.
  - Stocker `priceSnapshot` à l’ajout d’un item ; revalider au checkout.
- **Verrouillage pour checkout**

  - `POST /cart/lock` → `acquire` retourne `lockToken`. Lock TTL court (ex. 60s) et renouvelable.
  - `checkout` exige `lockToken` header ; si absent ou invalide → 409 Conflict.
  - `unlock` libère le lock ; en cas d’échec, lock expire automatiquement.
- **Idempotence**

  - `POST /cart/checkout` accepte `Idempotency-Key`. `orders_client` doit transmettre ce header à `orders_service`. `cart_service` doit stocker mapping `idempotencyKey -> orderId` pour éviter duplications.
- **Merge logic**

  - `POST /cart/merge` : additionne quantités pour mêmes `productId` ; privilégie `priceSnapshot` serveur ; retourne cart fusionné.
- **Revalidation prix & stock**

  - `checkout/validate` appelle `products_client` pour récupérer `currentPrice` et `stockStatus`. Si mismatch, renvoyer `422` avec `details`.
- **Optimistic UI support**

  - Optionnel `clientVersion` pour détecter edits concurrents ; si mismatch, renvoyer `409` avec latest cart.
- **Timeouts et retries**

  - External calls (`products_service`, `orders_service`) : timeout court (ex. 2s) + retry exponentiel (max 3). En cas d’échec, renvoyer message utilisateur clair.

---

## Intégration avec common_libs

**Fichiers recommandés dans `common_libs` pour réutilisation**

```
common_libs/
├── auth/
│   ├── keycloak.py
│   ├── jwt_validator.py
│   └── roles.py
├── dto/
│   ├── cart.py
│   ├── product.py
│   ├── order.py
│   └── base.py
└── utils/
    ├── http_client.py
    ├── time.py
    ├── idempotency.py
    └── logging.py
```

- **auth/jwt_validator.py** : validation JWKS, claims check (`exp`, `aud`, `iss`), helper `get_current_user_from_token`.
- **dto/cart.py** : Pydantic models partagés (CartDTO, CartItemDTO, AddItemRequest, CheckoutRequest).
- **utils/http_client.py** : wrapper `httpx.AsyncClient` avec retry/backoff, propagation `X-Request-Id`.
- **utils/idempotency.py** : helpers pour valider/générer `Idempotency-Key` et stocker mapping si nécessaire.
- **utils/logging.py** : `get_logger(name)` et helpers pour ajouter `request_id` dans logs.

---

## Tests, monitoring et observabilité

- **Unit tests** : logique cart, serializer, lock manager. Utiliser `pytest` + `fakeredis` pour isolation.
- **Integration tests** : docker compose minimal (redis + service) ; tests flows add→merge→checkout validate.
- **Metrics** : exposer compteurs Prometheus : `cart_add_total`, `cart_checkout_attempt_total`, `cart_lock_conflict_total`. Endpoint `/metrics` optionnel.
- **Logging** : logs JSON avec `request_id`, `user_id`, `cart_id`, `correlation_id`. Ne jamais logguer tokens complets.

---

## Variables d’environnement essentielles

- `REDIS_URL`
- `ORDERS_SERVICE_URL`
- `PRODUCTS_SERVICE_URL`
- `RABBITMQ_URL` (optionnel si events)
- `KEYCLOAK_JWKS_URL`
- `CART_TTL` (seconds)
- `LOCK_TTL` (seconds)
- `HTTP_TIMEOUT` (seconds)
- `IDEMPOTENCY_STORE` (Redis DB index or Postgres)

Documenter ces variables dans `.env.example`.

---

## Checklist de livraison pour le service

- [ ] Endpoints listés implémentés et testés.
- [ ] Pydantic schemas dans `schemas/` et `common_libs/dto/`.
- [ ] Redis repository atomic et tests unitaires.
- [ ] Lock manager robuste et tests de conflit.
- [ ] `checkout` supporte `Idempotency-Key` et stocke mapping.
- [ ] Integration tests pour checkout flow.
- [ ] Logging structuré et metrics exposés.
- [ ] Dockerfile multi‑stage et `docker-compose.override.yml` pour dev.
- [ ] README avec exemples curl et instructions dev.
