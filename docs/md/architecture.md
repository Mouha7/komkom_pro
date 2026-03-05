### Architecture

**But**
Fournir une vue d’ensemble claire et exploitable de l’architecture technique du projet KomKom (MVP B2B marketplace), couvrant composants, flux, contrats d’événements, déploiement dev/prod, sécurité et bonnes pratiques pour scalabilité et résilience.

**Extrait du produit**
**"KomKom is a B2B ordering platform for hardware store owners to: Create a business profile Browse available products Place orders Receive delivery."**
**"Admin defines: Categories (Ciment, Fer, Peinture, etc.) Products: Name Category Unit (bag, ton, piece) Price Stock status (Available / Not Available) Optional image."**

---

### Composants principaux

- **Edge / Gateway**
  - **Traefik** : TLS, routing, forwardAuth vers Keycloak, middlewares (rate-limit, retry, healthchecks).
- **Auth / IAM**
  - **Keycloak** : OIDC/OAuth2, realms/clients, roles (admin, buyer, employee), JWKS pour validation JWT.
- **Object Storage**
  - **MinIO** : S3‑compatible pour images produits, factures, documents; versioning/lifecycle.
- **Cache / Session / Cart**
  - **Redis** : cache produits, sessions, Redis‑backed cart, Celery result backend (optionnel).
- **Broker / Tasks**
  - **RabbitMQ** + **Celery** : échanges topic/direct, durable queues, DLQ, retry/backoff, workers pour invoice/notifications/uploads.
- **Databases**
  - **PostgreSQL** : persistance ACID pour `orders_service` (transactions), migrations Alembic par service.
- **Microservices (FastAPI / Python)**
  - `products_catalog_service` — lecture/CRUD produits, cache, events produit.*
  - `cart_service` — Redis‑backed cart, locking, validation.
  - `orders_service` — orchestration commandes, saga orchestration, persistance, publish order events.
- **Workers**
  - **Celery workers** : génération facture, upload MinIO, notifications, tâches longues idempotentes.
- **Infra Dev**
  - **Docker Compose** pour dev; **Kubernetes/Helm** pour production (autoscaling, HA).
- **Shared libs**
  - `common_libs` : auth helpers (Keycloak JWT), DTOs Pydantic partagés, utils (idempotency, correlation id).

---

### Topologie et flux (textuel)

```
Internet
  ↓ HTTPS (TLS)
[Traefik] -- forwardAuth --> [Keycloak]
  ├─ /api/products  --> [products_service]  (Postgres + Redis)
  ├─ /api/cart      --> [cart_service]      (Redis)
  └─ /api/orders    --> [orders_service]    (Postgres + Redis)
[orders_service] -- publish --> RabbitMQ (exchange.events)
RabbitMQ --> consumers:
  - products_service (inventory.reserve)
  - celery_worker (invoice.generate, notification.send)
Celery workers --> MinIO (upload invoice) & Redis (results)
```

**Flux commande (séquence simplifiée)**

1. Client → `orders_service` POST `/orders` (validate cart, create order status=Pending, idempotency token).
2. `orders_service` publie `order.created` → RabbitMQ `exchange.events`.
3. `products_service` consomme → tente `inventory.reserve` → publie `inventory.reserve.response`.
4. `orders_service` consomme réponse → si `reserved` → status=Confirmed → enqueue Celery tasks (invoice, notify); si `failed` → status=Cancelled + compensation (release).

---

### Events, exchanges et contrats (résumé)

**Exchanges recommandés** : `exchange.events` (topic), `exchange.inventory` (topic), `exchange.worker` (direct), `exchange.dlx` (fanout DLQ).

**Routing keys exemples**

- `order.created`
- `inventory.reserve.request`
- `inventory.reserve.response`
- `order.confirmed`
- `invoice.generated`
- `order.status.updated`

**Message DTO (JSON) — exemples clés**

- `order.created` : `{ orderId, storeId, createdBy, items[{productId,quantity,unit}], totalAmount, delivery{address,gps}, idempotencyToken, createdAt }`
- `inventory.reserve.response` : `{ orderId, status: reserved|failed, details:[{productId,reservedQty,availableQty}], reason?, processedAt }`
- `invoice.generated` : `{ orderId, invoiceUrl, generatedAt }`

**Garanties**

- Messages **persistants**, queues **durables**, ack/retry, DLQ pour erreurs persistantes.
- **Idempotence** : `idempotencyToken` stocké côté `orders_service` (unique constraint) pour éviter doublons.

---

### Déploiement et environnements

**Dev (Docker Compose)**

- Compose orchestre Traefik, Keycloak (dev mode), Postgres, Redis, RabbitMQ (management), MinIO, services FastAPI, Celery worker.
- Scripts d’init : déclarer exchanges/queues, créer Keycloak realm/clients, seed products.

**Prod (Kubernetes)**

- Helm charts pour RabbitMQ (cluster), MinIO (gateway/tenant), Keycloak (HA), Postgres (primary+replica), Redis (sentinel/cluster).
- Ingress controller : Traefik or cloud LB; cert-manager pour TLS (Let’s Encrypt).
- Secrets : HashiCorp Vault or Kubernetes Secrets + sealed-secrets.
- CI/CD : build images, scan vuln, push registry, deploy via GitOps/ArgoCD or pipelines.

**Scaling**

- Services stateless → scale horizontal (replicas).
- Redis cluster for high availability; Postgres read replicas pour lecture; RabbitMQ cluster with mirrored queues for HA.
- Use autoscaling (HPA) on CPU/RAM and queue length metrics for workers.

---

### Sécurité, résilience et opérations

**Sécurité**

- **TLS everywhere** (Traefik + internal services via mTLS optional).
- **JWT validation** in services (Keycloak JWKS).
- **RBAC** : roles mapping (admin/buyer/employee) enforced in API layer.
- **Least privilege** for RabbitMQ vhosts/users and MinIO users.
- **Secrets management** (Vault recommended).
- **Network segmentation** : internal network for services; only Traefik exposed.

**Résilience & fiabilité**

- **Retries & backoff** for consumers; DLQ after N retries.
- **Compensation / Saga** pattern for distributed transactions (orders ↔ inventory).
- **Backups** : Postgres backups (pg_dump/pgbackrest), MinIO lifecycle + backups, Redis persistence (AOF) and replication.
- **Healthchecks** : readiness/liveness for all services; Traefik health routing.

**Observabilité (prévoir)**

- Metrics (Prometheus), Tracing (OpenTelemetry), Logs (structured JSON → Loki/ELK). (À activer après MVP.)

---

### Design decisions et bonnes pratiques retenues

- **Microservices Python / FastAPI** : validation Pydantic, OpenAPI auto‑docs, async support.
- **RabbitMQ + Celery** : simple à opérer pour MVP, patterns queue/exchange adaptés aux workflows commandes/tâches.
- **Redis-backed cart** : instant UX + persistence TTL; use distributed locks (Redlock) during checkout.
- **Postgres pour orders** : ACID, transactions, migrations Alembic.
- **MinIO** : S3-compatible, facile à intégrer et à migrer vers S3 si besoin.
- **Traefik + Keycloak** : centralise auth and routing; Traefik forwardAuth vers Keycloak for protected routes.

---

### Roadmap opérationnelle (priorités immédiates)

1. **Infra dev** : docker-compose minimal + scripts init (exchanges, Keycloak realm).
2. **Services MVP** : `products_service` (read + cache), `cart_service` (Redis-backed), `orders_service` (create order + publish event).
3. **Workers** : Celery worker minimal (invoice generation stub, notification stub).
4. **Idempotence & saga** : implement idempotency token + basic choreography for inventory reservation.
5. **Tests** : unitaires + intégration (end-to-end checkout).
6. **Hardening** : secrets, TLS, user permissions, backups.

---

### Annexes rapides (références pratiques)

- **Naming conventions** : services `products_catalog_service`, `cart_service`, `orders_service`.
- **Event keys** : use `domain.entity.action` style (e.g., `order.created`, `inventory.reserve.request`).
- **Correlation** : propagate `correlation_id` / `request_id` across HTTP headers and messages for tracing.
- **Dev commands** (exemples) : `make infra.up`, `make service.products.up`, `make migrate products`, `make seed products`.

---

**Conclusion**Ce document fournit une base opérationnelle et technique pour démarrer le MVP KomKom avec une architecture microservices claire, des flux d’événements robustes, et des choix technologiques pragmatiques (Traefik, Keycloak, Redis, RabbitMQ/Celery, MinIO, Postgres, FastAPI). Si tu veux, je peux maintenant générer :

- le **diagramme mermaid** correspondant à la topologie ci‑dessus ; ou
- le **docker-compose.dev.yml** complet (adapté à l’arborescence du repo) avec scripts d’init RabbitMQ/Keycloak ; ou
- un **template d’OpenAPI** minimal pour `orders_service` (POST /orders, GET /orders/{id}).
