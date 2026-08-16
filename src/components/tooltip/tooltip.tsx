import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";

import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { zIndex } from "@/styles/constants.stylex";
import { popupArrowStyles, popupPositionerStyles, popupViewportStyles } from "@/components/popover/popover.stylex";
import { tooltipStyles } from "./tooltip.stylex";

type StyledProps<T> = Omit<T, "className" | "style"> & {
	className?: string;
	style?: StyleXStyles;
};

export type TooltipPositionerProps = StyledProps<BaseTooltip.Positioner.Props>;
export type TooltipViewportProps = StyledProps<BaseTooltip.Viewport.Props>;
export type TooltipArrowProps = StyledProps<BaseTooltip.Arrow.Props>;
export type TooltipPopupProps = StyledProps<BaseTooltip.Popup.Props> & {
	arrowProps?: TooltipArrowProps;
	portalProps?: Omit<BaseTooltip.Portal.Props, "children">;
	positionerProps?: TooltipPositionerProps;
};

function Positioner({ ref, className, style, sideOffset = 4, ...props }: TooltipPositionerProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(
		popupPositionerStyles,
		tooltipParts.positioner,
		style,
	);

	return (
		<BaseTooltip.Positioner
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
	children,
	className,
	portalProps,
	positionerProps,
	style,
	...props
}: TooltipPopupProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(tooltipStyles.popup, tooltipParts.popup, style);

	return (
		<BaseTooltip.Portal {...portalProps}>
			<Positioner {...positionerProps}>
				<BaseTooltip.Popup
					ref={ref}
					className={[sxClassName, className].filter(Boolean).join(" ")}
					style={sxStyle}
					{...props}>
					{arrowProps ? <Arrow {...arrowProps} /> : null}
					{children}
				</BaseTooltip.Popup>
			</Positioner>
		</BaseTooltip.Portal>
	);
}

export function Viewport({ ref, className, style, ...props }: TooltipViewportProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(popupViewportStyles, style);

	return (
		<BaseTooltip.Viewport
			ref={ref}
			className={[sxClassName, "xyz-popup-viewport", className].filter(Boolean).join(" ")}
			style={sxStyle}
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
	...props
}: StyledProps<BaseTooltip.Trigger.Props>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(style);

	return (
		<BaseTooltip.Trigger
			ref={ref}
			closeDelay={closeDelay}
			delay={delay}
			className={[sxClassName, className].filter(Boolean).join(" ") || undefined}
			style={sxStyle}
			{...props}
		/>
	);
}

export const Provider = BaseTooltip.Provider;

export function Root<Payload>(props: BaseTooltip.Root.Props<Payload>) {
	return <BaseTooltip.Root {...props} />;
}

function Arrow({ ref, className, style, ...props }: TooltipArrowProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(popupArrowStyles, style);

	return (
		<BaseTooltip.Arrow
			ref={ref}
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}
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
