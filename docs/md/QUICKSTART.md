# 🚀 KomKom QUICKSTART

Get KomKom running in **2 minutes**.

## Step 1: Initialize Environment (30 seconds)

```bash
cd /Users/mac/Documents/Freelance/komkom_pro
make env-setup   # Creates .env from .env.example
```

## Step 2: Start All Services (30 seconds)

```bash
make up          # Starts docker-compose with all 9 services
```

Wait 10-15 seconds for services to initialize...

## Step 3: Verify Everything Works (30 seconds)

```bash
make health-check      # Or manually check URLs below
```

## 🌐 Access Your Services

| Service                     | URL                       | Credentials             |
| --------------------------- | ------------------------- | ----------------------- |
| **Traefik Dashboard** | http://localhost:8080     | —                      |
| **Keycloak**          | http://keycloak.localhost | admin / admin           |
| **Products API**      | http://products.localhost | —                      |
| **Cart API**          | http://cart.localhost     | —                      |
| **Orders API**        | http://orders.localhost   | —                      |
| **RabbitMQ**          | http://localhost:15672    | rabbit / rabbit         |
| **MinIO**             | http://localhost:9001     | minioadmin / minioadmin |
| **PgAdmin**           | http://localhost:5050     | pgadmin@local / pgadmin |

## ⏹️ Stop Services

```bash
make down
```

## 📋 Common Commands

```bash
make help           # View all 30+ commands
make logs          # Follow all logs
make ps            # See running containers
make test          # Run tests
make lint          # Check code quality
```

## 📚 Learn More

- Full docs: [README.md](README.md)
- Architecture: [docs/md/STRUCT_PROJECT.md](docs/md/STRUCT_PROJECT.md)
- Service details: [services/*/README.md](services)
- Implementation status: [IMPLEMENTATION_SUMMARY.md](docs/md/IMPLEMENTATION_SUMMARY.md)

## ⚡ Next Steps

1. **View logs** `make logs`
2. **Open Keycloak**: http://keycloak.localhost
3. **Create a realm & users** for testing
4. **Start implementing services** per [services/products_catalog_service/README.md](services/products_catalog_service/README.md)

**Done!** Your microservices platform is ready for development. 🎉

---

For issues: Check logs with `make logs` or review service READMEs.
