# Repository guidance

## Architecture

- `src/components/` holds reusable primitives; keep APIs product-agnostic.
- `src/blocks/` holds repeatable, opinionated workflows composed from components. Add missing reusable behavior to components first.
- Prefer a state-owning `Root` with semantic parts (`Header`, `Content`, `Footer`, `Actions`). Put behavior on its owner and pass caller content through children or existing component props.
- Give each block a native Storybook Docs page with its standard metadata, previews, controls, a concise parts table, and an adjacent import `Source`. Place stories under `Blocks/`.
- Treat `src/components/index.ts` as the public component source of truth. Gallery specimens must use public exports; keep imports and specimen titles alphabetical.

## APIs and interface design

- Keep public contracts compact and relatively closed. Use repository terms such as `headingLevel`, not synonyms such as `titleLevel`.
- Controls own direct-icon sizing and alignment. If StyleX cannot express the relationship, use a narrow component marker/direct-child CSS rule; do not clone icons or add styling-only icon parts.
- Never set `cursor: pointer` on native-button controls. Reserve it for navigation.
- Avoid all-caps or accent-colored decorative eyebrows. Supporting metadata is sentence case, regular weight, smallest semantic type, and muted neutral.
- Make `Playground` the first exported story for every core component. Give it a curated set of controls for representative public props; omit styling and layout escape hatches.
- For blocks, default to one long, neutral, clearly labeled `Examples` story that shows meaningful options, states, and use cases together. Add a `Playground` only when controls demonstrate dynamic behavior that static examples cannot communicate.
- Consolidate fragmented block use cases when they remain easy to scan. Separate examples with semantic labels and a shared Base UI Separator when useful, and disable controls when the story does not consume args.
- Use readable, sentence-case component names in Storybook navigation (for example, `Input group`, not `InputGroup`).
- Map every icon or slot prop on the component or principal compound part documented by a Playground to a generic-icon select. Include `None` when the prop is optional. Keep secondary-story icons fixed.
- Prefix story-only args and controls with `_` so they cannot be mistaken for public component props; keep actual prop names unchanged.
- Group props in a comparison story only when seeing them together makes another property easier to verify (for example, icons across Button sizes reveal optical sizing). Do not combine unrelated axes merely to reduce story count.
- Consolidate genuinely related props and states instead of creating one story per value. Keep important states immediately inspectable.
- Keep all practical supported form states together in one `States` story; for a block’s consolidated `Examples` story, put them in one clearly labeled states section. Split states only when a genuine technical constraint prevents a useful comparison.
- Prefer concrete story names such as `Sizes`, `Variants`, `Options`, `Examples`, and `States`. Use `Composition` only for genuine component composition.
- Disable controls on fixed comparison and use-case stories that do not consume their args.
- Keep stories functional: no decorative wells, tinted panels, or specimen cards. Use realistic content for use cases and explicit state or variant labels for comparisons. Standardize explanatory labels as sentence case, regular weight, smallest semantic type, and muted neutral; use a shared Base UI Separator when it improves scanning.

## Styles

- Read `src/styles/README.md` before changing cross-component styles.
- Tokens are stable API: never remove them or replace usages with literals unless explicitly asked. Themeable values live in `tokens.stylex.ts`; fixed globals in `constants.stylex.ts`.
- Canonical component styles live with their owner; multi-consumer ownerless behavior may live in `src/styles/recipes/`. Keep one-consumer styles local.
- Menu owns selectable rows used by Menu, Select, and Combobox. Field owns text-input and trigger sizing. Popover owns anchored behavior; Dialog owns modal behavior; Text owns typography. Popup chrome stays component-local.
- Import `.stylex.ts` bindings directly; do not barrel-re-export or namespace-import them.
- Apply caller `style` last in `stylex.props(...)`. Spread the full result when the recipient accepts `className` and `style`; extract `.className` only for string-only adapters or manual merges.
- Use StyleX composition for precedence. Do not use class order or `tailwind-merge` to resolve StyleX conflicts.
- Prefer parent-local custom properties plus direct-child `[data-*]` selectors for interaction state. Otherwise use a component `defineMarker()` with `stylex.when.ancestor()`; never use `defaultMarker()` for form controls.
- Ordinary popup composites render children directly. Use a component `Viewport` only for intentional current/previous payload swapping; keep that motion scoped to `.ds-popup-viewport`.

## Components and accessibility

- Menu checkbox/radio items own their indicators; consumers provide only row content. `Menu.SwitchItem` remains a `menuitemcheckbox`.
- Preserve full state when limiting visible UI (for example, Combobox chips). Use `N selected` when none are visible and `+N more` when some are visible.
- Verify semantics, accessible names, keyboard/disclosure behavior, overlays, hit testing, and responsive dimensions—not only source intent.

## Validation

- Inspect the intended checkout before editing; files may be untracked and local copies may diverge.
- Run TypeScript, lint, the app build, and Storybook build independently. This repo has no `typecheck` script.
- For StyleX selector, popup, responsive, or interaction changes, also verify live Storybook after optimization finishes. A production build does not prove dev-transform behavior.
- If Storybook reports a transient missing story or `Invalid empty selector`, reload/restart and reacquire browser references before changing valid code.
- Report unrelated failures instead of modifying concurrent work.
