# `@frontend/components`

Components shared between applications using Inera Design System.

## Theming

Color variables are different in the different inera themes so they need to be mapped correctly with component specific mapping. Here is an example using tooltip component:

Add variable in `src/themes/base.ts`

```typescript
export const baseTheme = {
  ...
  'tooltip-color': '#000',
  'tooltip-border-color': 'var(--color-stone-clear)',
}
```

Suffixes defines what part of the component is styled:

- `-color` referes to component text color
- `-border-color`
- `-background-color`

Other themes should inherit from "base"
