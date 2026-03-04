### **Prompt prêt à coller (FR)**

**Contexte (à inclure en début du prompt)**
KomKom — MVP B2B marketplace pour quincailleries. Backend micro‑services (Traefik, Keycloak, Redis, RabbitMQ/Celery, MinIO, Postgres). Front mobile : Buyer (propriétaire magasin), Employee (sous‑compte), Admin (panel responsive mobile). Génère uniquement **écrans mobile** (taille iPhone 13/14). Langue principale :  **français** . Couleur principale fournie :  **#ED762F** .

**Objectif**
Générer en une seule passe un fichier Figma esthétique, cohérent et prêt à l’emploi contenant : tous les écrans mobiles listés ci‑dessous, une **bibliothèque de composants réutilisables** (Design System / Components page), et une palette de couleurs optimisée autour de #ED762F. Respecter bonnes pratiques UI/UX mobile (accessibilité, performance, minimalisme couleur, composants factorisés, idempotence UX pour checkout).

---

**Palette de couleurs (tokens à créer automatiquement autour de #ED762F)**

* **Primary**
  : #ED762F
* **Primary Dark**
  : #C55A1F
* **Primary Light**
  : #F7E6D9
* **Neutral 900 (text)**
  : #0F1724
* **Neutral 700**
  : #374151
* **Neutral 300 (borders / disabled)**
  : #D1D5DB
* **Neutral 100 (background)**
  : #F3F4F6
* **Success**
  : #16A34A
* **Danger**
  : #DC2626
* **Warning**
  : #F59E0B
* **Info**
  : #0EA5E9

**Contraintes palette** : limiter à ces 10 tokens + variantes d’opacité; privilégier contraste élevé pour textes et CTA; éviter plus de 3 couleurs d’accent.

---

**Typographie & spacing**

* Police principale sans‑serif moderne (ex. Inter / SF Pro) ;  **H1 20–24** , H2 16–18, Body 14, Small 12.
* System spacing scale : 4 / 8 / 12 / 16 / 24 / 32.
* Boutons tappables ≥44px.

---

**Screens à générer (mobile only)**

**Communs (réutilisables pour tous les rôles)**

* Splash / Welcome
* Login / Signup (Keycloak OIDC style)
* Home (Category carousel + Search bar)
* Product List (grid + list view, filters, skeleton loaders)
* Product Detail (gallery, unit, price, stock badge, add-to-cart)
* Cart (Redis‑backed cart UX : local instant update + sync)
* Checkout (Delivery GPS picker, address, notes, review, confirm)
* Order Confirmation (summary + idempotency token feedback)
* Order History (list + filters)
* Order Detail / Tracking (timeline component)
* Profile / Store Profile (edit business info, GPS)
* Toasts / Modals / Confirm dialogs / Empty states / Error states
* Notifications UI (in‑app notification list + push style banners)

**Buyer (Hardware Store Owner)**

* Employee Management (list, invite modal, role assign, revoke)
* Store Dashboard (basic stats, quick actions)

**Employee**

* Simplified Home (same browse flow, no store edit)
* My Orders (employee-specific view)

**Admin (mobile responsive)**

* Admin Home (orders summary, quick filters)
* Product Management (list + product editor modal)
* Category Management (list + editor)
* Order Management (order list + detail with admin actions: change status, assign delivery, add delivery fee)
* Store Management (list, suspend account, export action modal)

---

**Composants à factoriser (livrer en tant que variants / tokens)**

* **AppShell**
  : Header (search, cart icon, profile), BottomNav.
* **ProductCard**
  : image, title, unit, price, stock badge, CTA.
* **ProductGallery**
  : progressive image loader, placeholder.
* **CartItem**
  : qty stepper, price snapshot, remove.
* **OrderTimeline**
  : status dots + timestamps + admin action buttons.
* **Form components**
  : Input, Select, GPS picker, Phone input, Validation messages.
* **Buttons**
  : Primary, Secondary, Ghost, IconButton (with disabled states).
* **Badges**
  : stock (Available / Not Available), status.
* **Notification Banner**
  : success/info/warning/error variants.
* **Skeleton loaders**
  and Empty states.
* **Icon set**
  : minimal, line icons for common actions.

**Livrables composants** : variants (hover/pressed/disabled), tokens (colors, spacing, typography), naming convention (BEM-like or DS tokens), auto layout constraints.

---

**Design rules & UX constraints à appliquer**

* Prioriser lisibilité et CTA visibles.
* Skeleton loaders pour listes produits.
* Optimistic UI pour add-to-cart avec rollback.
* Désactiver CTA checkout après première soumission et afficher spinner + message idempotence.
* Notifications : in‑app list + top banner for real‑time updates (order status).
* Images : proposer placeholders et recommandations d’export (WebP, 1x/2x).
* Accessibilité : contrast ratio ≥4.5:1 pour textes principaux.
* Minimiser couleurs : utiliser neutrals + primary + semantic colors.

---

**Fichier Figma attendu (instructions de sortie)**

* Un seul fichier Figma mobile (iPhone 13/14) contenant :
  1. **Pages**
     : 01_Screens, 02_Components, 03_DesignTokens, 04_Assets, 05_Docs (notes d’utilisation).
  2. **Components page**
     : tous les composants listés en variants.
  3. **Design tokens**
     : couleurs, typographie, spacing exportables.
  4. **Naming & structure**
     : routes/screens nommés en français (ex. Accueil, Produit / Détail, Panier, Commande / Suivi).
  5. **Exportable assets**
     : icônes et images optimisées.
  6. **Notes**
     : recommandations pour dev (taille des boutons, tokens hex, comportement offline cart).

---

**Texte & microcopy**

* Langue : français. Fournir microcopy pour boutons et messages clés (ex. “Ajouter au panier”, “Valider la commande”, “Commande confirmée”, “Erreur réseau — réessayer”).

---

**Notifications & Alerts**

* Designer des **push banners** (top) et  **in‑app notification list** . Variants : info, success, warning, error. Inclure icône, titre, message, timestamp, action rapide (ex. “Voir commande”).

---

**Contraintes techniques & export**

* Utiliser Auto Layout pour composants.
* Préparer composants pour export en SVG/PNG/WebP.
* Fournir tokens nommés (ex. --color-primary, --spacing-16) pour intégration front.
* Indiquer tailles d’icônes (24/32/44).

---

**Remarque sur outils alternatifs (si tu veux tester autre chose que Banani)**

* **Figma**
  (gratuit/freemium) — standard pour design + collaboration.
* **Uizard**
  (freemium) — génération UI rapide, utile si tu veux itérations automatiques.
* **Penpot**
  (open source) — alternative gratuite pour design vectoriel et composants.
  Banani est adapté pour génération rapide ; si tu veux plus de contrôle collaboratif et édition manuelle, Figma (après génération) est recommandé.

---

**Instruction finale courte à coller telle quelle**

> Génère un fichier Figma mobile (iPhone 13/14) pour l’app KomKom (B2B quincaillerie). Utilise la couleur principale #ED762F et crée la palette et tokens fournis. Produis tous les écrans mobiles listés (Buyer, Employee, Admin responsive) et une page Components (variants, design tokens, auto layout). Respecte les règles UX/performances et fournis microcopy en français. Inclure notifications (banners + in‑app list), skeleton loaders, idempotency UX pour checkout, et recommandations d’export (WebP, SVG). Structure le fichier en pages : Screens, Components, DesignTokens, Assets, Docs. Nommer les écrans en français.

---

Si tu veux, je peux maintenant :

* **adapter ce prompt**
  en version courte (1–2 phrases) pour coller directement dans l’interface Banani, ou
* **fournir un checklist**
  pour vérifier le fichier Figma reçu (composants, tokens, exports).
