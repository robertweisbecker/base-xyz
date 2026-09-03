# Triage labels

The engineering skills use five canonical triage roles. This file maps those roles to the label strings used in this repository’s issue tracker.

| Canonical role    | GitHub label      | Meaning                                  |
| ----------------- | ----------------- | ---------------------------------------- |
| `needs-triage`    | `needs-triage`    | Maintainer needs to evaluate the issue   |
| `needs-info`      | `needs-info`      | Waiting on the reporter for information  |
| `ready-for-agent` | `ready-for-agent` | Agent execution path; unassigned is open |
| `ready-for-human` | `ready-for-human` | Human execution path; unassigned is open |
| `wontfix`         | `wontfix`         | Will not be actioned                     |

When a skill refers to a triage role, use the corresponding GitHub label from this table.

## Component scope labels

Use optional `component: <family>` labels to make component-specific work easy
to find without changing its category or triage state. Component labels are an
orthogonal scope dimension; every triaged issue still carries exactly one
category label and one state label.

- Use lowercase repository family names, for example `component: navlist` and
  `component: table`.
- Create labels on demand when an issue enters the backlog. Do not pre-create a
  label for every exported component.
- Prefer the narrowest coherent family label. `component: table` covers both
  semantic Table and DataTable work; `component: field` covers the related
  Form, Fieldset, Field, and Label primitives.
- Apply multiple component labels only when the issue materially changes each
  named family, as with a shared Checkbox and Radio refactor.
- Leave cross-cutting, tooling, and multi-owner issues without a component
  label rather than inventing a vague catch-all label.

## Claiming ready work

Keep the ready label after implementation starts. Assign the issue to the accountable GitHub user and, when a linked plan exists, mark that plan IN PROGRESS. The label records whether the work is suitable for an agent or requires a human; assignment records who has claimed it.

Queries that offer ready work for pickup must include only open, unassigned issues. Assigned ready issues are already claimed and must not be offered to another executor.
