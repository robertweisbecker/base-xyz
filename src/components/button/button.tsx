import { Button as BaseButton } from "@base-ui/react/button";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { resolveThemeProps } from "@/theme/theme-props";
import { focusRing } from "@/styles/recipes/focus";
import { pressable } from "@/styles/recipes/transitions";
import { tokens } from "@/theme/tokens.stylex";

import { Loader } from "@/components/loader/loader";
import { Tooltip } from "@/components/tooltip/tooltip";
import { buttonThemeProps, type ButtonThemeProps } from "./button-theme-props";

export type { ButtonThemeProps } from "./button-theme-props";

const HOVER_NOT_PRESSED_OR_OPEN = ":hover:not([data-disabled],:active,[data-pressed])";
const PRESSED = ':is([aria-pressed="true"],[data-active],[data-pressed]):not([data-panel-open],[data-disabled])';

const buttonParts = stylex.create({
	root: {
		gap: tokens["--space-2"],
		overflow: "hidden",
		textDecoration: "none",
		alignItems: "center",
		cursor: {
			"[aria-busy]": "wait",
			"[data-disabled]": "not-allowed",
			default: "default",
			":is(a[href])": "pointer",
			":disabled": "not-allowed",
		},
		display: "inline-flex",
		fontSize: tokens["--font-size-2"],
		fontWeight: tokens["--font-weight-medium"],
		justifyContent: "center",
		letterSpacing: tokens["--letter-spacing-2"],
		lineHeight: tokens["--line-height-2"],
		opacity: {
			"[data-disabled]": 0.48,
			default: 1,
		},
		pointerEvents: {
			"[aria-busy]": "none",
			default: "auto",
		},
		position: "relative",
		transform: {
			default: "scale(1)",
			":active:not([data-disabled])": "scale(0.98)",
		},
		userSelect: "none",
		whiteSpace: "nowrap",
	},
});

const slotParts = stylex.create({
	root: {
		flex: "none",
		alignItems: "center",
		color: "currentColor",
		display: "inline-flex",
		justifyContent: "center",
		lineHeight: 0,
		pointerEvents: "none",
		height: "1em",
		width: "1em",
	},
	muted: {
		color: tokens["--fg-muted"],
	},
});

const contentParts = stylex.create({
	resting: {
		gap: "inherit",
		// Real box required so loading `opacity: 0` hides slotted icons that set
		// their own color (e.g. muted start slots). `display: contents` drops opacity.
		alignItems: "center",
		display: "inline-flex",
		justifyContent: "center",
		minWidth: 0,
	},
	transparent: {
		color: "transparent",
		opacity: 0,
		textShadow: "none",
	},
	loading: {
		inset: tokens["--space-1"],
		gap: "inherit",
		alignItems: "center",
		display: "flex",
		justifyContent: "center",
		pointerEvents: "none",
		position: "absolute",
		minWidth: 0,
	},
	loadingText: {
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
		minWidth: 0,
	},
});

const slotSizes = stylex.create({
	xs: { fontSize: "0.75rem" },
	sm: { fontSize: "0.875rem" },
	md: { fontSize: "1rem" },
	lg: { fontSize: "1rem" },
});

const iconOnlySlotSizes = stylex.create({
	xs: { fontSize: "1rem" }, // 16px
	sm: { fontSize: "1rem" }, // 16px
	md: { fontSize: "1.125rem" }, // 18px
	lg: { fontSize: "1.25rem" }, // 20px
});

const iconOnlyControlSizes = stylex.create({
	xs: {
		height: tokens["--size-control-xs"],
		maxWidth: tokens["--size-control-xs"],
		minWidth: tokens["--size-control-xs"],
	},
	sm: {
		height: tokens["--size-control-sm"],
		maxWidth: tokens["--size-control-sm"],
		minWidth: tokens["--size-control-sm"],
	},
	md: {
		height: tokens["--size-control-md"],
		maxWidth: tokens["--size-control-md"],
		minWidth: tokens["--size-control-md"],
	},
	lg: {
		height: tokens["--size-control-lg"],
		maxWidth: tokens["--size-control-lg"],
		minWidth: tokens["--size-control-lg"],
	},
});

const startSlotOffsets = stylex.create({
	xs: { marginInlineStart: "-0.125rem" },
	sm: { marginInlineStart: "-0.25rem" },
	md: { marginInlineStart: "-0.25rem" },
	lg: { marginInlineStart: "-0.1875rem" },
});

const endSlotOffsets = stylex.create({
	xs: { marginInlineEnd: "-0.125rem" },
	sm: { marginInlineEnd: "-0.25rem" },
	md: { marginInlineEnd: "-0.25rem" },
	lg: { marginInlineEnd: "-0.1875rem" },
});

const colorVariants = stylex.create({
	primary: {
		backgroundColor: {
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[HOVER_NOT_PRESSED_OR_OPEN]: {
				"@media (hover: hover) and (pointer: fine)": tokens["--bg-primary-highlight"],
			},
			[PRESSED]: tokens["--bg-primary-highlight"],
			"[data-popup-open]": tokens["--bg-primary-highlight"],
			default: tokens["--bg-primary"],
		},
		// backgroundImage: `linear-gradient(to bottom, ${colors["--bg-primary-highlight"]},transparent 40%)`,
		boxShadow: {
			[PRESSED]: tokens["--shadow-primary-pressed"],
			"[data-disabled]": "none",
			default: tokens["--shadow-primary"],
			":active:not([data-disabled])": tokens["--shadow-primary-pressed"],
		},
		color: tokens["--fg-accent-contrast"],
		textShadow: `0 .03em .06em oklch(from ${tokens["--bg-primary"]} calc(l*0.7) calc(c*1.1) h)`,
	},
	subtle: {
		backgroundColor: {
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[HOVER_NOT_PRESSED_OR_OPEN]: {
				"@media (hover: hover) and (pointer: fine)": tokens["--bg-accent-hover"],
			},
			[PRESSED]: tokens["--bg-accent-active"],
			"[data-popup-open]": tokens["--bg-accent-hover"],
			default: tokens["--bg-accent"],
			":active:not([data-disabled])": tokens["--bg-accent-active"],
		},
		color: {
			[PRESSED]: tokens["--fg-accent-strong"],
			"[HOVER_NOT_PRESSED_OR_OPEN]": tokens["--fg-accent-strong"],
			default: tokens["--fg-accent"],
		},
	},
	secondary: {
		backgroundColor: {
			[HOVER_NOT_PRESSED_OR_OPEN]: tokens["--elevated-hover"],
			[PRESSED]: tokens["--inset"],
			"[data-popup-open]": tokens["--elevated-hover"],
			default: tokens["--elevated"],
			":active:not([data-disabled])": tokens["--inset"],
		},
		boxShadow: {
			[PRESSED]: tokens["--shadow-inset"],
			"[data-disabled]": "none",
			default: tokens["--shadow-sm"],
			":active:not([data-disabled])": tokens["--shadow-inset"],
		},
		color: tokens["--fg"],
	},
	neutral: {
		backgroundColor: {
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[HOVER_NOT_PRESSED_OR_OPEN]: {
				"@media (hover: hover) and (pointer: fine)": tokens["--surface-subtle-hover"],
			},
			[PRESSED]: tokens["--surface-subtle-hover"],
			"[data-popup-open]": tokens["--surface-subtle-hover"],
			default: tokens["--surface-subtle"],
			":active:not([data-disabled])": tokens["--surface-subtle-active"],
		},
		color: {
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[HOVER_NOT_PRESSED_OR_OPEN]: {
				"@media (hover: hover) and (pointer: fine)": tokens["--fg"],
			},
			[PRESSED]: tokens["--fg"],
			"[data-popup-open]": tokens["--fg"],
			default: tokens["--fg-muted"],
			":active:not([data-disabled])": tokens["--fg"],
		},
	},
	ghost: {
		borderColor: "transparent",
		backgroundColor: {
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[HOVER_NOT_PRESSED_OR_OPEN]: {
				"@media (hover: hover) and (pointer: fine)": tokens["--surface-subtle-hover"],
			},
			[PRESSED]: tokens["--bg-accent"],
			"[data-popup-open]": tokens["--surface-subtle-hover"],
			// ":active:not([data-disabled])": tokens["--bg-highlight"],
			default: "transparent",
		},
		color: {
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[HOVER_NOT_PRESSED_OR_OPEN]: {
				"@media (hover: hover) and (pointer: fine)": tokens["--fg"],
			},
			[PRESSED]: tokens["--fg"],
			default: tokens["--fg-muted"],
			":active:not([data-disabled])": tokens["--fg"],
		},
	},
	plain: {
		backgroundColor: {
			"[data-disabled]": "none",
			default: "transparent",
		},
		color: {
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[HOVER_NOT_PRESSED_OR_OPEN]: {
				"@media (hover: hover) and (pointer: fine)": tokens["--fg-muted"],
			},
			[PRESSED]: tokens["--fg"],
			default: tokens["--fg-subtle"],
			":active:not([data-disabled])": tokens["--fg"],
		},
	},
	error: {
		backgroundColor: {
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[HOVER_NOT_PRESSED_OR_OPEN]: {
				"@media (hover: hover) and (pointer: fine)": tokens["--color-error-c2"],
			},
			[PRESSED]: tokens["--color-error-c3"],
			default: tokens["--color-error-c1"],
			":active:not([data-disabled])": tokens["--color-error-c3"],
		},
		color: {
			// // eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			// [HOVER_NOT_PRESSED_OR_OPEN]: {
			// 	"@media (hover: hover) and (pointer: fine)": tokens["--color-error-t2"],
			// },
			[PRESSED]: tokens["--color-error-t2"],
			default: tokens["--color-error-t1"],
		},
	},
});

const sizeVariants = stylex.create({
	xs: {
		borderRadius: tokens["--radius-sm"],
		gap: tokens["--space-1"],
		paddingBlock: tokens["--space-2"],
		paddingInline: tokens["--space-2"],
		fontSize: tokens["--font-size-1"],
		fontWeight: tokens["--font-weight-medium"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--size-control-xs"],
		height: tokens["--size-control-xs"],
		minWidth: tokens["--size-control-xs"],
	},
	sm: {
		borderRadius: tokens["--radius-sm"],
		gap: tokens["--space-1-5"],
		paddingInline: tokens["--space-3"],
		fontSize: "13px",
		fontWeight: tokens["--font-weight-medium"],
		letterSpacing: "-.0125em",
		lineHeight: tokens["--size-control-sm"],
		height: tokens["--size-control-sm"],
		minWidth: tokens["--size-control-sm"],
	},
	md: {
		borderRadius: tokens["--radius-md"],
		paddingInline: tokens["--space-3"],
		fontWeight: tokens["--font-weight-medium"],
		lineHeight: tokens["--size-control-md"],
		height: tokens["--size-control-md"],
		minWidth: tokens["--size-control-md"],
	},
	lg: {
		borderRadius: tokens["--radius-lg"],
		paddingInline: tokens["--space-4"],
		fontSize: tokens["--font-size-3"],
		letterSpacing: tokens["--letter-spacing-3"],
		lineHeight: tokens["--size-control-lg"],
		height: tokens["--size-control-lg"],
		minWidth: tokens["--size-control-lg"],
	},
});

const shapeVariants = stylex.create({
	default: {
		cornerShape: {
			"[data-size='sm']": "superellipse(1)",
			default: "superellipse(1.3)",
		},
	},
	pill: {
		borderRadius: tokens["--radius-full"],
	},
	circle: {
		padding: 0,
		borderRadius: tokens["--radius-full"],
		aspectRatio: "1 / 1",
	},
	square: {
		padding: 0,
		cornerShape: "superellipse(1.3)",
		aspectRatio: "1 / 1",
	},
});

export type ButtonVariant = keyof typeof colorVariants;
export type ButtonSize = keyof typeof sizeVariants;
export type ButtonShape = keyof typeof shapeVariants;
export type ButtonProps = Omit<BaseButton.Props, "className" | "color" | "style" | keyof ButtonThemeProps> &
	ButtonThemeProps & {
		variant?: ButtonVariant;
		size?: ButtonSize;
		shape?: ButtonShape;
		className?: string;
		/** Visual content positioned before the label. */
		startSlot?: ReactNode;
		/** Visual content positioned after the label. */
		endSlot?: ReactNode;
		/** Whether the button shows its loading state and ignores interaction. */
		loading?: boolean;
		/** Visible loading label. Defaults to `"Loading…"`; use an empty string for a loader only. */
		loadingText?: string;
		/** StyleX overrides, applied after the component's own styles. */
		style?: StyleXStyles;
	};

export type IconButtonProps = Omit<
	ButtonProps,
	"aria-label" | "children" | "endSlot" | "loadingText" | "shape" | "startSlot"
> & {
	icon: ReactNode;
	label: string;
	shape?: Extract<ButtonShape, "circle" | "square">;
	/** Visible tooltip text. Defaults to `label`; use `false` to disable it. */
	tooltip?: string | false;
};

type ButtonRootProps = ButtonProps & {
	iconOnly?: boolean;
};

export function Button(props: ButtonProps) {
	return <ButtonRoot {...props} />;
}

export function IconButton({ icon, label, shape = "square", tooltip = label, ...props }: IconButtonProps) {
	const button = <ButtonRoot {...props} aria-label={label} iconOnly shape={shape} startSlot={icon} />;

	if (tooltip === false) {
		return button;
	}

	return (
		<Tooltip.Root>
			<Tooltip.Trigger render={button} />
			<Tooltip.Popup>{tooltip}</Tooltip.Popup>
		</Tooltip.Root>
	);
}

function ButtonRoot({
	ref,
	variant = "primary",
	size = "md",
	shape = "default",
	className,
	style,
	type = "button",
	render,
	nativeButton,
	children,
	startSlot,
	endSlot,
	loading = false,
	loadingText = "Loading…",
	disabled,
	focusableWhenDisabled,
	"aria-busy": ariaBusy,
	iconOnly = false,
	...props
}: ButtonRootProps) {
	const { restProps, styles } = resolveThemeProps(props, buttonThemeProps);
	const sx = stylex.props(
		buttonParts.root,
		focusRing.offset,
		pressable.transition,
		colorVariants[variant],
		sizeVariants[size],
		shapeVariants[shape],
		...styles,
		iconOnly && iconOnlyControlSizes[size],
		style,
	);
	const resolvedLoadingText = iconOnly ? "" : loadingText;

	return (
		<BaseButton
			ref={ref}
			type={type}
			render={render}
			nativeButton={nativeButton}
			aria-busy={loading ? true : ariaBusy}
			disabled={loading || disabled}
			focusableWhenDisabled={loading || focusableWhenDisabled}
			data-icon-only={iconOnly ? "" : undefined}
			data-loading={loading ? "" : undefined}
			data-shape={shape}
			data-size={size}
			data-variant={variant}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...restProps}>
			<span {...stylex.props(contentParts.resting, loading && contentParts.transparent)}>
				{renderSlot(startSlot, "start", size, variant, iconOnly)}
				{children}
				{renderSlot(endSlot, "end", size, variant, iconOnly)}
			</span>
			{loading && (
				<span aria-hidden {...stylex.props(contentParts.loading)}>
					{renderSlot(<Loader aria-hidden />, "loading", size, variant, iconOnly || resolvedLoadingText.length === 0)}
					{resolvedLoadingText.length > 0 && (
						<span {...stylex.props(contentParts.loadingText)}>{resolvedLoadingText}</span>
					)}
				</span>
			)}
		</BaseButton>
	);
}

function renderSlot(
	slot: ReactNode,
	role: "start" | "end" | "loading",
	size: ButtonSize,
	variant: ButtonVariant,
	iconOnly: boolean,
) {
	if (slot == null || typeof slot === "boolean") {
		return null;
	}

	const sx = stylex.props(
		slotParts.root,
		iconOnly ? iconOnlySlotSizes[size] : slotSizes[size],
		!iconOnly && role === "start" && startSlotOffsets[size],
		!iconOnly && role === "end" && endSlotOffsets[size],
		!iconOnly && (variant === "neutral" || variant === "secondary" || variant === "ghost") && slotParts.muted,
	);

	return (
		<span aria-hidden className={sx.className} style={sx.style}>
			{slot}
		</span>
	);
}
