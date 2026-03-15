### **Components**

Ce document décrit en détail la  **convention** , l’architecture et les bonnes pratiques pour le dossier `src/components` du projet mobile (React Native / Expo). Il couvre la  **nomenclature** , le contenu attendu dans chaque sous-dossier (`atoms`, `molecules`, `organisms`), les patterns de développement, le typage TypeScript, le style, l’accessibilité, les tests et l’intégration Storybook.

---

### **Arborescence recommandée et fichiers attendus**

```
src/components/
├── atoms/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.styles.ts
│   │   ├── Button.types.ts
│   │   ├── Button.test.tsx
│   │   └── Button.stories.tsx
│   ├── Input/
│   └── Text/
├── molecules/
│   ├── ProductCard/
│   │   ├── ProductCard.tsx
│   │   ├── ProductCard.styles.ts
│   │   ├── ProductCard.types.ts
│   │   ├── ProductCard.test.tsx
│   │   └── ProductCard.stories.tsx
│   └── CartItem/
├── organisms/
│   ├── CartList/
│   │   ├── CartList.tsx
│   │   ├── CartList.styles.ts
│   │   ├── CartList.types.ts
│   │   ├── CartList.test.tsx
│   │   └── CartList.stories.tsx
│   └── OrderList/
├── index.ts
└── README.md
```

**Remarques**

* **Chaque composant**
  vit dans son propre dossier.
* **Fichiers standards**
  : Component.tsx, Component.styles.ts, Component.types.ts, Component.test.tsx, Component.stories.tsx.
* `index.ts` à la racine de `components` exporte les composants publics.

---

### **Règles de conception et nomenclature**

* **Noms**
  : PascalCase pour dossiers et fichiers composants (ProductCard, CartItem).
* **Types**
  : suffixe .types.ts pour interfaces/props. Exporter Props et types utilitaires.
* **Styles**
  : suffixe .styles.ts pour StyleSheet ou styled components. Ne pas mélanger styles inline et stylesheets sans raison.
* **Tests**
  : suffixe .test.tsx avec Jest + React Native Testing Library.
* **Stories**
  : suffixe .stories.tsx pour Storybook.
* **Exports**
  : fichier index.ts dans chaque dossier exporte le composant par défaut et types si nécessaire.

---

### **Atomes règles et exemples**

**But** : composants UI élémentaires, sans logique métier, hautement réutilisables.

**Exemples** : `Button`, `Input`, `Icon`, `Text`.

**Button.types.ts**

```ts
export type ButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  testID?: string;
};
```

**Button.tsx**

```tsx
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { styles } from './Button.styles';
import { ButtonProps } from './Button.types';

export const Button: React.FC<ButtonProps> = ({ title, onPress, variant='primary', disabled=false, testID }) => (
  <TouchableOpacity style={[styles.base, styles[variant], disabled && styles.disabled]} onPress={onPress} disabled={disabled} testID={testID}>
    <Text style={styles.text}>{title}</Text>
  </TouchableOpacity>
);
```

**Principes**

* **Props minimalistes**
  et typées.
* **Aucune logique métier**
  : pas d’appels API, pas de navigation.
* **Accessibilité**
  : accessibilityRole, accessible, accessibilityLabel si nécessaire.
* **Theming**
  : utiliser useTheme() ou tokens depuis src/styles.

---

### **Molecules règles et exemples**

**But** : composition d’atomes pour former des blocs réutilisables avec un peu de logique.

**Exemples** : `ProductCard` (image, title, price, add to cart), `CartItem`.

**ProductCard.types.ts**

```ts
export type ProductCardProps = {
  productId: string;
  name: string;
  price: number;
  imageUrl?: string;
  onAddToCart?: (productId: string) => void;
};
```

**ProductCard.tsx**

* Compose `Image`, `Text`, `Button`.
* Gère callbacks simples (`onAddToCart`).
* Ne fait pas de fetch interne ; reçoit données via props.

**Principes**

* **Stateless autant que possible**
  ; si state local nécessaire, le limiter (ex. animation).
* **Props explicites**
  : éviter any.
* **Tests**
  : vérifier rendu, interactions (press add to cart), accessibilité.

---

### **Organisms règles et exemples**

**But** : composants complexes composés de molecules et atoms, contiennent logique d’affichage et orchestration locale.

**Exemples** : `CartList` (liste d’items, total, actions), `OrderList`.

**CartList.types.ts**

```ts
export type CartListProps = {
  items: CartItemDTO[];
  onRemoveItem: (productId: string) => void;
  onUpdateQty: (productId: string, qty: number) => void;
  onCheckout: () => void;
};
```

**CartList.tsx**

* Utilise `FlatList` pour performance.
* Calcule `subtotal` via helper utilitaire (non via API).
* Déclenche `onCheckout` qui appelle `cart_service` via hook/context.

**Principes**

* **Séparer logique métier**
  : heavy logic (checkout orchestration) doit rester dans hooks ou context (useCart, CartContext).
* **Performance**
  : keyExtractor, memo, useCallback pour éviter rerenders.
* **Responsabilité**
  : organisms orchestrent UI, pas side effects réseau lourds.

---

### **Styles et theming**

* **Utiliser tokens**
  depuis src/styles (colors, spacing, typography).
* **Fichier styles**
  : Component.styles.ts exporte styles via StyleSheet.create.
* **Dark mode**
  : composants doivent consommer useTheme() et appliquer theme.colors.
* **Ne pas**
  hardcoder couleurs ou espacements.

**Exemple styles**

```ts
import { StyleSheet } from 'react-native';
import { spacing } from 'src/styles/spacing';
import { typography } from 'src/styles/typography';
import { lightColors } from 'src/styles/colors';

export const styles = StyleSheet.create({
  container: { padding: spacing.s3, backgroundColor: lightColors.surface },
  title: { ...typography.h2, color: lightColors.textPrimary },
});
```

---

### **Accessibilité et internationalisation**

* **Accessibilité**
  : chaque composant interactif doit définir accessibilityRole, accessibilityLabel, accessible. Tester avec VoiceOver/TalkBack.
* **Focus management**
  : gérer focus pour inputs et modals.
* **i18n**
  : ne pas hardcoder textes ; utiliser i18n.t('key'). Fournir props testID pour tests.

---

### **Typage TypeScript et contrats**

* **Props**
  : définir interfaces claires dans Component.types.ts.
* **DTOs**
  : réutiliser common_libs/dto pour types partagés (ProductDTO, CartItemDTO).
* **No any**
  : éviter any. Utiliser unknown si nécessaire puis valider.
* **Default props**
  : définir valeurs par défaut et documenter.

---

### **Tests unitaires et e2e**

* **Unit tests**
  : Jest + React Native Testing Library. Tester rendu, interactions, snapshots si utile.
* **Integration tests**
  : tests de composants qui consomment context via providers mockés.
* **E2E**
  : Detox pour flows critiques (add to cart → checkout).
* **Coverage**
  : viser couverture raisonnable pour composants critiques.

**Exemple test**

```ts
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';

test('renders and triggers onPress', () => {
  const onPress = jest.fn();
  const { getByText } = render(<Button title="Add" onPress={onPress} />);
  fireEvent.press(getByText('Add'));
  expect(onPress).toHaveBeenCalled();
});
```

---

### **Storybook et documentation visuelle**

* **Stories**
  : chaque composant a un fichier .stories.tsx couvrant variants, states (loading, disabled, error).
* **Knobs / Controls**
  : exposer props modifiables pour QA et designers.
* **Snapshots visuels**
  : utiliser Chromatic ou Percy pour regression visuelle.

---

### **Exports et indexation**

* **index.ts**
  à la racine src/components exporte composants publics :

```ts
export { Button } from './atoms/Button/Button';
export { Input } from './atoms/Input/Input';
export { ProductCard } from './molecules/ProductCard/ProductCard';
export { CartList } from './organisms/CartList/CartList';
```

* **Barrel files**
  : optionnel index.ts dans chaque dossier pour exports locaux.

---

### **Patterns d’intégration avec context et hooks**

* **Hooks**
  : useCart() expose addItem, removeItem, updateQty, checkout. Les composants appellent ces hooks, pas directement services HTTP.
* **Context providers**
  : AuthProvider, CartProvider wrap l’app dans App.tsx.
* **Separation of concerns**
  : composants UI restent découplés de la logique réseau.

---

### **Checklist de création d’un nouveau composant**

1. Créer dossier `src/components/<level>/<ComponentName>`.
2. Ajouter `Component.tsx`, `Component.styles.ts`, `Component.types.ts`.
3. Implémenter tests `Component.test.tsx`.
4. Ajouter story `Component.stories.tsx`.
5. Exporter dans `src/components/index.ts`.
6. Documenter usage dans README local si nécessaire.
7. Vérifier accessibilité et i18n.
8. Ajouter tests unitaires et storybook preview.
9. Valider linting et build.

---

### **Bonnes pratiques et pièges à éviter**

* **Ne pas**
  faire d’appels réseau dans atoms ou molecules.
* **Éviter**
  logique métier lourde dans organisms ; déléguer aux hooks/services.
* **Favoriser**
  composition plutôt que héritage.
* **Optimiser**
  performance : memo, useCallback, FlatList optimisé.
* **Documenter**
  chaque composant non trivial dans son README local.
* **Respecter**
  tokens de styles pour cohérence cross platform.

---

Ce README est conçu pour être la référence unique des composants UI. Mets‑le à jour à chaque ajout majeur et applique ces règles pour garantir un design system cohérent, testable et maintenable. Si tu veux, je peux générer des templates de fichiers (Button, ProductCard, CartList) prêts à coller dans le repo.
