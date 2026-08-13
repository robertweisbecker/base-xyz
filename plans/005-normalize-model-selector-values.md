# Plan 005: Normalize invalid ModelSelector model values

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before continuing. Preserve all pre-existing worktree changes. If anything in "STOP conditions" occurs, stop and report; do not improvise. The plan index is maintained separately, so do not edit `plans/README.md` unless the operator explicitly asks.
>
> **Drift check (run first)**:
>
> ```sh
> git status --short --branch
> git diff --stat 04972a1..HEAD -- src/blocks/model-selector/model-selector.tsx src/blocks/model-selector/model-selector.stories.tsx tests/blocks/model-selector.spec.ts
> git diff -- src/blocks/model-selector/model-selector.tsx src/blocks/model-selector/model-selector.stories.tsx tests/blocks/model-selector.spec.ts
> ```
>
> This plan depends on Plans 001 and 002. Before editing, confirm both are complete and that `playwright.config.ts` discovers `./tests`. If an in-scope tracked file changed since commit `04972a1`, or already has an uncommitted edit, compare it with the excerpts below. Stop on a semantic mismatch or overlap; do not overwrite user work.
>
> Before changing code, run `npx playwright test` once and save the names of any failing tests in the execution notes. The audit baseline had four unrelated MP/global expectation-drift failures; later full-suite runs are comparisons against the fresh pre-edit result, not permission to repair those unrelated tests.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: MED
- **Depends on**: `plans/001-align-stylex-sx-typechecking.md`, `plans/002-settle-confirmation-before-success.md`
- **Category**: bug
- **Planned at**: commit `04972a1`, 2026-08-12

## Why this matters

ModelSelector currently falls back only for the trigger's `selectedModel`; the context retains an invalid model id. That lets the trigger display one model while the model radio group has no matching selection, and a later effort, speed, or reset action can emit the stale invalid id. The component must derive one normalized effective value: if a controlled value, uncontrolled default, or dynamically retained value references a model no longer present, use the first model option in current group order consistently for display, radio selection, state updates, and user-initiated callbacks. Normalization must never emit an unsolicited `onValueChange` merely because the component rendered.

## Current state

- `src/blocks/model-selector/model-selector.tsx:84-90` derives a display fallback but preserves the invalid context value:

  ```tsx
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const currentValue = value ?? uncontrolledValue;
  const selectedModel = findModel(groups, currentValue.model) ?? groups[0]?.options[0];

  if (!selectedModel) {
    throw new Error("ModelSelector.Root requires at least one model option.");
  }
  ```

  `groups[0]?.options[0]` also misses valid options when the first group is empty.

- `src/blocks/model-selector/model-selector.tsx:92-107` forwards the unnormalized value into context and callbacks:

  ```tsx
  function updateValue(nextValue: ModelSelectorValue, reason: ModelSelectorChangeReason) {
    if (value === undefined) setUncontrolledValue(nextValue);
    onValueChange?.(nextValue, { reason });
  }
  // ...
  selectedModel,
  updateValue,
  value: currentValue,
  ```

- `src/blocks/model-selector/model-selector.tsx:186-207` uses `context.value.model` for the model radio group, spreads `context.value` into effort/speed changes, and passes `context.defaultValue` to reset. All of these must operate on normalized models.
- `src/blocks/model-selector/model-selector.tsx:316-318` has the existing flattened lookup helper:

  ```tsx
  function findModel(groups: readonly ModelSelectorGroup[], value: string) {
    return groups.flatMap((group) => group.options).find((option) => option.value === value);
  }
  ```

- `src/blocks/model-selector/model-selector.stories.tsx:29-63` provides static examples only. Add a fixed, controls-disabled regression story that can switch from a valid selected model to a group set where that model has been removed and exposes callback observations for Playwright.
- Repository terminology calls this block `Model selector`; preserve its existing public types and change reasons (`"model" | "effort" | "speed" | "reset"`).

### Normalization policy

Apply this policy exactly:

1. Flatten `groups` in group order and use the first option as the fallback. An empty first group must not hide options in later groups. Preserve the existing behavior that an explicitly referenced disabled option is still displayable; do not invent a disabled-option filtering policy in this fix.
2. If `currentValue.model` exists in the flattened options, retain it. Otherwise use the fallback option's `value`.
3. Derive `selectedModel` and the context's effective `value.model` from the same normalized model.
4. Normalize `defaultValue.model` through current groups before exposing it to reset.
5. Normalize every user-initiated `nextValue` inside the state/callback update path before storing or emitting it.
6. Do not call `setState` or `onValueChange` during render or from an effect solely because normalization occurred.
7. When groups dynamically remove the selected model, rendering immediately shows and selects the fallback. The next user action emits one callback whose complete value contains that fallback model and whose reason describes that user action.

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Focused browser test | `npx playwright test tests/blocks/model-selector.spec.ts` | exit 0; all ModelSelector tests pass |
| TypeScript | `npx tsc -b --pretty false` | exit 0, no diagnostics |
| Lint | `npm run lint` | exit 0 |
| App build | `npm run build` | exit 0 |
| Storybook build | `npm run build-storybook` | exit 0 |
| Full browser comparison | `npx playwright test` | no new failures beyond a baseline captured immediately before editing; at plan time four MP/global expectation-drift cases were already failing |
| Diff hygiene | `git diff --check` | exit 0, no output |

Do not install or update dependencies. Plan 002 must already have widened `playwright.config.ts` from `./tests/theme-props` to `./tests`; do not edit that config in this plan.

## Scope

**In scope — modify only these files:**

- `src/blocks/model-selector/model-selector.tsx`
- `src/blocks/model-selector/model-selector.stories.tsx`
- `tests/blocks/model-selector.spec.ts` (create)

**Out of scope:**

- Changes to `ModelSelectorValue`, `ModelSelectorChangeReason`, or any public prop signature.
- New callbacks, normalization reasons, error props, controlled-state synchronization effects, or render-time emissions.
- Effort/speed fallback policy; normalize only the model id.
- Reordering groups/options or redefining disabled-option semantics.
- Changes to shared Menu, Button, Storybook, Playwright configuration, package scripts, dependencies, lockfiles, generated output, or the plan index.
- Source files carrying unrelated Table/DataTable/App/context work.

## Git workflow

- Create or switch to `codex/normalize-model-selector-values` only after dependency and drift checks and only if the operator requested a branch.
- Commit only the three in-scope files. Preserve unrelated staged and unstaged changes.
- Commit message: `[codex] Normalize ModelSelector values`.
- Do not push or open a pull request unless explicitly instructed.

## Steps

### Step 1: Add a single model-normalization boundary

In `src/blocks/model-selector/model-selector.tsx`, introduce small private helpers near `findModel` rather than changing the public API. The implementation must have one source of truth for fallback ordering and effective values. A suitable shape is:

```tsx
function getFirstModel(groups: readonly ModelSelectorGroup[]) {
  return groups.flatMap((group) => group.options)[0];
}

function normalizeModelValue(groups: readonly ModelSelectorGroup[], value: ModelSelectorValue) {
  const model = findModel(groups, value.model) ?? getFirstModel(groups);
  if (!model) throw new Error("ModelSelector.Root requires at least one model option.");
  return { value: model.value === value.model ? value : { ...value, model: model.value }, model };
}
```

Names may differ, but preserve these properties:

- one flattening order;
- the normalized value reuses the original object when already valid;
- the model option and normalized id cannot disagree;
- the existing empty-options error remains explicit.

Do not filter disabled options or modify caller-owned objects.

**Verify**:

```sh
npx tsc -b --pretty false
```

Expected: exit 0 with no diagnostics.

### Step 2: Use normalized effective and default values throughout Root

Update `Root` so it:

1. Picks the raw controlled or uncontrolled value as today.
2. Normalizes that raw value once against current `groups`.
3. Normalizes `defaultValue` once against current `groups` for reset behavior.
4. Supplies the normalized selected model and normalized effective value through context.
5. Normalizes `nextValue` inside `updateValue` before updating uncontrolled state or calling `onValueChange`.

The render path must remain pure. Do not add `useEffect`, render-time `setUncontrolledValue`, or render-time `onValueChange`. In controlled mode the displayed/radio value may differ from the invalid raw prop, but no callback fires until the user performs an action. In uncontrolled mode dynamic option removal must likewise display the derived fallback without immediately rewriting state; the next user action stores and emits the normalized complete value.

Ensure `Popup` reset now receives the normalized default from context, and existing effort/speed/model handlers continue to use `context.updateValue` with their existing reason strings.

**Verify**:

```sh
npx tsc -b --pretty false
npm run lint
```

Expected: both commands exit 0; there are no hook/effect additions and no public type changes.

### Step 3: Add a deterministic regression story

In `src/blocks/model-selector/model-selector.stories.tsx`, add one fixed story exported after `Examples`, with controls disabled. It must render a small stateful harness specifically for automated verification. Use existing `exampleModelGroups`, effort options, speed options, and component composition.

The harness must make these states/actions observable without relying on generated markup:

- Start with a valid selected model that is not the first option.
- A button removes that selected model from `groups` at runtime.
- The ModelSelector trigger remains available after removal and should display the first remaining model.
- `onValueChange` records callback count, the latest complete value, and latest reason in an `aria-live="polite"` or status element with a stable `data-testid`.
- A user-accessible action after removal changes effort or speed, allowing the test to prove that the callback carries the fallback model.
- Provide a controlled invalid-value instance and an uncontrolled invalid-default instance, or a clearly labeled mode toggle that deterministically covers both without remount ambiguity.

Do not turn the story into a new public API example or add decorative specimen chrome. Use semantic labels and existing components.

**Verify**:

```sh
npm run build-storybook
```

Expected: exit 0 and the new story is included under `Blocks/Model selector`.

### Step 4: Add focused Playwright coverage

Create `tests/blocks/model-selector.spec.ts`. Follow `tests/theme-props/browser.spec.ts` for direct Storybook iframe navigation, role-based locators, and console-error collection. Navigate to the exact generated id for the new fixed story; confirm the id from the Storybook build rather than guessing if the export name changes.

Cover these cases:

1. **Invalid controlled value**: trigger and model radio selection both resolve to the first option; callback count stays zero after initial render. After a user changes effort or speed, exactly one callback is recorded with the fallback model and the corresponding existing reason.
2. **Invalid uncontrolled default**: trigger and model radio selection both resolve to the first option; callback count stays zero after initial render. A user action emits/stores the normalized model.
3. **Dynamic removal**: begin with a valid non-first model, remove it, assert trigger and radio selection move to the first remaining model with zero removal-induced callbacks, then change effort or speed and assert exactly one callback contains the fallback model and user-action reason.
4. **Empty first group**: ensure fallback finds the first option in a later non-empty group.
5. Assert no browser console errors for each page/test.

Use accessible roles/names and `data-testid` only for callback telemetry. Do not inspect React state, generated StyleX classes, or timing-sensitive animation properties.

**Verify**:

```sh
npx playwright test tests/blocks/model-selector.spec.ts
```

Expected: all focused ModelSelector cases pass in Chromium.

### Step 5: Run complete gates and inspect scope

Run independently:

```sh
npx tsc -b --pretty false
npm run lint
npm run build
npm run build-storybook
npx playwright test tests/blocks/model-selector.spec.ts
npx playwright test
git diff --check
git status --short
```

Expected: the focused test and all non-browser gates exit 0. The full browser suite includes the new ModelSelector file and introduces no failures beyond the baseline recorded before editing. At commit `04972a1`, four unrelated MP/global expectation-drift cases were already failing, so do not change theme code or those tests to make this plan green. Status shows no executor-created edits outside the three in-scope files. Pre-existing user changes may remain and must not be staged or altered.

## Test plan

- New test file: `tests/blocks/model-selector.spec.ts`.
- New fixture: a fixed controls-disabled story in `src/blocks/model-selector/model-selector.stories.tsx`.
- Required assertions:
  - invalid controlled model resolves consistently in trigger and radio group;
  - invalid uncontrolled default resolves consistently;
  - no callback on initial normalization;
  - no callback solely from dynamic removal;
  - the next effort/speed action emits exactly once with fallback model plus correct reason;
  - empty first group falls through to a later group's first option;
  - no console errors.
- Structural exemplar: `tests/theme-props/browser.spec.ts:1-22` for iframe setup and console tracking; use Menu's accessible radio/menu roles rather than DOM structure.
- Focused verification: `npx playwright test tests/blocks/model-selector.spec.ts`.
- Full comparison: `npx playwright test` after Plan 002 has widened discovery; compare it with the pre-edit baseline and require no new failures.

## Done criteria

- [ ] Trigger, radio-group value, reset value, stored uncontrolled value, and emitted callbacks all use the same normalized model id.
- [ ] Invalid controlled and invalid default models fall back to the first option in flattened current group order.
- [ ] An empty first group correctly falls through to a later group.
- [ ] Neither initial render nor dynamic option removal calls `onValueChange`.
- [ ] The first user action after dynamic removal emits exactly one complete normalized value with its existing reason.
- [ ] No `useEffect` or render-time state/callback synchronization was added.
- [ ] Public ModelSelector types and callback reasons are unchanged.
- [ ] The focused Playwright suite passes, and a full run has no new failures beyond the captured pre-edit baseline.
- [ ] `npx tsc -b --pretty false`, `npm run lint`, `npm run build`, and `npm run build-storybook` each exit 0.
- [ ] `git diff --check` exits 0.
- [ ] No executor-created changes exist outside the three in-scope files.

## STOP conditions

Stop and report without improvising if:

- Plans 001 or 002 are incomplete, or Playwright still discovers only `tests/theme-props`.
- Either tracked in-scope file has overlapping user work or no longer matches the Current state behavior.
- Product direction requires emitting a change immediately when controlled props become invalid; that conflicts with this plan's explicit no-unsolicited-callback policy.
- Correct normalization appears to require changing the public value shape, adding a callback reason, or defining a new disabled-option policy.
- The ModelSelector can validly render with zero model options; the current contract explicitly throws and this plan preserves that invariant.
- A verification command fails twice after correcting an in-scope mistake, or the failure belongs to unrelated dirty work.

## Maintenance notes

- Reviewers should check that every route into `updateValue` is normalized, especially reset and effort/speed handlers that spread the current value.
- Keep render normalization derived and side-effect free. Controlled components must not manufacture prop-change callbacks.
- If future requirements define disabled options as invalid selections, handle that in a separate policy change with explicit tests; do not silently fold it into this fix.
- When model groups become remotely updated, retain the dynamic-removal test—it protects the exact stale-id boundary most likely to regress.
