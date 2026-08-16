# Repository guidance

## Architecture

- Before changing component/block responsibility or compound ownership, read [ADR 0004](docs/adr/0004-component-block-and-compound-ownership.md).
- Give each block a native Storybook Docs page with its standard metadata, previews, controls, a concise parts table, and an adjacent import `Source`. Place stories under `Blocks/`.
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

- Before changing cross-component styles, read [ADR 0003](docs/adr/0003-stylex-ownership-and-application.md) and `src/styles/README.md`.
- Tokens are stable API: never remove them or replace usages with literals unless explicitly asked. Themeable values live in `tokens.stylex.ts`; fixed globals in `constants.stylex.ts`.
- Use the ADR's explicit `stylex.props(...)` boundary for native JSX; do not add global JSX augmentation, transform shims, or line suppressions for lowercase intrinsic `sx`.

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
- Update an existing ADR when clarifying the same decision. Add a new ADR only for a distinct decision or when superseding an earlier one; never silently rewrite historical status or rationale.
- Keep `plans/` as an active backlog only. After a plan is DONE or REJECTED, distill any durable outcome into an ADR, glossary, or implementation guide, then remove the inactive plan and its status history. Git history is the archive; do not keep execution transcripts in the public tree.

## Validation

- Inspect the intended checkout before editing; files may be untracked and local copies may diverge.
- Run TypeScript, lint, the app build, and Storybook build independently. This repo has no `typecheck` script.
- Playwright discovers the full `tests/` tree. For interaction changes, run the focused browser spec with console-error capture after building Storybook.
- For StyleX selector, popup, responsive, or interaction changes, also verify live Storybook after optimization finishes. A production build does not prove dev-transform behavior.
- If Storybook reports a transient missing story or `Invalid empty selector`, reload/restart and reacquire browser references before changing valid code.
- Report unrelated failures instead of modifying concurrent work.
