import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";

import * as stylex from "@stylexjs/stylex";
import { createContext, useContext, useMemo, type ReactNode } from "react";
import { zIndex } from "@/styles/constants.stylex";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { popupPositionerStyles, popupViewportStyles } from "@/components/popover/popover.stylex";
import { tooltipStyles } from "./tooltip.stylex";
import { attrJoin } from "@/utils/attr-join";

type StyledProps<T> = Omit<T, "className" | "style" | "xstyle"> &
	BaseStyleProps & { className?: string };

export type TooltipPositionerProps = StyledProps<BaseTooltip.Positioner.Props>;
export type TooltipViewportProps = StyledProps<BaseTooltip.Viewport.Props>;
export type TooltipArrowProps = StyledProps<Omit<BaseTooltip.Arrow.Props, "children">>;
export type TooltipPopupProps = StyledProps<BaseTooltip.Popup.Props> & {
	arrowProps?: TooltipArrowProps;
	portalProps?: Omit<BaseTooltip.Portal.Props, "children">;
	positionerProps?: TooltipPositionerProps;
};

export type TooltipGroupProps = {
	arrowProps?: TooltipArrowProps;
	children: ReactNode;
	disabled?: BaseTooltip.Root.Props<ReactNode>["disabled"];
	positionerProps?: TooltipPositionerProps;
	providerProps?: Omit<BaseTooltip.Provider.Props, "children">;
};

type TooltipGroupContextValue = {
	handle: BaseTooltip.Handle<ReactNode>;
	delay: number;
	closeDelay: number;
};

const DEFAULT_CLOSE_DELAY = 400;
const DEFAULT_DELAY = 250;

const TooltipGroupContext = createContext<TooltipGroupContextValue | null>(null);

/** Returns whether the current subtree participates in a shared tooltip root. */
export function useTooltipGroup() {
	return useContext(TooltipGroupContext);
}

function Positioner({
	ref,
	className,
	style,
	xstyle,
	sideOffset = 4,
	arrowPadding = 8,
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
			arrowPadding={arrowPadding}
			sideOffset={sideOffset}
			className={attrJoin(sxClassName, className)}
			style={mergeStyle(sxStyle, style)}
			disableAnchorTracking={true}
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
					{...props}
					ref={ref}
					data-slot="tooltip-popup"
					className={attrJoin(sxClassName, className)}
					style={mergeStyle(sxStyle, style)}
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
	closeDelay,
	delay,
	className,
	style,
	xstyle,
	...props
}: StyledProps<BaseTooltip.Trigger.Props>) {
	const group = useTooltipGroup();
	const resolvedCloseDelay = closeDelay ?? group?.closeDelay ?? DEFAULT_CLOSE_DELAY;
	const resolvedDelay = delay ?? group?.delay ?? DEFAULT_DELAY;
	const { className: sxClassName, style: sxStyle } = stylex.props(xstyle);

	return (
		<BaseTooltip.Trigger
			{...props}
			ref={ref}
			closeDelay={resolvedCloseDelay}
			delay={resolvedDelay}
			handle={props.handle ?? group?.handle}
			className={attrJoin(sxClassName, className) || undefined}
			style={mergeStyle(sxStyle, style)}
		/>
	);
}

export const Provider = BaseTooltip.Provider;

export function Root<Payload>(props: BaseTooltip.Root.Props<Payload>) {
	return <BaseTooltip.Root {...props} />;
}

export function Group({
	arrowProps,
	children,
	disabled,
	positionerProps,
	providerProps,
}: TooltipGroupProps) {
	const handle = useMemo(() => BaseTooltip.createHandle<ReactNode>(), []);
	const group = useMemo(
		() => ({
			closeDelay: providerProps?.closeDelay ?? DEFAULT_CLOSE_DELAY,
			delay: providerProps?.delay ?? DEFAULT_DELAY,
			handle,
		}),
		[handle, providerProps?.closeDelay, providerProps?.delay],
	);

	return (
		<BaseTooltip.Provider {...providerProps}>
			<TooltipGroupContext.Provider value={group}>
				{children}
				<Tooltip.Root disabled={disabled} handle={handle}>
					{({ payload }) => (
						<Tooltip.Popup arrowProps={arrowProps} positionerProps={positionerProps}>
							<Tooltip.Viewport>{payload}</Tooltip.Viewport>
						</Tooltip.Popup>
					)}
				</Tooltip.Root>
			</TooltipGroupContext.Provider>
		</BaseTooltip.Provider>
	);
}

function Arrow({ ref, className, style, xstyle, ...props }: TooltipArrowProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(tooltipStyles.arrow, xstyle);

	return (
		<BaseTooltip.Arrow
			{...props}
			ref={ref}
			data-slot="arrow"
			className={attrJoin(sxClassName, className)}
			style={mergeStyle(sxStyle, style)}
		>
			<svg width="20" height="10" viewBox="0 0 20 10" fill="none">
				<path
					d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
					{...stylex.props(tooltipStyles.arrowFill)}
				/>
				<path
					d="M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L15.89 7L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66436 2.60207L4.77734 7L2.13171 7.00001C2.87284 7.00001 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z"
					{...stylex.props(tooltipStyles.arrowOuterStroke)}
				/>
				<path
					d="M10.3333 3.34539L5.47654 7.71648C4.55842 8.54279 3.36693 9 2.13172 9H0V8H2.13172C3.11989 8 4.07308 7.63423 4.80758 6.97318L9.66437 2.60207C10.0447 2.25979 10.622 2.2598 11.0023 2.60207L15.8591 6.97318C16.5936 7.63423 17.5468 8 18.5349 8H20V9H18.5349C17.2998 9 16.1083 8.54278 15.1901 7.71648L10.3333 3.34539Z"
					{...stylex.props(tooltipStyles.arrowInnerStroke)}
				/>
			</svg>
		</BaseTooltip.Arrow>
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
	Group,
	Trigger,
	Popup,
	Viewport,
} as const;
