# ADR 0001: Token-backed theme props and layout primitives

- Status: Accepted
- Date: 2026-08-01

## Context

Small composition changes were requiring one-off StyleX styles or component variants. Completely open CSS props would weaken the token contract, while wrappers for every margin, gap, alignment, or width adjustment would add unnecessary markup.

## Decision

Use a hybrid layer:

- `Box`, `Stack`, and `Grid` provide broad composition APIs. They alone expose shared semantic `color` and `bg` props.
- Semantic components assemble a smaller theme-prop contract appropriate to their public rendered root.
- Theme props are scalar on every component. Responsive layouts use complete, predeclared StyleX style sets, fluid CSS, or a named recipe/variant. No runtime atoms package is introduced.
- Numeric dimensions always resolve to spacing tokens. Logical inline names (`ms`, `me`, `ps`, `pe`, `insetStart`, `insetEnd`) are the only inline-direction API.
- Component defaults and variants compose first, then broad theme shorthands, axes, edges, and finally caller `style`.
- Theme props are extracted before DOM props are spread. Field-wrapper props never route to an inner control.
- Public value and capability contracts plus StyleX-independent resolution live under `src/theme`. Explicit spacing/text, layout, and surface StyleX compilers remain under `src/styles` and are imported directly.
- Each capability has one exact runtime key tuple. Components explicitly assemble local contracts from capabilities, and TypeScript verifies those contracts against the composed runtime definition.
- Flex composition declares its component-owned default axis. Stack-like roots use vertical; horizontal roots such as Card Footer use horizontal.

## Consequences

The API provides utility-like flexibility while retaining token and TypeScript constraints. Arbitrary dimensions still accept CSS strings where composition genuinely needs them; spacing, gaps, radii, shadows, and semantic colors remain closed. Other libraries commonly call this pattern system props or style props; this repository uses **theme props** to emphasize token-backed values without conflating them with the unrestricted `style` escape hatch.

Reusable value and capability contracts live in `src/theme/theme-props.types.ts`. Closed value unions derive from token keys where possible, so adding a spacing, container, radius, shadow, or color token updates its matching type automatically.

The StyleX-independent resolver lives in `src/theme/theme-props.ts`. It filters known unsupported props from DOM output, records active keys in the extraction pass, and invokes only matching compiler leaves. Composition rejects duplicate keys immediately. Each component family owns its public interface and private immutable definition from granular capabilities such as `FlexProps` and `SurfaceThemeProps`; component contracts are not inferred from an unrestricted shared aggregate.

Compiled bindings are split by responsibility and bundle boundary: spacing/text, layout, and surface. Scalar dynamic declarations remain explicit and statically analyzable rather than being generated at runtime.

Arbitrary breakpoint objects are deliberately excluded from the theme-prop API. Responsive property values stay together in a predeclared StyleX style and enter through the final `style` prop. Repeated sets can become named recipes or component variants. This follows StyleX's guidance against responsive variant objects and user-selected per-breakpoint layouts: https://github.com/facebook/stylex/discussions/1084 and https://github.com/facebook/stylex/discussions/549#discussioncomment-9180291.

`Stack reverse` affects visual order only. DOM, reading, focus, and keyboard order do not change, so it must not be used to repair semantic ordering.
