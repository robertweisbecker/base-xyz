import { Popover as BasePopover } from "@base-ui/react/popover";
import { XIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { type ComponentProps } from "react";
import { textColorStyles, textStyles, textWeightStyles } from "@/components/text/text.stylex";
import { focusRing } from "@/styles/recipes/focus";
import {
	popupArrowStyles,
	popupMotionStyles,
	popupPositionerStyles,
	popupViewportStyles,
} from "@/components/popover/popover.stylex";
import { popupVars } from "@/components/popover/popover-vars.stylex";
import { pressable } from "@/styles/recipes/transitions";
import { color, radius, shadow, size, space } from "@/styles/tokens.stylex";
import { IconButton } from "../button/button";

type StyledProps<T> = Omit<T, "className" | "style"> & {
	className?: string;
	style?: StyleXStyles;
};

export type PopoverBackdropProps = StyledProps<BasePopover.Backdrop.Props>;
export type PopoverPositionerProps = StyledProps<BasePopover.Positioner.Props>;
export type PopoverViewportProps = StyledProps<BasePopover.Viewport.Props>;
export type PopoverArrowProps = StyledProps<BasePopover.Arrow.Props>;
export type PopoverPopupProps = StyledProps<BasePopover.Popup.Props> & {
	arrowProps?: PopoverArrowProps;
	backdropProps?: PopoverBackdropProps;
	portalProps?: Omit<BasePopover.Portal.Props, "children">;
	positionerProps?: PopoverPositionerProps;
	showClose?: boolean;
};

function Positioner({ ref, className, style, sideOffset = 8, ...props }: PopoverPositionerProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(popupPositionerStyles, style);

	return (
		<BasePopover.Positioner
			ref={ref}
			sideOffset={sideOffset}
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}
			{...props}
		/>
	);
}

export function Popup({
	ref,
	arrowProps,
	backdropProps,
	children,
	className,
	portalProps,
	positionerProps,
	style,
	showClose = true,
	...props
}: PopoverPopupProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(
		popoverParts.panelSurface,
		popoverParts.popup,
		popupMotionStyles.anchoredPopup,
		style,
	);

	return (
		<BasePopover.Portal {...portalProps}>
			{backdropProps ? <Backdrop {...backdropProps} /> : null}
			<Positioner {...positionerProps}>
				<BasePopover.Popup
					ref={ref}
					className={[sxClassName, className].filter(Boolean).join(" ")}
					style={sxStyle}
					{...props}>
					{arrowProps ? <Arrow {...arrowProps} /> : null}
					{children}
					{showClose && <Close variant="iconButton" />}
				</BasePopover.Popup>
			</Positioner>
		</BasePopover.Portal>
	);
}

export function Viewport({ ref, className, style, ...props }: PopoverViewportProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(popoverParts.viewport, popupViewportStyles, style);

	return (
		<BasePopover.Viewport
			ref={ref}
			className={[sxClassName, "ds-popup-viewport", className].filter(Boolean).join(" ")}
			style={sxStyle}
			{...props}
		/>
	);
}

function Backdrop({ ref, className, style, ...props }: PopoverBackdropProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(style);

	return (
		<BasePopover.Backdrop
			ref={ref}
			className={[sxClassName, className].filter(Boolean).join(" ") || undefined}
			style={sxStyle}
			{...props}
		/>
	);
}

function Arrow({ ref, className, style, ...props }: PopoverArrowProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(popupArrowStyles, style);

	return (
		<BasePopover.Arrow
			ref={ref}
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}
			{...props}
		/>
	);
}

export function Title({ ref, className, style, ...props }: StyledProps<BasePopover.Title.Props>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(popoverText.title, style);

	return (
		<BasePopover.Title
			ref={ref}
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}
			{...props}
		/>
	);
}

export function Description({ ref, className, style, ...props }: StyledProps<BasePopover.Description.Props>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(popoverText.description, style);

	return (
		<BasePopover.Description
			ref={ref}
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}
			{...props}
		/>
	);
}

export type PopoverCloseVariant = "iconButton" | "button";

export function Close({
	ref,
	variant = "iconButton",
	className,
	style,
	...props
}: StyledProps<BasePopover.Close.Props> & { variant?: PopoverCloseVariant }) {
	const { className: sxClassName, style: sxStyle } = stylex.props(
		variant === "button" && popoverText.button,
		popoverCloseVariants[variant],
		focusRing.outset,
		pressable.transition,
		style,
	);

	return (
		<BasePopover.Close
			ref={ref}
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}
			{...props}>
			{variant === "iconButton" ? <XIcon weight="bold" size={12} /> : <>{props.children}</>}
		</BasePopover.Close>
	);
}

export function Footer({ className, style, ...props }: StyledProps<ComponentProps<"div">>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(popoverParts.footer, style);

	return <div className={[sxClassName, className].filter(Boolean).join(" ")} style={sxStyle} {...props} />;
}

export function HeaderClose({
	ref,
	"aria-label": ariaLabel = "Close",
	className,
	style,
	...props
}: StyledProps<BasePopover.Close.Props>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(popoverParts.headerClose, style);

	return (
		<BasePopover.Close
			aria-label={ariaLabel}
			className={[sxClassName, className].filter(Boolean).join(" ")}
			ref={ref}
			render={
				<IconButton
					icon={<XIcon aria-hidden weight="bold" />}
					label={ariaLabel}
					size="xs"
					tooltip={false}
					variant="neutral"
				/>
			}
			style={sxStyle}
			{...props}
		/>
	);
}

export const Root = BasePopover.Root;
export const Trigger = BasePopover.Trigger;

const popoverParts = stylex.create({
	panelSurface: {
		[popupVars.background]: color.bgElevated,
		[popupVars.border]: color.border,
		[popupVars.foreground]: color.fg,
		borderRadius: radius.lg,
		backgroundColor: popupVars.background,
		boxShadow: shadow.md,
		color: popupVars.foreground,
	},
	popup: {
		gap: space.x2,
		outline: "0",
		paddingBlock: space.x3,
		paddingInline: space.x3,
		display: "flex",
		flexDirection: "column",
		position: "relative",
		maxWidth: "min(calc(100vw - 32px), 28rem)",
	},
	viewport: {
		gap: space.x2,
		display: "flex",
		flexDirection: "column",
	},
	headerClose: {
		position: "absolute",
		zIndex: 1,
		right: space.x1,
		top: space.x1,
	},
	footer: {
		display: "flex",
		justifyContent: "flex-end",
		paddingBlockStart: space.x1,
	},
});

const popoverTextParts = stylex.create({
	title: { marginTop: `-.25em` },
	description: { margin: 0 },
});

const popoverText = {
	title: [textStyles.body, textWeightStyles.medium, popoverTextParts.title],
	description: [textStyles.body, textColorStyles.muted, popoverTextParts.description],
	button: [textStyles.supporting, textWeightStyles.medium],
} as const;

const popoverCloseVariants = stylex.create({
	iconButton: {
		padding: 0,
		borderRadius: radius.full,
		alignItems: "center",
		backgroundColor: {
			default: color.surfaceSubtle,
			":hover": {
				"@media (hover: hover) and (pointer: fine)": color.surfaceSubtleHover,
			},
			":active": {
				"@media (hover: hover) and (pointer: fine)": color.surfaceSubtleActive,
			},
		},
		color: {
			default: color.fgMuted,
			":hover": {
				"@media (hover: hover) and (pointer: fine)": color.fg,
			},
		},
		display: "flex",
		justifyContent: "center",
		position: "absolute",
		zIndex: 1,
		height: size["control.xs"],
		right: space.x1,
		top: space.x1,
		width: size["control.xs"],
	},
	button: {
		// bg: color.border,
		borderRadius: radius.full,
		paddingInline: space.x3,
		alignSelf: "flex-start",
		backgroundColor: {
			default: color.surfaceSubtle,
			":hover": {
				"@media (hover: hover) and (pointer: fine)": color.surfaceSubtle,
			},
		},
		color: color.fg,
		cursor: "default",
		height: "28px",
		minWidth: "28px",
	},
});
