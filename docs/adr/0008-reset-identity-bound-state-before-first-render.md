# ADR 0008: Reset identity-bound state before first render

- Status: Accepted
- Date: 2026-08-13

## Context

Some private presentation state is meaningful only for one logical input identity. StreamingResponse previously reset its reveal count and completion guard in an effect when text or `streamKey` changed. React therefore committed one render of the replacement with the previous stream's state before the reset ran. A completed long response replaced by a shorter one could flash fully revealed text and report completion before the new stream had actually progressed.

An effect is appropriate for synchronizing with an external system after a commit. It cannot guarantee that the first committed render for a new identity is free of state from the previous identity.

## Decision

- When transient private state must be clean on the first render of a new logical identity, place that state in a keyed child owner and derive the key from every input that defines the identity.
- Use a collision-safe scalar representation when multiple values form the identity. StreamingResponse serializes the tuple of `streamKey` and streamable text.
- Consume identity inputs at the keyed ownership boundary. Do not also retain an effect that resets the same state after render.
- Exclude callback identity and other non-semantic render churn from the key. Keep current callbacks in refs when their latest behavior is needed without restarting the state machine.
- Preserve cleanup inside the keyed owner so unmounting an old identity cancels its timers or other pending work.
- Do not force arbitrary non-streamable children into an identity model merely to share the implementation; preserve their direct-render path.

## Consequences

StreamingResponse replacements and explicit retries now begin with their first chunk on the first committed render, and each identity reports completion exactly once after its final chunk. Callback changes alone do not restart streaming, while old timeouts are cleaned up when an identity is replaced.

This remount pattern intentionally resets all private state owned by the keyed child. Components should use it only when that state is wholly scoped to the logical identity; state that must survive identity changes belongs above the keyed boundary.
