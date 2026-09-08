# Storybook conventions

## Core components and controls

- Export `Playground` first. Curate representative public props; update new variants and major component props. Omit styling/layout escape hatches.
- Give every icon/slot prop on the component or principal compound part documented by Playground a generic-icon select, including `None` when optional. Keep secondary-story icons fixed.
- Prefix story-only args/controls with `_`; preserve public prop names.
- Expose useful child props, such as `positionerProps`, in labeled nested control objects.
- Disable controls on fixed comparison/use-case stories that do not consume args.

## Blocks

- Use `Blocks/` navigation and native Storybook Docs: standard metadata, previews, controls, a concise parts table, and adjacent import `Source`.
- Default to one neutral, labeled `Examples` story with meaningful options, states, and use cases. Add `Playground` only when dynamic controls communicate more than static examples.

## Story organization and presentation

- Use sentence-case navigation names: `Input group`, not `InputGroup`.
- Prefer `Sizes`, `Variants`, `Options`, `Examples`, and `States`; reserve `Composition` for composition/customization with other elements.
- Consolidate related cases and comparison axes, such as icons across Button sizes. Separate unrelated axes; keep important states immediately inspectable.
- Group all practical supported form states in one `States` story or labeled block `Examples` section. Split only for technical constraints preventing useful comparison.
- Use realistic content and explicit semantic comparison labels; avoid decorative wells, tinted panels, and specimen cards. Labels follow [repository typography](../../AGENTS.md#public-apis-and-design). Use the shared Base UI Separator where it improves scanning.

See [validation](validation.md) for browser evidence and [ADR 0012](../adr/0012-test-durable-behavior-not-incidental-fixes.md) for permanent test coverage.
