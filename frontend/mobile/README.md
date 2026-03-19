# 📱 Frontend Mobile — Documentation des écrans, menus et gestion des rôles

Ce document décrit en détail la structure du projet **frontend/mobile** (React Native/Expo), les écrans à implémenter, les menus de navigation, ainsi que la gestion des rôles utilisateurs (admin, buyer, employee). Il inclut également la représentation des fichiers et dossiers attendus dans chaque partie du projet.

## Demarrage Expo Go (anti "Failed to download remote update")

Utilise cette sequence dans `frontend/mobile`:

1. `npm install`
2. `npm run start:stable`
3. Scanner le QR depuis l'app Expo Go (pas depuis l'app camera)

Commande recommandee pour eviter les conflits de port Metro:

- `npm run start:stable` : tue les anciens process Metro (8081/8082), puis lance Expo Go en LAN, cache vide, port 8081 fixe
- `npm run start:stable:tunnel` : meme strategie avec tunnel ngrok

Scripts disponibles:

- `npm start` : demarrage LAN (par defaut)
- `npm run start:clear` : LAN + cache Metro vide
- `npm run start:go:lan` : Expo Go explicite + LAN + cache vide + port 8081
- `npm run start:go:tunnel` : Expo Go explicite + tunnel + cache vide + port 8081
- `npm run start:kill-metro` : stoppe les process Metro sur 8081/8082
- `npm run start:lan` : reseau local explicite
- `npm run start:tunnel` : tunnel ngrok, uniquement si le compte ngrok est verifie
- `npm run start:tunnel:clear` : tunnel + cache Metro vide
- `npm run start:localhost` : emulateur local uniquement

Si l'erreur persiste:

- Verifier que le Mac et le telephone sont sur le meme reseau Wi-Fi
- Lancer Expo depuis `frontend/mobile`, pas depuis la racine du monorepo
- Verifier que le telephone a internet (4G/5G ou Wi-Fi)
- Mettre a jour Expo Go sur le telephone
- Redemarrer Metro avec `npm run start:clear`
- Si port deja utilise, executer `npm run start:kill-metro` puis `npm run start:stable`
- Si le QR vient d'un mode dev client, relancer en Expo Go standard avec `npm start`
- Si `npm run start:tunnel` echoue avec `ERR_NGROK_4018`, verifier le compte ngrok et l'email sur ngrok.com avant de reutiliser le tunnel
- Si le tunnel echoue avec `failed to start tunnel` ou `remote gone away`, verifier d'abord la config locale ngrok avec `ngrok config check`, puis relancer `npm run start:stable:tunnel`

## Development Build (EAS) au lieu de Expo Go

Pourquoi l'utiliser:

- Plus robuste pour les projets qui depassent les limites Expo Go
- Runtime natif de ton application (pas le runtime generique Expo Go)
- Compatible avec des modules natifs non supportes dans Expo Go

Important:

- Le dev client a toujours besoin d'acceder au serveur Metro pour le JS bundle
- Donc un probleme LAN/tunnel peut encore impacter le hot reload, mais tu supprimes la couche Expo Go

Sequence recommandee (premiere installation):

1. `npm install`
2. `npm run eas:login`
3. `npm run build:dev:android` (installe ensuite l'apk sur le telephone Android)
4. `npm run build:dev:ios` (installe ensuite la build iOS sur iPhone via lien EAS)

Note iOS:

- Sur iPhone physique, un premier build peut demander une etape interactive Apple Developer (Apple ID + validation credentials).
- Si besoin, lancer explicitement: `npm run build:dev:ios:interactive`
- Pour tester seulement sur simulateur iOS: `npm run build:dev:ios:simulator`

Lancement au quotidien apres installation du dev client:

- `npm run start:dev:lan`
- ou `npm run start:dev:tunnel`

Astuce:

- Si le LAN reste instable, utilise `npm run start:dev:tunnel` pour les tests sur telephones physiques

---

## 🌳 Structure des fichiers

```
.
├── .gitignore
├── App.tsx                     # Point d’entrée de l’application
├── Dockerfile                  # Build CI/CD pour mobile
├── app.json                    # Configuration Expo
├── assets/                     # Icônes, splash, fonts
│   ├── android-icon-background.png
│   ├── android-icon-foreground.png
│   ├── android-icon-monochrome.png
│   ├── favicon.png
│   ├── icon.png
│   └── splash-icon.png
├── index.ts                    # Bootstrap Expo
├── package-lock.json
├── package.json
├── src/
│   ├── api/                    # Clients HTTP vers backend
│   │   ├── cart.ts
│   │   ├── orders.ts
│   │   └── products.ts
│   ├── components/             # UI réutilisable
│   │   ├── atoms/              # Boutons, Inputs, Text
│   │   ├── molecules/          # ProductCard, CartItem
│   │   └── organisms/          # CartList, OrderList
│   ├── config/                 # Variables d’environnement, endpoints
│   │   └── index.ts
│   ├── context/                # Contexts globaux
│   │   ├── AuthContext.tsx
│   │   ├── CartContext.tsx
│   │   └── OrdersContext.tsx
│   ├── hooks/                  # Hooks custom
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   └── useOrders.ts
│   ├── navigation/             # Configuration navigation
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   ├── BottomTabNavigator.tsx
│   │   └── AdminTabNavigator.tsx
│   ├── screens/                # Écrans principaux
│   │   ├── Auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── SignupScreen.tsx
│   │   │   └── SplashScreen.tsx
│   │   ├── Catalog/
│   │   │   ├── HomeScreen.tsx
│   │   │   └── ProductDetailScreen.tsx
│   │   ├── Cart/
│   │   │   ├── CartScreen.tsx
│   │   │   └── CheckoutScreen.tsx
│   │   ├── Orders/
│   │   │   ├── OrdersScreen.tsx
│   │   │   └── OrderDetailScreen.tsx
│   │   ├── Profile/
│   │   │   ├── ProfileScreen.tsx
│   │   │   └── SettingsScreen.tsx
│   │   └── Admin/
│   │       ├── AdminDashboardScreen.tsx
│   │       ├── AdminProductsScreen.tsx
│   │       ├── AdminOrdersScreen.tsx
│   │       └── AdminStoresScreen.tsx
│   ├── styles/                 # Design tokens, thèmes
│   │   ├── colors.ts
│   │   ├── spacing.ts
│   │   └── typography.ts
│   └── utils/                  # Helpers
│       ├── formatPrice.ts
│       ├── dateUtils.ts
│       └── storageUtils.ts
└── tsconfig.json
```

---

## 🖼️ Écrans à implémenter

### Authentification

- **LoginScreen.tsx** : connexion via Keycloak (OIDC PKCE flow).
- **SignupScreen.tsx** : inscription (création de store).
- **SplashScreen.tsx** : écran de chargement initial (vérifie token).

### Catalogue produits

- **HomeScreen.tsx** : liste des produits (appel `products_catalog_service`).
- **ProductDetailScreen.tsx** : détail produit, ajout au panier.

### Panier

- **CartScreen.tsx** : affichage du panier (appel `cart_service`).
- **CheckoutScreen.tsx** : validation commande, choix livraison/paiement.

### Commandes

- **OrdersScreen.tsx** : historique des commandes (appel `orders_service`).
- **OrderDetailScreen.tsx** : détail d’une commande, suivi statut.

### Profil

- **ProfileScreen.tsx** : informations utilisateur, logout.
- **SettingsScreen.tsx** : préférences, langue, thème.

### Administration (role=admin)

- **AdminDashboardScreen.tsx** : vue globale (stores, commandes).
- **AdminProductsScreen.tsx** : gestion produits (CRUD).
- **AdminOrdersScreen.tsx** : gestion commandes (update status, assign delivery).
- **AdminStoresScreen.tsx** : gestion des magasins et employés.

---

## 🧭 Menus de navigation

- **BottomTabNavigator** (buyer/employee) :

  - Home
  - Cart
  - Orders
  - Profile
- **AdminTabNavigator** (admin) :

  - Dashboard
  - Products
  - Orders
  - Stores
- **StackNavigator** :

  - Auth flow (Splash → Login → Signup)
  - Main flow (Tabs)
  - Détails (ProductDetail, OrderDetail)

---

## 👥 Gestion des rôles

- **buyer** : accès aux écrans Home, ProductDetail, Cart, Checkout, Orders, Profile.
- **employee** : mêmes accès que buyer, mais liés au store de l’employeur.
- **admin** : accès aux écrans d’administration (Dashboard, Products, Orders, Stores).
- **middleware auth** : vérifie JWT via Keycloak, extrait rôle, injecte dans `AuthContext`.

---

## ✅ Tâches prioritaires

1. Configurer navigation (stack + tabs).
2. Implémenter `AuthContext` avec Keycloak OIDC.
3. Créer clients API (`cart.ts`, `orders.ts`, `products.ts`).
4. Développer écrans principaux (Home, ProductDetail, Cart, Checkout, Orders, Profile).
5. Ajouter écrans admin (Dashboard, Products, Orders, Stores).
6. Intégrer design system (styles, components).
7. Tester flows complets (login → browse → add to cart → checkout → orders).
8. Ajouter tests unitaires (Jest) et e2e (Detox).
9. Configurer CI/CD (Dockerfile + Expo EAS build).
