# Plan 007: Decompose DataTable orchestration behind its public API

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report; do not improvise. When done, update the status row for this plan in
> `docs/plans/README.md`, unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat e2910dd..HEAD -- package.json package-lock.json src/components/data-table tests/components/data-table.spec.ts docs/plans/007-decompose-data-table-orchestration.md docs/plans/README.md`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding. This plan
> expects Plan 006 to have changed the row-action type, its callers, and focused
> tests; those exact changes are the required dependency. Any other mismatch is
> a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: completed Plan 006 / [#24](https://github.com/robertweisbecker/base-xyz/issues/24)
- **Category**: tech-debt
- **Planned at**: commit `e2910dd`, 2026-09-02
- **Issue**: [#26](https://github.com/robertweisbecker/base-xyz/issues/26)
- **Status**: TODO

## Why this matters

The 799-line DataTable module makes one public component coordinate column
normalization, five state domains, TanStack Table setup, toolbar controls,
semantic table rendering, selection, expansion, row actions, filtering, and
metadata. React Doctor identifies the public function as a giant component.
Split those responsibilities behind private module boundaries while keeping
one obvious controller for state and cross-feature decisions. The result should
be easier to review and test without enlarging or changing the public API.

## Current state

### Contract and ownership constraints

- `CONTEXT.md:13-16` distinguishes the presentation-only `Table`, the stateful
  `DataTable`, action cells, and checked rows. Preserve that vocabulary and
  layer boundary.
- `docs/adr/0004-component-block-and-compound-ownership.md:12-20` requires one
  owner for coordinated state, compact public contracts, native semantics, and
  separate semantic Table presentation.
- ADR 0011 classifies `DataTable` as a margin-enabled delegator to `Table.Root`.
  `src/components/data-table/data-table.tsx:282-289` forwards `className`, native
  `style`, `xstyle`, margin props, and native div props to that root. Keep this
  exact ownership and precedence; do not resolve margins a second time.
- `src/components/index.ts` and `src/components/data-table/index.ts` are the
  public export surfaces. Existing names and generic inference must remain
  source-compatible after Plan 006's intentional required action ID.

### Current controller and render owner

`src/components/data-table/data-table.tsx:134-450` currently owns:

```text
state: sorting, globalFilter, columnVisibility, rowSelectionState, expanded
derived support: expansion and row actions
column construction: selection, expansion, consumer, and action columns
TanStack owner: useTable(...) and every controlled state callback
view: toolbar, filters, column visibility, table head/body, expanded rows,
      empty state, row actions, and selection/visibility metadata
```

The TanStack state boundary at lines 255-275 is already the right single
controller:

```tsx
const table = useTable<DataTableFeatures, TData>({
	features: dataTableFeatures,
	data,
	columns: tableColumns,
	getRowId,
	enableRowSelection: rowSelection,
	getRowCanExpand: getRowCanExpand ?? (() => supportsExpansion),
	globalFilterFn: "includesString",
	onColumnVisibilityChange: setColumnVisibility,
	onExpandedChange: setExpanded,
	onGlobalFilterChange: setGlobalFilter,
	onRowSelectionChange: setRowSelectionState,
	onSortingChange: setSorting,
	state: { columnVisibility, expanded, globalFilter, rowSelection: rowSelectionState, sorting },
});
```

Keep those state cells and `useTable` together. Do not distribute TanStack
state among the extracted presentation modules or introduce a new React
context merely to avoid focused props.

### Existing partial boundaries and gaps

The module already has private `HeaderContent`, `ColumnFilterMenu`,
`RowActions`, and `ColumnVisibilityMenu` functions plus column/filter helpers.
The main function still contains the column-building hook and approximately 166
lines of semantic table JSX, while all private owners share one file and one
large StyleX map.

Use these private module boundaries:

- `data-table-model.ts` — TanStack feature registration, internal feature/meta
  types, public DataTable type definitions, column-role helpers, numeric
  normalization, and the DataTable filter function.
- `data-table-columns.tsx` — the memoized construction of selection, expansion,
  consumer, and row-action columns, including the private row-action menu.
- `data-table-toolbar.tsx` — search input, column visibility, facet filter menus,
  and toolbar end slot.
- `data-table-content.tsx` — semantic Table header/body/empty/expanded-row
  rendering, sortable header content, and selection/visibility metadata.
- `data-table.stylex.ts` — the component-owned styles shared by those private
  modules.
- `data-table.tsx` — public `DataTable`, public type re-exports, state,
  `useTable`, cross-feature derivation, and composition of the private owners.

These are private file boundaries, not new public parts. Do not export them from
either barrel and do not create a `DataTable.*` compound namespace.

### Supported behavior and test baseline

The current implementation supports filtering, sorting, column visibility,
selection, expansion, row actions, empty results, and horizontal overflow via
`Table.Container`. It does **not** implement pagination. The issue's older
pagination wording is stale; this refactor must neither add pagination nor
invent pagination ownership.

`tests/components/data-table.spec.ts` covers expansion and Plan 006's mounted
stable row-action fixture/test at this branch head. Before moving implementation,
add behavioral characterization for the remaining supported combinations so file
motion cannot hide a regression.

## Commands you will need

| Purpose            | Command                                                                                                                                                                        | Expected on success                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| Inspect dependency | `rg -n -e 'id: string' -e 'key=\{action\.id\}' src/components/data-table/data-table.tsx && npm run build-storybook && npx playwright test tests/components/data-table.spec.ts` | Plan 006's type, runtime key, and browser regression are present           |
| Typecheck          | `npm run typecheck`                                                                                                                                                            | exit 0, public generics and private instance props typecheck without `any` |
| Focused lint       | `npx oxlint src/components/data-table tests/components/data-table.spec.ts`                                                                                                     | exit 0, no blocking findings                                               |
| Format check       | `npx prettier --check src/components/data-table tests/components/data-table.spec.ts docs/plans/README.md`                                                                      | exit 0                                                                     |
| Build stories      | `npm run build-storybook`                                                                                                                                                      | exit 0                                                                     |
| Focused browser    | `npx playwright test tests/components/data-table.spec.ts`                                                                                                                      | all DataTable behavior tests pass without console/page errors              |
| Doctor             | `npm run doctor > /tmp/base-xyz-doctor-007.txt 2>&1 && ! rg -n -e 'react-doctor/no-array-index-as-key' -e 'react-doctor/no-giant-component' /tmp/base-xyz-doctor-007.txt`      | Doctor runs and both targeted rules are absent                             |
| Standard gate      | `npm run verify:quick`                                                                                                                                                         | typecheck, lint, and formatting pass                                       |
| Full gate          | `npm run verify:full`                                                                                                                                                          | app, Storybook, browser, StyleX dev, and bundle gates pass                 |

If another checkout owns a default Playwright port, leave its server running
and use `PLAYWRIGHT_STORYBOOK_PORT` or `PLAYWRIGHT_APP_PORT` with an unused port
as documented in AGENTS.md.

## Suggested executor toolkit

- Read ADRs 0003, 0004, and 0011, `.agents/resources/stylex-authoring.md`, and
  `src/styles/README.md` before moving shared StyleX.
- Use the React best-practices review skill, if available, after extraction.
  Treat a smaller reported function as a check, not the goal: coherent state
  ownership and preserved behavior are the goal.
- Use the installed TanStack Table v9 types. Do not apply v8 examples or replace
  the existing `tableFeatures(...)` registration.

## Scope

**In scope** (the only files you should modify):

- `src/components/data-table/data-table.tsx`
- `src/components/data-table/data-table-model.ts` (create)
- `src/components/data-table/data-table-columns.tsx` (create)
- `src/components/data-table/data-table-toolbar.tsx` (create)
- `src/components/data-table/data-table-content.tsx` (create)
- `src/components/data-table/data-table.stylex.ts` (create)
- `src/components/data-table/data-table.stories.tsx`
- `tests/components/data-table.spec.ts`
- `docs/plans/007-decompose-data-table-orchestration.md`
- `docs/plans/README.md`
- `.scratch/plans/completed/007-decompose-data-table-orchestration.md` (ignored
  local lifecycle copy created only after completion)

**Out of scope**:

- Any public export, prop, generic, default, callback, or behavior change beyond
  Plan 006's already-landed required row-action ID.
- New public DataTable parts, a public controller/hook, a public table-instance
  prop, or a React context for private file communication.
- Changes to semantic `Table`, Menu, Checkbox, Toggle, InputGroup, Button, or
  other composed primitives.
- Pagination. It is not a current DataTable capability and must not be added by
  a refactor.
- Styling, icon, copy, layout, or story-content redesign. Moving the existing
  StyleX declarations without changing their values is allowed.
- Optimizing `selectedValues.includes(...)` unless a benchmark demonstrates a
  material regression and the maintainer separately expands scope.
- Provider-value memoization tracked by #25.
- Commits, pushes, or pull requests unless the operator separately instructs
  them.

## Git workflow

- Start from an updated `main` that includes the completed Plan 006 / #24
  identity contract.
- Branch, when requested: `codex/decompose-data-table` from that updated `main`.
- Prefer one focused implementation commit after all gates pass:
  `[codex] Decompose DataTable orchestration`.
- Do not push or open a pull request unless instructed.

## Steps

### Step 1: Characterize the current public behavior

The Plan 006 DataTable story fixture and browser spec already cover mounted
stable row-action identity. Before moving code, add characterization for the
remaining observable contracts:

1. filtering changes visible rows and the selected/filtered metadata;
2. sorting updates `aria-sort` and visible row order;
3. column visibility changes the rendered header/cells and visible-column
   metadata;
4. selection and expansion work together for the same row; and
5. row actions still open, preserve focus identity from Plan 006, and invoke
   the intended row callback after another feature changes;
6. a filter with no matches renders the configured empty state across the
   currently visible columns; and
7. the accessible `Scrollable table` viewport remains the horizontal overflow
   owner when table content is wider than its viewport.

Use existing Playground capabilities where possible. Add only small
story-owned state/status hooks needed to observe callbacks. Target roles,
accessible names, ARIA state, stable row IDs, and status output. Do not assert
exact color, spacing, geometry, generated classes, or SVG markup.

**Verify**: `npm run build-storybook && npx playwright test tests/components/data-table.spec.ts`
passes against the pre-refactor implementation. If a claimed supported
combination already fails, stop and report it as pre-existing rather than
silently fixing it inside the refactor.

### Step 2: Extract the model without changing configuration

Create `data-table-model.ts` and move the TanStack feature registry, feature and
column metadata types, public type definitions, column-role/numeric helpers,
and filter function without semantic changes. Re-export the existing public
type names from `data-table.tsx` so both barrel files remain unchanged.

Preserve:

- TanStack v9 `tableFeatures(...)` with all current row models, `filterFns`, and
  `sortFns`;
- the module-private `Symbol` used for selection/action column roles;
- `TData extends RowData` on every public generic;
- filter behavior for scalar strings and string-array row values; and
- the current `numeric?: boolean` public column extension.

Do not export private feature/meta helpers from a public barrel. Do not replace
the symbol with caller-visible string IDs or add `any`/unchecked casts.

**Verify**:
`npm run typecheck && npm run build-storybook && npx playwright test tests/components/data-table.spec.ts`
exits 0 and the complete focused browser spec remains green against the moved
model.

### Step 3: Extract column construction and toolbar ownership

Move the existing memoized internal-column construction into
`data-table-columns.tsx` as one private hook. It owns selection, expansion,
consumer column normalization, and the row-action column. Keep every dependency
explicit so columns update when current props change without needless rebuilds.
Carry Plan 006's `action.id` key and mounted-reorder behavior unchanged.

Keep `dataTableColumnRole` private inside `data-table-model.ts`. Export only
private-module helpers such as `selectionColumnMeta()`, `actionColumnMeta()`,
and `getDataTableColumnRole(column)` for writing and reading the symbol-backed
metadata; do not export the symbol itself or surface any helper from a public
barrel.

Move the toolbar, `ColumnFilterMenu`, `ColumnVisibilityMenu`, and selected-value
normalization into `data-table-toolbar.tsx`. Pass the TanStack table instance
and focused public inputs rather than every state setter individually. Keep the
search input controlled by the single controller through the table model.

Do not move TanStack state cells or `useTable` out of `DataTable`. Do not create
a private context solely to hide props.

**Verify**:
`npm run typecheck && npx oxlint src/components/data-table tests/components/data-table.spec.ts && npm run build-storybook && npx playwright test tests/components/data-table.spec.ts`
exits 0 and focused browser behavior remains unchanged.

### Step 4: Extract semantic content and shared styles

Move the Table header/body/empty/expanded-row rendering, sortable header
content, sort label/icon helpers, and metadata into
`data-table-content.tsx`. Pass the table instance plus `emptyLabel` and
`renderExpandedRow`; keep selection, expansion, and sorting mutations on the
TanStack row/column/table APIs already used.

Move the unchanged `dataTableParts` declarations to `data-table.stylex.ts` and
import only the styles each private module consumes. Preserve every declaration
value and StyleX composition order. `Table.Container` remains the single
horizontal-overflow owner and `Table.Root` remains the only public margin and
style-prop recipient.

After extraction, `data-table.tsx` should read as the public contract plus one
controller: initialize state, build columns, create the table, derive the
active filter column/counts needed by children, and compose the three private
owners.

**Verify**:
`npm run typecheck && npx oxlint src/components/data-table tests/components/data-table.spec.ts && npx prettier --check src/components/data-table tests/components/data-table.spec.ts && npm run build-storybook && npx playwright test tests/components/data-table.spec.ts`
exits 0.

### Step 5: Run Doctor and full repository verification

Run the captured Doctor command and confirm the explicit negative assertion
finds neither `no-giant-component` nor `no-array-index-as-key`. Do not rely on
Doctor's exit status because advisory findings still exit 0, and do not chase
unrelated findings in this change.

Run `npm run verify:quick`, followed by `npm run verify:full`. Inspect the final
diff for public surface, rendered markup, and StyleX value drift.

**Verify**: all commands in "Commands you will need" exit successfully,
`git diff --check` is clean, and `git status --short` lists only in-scope files.

## Test plan

- Preserve the expansion and stable row-action identity cases.
- Add pre-refactor characterization for filter, sort/`aria-sort`, visibility,
  selection plus expansion, and a combined state followed by a row action.
- Exercise the empty state through a no-match filter and verify the configured
  accessible empty text.
- Verify the accessible horizontal viewport remains the overflow owner using
  only the smallest contract-level width/scroll measurements.
- Use a stable row ID in callback assertions so sorting/filtering cannot make a
  row-index assertion accidentally pass.
- Rely on `tests/playwright.ts` for console and page-error capture.
- Run the same focused spec before and after extraction; only the implementation
  structure should differ.

## Done criteria

- [ ] Public DataTable types, exports, defaults, generic inference, and rendered
      behavior are unchanged from the Plan 006 base.
- [ ] One identifiable `DataTable` controller owns all state cells, `useTable`,
      and cross-feature decisions.
- [ ] Model/column construction, toolbar controls, semantic content, and shared
      styles have coherent private module owners.
- [ ] No private owner is exported through either public barrel.
- [ ] Filtering, sorting, visibility, selection, expansion, row actions, empty
      state, overflow, and a combined multi-feature flow pass focused tests.
- [ ] No pagination surface was introduced.
- [ ] React Doctor no longer reports DataTable as a giant component and does not
      regress the stable-action-key check.
- [ ] `npm run verify:quick` and `npm run verify:full` pass.
- [ ] If the executor is authorized to update GitHub, issue #26 receives the
      final implementation/verification evidence and is closed. Otherwise the
      executor reports the exact evidence for the operator to post.
- [ ] The final Plan 007 is copied to
      `.scratch/plans/completed/007-decompose-data-table-orchestration.md`, then
      the tracked Plan 007 file and its index row are removed. Git history and
      issue #26 remain the durable public record.

## STOP conditions

Stop and report back instead of improvising if:

- The target base does not include the completed Plan 006 / #24 identity
  contract, or the live row-action contract differs from the expected required
  stable ID.
- Any characterization test fails on the pre-refactor implementation.
- A private module requires its own competing TanStack state owner or a new
  context to avoid unreasonable prop flow; report the proposed ownership seam
  first.
- The extraction requires changing semantic `Table` or another composed public
  component.
- Generic inference can be preserved only with `any`, broad casts, or a public
  table-instance type change.
- Moving StyleX changes declaration values, precedence, or rendered appearance.
- A verification command fails twice after one reasonable correction.

## Maintenance notes

- Future DataTable features belong in the controller only when they coordinate
  dataset state. Pure rendering belongs in the private content/toolbar owners;
  semantic table chrome remains owned by public `Table`.
- Avoid adding pass-through subcomponents merely to reduce line count. Each
  private module should continue to own a coherent decision boundary.
- Revisit pagination as a separately designed capability only when requested;
  this refactor deliberately does not pre-allocate an API for it.
