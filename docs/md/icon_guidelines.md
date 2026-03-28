# Icon Guidelines (Web + Mobile)

## Objectif

Assurer une coherence visuelle et fonctionnelle des icones entre:

- frontend/web
- frontend/mobile

## Bibliotheques retenues

- Web: lucide-react
- Mobile: lucide-react-native

## Composants centralises

- Web: frontend/web/src/components/Icon/Icon.tsx
- Mobile: frontend/mobile/src/components/atoms/Icon/Icon.tsx

Toujours utiliser ces composants. Eviter les imports directs Lucide dans les ecrans/features.

## Noms d'icones partages

Noms coeur (10):

- home
- cart
- package
- user
- settings
- search
- plus
- minus
- close
- check

Noms systeme (etats UI):

- alert
- info

## Regles d'usage

- Utiliser `name` (semantique) et non un composant Lucide direct.
- Garder `size` et `strokeWidth` coherents selon le contexte UI.
- Fournir un label d'accessibilite quand l'icone porte du sens:
  - Web: `ariaLabel`
  - Mobile: `accessibilityLabel`
- Pour un bouton de fermeture, utiliser `name="close"` et un label explicite.

## AppBar et BottomBar

- AppBar reusable: frontend/mobile/src/components/molecules/AppBar/AppBar.tsx
- BottomBar reusable: frontend/mobile/src/components/molecules/BottomBar/BottomBar.tsx
- Les deux composants utilisent `useSafeAreaInsets()` (react-native-safe-area-context):
  - AppBar applique l'inset top pour ne pas recouvrir la barre systeme haute.
  - BottomBar applique l'inset bottom pour rester au-dessus de la zone geste/navigation.
- Ne pas re-appliquer un `SafeAreaView` top/bottom sur un ecran qui utilise deja AppBar + BottomBar.
- Taille recommandee des actions de navigation:
  - Zone tactile minimale: 44x44
  - Taille d'icone action: 22-24

## Exemples

Web:

```tsx
<Icon name="cart" size={20} ariaLabel="Panier" />
```

Mobile:

```tsx
<Icon name="check" size={18} accessibilityLabel="Succes" />
```

## A ne pas faire

- Ne pas utiliser des symboles texte comme icones (`X`, `!`, `i`, `[]`).
- Ne pas multiplier des mappings locaux differents d'un ecran a l'autre.
- Ne pas introduire une nouvelle librairie d'icones sans validation architecture.
