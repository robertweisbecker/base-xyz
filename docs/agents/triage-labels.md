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

## Claiming ready work

Keep the ready label after implementation starts. Assign the issue to the accountable GitHub user and, when a linked plan exists, mark that plan IN PROGRESS. The label records whether the work is suitable for an agent or requires a human; assignment records who has claimed it.

Queries that offer ready work for pickup must include only open, unassigned issues. Assigned ready issues are already claimed and must not be offered to another executor.
