# ADR 0010: Static style-prop maps, tiered component surfaces, and the xstyle escape hatch

- Status: Superseded by [ADR 0011](../0011-layout-primitives-common-margins-and-stylex-overrides.md)
- Date: 2026-08-20
- Supersedes: [ADR 0001](./0001-token-backed-theme-props.md)
- Amends: [ADR 0003](../0003-stylex-ownership-and-application.md) (`style` / `xstyle`)

## Context

ADR 0001's generic runtime engine added indirection to token-backed styling and
used `style` for StyleX objects. Closed values could instead share static atomic
classes, and native inline styles needed an unambiguous public channel.

## Historical decision

Static StyleX maps and plain resolvers replaced the engine. Closed prop types
derived from maps; dynamic styles handled open values. Component tiers assigned
broad layout props to primitives, external layout or placement to semantic
controls, and narrower spacing and sizing to opinionated compositions.

Native `style` returned as the final inline override. `xstyle` carried StyleX
composition after component styles; `className` had no deterministic StyleX
precedence. Typography used a shared group while semantic type styles retained
their own scale. Universal component/slot markers were proposed.

The execution amendment added shared placement/external-layout bundles and a
global `omitStyleProps` filter. These reduced repeated plumbing but spread layout
policy across semantic components and a repository-wide registry.

## Supersession

ADR 0011 retained native `style`, `xstyle`, and the broad layout primitives. It
replaced tiers and shared layout bundles with common margins on eligible
normal-flow roots, rejected universal markers and filtering, and made spacing
types explicit with a bounded dynamic margin resolver. Use ADR 0011 for current
ownership, eligibility, and precedence.
