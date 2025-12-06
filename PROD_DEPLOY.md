# Déploiement production — préparation des volumes externes

## But

Ce document décrit les étapes à effectuer avant de lancer `docker compose up` en production pour s'assurer que les volumes de bases de données et de stockage sont créés et marqués comme "externes" (pas gérés/créés/supprimés automatiquement par Compose). En dev, tu peux continuer à utiliser le `docker-compose.yml` tel quel (Compose créera les volumes automatiquement).

## Prérequis

- Accès shell sur le serveur de production où Docker et Docker Compose v2 sont installés.
- Accès pour exécuter `docker volume create`.
- Copier (ou exporter) le fichier `.env` adapté à la prod sur le serveur (ou utiliser un `.env.production` et lancer avec `--env-file`).

## Volumes ciblés

Volumes utilisés par `docker-compose.yml` :

- `postgres_app_data` (Postgres app)
- `dolibarr_db_data` (MariaDB Dolibarr)
- `dolibarr_html` (fichiers html Dolibarr)
- `dolibarr_docs` (documents Dolibarr)
- `keycloak_db_data` (Postgres Keycloak)
- `redis_data` (Redis)
- `mimio_images` (stockage images)

## Recommandation

- En production, externaliser au minimum les volumes de DB et le stockage critique :
  - `postgres_app_data`, `dolibarr_db_data`, `keycloak_db_data`, `redis_data`, `mimio_images`
- Laisser `dolibarr_html` / `dolibarr_docs` selon ton besoin : si tu veux les gérer hors-compose, externalise-les aussi ; sinon laisse Compose les créer.

## Étapes — création des volumes (exemples)

Sur le serveur prod, exécute (exemple sans préfixe) :

```/Users/mac/Documents/Freelance/komkom_pro/PROD_DEPLOY.md#L220-260
# Créer les volumes avec les noms utilisés dans docker-compose.yml
docker volume create postgres_app_data
docker volume create dolibarr_db_data
docker volume create keycloak_db_data
docker volume create redis_data
docker volume create mimio_images
```

# depuis le dossier où se trouvent docker-compose.yml et docker-compose.prod.yml
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

## Script d'automatisation
Pour rendre le script exécutable et l'utiliser, exécute ces commandes depuis la racine du repo (exemples) :
```bash
chmod +x scripts/prod-init.sh
./scripts/prod-init.sh
```