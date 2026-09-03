# Implementation planning

When work calls for a written implementation plan, use the Improve skill's plan structure by default unless the user explicitly requests another format. This preference applies to the plan artifact, even when a skill other than Improve produces it; it does not make every small task require a formal plan or transfer Improve's read-only advisor role to other workflows.

## Plan quality bar

Write each plan for a capable executor with no prior conversation or audit context. A plan should include:

- Executor instructions and a drift check against the commit at which the plan was written.
- Status metadata: priority, effort, risk, dependencies, category, and planned-at commit and date.
- The reason the work matters and enough current-state evidence to verify that the plan still matches the repository.
- Exact repository commands with expected successful results.
- Explicit in-scope and out-of-scope boundaries.
- Ordered implementation steps, each with its own verification command and expected result.
- A concrete test plan modeled on existing repository tests.
- Machine-checkable done criteria.
- Project-specific STOP conditions that prevent improvisation when assumptions fail or scope expands.
- Maintenance notes for reviewers and future changes.

Inline the relevant paths, symbols, short current-state excerpts, repository conventions, glossary terms, and ADR constraints. Do not depend on the executor having read another plan or the session that produced this one.

## Backlog index

Use `docs/plans/README.md` as the active index. Keep plan numbering monotonic and record execution order, dependencies, and current status. Record considered-and-rejected findings only while they remain useful to the active backlog.

## Relationship to GitHub issues

The issue and plan serve different lifetimes:

- The GitHub issue is the durable shared record of what is wanted, why it matters, its priority and ownership, discussion, and final resolution.
- The plan is the temporary executable specification for how to implement and prove the work against the current codebase.
- ADRs and `CONTEXT.md` own durable architectural decisions and domain vocabulary discovered during planning or implementation.

Not every issue requires a plan, but every substantial active plan should normally link to one issue in its `Issue` status field. The issue should link back to the active plan. Prefer one issue per independently executable plan; use an umbrella issue plus child issues and plans for larger initiatives.

GitHub labels are the source of truth for queue state, while `docs/plans/README.md` is the source of truth for active execution order, dependencies, and plan status. Keep the two consistent during implementation and closure. Draft, sensitive, or intentionally local plans may remain issue-less, and no skill may publish an issue without explicit user authorization.

When implementation begins, retain the issue's `ready-for-agent` or `ready-for-human` label, assign the issue to the accountable GitHub user, and mark the plan IN PROGRESS. The label records the execution path; the assignee and plan status record that the work is claimed. When offering ready work for pickup, filter out assigned issues.

## Repository lifecycle override

The repository's documentation lifecycle in `AGENTS.md` remains authoritative over Improve's default index history: keep only active plans in `docs/plans/`.

After a plan is done or rejected:

1. Update and close the linked issue with the implementing commit or pull request, verification results, or rejection rationale.
2. Distill any durable result into an ADR, glossary entry, or implementation guide.
3. Copy the final plan to `.scratch/plans/completed/` when a locally readable reference would be useful.
4. Remove the tracked plan and its status history from the active backlog.

The entire `.scratch/` tree is ignored and must never be force-added. Its completed-plan copies are disposable local conveniences, not a second documentation source of truth. Git history remains the durable shared archive.
