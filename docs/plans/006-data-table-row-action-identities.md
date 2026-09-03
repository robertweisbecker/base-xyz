# Plan 006: Give DataTable row actions stable identities

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report; do not improvise. When done, update the status row for this plan in
> `docs/plans/README.md`, unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat e2910dd..HEAD -- src/components/data-table/data-table.tsx src/components/data-table/data-table.stories.tsx src/app/experiments/tables-page.tsx tests/components/data-table.spec.ts docs/plans/006-data-table-row-action-identities.md docs/plans/README.md`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding. On a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: MED
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `e2910dd`, 2026-09-02
- **Issue**: [#24](https://github.com/robertweisbecker/base-xyz/issues/24)
- **Status**: TODO

## Why this matters

`DataTable` currently keys each row-action menu item by its array position.
When a consumer inserts, removes, or reorders actions while a menu is mounted,
React can reuse the focused menu-item instance for a different action. That can
change the label, disabled state, variant, or callback beneath the user's
focus. Require one compact consumer-owned action ID so identity remains stable
even when labels are arbitrary React nodes.

## Current state

### Ownership and public contract

- `CONTEXT.md:13-15` defines `Table` as presentation-only and `DataTable` as the
  stateful owner of dataset behavior, including row actions. Keep the identity
  contract on `DataTableRowAction`; do not add it to semantic `Table` parts.
- `docs/adr/0004-component-block-and-compound-ownership.md:12-20` requires a
  compact, product-agnostic public contract, one state owner, native semantics,
  and a separate presentation-only `Table` layer.
- `src/components/data-table/data-table.tsx:92-98` currently accepts arbitrary
  action labels but has no identity field:

```tsx
export type DataTableRowAction<TData extends RowData> = {
	label: ReactNode;
	icon?: ReactNode;
	disabled?: boolean;
	variant?: "default" | "danger";
	onSelect?: (row: DataTableRow<TData>) => void;
};
```

Add a required `id: string`. IDs need only be unique among the actions returned
for one row; they are not presentation text and do not need to be globally
unique across every table row.

### Broken reconciliation boundary

`src/components/data-table/data-table.tsx:572-615` resolves actions for a row
and maps them into Base UI menu items. The current key is positional:

```tsx
<Menu.Group>
	{actions.map((action, index) => (
		<Menu.Item
			key={index}
			disabled={action.disabled}
			variant={action.variant === "danger" ? "error" : "default"}
			onClick={() => action.onSelect?.(row)}
		>
			{action.icon && <Menu.ItemIcon>{action.icon}</Menu.ItemIcon>}
			<Menu.ItemLabel>{action.label}</Menu.ItemLabel>
		</Menu.Item>
	))}
</Menu.Group>
```

Use `action.id` as the React key. Do not derive identity from `label`, icon
markup, callback identity, variant, or array position. Do not add a generic
caller-supplied `key`/`getActionKey` escape hatch; the action object already is
the smallest owner of this identity.

### Consumers and coverage

- `src/components/data-table/data-table.stories.tsx:339-352` returns four row
  actions without IDs.
- `src/app/experiments/tables-page.tsx:131-135` returns three row actions without
  IDs. These are the only repository consumers of `getRowActions` at the
  planned commit.
- `tests/components/data-table.spec.ts` contains one expansion test. It does not
  reorder mounted actions, preserve focused action identity, or prove callback
  and row association.
- `tests/playwright.ts:6-21` already captures console and page errors for every
  browser test. Reuse this fixture rather than adding local listeners.

## Commands you will need

| Purpose         | Command                                                                                                                                                                                                       | Expected on success                                      |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Inspect base    | `git status --short --branch && git rev-parse --short HEAD`                                                                                                                                                   | expected checkout and no unrelated implementation edits  |
| Find consumers  | `rg -n -e "getRowActions" -e "DataTableRowAction" src tests --glob '*.{ts,tsx}'`                                                                                                                              | every returned action has an explicit ID after migration |
| Typecheck       | `npm run typecheck`                                                                                                                                                                                           | exit 0, no errors                                        |
| Focused lint    | `npx oxlint src/components/data-table/data-table.tsx src/components/data-table/data-table.stories.tsx src/app/experiments/tables-page.tsx tests/components/data-table.spec.ts`                                | exit 0, no blocking findings                             |
| Format check    | `npx prettier --check src/components/data-table/data-table.tsx src/components/data-table/data-table.stories.tsx src/app/experiments/tables-page.tsx tests/components/data-table.spec.ts docs/plans/README.md` | exit 0                                                   |
| Build stories   | `npm run build-storybook`                                                                                                                                                                                     | exit 0                                                   |
| Focused browser | `npx playwright test tests/components/data-table.spec.ts`                                                                                                                                                     | all DataTable tests pass without console/page errors     |
| Doctor          | `npm run doctor > /tmp/base-xyz-doctor-006.txt 2>&1 && ! rg -n 'react-doctor/no-array-index-as-key' /tmp/base-xyz-doctor-006.txt`                                                                             | Doctor runs and the targeted rule is absent              |
| Standard gate   | `npm run verify:quick`                                                                                                                                                                                        | typecheck, lint, and formatting pass                     |

Playwright serves the production Storybook build from `storybook-static`, so
run `npm run build-storybook` before the focused browser command. If another
checkout owns port 6106, leave it running and set an unused port, for example
`PLAYWRIGHT_STORYBOOK_PORT=6116 npx playwright test tests/components/data-table.spec.ts`.

## Suggested executor toolkit

- Use the repository's React best-practices review skill, if available, after
  the TSX change. The repository contract and the focused interaction test win
  over generic lint advice.
- Read ADR 0004 and `CONTEXT.md` before changing the public action type.

## Scope

**In scope** (the only files you should modify):

- `src/components/data-table/data-table.tsx`
- `src/components/data-table/data-table.stories.tsx`
- `src/app/experiments/tables-page.tsx`
- `tests/components/data-table.spec.ts`
- `docs/plans/006-data-table-row-action-identities.md`
- `docs/plans/README.md`
- `.scratch/plans/completed/006-data-table-row-action-identities.md` (ignored
  local lifecycle copy created only after completion)

**Out of scope**:

- Decomposing `DataTable`; Plan 007 owns that follow-up after this contract
  lands.
- Changing `Table`, TanStack Table state/configuration, filtering, sorting,
  visibility, selection, expansion, or row identity.
- Deriving IDs from labels, serialized React nodes, SVG structure, callbacks,
  or array positions.
- Adding a broad key resolver or making IDs optional for compatibility.
- Changing icons, copy, layout, timing, visual treatment, or Storybook showcase
  content beyond the minimal action-identity fixture and required IDs.
- Commits, pushes, or pull requests unless the operator separately instructs
  them.

## Git workflow

- Branch, when requested: `codex/data-table-action-identities` from current
  `main`.
- Prefer one focused implementation commit after all gates pass:
  `[codex] Stabilize DataTable row action identities`.
- Do not push or open a pull request unless instructed.

## Steps

### Step 1: Make action identity explicit

Add a required `id: string` to `DataTableRowAction<TData>` and document that it
must be stable and unique within the actions returned for a row. Replace the
positional `Menu.Item` key with `action.id`. Keep every other `Menu.Item` prop,
child, and selection callback unchanged.

Do not retain the map index as a fallback. A fallback would preserve the bug for
existing callers while making the type imply a stronger guarantee than the
runtime actually provides.

**Verify**: `npm run typecheck` should fail only at the two known repository
consumers until Step 2; any error in the generic `DataTableRowAction` or
`getRowActions` relationship is a STOP condition.

### Step 2: Migrate every repository consumer

Add short semantic IDs to every action in the DataTable story and Tables
experiment. Use stable operation names such as `view`, `copy-id`, `redeploy`,
and `delete`; do not encode the row index or status in the ID.

Run the consumer inventory and inspect every match. `src/app/gallery-page.tsx`
uses DataTable without row actions and should remain unchanged.

**Verify**:
`rg -n "getRowActions|DataTableRowAction" src tests --glob '*.{ts,tsx}'`
shows no repository action object missing `id`, and `npm run typecheck` exits 0.

### Step 3: Add a mounted-reorder regression fixture

Add one focused, controls-disabled DataTable story that:

1. uses a stable data-row ID;
2. can reorder, insert, remove, and disable actions without remounting
   DataTable;
3. exposes story-owned triggers that can perform those mutations without moving
   focus from the open row menu; and
4. exposes the selected action ID and row ID in a semantic status region.

Keep this a functional test fixture, not a decorative specimen. A programmatic
click on a visible story control is acceptable when it changes React state
without generating the pointer-down dismissal sequence that would close the
menu. Do not add production-only props or global application hooks for the
test.

Extend `tests/components/data-table.spec.ts` to:

1. open the first row's action menu;
2. focus a named enabled action;
3. invoke the story-owned reorder trigger without transferring focus;
4. verify focus remains associated with that same named action after its DOM
   position changes;
5. activate it and verify the status region reports the intended action ID and
   the intended stable row ID; and
6. insert and remove sibling actions, then verify the retained action still
   invokes its own callback; and
7. disable the retained action and verify its disabled state stays attached to
   that action after another reorder.

Use roles, accessible names, ARIA state, and the story-owned fixture marker.
Do not assert DOM node order, generated class names, exact colors, the danger
variant, or SVG internals. Preserve the danger variant by source inspection and
manual Storybook review because Menu exposes no semantic danger marker.

**Verify**: `npm run build-storybook && npx playwright test tests/components/data-table.spec.ts`
passes, including the existing expansion test and the new identity regression,
with no console or page errors.

### Step 4: Run the focused and repository gates

Run the focused lint/format commands, the captured Doctor command, and
`npm run verify:quick`. The explicit negative `rg` assertion must confirm React
Doctor no longer reports `no-array-index-as-key`. Inspect the final diff to
ensure only the public action identity, consumer migrations, regression
fixture, tests, and plan lifecycle changed.

**Verify**: every command in "Commands you will need" exits successfully and
`git diff --check` reports no whitespace errors.

## Test plan

- Preserve the existing expansion accessible-name/pressed-state test.
- Add one mounted reorder case that follows a stable action through a position
  change and activates it for a stable row.
- Exercise sibling insertion, removal, and disabled-state changes without
  remounting DataTable. Preserve the danger variant through source comparison
  and manual visual review rather than a brittle style assertion.
- Rely on the shared Playwright fixture for console/page-error assertions.

## Done criteria

- [ ] `DataTableRowAction<TData>` requires a documented stable `id: string`.
- [ ] `RowActions` keys menu items only by `action.id`.
- [ ] Every repository row-action consumer supplies semantic stable IDs.
- [ ] The mounted-reorder test preserves focus identity and activates the
      intended action for the intended row.
- [ ] The captured Doctor output has no
      `react-doctor/no-array-index-as-key` finding.
- [ ] Focused browser tests and `npm run verify:quick` pass.
- [ ] No appearance, Table API, or unrelated DataTable behavior changed.
- [ ] If the executor is authorized to update GitHub, issue #24 receives the
      implementation and verification evidence and is closed. Otherwise the
      executor reports the exact evidence for the operator to post.
- [ ] Plan 007's dependency metadata is reconciled to show Plan 006 / #24 as
      complete, its status becomes TODO, and issue #26 can move to
      `ready-for-agent`.
- [ ] The final Plan 006 is copied to
      `.scratch/plans/completed/006-data-table-row-action-identities.md`, then
      the tracked Plan 006 file and its index row are removed. Git history and
      issue #24 remain the durable public record.

## STOP conditions

Stop and report back instead of improvising if:

- `DataTableRowAction` or its consumers have changed since commit `e2910dd` in a
  way that makes a required string ID incompatible with the live public
  contract.
- Stable keys do not preserve the focused action during an in-place reorder;
  capture the observed Base UI behavior before proposing a different public
  API or focus policy.
- The regression requires changing Base UI Menu internals, `Table`, TanStack
  state, or production-only test hooks.
- A verification command fails twice after one reasonable correction.
- The fix requires a file outside the in-scope list.
- Issue #26 still describes pagination as a current capability; reconcile that
  durable issue contract before making it ready for agents.

## Maintenance notes

- Future row-action fields must remain attached to the action object identified
  by `id`; review new callers for IDs derived from presentation or array order.
- IDs are sibling identities within one row menu. Reusing `delete` across rows
  is correct because each row owns a separate action list.
- Plan 007 may move `RowActions` into a private module, but it must carry this ID
  contract and regression forward unchanged.
