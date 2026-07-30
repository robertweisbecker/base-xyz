import * as stylex from "@stylexjs/stylex";
import { textColorStyles, textStyles, textWeightStyles } from "@/components/text/text.stylex";
import { breakpoints } from "@/styles/constants.stylex";
import { color, radius, size, space } from "@/styles/tokens.stylex";
import { fontSize, letterSpacing, lineHeight } from "@/styles/tokens.stylex";

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
		gap: space.x1,
		display: "flex",
		flexDirection: "column",
		minWidth: 0,
	},
	label: {},
	groupLabel: {
		opacity: {
			default: 1,
			"[data-disabled]": 0.5,
			[stylex.when.ancestor('[aria-disabled="true"]')]: 0.5,
		},
	},
	itemLabel: {},
	description: {},
	error: {
		gap: space.x1,
		alignItems: "center",
		display: "inline-flex",
	},
	requiredIndicator: {
		color: color.fgDanger,
		marginInlineStart: space.x1,
	},
	inputBase: {
		borderColor: {
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[INTERACTIVE_CONTROL_HOVER]: {
				"@media (hover: hover) and (pointer: fine)": color.borderHover,
			},
			"[data-invalid]": color.bgDanger,
			"[data-popup-open]": color.borderHover,
			"[data-readonly]": color.border,
			default: color.borderStrong,
		},
		borderStyle: "solid",
		borderWidth: "1px",
		backgroundColor: {
			"[data-disabled]": color.surfaceSubtle,
			default: color.surface,
		},
		color: {
			"[data-disabled]": color.fgMuted,
			"[data-readonly]": color.fg,
			default: color.fg,
		},
		cursor: {
			"[data-disabled]": "not-allowed",
			default: null,
		},
		width: "100%",
	},
	inputUnstyled: {
		color: {
			"[data-disabled]": color.fgMuted,
			"[data-readonly]": color.fg,
			"[readonly]": color.fg,
			default: color.fg,
			[stylex.when.ancestor('[aria-readonly="true"]')]: color.fg,
			[stylex.when.ancestor("[data-readonly]")]: color.fg,
		},
		"::placeholder": {
			color: color.fgMuted,
		},
		outline: {
			default: "none",
			[stylex.when.ancestor(":focus-visible")]: "none",
			[stylex.when.anySibling(":focus-visible")]: "none",
			":focus-visible": "none",
		},
	},
	inputStandard: {
		cursor: {
			"[data-disabled]": "not-allowed",
			"[data-readonly]": "default",
			"[readonly]": "default",
			default: "text", // necessary since this style gets applied to InputGroup (a div) too
		},
		"::placeholder": {
			opacity: 0.72,
		},
	},
});

export const fieldStyles = {
	root: parts.root,
	label: [textStyles.supporting, textWeightStyles.medium, parts.label],
	groupLabel: [textStyles.body, textWeightStyles.semibold, parts.groupLabel],
	itemLabel: [textStyles.label, parts.itemLabel],
	description: [textStyles.supporting, textColorStyles.muted, parts.description],
	error: [textStyles.supporting, textColorStyles.danger, parts.error],
	requiredIndicator: parts.requiredIndicator,
	inputBase: parts.inputBase,
	inputUnstyled: parts.inputUnstyled,
	inputStandard: parts.inputStandard,
} as const;

export const fieldControlSizes = stylex.create({
	sm: {
		borderRadius: radius.sm,
		height: size["control.sm"],
		minHeight: size["control.sm"],
	},
	md: {
		borderRadius: radius.md,
		height: size["control.md"],
		minHeight: size["control.md"],
	},
	lg: {
		borderRadius: radius.lg,
		height: size["control.lg"],
		minHeight: size["control.lg"],
	},
});

export const fieldPaddingSizes = stylex.create({
	sm: {
		paddingBlock: space.x2,
		paddingInline: space.x3,
	},
	md: {
		paddingBlock: space.x3,
		paddingInline: space.x3,
	},
	lg: {
		paddingBlock: space.x4,
		paddingInline: space.x5,
	},
});

const fieldFontSizes = stylex.create({
	responsive: {
		fontSize: {
			default: fontSize.x3,
			[breakpoints.sm]: fontSize.x2,
		},
		letterSpacing: {
			default: letterSpacing.x3,
			[breakpoints.sm]: letterSpacing.x2,
		},
		lineHeight: {
			default: lineHeight.x3,
			[breakpoints.sm]: lineHeight.x2,
		},
	},
	lg: {
		fontSize: fontSize.x3,
		letterSpacing: letterSpacing.x3,
		lineHeight: lineHeight.x3,
	},
});

export type FieldSize = keyof typeof fieldControlSizes;

export const fieldTextStyles = {
	sm: fieldFontSizes.responsive,
	md: fieldFontSizes.responsive,
	lg: fieldFontSizes.lg,
} as const satisfies Record<FieldSize, (typeof fieldFontSizes)[keyof typeof fieldFontSizes]>;

/** Apply to a text input (`input`, `textarea`): surface, text cursor, sizing. */
export const fieldInputStyles = {
	sm: [
		fieldStyles.inputBase,
		fieldStyles.inputUnstyled,
		fieldStyles.inputStandard,
		fieldTextStyles.sm,
		fieldControlSizes.sm,
		fieldPaddingSizes.sm,
	],
	md: [
		fieldStyles.inputBase,
		fieldStyles.inputUnstyled,
		fieldStyles.inputStandard,
		fieldTextStyles.md,
		fieldControlSizes.md,
		fieldPaddingSizes.md,
	],
	lg: [
		fieldStyles.inputBase,
		fieldStyles.inputUnstyled,
		fieldStyles.inputStandard,
		fieldTextStyles.lg,
		fieldControlSizes.lg,
		fieldPaddingSizes.lg,
	],
} as const satisfies Record<FieldSize, unknown>;

/** Apply to a button-like field trigger (select, combobox): surface and sizing without the text cursor. */
export const fieldControlStyles = {
	sm: [
		fieldStyles.inputBase,
		fieldStyles.inputUnstyled,
		fieldTextStyles.sm,
		fieldControlSizes.sm,
		fieldPaddingSizes.sm,
	],
	md: [
		fieldStyles.inputBase,
		fieldStyles.inputUnstyled,
		fieldTextStyles.md,
		fieldControlSizes.md,
		fieldPaddingSizes.md,
	],
	lg: [
		fieldStyles.inputBase,
		fieldStyles.inputUnstyled,
		fieldTextStyles.lg,
		fieldControlSizes.lg,
		fieldPaddingSizes.lg,
	],
} as const satisfies Record<FieldSize, unknown>;
