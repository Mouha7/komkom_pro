### API Contracts — KomKom (MVP)

**Contexte**
Extraits produit : *KomKom is a B2B ordering platform for hardware store owners to: Create a business profile Browse available products Place orders Receive delivery.*
*Admin defines: Categories (Ciment, Fer, Peinture, etc.) Products: Name Category Unit (bag, ton, piece) Price Stock status (Available / Not Available) Optional image.*

---

### Principes généraux de l’API

- **Format** : JSON over HTTPS.
- **Authentification** : OAuth2 / OIDC via **Keycloak**. Tous les endpoints protégés exigent un **Bearer JWT** sauf endpoints publics (ex. health, public product list si configuré).
- **Versioning** : base path `/api/v1/...`.
- **Pagination** : paramètres `page` (1-based) et `page_size` (max 100). Réponse paginée inclut un objet `meta` `{ "page", "page_size", "total" }`.
- **Erreurs** : enveloppe d’erreur standard :
  ```json
  {
    "error": {
      "code": "string",
      "message": "string",
      "details": { ... }
    }
  }
  ```
- **Idempotence** : `POST /orders` accepte l’en‑tête `Idempotency-Key`. Le service `orders_service` doit stocker ce token.
- **Corrélation** : header `X-Request-Id` (UUID) propagé dans logs et events.
- **Rate limiting** : géré au niveau Traefik ; clients doivent gérer `429` et `Retry-After`.
- **Format date/heure** : ISO 8601 UTC (ex. `2026-03-05T14:09:00Z`).
- **Documentation** : chaque service expose `/openapi.json` (OpenAPI).

---

### Auth / Session

- **Flux d’auth** : front utilise Keycloak OIDC (authorization code flow). Les services valident JWT via Keycloak JWKS.
- **Headers requis** (pour endpoints protégés) :
  - `Authorization: Bearer <JWT>`
  - `X-Request-Id: <uuid>` (optionnel mais recommandé)
  - `Idempotency-Key: <uuid>` (pour endpoints idempotents, ex. `POST /orders`)

---

### Products Catalog Service (`products_service`)

**Base** : `/api/v1/products`

- **GET /api/v1/products** — Lister produits

  - **Query params** : `category_id`, `search`, `page`, `page_size`, `sort_by` (`price`, `name`)
  - **Réponse 200**
    ```json
    {
      "meta": {"page":1,"page_size":20,"total":123},
      "data": [
        {
          "productId":"string",
          "name":"string",
          "categoryId":"string",
          "unit":"bag|ton|piece",
          "price": 123.45,
          "stockStatus":"Available|Not Available",
          "imageUrl":"string",
          "sku":"string"
        }
      ]
    }
    ```
- **GET /api/v1/products/{productId}** — Détail produit

  - **Réponse 200**
    ```json
    {
      "productId":"string",
      "name":"string",
      "categoryId":"string",
      "unit":"bag|ton|piece",
      "price":123.45,
      "stockStatus":"Available|Not Available",
      "imageUrl":"string",
      "description":"string",
      "sku":"string",
      "createdAt":"ISO datetime",
      "updatedAt":"ISO datetime"
    }
    ```
- **POST /api/v1/products** — Créer produit (admin only)

  - **Body**
    ```json
    {
      "name":"string",
      "categoryId":"string",
      "unit":"bag|ton|piece",
      "price":123.45,
      "stockStatus":"Available|Not Available",
      "imageUrl":"string",
      "sku":"string",
      "description":"string"
    }
    ```
  - **Réponse 201** : objet produit créé.
- **PATCH /api/v1/products/{productId}** — Mettre à jour (admin)

  - **Body** : champs partiels; **Réponse 200** produit mis à jour.
- **DELETE /api/v1/products/{productId}** — Supprimer (admin)

  - **Réponse 204**.

---

### Categories

**Base** : `/api/v1/categories`

- **GET /api/v1/categories**

  - **Réponse 200**
    ```json
    {
      "data":[{"categoryId":"string","name":"string","parentCategoryId":"string|null"}]
    }
    ```
- **CRUD admin** : `POST`, `PATCH`, `DELETE` pour catégories (admin only), mêmes patterns que products.

---

### Cart Service (`cart_service`) — Redis-backed cart

**Base** : `/api/v1/cart`**Stockage** : clés Redis `cart:{storeId}:{userId}` ou `cart:{sessionId}` pour anonyme.

- **GET /api/v1/cart**

  - **Réponse 200**
    ```json
    {
      "cartId":"string",
      "storeId":"string",
      "userId":"string",
      "items":[
        {"productId":"string","quantity":3,"unit":"bag","priceSnapshot":12.5}
      ],
      "subtotal":37.5,
      "updatedAt":"ISO datetime"
    }
    ```
- **POST /api/v1/cart/items** — Ajouter / mettre à jour item

  - **Body**
    ```json
    {"productId":"string","quantity":integer,"unit":"bag|ton|piece"}
    ```
  - **Réponse 200** : cart mis à jour.
- **DELETE /api/v1/cart/items/{productId}** — Supprimer item

  - **Réponse 204**.
- **POST /api/v1/cart/merge** — Fusionner cart local avec cart serveur (on login)

  - **Body** : `{ "cart": { ... } }` — **Réponse 200** cart fusionné.
- **Concurrence** : utiliser verrou distribué Redis (`cart_lock:{cartId}`) pendant checkout.

---

### Orders Service (`orders_service`)

**Base** : `/api/v1/orders`**DB** : PostgreSQL (ACID). **Events** : publication RabbitMQ `exchange.events`.

- **POST /api/v1/orders** — Créer commande (Buyer/Employee)

  - **Headers** : `Authorization`, `Idempotency-Key` (requis)
  - **Body**
    ```json
    {
      "storeId":"string",
      "items":[{"productId":"string","quantity":123,"unit":"bag|ton|piece","unitPrice":123.45}],
      "delivery":{"address":"string","gps":{"lat":0.0,"lng":0.0},"notes":"string"},
      "paymentMethod":"offline",
      "contactPhone":"string"
    }
    ```
  - **Comportement** :
    - Revalidation du panier et des prix côté serveur.
    - Création d’une ligne `order` avec `status = Pending`.
    - Publication de l’événement `order.created` sur RabbitMQ.
    - Stockage de `Idempotency-Key`.
  - **Réponse 201**
    ```json
    {
      "orderId":"string",
      "status":"Pending",
      "totalAmount":123.45,
      "createdAt":"ISO datetime"
    }
    ```
- **GET /api/v1/orders** — Lister commandes (scopé au store)

  - **Query** : `status`, `page`, `page_size`
  - **Réponse 200** : liste paginée `OrderSummaryDTO`.
- **GET /api/v1/orders/{orderId}** — Détail commande

  - **Réponse 200**
    ```json
    {
      "orderId":"string",
      "storeId":"string",
      "createdBy":"userId",
      "items":[{"productId":"string","name":"string","quantity":1,"unitPrice":12.5,"total":12.5}],
      "totalAmount":123.45,
      "delivery":{"address":"string","gps":{"lat":0.0,"lng":0.0},"notes":"string"},
      "status":"Pending|Confirmed|Preparing|Out for Delivery|Delivered|Cancelled",
      "deliveryFee":0.0,
      "invoiceUrl":"string|null",
      "createdAt":"ISO datetime",
      "updatedAt":"ISO datetime"
    }
    ```
- **PATCH /api/v1/orders/{orderId}/status** — Mettre à jour statut (admin only)

  - **Body**
    ```json
    {"newStatus":"Confirmed|Preparing|Out for Delivery|Delivered|Cancelled","note":"string"}
    ```
  - **Comportement** : mise à jour DB, publication `order.status.updated`. **Réponse 200**.
- **POST /api/v1/orders/{orderId}/assign-delivery** — Assigner livraison (admin)

  - **Body**
    ```json
    {"deliveryPersonId":"string|null","deliveryFee":12.5,"assignedAt":"ISO datetime"}
    ```
  - **Réponse 200**.

---

### Stores / Employees

**Base** : `/api/v1/stores/{storeId}`

- **POST /api/v1/stores** — Créer store (signup)

  - **Body**
    ```json
    {
      "fullName":"string",
      "companyName":"string",
      "activity":"string",
      "phone":"string",
      "gps":{"lat":0.0,"lng":0.0},
      "city":"string",
      "zone":"string",
      "email":"string",
      "password":"string"
    }
    ```
  - **Réponse 201** : store + owner user.
- **GET /api/v1/stores/{storeId}/employees** — Lister employés (owner only)

  - **Réponse 200** : liste employees.
- **POST /api/v1/stores/{storeId}/employees** — Inviter employé (owner only)

  - **Body**
    ```json
    {"email":"string","firstName":"string","lastName":"string","role":"employee","phone":"string"}
    ```
  - **Réponse 201** : employé invité.
- **DELETE /api/v1/stores/{storeId}/employees/{employeeId}** — Révoquer accès.

---

### Admin APIs (KomKom Team)

**Base** : `/api/v1/admin/*` — nécessite `role=admin` dans le JWT.

- **GET /api/v1/admin/stores** — Lister stores.
- **PATCH /api/v1/admin/stores/{storeId}/suspend** — Suspendre compte
  - **Body**
    ```json
    {"reason":"string","suspendedUntil":"ISO datetime|null"}
    ```
- **GET /api/v1/admin/orders** — Lister toutes commandes (filtres).
- **GET /api/v1/admin/products** — CRUD produits (admin portal).
- **POST /api/v1/admin/export** — Exporter données
  - **Body**
    ```json
    {"entity":"orders|stores|products","format":"csv|json","fromDate":"ISO","toDate":"ISO","filters":{}}
    ```
  - **Réponse 202** : job accepté ; worker génère fichier et upload sur MinIO ; retourne `exportUrl` quand prêt.

---

### Events / Messaging (RabbitMQ)

- **Broker** : RabbitMQ (topic exchanges). Messages JSON ; inclure `correlationId` et `idempotencyToken` si pertinent.
- **Exchanges suggérés** :
  - `exchange.events` (topic) — `order.created`, `order.status.updated`
  - `exchange.inventory` (topic) — `inventory.reserve.request`, `inventory.reserve.response`
  - `exchange.worker` (direct) — `invoice.generate`, `notification.send`
  - `exchange.dlx` — dead-letter exchange

**Routing keys exemples** : `order.created`, `inventory.reserve.request`, `inventory.reserve.response`, `order.confirmed`, `invoice.generated`, `order.status.updated`.

**Message DTOs (exemples)**

- **OrderCreatedDTO**

  ```json
  {
    "orderId":"string",
    "storeId":"string",
    "createdBy":"string",
    "items":[{"productId":"string","quantity":123,"unit":"bag"}],
    "totalAmount":123.45,
    "delivery":{"address":"string","gps":{"lat":0.0,"lng":0.0}},
    "idempotencyToken":"string",
    "createdAt":"ISO datetime"
  }
  ```
- **InventoryReserveRequestDTO**

  ```json
  {
    "orderId":"string",
    "items":[{"productId":"string","quantity":123}],
    "requestedAt":"ISO datetime",
    "correlationId":"string"
  }
  ```
- **InventoryReserveResponseDTO**

  ```json
  {
    "orderId":"string",
    "status":"reserved|failed",
    "details":[{"productId":"string","reservedQty":123,"availableQty":456}],
    "reason":"string|null",
    "processedAt":"ISO datetime"
  }
  ```
- **InvoiceGeneratedDTO**

  ```json
  {
    "orderId":"string",
    "invoiceUrl":"s3://bucket/path.pdf",
    "generatedAt":"ISO datetime"
  }
  ```

**Garanties** : messages persistants, queues durables, ack/retry, DLQ pour messages échoués.

---

### Workers (Celery)

- **Tâches** : `generate_invoice(orderId)`, `send_notification(userId, payload)`, `upload_to_minio(file)`.
- **Broker** : RabbitMQ. **Result backend** : Redis.
- **Configuration** : `acks_late=True`, `max_retries`, `retry_backoff=True`.
- **Idempotence** : chaque tâche doit vérifier l’existence (ex. invoice) avant création.

---

### DTOs partagés (résumé)

- **ProductDTO** : `{ productId, name, categoryId, unit, price, stockStatus, imageUrl, sku }`
- **CartDTO** : `{ cartId, storeId, userId, items[], subtotal, updatedAt }`
- **OrderSummaryDTO** : `{ orderId, storeId, status, totalAmount, createdAt }`
- **OrderDetailDTO** : voir section Orders (6.3)
- **EmployeeDTO** : `{ employeeId, storeId, firstName, lastName, email, role }`

---

### Codes d’erreur (standard)

- `400` — Bad Request (validation)
- `401` — Unauthorized (missing/invalid token)
- `403` — Forbidden (role insufficient)
- `404` — Not Found
- `409` — Conflict (idempotency token duplicate or unique constraint)
- `422` — Unprocessable Entity (business validation)
- `429` — Too Many Requests
- `500` — Internal Server Error

**Exemple d’enveloppe d’erreur**

```json
{
  "error": {
    "code":"ORDER_VALIDATION_FAILED",
    "message":"Stock insufficient for product X",
    "details":{"productId":"p-123","available":2,"requested":5}
  }
}
```

---

### Sécurité et règles de validation (niveau API)

- Valider la signature JWT et les claims `exp`, `aud`, `iss`. Mapper les rôles Keycloak aux rôles applicatifs.
- Validation d’entrée via Pydantic (types, plages, format téléphone).
- Sanitize des inputs utilisateurs.
- En production : forcer HTTPS ; rejeter HTTP.
- Limiter la taille des fichiers uploadés et valider les MIME types pour MinIO.

---

### Tests et contrats

- Publier OpenAPI pour chaque service ; centraliser dans `docs/api/`.
- Tests de contrats consommateur (consumer-driven contracts) pour events entre `orders_service` et `products_service` (ex. Pact).
- Tests d’intégration end‑to‑end pour le parcours checkout : cart → create order → inventory reserve → confirm/cancel.
- Tests d’idempotence : répétition de `POST /orders` avec même `Idempotency-Key` doit renvoyer le même résultat ou un code `409` si conflit.

---

### Handoff et notes pour les développeurs

- Fournir les fichiers OpenAPI YAML/JSON dans `docs/api/` et exposer `/openapi.json` sur chaque service.
- Fournir une collection Postman ou scripts HTTP (HTTPie) pour les flows : signup → login → browse → add-to-cart → checkout.
- Fournir script d’initialisation RabbitMQ (`infra/scripts/init_rabbitmq.sh`) pour déclarer exchanges/queues et bindings.
- Documenter les variables d’environnement requises dans `.env.example` (DATABASE_URL, REDIS_URL, RABBITMQ_URL, KEYCLOAK_JWKS_URL, MINIO creds, etc.).

---

### Exemple rapide (curl) — Créer une commande

```bash
curl -X POST "https://orders.localhost/api/v1/orders" \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: 123e4567-e89b-12d3-a456-426614174000" \
  -d '{
    "storeId":"store-1",
    "items":[{"productId":"p-1","quantity":10,"unit":"bag"}],
    "delivery":{"address":"Rue X, Dakar","gps":{"lat":14.7,"lng":-17.4},"notes":"Livrer le matin"},
    "paymentMethod":"offline",
    "contactPhone":"+221770000000"
  }'
```

---

### Remarque finale

Ce document `api_contracts.md` couvre les **endpoints REST**, **événements RabbitMQ**, **DTOs**, **erreurs**, **sécurité** et **bonnes pratiques** nécessaires pour implémenter le MVP KomKom conformément aux échanges précédents.
