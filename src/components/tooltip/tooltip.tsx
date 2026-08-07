import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { useRender } from "@base-ui/react/use-render";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { createContext, useContext, useRef, type MouseEvent, type RefObject } from "react";
import { zIndex } from "@/styles/constants.stylex";
import { popupArrowStyles, popupPositionerStyles, popupViewportStyles } from "@/components/popover/popover.stylex";
import { tokens } from "@/theme/tokens.stylex";
import { CloseButton as CloseButtonControl } from "@/components/button/close-button";
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
	showClose?: boolean;
};
export type TooltipCloseProps = StyledProps<useRender.ComponentProps<"button">>;
export type TooltipCloseButtonProps = Omit<TooltipCloseProps, "aria-label" | "children" | "render"> & {
	"aria-label"?: string;
};

const TooltipActionsContext = createContext<RefObject<BaseTooltip.Root.Actions | null> | null>(null);

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
	showClose = false,
	style,
	...props
}: TooltipPopupProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(
		tooltipStyles.popup,
		tooltipParts.popup,
		showClose && tooltipParts.popupWithClose,
		style,
	);

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
					{showClose && <CloseButton />}
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

export function Root<Payload>({ actionsRef, children, ...props }: BaseTooltip.Root.Props<Payload>) {
	const internalActionsRef = useRef<BaseTooltip.Root.Actions>(null);
	const resolvedActionsRef = actionsRef ?? internalActionsRef;

	return (
		<TooltipActionsContext.Provider value={resolvedActionsRef}>
			<BaseTooltip.Root actionsRef={resolvedActionsRef} {...props}>
				{children}
			</BaseTooltip.Root>
		</TooltipActionsContext.Provider>
	);
}

/** Unstyled close primitive for custom buttons and actions. */
export function Close({ ref, className, style, render, onClick, type = "button", ...props }: TooltipCloseProps) {
	const actionsRef = useContext(TooltipActionsContext);
	const { className: sxClassName, style: sxStyle } = stylex.props(style);

	return useRender({
		defaultTagName: "button",
		ref,
		render,
		props: {
			...props,
			type,
			className: [sxClassName, className].filter(Boolean).join(" ") || undefined,
			style: sxStyle,
			onClick(event: MouseEvent<HTMLButtonElement>) {
				onClick?.(event);
				if (!event.defaultPrevented) {
					actionsRef?.current?.close();
				}
			},
		},
	});
}

/** Neutral circular X button, absolutely positioned in the popup by default. */
export function CloseButton({
	ref,
	"aria-label": ariaLabel = "Close",
	className,
	style,
	...props
}: TooltipCloseButtonProps) {
	return (
		<Close
			ref={ref}
			aria-label={ariaLabel}
			className={className}
			render={<CloseButtonControl label={ariaLabel} />}
			style={[tooltipParts.closeButton, style]}
			{...props}
		/>
	);
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
	closeButton: {
		position: "absolute",
		zIndex: 1,
		right: tokens["--space-1"],
		top: tokens["--space-1"],
	},
	popup: {
		hyphens: "auto",
		overflowWrap: "anywhere",
		position: "relative",
		wordBreak: "break-word",
	},
	popupWithClose: {
		paddingInlineEnd: tokens["--space-8"],
		minHeight: tokens["--size-control-sm"],
	},
});

export const Tooltip = {
	Provider,
	Root,
	Trigger,
	Popup,
	Viewport,
	Close,
	CloseButton,
} as const;
