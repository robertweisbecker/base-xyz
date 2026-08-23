import { Popover as BasePopover } from "@base-ui/react/popover";
import * as stylex from "@stylexjs/stylex";
import { type ComponentProps } from "react";
import { textStyles, fontWeightStyles } from "@/components/text/text.stylex";
import {
	popupArrowStyles,
	popupMotionStyles,
	popupPositionerStyles,
	popupViewportStyles,
} from "@/components/popover/popover.stylex";
import { popupVars } from "@/components/popover/popover-vars.stylex";
import { tokens } from "@/theme/tokens.stylex";
import { CloseButton as CloseButtonControl } from "@/components/button/close-button";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { attrJoin } from "@/utils/attr-join";

type StyledProps<T> = Omit<T, "className" | "style" | "xstyle"> & BaseStyleProps & { className?: string };

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

function Positioner({ ref, className, style, xstyle, sideOffset = 8, ...props }: PopoverPositionerProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(popupPositionerStyles, xstyle);

	return (
		<BasePopover.Positioner
			ref={ref}
			sideOffset={sideOffset}
			className={attrJoin(sxClassName, className)}
			style={mergeStyle(sxStyle, style)}
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
	xstyle,
	showClose = true,
	...props
}: PopoverPopupProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(
		popoverParts.panelSurface,
		popoverParts.popup,
		popupMotionStyles.anchoredPopup,
		xstyle,
	);

	return (
		<BasePopover.Portal {...portalProps}>
			{backdropProps ? <Backdrop {...backdropProps} /> : null}
			<Positioner {...positionerProps}>
				<BasePopover.Popup
					ref={ref}
					className={attrJoin(sxClassName, className)}
					style={mergeStyle(sxStyle, style)}
					{...props}>
					{arrowProps ? <Arrow {...arrowProps} /> : null}
					{children}
					{showClose && <CloseButton />}
				</BasePopover.Popup>
			</Positioner>
		</BasePopover.Portal>
	);
}

export function Viewport({ ref, className, style, xstyle, ...props }: PopoverViewportProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(popoverParts.viewport, popupViewportStyles, xstyle);

	return (
		<BasePopover.Viewport
			ref={ref}
			className={attrJoin(sxClassName, "xyz-popup-viewport", className)}
			style={mergeStyle(sxStyle, style)}
			{...props}
		/>
	);
}

function Backdrop({ ref, className, style, xstyle, ...props }: PopoverBackdropProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(xstyle);

	return (
		<BasePopover.Backdrop
			ref={ref}
			className={attrJoin(sxClassName, className) || undefined}
			style={mergeStyle(sxStyle, style)}
			{...props}
		/>
	);
}

function Arrow({ ref, className, style, xstyle, ...props }: PopoverArrowProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(popupArrowStyles, xstyle);

	return (
		<BasePopover.Arrow
			ref={ref}
			className={attrJoin(sxClassName, className)}
			style={mergeStyle(sxStyle, style)}
			{...props}
		/>
	);
}

export function Title({ ref, className, style, xstyle, ...props }: StyledProps<BasePopover.Title.Props>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(popoverText.title, xstyle);

	return (
		<BasePopover.Title
			ref={ref}
			className={attrJoin(sxClassName, className)}
			style={mergeStyle(sxStyle, style)}
			{...props}
		/>
	);
}

export function Description({ ref, className, style, xstyle, ...props }: StyledProps<BasePopover.Description.Props>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(popoverText.description, xstyle);

	return (
		<BasePopover.Description
			ref={ref}
			className={attrJoin(sxClassName, className)}
			style={mergeStyle(sxStyle, style)}
			{...props}
		/>
	);
}

export type PopoverCloseProps = StyledProps<BasePopover.Close.Props>;
export type PopoverCloseButtonProps = Omit<PopoverCloseProps, "aria-label" | "children" | "render"> & {
	"aria-label"?: string;
};

/** Unstyled close primitive for custom buttons and footer actions. */
export function Close({ ref, className, style, xstyle, ...props }: PopoverCloseProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(xstyle);

	return (
		<BasePopover.Close
			ref={ref}
			className={attrJoin(sxClassName, className) || undefined}
			style={mergeStyle(sxStyle, style)}
			{...props}
		/>
	);
}

/** Neutral circular X button, absolutely positioned in the popup by default. */
export function CloseButton({
	ref,
	"aria-label": ariaLabel = "Close",
	className,
	xstyle,
	...props
}: PopoverCloseButtonProps) {
	return (
		<Close
			ref={ref}
			aria-label={ariaLabel}
			className={className}
			nativeButton
			render={<CloseButtonControl label={ariaLabel} xstyle={[popoverParts.closeButton, xstyle]} />}
			{...props}
		/>
	);
}

export function Footer({ className, style, xstyle, ...props }: StyledProps<ComponentProps<"div">>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(popoverParts.footer, xstyle);

	return <div className={attrJoin(sxClassName, className)} style={mergeStyle(sxStyle, style)} {...props} />;
}

export const Root = BasePopover.Root;
export const Trigger = BasePopover.Trigger;

const popoverParts = stylex.create({
	panelSurface: {
		[popupVars.background]: tokens["--panel"],
		[popupVars.border]: tokens["--border"],
		[popupVars.foreground]: tokens["--fg"],
		borderRadius: tokens["--radius-md"],
		backgroundColor: popupVars.background,
		boxShadow: tokens["--shadow-md"],
		color: popupVars.foreground,
	},
	popup: {
		gap: tokens["--space-1"],
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
	title: { marginTop: 0 },
	description: { margin: 0, color: tokens["--fg-muted"] },
});

const popoverText = {
	title: [textStyles.body, fontWeightStyles.medium, popoverTextParts.title],
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
