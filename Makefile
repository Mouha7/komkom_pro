.PHONY: help up down restart logs clean install test build lint migrate seed

# Docker Compose file location
COMPOSE_FILE = infra/docker/docker-compose.yml
COMPOSE_CMD = docker-compose -f $(COMPOSE_FILE)

# Default target
help:
	@echo "╔════════════════════════════════════════════════════════════════╗"
	@echo "║         KOMKOM - Monorepo Microservices Platform               ║"
	@echo "╚════════════════════════════════════════════════════════════════╝"
	@echo ""
	@echo "🚀 DOCKER & INFRASTRUCTURE:"
	@echo "  make up                - Start all docker containers (dev)"
	@echo "  make down              - Stop all containers"
	@echo "  make restart           - Restart all containers"
	@echo "  make logs              - Tail logs from all services"
	@echo "  make logs-service NAME - Tail logs from specific service (e.g., products_service)"
	@echo "  make clean             - Remove stopped containers and volumes"
	@echo "  make build             - Build all Docker images"
	@echo ""
	@echo "📦 DEVELOPMENT:"
	@echo "  make install           - Install Python dependencies for development"
	@echo "  make test              - Run test suite for all services"
	@echo "  make lint              - Run linters (flake8, isort, black)"
	@echo "  make format            - Format code (black, isort)"
	@echo ""
	@echo "🗄️  DATABASE & MIGRATIONS:"
	@echo "  make migrate           - Run database migrations for all services"
	@echo "  make seed              - Seed database with sample data"
	@echo "  make reset-db          - Drop and recreate database (CAUTION)"
	@echo ""
	@echo "📊 SERVICES MANAGEMENT:"
	@echo "  make ps                - Show running containers"
	@echo "  make shell SERVICE     - Open shell in SERVICE container (e.g., products_service)"
	@echo "  make bash-worker       - Open shell in celery_worker container"
	@echo ""
	@echo "🔧 UTILITIES:"
	@echo "  make env-setup         - Copy .env.example to .env (first time setup)"
	@echo "  make health-check      - Check health of all services"
	@echo ""
	@echo "Example workflow:"
	@echo "  make env-setup         # First time"
	@echo "  make up                # Start services"
	@echo "  make migrate           # Run migrations"
	@echo "  make seed              # Add test data"
	@echo "  make test              # Run tests"

# ================================
# Docker & Infrastructure
# ================================

up:
	@echo "🚀 Starting all services..."
	$(COMPOSE_CMD) up -d
	@echo "✅ Services started. Check logs with: make logs"

down:
	@echo "🛑 Stopping all services..."
	$(COMPOSE_CMD) down
	@echo "✅ Services stopped"

restart:
	@echo "🔄 Restarting all services..."
	$(COMPOSE_CMD) restart
	@echo "✅ Services restarted"

logs:
	$(COMPOSE_CMD) logs -f

logs-%:
	$(COMPOSE_CMD) logs -f $*

build:
	@echo "🔨 Building all Docker images..."
	$(COMPOSE_CMD) build --no-cache
	@echo "✅ Build complete"

clean:
	@echo "🧹 Cleaning up containers and volumes..."
	$(COMPOSE_CMD) down -v
	@echo "✅ Cleanup complete"

ps:
	@echo "📊 Running containers:"
	$(COMPOSE_CMD) ps

# ================================
# Service Shells
# ================================

shell-%:
	@echo "🐚 Opening shell in $* container..."
	$(COMPOSE_CMD) exec $* /bin/bash

bash-worker:
	@echo "🐚 Opening shell in celery_worker..."
	$(COMPOSE_CMD) exec celery_worker /bin/bash

# ================================
# Health Check
# ================================

health-check:
	@echo "🏥 Checking service health..."
	@echo "Traefik: http://localhost:8080"
	@echo "Keycloak: http://keycloak.localhost"
	@echo "Products: http://products.localhost"
	@echo "Cart: http://cart.localhost"
	@echo "Orders: http://orders.localhost"
	@echo "PgAdmin: http://localhost:5050"
	@echo "MinIO Console: http://localhost:9001"
	@echo "RabbitMQ: http://localhost:15672"
	@curl -s http://localhost:8080/ping || echo "❌ Traefik not responding"
	@docker-compose -f $(COMPOSE_FILE) exec -T redis redis-cli ping | grep -q PONG && echo "✅ Redis OK" || echo "❌ Redis not responding"

# ================================
# Development Setup
# ================================

env-setup:
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "✅ Created .env from .env.example"; \
	else \
		echo "⚠️  .env already exists"; \
	fi

install:
	@echo "📦 Installing Python dependencies..."
	find services workers -name "requirements.txt" -type f | while read f; do \
		dir=$$(dirname $$f); \
		echo "Installing $$dir..."; \
		pip install -r $$f; \
	done
	@echo "✅ Dependencies installed"

# ================================
# Database & Migrations
# ================================

migrate:
	@echo "🔄 Running database migrations..."
	@echo "Note: Implement Alembic migration commands per service"
	@echo "Placeholder: migrations will be implemented in each service"

seed:
	@echo "🌱 Seeding database..."
	@echo "Placeholder: seed scripts to be implemented"

reset-db:
	@echo "⚠️  WARNING: This will DROP all data!"
	@read -p "Continue? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker volume rm komkom_pro_pgdata || true; \
		$(COMPOSE_CMD) down -v; \
		$(COMPOSE_CMD) up -d postgres; \
		sleep 5; \
		echo "✅ Database reset complete"; \
	else \
		echo "Cancelled"; \
	fi

# ================================
# Testing & Code Quality
# ================================

test:
	@echo "🧪 Running tests..."
	@echo "Placeholder: test suite to be implemented"

lint:
	@echo "🔍 Running linters..."
	@find services workers -name "*.py" -type f | xargs flake8 --ignore=E501,W503 || echo "flake8 not installed"
	@find services workers -name "*.py" -type f | xargs isort --check-only || echo "isort not installed"

format:
	@echo "🎨 Formatting code..."
	@find services workers -name "*.py" -type f | xargs black --quiet || echo "black not installed"
	@find services workers -name "*.py" -type f | xargs isort --quiet || echo "isort not installed"
	@echo "✅ Code formatted"

# ================================
# Documentation & Helpers
# ================================

docs:
	@echo "📚 Opening documentation..."
	@echo "Design: docs/md/DESIGN_APP.md"
	@echo "Structure: docs/md/STRUCT_PROJECT.md"
	@echo "Use Cases: docs/md/USE_CASES.md"
	@echo "Screens: docs/md/SCREEN_ROLE.md"

status:
	@echo "📊 Project Status:"
	@echo "  Services created: $(shell ls -d services/*/ 2>/dev/null | wc -l)"
	@echo "  Docker images: $(shell docker images | tail -n +2 | grep komkom | wc -l)"
	@echo "  Containers running: $(shell $(COMPOSE_CMD) ps --services --filter "status=running" | wc -l)"

version:
	@echo "KomKom v1.0.0-dev"
	@docker --version
	@docker-compose --version
