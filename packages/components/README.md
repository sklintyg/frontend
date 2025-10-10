# `@frontend/components`

Components shared between applications using Inera Design System.

## Theming

Color variables are different in the different inera themes so they need to be mapped to IDS defined colors. Here is an example from the tooltip component:

```tsx
function TooltipContent() {
  const theme = useContext(ThemeContext)

  return (
    <div
      style={{
        color: theme === 'inera-admin' ? 'var(--IDS-COLOR-NEUTRAL-20)' : '#000',
        borderColor:
          theme === 'inera-admin'
            ? 'var(--IDS-COLOR-NEUTRAL-40)'
            : 'var(--color-stone-clear)',
      }}
    />
  )
}
```

Using the ThemeContext we can get the correct theme.
