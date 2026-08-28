import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";

import * as stylex from "@stylexjs/stylex";
import { zIndex } from "@/styles/constants.stylex";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import {
	popupArrowStyles,
	popupPositionerStyles,
	popupViewportStyles,
} from "@/components/popover/popover.stylex";
import { tooltipStyles } from "./tooltip.stylex";
import { attrJoin } from "@/utils/attr-join";

type StyledProps<T> = Omit<T, "className" | "style" | "xstyle"> &
	BaseStyleProps & { className?: string };

export type TooltipPositionerProps = StyledProps<BaseTooltip.Positioner.Props>;
export type TooltipViewportProps = StyledProps<BaseTooltip.Viewport.Props>;
export type TooltipArrowProps = StyledProps<BaseTooltip.Arrow.Props>;
export type TooltipPopupProps = StyledProps<BaseTooltip.Popup.Props> & {
	arrowProps?: TooltipArrowProps;
	portalProps?: Omit<BaseTooltip.Portal.Props, "children">;
	positionerProps?: TooltipPositionerProps;
};

function Positioner({
	ref,
	className,
	style,
	xstyle,
	sideOffset = 4,
	...props
}: TooltipPositionerProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(
		popupPositionerStyles,
		tooltipParts.positioner,
		xstyle,
	);

	return (
		<BaseTooltip.Positioner
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
	children,
	className,
	portalProps,
	positionerProps,
	style,
	xstyle,
	...props
}: TooltipPopupProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(
		tooltipStyles.popup,
		tooltipParts.popup,
		xstyle,
	);

	return (
		<BaseTooltip.Portal {...portalProps}>
			<Positioner {...positionerProps}>
				<BaseTooltip.Popup
					ref={ref}
					className={attrJoin(sxClassName, className)}
					style={mergeStyle(sxStyle, style)}
					{...props}
				>
					{arrowProps ? <Arrow {...arrowProps} /> : null}
					{children}
				</BaseTooltip.Popup>
			</Positioner>
		</BaseTooltip.Portal>
	);
}

export function Viewport({ ref, className, style, xstyle, ...props }: TooltipViewportProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(popupViewportStyles, xstyle);

	return (
		<BaseTooltip.Viewport
			ref={ref}
			className={attrJoin(sxClassName, "xyz-popup-viewport", className)}
			style={mergeStyle(sxStyle, style)}
			{...props}
		/>
	);
}

export function Trigger({
	ref,
	closeDelay = 400,
	delay = 250,
	className,
	style,
	xstyle,
	...props
}: StyledProps<BaseTooltip.Trigger.Props>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(xstyle);

	return (
		<BaseTooltip.Trigger
			ref={ref}
			closeDelay={closeDelay}
			delay={delay}
			className={attrJoin(sxClassName, className) || undefined}
			style={mergeStyle(sxStyle, style)}
			{...props}
		/>
	);
}

export const Provider = BaseTooltip.Provider;

export function Root<Payload>(props: BaseTooltip.Root.Props<Payload>) {
	return <BaseTooltip.Root {...props} />;
}

function Arrow({ ref, className, style, xstyle, ...props }: TooltipArrowProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(popupArrowStyles, xstyle);

	return (
		<BaseTooltip.Arrow
			ref={ref}
			className={attrJoin(sxClassName, className)}
			style={mergeStyle(sxStyle, style)}
			{...props}
		/>
	);
}

const tooltipParts = stylex.create({
	positioner: {
		zIndex: zIndex.tooltip,
	},
	popup: {
		hyphens: "auto",
		overflowWrap: "anywhere",
		position: "relative",
		wordBreak: "break-word",
	},
});

export const Tooltip = {
	Provider,
	Root,
	Trigger,
	Popup,
	Viewport,
} as const;
