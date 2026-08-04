import { PreviewCard as BasePreviewCard } from "@base-ui/react/preview-card";
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
import { colors, radius, shadow, space } from "@/styles/tokens.stylex";
import { fontSize, fontWeight, letterSpacing, lineHeight } from "@/styles/tokens.stylex";

type StyledProps<T> = Omit<T, "className" | "style"> & {
	className?: string;
	style?: StyleXStyles;
};

export type PreviewCardBackdropProps = StyledProps<BasePreviewCard.Backdrop.Props>;
export type PreviewCardPositionerProps = StyledProps<BasePreviewCard.Positioner.Props>;
export type PreviewCardViewportProps = StyledProps<BasePreviewCard.Viewport.Props>;
export type PreviewCardArrowProps = StyledProps<BasePreviewCard.Arrow.Props>;
export type PreviewCardPopupProps = StyledProps<BasePreviewCard.Popup.Props> & {
	arrowProps?: PreviewCardArrowProps;
	backdropProps?: PreviewCardBackdropProps;
	portalProps?: Omit<BasePreviewCard.Portal.Props, "children">;
	positionerProps?: PreviewCardPositionerProps;
};

export function Trigger({ ref, className, style, delay = 100, ...props }: StyledProps<BasePreviewCard.Trigger.Props>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(previewCardParts.trigger, focusRing.outset, style);

	return (
		<BasePreviewCard.Trigger
			ref={ref}
			delay={delay}
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}
			{...props}
		/>
	);
}

function Positioner({ ref, className, style, sideOffset = 8, ...props }: PreviewCardPositionerProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(popupPositionerStyles, style);

	return (
		<BasePreviewCard.Positioner
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
	...props
}: PreviewCardPopupProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(
		previewCardParts.panelSurface,
		previewCardParts.popup,
		popupMotionStyles.anchoredPopup,
		style,
	);

	return (
		<BasePreviewCard.Portal {...portalProps}>
			{backdropProps ? <Backdrop {...backdropProps} /> : null}
			<Positioner {...positionerProps}>
				<BasePreviewCard.Popup
					ref={ref}
					className={[sxClassName, className].filter(Boolean).join(" ")}
					style={sxStyle}
					{...props}>
					{arrowProps ? <Arrow {...arrowProps} /> : null}
					{children}
				</BasePreviewCard.Popup>
			</Positioner>
		</BasePreviewCard.Portal>
	);
}

export function Viewport({ ref, className, style, ...props }: PreviewCardViewportProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(popupViewportStyles, style);

	return (
		<BasePreviewCard.Viewport
			ref={ref}
			className={[sxClassName, "ds-popup-viewport", className].filter(Boolean).join(" ")}
			style={sxStyle}
			{...props}
		/>
	);
}

function Backdrop({ ref, className, style, ...props }: PreviewCardBackdropProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(style);

	return (
		<BasePreviewCard.Backdrop
			ref={ref}
			className={[sxClassName, className].filter(Boolean).join(" ") || undefined}
			style={sxStyle}
			{...props}
		/>
	);
}

function Arrow({ ref, className, style, ...props }: PreviewCardArrowProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(popupArrowStyles, style);

	return (
		<BasePreviewCard.Arrow
			ref={ref}
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}
			{...props}
		/>
	);
}

export function Content({ className, style, ...props }: StyledProps<ComponentProps<"div">>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(previewCardParts.content, style);

	return <div className={[sxClassName, className].filter(Boolean).join(" ")} style={sxStyle} {...props} />;
}

export function Title({ className, style, ...props }: StyledProps<ComponentProps<"h3">>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(previewCardParts.title, style);

	return <h3 className={[sxClassName, className].filter(Boolean).join(" ")} style={sxStyle} {...props} />;
}

export function Description({ className, style, ...props }: StyledProps<ComponentProps<"p">>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(previewCardParts.description, style);

	return <p className={[sxClassName, className].filter(Boolean).join(" ")} style={sxStyle} {...props} />;
}

export const Root = BasePreviewCard.Root;

const previewCardParts = stylex.create({
	panelSurface: {
		[popupVars.background]: colors["--elevated"],
		[popupVars.border]: colors["--border"],
		[popupVars.foreground]: colors["--text"],
		borderRadius: radius.lg,
		backgroundColor: popupVars.background,
		boxShadow: shadow.md,
		color: popupVars.foreground,
	},
	trigger: {
		borderRadius: radius.xxs,
		textDecoration: "underline",
		textUnderlineOffset: "3px",
	},
	popup: {
		overflow: "hidden",
		maxWidth: "calc(100vw - 32px)",
		width: "320px",
	},
	content: {
		padding: space[3],
		gap: space[1],
		display: "flex",
		flexDirection: "column",
		fontSize: fontSize.x2,
		letterSpacing: letterSpacing.x2,
		lineHeight: lineHeight.x2,
	},
	title: {
		margin: 0,
		fontWeight: fontWeight.semibold,
		letterSpacing: letterSpacing.x2,
		lineHeight: lineHeight.x2,
	},
	description: {
		margin: 0,
		color: colors["--text-muted"],
	},
});
