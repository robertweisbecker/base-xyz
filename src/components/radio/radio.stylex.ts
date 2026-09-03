import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { textStyles, fontWeightStyles } from "@/components/text/text.stylex";
import { media } from "@/styles/constants.stylex";
import { tokens } from "@/theme/tokens.stylex";

export type RadioSize = "sm" | "md";

const ENABLED_ACTIVE = ":active:not([data-disabled],[data-readonly])";
const UNSELECTED_HOVER = ":hover:not([data-disabled],[data-readonly]):not(:has([data-checked]))";
const UNSELECTED_ACTIVE = ":active:not([data-disabled],[data-readonly]):not(:has([data-checked]))";
const ENABLED_SELECTED_HOVER = ":hover:not([data-disabled],[data-readonly]):has([data-checked])";
const ENABLED_SELECTED_ACTIVE = ":active:not([data-disabled],[data-readonly]):has([data-checked])";

/** Marker for Radio labels so their interaction styles remain component-owned. */
export const radioLabelMarker = stylex.defineMarker();

export const radioControlSizeStyles = stylex.create({
	sm: {
		height: tokens["--size-indicator-sm"],
		width: tokens["--size-indicator-sm"],
	},
	md: {
		height: tokens["--size-indicator-md"],
		width: tokens["--size-indicator-md"],
	},
});

export const radioLabelStyles = {
	sm: textStyles.supporting,
	md: textStyles.label,
} as const satisfies Record<RadioSize, StyleXStyles>;

export const radioDescriptionStyles = stylex.create({
	sm: {
		paddingInlineStart: `calc(${tokens["--size-indicator-sm"]} + ${tokens["--space-2"]} + 2px)`,
	},
	md: {
		paddingInlineStart: `calc(${tokens["--size-indicator-md"]} + ${tokens["--space-2"]} + 2px)`,
	},
});

export const radioIndicatorSizeStyles = stylex.create({
	sm: {
		height: `calc((${tokens["--size-indicator-sm"]} - 2px) / 2)`,
		width: `calc((${tokens["--size-indicator-sm"]} - 2px) / 2)`,
	},
	md: {
		height: `calc((${tokens["--size-indicator-md"]} - 2px) / 2)`,
		width: `calc((${tokens["--size-indicator-md"]} - 2px) / 2)`,
	},
});

const radioParts = stylex.create({
	fieldset: {
		margin: 0,
		padding: 0,
		borderWidth: 0,
		gap: tokens["--space-3"],
		display: "flex",
		flexDirection: "column",
		minInlineSize: 0,
	},
	title: {
		gap: tokens["--space-1"],
		display: "flex",
		flexDirection: "column",
	},
	groupLabel: {
		color: {
			"[data-disabled]": tokens["--fg-subtle"],
			default: tokens["--fg"],
		},
	},
	groupDescription: {
		margin: 0,
		color: tokens["--fg-muted"],
	},
	item: {
		gap: tokens["--space-1"],
		cursor: {
			"[data-disabled]": "not-allowed",
			"[data-readonly]": "default",
			default: "default",
		},
		display: "flex",
		flexDirection: "column",
		opacity: {
			"[data-disabled]": 0.48,
			default: 1,
		},
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
		borderColor: {
			"[data-checked]": tokens["--bg-primary-highlight"],
			"[data-checked][data-disabled]": tokens["--bg-neutral"],
			"[data-checked][data-readonly]": tokens["--fg-muted"],
			"[data-disabled]": tokens["--border-disabled"],
			"[data-readonly]": tokens["--border"],
			default: tokens["--border-input"],
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports ancestor conditions; the lint rule is stricter than the compiler.
			[stylex.when.ancestor(UNSELECTED_HOVER, radioLabelMarker)]: {
				[media.canHover]: tokens["--border-input-hover"],
			},
			[stylex.when.ancestor(UNSELECTED_ACTIVE, radioLabelMarker)]: tokens["--bg-primary-highlight"],
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports ancestor conditions; the lint rule is stricter than the compiler.
			[stylex.when.ancestor(ENABLED_SELECTED_HOVER, radioLabelMarker)]: {
				[media.canHover]: tokens["--bg-primary-hover"],
			},
			[stylex.when.ancestor(ENABLED_SELECTED_ACTIVE, radioLabelMarker)]:
				tokens["--bg-primary-hover"],
		},
		borderRadius: tokens["--radius-full"],
		borderStyle: "solid",
		borderWidth: "1px",
		alignItems: "center",
		backgroundColor: {
			"[data-checked]": tokens["--bg-primary"],
			"[data-checked][data-disabled]": tokens["--bg-neutral"],
			"[data-checked][data-readonly]": tokens["--bg-neutral"],
			default: tokens["--surface"],
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports ancestor conditions; the lint rule is stricter than the compiler.
			[stylex.when.ancestor(UNSELECTED_HOVER, radioLabelMarker)]: {
				[media.canHover]: tokens["--surface-subtle"],
			},
			[stylex.when.ancestor(UNSELECTED_ACTIVE, radioLabelMarker)]:
				tokens["--surface-subtle-active"],
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports ancestor conditions; the lint rule is stricter than the compiler.
			[stylex.when.ancestor(ENABLED_SELECTED_HOVER, radioLabelMarker)]: {
				[media.canHover]: tokens["--bg-primary-hover"],
			},
			[stylex.when.ancestor(ENABLED_SELECTED_ACTIVE, radioLabelMarker)]:
				tokens["--bg-primary-hover"],
		},
		display: "inline-flex",
		flexShrink: 0,
		justifyContent: "center",
		marginBlockStart: "1px",
		position: "relative",
		transform: {
			"[data-disabled]": "scale(1)",
			"[data-readonly]": "scale(1)",
			default: "scale(1)",
			[stylex.when.ancestor(ENABLED_ACTIVE, radioLabelMarker)]: "scale(0.94)",
		},
		willChange: "transform",
		"::after": {
			inset: 0,
			borderRadius: "inherit",
			boxShadow: `0 -1px 0 ${tokens["--color-white-a3"]}, 0 1px 0 ${tokens["--color-black-a2"]}`,
			content: "''",
			position: "absolute",
			zIndex: 1,
		},
	},
	indicator: {
		borderRadius: tokens["--radius-full"],
		backgroundColor: tokens["--fg-accent-contrast"],
		boxShadow: `0 -1px 1px ${tokens["--color-gray-a2"]}, 0 1px 0 ${tokens["--color-black-a3"]}`,
	},
	indicatorTransition: {
		opacity: {
			"[data-ending-style]": 1,
			"[data-starting-style]": 0,
			default: 1,
		},
		transform: {
			"[data-ending-style]": "scale(0.5)",
			"[data-starting-style]": "scale(0.5)",
			default: "scale(1)",
		},
		transitionDuration: tokens["--motion-duration-quick"],
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

export const radioStyles = {
	fieldset: radioParts.fieldset,
	title: radioParts.title,
	groupLabel: [textStyles.body, fontWeightStyles.semibold, radioParts.groupLabel],
	groupDescription: [textStyles.supporting, radioParts.groupDescription],
	item: radioParts.item,
	labelRoot: [radioLabelMarker, radioParts.labelRoot],
	control: radioParts.control,
	indicator: radioParts.indicator,
	indicatorTransition: radioParts.indicatorTransition,
	description: [textStyles.supporting, radioParts.description],
	requiredIndicator: radioParts.requiredIndicator,
} as const;
