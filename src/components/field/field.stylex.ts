import * as stylex from "@stylexjs/stylex";
import type { FieldSize } from "@/components/field/field.types";
import { textStyles, fontWeightStyles } from "@/components/text/text.stylex";
import { breakpoints, media } from "@/styles/constants.stylex";
import { tokens } from "@/theme/tokens.stylex";

/** Marker for label elements associated with form controls. */
export const labelMarker = stylex.defineMarker();

/** Marker for Field roots observed by descendant form-control styles. */
export const fieldMarker = stylex.defineMarker();

const INTERACTIVE_CONTROL_HOVER =
	':hover:not(:focus-within):not([aria-invalid="true"]):not([data-active]):not([data-disabled]):not([data-invalid]):not([data-panel-open]):not([data-popup-open]):not([data-pressed]):not([data-readonly]):not([readonly])';

/**
 * Canonical styles for the Field component family.
 *
 * Apply one export per element role:
 *
 * | Element                                   | Export                     |
 * | ----------------------------------------- | -------------------------- |
 * | `Field.Root`                              | `fieldStyles.root`               |
 * | `Field.Label` / group / item labels       | `fieldStyles.label` etc.         |
 * | `Field.Description`                       | `fieldStyles.description`        |
 * | `Field.Error`                             | `fieldStyles.error`              |
 * | Text input (`input`, `textarea`)          | `fieldInputStyles[size]`         |
 * | Button-like trigger (select, combobox)    | `fieldControlStyles[size]`       |
 *
 * Borrowing components compose these styles before their local structural
 * styles and caller-provided overrides. The granular exports below the bundles
 * support irregular field controls such as NumberField and InputGroup.
 */
const parts = stylex.create({
	root: {
		gap: tokens["--space-1"],
		display: "flex",
		flexDirection: "column",
		minWidth: 0,
	},
	label: {
		color: {
			"[data-disabled]": tokens["--fg-subtle"],
			default: tokens["--fg"],
		},
		lineHeight: tokens["--line-height-2"],
	},
	groupLabel: {
		color: {
			"[data-disabled]": tokens["--fg-subtle"],
			default: tokens["--fg"],
		},
	},
	description: { color: tokens["--fg-muted"] },
	error: {
		gap: tokens["--space-1"],
		alignItems: "center",
		color: tokens["--fg-error"],
		display: "inline-flex",
		opacity: {
			"[data-ending-style]": 1,
			"[data-starting-style]": 0,
			default: 1,
		},
		transform: {
			"[data-ending-style]": "translateY(0)",
			"[data-starting-style]": "translateY(-4px)",
			default: "translateY(0)",
		},
		transitionDuration: tokens["--motion-duration-short"],
		transitionProperty: "opacity, transform",
		transitionTimingFunction: tokens["--motion-ease-out"],
	},
	requiredIndicator: {
		color: tokens["--fg-error"],
		marginInlineStart: tokens["--space-1"],
	},
	input: {
		borderColor: {
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[INTERACTIVE_CONTROL_HOVER]: {
				[media.canHover]: tokens["--border-input-hover"],
			},
			"[data-disabled]": tokens["--border-disabled"],
			"[data-invalid]": tokens["--bg-error-primary"],
			"[data-popup-open]": tokens["--border-input-hover"],
			"[data-readonly]": tokens["--border"],
			default: tokens["--border-input"],
		},
		borderStyle: "solid",
		borderWidth: "1px",
		backgroundColor: {
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[INTERACTIVE_CONTROL_HOVER]: {
				[media.canHover]: tokens["--panel"],
			},
			"[data-disabled]": tokens["--bg-disabled"],
			default: tokens["--surface"],
		},
		color: {
			"[data-disabled]": tokens["--fg-muted"],
			"[data-readonly]": tokens["--fg"],
			default: tokens["--fg"],
		},
		cursor: {
			"[data-disabled]": "not-allowed",
			default: null,
		},
		opacity: {
			"[data-disabled]": 0.5,
			default: 1,
			[stylex.when.ancestor("[data-disabled]", fieldMarker)]: 0.5,
		},
		width: "100%",
	},
	inputUnstyled: {
		outline: "none",
		color: {
			"[data-disabled]": tokens["--fg-subtle"],
			"[data-readonly]": tokens["--fg"],
			"[readonly]": tokens["--fg"],
			default: tokens["--fg"],
		},
		"::placeholder": {
			color: tokens["--fg-muted"],
		},
	},
	inputDefault: {
		cursor: {
			"[data-disabled]": "not-allowed",
			"[data-readonly]": "default",
			"[readonly]": "default",
			default: "text", // necessary since this style gets applied to InputGroup (a div) too
		},
		"::placeholder": {
			color: tokens["--fg-placeholder"],
		},
	},
});

export const fieldStyles = {
	root: [fieldMarker, parts.root],
	label: [labelMarker, textStyles.supporting, fontWeightStyles.medium, parts.label],
	groupLabel: [textStyles.body, fontWeightStyles.semibold, parts.groupLabel],
	itemLabel: textStyles.label,
	description: [textStyles.supporting, parts.description],
	error: [textStyles.supporting, parts.error],
	requiredIndicator: parts.requiredIndicator,
	input: parts.input,
	inputUnstyled: parts.inputUnstyled,
	inputDefault: parts.inputDefault,
} as const;

/** Shared row/column layout for CheckboxGroup and RadioGroup. */
export const fieldChoiceGroupStyles = stylex.create({
	root: {
		alignItems: "stretch",
		columnGap: tokens["--space-3"],
		display: "flex",
		flexDirection: "column",
		flexWrap: "nowrap",
		rowGap: tokens["--space-3"],
	},
	inline: {
		alignItems: "start",
		columnGap: tokens["--space-6"],
		flexDirection: "row",
		flexWrap: "wrap",
	},
});

export const fieldControlSizes = stylex.create({
	sm: {
		borderRadius: tokens["--radius-md"],
		cornerShape: "superellipse(1.6)",
		height: tokens["--size-control-sm"],
		minHeight: tokens["--size-control-sm"],
	},
	md: {
		borderRadius: tokens["--radius-md"],
		cornerShape: "superellipse(1.3)",
		height: tokens["--size-control-md"],
		minHeight: tokens["--size-control-md"],
	},
	lg: {
		borderRadius: tokens["--radius-lg"],
		cornerShape: "superellipse(1.6)",
		height: tokens["--size-control-lg"],
		minHeight: tokens["--size-control-lg"],
	},
});

export const fieldPaddingSizes = stylex.create({
	sm: {
		paddingBlock: tokens["--space-1"],
		paddingInlineEnd: tokens["--space-2"],
		paddingInlineStart: tokens["--space-2"],
	},
	md: {
		paddingBlock: tokens["--space-1-5"],
		paddingInlineEnd: tokens["--space-2"],
		paddingInlineStart: tokens["--space-2"],
	},
	lg: {
		paddingBlock: tokens["--space-2"],
		paddingInlineEnd: tokens["--space-3"],
		paddingInlineStart: tokens["--space-3"],
	},
});

const fieldFontSizes = stylex.create({
	responsive: {
		fontSize: {
			default: tokens["--font-size-3"],
			[breakpoints.sm]: tokens["--font-size-2"],
		},
		letterSpacing: {
			default: tokens["--letter-spacing-3"],
			[breakpoints.sm]: tokens["--letter-spacing-2"],
		},
		lineHeight: {
			default: tokens["--line-height-3"],
			[breakpoints.sm]: tokens["--line-height-2"],
		},
	},
	lg: {
		fontSize: tokens["--font-size-3"],
		letterSpacing: "normal",
		lineHeight: tokens["--line-height-3"],
	},
});

export const fieldTextStyles = {
	sm: fieldFontSizes.responsive,
	md: fieldFontSizes.responsive,
	lg: fieldFontSizes.lg,
} as const satisfies Record<FieldSize, (typeof fieldFontSizes)[keyof typeof fieldFontSizes]>;

/** Apply to a text input (`input`, `textarea`): surface, text cursor, sizing. */
export const fieldInputStyles = {
	sm: [
		fieldStyles.input,
		fieldStyles.inputUnstyled,
		fieldStyles.inputDefault,
		fieldTextStyles.sm,
		fieldControlSizes.sm,
		fieldPaddingSizes.sm,
	],
	md: [
		fieldStyles.input,
		fieldStyles.inputUnstyled,
		fieldStyles.inputDefault,
		fieldTextStyles.md,
		fieldControlSizes.md,
		fieldPaddingSizes.md,
	],
	lg: [
		fieldStyles.input,
		fieldStyles.inputUnstyled,
		fieldStyles.inputDefault,
		fieldTextStyles.lg,
		fieldControlSizes.lg,
		fieldPaddingSizes.lg,
	],
} as const satisfies Record<FieldSize, unknown>;

/** Apply to a button-like field trigger (select, combobox): surface and sizing without the text cursor. */
export const fieldControlStyles = {
	sm: [
		fieldStyles.input,
		fieldStyles.inputUnstyled,
		fieldTextStyles.sm,
		fieldControlSizes.sm,
		fieldPaddingSizes.sm,
	],
	md: [
		fieldStyles.input,
		fieldStyles.inputUnstyled,
		fieldTextStyles.md,
		fieldControlSizes.md,
		fieldPaddingSizes.md,
	],
	lg: [
		fieldStyles.input,
		fieldStyles.inputUnstyled,
		fieldTextStyles.lg,
		fieldControlSizes.lg,
		fieldPaddingSizes.lg,
	],
} as const satisfies Record<FieldSize, unknown>;
