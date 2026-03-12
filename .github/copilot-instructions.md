# Copilot Repository Instructions - KomKom

## Mission
Tu travailles sur un monorepo e-commerce microservices.
Objectif principal: produire du code lisible, testable, maintenable, sans regression, sans spaghetti code, et sans complexite inutile.

## Regles non negociables
- Toujours preferer des changements minimaux, cibles, et compatibles avec l'existant.
- Ne jamais introduire de feature non demandee.
- Ne jamais casser un contrat API, schema de message, ou comportement public sans l'annoncer et le justifier.
- Ne jamais hardcoder de secret, token, mot de passe, URL sensible.
- Ne jamais dupliquer de logique metier si une implementation existe deja dans le service ou dans `services/common_libs`.
- Ne jamais ajouter une nouvelle couche d'architecture sans besoin explicite.

## Clean Code applique au quotidien
### SOLID
- Single Responsibility: une fonction, une classe, un module = une responsabilite claire.
- Open/Closed: etendre par composition et petites abstractions, eviter de modifier des blocs stables sans necessite.
- Liskov: les implementations remplacables doivent garder le meme comportement attendu.
- Interface Segregation: preferer des interfaces/dependances petites et utiles.
- Dependency Inversion: dependre d'abstractions utiles (services, interfaces), pas de details techniques melanges a la logique metier.

### DRY
- Extraire les duplications de logique metier significative.
- Ne pas sur-factoriser pour 2 lignes triviales: lisibilite d'abord.

### KISS
- Solution la plus simple qui marche et qui se teste facilement.
- Eviter les patterns "enterprise" si un code direct est plus clair.

### YAGNI
- Pas d'abstraction "au cas ou".
- Pas de parametres/options non utilises.
- Pas d'optimisation prematuree.

## Architecture du repo a respecter
- Backend principal: Python + FastAPI + Pydantic + SQLAlchemy + Alembic.
- Frontend web: React + TypeScript (strict).
- Frontend mobile: React Native + Expo + TypeScript.
- Async/events: RabbitMQ + Celery workers.
- Shared code: `services/common_libs`.

Respecter les separations existantes:
- routes/api -> orchestration HTTP
- services -> logique metier
- crud/repository -> acces donnees
- schemas/dto -> contrats entree/sortie
- models -> persistance

## Regles Backend (Python/FastAPI)
- Typage obligatoire sur fonctions publiques et logique metier.
- Validation des entrees/sorties via Pydantic.
- I/O externes en async/await quand le composant est async.
- Gestion d'erreur explicite, messages clairs, pas de stack trace brute exposee en API.
- Eviter les fonctions longues: decouper en petites unites testables.
- Conserver les migrations DB avec Alembic pour tout changement de schema.
- Respecter les conventions de logging structure et propagation de request_id/correlation_id.

## Regles Frontend (Web + Mobile)
- TypeScript strict: eviter `any` sauf justification explicite.
- Composants fonctionnels et hooks.
- Garder la logique metier hors des composants UI quand possible (hooks/services/api).
- Toujours gerer explicitement: loading, erreur, et etat vide.
- Eviter les composants monolithiques: extraire les sous-composants lisibles.
- Ne pas coupler fortement UI et contrats API: passer par couches utilitaires existantes dans `src/api`.

## Regles Workers et Messaging
- Taches idempotentes par defaut.
- Retries limites avec backoff si applicable.
- Contrats de messages stables: ne pas changer payload/routing sans impact analysis.
- Effets de bord explicites et journalises.

## Securite et robustesse
- Interdire tout secret en dur.
- Sanitiser/valider les donnees externes.
- Respecter authn/authz existante (JWT/roles/scopes) et ne jamais la contourner.
- Ne pas logguer de donnees sensibles.

## Regles anti-regression avant de terminer une tache
Toujours executer les verifications pertinentes sur la zone modifiee.

### A la racine du repo
- `make lint`
- `make test`
- `make build`

### Frontend web
Dans `frontend/web`:
- `npm run lint`
- `npm run build`

### Frontend mobile
Dans `frontend/mobile`:
- `npm run start` (verification de lancement)

Si toutes les commandes ne sont pas executables dans le contexte courant, documenter clairement ce qui a ete execute et ce qui reste a valider.

## Qualite des changements
- Conserver le style local du fichier modifie.
- Ajouter des commentaires uniquement quand la logique est non triviale.
- Eviter les renommages/refactors massifs non demandes.
- Mettre a jour la documentation impactee si comportement/contrat change.

## Definition of Done pour chaque demande
- Le besoin utilisateur est couvert sans ajout hors scope.
- Le code reste simple, lisible et coherent avec l'architecture.
- Les validations pertinentes sont lancees ou explicitement listees.
- Aucun risque de regression connu n'est laisse sans note explicite.

## En cas de doute
- Preferer la solution la plus simple et reversible.
- Demander confirmation avant un changement structurel (contrat API, schema DB, event schema, architecture).