# Plan 003: Add a semantic Description list component

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report; do not improvise. When done, update the status row for this plan in
> `docs/plans/README.md`, unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat bf25e43..HEAD -- src/components/description-list src/components/index.ts src/app/gallery-page.tsx src/blocks/agent-action-approval/agent-action-approval.tsx src/styles/constants.stylex.ts src/styles/README.md tests/components/description-list.spec.ts CONTEXT.md docs/adr/0011-layout-primitives-common-margins-and-stylex-overrides.md docs/plans/003-description-list-component.md docs/plans/README.md`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding. On a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: none
- **Category**: direction
- **Planned at**: commit `bf25e43`, 2026-08-27
- **Status**: TODO

## Why this matters

The library has semantic `List`, `Table`, and stateful `DataTable` components,
but no public primitive for associated name/value metadata. One product block,
`AgentActionApproval`, already implements generic `dl`/`dt`/`dd` anatomy and
key/value layout privately. Other SaaS surfaces such as profiles, API keys,
usage summaries, billing facts, and audit details would otherwise repeat that
markup and styling.

Add a product-agnostic `DescriptionList` compound under `src/components/`.
Use Radix Themes' Data List as the compact API baseline and GOV.UK's Summary
List as the usability baseline for key facts, responsive rows, optional row
actions, and divided presentation. Preserve the existing
`AgentActionApproval` public API by adapting its four metadata parts to the new
component instead of removing them in this plan.

## Research and selected implementation

### External behavior to preserve

- The HTML Standard calls `dl` a description list made of name/value groups;
  `dd` may be a description, definition, or value. Use `DescriptionList`, not
  the narrower historical name `DefinitionList`:
  <https://html.spec.whatwg.org/multipage/grouping-content.html#the-dl-element>.
- Radix Themes' Data List uses `Root`, `Item`, `Label`, and `Value`, renders
  `dl`/`div`/`dt`/`dd`, supports horizontal and vertical orientation, supports
  three sizes, and gives only the root common margins:
  <https://www.radix-ui.com/themes/docs/components/data-list> and
  <https://github.com/radix-ui/themes/blob/main/packages/radix-ui-themes/src/components/data-list.tsx>.
- GOV.UK's Summary List uses a `dl` with grouped rows, reserves it for key facts
  rather than tabular or ordinary list content, stacks rows at narrow widths,
  and allows a second `dd` containing actions. It recommends contextual hidden
  text such as “Change name” because a bare “Change” link is ambiguous outside
  its visual row. It also explains that row borders help associate actions with
  their values:
  <https://design-system.service.gov.uk/components/summary-list/>.

### Methods considered

| Method                                 | Decision      | Reason                                                                                                                                           |
| -------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `DescriptionList` name                 | **Use**       | Matches the current HTML term and covers metadata/name-value associations that are not literal definitions.                                      |
| `DefinitionList` name                  | Reject        | Suggests glossary definitions and undersells account facts, metadata, identifiers, and settings summaries.                                       |
| `DataList` name                        | Reject        | Conflicts conceptually with the existing data-driven `DataTable` layer and does not reveal the native semantic contract.                         |
| Compound children                      | **Use**       | Preserves arbitrary rich React content, native attributes, multiple values, and caller-controlled mapping without creating a second data schema. |
| `items`/`rows` array prop              | Reject for v1 | Would duplicate compound content through a parallel API and force premature types for links, badges, code, missing values, and actions.          |
| Optional `Actions` part rendering `dd` | **Use**       | Captures the GOV.UK row-action pattern with correct group semantics while leaving accessible action names and actual controls caller-owned.      |
| `grid` orientation                     | **Use**       | Adds a SaaS metadata layout where items become equal-width columns in naturally wrapping rows while preserving DOM and reading order.            |
| Token-aligned container stacking       | **Use**       | The list should adapt to its parent through a container selector that shares the repository breakpoint names and thresholds.                     |
| Built-in summary-card wrapper          | Reject        | `Card` already owns that surface. Consumers can compose `Card` and `DescriptionList` without another wrapper or heading API.                     |

### Chosen ownership boundary

This is a presentation-only component. It owns native description-list
semantics, responsive row layout, typography, spacing, and optional row
dividers. It owns no dataset, mutations, selection, editing, routing, or action
callbacks.

Implement and export exactly this initial namespace:

```tsx
export type DescriptionListOrientation = "horizontal" | "vertical" | "grid";
export type DescriptionListSize = "sm" | "md" | "lg";
export type DescriptionListVariant = "plain" | "divided";
export type DescriptionListItemAlign = "start" | "center" | "baseline";

export const DescriptionList = {
	Root,
	Item,
	Label,
	Value,
	Actions,
} as const;
```

Supported composition:

```tsx
<DescriptionList.Root labelWidth="7rem" orientation="horizontal" size="md" variant="divided">
	<DescriptionList.Item>
		<DescriptionList.Label>Workspace name</DescriptionList.Label>
		<DescriptionList.Value>Acme Design</DescriptionList.Value>
		<DescriptionList.Actions>
			<Link href="#workspace-name">
				Change<VisuallyHidden> workspace name</VisuallyHidden>
			</Link>
		</DescriptionList.Actions>
	</DescriptionList.Item>
	<DescriptionList.Item align="center">
		<DescriptionList.Label>Status</DescriptionList.Label>
		<DescriptionList.Value>
			<Badge hue="success">Active</Badge>
		</DescriptionList.Value>
	</DescriptionList.Item>
</DescriptionList.Root>
```

### Required public props and defaults

Define explicit native prop types rather than a generic polymorphic helper:

```tsx
type DescriptionListPartStyleProps<T> = Omit<T, "className" | "style"> &
	BaseStyleProps & {
		className?: string;
	};

export type DescriptionListRootProps = Omit<
	ComponentPropsWithRef<"dl">,
	"className" | "style" | keyof MarginProps
> &
	MarginProps &
	BaseStyleProps & {
		className?: string;
		labelWidth?: string;
		orientation?: DescriptionListOrientation;
		size?: DescriptionListSize;
		variant?: DescriptionListVariant;
	};

export type DescriptionListItemProps = DescriptionListPartStyleProps<
	ComponentPropsWithRef<"div">
> & {
	align?: DescriptionListItemAlign;
};
export type DescriptionListLabelProps = DescriptionListPartStyleProps<ComponentPropsWithRef<"dt">>;
export type DescriptionListValueProps = DescriptionListPartStyleProps<ComponentPropsWithRef<"dd">>;
export type DescriptionListActionsProps = DescriptionListPartStyleProps<
	ComponentPropsWithRef<"dd">
>;
```

Defaults:

- `orientation="horizontal"`
- `size="md"`
- `variant="plain"`
- `labelWidth="6.5rem"`, matching the current approval metadata layout
- `Item align="baseline"`

Only `Root` receives common `MarginProps`. Every part accepts native
attributes plus `className`, native `style`, and `xstyle` in repository
precedence order. Do not expose `render`, `as`, responsive prop objects,
per-label width props, label color/high-contrast props, trim props, or an
action callback. Do not expose a grid column count or minimum-column-width prop
in v1; `grid` owns one responsive auto-fit recipe. `xstyle` remains the escape
hatch for one-off presentation.

## Behavioral and visual contract

### Native semantics and structure

- `Root` renders exactly one `dl`; `Item` renders a direct `div`; `Label`
  renders `dt`; `Value` and `Actions` each render `dd`.
- Do not add ARIA roles that duplicate these native elements. Do not turn the
  component into a table or ordinary list.
- Use small development-only compound invariants, modeled after `Table`, so
  `Item` must be inside `Root`, and `Label`, `Value`, and `Actions` must be
  inside `Item`. Do not inspect children to enforce exact counts: HTML permits
  more than one term or value in a group, and fragments/mapped children must
  remain possible.
- `Actions` supplies layout and `dd` semantics only. Consumers own the links or
  buttons and must include enough visible or visually hidden text to make each
  action understandable outside the row. Do not derive accessible names by
  reading `Label` children.

### Layout and variants

- `Root` establishes `containerType: "inline-size"`. Responsive layout is
  relative to the rendered list width, not the viewport; do not use media
  queries for this component.
- Add `containerBreakpoints` beside `breakpoints` in
  `src/styles/constants.stylex.ts`. It is a `stylex.defineConsts` selector set
  with the same `xs` through `xxl` names and numeric thresholds, expressed as
  mobile-first `@container (min-width: ...)` conditions. Keep the existing
  `breakpoints` and `breakpointRanges` exports unchanged. Container and viewport
  selectors cannot be the same string, so centralize both complete selector
  families rather than constructing queries in component files.
- `horizontal` defaults to the compact layout: value beneath a first row
  containing label and optional actions, following the GOV.UK pattern. At
  `[containerBreakpoints.sm]`, switch to the wide layout where label, value,
  and actions use named grid areas. Document this behavior; do not expose a
  responsive object prop.
- `vertical` remains stacked at every container width. Label and actions share
  the first row when actions exist; value occupies the next row.
- `grid` makes `Root` a wrapping CSS Grid. Use
  `repeat(auto-fit, minmax(min(100%, 14rem), 1fr))` so items fill equal-width
  columns across each row and naturally wrap as the container contracts.
  Default every `Item` to span the full grid width; at
  `[containerBreakpoints.sm]`, return it to automatic placement so multiple
  columns can form. Each `Item` is a vertical metadata column: label and
  optional actions share its first row, and value occupies the next row.
  Preserve source order as the visual and keyboard order; do not use dense
  packing or column-first flow. The fixed `14rem` minimum is component geometry,
  not a theme token or public prop.
- `labelWidth` controls the shared horizontal label column at
  `[containerBreakpoints.sm]` and above. It has no effect in `vertical` or
  `grid`. Apply it through a private component-owned StyleX custom property on
  `Root`, following Stepper's private `--_stepper-*` precedent. Do not add a
  token or a generic width prop to `Label`.
- `align` changes the row's cross-axis alignment through the closed
  `start | center | baseline` map. It must not become a generic flex/grid prop.
- `plain` uses spacing only. In `horizontal` and `vertical`, `divided` adds a
  semantic border between sequential rows. In `grid`, apply the divider to the
  block end of each item so every wrapped metadata cell keeps its action
  visually associated; do not attempt positional last-row detection. Do not
  add a card background, radius, shadow, or padding well; callers compose
  `Card` when they need a card.
- `sm`, `md`, and `lg` control the component's internal typography and row
  spacing. Use the existing Text-owned typography styles and theme tokens.
  Labels stay regular weight, smallest appropriate semantic type, and muted
  neutral; do not add accent colors or uppercase treatment.
- Values and labels must allow rich children and long unbroken identifiers.
  Preserve `minWidth: 0` and `overflowWrap: anywhere` at the narrow content
  boundaries.

### StyleX and override contract

- Put canonical styles in
  `src/components/description-list/description-list.stylex.ts`; use existing
  tokens and imported `containerBreakpoints.sm`, and export named `*Styles`
  maps. Follow the existing `PromptComposer` goal-toolbar
  `containerType`/`@container` precedent. Do not import viewport `breakpoints`
  or write a literal `@container` condition in the component. Do not add new
  theme tokens unless implementation proves an existing semantic token is
  genuinely missing; if that occurs, stop for review.
- `Root` is a stable normal-flow native host. Resolve its margin props exactly
  once with `extractMarginProps`, then compose component defaults, margin
  styles, and caller `xstyle`; merge native `style` last with `mergeStyle`.
- Parts receive no `MarginProps`. Compose their base/size/orientation/variant
  styles before caller `xstyle`, and merge native `style` last.
- Use the explicit `stylex.props(...)` spread/merge boundary on native JSX. Do
  not add intrinsic `sx`, a global JSX augmentation, generic DOM-prop filters,
  or universal `data-component`/`data-slot` markers.
- A private custom property for `labelWidth` is component-owned layout state,
  not a theme variable. Keep it prefixed `--_description-list-*` and local to
  this component.

## Current state

### Existing private description-list implementation

`src/blocks/agent-action-approval/agent-action-approval.tsx:28-31` declares
generic native metadata types under a product-specific namespace:

```tsx
export type AgentActionApprovalDetailsProps = StyledProps<ComponentProps<"dl">>;
export type AgentActionApprovalDetailProps = DivProps;
export type AgentActionApprovalDetailLabelProps = StyledProps<ComponentProps<"dt">>;
export type AgentActionApprovalDetailValueProps = StyledProps<ComponentProps<"dd">>;
```

The same file renders the semantic elements directly at lines 140-191 and
owns generic layout at lines 276-300:

```tsx
details: { margin: 0, gap: tokens["--space-2"], display: "flex", flexDirection: "column" },
detail: {
	gap: tokens["--space-3"],
	alignItems: "baseline",
	display: "grid",
	gridTemplateColumns: "6.5rem minmax(0, 1fr)",
},
```

`src/blocks/agent-action-approval/agent-action-approval.stories.tsx:45-58`
and `:115-136` exercise plain text, `Code`, and `Badge` values. The plan must
preserve those compositions and the current `AgentActionApproval.Details`,
`Detail`, `DetailLabel`, and `DetailValue` namespace keys. Repoint them to the
new component exports and remove only their duplicated implementation/styles;
do not remove or rename the compatibility surface in this plan.

### Repository architecture and conventions

- `docs/adr/0004-component-block-and-compound-ownership.md:12-18` assigns
  product-agnostic primitives to `src/components/`, keeps public contracts
  compact, requires native semantics, makes `src/components/index.ts` the
  public source of truth, and uses Storybook as the functional inventory.
- `docs/adr/0011-layout-primitives-common-margins-and-stylex-overrides.md:31-66`
  grants margins only to a stable normal-flow root; parts do not inherit the
  contract. Add `DescriptionList.Root` to the eligible compound-root row in the
  ADR rather than creating a new ADR.
- `docs/adr/0003-stylex-ownership-and-application.md:14-30` requires
  component-owned styles, defaults before caller `xstyle`, and native `style`
  last.
- `src/components/table/table.tsx:15-22` is the prop-type exemplar for
  root-only margins and styled compound parts. Its development invariants at
  lines 80-91 are the nesting-validation exemplar. Do not copy Table's dataset
  or scrolling behavior.
- `src/components/list/list.tsx` and
  `src/components/list/list.stylex.ts` are the native-list and typography
  exemplars. `DescriptionList` remains distinct because it associates labels
  and values rather than representing ordered/unordered items.
- `src/blocks/prompt-composer/goal-toolbar.tsx:199,255-261` is the local StyleX
  precedent for an inline-size query container and descendant `@container`
  conditions. Reuse the technique, not that block's visual rules or threshold.
- `src/styles/constants.stylex.ts:17-42` owns the six mobile-first viewport
  `breakpoints` and six `breakpointRanges`, but no container-selector family.
  Add `containerBreakpoints` there so the component does not own a duplicate
  `sm` threshold. The existing Vite serve preload already targets this module;
  do not change or bypass it.
- `src/components/index.ts` has no Description list export. Add the namespace
  and all public prop/enum types in alphabetical component order.
- `src/app/gallery-page.tsx:25-78` imports public components, and
  `getComponentCells()` keeps specimens alphabetical. Add `DescriptionList`
  between `DataTable` and `Dialog` in both places.
- `CONTEXT.md` distinguishes `List`, `Table`, and `DataTable` concepts but has
  no description-list term. Add one concise glossary bullet explaining the
  semantic name/value boundary and when to use Table/List instead.

### Storybook and test conventions

- Core component stories put `Playground` first, expose representative public
  props only, prefix story-only controls with `_`, and disable controls on
  fixed comparison stories. `src/components/item/item.stories.tsx` is the
  control and explanatory-label exemplar; `src/components/table/table.stories.tsx`
  is the rich semantic compound exemplar.
- `tests/components/list.spec.ts` and `tests/components/stepper.spec.ts` use
  stable Storybook fixtures, role/semantic queries, focused geometry checks,
  and a per-page console-error collector. Copy that console guard.
- Browser tests should gate native elements, accessible action names,
  documented container-responsive orientations, root margin/override
  precedence, and no leaked custom props. Do not gate exact colors, token
  values, padding, typography pixels, or incidental SVG/DOM internals.
- `package.json:9-26` defines the authoritative gates. `verify:quick` runs
  TypeScript, blocking Oxlint, and Prettier. `verify:full` adds app and
  Storybook builds, browser suites, and the StyleX bundle boundary.

## Commands you will need

| Purpose              | Command                                                                     | Expected on success                                                  |
| -------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Confirm checkout     | `git branch --show-current && git status --short`                           | expected task branch; no unrelated files are changed by the executor |
| Typecheck            | `npm run typecheck`                                                         | exit 0, no TypeScript errors                                         |
| Lint                 | `npm run lint`                                                              | exit 0, no blocking findings                                         |
| Format check         | `npm run format:check`                                                      | exit 0                                                               |
| Quick gate           | `npm run verify:quick`                                                      | exit 0                                                               |
| Storybook build      | `npm run build-storybook`                                                   | production Storybook build completes                                 |
| Live Storybook       | `npm run storybook`                                                         | dev server compiles the new imported selector without StyleX errors  |
| Focused browser test | `npx playwright test tests/components/description-list.spec.ts --workers=1` | all Description list tests pass with no console errors               |
| Full gate            | `npm run verify:full`                                                       | exit 0; all repository gates pass                                    |

The focused Playwright command requires a current `storybook-static` build;
run `npm run build-storybook` immediately before it. If another checkout owns
the default Storybook port, set an unused `PLAYWRIGHT_STORYBOOK_PORT` on the
Playwright command rather than stopping or reusing the other server. No package
installation or dependency change is part of this plan. If `node_modules` is
unavailable, stop and ask the operator before installing anything.

## Suggested executor toolkit

- Before writing StyleX, read `.agents/resources/stylex-authoring.md`,
  `docs/adr/0003-stylex-ownership-and-application.md`,
  `docs/adr/0004-component-block-and-compound-ownership.md`,
  `docs/adr/0011-layout-primitives-common-margins-and-stylex-overrides.md`, and
  `src/styles/README.md` completely.
- Use the executor's browser verification tooling for a live Storybook pass
  after the production Storybook build finishes. Exercise all three
  orientations, wide and narrow list containers independent of viewport size,
  all sizes, divided rows, rich values, and keyboard focus on row actions.

## Scope

**In scope** (the only source/test/documentation files to modify or create):

- `src/components/description-list/description-list.tsx` (create)
- `src/components/description-list/description-list.stylex.ts` (create)
- `src/components/description-list/description-list.stories.tsx` (create)
- `src/components/index.ts`
- `src/app/gallery-page.tsx`
- `src/blocks/agent-action-approval/agent-action-approval.tsx`
- `src/styles/constants.stylex.ts`
- `src/styles/README.md`
- `tests/components/description-list.spec.ts` (create)
- `CONTEXT.md`
- `docs/adr/0011-layout-primitives-common-margins-and-stylex-overrides.md`
- `docs/plans/003-description-list-component.md`
- `docs/plans/README.md`

**Out of scope** (do not touch, even if related):

- `package.json`, lockfiles, dependencies, theme tokens, global CSS, or shared
  style recipes.
- `List`, `Table`, `DataTable`, `Item`, `Card`, `Text`, or layout-primitives
  public APIs.
- Removing or renaming `AgentActionApproval.Details`, `Detail`, `DetailLabel`,
  or `DetailValue`; they are compatibility aliases in this plan.
- Moving agent blocks into an `AI/` Storybook or filesystem subtree.
- Inline editing, validation, save/cancel state, row selection, sorting,
  filtering, pagination, or data loading.
- Summary-card headers, action menus, a generic `rows` prop, a render callback,
  polymorphic `as`/`render`, or a second shorthand API.
- Automatic accessible-name generation for action links or buttons.

## Git workflow

- Start from the operator's intended checkout after running the drift check.
- Suggested branch: `codex/003-description-list`.
- Use one logical commit after all gates pass. Match recent history with a
  message such as `[codex] Add DescriptionList component`.
- Do not push, open a PR, or merge unless the operator explicitly requests it.
- Plans 002 and 004 are logically independent but also touch
  `src/components/index.ts`, `src/app/gallery-page.tsx`, and
  `docs/plans/README.md`. If either lands or is executing concurrently,
  rebase/reconcile those files and preserve every component; do not overwrite
  another plan's work.

## Steps

### Step 1: Implement the semantic compound and owned styles

Create `src/components/description-list/description-list.tsx` and
`description-list.stylex.ts` with the exact five-part namespace and public
types above.

Implementation requirements:

1. Extend `src/styles/constants.stylex.ts` with
   `containerBreakpoints = stylex.defineConsts(...)`. Mirror all six existing
   names and thresholds as mobile-first container selectors: `xs` 20rem, `sm`
   34rem, `md` 48rem, `lg` 63.25rem, `xl` 80rem, and `xxl` 87.5rem. Preserve
   the existing viewport selector exports verbatim.
2. Use native `dl`, `div`, `dt`, and `dd` elements with React 19 ref props.
3. Give `Root` one context containing `orientation`, `size`, `variant`, and
   `labelWidth`; give each item a small presence context for part invariants.
4. Use development-only invariant messages in the form
   `DescriptionList.Item must be rendered inside DescriptionList.Root.` and
   `DescriptionList.Label must be rendered inside DescriptionList.Item.`
   (equivalent messages for `Value` and `Actions`).
5. Reset native `dl` and `dd` margins. Use grid areas for the optional action
   column so values do not shift when `Actions` is absent.
6. Establish `containerType: "inline-size"` on `Root`. Implement compact
   horizontal and single-column grid defaults, then use
   `[containerBreakpoints.sm]` for the wide horizontal and wrapping-grid
   layouts. Keep vertical fixed, preserve the closed align/size/variant maps
   and long-value wrapping, and apply the private root label-width property.
   Add no literal media or container query in the component.
7. Apply root margins and override precedence exactly as specified. Do not pass
   `labelWidth`, `orientation`, `size`, or `variant` to the DOM.

**Verify**: `npm run typecheck` -> exit 0 with no TypeScript errors in the new
component.

### Step 2: Publish the component and record its ownership

Update `src/components/index.ts` to export `DescriptionList` and all nine
public types (`RootProps`, `ItemProps`, `LabelProps`, `ValueProps`,
`ActionsProps`, `Orientation`, `Size`, `Variant`, and `ItemAlign`). Keep the
export in alphabetical component order and choose one consistent explicit
export list; do not add a second folder barrel.

Update the eligible compound-root row in ADR 0011 to include
`DescriptionList.Root`. Add one `CONTEXT.md` glossary bullet stating that a
Description list is a native name/value association, while `List` is ordered or
unordered content and `Table` is for tabular relationships across columns. In
`src/styles/README.md`, document `containerBreakpoints` beside `breakpoints`:
both share names and thresholds, while callers choose the selector family that
matches viewport-relative or container-relative behavior.

**Verify**: `npm run typecheck && npm run lint` -> both commands exit 0.

### Step 3: Document the public contract in Storybook and the gallery

Create `description-list.stories.tsx` with `title: "Components/Description list"`
and `component: DescriptionList.Root`.

Stories:

1. `Playground` is the first export. Controls include `orientation`, `size`,
   `variant`, and `labelWidth`; `_showActions` is a story-only boolean. Omit
   `className`, native `style`, `xstyle`, and margin controls.
2. `Orientations` compares horizontal container-responsive layout, the
   naturally wrapping grid, and fixed vertical layout. Place horizontal and
   grid fixtures inside independently resizable wrappers so Storybook proves
   the list responds to its container rather than the viewport; include stable
   fixture hooks for the browser test.
3. `Sizes` compares `sm`, `md`, and `lg` together.
4. `Examples` shows: compact account metadata; rich `Code`/`Badge` values; a
   divided check-answers/settings list with contextual `Link` actions using
   `VisuallyHidden`; a missing value expressed as a link in `Value`; and a long
   identifier/wrapping case. Use sentence-case muted labels and separators,
   not specimen cards or tinted wells.

Add a small alphabetical gallery specimen between `DataTable` and `Dialog`.
Import `DescriptionList` from `@/components`, not its implementation path, so
the gallery verifies the public export.

**Verify**: `npm run build-storybook` -> the production Storybook build exits
0 and includes `components-description-list` stories.

### Step 4: Replace the product-block duplication without breaking its API

In `agent-action-approval.tsx`, import the new implementation directly from
its component module. Replace the four native type aliases and component
functions with compatibility aliases:

```tsx
export const Details = DescriptionList.Root;
export const Detail = DescriptionList.Item;
export const DetailLabel = DescriptionList.Label;
export const DetailValue = DescriptionList.Value;
```

Derive the corresponding exported prop types from those component parts.
Remove the now-unused `details`, `detail`, `detailLabel`, and `detailValue`
StyleX entries and imports made obsolete by that removal. Preserve the four
keys in the final `AgentActionApproval` namespace, and do not change its stories
or MDX parts table in this plan.

**Verify**:
`rg -n "function (Details|Detail|DetailLabel|DetailValue)|details:|detailLabel:|detailValue:" src/blocks/agent-action-approval/agent-action-approval.tsx`
-> no matches, then `npm run typecheck` -> exit 0.

### Step 5: Add focused semantic and responsive browser coverage

Create `tests/components/description-list.spec.ts`, copying the console-error
guard from `tests/components/list.spec.ts`.

Cover these durable contracts:

1. The fixture renders `DL > DIV` groups with `DT` labels and `DD` values; the
   optional action is another `DD`. Do not depend on implicit ARIA role mapping
   when a direct native-element assertion is clearer.
2. A bare visible “Change” action has the complete accessible name “Change
   workspace name” because the story supplies contextual `VisuallyHidden`
   text.
3. Keep the browser viewport fixed and compare wide and narrow wrapper
   fixtures. Horizontal labels and values are side by side in the wide
   container and stacked in the narrow container. The wide grid places at
   least two items in distinct columns; the narrow grid gives each item the
   same left edge and full row. The vertical example remains stacked in both
   wrappers. This proves container-query behavior rather than coincidental
   viewport media-query behavior; keep geometry assertions limited to these
   documented relationships.
4. A root fixture accepts a margin prop without leaking `m`, `mx`, `my`, `mt`,
   `mb`, `ms`, or `me` attributes; caller `xstyle` overrides component styling,
   and native `style` wins last for one intentionally conflicting property.
5. Rich values and long identifiers remain present and do not create a browser
   console error.

Build Storybook before the focused run.

**Verify**:
`npm run build-storybook && npx playwright test tests/components/description-list.spec.ts --workers=1`
-> all focused tests pass and the console-error collector is empty.

### Step 6: Run the repository gates and perform live review

Run `npm run verify:quick`, then `npm run verify:full`. If another checkout owns
the default preview port, rerun the affected Playwright command with an unused
`PLAYWRIGHT_STORYBOOK_PORT` or `PLAYWRIGHT_APP_PORT`; do not terminate or reuse
another checkout's server.

After optimized Storybook finishes, inspect the live stories in Chromium:

- verify `dl`/`dt`/`dd` structure and accessible action names;
- inspect horizontal, grid, vertical, divided, rich-value, long-value, and
  missing-information examples in both wide and narrow containers; confirm a
  narrow list stacks even while the browser viewport remains wide;
- tab to every row action and confirm visible focus and sensible order;
- switch Storybook theme controls and confirm semantic tokens remain legible;
- confirm no browser console errors.

Also start a clean Storybook development server and load the Description list
stories once. Confirm the imported `containerBreakpoints.sm` selector compiles
without `Invalid empty selector` or unresolved `var(...)` output. The existing
serve preload should make this work; do not replace the selector token with a
literal or modify `vite.config.ts` as a workaround. If port 6006 belongs to
another checkout, launch Storybook on an unused port instead of stopping the
other server.

Finally, inspect `git diff --check` and `git status --short`. Update this plan's
status row only after all required gates pass.

**Verify**: `npm run verify:full && git diff --check` -> both exit 0; `git
status --short` lists only the files permitted by this plan plus any
pre-existing operator-owned changes.

## Test plan

- New file: `tests/components/description-list.spec.ts`.
- Structural pattern: `tests/components/list.spec.ts` for native semantics and
  console capture; `tests/components/stepper.spec.ts` for the smallest useful
  documented geometry checks across container sizes.
- Required cases: native anatomy, contextual accessible action name,
  horizontal, grid, and vertical layout; narrow container-relative stacking;
  grid DOM/visual order; root margin and override precedence; no leaked custom
  props; rich/long values; and empty browser-console errors.
- Manual Storybook review remains the visual gate for exact typography,
  spacing, dividers, themes, and wrapping. Do not add screenshots or exact
  color/spacing assertions.

## Done criteria

- [ ] Public `DescriptionList` contains exactly `Root`, `Item`, `Label`,
      `Value`, and `Actions`.
- [ ] The public component is named `DescriptionList`; no `DefinitionList` or
      `DataList` alias is exported.
- [ ] Native output is `dl` with grouped `div`, `dt`, and one or more `dd`
      elements, without redundant ARIA roles or polymorphic escape hatches.
- [ ] Only `Root` accepts common margins; component defaults, margins,
      `xstyle`, and native `style` follow repository precedence without DOM
      prop leakage.
- [ ] Horizontal, grid, vertical, size, align, plain/divided, shared horizontal
      label width, rich content, long content, missing information, and
      optional action compositions are documented.
- [ ] Horizontal and grid layouts stack from `Root`'s inline size through
      `containerBreakpoints.sm`, with auto-fit grid wrapping above that token,
      no media-query dependency, and no reordered focus/reading sequence.
- [ ] `containerBreakpoints` mirrors every existing viewport breakpoint name
      and threshold in `constants.stylex.ts`; the component contains no literal
      responsive-query string.
- [ ] Row-action examples have complete accessible names supplied by caller
      content.
- [ ] `AgentActionApproval` delegates its metadata anatomy to
      `DescriptionList` while retaining its existing four public namespace
      keys.
- [ ] ADR 0011 and `CONTEXT.md` record the ownership and semantic boundary;
      README gains no duplicate component inventory.
- [ ] Storybook and the gallery consume the public `@/components` export and
      remain alphabetical.
- [ ] No dependency, token, global CSS, or unrelated public API changes are in
      the diff.
- [ ] The focused browser spec passes with no console errors.
- [ ] `npm run verify:quick`, `npm run verify:full`, and `git diff --check` all
      exit 0.
- [ ] `docs/plans/README.md` status row is updated when implementation is
      complete.

## STOP conditions

Stop and report back; do not improvise if:

- Any current-state excerpt or in-scope file has materially drifted from commit
  `bf25e43`, including concurrent implementation of a description/data list.
- Preserving the four existing `AgentActionApproval` metadata keys requires a
  public behavior or prop-shape change rather than direct aliases.
- The current StyleX compiler cannot express the private label-width property,
  inline-size container, descendant container conditions, or auto-fit grid
  through the repository's explicit `stylex.props(...)` boundary. Do not fall
  back to media queries, global CSS, JSX augmentation, or a generic runtime
  style engine.
- `containerBreakpoints.sm` reaches a consumer as an unresolved CSS variable or
  causes `Invalid empty selector` after one clean dev-server restart. Preserve
  the token and report the compiler/preload issue; do not replace it with a
  literal query or alter `vite.config.ts` within this plan.
- Correct native grouping requires replacing `dl`/`dt`/`dd`, adding table/list
  roles, or child introspection that rejects valid multiple-name/value groups.
- The design appears to require a new theme token, global selector, shared
  recipe, package, or dependency.
- Plan 002, Plan 004, or another concurrent task changed a shared in-scope
  export/gallery file and cannot be cleanly reconciled without discarding any
  task.
- A required verification command fails twice after one focused correction.
- The implementation would need to modify a file listed as out of scope.

## Maintenance notes

- `Actions` does not generate contextual labels. Review future stories and
  consumers for action names that remain understandable outside their visual
  row.
- If a future consumer needs repeated titled groups, compose existing `Card`
  and heading primitives first. Do not add summary-card parts without a second
  workflow proving shared ownership.
- If many callers independently map the same typed data shape, evaluate a
  separate convenience renderer later. Keep the compound API authoritative.
- If future consumers need a configurable grid minimum, explicit column count,
  or a different container threshold, treat that as a focused follow-up with
  multiple product examples; do not silently widen the v1 orientation API.
- When the AI block subtree is reorganized, keep `DescriptionList` in
  `src/components/`; only the compatibility aliases move with
  `AgentActionApproval`.
- Reviewers should scrutinize native structure, margin stripping and override
  order, wide/narrow container behavior, grid reading/focus order, long-value
  wrapping, action names, and preservation of the existing approval-block API.
