# ADR 0006: Global keyboard shortcut arbitration

- Status: Accepted
- Date: 2026-08-13

## Context

Several instances of the same compound component can be mounted at once while sharing a document-level keyboard shortcut. Giving every instance its own listener makes one key event trigger multiple roots, lets listener re-registration accidentally change priority, and ignores controls that have already claimed the event.

The shortcut is global, but the state transition still belongs to an individual component root. Arbitration therefore needs one document boundary without becoming public API or introducing shared component state.

## Decision

- A component family with a global shortcut owns one module-private document listener and an insertion-ordered registry of mounted roots.
- Every root registers exactly once for its mounted lifetime. Changes to eligibility, current state, or callbacks do not re-register the root or alter mount-order priority.
- Registration callbacks use React Effect Events to read the latest committed eligibility and state. Do not mutate React state containers or write refs during render to keep a registration fresh.
- The most recently mounted eligible root owns the shortcut. Unmounting it returns ownership to the preceding eligible root.
- The dispatcher ignores repeated and already-prevented events. It calls `preventDefault` only when an eligible owner exists and invokes exactly that owner.
- The selected root performs the transition through its existing controlled or uncontrolled state path. The dispatcher does not own open state or add public priority, registry, or keybinding props.
- Setup and cleanup must tolerate React StrictMode effect replay without leaking registrations or document listeners.

## Consequences

Multiple CommandPalette roots now have deterministic Command/Ctrl+K ownership while retaining the existing public API and callback behavior. Focused controls can reserve the shortcut, held keys do not toggle twice, ownership hands back naturally after unmount, and eligibility or callback changes remain fresh without mutable render-owned registrations.

Any future component family that adds a document-level shortcut should establish one arbitration boundary for that family and prove multi-root ownership, callback freshness, repeat handling, prevented events, and cleanup in a real browser.
