import { useState, type ChangeEvent, type FocusEvent, type KeyboardEvent } from "react";
import { evaluateMathExpression } from "@/utils/evaluate-math-expression";

export type MathExpressionCommitEvent = FocusEvent<HTMLInputElement> | KeyboardEvent<HTMLInputElement>;

export type UseMathExpressionInputOptions = {
	/** Controlled committed value. `null` means intentionally empty. */
	value?: number | null;
	defaultValue?: number | null;
	min?: number;
	max?: number;
	required?: boolean;
	disabled?: boolean;
	readOnly?: boolean;
	/** Mobile keyboard hint. Defaults to `decimal` for numeric entry; use `text` when operators should stay on the primary keyboard. */
	inputMode?: "decimal" | "numeric" | "text";
	/** Error shown when the draft cannot be evaluated. */
	invalidExpressionMessage?: string;
	/** Error shown when the draft is empty but a value is required. */
	requiredMessage?: string;
	/** Called once per user-initiated commit whose numeric result differs from the current value. */
	onValueCommitted?: (value: number | null, details: { expression: string; event: MathExpressionCommitEvent }) => void;
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
		inputMode: "decimal" | "numeric" | "text";
		disabled: boolean;
		readOnly: boolean;
		required: boolean;
		"aria-invalid": true | undefined;
		onChange: (event: ChangeEvent<HTMLInputElement>) => void;
		onBlur: (event: FocusEvent<HTMLInputElement>) => void;
		onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
	};
};

function clampCommitted(value: number | null, min: number | undefined, max: number | undefined): number | null {
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
	inputMode = "decimal",
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
			inputMode,
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
