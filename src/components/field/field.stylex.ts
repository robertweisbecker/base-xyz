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
} from "@/styles/theme-props-layout.stylex";
import { spacingThemeProps } from "@/styles/theme-props-spacing.stylex";
import { radiusThemeProps, shadowThemeProps } from "@/styles/theme-props-surface.stylex";
import { colors, radius, size, space } from "@/styles/tokens.stylex";
import { fontSize, letterSpacing, lineHeight } from "@/styles/tokens.stylex";

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
		gap: space[1],
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
	description: { color: colors["--text-muted"] },
	error: {
		gap: space[1],
		alignItems: "center",
		color: colors["--text-danger"],
		display: "inline-flex",
	},
	requiredIndicator: {
		color: colors["--text-danger"],
		marginInlineStart: space[1],
	},
	inputBase: {
		borderColor: {
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[INTERACTIVE_CONTROL_HOVER]: {
				"@media (hover: hover) and (pointer: fine)": colors["--border-hover"],
			},
			"[data-disabled]": colors["--border-disabled"],
			"[data-invalid]": colors["--danger"],
			"[data-popup-open]": colors["--border-hover"],
			"[data-readonly]": colors["--border"],
			default: colors["--border-strong"],
		},
		borderStyle: "solid",
		borderWidth: "1px",
		backgroundColor: {
			"[data-disabled]": "transparent",
			default: colors["--surface"],
		},
		color: {
			"[data-disabled]": colors["--text-muted"],
			"[data-readonly]": colors["--text"],
			default: colors["--text"],
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
			"[data-disabled]": colors["--text-subtle"],
			"[data-readonly]": colors["--text"],
			"[readonly]": colors["--text"],
			default: colors["--text"],
			[stylex.when.ancestor('[aria-readonly="true"]')]: colors["--text"],
			[stylex.when.ancestor("[data-readonly]")]: colors["--text"],
		},
		"::placeholder": {
			color: colors["--text-muted"],
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
		columnGap: space[3],
		display: "flex",
		flexDirection: "column",
		flexWrap: "nowrap",
		rowGap: space[3],
	},
	inline: {
		alignItems: "start",
		columnGap: space[6],
		flexDirection: "row",
		flexWrap: "wrap",
	},
});

export const fieldControlSizes = stylex.create({
	sm: {
		borderRadius: radius.md,
		cornerShape: "superellipse(1.6)",
		height: size["control.sm"],
		minHeight: size["control.sm"],
	},
	md: {
		borderRadius: radius.md,
		cornerShape: "superellipse(1.3)",
		height: size["control.md"],
		minHeight: size["control.md"],
	},
	lg: {
		borderRadius: radius.lg,
		cornerShape: "superellipse(1.6)",
		height: size["control.lg"],
		minHeight: size["control.lg"],
	},
});

export const fieldPaddingSizes = stylex.create({
	sm: {
		paddingBlock: space[1],
		paddingInlineEnd: space[2],
		paddingInlineStart: space[2],
	},
	md: {
		paddingBlock: space[1.5],
		paddingInlineEnd: space[2],
		paddingInlineStart: space[3],
	},
	lg: {
		paddingBlock: space[2],
		paddingInlineEnd: space[3],
		paddingInlineStart: space[4],
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
