# Plan 009: Investigate a relative-time helper

> This is an investigation, not an implementation plan. Do not add a public
> API, dependency, or Storybook inventory entry until a route is chosen and a
> follow-up plan (or a short implementation PR) records that choice.
> Drift check: `git diff --stat 87251bf..HEAD -- src/components src/hooks src/utils package.json CONTEXT.md docs/adr docs/plans/009-relative-time-helper.md`
> If a relative-time helper already landed, stop.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW (investigation) / MED (whatever ships afterward)
- **Depends on**: none
- **Category**: direction
- **Planned at**: commit `87251bf`, 2026-09-03
- **Issue**: none
- **Status**: TODO

## Why look at this

Several surfaces already fake relative time with frozen copy: gallery DataTable
cells (`"2m ago"`), Item stories (`"Last active 2 hours ago"`), Table stories,
and experiment pages. Those strings do not localize, do not update, and are not
tied to a machine-readable instant.

GitHub’s [`relative-time-element`](https://github.com/github/relative-time-element)
is the obvious external reference. It is not obvious that wrapping it is the
right fit here. This repository prefers compact public contracts, native
semantics at the rendered boundary (ADR 0004), and an explicit StyleX
application seam (ADR 0003). A custom element with Shadow DOM and an
inaccessible `title` fights some of that.

The job of this plan is to pick a public shape — wrapper, first-party
component, or hook — before anyone builds the real thing.

## What we need from a helper (working list)

Treat these as questions to confirm, not a locked spec:

- A caller can pass a `Date` or ISO string and get readable relative text
  (`5 minutes ago`, `in 3 hours`), with a sensible switch to an absolute date
  after some threshold.
- The displayed text can update while the page is open, or we explicitly
  decide that static text is enough.
- Assistive tech gets a real time semantic (`<time datetime="…">`) or a
  documented reason not to.
- Localization can follow `lang` / the browser, without shipping locale data.
- Typography stays inherited. This is not a badge, chip, or second type scale.
- The public contract stays small. GitHub’s full `Intl.DateTimeFormat` field
  surface (`weekday`, `hourCycle`, deprecated `micro` / `elapsed`, …) is
  probably more than we want.

Nice-to-have, not required to justify v1: duration countdowns, forced
past/future tense, IANA time zones, prefix strings like `"on"`.

## Current state

- No `RelativeTime`, no time util, no relative-time hook.
  `rg -n "relative-time|RelativeTime|formatDistance" src tests` is empty at
  `87251bf`.
- Public components live in `src/components/` and are exported from
  `src/components/index.ts`. Gallery specimens must use that export.
- Hooks today are private implementation (`useTextTruncation`,
  `useScrollFade`, `useTextareaAutoResize`). The math-expression hook is
  experimental and unpublished. A *public* hook would be a new kind of
  surface.
- Inline helpers to compare: `Code` and `Kbd` (visual chrome, native host,
  margins) vs `VisuallyHidden` (behavior helper, no margins). Relative time
  is closer to a behavior helper that happens to render text.

## Three routes

### 1. Wrapper around `@github/relative-time-element`

React helper that registers GitHub’s custom element and renders
`<relative-time>`. Upstream already does relative / datetime / duration
formats, thresholding, tense, auto-update, and light-DOM fallback children.
Formatted text lives in Shadow DOM (`part="root"`).

**Pros**

- Behavior is production-tested on GitHub.com. We do not maintain tick
  scheduling, `Intl.RelativeTimeFormat` rounding, or ISO duration parsing.
- Auto-update, threshold (`P30D` → `"on 31 Aug"`), tense, and duration exist
  already.
- Fallback `children` are a real no-JS story.
- Small dependency, no locale packs.

**Cons**

- The host is `<relative-time>`, not `<time>`. Native time semantics are not
  included; wrapping `<time>` around it doubles `datetime` and is not how
  GitHub uses it.
- Shadow DOM is a poor fit for StyleX. Inheritance might work; `::part(root)`
  might not. This repo has no custom-element pattern yet (ADR 0003 forbids
  global JSX augmentation, so the wrapper would be `createElement` plus
  registration side effects).
- We inherit GitHub’s API taste: inaccessible `title`, deprecated `auto` /
  `micro` / `elapsed`, `prefix="on"`, a large DateTimeFormat knob set.
  Wrapping does not make that contract ours; we either re-expose it or hide
  most of it and then wonder why we wrapped.
- React 19 custom-element property vs attribute mapping is a real integration
  risk (`formatStyle`, `noTitle`, `timeZone`).
- Adds the first `@github/*` dependency and a lockfile conflict with Plan 008
  (pnpm).

Skeptical reading: a wrapper is attractive when we want GitHub’s behavior
verbatim. It is weaker when we want a design-system primitive with native
`<time>`, StyleX, and a closed prop list. The wrap can become a leaky adapter
that still does not look like `Code` / `Text`.

### 2. Custom component we own

A React `RelativeTime` that renders native `<time datetime="…">`, formats with
`Intl.RelativeTimeFormat` / `Intl.DateTimeFormat`, and owns any refresh timer.
Public props we actually want; nothing else. Likely colocated under
`src/components/relative-time/`, exported like other helpers.

**Pros**

- Matches repository ownership: one public host, native semantics, StyleX
  margins/`xstyle`/`style` on a normal-flow element, compact closed contract.
- We can YAGNI hard. v1 can be “relative until threshold, then a short
  absolute date,” inherit font/color, and skip duration/tense/prefix.
- Accessible extra description can be real `Tooltip` composition, not
  GitHub’s `title`.
- No custom elements, no new dependency, no Shadow DOM.
- Tests assert our behavior, not an upstream element’s attribute matrix.

**Cons**

- We own correctness: rounding, “now” vs “1 second ago,” threshold, time
  zones, `lang`, and hydration (server/first paint vs later ticks). Easy to
  get slightly wrong.
- Auto-update means timers, tab-visibility, and cleanup. Get this wrong and
  Storybook/Playwright become flaky or expensive.
- Duration and tense are extra product if we chase GitHub feature-for-feature.
- Two sources of truth if some other app already standardized on the GitHub
  element.

Skeptical reading: this is the route that looks like the rest of the system.
It is also the one where we can overbuild. The investigation should propose a
*small* first-party API, not a clone of GitHub’s attribute table.

### 3. Hook

Something like `useRelativeTime(datetime, options) => { text, datetime, … }`.
Callers put the string in `Text`, `Item` description, a DataTable cell, or
their own `<time>`. Could live in `src/hooks/` and stay unpublished, or be a
public export if the string is the product.

**Pros**

- Smallest unit of behavior. Layout, semantics, and typography stay at the
  call site.
- DataTable / Item / aria-label / `title` (when we actually want a string)
  all consume the same function.
- A later component can call the hook; we are not stuck if the first consumer
  is not a visual host.
- No custom-element or StyleX-on-host problem.

**Cons**

- Every caller must remember `<time datetime>` (or accept unsemantic text).
  That is the kind of thing a helper component exists to prevent.
- Auto-update only works in a mounted component. A pure `formatRelativeTime`
  util will not tick; a hook that ticks cannot be used in a column `accessor`.
- Public hooks are not the current component inventory. Gallery and Storybook
  conventions are built around components. A hook-only v1 is easy to
  under-document.
- If most call sites want the same `<time>` + inherited text, the hook just
  pushes duplication outward and we will wrap it in a component anyway.

Skeptical reading: a hook is the right *private* engine. It is a weaker
*public* answer unless we have call sites that cannot render a host
(format-only, non-React, table accessors that must return strings). We have
not proven that yet — current call sites are hardcoded UI strings.

### How the routes combine

These are not fully exclusive:

| Public surface                         | Private engine                         |
| -------------------------------------- | -------------------------------------- |
| Wrapper component                      | GitHub element (no hook)               |
| First-party component                  | Private hook or inline `Intl` + timer  |
| Public hook only                       | Same `Intl` + timer, caller renders    |
| First-party component **and** hook     | Hook public, component is a thin host  |

The interesting fork is **what is public**. A first-party component built on a
private hook is still route 2. A public hook with no component is route 3.

## Investigation steps

Work in a throwaway spike if useful (`.scratch/` is ignored). Do not merge
product code from this plan.

1. **Call-site scan.** List every frozen `"… ago"` / `"Updated …"` string in
   `src/` and whether it wants a ticking `<time>`, a static label, or just a
   formatted string inside Item/Table/DataTable. Note whether any site cannot
   render a component.

2. **GitHub element spike (route 1).** Install the package only in the spike
   worktree if needed; do not land `package.json` changes on this branch
   unless the wrapper is chosen later. Render `<relative-time>` in a throwaway
   Storybook page or a local HTML file. Check: StyleX/`className` on the host,
   inherited color from `Text`, whether Shadow DOM text is the accessible
   name, `title` behavior, and React 19 property forwarding. Write down what
   a wrapper would still have to hide.

3. **First-party spike (route 2).** Implement the smallest `Intl`-based
   formatter that covers “minutes/hours/days ago,” a threshold to absolute
   date, and optional 30–60s refresh. Render `<time datetime>`. Compare
   output next to the GitHub element for the same instants. Note where they
   disagree and whether we care.

4. **Hook spike (route 3).** Same formatter as (3), but only return `{ text,
   iso }`. Drop it into an Item description and a DataTable cell renderer.
   See whether call sites feel better or just incomplete.

5. **Decide.** Recommend one public route with a short rationale, a proposed
   v1 API (types and one usage snippet), and an explicit non-goals list.
   Distill anything durable into `CONTEXT.md` or a small ADR only if the
   choice is architectural (for example “we wrap third-party custom elements
   this way” or “relative time is a hook, not a component”). Then write the
   real implementation plan — or implement directly if the chosen v1 is
   small and the recommendation is accepted.

## Decision criteria

Prefer the smallest public surface that:

- preserves a machine-readable instant and, unless investigation shows a
  strong reason not to, native `<time>`;
- keeps typography inherited and the prop list closed;
- does not require a new dependency unless the wrapper spike shows we would
  otherwise reimplement a large, well-tested behavior we actually want;
- fits existing inventory (components are the default public unit; hooks are
  default-private);
- has a test story we can tell in Playwright without freezing locale copy as
  the contract (ADR 0012).

A first-party component is the default hypothesis because it matches ADR 0004
and the existing helper pattern. It is *not* a decision. The wrapper stays in
play if the spike shows auto-update + threshold + localization are
disproportionate to own. The hook stays in play if real call sites need a
string more than a host.

## Out of scope until a route is chosen

- Shipping `RelativeTime` / `useRelativeTime` from `src/components/index.ts`
- Adding `@github/relative-time-element` to the lockfile on this investigation
- Retrofitting gallery DataTable / Item / Table showcase copy
- Matching GitHub’s full attribute set
- Intl polyfills, new tokens, global CSS, or Tooltip-owned timestamps

## STOP

- A relative-time helper already exists in the tree.
- The spike wants to modify Plan 008’s lockfile or install pnpm mid-flight —
  keep the wrapper spike local.
- Investigation starts implementing a public API “while we’re here.”
- The recommendation is “do all three publicly” (component + public hook +
  wrapper). Pick one public surface.

## When this plan is done

Update this file with the recommendation (replace the hypothesis, do not
leave three equal options as the conclusion). Update the status row in
`docs/plans/README.md`. Do not mark DONE until the recommendation is written
down. Implementation is a separate follow-up unless an operator says to
build the chosen v1 immediately.
