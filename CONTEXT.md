# Design-system glossary

- **Theme prop** — A typed, token-backed scalar layout prop compiled through StyleX, such as `gap={3}`, `ms="auto"`, or `width="full"`. Other libraries often call this pattern a system prop or style prop.
- **Style prop** — The unrestricted `style?: StyleXStyles` escape hatch. It is composed last and therefore wins over component defaults, variants, and theme props.
- **Layout primitive** — `Box`, `Stack`, or `Grid`; a product-agnostic composition root with the broadest theme-prop contract. Only these primitives expose shared `color` and `bg` props.
- **Responsive style set** — A predeclared StyleX style that keeps every breakpoint value for a CSS property together. Pass it through `style`; theme props themselves remain scalar.
- **Field wrapper** — The public root around a label, control, description, and error. Layout theme props style this wrapper only; they never alter the inner control chrome.
- **Table** — A manually composed, presentation-only compound component for semantic tabular structure and its canonical visual treatment. It owns no dataset-derived behavior such as filtering, sorting, visibility, or expansion.
- **Data table** — A stateful, data-driven component that derives rows and columns from data and composes `Table` for presentation. It owns filtering, sorting, visibility, selection, expansion, and row actions.
- **Action cell** — A compact table header or data cell reserved for a direct interactive control, such as a disclosure button or row-action menu trigger. Checkbox cells are specialized action cells that own the design-system Checkbox composition.
- **Checked row** — A body row whose selection checkbox is checked and which receives the corresponding visual treatment. Use `checked`, not `selected`, in the presentation-only `Table` API.

## Tokens and themes

- `src/theme/tokens.stylex.ts` is the public token interface. Themeable design values are named StyleX variables exposed through `tokens["--…"]`, including primitive ramps, semantic colors, spacing, sizes, radius, shadows, typography, and motion.
- Default values are defined once in `tokens.stylex.ts`. They use CSS custom properties, derived variables, and `light-dark()` where a value has light/dark behavior. The default theme is `stylex.createTheme(tokens, {})`, so it does not redeclare defaults.
- Named themes are partial overrides in `src/theme/themes.stylex.ts`. The closed registry is currently `"default" | "mp"`; `mp` overrides only the tokens that differ and inherits omitted values from `tokens`.
- Component styles should import `tokens` directly and reference semantic tokens rather than raw custom-property strings. Component variants such as `bg="surface"` or `Text color="error"` remain stable public props that map to the renamed tokens.
- Themeable typography is tokenized. MP uses the Apercu font family via `--font-family-sans`, with font files registered in `src/styles/fonts.css`; font loading remains a consuming-application responsibility outside this demo package.
- `ThemeProvider` applies the composed StyleX theme, foreground, inherited font family, `color-scheme`, `data-theme`, and `data-mode` to its host. It uses Base UI's `render` convention for element replacement, falls back to a normal `div`, and never uses `display: contents`.
- The outermost provider synchronizes its owned theme attributes, classes, and styles to `document.documentElement` so browser chrome and body-level portals inherit the root theme. Nested providers scope through their rendered host.
- Fixed global selectors and non-theme constants stay outside the token contract. CSS should contain genuine global rules and font-face declarations, not theme-value declarations.
