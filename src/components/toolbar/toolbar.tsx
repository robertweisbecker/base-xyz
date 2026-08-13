import { Toolbar as BaseToolbar } from "@base-ui/react/toolbar";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { media } from "@/styles/constants.stylex";
import { focusRing } from "@/styles/recipes/focus";
import { tokens } from "@/theme/tokens.stylex";

const HOVER_WHEN_INACTIVE =
	':hover:not([aria-disabled="true"]):not([data-disabled]):not([aria-pressed="true"]):not([data-active]):not([data-panel-open]):not([data-popup-open]):not([data-pressed])';
const TOGGLED_ON =
	':is([aria-pressed="true"], [data-active], [data-pressed]):not([data-panel-open]):not([data-popup-open])';

type StyledProps<T> = Omit<T, "className" | "style"> & {
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export type ToolbarVariant = "surface" | "elevated" | "unstyled";

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
	const sx = stylex.props(toolbarParts.control, toolbarParts.button, focusRing.offset, style);

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
	const sx = stylex.props(toolbarParts.link, focusRing.offset, style);

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
		borderRadius: tokens["--radius-sm"],
		borderStyle: "none",
		borderWidth: "0",
		gap: tokens["--space-2"],
		paddingBlock: 0,
		paddingInline: tokens["--space-2"],
		textDecoration: "none",
		alignItems: "center",
		backgroundColor: {
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[HOVER_WHEN_INACTIVE]: {
				[media.canHover]: tokens["--bg-highlight"],
			},
			[TOGGLED_ON]: tokens["--surface-subtle-hover"],
			"[data-disabled]": "transparent",
			default: "transparent",
			":active": tokens["--surface-subtle-active"],
		},
		boxSizing: "border-box",
		color: {
			[TOGGLED_ON]: tokens["--fg"],
			"[data-disabled]": tokens["--fg-subtle"],
			default: tokens["--fg-muted"],
		},
		display: "inline-flex",
		flexShrink: 0,
		fontFamily: "inherit",
		fontSize: tokens["--font-size-2"],
		justifyContent: "center",
		letterSpacing: tokens["--letter-spacing-2"],
		lineHeight: tokens["--line-height-2"],
		opacity: {
			"[data-disabled]": 0.48,
			default: 1,
		},
		touchAction: "manipulation",
		userSelect: "none",
		whiteSpace: "nowrap",
		height: tokens["--size-control-md"],
		minWidth: tokens["--size-control-md"],
	},
	button: {
		appearance: "none",
		flexShrink: 0,
	},
	link: {
		borderRadius: tokens["--radius-xs"],
		gap: tokens["--space-1"],
		overflow: "hidden",
		paddingInline: tokens["--space-2"],
		textDecoration: "underline",
		alignItems: "center",
		color: {
			"[data-disabled]": tokens["--fg-subtle"],
			default: tokens["--fg"],
			":hover": {
				[media.canHover]: tokens["--fg-accent"],
			},
		},
		display: "inline-flex",
		fontSize: tokens["--font-size-2"],
		justifyContent: "center",
		letterSpacing: tokens["--letter-spacing-2"],
		lineHeight: tokens["--line-height-2"],
		textDecorationColor: "color-mix(in oklab, currentColor 50%, transparent)",
		textDecorationStyle: {
			default: "dotted",
			":hover": {
				[media.canHover]: "solid",
			},
		},
		textDecorationThickness: 1,
		textOverflow: "ellipsis",
		textUnderlineOffset: 3,
		whiteSpace: "nowrap",
		minHeight: tokens["--size-control-md"],
		minWidth: tokens["--size-control-md"],
	},
	input: {
		borderRadius: tokens["--radius-sm"],
		backgroundColor: {
			default: tokens["--surface-subtle"],
			":focus-visible": tokens["--canvas"],
		},
		boxSizing: "border-box",
		color: {
			"[data-disabled]": tokens["--fg-subtle"],
			default: tokens["--fg"],
		},
		fontFamily: "inherit",
		fontSize: tokens["--font-size-2"],
		letterSpacing: tokens["--letter-spacing-2"],
		lineHeight: tokens["--line-height-2"],
		opacity: {
			"[data-disabled]": 0.48,
			default: 1,
		},
		paddingInlineStart: tokens["--space-3"],
		height: tokens["--size-control-md"],
		"::placeholder": {
			color: tokens["--fg-subtle"],
		},
	},
	separator: {
		margin: tokens["--space-1"],
		backgroundColor: tokens["--border"],
		flexShrink: 0,
		height: {
			"[data-orientation=horizontal]": "1px",
			default: tokens["--space-4"],
		},
		width: {
			"[data-orientation=horizontal]": tokens["--space-4"],
			default: "1px",
		},
	},
});

const toolbarVariants = stylex.create({
	surface: {
		padding: tokens["--space-1"],
		borderColor: tokens["--border"],
		borderRadius: tokens["--radius-md"],
		borderStyle: "solid",
		borderWidth: "1px",
		backgroundColor: {
			"[data-disabled]": tokens["--surface-subtle"],
			default: tokens["--surface"],
		},
	},
	elevated: {
		backgroundColor: tokens["--panel"],
		boxShadow: {
			"[data-disabled]": tokens["--shadow-ring"],
			default: tokens["--shadow-sm"],
		},
	},
	unstyled: {
		padding: 0,
		borderRadius: 0,
		backgroundColor: "transparent",
		boxShadow: "none",
	},
});

export const Toolbar = {
	Root,
	Group,
	Button,
	Link,
	Input,
	Separator,
} as const;
