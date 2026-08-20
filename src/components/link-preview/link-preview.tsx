import { PreviewCard as BaseLinkPreview } from "@base-ui/react/preview-card";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { type ComponentProps } from "react";
import { focusRing } from "@/styles/recipes/focus";
import {
	popupArrowStyles,
	popupMotionStyles,
	popupPositionerStyles,
	popupViewportStyles,
} from "@/components/popover/popover.stylex";
import { popupVars } from "@/components/popover/popover-vars.stylex";
import { tokens } from "@/theme/tokens.stylex";
import { attrJoin } from "@/utils/attr-join";

type StyledProps<T> = Omit<T, "className" | "style"> & {
	className?: string;
	style?: StyleXStyles;
};

export type LinkPreviewBackdropProps = StyledProps<BaseLinkPreview.Backdrop.Props>;
export type LinkPreviewPositionerProps = StyledProps<BaseLinkPreview.Positioner.Props>;
export type LinkPreviewViewportProps = StyledProps<BaseLinkPreview.Viewport.Props>;
export type LinkPreviewArrowProps = StyledProps<BaseLinkPreview.Arrow.Props>;
export type LinkPreviewPopupProps = StyledProps<BaseLinkPreview.Popup.Props> & {
	arrowProps?: LinkPreviewArrowProps;
	backdropProps?: LinkPreviewBackdropProps;
	portalProps?: Omit<BaseLinkPreview.Portal.Props, "children">;
	positionerProps?: LinkPreviewPositionerProps;
};

export function Trigger({ ref, className, style, delay = 100, ...props }: StyledProps<BaseLinkPreview.Trigger.Props>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(linkPreviewParts.trigger, focusRing.offset, style);

	return (
		<BaseLinkPreview.Trigger
			ref={ref}
			delay={delay}
			className={attrJoin(sxClassName, className)}
			style={sxStyle}
			{...props}
		/>
	);
}

function Positioner({ ref, className, style, sideOffset = 8, ...props }: LinkPreviewPositionerProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(popupPositionerStyles, style);

	return (
		<BaseLinkPreview.Positioner
			ref={ref}
			sideOffset={sideOffset}
			className={attrJoin(sxClassName, className)}
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
	...props
}: LinkPreviewPopupProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(
		linkPreviewParts.panelSurface,
		linkPreviewParts.popup,
		popupMotionStyles.anchoredPopup,
		style,
	);

	return (
		<BaseLinkPreview.Portal {...portalProps}>
			{backdropProps ? <Backdrop {...backdropProps} /> : null}
			<Positioner {...positionerProps}>
				<BaseLinkPreview.Popup
					ref={ref}
					className={attrJoin(sxClassName, className)}
					style={sxStyle}
					{...props}>
					{arrowProps ? <Arrow {...arrowProps} /> : null}
					{children}
				</BaseLinkPreview.Popup>
			</Positioner>
		</BaseLinkPreview.Portal>
	);
}

export function Viewport({ ref, className, style, ...props }: LinkPreviewViewportProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(popupViewportStyles, style);

	return (
		<BaseLinkPreview.Viewport
			ref={ref}
			className={attrJoin(sxClassName, "xyz-popup-viewport", className)}
			style={sxStyle}
			{...props}
		/>
	);
}

function Backdrop({ ref, className, style, ...props }: LinkPreviewBackdropProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(style);

	return (
		<BaseLinkPreview.Backdrop
			ref={ref}
			className={attrJoin(sxClassName, className) || undefined}
			style={sxStyle}
			{...props}
		/>
	);
}

function Arrow({ ref, className, style, ...props }: LinkPreviewArrowProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(popupArrowStyles, style);

	return (
		<BaseLinkPreview.Arrow
			ref={ref}
			className={attrJoin(sxClassName, className)}
			style={sxStyle}
			{...props}
		/>
	);
}

export function Content({ className, style, ...props }: StyledProps<ComponentProps<"div">>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(linkPreviewParts.content, style);

	return <div className={attrJoin(sxClassName, className)} style={sxStyle} {...props} />;
}

export function Title({ className, style, ...props }: StyledProps<ComponentProps<"h3">>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(linkPreviewParts.title, style);

	return <h3 className={attrJoin(sxClassName, className)} style={sxStyle} {...props} />;
}

export function Description({ className, style, ...props }: StyledProps<ComponentProps<"p">>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(linkPreviewParts.description, style);

	return <p className={attrJoin(sxClassName, className)} style={sxStyle} {...props} />;
}

export const Root = BaseLinkPreview.Root;

const linkPreviewParts = stylex.create({
	panelSurface: {
		[popupVars.background]: tokens["--elevated"],
		[popupVars.border]: tokens["--border"],
		[popupVars.foreground]: tokens["--fg"],
		borderRadius: tokens["--radius-lg"],
		backgroundColor: popupVars.background,
		boxShadow: tokens["--shadow-md"],
		color: popupVars.foreground,
	},
	trigger: {
		borderRadius: tokens["--radius-xxs"],
		textDecoration: "underline",
		textUnderlineOffset: "3px",
	},
	popup: {
		overflow: "hidden",
		maxWidth: "calc(100vw - 32px)",
		width: "320px",
	},
	content: {
		padding: tokens["--space-3"],
		gap: tokens["--space-1"],
		display: "flex",
		flexDirection: "column",
		fontSize: tokens["--font-size-2"],
		letterSpacing: tokens["--letter-spacing-2"],
		lineHeight: tokens["--line-height-2"],
	},
	title: {
		margin: 0,
		fontWeight: tokens["--font-weight-semibold"],
		letterSpacing: tokens["--letter-spacing-2"],
		lineHeight: tokens["--line-height-2"],
	},
	description: {
		margin: 0,
		color: tokens["--fg-muted"],
	},
});

export const LinkPreview = {
	Root,
	Trigger,
	Popup,
	Viewport,
	Content,
	Title,
	Description,
} as const;
