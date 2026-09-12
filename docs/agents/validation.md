# Validation

Prove the requested outcome and contracts at risk. `package.json` owns commands. Local verification and in-scope fixes need no separate approval. A plan's checks, baselines, sequence, and STOP conditions override these defaults.

## Choose the scope

| Change                                                                        | Verification                                                                                                                                                                     |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Prose only                                                                    | `npx prettier --check <changed-markdown-files>`; check relative links, commands, and consistency. No app/browser suite unless executable examples or runtime behavior changed.   |
| Code                                                                          | `npm run verify:quick` plus affected behavior checks.                                                                                                                            |
| Component interaction                                                         | Build Storybook, then `npx playwright test tests/components/<family>.spec.ts`, using shared console/page-error capture.                                                          |
| StyleX selector, popup, responsive, or interaction behavior                   | Also inspect live Storybook after dependency optimization: relevant semantics, accessible names, keyboard/disclosure behavior, overlays, hit testing, and responsive dimensions. |
| App/Storybook integration, tooling, dependencies, or shared styling contracts | `npm run verify:full`; it includes `verify:quick`.                                                                                                                               |
| Substantial React work                                                        | Also run advisory `npm run doctor`.                                                                                                                                              |

`verify:quick` checks TypeScript, blocking Oxlint rules, advisory complexity/React Compiler diagnostics, and formatting. `verify:full` adds StyleX dev cold-start checks, app/Storybook builds and browser tests, and the style-prop bundle boundary. See `package.json` for focused commands.

Reuse passing checks for unchanged code; repeat or broaden only for changes, failures, or unresolved concerns. Rebuild changed Storybook source before rerunning browser tests.

## Browser prerequisite

After `npm install`, if Playwright's matching Chromium browser is absent, run `npx playwright install chromium` before browser checks or `npm run verify:full`. On Linux systems missing browser dependencies, use `npx playwright install --with-deps chromium` instead.

This is standard [Playwright browser setup](https://playwright.dev/docs/browsers), separate from each verification run. A Playwright upgrade may require installing its matching Chromium revision again.

## Test contracts

Follow [ADR 0012](../adr/0012-test-durable-behavior-not-incidental-fixes.md): protect native semantics, accessible names/relationships, keyboard/focus, state, callbacks, forms, routing, and documented mechanics. A bug fix or tool finding alone does not justify a new test.

Experimental UI defaults to Storybook and focused local verification; establish permanent component coverage at promotion. Retain or add small tests for substantial standalone logic when useful; experimental status neither mandates nor disqualifies them.

Use stable fixture hooks, then assert public roles, ARIA state, relationships, and behavior. Assert exact text, computed style, or geometry only when contractual, at the smallest relevant boundary. Exclude showcase copy, incidental paint/geometry, SVG internals, private ref/effect/render mechanisms, and one-off bug fixtures. Keep visual review in Storybook and reported evidence, not screenshot gates.

## Tooling and concurrent work

- Vet Doctor findings against source, ADRs, and browser evidence before fixes or issue publication; scores/severity are investigation leads. Preserve `doctor.config.jsonc`'s `only-export-components` waiver for StyleX/compound namespace colocation.
- Parallelize independent source work; serialize dependency/browser installs, builds, Playwright, live browser QA, and `verify:full` across agents. The primary agent schedules these heavyweight jobs; others run focused checks when released.
- Reuse an installation when its lockfile is unchanged. Stop task-owned servers, browsers, and watchers after validation; preserve others' sessions. If contention causes a load timeout, drain heavyweight work and rerun unchanged rather than adding retries or raising timeouts.
- Storybook Playwright discovers `tests/` except `tests/app/`; app Playwright owns that subtree. Ports default to `6106`/`6107`, respectively. If occupied by another checkout, set `PLAYWRIGHT_STORYBOOK_PORT`/`PLAYWRIGHT_APP_PORT`; leave its server running and test this checkout's build.
- For transient missing stories or `Invalid empty selector`, reload/restart the affected dev server and reacquire browser references before changing valid code.
- Fix in-scope failures; preserve concurrent work. Report unrelated failures and blockers with the failing command, evidence, and missing dependency or decision.
