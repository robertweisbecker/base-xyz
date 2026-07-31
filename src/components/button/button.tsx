import { Button as BaseButton } from "@base-ui/react/button";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { isValidElement, type ReactNode } from "react";
import { focusRing } from "@/styles/recipes/focus";
import { pressable } from "@/styles/recipes/transitions";
import { color, radius, size, space, shadow } from "@/styles/tokens.stylex";
import { fontSize, fontWeight, letterSpacing, lineHeight } from "@/styles/tokens.stylex";
import * as Tooltip from "../tooltip/tooltip";

const HOVER_WHEN_INACTIVE =
	':hover:not(:disabled):not([aria-disabled="true"]):not([data-disabled]):not([aria-pressed="true"]):not([data-active]):not([data-panel-open]):not([data-popup-open]):not([data-pressed])';
const PRESSED_OR_ACTIVATED =
	':is(:active, [aria-pressed="true"], [data-active], [data-panel-open], [data-popup-open], [data-pressed])';

const buttonParts = stylex.create({
	root: {
		gap: space.x2,
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

const labeledSlotSizes = stylex.create({
	xs: { fontSize: "0.875em" },
	sm: { fontSize: "1em" },
	md: { fontSize: "1rem" },
	lg: { fontSize: "1.125em" },
});

const iconOnlySlotSizes = stylex.create({
	xs: { fontSize: "0.875rem" },
	sm: { fontSize: "1em" },
	md: { fontSize: "1.125em" },
	lg: { fontSize: "1em" },
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
			[HOVER_WHEN_INACTIVE]: {
				"@media (hover: hover) and (pointer: fine)": color.bgAccentHover,
			},
			[PRESSED_OR_ACTIVATED]: color.bgAccentHover,
			default: color.bgAccent,
		},
		boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${color.bgAccent} 90%, black), inset 0 1px 0 1px color-mix(in oklch, white 20%, ${color.bgAccent})`,
		color: color.fgAccentContrast,
	},
	subtle: {
		backgroundColor: {
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[HOVER_WHEN_INACTIVE]: {
				"@media (hover: hover) and (pointer: fine)": color.bgAccentSoftHover,
			},
			[PRESSED_OR_ACTIVATED]: color.bgAccentMuted,
			default: color.bgAccentSoft,
		},
		color: {
			[PRESSED_OR_ACTIVATED]: color.fgAccentStrong,
			default: color.fgAccent,
		},
	},
	secondary: {
		backgroundColor: {
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[HOVER_WHEN_INACTIVE]: {
				"@media (hover: hover) and (pointer: fine)": color.highlight,
			},
			[PRESSED_OR_ACTIVATED]: color.canvasSubtle,
			default: color.bgElevated,
		},
		boxShadow: {
			[PRESSED_OR_ACTIVATED]: shadow.inset,
			default: shadow.sm,
		},
	},
	neutral: {
		backgroundColor: {
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[HOVER_WHEN_INACTIVE]: {
				"@media (hover: hover) and (pointer: fine)": color.surfaceSubtleHover,
			},
			[PRESSED_OR_ACTIVATED]: color.surfaceSubtleHover,
			default: color.surfaceSubtle,
			":active": color.surfaceSubtleActive,
		},
		color: {
			[HOVER_WHEN_INACTIVE]: {
				"@media (hover: hover) and (pointer: fine)": color.fg,
			},
			[PRESSED_OR_ACTIVATED]: color.fg,
			default: color.fg,
		},
	},
	ghost: {
		borderColor: "transparent",
		backgroundColor: {
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[HOVER_WHEN_INACTIVE]: {
				"@media (hover: hover) and (pointer: fine)": color.highlight,
			},
			[PRESSED_OR_ACTIVATED]: color.surfaceSubtle,
			default: "transparent",
		},
		color: {
			[HOVER_WHEN_INACTIVE]: {
				"@media (hover: hover) and (pointer: fine)": color.fgMuted,
			},
			[PRESSED_OR_ACTIVATED]: color.fg,
			default: color.fgMuted,
		},
	},
	plain: {
		backgroundColor: {
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[HOVER_WHEN_INACTIVE]: {
				"@media (hover: hover) and (pointer: fine)": color.highlight,
			},
			[PRESSED_OR_ACTIVATED]: color.surfaceSubtle,
			default: "transparent",
		},
		color: {
			[HOVER_WHEN_INACTIVE]: {
				"@media (hover: hover) and (pointer: fine)": color.fg,
			},
			[PRESSED_OR_ACTIVATED]: color.fg,
			default: color.fgMuted,
		},
	},
	danger: {
		borderColor: color.bgDanger,
		backgroundColor: {
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[HOVER_WHEN_INACTIVE]: {
				"@media (hover: hover) and (pointer: fine)": color.bgDanger,
			},
			[PRESSED_OR_ACTIVATED]: color.bgDanger,
			default: color.bgDangerSubtle,
		},
		color: {
			[HOVER_WHEN_INACTIVE]: {
				"@media (hover: hover) and (pointer: fine)": color.fgAccentContrast,
			},
			[PRESSED_OR_ACTIVATED]: color.fgAccentContrast,
			default: color.bgDanger,
		},
	},
});

const sizeVariants = stylex.create({
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
		gap: space.x1_5,
		paddingBlock: space.x2,
		paddingInline: space.x3,
		fontSize: "13px",
		fontWeight: fontWeight.medium,
		letterSpacing: "-.0125em",
		lineHeight: lineHeight.x2,
		height: size["control.sm"],
		minWidth: size["control.sm"],
	},
	md: {
		borderRadius: radius.md,
		paddingBlock: space.x3,
		paddingInline: space.x3,
		fontWeight: fontWeight.medium,
		height: size["control.md"],
		minWidth: size["control.md"],
	},
	lg: {
		borderRadius: radius.lg,
		paddingBlock: space.x4,
		paddingInline: space.x5,
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
			default: "superellipse(1.3)",
			"[data-size='sm']": "superellipse(1)",
		},
	},
	pill: {
		borderRadius: radius.full,
	},
	circle: {
		padding: 0,
		borderRadius: radius.full,
		aspectRatio: 1,
	},
	square: {
		padding: 0,
		cornerShape: "superellipse(1.3)",
		aspectRatio: 1,
	},
});

export type ButtonVariant = keyof typeof colorVariants;
export type ButtonSize = keyof typeof sizeVariants;
export type ButtonShape = keyof typeof shapeVariants;

export type ButtonProps = Omit<BaseButton.Props, "className" | "style"> & {
	variant?: ButtonVariant;
	size?: ButtonSize;
	shape?: ButtonShape;
	className?: string;
	/** Visual content positioned before the label. */
	startSlot?: ReactNode;
	/** Visual content positioned after the label. */
	endSlot?: ReactNode;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export type IconButtonProps = Omit<ButtonProps, "aria-label" | "children" | "endSlot" | "shape" | "startSlot"> & {
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
	iconOnly = false,
	...props
}: ButtonRootProps) {
	const sx = stylex.props(
		buttonParts.root,
		focusRing.outset,
		pressable.transition,
		colorVariants[variant],
		sizeVariants[size],
		shapeVariants[shape],
		style,
	);
	const rendersNativeButton = nativeButton ?? (render == null || (isValidElement(render) && render.type === "button"));

	return (
		<BaseButton
			ref={ref}
			type={type}
			render={render}
			nativeButton={rendersNativeButton}
			data-icon-only={iconOnly ? "" : undefined}
			data-shape={shape}
			data-size={size}
			data-variant={variant}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}>
			{renderSlot(startSlot, "start", size, variant, iconOnly)}
			{children}
			{renderSlot(endSlot, "end", size, variant, iconOnly)}
		</BaseButton>
	);
}

function renderSlot(
	slot: ReactNode,
	position: "start" | "end",
	size: ButtonSize,
	variant: ButtonVariant,
	iconOnly: boolean,
) {
	if (slot == null) {
		return null;
	}

	const sx = stylex.props(
		slotParts.root,
		iconOnly ? iconOnlySlotSizes[size] : labeledSlotSizes[size],
		!iconOnly && position === "start" && startSlotOffsets[size],
		!iconOnly && position === "end" && endSlotOffsets[size],
		!iconOnly && (variant === "neutral" || variant === "secondary" || variant === "ghost") && slotParts.muted,
	);

	return (
		<span aria-hidden className={sx.className} style={sx.style}>
			{slot}
		</span>
	);
}
