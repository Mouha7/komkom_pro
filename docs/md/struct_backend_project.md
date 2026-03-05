### **Structure de dossiers recommandée (vue globale)**

Organise le dépôt principal komkom/ en **mono‑repo** contenant l’infra et les micro‑services (idéal pour MVP). Chaque service est autonome, testable et conteneurisé. Voici l’arborescence proposée :

```
komkom/
├── infra/
│   ├── docker/                      # docker-compose pour dev / scripts d'infra
│   │   ├── docker-compose.yml
│   │   ├── traefik/
│   │   ├── keycloak/
│   │   ├── rabbitmq/
│   │   ├── redis/
│   │   ├── minio/
│   │   └── postgres/
│   ├── k8s/                          # manifests / helm charts (prod)
│   └── scripts/                      # scripts d'init infra (declare exchanges, users)
│
├── services/
│   ├── products_catalog_service/
│   │   ├── app/
│   │   │   ├── src/                  # code source (fastapi app)
│   │   │   │   ├── api/
│   │   │   │   ├── models/
│   │   │   │   ├── schemas/          # pydantic DTOs
│   │   │   │   ├── crud/
│   │   │   │   ├── cache/            # redis helpers
│   │   │   │   └── events/           # publisher / consumer logic
│   │   │   ├── tests/
│   │   │   └── Dockerfile
│   │   ├── alembic/                  # migrations (si Postgres)
│   │   └── README.md
│   │
│   ├── cart_service/
│   │   ├── app/
│   │   │   ├── src/
│   │   │   │   ├── api/
│   │   │   │   ├── redis_cart/       # Redis-backed cart implementation
│   │   │   │   ├── locks/            # distributed lock helpers
│   │   │   │   └── schemas/
│   │   │   ├── tests/
│   │   │   └── Dockerfile
│   │   └── README.md
│   │
│   ├── orders_service/
│   │   ├── app/
│   │   │   ├── src/
│   │   │   │   ├── api/
│   │   │   │   ├── models/
│   │   │   │   ├── schemas/
│   │   │   │   ├── services/         # business logic, saga orchestration
│   │   │   │   ├── events/           # consumers for inventory responses
│   │   │   │   └── tasks/            # celery tasks triggers
│   │   │   ├── alembic/
│   │   │   ├── tests/
│   │   │   └── Dockerfile
│   │   └── README.md
│   │
│   └── common_libs/                  # libs partagées (auth, utils, dto)
│       ├── auth/                     # Keycloak JWT validation helpers
│       ├── dto/                      # shared DTOs (pydantic)
│       └── utils/
│
├── workers/
│   ├── celery_worker/                # tasks: invoice, notifications, uploads
│   │   ├── tasks/
│   │   ├── Dockerfile
│   │   └── README.md
│   └── README.md
│
├── mobile_design/
│   ├── figma_prompt.txt              # prompt utilisé pour banani / figma
│   ├── screens_list.csv              # export des écrans / routes
│   └── assets/                       # images, icons placeholders
│
├── docs/
│   ├── architecture.md
│   ├── api_contracts.md              # endpoints + DTOs (OpenAPI links)
│   ├── dev_setup.md                  # comment lancer en local
│   ├── deployment.md                 # prod checklist (k8s)
│   └── security.md                   # secrets, TLS, RBAC
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── cd.yml
│
├── scripts/                          # utilitaires (migrations, seed data)
│   ├── init_rabbitmq.sh
│   ├── seed_products.py
│   └── backup_minio.sh
│
├── .env.example
├── Makefile
└── README.md
```

---

### **Règles et conventions par dossier (détails pratiques)**

#### **`infra/docker/`**

* **But**
  : environnement de développement reproductible.
* **Contenu clé**
  : docker-compose.yml qui orchestre Traefik, Keycloak, RabbitMQ (management), Redis, MinIO, Postgres, et un ou deux services FastAPI en mode dev.
* **Bonnes pratiques**
  : séparer fichiers de config (traefik.yml, acme.json) ; scripts d’init pour déclarer exchanges/queues et créer users.

#### **`services/*/app/src/`**

* **Organisation**
  : api/ (routes), models/ (ORM), schemas/ (Pydantic DTOs), crud/ (DB access), events/ (publish/consume), tests/.
* **Dockerfile**
  : multi‑stage build, pin des dépendances, user non‑root, healthcheck.
* **Entrypoint**
  : Uvicorn via Gunicorn (ex. gunicorn -k uvicorn.workers.UvicornWorker).

#### **`services/common_libs/`**

* **But**
  : éviter duplication (auth Keycloak validation, DTOs partagés, exceptions).
* **Versioning**
  : publier localement via path dependency ou package interne.

#### **`workers/celery_worker/`**

* **Broker**
  : RabbitMQ ; result backend : Redis.
* **Tasks idempotentes**
  : vérifier existence (ex. invoice) avant création.
* **Config**
  : task_acks_late=True, retry/backoff, DLQ handling.

#### **`mobile_design/`**

* **Contenu**
  : prompt Banani, liste d’écrans, assets exportables.
* **Workflow**
  : générer Figma via Banani → importer dans Figma → compléter composants réutilisables.

#### **`docs/`**

* **Must**
  : architecture diagram, API contracts (OpenAPI links), guide dev local, checklist sécurité (TLS, secrets).
* **API docs**
  : pointer vers /openapi.json de chaque service.

#### **`scripts/`**

* **Utilitaires**
  : seed data, init infra (declare exchanges), backup/restore.

#### **racine**

* **Makefile**
  : commandes utiles (make up, make test, make lint, make migrate).
* **.env.example**
  : variables d’environnement nécessaires (DB, Redis, RabbitMQ, Keycloak).
* **CI**
  : tests unitaires, lint, build image, scan vuln.

---

### **Patterns et pratiques recommandées (pour garder le projet clean)**

1. **One responsibility per service**
   : products, cart, orders — pas de logique croisée.
2. **Contracts explicites**
   : OpenAPI pour chaque service + consumer-driven contracts (pact) pour events.
3. **Shared DTOs versionnés**
   : common_libs/dto pour éviter mismatch.
4. **Migrations**
   : Alembic par service (DB per service or schema isolation).
5. **Env vars**
   : ne pas committer secrets ; utiliser Docker secrets / Vault en prod.
6. **Tests**
   : unitaires + tests d’intégration pour le flow cart → orders → inventory.
7. **CI pipeline**
   : lint → unit tests → build image → push to registry (dev tag).
8. **Idempotence**
   : orders_service doit stocker idempotency_token unique.
9. **Events**
   : declare exchanges/queues via infra scripts, version routing keys.
10. **Logging**
    : structured logs JSON, correlation_id propagation (trace request_id across services).

---

### **Exemple de fichiers clés à créer (templates)**

* infra/docker/docker-compose.yml : services infra + override pour dev.
* services/*/Dockerfile : multi-stage, build deps, run as non-root.
* services/*/app/src/main.py : FastAPI app + include_router + healthcheck.
* services/*/app/src/config.py : loader env vars via pydantic BaseSettings.
* services/*/alembic/env.py : migrations.
* workers/celery_worker/celery_app.py : celery config (broker, backend).
* scripts/init_rabbitmq.sh : declare exchanges, queues, bindings, DLX.

---

### **Exemple de conventions de nommage**

* **Packages / services**
  : products_catalog_service, cart_service, orders_service.
* **Modules**
  : api.v1.products, schemas.product, crud.product.
* **Events routing keys**
  : order.created, inventory.reserve.request, inventory.reserve.response.
* **Env vars**
  : ORDERS_DB_URL, PRODUCTS_REDIS_URL, RABBITMQ_URL, KEYCLOAK_JWKS_URL.

---

### **Checklist de démarrage (ordre d’implémentation)**

1. Créer repo et arborescence ci‑dessus.
2. Rédiger infra/docker/docker-compose.yml minimal (Traefik, Keycloak, Postgres, Redis, RabbitMQ, MinIO).
3. Implémenter products_catalog_service minimal (GET products, cache Redis).
4. Implémenter cart_service (Redis-backed cart).
5. Implémenter orders_service (create order, persist Postgres, publish order.created).
6. Ajouter workers/celery_worker pour invoice/notifications.
7. Écrire scripts d’init RabbitMQ (exchanges/queues).
8. Mettre en place CI basique (lint + tests).

---

Si tu veux, je peux maintenant **générer** :

* un **template **docker-compose.yml adapté à cette arborescence (dev), ou
* un **Makefile** avec commandes utiles (make up, make down, make test, make migrate), ou
* un **exemple de **products_catalog_service** minimal** (FastAPI + Dockerfile + Redis cache) pour que tu puisses démarrer immédiatement.

Dis‑moi lequel tu veux en premier et je le prépare.
