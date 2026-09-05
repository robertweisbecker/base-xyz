# ADR 0013: Storybook AI block taxonomy

- Status: Accepted
- Date: 2026-09-03

## Context

`src/blocks/` holds every opinionated composition, whether or not the workflow is
agent-specific. Putting all of those stories as siblings under `Blocks/` mixed
prompting, streaming, and model-selection surfaces with general utilities such as
copy, password reveal, and page chrome.

The Storybook sidebar is the browsable inventory. Contributors need a stable
rule for where a new block's stories belong, without treating that grouping as a
new source tree, public API, or ownership layer.

## Decision

- Storybook titles for agent- or LLM-specific blocks use the `Blocks/AI/` prefix
  so they collapse under one `AI` group. General blocks remain direct children of
  `Blocks/`.
- Classify by the block's primary documented workflow, not by file location or
  export name. An AI block's main job is composing an agent interface: prompting,
  model choice, generated-content streaming, tool or action approval,
  context-window inspection, or background agent task progress.
- Leave a block at `Blocks/` when the workflow is product-agnostic: copy to
  clipboard, password reveal, page chrome, generic confirmation, or generic
  multi-step workflow progress.
- This taxonomy is Storybook navigation only. Block implementations stay in
  `src/blocks/`, public exports stay on the existing namespaces, and
  [ADR 0004](./0004-component-block-and-compound-ownership.md) remains the
  ownership boundary between primitives and blocks.
- Display names stay sentence case. `AsyncJobProgress` stories use the title
  `Task progress`; the public compound export is unchanged.

Current AI membership: Agent action approval, Context popover, Goal toolbar,
Model selector, Prompt composer, Streaming response, and Task progress.

Current general membership: Confirmation dialog, Copy button, Page header,
Password field, and Workflow progress.

## Consequences

New agent compositions land under `Blocks/AI/` without another inventory
reorganization. `Workflow progress` stays a general block because it tracks a
caller-defined multi-step procedure; `Task progress` is the AI-group surface for
queued, running, completed, and failed background work.

A later move of files into an `src/blocks/ai/` subtree, or a public rename of
`AsyncJobProgress`, is a separate decision and must not be inferred from this
Storybook grouping.
