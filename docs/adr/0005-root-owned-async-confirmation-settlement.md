# ADR 0005: Root-owned asynchronous confirmation settlement

- Status: Accepted
- Date: 2026-08-13

## Context

A confirmation control previously closed its dialog and announced success as soon as its click was not synchronously prevented. Consumers could start asynchronous publish, archive, or save work, but a later rejection arrived after the dialog had closed and after success had already been announced.

Async settlement also coordinates every Confirm part under one dialog, imperative closing, duplicate suppression, loading presentation, failure feedback, and unmount safety. Owning those concerns in each button would create competing operations and inconsistent state.

## Decision

- `ConfirmationDialog.Root` owns the canonical `onConfirm` operation and the shared pending state. Confirm parts request that operation through private compound context.
- A Confirm part remains a normal Button while work is pending. It invokes its public click handler first and does nothing when that handler prevents the event.
- Root closes through Base UI's dialog actions ref only after `onConfirm` resolves. A caller-supplied actions ref remains the same ref used by Root.
- Root announces success only after resolution. Rejection keeps the dialog open, restores its controls, optionally announces configurable failure feedback, and reports the error through `onConfirmError` without rethrowing the rejected operation from the event path.
- A synchronous ref guard prevents duplicate operations before React renders pending state. Every Confirm part beneath the Root reflects the same pending operation.
- Promise settlement after unmount must not update state, add feedback, or close a stale dialog. Mounted-state effects must remain correct under React StrictMode effect replay.
- Playwright discovers focused browser regressions throughout `tests/`. Async interaction fixtures use controlled clocks and capture browser console errors.

## Consequences

Consumers provide one operation at Root rather than coordinating closing and feedback inside click handlers. Existing dialogs without `onConfirm` retain immediate successful confirmation, while asynchronous consumers gain deterministic success and retryable failure behavior.

The block owns a small amount of operation lifecycle state and an imperative Base UI ref. Browser regressions must cover the pending intermediate state, resolution, rejection, duplicate input, prevented input, and StrictMode behavior; build-only checks do not prove this contract.
