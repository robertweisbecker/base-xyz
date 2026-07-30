import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";
import { CaretDownIcon } from "@phosphor-icons/react/dist/csr/CaretDown";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentProps } from "react";
import { motion } from "@/styles/tokens.stylex";
import { focusRing } from "@/styles/recipes/focus";
import { color, radius, size, space } from "@/styles/tokens.stylex";
import { fontSize, fontWeight, letterSpacing, lineHeight } from "@/styles/tokens.stylex";
import type { ButtonShape, ButtonSize } from "../button/button";

const HOVER_WHEN_INACTIVE = ":hover:not([data-disabled]):not([data-panel-open])";

type StyledProps<T> = Omit<T, "className" | "style"> & {
	className?: string;
	style?: StyleXStyles;
};

export type CollapsibleRootProps = StyledProps<BaseCollapsible.Root.Props>;
export type CollapsibleTriggerSize = ButtonSize;
export type CollapsibleTriggerShape = Extract<ButtonShape, "default" | "square">;
export type CollapsibleTriggerVariant = "default" | "link";

export type CollapsibleTriggerProps = StyledProps<BaseCollapsible.Trigger.Props> & {
	size?: CollapsibleTriggerSize;
	shape?: CollapsibleTriggerShape;
	variant?: CollapsibleTriggerVariant;
};
export type CollapsiblePanelProps = StyledProps<BaseCollapsible.Panel.Props>;
export type CollapsibleContentProps = StyledProps<ComponentProps<"div">>;
export type CollapsibleIconProps = StyledProps<ComponentProps<"span">> & {
	side?: "start" | "end";
};

export function Root({ ref, className, style, ...props }: CollapsibleRootProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(collapsibleParts.root, style);

	return (
		<BaseCollapsible.Root
			ref={ref}
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}
			{...props}
		/>
	);
}

export function Trigger({
	ref,
	className,
	style,
	render,
	shape = "default",
	size = "md",
	type = "button",
	variant = "default",
	...props
}: CollapsibleTriggerProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(
		collapsibleParts.trigger,
		triggerSizes[size],
		triggerShapes[shape],
		triggerVariants[variant],
		focusRing.outset,
		stylex.defaultMarker(),
		style,
	);

	return (
		<BaseCollapsible.Trigger
			ref={ref}
			render={render}
			type={type}
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}
			{...props}
		/>
	);
}

export function Panel({ ref, className, style, ...props }: CollapsiblePanelProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(collapsibleParts.panel, style);

	return (
		<BaseCollapsible.Panel
			ref={ref}
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}
			{...props}
		/>
	);
}

export function Content({ ref, className, style, ...props }: CollapsibleContentProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(collapsibleParts.content, style);

	return <div ref={ref} className={[sxClassName, className].filter(Boolean).join(" ")} style={sxStyle} {...props} />;
}

export function Icon({ ref, children, className, style, side = "end", ...props }: CollapsibleIconProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(
		collapsibleParts.icon,
		side === "start" ? collapsibleParts.iconAtStart : collapsibleParts.iconAtEnd,
		style,
	);

	return (
		<span
			ref={ref}
			aria-hidden
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}
			{...props}>
			{children ?? <CaretDownIcon size="1em" weight="bold" />}
		</span>
	);
}

const collapsibleParts = stylex.create({
	root: {
		color: color.fg,
		display: "flex",
		flexDirection: "column",
		width: "100%",
	},
	trigger: {
		borderColor: "transparent",
		borderRadius: radius.md,
		borderStyle: "solid",
		borderWidth: "1px",
		flex: "1",
		alignItems: "center",
		backgroundColor: {
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[HOVER_WHEN_INACTIVE]: {
				"@media (hover: hover) and (pointer: fine)": color.surfaceSubtle,
			},
			"[data-panel-open]": color.surfaceSubtle,
			default: "transparent",
		},
		color: color.fg,
		cursor: {
			"[data-disabled]": "not-allowed",
			default: "default",
		},
		display: "flex",
		fontFamily: "inherit",
		opacity: {
			"[data-disabled]": 0.48,
			default: 1,
		},
		textAlign: "start",
		transitionDuration: {
			default: motion.durationShort,
			"@media (prefers-reduced-motion: reduce)": "0ms",
		},
		transitionProperty: "background-color, color",
		transitionTimingFunction: motion.easeOut,
	},
	panel: {
		overflow: "hidden",
		display: {
			default: "block",
			':is([hidden]:not([hidden="until-found"]))': "none",
		},
		transitionDuration: {
			default: motion.durationShort,
			"@media (prefers-reduced-motion: reduce)": "0ms",
		},
		transitionProperty: "height",
		transitionTimingFunction: motion.easeOut,
		height: {
			"[data-ending-style]": 0,
			"[data-starting-style]": 0,
			default: "var(--collapsible-panel-height)",
		},
	},
	content: {
		// paddingInlineStart: space.x3,
		gap: space.x2,
		color: color.fgMuted,
		display: "flex",
		flexDirection: "column",
		fontSize: fontSize.x2,
		letterSpacing: letterSpacing.x2,
		lineHeight: lineHeight.x2,
		marginTop: space.x1,
	},
	icon: {
		alignItems: "center",
		display: "inline-flex",
		flexShrink: 0,
		justifyContent: "center",
		transform: {
			default: "rotate(0deg)",
			[stylex.when.ancestor("[data-panel-open]")]: "rotate(180deg)",
		},
		transitionDuration: {
			default: motion.durationShort,
			"@media (prefers-reduced-motion: reduce)": "0ms",
		},
		transitionProperty: "transform",
		transitionTimingFunction: motion.easeSmoothOut,
	},
	iconAtStart: {
		marginInlineStart: 0,
	},
	iconAtEnd: {
		marginInlineStart: "auto",
	},
});

const triggerSizes = stylex.create({
	xs: {
		borderRadius: radius.sm,
		gap: space.x1,
		paddingBlock: space.x2,
		paddingInline: space.x2,
		fontSize: fontSize.x1,
		fontWeight: fontWeight.medium,
		letterSpacing: letterSpacing.x1,
		lineHeight: lineHeight.x1,
		height: size["control.xs"],
		minWidth: size["control.xs"],
	},
	sm: {
		borderRadius: radius.sm,
		gap: space.x2,
		paddingBlock: space.x1,
		paddingInline: space.x2,
		fontSize: fontSize.x1,
		fontWeight: fontWeight.medium,
		letterSpacing: letterSpacing.x1,
		lineHeight: lineHeight.x1,
		height: size["control.sm"],
		minWidth: size["control.sm"],
	},
	md: {
		borderRadius: radius.md,
		gap: space.x2,
		paddingBlock: space.x2,
		paddingInline: space.x3,
		fontSize: fontSize.x2,
		fontWeight: fontWeight.medium,
		letterSpacing: letterSpacing.x2,
		lineHeight: lineHeight.x2,
		height: size["control.md"],
		minWidth: size["control.md"],
	},
	lg: {
		borderRadius: radius.lg,
		gap: space.x2,
		paddingBlock: space.x3,
		paddingInline: space.x5,
		fontSize: fontSize.x3,
		fontWeight: fontWeight.medium,
		letterSpacing: letterSpacing.x3,
		lineHeight: lineHeight.x3,
		height: size["control.lg"],
		minWidth: size["control.lg"],
	},
});

const triggerShapes = stylex.create({
	default: {
		width: "100%",
	},
	square: {
		padding: 0,
		borderRadius: radius.sm,
		aspectRatio: 1,
	},
});

const triggerVariants = stylex.create({
	default: {
		// marginInline: `calc(${space.x3} * -1)`,
	},
	link: {
		paddingInline: 0,
		backgroundColor: {
			[HOVER_WHEN_INACTIVE]: "transparent",
			"[data-panel-open]": "transparent",
			default: "transparent",
		},
		color: {
			[HOVER_WHEN_INACTIVE]: {
				"@media (hover: hover) and (pointer: fine)": color.fg,
			},
			"[data-panel-open]": color.fg,
			default: color.fgMuted,
		},
		minWidth: 0,
		width: "fit-content",
	},
});
