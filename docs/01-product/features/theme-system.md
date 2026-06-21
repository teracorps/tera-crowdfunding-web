# Config-Driven Theme System

## Architecture

```
TenantBranding (config)
      ↓
+layout.svelte → <svelte:head><style>:root { CSS vars }</style></svelte:head>
      ↓
All components read from theme classes (text-primary, bg-secondary, etc.)
```

## Color Tokens (Tailwind CSS v4 `@theme`)

Defined in `src/routes/layout.css`:

```css
@theme {
    --color-primary: #14B88C;
    --color-primary-dark: #0F9A75;
    --color-primary-light: #E8F5F0;
    --color-secondary: #FF784B;
    --color-accent: #FFD166;
    --color-accent-light: #FFF8E1;
    --color-text-primary: #111827;
    --color-text-secondary: #6B7280;
    --color-bg: #FFFFFF;
    --color-bg-section: #F3F4F6;
    --color-surface: #F9FAFB;
    --color-border: #E5E7EB;
    --color-success: #10B981;
    --color-warning: #F59E0B;
    --color-error: #EF4444;
}
```

All `.svelte` files use these semantic classes — **no hardcoded hex colors**.

## Dynamic Overrides (Per-Tenant)

At runtime, `+layout.svelte` injects tenant-specific CSS vars:

```typescript
const themeVars = {
    '--color-primary': branding.primaryColor,
    '--color-secondary': branding.secondaryColor,
    // ...
};
```

Inline JS styles use `var(--color-primary, #14B88C)` pattern (CSS var + fallback).

## Logo Modes

`TenantBranding.logoMode` supports 3 modes:

| Mode | Description |
| ---- | ----------- |
| `text-only` | Bold text of `platformName` |
| `icon-text` | Small colored circle with initial + name |
| `logo-text` | Full logo image (`logoTextUrl`, max 220px) |

## Font System

- `fontFamily` — Base font (body text)
- `fontHeading` — Heading font (falls back to fontFamily)
- Both injected as CSS vars `--font-family` and `--font-heading`
