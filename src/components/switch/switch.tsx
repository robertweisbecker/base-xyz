import { Switch as BaseSwitch } from "@base-ui/react/switch";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";
import { media } from "@/styles/constants.stylex";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { extractMarginProps, type MarginProps } from "@/styles/props/spacing.stylex";
import { focusRing } from "@/styles/recipes/focus";
import { tokens } from "@/theme/tokens.stylex";
import { attrJoin } from "@/utils/attr-join";

export type SwitchSize = "sm" | "md" | "lg";

const ENABLED_HOVER = ":hover:not([data-disabled],[data-readonly])";
const ENABLED_ACTIVE = ":active:not([data-disabled],[data-readonly])";

export type SwitchProps = Omit<
	ComponentProps<typeof BaseSwitch.Root>,
	"children" | "className" | "color" | "style" | keyof MarginProps
> &
	MarginProps &
	BaseStyleProps & {
		size?: SwitchSize;
		className?: string;
	};

export function Switch({ className, style, xstyle, size = "md", ...props }: SwitchProps) {
	const { marginStyles, rest } = extractMarginProps(props);
	const sx = stylex.props(
		switchParts.track,
		sizeVariants[size],
		focusRing.offset,
		marginStyles,
		xstyle,
	);
	return (
		<BaseSwitch.Root
			nativeButton
			render={<button type="button" />}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...rest}
		>
			<BaseSwitch.Thumb {...stylex.props(switchParts.thumb)} />
		</BaseSwitch.Root>
	);
}

const switchParts = stylex.create({
	track: {
		"--_switch-border-color": {
			[ENABLED_ACTIVE]: tokens["--bg-primary-highlight"],
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[ENABLED_HOVER]: {
				[media.canHover]: tokens["--border-input-hover"],
			},
			default: tokens["--border-input"],
		},
		"--_switch-selected-color": {
			[ENABLED_ACTIVE]: tokens["--bg-primary-highlight"],
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[ENABLED_HOVER]: {
				[media.canHover]: tokens["--bg-primary-highlight"],
			},
			default: tokens["--bg-primary"],
		},
		borderColor: {
			"[data-checked]": "var(--_switch-selected-color)",
			"[data-checked][data-disabled]": tokens["--border-disabled"],
			"[data-checked][data-readonly]": tokens["--border"],
			"[data-disabled]": tokens["--border-disabled"],
			"[data-readonly]": tokens["--border"],
			default: "var(--_switch-border-color)",
		},
		borderRadius: tokens["--radius-full"],
		alignItems: "center",
		alignSelf: "start",
		backgroundColor: {
			"[data-checked]": "var(--_switch-selected-color)",
			"[data-checked][data-disabled]": tokens["--fill-disabled"],
			"[data-checked][data-readonly]": tokens["--bg-neutral"],
			"[data-disabled]": tokens["--fill-disabled"],
			default: tokens["--fill-track"],
		},
		boxShadow: {
			"[data-disabled]": "none",
			"[data-readonly]": null,
			default: tokens["--shadow-inset"],
		},
		cursor: {
			"[data-disabled]": "not-allowed",
			"[data-readonly]": "default",
			default: "default",
		},
		display: "flex",
		flexShrink: 0,
		paddingBlockEnd: "round(calc(var(--_switch-track-height) / 14), 1px)",
		paddingBlockStart: "round(calc(var(--_switch-track-height) / 14), 1px)",
		paddingInlineEnd: "round(calc(var(--_switch-track-height) / 14), 1px)",
		paddingInlineStart: "round(calc(var(--_switch-track-height) / 14), 1px)",
		transform: {
			[ENABLED_ACTIVE]: "scale(0.94)",
			"[data-disabled]": "scale(1)",
			"[data-readonly]": "scale(1)",
			default: "scale(1)",
		},
		transitionDuration: tokens["--motion-duration-quick"],
		transitionProperty: "background-color, border-color, transform",
		transitionTimingFunction: "ease-out",
		height: "var(--_switch-track-height)",
		width: "calc(var(--_switch-track-height) * 1.5)",
	},
	thumb: {
		borderRadius: tokens["--radius-full"],
		alignItems: "center",
		aspectRatio: 1,
		backgroundColor: {
			"[data-disabled]": tokens["--fill-disabled"],
			default: tokens["--color-white"],
		},
		boxShadow: {
			"[data-disabled]": "none",
			default: tokens["--shadow-sm"],
		},
		display: "flex",
		flexShrink: 0,
		justifyContent: "center",
		transform: {
			"[data-checked]": "translateX(calc(var(--_switch-track-height) / 2))",
			default: "translateX(0)",
		},
		transitionDuration: tokens["--motion-duration-short"],
		transitionProperty: "transform",
		transitionTimingFunction: tokens["--motion-ease-out"],
		height: "100%",
	},
});

const sizeVariants = stylex.create({
	sm: {
		"--_switch-track-height": tokens["--space-4"],
	},
	md: {
		"--_switch-track-height": tokens["--space-6"],
	},
	lg: {
		"--_switch-track-height": tokens["--space-7"],
	},
});
