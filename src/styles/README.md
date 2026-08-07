# Style ownership

StyleX modules are organized by how a value composes, not by how often a name
appears.

- `src/theme/tokens.stylex.ts` is the single source for themeable color, spacing, size,
  radius, shadow, typography, and motion values.
- `src/theme/theme-props.types.ts` owns public token-backed value and capability
  contracts, and `theme-props.ts` owns their StyleX-independent key,
  extraction, and composition logic. These domain helpers do not belong in a
  generic `utils` directory.
- Theme props are scalar. Keep responsive values for one CSS property together
  in a predeclared StyleX style, or promote a repeated set to a named recipe.
- `src/theme/theme-props-spacing.stylex.ts`, `src/theme/theme-props-layout.stylex.ts`, and
  `src/theme/theme-props-surface.stylex.ts` bind those contracts to explicit StyleX
  functions. Import the narrow binding directly so unused compiler families can
  be removed from a consumer bundle.
- `constants.stylex.ts` contains only fixed global selectors and layer order.
  These compile inline rather than creating themeable CSS variables.
- Component-owned `*.stylex.ts` files are canonical style APIs. Borrowers
  import from the component they intentionally resemble: Select and Combobox
  import Menu item styles, for example.
- `recipes/*.ts` is reserved for ownerless interaction primitives with several
  real consumers. Component geometry and one-off variants remain beside the
  component.
- Text owns the reusable type styles. Compose `textStyles`,
  `textSizeStyles`, `textFamilyStyles`, and `textWeightStyles` instead of
  hand-rolling font-size/line-height/letter-spacing triples.
- `textColorPropStyles` only implements the `Text` and `Heading` color prop.
  Other owners set colors with semantic tokens directly.

Import the shared `tokens` binding and StyleX constants directly by their named
export. Do not re-export them through a barrel or import a `.stylex.ts` module
as a namespace; the compiler needs to statically resolve the direct binding.

### Naming

- Exported component-owned style maps end in `Styles`: use the owner name for
  the primary map (`textStyles`, `tooltipStyles`) and add the narrow concern
  before the suffix when needed (`textSizeStyles`, `fieldInputStyles`).
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
	popupStaticPositionerStyles,
	popupViewportStyles,
	popupArrowStyles,
} from "@/components/popover/popover.stylex";
import { tooltipStyles } from "@/components/tooltip/tooltip.stylex";

// Normal Menu / Popover / LinkPreview / Tooltip Positioner
stylex.props(popupPositionerStyles, style);

// Select Positioner (does not track anchor while open)
stylex.props(popupStaticPositionerStyles, style);

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
<Popover.Popup positionerProps={{ style: popupMotionStyles.movingPositioner }} style={popupMotionStyles.movingPopup}>
	<Popover.Viewport>{content}</Popover.Viewport>
</Popover.Popup>
```

Compose as `stylex.props(<component parts>, <shared behavior>, style)` so the
caller's `style` always comes last.

### List item composition

Menu owns the canonical selectable-row appearance. Select, Combobox, and
other components that intentionally look like Menu items compose it directly:

```tsx
import { menuItemStyles, menuItemVariantStyles } from "@/components/menu/menu-item.stylex";

stylex.props(menuItemStyles.item, menuItemVariantStyles.default, style); // item row
stylex.props(menuItemStyles.label); // primary label cell
stylex.props(menuItemStyles.indicator); // check/radio slot
```

Override column layout with `menuItemVars` from the same module when a
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

Use granular exports (`fieldStyles.inputBase`, `fieldTextStyles`, …) only when
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
  rendered popup `Viewport`.   `scroll-fade.css` provides opt-in `xyz-scroll-fade*`
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

Design-system components accept a typed `style?: StyleXStyles` prop and apply
it as the last argument to `stylex.props`, so caller styles win
deterministically. Prefer it over `className` for styling; `className` remains
only for third-party interop.

```tsx
import * as stylex from "@stylexjs/stylex";
import { Button } from "@/components";

const styles = stylex.create({
	wide: { paddingInline: "2rem" },
});

<Button style={styles.wide}>Save</Button>;
```
