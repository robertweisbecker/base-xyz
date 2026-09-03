# Domain docs

This is a single-context repository. Engineering skills should use the root domain glossary and architectural decisions when exploring the codebase.

## Before exploring, read these

- **`CONTEXT.md`** at the repository root for the project’s domain vocabulary.
- Relevant decisions under **`docs/adr/`** for the area being changed.

If either source does not exist, proceed silently. Do not suggest creating it upfront. Domain-modeling skills create documentation lazily when terminology or architectural decisions are resolved.

## File structure

```text
/
├── CONTEXT.md
├── docs/adr/
└── src/
```

Topical areas such as theming, components, and blocks remain sections of the shared context rather than independent bounded contexts.

## Use the glossary’s vocabulary

When output names a domain concept—in an issue title, refactoring proposal, hypothesis, or test name—use the term defined in `CONTEXT.md`. Do not drift to synonyms the glossary explicitly avoids.

If a required concept is absent, reconsider whether the proposed language fits the project. If the gap is genuine, note it for domain modeling.

## Flag ADR conflicts

If proposed work contradicts an existing ADR, surface the conflict explicitly instead of silently overriding the decision.
