# Plan 003: Bound Slider marker density without changing slider values

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report; do not improvise. When done, update the status row for this plan in `plans/README.md` unless a reviewer dispatched you and told you they maintain the index.
>
> **Drift check (run first)**:
>
> ```sh
> git status --short -- src/components/slider/slider.tsx src/components/slider/slider.stories.tsx tests/components/slider.spec.ts
> git diff --stat 04972a1 -- src/components/slider/slider.tsx src/components/slider/slider.stories.tsx tests/components/slider.spec.ts
> git diff 04972a1 -- src/components/slider/slider.tsx src/components/slider/slider.stories.tsx tests/components/slider.spec.ts
> ```
>
> At planning time the repository was on `main` at `04972a1`, ahead of `origin/main` by one commit, with unrelated user-owned Table/DataTable/App/CONTEXT work. If an in-scope path is modified or untracked before execution, compare it to the excerpts below and STOP on mismatch. Never discard, stage, or commit unrelated work.
>
> **Browser baseline**: The audit observed four pre-existing MP/global expectation-drift failures in the full Playwright run. The new focused Slider spec must pass. A full `npx playwright test --project=chromium` run is diagnostic only: compare it with a fresh pre-edit run and require no new failures; do not repair the unrelated baseline cases in this plan.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: `plans/001-align-stylex-sx-typechecking.md`, `plans/002-settle-confirmation-before-success.md`
- **Category**: perf
- **Planned at**: commit `04972a1`, 2026-08-12

## Why this matters

Enabling Slider markers currently renders one DOM node for every requested step. A valid small `step` across a normal range can synchronously create hundreds of thousands or millions of React elements and freeze Storybook or a consuming product. This plan caps visual markers at 200, computes the coarsened interval before entering the render loop, and leaves slider values, step behavior, thumbs, keyboard handling, and public marker props unchanged.

## Current state

Relevant files:

- `src/components/slider/slider.tsx` — marker options, generation algorithm, and internal marker DOM.
- `src/components/slider/slider.stories.tsx` — Playground plus fixed verification fixture.
- `tests/components/slider.spec.ts` — new focused Storybook/Playwright regression coverage.
- `plans/README.md` — status-only update.

Current marker request in `src/components/slider/slider.tsx:141-171`:

```tsx
export function Control({ children, className, markers = false, style, ...props }: SliderControlProps) {
	// ...
	<BaseSlider.Track className={trackSx.className} style={trackSx.style}>
		<BaseSlider.Indicator className={indicatorSx.className} style={indicatorSx.style} />
		{markers ? <Markers every={typeof markers === "boolean" ? 1 : markers.every} /> : null}
	</BaseSlider.Track>
}

function Markers({ every = 1 }: SliderMarkersOptions) {
	const { max, min, orientation, step } = useSliderContext();
	const markerValues = getMarkerValues(min, max, step, every);
	// ...
	return <span key={markerValue} {...stylex.props(sliderParts.marker)} style={markerStyle} />;
}
```

Current unbounded algorithm in `src/components/slider/slider.tsx:190-203`:

```ts
function getMarkerValues(min: number, max: number, step: number, every: number) {
	if (!(step > 0) || !(every > 0) || !Number.isFinite(step) || !Number.isFinite(every)) {
		return [];
	}

	const stepCount = Math.floor((max - min) / step + Number.EPSILON);
	const markerInterval = Math.max(1, Math.round(every));
	const markerValues: number[] = [];

	for (let stepIndex = 0; stepIndex <= stepCount; stepIndex += markerInterval) {
		markerValues.push(Number((min + stepIndex * step).toPrecision(12)));
	}

	return markerValues;
}
```

Storybook's existing public control uses `markers={{ every: ... }}` and describes `every` as a multiple of Slider steps (`src/components/slider/slider.stories.tsx:95-104`). Preserve that meaning.

## Concrete design decisions

Implement exactly this density policy:

1. Add a private module constant `MAX_SLIDER_MARKERS = 200`. Do not export it and do not add a public max prop.
2. Validate `min`, `max`, `step`, and `every` before calculating or looping. Invalid/non-finite inputs, a negative range, non-positive step/every, or a non-finite raw step count return `[]` markers.
3. Compute `stepCount` without allocating an intermediate per-step array.
4. Compute the caller's requested integer interval as today: `Math.max(1, Math.round(every))`.
5. Compute a minimum safe interval as `Math.max(1, Math.ceil(stepCount / (MAX_SLIDER_MARKERS - 1)))`, then round that interval **up to a multiple of the caller's requested interval**: `requestedInterval * Math.max(1, Math.ceil(minimumSafeInterval / requestedInterval))`. This guarantees the zero/min marker plus generated interval markers never exceed 200 while keeping every rendered marker in the caller-requested marker sequence.
6. Preserve the current rounding with `toPrecision(12)`, marker positioning, orientation, keys, and the fact that a max marker appears only when it falls on the chosen interval.
7. Add `data-slider-marker=""` to each internal marker span solely as a stable verification/diagnostic hook. It is not a new React prop or exported API.
8. Do not alter Base UI `min`, `max`, `step`, the slider value, thumb count, keyboard increments, or `markers` types.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Inspect branch/worktree | `git status --short --branch` | Intended branch and unrelated dirty files preserved |
| TypeScript | `npx tsc -b` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| App build | `npm run build` | exit 0 |
| Storybook build | `npm run build-storybook` | exit 0 |
| Focused browser regression | `npx playwright test tests/components/slider.spec.ts` | all Slider tests pass in Chromium |
| Optional full browser comparison | `npx playwright test --project=chromium` | no new failures beyond a same-checkout pre-edit baseline; four MP/global cases were already failing at planning time |

## Scope

**In scope**:

- `src/components/slider/slider.tsx`
- `src/components/slider/slider.stories.tsx`
- `tests/components/slider.spec.ts` (create)
- `plans/README.md` (status row only)

**Out of scope**:

- Public Slider prop/type redesign.
- Changing slider values, snapping, range behavior, formatting, styles, or accessibility semantics.
- Virtualizing markers or introducing canvas/SVG rendering.
- Shared Base UI or StyleX configuration.
- `playwright.config.ts`; Plan 002 owns test discovery.
- Any dirty Table/DataTable/App/CONTEXT file.
- Dependency changes.

## Git workflow

- Create/switch to `codex/003-bound-slider-marker-density` only after dependency and drift checks. If unrelated dirty work would be carried, STOP and use an isolated worktree or ask the operator.
- Commit only scoped files with `[codex] Bound slider marker density`.
- Stage explicit paths, never `git add -A` in the dirty checkout.
- Do not push or open a PR without explicit operator instruction.

## Steps

### Step 1: Add the bounded marker interval

Modify only `getMarkerValues` and the private marker constant/hook in `src/components/slider/slider.tsx` according to the eight concrete design decisions. The safe interval must be calculated before the loop; never loop over all steps and filter afterward.

Reason through these expected counts before proceeding:

- `min=0, max=100, step=10, every=1` -> 11 markers (unchanged).
- `min=0, max=1, step=0.000001, every=1` -> no more than 200 markers.
- `min=0, max=100, step=Number.MIN_VALUE, every=1` -> 0 markers because raw step count is non-finite.
- invalid/negative range -> 0 markers.

**Verify**:

```sh
npx tsc -b
npm run lint
```

Expected: both exit 0; no public type changes or lint warnings/errors are introduced.

### Step 2: Add a fixed density verification story

In `src/components/slider/slider.stories.tsx`, add a fixed export named `MarkerDensity` with controls disabled. Render at least:

- a dense horizontal slider with `min={0}`, `max={1}`, `step={0.000001}`, `markers`, a visible label, one thumb, and a wrapper `data-testid="dense-slider"`;
- a normal slider with `min={0}`, `max={100}`, `step={10}`, `markers`, and wrapper `data-testid="normal-slider"`.

Keep the story functional and plain; do not add decorative specimen cards. Use existing Slider composition and the current story styles.

**Verify**:

```sh
npm run build-storybook
```

Expected: exit 0 and the `Components/Slider/Marker density` story is generated without StyleX errors.

### Step 3: Add focused Playwright coverage

Create `tests/components/slider.spec.ts`. Navigate to `/iframe.html?id=components-slider--marker-density&viewMode=story`, use the same console-error collection pattern as `tests/theme-props/browser.spec.ts:5-17`, and assert:

1. `[data-testid="dense-slider"] [data-slider-marker]` count is greater than 1 and at most 200.
2. `[data-testid="normal-slider"] [data-slider-marker]` count is exactly 11, proving normal density is unchanged.
3. The dense slider still exposes a slider role, accepts focus, and changes by one configured step on `ArrowRight`; marker coarsening must not change value semantics.
4. No browser console errors are emitted.

Do not add timing-based performance assertions; the bounded DOM count is deterministic proof of the regression fix.

**Verify**:

```sh
npm run build-storybook
npx playwright test tests/components/slider.spec.ts
```

Expected: both exit 0 and all focused tests pass.

### Step 4: Run independent repository gates

```sh
npx tsc -b
npm run lint
npm run build
npm run build-storybook
npx playwright test tests/components/slider.spec.ts
```

Expected: every listed command exits 0. The focused Slider spec is a hard gate. A full Playwright run, if performed, is diagnostic and may retain the four recorded MP/global baseline failures, but it must introduce no new failure. Do not modify unrelated files to clear a required-gate failure; report and STOP if Plan 001's clean baseline has drifted.

### Step 5: Review scope and commit

Update only Plan 003's status row in `plans/README.md`, inspect the diff, and stage explicit paths.

**Verify**:

```sh
git diff --check
git status --short
git diff --name-only 04972a1 -- src/components/slider/slider.tsx src/components/slider/slider.stories.tsx tests/components/slider.spec.ts plans/README.md
```

Expected: no whitespace errors and only scoped files in this plan's implementation diff. Commit with `[codex] Bound slider marker density`, then verify `git show --stat --oneline HEAD` contains no unrelated user files.

## Test plan

- New `tests/components/slider.spec.ts` modeled after the existing theme-prop browser specs.
- Deterministic assertions: dense marker bound, unchanged ordinary count, keyboard/value semantics, zero console errors.
- Story fixture: `MarkerDensity` in the existing Slider stories.
- Focused command: `npx playwright test tests/components/slider.spec.ts`.

## Done criteria

- [ ] Marker generation never returns more than 200 values.
- [ ] The safe interval is computed before iteration; no oversized temporary array or loop remains.
- [ ] Non-finite and invalid domains return no markers and cannot enter an infinite loop.
- [ ] Ordinary marker counts/positions remain unchanged when already below the cap.
- [ ] Slider step/value/keyboard behavior is unchanged.
- [ ] Focused Playwright tests pass with no console errors.
- [ ] Any optional full Playwright comparison introduces no failures beyond its captured pre-edit baseline; the four known MP/global failures are not treated as this plan's work.
- [ ] `npx tsc -b`, `npm run lint`, `npm run build`, and `npm run build-storybook` each exit 0.
- [ ] No out-of-scope file is modified, staged, or committed.
- [ ] Plan 003 status is updated in `plans/README.md`.

## STOP conditions

Stop and report without improvising if:

- Plans 001 or 002 are not DONE; this plan relies on their clean TypeScript baseline and `tests/` Playwright discovery.
- Live Slider code differs from the excerpts before work begins.
- Base UI rejects the dense-but-finite step before this component's marker code runs; choose a smaller still-regressive fixture only after reporting the constraint.
- Bounding markers appears to require changing public value/step semantics or adding a public prop.
- Any required gate fails twice after one scoped correction.
- An unrelated dirty file blocks verification.

## Maintenance notes

- Reviewers should verify the loop increment can never be zero or non-finite once iteration begins and that count math includes the initial marker.
- If design later requests exact endpoint markers, revisit that separately; this plan intentionally preserves current endpoint behavior.
- Keep `MAX_SLIDER_MARKERS` private unless a real product requirement demonstrates consumer control is necessary.
