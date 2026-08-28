import type * as React from "react";
import * as stylex from "@stylexjs/stylex";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { extractMarginProps, type MarginProps } from "@/styles/props/spacing.stylex";
import { tokens } from "@/theme/tokens.stylex";
import { attrJoin } from "@/utils/attr-join";

type KbdSize = "sm" | "md";
type KbdVariant = "default" | "inverse" | "outline" | "plain";

export type KbdProps = Omit<
	React.ComponentProps<"kbd">,
	"className" | "style" | keyof MarginProps
> &
	MarginProps &
	BaseStyleProps & {
		className?: string;
		size?: KbdSize;
		variant?: KbdVariant;
	};

export function Kbd({
	className,
	style,
	xstyle,
	size = "md",
	variant = "default",
	...props
}: KbdProps): React.ReactElement {
	const { marginStyles, rest } = extractMarginProps(props);
	const sx = stylex.props(
		kbdStyles.key,
		kbdSizes[size],
		kbdVariants[variant],
		...marginStyles,
		xstyle,
	);

	return (
		<kbd
			data-component="kbd"
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...rest}
		/>
	);
}

export type KbdGroupProps = Omit<
	React.ComponentProps<"kbd">,
	"className" | "style" | keyof MarginProps
> &
	MarginProps &
	BaseStyleProps & {
		className?: string;
	};

export function KbdGroup({
	className,
	style,
	xstyle,
	...props
}: KbdGroupProps): React.ReactElement {
	const { marginStyles, rest } = extractMarginProps(props);
	const sx = stylex.props(kbdStyles.group, ...marginStyles, xstyle);

	return (
		<kbd
			data-component="kbd-group"
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...rest}
		/>
	);
}

const kbdStyles = stylex.create({
	key: {
		gap: tokens["--space-1"],
		alignItems: "center",
		backgroundColor: {
			default: tokens["--surface-subtle"],
			":hover": tokens["--surface-subtle-hover"],
		},
		boxSizing: "border-box",
		color: tokens["--fg-muted"],
		display: "inline-flex",
		flexShrink: 0,
		fontFamily: tokens["--font-family-sans"],
		justifyContent: "center",
		pointerEvents: "none",
		userSelect: "none",
		verticalAlign: "text-top",
		wordSpacing: "-0.1em",
		height: "fit-content",
	},
	group: {
		gap: tokens["--space-1"],
		alignItems: "center",
		display: "inline-flex",
	},
});

const kbdSizes = stylex.create({
	sm: {
		borderRadius: tokens["--radius-xxs"],
		paddingInline: tokens["--space-1"],
		fontSize: "11px",
		fontWeight: tokens["--font-weight-semibold"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
		minHeight: tokens["--space-4"],
		minWidth: tokens["--space-4"],
	},
	md: {
		borderRadius: tokens["--radius-sm"],
		paddingInline: tokens["--space-1-5"],
		fontSize: ".75em",
		fontWeight: tokens["--font-weight-medium"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
		minHeight: tokens["--space-5"],
		minWidth: tokens["--space-5"],
	},
});

const kbdVariants = stylex.create({
	default: {
		backgroundColor: tokens["--surface-subtle"],
		color: tokens["--fg-muted"],
	},
	inverse: {
		backgroundColor: `color-mix(in srgb, currentColor 10%, ${tokens["--bg-inverse"]})`,
		color: tokens["--fg-inverse"],
	},
	plain: {
		paddingInline: 0,
		backgroundColor: "transparent",
		color: tokens["--fg-subtle"],
		fontWeight: tokens["--font-weight-regular"],
	},
	outline: {
		backgroundColor: tokens["--surface"],
		outlineColor: {
			default: tokens["--border-input"],
			":hover": tokens["--border-input-hover"],
		},
		outlineOffset: "-1px",
		outlineStyle: "solid",
		outlineWidth: "1px",
	},
});
