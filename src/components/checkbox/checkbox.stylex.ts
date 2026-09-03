import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { textStyles, fontWeightStyles } from "@/components/text/text.stylex";
import { media } from "@/styles/constants.stylex";
import { tokens } from "@/theme/tokens.stylex";

export type CheckboxSize = "sm" | "md";

const ENABLED_ACTIVE = ":active:not([data-disabled],[data-readonly])";
const UNSELECTED_HOVER =
	":hover:not([data-disabled],[data-readonly]):not(:has([data-checked],[data-indeterminate],[data-invalid]))";
const UNSELECTED_ACTIVE =
	":active:not([data-disabled],[data-readonly]):not(:has([data-checked],[data-indeterminate],[data-invalid]))";
const ENABLED_SELECTED_HOVER =
	":hover:not([data-disabled],[data-readonly]):has([data-checked]:not([data-invalid]), [data-indeterminate]:not([data-invalid]))";
const ENABLED_SELECTED_ACTIVE =
	":active:not([data-disabled],[data-readonly]):has([data-checked]:not([data-invalid]), [data-indeterminate]:not([data-invalid]))";

/** Marker for Checkbox labels so their interaction styles remain component-owned. */
export const checkboxLabelMarker = stylex.defineMarker();

export const checkboxControlSizeStyles = stylex.create({
	sm: {
		height: tokens["--size-indicator-sm"],
		width: tokens["--size-indicator-sm"],
	},
	md: {
		height: tokens["--size-indicator-md"],
		width: tokens["--size-indicator-md"],
	},
});

export const checkboxLabelStyles = {
	sm: textStyles.supporting,
	md: textStyles.label,
} as const satisfies Record<CheckboxSize, StyleXStyles>;

export const checkboxDescriptionStyles = stylex.create({
	sm: {
		paddingInlineStart: `calc(${tokens["--size-indicator-sm"]} + ${tokens["--space-2"]} + 2px)`,
	},
	md: {
		paddingInlineStart: `calc(${tokens["--size-indicator-md"]} + ${tokens["--space-2"]} + 2px)`,
	},
});

const checkboxParts = stylex.create({
	group: {
		margin: 0,
		padding: 0,
		borderWidth: 0,
		gap: tokens["--space-2"],
		display: "flex",
		flexDirection: "column",
		minInlineSize: 0,
	},
	groupLabel: {
		color: {
			"[data-disabled]": tokens["--fg-subtle"],
			default: tokens["--fg"],
		},
	},
	legend: {
		padding: 0,
	},
	groupDescription: {
		color: tokens["--fg-muted"],
		marginBlockEnd: tokens["--space-2"],
	},
	item: {
		gap: 0,
		color: {
			"[data-disabled]": tokens["--fg-subtle"],
			default: tokens["--fg"],
		},
		cursor: {
			"[data-disabled]": "not-allowed",
			default: "default",
		},
		display: "flex",
		flexDirection: "column",
		width: "fit-content",
	},
	labelRoot: {
		gap: tokens["--space-2"],
		alignItems: "flex-start",
		color: {
			"[data-disabled]": tokens["--fg-subtle"],
			"[data-readonly]": tokens["--fg-muted"],
			default: tokens["--fg"],
		},
		cursor: "inherit",
		display: "inline-flex",
	},
	control: {
		padding: 2,
		borderColor: {
			"[data-checked]": tokens["--border"],
			"[data-checked][data-disabled]": tokens["--border"],
			"[data-disabled]": tokens["--border-disabled"],
			"[data-indeterminate]": tokens["--bg-primary"],
			"[data-indeterminate][data-disabled]": tokens["--border"],
			"[data-indeterminate][data-readonly]": tokens["--border-input"],
			"[data-invalid]": tokens["--fg-error"],
			"[data-readonly]": tokens["--border-input"],
			default: tokens["--border-input"],
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports ancestor conditions; the lint rule is stricter than the compiler.
			[stylex.when.ancestor(UNSELECTED_HOVER, checkboxLabelMarker)]: {
				[media.canHover]: tokens["--border-input-hover"],
			},
			[stylex.when.ancestor(UNSELECTED_ACTIVE, checkboxLabelMarker)]:
				tokens["--border-input-hover"],
		},
		borderRadius: tokens["--radius-xs"],
		borderStyle: "solid",
		borderWidth: "1px",
		alignItems: "center",
		backgroundColor: {
			"[data-checked]": tokens["--bg-primary"],
			"[data-checked][data-disabled]": tokens["--surface-subtle"],
			"[data-checked][data-invalid]": tokens["--bg-error-primary"],
			"[data-checked][data-readonly]": tokens["--surface"],
			"[data-indeterminate]": tokens["--surface"],
			"[data-readonly]": tokens["--surface"],
			default: tokens["--surface"],
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports ancestor conditions; the lint rule is stricter than the compiler.
			[stylex.when.ancestor(UNSELECTED_HOVER, checkboxLabelMarker)]: {
				[media.canHover]: tokens["--surface-subtle"],
			},
			[stylex.when.ancestor(UNSELECTED_ACTIVE, checkboxLabelMarker)]:
				tokens["--surface-subtle-active"],
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports ancestor conditions; the lint rule is stricter than the compiler.
			[stylex.when.ancestor(ENABLED_SELECTED_HOVER, checkboxLabelMarker)]: {
				[media.canHover]: tokens["--bg-primary-hover"],
			},
			[stylex.when.ancestor(ENABLED_SELECTED_ACTIVE, checkboxLabelMarker)]: tokens["--bg-primary"],
		},
		display: "inline-flex",
		flexShrink: 0,
		justifyContent: "center",
		marginBlockStart: 1,
		position: "relative",
		transform: {
			"[data-disabled]": "scale(1)",
			"[data-readonly]": "scale(1)",
			default: "scale(1)",
			[stylex.when.ancestor(ENABLED_ACTIVE, checkboxLabelMarker)]: "scale(0.94)",
		},
		willChange: "transform",
		"::after": {
			inset: 0,
			borderRadius: `calc(${tokens["--radius-xs"]} - 1px)`,
			boxShadow: `0 -1px 0 ${tokens["--color-white-a3"]}, 0 1px ${tokens["--color-black-a2"]}`,
			content: "''",
			position: "absolute",
			zIndex: 1,
		},
	},
	indicator: {
		alignItems: "center",
		color: {
			"[data-disabled]": tokens["--fg-subtle"],
			"[data-indeterminate]": tokens["--bg-primary"],
			"[data-invalid]": tokens["--fg-accent-contrast"],
			"[data-readonly]": tokens["--fg"],
			default: tokens["--fg-accent-contrast"],
		},
		display: "flex",
		filter: {
			"[data-disabled]": null,
			default: `drop-shadow(0 1px 1px ${tokens["--color-black-a3"]})`,
		},
		justifyContent: "center",
		marginInlineStart: 0.5,
		height: "100%",
		width: "100%",
	},
	indicatorTransition: {
		opacity: {
			"[data-ending-style]": 0,
			"[data-starting-style]": 1,
			default: 1,
		},
		transform: {
			"[data-ending-style]": "scale(0)",
			"[data-starting-style]": "scale(0.5)",
			default: "scale(1)",
		},
		transitionDuration: tokens["--motion-duration-medium"],
		transitionProperty: "transform, opacity",
		transitionTimingFunction: tokens["--motion-ease-out"],
		willChange: "transform, opacity",
	},
	description: {
		margin: 0,
		color: tokens["--fg-muted"],
	},
	requiredIndicator: {
		color: tokens["--fg-error"],
		marginInlineStart: tokens["--space-1"],
	},
});

export const checkboxStyles = {
	group: checkboxParts.group,
	groupLabel: [textStyles.body, fontWeightStyles.semibold, checkboxParts.groupLabel],
	legend: checkboxParts.legend,
	groupDescription: [textStyles.supporting, checkboxParts.groupDescription],
	item: checkboxParts.item,
	labelRoot: [checkboxLabelMarker, checkboxParts.labelRoot],
	control: checkboxParts.control,
	indicator: checkboxParts.indicator,
	indicatorTransition: checkboxParts.indicatorTransition,
	description: [textStyles.supporting, checkboxParts.description],
	requiredIndicator: checkboxParts.requiredIndicator,
} as const;
