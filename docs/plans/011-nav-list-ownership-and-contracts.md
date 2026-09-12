# Plan 011: Preserve NavList contracts across coherent private owners

> **Executor instructions:** Follow the ordered steps and verify their expected
> results. STOP on the conditions below; do not broaden the public API or repair
> unrelated code. Update this plan's status in `docs/plans/README.md` when claiming
> or completing work, unless a reviewer owns the index.
>
> **Drift check (run first):**
> `git diff --stat c6d9b8f..HEAD -- src/components/nav-list tests/components/nav-list.spec.ts src/components/sidebar/sidebar.tsx src/components/tooltip/tooltip.tsx docs/plans/011-nav-list-ownership-and-contracts.md docs/plans/README.md`
> Also inspect `git status --short`. Compare changed source with the excerpts
> below. Stop for changed public contracts or ownership assumptions; unrelated
> documentation/index updates do not invalidate the plan.

## Status

- **Priority:** P1
- **Effort:** M
- **Risk:** MED
- **Depends on:** none; run separately from Sidebar issues #20/#21 and Plan 008
- **Category:** tech-debt
- **Planned at:** commit `c6d9b8f`, 2026-09-11
- **Issue:** https://github.com/robertweisbecker/base-xyz/issues/18
- **Status:** IN PROGRESS — issue #18 claimed; isolated execution and review

## Why this matters

NavList repeats the same trigger contract across expanded rows and icon-mode
popovers. Both collapsed trigger paths currently lose consumer click handlers
and explicit accessible names. Collapsible panels also copy their children into
parent state without unregistering them, leaving old links available after a
panel is removed. Both collapsed disclosure rows also reach root `onNavigate`,
which can close a Drawer merely when opening child navigation. Correct those
observable contracts, then separate row,
collapsible, and drilldown responsibilities without introducing a generic
navigation framework.

## Current state

`src/components/nav-list/nav-list.tsx` owns public types, root/presentation/scroll
contexts, row resolution, collapsible state, drilldown history and focus, popup
adaptation, and StyleX declarations. Its public namespace at line 1475 includes
Root, Section, Item, CollapsibleGroup, CollapsibleGroupTrigger,
CollapsibleGroupPanel, Drilldown, DrilldownPanel, DrilldownTrigger, DrilldownBack,
and NavListPresentationProvider. Preserve the named exports as well as this
namespace. Sidebar imports the presentation provider; application routing is a
consumer, not a NavList responsibility.

The accepted item contract at lines 66–82 includes:

```ts
label: string;
"aria-label"?: string;
onClick?: MouseEventHandler<HTMLElement>;
```

Expanded `CollapsibleGroupTrigger` forwards `aria-label` and `onClick` to Row at
lines 705–711. Its icon branch at lines 681–693 forwards neither. DrilldownTrigger
repeats that difference at lines 947–978. The private CollapsedChildrenPopover
and CollapsedDrilldownPopover each reconstruct a Row, including independently
selected class/style/icon/label props. `createRowClickHandler` at lines 548–564
already defines the event policy to preserve:

```tsx
onClick?.(event);
if (event.defaultPrevented) return;
if (onDisclosureClick) {
	onDisclosureClick(event);
	return;
}
if (!suppressNavigate) onNavigate?.(event);
```

Both collapsed popup rows at lines 1066–1077 and 1166–1177 omit
`suppressNavigate`/`onDisclosureClick`, so their disclosure falls through to
`onNavigate`. Expanded Collapsible suppresses it at line 714 and expanded
Drilldown uses disclosure at line 976. InDrawer closes from `onNavigate` at
`nav-list.stories.tsx:280`; this is a user-visible callback contract.

The collapsible root holds `popoverContent` in state at line 628. Panel registration
at lines 737–739 currently has no matching cleanup:

```tsx
useEffect(() => {
	group?.setPopoverContent(children);
}, [children, group]);
```

Drilldown at lines 809–920 owns controlled/uncontrolled value, navigation direction,
saved scroll positions, opener references, and focus restoration. The icon popup
at lines 1093–1200 owns a separate local navigation stack; it resets to its target
when reopened. Preserve that distinction. Do not move local popup history into the
outer controlled value.

Existing stories in `nav-list.stories.tsx` are Playground, Examples, Collapsible,
Drilldown, InDrawer, and CollapsedChildPopovers. Existing app integration coverage
is `tests/app/routing.spec.ts`; there is no focused NavList spec yet.

### Conventions and boundaries

- ADR 0004: “NavList owns its drilldown history, focus, and presentation
  coordination.” A public generic Drilldown requires a second non-navigation
  consumer. No routing, page-shell, breakpoints, or Drawer state enters NavList.
- ADR 0003 requires named direct imports of StyleX modules and preservation of
  the full generated class/style output. Keep component styles local to NavList;
  this refactor does not create shared recipes or change tokens.
- ADR 0011 limits broad layout to Box/Stack/Grid and common margins to eligible
  normal-flow roots. Preserve existing root margins, native `style`, and last-wins
  `xstyle`; do not expand part props.
- ADR 0012 requires public-behavior characterization for substantial refactors,
  not snapshots of private modules, render counts, generated classes, or effects.
- `src/components/data-table/data-table.tsx` is the local decomposition exemplar:
  its entry imports private feature modules directly and re-exports existing
  public types. Follow that ownership pattern, not its dataset-specific API.
- `tests/components/tabs.spec.ts` demonstrates semantic role/name locators and
  keyboard assertions. Import `{ expect, test }` from `../playwright`; its automatic
  fixture records console and page errors.

## Commands you will need

Use the locked npm toolchain at this revision. The audit machine's installed
TypeScript/Storybook differed from the lockfile, so it is not a verification
baseline. In an isolated execution checkout, run `npm ci`; do not replace shared
`node_modules` while another task is using it. If Plan 008 has changed package
management, stop and refresh this plan's commands before execution.

| Purpose                         | Command                                                 | Expected result                                                                           |
| ------------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Locked dependencies             | `npm ci`                                                | Exit 0; manifest and lockfile unchanged                                                   |
| Browser prerequisite, if absent | `npx playwright install chromium`                       | Chromium available; on Linux use `--with-deps chromium` when system libraries are missing |
| Quick gate                      | `npm run verify:quick`                                  | Exit 0; no blocking type/lint/format errors                                               |
| Build Storybook                 | `npm run build-storybook`                               | Exit 0                                                                                    |
| Focused behavior                | `npx playwright test tests/components/nav-list.spec.ts` | All defined NavList cases pass, including shared diagnostics                              |
| Advisory React review           | `npm run doctor`                                        | Review attributable diagnostics; the score is not a blocking threshold                    |
| Integration and final gate      | `npm run verify:full`                                   | Exit 0, including app routing, Storybook, cold-start, and bundle checks                   |
| Live Storybook                  | `npm run storybook -- --ci --port 6206`                 | Server ready; inspect affected stories after optimization                                 |

For occupied preview ports, set `PLAYWRIGHT_STORYBOOK_PORT` and
`PLAYWRIGHT_APP_PORT` to free ports; leave other tasks' servers running. Use a
free live Storybook port instead of 6206 if necessary. Never suppress browser
errors or increase timeouts to hide failures.

## Scope

**In scope:**

- `src/components/nav-list/nav-list.tsx` and `nav-list.stories.tsx`.
- New private modules within the same directory: `nav-list-context.tsx`
  (shared contexts and the existing JSX provider),
  `nav-list-row.tsx`, `nav-list-collapsible.tsx`, `nav-list-drilldown.tsx`,
  `nav-list.stylex.ts`; add `nav-list.types.ts` only if needed to keep type imports
  acyclic. These are allowed ownership boundaries, not a quota of files.
- `tests/components/nav-list.spec.ts` (new focused public-behavior coverage).
- This plan and its row/dependency notes in `docs/plans/README.md`.
- Verification only: temporarily enable `framework.options.strictMode` in
  `.storybook/main.ts` and add the disposable effect sentinel described in step 5
  to the lifecycle story. Restore both before the final gate; neither belongs in
  the implementation diff.

**Out of scope:** Sidebar implementation, routing/app-shell code, public barrels,
Tooltip/Popover/Collapsible implementations, tokens, shared recipes, dependency or
lint configuration, other tests, and existing plans. Read Sidebar and Tooltip
consumers to verify compatibility; do not edit them to accommodate new APIs.

## Git workflow

Use an operator-selected isolated branch/worktree when other implementation work
is active. No commit, push, or PR without separate user authorization. If authorized,
match existing messages such as `[codex] Preserve NavList presentation contracts`.
Keep characterization, behavior corrections, and mechanical moves distinguishable
in the review diff.

## Steps

### 1. Establish the source and toolchain baseline

Run the drift check, read the files cited above, and verify the public namespace
and named exports before moving them. Install locked dependencies in the execution
checkout if needed. Record failures as pre-existing rather than changing unrelated
source. Check the existing Sidebar consumer of NavListPresentationProvider.

**Verify:** `npm run verify:quick` and `npm run build-storybook` → exit 0. If the
baseline fails outside this plan's scope, STOP with the command and evidence.
Run `npm run doctor` and record existing advisory diagnostics for comparison;
do not turn unrelated warnings into refactor scope.

### 2. Characterize supported navigation before extraction

Create `tests/components/nav-list.spec.ts`. Extend the existing functional stories
with a small labeled configuration control or callback output when a supported
combination is otherwise inaccessible. Keep current story IDs. If a combined
scenario cannot fit an existing story intelligibly, one focused navigation story
in the same file is allowed; it must exercise public behavior rather than expose
private state. Keep the lifecycle scenario useful without development-only
instrumentation. A StrictMode wrapper inside the story sits below Storybook's
preview decorators and does not establish initial effect replay. Step 5 verifies
that separately with a temporary strict render root. Production-built Playwright
runs do not exercise StrictMode replay.

Cover the currently working cases from the test matrix below: expanded links,
collapsible opening, controlled/uncontrolled drilldown, focus/scroll restoration,
icon-mode stack reopening, and working expanded Drawer integration. Do not
require the broken collapsed disclosure case to pass in this baseline, or encode
dropped callbacks, false navigation, or stale content as expected behavior.

**Verify:** `npm run build-storybook` followed by
`npx playwright test tests/components/nav-list.spec.ts` → baseline cases pass.

### 3. Repair the presentation contracts in place

1. Preserve accepted trigger `onClick` and `aria-label` in both collapsed paths.
   Pass one focused trigger-prop contract to the private popup adapters. Have Row
   render `<Popover.Trigger disabled={disabled} />` through its existing
   `useRender` boundary so Base UI owns the final button and its refs, handlers,
   `id`, `aria-haspopup`, `aria-expanded`, `aria-controls`, and popup state
   attributes. Do not use `<Popover.Trigger render={<Row />} />`: Row's closed
   prop contract would discard Base UI's injected render props. Keep the public
   trigger contract compact instead of adding unrestricted native props.
   For enabled activation in `createRowClickHandler`, call the consumer's
   `onClick` before disclosure/navigation. If it called ordinary
   `event.preventDefault()`, also call `event.preventBaseUIHandler?.()` before
   returning. Disabled activation uses the same cancellation bridge without
   invoking the consumer callback. Base UI 1.8's merged handler checks that cancellation
   method, so returning from Row alone does not prevent popup activation.
   Preserve the existing distinction between disclosure and navigation.
2. Give panel registration a lifetime tied to the mounted panel, using a stable
   registration dependency and matching cleanup. Replacing/removing a panel must
   remove its old content. An old cleanup must not erase a newer registration.
   Keep this private and preserve StrictMode replay and presentation switching;
   do not introduce a registry framework or new public content prop.
3. Keep both collapsed disclosures out of root `onNavigate`: opening their
   child popup is disclosure; activating an actual child link is navigation.
   Preserve Base UI activation, disabled behavior, and caller cancellation.
   Prove the Drawer stays open on disclosure and closes on actual navigation.
4. Add these missing-contract cases alongside the passing baseline cases.

**Verify:** `npm run verify:quick`, `npm run build-storybook`, then the focused
NavList spec → exit 0; explicit labels, handlers, cancellation, and current panel
contents work in both presentations; collapsed disclosure does not announce
navigation or close the Drawer.

### 4. Extract coherent private owners

Move row resolution/event composition/presentation together into the row module;
collapsible registration and disclosure together into its owner; drilldown value,
history, focus, and local popup navigation together into its owner. Put only
genuinely cross-owner context declarations/types into the context module; keep
collapsible/drilldown feature contexts beside their owners. Move NavList's
StyleX declarations into its family style module and import them directly.

Keep the entry responsible for public assembly and root/section composition.
Re-export all existing public types and functions from their existing entry path.
Private modules must not import the public entry or `@/components`, which would
create a cycle. Share only the small popup trigger rendering boundary actually
used by the two existing presentations. Do not turn each public part into a file.

Preserve current panel identity checks, controlled callbacks/reasons, disabled
behavior, focus targets, and scroll restoration. Do not add memoization solely to
silence advisory findings; issue #18's DOM scroll assignment warning is not itself
a behavior defect.

**Verify:** `npm run verify:quick`, `npm run build-storybook`, then the focused
NavList spec → exit 0 with the same behavior matrix. `git diff --check` → exit 0.

### 5. Verify integration and close the handoff

Inspect Collapsible, Drilldown, InDrawer, and CollapsedChildPopovers in live
Storybook after optimization. Exercise keyboard activation, Escape/closing,
explicit accessible names, focus restoration, and expanded/icon presentations.
Capture console/page errors and record visual observations as review evidence.

For initial effect replay, temporarily set
`framework.options.strictMode: true` in `.storybook/main.ts`. Storybook's React
renderer must place that StrictMode wrapper outside its ErrorBoundary, Story,
and preview decorators; confirm this in the installed renderer before claiming
replay. In the lifecycle scenario, temporarily add a mount-only `useEffect` that
records `setup`, returns a cleanup recording `cleanup`, and changes no UI/state.
Start or restart development Storybook with the temporary configuration. On a
fresh lifecycle-story mount, require the sentinel sequence
`setup → cleanup → setup`, then exercise mount, replace, remove, and presentation
switching and confirm only current links remain reachable. Run the focused
NavList cases against this live server with the existing shared diagnostics:
`PLAYWRIGHT_SKIP_WEBSERVER=1 PLAYWRIGHT_STORYBOOK_PORT=6206 npx playwright test tests/components/nav-list.spec.ts`.
Use the selected live port if 6206 is occupied. Keep the sentinel transcript and
browser outcomes as disposable review evidence, not a permanent mechanism test.

Stop the development server and restore only the temporary configuration and
sentinel edits. Compare their diff with the pre-check state; `.storybook/main.ts`
must be unchanged and the story must contain no sentinel. Run the full gate once
against that final source. Check app navigation at `/` and `/experiments` through
the existing app tests included in the full gate.

**Verify:** `npm run verify:full` → exit 0; `git diff --check` → exit 0. Review
`git diff --name-only` and `git status --short` against Scope, including new files.
Run `npm run doctor` and review new attributable diagnostics against the baseline;
fix demonstrated issues without imposing a score threshold or expanding scope.
Update the linked issue/status with evidence; retire this plan only under the
repository's completion lifecycle after completion is accepted.

## Test plan

Use existing stories and the shared Playwright fixture. Assert outcomes, not
implementation calls or exact frame timing:

- Expanded links preserve native link semantics, `aria-current`, disabled behavior,
  and caller cancellation before `onNavigate`.
- Both collapsible and drilldown triggers, in expanded and icon modes, retain the
  caller's accessible name and click callback. Prevented/disabled activation does
  not open or navigate; ordinary activation still uses Base UI behavior. For both
  icon-mode paths, assert `aria-haspopup="dialog"`, the open/closed
  `aria-expanded` state, and `aria-controls` matching the open popup's
  `id`. Escape closes the popup and restores trigger focus.
- Replacing panel content updates the popup; removing the panel removes its links.
  Presentation changes do not leave stale content. Check development-only
  initial effect replay at the strict Storybook render root as described in step
  5; a nested story wrapper or the production-built suite is not replay evidence.
- Controlled drilldown emits the requested value/direction once and waits for the
  supplied value; uncontrolled drilldown updates itself. Forward/back restores the
  intended focus target and previously observed scroll position. Use a bounded
  scrollable story and compare before/after positions with rounding tolerance,
  not hardcoded page geometry.
- Icon-mode local navigation resets to its target when reopened without changing
  the outer controlled drilldown value.
- InDrawer stays open when either collapsed disclosure opens a popup, then
  closes when an actual child link is chosen. Expanded disclosure and cancelled
  navigation also leave it open.

No screenshots, SVG assertions, render-count tests, generic context tests, or
assertions that lock private module structure into the permanent suite.

## Done criteria

- [ ] Focused NavList browser cases pass using `tests/playwright.ts` diagnostics.
- [ ] `npm run verify:full` and `git diff --check` exit 0.
- [ ] Existing public namespace, named exports, types, and story IDs are preserved.
- [ ] Expanded and collapsed triggers share the accepted callback/name contract;
      removed panel content is absent from reachable navigation; neither collapsed
      disclosure calls `onNavigate`, while actual child navigation still does.
- [ ] Private modules import each other acyclically and never import the public
      entry/barrel; review their imports with `rg -n '^import|^export' src/components/nav-list`.
- [ ] `git diff --name-only` plus `git status --short` contains only scoped files.
- [ ] Live strict-root Storybook evidence includes the disposable sentinel's
      setup/cleanup/setup transcript and passing public lifecycle cases;
      temporary config/sentinel edits are absent from the final diff.
- [ ] Advisory Doctor comparison and issue/index status are recorded.

## STOP conditions

Stop and report if public APIs have drifted, an out-of-scope primitive must change,
multiple simultaneous panels require a new public precedence policy, or a callback
cannot be preserved through Base UI without changing existing semantics. Stop if
Plan 008 changed the toolchain, another task is editing NavList/Sidebar integration,
or a scoped verification still fails after a reasonable correction and rerun.
Do not convert a DOM scroll assignment into a new abstraction just for Doctor.

## Maintenance notes

New presentation modes must consume the same trigger contract and explicitly own
content registration. Keep navigation history/focus separate from routing and
page-shell policy. Subsequent Sidebar #20/#21 work must preserve the provider
contract. Run independently from Plan 008; refresh command assumptions if that
migration lands first. The audit's tooltip-group defect is a separate issue:
do not repair Tooltip here or assert tooltip payload behavior as a prerequisite
for otherwise unrelated NavList cases.
