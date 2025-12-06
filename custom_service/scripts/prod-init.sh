#!/usr/bin/env bash
set -euo pipefail

# scripts/prod-init.sh
# Usage examples:
#   ./scripts/prod-init.sh                # crée les volumes par défaut (interactive)
#   ./scripts/prod-init.sh --yes --prefix komkom_   # crée sans demande de confirmation, avec préfixe
#   ./scripts/prod-init.sh --dry-run --prefix komkom_  # affiche les actions sans exécution
#   ./scripts/prod-init.sh --include-html --yes      # inclut dolibarr_html/docs
#
# But: créer les volumes externes requis avant d'exécuter "docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d"

PROGNAME="$(basename "$0")"

DEFAULT_VOLUMES=(postgres_app_data dolibarr_db_data keycloak_db_data redis_data mimio_images)
HTML_VOLUMES=(dolibarr_html dolibarr_docs)

PREFIX=""
DRY_RUN=false
ASSUME_YES=false
INCLUDE_HTML=false

print_help() {
  cat <<EOF
$PROGNAME - Initialise les volumes Docker externes pour la prod.

Options:
  --prefix PREFIX       Ajoute un préfixe aux noms de volumes (ex: komkom_)
  --include-html        Ajoute les volumes dolibarr_html et dolibarr_docs
  --dry-run             N'exécute pas les commandes, affiche seulement ce qui serait fait
  --yes                 Ne demande pas de confirmation interactive (assume 'oui')
  --help                Affiche cette aide
EOF
}

# Parse args
while (( "$#" )); do
  case "$1" in
    --prefix)
      if [ -z "${2-}" ]; then
        echo "Erreur: --prefix nécessite un argument" >&2
        exit 2
      fi
      PREFIX="$2"
      shift 2
      ;;
    --include-html)
      INCLUDE_HTML=true
      shift
      ;;
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --yes)
      ASSUME_YES=true
      shift
      ;;
    --help|-h)
      print_help
      exit 0
      ;;
    *)
      echo "Option inconnue: $1" >&2
      print_help
      exit 2
      ;;
  esac
done

# Check docker availability
if ! command -v docker >/dev/null 2>&1; then
  echo "docker n'est pas installé / accessible dans PATH. Abandon." >&2
  exit 3
fi

VOLUMES=("${DEFAULT_VOLUMES[@]}")
if [ "$INCLUDE_HTML" = true ]; then
  VOLUMES+=("${HTML_VOLUMES[@]}")
fi

echo "Volumes à traiter:"
for v in "${VOLUMES[@]}"; do
  echo "  - ${PREFIX}${v}"
done

if [ "$DRY_RUN" = true ]; then
  echo "Mode dry-run activé. Aucune création ne sera effectuée."
fi

if [ "$ASSUME_YES" = false ] && [ "$DRY_RUN" = false ]; then
  read -r -p "Continuer et créer les volumes manquants ? [y/N] " answer
  case "$answer" in
    [yY][eE][sS]|[yY]) ;;
    *) echo "Annulé."; exit 0 ;;
  esac
fi

# Create volumes if not exists
created_any=false
for v in "${VOLUMES[@]}"; do
  name="${PREFIX}${v}"
  if docker volume inspect "$name" >/dev/null 2>&1; then
    echo "OK: volume existant -> $name"
  else
    created_any=true
    if [ "$DRY_RUN" = true ]; then
      echo "DRY-RUN: docker volume create --name $name"
    else
      echo "Création du volume: $name"
      if docker volume create --name "$name" >/dev/null; then
        echo "  -> créé: $name"
      else
        echo "  !! Erreur lors de la création de $name" >&2
      fi
    fi
  fi
done

if [ "$DRY_RUN" = false ] && [ "$created_any" = true ]; then
  echo "Tous les volumes demandés ont été traités."
elif [ "$DRY_RUN" = false ]; then
  echo "Aucun volume à créer. Tout est déjà en place."
fi

echo "Vérification finale (liste des volumes concernés):"
for v in "${VOLUMES[@]}"; do
  name="${PREFIX}${v}"
  if docker volume inspect "$name" >/dev/null 2>&1; then
    echo "  - $name (exists)"
  else
    echo "  - $name (MISSING)"
  fi
done

echo "Terminé."
