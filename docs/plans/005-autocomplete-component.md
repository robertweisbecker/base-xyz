# Plan 005: Add a free-form Autocomplete component

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan in
> `docs/plans/README.md`, unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat c6d9b8f..HEAD -- docs/adr/0011-layout-primitives-common-margins-and-stylex-overrides.md src/styles/README.md src/components/autocomplete src/components/field src/components/label src/components/index.ts src/app/gallery-page.tsx tests/components/autocomplete.spec.ts docs/plans/005-autocomplete-component.md docs/plans/README.md`
> Plan 004 is an explicit dependency, so its documented additions to
> `src/components/field`, `src/components/label`, `src/components/index.ts`,
> ADR 0011, `src/styles/README.md`, and the plan index are expected drift. Confirm that those changes
> match the landed Field/Label contracts and #19's merge evidence. Any other in-scope drift, or a materially
> different Field API, is a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: MED
- **Depends on**: landed public Field/Label wrappers from #19 (Plan 004),
  plus a real free-form consumer outside CommandPalette
- **Category**: direction
- **Planned at**: commit `c575346`, 2026-09-02
- **Reconciled at**: commit `c6d9b8f`, 2026-09-11
- **Execution baseline**: merged PR #57 (`c42ce205`), `@base-ui/react@1.8.0`;
  installed Autocomplete declarations and source re-audited for this plan
- **Issue**: intentionally local proposal until the dependency and demand gates pass
- **Status**: TODO — deferred; do not implement before #19 lands or without
  a named consumer needing free-form suggestions

## Why this matters

The library has a selection-owning `Combobox` and a product-specific
`CommandPalette`, but it has no general field for free-form text with suggestions.
Consumers must currently assemble Base UI Autocomplete directly or misuse
Combobox when the typed text itself, rather than a remembered selected value, is
the form value. Add a compact public Autocomplete compound that preserves Base
UI's filtering, keyboard, form, and generic-item behavior while applying the
repository's field, popup, item, StyleX, and accessibility conventions.

## Current state

### Product boundary and repository decisions

- `docs/adr/0004-component-block-and-compound-ownership.md` puts reusable,
  product-agnostic structures in `src/components/`, keeps Base UI as the
  semantic owner, and favors compact compound APIs over exhaustive mirrors.
- `docs/adr/0011-layout-primitives-common-margins-and-stylex-overrides.md:36-55`
  permits common margins only on a stable normal-flow public root and says a
  node-less controller has no margin host. Consumers apply field layout and
  margins to explicit Field.Root; actual control parts keep their own styles.
  Extend its existing ownership prose; there is no component table to update.
- `src/styles/README.md:14-34,66-88` requires an eligible root to call
  `extractMarginProps` once, compose defaults then margins then `xstyle`, merge
  native `style` after StyleX output, and keep compound parts outside the common
  margin surface.
- `src/components/index.ts` is the public component source of truth. Gallery
  specimens import from that barrel and stay alphabetically ordered.
- Plan 004 makes existing inputs standalone and adds public Field/Label
  composition. Autocomplete follows that boundary: its controller creates no
  Field; examples use public Field/Label parts for optional field structure.
  Keep field styles with their canonical owners.

### The behavioral distinction is real

Base UI documents Autocomplete as an input that suggests options while the
typed string remains the value. Combobox is for choosing and retaining one or
more values from an option domain. Use the Autocomplete primitive directly;
do not implement this as a Combobox mode or add remembered selection state.

Official reference:
<https://base-ui.com/react/components/autocomplete>.

The original audit used `@base-ui/react@1.7.0`. The execution contract below has
been re-audited against installed `@base-ui/react@1.8.0` from merged PR #57;
the earlier version is historical evidence, not an execution requirement.
`node_modules/@base-ui/react/autocomplete/root/AutocompleteRoot.d.ts` and
`AutocompleteRoot.js` establish these contracts:

- `Root` renders no HTML; its flat/grouped overloads infer item types for Root
  callbacks such as `itemToStringValue` and `onItemHighlighted`, not arbitrary
  JSX descendants. Item.value and Collection children are upstream `any`
  boundaries; Value supplies a string. Preserve those upstream signatures
  without adding a generic factory to manufacture cross-child inference.
- `value` and `defaultValue` inherit React input values (including numbers);
  `onValueChange` supplies a string. Preserve the accepted upstream domain.
- `items` and `filteredItems` accept readonly flat or grouped arrays. When both
  are supplied, `filteredItems` must preserve the flat/grouped structure of
  `items`; nullish entries are unsupported. Consumers prepare valid collections;
  the wrapper does not add a filtering or data-normalization layer.
- `mode` is `list | both | inline | none`; `list` is the default. In `both` and
  `inline`, `readOnly` prevents temporary inline-completion writes as well as
  ordinary input edits; keep this behavior delegated to Base UI.
- `itemToStringValue` converts object items for display and form submission.
- `form`, `submitOnItemClick`, controlled open state, highlight callbacks,
  `autoHighlight`, and `openOnInputClick` remain Base UI-owned behavior.
- Derive change/highlight callback details from the public Autocomplete types.
  In 1.8, its change details have a dedicated `BaseUIChangeEventDetails` type;
  do not substitute the internal AriaCombobox change-details alias.
- The primitive's selection mode is `none`; choosing a suggestion fills text
  but does not create Combobox-style selected state.

`node_modules/@base-ui/react/autocomplete/index.parts.d.ts:1-22` also exports
Value, Trigger, Input, InputGroup, Clear, List, Status, Portal, Positioner,
Popup, Group, GroupLabel, Item, Collection, Empty, and several advanced parts.
The public repository component should expose only the parts selected below.
The execution baseline's installed declarations take precedence over this audit.

### Existing local patterns to compose, not clone

`src/components/combobox/combobox-field.tsx:61-101` currently demonstrates the
field-wrapper boundary: root props combine Base UI behavior, `MarginProps`,
`BaseStyleProps`, `invalid`, and `FieldSize`; margins and `xstyle` land on the
outer Field while Base UI owns the inner controller.

At the planned commit Combobox still owns an implicit Base UI Field. Plan 004
removes that implicit ownership. Autocomplete follows the same controller-only
Root; consumers explicitly compose a Field when needed:

```tsx
<Field.Root name="query">
	<Label>Search</Label>
	<Autocomplete.Root items={items}>
		<Autocomplete.InputGroup>
			<Autocomplete.Input />
		</Autocomplete.InputGroup>
		{/* popup/results */}
	</Autocomplete.Root>
	<Field.Description>Choose a suggestion or enter your own text.</Field.Description>
	<Field.Error />
</Field.Root>
```

Autocomplete.Root provides only the necessary private size/readOnly context and
Base UI controller; it renders no Field or layout host. It also works without
Field when its actual input has an explicit accessible name. Preserve Root's
flat/grouped overloads; do not erase them with handwritten `any`.

`src/components/combobox/combobox-field.tsx:120-267,390-460` is the closest
control and popup precedent:

- the InputGroup uses `fieldStyles.input`, `fieldTextStyles[size]`,
  `fieldControlSizes[size]`, and `focusRing.within`;
- Input is visually unstyled inside the group and retains Base UI input props;
- Trigger and Clear are native-button Base UI parts with default accessible
  labels and repository icons;
- Popup privately composes Portal + Positioner + Popup, accepts nested
  `portalProps` and `positionerProps`, uses the Popover position/motion recipes,
  and exposes no common margins;
- List owns scrolling and a bounded available-height maximum.

Use those seams, but keep Autocomplete's styles in
`autocomplete.stylex.ts`. Do not import `comboboxParts` or make Autocomplete a
wrapper around the repository Combobox; that would give one public component
ownership over another component's private anatomy.

`src/components/menu/menu-item.stylex.ts:7-15,77-101` explicitly defines
`itemMarker` and `menuItemStyles.item` as the canonical selectable-row recipe
for Menu, Select, Combobox, Autocomplete, and related rows. Autocomplete Item
must compose that recipe, its size recipe, the default item variant, and
`focusRing.inset`. Because Autocomplete has no selection indicator, override the
recipe's indicator/label grid to one content column in an Autocomplete-owned
style; do not render an empty indicator or copy the menu recipe.

`src/components/command-palette/command-palette.tsx:1-12,125-169,171-234`
already uses Base UI Autocomplete successfully, but owns dialog/inline command
surfaces, global shortcuts, close-on-select, item slots, and command-specific
layout. It is evidence for dependency compatibility, not the abstraction to
extend. Leave it independent and unchanged.

`tests/playwright.ts:6-22` automatically fails every test on browser console
errors and page errors. Import `test` and `expect` from that fixture; do not add
per-spec duplicate diagnostic hooks.

## Selected public contract

This is the candidate namespace, not authorization to ship every part. Once
a real consumer exists, confirm the smallest necessary surface and revise this
plan before execution if that differs. Do not activate it for gallery coverage
alone. The selected parts and their public prop types are:

```text
Autocomplete.Root
Autocomplete.InputGroup
Autocomplete.Input
Autocomplete.Trigger
Autocomplete.Clear
Autocomplete.Value
Autocomplete.Popup
Autocomplete.List
Autocomplete.Group
Autocomplete.GroupLabel
Autocomplete.Items
Autocomplete.Item
Autocomplete.Status
Autocomplete.Empty
```

Responsibilities:

- `Root<ItemValue>` preserves the node-less Base Autocomplete Root with private
  presentation context and `size?: FieldSize` (`sm | md | lg`, default `md`).
  Preserve disabled/readOnly/required/name/form, values, filtering, mode, open
  state, and callbacks. Do not add Field.Root, invalid, margins, className,
  native style, or xstyle to this controller.
- Consumers use public Label, Field.Description, and Field.Error in an explicit
  Field.Root when needed. Do not duplicate these as Autocomplete aliases or
  require a field wrapper for an independently named input.
- `InputGroup`, `Input`, `Trigger`, and `Clear` are styled wrappers around the
  corresponding Base UI parts. Composition is explicit: do not silently append
  Trigger/Clear or add a private Actions element.
- `Trigger` defaults to the repository's caret icon and accessible name
  `Show suggestions`; `Clear` defaults to the existing clear icon and accessible
  name `Clear value`. If visible children or an explicit accessible name are
  supplied, preserve them. Native buttons retain the default cursor.
- `Value` is Base UI's render-only value part and adds no DOM or styling.
- `Popup` privately owns Portal and Positioner, with
  `portalProps?: Omit<BaseAutocomplete.Portal.Props, "children">` and a styled
  `positionerProps` object. Default to `align="start"`, `side="bottom"`, and
  `sideOffset={6}` so the suggestion surface follows the input edge. Caller
  positioning props override these defaults.
- `List`, `Status`, `Empty`, `Group`, `GroupLabel`, and `Items` wrap the matching
  Base UI parts. `Items` names Base UI `Collection` in the public namespace so
  consumers can render filtered flat or grouped item arrays without a second
  data schema.
- `Item` accepts the full Base UI item contract, arbitrary children, and
  repository style props. Use the canonical default Menu variant internally;
  expose no Item.variant without demonstrated consumer demand.
  It must not add a checkmark, selected state, creatable mode, or forced content
  slots.

All styled part prop types omit Base UI `className` and `style`, then add
`BaseStyleProps` and `className?: string`. Retain Base UI refs, render props,
state callbacks, native attributes, and generic values. Component styles come
first, then caller `xstyle`; native `style` is merged last with `mergeStyle`,
and `className` is joined with `attrJoin`.

Do not publicly expose Portal, Positioner, Backdrop, Arrow, Icon, Row,
Separator, `useFilter`, or `useFilteredItems` in v1. The Root's Base UI
`filter`/`filteredItems` contracts already permit custom filtering; advanced
positioning remains reachable through Popup's nested props. A future concrete
consumer may justify another part without expanding this initial API now.

## Visual contract

- An optional caller-owned Field.Root supplies field structure; the controller
  creates no wrapper. InputGroup is the visible control chrome.
- InputGroup uses existing field surface, text-size, control-size, and
  focus-within recipes. Its layout reserves space only for explicitly rendered
  Trigger/Clear children; it does not inject controls.
- Input uses the shared unstyled/default input recipes and fills the remaining
  inline space without an inner border or outline.
- Popup owns only Autocomplete surface chrome: elevated background, border,
  radius, shadow, foreground, `minWidth: var(--anchor-width)`, and overflow.
  Compose existing Popover positioner and anchored-popup motion recipes.
- List is scrollable, uses token padding, `overscrollBehavior: contain`, and a
  maximum such as `min(22.5rem, var(--available-height))` consistent with
  Combobox. Empty removes list padding and Empty/Status use muted field-scale
  text. GroupLabel uses the shared field group-label recipe.
- Item composes the canonical Menu item marker/size/default variant and an
  Autocomplete-owned single-column override. Disabled and highlighted states
  come from Base UI data attributes and shared recipes.
- Use only existing tokens. If the desired implementation needs a new token,
  a global selector, a universal marker, or a literal replacing a stable token,
  stop for review.

## Commands you will need

| Purpose            | Command                                                                                                                                                              | Expected on success                                                |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Inspect base       | `git status --short --branch && git rev-parse --short HEAD`                                                                                                          | intended checkout; no unrelated implementation changes             |
| Confirm dependency | `test -f src/components/field/field.tsx && test -f src/components/label/label.tsx && rg -n 'Field' src/components/index.ts && rg -n 'Label' src/components/index.ts` | Plan 004 public wrappers exist                                     |
| Confirm package    | `node -p "require('./node_modules/@base-ui/react/package.json').version"`                                                                                            | prints `1.8.0`; reconcile any later version before execution       |
| Typecheck          | `npm run typecheck`                                                                                                                                                  | exit 0, no errors                                                  |
| Standard gate      | `npm run verify:quick`                                                                                                                                               | typecheck, blocking lint, advisory complexity, and formatting pass |
| Build stories      | `npm run build-storybook`                                                                                                                                            | exit 0 and Autocomplete stories index                              |
| Focused browser    | `npx playwright test tests/components/autocomplete.spec.ts`                                                                                                          | all Autocomplete tests pass with no console/page errors            |
| Full gate          | `npm run verify:full`                                                                                                                                                | app, Storybook, browser, StyleX dev, and bundle gates pass         |

If another checkout owns the default Storybook port, leave it running and use
an unused port, for example:

```sh
PLAYWRIGHT_STORYBOOK_PORT=6116 npx playwright test tests/components/autocomplete.spec.ts
```

## Suggested executor toolkit

- Before any component or StyleX edit, read
  `.agents/resources/stylex-authoring.md`, ADRs 0003, 0004, and 0011, and
  `src/styles/README.md` in full.
- Inspect landed `src/components/field/field.tsx`, `src/components/label/label.tsx`,
  ADR 0011, and #19's merge evidence before designing Root. Completed plan files
  are removed; do not require the retired Plan 004 file. Do not add implicit
  Field ownership to Autocomplete.
- Use the installed Base UI 1.8 declarations and source as the execution
  authority, with the official Autocomplete docs for behavior examples. Live
  docs may describe a newer release; re-audit changed contracts before using a
  later dependency version. Do not downgrade to the historical 1.7 audit.
- If available, use `vercel:react-best-practices` after editing TSX as a review
  pass. It must not expand the API or override repository ADRs.

## Scope

**In scope** (the only files you should modify):

- `docs/adr/0011-layout-primitives-common-margins-and-stylex-overrides.md`
- `src/styles/README.md`
- `src/components/autocomplete/autocomplete.tsx` (create)
- `src/components/autocomplete/autocomplete.stylex.ts` (create)
- `src/components/autocomplete/autocomplete.stories.tsx` (create)
- `src/components/autocomplete/index.ts` (create)
- `src/components/index.ts`
- `src/app/gallery-page.tsx`
- `tests/components/autocomplete.spec.ts` (create)
- `docs/plans/005-autocomplete-component.md`
- `docs/plans/README.md`

**Out of scope**:

- Changes to `Combobox`, `CommandPalette`, or their public contracts and styles.
- A shared Combobox/Autocomplete implementation abstraction. Their state models
  differ; a later maintenance pass can extract only proven identical seams.
- Remembered selection, multi-select, chips, creatable items, tokenization, or
  validation of typed text against the suggestions. Use Combobox for selection.
- Command-palette dialog/inline modes, global shortcuts, command closing, item
  description/shortcut slots, or product-specific search actions.
- Public Portal, Positioner, Backdrop, Arrow, Icon, Row, Separator, filter hooks,
  virtualization, grid navigation, or a fuzzy-search dependency.
- A Base UI version change or any new dependency.
- New tokens, global JSX augmentation, intrinsic `sx`, line suppressions, or
  global DOM prop filters.
- Screenshots or assertions on generated classes, exact colors, incidental
  popup geometry, animation frames, or showcase copy.
- Commits, pushes, PR creation, routing changes, or unrelated plan execution.

## Git workflow

- Base: current `main` after Plan 004 lands. This plan was authored at
  `c575346`; expected dependency drift is described in the opening drift check.
- If the operator wants an implementation branch, create
  `codex/autocomplete-component` from that current main; otherwise remain in the
  checkout they designate.
- Prefer one implementation commit after all gates pass:
  `[codex] Add autocomplete component`.
- Do not commit, push, or open a PR unless instructed.

## Steps

### Step 1: Confirm demand, landed Field/Label, and ownership

Name the real free-form consumer, its required parts, and why Combobox is not
its semantic owner. STOP/defer if none exists or #19 has not landed. Record
#19's landed commit/PR and read the resulting Field/Label source, independent
of whether its temporary plan still exists. Confirm:

1. `Field.Root` is the optional explicit field wrapper and accepts margins,
   `invalid`, `disabled`, and the repository style channels.
2. top-level `Label` preserves Base UI Field association;
3. `Field.Description` and `Field.Error` preserve Base UI accessibility state;
4. these wrappers can surround a node-less controller without a second Field
   owner, while a named input also works standalone.

Amend the existing ADR 0011 decision, because this is another application of
the same margin rule rather than a distinct architecture decision:

- state that Autocomplete.Root remains node-less and has no margins or styles;
- callers own any Field.Root and its field layout/margins;
- keep InputGroup, Input, controls, popup, positioner, list, and items outside
  common margins.

Update `src/styles/README.md`'s field recipe/module ownership table to include
Autocomplete shells and mention the public Field composition if Plan 004 did
not already do so. Do not create a new ADR.

**Verify**:

```sh
npx prettier --check docs/adr/0011-layout-primitives-common-margins-and-stylex-overrides.md src/styles/README.md
```

Expected: exit 0, and `rg -n 'Autocomplete'` finds the new ownership statement
in both documents.

### Step 2: Add the node-less generic controller

Create autocomplete.tsx with a private size/readOnly context around
BaseAutocomplete.Root. Derive RootProps from BaseAutocomplete.Root.Props with
only the existing FieldSize addition. Forward behavioral props directly; do not
add FieldRootProps or a wrapper-prop split. Preserve flat and grouped item
inference through the installed overloads.

If rest forwarding cannot preserve the installed overloads, use explicit public
overloads and one narrow unknown-based boundary with an accurate SAFETY comment,
following CommandPalette. Do not add handwritten any, string-only item limits,
or a generic factory. There are no Autocomplete Label/Description/Error wrappers;
examples consume those public field primitives directly.

Add the local barrel and public barrel exports, including public prop/size types. Put Autocomplete before Avatar in `src/components/index.ts` so
the new export is alphabetical without reordering unrelated existing exports.

Use a temporary type-only probe, then remove it, to prove:

- flat `{ id: string; label: string }[]` and grouped
  `{ value: string; items: User[] }[]` preserve Root callback inference in
  `itemToStringValue` and `onItemHighlighted`;
- `onValueChange` receives a string and Base UI event details;
- numeric/string values remain accepted as upstream allows; boolean/object
  controlled values fail;
- Collection render callbacks in examples use explicit item annotations where
  upstream supplies `any`; Item.value is not a negative inference probe. Do not
  add handwritten `any` or a generic propagation framework to compensate.

**Verify**:

```sh
npm run typecheck
rg -n 'from "@base-ui/react/field"' src/components/autocomplete
```

Expected: typecheck exits 0; the import search returns no matches.

### Step 3: Add styled control, popup, and result parts

Create `autocomplete.stylex.ts` with component-owned maps for only the anatomy
Autocomplete adds. Compose shared owners from the TSX implementation rather
than copying them into the new style file:

- field input/group/text/size recipes;
- focus and pressable recipes;
- Popover popup position/motion recipes and popup variables;
- Menu item marker, size, and default variant recipes.

Implement InputGroup, Input, Trigger, Clear, Popup, List, Group, GroupLabel,
Items, Item, Status, and Empty exactly as described in "Selected public
contract" and "Visual contract". Important boundaries:

1. InputGroup renders only caller children; Trigger and Clear are explicit.
2. Trigger/Clear preserve Base UI button props and refs, provide accessible
   default labels only when needed, use repository icons, and never add
   `cursor: pointer`.
3. Popup is the sole public popup entry and privately composes Portal and
   Positioner. Its nested positioner style props use the repository merge
   order, and Base UI positioning props remain authoritative.
4. Item composes `menuItemStyles.item` so `itemMarker` is applied to the actual
   Base item root, then uses the context size, default Menu variant, inset focus
   ring, and a local one-column override. Its child content occupies column 1.
5. Status and Empty remain live Base UI parts; do not invent loading/filtering
   state or inspect children.
6. Value and Items preserve their actual upstream render-function signatures
   without added DOM. Value exposes a string; explicitly annotate Collection
   item callbacks in examples when contextual typing does not infer the item.

Do not import `comboboxParts`, wrap repository `Combobox`, or copy its selection
indicator. Keep arbitrary Item children rather than adding start/end slots.

**Verify**:

```sh
npm run typecheck && npm run lint
```

Expected: exit 0, no unused types, no StyleX ownership/order errors, and no
suppression for intrinsic JSX props.

### Step 4: Add focused Storybook documentation

Create `src/components/autocomplete/autocomplete.stories.tsx` with title
`Components/Autocomplete`. `Playground` must be the first exported story and
use object items so generic inference is exercised in ordinary repository code.

Playground controls:

- actual public props: `disabled`, `readOnly`, `required`, `size`,
  `mode`, and `openOnInputClick`;
- story-only controls: `_label`, `_placeholder`, and `_invalid`; map `_invalid`
  to the caller's Field.Root, never Autocomplete.Root;
- omit filtering functions, item arrays, render props, portal/positioner props,
  `xstyle`, and callback objects from controls.

Add consolidated fixed stories with controls disabled:

- `States`: disabled, read-only, required, invalid with Error, and empty results;
- `Examples`: grouped object items with Group/GroupLabel/Items, asynchronous
  suggestions with controlled `value` and Status, and `mode="both"` inline
  completion. Keep these as clearly labeled sections with realistic neutral
  content, not cards or decorative wells.
- Add a small submission/callback scenario only if observable form output
  cannot fit an existing realistic example. Use story-owned markers only for
  that output; interaction uses roles and labels. Do not require a separate
  all-purpose behavior fixture.

Every input has an accessible Label or explicit name. Show Description/Error
only where they demonstrate the field relationship. Do not describe
Autocomplete as selection or add chips/checkmarks.

**Verify**:

```sh
npm run build-storybook
```

Expected: exit 0; `Components/Autocomplete` indexes with Playground first and
all examples load without console errors.

### Step 5: Add one public Gallery specimen

Update `src/app/gallery-page.tsx` through `Autocomplete` from `@/components`.
Add the import and cell in alphabetical order before Avatar. Use a compact,
free-form search example with a small stable item array; compose public Field.Root/Label as needed plus Autocomplete InputGroup, Input,
explicit Trigger/Clear, Popup, List, Item, and Empty as appropriate.

The specimen proves the public barrel only. Do not import private styles or the
component's source path, add product behavior, duplicate Storybook examples, or
redesign the Gallery.

**Verify**:

```sh
npm run build
```

Expected: exit 0 and `rg -n '@/components/autocomplete' src/app/gallery-page.tsx`
returns no matches.

### Step 6: Add durable browser contracts

Create `tests/components/autocomplete.spec.ts`, importing the shared Playwright
fixture. Map the cases to real scenarios: Playground covers typing, keyboard,
Trigger/Clear, and object stringification; States covers editing constraints
and Field relationships; Examples covers grouped/disabled items, inline
completion, and free-form submission. Include a disabled option in the grouped
example. Add one submission-output scenario only if necessary. Cover:

1. The input is named by Label, exposes combobox semantics, opens a listbox,
   filters suggestions after typing, moves highlight with ArrowDown, and Enter
   fills the input with the highlighted item string.
2. Unmatched free-form text remains the input/form value after blur or submit;
   no selected-value state or forced clearing is introduced. Clear empties it,
   and Trigger/Clear have accessible names.
3. Object and grouped items stringify correctly, groups retain accessible
   labels, disabled options are skipped, and `mode="both"` reports the expected
   autocomplete semantics and accepts keyboard completion.
4. Disabled/read-only/invalid states preserve editing constraints and the
   Error/Description relationships owned by Field.

Prefer role/name/state assertions. Exact test copy is allowed only for
fixture-owned submitted/callback output. Do not assert generated StyleX
classes, exact colors, popup coordinates, animation timing, internal SVGs, or
Base UI implementation details.

**Verify**:

```sh
npm run build-storybook && npx playwright test tests/components/autocomplete.spec.ts
```

Expected: all focused tests pass and the shared fixture reports no console or
page errors.

### Step 7: Run repository gates and live interaction QA

Run:

```sh
npm run verify:full
```

The full gate includes quick and must exit 0. Then start Storybook and manually inspect Playground, States,
and Examples after optimization finishes:

- pointer open, filtering, item press, Clear, and Trigger behavior;
- keyboard focus, ArrowUp/ArrowDown, Enter, Escape, Tab, and disabled-item skip;
- accessible names, Description/Error relationships, read-only and disabled
  behavior, free-form form submission, and grouped results;
- `sm`, `md`, and `lg` input/item alignment and popup width/scroll behavior;
- browser console and page-error state.

This manual review is a required design feedback loop, not a screenshot gate.
If Storybook transiently reports a missing story or `Invalid empty selector`,
reload/restart and reacquire the story before changing valid code.

**Verify**: record the passing full gate and focused browser command and the manually reviewed story
IDs in the implementation handoff.

### Step 8: Reconcile the plan index and final diff

After the required checks pass, close the linked issue with implementation and
verification evidence (or record that this intentionally local proposal has no
issue), and distill durable decisions into the owning ADR or guide. Optionally
copy the final plan to `.scratch/plans/completed/`, remove its tracked file, and
move 005's row to the retired ledger in `docs/plans/README.md` with DONE status
and commit/PR evidence. Keep its number reserved and preserve the next-number
marker; do not leave a completed plan in the active table.
Report unrelated failures without changing concurrent work.

Run:

```sh
git status --short
git diff --check
git diff --stat
```

Expected: only the in-scope files are modified, `git diff --check` exits 0, and
the status/index agree. Do not retain temporary type probes, generated
Storybook output, Playwright artifacts, or execution transcripts.

## Test plan

- New file: `tests/components/autocomplete.spec.ts`.
- Structural pattern: `tests/components/combobox.spec.ts` for focused component
  navigation and `tests/playwright.ts` for automatic browser diagnostics.
- Behavioral cases: accessible explicit field association and standalone named input, filtered listbox, keyboard
  highlighting/fill, free-form persistence and form value, Trigger/Clear,
  object/group inference at compile time, grouped/disabled item behavior,
  inline completion semantics, and field states.
- Type coverage: temporary compile-only probes during Step 2, removed after
  proving Root callback inference and upstream accepted value types.
- Verification:
  `npm run build-storybook && npx playwright test tests/components/autocomplete.spec.ts`
  → all new tests pass with no console/page errors.
- Full verification: `npm run verify:full` → exit 0.

## Done criteria

- [ ] A real consumer justifies the selected API; #19's implementation is
      landed and examples use its public Field/Label composition.
- [ ] `Autocomplete` and all selected public prop types export from
      `src/components/index.ts`; Gallery consumes only that public export.
- [ ] Root preserves flat/grouped Root callback inference, upstream value types,
      Base UI filtering/open/form callbacks, and free-form input behavior.
- [ ] Root renders no HTML/Field and has no margin/style props. Consumers own
      optional Field composition; a standalone named input works without one.
      ADR 0011 and the style guide document the boundary.
- [ ] The public namespace contains exactly the selected v1 parts; no advanced
      Base UI mirror, remembered selection, or command behavior was added.
- [ ] Input, explicit controls, popup, results, grouped items, status, and empty
      state use repository recipes/tokens and preserve Base UI render/ref props.
- [ ] `npm run verify:quick` exits 0.
- [ ] Focused Playwright tests pass with shared console/page-error diagnostics.
- [ ] `npm run verify:full` exits 0.
- [ ] Live Storybook pointer, keyboard, accessibility, form, size, popup, and
      console checks are recorded.
- [ ] No files outside the in-scope list are modified and no generated output or
      temporary probe remains.
- [ ] Completion evidence is recorded and Plan 005 is retired after all gates pass.

## STOP conditions

Stop and report; do not improvise if:

- No real free-form consumer is identified, #19 has not landed, or its public
  Field/Label parts are absent or cannot compose with a node-less controller
  without a second Field owner.
- The installed `@base-ui/react` version differs from the reviewed 1.8.0
  baseline without a recorded compatibility reconciliation, or its Autocomplete
  Root, item inference, filtering collections, value semantics, mode, or part
  contracts materially differ from this plan. Do not downgrade dependencies to
  satisfy the original audit.
- Preserving flat/grouped Root callback inference requires handwritten `any`, a public
  string-only restriction, or an inaccurate overload.
- Free-form input/form behavior cannot be preserved without adding selection
  state or changing the repository Combobox.
- Accessible Label/Description/Error relationships fail through the public
  Field composition and appear to require manual ARIA duplication.
- Correct styling requires importing Combobox's private anatomy, changing
  Combobox/CommandPalette, adding a token/dependency/global selector, or
  exposing an out-of-scope advanced Base UI part.
- A required step needs a file outside the in-scope list.
- An in-scope current-state excerpt has drifted for reasons other than the
  documented Plan 004 dependency.
- A verification command still fails after two reasonable, in-scope attempts.

## Maintenance notes

- Autocomplete owns free-form suggestions; Combobox owns retained selection;
  CommandPalette owns command execution surfaces. Review future feature
  requests against that boundary before sharing implementation.
- Base UI's Root overloads are load-bearing. Recheck object and grouped inference
  whenever upgrading `@base-ui/react` or changing Root prop forwarding.
- If a real consumer needs virtualization, a grid, Separator/Row, fuzzy search,
  or filter hooks, extend the closed namespace from that concrete use case. Do
  not preemptively mirror Base UI.
- Reviewers should scrutinize the node-less Root and absence of duplicate Field
  ownership, Item's canonical marker/single-column override, and free-form form
  submission more closely than visual similarity to Combobox.
- If repeated Autocomplete/Combobox maintenance later proves a stable common
  internal seam, extract a neutral recipe/helper then. Do not make one public
  component depend on the other's private styles.
