# 🔄 Celery Worker


### Workers — Vue d’ensemble

**But**
Gérer les tâches asynchrones et longues du projet KomKom : génération de factures, envoi de notifications, traitement d’uploads, exports et opérations de maintenance. Les workers sont découplés des services HTTP et communiquent via RabbitMQ (broker) et Redis (result backend / cache). Ils doivent être idempotents, observables et résilients.

**Composants principaux**

- **Celery** pour l’orchestration des tâches.
- **Broker** : RabbitMQ.
- **Result backend** : Redis (optionnel pour certains tasks).
- **Stockage** : MinIO pour fichiers générés (factures, exports).
- **Observabilité** : metrics Prometheus, logs structurés, traces OpenTelemetry.

---

### Architecture et responsabilités

- **Celery worker process**

  - Exécute tasks définies dans `tasks/`.
  - Configure `acks_late=True`, `task_reject_on_worker_lost=True`, `max_retries` et `retry_backoff`.
  - Utilise queues dédiées (e.g., `invoices`, `notifications`, `uploads`, `exports`) pour priorisation et scalabilité.
- **Tasks critiques**

  - `generate_invoice(order_id)` : créer PDF, uploader sur MinIO, mettre à jour `orders_service` via API, publier `invoice.generated`. Idempotent.
  - `send_notification(user_id, payload)` : push in‑app, push notification, email fallback. Retry et DLQ.
  - `upload_to_minio(file_path, bucket)` : traitement d’uploads asynchrones, validation, optimisation image (WebP).
  - `export_data(job_id, params)` : génération CSV/JSON, upload MinIO, notifier admin.
  - `retry_failed_orders()` : job périodique pour relancer sagas incomplètes.
- **Events et intégration**

  - Les workers consomment messages RabbitMQ (via Celery or aio-pika) et publient des événements (e.g., `invoice.generated`, `notification.sent`).
  - Ils doivent propager `correlation_id` et `X-Request-Id`.

---

### Arborescence recommandée et rôle des fichiers

```
workers/
├── celery_worker/
│   ├── tasks/
│   │   ├── __init__.py
│   │   ├── celery_app.py
│   │   ├── config.py
│   │   ├── invoice_task.py
│   │   ├── notification_task.py
│   │   ├── upload_task.py
│   │   ├── export_task.py
│   │   └── periodic_tasks.py
│   ├── Dockerfile
│   ├── requirements.txt
│   └── README.md
└── README.md
```

#### Fichiers et responsabilités

- **tasks/__init__.py**

  - Expose l’instance Celery (`celery_app`) et importe tasks pour enregistrement.
- **tasks/celery_app.py**

  - Crée et configure l’objet Celery. Configure `broker_url`, `result_backend`, `task_routes`, `task_acks_late`, `worker_prefetch_multiplier`, `task_default_retry_delay`, `task_annotations` (rate limits), `beat_schedule` si Celery Beat est utilisé. Initialise instrumentation (OpenTelemetry) et metrics exporter.
- **tasks/config.py**

  - Chargement des variables d’environnement via `pydantic.BaseSettings` : `RABBITMQ_URL`, `REDIS_URL`, `MINIO_URL`, `MINIO_CREDENTIALS`, `INVOICE_TEMPLATE_PATH`, timeouts, retry policy, queues mapping.
- **tasks/invoice_task.py**

  - `@celery.task(bind=True, acks_late=True, max_retries=3)`
  - Étapes : vérifier si invoice exists (idempotence), récupérer order via `orders_service` API, générer PDF (template engine), optimiser, uploader MinIO, mettre à jour `orders_service` (invoiceUrl), publier `invoice.generated`. Gérer erreurs et retries.
- **tasks/notification_task.py**

  - `send_notification` : support multi‑channel (in‑app, push, email). Implémente backoff, DLQ routing, batching si nécessaire.
- **tasks/upload_task.py**

  - Traitement d’images/fichiers : validation MIME, conversion WebP, génération de thumbnails, upload MinIO, suppression locale. Idempotence via checksum.
- **tasks/export_task.py**

  - Génération d’exports CSV/JSON : pagination DB, streaming to file, upload MinIO, notifier via `notification_task`.
- **tasks/periodic_tasks.py**

  - Tâches planifiées : purge old temp files, retry stuck sagas, health checks, metrics aggregation. Déclaré dans `celery_app.beat_schedule` si Beat activé.
- **Dockerfile**

  - Multi‑stage build, installe dépendances, crée user non‑root, expose healthcheck endpoint (HTTP or Celery ping), entrypoint `celery -A tasks.celery_app worker --loglevel=INFO --concurrency=...` et optionnel `celery -A tasks.celery_app beat` pour scheduler.
- **requirements.txt**

  - `celery`, `aio-pika` or `kombu`, `httpx`, `pydantic`, `boto3` (MinIO), `reportlab` or `weasyprint` (PDF), `python-multipart`, `Pillow`, `opentelemetry-sdk`, `prometheus_client`.
- **README.md** (celery_worker)

  - Instructions de configuration, variables d’environnement, commandes pour lancer worker/beat, exemples de tests tasks, recommandations de scaling.
- **workers/README.md**

  - Vue d’ensemble des workers, conventions de nommage des queues, politique de retry/DLX, monitoring endpoints.

---

### Nomenclature et conventions

- **Queues** nommées par domaine et priorité : `invoices.high`, `notifications.default`, `uploads.low`, `exports.default`.
- **Tasks** nommées en snake_case et exposées sous `tasks.<module>.<function>` pour traçabilité.
- **Env vars** en MAJUSCULE : `RABBITMQ_URL`, `REDIS_URL`, `MINIO_ENDPOINT`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`, `ORDERS_SERVICE_URL`, `NOTIFICATION_SERVICE_URL`.
- **Correlation** : chaque task accepte `correlation_id` et `request_id` et les propage dans logs et events.
- **Idempotence** : tasks qui modifient état externe doivent vérifier existence avant action (ex. invoice exists) et stocker marqueurs (DB table or Redis key `task:idempotency:{key}`).

---

### Observabilité, résilience et opérations

- **Logging** : logs JSON structurés ; inclure `task_id`, `task_name`, `correlation_id`, `request_id`, `retries`. Ne jamais logguer secrets.
- **Metrics** : exposer compteurs Prometheus via `prometheus_client` : `celery_tasks_total`, `celery_tasks_failed_total`, `celery_task_duration_seconds` par task.
- **Tracing** : instrumenter avec OpenTelemetry ; propager context across HTTP and RabbitMQ.
- **DLQ** : configurer dead letter exchange/queue pour messages non traités après `max_retries`. Mettre en place alerting sur DLQ length.
- **Healthchecks** : endpoint HTTP simple ou Celery ping task ; vérifier connectivity to RabbitMQ, Redis, MinIO.
- **Scaling** : scaler workers par queue type ; ex. plus d’instances pour `invoices.high` si génération PDF lourde.
- **Security** : utiliser TLS pour RabbitMQ and MinIO in prod ; limiter permissions MinIO user to specific buckets.

---

### Bonnes pratiques d’implémentation

- **Idempotence systématique** pour tasks qui effectuent effets externes.
- **Small tasks** : découper gros jobs en sous‑tâches pour meilleure résilience et parallélisme.
- **Timeouts et retries** : définir `soft_time_limit` et `time_limit` pour éviter workers bloqués.
- **Atomicité** : utiliser transactions ou marqueurs atomiques (Redis SETNX) pour éviter doublons.
- **Backpressure** : monitorer queue lengths et ajuster concurrency; utiliser rate limits si nécessaire.
- **Tests** : unit tests pour logique tasks ; integration tests avec RabbitMQ/Redis/MinIO (docker compose).
- **Secrets** : ne pas stocker credentials en clair ; utiliser Vault or secret manager en prod.

---

### Checklist de livraison pour workers

- [x] `celery_app.py` configuré avec broker/backend, routes et beat schedule.
- [x] Tasks implémentées : `workers.generate_invoice`, `workers.send_notification`, `workers.upload_to_minio`, `workers.export_data`.
- [x] Idempotence sur `generate_invoice` et `upload_to_minio`.
- [x] Retry policy avec backoff exponentiel sur tasks critiques.
- [x] Healthcheck Celery et métriques Prometheus (`celery_tasks_total`, `celery_tasks_failed_total`, `celery_task_duration_seconds`).
- [x] Dockerfile durci (user non-root) et dépendances worker documentées.
- [ ] Tests unitaires/integration dédiés workers (à compléter).
- [x] README avec runbook basique de vérification.

---

### Implémentation active (mars 2026)

- Queues consommées: `invoices.high`, `notifications.default`, `uploads.low`, `exports.default`.
- Exchange direct: `komkom.tasks`.
- Tasks enregistrées:
  - `workers.generate_invoice`
  - `workers.send_notification`
  - `workers.upload_to_minio`
  - `workers.export_data`
  - `workers.retry_failed_orders`
  - `workers.purge_temp_files`
- Intégration orders:
  - Endpoint admin ajouté: `POST /api/v1/orders/{order_id}/invoice/generate`
  - `POST /api/v1/orders/bulk-export` publie maintenant `workers.export_data`

### Variables d’environnement utilisées

- `RABBITMQ_URL` (ou `CELERY_BROKER_URL`)
- `REDIS_URL` (ou `CELERY_RESULT_BACKEND`)
- `DATABASE_URL`
- `MINIO_ENDPOINT`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`, `MINIO_BUCKET_NAME`, `MINIO_SECURE`
- `ORDERS_SERVICE_URL`
- `QUEUE_INVOICES`, `QUEUE_NOTIFICATIONS`, `QUEUE_UPLOADS`, `QUEUE_EXPORTS`

### Runbook rapide

```bash
# Build et démarrage
docker-compose -f infra/docker/docker-compose.yml build celery_worker orders_service
docker-compose -f infra/docker/docker-compose.yml up -d celery_worker orders_service rabbitmq redis postgres minio

# Vérifier le worker
docker-compose -f infra/docker/docker-compose.yml exec -T celery_worker celery -A tasks inspect ping
docker-compose -f infra/docker/docker-compose.yml logs --tail=100 celery_worker

# Déclencher génération de facture (admin route)
curl -X POST http://orders.localhost/api/v1/orders/<order_id>/invoice/generate

# Déclencher export (admin route)
curl -X POST http://orders.localhost/api/v1/orders/bulk-export \
  -H "Content-Type: application/json" \
  -d '{"format":"csv"}'
```
