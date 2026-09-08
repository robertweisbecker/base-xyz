# ADR 0001: Token-backed theme props and layout primitives

- Status: Superseded by [ADR 0010](./0010-static-style-prop-maps-tiered-surfaces-and-xstyle.md)
- Date: 2026-08-01

## Context

Small composition changes required one-off styles, variants, or extra wrappers.
Open CSS props would weaken the token contract, so the library needed a shared,
token-aware layout vocabulary.

## Historical decision

`Box`, `Stack`, and `Grid` exposed broad layout props, while semantic components
assembled narrower capability groups. Scalar numeric dimensions resolved to
spacing tokens, logical inline names preserved directionality, and responsive
values stayed together in predeclared StyleX sets. At this stage, `style` carried
StyleX overrides.

A generic runtime engine under `src/theme` composed capabilities, extracted
props, and dispatched to separate StyleX compilers. This centralized token
resolution and DOM filtering, but added indirection and coupled each capability's
types, runtime keys, and compiler.

## Supersession

ADR 0010 replaced the engine with static maps and restored native `style` beside
`xstyle`. [ADR 0011](../0011-layout-primitives-common-margins-and-stylex-overrides.md)
subsequently replaced the component tiers with broad layout primitives and
common margins on eligible roots. Use ADR 0011 for the current contract.
