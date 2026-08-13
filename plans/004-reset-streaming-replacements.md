# Plan 004: Reset streaming replacements before their first render

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report; do not improvise. When done, update the status row for this plan in `plans/README.md` unless a reviewer dispatched you and told you they maintain the index.
>
> **Drift check (run first)**:
>
> ```sh
> git status --short -- src/blocks/streaming-response/streaming-response.tsx src/blocks/streaming-response/streaming-response.stories.tsx tests/blocks/streaming-response.spec.ts
> git diff --stat 04972a1 -- src/blocks/streaming-response/streaming-response.tsx src/blocks/streaming-response/streaming-response.stories.tsx tests/blocks/streaming-response.spec.ts
> git diff 04972a1 -- src/blocks/streaming-response/streaming-response.tsx src/blocks/streaming-response/streaming-response.stories.tsx tests/blocks/streaming-response.spec.ts
> ```
>
> At planning time the repository was on `main` at `04972a1`, ahead of `origin/main` by one commit, with unrelated user-owned Table/DataTable/App/CONTEXT work. If any in-scope path is modified or untracked before execution, compare it to the excerpts below and STOP on mismatch. Never discard, stage, or commit unrelated work.
>
> **Browser baseline**: The audit observed four pre-existing MP/global expectation-drift failures in the full Playwright run. The new focused StreamingResponse spec must pass. A full `npx playwright test --project=chromium` run is diagnostic only: compare it with a fresh pre-edit run and require no new failures; do not repair the unrelated baseline cases in this plan.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: MED
- **Depends on**: `plans/001-align-stylex-sx-typechecking.md`, `plans/002-settle-confirmation-before-success.md`
- **Category**: bug
- **Planned at**: commit `04972a1`, 2026-08-12

## Why this matters

`ChunkedStreamingText` currently resets its reveal count and completion guard in an effect. When `text` or `streamKey` changes, React first renders and evaluates completion using the previous stream's count against the replacement's chunks. A completed long response replaced by a shorter response can therefore appear fully revealed and call `onStreamingComplete` before the reset effect runs. This plan makes stream identity remount reveal state synchronously, so replacement text starts at its first chunk and completes exactly once at the real end.

## Current state

Relevant files:

- `src/blocks/streaming-response/streaming-response.tsx` — text chunking, reveal state, timeout cleanup, and completion callback.
- `src/blocks/streaming-response/streaming-response.stories.tsx` — interactive examples and the deterministic replacement fixture to add.
- `tests/blocks/streaming-response.spec.ts` — new focused browser regression coverage.
- `plans/README.md` — status-only update.

Current wrapper in `src/blocks/streaming-response/streaming-response.tsx:143-155`:

```tsx
function StreamingText({ children, onStreamingComplete, streamKey }: Pick<StreamingResponseContentProps, "children" | "onStreamingComplete" | "streamKey">) {
	const text = getStreamableText(children);

	if (text == null) {
		return children;
	}

	return <ChunkedStreamingText onStreamingComplete={onStreamingComplete} streamKey={streamKey} text={text} />;
}
```

Current stale reset/completion sequence in `src/blocks/streaming-response/streaming-response.tsx:166-193`:

```tsx
const chunks = useMemo(() => chunkStreamingText(text), [text]);
const [visibleCount, setVisibleCount] = useState(1);
const completionNotifiedRef = useRef(false);

useEffect(() => {
	setVisibleCount(1);
	completionNotifiedRef.current = false;
}, [streamKey, text]);

useEffect(() => {
	if (visibleCount >= chunks.length) {
		if (!completionNotifiedRef.current) {
			completionNotifiedRef.current = true;
			onCompleteRef.current?.();
		}
		return;
	}

	const timeout = window.setTimeout(() => {
		setVisibleCount((currentCount) => Math.min(currentCount + 1, chunks.length));
	}, streamingChunkIntervalMs);

	return () => window.clearTimeout(timeout);
}, [chunks.length, visibleCount]);
```

Current chunk size/interval at `src/blocks/streaming-response/streaming-response.tsx:47-48` are three words and 92 ms. Preserve them.

Existing conventions:

- `streamKey` explicitly restarts the reveal while status remains `streaming`; text changes must also restart even if callers forget to change `streamKey`.
- Timeout effects return `clearTimeout`; preserve cleanup.
- `onCompleteRef` allows callback identity changes without restarting animation; preserve that behavior.
- Non-string/non-number children bypass artificial streaming and render unchanged.
- Keep visible chunk spans, caret attributes, styling, and accessible text behavior unchanged.

## Concrete design decisions

Implement this exact reset model:

1. In `StreamingText`, derive a collision-safe scalar identity with `JSON.stringify([streamKey ?? null, text])` and pass it as React's `key` on `ChunkedStreamingText`.
2. Text is part of the identity even when `streamKey` is supplied. Changing either value remounts the renderer synchronously.
3. Remove the reset effect entirely; a new component instance starts with `visibleCount = 1` and `completionNotifiedRef = false` before its first render/effect.
4. Remove `streamKey` from `ChunkedStreamingText` props because it is consumed solely by the parent key.
5. Preserve `onCompleteRef.current = onStreamingComplete`, timeout cleanup, chunking, interval, caret, styles, and completion-once guard.
6. Do not call completion for non-streamable React children; retain the current bypass.
7. Do not reset merely because `onStreamingComplete` function identity changes.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Inspect branch/worktree | `git status --short --branch` | Intended branch; unrelated user files untouched |
| TypeScript | `npx tsc -b` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| App build | `npm run build` | exit 0 |
| Storybook build | `npm run build-storybook` | exit 0 |
| Focused browser regression | `npx playwright test tests/blocks/streaming-response.spec.ts` | all streaming tests pass in Chromium |
| Optional full browser comparison | `npx playwright test --project=chromium` | no new failures beyond a same-checkout pre-edit baseline; four MP/global cases were already failing at planning time |

## Scope

**In scope**:

- `src/blocks/streaming-response/streaming-response.tsx`
- `src/blocks/streaming-response/streaming-response.stories.tsx`
- `tests/blocks/streaming-response.spec.ts` (create)
- `plans/README.md` (status row only)

**Out of scope**:

- Changing chunk size, reveal interval, animation CSS, caret visuals, status vocabulary, elapsed-time formatting, or toolbar actions.
- Supporting streaming animation for arbitrary React-node trees.
- Adding a general timer/test-clock abstraction.
- `playwright.config.ts`; Plan 002 owns test discovery.
- Any dirty Table/DataTable/App/CONTEXT file.
- Dependency changes.

## Git workflow

- Create/switch to `codex/004-reset-streaming-replacements` only after dependency and drift checks. If unrelated dirty work would be carried, STOP and use an isolated worktree or ask the operator.
- Commit only scoped files with `[codex] Reset streaming response replacements`.
- Stage explicit paths, never `git add -A` in the dirty checkout.
- Do not push or open a PR without explicit operator instruction.

## Steps

### Step 1: Key reveal state by stream identity

Modify `StreamingText` and `ChunkedStreamingText` in `src/blocks/streaming-response/streaming-response.tsx` according to all seven concrete design decisions. Keep the implementation small: parent key plus removal of the now-redundant reset effect/prop. Do not replace the state machine with a new reducer or timer abstraction.

**Verify**:

```sh
npx tsc -b
npm run lint
```

Expected: both exit 0; no unused `streamKey` prop remains inside `ChunkedStreamingText`, and the timeout effect still returns `clearTimeout`.

### Step 2: Add a deterministic replacement/retry story

Add a fixed story export named `ReplacementReset` to `src/blocks/streaming-response/streaming-response.stories.tsx`, with controls disabled. The story fixture must:

- start streaming a long response of enough chunks to make stale `visibleCount` larger than a later response's chunk count;
- show the streamed content inside `data-testid="streaming-replacement-content"`;
- increment a visible `data-testid="streaming-completion-count"` in `onStreamingComplete` without changing Root status away from `streaming`;
- provide `Replace response` to switch to a different five-word response without changing `streamKey`;
- provide `Retry same response` to increment `streamKey` while keeping text unchanged;
- provide a visible stream identity/phase if needed for deterministic test synchronization.

Do not use external network activity. Keep it a plain functional story using existing story styles.

**Verify**:

```sh
npm run build-storybook
```

Expected: exit 0; Storybook generates `Blocks/Streaming response/Replacement reset` without StyleX errors.

### Step 3: Add focused browser regression coverage

Create `tests/blocks/streaming-response.spec.ts`, using the console-error collection pattern from `tests/theme-props/browser.spec.ts:5-17`. Navigate to `/iframe.html?id=blocks-streaming-response--replacement-reset&viewMode=story`.

Required cases:

1. Wait for the initial long stream's completion count to become `1`.
2. Click `Replace response`. In the immediate post-click render, assert content contains only the first three words and not the final two words of the five-word replacement; completion count must remain `1`.
3. Wait for the replacement to reveal all five words and assert completion count becomes `2`, never skipping directly during the click.
4. Click `Retry same response`. Immediately assert it returns to the first three words while completion count remains `2`; after the final chunk it becomes `3` exactly once.
5. Assert the streaming caret exists during partial reveal and is absent after completion.
6. Assert no console errors.

Install Playwright's clock before navigation and let Storybook plus the initial long stream run normally. After completion count reaches `1`, read the page's current `Date.now()` and pause the clock at that value. Click `Replace response`; with timers paused, assert the first committed three-word chunk and unchanged count without racing the 92 ms timeout. Advance exactly 92 ms with `page.clock.runFor(92)` and assert the five-word replacement and count `2`. Keep the clock paused for `Retry same response`, repeat the immediate three-word assertion, advance 92 ms, and assert count `3`. Use Playwright's auto-retrying assertions for DOM commits, but no hard sleeps.

**Verify**:

```sh
npm run build-storybook
npx playwright test tests/blocks/streaming-response.spec.ts
```

Expected: both exit 0; all new tests pass and completion counts are exactly 1, 2, then 3.

### Step 4: Run independent repository gates

```sh
npx tsc -b
npm run lint
npm run build
npm run build-storybook
npx playwright test tests/blocks/streaming-response.spec.ts
```

Expected: every listed command exits 0. The focused StreamingResponse spec is a hard gate. A full Playwright run, if performed, is diagnostic and may retain the four recorded MP/global baseline failures, but it must introduce no new failure. If Plan 001's baseline has drifted because of unrelated work, do not edit that work; report and STOP.

### Step 5: Review scope and commit

Update only Plan 004's status row in `plans/README.md`, inspect the diff, and stage explicit paths.

**Verify**:

```sh
git diff --check
git status --short
git diff --name-only 04972a1 -- src/blocks/streaming-response/streaming-response.tsx src/blocks/streaming-response/streaming-response.stories.tsx tests/blocks/streaming-response.spec.ts plans/README.md
```

Expected: no whitespace errors and only scoped implementation files. Commit with `[codex] Reset streaming response replacements`, then verify `git show --stat --oneline HEAD` includes no unrelated user-owned file.

## Test plan

- New `tests/blocks/streaming-response.spec.ts` modeled after existing Storybook Playwright tests.
- Regression sequence: complete long stream, replace with short text without key change, retry same text with key change.
- Assert first committed chunk, final text, caret lifecycle, exact completion counts, and zero console errors.
- Focused command: `npx playwright test tests/blocks/streaming-response.spec.ts`.

## Done criteria

- [ ] Changing text resets reveal state before the replacement's first render.
- [ ] Changing `streamKey` resets the same text before its first retry render.
- [ ] Changing callback identity alone does not restart streaming.
- [ ] Each stream identity invokes its latest completion callback exactly once, after its final chunk.
- [ ] Timeout cleanup, chunk size, interval, caret, and non-text bypass remain intact.
- [ ] Focused Playwright tests pass with no console errors.
- [ ] Any optional full Playwright comparison introduces no failures beyond its captured pre-edit baseline; the four known MP/global failures are not treated as this plan's work.
- [ ] `npx tsc -b`, `npm run lint`, `npm run build`, and `npm run build-storybook` each exit 0.
- [ ] No out-of-scope file is modified, staged, or committed.
- [ ] Plan 004 status is updated in `plans/README.md`.

## STOP conditions

Stop and report without improvising if:

- Plans 001 or 002 are not DONE; this plan relies on their clean TypeScript baseline and `tests/` Playwright discovery.
- Live streaming source differs from the excerpts before work begins.
- A React key cannot be applied without changing the public `Content` DOM structure or accessibility semantics.
- The focused test cannot observe the first committed chunk without changing the production interval; do not lengthen production timing for the test.
- Correctness appears to require streaming arbitrary React-node trees, changing status ownership, or changing chunk semantics.
- Any required gate fails twice after one scoped correction.
- An unrelated dirty file blocks verification.

## Maintenance notes

- Stream identity intentionally includes both `streamKey` and text. Future changes must preserve text-change reset even when callers supply a key.
- Reviewers should scrutinize completion callback ordering and ensure the reset effect is gone rather than merely reordered.
- If text becomes extremely large and React key size becomes measurable, replace the serialized identity with a collision-free generation mechanism in a separate measured change; do not weaken correctness preemptively here.
