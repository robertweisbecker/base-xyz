import * as stylex from "@stylexjs/stylex";
import type { FieldSize, FieldThemeProps } from "@/components/field/field.types";
import { textStyles, textWeightStyles } from "@/components/text/text.stylex";
import { breakpoints } from "@/styles/constants.stylex";
import { composeThemeProps, type ThemePropDefinition, type VerifyThemeProps } from "@/theme/theme-props";
import {
	childLayoutThemeProps,
	displayThemeProps,
	positioningThemeProps,
	sizingThemeProps,
	verticalFlexThemeProps,
} from "@/theme/theme-props-layout.stylex";
import { spacingThemeProps } from "@/theme/theme-props-spacing.stylex";
import { radiusThemeProps, shadowThemeProps } from "@/theme/theme-props-surface.stylex";
import { tokens } from "@/theme/tokens.stylex";


const INTERACTIVE_CONTROL_HOVER =
	':hover:not(:focus-within):not([aria-invalid="true"]):not([data-active]):not([data-disabled]):not([data-invalid]):not([data-panel-open]):not([data-popup-open]):not([data-pressed]):not([data-readonly]):not([readonly])';

const fieldThemePropsDefinition = composeThemeProps(
	spacingThemeProps,
	sizingThemeProps,
	positioningThemeProps,
	childLayoutThemeProps,
	radiusThemeProps,
	shadowThemeProps,
	verticalFlexThemeProps,
	displayThemeProps,
);

export const fieldThemeProps: ThemePropDefinition<VerifyThemeProps<FieldThemeProps, typeof fieldThemePropsDefinition>> =
	fieldThemePropsDefinition;

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
		opacity: {
			"[data-disabled]": 0.5,
			default: 1,
			[stylex.when.ancestor('[aria-disabled="true"]')]: 0.5,
		},
	},
	groupLabel: {
		opacity: {
			"[data-disabled]": 0.5,
			default: 1,
			[stylex.when.ancestor('[aria-disabled="true"]')]: 0.5,
		},
	},
	itemLabel: {},
	description: { color: tokens["--fg-muted"] },
	error: {
		gap: tokens["--space-1"],
		alignItems: "center",
		color: tokens["--fg-error"],
		display: "inline-flex",
	},
	requiredIndicator: {
		color: tokens["--fg-error"],
		marginInlineStart: tokens["--space-1"],
	},
	inputBase: {
		borderColor: {
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[INTERACTIVE_CONTROL_HOVER]: {
				"@media (hover: hover) and (pointer: fine)": tokens["--border-input-hover"],
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
			"[data-disabled]": "transparent",
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
			[stylex.when.ancestor('[data-disabled="true"]')]: 0.5,
		},
		width: "100%",
	},
	inputUnstyled: {
		outline: {
			default: "none",
			[stylex.when.ancestor(":focus-visible")]: "none",
			[stylex.when.anySibling(":focus-visible")]: "none",
			":focus-visible": "none",
		},
		color: {
			"[data-disabled]": tokens["--fg-subtle"],
			"[data-readonly]": tokens["--fg"],
			"[readonly]": tokens["--fg"],
			default: tokens["--fg"],
			[stylex.when.ancestor('[aria-readonly="true"]')]: tokens["--fg"],
			[stylex.when.ancestor("[data-readonly]")]: tokens["--fg"],
		},
		"::placeholder": {
			color: tokens["--fg-muted"],
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
	description: [textStyles.supporting, parts.description],
	error: [textStyles.supporting, parts.error],
	requiredIndicator: parts.requiredIndicator,
	inputBase: parts.inputBase,
	inputUnstyled: parts.inputUnstyled,
	inputStandard: parts.inputStandard,
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
		paddingInlineStart: tokens["--space-3"],
	},
	lg: {
		paddingBlock: tokens["--space-2"],
		paddingInlineEnd: tokens["--space-3"],
		paddingInlineStart: tokens["--space-4"],
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
		letterSpacing: tokens["--letter-spacing-3"],
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
