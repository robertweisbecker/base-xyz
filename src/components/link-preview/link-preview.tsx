import { PreviewCard as BaseLinkPreview } from "@base-ui/react/preview-card";
import * as stylex from "@stylexjs/stylex";
import { type ComponentProps } from "react";
import { focusRing } from "@/styles/recipes/focus";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import type { MarginProps } from "@/styles/props/spacing.stylex";
import {
	popupArrowStyles,
	popupMotionStyles,
	popupPositionerStyles,
	popupViewportStyles,
} from "@/components/popover/popover.stylex";
import { popupVars } from "@/components/popover/popover-vars.stylex";
import { tokens } from "@/theme/tokens.stylex";
import { attrJoin } from "@/utils/attr-join";
import { Text } from "@/components/text/text";

type StyledProps<T> = Omit<T, "className" | "style" | "xstyle"> &
	BaseStyleProps & { className?: string };

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

export function Trigger({
	ref,
	className,
	style,
	xstyle,
	delay = 100,
	...props
}: StyledProps<BaseLinkPreview.Trigger.Props>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(
		linkPreviewParts.trigger,
		focusRing.offset,
		xstyle,
	);

	return (
		<BaseLinkPreview.Trigger
			ref={ref}
			delay={delay}
			className={attrJoin(sxClassName, className)}
			style={mergeStyle(sxStyle, style)}
			{...props}
		/>
	);
}

function Positioner({
	ref,
	className,
	style,
	xstyle,
	sideOffset = 8,
	...props
}: LinkPreviewPositionerProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(popupPositionerStyles, xstyle);

	return (
		<BaseLinkPreview.Positioner
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
	...props
}: LinkPreviewPopupProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(
		linkPreviewParts.popup,
		popupMotionStyles.anchoredPopup,
		xstyle,
	);

	return (
		<BaseLinkPreview.Portal {...portalProps}>
			{backdropProps ? <Backdrop {...backdropProps} /> : null}
			<Positioner {...positionerProps} alignOffset={positionerProps?.alignOffset ?? -12}>
				<BaseLinkPreview.Popup
					ref={ref}
					className={attrJoin(sxClassName, className)}
					style={mergeStyle(sxStyle, style)}
					{...props}
				>
					{arrowProps ? <Arrow {...arrowProps} /> : null}
					{children}
				</BaseLinkPreview.Popup>
			</Positioner>
		</BaseLinkPreview.Portal>
	);
}

export function Viewport({ ref, className, style, xstyle, ...props }: LinkPreviewViewportProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(popupViewportStyles, xstyle);

	return (
		<BaseLinkPreview.Viewport
			ref={ref}
			className={attrJoin(sxClassName, "xyz-popup-viewport", className)}
			style={mergeStyle(sxStyle, style)}
			{...props}
		/>
	);
}

function Backdrop({ ref, className, style, xstyle, ...props }: LinkPreviewBackdropProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(xstyle);

	return (
		<BaseLinkPreview.Backdrop
			ref={ref}
			className={attrJoin(sxClassName, className) || undefined}
			style={mergeStyle(sxStyle, style)}
			{...props}
		/>
	);
}

function Arrow({ ref, className, style, xstyle, ...props }: LinkPreviewArrowProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(popupArrowStyles, xstyle);

	return (
		<BaseLinkPreview.Arrow
			ref={ref}
			className={attrJoin(sxClassName, className)}
			style={mergeStyle(sxStyle, style)}
			{...props}
		/>
	);
}

export function Content({
	className,
	style,
	xstyle,
	...props
}: StyledProps<ComponentProps<"div">>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(linkPreviewParts.content, xstyle);

	return (
		<div
			className={attrJoin(sxClassName, className)}
			style={mergeStyle(sxStyle, style)}
			{...props}
		/>
	);
}

export function Title({ className, style, xstyle, ...props }: StyledProps<ComponentProps<"h3">>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(linkPreviewParts.title, xstyle);

	return (
		<h3
			className={attrJoin(sxClassName, className)}
			style={mergeStyle(sxStyle, style)}
			{...props}
		/>
	);
}

export function Description({
	color = "muted",
	size = "1",
	className,
	style,
	xstyle,
	...props
}: Omit<ComponentProps<typeof Text>, "className" | "style" | "xstyle" | keyof MarginProps> &
	BaseStyleProps & { className?: string }) {
	return (
		<Text
			{...props}
			size={size}
			color={color}
			className={className}
			style={style}
			xstyle={xstyle}
		/>
	);
}

export const Root = BaseLinkPreview.Root;

const linkPreviewParts = stylex.create({
	trigger: {
		borderRadius: tokens["--radius-xxs"],
		textDecoration: "underline",
		textUnderlineOffset: "3px",
	},
	popup: {
		[popupVars.background]: tokens["--elevated"],
		[popupVars.border]: tokens["--border"],
		[popupVars.foreground]: tokens["--fg"],
		borderRadius: tokens["--radius-lg"],
		overflow: "hidden",
		backgroundColor: popupVars.background,
		boxShadow: tokens["--shadow-md"],
		color: popupVars.foreground,
		maxWidth: "min(calc(100vw - 32px), 18rem)",
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
