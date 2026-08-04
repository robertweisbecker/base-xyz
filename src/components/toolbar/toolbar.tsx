import { Toolbar as BaseToolbar } from "@base-ui/react/toolbar";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { focusRing } from "@/styles/recipes/focus";
import { color, radius, shadow, size, space } from "@/styles/tokens.stylex";
import { fontSize, letterSpacing, lineHeight } from "@/styles/tokens.stylex";

const HOVER_WHEN_INACTIVE =
	':hover:not([aria-disabled="true"]):not([data-disabled]):not([aria-pressed="true"]):not([data-active]):not([data-panel-open]):not([data-popup-open]):not([data-pressed])';
const TOGGLED_ON =
	':is([aria-pressed="true"], [data-active], [data-pressed]):not([data-panel-open]):not([data-popup-open])';

type StyledProps<T> = Omit<T, "className" | "style"> & {
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export type ToolbarVariant = "surface" | "unstyled";

export type ToolbarRootProps = StyledProps<BaseToolbar.Root.Props> & {
	variant?: ToolbarVariant;
};
export type ToolbarGroupProps = StyledProps<BaseToolbar.Group.Props>;
export type ToolbarButtonProps = StyledProps<BaseToolbar.Button.Props>;
export type ToolbarLinkProps = StyledProps<BaseToolbar.Link.Props>;
export type ToolbarInputProps = StyledProps<BaseToolbar.Input.Props>;
export type ToolbarSeparatorProps = StyledProps<BaseToolbar.Separator.Props>;

export function Root({ ref, className, style, variant = "surface", ...props }: ToolbarRootProps) {
	const sx = stylex.props(toolbarParts.root, toolbarVariants[variant], style);

	return (
		<BaseToolbar.Root
			ref={ref}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}
		/>
	);
}

export function Group({ ref, className, style, ...props }: ToolbarGroupProps) {
	const sx = stylex.props(toolbarParts.group, style);

	return (
		<BaseToolbar.Group
			ref={ref}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}
		/>
	);
}

export function Button({ ref, className, style, type = "button", ...props }: ToolbarButtonProps) {
	const sx = stylex.props(toolbarParts.control, toolbarParts.button, focusRing.outset, style);

	return (
		<BaseToolbar.Button
			ref={ref}
			type={type}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}
		/>
	);
}

export function Link({ ref, className, style, ...props }: ToolbarLinkProps) {
	const sx = stylex.props(toolbarParts.link, focusRing.outset, style);

	return (
		<BaseToolbar.Link
			ref={ref}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}
		/>
	);
}

export function Input({ ref, className, style, ...props }: ToolbarInputProps) {
	const sx = stylex.props(toolbarParts.input, focusRing.inset, style);

	return (
		<BaseToolbar.Input
			ref={ref}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}
		/>
	);
}

export function Separator({ ref, className, style, ...props }: ToolbarSeparatorProps) {
	const sx = stylex.props(toolbarParts.separator, style);

	return (
		<BaseToolbar.Separator
			ref={ref}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}
		/>
	);
}

const toolbarParts = stylex.create({
	root: {
		gap: "1px",
		alignItems: "center",
		boxSizing: "border-box",
		display: "inline-flex",
		flexDirection: {
			"[data-orientation=vertical]": "column",
			default: "row",
		},
		width: {
			"[data-orientation=vertical]": "fit-content",
			default: "100%",
		},
	},
	group: {
		gap: "1px",
		alignItems: "center",
		display: "flex",
		flexDirection: {
			"[data-orientation=vertical]": "column",
			default: "row",
		},
	},
	control: {
		borderRadius: radius.sm,
		borderStyle: "none",
		borderWidth: "0",
		gap: space[2],
		paddingBlock: 0,
		paddingInline: space[2],
		textDecoration: "none",
		alignItems: "center",
		backgroundColor: {
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[HOVER_WHEN_INACTIVE]: {
				"@media (hover: hover) and (pointer: fine)": color.highlight,
			},
			[TOGGLED_ON]: color.surfaceSubtle,
			"[data-disabled]": "transparent",
			default: "transparent",
			":active": color.surfaceSubtleActive,
		},
		boxSizing: "border-box",
		color: {
			[TOGGLED_ON]: color.fg,
			"[data-disabled]": color.fgSubtle,
			default: color.fgMuted,
		},
		display: "inline-flex",
		flexShrink: 0,
		fontFamily: "inherit",
		fontSize: fontSize.x2,
		justifyContent: "center",
		letterSpacing: letterSpacing.x2,
		lineHeight: lineHeight.x2,
		opacity: {
			"[data-disabled]": 0.48,
			default: 1,
		},
		touchAction: "manipulation",
		userSelect: "none",
		whiteSpace: "nowrap",
		height: size["control.md"],
		minWidth: size["control.md"],
	},
	button: {
		appearance: "none",
	},
	link: {
		borderRadius: radius.xs,
		gap: space[1],
		overflow: "hidden",
		paddingInline: space[2],
		textDecoration: "underline",
		alignItems: "center",
		color: {
			"[data-disabled]": color.fgSubtle,
			default: color.fg,
			":hover": {
				"@media (hover: hover) and (pointer: fine)": color.fgAccent,
			},
		},
		display: "inline-flex",
		fontSize: fontSize.x2,
		justifyContent: "center",
		letterSpacing: letterSpacing.x2,
		lineHeight: lineHeight.x2,
		textDecorationColor: "color-mix(in oklab, currentColor 50%, transparent)",
		textDecorationStyle: {
			default: "dotted",
			":hover": {
				"@media (hover: hover) and (pointer: fine)": "solid",
			},
		},
		textDecorationThickness: 1,
		textOverflow: "ellipsis",
		textUnderlineOffset: 3,
		whiteSpace: "nowrap",
		minHeight: size["control.md"],
		minWidth: size["control.md"],
	},
	input: {
		borderRadius: radius.sm,
		paddingInline: space[3],
		backgroundColor: {
			default: color.surfaceSubtle,
			":focus-visible": color.canvas,
		},
		boxSizing: "border-box",
		color: {
			"[data-disabled]": color.fgSubtle,
			default: color.fg,
		},
		flexBasis: 0,
		flexGrow: 1,
		flexShrink: 1,
		fontFamily: "inherit",
		fontSize: fontSize.x2,
		letterSpacing: letterSpacing.x2,
		lineHeight: lineHeight.x2,
		opacity: {
			"[data-disabled]": 0.48,
			default: 1,
		},
		height: size["control.md"],
		minWidth: "10rem",
		"::placeholder": {
			color: color.fgSubtle,
		},
	},
	separator: {
		margin: space[1],
		backgroundColor: color.border,
		flexShrink: 0,
		height: {
			"[data-orientation=horizontal]": "1px",
			default: space[4],
		},
		width: {
			"[data-orientation=horizontal]": space[4],
			default: "1px",
		},
	},
});

const toolbarVariants = stylex.create({
	surface: {
		padding: space[1],
		borderRadius: radius.md,
		backgroundColor: {
			"[data-disabled]": color.surface,
			default: color.bgPanel,
		},
		boxShadow: {
			"[data-disabled]": "none",
			default: shadow.sm,
		},
	},
	unstyled: {
		padding: 0,
		borderRadius: 0,
		backgroundColor: "transparent",
		boxShadow: "none",
	},
});
