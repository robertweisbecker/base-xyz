# Issue tracker: GitHub

Issues and PRDs live in GitHub; use `gh`, which infers the repository from Git remotes. Local implementation and documentation requests need no issue. External PRs are not a request or triage surface; exclude them from issue queues.

## Commands

| Operation | Command                                                                                           |
| --------- | ------------------------------------------------------------------------------------------------- |
| Create    | `gh issue create --title "..." --body-file <body-file>`                                           |
| Read      | `gh issue view <number> --comments`; also fetch labels                                            |
| List      | `gh issue list --state open --json number,title,body,labels,comments`; adjust state/label filters |
| Comment   | `gh issue comment <number> --body-file <body-file>`                                               |
| Labels    | `gh issue edit <number> --add-label "..."` or `--remove-label "..."`                              |
| Close     | `gh issue close <number> --comment "..."`                                                         |

For multiline bodies, write exact text to a temporary file and use `--body-file`.

## Issues and plans

Issues own durable motivation, outcome, priority, discussion, ownership, and resolution. Plans own temporary evidence, scope, ordered steps, tests, commands, and STOP conditions. Labels track queue state; `docs/plans/README.md` tracks execution order, dependencies, and plan status.

- Small, well-specified fixes need no plan. Substantial active plans normally link one issue in their status metadata, with a reciprocal issue link. Draft, sensitive, or intentionally local plans may remain issue-less.
- Prefer one issue per independently executable plan; larger initiatives use umbrella issues with independent child issues/plans.
- On completion, close the issue with the implementing commit/PR and verification results. Preserve durable decisions in ADRs or `CONTEXT.md`; retire the plan under [planning guidance](planning.md).
- On rejection, apply `wontfix`, record rationale, close the issue, and retire the plan.

## Claiming ready work

Offer only open, unassigned `ready-for-agent` or `ready-for-human` issues. To claim work, retain its ready label, assign the accountable GitHub user, and mark any linked plan IN PROGRESS. Assignment records ownership; the label records execution path. Reporter-blocked work takes `needs-info` and a BLOCKED plan status with a reason.

## Publication authorization

Issue creation/publication requires explicit user authorization; plans and skill instructions alone do not grant it. Without authorization, prepare a concrete local draft. Do not ask again when already authorized.
