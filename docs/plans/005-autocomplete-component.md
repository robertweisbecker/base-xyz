# Plan 005: Add a free-form Autocomplete component

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan in
> `docs/plans/README.md`, unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat c575346..HEAD -- docs/adr/0011-layout-primitives-common-margins-and-stylex-overrides.md src/styles/README.md src/components/autocomplete src/components/field src/components/label src/components/index.ts src/app/gallery-page.tsx tests/components/autocomplete.spec.ts docs/plans/004-form-field-primitives.md docs/plans/005-autocomplete-component.md docs/plans/README.md`
> Plan 004 is an explicit dependency, so its documented additions to
> `src/components/field`, `src/components/label`, `src/components/index.ts`,
> ADR 0011, and the plan index are expected drift. Confirm that those changes
> match Plan 004's public contracts. Any other in-scope drift, or a materially
> different Field API, is a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: MED
- **Depends on**: `docs/plans/004-form-field-primitives.md`
- **Category**: direction
- **Planned at**: commit `c575346`, 2026-09-02
- **Status**: TODO

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
  field component applies them to its field wrapper, not its input or popup.
  Its component table currently names `Combobox.Root` but not Autocomplete.
- `src/styles/README.md:14-34,66-88` requires an eligible root to call
  `extractMarginProps` once, compose defaults then margins then `xstyle`, merge
  native `style` after StyleX output, and keep compound parts outside the common
  margin surface.
- `src/components/index.ts` is the public component source of truth. Gallery
  specimens import from that barrel and stay alphabetically ordered.
- Plan 004 adds the public `Field` and `Label` wrappers and migrates direct Base
  UI Field imports. Autocomplete must consume those wrappers rather than add a
  fifth direct `@base-ui/react/field` import or duplicate their styles.

### The behavioral distinction is real

Base UI documents Autocomplete as an input that suggests options while the
typed string remains the value. Combobox is for choosing and retaining one or
more values from an option domain. Use the Autocomplete primitive directly;
do not implement this as a Combobox mode or add remembered selection state.

Official reference:
<https://base-ui.com/react/components/autocomplete>.

The installed dependency is `@base-ui/react@1.7.0`. Its declarations at
`node_modules/@base-ui/react/autocomplete/root/AutocompleteRoot.d.ts:9-123`
establish these contracts:

- `Root` renders no HTML and overloads flat and grouped `items` so object-item
  inference reaches child values and callbacks.
- `value`, `defaultValue`, and `onValueChange` own the input string.
- `mode` is `list | both | inline | none`; `list` is the default.
- `itemToStringValue` converts object items for display and form submission.
- `form`, `submitOnItemClick`, controlled open state, highlight callbacks,
  `autoHighlight`, and `openOnInputClick` remain Base UI-owned behavior.
- The primitive's selection mode is `none`; choosing a suggestion fills text
  but does not create Combobox-style selected state.

`node_modules/@base-ui/react/autocomplete/index.parts.d.ts:1-22` also exports
Value, Trigger, Input, InputGroup, Clear, List, Status, Portal, Positioner,
Popup, Group, GroupLabel, Item, Collection, Empty, and several advanced parts.
The public repository component should expose only the parts selected below.
Installed declarations win if live documentation has advanced beyond 1.7.

### Existing local patterns to compose, not clone

`src/components/combobox/combobox-field.tsx:61-101` currently demonstrates the
field-wrapper boundary: root props combine Base UI behavior, `MarginProps`,
`BaseStyleProps`, `invalid`, and `FieldSize`; margins and `xstyle` land on the
outer Field while Base UI owns the inner controller.

At the planned commit Combobox still imports Base UI Field directly. After
Plan 004, use this expected shape instead:

```tsx
<Field.Root disabled={disabled} invalid={invalid} {...fieldRootProps}>
	<AutocompleteContext.Provider value={{ readOnly, size }}>
		<BaseAutocomplete.Root disabled={disabled} readOnly={readOnly} {...autocompleteProps}>
			{children}
		</BaseAutocomplete.Root>
	</AutocompleteContext.Provider>
</Field.Root>
```

This is a structural example, not permission to pass Base Autocomplete props to
the Field host. Split margins and field-only props from controller props before
rendering. Preserve Root's flat and grouped item overloads; do not erase them
with `any`.

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

Export this initial namespace and its public prop types:

```text
Autocomplete.Root
Autocomplete.Label
Autocomplete.Description
Autocomplete.Error
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

- `Root<ItemValue>` wraps the node-less Base Autocomplete Root in the public
  `Field.Root`, provides `size` through private context, and is the only part
  with common `MarginProps`. Add `invalid?: boolean` and
  `size?: FieldSize` (`"sm" | "md" | "lg"`, default `"md"`). Preserve Base
  UI's `disabled`, `readOnly`, `required`, `name`, `form`, controlled/uncontrolled
  input, filtering, open state, mode, and callback props.
- `Label`, `Description`, and `Error` wrap Plan 004's public Label and Field
  parts. They apply no margins and do not create a second association model.
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
- `Item` accepts the full Base UI item contract, arbitrary children,
  `variant?: MenuItemVariant` (default `"default"`), and repository style props.
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

- The Field wrapper uses the shared field root recipe from Plan 004.
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
| Confirm package    | `node -p "require('./node_modules/@base-ui/react/package.json').version"`                                                                                            | prints `1.7.0`, or executor performs the compatibility STOP check  |
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
- Read `docs/plans/004-form-field-primitives.md` and inspect its landed public
  Field/Label types before designing Root. Do not use the pre-Plan-004 direct
  Base UI Field import shown in the current Combobox excerpt.
- Use the installed Base UI declarations as the type authority and the official
  Autocomplete docs for behavior examples. Check the Base UI 1.7 release notes
  when interpreting filtering locale, scroll reset, event reasons, or Separator
  semantics: <https://base-ui.com/react/overview/releases/v1-7-0>.
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

### Step 1: Confirm Plan 004 and record the ownership decision

Read Plan 004's landed Field and Label source. Confirm:

1. `Field.Root` is the one normal-flow field wrapper and accepts margins,
   `invalid`, `disabled`, and the repository style channels.
2. top-level `Label` preserves Base UI Field association;
3. `Field.Description` and `Field.Error` preserve Base UI accessibility state;
4. these wrappers can contain the node-less Base Autocomplete Root without an
   added host or direct Base UI Field import.

Amend the existing ADR 0011 decision, because this is another application of
the same margin rule rather than a distinct architecture decision:

- add `Autocomplete.Root` to the field-wrapper margin row;
- state that Base Autocomplete Root is node-less and its public Field wrapper is
  the sole margin/layout owner;
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

### Step 2: Add the generic Root and field parts

Create `src/components/autocomplete/autocomplete.tsx` and its private size
context. Type Root directly from `BaseAutocomplete.Root.Props<ItemValue>`, plus
`MarginProps`, `BaseStyleProps`, `className?: string`, `invalid?: boolean`, and
`size?: FieldSize`. Model overloads after the installed Base Root so both flat
and grouped item arrays retain their item type.

Split props deliberately:

- margins, `className`, native `style`, and `xstyle` go to public Field.Root;
- `invalid` goes to Field.Root only; `disabled` and `name` go to both Field.Root
  and BaseAutocomplete.Root because Field owns validation identity while Base
  Autocomplete owns the actual input;
- `size` and `readOnly` feed private presentation context;
- Base UI behavior props, including `children`, `readOnly`, `required`, `form`,
  and the duplicated `disabled`/`name`, go to BaseAutocomplete.Root; field-only
  props must not leak to the node-less controller.

If TypeScript cannot express the two installed Base UI overloads through a
rest spread, write explicit public overloads and keep one narrow
`unknown`-based forwarding boundary with a `SAFETY` comment explaining why it
is sound, following CommandPalette's precedent. Never use `any`, narrow object
items to strings, or publish an inaccurate type.

Add `Autocomplete.Label`, `.Description`, and `.Error` around Plan 004's public
parts. Preserve their render/ref/native props and style channels; add no
Margins. Do not import `@base-ui/react/field`.

Add the local barrel and public barrel exports, including public prop/size/item
variant types. Put Autocomplete before Avatar in `src/components/index.ts` so
the new export is alphabetical without reordering unrelated existing exports.

Use a temporary type-only probe, then remove it, to prove:

- `{ id: string; label: string }[]` infers the object in `itemToStringValue`,
  item value, and highlight callback;
- grouped `{ value: string; items: User[] }[]` infers `User`;
- `onValueChange` receives a string and Base UI event details;
- invalid props such as a numeric controlled `value` fail.

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
6. Value and Items preserve render-function/item inference without added DOM.

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

- actual public props: `disabled`, `readOnly`, `required`, `invalid`, `size`,
  `mode`, and `openOnInputClick`;
- story-only controls: `_label` and `_placeholder`;
- omit filtering functions, item arrays, render props, portal/positioner props,
  `xstyle`, and callback objects from controls.

Add consolidated fixed stories with controls disabled:

- `States`: disabled, read-only, required, invalid with Error, and empty results;
- `Examples`: grouped object items with Group/GroupLabel/Items, asynchronous
  suggestions with controlled `value` and Status, and `mode="both"` inline
  completion. Keep these as clearly labeled sections with realistic neutral
  content, not cards or decorative wells.
- `Behavior fixture`: one stable, minimal field for browser tests. Use stable
  `data-testid` markers only for fixture-owned callback/form output that cannot
  be selected semantically; all component interaction must use roles, labels,
  and Base UI state.

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
free-form search example with a small stable item array; include Label,
InputGroup, Input, explicit Trigger/Clear, Popup, List, Item, and Empty as
appropriate.

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
fixture. Target the stable behavior story and cover these contracts in a small
number of focused tests:

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
npm run verify:quick
npm run verify:full
```

Both must exit 0. Then start Storybook and manually inspect Playground, States,
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

**Verify**: record the two passing gate commands and the manually reviewed story
IDs in the implementation handoff.

### Step 8: Reconcile the plan index and final diff

Set Plan 005 to `DONE` in `docs/plans/README.md` only after every prior step and
gate passes. Preserve all other active plan rows. Report any unrelated failure
without changing concurrent work.

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
- Behavioral cases: accessible field association, filtered listbox, keyboard
  highlighting/fill, free-form persistence and form value, Trigger/Clear,
  object/group inference at compile time, grouped/disabled item behavior,
  inline completion semantics, and field states.
- Type coverage: temporary compile-only probes during Step 2, removed after
  proving flat and grouped object inference and string controlled values.
- Verification:
  `npm run build-storybook && npx playwright test tests/components/autocomplete.spec.ts`
  → all new tests pass with no console/page errors.
- Full verification: `npm run verify:full` → exit 0.

## Done criteria

- [ ] Plan 004 is DONE and Autocomplete uses its public Field/Label wrappers.
- [ ] `Autocomplete` and all selected public prop types export from
      `src/components/index.ts`; Gallery consumes only that public export.
- [ ] Root preserves flat/grouped object-item inference, string value semantics,
      Base UI filtering/open/form callbacks, and free-form input behavior.
- [ ] Only Root accepts common margins, resolved once on the Field wrapper;
      ADR 0011 and `src/styles/README.md` document that ownership.
- [ ] The public namespace contains exactly the selected v1 parts; no advanced
      Base UI mirror, remembered selection, or command behavior was added.
- [ ] Input, explicit controls, popup, results, grouped items, status, and empty
      state use repository recipes/tokens and preserve Base UI render/ref props.
- [ ] `rg -n 'from "@base-ui/react/field"' src/components/autocomplete` returns
      no matches.
- [ ] `npm run verify:quick` exits 0.
- [ ] Focused Playwright tests pass with shared console/page-error diagnostics.
- [ ] `npm run verify:full` exits 0.
- [ ] Live Storybook pointer, keyboard, accessibility, form, size, popup, and
      console checks are recorded.
- [ ] No files outside the in-scope list are modified and no generated output or
      temporary probe remains.
- [ ] `docs/plans/README.md` marks Plan 005 DONE only after all gates pass.

## STOP conditions

Stop and report; do not improvise if:

- Plan 004 is not DONE, its public Field/Label wrappers are absent, or their
  landed contract cannot host Base Autocomplete without an extra wrapper or a
  direct Base UI Field import.
- The installed `@base-ui/react` version is not 1.7.x and its Autocomplete Root,
  item inference, value semantics, mode, or part contracts materially differ
  from this plan.
- Preserving flat and grouped object-item inference requires `any`, a public
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
- Reviewers should scrutinize the Root prop split, absence of duplicate Field
  ownership, Item's canonical marker/single-column override, and free-form form
  submission more closely than visual similarity to Combobox.
- If repeated Autocomplete/Combobox maintenance later proves a stable common
  internal seam, extract a neutral recipe/helper then. Do not make one public
  component depend on the other's private styles.
