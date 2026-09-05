# Design-system glossary

- **Layout primitive / broad layout gateway** — `Box`, `Stack`, or `Grid`; an explicit composition root with the token-aware display, spacing, sizing, position, child-layout, surface, and typography vocabulary appropriate to that primitive.
- **Normal-flow component root** — One stable public HTML node that normally participates in caller-owned document flow. Eligible roots may expose the common scalar margin props `m`, `mx`, `my`, `mt`, `mb`, `ms`, and `me`.
- **Positioned surface** — A modal, portal, positioner, popup, toast region, or anchored/collision-managed surface whose geometry belongs to its component or Base UI offset/alignment props. It does not receive common margins by default.
- **Internal layout** — Arrangement of a component's own contents: padding, gap, dimensions, and flow. Semantic components own this through base styles, size props, and variants rather than generic style props.
- **Field wrapper** — The public root around a label, control, description, and error. Common margins style this wrapper only; they never alter the inner control chrome.
- **Build-time spacing unit** — The private `SPACE_UNIT_REM` constant used to calculate unchanged default spacing values. Public `--space-*` variables remain stable and independently themeable.
- **Scalar spacing contract** — `SpaceValue` is shared by margin, padding, gap, and inset props. Numeric values resolve through the explicit spacing scale, while CSS strings pass through; named props do not accept responsive objects.
- **xstyle** — The StyleX override hatch. It accepts both StyleX Atoms and `stylex.create` styles, including arrays and conditional entries, and is merged after component styles and named margins.
- **style** — Native inline style (`style?: CSSProperties`). It is merged after StyleX-produced inline values and therefore wins for the same property.
- **Responsive StyleX set** — A predeclared `stylex.create` style that keeps every breakpoint value for a CSS property together and is passed through `xstyle`.
- **Table** — A manually composed, presentation-only compound component for semantic tabular structure and its canonical visual treatment. It owns no dataset-derived behavior such as filtering, sorting, visibility, or expansion.
- **Data table** — A stateful, data-driven component that derives rows and columns from data and composes `Table` for presentation. It owns filtering, sorting, visibility, selection, expansion, and row actions.
- **Action cell** — A compact table header or data cell reserved for a direct interactive control, such as a disclosure button or row-action menu trigger. Checkbox cells are specialized action cells that own the design-system Checkbox composition.
- **Checked row** — A body row whose selection checkbox is checked and which receives the corresponding visual treatment. Use `checked`, not `selected`, in the presentation-only `Table` API.
- **Math expression field** — Experimental unpublished text field that evaluates arithmetic on commit. Evaluator: `src/utils/evaluate-math-expression.ts`. Draft/commit hook: `src/hooks/use-math-expression-input.ts`. Field: `src/experimental/math-expression-field/`. Not a NumberField variant; Base UI NumberField filters expression characters. Not exported from `src/components/index.ts`.
- **AI block** — A `src/blocks/` composition whose Storybook stories live under `Blocks/AI/` because the primary workflow is agent- or LLM-specific. Classification is in [ADR 0013](docs/adr/0013-storybook-ai-block-taxonomy.md). The subgroup is Storybook navigation only; files and public exports stay with the other blocks.

## Tokens and themes

- `src/theme/tokens.stylex.ts` is the public token interface. Themeable design values are named StyleX variables exposed through `tokens["--…"]`, including primitive ramps, semantic colors, spacing, sizes, radius, shadows, typography, and motion.
- Default values are defined once in `tokens.stylex.ts`. They use CSS custom properties, derived variables, and `light-dark()` where a value has light/dark behavior. The default theme is `stylex.createTheme(tokens, {})`, so it does not redeclare defaults.
- Named themes are partial overrides in `src/theme/themes.stylex.ts`. The closed registry is currently `"default" | "mp"`; `mp` overrides only the tokens that differ and inherits omitted values from `tokens`.
- Component styles should import `tokens` directly and reference semantic tokens rather than raw custom-property strings. Component variants such as `bg="surface"` or `Text color="error"` remain stable public props that map to the renamed tokens.
- Themeable typography is tokenized. MP uses the Apercu font family via `--font-family-sans`, with font files registered in `src/styles/fonts.css`; font loading remains a consuming-application responsibility outside this demo package.
- `ThemeProvider` applies the composed StyleX theme, foreground, inherited font family, `color-scheme`, `data-theme`, and `data-mode` to its host. It uses Base UI's `render` convention for element replacement, falls back to a normal `div`, and never uses `display: contents`.
- The outermost provider synchronizes its owned theme attributes, classes, and styles to `document.documentElement` so browser chrome and body-level portals inherit the root theme. Nested providers scope through their rendered host.
- Fixed global selectors and non-theme constants stay outside the token contract. CSS should contain genuine global rules and font-face declarations, not theme-value declarations.
