# ADR 0010: Static style-prop maps, tiered component surfaces, and the xstyle escape hatch

- Status: Superseded by [ADR 0011](../0011-layout-primitives-common-margins-and-stylex-overrides.md)
- Date: 2026-08-20
- Supersedes: [ADR 0001](./0001-token-backed-theme-props.md)
- Amends: [ADR 0003](../0003-stylex-ownership-and-application.md) (`style` / `xstyle`)

## Context

[ADR 0001](./0001-token-backed-theme-props.md) introduced token-backed layout props through a generic runtime engine (`defineThemePropKeys`, `createThemePropDefinition`, `composeThemeProps`, `extractThemeProps`, `resolveThemeProps` in `src/theme/theme-props.ts`). Closed keyword sets still compiled through dynamic StyleX functions, types were hand-maintained, and every themed component treated `style` as `StyleXStyles` rather than native inline style.

That engine is unnecessary. Facebook's Astryx design system uses shared static `stylex.create` maps, types derived via `keyof typeof`, exported style maps as the sharing unit, a curated `BaseProps`, and an `xstyle` override hatch. Polar's Orbit post treats closed token props as an LLM-safe vocabulary and puts the contract in lint/CI rather than docs. Linear's StyleX migration emphasizes strict styling contracts, leaf-first migration, and aggressive linting so old patterns cannot reappear.

The goal is the same token-backed guarantee as ADR 0001, with less indirection, deduplicated atomic classes instead of one CSS variable per property use, and prop breadth judged per component tier rather than as a single shared bag.

## Decision

Replace the runtime theme-prop engine with shared static StyleX variant maps plus plain resolve helpers. Types derive from the maps (`export type SpaceStep = keyof typeof gapStyles`). Dynamic StyleX functions are reserved for genuinely open values — sizing, grid templates, `zIndex`, `flexGrow` / `order` — using CSS-var indirection so `xstyle` and media-query overrides still win. Components destructure named props explicitly; there is no extraction step.

Style-prop breadth is a per-tier judgment:

- **Tier 1 — layout primitives (`Box`, `Stack`, `Grid`).** The full surface: display, margins, padding (including axis/edge), sizing, positioning, child layout, surface (`bg`, `color`, `radius`, `shadow`, and `border` as semantic border colors at a fixed `1px`), and shared `TypographyProps`. `Stack` and `Grid` take Box's entire surface plus their flow group. Content structure must not devolve into nested-Box markup.
- **Tier 2a — group-operating components.** Margins, sizing, positioning, and child layout. A composable control is a unit of layout unto itself; `flexGrow` / `width="full"` beat baking width variants into every control. Roster: `Button`, `IconButton` (and `CloseButton` through it), `TextField`, `Textarea`, `NumberField`, `Combobox`, `InputGroup`, `CheckboxGroup`, `RadioGroup`, `ToggleGroup`, `Slider`, `Text`, `Heading`, `ScrollArea`, `Table`, `DataTable`, `CodeBlock`, `Progress`, `Meter`, `Toolbar`. Form groups are the layout unit; their individual controls are content-shaped (Tier 2b). `Text` and `Heading` additionally expose `TypographyProps`.
- **Tier 2b — content-shaped components.** Margins and positioning only. These are intrinsically sized — a badge is only ever badge-shaped; a Select fills its own value; radios, checkboxes, and toggles are content-based — so sizing and `flexGrow` pass-through would be dead weight. Positioning stays (a badge over an avatar does not change its shape). Roster: `Badge`, `Kbd`, `KbdGroup`, `Code`, `Link`, `Avatar`, `Icon`, `Loader`, `InfoTip`, `Select`, `Radio`, `Checkbox`, `Switch`, `Toggle`, `Separator`, `MeterGauge`, `Item`, `Tabs`, `Breadcrumbs`, `NavList`, `Collapsible`. The last five are container-governed. Appearance on both Tier 2 groups stays variant-owned: no `bg` / `radius` / `shadow` pass-through.
- **Tier 3 — opinionated compositions (`Card` and parts, `EmptyState`, `Callout`).** Variants first; margins, padding, and sizing only. Surface styling is locked to variants. Wanting arbitrary `bg` / `shadow` on a Card is the signal to use `Box` / `Stack` or add a variant. Text-like subcomponents (`Card.Title`, and similar) accept `TypographyProps`.
- **No style props.** Overlays position themselves, so margins are meaningless: `Dialog`, `AlertDialog`, `Drawer`, `Popover`, `Tooltip`, `Menu`, `CommandPalette`, `Toast`, `LinkPreview`. `Sidebar` owns its layout contract. `VisuallyHidden` has no style props.

Margins are universal across tiers 1–3 and token-constrained, so optical offsets do not require wrapper elements. Terse prop naming stays (`p` / `px` / `ps` / `gapX`).

`style` returns to native inline-style passthrough (`style?: React.CSSProperties`). A new `xstyle?: StyleXStyles` prop carries StyleX overrides and is merged last inside the component's `stylex.props(...)` call. `className` cannot carry StyleX overrides deterministically: atomic classes for the same property tie on specificity and resolve by stylesheet injection order, so last-wins only works for style objects merged in one `stylex.props` call. This amends ADR 0003's convention that `style` is `StyleXStyles`. The hatch is sanctioned for learning curves; sustained use of one pattern is the signal to grow the typed surface. Tiers 1–3 expose both props; components outside those tiers keep their current contracts.

Typography is one shared `TypographyProps` group — `fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, `textAlign`; no `letterSpacing`. It is consumed by Tier 1 primitives, Tier 2a text components, and text-like subcomponents. `fontSize` is a new independent `--text-xs` … `--text-5xl` token group anchored at `md = 1rem`. It is not aliased to `--font-size-1` … `--font-size-9`; semantic `--type-*` styles keep consuming the numbered scale, and the two groups are expected to diverge. `lineHeight` is a unitless map of literals `1 | 1.25 | 1.5 | 1.75 | 2` with no tokens. Semantic text styles remain the `Text` / `Heading` size vocabulary and do not compose these line-height values.

There are no border-width tokens. Borders are `1px` written directly (occasionally `0.5px`). The Tier 1 `border` prop is semantic border colors at that fixed width.

Every component root emits `data-component` naming the underlying component, plus `data-slot` for its composed alias when applicable — for example `CloseButton` renders `data-component="icon-button"` `data-slot="close"`.

Lint currently errors on imports of the deleted engine (`theme-props`, `theme-props.types`, `theme-props-*.stylex`, `@/theme/theme-props*`). Off-token spacing or color literals where a token exists remain future lint intent, not a current guarantee: warnings (never errors), with relative units such as `em` / `ch` and optical adjustments remaining legitimate. There are no raw-element restrictions.

## Consequences

Call sites keep token-constrained named props, but closed values compile to shared atomic classes and types stay in lockstep with the maps. The public type surface shrinks to prop-group types that actually exist (`SpaceStep`, tier interfaces, `TypographyProps`, `keyof typeof`-derived unions); `CssLengthUnit` / `CssDimensionString` / `WidthFraction`-style exports disappear with the engine.

Callers that used `style` for StyleX overrides must move those objects to `xstyle`. Native `style` is available again for genuinely open inline values. Responsive values remain predeclared StyleX sets, now passed through `xstyle`, following the same StyleX guidance against per-breakpoint theme-prop objects recorded in ADR 0001.

Reviewers judge new style props against the tier roster rather than extending every component equally. Overuse of `xstyle` for a repeated token-shaped need is a prompt to grow that tier's typed surface, not to reopen a generic engine.

## Amendment (2026-08-20)

Final conventions decided during execution:

- **Standard groups, plus two welded bundles.** Restyle/Styled System-style groups (`MarginProps`, `SpacingProps`, `SizingProps`, `PositionProps`, `ChildLayoutProps`, `TypographyProps`) remain the primitives. Components compose those groups inline **or** use the two shared convenience composites that weld the props type to the resolver list: `PlacementProps` / `resolvePlacement` (margins + position; Tier 2b) and `ExternalLayoutProps` / `resolveExternalLayout` (placement + sizing + child claims; Tier 2a). These are not a return to the old engine — `layout.tsx`'s private `resolveBoxStyles` is the existence proof. Do not recreate the four-way intersection by hand.
- **DOM stripping.** `omitStyleProps` plus one exhaustive key set strips style props at the DOM boundary. Flow-group keys (`orientation`, `align`, `justify`, `wrap`, `columns`, `flow`) are excluded from that set and destructured explicitly.
- **Vocabulary.** External layout is margins, position, sizing, and child claims. Internal layout is padding, gap, and flow. Tier 2b is external placement for intrinsically sized components.
