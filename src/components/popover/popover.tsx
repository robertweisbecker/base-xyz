import { Popover as BasePopover } from "@base-ui/react/popover";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { type ComponentProps } from "react";
import { textStyles, textWeightStyles } from "@/components/text/text.stylex";
import {
	popupArrowStyles,
	popupMotionStyles,
	popupPositionerStyles,
	popupViewportStyles,
} from "@/components/popover/popover.stylex";
import { popupVars } from "@/components/popover/popover-vars.stylex";
import { tokens } from "@/theme/tokens.stylex";
import { CloseButton as CloseButtonControl } from "@/components/button/close-button";

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
					{showClose && <CloseButton />}
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
			className={[sxClassName, "xyz-popup-viewport", className].filter(Boolean).join(" ")}
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

export type PopoverCloseProps = StyledProps<BasePopover.Close.Props>;
export type PopoverCloseButtonProps = Omit<PopoverCloseProps, "aria-label" | "children" | "render"> & {
	"aria-label"?: string;
};

/** Unstyled close primitive for custom buttons and footer actions. */
export function Close({ ref, className, style, ...props }: PopoverCloseProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(style);

	return (
		<BasePopover.Close
			ref={ref}
			className={[sxClassName, className].filter(Boolean).join(" ") || undefined}
			style={sxStyle}
			{...props}
		/>
	);
}

/** Neutral circular X button, absolutely positioned in the popup by default. */
export function CloseButton({
	ref,
	"aria-label": ariaLabel = "Close",
	className,
	style,
	...props
}: PopoverCloseButtonProps) {
	return (
		<Close
			ref={ref}
			aria-label={ariaLabel}
			className={className}
			nativeButton
			render={<CloseButtonControl label={ariaLabel} />}
			style={[popoverParts.closeButton, style]}
			{...props}
		/>
	);
}

export function Footer({ className, style, ...props }: StyledProps<ComponentProps<"div">>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(popoverParts.footer, style);

	return <div className={[sxClassName, className].filter(Boolean).join(" ")} style={sxStyle} {...props} />;
}

export const Root = BasePopover.Root;
export const Trigger = BasePopover.Trigger;

const popoverParts = stylex.create({
	panelSurface: {
		[popupVars.background]: tokens["--panel"],
		[popupVars.border]: tokens["--border"],
		[popupVars.foreground]: tokens["--fg"],
		borderRadius: tokens["--radius-lg"],
		backgroundColor: popupVars.background,
		boxShadow: tokens["--shadow-md"],
		color: popupVars.foreground,
	},
	popup: {
		gap: tokens["--space-2"],
		outline: "0",
		paddingBlock: tokens["--space-3"],
		paddingInline: tokens["--space-3"],
		display: "flex",
		flexDirection: "column",
		position: "relative",
		maxWidth: "min(calc(100vw - 32px), 28rem)",
	},
	viewport: {
		gap: tokens["--space-2"],
		display: "flex",
		flexDirection: "column",
	},
	closeButton: {
		position: "absolute",
		zIndex: 1,
		right: tokens["--space-1"],
		top: tokens["--space-1"],
	},
	footer: {
		display: "flex",
		justifyContent: "flex-end",
		paddingBlockStart: tokens["--space-1"],
	},
});

const popoverTextParts = stylex.create({
	title: { marginTop: `-.25em` },
	description: { margin: 0, color: tokens["--fg-muted"] },
});

const popoverText = {
	title: [textStyles.body, textWeightStyles.medium, popoverTextParts.title],
	description: [textStyles.body, popoverTextParts.description],
} as const;

export const Popover = {
	Root,
	Trigger,
	Popup,
	Viewport,
	Title,
	Description,
	Close,
	CloseButton,
	Footer,
} as const;
