# Stepper pagination controls

## Status

- **Priority**: P3
- **Effort**: S
- **Risk**: MED
- **Depends on**: a second real Stepper consumer
- **Category**: follow-up
- **Status**: TODO — deferred until a second real consumer

## Why this is deferred

Stepper v1 is a presentational Base UI Tabs composition. Consumers can place
ordinary Buttons inside a panel or below `Stepper.Content` and update the
controlled Stepper value themselves. That keeps product validation, locking,
pending behavior, and focus policy at the workflow boundary. Existing
`completeOnVisit` optionally presents visited steps as complete; it does not
validate a workflow or authorize progression. Retain that public behavior;
[#39](https://github.com/robertweisbecker/base-xyz/issues/39) owns its documentation
clarification, not a removal of the prop.

Do not add `Stepper.Previous` or `Stepper.Next` merely to shorten one call site.
Start this work only when at least two consumers demonstrate the same reusable
behavior.

## Questions to resolve from real usage

- Whether controls belong inside individual panels, in a shared row after
  Content, or both.
- Whether targets should be explicit values or inferred adjacent steps.
- Whether a locked adjacent step disables progression or allows a consumer to
  supply another target.
- How controlled rejection, validation, pending state, and cancellation are
  represented without recreating Base UI's state model.
- Whether any focus transfer beyond normal Tabs/Button behavior is actually
  required and supported by user-testing evidence.

## Guardrails

- Keep workflow validation, authoritative task completion, persistence, and
  async policy with consumers. Preserve optional visit-based presentation in
  `completeOnVisit`; do not interpret it as successful workflow validation.
- Do not introduce a step registry solely to infer adjacency.
- Do not synthesize Base UI event-detail objects.
- Do not move focus to a panel unless a demonstrated accessibility requirement
  establishes that behavior.
- Prefer ordinary Button composition until a shared primitive is clearly
  smaller than consumer-owned code.
