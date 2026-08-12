import type * as React from "react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { resolveThemeProps } from "@/theme/theme-props";
import { marginThemeProps } from "@/theme/theme-props-spacing.stylex";
import type { MarginProps } from "@/theme/theme-props.types";
import { tokens } from "@/theme/tokens.stylex";

type KbdSize = "sm" | "md";
type KbdVariant = "default" | "inverse" | "outline" | "plain";

type StyledProps<T> = Omit<T, "className" | "style"> & {
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export type KbdProps = Omit<StyledProps<React.ComponentProps<"kbd">>, keyof MarginProps> &
	MarginProps & {
		size?: KbdSize;
		variant?: KbdVariant;
	};

export function Kbd({ className, style, size = "md", variant = "default", ...props }: KbdProps): React.ReactElement {
	const { restProps, styles } = resolveThemeProps(props, marginThemeProps);
	const sx = stylex.props(kbdStyles.key, kbdSizes[size], kbdVariants[variant], ...styles, style);

	return (
		<kbd
			data-component="kbd"
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...restProps}
		/>
	);
}

export function KbdGroup({ className, style, ...props }: StyledProps<React.ComponentProps<"kbd">>): React.ReactElement {
	const sx = stylex.props(kbdStyles.group, style);

	return (
		<kbd
			data-component="kbd-group"
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}
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
		color: tokens["--fg-inverse-muted"],
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
