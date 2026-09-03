# ADR 0012: Test durable behavior, not incidental fixes

- Status: Accepted
- Date: 2026-09-02

## Context

The repository uses automated tests to protect component behavior while its
implementation and visual treatment continue to evolve. A test has a long-term
maintenance cost: its fixture, selectors, assertions, and expected output all
become part of the effective change surface.

Bug fixes and advisory-tool findings do not automatically create durable
contracts. Tests written around the exact shape of a single incident can lock
in CSS tokens, DOM structure, timing, render counts, ref synchronization, or
other implementation details without proving that the component still does
what a user or consumer needs. Dedicated verification stories created only for
such details also enlarge the public Storybook surface and can outlive the
reason they were added.

The repository still needs strong coverage for behavior that consumers rely
on: native semantics, accessible names and relationships, keyboard and focus
behavior, state transitions, callbacks, forms, routing, and explicitly
documented component mechanics. Large refactors also need characterization of
those outcomes so moving code does not change them accidentally.

## Decision

- Permanent automated tests protect durable user-facing behavior, public API
  contracts, or an explicitly documented component mechanic. They assert the
  observable outcome: for example, a checkbox becomes checked, a disclosure
  opens, a value is copied, the intended callback receives the intended value,
  or browser history restores the intended route state.
- A bug fix, lint warning, React Doctor finding, implementation refactor, or
  review comment does not by itself require a new regression test. Verification
  remains proportional to risk.
- Use focused local reproduction, advisory-tool output, source inspection, and
  manual Storybook QA for one-off implementation details or visual corrections
  that are not durable contracts. Those checks may be reported as review or PR
  evidence without becoming committed fixtures.
- Do not add a dedicated story or fixture solely to expose a private mechanism
  such as ref synchronization, memoization, render counts, effect ordering, or
  the exact CSS path used by one bug. If that mechanism can cause a supported
  behavior to fail, test the supported behavior through an existing realistic
  surface where practical.
- Do not gate on exact color tokens, spacing, incidental geometry, generated
  classes, SVG internals, or transient animation frames unless that exact
  mechanism is itself an explicit supported contract. Visual corrections are
  reviewed in live Storybook and with before/after evidence.
- Prefer extending an existing behavior test over creating a new fixture. Do
  not duplicate coverage merely because a second implementation path changed.
- Characterization for a substantial refactor covers the meaningful supported
  combinations at the public boundary. It should not snapshot every branch or
  preserve current private module structure.
- Tests may cover a low-level invariant when failure would be severe and the
  public outcome cannot be exercised deterministically, but the test must state
  the durable invariant and why a public-boundary test is insufficient.
- Remove or simplify a test when it would fail after a behavior-preserving
  implementation change, duplicates stronger coverage, or exists only as a
  transcript of a resolved incident.

Issue briefs and implementation plans follow the same policy. They specify
required behavior and proportionate verification, but they do not prescribe a
new permanent test for every fix.

## Consequences

The blocking suite stays focused on whether components work for consumers.
Implementation and styling can change without rewriting tests that never
represented a supported contract, while accessibility, state, callback, form,
and navigation regressions remain protected.

Some fixes will land without a new committed regression test. Confidence for
those changes comes from the existing behavior suite plus focused review-time
evidence, advisory tools, and manual visual verification. Reviewers must judge
that evidence against the risk instead of treating test-file growth as proof of
quality.

Large behavior changes and public-contract additions may still require new
tests. The distinction is the durability of the behavior, not the size of the
diff or whether the work began from a bug report.

## Alternatives rejected

- Require a regression test for every bug: this turns incident details into
  permanent contracts and produces brittle, duplicative fixtures.
- Avoid new tests for refactors: structural changes can silently break supported
  combinations, so public-boundary characterization remains necessary.
- Rely only on manual QA: semantics, callbacks, forms, keyboard behavior, and
  routing need repeatable automated protection.
- Treat coverage count as the goal: line or branch coverage does not distinguish
  durable behavior from incidental implementation.
