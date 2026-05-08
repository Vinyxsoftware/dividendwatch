# Design System

## Theme

Dark by default. No light mode. Justified by use case: focused research sessions, number-heavy content, desktop-primary. The scene: a Swiss retail investor reviewing their watchlist before market open.

## Colors

Strategy: Restrained. One accent (emerald green) used only for positive yield signals, primary actions, and key financial metrics. No decorative color.

```
Background:       oklch(0.09 0.020 265)   — deep navy, near-black
Card surface:     oklch(0.12 0.020 265)   — slightly lifted
Muted surface:    oklch(0.15 0.018 265)   — inputs, table headers
Foreground:       oklch(0.93 0.010 215)   — soft white, cool tint
Muted text:       oklch(0.50 0.016 225)   — secondary labels
Border:           oklch(1 0 0 / 7%)       — very subtle white
Primary (green):  oklch(0.74 0.17 162)    — emerald, yield indicator
Sky blue:         text-sky-400            — growth stocks, secondary accent
Amber:            text-amber-400          — warnings, disclaimers
Red:              text-red-400            — at-risk, losses
```

Primary green is used for: yield values ≥ 4%, the logo mark, ticker links on the main table, primary action hover states. Never for decorative gradients or backgrounds.

## Typography

Three families with distinct roles:

- **Syne** (`font-display`): Page H1 headings only. Bold (700). Never in labels, buttons, or data cells.
- **DM Sans** (`font-sans`, default): All UI text — nav labels, card headings, body copy, form labels, disclaimers.
- **JetBrains Mono** (`font-data`): All financial data — prices, yields, percentages, share counts, ticker symbols.

Scale (product register: tight ratio ~1.2):
- `text-2xl` / `text-3xl`: Page H1 (font-display)
- `text-base` / `text-sm font-semibold`: Section H2
- `text-sm`: Body, table cells, labels
- `text-xs`: Secondary labels, badges, metadata

## Spacing

- Page padding: `px-4 sm:px-6`
- Main content gap: `space-y-8` to `space-y-10`
- Card internal padding: `p-5`
- Card header: `px-5 py-3 border-b`
- Table cells: `px-4 py-3.5`
- Input height: `py-2` (compact, not padded)

## Components

### Cards
Solid surface, not glass. Pattern:
```
rounded-xl border border-border bg-card
```
With header section when the card has a title:
```
<div class="px-5 py-3 border-b border-border">
  <h2 class="text-sm font-semibold text-foreground">Title</h2>
</div>
<div class="p-5">...</div>
```

### Tables
Consistent pattern across all table surfaces:
- `rounded-xl border border-border overflow-hidden`
- Header: `bg-muted/60 border-b border-border`, `text-xs font-medium text-muted-foreground uppercase tracking-wider`
- Rows: `hover:bg-muted/40 transition-colors`, `border-b border-border/50 last:border-0`
- Financial data cells: `font-data text-sm`

### Inputs
```
px-3 py-2 rounded-lg bg-muted border border-border text-foreground font-data text-sm
focus:outline-none focus:ring-1 focus:ring-ring focus:border-primary/50 transition-colors
```

### Badges (sustainability)
Colored dot + label. Three states: emerald (Sustainable), amber (Review), red (At Risk).

### Navigation (SiteHeader)
Sticky, `bg-background/85 backdrop-blur-xl`, `border-b border-white/[0.06]`. Active state: `bg-primary/10 text-primary`. Hover: `hover:bg-white/5 hover:text-foreground`.

## Motion

Transitions: `transition-colors` (150ms default via Tailwind) for hover states. No orchestrated animations. No decorative motion. `prefers-reduced-motion` respected globally.

## Layout

Max widths: `max-w-6xl` (main pages), `max-w-5xl` (detail/sub pages). Consistent `mx-auto w-full px-4 sm:px-6` wrapper. Responsive tables use `hidden sm:table-cell`, `hidden md:table-cell`, `hidden lg:table-cell` for progressive column reveal.

## Absolute bans (active)

- No glassmorphism on content cards (backdrop-blur only on the sticky nav)
- No hero metric template (big number + label + gradient accent)
- No identical card grids (quick nav uses list-style rows)
- No side-stripe borders
- No gradient text
- No Syne on anything below H1 level
- No decorative green glows or shadows
