# ADR 0011: Layout primitives, common margins, and StyleX overrides

- Status: Accepted
- Date: 2026-08-22
- Clarified: 2026-09-07 (margin-resolution scope; retired migration detail removed)
- Supersedes: [ADR 0010](./archive/0010-static-style-prop-maps-tiered-surfaces-and-xstyle.md)

## Context

[ADR 0010](./archive/0010-static-style-prop-maps-tiered-surfaces-and-xstyle.md)
replaced a generic runtime styling engine with static StyleX maps, restored
native `style`, and introduced `xstyle`. Those decisions simplified the
implementation, but its component tiers, shared placement/external-layout
bundles, and global DOM-prop filter left many semantic components acting as
partial layout primitives.

The design system needs a smaller ownership boundary:

- callers need a broad, token-aware layout vocabulary when they explicitly use
  a layout primitive;
- a parent composition commonly needs to set a normal-flow child's margin
  without introducing a wrapper;
- semantic components should continue to own their padding, dimensions, visual
  treatment, and behavior through component props and variants;
- portalled, anchored, and collision-managed surfaces already have a positioning
  owner and should not acquire a second geometry API; and
- one-off StyleX composition should accept both StyleX Atoms and styles authored
  with `stylex.create` without creating competing escape hatches.

## Decision

### Layout ownership

1. **Layout primitives are the broad gateway.** `Box`, `Stack`, and `Grid` keep
   the token-aware display, margin, padding, gap, sizing, position, child-layout,
   surface, and typography groups appropriate to each primitive.
2. **Common margins depend on normal-flow ownership.** A semantic component or
   compound root receives `MarginProps` only when it renders, or delegates to,
   one stable public HTML root that normally participates in caller-owned
   document flow.
3. **Positioned and non-node roots do not receive margins by default.** A
   controller root that renders no layout node, portal, backdrop, viewport,
   positioner, popup, toast region, or anchored/collision-managed surface stays
   outside the common margin contract. Base UI offset, alignment, collision,
   and equivalent component props own that geometry.
4. **Compound roots do not confer margins on their parts.** An eligible public
   root may receive margins; its internal parts do not inherit that surface.
   A part can be reconsidered only when it gains an independently useful
   normal-flow composition contract.
5. **Field margins belong to the wrapper.** `TextField`, `Textarea`,
   `NumberField`, `Select.Root`, and `Combobox.Root` apply common margins to the
   field wrapper, not to an inner input, button, or control.
6. **Internal spacing stays semantic.** Padding, gaps, control dimensions, and
   optical alignment inside composed components remain owned by base styles and
   variants. For example, `Card` padding remains controlled by its `size`
   variant; only `Card.Root` is an external-layout boundary.
7. **Alignment and justification are component-specific future additions.** A
   row/bar-like component such as `Toolbar.Root` may later expose a focused
   alignment prop when repeated use cases justify it. This decision adds no
   shared alignment bundle.
8. **Position and inset remain deferred.** Absolutely positioned Badges and
   similar compositions use `xstyle`. They do not justify a generic
   `placement` prop before repeated cases establish a semantic contract.
9. **ScrollArea styling stops at its root.** `ScrollArea` exposes common
   margins plus root `style`, `className`, and `xstyle`; its viewport, content,
   and scrollbar remain component-owned implementation parts. Consumers style
   content through their own child or wrapper instead of part-style props.
10. **Universal DOM markers are not a component contract.** ADR 0010's proposed
    repository-wide `data-component` / `data-slot` scheme is not carried
    forward. Existing component-specific `data-*` attributes remain only when
    they own behavior or a deliberate selector relationship.

### Margin contract and implementation seam

Common margins use the scalar logical props `m`, `mx`, `my`, `mt`, `mb`, `ms`,
and `me`. Edge precedence is `side ?? axis ?? all`. There is no responsive
margin object; consumers express responsive behavior as a predeclared StyleX
style passed through `xstyle`.

The public `SpaceStep` and `SpaceValue` types live in
[`spacing.stylex.ts`](../../src/styles/props/spacing.stylex.ts).

The numeric type remains explicit rather than being generated from token
objects or string-negation utility types. The token defaults use one private
build-time `SPACE_UNIT_REM = 0.25` constant to calculate the existing values.
Every existing named `--space-*` variable remains independently themeable;
this does not introduce a runtime `--space-unit` contract. All spacing props use
the same `SpaceValue` type. The library resolves the value consistently and
leaves property-specific validity to CSS; an invalid declaration is ignored by
the browser rather than rejected by a separate TypeScript policy.

`SpaceValue` is shared by margin, padding, gap, and inset props. One
hand-maintained lookup maps numeric spacing values to stable themeable
aliases. Negative values use subtraction such as
`calc(0rem - var(--space-4))`; CSS strings pass through unchanged. Small private
dynamic StyleX declarations own the relevant logical edges. This bounds the
root's margin contribution to at most four generated inline custom-property
values and avoids large repeated property maps or a generic dynamic-prop engine.

One internal `extractMarginProps<T extends MarginProps>(props)` adapter both:

- removes the seven custom props from the DOM-bound remainder; and
- returns the four resolved logical-edge styles in precedence order.

An eligible root resolves margins once, either locally or by forwarding raw
margin props to its owning component, as DataTable does to Table.Root. The
adapter and resolvers are internal module exports, not public barrel API. There
is no global style-prop denylist, HOC, component registry, or generic prop
engine. `Box`, `Stack`, and `Grid` retain a private broad-layout resolver and
private DOM stripping because that complexity belongs to their module.

### Override channels and precedence

Eligible components use this order:

```text
component base / variant / state
  < named margin props
  < xstyle
  < native inline style
```

`xstyle?: StyleXStyles` is the only StyleX override prop. It accepts styles
created by `stylex.create`, StyleX Atoms, arrays, and conditional/ternary
entries because all of them compose through the same `stylex.props(...)`
boundary. There is no Atom-only prop or Atom-specific component contract.

Stories use Atoms for compact one-off consumer adjustments. Component
implementations apply fixed component-authored StyleX to nested recipients by
spreading the complete `stylex.props(...)` result so generated inline values are
not discarded. A nested `xstyle` assignment remains appropriate when the
implementation is explicitly forwarding or merging a caller's public `xstyle`.

Native `style?: CSSProperties` remains the final open inline escape hatch.
`className` remains available for CSS and third-party interoperability, but it
is not documented as a deterministic last-wins layer relative to StyleX atomic
classes.

## Consequences

- A parent can apply ordinary external spacing directly to an eligible child
  without a styling-only wrapper, while semantic components stop behaving like
  partial Boxes.
- Positioning-owned surfaces have one geometry contract instead of conflicting
  margins and offsets.
- Internal layout remains visible in component variants; one-off stateful,
  responsive, or absolute-positioning adjustments remain possible through
  `xstyle`.
- The single extraction adapter earns its existence by keeping precedence and
  DOM stripping identical across many explicit component integrations. It does
  not decide which components are eligible.
- The numeric types and value lookup must be kept in sync manually. That small,
  direct duplication is preferred to generated type machinery and is locked by
  type and behavior tests.
- Dynamic spacing trades a bounded number of runtime custom properties for much
  smaller static maps and simpler types. Browser tests must cover logical
  edges, negative values, CSS strings, responsive `xstyle`, and native-style
  precedence.

## Alternatives rejected

- Keep the tiered `PlacementProps` / `ExternalLayoutProps` bundles and global
  `omitStyleProps`: too much layout policy leaks into semantic components and a
  repository-wide filter.
- Give every component margins: portals, positioned surfaces, controller roots,
  and internal compound parts do not share the same layout ownership.
- Use only `xstyle` for margins: possible, but unnecessarily verbose for the
  most common parent-owned spacing operation.
- Add a generic placement or positioning API: the current use cases do not
  establish one semantic vocabulary across normal flow, absolute positioning,
  and Base UI anchored geometry.
- Generate the finite spacing type or edge declarations: it hides a small
  public vocabulary behind more TypeScript and runtime machinery than it saves.
- Replace named spacing variables with one runtime unit and CSS typed
  multiplication: it would remove independently themeable aliases.

## References

- [Radix Themes layout and margin props](https://www.radix-ui.com/themes/docs/overview/layout#margin-props)
- [StyleX Atoms](https://stylexjs.com/docs/api/javascript/atoms)
- [StyleX dynamic styles](https://stylexjs.com/docs/learn/styling-ui/defining-styles/#dynamic-styles)
- [Base UI Popover positioning](https://base-ui.com/react/components/popover)
