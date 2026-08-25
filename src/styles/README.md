# Style ownership

StyleX modules are organized by ownership and composition boundaries. The
durable contract is [ADR 0011](../../docs/adr/0011-layout-primitives-common-margins-and-stylex-overrides.md).

- `src/theme/tokens.stylex.ts` is the stable interface for themeable color,
  spacing, size, radius, shadow, typography, and motion values. A private
  `SPACE_UNIT_REM` calculates the default spacing scale; every public
  `--space-*` variable remains independently themeable.
- `Box`, `Stack`, and `Grid` are the broad token-aware layout gateway. The maps
  and resolvers in `src/styles/props/` for padding, gaps, sizing, position,
  child layout, surfaces, typography, flex, and grid are implementation details
  of that gateway.
- `spacing.stylex.ts` also owns the small public scalar margin vocabulary and
  `extractMarginProps`. An eligible normal-flow component root calls that
  adapter once, places the returned margin styles immediately before `xstyle`,
  and spreads only the returned remainder to its native or Base UI host.
- Semantic components own their padding, dimensions, visual treatment, and
  internal alignment through base styles and variants. Compound parts do not
  inherit their root's common-margin contract.
- `ScrollArea` exposes margins and the shared override channels only on its
  outer root. Its viewport, content, and scrollbar do not expose separate style
  props; consumers style content they own through a child or wrapper.
- Controllers, portals, positioners, popups, and collision-managed surfaces do
  not receive margins. Their geometry belongs to modal or Base UI positioning
  props such as `sideOffset` and `alignOffset`.
- `xstyle` accepts StyleX Atoms and `stylex.create` styles through the same
  `StyleXStyles` contract. It is merged after named margins. Native `style` is
  merged after StyleX-produced inline values; `className` remains an interop
  hatch without a promised StyleX precedence relationship.
- Stories use Atoms for compact one-off consumer adjustments. Components spread
  the complete `stylex.props(...)` result when applying fixed internal StyleX to
  another recipient; they use a nested `xstyle` only to forward or merge a
  caller's public `xstyle`.
- Responsive values stay together in a predeclared `stylex.create` style passed
  through `xstyle`; named margin values remain scalar.
- Do not add universal `data-component` or `data-slot` markers. Preserve only
  component-specific `data-*` attributes with an owned behavior or selector.
- `constants.stylex.ts` contains fixed global selectors, environmental media
  conditions, and layer order. Component-owned `*.stylex.ts` modules and
  `recipes/*.ts` retain the ownership boundaries described below.

Import token, constant, and style-map bindings directly from their owning
module. There is intentionally no style-prop barrel.

## Style-prop modules

| Module                   | Contract                                                                 | Ownership                                                     |
| ------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------- |
| `spacing.stylex.ts`      | `SpaceValue`, spacing prop groups, edge resolution, `extractMarginProps` | Common margins plus broad-gateway spacing                     |
| `sizing.stylex.ts`       | `SizingProps` and dimension resolvers                                    | Broad gateway only                                            |
| `position.stylex.ts`     | `PositionProps`, spacing-backed/CSS-value insets, open `zIndex`          | Broad gateway only                                            |
| `child-layout.stylex.ts` | Self-alignment and flex/grid child claims                                | Broad gateway only                                            |
| `flex.stylex.ts`         | Display and Stack flow                                                   | Broad gateway only                                            |
| `grid.stylex.ts`         | Grid flow and spans                                                      | Broad gateway only                                            |
| `surface.stylex.ts`      | Semantic background, color, radius, shadow, border                       | Broad gateway only                                            |
| `typography.stylex.ts`   | Generic typography maps                                                  | Broad gateway; Text/Heading select only their semantic subset |
| `base.ts`                | `BaseStyleProps`, `mergeStyle`                                           | Shared `style`/`xstyle` contract and native-style precedence  |

`SpaceStep` is an explicit finite numeric union. Numeric margin, padding, gap,
and inset values map to stable spacing tokens; negative values subtract the
corresponding token. All four spacing surfaces use `SpaceValue` and accept CSS
strings directly. Property-specific validity belongs to CSS. Edge precedence
is `side ?? axis ?? all`.

### Eligible component pattern

Reference implementations: `src/components/button/button.tsx` and the field
wrapper in `src/components/text-field/text-field.tsx`.

```tsx
export type ButtonProps = Omit<BaseButton.Props, "className" | "style" | keyof MarginProps> &
	MarginProps &
	BaseStyleProps;

export function Button({ className, style, xstyle, ...props }: ButtonProps) {
	const { marginStyles, rest } = extractMarginProps(props);
	const sx = stylex.props(buttonParts.root, marginStyles, xstyle);

	return <BaseButton className={attrJoin(sx.className, className)} style={mergeStyle(sx.style, style)} {...rest} />;
}
```

`Box`, `Stack`, and `Grid` use their own explicit private splitter for the broad
prop surface. Do not recreate a repository-wide key registry or DOM denylist.

### Naming

- Exported component-owned style maps end in `Styles`: use the owner name for
  the primary map (`textStyles`, `tooltipStyles`) and add the narrow concern
  before the suffix when needed (`typescaleStyles`, `fieldInputStyles`).
- Reserve `*Vars` for `stylex.defineVars()` contracts and `*Marker` for
  `stylex.defineMarker()` scopes.
- Private maps that describe JSX anatomy may use `*Parts`. Ownerless interaction
  recipes keep their semantic names (`focusRing`, `pressable`).

## Recipe map

Use this table to choose the right module first; each recipe file documents
element roles in a header comment.

| Concern                                 | Module                                 | When to import                                                                                                      |
| --------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Form field layout and control surfaces  | `components/field/field.stylex.ts`     | Any input, textarea, select trigger, or combobox shell                                                              |
| Selectable menu/list rows               | `components/menu/menu-item.stylex.ts`  | Menu owns the appearance; Select and Combobox compose it                                                            |
| Popup position + motion                 | `components/popover/popover.stylex.ts` | Popover owns anchored-surface behavior composed by other popups                                                     |
| Popup panel chrome (bg, radius, shadow) | **component file**                     | Each popup owns its own `panelSurface` beside its parts                                                             |
| Modal backdrop, viewport, surface, text | `components/dialog/dialog.stylex.ts`   | Dialog owns modal behavior; alert dialogs and drawers compose it                                                    |
| Focus rings                             | `focus.ts`                             | `focusRing.inset` on bordered controls, `focusRing.offset` on buttons/links, `focusRing.within` on composite shells |
| Press / icon-swap feedback              | `transitions.ts`                       | Buttons, toggles, close controls                                                                                    |
| Checkbox, Radio, and Switch             | **component files**                    | Each control owns its marker, state styles, sizing, and indicator treatment                                         |
| Text styles                             | `components/text/text.stylex.ts`       | Components, headings, body copy, and specimens                                                                      |

### Popup composition

Popup **panel chrome** (background, radius, shadow) is simple and lives in each
component's own `*Parts.panelSurface` style. Do not add a shared popup-surface
stack.

Popup **behavior** that must stay identical is imported from Popover:

```tsx
import {
	popupMotionStyles,
	popupPositionerStyles,
	popupViewportStyles,
	popupArrowStyles,
} from "@/components/popover/popover.stylex";
import { tooltipStyles } from "@/components/tooltip/tooltip.stylex";

// Normal Menu / Popover / LinkPreview / Tooltip Positioner
stylex.props(popupPositionerStyles, style);

// Panel-style Popup (menu, select, combobox, popover, link-preview)
stylex.props(menuParts.panelSurface, menuParts.popup, popupMotionStyles.anchoredPopup, style);

// Opt-in detached-trigger movement (positioner and popup respectively)
stylex.props(popupPositionerStyles, popupMotionStyles.movingPositioner, style);
stylex.props(panelSurface, popupMotionStyles.anchoredPopup, popupMotionStyles.movingPopup, style);

// Tooltip Popup (chrome + motion bundled)
stylex.props(tooltipStyles.popup, tooltipParts.popup, style);

// Optional Viewport child for detached-trigger content swapping
stylex.props(popupViewportStyles, style);
```

Popup composites render their children directly. Opt into Base UI's content
swapping and detached-trigger movement only where they are actually needed:

```tsx
<Popover.Popup positionerProps={{ xstyle: popupMotionStyles.movingPositioner }} xstyle={popupMotionStyles.movingPopup}>
	<Popover.Viewport>{content}</Popover.Viewport>
</Popover.Popup>
```

Compose as `stylex.props(<component parts>, <shared behavior>, xstyle)` so the
caller's `xstyle` always comes last.

### List item composition

Menu owns the canonical selectable-row appearance. Select, Combobox, and
other components that intentionally look like Menu items compose it directly:

```tsx
import { menuItemStyles, menuItemVariantStyles } from "@/components/menu/menu-item.stylex";
import { menuItemVars } from "@/components/menu/menu-item-vars.stylex";

stylex.props(menuItemStyles.item, menuItemVariantStyles.default, style); // item row
stylex.props(menuItemStyles.label); // primary label cell
stylex.props(menuItemStyles.indicator); // check/radio slot
```

Override column layout with `menuItemVars` from its dedicated variables module when a
Menu composition needs a custom grid. Menu remains the source of truth:
borrowers may import its styles, but Menu must not import a borrower.

### Field composition

Field's style module exposes one export per element role and two size bundles:

| Element                                      | Export                                                              |
| -------------------------------------------- | ------------------------------------------------------------------- |
| `Field.Root` wrapper                         | `fieldStyles.root`                                                  |
| Labels, description, error                   | `fieldStyles.label`, `fieldStyles.description`, `fieldStyles.error` |
| Text input (`input`, `textarea`)             | `fieldInputStyles[size]`                                            |
| Button-like trigger (select, combobox shell) | `fieldControlStyles[size]`                                          |

```tsx
import { fieldStyles, fieldInputStyles, fieldControlStyles } from "@/components/field/field.stylex";
import type { FieldSize } from "@/components/field/field.types";

stylex.props(fieldInputStyles.md, focusRing.inset); // text field
stylex.props(fieldControlStyles.md, selectParts.trigger, focusRing.inset); // select trigger
```

Use granular exports (`fieldStyles.input`, `fieldTextStyles`, …) only when
the control shape is irregular (number field, input group, combobox with chips).

### Modal composition

```tsx
import {
	modalBackdropStyles,
	modalViewportStyles,
	modalPopupStyles,
	modalTextStyles,
	alertBackdropStyles,
	alertViewportStyles,
	modalChromeStyles,
} from "@/components/dialog/dialog.stylex";

stylex.props(modalBackdropStyles); // dialog backdrop
stylex.props(modalViewportStyles); // dialog viewport
stylex.props(modalPopupStyles, dialogParts.popup, style); // dialog surface + motion
stylex.props(modalTextStyles.title); // title role

// Drawers: reuse chrome without dialog scale/fade motion
stylex.props(modalChromeStyles.backdrop, modalChromeStyles.modalBackdropLayer, drawerParts.backdrop);
stylex.props(modalChromeStyles.surface, drawerParts.popup);
```

## Interaction and tokens

- Interaction concerns stay in narrow recipes: `focus.ts` for focus rings,
  and `transitions.ts` for shared pressable and icon-swap transitions.
- Import environmental conditions from `constants.stylex.ts`: use
  `media.canHover` for fine-pointer hover feedback and `media.reducedMotion`
  for reduced-motion overrides. Active light/dark mode remains owned by
  `ThemeProvider` and semantic tokens; do not infer it from system preference.
- When parent interaction only changes child values, define local custom
  properties on the parent and consume them from the child's direct
  `[data-*]` state selectors. Checkbox, Radio, and Switch use this pattern so
  their state matrix remains declarative and component-local.
- For parent-child relationships that cannot be expressed through inherited
  values, define a component-scoped marker in a `.stylex.ts` file, include it
  in the ancestor's `stylex.props(...)`, and use `stylex.when.ancestor()` in
  the child style. Never use `stylex.defaultMarker()` for form controls because
  interaction from outer containers can leak into the control.
- Use `defineVars()` only for a real shared cascading or theming contract.
  Interaction-only custom properties stay beside the component styles rather
  than in a variables sidecar.
- Component-family files hold values shared only by sibling implementations,
  such as stacked and anchored toasts. Single-component values stay in that
  component instead of creating a one-consumer module.
- Use CSS selector bridges only when StyleX cannot express a relationship that
  the component must own. Prefer component-owned slots when the relationship is
  part of the public composition API; Button and Badge size and align their
  `startSlot` and `endSlot` content entirely in StyleX. `popup-motion.css`
  bridges Base UI's generated payload wrappers only inside an explicitly
  rendered popup `Viewport`. `scroll-fade.css` provides opt-in `xyz-scroll-fade*`
  classes for scroll-edge mask fades (scroll-timeline driven, with a static
  fallback). Size via `--scroll-fade-size` / `--scroll-fade-{t,b,s,e}-size`.
  When overflow can come and go, gate the class with `useScrollFade`.
- Themeable values always go through the single `tokens["--…"]` interface in
  `src/theme/tokens.stylex.ts`.
  Do not write raw custom-property strings in component styles; if a semantic
  token is missing, add it to `src/theme/tokens.stylex.ts` first.
  Base UI-provided variables (`--anchor-width`, `--transform-origin`, ...)
  and narrowly scoped component-owned bridge variables are the only raw
  `var()` references components may use.

Spacing, radius, font-size, line-height, and breakpoint dimensions use `rem` so
they follow the user's root type-size preference. Optical hairlines and shadow
offsets remain pixel-based.

Breakpoints are ready-to-use mobile-first media-query selectors, not CSS
values. Use them as computed condition keys:

```ts
import * as stylex from "@stylexjs/stylex";
import { breakpoints } from "@/styles/constants.stylex";

const styles = stylex.create({
	layout: {
		gridTemplateColumns: {
			default: "1fr",
			[breakpoints.md]: "repeat(2, minmax(0, 1fr))",
		},
	},
});
```

## Customizing components

Styled component roots accept native `style?: CSSProperties` and StyleX
`xstyle?: StyleXStyles`. `xstyle` is merged last inside `stylex.props`, so
caller StyleX wins over component styles and named margins. Native `style` is
merged after generated inline values. `className` remains only for third-party
interop; it cannot carry StyleX overrides reliably.

```tsx
import * as stylex from "@stylexjs/stylex";
import x from "@stylexjs/atoms";
import { Button } from "@/components";

const styles = stylex.create({
	wide: { paddingInline: "2rem" },
});

<Button xstyle={[styles.wide, x.width["100%"], pending && x.opacity["0.5"]]}>Save</Button>;
```

### Component markers

Named component markers expose intentional `stylex.when` boundaries. Import
them directly from their owning `.stylex.ts` module; they are not default
markers and are not re-exported through component barrels.

| Marker              | Owner                                 | Applied to                                                                                               |
| ------------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `buttonMarker`      | `components/button/button.stylex.ts`  | Button, IconButton, and shared Button-root controls                                                      |
| `fieldMarker`       | `components/field/field.stylex.ts`    | Field roots observed by descendant form-control styles                                                   |
| `itemMarker`        | `components/menu/menu-item.stylex.ts` | Menu rows and components composing the canonical row, including Select, Combobox, and Autocomplete items |
| `labelMarker`       | `components/field/field.stylex.ts`    | Label elements associated with form controls                                                             |
| `toggleMarker`      | `components/toggle/toggle.stylex.ts`  | Toggle controls observed by joined-group sibling and ancestor rules                                      |
| `toggleGroupMarker` | `components/toggle/toggle.stylex.ts`  | ToggleGroup roots that opt into join radius and stacking                                                 |

```tsx
import * as stylex from "@stylexjs/stylex";
import { buttonMarker } from "@/components/button/button.stylex";

const styles = stylex.create({
	icon: {
		opacity: 0.6,
		[stylex.when.ancestor(":hover", buttonMarker)]: {
			opacity: 1,
		},
	},
});
```
