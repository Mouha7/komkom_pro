### Sécurité

Ce document décrit les **règles, configurations et bonnes pratiques de sécurité** à appliquer pour le projet **KomKom** (MVP). Le texte est en **français** ; les noms de variables, endpoints, clés et codes restent en **anglais** tels qu’utilisés dans le code et la configuration.

---

### Principes généraux

- **Principe du moindre privilège** : chaque service, compte et utilisateur n’obtient que les permissions strictement nécessaires.
- **Sécurité en profondeur** : combiner isolation réseau, authentification forte, chiffrement, contrôle d’accès, sauvegardes et traçabilité.
- **Sécurité par défaut** : en production, refuser tout accès non explicitement autorisé.
- **Traçabilité** : propager `X-Request-Id` / `correlation_id` et conserver logs d’audit pour actions sensibles.
- **Automatisation** : provisionner et configurer via scripts et IaC pour réduire erreurs manuelles.

---

### Réseau et infrastructure

- **Segmentation réseau**
  - **Réseau public** : seul **Traefik** exposé au public.
  - **Réseau interne** : services (FastAPI), DB, Redis, RabbitMQ, MinIO sur réseau interne isolé.
- **Ingress et TLS**
  - TLS obligatoire pour tout trafic externe.
  - Utiliser **cert-manager** ou Let’s Encrypt en prod.
  - Traefik doit faire **forwardAuth** vers Keycloak pour routes protégées.
- **Firewall et sécurité cloud**
  - Restreindre IPs d’administration (management UIs) via firewall ou VPN.
  - Désactiver ports management en prod (ex. RabbitMQ management UI) ou restreindre accès.
- **Network policies** (Kubernetes)
  - Appliquer NetworkPolicy pour limiter communications inter‑pods selon besoin.

---

### Authentification et autorisation

- **Keycloak** comme fournisseur OIDC/OAuth2.
  - Configurer realms, clients, roles (`admin`, `buyer`, `employee`).
  - Exiger `aud`, `iss`, `exp` dans les JWT.
- **Validation JWT**
  - Services valident signature via `JWKS` endpoint (`KEYCLOAK_JWKS_URL`).
  - Vérifier `scope` et `roles` côté API.
- **Gestion des sessions**
  - Tokens courts côté client ; utiliser refresh tokens avec rotation si nécessaire.
- **RBAC**
  - Implémenter checks côté service (ne pas se fier uniquement à Keycloak pour logique métier).
- **MFA et comptes admin**
  - Activer MFA pour comptes admin et accès sensibles.

---

### Gestion des secrets et configuration

- **Ne jamais committer** secrets dans le repo. Utiliser `.env.example` sans valeurs sensibles.
- **Stockage des secrets**
  - En dev : Docker secrets ou fichiers chiffrés.
  - En prod : HashiCorp Vault, AWS Secrets Manager, ou Kubernetes Secrets chiffrés.
- **Rotation des secrets**
  - Planifier rotation régulière des credentials (DB, MinIO, RabbitMQ).
- **Variables sensibles** (exemples) : `DATABASE_URL`, `REDIS_URL`, `RABBITMQ_URL`, `MINIO_ROOT_USER`, `MINIO_ROOT_PASSWORD`, `KEYCLOAK_ADMIN_PASSWORD`.
- **Accès minimal** : chaque service a son propre user/credential avec permissions limitées (vhost RabbitMQ, schema DB).

---

### Protection des données et stockage

- **Chiffrement en transit** : TLS pour toutes les communications (HTTPs, amqps, redis tls, minio https).
- **Chiffrement au repos** : activer chiffrement disque pour volumes (Postgres, MinIO, backups).
- **Backups**
  - Postgres : backups réguliers (pg_dump / pgbackrest) + tests de restauration.
  - MinIO : lifecycle + réplication ou sauvegarde périodique.
  - Redis : AOF/RDB + réplication ; sauvegardes planifiées.
- **Rétention et purge** : définir politiques de rétention pour données sensibles et logs.
- **Accès aux données** : limiter accès direct à la DB ; privilégier API.

---

### Messaging, workers et fiabilité

- **RabbitMQ**
  - Utiliser vhosts et users distincts par environnement/service.
  - Activer TLS pour amqps en prod.
  - Déclarer exchanges/queues via scripts d’infra (idempotent).
  - Configurer **DLX** et retry policies (delayed exchange ou TTL queues).
- **Celery**
  - `acks_late=True`, `task_reject_on_worker_lost=True`.
  - Configurer `max_retries` et `retry_backoff`.
  - Tasks idempotentes : vérifier existence avant action (ex. invoice).
- **Correlations**
  - Propager `correlation_id` et `X-Request-Id` dans messages pour traçabilité.

---

### Sécurité des services et bonnes pratiques applicatives

- **Validation et sanitation**
  - Valider toutes les entrées via Pydantic schemas.
  - Échapper/sanitiser données avant stockage ou affichage.
- **Idempotence**
  - `POST /orders` accepte `Idempotency-Key` ; stocker token et refuser duplications.
- **Gestion des erreurs**
  - Ne pas exposer stack traces en prod ; renvoyer erreurs standardisées.
- **Limitation de débit**
  - Rate limiting côté Traefik ; protection contre bruteforce et abus.
- **Protection contre attaques courantes**
  - CSRF pour endpoints web si nécessaire ; XSS mitigation côté front ; SQL injection évité via ORM/paramétrisation.
- **Logging sécurisé**
  - Logs structurés JSON ; ne jamais logguer secrets ; mask des tokens.
- **Content Security**
  - Headers de sécurité (CSP, HSTS, X-Frame-Options, X-Content-Type-Options).

---

### CI/CD, déploiement et hardening

- **Pipeline sécurisé**
  - CI exécute lint, tests unitaires, scans vulnérabilités, build images signées.
  - Secrets en CI via vault ou secret store, pas en variables plain text.
- **Images et runtime**
  - Images multi‑stage, user non‑root, dépendances pinées.
  - Scanner images (Snyk, Trivy).
- **Kubernetes hardening**
  - PodSecurityPolicies / PodSecurity admission, RBAC strict, resource limits.
- **Rollback et canary**
  - Déploiements canary ou blue/green pour réduire risque.
- **Healthchecks**
  - readiness/liveness probes pour tous les services.

---

### Observabilité et réponse aux incidents

- **Monitoring**
  - Metrics (Prometheus), traces (OpenTelemetry), logs centralisés (Loki/ELK).
- **Alerting**
  - Alertes sur erreurs 5xx, queue length RabbitMQ, échecs de workers, backups failed.
- **Plan d’incident**
  - Playbook : identification, confinement, remédiation, postmortem.
  - Contacts d’urgence et accès restreint aux runbooks.
- **Forensics**
  - Conserver logs d’audit suffisants pour enquêtes ; horodatage UTC.

---

### Checklist sécurité avant mise en production

- [ ] TLS configuré et validé pour tous les endpoints.
- [ ] Keycloak configuré avec realms, clients et roles.
- [ ] Secrets migrés vers Vault ou secret manager.
- [ ] Backups Postgres et MinIO automatisés et testés.
- [ ] RabbitMQ vhosts/users créés et TLS activé.
- [ ] Redis configuré en mode persistant et répliqué.
- [ ] Images scannées et signées.
- [ ] Healthchecks et probes définis.
- [ ] Rate limiting et WAF si nécessaire.
- [ ] Monitoring et alerting en place.
- [ ] Playbook incident et runbooks disponibles.

---

### Annexes et recommandations opérationnelles

- **Accès management UI** : restreindre Admin UIs (Keycloak console, RabbitMQ management, MinIO console) à IPs spécifiques ou via VPN.
- **Rotation clés API** : automatiser rotation et révocation.
- **Tests de sécurité** : pentest périodique avant go‑live.
- **Formation** : sensibiliser l’équipe aux bonnes pratiques (gestion secrets, phishing).
