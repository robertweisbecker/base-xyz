# Plan 010: Give CopyButton a component owner without breaking block imports

> **Executor instructions:** Follow each step and its verification gate. Preserve
> supported imports and behavior; STOP instead of broadening scope. Update this
> plan's row in `docs/plans/README.md` unless the reviewing agent owns the index.
>
> **Drift check (run first):**
> `git diff --stat c6d9b8f..HEAD -- src/components/copy-button src/components/breadcrumbs src/components/index.ts src/blocks/copy-button src/blocks/index.ts src/app/gallery-page.tsx tests/components/copy-button.spec.ts docs/adr/0004-component-block-and-compound-ownership.md docs/plans/010-copy-button-component-ownership.md docs/plans/README.md`
> Inspect local status too. Compare changed source against the excerpts below;
> stop if ownership/import assumptions changed. Index-only updates are expected.

## Status

- **Priority:** P2
- **Effort:** M
- **Risk:** MED
- **Depends on:** none; serialize with #65 ref cleanup, Plan 008, and barrel/gallery edits
- **Category:** tech-debt
- **Planned at:** commit `c6d9b8f`, 2026-09-11
- **Issue:** https://github.com/robertweisbecker/base-xyz/issues/58
- **Status:** IN PROGRESS — issue #58 claimed; executing on reviewed #65 ref cleanup

## Why this matters

The public component barrel exports Breadcrumbs, which imports CopyButton from
blocks; CopyButton imports the component barrel again. This is a runtime import
cycle and puts reusable component behavior above a primitive that needs it.
CopyButton already has independent consumers, so give it a canonical component
owner and retain its previous block imports as compatibility aliases. Do not
create a general clipboard framework or change its interaction policy.

## Current state

The cycle is visible in three imports:

```tsx
// src/components/index.ts:17
export { Breadcrumbs } from "./breadcrumbs/breadcrumbs";
// src/components/breadcrumbs/breadcrumbs.tsx:3
import { CopyButton } from "@/blocks/copy-button/copy-button";
// src/blocks/copy-button/copy-button.tsx:5
import { Button, IconButton, Icon, Toast } from "@/components";
```

`src/blocks/copy-button/copy-button.tsx` currently exports CopyButton and
CopyButtonProps. It creates a private anchored Toast manager, renders either a
labeled Button or icon-only IconButton, and composes caller clicks before the
clipboard operation:

```tsx
// src/blocks/copy-button/copy-button.tsx:42–51
async function handleClick(event: Parameters<NonNullable<ButtonProps["onClick"]>>[0]) {
  onClick?.(event);
  if (event.defaultPrevented) {
    return;
  }
  setCopied(true);
  try {
    await navigator.clipboard.writeText(value);
```

Success and failure feedback use the component's anchored manager; animation is
from `src/styles/recipes/transitions.ts`. Preserve that behavior, accessible
labels, variants, `shape`, forwarded refs, and callback cancellation. This plan
does not redesign settlement timing, tooltip terminology, or toast durations.

Breadcrumbs.Copy at `breadcrumbs.tsx:189` adapts the control with a breadcrumb
label, `size="xs"`, and `variant="ghost"`; Breadcrumbs.Clipboard aliases it.
`src/blocks/index.ts` also exports CopyButton/CopyButtonProps. The gallery imports
CopyButton from blocks and lists its specimen in the block collection around
line 964. Other block/app/story consumers may keep the compatible import.

The existing Storybook file has title `Blocks/Copy button` and one Examples story
with labeled, icon-only, size, variant, and shape examples. Its adjacent MDX
imports the block barrel. No focused clipboard spec exists; existing app routing
tests do cover Breadcrumbs navigation semantics, not copying.

### Conventions to preserve

- ADR 0004: components contain reusable, product-agnostic primitives; blocks
  compose public components for opinionated workflows. This is a specific owner
  correction, not permission to reclassify other blocks.
- ADR 0003: import component owners directly and preserve StyleX-generated inline
  values. The new owner imports Button/IconButton/ButtonProps from
  `@/components/button/button`, Icon from `@/components/icons`, and Toast from
  `@/components/toast`; never import `@/components` from the new owner.
- Public `src/components/index.ts` becomes the canonical export. Preserve
  `@/blocks` and `@/blocks/copy-button/copy-button` through re-exports of the same
  component/type, not a second implementation or wrapper component.
- The new control remains a normal Button-based consumer of styling props. Do
  not add margins to new internal parts or create a new state/slot API.
- Follow `tests/components/tabs.spec.ts` for semantic locators and
  `tests/blocks/confirmation-dialog.spec.ts` for observable anchored-feedback
  checks. Import `{ expect, test }` from `../playwright` to retain automatic
  console/page-error assertions. ADR 0012 requires durable copying behavior,
  not icon glyph, exact timeout, render count, or private manager tests.

## Commands you will need

The audit host's installed dependencies were stale relative to the committed
lockfile. Use `npm ci` in an isolated execution checkout before establishing a
baseline. If Plan 008 has migrated the repository, refresh this plan's commands
before execution; if #65 landed, preserve its ref-merging seam; do not restore npm or transitive
imports. No commit/push/PR without user authorization. If authorized, match the
existing `[codex] ...` commit style.

| Purpose                       | Command                                                    | Expected result                                          |
| ----------------------------- | ---------------------------------------------------------- | -------------------------------------------------------- |
| Locked installation           | `npm ci`                                                   | Exit 0; manifest/lockfile unchanged                      |
| Missing Chromium prerequisite | `npx playwright install chromium`                          | Browser available; Linux may need `--with-deps chromium` |
| Quick gate                    | `npm run verify:quick`                                     | Exit 0                                                   |
| Storybook build               | `npm run build-storybook`                                  | Exit 0                                                   |
| Focused clipboard behavior    | `npx playwright test tests/components/copy-button.spec.ts` | All cases pass with browser diagnostics                  |
| Full integration              | `npm run verify:full`                                      | Exit 0, including app routing and bundle boundary        |
| Live inspection               | `npm run storybook -- --ci --port 6206`                    | Ready after optimization; affected stories work          |

Use free ports and the documented `PLAYWRIGHT_STORYBOOK_PORT` /
`PLAYWRIGHT_APP_PORT` overrides; never reuse another checkout's preview server.

## Scope

**In scope:**

- New `src/components/copy-button/copy-button.tsx`, `copy-button.stories.tsx`, and
  `copy-button.mdx` (move the current implementation and authoritative docs).
- Existing `src/blocks/copy-button/copy-button.tsx` (compatibility re-export),
  `copy-button.stories.tsx`, and `copy-button.mdx` (retire after the move).
- `src/components/breadcrumbs/breadcrumbs.tsx` and its stories only where needed
  to exercise the existing copy adapter.
- `src/components/index.ts`, `src/blocks/index.ts`, `src/app/gallery-page.tsx`.
- `tests/components/copy-button.spec.ts` (new).
- `docs/adr/0004-component-block-and-compound-ownership.md` (brief clarification
  of this existing rule), this plan, and its index/dependency notes.

**Out of scope:** other block consumers, Toast/Button/Icon/Tooltip internals,
clipboard hooks/services, dependencies, shared styles/tokens, other tests, other
ADRs, and existing plan contents. Legacy imports keep other consumers working.

## Steps

### 1. Capture the import and behavior baseline

Run the drift check and read the current implementation, Breadcrumbs adapter,
barrels, gallery collections, and both story files. Record the existing exports
and labels. In the execution checkout, restore locked dependencies as necessary.

**Verify:** `npm run verify:quick` and `npm run build-storybook` → exit 0. Stop
on unrelated baseline failures. `rg -n 'CopyButton|CopyButtonProps' src` identifies
consumers; record their paths without rewriting unrelated callers.

### 2. Characterize clipboard behavior through current public stories

Add `tests/components/copy-button.spec.ts` against the current CopyButton Examples
and Breadcrumbs Playground. Use Chromium's clipboard permissions for successful
writes/read-back on the localhost origin. Exercise labeled and icon-only controls,
Breadcrumbs.Copy, and the existing Clipboard alias without testing every cosmetic
variant. Add a functional prevented-action example to the existing story only
where necessary for public callback cancellation.

For clipboard rejection, replace only the browser clipboard API in test setup
with a rejecting implementation and assert visible failure feedback. This is an
external capability boundary, not module mocking. Restore isolation between cases;
do not spy on Toast, React state, or imported modules. Do not require exact toast
strings/durations; use the existing feedback's semantics plus a meaningful success
or failure assertion. If current clipboard behavior has an unrelated defect,
record it separately rather than changing it as part of a file move.

**Verify:** `npm run build-storybook`, then the focused clipboard spec → all
baseline cases pass. This establishes behavior before ownership changes.

### 3. Move the canonical implementation and preserve aliases

Move CopyButton into `src/components/copy-button/copy-button.tsx` and replace its
component-barrel imports with the direct owner imports listed above. Preserve the
implementation otherwise, including current ref merging. Export CopyButton and
CopyButtonProps from `src/components/index.ts`.

Replace the old implementation file with only:

```ts
export { CopyButton, type CopyButtonProps } from "@/components/copy-button/copy-button";
```

Keep `src/blocks/index.ts`'s existing public exports pointing to that compatibility
module. Update Breadcrumbs to import the canonical component directly. Do not
route the component through the block barrel or add another implementation layer.
If #65 already replaced `useMergedRefs`, carry that exact established seam
into the new owner; never reintroduce `@base-ui/utils`.

**Verify:** `npm run verify:quick` → exit 0. `rg -n '@/blocks|from "@/components"' src/components/copy-button/copy-button.tsx src/components/breadcrumbs/breadcrumbs.tsx` → no matches. Rebuild
Storybook and rerun the focused clipboard spec → all baseline cases still pass.

### 4. Move the authoritative examples and document compatibility

Move the CopyButton stories and MDX beside the canonical component, use the
`Components/Copy button` title, and update the documented import to `@/components`.
Preserve example content and coverage; remove the old story/MDX files so the
inventory has one authoritative entry. Update only the affected Storybook IDs in
the new clipboard spec. Mention the legacy block imports as compatibility paths
without duplicating the API table.

In the gallery, move CopyButton into the component import and alphabetized
component specimen collection; remove its block specimen. Preserve content and
all other exports/specimens. Add a short ADR 0004 clarification: generic copying
now has a component owner and old block entry points delegate for compatibility.
The compatibility alias has no automatic removal date.

**Verify:** `npm run verify:quick`, `npm run build-storybook`, and the focused
clipboard spec → exit 0. Inspect `storybook-static/index.json`: there is exactly
one CopyButton Examples entry under Components and no duplicate Blocks entry.
`rg -n 'CopyButton' src/app/gallery-page.tsx` confirms its canonical import and
single top-level specimen (nested uses may remain).

### 5. Verify the boundary and integration

Run full verification after the final source change. Inspect the new CopyButton
story and Breadcrumbs Playground in live Storybook after optimization, including
keyboard activation, success/failure feedback, and accessible button names.
Use the existing app routing tests within the full gate to catch Breadcrumbs
integration regressions. Confirm the compatibility file and barrel expose the
same implementation, and inspect imports to confirm the original cycle is gone.

**Verify:** `npm run verify:full` and `git diff --check` → exit 0. Review both
`git diff --name-only` and `git status --short` against Scope, including new files.
Record verification and compatibility evidence in the issue/index. Retire the
plan only under the normal completion lifecycle after acceptance.

## Test plan

The focused spec protects observable contracts through existing realistic
examples: clipboard receives the exact supplied value for labeled/icon-only and
breadcrumb controls; explicit names remain available; prevented clicks do not
write or announce success; rejected writes produce failure feedback. Cover both
canonical and compatibility imports with typechecking and an ordinary example
using the retained block export, rather than creating tests of re-export identity.
A labeled compatibility example may remain in the new story for this purpose.

Keep any added scenario within the component/Breadcrumbs story files in Scope.
No screenshot gate, SVG/state-icon checks, exact timeout assertions, private
manager tests, or independent tests of the compatibility module itself.

## Done criteria

- [ ] The canonical implementation lives under `src/components/copy-button`.
- [ ] Public component and both legacy block imports remain usable with unchanged
      CopyButtonProps; Breadcrumbs.Copy and Breadcrumbs.Clipboard remain usable.
- [ ] The old block module is only a re-export; neither Breadcrumbs nor the new
      owner imports blocks or the root component barrel.
- [ ] Focused clipboard tests and `npm run verify:full` pass.
- [ ] One authoritative Components story/Docs entry and one gallery specimen exist.
- [ ] `git diff --check` passes; status/diff contains only scoped files.
- [ ] Live Storybook evidence and issue/index status are recorded.

## STOP conditions

Stop for conflicting source drift, an out-of-scope primitive change, unsupported
clipboard APIs in the intended browser environment, or an import compatibility
requirement that needs a new wrapper/API. Stop if #65, Plan 008, or another task is
editing the same imports, barrels, gallery, or dependency setup. If the callback,
feedback, or clipboard baseline has a separate defect, report it rather than
silently changing behavior during the move. Stop after a reasonable correction
and rerun still leaves an in-scope gate failing.

## Maintenance notes

Future reusable copy controls should import the component owner. Blocks may retain
product-specific copying workflows above it; do not infer that every existing
block belongs in components. [Ref cleanup #65](https://github.com/robertweisbecker/base-xyz/issues/65)
names the current CopyButton owner: run serially and refresh its canonical path
after this move. Plan 008 depends on that separate cleanup and owns only the
package-manager transition. This plan edits neither work item's implementation. Plans 003/004 also touch the public barrel/gallery;
reconcile their additions instead of replacing those files wholesale.
