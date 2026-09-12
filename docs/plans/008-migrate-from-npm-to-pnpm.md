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
> `git diff --stat c6d9b8f..HEAD -- package.json package-lock.json pnpm-lock.yaml pnpm-workspace.yaml .prettierignore README.md AGENTS.md vercel.json playwright.config.ts playwright.app.config.ts .github/workflows/verify.yml docs/agents/validation.md src/foundations/foundation-pages.tsx src/components/code/code.stories.tsx docs/plans docs/agents/planning.md`
> Compare source/config changes since `c6d9b8f` with this plan. Ref cleanup
> #65 must land first; reconcile dependency PR #57 before taking a fresh
> baseline. Documentation reconciliation is expected. Stop on unexplained
> contract or dependency drift rather than restoring older package versions.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: HIGH
- **Completed prerequisites**: issue [#27](https://github.com/robertweisbecker/base-xyz/issues/27) / [PR #34](https://github.com/robertweisbecker/base-xyz/pull/34), merged as `a956b17`; Plan 007 / [PR #47](https://github.com/robertweisbecker/base-xyz/pull/47), merged as `e168ac3`
- **Category**: migration
- **Planned at**: commit `9b84d52`, 2026-09-03
- **Reconciled at**: commit `c6d9b8f`, 2026-09-11
- **Depends on**: [#65 ref cleanup](https://github.com/robertweisbecker/base-xyz/issues/65) landed; resolved/serialized dependency PR #57; idle implementation queue
- **Issue**: intentionally local migration proposal; link a durable issue when claimed
- **Status**: TODO — wait for the listed prerequisites

## Why this matters

The repository currently uses npm. pnpm's strict dependency layout would expose
six source imports from the transitive `@base-ui/utils` package that npm
hoisting currently masks, so replacing the lockfile without first correcting
that boundary would produce an incomplete migration. Move to one exactly
pinned pnpm 11 toolchain, one authoritative lockfile, explicit dependency-build
permissions, and pnpm-based local, browser, documentation, Dependabot, and
Vercel workflows while preserving the locked dependency graph and all current
behavior.

## Current state

### Repository and package-manager boundary

- This is a non-published single-package React 19/Vite 8/Storybook 10 project
  in a public GitHub repository.
  There is one root `package.json`, no package workspace, and no publish step.
- `package-lock.json` is a lockfile v3 and is the only authoritative lockfile.
  There is no `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `.npmrc`, or
  `packageManager` field at the reconciled commit `c6d9b8f`.
- `package.json:6-8` declares Node `>=20`. The planned pnpm executable is
  `11.19.0`; its own installed package metadata declares Node `>=22.13`.
  Record the execution host versions afresh. Selecting pnpm 11 raises the
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

[Ref cleanup #65](https://github.com/robertweisbecker/base-xyz/issues/65) owns
replacement of those imports and InlineEdit's local helper with one closed,
React 19 cleanup-aware two-ref hook. That independent change must land before
this migration. Preserve its implementation; do not edit refs during a lockfile
conversion. If Plan 010 moved CopyButton, inspect its new canonical component
path. The relevant invariant is `rg -n 'from "@base-ui/utils' src` returning no
matches, not a fixed list of filenames or absence of a private `setRef`.

### Repository-facing npm references

The current migration surface is broader than the old draft:

- `README.md:16-24,135-137` — install, app, Storybook, verification, and Doctor;
- `AGENTS.md` and `docs/agents/validation.md` — canonical verification commands
  and browser setup;
- `.github/workflows/verify.yml` — Node 24, npm cache, `npm ci`, and quick gate;
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

`.github/workflows/verify.yml` runs the quick gate on pull requests, with
read-only contents permission, cancellation by workflow/ref, and a 10-minute
timeout. Migrate its install/cache commands without broadening CI to full
browser verification. Keep Dependabot's `package-ecosystem: npm`.

Vercel's actual project settings were not inspected. Verify its Node version and
package-manager selection before claiming deployment readiness. The documented
Corepack route requires `packageManager` plus the project opt-in
`ENABLE_EXPERIMENTAL_COREPACK=1`; do not assume that setting exists or is absent.
Inspect actual settings and authorized preview logs, or report deployment
selection unverified. See [Vercel Corepack selection](https://vercel.com/docs/builds/configure-a-build#corepack).
No environment-setting changes or deployment is authorized by this plan alone.

Dependency PR #57 overlaps package.json/package-lock.json (including Base UI,
Playwright, and Storybook upgrades). Resolve or serialize it before baseline;
refresh installed-type and Chromium assumptions from the resulting lockfile.
Passing quick/preview checks on that PR are not full interaction evidence.

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
- Browser prerequisite: after locked dependency installation, run
  `npx playwright install chromium` if its matching browser is absent (or
  after a Playwright upgrade); on Linux use `--with-deps chromium` when
  system libraries are missing. Do this before the full baseline gate.
- Record environment:
  `node --version && npm --version && corepack --version`.
  Expect Node to satisfy `>=22.13`; check `pnpm --version` only after bootstrap.
- Establish the npm baseline:
  `npm ci && npm ls --depth=0 --json > /tmp/base-xyz-plan-008-npm-baseline.json`.
  Expect a clean npm install and dependency snapshot.
- Find phantom imports: `rg -n 'from "@base-ui/utils' src`. Expect no matches
  before starting this migration; #65 owns the correction.
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
  `rg -n -e 'npm run' -e 'npm install' -e 'npm exec' -e 'npm ci' -e '\bnpx\b' README.md AGENTS.md docs/agents/validation.md .github/workflows/verify.yml package.json vercel.json playwright.config.ts playwright.app.config.ts src/foundations/foundation-pages.tsx src/components/code/code.stories.tsx docs/plans`.
  Expect only intentional migration/rollback references and the exact pinned
  npm-to-pnpm CI bootstrap to remain.
- Check final lockfiles:
  `git ls-files package-lock.json pnpm-lock.yaml && test ! -e package-lock.json && test -f pnpm-lock.yaml`.
  Expect only `pnpm-lock.yaml` after staging or commit preparation.

Do not use the current root `node_modules` as baseline evidence. The successful
`npm ci` snapshot is required before any lockfile is removed.

## Suggested executor toolkit

- Read `AGENTS.md`, `README.md`, `docs/agents/validation.md`,
  `docs/agents/planning.md`, and ADR 0012 before
  starting. This migration changes repository workflow, not component design.
- Use pnpm 11.19.0's local help and official references when a command is
  unclear:
  [installation/Corepack](https://pnpm.io/installation#using-corepack),
  [`pnpm import`](https://pnpm.io/cli/import), and
  [`pnpm approve-builds`](https://pnpm.io/cli/approve-builds).
- Use the repository's code-review skill after the package-manager migration. Treat generated lockfile volume as data to inspect,
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
- `.github/workflows/verify.yml`
- `docs/agents/validation.md`
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
- Ref implementation, component output, styling, icons, public APIs, or
  Storybook content beyond the two command examples listed in Scope.
- Upgrading application dependencies, changing package ranges, resolving
  unrelated npm audit findings, or accepting top-level version drift.
- Converting the repository into a multi-package workspace. A
  `pnpm-workspace.yaml` is permitted only because pnpm 11 stores the explicit
  dependency-build policy there.
- Approving every dependency lifecycle script, disabling script safety, or
  adding a broad trusted-dependency pattern.
- Changing Dependabot's `package-ecosystem: npm`, unrelated GitHub labels/issues, ADRs,
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
- #65 lands as an independent prerequisite. If a migration commit is
  separately authorized, use `[codex] Migrate repository workflows to pnpm`.
- Do not push or open a pull request unless instructed.

## Steps

### Step 1: Establish a clean npm baseline and execution lock

Confirm commits `a956b17` and `e168ac3` are ancestors of the implementation
base. Confirm #65 is landed and its phantom-import check is empty. Resolve
PR #57 overlap before recording this base. Confirm no plan other than Plan
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
# If the lockfile-matching browser is absent:
npx playwright install chromium
npm run verify:full
npm run doctor
```

The clean npm install removes the stale `node_modules` discrepancy observed
during planning. Record the exact environment and retain the JSON snapshot only
in `/tmp`. Do not proceed if the npm baseline itself is red; that would make
later failures impossible to attribute to pnpm.

**Verify**: all baseline commands exit 0 except any already-documented advisory
Doctor status; `git status --short` still contains no generated tracked change.

### Step 2: Pin pnpm and import the npm lockfile

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

### Step 3: Record the dependency-build policy and prove strict installation

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
prerequisite phantom-import inventory must remain empty.

**Verify**: frozen install exits 0, no required build remains blocked, top-level
versions match, and neither `shamefully-hoist` nor a public-hoist workaround is
present in repository configuration.

### Step 4: Convert repository commands and deployment configuration

Update package-manager invocations while preserving script behavior:

- In `package.json`, replace nested `npm run` calls with `pnpm run`.
- In `playwright.config.ts`, replace `npx vite preview` with
  `pnpm exec vite preview`.
- In `playwright.app.config.ts`, replace `npm run preview` with
  `pnpm run preview`.
- In `vercel.json`, change the build command to
  `pnpm run build-storybook`; preserve the output directory.
- In `README.md` and `docs/agents/validation.md`, convert setup, dev,
  Storybook, quick/full verification, Doctor, and Playwright installation
  examples to pnpm. Preserve browser setup as a prerequisite, not a per-run
  download; Playwright upgrades can require a matching browser reinstall.
- In `.github/workflows/verify.yml`, retain checkout and establish Node 24
  without a package-manager cache first. Install the exact pnpm 11.19.0
  executable explicitly (for example `npm install --global pnpm@11.19.0`),
  verify `pnpm --version`, then configure `actions/setup-node` with Node 24,
  `cache: pnpm`, and `cache-dependency-path: pnpm-lock.yaml`. Run
  `pnpm install --frozen-lockfile`, then `pnpm run verify:quick`. This ordering
  gives the cache step a working pnpm executable. Keep the current action
  versions, PR trigger, permissions, concurrency, timeout, and quick-only scope.
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
rollback command, package link, historical record, `pnpm import` source
description, or the exact pinned `npm install --global pnpm@11.19.0` CI
bootstrap. All ordinary repository install/run instructions must use pnpm.

### Step 5: Run the complete pnpm verification matrix

Run the repository only through pnpm:

```sh
pnpm run verify:full
pnpm run doctor
```

The full gate includes quick and all build/browser/bundle leaf checks. Run a
leaf independently only to diagnose a failure or verify a later relevant edit;
do not prescribe duplicate passing leaf/quick/full runs. Compare advisory
Doctor diagnostics with the fresh npm baseline without score chasing or waiver
changes.

Then run live development checks after dependency optimization finishes:

```sh
pnpm run dev
pnpm run storybook
```

Use separate terminals and the repository's alternate-port guidance when
another checkout already owns a port. Confirm the Vite app and representative
component, block, experimental, and foundation stories render; exercise the
affected resize, anchor, scrolling, and indicator behavior already established
by #65; verify the StyleX development stylesheet and browser
console remain clean.

Inspect Vercel's selected Node/package-manager mechanism when access permits.
For an authorized preview, require logs showing pnpm **11.19.0**, a frozen
pnpm-lock install, the intended Node version, and a successful Storybook build.
A changed `buildCommand` alone does not prove package-manager selection.
Without deployment authorization or settings access, record local verification
as complete and deployment selection as unverified; do not deploy or alter
project environment settings solely to satisfy this plan.

**Verify**: full gate passes, Doctor has no unexplained migration regression,
live evidence is recorded, and CI source preserves quick-only policy. Any
claim of CI or deployment success requires an actual authorized run; otherwise
report that limitation explicitly.

### Step 6: Prove frozen reproducibility and prepare rollback evidence

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
   `package-lock.json`, `.prettierignore`, configs, and docs changed by this migration; preserve landed #65;
2. remove migration-created `pnpm-lock.yaml` and `pnpm-workspace.yaml` only
   after resolving their exact paths;
3. run `npm ci`, then the original npm `verify:full` gate;
4. leave Plan 008 BLOCKED with the exact incompatibility and do not leave a
   mixed-lockfile or partially converted command state.

**Verify**: either the pnpm end state passes every criterion, or the npm rollback
returns to the clean baseline with no mixed migration files.

### Step 7: Complete the plan lifecycle without reusing its number

After all gates pass, update any linked issue only if the operator authorized
GitHub changes. No issue was published while this plan was written.

Copy the final Plan 008 to the ignored scratch archive, remove the tracked plan
file, and move its row from the active table to the public retired-plan ledger
with DONE status and the durable commit/PR evidence. Keep `008` reserved and
preserve the index's current highest/next markers (011/012 at reconciliation),
advancing only for newly allocated plans. Never reset the marker to 009.

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
- #65 owns focused ref characterization and cleanup evidence. Confirm it landed
  and reuse its coverage; do not repeat ref implementation in this migration.
- Establish one fresh npm baseline with `npm ci` and `npm run verify:full`.
  After switching, run `pnpm run verify:full` once plus advisory Doctor and
  targeted live review. Repeat affected checks only for changes or failures.
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
- [ ] #65 is landed; `rg -n 'from "@base-ui/utils' src` remains empty and
      ref implementation is unchanged by this migration.
- [ ] No direct `@base-ui/utils` dependency, shameful/public hoisting, or
      `mergeProps` ref workaround was added.
- [ ] A clean frozen pnpm install succeeds twice without changing the lockfile;
      top-level versions match the clean npm baseline.
- [ ] README, AGENTS, validation guide, CI, composite scripts, Playwright
      servers, Vercel, visible examples, and active plans use pnpm consistently.
- [ ] CI bootstraps exact pnpm before cache/frozen install and preserves its
      existing quick-only trigger/permission/concurrency policy.
- [ ] Dependabot remains `package-ecosystem: npm`; historical npm records are
      unchanged.
- [ ] Existing full-suite behavior and focused live integration remain valid;
      no migration-only permanent fixture was added.
- [ ] `pnpm run verify:quick`, `pnpm run doctor`, and
      `pnpm run verify:full` complete with no migration regression.
- [ ] Live Vite and Storybook checks pass after optimization; any authorized
      Vercel preview proves Node, exact pnpm 11.19.0, frozen install, and build.
      If no preview is authorized, deployment readiness is explicitly unverified.
- [ ] No generated build/test/install artifacts or files outside Scope remain.
- [ ] Plan 008 is archived to ignored scratch, its tracked file is removed, its
      compact public row is DONE, and identifier 008 is never reused.

## STOP conditions

Stop and report; do not improvise if:

- commits `a956b17` or `e168ac3` are absent, Plan 007 still appears IN PROGRESS
  in active-plan metadata, #65 is not landed, dependency work overlaps the
  baseline, or another plan is still IN PROGRESS;
- the fresh npm baseline fails before any migration edit;
- Node 20 support is intentional and may not be raised to the pnpm 11.19.0
  minimum of Node 22.13;
- pnpm 11.19.0 is unavailable or its actual Node/build-policy/import behavior
  differs materially from this plan;
- `pnpm import` changes a direct dependency range or resolved top-level version
  without a separately approved dependency update;
- strict installation succeeds only by adding `@base-ui/utils`, enabling broad
  hoisting, approving all lifecycle scripts, or changing application behavior;
- completing migration would require changing ref behavior or adding a
  public API/test-only fixture; route ref problems back to #65;
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
- Reviewers should focus on direct/resolved dependency equivalence, absence of
  hoisting workarounds, lifecycle-script policy, CI selection, and the
  Vercel/browser gates—not install speed anecdotes.
- Any active plan created after this migration must use pnpm commands. Retired
  plan numbers remain in the public ledger and are never recycled.
