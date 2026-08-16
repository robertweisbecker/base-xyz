import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";
import { CaretDownIcon } from "@phosphor-icons/react/dist/csr/CaretDown";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentProps } from "react";
import { media } from "@/styles/constants.stylex";
import { tokens } from "@/theme/tokens.stylex";
import { focusRing } from "@/styles/recipes/focus";

import type { ButtonShape, ButtonSize } from "@/components/button/button";

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
		variant === "link" && triggerVariants.link,
		focusRing.offset,
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
			{children ?? <CaretDownIcon size="1em" weight="regular" />}
		</span>
	);
}

const collapsibleParts = stylex.create({
	root: {
		color: tokens["--fg"],
		display: "flex",
		flexDirection: "column",
		width: "100%",
	},
	trigger: {
		borderColor: "transparent",
		borderRadius: tokens["--radius-md"],
		borderStyle: "solid",
		borderWidth: "1px",
		flex: "1",
		alignItems: "center",
		backgroundColor: {
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[HOVER_WHEN_INACTIVE]: {
				[media.canHover]: tokens["--surface-subtle"],
			},
			"[data-panel-open]": tokens["--surface-subtle"],
			default: "transparent",
		},
		color: tokens["--fg"],
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
		transitionDuration: tokens["--motion-duration-short"],
		transitionProperty: "background-color, color",
		transitionTimingFunction: tokens["--motion-ease-out"],
	},
	panel: {
		overflow: "hidden",
		display: {
			default: "block",
			':is([hidden]:not([hidden="until-found"]))': "none",
		},
		transitionDuration: tokens["--motion-duration-short"],
		transitionProperty: "height",
		transitionTimingFunction: tokens["--motion-ease-out"],
		height: {
			"[data-ending-style]": 0,
			"[data-starting-style]": 0,
			default: "var(--collapsible-panel-height)",
		},
	},
	content: {
		gap: tokens["--space-2"],
		color: tokens["--fg-muted"],
		display: "flex",
		flexDirection: "column",
		fontSize: tokens["--font-size-2"],
		letterSpacing: tokens["--letter-spacing-2"],
		lineHeight: tokens["--line-height-2"],
		marginTop: tokens["--space-1"],
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
		transitionDuration: tokens["--motion-duration-short"],
		transitionProperty: "transform",
		transitionTimingFunction: tokens["--motion-ease-smooth-out"],
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
		borderRadius: tokens["--radius-sm"],
		gap: tokens["--space-1"],
		paddingBlock: tokens["--space-2"],
		paddingInline: tokens["--space-2"],
		fontSize: tokens["--font-size-1"],
		fontWeight: tokens["--font-weight-medium"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
		height: tokens["--size-control-xs"],
		minWidth: tokens["--size-control-xs"],
	},
	sm: {
		borderRadius: tokens["--radius-sm"],
		gap: tokens["--space-2"],
		paddingBlock: tokens["--space-1"],
		paddingInline: tokens["--space-2"],
		fontSize: tokens["--font-size-1"],
		fontWeight: tokens["--font-weight-medium"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
		height: tokens["--size-control-sm"],
		minWidth: tokens["--size-control-sm"],
	},
	md: {
		borderRadius: tokens["--radius-md"],
		gap: tokens["--space-2"],
		paddingBlock: tokens["--space-2"],
		paddingInline: tokens["--space-3"],
		fontSize: tokens["--font-size-2"],
		fontWeight: tokens["--font-weight-medium"],
		letterSpacing: tokens["--letter-spacing-2"],
		lineHeight: tokens["--line-height-2"],
		height: tokens["--size-control-md"],
		minWidth: tokens["--size-control-md"],
	},
	lg: {
		borderRadius: tokens["--radius-lg"],
		gap: tokens["--space-2"],
		paddingBlock: tokens["--space-3"],
		paddingInline: tokens["--space-5"],
		fontSize: tokens["--font-size-3"],
		fontWeight: tokens["--font-weight-medium"],
		letterSpacing: tokens["--letter-spacing-3"],
		lineHeight: tokens["--line-height-3"],
		height: tokens["--size-control-lg"],
		minWidth: tokens["--size-control-lg"],
	},
});

const triggerShapes = stylex.create({
	default: {
		width: "100%",
	},
	square: {
		padding: 0,
		borderRadius: tokens["--radius-sm"],
		aspectRatio: 1,
	},
});

const triggerVariants = stylex.create({
	link: {
		paddingInline: 0,
		backgroundColor: {
			[HOVER_WHEN_INACTIVE]: "transparent",
			"[data-panel-open]": "transparent",
			default: "transparent",
		},
		color: {
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[HOVER_WHEN_INACTIVE]: {
				[media.canHover]: tokens["--fg"],
			},
			"[data-panel-open]": tokens["--fg"],
			default: tokens["--fg-muted"],
		},
		minWidth: 0,
		width: "fit-content",
	},
});

export const Collapsible = {
	Root, Trigger, Panel, Content, Icon,
} as const;
