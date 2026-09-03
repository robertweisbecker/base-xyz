# ADR 0002: Explicit semantic table primitives

- Status: Accepted
- Date: 2026-08-12

## Context

DataTable owned reusable semantic table markup and appearance alongside TanStack state, filtering, sorting, selection, expansion, and actions. Consumers also need the same table structure and visual treatment without adopting the stateful DataTable API. A single cell component with a type prop or parent-inferred tag would make invalid header/data-cell combinations easier to write and would weaken native prop typing.

## Decision

Introduce a public, presentation-only `Table` compound component and make DataTable compose it. `Table.Root` is an outer assembly div so controls and metadata may be composed around the table; the optional `Table.Container` composes the shared `ScrollArea` in horizontal mode to add the scrollable frame and gives its focusable viewport the generic accessible name “Scrollable table,” while `Table.Content` is the semantic `<table>` and may be rendered directly inside Root or inside Container. Header, Body, and Footer map directly to `<thead>`, `<tbody>`, and `<tfoot>`. One contextual Row always renders `<tr>`. Header/data/action/checkbox cells remain explicit parts with fixed `<th>` or `<td>` output, while private context validates their section and row placement in development. Checkbox cells compose the existing design-system Checkbox, and `Table.Content` owns optional rich caption rendering so the caption is always the table's first child.

DataTable remains the single controller for coordinated dataset behavior: it owns sorting, filtering, visibility, selection, expansion, the TanStack table instance, controlled callbacks, and cross-feature decisions. Pure responsibilities are split behind private module boundaries for the model and feature registry, internal column construction and row actions, wired toolbar controls, semantic header/body/content rendering, and shared styles. These are implementation boundaries, not public parts: they are not exported through either public barrel, no public controller or table-instance prop is introduced, and no React context exists solely to hide their communication.

The only public DataTable composition seam is `renderToolbar`. It receives already-wired opaque `search`, `columnVisibility`, and `endSlot` nodes plus readonly filter entries keyed by stable `columnId`. Consumers may reorder or supplement those controls without receiving TanStack state or setters. Omitting the callback preserves the default toolbar DOM and layout. Pagination remains outside this capability until a real consumer requires it.

## Consequences

Manual tables and DataTable share one visual and semantic source of truth without coupling Table to TanStack. The namespace is larger than a type-prop API, but call sites expose native semantics and prop types directly. Row-header cells, expanded-row presentation, public toolbar/metadata parts, and a compound DataTable API remain outside v1 and can be added only when real consumers require them. The narrow `renderToolbar` callback supports composition without pre-allocating those public parts.
