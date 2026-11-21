# Emoji picker experiment

An inline picker built with ui-sdk, with a curated emoji set searchable by name,
keyword, or emoji. It uses the existing Field and ghost Button styles, focus recipes, and theme tokens.

- Search is the first Tab stop. Arrow Down enters the first matching grid cell.
  Its position and width stay fixed as results change. The ui-sdk clear control
  uses FYIcons and returns focus to search.
- The named grid contains rows and named gridcells, with one roving Tab stop.
- Left/Right move within a row; Up/Down move by row. At an edge focus stays put;
  Down into a short final row reaches its final cell. Horizontal arrows follow RTL.
- Home/End reach the row edges; Control/Command + Home/End reach the grid edges.
- Focus does not select. Enter, Space, or a click selects and announces the emoji
  name politely, including when the same emoji is selected again. The chosen cell
  retains the shared pressed-button appearance until another emoji is selected.
- Escape in the grid returns to search. Escape in search clears a nonempty query.
  No results displays “No emoji found” and leaves focus in search. Filtering away a focused cell recovers focus
  to search. Tab leaves the grid normally; there is no focus trap or popup.

## Agent workflows

The Storybook stories import `../ui-sdk/agent`. It exports one `agent` bridge and
`agentTools` schemas, and registers WebMCP's `snapshot`, `query`, and `act` tools
when the browser supports them. Vite hot replacement removes old registrations.
The bridge also works without WebMCP; it does not require a remote service.

Use `agent.snapshot()` to discover **Emoji picker** and **Search emoji**. Search
through the input's `setValue` action, then use `agent.query({ within: "Emoji
picker" })` to discover matching choices and call the picker's `choose` action.
Selection callbacks retain ui-sdk change details, including `source: "agent"`.
WebMCP allows these local search/selection actions; confirmation-marked actions
remain blocked by the bridge's default policy.
