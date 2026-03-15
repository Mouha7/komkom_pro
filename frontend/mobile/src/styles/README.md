### **Styles**

Ce document décrit la  **convention** , l’architecture et les bonnes pratiques pour le dossier `styles/` du projet mobile (React Native / Expo). Il explique ce que contiennent  **colors.ts** , **spacing.ts** et  **typography.ts** , comment les utiliser, comment étendre les tokens et comment les intégrer dans l’application.

---

### **Objectifs**

* Centraliser les **design tokens** (couleurs, espacements, typographie) pour garantir cohérence UI entre écrans et plateformes.
* Fournir des **types TypeScript** et des exports clairs pour une utilisation simple et sûre.
* Supporter **thèmes** (light / dark) et faciliter l’évolution du design system.
* Rendre les tokens réutilisables côté **web** et  **mobile** .

---

### **Structure des fichiers**

```
src/
└── styles/
    ├── colors.ts
    ├── spacing.ts
    └── typography.ts
```

**Rôle de chaque fichier**

* **colors.ts**

  Contient la palette de couleurs (tokens nominaux et palette neutre), les objets lightTheme et darkTheme et l’export d’un type ThemeColors. Fournit noms stables (ex. primary, secondary, neutral-100) et variables utilitaires (ex. transparent, danger).
* **spacing.ts**

  Définit l’échelle d’espacements (scale) utilisée partout : marges, paddings, gaps. Exporte un tableau/objet spacing et des helpers s(n) pour obtenir une valeur en pixels.
* **typography.ts**

  Définit les tokens typographiques : fontSizes, lineHeights, fontWeights, letterSpacings, et des styles typographiques réutilisables (heading1, body, caption). Exporte types et helpers pour StyleSheet.

---

### **Conventions et nomenclature**

* **Couleurs** : utiliser des noms sémantiques plutôt que descriptifs visuels.
  * **Sémantiques** : primary, secondary, success, warning, danger, info.
  * **Neutres** : neutral-0 (blanc) → neutral-900 (noir) ou neutral-50 → neutral-900.
  * **Usage** : background, surface, text-primary, text-secondary, border.
* **Espacements** : échelle modulaire (ex. base = 4).
  * Noms : `s0`, `s1`, `s2`, … ou `xs`, `sm`, `md`, `lg`.
  * Recommandation : `spacing[0] = 4`, `spacing[1] = 8`, `spacing[2] = 12`, `spacing[3] = 16`, `spacing[4] = 24`, `spacing[5] = 32`.
* | **Typographie** |
  | :-------------------: |

  * `fontSizes` en `px` ou `rem` équivalent ; `lineHeights` en `px`.
  * Styles réutilisables : `h1`, `h2`, `bodyLarge`, `body`, `caption`.
* **Thèmes** : exporter lightTheme et darkTheme comme objets conformes au type Theme.

---

### **Exemple de contenu minimal pour colors.ts**

```ts
export type ThemeColors = {
  primary: string;
  primaryVariant: string;
  secondary: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  danger: string;
  transparent: string;
};

export const lightColors: ThemeColors = {
  primary: "#0B5FFF",
  primaryVariant: "#0846D6",
  secondary: "#00A86B",
  background: "#FFFFFF",
  surface: "#F7F8FA",
  textPrimary: "#0B1B2B",
  textSecondary: "#5B6B7A",
  border: "#E6E9EE",
  success: "#2ECC71",
  warning: "#F39C12",
  danger: "#E74C3C",
  transparent: "transparent",
};

export const darkColors: ThemeColors = {
  primary: "#7EA8FF",
  primaryVariant: "#5F8FE6",
  secondary: "#6EE7B7",
  background: "#0B1220",
  surface: "#0F1724",
  textPrimary: "#E6EEF6",
  textSecondary: "#AAB7C6",
  border: "#1F2A37",
  success: "#4CD08A",
  warning: "#F6B24A",
  danger: "#FF7A6A",
  transparent: "transparent",
};
```

---

### **Exemple de contenu minimal pour spacing.ts**

```ts
export const spacing = {
  s0: 4,
  s1: 8,
  s2: 12,
  s3: 16,
  s4: 24,
  s5: 32,
  s6: 40,
};

export const s = (index: keyof typeof spacing) => spacing[index];
```

---

### **Exemple de contenu minimal pour typography.ts**

```ts
export const fontSizes = {
  h1: 28,
  h2: 22,
  h3: 18,
  bodyLarge: 16,
  body: 14,
  caption: 12,
};

export const lineHeights = {
  h1: 34,
  h2: 28,
  h3: 24,
  body: 20,
  caption: 16,
};

export const fontWeights = {
  regular: "400",
  medium: "500",
  bold: "700",
};

export const typography = {
  h1: { fontSize: fontSizes.h1, lineHeight: lineHeights.h1, fontWeight: fontWeights.bold },
  body: { fontSize: fontSizes.body, lineHeight: lineHeights.body, fontWeight: fontWeights.regular },
  caption: { fontSize: fontSizes.caption, lineHeight: lineHeights.caption, fontWeight: fontWeights.regular },
};
```

---

### **Utilisation dans le code React Native**

* **Hook useTheme**
  (exemple simple)

```ts
// src/styles/useTheme.ts
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext"; // à implémenter

export const useTheme = () => {
  const { theme } = useContext(ThemeContext);
  return theme;
};
```

* **StyleSheet avec tokens**

```ts
import { StyleSheet } from "react-native";
import { typography } from "../styles/typography";
import { spacing } from "../styles/spacing";
import { lightColors } from "../styles/colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColors.background,
    padding: spacing.s3,
  },
  title: {
    ...typography.h1,
    color: lightColors.textPrimary,
  },
});
```

---

### **Thèmes et dark mode**

* **Approche** : stocker le thème courant dans ThemeContext et fournir toggleTheme() ; utiliser Appearance API pour valeur par défaut.
* **Export** : export type Theme = { colors: ThemeColors; spacing: typeof spacing; typography: typeof typography }.
* **Consommation** : composants utilisent useTheme() pour récupérer theme.colors, theme.spacing, theme.typography.

---

### **Accessibilité et contraste**

* Respecter **WCAG AA** pour le contraste texte/fond.
* Fournir tokens `textPrimary` et `textSecondary` avec contraste suffisant.
* Prévoir `highContrast` variant si nécessaire.

---

### **Bonnes pratiques d’évolution**

* **Ne pas**
  utiliser de couleurs hex ad hoc dans les composants : toujours référencer theme.colors.*.
* **Ajouter**
  un token uniquement si réutilisé ; éviter duplication.
* **Documenter**
  chaque nouveau token dans ce README et dans le fichier correspondant.
* **Versionner**
  les tokens si breaking change (ex. v1, v2) pour faciliter migration.
* **Tests visuels** : utiliser Storybook pour vérifier composants avec différents thèmes et tokens.

---

### **Tests et validation**

* **Unit tests** : vérifier que spacing.s(n) retourne la valeur attendue, que typography.h1 contient fontSize.
* **Visual regression** : Storybook + Chromatic ou Percy pour détecter régressions visuelles lors de changements de tokens.

---

### **Ajout d’un nouveau token**

1. Ajouter la valeur dans le fichier approprié (`colors.ts`, `spacing.ts` ou `typography.ts`).
2. Mettre à jour le type exporté si nécessaire.
3. Rechercher et remplacer usages temporaires (si migration).
4. Ajouter une entrée dans ce README décrivant l’usage du token.
5. Exécuter tests unitaires et visual tests.

---

### **Intégration web**

* Les mêmes fichiers TypeScript peuvent être importés côté web (Vite) pour garantir cohérence.
* Adapter unités si nécessaire (ex. `rem` pour web) : fournir helpers de conversion si besoin.

---

### **Checklist rapide pour les devs**

* Importer tokens via `import { lightColors } from "src/styles/colors"`.
* Ne pas hardcoder valeurs de couleur/espacement/typographie.
* Utiliser `useTheme()` pour accéder au thème courant.
* Documenter tout nouveau token dans ce README.
* Ajouter tests unitaires pour nouveaux helpers.

---

Ce README est conçu pour être vivant : **mets‑le à jour** à chaque ajout ou modification de tokens. Si tu veux, je peux générer les fichiers `colors.ts`, `spacing.ts` et `typography.ts` complets et typés prêts à coller dans `src/styles/`.
