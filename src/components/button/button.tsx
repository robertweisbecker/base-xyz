import { Button as BaseButton } from "@base-ui/react/button";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { resolveThemeProps } from "@/theme/theme-props";
import { focusRing } from "@/styles/recipes/focus";
import { pressable } from "@/styles/recipes/transitions";
import { color, radius, size, space, shadow } from "@/styles/tokens.stylex";
import { fontSize, fontWeight, letterSpacing, lineHeight } from "@/styles/tokens.stylex";
import { Loader } from "../loader/loader";
import * as Tooltip from "../tooltip/tooltip";
import { buttonThemeProps, type ButtonThemeProps } from "./button-theme-props";

export type { ButtonThemeProps } from "./button-theme-props";

const HOVER_NOT_PRESSED_OR_OPEN =
	':hover:not(:disabled):not([aria-disabled="true"]):not([data-disabled]):not([aria-pressed="true"]):not([data-active]):not([data-panel-open]):not([data-popup-open]):not([data-pressed])';
const PRESSED =
	':is(:active, [aria-pressed="true"], [data-active], [data-panel-open], [data-popup-open], [data-pressed])';

const buttonParts = stylex.create({
	root: {
		gap: space[2],
		overflow: "hidden",
		textDecoration: "none",
		alignItems: "center",
		cursor: {
			default: "default",
			":is(a[href])": "pointer",
		},
		display: "inline-flex",
		fontSize: fontSize.x2,
		fontWeight: fontWeight.medium,
		justifyContent: "center",
		letterSpacing: letterSpacing.x2,
		lineHeight: lineHeight.x2,
		opacity: {
			default: 1,
			":disabled": 0.48,
		},
		pointerEvents: {
			default: "auto",
			":disabled": "none",
		},
		position: "relative",
		transform: {
			default: "scale(1)",
			":active": "scale(0.98)",
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
		color: color.fgMuted,
	},
});

const contentParts = stylex.create({
	resting: {
		display: "contents",
	},
	transparent: {
		color: "transparent",
		textShadow: "none",
	},
	loading: {
		inset: space[1],
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
	xs: { fontSize: "0.875em" },
	sm: { fontSize: "1em" },
	md: { fontSize: "1rem" },
	lg: { fontSize: "1.125em" },
});

const iconOnlySlotSizes = stylex.create({
	xs: { fontSize: "1rem" }, // 16px
	sm: { fontSize: "1rem" }, // 16px
	md: { fontSize: "1.125rem" }, // 18px
	lg: { fontSize: "1.25rem" }, // 20px
});

const iconOnlyControlSizes = stylex.create({
	xs: {
		height: size["control.xs"],
		maxWidth: size["control.xs"],
		minWidth: size["control.xs"],
	},
	sm: {
		height: size["control.sm"],
		maxWidth: size["control.sm"],
		minWidth: size["control.sm"],
	},
	md: {
		height: size["control.md"],
		maxWidth: size["control.md"],
		minWidth: size["control.md"],
	},
	lg: {
		height: size["control.lg"],
		maxWidth: size["control.lg"],
		minWidth: size["control.lg"],
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
				"@media (hover: hover) and (pointer: fine)": color.bgAccentHover,
			},
			[PRESSED]: color.bgAccentHover,
			default: color.bgAccent,
		},
		backgroundImage: `linear-gradient(to bottom, ${color.bgAccentHover},transparent 40%)`,
		boxShadow: {
			[PRESSED]: `inset 0 0 0.08em color-mix(in oklch, black 20%, ${color.bgAccent}), inset 0 0.08em 0.16em 0.08em color-mix(in oklch, black 10%, ${color.bgAccent})`,
			"[data-disabled]": null,
			default: `inset 0 0 0.04em 0.08em color-mix(in srgb, ${color.bgAccent} 90%, ${color.fg}), inset 0 0.04em 0.04em 0.08em color-mix(in oklch, white 40%, ${color.bgAccent}), var(--shadow-ring)`,
		},
		color: color.fgAccentContrast,
		textShadow: `0 .03em .06em oklch(from ${color.bgAccent} calc(l*0.7) calc(c*1.1) h)`,
	},
	subtle: {
		backgroundColor: {
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[HOVER_NOT_PRESSED_OR_OPEN]: {
				"@media (hover: hover) and (pointer: fine)": color.bgAccentSoftHover,
			},
			[PRESSED]: color.bgAccentMuted,
			default: color.bgAccentSoft,
		},
		color: {
			[PRESSED]: color.fgAccentStrong,
			default: color.fgAccent,
		},
	},
	secondary: {
		backgroundColor: {
			[HOVER_NOT_PRESSED_OR_OPEN]: color.highlight,
			[PRESSED]: color.bgElevatedActive,
			default: color.bgElevated,
		},
		boxShadow: {
			[PRESSED]: shadow.inset,
			default: shadow.sm,
		},
		color: color.fg,
	},
	neutral: {
		backgroundColor: {
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[HOVER_NOT_PRESSED_OR_OPEN]: {
				"@media (hover: hover) and (pointer: fine)": color.surfaceSubtleHover,
			},
			[PRESSED]: color.surfaceSubtleHover,
			default: color.surfaceSubtle,
			":active": color.surfaceSubtleActive,
		},
		color: {
			[HOVER_NOT_PRESSED_OR_OPEN]: {
				"@media (hover: hover) and (pointer: fine)": color.fg,
			},
			[PRESSED]: color.fgSubtle,
			default: color.fgMuted,
			":active": color.fgSubtle,
		},
	},
	ghost: {
		borderColor: "transparent",
		backgroundColor: {
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[HOVER_NOT_PRESSED_OR_OPEN]: {
				"@media (hover: hover) and (pointer: fine)": color.highlight,
			},
			[PRESSED]: color.surfaceSubtle,
			default: "transparent",
		},
		color: {
			[HOVER_NOT_PRESSED_OR_OPEN]: {
				"@media (hover: hover) and (pointer: fine)": color.fgMuted,
			},
			[PRESSED]: color.fg,
			default: color.fgMuted,
		},
	},
	plain: {
		backgroundColor: {
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[HOVER_NOT_PRESSED_OR_OPEN]: {
				"@media (hover: hover) and (pointer: fine)": color.highlight,
			},
			default: "transparent",
		},
		color: {
			[HOVER_NOT_PRESSED_OR_OPEN]: {
				"@media (hover: hover) and (pointer: fine)": color.fg,
			},
			[PRESSED]: color.fg,
			default: color.fgMuted,
		},
	},
	danger: {
		borderColor: color.bgDanger,
		backgroundColor: {
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[HOVER_NOT_PRESSED_OR_OPEN]: {
				"@media (hover: hover) and (pointer: fine)": color.bgDanger,
			},
			[PRESSED]: color.bgDanger,
			default: color.bgDangerSubtle,
		},
		color: {
			[HOVER_NOT_PRESSED_OR_OPEN]: {
				"@media (hover: hover) and (pointer: fine)": color.fgAccentContrast,
			},
			[PRESSED]: color.fgAccentContrast,
			default: color.bgDanger,
		},
	},
});

const sizeVariants = stylex.create({
	xs: {
		borderRadius: radius.sm,
		gap: space[1],
		paddingBlock: space[2],
		paddingInline: space[2],
		fontSize: fontSize.x1,
		fontWeight: fontWeight.medium,
		letterSpacing: letterSpacing.x1,
		lineHeight: lineHeight.x1,
		height: size["control.xs"],
		minWidth: size["control.xs"],
	},
	sm: {
		borderRadius: radius.sm,
		gap: space[1.5],
		paddingBlock: space[2],
		paddingInline: space[3],
		fontSize: "13px",
		fontWeight: fontWeight.medium,
		letterSpacing: "-.0125em",
		lineHeight: lineHeight.x2,
		height: size["control.sm"],
		minWidth: size["control.sm"],
	},
	md: {
		borderRadius: radius.md,
		paddingBlock: space[3],
		paddingInline: space[3],
		fontWeight: fontWeight.medium,
		height: size["control.md"],
		minWidth: size["control.md"],
	},
	lg: {
		borderRadius: radius.lg,
		paddingBlock: space[4],
		paddingInline: space[5],
		fontSize: fontSize.x3,
		letterSpacing: letterSpacing.x3,
		lineHeight: lineHeight.x3,
		height: size["control.lg"],
		minWidth: size["control.lg"],
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
		borderRadius: radius.full,
	},
	circle: {
		padding: 0,
		borderRadius: radius.full,
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
		focusRing.outset,
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
