# Domain docs

Use [CONTEXT.md](../../CONTEXT.md) terms when naming concepts in issues, proposals, hypotheses, and tests; avoid its rejected synonyms. Reconsider missing terms before noting a domain-modeling gap. Theming, components, and blocks share one context.

Consult accepted ADRs when changing their contracts; surface conflicts explicitly. [AGENTS.md](../../AGENTS.md#load-guidance-when-it-applies) routes tasks; the [README](../../README.md#agent--architecture-decisions) indexes decisions. Discovery is contextual, not a mandatory preflight. If documentation is missing, use current code and evidence; document resolved terminology or decision gaps.

## Documentation ownership

- `README.md`: orientation and authoritative links, not duplicate inventories or implementation guides.
- `CONTEXT.md`: the shared, concise glossary.
- `AGENTS.md`: executable rules and task-specific links. Detailed conventions belong in `docs/agents/`; implementation maps belong beside source.
- `docs/adr/`: durable decisions and rationale. Clarify an existing decision in place; use the next number for a distinct decision or successor. Link new ADRs from the README and relevant agent guidance.
- Superseded ADRs: link the successor in their status, move to `docs/adr/archive/`, and update inbound links. Retain decision, rationale, and supersession; remove obsolete instructions. Never reuse numbers.
- `docs/plans/`: active backlog and prescriptive execution guidance. Follow [planning guidance](planning.md) for Improve-format handoffs, issue relationships, numbering, retirement, and ignored scratch archives.

## Maintaining agent guidance

Scope instructions to decisions; prefer task triggers and links over repetition or mandatory reading lists. Skill descriptions identify workflows; larger skills route to relevant references. Repository contracts override generic advice. Check historical scratch notes and archived decisions against current source and accepted ADRs before reuse.

Remove resolved papercuts, completed migration checklists, stale inventories, and expired scratch evidence. Link to source instead of copying details that drift. Plans retain their prescribed guidance and separate lifecycle.

Basis: [Eric Provencher's guidance audit](https://x.com/pvncher/status/2095991462416490862) and [OpenAI's initiative and instruction-following guidance](https://developers.openai.com/api/docs/guides/latest-model#gpt-6-astra-initiative-and-follow-through), reviewed 2026-09-07.
