# Issue tracker: GitHub

Issues and PRDs for this repository live as GitHub issues. Use the `gh` CLI for all operations.

## Conventions

- **Create an issue:** `gh issue create --title "..." --body "..."`
- **Read an issue:** `gh issue view <number> --comments`, also fetching its labels.
- **List issues:** `gh issue list --state open --json number,title,body,labels,comments` with appropriate `--label` and `--state` filters.
- **Comment on an issue:** `gh issue comment <number> --body "..."`
- **Apply or remove labels:** `gh issue edit <number> --add-label "..."` or `--remove-label "..."`
- **Close an issue:** `gh issue close <number> --comment "..."`

Infer the repository from `git remote -v`; `gh` does this automatically when run inside the clone.

## Pull requests as a triage surface

External pull requests are not a request or triage surface. Skills should not include pull requests when building the issue-triage queue.

## Relationship to implementation plans

The GitHub issue is the durable shared work record. It owns the motivation, requested outcome, priority, discussion, ownership, and final resolution. An implementation plan under `docs/plans/` is a temporary execution specification that owns current-state evidence, exact scope, ordered steps, tests, verification commands, and STOP conditions.

- Not every issue needs a plan. Small, well-specified fixes may be implemented directly from the issue.
- Every substantial active plan should normally link to one issue in its status metadata, and the issue should link back to the active plan.
- Prefer one issue per independently executable plan. Represent a larger initiative with an umbrella issue and independently executable child issues and plans.
- GitHub labels own queue state. `docs/plans/README.md` owns active execution order, dependencies, and plan status.
- When implementation starts, keep `ready-for-agent` or `ready-for-human`, assign the issue to the accountable GitHub user, and mark the linked plan IN PROGRESS. The ready label identifies the execution path; the assignee and plan status show that the work is claimed.
- When listing work available for pickup, include only open, unassigned `ready-for-agent` or `ready-for-human` issues. Do not offer assigned work to another executor.
- When work is blocked on the reporter, apply `needs-info` and mark the active plan BLOCKED with a concise reason.
- On completion, close the issue with the implementing commit or pull request and verification results. Distill durable architectural outcomes into an ADR or `CONTEXT.md`, then retire the plan according to `docs/agents/planning.md`.
- On rejection, apply `wontfix`, record the rationale on the issue, close it, and retire the plan.

Draft, sensitive, or intentionally local plans may remain issue-less. Creating or publishing a GitHub issue always requires explicit user authorization; a planning skill must not infer that authorization from the existence of a plan.

## When a skill says “publish to the issue tracker”

Create a GitHub issue.

## When a skill says “fetch the relevant ticket”

Run `gh issue view <number> --comments`.
