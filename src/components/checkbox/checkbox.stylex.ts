import * as stylex from "@stylexjs/stylex";
import { textStyles, fontWeightStyles } from "@/components/text/text.stylex";
import { media } from "@/styles/constants.stylex";
import { tokens } from "@/theme/tokens.stylex";

export type CheckboxSize = "sm" | "md";

const ENABLED_ACTIVE = ":active:not([data-disabled],[data-readonly])";
const UNSELECTED_HOVER =
	':hover:not([data-disabled],[data-readonly],[data-checked],[data-indeterminate],[data-invalid],[aria-invalid="true"])';
const UNSELECTED_ACTIVE =
	':active:not([data-disabled],[data-readonly],[data-checked],[data-indeterminate],[data-invalid],[aria-invalid="true"])';
const ENABLED_SELECTED_HOVER =
	':hover[data-checked]:not([data-disabled],[data-readonly],[data-invalid],[aria-invalid="true"])';
const ENABLED_SELECTED_ACTIVE =
	':active[data-checked]:not([data-disabled],[data-readonly],[data-invalid],[aria-invalid="true"])';
const ENABLED_INDETERMINATE_HOVER =
	':hover[data-indeterminate]:not([data-disabled],[data-readonly],[data-invalid],[aria-invalid="true"])';
const ENABLED_INDETERMINATE_ACTIVE =
	':active[data-indeterminate]:not([data-disabled],[data-readonly],[data-invalid],[aria-invalid="true"])';

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
	groupOptions: {
		alignItems: "stretch",
		columnGap: tokens["--space-3"],
		display: "flex",
		flexDirection: "column",
		flexWrap: "nowrap",
		rowGap: tokens["--space-3"],
	},
	groupOptionsInline: {
		alignItems: "start",
		columnGap: tokens["--space-6"],
		flexDirection: "row",
		flexWrap: "wrap",
	},
	control: {
		padding: 2,
		borderColor: {
			[ENABLED_INDETERMINATE_ACTIVE]: tokens["--bg-primary"],
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[ENABLED_INDETERMINATE_HOVER]: {
				[media.canHover]: tokens["--bg-primary-hover"],
			},
			[UNSELECTED_ACTIVE]: tokens["--border-input-hover"],
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[UNSELECTED_HOVER]: {
				[media.canHover]: tokens["--border-input-hover"],
			},
			'[aria-invalid="true"]': tokens["--fg-error"],
			"[data-checked]": tokens["--border"],
			"[data-checked][data-disabled]": tokens["--border"],
			'[data-checked][data-readonly]:not([data-disabled],[data-invalid],[aria-invalid="true"])':
				tokens["--fg-muted"],
			"[data-disabled]": tokens["--border-disabled"],
			"[data-indeterminate]": tokens["--bg-primary"],
			"[data-indeterminate][data-disabled]": tokens["--border"],
			'[data-indeterminate][data-readonly]:not([data-disabled],[data-invalid],[aria-invalid="true"])':
				tokens["--border"],
			"[data-invalid]": tokens["--fg-error"],
			'[data-readonly]:not([data-disabled],[data-invalid],[aria-invalid="true"])':
				tokens["--border"],
			default: tokens["--border-input"],
		},
		borderRadius: tokens["--radius-xs"],
		borderStyle: "solid",
		borderWidth: "1px",
		alignItems: "center",
		backgroundColor: {
			[ENABLED_INDETERMINATE_ACTIVE]: tokens["--surface"],
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[ENABLED_INDETERMINATE_HOVER]: {
				[media.canHover]: tokens["--surface"],
			},
			[ENABLED_SELECTED_ACTIVE]: tokens["--bg-primary"],
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[ENABLED_SELECTED_HOVER]: {
				[media.canHover]: tokens["--bg-primary-hover"],
			},
			[UNSELECTED_ACTIVE]: tokens["--surface-subtle-active"],
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[UNSELECTED_HOVER]: {
				[media.canHover]: tokens["--surface-subtle"],
			},
			"[data-checked]": tokens["--bg-primary"],
			'[data-checked]:is([data-invalid],[aria-invalid="true"]):not([data-disabled])':
				tokens["--bg-error-primary"],
			"[data-checked][data-disabled]": tokens["--surface-subtle"],
			"[data-checked][data-readonly]": tokens["--surface"],
			"[data-indeterminate]": tokens["--surface"],
			"[data-readonly]": tokens["--surface"],
			default: tokens["--surface"],
		},
		color: {
			[ENABLED_INDETERMINATE_ACTIVE]: tokens["--bg-primary"],
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[ENABLED_INDETERMINATE_HOVER]: {
				[media.canHover]: tokens["--bg-primary-hover"],
			},
			'[aria-invalid="true"]': tokens["--fg-accent-contrast"],
			'[data-checked]:is([data-invalid],[aria-invalid="true"]):not([data-disabled])':
				tokens["--fg-accent-contrast"],
			"[data-disabled]": tokens["--fg-subtle"],
			"[data-indeterminate]": tokens["--bg-primary"],
			"[data-invalid]": tokens["--fg-accent-contrast"],
			"[data-readonly]": tokens["--fg"],
			default: tokens["--fg-accent-contrast"],
		},
		cursor: {
			"[data-disabled]": "not-allowed",
			default: "default",
		},
		display: "inline-flex",
		flexShrink: 0,
		justifyContent: "center",
		marginBlockStart: 1,
		position: "relative",
		transform: {
			[ENABLED_ACTIVE]: "scale(0.94)",
			"[data-disabled]": "scale(1)",
			"[data-readonly]": "scale(1)",
			default: "scale(1)",
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
});

export const checkboxStyles = {
	group: checkboxParts.group,
	groupLabel: [textStyles.body, fontWeightStyles.semibold, checkboxParts.groupLabel],
	legend: checkboxParts.legend,
	groupDescription: [textStyles.supporting, checkboxParts.groupDescription],
	groupOptions: checkboxParts.groupOptions,
	groupOptionsInline: checkboxParts.groupOptionsInline,
	control: checkboxParts.control,
	indicator: checkboxParts.indicator,
	indicatorTransition: checkboxParts.indicatorTransition,
} as const;
