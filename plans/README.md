# Implementation plans

Generated with the Improve skill on 2026-08-12 from commit `04972a1`; last reconciled on 2026-08-12. Execute in the order below unless dependencies say otherwise. Each executor must read its plan fully, honor its STOP conditions, and update the status row when done unless the dispatching reviewer owns the index.

Before executing any plan, compare the plan's baseline with the current checkout and inspect both committed and uncommitted changes in every in-scope file. This worktree was already dirty when the plans were written; unrelated work must be preserved.

## Execution order and status

| Plan | Title | Priority | Effort | Risk | Depends on | Status | Verified |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 001 | [Align StyleX `sx` type-checking](./001-align-stylex-sx-typechecking.md) | P1 | S | LOW | — | DONE | 2026-08-12 |
| 002 | [Settle confirmation before success](./002-settle-confirmation-before-success.md) | P1 | M | MED | 001 | TODO | — |
| 003 | [Bound Slider marker density](./003-bound-slider-marker-density.md) | P1 | S | LOW | 001, 002 | TODO | — |
| 004 | [Reset StreamingResponse replacements](./004-reset-streaming-replacements.md) | P1 | S | MED | 001, 002 | TODO | — |
| 005 | [Normalize ModelSelector values](./005-normalize-model-selector-values.md) | P1 | S | MED | 001, 002 | TODO | — |
| 006 | [Arbitrate CommandPalette shortcuts](./006-arbitrate-command-palette-shortcuts.md) | P1 | S | LOW | 001, 002 | TODO | — |

Status values: `TODO`, `IN PROGRESS`, `DONE`, `BLOCKED` (with a one-line reason), or `REJECTED` (with a one-line rationale).

## Dependency notes

- Plan 001 establishes a clean TypeScript/application-build baseline without rewriting valid StyleX syntax.
- Plan 002 establishes browser-test discovery under all of `tests/`, while preserving the existing theme-props suite.
- Plans 003–006 depend on both baselines so each delegated executor can add and run a focused component/block regression test.

Plans 003–006 touch separate component or block families and are suitable for parallel delegation after plans 001 and 002 land. Each executor should still refresh `git status`, compare its in-scope paths, and run its focused checks because this checkout may continue changing.

## Reconciliation record

### 2026-08-12

- Plan 001 is verified in the current working tree at `04972a1`. The valid native `sx` expression, narrow TypeScript suppression, four import removals, and focused CodeBlock regression remain present. A fresh no-emit application TypeScript check passed; scoped ESLint reported zero errors and four pre-existing StyleX ordering warnings; scoped diff hygiene passed. The focused Playwright regression was reviewed after its console-error guard was added and reported one passing test.
- Plan 001's implementation and the `plans/` backlog are still uncommitted. Improve's isolated-worktree `execute` flow starts from committed Git state, so Plan 002 must not be dispatched through that flow until Plan 001's dependency is available in the executor's Git history. This is an execution-readiness constraint, not a failure of Plan 001.
- Plans 002–006 have no committed or uncommitted drift in their scoped implementation and test paths. Their current-state excerpts still match the live code, and all five findings remain reproducible.
- Plan 002 is the next plan in dependency order. Plans 003–006 remain waiting on Plan 002 and may run in parallel after it is complete.

## Architecture note: NavList drilldown

The drilldown behavior can and should be separated as an **internal owner-focused module**, while the public compound API remains exactly `NavList.Drilldown`, `NavList.DrilldownPanel`, `NavList.DrilldownTrigger`, and `NavList.DrilldownBack`.

It is not yet a good standalone public component like `Collapsible`. The current implementation has one real adapter and depends on NavList-specific row rendering, scroll restoration, focus selectors, panel collection, presentation mode, and icon-rail popovers. Exporting a generic `Drilldown` now would either expose those implementation details or create a shallow abstraction with no second consumer. A later NavList decomposition plan should move the private drilldown contexts, collection/state machine, focus/scroll logic, and collapsed-popover adapter into `src/components/nav-list/nav-list-drilldown.tsx`, injected with the few NavList-owned helpers it needs, without changing the public exports. If a second non-navigation consumer appears, that is the point to evaluate a generic view-stack primitive.

## Findings considered and rejected for this batch

- A global JSX augmentation for `sx` was rejected because it would advertise `sx` on all React intrinsic prop types and wrappers even though the StyleX transform only consumes the supported JSX syntax. Plan 001 uses a narrow, documented compiler boundary.
- Replacing valid `sx` syntax with `stylex.props(...)` was rejected because the reported problem is TypeScript awareness of the configured transform, not invalid StyleX usage.
- A public generic Drilldown component was rejected for now because there is only one concrete consumer and its dependencies are NavList-specific.
- The remaining audit findings—broader NavList decomposition, drag-and-drop experiment isolation, gallery loading boundaries, README inventory drift, and repository-wide verification/CI—are intentionally outside this requested planning batch.
