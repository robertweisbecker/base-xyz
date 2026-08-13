# Plan 002: Settle confirmation before closing and announcing success

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report; do not improvise. When done, update the status row for this plan in `plans/README.md` unless a reviewer dispatched you and told you they maintain the index.
>
> **Drift check (run first)**:
>
> ```sh
> git status --short -- playwright.config.ts src/blocks/confirmation-dialog/confirmation-dialog.tsx src/blocks/confirmation-dialog/confirmation-dialog.stories.tsx tests/blocks/confirmation-dialog.spec.ts
> git diff --stat 04972a1 -- playwright.config.ts src/blocks/confirmation-dialog/confirmation-dialog.tsx src/blocks/confirmation-dialog/confirmation-dialog.stories.tsx tests/blocks/confirmation-dialog.spec.ts
> git diff 04972a1 -- playwright.config.ts src/blocks/confirmation-dialog/confirmation-dialog.tsx src/blocks/confirmation-dialog/confirmation-dialog.stories.tsx tests/blocks/confirmation-dialog.spec.ts
> ```
>
> At planning time the repository was on `main` at `04972a1`, ahead of `origin/main` by one commit, with unrelated user-owned Table/DataTable/App/CONTEXT work. If any in-scope path above is modified or untracked before you begin, compare it against the excerpts below. If it does not match, STOP. Do not discard, overwrite, stage, or commit unrelated work.
>
> **Browser baseline**: The audit observed four pre-existing MP/global expectation-drift failures in the full Playwright run. The new focused confirmation spec must pass. A full `npx playwright test --project=chromium` run is diagnostic only: compare it with a fresh pre-edit run and require no new failures; do not make all four unrelated baseline cases pass as part of this plan.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: `plans/001-align-stylex-sx-typechecking.md`
- **Category**: bug
- **Planned at**: commit `04972a1`, 2026-08-12

## Why this matters

`ConfirmationDialog.Confirm` is currently a `Dialog.Close`, and it emits a success toast immediately after any click that was not synchronously prevented. A consumer that starts an async publish, archive, or save cannot keep the dialog open until settlement; a later rejection still leaves the user with a closed dialog and a false success message. After this plan, `ConfirmationDialog.Root` owns the canonical confirmation operation, exposes pending state through its existing Confirm part, closes only after resolution, and leaves the dialog open with failure feedback after rejection.

## Current state

Relevant files:

- `src/blocks/confirmation-dialog/confirmation-dialog.tsx` — public compound block and its toast/dialog ownership.
- `src/blocks/confirmation-dialog/confirmation-dialog.stories.tsx` — the consolidated functional examples and the fixed async verification fixture to add.
- `playwright.config.ts` — currently restricts Playwright discovery to theme-prop tests.
- `tests/blocks/confirmation-dialog.spec.ts` — new focused browser regression coverage.
- `plans/README.md` — status-only update after implementation.

Current public Root contract in `src/blocks/confirmation-dialog/confirmation-dialog.tsx:16-30`:

```tsx
type DialogRootProps = Omit<ComponentProps<typeof Dialog.Root>, "children" | "disablePointerDismissal" | "modal">;

export type ConfirmationDialogProps = DialogRootProps & {
	/**
	 * The control that opens the dialog. Omit it when the dialog is controlled
	 * by the `open` prop.
	 */
	trigger?: ReactElement;
	children: ReactNode;
	size?: ConfirmationDialogSize;
	/**
	 * Content announced after confirmation. Pass `false` to suppress feedback.
	 */
	successToast?: ConfirmationDialogSuccessToast | false;
};
```

Current success context and notification helper in `src/blocks/confirmation-dialog/confirmation-dialog.tsx:65-100`:

```tsx
const ConfirmationDialogContext = createContext<(() => void) | null>(null);

const defaultSuccessToast: ConfirmationDialogSuccessToast = {
	title: "Changes confirmed",
	description: "Your changes were saved successfully.",
};

// The public Root/Toast.Provider wrapper remains between these excerpts.
function ConfirmationDialogRoot({ trigger, children, size, successToast, ...rootProps }: ConfirmationDialogRootProps) {
	const toastManager = Toast.useToastManager();

	function notifySuccess() {
		if (successToast) {
			toastManager.add(successToast);
		}
	}
```

Current confirm behavior in `src/blocks/confirmation-dialog/confirmation-dialog.tsx:158-181`:

```tsx
export function Confirm({ children, onClick, variant = "primary", ...props }: ConfirmationDialogConfirmProps) {
	const notifySuccess = useContext(ConfirmationDialogContext);

	return (
		<Dialog.Close
			render={
				<Button
					variant={variant}
					{...props}
					onClick={(event) => {
						onClick?.(event);
						if (!event.defaultPrevented) {
							notifySuccess?.();
						}
					}}
				/>
			}>
			{children}
		</Dialog.Close>
	);
}
```

Current test discovery in `playwright.config.ts:3-5`:

```ts
export default defineConfig({
	testDir: "./tests/theme-props",
	fullyParallel: false,
```

Existing conventions to preserve:

- Behavior belongs on the state-owning `Root`; semantic parts consume context. Do not make each Confirm button own a separate async operation.
- `Button` already owns loading presentation and interaction suppression through `loading`; reuse it rather than creating another spinner or pending part.
- Preserve synchronous `onClick` customization on `ConfirmationDialog.Confirm`: invoke it first and honor `event.defaultPrevented` before starting the Root operation.
- Keep `Cancel` as `Dialog.Close`; only confirmation waits for settlement.
- Success/failure copy stays configurable at Root and is rendered through the existing owned `Toast.Provider`.
- Do not add an arbitrary styling escape hatch or a second confirmation action API.

## Concrete design decisions

Implement this contract; do not choose a different state model:

1. Add to `ConfirmationDialogProps`:
   - `onConfirm?: () => void | Promise<void>` — the canonical operation. Absence means an immediately successful confirmation, preserving existing examples.
   - `onConfirmError?: (error: unknown) => void` — optional observation/state hook after rejection.
   - `failureToast?: ConfirmationDialogSuccessToast | false` — configurable failure feedback. Reuse the existing toast object shape to avoid another near-identical public type.
2. Default failure feedback is `{ title: "Couldn’t complete action", description: "Try again." }`. `false` suppresses it.
3. `ConfirmationDialogContext` becomes an object containing `confirm(): Promise<void>` and `pending: boolean`.
4. Root obtains a dialog actions ref and calls `actionsRef.current?.close()` only after `await onConfirm?.()` resolves. If the caller supplied `actionsRef`, use that same ref; otherwise use an internal `useRef`. Do not replace Base UI's controlled/uncontrolled open handling.
5. Guard duplicate confirmation synchronously with a ref as well as the rendered loading state. Track mounted state so a promise settling after unmount does not call state setters, add a toast, or close a stale dialog.
6. On rejection: keep the dialog open, clear pending state if still mounted, add `failureToast` unless false, call `onConfirmError`, and do not rethrow from the event handler.
7. Render `Confirm` as a normal `Button`, not `Dialog.Close`. Pass `loading={context.pending || loading}` and retain its children. Invoke its existing `onClick` first; if prevented, do not call `context.confirm()`.
8. Pending applies to the single Root operation, so every Confirm part beneath that Root reflects the same pending state.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Inspect branch/worktree | `git status --short --branch` | Intended `codex/002-settle-confirmation-before-success` branch; unrelated user changes remain untouched |
| TypeScript | `npx tsc -b` | exit 0, no TypeScript errors |
| Lint | `npm run lint` | exit 0 |
| App build | `npm run build` | exit 0 and Vite build completes |
| Storybook build | `npm run build-storybook` | exit 0 and static Storybook completes |
| Focused browser regression | `npx playwright test tests/blocks/confirmation-dialog.spec.ts` | all confirmation tests pass in Chromium |
| Optional full browser comparison | `npx playwright test --project=chromium` | no new failures beyond a same-checkout pre-edit baseline; four MP/global cases were already failing at planning time |

## Scope

**In scope** (the only implementation files to modify):

- `src/blocks/confirmation-dialog/confirmation-dialog.tsx`
- `src/blocks/confirmation-dialog/confirmation-dialog.stories.tsx`
- `playwright.config.ts`
- `tests/blocks/confirmation-dialog.spec.ts` (create)
- `plans/README.md` (status row only)

**Out of scope**:

- Other Dialog, Toast, Button, or block implementations.
- Redesigning confirmation copy, visual styling, popup motion, or pointer-dismissal behavior.
- Adding general async-button infrastructure.
- Changing `Cancel` settlement behavior.
- Modifying any dirty Table/DataTable/App/CONTEXT file.
- Installing or upgrading dependencies.

## Git workflow

- Create/switch to branch `codex/002-settle-confirmation-before-success` only after the drift check. If branch creation would carry unrelated dirty changes into this work, STOP and use an isolated worktree or ask the operator.
- Commit only the scoped files with message: `[codex] Settle confirmation before success`.
- Stage explicit paths; never use `git add -A` in the dirty checkout.
- Do not push or open a PR unless the operator explicitly requests it.

## Steps

### Step 1: Establish block-level Playwright discovery

In `playwright.config.ts`, change only `testDir` from `"./tests/theme-props"` to `"./tests"`. Preserve the current web server, serial execution, Chromium project, retries, tracing, and screenshots. Do not rename the existing `test:theme-props` script in this plan; it may now discover all browser specs when invoked without a file filter, while focused commands continue to name their file.

**Verify**:

```sh
npx playwright test --list
```

Expected: exit 0; existing files under `tests/theme-props` are still listed. The new confirmation spec will be listed after Step 3.

### Step 2: Move settlement, feedback, and closing into Root

Modify `src/blocks/confirmation-dialog/confirmation-dialog.tsx` according to all eight concrete design decisions above.

Use `useRef`, `useState`, and `useEffect` for the actions ref, duplicate guard, pending UI, and mounted cleanup. The async function in context must:

1. return immediately if a confirmation is already pending;
2. synchronously mark the operation pending;
3. await `onConfirm`;
4. if still mounted, add success feedback and close through the Base UI actions ref;
5. on rejection, if still mounted, add failure feedback and invoke `onConfirmError`;
6. clear the pending guard/state in `finally` when still mounted, while always clearing the ref guard so the object does not remain logically stuck.

Keep props and public exported types near their current definitions. Use the existing `ConfirmationDialogSuccessToast` shape for both toast props; do not rename or remove it.

**Verify**:

```sh
npx tsc -b
```

Expected: exit 0 with no errors. In particular, caller-supplied `actionsRef`, controlled `open`, and existing Confirm `onClick` props remain type-correct.

### Step 3: Add deterministic async settlement fixtures and browser tests

Add a fixed story export named `AsyncSettlement` to `src/blocks/confirmation-dialog/confirmation-dialog.stories.tsx`. Keep `Examples` unchanged as the consolidated user-facing story. The fixture must expose two clearly named triggers:

- `Resolve async action`: Root `onConfirm` resolves after a deterministic delay, custom success title `Async action completed`.
- `Reject async action`: Root `onConfirm` rejects after the same delay, custom failure title `Async action failed`, and `onConfirmError` increments a visible counter with `data-testid="confirmation-error-count"`.

Use an exact 500 ms `setTimeout` delay so the test can control settlement with Playwright's clock. Give the confirm buttons unambiguous accessible names. Do not use real network requests. Expose `data-testid="confirmation-operation-count"` for the resolving operation and increment it only when `onConfirm` starts, so duplicate dispatch is observable.

Create `tests/blocks/confirmation-dialog.spec.ts`, following the console-error capture pattern at `tests/theme-props/browser.spec.ts:5-17`. Use the Storybook iframe URL for `blocks-confirmation-dialog--async-settlement` and cover:

1. Resolve: open, click Confirm, immediately assert dialog remains visible and Confirm has `aria-busy="true"`; then assert the dialog closes and `Async action completed` becomes visible.
2. Reject: open, click Confirm, assert pending; then assert the dialog remains visible, the Confirm control is usable again, `Async action failed` is visible, no success toast is visible, and error count is `1`.
3. Duplicate guard: double-click/dispatch two clicks before settlement and assert one final success toast and `confirmation-operation-count` is exactly `1`.
4. Prevented click: add a third clearly named fixture trigger, `Prevent confirmation`, whose Confirm `onClick` calls `preventDefault`; assert no pending state, no close, no operation count change, and no feedback.

Install Playwright's clock before navigation. Let Storybook load normally, then immediately before each Confirm click pause it at the page's current `Date.now()` value. Assert the pending/intermediate state while time is paused, advance exactly 500 ms with `page.clock.runFor(500)`, and assert settlement. Resume or establish a fresh page between cases. Do not use hard sleeps.

**Verify**:

```sh
npm run build-storybook
npx playwright test tests/blocks/confirmation-dialog.spec.ts
```

Expected: both commands exit 0; all new tests pass; the spec reports no browser console errors.

### Step 4: Run the independent repository gates

Run each separately so a failure is attributable:

```sh
npx tsc -b
npm run lint
npm run build
npm run build-storybook
npx playwright test tests/blocks/confirmation-dialog.spec.ts
```

Expected: every listed command exits 0. The focused confirmation spec is a hard gate. A full Playwright run, if performed, is a diagnostic comparison and may retain the four recorded MP/global baseline failures, but it must introduce no new failure. If an unrelated dirty file fails a required gate, do not edit it; record the exact blocker and STOP.

### Step 5: Review scope and commit

Inspect the final diff, update only Plan 002's status row in `plans/README.md`, and stage explicit paths.

**Verify**:

```sh
git diff --check
git status --short
git diff --name-only 04972a1 -- playwright.config.ts src/blocks/confirmation-dialog/confirmation-dialog.tsx src/blocks/confirmation-dialog/confirmation-dialog.stories.tsx tests/blocks/confirmation-dialog.spec.ts plans/README.md
```

Expected: no whitespace errors; implementation changes are limited to the scoped paths. Then commit with `[codex] Settle confirmation before success` and verify `git show --stat --oneline HEAD` names only intended files. Unrelated user-owned changes must remain uncommitted and unstaged.

## Test plan

- New file: `tests/blocks/confirmation-dialog.spec.ts`.
- Structural pattern: console collection and iframe navigation from `tests/theme-props/browser.spec.ts`.
- Required cases: resolved operation, rejected operation, duplicate click guard, synchronously prevented Confirm click.
- Assertions must cover intermediate pending state, final dialog visibility, correct toast polarity, error callback, accessible busy state, and zero console errors.
- Focused verification: `npx playwright test tests/blocks/confirmation-dialog.spec.ts`.

## Done criteria

- [ ] Root exposes and owns `onConfirm`, `onConfirmError`, `successToast`, and `failureToast` behavior.
- [ ] Confirm is not wrapped in `Dialog.Close`; successful settlement closes through Base UI actions.
- [ ] Rejection leaves the dialog open, restores interaction, invokes error observation, and never emits success.
- [ ] Duplicate confirmation is guarded synchronously.
- [ ] Promise settlement after unmount cannot update state, toast, or close a stale dialog.
- [ ] `playwright.config.ts` discovers `./tests`.
- [ ] Focused Playwright coverage passes with no console errors.
- [ ] Any optional full Playwright comparison introduces no failures beyond its captured pre-edit baseline; the four known MP/global failures are not treated as this plan's work.
- [ ] `npx tsc -b`, `npm run lint`, `npm run build`, and `npm run build-storybook` each exit 0.
- [ ] No out-of-scope file is modified, staged, or committed.
- [ ] Plan 002 status is updated in `plans/README.md`.

## STOP conditions

Stop and report without improvising if:

- Any in-scope file differs from the excerpts before work begins.
- `plans/001-align-stylex-sx-typechecking.md` is not DONE or TypeScript lacks a clean baseline.
- Base UI's installed Dialog actions ref cannot close both controlled and uncontrolled roots through the existing `onOpenChange` contract.
- Correct settlement requires changing shared Dialog, Toast, or Button internals.
- Existing consumers depend on an async `Confirm onClick` return value; canonical async work must move to Root rather than silently supporting two competing paths.
- A verification command fails twice after one scoped correction.
- An unrelated dirty file blocks verification.

## Maintenance notes

- Future confirmation actions must put the promise-returning operation on Root; `Confirm onClick` is only synchronous event customization/prevention.
- Reviewers should scrutinize settlement after unmount, duplicate clicks before React commits loading state, controlled dialog closing, and whether failure can ever emit success.
- Plans 003 and 004 depend on this plan because it establishes Playwright discovery for component/block specs under `tests/`.
