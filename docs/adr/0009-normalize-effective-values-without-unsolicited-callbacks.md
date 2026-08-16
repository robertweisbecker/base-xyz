# ADR 0009: Normalize effective values without unsolicited callbacks

- Status: Accepted
- Date: 2026-08-14

## Context

A controlled or retained value can become invalid when its current option domain changes. ModelSelector previously applied a fallback only to the trigger's displayed model while retaining the stale model id in its radio selection, reset path, stored uncontrolled value, and later callbacks. The interface could therefore show one model, select none, and emit a different invalid value after the next user action.

Synchronizing the invalid prop into state or invoking `onValueChange` during render or an effect would introduce a second source of truth and manufacture a change event that the user did not initiate.

## Decision

- Components with a changing option domain derive one normalized effective value during render and use it consistently for display, selection, defaults, stored uncontrolled state, reset behavior, and later user-initiated updates.
- Normalization is pure and side-effect-free. An invalid controlled value, invalid uncontrolled default, or option removal does not itself call the change callback or write replacement state.
- Every user update route normalizes its complete next value before storing or emitting it. A callback after domain drift therefore contains the visible fallback plus the user's actual change reason.
- Fallback order follows the flattened current option groups, including options after empty groups. The existing explicit error for an entirely empty domain remains unchanged.
- Valid values retain their original object identity. Normalization creates a replacement object only when the domain requires a fallback.
- Disabled options remain part of the domain unless a component establishes a separate explicit policy that says otherwise.

## Consequences

ModelSelector now has one effective model across its trigger, radio group, reset path, uncontrolled state, and callbacks. Initial invalid values and dynamic option removal are silent, while the next user action emits exactly one complete normalized value with the existing reason vocabulary.

Consumers that need notification merely because an external option domain changed must own that synchronization outside the controlled component. Future components with similar domain drift should centralize pure normalization rather than layering display-only fallbacks or effect-driven correction callbacks.
