# ADR 0007: Bound derived presentation without changing semantics

- Status: Accepted
- Date: 2026-08-13

## Context

A finite public value domain can still imply an impractically large number of decorative nodes. Slider markers previously rendered once per requested step, so a valid small step could allocate hundreds of thousands of React elements and block the interface even though the underlying control itself supported the value range.

The visual density is an implementation concern. Solving it by changing the Slider step, value, keyboard increment, or public marker contract would make presentation policy alter control semantics.

## Decision

- Repeated presentation derived from a numeric domain must have a private, deterministic upper bound when callers can request arbitrarily dense values.
- Validate the complete numeric domain before calculating or iterating. Non-finite inputs, invalid ranges, and non-positive intervals produce no derived presentation.
- Compute a safe coarsened interval before the render loop. Do not allocate the full requested sequence and filter it afterward.
- Coarsening preserves the caller's requested sequence by rounding the safe interval up to a multiple of the requested interval.
- The bound applies only to decorative output. Slider min, max, step, values, thumbs, accessibility semantics, and keyboard increments remain unchanged.
- Keep the cap private unless consumers establish a real need to configure it. Browser coverage should prove both the dense bound and an unchanged ordinary case.

## Consequences

Slider renders at most 200 marker nodes while retaining its full value domain and one-step keyboard behavior. Ordinary ranges retain their existing marker positions and counts, and invalid domains cannot enter an oversized or infinite loop.

Other components that derive large decorative collections should use the same separation: bound work at the presentation boundary and preserve the semantic data or interaction model underneath it.
