# 🛍️ KomKom - Microservices E-Commerce Platform

A modern, scalable, event-driven e-commerce platform built with microservices architecture, FastAPI, PostgreSQL, Redis, RabbitMQ, and Keycloak.

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Services](#services)
- [Development](#development)
- [Documentation](#documentation)

---

## 🏗️ Architecture Overview

KomKom follows a **microservices** mono-repo pattern with:

- **API Gateway**: Traefik (reverse proxy + routing)
- **Services**: Decoupled FastAPI microservices (Products, Cart, Orders)
- **Data Storage**: PostgreSQL (relational), Redis (caching + sessions), MinIO (object storage)
- **Async Jobs**: Celery worker + RabbitMQ (message broker)
- **Authentication**: Keycloak (OpenID Connect)
- **Inter-Service Communication**: RabbitMQ (event-driven), REST APIs

### Architecture Diagram

```
                    ┌─────────────────────────────────┐
                    │         Traefik (Reverse Proxy) │
                    │  :80 (HTTP), :443 (HTTPS)       │
                    └──────────────┬──────────────────┘
                                   │
                ┌──────────────────┼─────────────────┐
                │                  │                 │
        ┌───────▼────┐      ┌──────▼─────┐    ┌──────▼─────┐
        │  Products  │      │    Cart    │    │   Orders   │
        │  Service   │      │  Service   │    │  Service   │
        │(FastAPI)   │      │(FastAPI)   │    │(FastAPI)   │
        └─────┬──────┘      └──────┬─────┘    └──────┬─────┘
              │                    │                 │
        ┌─────┴───────────────────┴──────┬───────────┘
        │                                │
    ┌───▼────────┐  ┌──────────────┐  ┌─▼──────────┐
    │ PostgreSQL │  │    Redis     │  │  RabbitMQ  │
    │  (Data)    │  │  (Cache)     │  │  (Events)  │
    └────────────┘  └──────────────┘  └────────────┘
  
    ┌──────────────────────────────────────────┐
    │         Celery Worker                    │
    │    (Async: Invoices, Notifications)      │
    └──────────────────────────────────────────┘

    ┌──────────┐  ┌──────────┐
    │Keycloak  │  │MinIO     │
    │(Auth)    │  │(Storage) │
    └──────────┘  └──────────┘
```

---

## 🚀 Tech Stack

| Layer                      | Technology                    |
| -------------------------- | ----------------------------- |
| **API Gateway**      | Traefik v3                    |
| **Services**         | FastAPI, Uvicorn, Gunicorn    |
| **Language**         | Python 3.11+                  |
| **Databases**        | PostgreSQL 16, Redis 7.2      |
| **Message Broker**   | RabbitMQ 3.11                 |
| **Object Storage**   | MinIO (S3-compatible)         |
| **Authentication**   | Keycloak 25                   |
| **Async Jobs**       | Celery + RabbitMQ             |
| **Containerization** | Docker 24+, Docker Compose 2+ |
| **CI/CD**            | GitHub Actions (planned)      |
| **Infrastructure**   | Kubernetes (planned for prod) |

---

## 📁 Project Structure

```
komkom/
├── infra/
│   ├── docker/
│   │   ├── docker-compose.yml          # Dev infrastructure
│   │   ├── traefik/                    # Reverse proxy config
│   │   ├── keycloak/                   # Identity provider config
│   │   ├── postgres/                   # Database init scripts
│   │   ├── redis/                      # Cache config
│   │   ├── rabbitmq/                   # Message broker init
│   │   └── minio/                      # S3-compatible storage
│   ├── k8s/                            # Kubernetes manifests (prod)
│   └── scripts/                        # Infrastructure utilities
│
├── services/
│   ├── products_catalog_service/       # Product management
│   ├── cart_service/                   # Shopping cart (Redis-backed)
│   ├── orders_service/                 # Order processing & payment
│   └── common_libs/                    # Shared utilities & DTOs
│
├── workers/
│   └── celery_worker/                  # Async tasks (invoice, notifications)
│
├── scripts/                            # Root-level utilities
├── docs/                               # Documentation & design
├── .github/workflows/                  # CI/CD pipelines
├── Makefile                            # Development commands
├── docker-compose.yml                  # Dev setup (reference)
├── .env.example                        # Environment template
└── README.md                           # This file
```

---

## 🎯 Quick Start

### Prerequisites

- Docker 24+ & Docker Compose 2+
- Python 3.11+ (for local development)
- Make (optional, but recommended)
- Git

### 1. Clone & Setup

```bash
git clone <repo-url> komkom
cd komkom

# Copy environment file
make env-setup
# Or manually: cp .env.example .env
```

### 2. Start Infrastructure

```bash
# Start all services
make up

# Or with docker-compose directly
docker-compose -f infra/docker/docker-compose.yml up -d
```

### 3. Verify Services

```bash
# Check running containers
make ps

# Health check
make health-check
```

### 4. Access Services

| Service                     | URL                       | Credentials           |
| --------------------------- | ------------------------- | --------------------- |
| **Traefik Dashboard** | http://localhost:8080     | -                     |
| **Keycloak Admin**    | http://keycloak.localhost | admin/admin           |
| **Products API**      | http://products.localhost | -                     |
| **Cart API**          | http://cart.localhost     | -                     |
| **Orders API**        | http://orders.localhost   | -                     |
| **PgAdmin**           | http://localhost:5050     | pgadmin@local/pgadmin |
| **MinIO Console**     | http://localhost:9001     | minioadmin/minioadmin |
| **RabbitMQ UI**       | http://localhost:15672    | rabbit/rabbit         |

---

## 📦 Services

### Products Catalog Service

Manages product information, inventory, and caching.

- **Technology**: FastAPI, PostgreSQL, Redis
- **Port**: 8000 (internal) / http://products.localhost
- **Database**: Products table in PostgreSQL
- **Cache**: Redis database 0
- **Events**: Publishes `product.created`, `product.updated`

### Cart Service

Redis-backed shopping cart with distributed locks for concurrent operations.

- **Technology**: FastAPI, Redis
- **Port**: 8000 (internal) / http://cart.localhost
- **Storage**: Redis database 1 (cart data)
- **Features**: Add/remove items, list items, clear cart
- **Concurrency**: Distributed locks using Redis

### Orders Service

Order processing with saga pattern for transaction integrity.

- **Technology**: FastAPI, PostgreSQL, RabbitMQ
- **Port**: 8000 (internal) / http://orders.localhost
- **Database**: Orders table in PostgreSQL
- **Cache**: Redis database 2 (sessions)
- **Events**: Consumes `product.created`, publishes `order.created`, `order.confirmed`

### Celery Worker

Async job processor for background tasks.

- **Technology**: Celery, RabbitMQ, Redis
- **Broker**: RabbitMQ
- **Backend**: Redis
- **Tasks**: Invoice generation, notifications, file uploads

---

## 👨‍💻 Development

### Common Commands

```bash
# Start/stop services
make up
make down
make restart

# View logs
make logs
make logs-products_service

# Run tests
make test

# Code quality
make lint
make format

# Database
make migrate
make seed
make reset-db

# Open interactive shell in service
make shell-products_service
make bash-worker
```

### Project Standards

#### Code Organization

- **API Routes**: `app/src/api/` - Route handlers
- **Models**: `app/src/models/` - ORM/database models
- **Schemas**: `app/src/schemas/` - Pydantic DTOs
- **CRUD**: `app/src/crud/` - Database operations
- **Services**: `app/src/services/` - Business logic
- **Events**: `app/src/events/` - Event pub/sub

#### Environment Variables

All sensitive values come from `.env`:

```bash
# Copy template
cp .env.example .env

# Edit with your values
vim .env

# Load in docker-compose (already configured)
```

#### Testing

Each service has a `tests/` directory:

```bash
# Run all tests
make test

# Run service-specific tests
pytest services/products_catalog_service/tests/
```

#### Migrations (if using database)

Each service with a database has `alembic/` for migrations:

```bash
# Generate migration
alembic revision --autogenerate -m "Add users table"

# Apply migration
alembic upgrade head
```

---

## 📚 Documentation

| Document                                    | Purpose                                  |
| ------------------------------------------- | ---------------------------------------- |
| [STRUCT_PROJECT.md](docs/md/STRUCT_PROJECT.md) | Detailed project structure & conventions |
| [DESIGN_APP.md](docs/md/DESIGN_APP.md)         | Design system & Figma specifications     |
| [USE_CASES.md](docs/md/USE_CASES.md)           | Features by user role                    |
| [SCREEN_ROLE.md](docs/md/SCREEN_ROLE.md)       | UI screen flows & layouts                |

### API Documentation

Each service exposes OpenAPI docs:

```
GET /docs     - Swagger UI
GET /redoc    - ReDoc
GET /openapi.json - OpenAPI spec
```

---

## 🔐 Security Best Practices

- **Never commit `.env`** — use `.env.example` as template
- **Rotate credentials** in production
- **Use Keycloak** for all authentication
- **Enable TLS** in production (Traefik with Let's Encrypt)
- **Enable CORS** only for trusted origins
- **Use secrets management** (HashiCorp Vault, AWS Secrets Manager)
- **Audit RabbitMQ events** for compliance

---

## 📈 Deployment (Planned)

### Development

- Docker Compose (current)

### Staging / Production

- **Kubernetes** with Helm charts (in `infra/k8s/`)
- **Managed services**: RDS, ElastiCache, MSK
- **CI/CD**: GitHub Actions → ECR → EKS
- **Monitoring**: Prometheus + Grafana (planned)
- **Logging**: ELK Stack or CloudWatch (planned)

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Follow code standards (see Development)
3. Run tests: `make test`
4. Submit pull request

---

## 📝 License

MIT License - See LICENSE file

---

## 📞 Support

For questions or issues:

- Check [documentation](docs/md/)
- Open GitHub issue with details
- Contact: support@komkom.io

---

**Happy coding! 🚀**
