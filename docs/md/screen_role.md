### **Écrans regroupés par rôle et menu (mobile)**

#### **Règles d’affichage**

* **Menu principal mobile**
  : barre inférieure (Bottom Nav) pour actions fréquentes ; menu secondaire (drawer / hamburger) pour actions moins fréquentes ou admin.
* **Nom des écrans**
  : en français (conforme au PDF).
* **Chaque ligne**
  du tableau = item de menu → sous‑pages / écrans associés.

---

### **Écrans communs (utilisables par tous les rôles)**

| **Menu / Item**         | **Sous‑pages / Écrans**                                                                       |
| ----------------------------- | ----------------------------------------------------------------------------------------------------- |
| **Accueil / Recherche** | Accueil (catégories + carrousel) ; Résultats recherche ; Filtres ; Favoris (optionnel)              |
| **Produit**             | Liste produits (par catégorie) ; Détail produit (gallery, specs, prix, stock) ; Produits similaires |
| **Panier**              | Panier (édition qty) ; Résumé prix ; Validation rapide                                             |
| **Checkout**            | Adresse / GPS picker ; Livraison & notes ; Récapitulatif ; Confirmation commande (idempotency)       |
| **Commandes**           | Historique commandes (liste) ; Détail commande ; Suivi / Timeline ; Facture / PDF (lien MinIO)       |
| **Profil**              | Profil utilisateur ; Profil magasin (pour owner) ; Paramètres compte ; Déconnexion                  |
| **Notifications**       | Liste notifications in‑app ; Banner push style ; Détail notification                                |

---

### **Buyer — Propriétaire du magasin (Bottom Nav recommandé : Accueil / Commandes / Panier / Employés / Profil)**

| **Menu / Item**       | **Sous‑pages / Écrans**                                                                   |
| --------------------------- | ------------------------------------------------------------------------------------------------- |
| **Accueil**           | Accueil (catégories, recherche) ; Favoris ; Promotions (si applicable)                           |
| **Catalogue**         | Liste produits par catégorie ; Recherche avancée ; Filtre (prix, disponibilité)                |
| **Produit / Détail** | Détail produit ; Ajouter au panier (modal qty) ; Voir images ; Voir unité (bag/ton/piece)       |
| **Panier**            | Panier (éditer qty, supprimer) ; Appliquer note de commande ; Estimation total                   |
| **Checkout**          | Sélection adresse / GPS ; Choix méthode paiement (offline MVP) ; Confirmation ; Récap commande |
| **Commandes**         | Historique commandes ; Filtrer par statut ; Détail commande ; Suivi (timeline)                   |
| **Employés**         | Liste employés ; Inviter employé (form) ; Modifier rôle ; Révoquer accès                     |
| **Profil magasin**    | Éditer infos (nom, activité, téléphone, GPS, ville/zone) ; Documents business                 |
| **Support / Aide**    | FAQ (MVP minimal) ; Contact admin (form)                                                          |
| **Notifications**     | Liste notifications ; Paramètres notifications                                                   |

---

### **Employee — Employé (Bottom Nav recommandé : Accueil / Commandes / Panier / Profil)**

| **Menu / Item**       | **Sous‑pages / Écrans**                                     |
| --------------------------- | ------------------------------------------------------------------- |
| **Accueil**           | Accueil simplifié (catégories + recherche)                        |
| **Catalogue**         | Liste produits ; Recherche ; Filtre basique                         |
| **Produit / Détail** | Détail produit ; Ajouter au panier                                 |
| **Panier**            | Panier (éditer qty) ; Checkout (si autorisé)                      |
| **Checkout**          | Validation commande (adresse du magasin préremplie) ; Confirmation |
| **Mes commandes**     | Historique personnel ; Détail commande ; Suivi                     |
| **Profil**            | Profil employé ; Changer mot de passe ; Déconnexion               |
| **Notifications**     | Liste notifications liées aux commandes                            |

---

### **Admin (KomKom Team) — Menu principal : Drawer / Admin Tab (Dashboard, Produits, Catégories, Commandes, Magasins, Exports)**

| **Menu / Item**               | **Sous‑pages / Écrans**                                                                                                                              |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Dashboard**                 | Vue synthétique (commandes récentes, alertes stock, KPI basiques)                                                                                          |
| **Gestion Produits**          | Liste produits ; Filtre / recherche ; Écran création produit (form: nom, catégorie, unité, prix, stock status, image) ; Écran édition produit          |
| **Gestion Catégories**       | Liste catégories ; Créer / éditer / supprimer catégorie                                                                                                  |
| **Gestion Commandes**         | Liste commandes (filtres par statut) ; Détail commande (items, store, GPS) ; Actions : changer statut, assigner livraison, ajouter frais livraison, annuler |
| **Gestion Magasins (Stores)** | Liste stores ; Détail store ; Suspendre / réactiver compte ; Voir employés du store                                                                       |
| **Livraison**                 | Assignation livraison (form) ; Liste livraisons en cours ; Ajouter frais livraison                                                                           |
| **Exports & Data**            | Export commandes / stores / produits (CSV/JSON) ; Paramètres export                                                                                         |
| **Utilisateurs & Rôles**     | Gestion comptes admin ; Logs d’activité (basique)                                                                                                          |
| **Notifications Admin**       | Alertes système (stock critique, erreurs DLQ)                                                                                                               |

---

### **Navigation et structure UX recommandées**

* **Bottom Nav (Buyer / Employee)**
  : 4–5 items max (Accueil, Commandes, Panier, Employés/Profil).
* **Admin**
  : accès via drawer ou onglet séparé (Admin) ; actions critiques (changer statut) en modal depuis Détail commande.
* **Global Header**
  : Search bar + icône Panier + icône Notifications + avatar profil.
* **Back navigation**
  : flèche en haut à gauche ; conserver titre clair.
* **Actions rapides**
  : CTA flottant “Ajouter au panier” sur Product Detail ; bouton “Valider” fixe en Checkout.

---

### **Correspondance écran ↔ composant réutilisable (pour dev)**

* **ProductCard**
  → utilisé dans Accueil, Liste produits, Recommandations.
* **ProductDetailModule**
  → Détail produit, modal quick view.
* **CartModule**
  → Panier, mini‑cart (header dropdown).
* **OrderTimeline**
  → Détail commande (buyer + admin).
* **EmployeeListItem**
  → Employés (owner) & Store detail (admin).
* **AdminActionBar**
  → boutons d’action dans Détail commande (Confirm, Assign, Cancel).

---

### **Remarques finales**

* Les **écrans communs** (Catalogue, Produit, Panier, Checkout, Commandes, Profil, Notifications) doivent être **identiques visuellement** entre Buyer et Employee ; seules les **permissions / actions** diffèrent.
* L’**Admin UI** peut être une version responsive (mobile‑first) mais avec des écrans et actions spécifiques (CRUD, assignation, export).
* Je peux maintenant **générer un fichier CSV/JSON** listant chaque écran avec sa route, son composant principal et ses props attendues pour que tu puisses l’importer dans ton backlog ou outil de design. Veux‑tu que je le prépare ?
