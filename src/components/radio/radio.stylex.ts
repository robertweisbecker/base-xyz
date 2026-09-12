import * as stylex from "@stylexjs/stylex";
import { media } from "@/styles/constants.stylex";
import { tokens } from "@/theme/tokens.stylex";

export type RadioSize = "sm" | "md";

const ENABLED_ACTIVE = ":active:not([data-disabled],[data-readonly])";
const UNSELECTED_HOVER = ":hover:not([data-disabled],[data-readonly]):not([data-checked])";
const UNSELECTED_ACTIVE = ":active:not([data-disabled],[data-readonly]):not([data-checked])";
const ENABLED_SELECTED_HOVER = ":hover:not([data-disabled],[data-readonly])[data-checked]";
const ENABLED_SELECTED_ACTIVE = ":active:not([data-disabled],[data-readonly])[data-checked]";

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
	control: {
		borderColor: {
			[ENABLED_SELECTED_ACTIVE]: tokens["--bg-primary-hover"],
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[ENABLED_SELECTED_HOVER]: {
				[media.canHover]: tokens["--bg-primary-hover"],
			},
			[UNSELECTED_ACTIVE]: tokens["--bg-primary-highlight"],
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[UNSELECTED_HOVER]: {
				[media.canHover]: tokens["--border-input-hover"],
			},
			"[data-checked]": tokens["--bg-primary"],
			"[data-checked][data-disabled]": tokens["--bg-neutral"],
			"[data-checked][data-readonly]": tokens["--fg-muted"],
			"[data-disabled]": tokens["--border-disabled"],
			"[data-readonly]": tokens["--border"],
			default: tokens["--border-input"],
		},
		borderRadius: tokens["--radius-full"],
		borderStyle: "solid",
		borderWidth: "1px",
		alignItems: "center",
		backgroundColor: {
			[ENABLED_SELECTED_ACTIVE]: tokens["--bg-primary-hover"],
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
			"[data-checked][data-disabled]": tokens["--bg-neutral"],
			"[data-checked][data-readonly]": tokens["--bg-neutral"],
			default: tokens["--surface"],
		},
		cursor: {
			"[data-disabled]": "not-allowed",
			default: "default",
		},
		display: "inline-flex",
		flexShrink: 0,
		justifyContent: "center",
		marginBlockStart: "1px",
		opacity: {
			"[data-disabled]": 0.48,
			default: 1,
		},
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
});

export const radioStyles = {
	control: radioParts.control,
	indicator: radioParts.indicator,
	indicatorTransition: radioParts.indicatorTransition,
} as const;
