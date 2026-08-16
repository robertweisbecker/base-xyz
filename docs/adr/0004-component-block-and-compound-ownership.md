# ADR 0004: Component, block, and compound ownership

- Status: Accepted
- Date: 2026-08-13

## Context

The repository contains both reusable design-system primitives and recurring product workflows. Treating both as the same layer either makes components product-specific or leaves blocks as shallow wrappers with duplicated behavior. Large prop surfaces also make structured interfaces harder to compose and encourage multiple parts to own the same state transition.

## Decision

- `src/components/` contains reusable, product-agnostic primitives. Add missing behavior here first when more than one workflow needs it.
- `src/blocks/` contains repeatable, opinionated workflows composed from public components. Blocks may own workflow copy, ordering, and coordinated behavior that would be inappropriate in a primitive.
- Stateful compound APIs use one owning `Root` and semantic parts such as `Header`, `Content`, `Footer`, and `Actions`. The owner holds coordinated state and behavior; parts consume that contract instead of creating competing state machines.
- Caller content enters through children, semantic parts, or an existing focused prop. Public contracts stay compact and relatively closed rather than adding a prop or styling-only part for every variation.
- Preserve native semantics and Base UI's accessibility behavior at the rendered boundary. Presentation limits must not discard underlying state.
- `src/components/index.ts` is the public component source of truth. Gallery specimens consume public exports so the gallery exercises the supported API.
- Component and block stories document the public contract and functional states. Storybook, rather than the root README, is the current browsable inventory.

`Table` and `DataTable` are a concrete application of this boundary: presentation-only semantic table parts remain separate from stateful dataset behavior, as recorded in [ADR 0002](./0002-semantic-table-primitives.md).

`NavList` drilldown is another concrete application. Its public compound surface remains `NavList.Drilldown`, `NavList.DrilldownPanel`, `NavList.DrilldownTrigger`, and `NavList.DrilldownBack`, while its private history, focus, scroll-restoration, collection, presentation-mode, and icon-rail coordination may move into an internal owner-focused module such as `nav-list-drilldown.tsx`. It should not become a generic public Drilldown component until a second non-navigation consumer establishes a smaller shared contract.

## Consequences

Blocks can be opinionated without leaking product policy into primitives, while shared behavior has one reusable owner. Compound namespaces may contain more named parts than a prop-driven component, but call sites expose structure and state ownership directly.

Reviewers must resist both directions of drift: do not move one-workflow policy into `src/components/`, and do not duplicate reusable primitive behavior inside a block. A genuinely new ownership boundary should be recorded in an ADR rather than accumulated as rationale in `AGENTS.md`.
