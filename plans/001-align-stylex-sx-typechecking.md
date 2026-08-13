# Plan 001: Align TypeScript with the valid StyleX `sx` boundary

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. Preserve all pre-existing worktree changes. If anything in "STOP conditions" occurs, stop and report; do not improvise. The plan index is maintained separately, so do not edit `plans/README.md` unless the operator explicitly asks.
>
> **Drift check (run first)**:
>
> ```sh
> git status --short --branch
> git diff --stat 04972a1..HEAD -- src/components/code-block/code-block.tsx src/components/breadcrumbs/breadcrumbs.tsx src/components/item/item.tsx src/components/select/select.stories.tsx src/components/tabs/tabs.stories.tsx tests/theme-props/code-block.spec.ts
> git diff -- src/components/code-block/code-block.tsx src/components/breadcrumbs/breadcrumbs.tsx src/components/item/item.tsx src/components/select/select.stories.tsx src/components/tabs/tabs.stories.tsx tests/theme-props/code-block.spec.ts
> ```
>
> If an in-scope tracked file changed since commit `04972a1`, or already has an uncommitted edit, compare the live code with the excerpts below. Stop on a semantic mismatch or overlap; do not overwrite user work. The test file is expected not to exist at the baseline.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: dx
- **Planned at**: commit `04972a1`, 2026-08-12

## Why this matters

`npx tsc -b` currently rejects one valid StyleX compiler input and four unused imports. The `sx` prop on CodeBlock's native `<pre>` is deliberate: the configured StyleX transform consumes it and applies the `styles.pre` class. The correct boundary is a narrow JSX suppression at that exact element, not a global React intrinsic-prop augmentation and not replacement with `stylex.props(...)`. A focused browser check must prove the `<pre>` retains its transformed layout and typography.

## Current state

- `src/components/code-block/code-block.tsx:14-25` renders the semantic `<pre><code>` structure inside a horizontal `ScrollArea`. The load-bearing line is:

  ```tsx
  <pre ref={ref} sx={styles.pre} {...props}>
    <code>{children}</code>
  </pre>
  ```

- `src/components/code-block/code-block.tsx:41-50` defines the StyleX rule that must continue to reach the native `<pre>`:

  ```tsx
  pre: {
    margin: 0,
    padding: tokens["--space-2"],
    boxSizing: "border-box",
    color: tokens["--fg"],
    fontFamily: tokens["--font-family-mono"],
    fontSize: tokens["--font-size-1"],
    lineHeight: tokens["--line-height-2"],
    whiteSpace: "pre",
    minWidth: "100%",
  },
  ```

- Exactly four imports are unused at the baseline:
  - `src/components/breadcrumbs/breadcrumbs.tsx:5`: value import `Link as LinkPrimitive`; preserve `type LinkColor`.
  - `src/components/item/item.tsx:5`: `fontWeightStyles`; preserve `typescaleStyles` and `textStyles`.
  - `src/components/select/select.stories.tsx:7`: `Text`.
  - `src/components/tabs/tabs.stories.tsx:1`: `CaretRightIcon`.
- `tsconfig.app.json:23-25` enables unused-symbol checks and includes `src`; do not weaken these compiler options.
- Repository validation is independent: `npx tsc -b`, `npm run lint`, `npm run build`, and `npm run build-storybook` answer different questions. Run all of them.

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| TypeScript | `npx tsc -b --pretty false` | exit 0, no diagnostics |
| Lint | `npm run lint` | exit 0 |
| App build | `npm run build` | exit 0 |
| Storybook build | `npm run build-storybook` | exit 0 and `storybook-static` generated |
| Focused browser test | `npx playwright test tests/theme-props/code-block.spec.ts` | exit 0; the CodeBlock test passes in Chromium |
| Diff hygiene | `git diff --check` | exit 0, no output |

Do not install, update, or regenerate dependencies. The checkout already contains its dependency lockfile.

## Scope

**In scope — modify only these files:**

- `src/components/code-block/code-block.tsx`
- `src/components/breadcrumbs/breadcrumbs.tsx`
- `src/components/item/item.tsx`
- `src/components/select/select.stories.tsx`
- `src/components/tabs/tabs.stories.tsx`
- `tests/theme-props/code-block.spec.ts` (create)

**Out of scope:**

- React global declarations, `JSX.IntrinsicElements`, or `HTMLAttributes` augmentation.
- Replacing `sx={styles.pre}` with `className`, `style`, or `stylex.props(...)`.
- Any StyleX/Vite/plugin/configuration change.
- Removing, renaming, or changing `styles.pre` declarations.
- Any import cleanup beyond the four symbols listed above.
- Source files currently carrying unrelated Table/DataTable/App/context work.
- Dependency, lockfile, generated Storybook, and plan-index changes.

## Git workflow

- Create or switch to branch `codex/align-stylex-sx-typechecking` only after the drift checks and only if the operator requested a branch.
- Commit only the six in-scope files. Preserve all unrelated staged and unstaged changes.
- Commit message: `[codex] Align StyleX sx type-checking`.
- Do not push or open a pull request unless explicitly instructed.

## Steps

### Step 1: Document the narrow StyleX transform boundary

In `src/components/code-block/code-block.tsx`, add a JSX-line `@ts-expect-error` immediately above the native `<pre>` that says why the exception is expected. The comment must identify that StyleX's JSX transform consumes `sx`; keep `sx={styles.pre}` unchanged. Use `@ts-expect-error`, not `@ts-ignore`, so the suppression becomes a compiler error if upstream typings later learn this prop.

Target shape:

```tsx
{/* @ts-expect-error -- StyleX's JSX transform consumes `sx` on this native element. */}
<pre ref={ref} sx={styles.pre} {...props}>
```

If TypeScript does not associate the JSX comment with the `sx` diagnostic, stop and report instead of broadening the suppression or changing the StyleX syntax.

**Verify**:

```sh
npx tsc -b --pretty false
```

Expected at this intermediate point: the `sx` diagnostic is gone. The only remaining diagnostics may be the four known unused imports listed in Current state. No new diagnostic is acceptable.

### Step 2: Remove only the four stale imports

Make these mechanical import-only edits:

1. In `src/components/breadcrumbs/breadcrumbs.tsx`, change the link import so it imports only `type LinkColor`.
2. In `src/components/item/item.tsx`, remove only `fontWeightStyles` from the named import.
3. In `src/components/select/select.stories.tsx`, delete only the unused `Text` import line.
4. In `src/components/tabs/tabs.stories.tsx`, delete only the unused `CaretRightIcon` import line.

Do not reorder other imports or run a broad autofix.

**Verify**:

```sh
npx tsc -b --pretty false
```

Expected: exit 0 with no diagnostics.

### Step 3: Add a focused transformed-style browser regression

Create `tests/theme-props/code-block.spec.ts`, following the existing Playwright style in `tests/theme-props/browser.spec.ts`: import `expect` and `test` from `@playwright/test`, navigate directly to a Storybook iframe, and assert semantic and computed behavior rather than generated class names.

Use the CodeBlock Playground story URL:

```text
/iframe.html?id=components-code-block--playground&viewMode=story
```

The test must:

1. Locate the native `pre` and its child `code`.
2. Assert the `pre` is visible and contains the Playground code text.
3. Assert the transformed `styles.pre` behavior with stable computed checks: `margin` is `0px`, `white-space` is `pre`, `min-width` is `100%`, and `font-family` is different from the document body's proportional font (or includes the expected configured monospace family if the current story makes that stable).
4. Avoid generated StyleX class names, screenshots, animation timing, and exact colors.

**Verify**:

```sh
npm run build-storybook
npx playwright test tests/theme-props/code-block.spec.ts
```

Expected: Storybook exits 0; Playwright reports one passing CodeBlock test and no failures.

### Step 4: Run the complete repository gates and inspect scope

Run each command independently so a failure is attributable:

```sh
npm run lint
npm run build
npm run build-storybook
npx playwright test tests/theme-props/code-block.spec.ts
git diff --check
git status --short
```

Expected: every command exits 0; status shows no executor-created edits outside the six in-scope files. Pre-existing user changes may remain and must not be staged or altered.

## Test plan

- New test: `tests/theme-props/code-block.spec.ts`.
- Regression protected: the valid native `sx` syntax still passes through the StyleX transform after TypeScript is narrowly suppressed.
- Assertions: semantic `<pre><code>`, visible story content, zero margin, preserved whitespace, full minimum width, and monospace-vs-body font distinction.
- Structural exemplar: `tests/theme-props/browser.spec.ts:1-31` for direct iframe navigation and computed-style assertions.
- Focused verification: `npm run build-storybook && npx playwright test tests/theme-props/code-block.spec.ts` must pass.

## Done criteria

- [ ] The native `<pre>` still contains the exact `sx={styles.pre}` expression.
- [ ] A single explanatory JSX `@ts-expect-error` sits immediately above that element.
- [ ] No global React/JSX type augmentation exists.
- [ ] Only the four named unused imports were removed.
- [ ] `npx tsc -b --pretty false` exits 0 with no diagnostics.
- [ ] The focused CodeBlock Playwright test exists and passes.
- [ ] `npm run lint`, `npm run build`, and `npm run build-storybook` each exit 0.
- [ ] `git diff --check` exits 0.
- [ ] No executor-created changes exist outside the six in-scope files.

## STOP conditions

Stop and report without improvising if:

- Any in-scope tracked file has overlapping user changes or no longer matches the Current state excerpts.
- The StyleX transform no longer accepts or renders `sx` on the native `<pre>`.
- A line-local JSX `@ts-expect-error` cannot suppress only the expected `sx` diagnostic.
- TypeScript reports diagnostics beyond the one `sx` issue and four named unused imports before the edits.
- Passing the browser test appears to require replacing `sx`, augmenting React globally, or changing build configuration.
- A verification command fails twice after correcting an in-scope mistake, or the failure is in unrelated dirty work.

## Maintenance notes

- Reviewers should scrutinize the suppression placement and browser proof together. The suppression is acceptable only while the StyleX transform demonstrably consumes the prop.
- If future React or StyleX typings accept `sx`, `@ts-expect-error` should fail; remove the comment then, leaving the valid `sx` syntax intact.
- Keep this exception local. A global intrinsic-prop augmentation would falsely advertise `sx` on elements and wrappers not guaranteed to pass through the transform.

