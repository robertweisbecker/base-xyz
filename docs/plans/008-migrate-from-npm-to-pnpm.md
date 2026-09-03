# Plan 008: Migrate repository workflows from npm to pnpm 11

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, copy this file to
> `.scratch/plans/completed/008-migrate-from-npm-to-pnpm.md`, remove the tracked
> plan file, and move its row to the retired-plan ledger in
> `docs/plans/README.md`, unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat 1569440..HEAD -- package.json package-lock.json pnpm-lock.yaml pnpm-workspace.yaml .prettierignore README.md AGENTS.md vercel.json playwright.config.ts playwright.app.config.ts src/hooks/use-merged-refs.ts src/blocks/prompt-composer/prompt-composer.tsx src/blocks/copy-button/copy-button.tsx src/components/tabs/tabs.tsx src/components/input-group/input-group.tsx src/components/textarea/textarea.tsx src/experimental/drag-and-drop/dnd-kit/dnd-kit-menu-demo.tsx src/experimental/inline-edit/inline-edit.tsx src/foundations/foundation-pages.tsx src/components/code/code.stories.tsx docs/plans docs/agents/planning.md`
> Before implementation edits, expect only the post-merge lifecycle and plan
> reconciliation after `1569440`, including Plan 007's retirement. Compare any
> other change against "Current state." Any unexplained mismatch is a STOP
> condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: HIGH
- **Completed prerequisites**: issue [#27](https://github.com/robertweisbecker/base-xyz/issues/27) / [PR #34](https://github.com/robertweisbecker/base-xyz/pull/34), merged as `a956b17`; Plan 007 / [PR #47](https://github.com/robertweisbecker/base-xyz/pull/47), merged as `e168ac3`
- **Category**: migration
- **Planned at**: commit `9b84d52`, 2026-09-03
- **Reconciled at**: commit `1569440`, 2026-09-03
- **Status**: TODO

## Why this matters

The repository currently uses npm everywhere but already carries an older
root-level pnpm migration draft. pnpm's strict dependency layout would expose
six source imports from the transitive `@base-ui/utils` package that npm
hoisting currently masks, so replacing the lockfile without first correcting
that boundary would produce an incomplete migration. Move to one exactly
pinned pnpm 11 toolchain, one authoritative lockfile, explicit dependency-build
permissions, and pnpm-based local, browser, documentation, Dependabot, and
Vercel workflows while preserving the locked dependency graph and all current
behavior.

This plan supersedes the former root-level `pnpm-migration-plan.md`, which was
authored before the current validation, deployment, issue, and plan-lifecycle
infrastructure existed.

## Current state

### Repository and package-manager boundary

- This is a private, single-package React 19/Vite 8/Storybook 10 repository.
  There is one root `package.json`, no package workspace, and no publish step.
- `package-lock.json` is a lockfile v3 and is the only authoritative lockfile.
  There is no `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `.npmrc`, or
  `packageManager` field at commit `9b84d52`.
- `package.json:6-8` declares Node `>=20`. The planned pnpm executable is
  `11.19.0`; its own installed package metadata declares Node `>=22.13`.
  The planning host runs Node `v24.9.0`, npm `11.6.0`, Corepack `0.34.0`, and
  pnpm `11.19.0`. Selecting pnpm 11 therefore intentionally raises the
  repository Node floor to `>=22.13`; do not leave contradictory engine and
  package-manager requirements.
- The current `node_modules` is stale relative to `package.json` and
  `package-lock.json`: `npm ls --depth=0` reports several invalid installed
  versions, while the lockfile contains the requested current versions. Build
  the comparison baseline from a fresh `npm ci` in the implementation
  worktree, not from today's installed directory.
- The root lockfile currently records install scripts for `esbuild` and a
  nested optional `fsevents`. Previous pnpm diagnostics found that the required
  toolchain permission is `esbuild`; do not approve every dependency script.

Use these exact package-manager choices unless a STOP condition applies:

```json
{
	"engines": {
		"node": ">=22.13"
	},
	"packageManager": "pnpm@11.19.0"
}
```

The exact pnpm patch is part of reproducibility. Do not commit `latest`,
`latest-11`, a caret range, or a locally newer unreviewed patch.

### Current scripts and verification

`package.json:9-28` has package-manager-neutral leaf scripts, but composite
scripts call npm directly:

```json
{
	"verify:quick": "npm run typecheck && npm run lint && npm run format:check",
	"verify:full": "npm run verify:quick && npm run test:stylex-dev && npm run test:app && npm run test:storybook && npm run test:style-props:bundle",
	"test:storybook": "npm run build-storybook && playwright test",
	"test:style-props": "npm run build-storybook && playwright test tests/style-props && npm run test:style-props:bundle",
	"test:app": "npm run build && playwright test --config playwright.app.config.ts"
}
```

The migration must preserve the behavior and order of every script. Replace
only the nested package-manager invocation (`npm run` to `pnpm run`); do not
rename scripts, reorder gates, change test scope, or turn advisory Doctor
diagnostics into a blocking score.

Current authoritative gates are:

- `verify:quick`: TypeScript, blocking Oxlint, advisory complexity and React
  Compiler diagnostics, and Prettier check;
- `verify:full`: quick gate, StyleX cold-development regression, app build and
  Playwright, Storybook build and Playwright, and the bundle boundary;
- `doctor`: advisory React audit whose configured
  `only-export-components` waiver must remain unchanged.

ADR 0012 requires permanent tests to protect durable behavior rather than a
one-off migration mechanism. This plan adds no dedicated package-manager test
or Storybook fixture; clean frozen installs and the existing full verification
suite are the durable proof.

### Hidden transitive dependency

These six tracked source files import `@base-ui/utils/useMergedRefs` directly,
even though `@base-ui/utils` is not a root dependency:

```text
src/blocks/copy-button/copy-button.tsx
src/blocks/prompt-composer/prompt-composer.tsx
src/components/input-group/input-group.tsx
src/components/tabs/tabs.tsx
src/components/textarea/textarea.tsx
src/experimental/drag-and-drop/dnd-kit/dnd-kit-menu-demo.tsx
```

`@base-ui/react@1.7.0` depends on `@base-ui/utils@0.3.2`, so npm's flattened
layout makes those undeclared imports resolve accidentally. pnpm must not be
configured with public/shameful hoisting to preserve that accident, and the
transitive utility must not be added as a direct dependency.

Issue #27 / PR #34 landed as `a956b17`, changing commit-safety for latest-value
refs in InlineEdit and two hooks without removing these six imports. This plan
must preserve that completed work while extracting InlineEdit's React 19
cleanup-aware local two-ref helper.

`src/experimental/inline-edit/inline-edit.tsx` now contains the right semantic
seed in its private `useComposedRef` and `setRef` helpers:

```tsx
function useComposedRef<T>(...refs: Array<Ref<T> | undefined>) {
	return useCallback((value: T | null) => {
		const cleanups = refs.map((ref) => setRef(ref, value));
		return () => {
			for (const cleanup of cleanups) cleanup?.();
		};
	}, refs);
}
```

The actual implementation currently includes a hooks-lint suppression because
the rest array is newly allocated. Extract a repository-owned hook accepting
exactly two refs—the only supported use case in all seven consumers—with
literal `[firstRef, secondRef]` dependencies. Preserve callback-ref cleanup
functions, the `ref(null)` fallback for callback refs without cleanup, and
object-ref clearing. Do not use `mergeProps`: Base UI 1.7 explicitly documents
that its public `mergeProps` keeps only the rightmost ref.

### Repository-facing npm references

The current migration surface is broader than the old draft:

- `README.md:16-24,135-137` — install, app, Storybook, verification, and Doctor;
- `AGENTS.md:64-65` — canonical executor verification commands;
- `package.json:18-24` — nested package scripts;
- `playwright.config.ts:25` — Storybook preview through `npx vite`;
- `playwright.app.config.ts:18` — app preview through `npm run`;
- `vercel.json:3` — explicit Storybook build command;
- `src/foundations/foundation-pages.tsx:270-276` and
  `src/components/code/code.stories.tsx:5-21` — visible command examples;
- active plan files under `docs/plans/` — future executor commands that must
  match the migrated package manager.

Do not rewrite these intentional references:

- the npm registry/package link in `README.md`;
- `package-ecosystem: npm` in `.github/dependabot.yml`, which is the Dependabot
  ecosystem identifier for npm-compatible JavaScript manifests including pnpm;
- historical npm incidents in `.agents/PAPERCUTS.md`;
- ignored npm debug-log names;
- dependency package names or prose discussing npm as the source format for
  `pnpm import`.

`.gitignore` already ignores `pnpm-debug.log*`. `.prettierignore:22` ignores the
generated `package-lock.json`; replace that entry with `pnpm-lock.yaml` when the
authoritative lockfile changes.

### Deployment and plan coordination

`vercel.json` exists and currently runs `npm run build-storybook`; the old draft
incorrectly said there was no deployment configuration. Change the explicit
build command to pnpm and keep `outputDirectory: "storybook-static"`.

There is no GitHub Actions workflow. `.github/dependabot.yml` is the only
tracked GitHub automation and should continue using `package-ecosystem: npm`.

Plan 007 completed in PR #47 and is retired from the active plan directory.
Do not execute this repository-wide package-manager migration concurrently
with another active plan: every plan and validator currently assumes npm. When
Plan 008 begins, update only the active plan files that still exist; do not
recreate Plan 007 merely because it appears in the original planned-at scope.

## Commands you will need

- Inspect base: `git status --short --branch && git rev-parse --short HEAD`.
  Expect the intended isolated branch or worktree, clean before migration.
- Confirm queue: `rg -n 'IN PROGRESS' docs/plans/README.md`. Expect no active
  plan row other than Plan 008 after it is claimed.
- Record environment:
  `node --version && npm --version && corepack --version && pnpm --version`.
  Expect Node to satisfy `>=22.13` and pnpm to print `11.19.0`.
- Establish the npm baseline:
  `npm ci && npm ls --depth=0 --json > /tmp/base-xyz-plan-008-npm-baseline.json`.
  Expect a clean npm install and dependency snapshot.
- Find phantom imports: `rg -n 'from "@base-ui/utils' src`. Expect no matches
  after the ref migration.
- Inspect blocked install scripts: `pnpm ignored-builds`. Expect no required
  build to remain unapproved and `esbuild` to be allowed explicitly.
- Prove the pnpm install: `pnpm install --frozen-lockfile`. Expect a clean
  strict-layout install without lockfile edits.
- Record the pnpm dependency snapshot:
  `pnpm list --depth=0 --json > /tmp/base-xyz-plan-008-pnpm-baseline.json`.
  Expect top-level resolved versions to match the npm baseline.
- Typecheck: `pnpm run typecheck`. Expect exit 0 with no errors.
- Run the standard gate: `pnpm run verify:quick`. Expect it to pass unchanged.
- Run React Doctor: `pnpm run doctor`. Treat it as advisory and retain the
  existing waiver.
- Run the full gate: `pnpm run verify:full`. Expect app, Storybook, browser,
  StyleX development, and bundle gates to pass.
- Inventory repository-facing commands:
  `rg -n -e 'npm run' -e 'npm install' -e 'npm exec' -e 'npm ci' -e '\bnpx\b' README.md AGENTS.md package.json vercel.json playwright.config.ts playwright.app.config.ts src/foundations/foundation-pages.tsx src/components/code/code.stories.tsx docs/plans`.
  Expect only intentional migration or rollback references to remain.
- Check final lockfiles:
  `git ls-files package-lock.json pnpm-lock.yaml && test ! -e package-lock.json && test -f pnpm-lock.yaml`.
  Expect only `pnpm-lock.yaml` after staging or commit preparation.

Do not use the current root `node_modules` as baseline evidence. The successful
`npm ci` snapshot is required before any lockfile is removed.

## Suggested executor toolkit

- Read `AGENTS.md`, `README.md`, `docs/agents/planning.md`, and ADR 0012 before
  starting. This migration changes repository workflow, not component design.
- Use pnpm 11.19.0's local help and official references when a command is
  unclear:
  [installation/Corepack](https://pnpm.io/installation#using-corepack),
  [`pnpm import`](https://pnpm.io/cli/import), and
  [`pnpm approve-builds`](https://pnpm.io/cli/approve-builds).
- Use the installed Base UI 1.7 documentation at
  `node_modules/@base-ui/react/docs/react/utils/merge-props.md` to confirm that
  `mergeProps` does not merge refs.
- Use the repository's code-review skill after the ref-hook extraction and
  package-manager migration. Treat generated lockfile volume as data to inspect,
  not a reason to skip the semantic diff.

## Scope

**In scope** (the only tracked files you should modify):

- `package.json`
- `package-lock.json` (remove only after successful import and comparison)
- `pnpm-lock.yaml` (create)
- `pnpm-workspace.yaml` (create only for pnpm 11 `allowBuilds` policy)
- `.prettierignore`
- `README.md`
- `AGENTS.md`
- `vercel.json`
- `playwright.config.ts`
- `playwright.app.config.ts`
- `src/hooks/use-merged-refs.ts` (create)
- `src/blocks/copy-button/copy-button.tsx`
- `src/blocks/prompt-composer/prompt-composer.tsx`
- `src/components/input-group/input-group.tsx`
- `src/components/tabs/tabs.tsx`
- `src/components/textarea/textarea.tsx`
- `src/experimental/drag-and-drop/dnd-kit/dnd-kit-menu-demo.tsx`
- `src/experimental/inline-edit/inline-edit.tsx`
- `src/foundations/foundation-pages.tsx`
- `src/components/code/code.stories.tsx`
- every active tracked plan file still present under `docs/plans/` when this
  migration begins, solely for npm-to-pnpm command updates and lifecycle state
- `docs/plans/README.md`
- `.scratch/plans/completed/008-migrate-from-npm-to-pnpm.md` (ignored local
  lifecycle copy after completion)

**Out of scope**:

- Adding `@base-ui/utils` as a direct dependency, importing another Base UI
  internal, or enabling `shamefully-hoist`/public hoisting to mask undeclared
  imports.
- Replacing ref composition with `mergeProps`; it does not preserve both refs.
- Changing ref ownership, component output, styling, icons, Storybook content,
  or public APIs while migrating the helper.
- Upgrading application dependencies, changing package ranges, resolving
  unrelated npm audit findings, or accepting top-level version drift.
- Converting the repository into a multi-package workspace. A
  `pnpm-workspace.yaml` is permitted only because pnpm 11 stores the explicit
  dependency-build policy there.
- Approving every dependency lifecycle script, disabling script safety, or
  adding a broad trusted-dependency pattern.
- Changing Dependabot's `package-ecosystem: npm`, GitHub labels/issues, ADRs,
  Doctor rule waivers, test behavior, test concurrency, ports, or gate order.
- Rewriting historical npm references in `.agents/PAPERCUTS.md`, Git history,
  ignored scratch plans, or retired-plan ledger evidence.
- Adding a package-manager regression test, dedicated Storybook fixture, or
  snapshot solely for this migration.
- Deploying, pushing, opening a pull request, or publishing a GitHub issue
  unless the operator separately authorizes it.

## Git workflow

- Start only from a base containing issue #27 / PR #34 (`a956b17`) and Plan 007
  / PR #47 (`e168ac3`), with no other IN PROGRESS plan row. Rebase or branch
  from the then-current `main`.
- Suggested branch: `codex/migrate-to-pnpm`.
- Preserve a clean pre-migration npm baseline in `/tmp`, not as tracked files.
- Prefer two reviewable commits if authorized:
  1. `[codex] Remove transitive Base UI utility imports`
  2. `[codex] Migrate repository workflows to pnpm`
- Do not push or open a pull request unless instructed.

## Steps

### Step 1: Establish a clean npm baseline and execution lock

Confirm commits `a956b17` and `e168ac3` are ancestors of the implementation
base and inspect the final InlineEdit/hook diff. Confirm no plan other than Plan
008 is IN PROGRESS, then mark Plan 008 IN PROGRESS without changing other
statuses. The package-manager migration is a serial infrastructure change; do
not run it beside another executor whose commands or lockfile may change.

In the isolated implementation branch/worktree:

```sh
git status --short --branch
node --version
npm --version
corepack --version
npm ci
npm ls --depth=0 --json > /tmp/base-xyz-plan-008-npm-baseline.json
npm run verify:quick
npm run verify:full
npm run doctor
```

The clean npm install removes the stale `node_modules` discrepancy observed
during planning. Record the exact environment and retain the JSON snapshot only
in `/tmp`. Do not proceed if the npm baseline itself is red; that would make
later failures impossible to attribute to pnpm.

**Verify**: all baseline commands exit 0 except any already-documented advisory
Doctor status; `git status --short` still contains no generated tracked change.

### Step 2: Replace the transitive ref utility with a repository-owned hook

Create `src/hooks/use-merged-refs.ts` with a closed two-ref API:

```tsx
export function useMergedRefs<T>(
	firstRef: Ref<T> | undefined,
	secondRef: Ref<T> | undefined,
): RefCallback<T> {
	return useCallback(
		(value) => {
			const firstCleanup = setRef(firstRef, value);
			const secondCleanup = setRef(secondRef, value);
			return () => {
				firstCleanup?.();
				secondCleanup?.();
			};
		},
		[firstRef, secondRef],
	);
}
```

Add a private `setRef` that preserves React 19 callback-ref cleanup semantics:

- callback refs receive the instance; retain and return their cleanup when they
  provide one;
- callback refs without cleanup receive `null` during cleanup;
- object refs receive the instance and reset to `null` during cleanup;
- missing refs do nothing.

Use exact React `Ref`/`RefCallback` types without `any`, a variable-length rest
API, render-time ref mutation, or a hooks-lint suppression.

Replace all six `@base-ui/utils/useMergedRefs` imports with the local hook.
With PR #34's final changes present, replace InlineEdit's private
`useComposedRef`/`setRef` with the same hook and remove the duplicate functions.
Change no call-site order: the forwarded/caller ref remains first and the
component-owned ref remains second.

Do not add a direct `@base-ui/utils` dependency. Do not substitute
`@base-ui/react/merge-props` because only the rightmost ref survives.

**Verify**:

```sh
rg -n 'from "@base-ui/utils|function useComposedRef|function setRef' src
pnpm exec tsc -b --pretty false
pnpm exec oxlint src/hooks/use-merged-refs.ts src/blocks/copy-button/copy-button.tsx src/blocks/prompt-composer/prompt-composer.tsx src/components/input-group/input-group.tsx src/components/tabs/tabs.tsx src/components/textarea/textarea.tsx src/experimental/drag-and-drop/dnd-kit/dnd-kit-menu-demo.tsx src/experimental/inline-edit/inline-edit.tsx
```

Expected: the inventory returns no matches; typecheck and focused lint exit 0.
Use the already available pnpm executable for these commands, but do not alter
the lockfile yet.

Run existing behavior coverage before changing package managers:

```sh
npm run build-storybook
npx playwright test tests/blocks/prompt-composer.spec.ts tests/components/tabs.spec.ts
```

Expected: existing public behavior passes with shared console/page-error
capture. Per ADR 0012, do not add a permanent private-ref fixture. Manually
exercise Textarea auto-resize, InputGroup Textarea auto-resize, CopyButton toast
anchoring, Tabs indicator motion, PromptComposer scrolling, and drag handles in
their existing stories; record results in the implementation handoff.

### Step 3: Pin pnpm and import the npm lockfile

Make pnpm 11.19.0 available through Corepack without `sudo`:

```sh
corepack install --global pnpm@11.19.0
corepack enable pnpm
pnpm --version
```

If Corepack reports a signature/database error, update Corepack with a temporary
writable npm cache, then retry the exact pnpm version. Do not use an unpinned
global pnpm install.

Update `package.json` to:

- change `engines.node` from `>=20` to `>=22.13`;
- add exact `packageManager: "pnpm@11.19.0"` near the engine metadata;
- preserve every dependency name and range at this step.

With `package-lock.json` still present, run:

```sh
pnpm import
```

Inspect the generated `pnpm-lock.yaml` importers and package resolutions against
`package-lock.json` and `/tmp/base-xyz-plan-008-npm-baseline.json`. The importer
must contain the same direct dependency ranges; resolved top-level versions
must not change merely because the package manager changed.

Only after that comparison succeeds, remove `package-lock.json` and replace its
entry in `.prettierignore` with `pnpm-lock.yaml`. Keep exactly one lockfile.

**Verify**:

```sh
pnpm --version
node -p "require('./package.json').packageManager"
test -f pnpm-lock.yaml
test ! -e package-lock.json
rg -n 'package-lock.yaml|package-lock.json' .prettierignore package.json
```

Expected: pnpm is `11.19.0`; package metadata matches; only the new lockfile is
present; `.prettierignore` contains no obsolete package-lock entry.

### Step 4: Record the dependency-build policy and prove strict installation

Remove the npm-created `node_modules`, then install from pnpm without hoisting
overrides. Review `pnpm ignored-builds` and approve only packages required by
the toolchain. At the planned dependency graph that means `esbuild`:

```sh
pnpm install --frozen-lockfile
pnpm ignored-builds
pnpm approve-builds esbuild
pnpm rebuild esbuild
```

Inspect the generated `pnpm-workspace.yaml`. Retain the CLI-written
`allowBuilds` policy with `esbuild: true`; record explicitly denied packages if
the CLI adds them. Do not use `--all`. Do not add package globs or workspace
packages unless pnpm's generated schema requires the root declaration. This
file is a dependency-script policy, not a monorepo commitment.

Delete `node_modules` once more and prove the checked-in policy and lockfile can
bootstrap without interaction:

```sh
pnpm install --frozen-lockfile
pnpm ignored-builds
pnpm list --depth=0 --json > /tmp/base-xyz-plan-008-pnpm-baseline.json
```

Compare every top-level version against the clean npm baseline. Also run
`pnpm why @base-ui/utils`: it may appear transitively through Base UI, but the
source inventory from Step 2 must remain empty.

**Verify**: frozen install exits 0, no required build remains blocked, top-level
versions match, and neither `shamefully-hoist` nor a public-hoist workaround is
present in repository configuration.

### Step 5: Convert repository commands and deployment configuration

Update package-manager invocations while preserving script behavior:

- In `package.json`, replace nested `npm run` calls with `pnpm run`.
- In `playwright.config.ts`, replace `npx vite preview` with
  `pnpm exec vite preview`.
- In `playwright.app.config.ts`, replace `npm run preview` with
  `pnpm run preview`.
- In `vercel.json`, change the build command to
  `pnpm run build-storybook`; preserve the output directory.
- In `README.md`, convert setup, dev, Storybook, quick/full verification, and
  Doctor examples to pnpm.
- In `AGENTS.md`, convert executable validation commands to pnpm without
  changing their policy or meaning.
- Update the visible code examples in `foundation-pages.tsx` and
  `code.stories.tsx` to `pnpm run build`.
- Update npm/npx commands in every **active** plan file present at execution
  time, including Plan 008. Preserve plan statuses, scopes, planned-at SHAs,
  evidence, and historical prose. Do not recreate already retired plan files.

Keep `.github/dependabot.yml` on `package-ecosystem: npm`; that identifier is
not a user-facing package-manager selection. Keep the npm package link in the
README and historical PAPERCUT entries unchanged.

**Verify**: run the command inventory from "Commands you will need." Inspect
each remaining match and confirm it is an intentional migration baseline,
rollback command, package link, historical record, or `pnpm import` source
description—not an executable repository instruction.

### Step 6: Run the complete pnpm verification matrix

Run the repository only through pnpm:

```sh
pnpm run typecheck
pnpm run lint
pnpm run format:check
pnpm run verify:quick
pnpm run doctor
pnpm run test:stylex-dev
pnpm run test:app
pnpm run test:storybook
pnpm run test:style-props:bundle
pnpm run verify:full
```

`verify:full` repeats most focused commands intentionally; the individual runs
localize failures and the final run proves the public aggregate workflow.
Doctor remains advisory: inspect new diagnostics attributable to the ref
extraction or strict dependency layout, but do not chase unrelated warnings or
change its configured export waiver.

Then run live development checks after dependency optimization finishes:

```sh
pnpm run dev
pnpm run storybook
```

Use separate terminals and the repository's alternate-port guidance when
another checkout already owns a port. Confirm the Vite app and representative
component, block, experimental, and foundation stories render; exercise the
six ref-hook consumers; verify the StyleX development stylesheet and browser
console remain clean.

If the operator authorizes a branch push/PR, require a Vercel preview to use the
new lockfile and `pnpm run build-storybook`. Without deployment authorization,
verify `vercel.json` by source inspection and the identical local Storybook
build; do not create a deployment solely for this plan.

**Verify**: every pnpm command exits 0, live app/Storybook evidence is recorded,
and any Vercel preview that was authorized succeeds.

### Step 7: Prove frozen reproducibility and prepare rollback evidence

Capture the checksum of `pnpm-lock.yaml`, remove `node_modules`, run another
clean frozen install, and confirm the lockfile does not change:

```sh
shasum -a 256 pnpm-lock.yaml
pnpm install --frozen-lockfile
shasum -a 256 pnpm-lock.yaml
pnpm run build
pnpm run build-storybook
```

The two checksums must match. Re-run the top-level dependency comparison and
the phantom-import inventory. Inspect `git diff --check`, `git status --short`,
and the generated lockfile diff. There must be one authoritative lockfile and no
tracked install/build artifacts.

Rollback, if a STOP condition prevents completion:

1. use Git in the isolated branch to restore `package.json`,
   `package-lock.json`, `.prettierignore`, configs, docs, and source imports;
2. remove migration-created `pnpm-lock.yaml` and `pnpm-workspace.yaml` only
   after resolving their exact paths;
3. run `npm ci`, then the original npm `verify:quick` and `verify:full` gates;
4. leave Plan 008 BLOCKED with the exact incompatibility and do not leave a
   mixed-lockfile or partially converted command state.

**Verify**: either the pnpm end state passes every criterion, or the npm rollback
returns to the clean baseline with no mixed migration files.

### Step 8: Complete the plan lifecycle without reusing its number

After all gates pass, update any linked issue only if the operator authorized
GitHub changes. No issue was published while this plan was written.

Copy the final Plan 008 to the ignored scratch archive, remove the tracked plan
file, and move its row from the active table to the public retired-plan ledger
with DONE status and the durable commit/PR evidence. Keep `008` reserved and
leave the index's next available identifier at `009` unless another plan was
allocated concurrently.

**Verify**:

```sh
test -f .scratch/plans/completed/008-migrate-from-npm-to-pnpm.md
test ! -e docs/plans/008-migrate-from-npm-to-pnpm.md
rg -n '008.*DONE' docs/plans/README.md
git check-ignore .scratch/plans/completed/008-migrate-from-npm-to-pnpm.md
git diff --check
git status --short
```

Expected: scratch copy exists and is ignored, no tracked active Plan 008 file
remains, its public ledger row is DONE, its number is reserved, and only the
implementation scope is changed.

## Test plan

- Add no permanent test or Storybook fixture solely for package-manager or
  private-ref implementation details, per ADR 0012.
- Before lockfile migration, run existing PromptComposer and Tabs browser specs
  after the ref-hook extraction; rely on `tests/playwright.ts` for console and
  page-error capture.
- Manually exercise current stories for all seven ref-hook consumers, including
  callback behavior, auto-resize, scroll fading, indicator/anchor behavior, and
  drag handles. Record the story IDs and results as review evidence.
- Establish a fresh npm baseline with `npm ci` and both aggregate verification
  gates before switching. After switching, run every equivalent command with
  pnpm and the full `verify:full` gate.
- Perform two clean `pnpm install --frozen-lockfile` passes using the committed
  build policy; compare the lockfile checksum and top-level resolved versions.
- If authorized, use the Vercel preview as deployment evidence. Do not make
  deployment a hidden prerequisite when no authorization/credentials exist.

## Done criteria

- [ ] Issue #27 / PR #34 and Plan 007 / PR #47 are present in the base, and no
      other plan ran concurrently with the package-manager migration.
- [ ] `package.json` declares Node `>=22.13` and exact
      `packageManager: "pnpm@11.19.0"`.
- [ ] `pnpm-lock.yaml` is the only authoritative lockfile;
      `package-lock.json` is removed and `.prettierignore` follows the new file.
- [ ] `pnpm-workspace.yaml` contains only the necessary pnpm 11 dependency-build
      policy, with `esbuild` explicitly allowed and no broad approval.
- [ ] All source imports of `@base-ui/utils` are gone; the repository-owned
      two-ref hook preserves callback cleanup and object-ref clearing without
      `any`, render-time ref mutation, or lint suppression.
- [ ] No direct `@base-ui/utils` dependency, shameful/public hoisting, or
      `mergeProps` ref workaround was added.
- [ ] A clean frozen pnpm install succeeds twice without changing the lockfile;
      top-level versions match the clean npm baseline.
- [ ] README, AGENTS, composite scripts, Playwright servers, Vercel, visible
      examples, and all still-active plans use pnpm commands consistently.
- [ ] Dependabot remains `package-ecosystem: npm`; historical npm records are
      unchanged.
- [ ] Existing focused PromptComposer/Tabs tests pass; manual ref-consumer
      evidence is recorded; no migration-only permanent fixture was added.
- [ ] `pnpm run verify:quick`, `pnpm run doctor`, and
      `pnpm run verify:full` complete with no migration regression.
- [ ] Live Vite and Storybook checks pass after optimization; any authorized
      Vercel preview uses pnpm successfully.
- [ ] No generated build/test/install artifacts or files outside Scope remain.
- [ ] Plan 008 is archived to ignored scratch, its tracked file is removed, its
      compact public row is DONE, and identifier 008 is never reused.

## STOP conditions

Stop and report; do not improvise if:

- commits `a956b17` or `e168ac3` are absent, Plan 007 still appears IN PROGRESS
  in the active-plan metadata, the final InlineEdit changes conflict with the
  planned shared ref hook, or another plan is still IN PROGRESS;
- the fresh npm baseline fails before any migration edit;
- Node 20 support is intentional and may not be raised to the pnpm 11.19.0
  minimum of Node 22.13;
- pnpm 11.19.0 is unavailable or its actual Node/build-policy/import behavior
  differs materially from this plan;
- `pnpm import` changes a direct dependency range or resolved top-level version
  without a separately approved dependency update;
- strict installation succeeds only by adding `@base-ui/utils`, enabling broad
  hoisting, approving all lifecycle scripts, or changing application behavior;
- any ref consumer requires more than two refs, loses callback cleanup, changes
  ref order/ownership, or needs a new public API/test-only fixture;
- a required dependency script other than `esbuild` is blocked and its need
  cannot be proven from the current toolchain;
- Vite, Storybook, StyleX cold-start, Playwright, bundle, or Doctor behavior
  differs under pnpm after one focused in-scope correction;
- Vercel ignores the pinned pnpm/lockfile or cannot run the explicit build
  command in an authorized preview;
- the migration would require a file outside Scope, an unrelated dependency
  upgrade, or a workspace/CI redesign;
- a verification command still fails after two reasonable in-scope attempts.

## Maintenance notes

- Update `packageManager` and regenerate `pnpm-lock.yaml` together when pnpm is
  intentionally upgraded. Recheck the pinned pnpm package's Node engine before
  changing either version.
- Keep one authoritative lockfile. Dependabot's ecosystem name remains `npm`
  for pnpm manifests; review its first post-migration lockfile PR carefully.
- `pnpm-workspace.yaml` initially owns dependency-build trust only. Do not infer
  that the repository has become a multi-package workspace.
- The local `useMergedRefs` hook is deliberately a closed two-ref utility. Add a
  broader API only when a real caller exists and React cleanup semantics remain
  explicit.
- Reviewers should focus on direct/resolved dependency equivalence, absence of
  hoisting workarounds, lifecycle-script policy, ref cleanup semantics, and the
  Vercel/browser gates—not install speed anecdotes.
- Any active plan created after this migration must use pnpm commands. Retired
  plan numbers remain in the public ledger and are never recycled.
