# Math Expression Input Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A private math-expression evaluation seam (pure evaluator + internal hook) whose first consumer is an experimental `MathExpressionField`, so typing `100 / 5` and committing yields `20`.

**Implementation note:** Shipped as `src/experimental/math-expression-field/` rather than a NumberField story-local harness, so the field can be exercised independently without changing the public NumberField contract. Evaluator and hook locations are unchanged. Nothing is exported from `src/components/index.ts`.

**Architecture:** Three layers: a pure `evaluateMathExpression` utility in `src/utils/`, an internal `useMathExpressionInput` hook in `src/hooks/` that owns draft/commit state, and a story-local `MathExpressionField` harness defined inside `src/components/number-field/number-field.stories.tsx` that owns markup, Field semantics, and form submission. Display is derived at render time (`draft ?? format(committedValue)`) — there is no synchronization effect. No component source files change and nothing is exported from `src/components/index.ts`.

**Why not NumberField itself:** Base UI's `NumberField.Input` filters keystrokes (`onKeyDown` calls `preventDefault()` for any character that is not a numeral, locale symbol, single sign, or navigation key) and rejects pasted strings containing other characters, so `*`, `/`, and `(` can never reach a draft. The hook must attach to a plain text input. The harness lives in the NumberField stories because that is where numeric entry is documented.

**Tech Stack:** React 19, Base UI (`Field`, `Input`), StyleX, Storybook 10, Playwright.

## Global Constraints

- Do not modify `src/components/number-field/number-field.tsx`, `TextField`, or `InputGroup`. The only component-tree change is additive story code in `number-field.stories.tsx`.
- Do not export anything from this feature in `src/components/index.ts`; the hook is an internal seam and the harness is story-local.
- Never use `eval` or `new Function` in the evaluator.
- ADR 0009: derive one pure effective value; never call `onValueCommitted` because a prop became invalid or was clamped. Callbacks fire only from user-initiated commits whose numeric result differs from the current committed value.
- ADR 0008: no effect-based state resets or prop-to-state sync effects. Idle display is derived during render.
- `tsconfig.app.json` sets `erasableSyntaxOnly`: no class parameter properties, no enums.
- Switches over discriminated unions need a `never` default (workspace rule).
- Storybook: `Playground` stays the first exported story; the new story is one consolidated, sentence-case-named `Math expressions` story with `controls: { disable: true }` and labeled sections using the file's existing `StateSpecimen`.
- Indent with tabs (repository style). Commit messages are short imperative sentence case (e.g. `Add math expression evaluator`).
- Validation commands: `npm run build`, `npm run lint`, `npm run build-storybook`, then focused Playwright specs. There is no `typecheck` script; `npm run build` runs `tsc -b`.
- `number-field.stories.tsx` may have concurrent local changes; inspect the checkout before editing and report unrelated failures instead of modifying concurrent work.

## Design decisions (deltas from the original proposal)

- First consumer is a story-local `MathExpressionField` harness in `number-field.stories.tsx` — not a new experimental component, and not a `NumberField` change (blocked by Base UI input filtering, see above).
- Evaluator and hook still live in `src/utils/` and `src/hooks/` so a future real consumer can adopt them without moving code.
- `inputProps` is complete: `value`, `inputMode`, `disabled`, `readOnly`, `required`, `aria-invalid`, `onChange`, `onBlur`, `onKeyDown`. Consumers spread it and are done.
- Enter commits a dirty draft and calls `preventDefault()` so a form cannot submit a stale hidden-input value; a second Enter submits. Escape reverts the draft.
- Dirty means the committed _number_ changed: committing `4 * 5` over an existing `20` replaces the draft with `20` but does not fire `onValueCommitted`.
- Committed results are float-noise-stripped via `toPrecision(12)` (so `0.1 + 0.2` commits as `0.3`) and `-0` normalizes to `0`.
- The hook owns expression-validity errors (`invalidExpressionMessage`, `requiredMessage` options with defaults); a consumer with its own error prop merges as `expressionError ?? consumerError`.

---

### Task 1: Pure evaluator

**Files:**

- Create: `src/utils/evaluate-math-expression.ts`
- Test: `tests/components/math-expression-evaluator.spec.ts`

**Interfaces:**

- Consumes: nothing.
- Produces: `evaluateMathExpression(expression: string): MathExpressionResult` where `MathExpressionResult = { ok: true; value: number } | { ok: false; reason: MathExpressionFailureReason }` and `MathExpressionFailureReason = "empty" | "syntax" | "division-by-zero" | "non-finite"`. Task 2's hook imports the function from `@/utils/evaluate-math-expression`.

- [ ] **Step 1: Write the failing test**

This spec never uses the `page` fixture, so it runs in Node. It imports the source by relative path because Playwright resolves tests against the root `tsconfig.json`, which has no `@/` path mapping.

Create `tests/components/math-expression-evaluator.spec.ts`:

```ts
import { expect, test } from "@playwright/test";
import { evaluateMathExpression } from "../../src/utils/evaluate-math-expression";

test("evaluates plain numbers and whitespace", () => {
	expect(evaluateMathExpression("42")).toEqual({ ok: true, value: 42 });
	expect(evaluateMathExpression(" 3.5 ")).toEqual({ ok: true, value: 3.5 });
	expect(evaluateMathExpression(".5")).toEqual({ ok: true, value: 0.5 });
});

test("applies operator precedence, associativity, and parentheses", () => {
	expect(evaluateMathExpression("100 / 5")).toEqual({ ok: true, value: 20 });
	expect(evaluateMathExpression("2 + 3 * 4")).toEqual({ ok: true, value: 14 });
	expect(evaluateMathExpression("(2 + 3) * 4")).toEqual({ ok: true, value: 20 });
	expect(evaluateMathExpression("10 - 2 - 3")).toEqual({ ok: true, value: 5 });
	expect(evaluateMathExpression("12 / 3 / 2")).toEqual({ ok: true, value: 2 });
	expect(evaluateMathExpression("0.1 + 0.2")).toEqual({ ok: true, value: 0.1 + 0.2 });
});

test("supports unary signs", () => {
	expect(evaluateMathExpression("-4")).toEqual({ ok: true, value: -4 });
	expect(evaluateMathExpression("+5")).toEqual({ ok: true, value: 5 });
	expect(evaluateMathExpression("3 * -2")).toEqual({ ok: true, value: -6 });
	expect(evaluateMathExpression("-(2.5 + 1.5) * 2")).toEqual({ ok: true, value: -8 });
});

test("rejects malformed expressions", () => {
	expect(evaluateMathExpression("")).toEqual({ ok: false, reason: "empty" });
	expect(evaluateMathExpression("   ")).toEqual({ ok: false, reason: "empty" });
	expect(evaluateMathExpression("2 +")).toEqual({ ok: false, reason: "syntax" });
	expect(evaluateMathExpression("(2 + 3")).toEqual({ ok: false, reason: "syntax" });
	expect(evaluateMathExpression("2(3)")).toEqual({ ok: false, reason: "syntax" });
	expect(evaluateMathExpression("two + 2")).toEqual({ ok: false, reason: "syntax" });
	expect(evaluateMathExpression("1 2")).toEqual({ ok: false, reason: "syntax" });
	expect(evaluateMathExpression("2 ** 3")).toEqual({ ok: false, reason: "syntax" });
});

test("rejects division by zero and non-finite results", () => {
	expect(evaluateMathExpression("1 / 0")).toEqual({ ok: false, reason: "division-by-zero" });
	expect(evaluateMathExpression("1 / (2 - 2)")).toEqual({ ok: false, reason: "division-by-zero" });
	expect(evaluateMathExpression(`1${"0".repeat(309)}`)).toEqual({
		ok: false,
		reason: "non-finite",
	});
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `PLAYWRIGHT_SKIP_WEBSERVER=1 npx playwright test tests/components/math-expression-evaluator.spec.ts`
Expected: FAIL — cannot find module `../../src/utils/evaluate-math-expression`.

- [ ] **Step 3: Write the implementation**

Create `src/utils/evaluate-math-expression.ts`. Recursive descent over a token array; failures are recorded in a closure variable (no exception classes, because `erasableSyntaxOnly` forbids parameter properties and sentinel classes add nothing here). Implicit multiplication such as `2(3)` fails the trailing-token check.

```ts
export type MathExpressionFailureReason = "empty" | "syntax" | "division-by-zero" | "non-finite";

export type MathExpressionResult =
	{ ok: true; value: number } | { ok: false; reason: MathExpressionFailureReason };

type BinaryOperator = "+" | "-" | "*" | "/";

type Token =
	| { kind: "number"; value: number }
	| { kind: "operator"; value: BinaryOperator }
	| { kind: "open-paren" }
	| { kind: "close-paren" };

const NUMBER_PATTERN = /^(?:\d+(?:\.\d*)?|\.\d+)/;

function tokenize(expression: string): Token[] | null {
	const tokens: Token[] = [];
	let index = 0;
	while (index < expression.length) {
		const char = expression[index];
		if (/\s/.test(char)) {
			index += 1;
			continue;
		}
		if (char === "(") {
			tokens.push({ kind: "open-paren" });
			index += 1;
			continue;
		}
		if (char === ")") {
			tokens.push({ kind: "close-paren" });
			index += 1;
			continue;
		}
		if (char === "+" || char === "-" || char === "*" || char === "/") {
			tokens.push({ kind: "operator", value: char });
			index += 1;
			continue;
		}
		const match = NUMBER_PATTERN.exec(expression.slice(index));
		if (match) {
			tokens.push({ kind: "number", value: Number.parseFloat(match[0]) });
			index += match[0].length;
			continue;
		}
		return null;
	}
	return tokens;
}

/**
 * Evaluate an arithmetic expression supporting decimals, whitespace, unary
 * signs, the four binary operators, and parentheses. Never uses `eval`.
 */
export function evaluateMathExpression(expression: string): MathExpressionResult {
	const tokens = tokenize(expression);
	if (tokens === null) return { ok: false, reason: "syntax" };
	if (tokens.length === 0) return { ok: false, reason: "empty" };

	let index = 0;
	let failure: MathExpressionFailureReason | null = null;

	function fail(reason: MathExpressionFailureReason): number {
		failure = failure ?? reason;
		return Number.NaN;
	}

	function parseExpression(): number {
		let left = parseTerm();
		while (failure === null) {
			const token = tokens[index];
			if (!token || token.kind !== "operator" || (token.value !== "+" && token.value !== "-"))
				break;
			index += 1;
			const right = parseTerm();
			left = token.value === "+" ? left + right : left - right;
		}
		return left;
	}

	function parseTerm(): number {
		let left = parseFactor();
		while (failure === null) {
			const token = tokens[index];
			if (!token || token.kind !== "operator" || (token.value !== "*" && token.value !== "/"))
				break;
			index += 1;
			const right = parseFactor();
			if (token.value === "*") {
				left = left * right;
			} else if (right === 0) {
				left = fail("division-by-zero");
			} else {
				left = left / right;
			}
		}
		return left;
	}

	function parseFactor(): number {
		const token = tokens[index];
		if (token?.kind === "operator" && (token.value === "+" || token.value === "-")) {
			index += 1;
			const operand = parseFactor();
			return token.value === "-" ? -operand : operand;
		}
		return parsePrimary();
	}

	function parsePrimary(): number {
		const token = tokens[index];
		if (token?.kind === "number") {
			index += 1;
			return token.value;
		}
		if (token?.kind === "open-paren") {
			index += 1;
			const value = parseExpression();
			if (tokens[index]?.kind !== "close-paren") return fail("syntax");
			index += 1;
			return value;
		}
		return fail("syntax");
	}

	const value = parseExpression();
	if (failure === null && index < tokens.length) failure = "syntax";
	if (failure !== null) return { ok: false, reason: failure };
	if (!Number.isFinite(value)) return { ok: false, reason: "non-finite" };
	return { ok: true, value };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `PLAYWRIGHT_SKIP_WEBSERVER=1 npx playwright test tests/components/math-expression-evaluator.spec.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Lint and commit**

```bash
npm run lint
git add src/utils/evaluate-math-expression.ts tests/components/math-expression-evaluator.spec.ts
git commit -m "Add math expression evaluator"
```

---

### Task 2: Hook and NumberField story harness

**Files:**

- Create: `src/hooks/use-math-expression-input.ts`
- Modify: `src/components/number-field/number-field.stories.tsx` (additive: new imports, story-local harness components, one new `MathExpressions` story export after `States`; do not change `Playground`, `Formatting`, `Sizes`, `States`, `StateSpecimen`, or the existing `styles`)

**Interfaces:**

- Consumes: `evaluateMathExpression` from `@/utils/evaluate-math-expression` (Task 1); existing `fieldStyles`, `fieldInputStyles` from `@/components/field/field.stylex`; `focusRing` from `@/styles/recipes/focus`; `Button` from `@/components/button/button`; the stories file's existing `StateSpecimen` helper.
- Produces: `useMathExpressionInput(options: UseMathExpressionInputOptions): UseMathExpressionInputReturn`; story id `components-number-field--math-expressions`; field labels `Amount`, `Clamped amount`, `Required amount`, `Read-only`, `Disabled`, `Quantity`, `Controlled amount`; status texts `Tick: N`, `Commits: N`, `Not submitted`, `Submitted: 42`; error messages `Enter a valid math expression`, `Enter a value`. Task 3's spec depends on these exactly.

- [ ] **Step 1: Write the hook**

Create `src/hooks/use-math-expression-input.ts`. Key invariants: `draft === null` means idle, and the displayed string is derived during render — no sync effect (ADR 0008). `clampCommitted` is the single pure normalization point for controlled, uncontrolled, and freshly evaluated values (ADR 0009); an out-of-range controlled prop displays clamped without emitting a callback.

```ts
import { useState, type ChangeEvent, type FocusEvent, type KeyboardEvent } from "react";
import { evaluateMathExpression } from "@/utils/evaluate-math-expression";

export type MathExpressionCommitEvent =
	FocusEvent<HTMLInputElement> | KeyboardEvent<HTMLInputElement>;

export type UseMathExpressionInputOptions = {
	/** Controlled committed value. `null` means intentionally empty. */
	value?: number | null;
	defaultValue?: number | null;
	min?: number;
	max?: number;
	required?: boolean;
	disabled?: boolean;
	readOnly?: boolean;
	/** Error shown when the draft cannot be evaluated. */
	invalidExpressionMessage?: string;
	/** Error shown when the draft is empty but a value is required. */
	requiredMessage?: string;
	/** Called once per user-initiated commit whose numeric result differs from the current value. */
	onValueCommitted?: (
		value: number | null,
		details: { expression: string; event: MathExpressionCommitEvent },
	) => void;
};

export type UseMathExpressionInputReturn = {
	/** The string shown in the input: the live draft, or the formatted committed value while idle. */
	displayValue: string;
	committedValue: number | null;
	/** Expression-validity error owned by the hook; null while the draft is clean or valid. */
	error: string | null;
	isEditing: boolean;
	inputProps: {
		value: string;
		inputMode: "text";
		disabled: boolean;
		readOnly: boolean;
		required: boolean;
		"aria-invalid": true | undefined;
		onChange: (event: ChangeEvent<HTMLInputElement>) => void;
		onBlur: (event: FocusEvent<HTMLInputElement>) => void;
		onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
	};
};

function clampCommitted(
	value: number | null,
	min: number | undefined,
	max: number | undefined,
): number | null {
	if (value === null) return null;
	let next = value;
	if (min !== undefined) next = Math.max(next, min);
	if (max !== undefined) next = Math.min(next, max);
	return next;
}

/** Strip binary floating point noise (0.1 + 0.2 → 0.3) and normalize -0. */
function stripFloatNoise(value: number): number {
	const rounded = Number.parseFloat(value.toPrecision(12));
	return rounded === 0 ? 0 : rounded;
}

function formatCommitted(value: number | null): string {
	return value === null ? "" : String(value);
}

/**
 * Draft/commit behavior for a text input that accepts math expressions.
 * The raw expression stays visible while editing; blur or Enter evaluates
 * and replaces it with the result. Enter on a dirty draft is prevented so
 * a surrounding form cannot submit a stale value; a second Enter submits.
 */
export function useMathExpressionInput({
	value,
	defaultValue = null,
	min,
	max,
	required = false,
	disabled = false,
	readOnly = false,
	invalidExpressionMessage = "Enter a valid math expression",
	requiredMessage = "Enter a value",
	onValueCommitted,
}: UseMathExpressionInputOptions): UseMathExpressionInputReturn {
	const isControlled = value !== undefined;
	const [uncontrolledValue, setUncontrolledValue] = useState<number | null>(defaultValue);
	const [draft, setDraft] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	// ADR 0009: one pure effective value for display, commits, and callbacks.
	// An out-of-range prop or default renders clamped without emitting a change.
	const committedValue = clampCommitted(isControlled ? value : uncontrolledValue, min, max);
	const displayValue = draft ?? formatCommitted(committedValue);

	function settle(next: number | null, expression: string, event: MathExpressionCommitEvent) {
		setDraft(null);
		setError(null);
		if (!isControlled) setUncontrolledValue(next);
		if (!Object.is(next, committedValue)) onValueCommitted?.(next, { expression, event });
	}

	function commit(event: MathExpressionCommitEvent) {
		if (draft === null || disabled || readOnly) return;
		const trimmed = draft.trim();
		if (trimmed === "") {
			if (required) {
				setError(requiredMessage);
				return;
			}
			settle(null, draft, event);
			return;
		}
		const result = evaluateMathExpression(trimmed);
		if (!result.ok) {
			setError(invalidExpressionMessage);
			return;
		}
		settle(clampCommitted(stripFloatNoise(result.value), min, max), draft, event);
	}

	return {
		displayValue,
		committedValue,
		error,
		isEditing: draft !== null,
		inputProps: {
			value: displayValue,
			inputMode: "text",
			disabled,
			readOnly,
			required,
			"aria-invalid": error !== null ? true : undefined,
			onChange: (event) => {
				setDraft(event.target.value);
				setError(null);
			},
			onBlur: (event) => {
				commit(event);
			},
			onKeyDown: (event) => {
				if (event.key === "Enter" && draft !== null) {
					// A dirty draft must commit before the form can submit;
					// the next Enter submits the committed value.
					event.preventDefault();
					commit(event);
					return;
				}
				if (event.key === "Escape" && draft !== null) {
					setDraft(null);
					setError(null);
				}
			},
		},
	};
}
```

- [ ] **Step 2: Add the story harness and story**

Modify `src/components/number-field/number-field.stories.tsx`. First replace the existing React type import and add the new imports at the top of the file (imports stay at the top of the module):

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field } from "@base-ui/react/field";
import { Input } from "@base-ui/react/input";
import * as stylex from "@stylexjs/stylex";
import { useEffect, useId, useState, type ReactNode } from "react";
import { Button } from "@/components/button/button";
import { fieldStyles, fieldInputStyles } from "@/components/field/field.stylex";
import { focusRing } from "@/styles/recipes/focus";
import {
	useMathExpressionInput,
	type UseMathExpressionInputOptions,
} from "@/hooks/use-math-expression-input";
import { tokens } from "@/theme/tokens.stylex";

import { NumberField } from "./number-field";
```

Then append the following after the `States` story and the existing `StateSpecimen` helper (before the `styles` declaration), leaving everything already in the file unchanged:

```tsx
type MathExpressionFieldProps = UseMathExpressionInputOptions & {
	label: string;
	description?: string;
	/** Submits the committed numeric value through a hidden input. */
	name?: string;
};

/**
 * Story-local harness: Base UI NumberField filters expression characters at
 * the keystroke level, so the hook attaches to a plain text input instead.
 */
function MathExpressionField({ label, description, name, ...options }: MathExpressionFieldProps) {
	const { committedValue, error, inputProps } = useMathExpressionInput(options);
	const id = useId();
	const descriptionId = description ? `${id}-description` : undefined;
	const errorId = error ? `${id}-error` : undefined;

	return (
		<Field.Root
			{...stylex.props(fieldStyles.root)}
			disabled={options.disabled}
			invalid={Boolean(error)}
		>
			<Field.Label htmlFor={id} {...stylex.props(fieldStyles.label)}>
				{label}
			</Field.Label>
			<Input
				id={id}
				aria-describedby={[descriptionId, errorId].filter(Boolean).join(" ") || undefined}
				{...stylex.props(fieldInputStyles.md, focusRing.inset)}
				{...inputProps}
			/>
			{name ? <input type="hidden" name={name} value={committedValue ?? ""} /> : null}
			{description ? (
				<Field.Description id={descriptionId} {...stylex.props(fieldStyles.description)}>
					{description}
				</Field.Description>
			) : null}
			{error ? (
				<Field.Error id={errorId} match {...stylex.props(fieldStyles.error)}>
					{error}
				</Field.Error>
			) : null}
		</Field.Root>
	);
}

function MathExpressionFormExample() {
	const [submitted, setSubmitted] = useState<string | null>(null);
	return (
		<form
			{...stylex.props(styles.mathExample)}
			onSubmit={(event) => {
				event.preventDefault();
				const data = new FormData(event.currentTarget);
				setSubmitted(String(data.get("quantity")));
			}}
		>
			<MathExpressionField label="Quantity" name="quantity" defaultValue={4} />
			<Button type="submit">Submit</Button>
			<p {...stylex.props(styles.mathStatus)}>
				{submitted === null ? "Not submitted" : `Submitted: ${submitted}`}
			</p>
		</form>
	);
}

function MathExpressionControlledExample() {
	const [value, setValue] = useState<number | null>(10);
	const [commits, setCommits] = useState(0);
	const [tick, setTick] = useState(0);
	useEffect(() => {
		const interval = setInterval(() => setTick((current) => current + 1), 700);
		return () => clearInterval(interval);
	}, []);
	return (
		<div {...stylex.props(styles.mathExample)}>
			<p {...stylex.props(styles.mathStatus)}>{`Tick: ${tick}`}</p>
			<p {...stylex.props(styles.mathStatus)}>{`Commits: ${commits}`}</p>
			<MathExpressionField
				label="Controlled amount"
				value={value}
				onValueCommitted={(next) => {
					setValue(next);
					setCommits((current) => current + 1);
				}}
			/>
			<Button onClick={() => setValue(42)}>Set to 42</Button>
		</div>
	);
}

export const MathExpressions: Story = {
	name: "Math expressions",
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(styles.stateGrid)}>
			<StateSpecimen label="Evaluates on blur or Enter">
				<MathExpressionField
					label="Amount"
					defaultValue={12}
					description="Type an expression such as 100 / 5."
				/>
			</StateSpecimen>
			<StateSpecimen label="Clamped between 0 and 50">
				<MathExpressionField label="Clamped amount" defaultValue={10} min={0} max={50} />
			</StateSpecimen>
			<StateSpecimen label="Required">
				<MathExpressionField label="Required amount" defaultValue={5} required />
			</StateSpecimen>
			<StateSpecimen label="Read-only and disabled">
				<MathExpressionField label="Read-only" defaultValue={20} readOnly />
				<MathExpressionField label="Disabled" defaultValue={20} disabled />
			</StateSpecimen>
			<StateSpecimen label="Form submission">
				<MathExpressionFormExample />
			</StateSpecimen>
			<StateSpecimen label="Controlled with external updates">
				<MathExpressionControlledExample />
			</StateSpecimen>
		</div>
	),
};
```

Finally, add these two entries inside the existing `styles = stylex.create({ ... })` object (keep the current entries unchanged):

```tsx
	mathExample: {
		gap: tokens["--space-3"],
		alignItems: "flex-start",
		display: "flex",
		flexDirection: "column",
	},
	mathStatus: {
		margin: 0,
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-1"],
		lineHeight: tokens["--line-height-1"],
	},
```

Note: `MathExpressions` renders no args, so `Story` typing from `StoryObj<typeof meta>` is satisfied with the `render`-only story; controls are disabled per the comparison-story rule. If `Button` props differ from this plan (check `src/components/button/button.tsx`), adjust the story usage, not the hook.

- [ ] **Step 3: Verify builds and lint**

Run each independently:

```bash
npm run build
npm run lint
npm run build-storybook
```

Expected: all pass with no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/hooks/use-math-expression-input.ts src/components/number-field/number-field.stories.tsx
git commit -m "Add math expression input hook with NumberField story harness"
```

---

### Task 3: Browser coverage and validation

**Files:**

- Test: `tests/components/number-field-math-expressions.spec.ts`

**Interfaces:**

- Consumes: story id `components-number-field--math-expressions`; labels `Amount`, `Clamped amount`, `Required amount`, `Read-only`, `Disabled`, `Quantity`, `Controlled amount`; messages `Enter a valid math expression`, `Enter a value`; status texts `Tick: N`, `Commits: N`, `Not submitted`, `Submitted: 42` (all defined in Task 2).
- Produces: nothing new; final validation gate.

- [ ] **Step 1: Write the browser spec**

Create `tests/components/number-field-math-expressions.spec.ts` (console-error capture matches `tests/experimental/rating.spec.ts`):

```ts
import { expect, test, type Page } from "@playwright/test";

const storyPath = "/iframe.html?id=components-number-field--math-expressions&viewMode=story";
const consoleErrorsByPage = new WeakMap<Page, string[]>();

test.beforeEach(({ page }) => {
	const consoleErrors: string[] = [];
	consoleErrorsByPage.set(page, consoleErrors);
	page.on("console", (message) => {
		if (message.type() === "error") consoleErrors.push(message.text());
	});
});

test.afterEach(({ page }) => {
	expect(consoleErrorsByPage.get(page)).toEqual([]);
});

test("keeps the raw expression while typing and evaluates on blur", async ({ page }) => {
	await page.goto(storyPath);
	const input = page.getByRole("textbox", { name: "Amount" });
	await expect(input).toHaveValue("12");

	await input.fill("");
	await input.pressSequentially("100 / 5");
	await expect(input).toHaveValue("100 / 5");
	await input.blur();
	await expect(input).toHaveValue("20");

	await input.fill("-(2.5 + 1.5) * 2");
	await input.blur();
	await expect(input).toHaveValue("-8");

	await input.fill("0.1 + 0.2");
	await input.blur();
	await expect(input).toHaveValue("0.3");
});

test("keeps invalid expressions visible with an error", async ({ page }) => {
	await page.goto(storyPath);
	const input = page.getByRole("textbox", { name: "Amount" });

	await input.fill("2 +");
	await input.blur();
	await expect(input).toHaveValue("2 +");
	await expect(input).toHaveAttribute("aria-invalid", "true");
	await expect(page.getByText("Enter a valid math expression")).toBeVisible();

	await input.fill("1 / 0");
	await expect(input).not.toHaveAttribute("aria-invalid", "true");
	await input.blur();
	await expect(input).toHaveValue("1 / 0");
	await expect(input).toHaveAttribute("aria-invalid", "true");
});

test("reverts the draft on Escape", async ({ page }) => {
	await page.goto(storyPath);
	const input = page.getByRole("textbox", { name: "Amount" });
	await input.fill("5 + 5");
	await input.press("Escape");
	await expect(input).toHaveValue("12");
	await expect(input).not.toHaveAttribute("aria-invalid", "true");
});

test("commits on Enter before the form submits", async ({ page }) => {
	await page.goto(storyPath);
	const input = page.getByRole("textbox", { name: "Quantity" });
	await input.fill("6 * 7");
	await input.press("Enter");
	await expect(input).toHaveValue("42");
	await expect(page.getByText("Not submitted")).toBeVisible();

	await input.press("Enter");
	await expect(page.getByText("Submitted: 42")).toBeVisible();
});

test("clamps committed values to min and max", async ({ page }) => {
	await page.goto(storyPath);
	const input = page.getByRole("textbox", { name: "Clamped amount" });
	await input.fill("2 * 100");
	await input.blur();
	await expect(input).toHaveValue("50");

	await input.fill("-10");
	await input.blur();
	await expect(input).toHaveValue("0");
});

test("blocks committing an empty draft when required", async ({ page }) => {
	await page.goto(storyPath);
	const input = page.getByRole("textbox", { name: "Required amount" });
	await input.fill("");
	await input.blur();
	await expect(input).toHaveValue("");
	await expect(input).toHaveAttribute("aria-invalid", "true");
	await expect(page.getByText("Enter a value")).toBeVisible();
});

test("preserves the draft across controlled rerenders and skips unchanged commits", async ({
	page,
}) => {
	await page.goto(storyPath);
	const input = page.getByRole("textbox", { name: "Controlled amount" });
	const tick = page.getByText(/^Tick: /);
	const commits = page.getByText(/^Commits: /);
	await expect(input).toHaveValue("10");

	await input.fill("");
	await input.pressSequentially("1+2");
	const initialTick = (await tick.textContent()) ?? "";
	await expect(tick).not.toHaveText(initialTick);
	await expect(input).toHaveValue("1+2");

	await input.blur();
	await expect(input).toHaveValue("3");
	await expect(commits).toHaveText("Commits: 1");

	await page.getByRole("button", { name: "Set to 42" }).click();
	await expect(input).toHaveValue("42");
	await expect(commits).toHaveText("Commits: 1");

	await input.fill("42 + 0");
	await input.blur();
	await expect(input).toHaveValue("42");
	await expect(commits).toHaveText("Commits: 1");
});

test("keeps disabled and read-only fields inert", async ({ page }) => {
	await page.goto(storyPath);
	await expect(page.getByRole("textbox", { name: "Disabled" })).toBeDisabled();
	const readOnly = page.getByRole("textbox", { name: "Read-only" });
	await expect(readOnly).toHaveJSProperty("readOnly", true);
	await expect(readOnly).toHaveValue("20");
});
```

- [ ] **Step 2: Build Storybook and run the spec**

Run: `npm run build-storybook && npx playwright test tests/components/number-field-math-expressions.spec.ts`
Expected: PASS (8 tests) with zero captured console errors. Fix any hook or story defects the spec exposes; do not weaken assertions to pass.

- [ ] **Step 3: Verify live Storybook**

A production build does not prove dev-transform behavior. Run `npm run storybook`, open `Components/Number field/Math expressions`, and verify: expressions evaluate on blur and Enter; the error row appears and disappears; the existing NumberField stories (`Playground`, `Formatting`, `Sizes`, `States`) are unaffected; no console errors in the browser devtools.

- [ ] **Step 4: Full validation sweep**

Run each independently and confirm all pass:

```bash
npm run build
npm run lint
npm run build-storybook
PLAYWRIGHT_SKIP_WEBSERVER=1 npx playwright test tests/components/math-expression-evaluator.spec.ts
npx playwright test tests/components/number-field-math-expressions.spec.ts
```

Report any unrelated failures instead of modifying concurrent work (several files in the working tree are mid-flight from other tasks).

- [ ] **Step 5: Commit**

```bash
git add tests/components/number-field-math-expressions.spec.ts
git commit -m "Add math expression story browser coverage"
```

---

## Deferred (explicitly out of scope)

- No changes to `NumberField`, `TextField`, or `InputGroup` component source. Base UI's NumberField input rejects expression characters by design; do not patch around it.
- No public export of the hook and no standalone `MathInput` component. When a real product surface needs this behavior, promote the story harness into a component (experimental or public) and move its markup out of the stories file.
- No exponent syntax, implicit multiplication, or identifier support in the evaluator.
