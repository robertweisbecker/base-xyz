# Triage labels

Skill roles use these exact GitHub labels:

| Role/label        | Meaning                         |
| ----------------- | ------------------------------- |
| `needs-triage`    | Needs maintainer evaluation     |
| `needs-info`      | Waiting on reporter information |
| `ready-for-agent` | Agent execution path            |
| `ready-for-human` | Human execution path            |
| `wontfix`         | Will not be actioned            |

## Component scope labels

Optional `component: <family>` labels supplement category and state. Every triaged issue still needs exactly one category label and one state label.

- Use lowercase repository families, such as `component: navlist` or `component: table`. Create labels as issues enter the backlog, not for every export in advance.
- Choose the narrowest coherent family: `table` covers Table/DataTable; `field` covers Form, Fieldset, Field, and Label.
- Apply multiple labels only when each family materially changes, such as a shared Checkbox/Radio refactor.
- Leave cross-cutting, tooling, and multi-owner issues without component labels; avoid catch-all labels.

## Claiming ready work

Ready labels persist after assignment. Only open, unassigned issues are available for pickup. Follow [issue claiming guidance](issue-tracker.md#claiming-ready-work) for assignment and linked plan status.
