# Plan 006: Arbitrate CommandPalette shortcuts through one private dispatcher

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report; do not improvise. When done, update the status row for this plan in
> `plans/README.md`, unless a reviewer dispatched you and told you they maintain
> the index.
>
> **Drift check (run first)**:
>
> ```sh
> git diff --stat 04972a1..HEAD -- src/components/command-palette/command-palette.tsx src/components/command-palette/command-palette.stories.tsx tests/command-palette/shortcut.spec.ts
> git diff -- src/components/command-palette/command-palette.tsx src/components/command-palette/command-palette.stories.tsx tests/command-palette/shortcut.spec.ts
> git status --short -- src/components/command-palette/command-palette.tsx src/components/command-palette/command-palette.stories.tsx tests/command-palette/shortcut.spec.ts
> ```
>
> If any in-scope file changed since this plan was written, or has uncommitted
> work, compare the "Current state" excerpts against the live code before
> proceeding. If the shortcut effect, Root controlled-state contract, story
> title, or Playwright discovery layout no longer matches, treat it as a STOP
> condition. Preserve all unrelated dirty-worktree changes.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: `plans/001-align-stylex-sx-typechecking.md`, then `plans/002-settle-confirmation-before-success.md`
- **Category**: bug
- **Planned at**: commit `04972a1`, 2026-08-12

## Why this matters

Every shortcut-enabled `CommandPalette.Root` currently installs its own
document listener. With two roots mounted, one Command/Ctrl+K event reaches
both listeners, so both roots can toggle and both callbacks can fire. Repeated
keydown events can also toggle a palette back closed, and a focused control
that already claimed the event cannot prevent the global shortcut.

After this plan, a module-private registry will install exactly one document
listener. The most recently mounted root that is both shortcut-enabled and not
inline will own Command/Ctrl+K; callback updates will retain its mount-order
position; unmount cleanup will return ownership to the preceding eligible
root. This is an internal correctness fix, not a new shortcut API.

## Current state

### Relevant files

- `src/components/command-palette/command-palette.tsx` — owns Root state and the current per-root global listener.
- `src/components/command-palette/command-palette.stories.tsx` — owns stable, directly addressable Storybook fixtures for CommandPalette.
- `tests/command-palette/shortcut.spec.ts` — create this focused Playwright regression suite after plan 002 broadens test discovery beyond `tests/theme-props`.
- `playwright.config.ts` — read after plan 002 to confirm discovery and the static Storybook server, but do not modify it in this plan.

### Existing public contract

At `src/components/command-palette/command-palette.tsx:54-70`, Root exposes only
the existing boolean shortcut opt-in and controlled/uncontrolled dialog state:

```tsx
export type CommandPaletteRootProps<ItemValue> = Omit<
	AutocompleteRootProps<ItemValue>,
	"children" | "inline" | "keepHighlight" | "onOpenChange" | "open"
> & {
	children: ReactNode;
	className?: string;
	closeOnSelect?: boolean;
	defaultOpen?: boolean;
	inline?: boolean;
	label?: string;
	onOpenChange?: (open: boolean) => void;
	open?: boolean;
	shortcut?: boolean;
	trigger?: ReactElement;
	/** StyleX overrides for the palette panel, applied after the component's own styles. */
	style?: StyleXStyles;
};
```

Do not add a registry, priority, keybinding, or ownership prop to this type.

At `src/components/command-palette/command-palette.tsx:120-132`, `setOpen`
preserves controlled and uncontrolled behavior and always notifies the current
callback:

```tsx
const controlled = open !== undefined;
const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
const actualOpen = inline ? true : controlled ? open : uncontrolledOpen;

const setOpen = useCallback(
	(nextOpen: boolean) => {
		if (!controlled) {
			setUncontrolledOpen(nextOpen);
		}
		onOpenChange?.(nextOpen);
	},
	[controlled, onOpenChange],
);
```

The dispatcher must continue to call this path with `!actualOpen`; it must not
introduce separate open state.

### Defective listener shape

At `src/components/command-palette/command-palette.tsx:134-150`, every eligible
root independently owns a document listener, and callback/open-state updates
remove and re-add that listener:

```tsx
useEffect(() => {
	if (!shortcut || inline) {
		return;
	}

	function handleKeyDown(event: globalThis.KeyboardEvent) {
		if (event.key.toLocaleLowerCase() !== "k" || (!event.metaKey && !event.ctrlKey)) {
			return;
		}

		event.preventDefault();
		setOpen(!actualOpen);
	}

	document.addEventListener("keydown", handleKeyDown);
	return () => document.removeEventListener("keydown", handleKeyDown);
}, [actualOpen, inline, setOpen, shortcut]);
```

Because effect re-registration changes listener order, merely centralizing the
handler is insufficient: callback and open-state updates must mutate the
existing root registration without deleting and re-inserting it.

### Existing story and Playwright conventions

At `src/components/command-palette/command-palette.stories.tsx:90-115`, the
story title produces IDs under `components-command-palette--...`, `Playground`
is first, and fixed stories disable controls at metadata level:

```tsx
const meta = {
	title: "Components/Command palette",
	component: CommandPalette.Root,
	parameters: {
		controls: { disable: true },
	},
} satisfies Meta<typeof CommandPalette.Root>;

export const Playground: Story = {
	render: () => <CommandPaletteExample shortcut />,
};

export const Inline: Story = {
	render: () => (
		<div {...stylex.props(storyParts.inlineFrame)}>
			<CommandPalette.Root inline items={commandGroups} itemToStringValue={commandToStringValue}>
```

At `tests/theme-props/browser.spec.ts:1-22`, browser specs use explicit iframe
story URLs, Playwright role/test-id locators, and fail on console errors:

```ts
import { expect, test, type Page } from "@playwright/test";

const consoleErrorsByPage = new WeakMap<Page, string[]>();

test.beforeEach(({ page }) => {
	const consoleErrors: string[] = [];
	consoleErrorsByPage.set(page, consoleErrors);
	page.on("console", (message) => {
		if (message.type() === "error") consoleErrors.push(message.text());
	});
});

test.afterEach(({ page }) => {
	expect(consoleErrorsByPage.get(page)).toEqual([]);
});
```

Match that convention. Plan 002 must first make the repository discover a
focused spec outside `tests/theme-props`; do not work around discovery by
putting this regression in the theme-props directory.

## Target design

Implement the dispatcher privately in
`src/components/command-palette/command-palette.tsx`; do not export it from the
module or any barrel.

- Keep a module-local ordered registry (`Set` or an equivalently insertion-
  ordered collection) of root registrations. Each registration has an
  `enabled` flag and an invocation function.
- Register each mounted Root exactly once in a mount-only effect, even when its
  current `shortcut` value is false or it is inline. Eligibility is
  `shortcut && !inline`; changing eligibility updates the same registration
  object rather than changing its mount-order position.
- Store the latest toggle callback behind a ref and update that ref without
  re-registering. This repository already uses the render-time latest-callback
  ref pattern at `src/blocks/streaming-response/streaming-response.tsx:168-183`.
- Add one module-local `document` keydown listener when the first Root
  registration mounts and remove it after the final Root registration unmounts.
  React StrictMode setup/cleanup must not leak duplicate registrations or
  listeners.
- In the document handler, return immediately when `event.defaultPrevented` or
  `event.repeat` is true. Then retain the current key match exactly:
  case-insensitive `k` plus either `metaKey` or `ctrlKey`.
- Walk the insertion-ordered registry and select the last enabled
  registration. If none is eligible, do not call `preventDefault`. If one is
  eligible, call `preventDefault` once and invoke only that owner.
- Cleanup removes the exact registration object. The previous enabled root
  then becomes owner without being removed or re-added.
- Root still toggles through `setOpen(!actualOpen)`, preserving controlled and
  uncontrolled state and the latest `onOpenChange` callback.

Do not use event-listener registration order as ownership. Do not use DOM order,
focus order, z-index, an exported singleton, or a React context spanning roots.

## Commands you will need

Run commands from `/Users/robertweisbecker/Sites/stylex` after plans 001 and
002 are complete.

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Inspect prerequisites | `git status --short && test -f plans/001-align-stylex-sx-typechecking.md && test -f plans/002-settle-confirmation-before-success.md` | exit 0; prerequisite plans exist and their status/commits show they were completed |
| TypeScript | `npx tsc -b` | exit 0, no diagnostics |
| Focused browser regression | `npm run build-storybook && npx playwright test tests/command-palette/shortcut.spec.ts --project=chromium` | Storybook exits 0; exactly 3 focused tests pass |
| Full browser comparison | `npx playwright test --project=chromium` | no new failures beyond a baseline captured immediately before editing; at plan time four MP/global expectation-drift cases were already failing |
| Lint | `npm run lint` | exit 0; no lint errors |
| App build | `npm run build` | exit 0; Vite production build succeeds |
| Storybook build | `npm run build-storybook` | exit 0; static Storybook build succeeds |

The repository has no `typecheck` script. Do not substitute `npm run
typecheck` for `npx tsc -b`.

## Scope

**In scope** (the only implementation/test files to modify):

- `src/components/command-palette/command-palette.tsx`
- `src/components/command-palette/command-palette.stories.tsx`
- `tests/command-palette/shortcut.spec.ts` (create)
- `plans/README.md` (status cell for plan 006 only, after completion; omit if a reviewer owns the index)

**Out of scope** (do not touch, even if related):

- `src/components/command-palette/index.ts` and `src/components/index.ts` — no public export or API change.
- `playwright.config.ts`, package scripts, and dependencies — plan 002 owns test discovery.
- Shortcut configurability beyond the existing boolean `shortcut` prop.
- Keyboard handling for command items, input Escape behavior, Dialog focus management, or Base UI internals.
- Refactoring CommandPalette styles, composition, trigger display, filtering, or item behavior.
- Any Table, DataTable, App gallery, `CONTEXT.md`, ADR, experimental DnD, or unrelated dirty-worktree files.

## Git workflow

- Start from a clean post-plan-002 baseline. If creating a branch, use
  `codex/arbitrate-command-palette-shortcuts`.
- Before editing, run `git status --short` and preserve unrelated changes.
- Stage only the three implementation/test files above and, when authorized,
  the plan 006 status-only change in `plans/README.md`. Never use `git add -A`
  in a mixed worktree.
- If committing is authorized, use a message prefixed with `[codex]`, for
  example: `[codex] Arbitrate command palette shortcuts`.
- Do not push or open a pull request unless the operator explicitly asks.

## Steps

### Step 1: Confirm the prerequisite baseline and live contract

1. Confirm plans 001 and 002 are complete in `plans/README.md` and their
   implementation commits are present in the current branch.
2. Run the drift-check commands at the top of this plan.
3. Re-open `Root`, the shortcut effect, the story metadata, and
   `playwright.config.ts`. Confirm that:
   - Root still has `shortcut?: boolean`, `inline?: boolean`, `open`, and
     `onOpenChange`;
   - the current listener is still the per-root effect shown above;
   - plan 002 made `tests/command-palette/shortcut.spec.ts` discoverable;
   - the expected Storybook iframe server remains configured.
4. Run the full Chromium suite once before editing and record every failing
   test name. The audit baseline had four unrelated MP/global expectation-drift
   failures; this fresh result is the comparison set for Step 5.

**Verify**:

```sh
npx tsc -b
npx playwright test --list
npx playwright test --project=chromium
```

Expected: TypeScript exits 0. Playwright discovery exits 0 and lists tests
outside the old `tests/theme-props`-only boundary. Record full-suite failures;
unrelated MP/global expectation drift may remain, but any CommandPalette
failure is a STOP condition. Do not hide a prerequisite failure in this plan.

### Step 2: Replace per-root listeners with the private registry/dispatcher

In `src/components/command-palette/command-palette.tsx`:

1. Add `useRef` to the React imports.
2. Near `CommandPaletteContext`, add private registration types, the ordered
   registry, the sole document handler, and private register/unregister logic.
   Export none of these symbols.
3. Add a private hook used unconditionally by `Root`. It must:
   - keep a stable registration object for the lifetime of that Root;
   - update `registration.enabled` to `shortcut && !inline` without changing
     registry insertion order;
   - keep the latest `() => setOpen(!actualOpen)` callback in a ref;
   - register once after mount and unregister that exact object on cleanup.
4. Replace the existing `useEffect` at lines 134-150 with the private hook call.
5. In the single document handler, check `defaultPrevented` and `repeat` before
   matching the shortcut, choose only the last enabled registration, and call
   `preventDefault` only when an owner exists.

The behavior after an ordinary, non-repeated, unclaimed Command/Ctrl+K remains
a toggle. Do not make the shortcut open-only or close-only.

**Verify**:

```sh
npx tsc -b
npm run lint
rg -n 'document\.addEventListener\("keydown"|document\.removeEventListener\("keydown"' src/components/command-palette/command-palette.tsx
```

Expected: TypeScript and lint exit 0. The search shows exactly one add site and
one matching remove site, both in the private registry lifecycle; no per-Root
listener remains.

### Step 3: Add one deterministic multi-root Storybook fixture

In `src/components/command-palette/command-palette.stories.tsx`, keep
`Playground` first and add a fixed `ShortcutArbitration` story backed by a local
fixture component. The fixture must expose stable accessible controls and
state for the three Playwright tests:

- Mount a first controlled, non-inline `CommandPalette.Root` before a second
  controlled, non-inline Root. Both use `shortcut`, distinct `label` values
  (`First command palette` and `Second command palette`), and the existing
  command data/rendering helpers.
- Give each root its own `open` state and current `onOpenChange` callback. Do
  not share open state.
- Add a `Rerender callbacks` button that changes otherwise harmless fixture
  state and therefore replaces both callback closures without remounting
  either Root. Expose its count as visible text or a test id.
- Add an `Unmount second palette` button. When used, the second Root must
  actually leave the React tree, exercising registry cleanup.
- Add a normal text input named `Reserved shortcut input`. Its React
  `onKeyDown` must call `preventDefault()` only for the same Ctrl/Meta+K chord,
  providing a focused descendant that claims the event before it bubbles to
  `document`.
- Render a small visible open-change log or counters with stable test IDs so
  the test can prove one owner callback ran rather than inferring only from
  portal visibility.
- Keep the story functional and unstyled beyond the minimum spacing needed to
  operate it. Do not add decorative cards or wells.

**Verify**:

```sh
npm run build-storybook
rg -n 'ShortcutArbitration|First command palette|Second command palette|Reserved shortcut input|Unmount second palette|Rerender callbacks' src/components/command-palette/command-palette.stories.tsx
```

Expected: Storybook exits 0, and each named fixture hook appears in the story
source. The generated story ID is
`components-command-palette--shortcut-arbitration`.

### Step 4: Add focused Playwright regression coverage

Create `tests/command-palette/shortcut.spec.ts`, using the console-error guard
from `tests/theme-props/browser.spec.ts`. Navigate each test directly to:

```text
/iframe.html?id=components-command-palette--shortcut-arbitration&viewMode=story
```

Write exactly these three tests:

1. **Two-root ownership, callback stability, and cleanup handoff**
   - wait for the fixture controls;
   - click `Rerender callbacks` and confirm its visible count changed, proving
     callback identities updated after both roots mounted;
   - press `Control+K` and assert only `Second command palette` opens and only
     its open-change counter/log increments;
   - close it with Escape;
   - click `Unmount second palette`, press `Control+K`, and assert
     `First command palette` opens and only the first counter/log increments.
   This one test proves most-recent mount wins, callback updates do not reorder
   ownership, and cleanup hands ownership back.
2. **Held-key repeat guard**
   - hold Control, send `keydown` for `k`, and assert the second palette opens;
   - while still held, send another `keydown` for `k` so the browser event has
     `repeat === true`;
   - assert the second palette remains open and its callback count stays at
     one; release `k` and Control in cleanup/finally logic so a failed assertion
     cannot contaminate the page.
3. **Already-prevented focused event**
   - focus `Reserved shortcut input`;
   - press `Control+K`;
   - assert neither palette opens and both callback counters/logs remain zero.

Use Control in automation so the suite is deterministic on the configured
Chromium runner; the production handler must continue to accept both Control
and Meta.

**Verify**:

```sh
npm run build-storybook && npx playwright test tests/command-palette/shortcut.spec.ts --project=chromium
```

Expected: exit 0 with exactly 3 passed tests and no console errors.

### Step 5: Run all repository gates and inspect scope

Run the independent gates; do not treat one as a substitute for another.

**Verify**:

```sh
npx tsc -b
npm run lint
npm run build
npm run build-storybook
npx playwright test --project=chromium
git diff --check
git status --short
git diff -- src/components/command-palette/command-palette.tsx src/components/command-palette/command-palette.stories.tsx tests/command-palette/shortcut.spec.ts plans/README.md
```

Expected: the focused tests and all non-browser gates exit 0. The full browser
run introduces no failures beyond the pre-edit baseline; at commit `04972a1`,
four unrelated MP/global expectation-drift cases were already failing, so do
not change theme code or those tests in this plan. No whitespace errors appear;
the diff contains only the private dispatcher, its
fixture, its three focused tests, and the optional plan-status update. Generated
`dist/`, `storybook-static/`, and test-result artifacts remain ignored.

## Test plan

- New file: `tests/command-palette/shortcut.spec.ts`.
- Structural model: console collection and direct iframe navigation in
  `tests/theme-props/browser.spec.ts:1-22`.
- Story fixture: `ShortcutArbitration` in
  `src/components/command-palette/command-palette.stories.tsx`.
- Required coverage:
  - two eligible roots invoke only the most recently mounted owner;
  - callback identity updates do not change ownership order;
  - unmounting the owner restores the previous root;
  - a repeated held-key event does not toggle a second time;
  - a focused input that already prevents the chord suppresses the global
    shortcut;
  - no browser console errors occur.
- Focused verification:
  `npm run build-storybook && npx playwright test tests/command-palette/shortcut.spec.ts --project=chromium`
  -> exactly 3 tests pass.
- Full comparison: `npx playwright test --project=chromium` -> the three new
  cases pass and no failures are added beyond the captured pre-edit baseline.

## Done criteria

All items must hold:

- [ ] `npx tsc -b` exits 0 with no diagnostics.
- [ ] `npm run lint` exits 0 with no errors.
- [ ] `npm run build` exits 0.
- [ ] `npm run build-storybook` exits 0.
- [ ] `npx playwright test tests/command-palette/shortcut.spec.ts --project=chromium` reports exactly 3 passed.
- [ ] A full `npx playwright test --project=chromium` run adds no failures beyond the captured pre-edit baseline.
- [ ] `rg -n 'document\.addEventListener\("keydown"' src/components/command-palette/command-palette.tsx` returns exactly one line.
- [ ] `CommandPaletteRootProps` and the `CommandPalette` compound export are unchanged.
- [ ] No shortcut registry/dispatcher symbol is exported from the module, local index, or `src/components/index.ts`.
- [ ] A callback-only fixture rerender leaves shortcut ownership with the second root.
- [ ] Unmounting the second root hands ownership to the first.
- [ ] Repeated and already-prevented keydown events invoke no extra owner callback.
- [ ] `git diff --check` exits 0.
- [ ] No files outside the Scope list are modified by this work.
- [ ] The plan 006 row in `plans/README.md` is marked DONE, unless the reviewer owns the index.

## STOP conditions

Stop and report; do not improvise if:

- Plans 001 and 002 are not complete, `npx tsc -b` is not clean, or Playwright
  still discovers only `tests/theme-props`.
- The live Root no longer uses the shown `shortcut`, `inline`, `actualOpen`, and
  `setOpen` contract, or its existing shortcut is no longer Command/Ctrl+K.
- Any in-scope file has user-owned uncommitted changes that overlap the lines
  this plan needs.
- Correct arbitration appears to require a public prop/export, a provider
  above independent roots, changes to Base UI, or changes to Playwright config.
- The proposed mount-only registration leaks or duplicates a listener under
  React StrictMode.
- A real Chromium repeated `keyboard.down("k")` event cannot be made to expose
  `event.repeat === true`; report the runner behavior rather than replacing the
  browser regression with a synthetic unit test without approval.
- A focused control calling `preventDefault()` cannot make the event arrive at
  the document dispatcher with `defaultPrevented === true`; report the event
  propagation evidence rather than weakening the requirement.
- A verification command fails twice after one reasonable, in-scope correction.
- The implementation requires modifying any out-of-scope file or unrelated
  dirty-worktree change.

## Maintenance notes

- Mount order, not most-recent open time, focus, or callback update time, is the
  ownership rule. Review future refactors for accidental delete/re-add behavior.
- A root whose `shortcut` or `inline` prop changes must update eligibility in
  place. Re-enabling an older root must not make it newer than a later-mounted
  eligible root.
- `defaultPrevented` is the integration seam for focused controls and
  application-level keyboard policies. Keep that guard before shortcut
  matching and before calling `preventDefault` again.
- `event.repeat` prevents held keys from oscillating controlled and
  uncontrolled palettes. Keep it even if future shortcut keys become
  configurable.
- If configurable chords, explicit priority, scopes, or more global shortcuts
  are later required, design a broader application shortcut service separately.
  Do not silently turn this private component-specific dispatcher into public
  infrastructure.
