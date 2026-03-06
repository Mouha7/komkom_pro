### Frontend — Organisation Web & Mobile avec React & React Native

Tu as déjà posé les bases du backend, maintenant il faut mettre en place la partie **frontend**. L’idée est de séparer clairement **web** et **mobile**, tout en gardant une logique commune (API clients, DTOs, design system).

---

## 1. Structure des dossiers

```
frontend/
├── web/                        # Application web (React + Vite)
│   ├── public/                 # assets statiques (favicon, logos)
│   ├── src/
│   │   ├── api/                # clients HTTP vers services backend
│   │   │   ├── cart.ts
│   │   │   ├── orders.ts
│   │   │   └── products.ts
│   │   ├── components/         # UI réutilisable (atoms, molecules, organisms)
│   │   ├── layouts/            # Layouts globaux (AppShell, AdminLayout)
│   │   ├── pages/              # Pages (si Next.js) ou views (si Vite + React Router)
│   │   ├── hooks/              # hooks custom (useAuth, useCart, useOrders)
│   │   ├── context/            # React context (AuthContext, CartContext)
│   │   ├── styles/             # TailwindCSS / SCSS / tokens
│   │   ├── utils/              # helpers (formatPrice, dateUtils)
│   │   └── config/             # env vars, endpoints
│   ├── tests/                  # tests unitaires et e2e (Jest, Playwright)
│   ├── Dockerfile
│   └── README.md
│
└── mobile/                     # Application mobile (React Native / Expo)
    ├── assets/                 # images, fonts
    ├── src/
    │   ├── api/                # clients HTTP vers services backend
    │   ├── components/         # UI réutilisable (Button, Input, Card)
    │   ├── navigation/         # React Navigation (stack, tabs)
    │   ├── screens/            # écrans (Home, ProductDetail, Cart, Checkout, Orders, Profile)
    │   ├── context/            # AuthContext, CartContext
    │   ├── hooks/              # hooks custom (useAuth, useCart)
    │   ├── styles/             # design tokens, theme
    │   ├── utils/              # helpers
    │   └── config/             # env vars, endpoints
    ├── tests/                  # tests unitaires et e2e (Jest, Detox)
    ├── App.tsx
    ├── Dockerfile
    └── README.md
```

---

## 2. Initialisation des projets

### Web (React + ViteJS)

Tu connais déjà Vite, donc voici la commande standard :

```bash
# Créer projet React avec Vite
npm create vite@latest web -- --template react-ts

cd web
npm install
npm run dev
```

Cela crée un projet React TypeScript avec Vite. Tu peux ensuite ajouter TailwindCSS ou Material UI pour le design.

### Mobile (React Native / Expo)

Pour React Native, le plus simple est **Expo** (qui gère bundling, dev server, build APK/IPA).

```bash
# Installer Expo CLI
npm install -g expo-cli

# Créer projet Expo React Native
expo init mobile

# Choisir template "blank (TypeScript)"
cd mobile
npm start
```

Expo gère le bundling, le hot reload et les builds. Tu peux ensuite ajouter **React Navigation** :

```bash
npm install @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
```

---

## 3. Est-ce que créer les dossiers à la main pose problème ?

- **Web (Vite)** : si tu crées juste un dossier `frontend/web` à la main et copies ton code, ça ne pose pas de souci. Mais il faut que le projet ait été initialisé avec `npm create vite` pour avoir la config (`vite.config.ts`, `tsconfig.json`, etc.).
- **Mobile (React Native/Expo)** : même logique. Tu peux créer `frontend/mobile` à la main, mais il faut passer par `expo init` ou `npx react-native init` pour générer la config (`app.json`, `metro.config.js`, etc.). Sinon tu risques des soucis de build.

👉 Donc : **ne crée pas les projets à la main** sans passer par les commandes d’init, car tu manqueras de fichiers de configuration essentiels. Tu peux créer les dossiers vides (`frontend/web`, `frontend/mobile`) pour organiser ton repo, mais initialise chaque projet avec les commandes officielles à l’intérieur.

---

## 4. Intégration avec le backend existant

- **API clients** : chaque frontend (web/mobile) aura un dossier `api/` avec clients vers `cart_service`, `orders_service`, `products_catalog_service`.
- **Auth** : intégrer Keycloak via OIDC (PKCE flow pour mobile, cookie/session pour web).
- **DTOs** : réutiliser les schémas définis dans `common_libs/dto` pour éviter divergence.
- **Images** : upload via presigned URL MinIO (frontend → MinIO direct).
- **Config** : endpoints exposés par Traefik (`products.localhost`, `cart.localhost`, `orders.localhost`).

---

## 5. Bonnes pratiques

- **Design system partagé** : tokens (couleurs, spacing, typographie) communs entre web et mobile.
- **Factorisation logique** : hooks/context identiques (auth, cart) pour cohérence UX.
- **Tests** : Jest pour unitaires, Playwright pour web e2e, Detox pour mobile e2e.
- **CI/CD** : pipeline build web (Next.js ou Vite → static export ou SSR), mobile (Expo → build APK/IPA).
- **Observabilité** : logs frontend (Sentry), metrics usage (Google Analytics ou équivalent).

---

👉 Tu veux que je te prépare maintenant un **guide pratique pas à pas** pour connecter le frontend (web & mobile) au backend (auth Keycloak + API clients vers services) afin que tu puisses tester rapidement un flow complet (login → browse products → add to cart → checkout) ?
