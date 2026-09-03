# Repository guidance

## Architecture

- Before changing component/block responsibility or compound ownership, read [ADR 0004](docs/adr/0004-component-block-and-compound-ownership.md).
- Give each block a native Storybook Docs page with its standard metadata, previews, controls, a concise parts table, and an adjacent import `Source`. Place stories under `Blocks/`. Put agent- or LLM-specific blocks under `Blocks/AI/` per [ADR 0013](docs/adr/0013-storybook-ai-block-taxonomy.md); keep general blocks as direct `Blocks/` children.
- Treat `src/components/index.ts` as the public component source of truth. Gallery specimens must use public exports; keep imports and specimen titles alphabetical.

## APIs and interface design

- Keep public contracts compact and relatively closed. Use repository terms such as `headingLevel`, not synonyms such as `titleLevel`.
- Controls own direct-icon sizing and alignment. If StyleX cannot express the relationship, use a narrow component marker/direct-child CSS rule; do not clone icons or add styling-only icon parts.
- Never set `cursor: pointer` on native-button controls. Reserve it for navigation.
- Avoid all-caps or accent-colored decorative eyebrows. Supporting metadata is sentence case, regular weight, smallest semantic type, and muted neutral.

## Storybook

- Make `Playground` the first exported story for every core component. Give it a curated set of controls for representative public props; omit styling and layout escape hatches.
- Whenever a new variant or major component-specific prop is added, make sure to update the `Playground` story to include it in the controls.
- For blocks, default to one long, neutral, clearly labeled `Examples` story that shows meaningful options, states, and use cases together. Add a `Playground` only when controls demonstrate dynamic behavior that static examples cannot communicate.
- Consolidate fragmented block use cases when they remain easy to scan. Separate examples with semantic labels and a shared Base UI Separator when useful, and disable controls when the story does not consume args.
- Use readable, sentence-case component names in Storybook navigation (for example, `Input group`, not `InputGroup`).
- Map every icon or slot prop on the component or principal compound part documented by a Playground to a generic-icon select. Include `None` when the prop is optional. Keep secondary-story icons fixed.
- Prefix story-only args and controls with `_` so they cannot be mistaken for public component props; keep actual prop names unchanged.
- If a component allows passing props objects to children (ie. `positionerProps`), expose this in Storybook via a nested control object labelled as such. Only expose nested props that are relevant to the story; use judgement as to which are not necessary for demonstrating a component's capabilities.
- Group props in a comparison story only when seeing them together makes another property easier to verify (for example, icons across Button sizes reveal optical sizing). Do not combine unrelated axes merely to reduce story count.
- Consolidate genuinely related props and states instead of creating one story per value. Keep important states immediately inspectable.
- Keep all practical supported form states together in one `States` story; for a block’s consolidated `Examples` story, put them in one clearly labeled states section. Split states only when a genuine technical constraint prevents a useful comparison.
- Prefer concrete story names such as `Sizes`, `Variants`, `Options`, `Examples`, and `States`. Use `Composition` only for genuine component composition or customization with other elements.
- Disable controls on fixed comparison and use-case stories that do not consume their args.
- Keep stories functional: no decorative wells, tinted panels, or specimen cards. Use realistic content for use cases and explicit state or variant labels for comparisons. Standardize explanatory labels as sentence case, regular weight, smallest semantic type, and muted neutral; use a shared Base UI Separator when it improves scanning.

## Styles

- Before authoring or reviewing StyleX, read the vendored official [StyleX authoring guide](.agents/resources/stylex-authoring.md), [ADR 0003](docs/adr/0003-stylex-ownership-and-application.md), [ADR 0011](docs/adr/0011-layout-primitives-common-margins-and-stylex-overrides.md), and `src/styles/README.md`; repository-specific ownership and interop decisions remain authoritative.
- Tokens are stable API: never remove them or replace usages with literals unless explicitly asked. Themeable values live in `tokens.stylex.ts`; fixed globals in `constants.stylex.ts`.
- Use the ADR's explicit `stylex.props(...)` boundary for native JSX; do not add global JSX augmentation, transform shims, or line suppressions for lowercase intrinsic `sx`.
- Before changing style-prop surfaces or the `style`/`xstyle` split, read [ADR 0011](docs/adr/0011-layout-primitives-common-margins-and-stylex-overrides.md). `Box`, `Stack`, and `Grid` are the broad token-aware layout gateway. Add scalar `MarginProps` only to eligible normal-flow roots, resolve them once with `extractMarginProps`, and keep positioned/controller surfaces and internal compound parts outside that contract. `style` is native inline style; StyleX Atoms and created styles share `xstyle`, merged last inside `stylex.props(...)`.

## Components and accessibility

- Before changing asynchronous compound-action ownership or settlement behavior, read [ADR 0005](docs/adr/0005-root-owned-async-confirmation-settlement.md).
- Before adding or changing a document-level component shortcut, read [ADR 0006](docs/adr/0006-global-keyboard-shortcut-arbitration.md). Use one private dispatcher per component family; ignore repeated and already-prevented events, and preserve each root's existing state path.
- Before deriving an unbounded decorative collection from a public numeric domain, read [ADR 0007](docs/adr/0007-bound-derived-presentation-without-changing-semantics.md). Bound work before iteration without changing the underlying control's values or keyboard semantics.
- Before resetting identity-bound transient state in an effect, read [ADR 0008](docs/adr/0008-reset-identity-bound-state-before-first-render.md). If the first committed render must be clean, key the private state owner by every semantic identity input; exclude callback identity and preserve cleanup.
- Before reconciling a controlled value with a changing option domain, read [ADR 0009](docs/adr/0009-normalize-effective-values-without-unsolicited-callbacks.md). Derive one pure effective value for every display, selection, reset, storage, and user-callback path; do not emit changes solely because props became invalid.
- Menu checkbox/radio items own their indicators; consumers provide only row content. `Menu.SwitchItem` remains a `menuitemcheckbox`.
- Preserve full state when limiting visible UI (for example, Combobox chips). Use `N selected` when none are visible and `+N more` when some are visible.
- Verify semantics, accessible names, keyboard/disclosure behavior, overlays, hit testing, and responsive dimensions—not only source intent.

## Documentation ownership

- Keep `README.md` as project orientation and an index into authoritative references; do not maintain a duplicate component inventory there.
- Keep `CONTEXT.md` as the concise repository glossary.
- Keep this file limited to executable agent rules. Record durable architectural choices and rationale in the next numbered file under `docs/adr/`, then link it from the README and the relevant rule here.
- Update an existing ADR when clarifying the same decision. Add a new ADR only for a distinct decision or when superseding an earlier one; never silently rewrite historical status or rationale. When an ADR is superseded, set its status line to point at the successor and move the file to `docs/adr/archive/`, updating inbound links; numbering is never reused.
- Keep `docs/plans/` as the active implementation backlog; do not create a root-level `plans/` directory. Plan numbers are monotonic and never reused, including after a plan file is retired. After a plan is DONE or REJECTED, distill any durable outcome into an ADR, glossary, or implementation guide, copy the final plan to the ignored `.scratch/plans/completed/` directory for optional local reference, remove the tracked plan file, and move its compact final-status row to the public retired-plan ledger in `docs/plans/README.md`. Never force-add the scratch archive; Git history is the durable shared archive, and execution transcripts do not belong in the public tree.
- Record grievances, tooling friction, and workaround needs in `.agents/PAPERCUTS.md` (committed) as you encounter them: one dated bullet per papercut with file/tool context and the workaround taken. Do not silently absorb repeated friction.

## Validation

- Before adding or expanding permanent test coverage, read [ADR 0012](docs/adr/0012-test-durable-behavior-not-incidental-fixes.md). A bug fix, tool finding, refactor, or review comment does not automatically require a new test; protect durable user-facing behavior, public contracts, and explicitly documented mechanics with evidence proportional to risk.
- Inspect the intended checkout before editing; files may be untracked and local copies may diverge.
- Use `npm run verify:quick` for the standard TypeScript, blocking lint, advisory complexity and React Compiler diagnostics, and formatting gate. Run `npm run verify:full` when app and Storybook builds plus browser and bundle tests are required.
- Run `npm run doctor` as an advisory React-specific audit after substantial React work. Vet every diagnostic against source, ADRs, and browser evidence before changing code or logging an issue; do not treat the score or severity as proof. Preserve the `only-export-components` waiver in `doctor.config.jsonc`: StyleX and the repository's compound namespace API require colocated non-component exports.
- During parallel work, only the primary or explicitly designated validator runs `verify:full`; other workers run focused checks and report their evidence.
- If another checkout owns Playwright's default ports, leave its server running and set `PLAYWRIGHT_STORYBOOK_PORT` or `PLAYWRIGHT_APP_PORT` on the designated validation command. Do not reuse another checkout's preview server.
- Playwright discovers the full `tests/` tree. For interaction changes, run the focused browser spec with console-error capture after building Storybook.
- Keep blocking tests focused on durable contracts: native semantics, accessible names and relationships, keyboard and focus behavior, state, callbacks, forms, routing, and explicitly documented component mechanics. Do not gate on showcase copy, exact colors or spacing, incidental geometry, SVG internals, or the current CSS implementation.
- Do not add a dedicated story or fixture solely to expose private ref synchronization, memoization, render counts, effect ordering, or another one-off bug mechanism. Prefer existing realistic surfaces and assert whether the component works; keep review-time diagnostics and visual checks out of the permanent suite unless they represent a durable contract.
- Target evolving stories and prototypes through stable fixture hooks, then assert roles, ARIA state, relationships, and behavior. Use exact text only when the wording itself is the contract. Assert computed style or geometry only when that visual mechanism is an explicit contract; keep the assertion to the smallest relevant boundary, such as an indicator's thickness and anchored edge.
- Treat Storybook and manual visual review as the design-change feedback loop. Do not turn screenshots or paint details into blocking regression tests for in-progress components.
- For StyleX selector, popup, responsive, or interaction changes, also verify live Storybook after optimization finishes. A production build does not prove dev-transform behavior.
- If Storybook reports a transient missing story or `Invalid empty selector`, reload/restart and reacquire browser references before changing valid code.
- Report unrelated failures instead of modifying concurrent work.

## Agent skills

### Issue tracker

Issues and PRDs are tracked in GitHub Issues; external pull requests are not a triage surface. See `docs/agents/issue-tracker.md`.

For `ready-for-agent` and `ready-for-human` issues, the label identifies the execution path, the GitHub assignee identifies who has claimed the work, and a linked plan marked IN PROGRESS records active execution. Keep the ready label while work is underway, and offer only unassigned ready issues for pickup.

### Triage labels

Use the canonical `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, and `wontfix` labels. See `docs/agents/triage-labels.md`.

### Planning

When producing an implementation-plan artifact, prefer the Improve skill's self-contained handoff structure over alternative formats. Treat the GitHub issue as the durable work record and the plan as its temporary execution specification; substantial active plans should normally link to one issue, but never publish an issue without explicit authorization. Keep active plans in `docs/plans/` and follow this file's documentation-lifecycle rules. See `docs/agents/planning.md`.

### Domain docs

This is a single-context repository with a root `CONTEXT.md` and `docs/adr/`. See `docs/agents/domain.md`.
