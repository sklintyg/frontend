# `@frontend/colors`

Inera IDS theme colors

## Extract IDS colors

With a browser we can extract all colors that is defined in IDS `:root, :host` to a JS object to be used inside tailwind.

```javascript
Array.from(document.styleSheets)
  .flatMap((sheet) =>
    Array.from(sheet.cssRules).flatMap((rule) =>
      rule.selectorText === ':root, :host'
        ? Array.from(rule.style)
            // Filter for color-related variables
            .filter(
              (name) =>
                name.startsWith('--IDS-COLOR-') && name.includes('COLOR')
            )
            .map((name) => [
              name.replace('--IDS-COLOR-', '').toLowerCase(), // Clean up the variable name
              `var(${name})`, // Keep the variable reference
            ])
        : []
    )
  )
  .reduce((result, [name, value]) => {
    const parts = name.match(/^(.+)-(\d+)$/) // Match the pattern name-code (e.g., blue-500)
    const baseName = parts ? parts[1] : name // Extract the base name
    const code = parts ? parts[2] : undefined // Extract the code (e.g., 500)

    // If there's a code, organize it under the base name, otherwise just store the value
    if (code) {
      return { ...result, [baseName]: { ...result[baseName], [code]: value } }
    } else {
      return { ...result, [baseName]: value }
    }
  }, {})
```

Put the extracted result inside `src/%THEME_NAME%.ts`.
