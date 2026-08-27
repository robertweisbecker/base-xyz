import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import { ToggleGroup as BaseToggleGroup } from "@base-ui/react/toggle-group";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import {
	Button,
	IconButton,
	type ButtonShape,
	type ButtonSize,
	type ButtonVariant,
	type IconButtonProps,
} from "@/components/button/button";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { extractMarginProps, type MarginProps } from "@/styles/props/spacing.stylex";
import { attrJoin } from "@/utils/attr-join";
import {
	toggleGroupMarker,
	toggleGroupStyles,
	toggleJoinStyles,
	toggleMarker,
} from "./toggle.stylex";

type ToggleBaseProps = Omit<
	BaseToggle.Props,
	| "children"
	| "className"
	| "color"
	| "height"
	| "nativeButton"
	| "render"
	| "style"
	| "width"
	| keyof MarginProps
> &
	MarginProps &
	BaseStyleProps & {
		className?: string;
		/** Visual content that replaces `startSlot` or `icon` while the toggle is pressed. */
		pressedIcon?: ReactNode;
		variant?: ButtonVariant;
		size?: ButtonSize;
	};

/** Text toggle rendered as `Button` — optional `startSlot` before the label children. */
export type ToggleButtonProps = ToggleBaseProps & {
	/** Visible label. */
	children?: ReactNode;
	/** Visual content positioned before the label. */
	startSlot?: ReactNode;
	icon?: never;
	label?: never;
	tooltip?: never;
	shape?: ButtonShape;
};

/** Icon-only toggle rendered as `IconButton` with square control sizing. */
export type ToggleIconButtonProps = ToggleBaseProps & {
	children?: never;
	/** Icon shown in the icon-only configuration. */
	icon: ReactNode;
	/** Visible tooltip text and the fallback accessible name. */
	label: string;
	startSlot?: never;
	shape?: Extract<ButtonShape, "circle" | "square">;
	/** Visible tooltip text. Defaults to `label`; use `false` to disable it. */
	tooltip?: IconButtonProps["tooltip"];
};

export type ToggleProps = ToggleButtonProps | ToggleIconButtonProps;

export type ToggleGroupProps = Omit<
	BaseToggleGroup.Props,
	"className" | "style" | keyof MarginProps
> &
	MarginProps &
	BaseStyleProps & {
		className?: string;
		/**
		 * Collapse group gap and inner radii so adjacent toggles share edges.
		 * Ghost selected toggles restore their radius except on edges shared with another selected toggle.
		 * Other variants stay fully joined when selected.
		 */
		join?: boolean;
	};

export type ToggleVariant = ButtonVariant;
export type ToggleSize = ButtonSize;
export type ToggleShape = ButtonShape;

const toggleStyleProps = stylex.props(toggleMarker, toggleJoinStyles.root);

function resolvePressedSlot(
	pressed: boolean,
	resting: ReactNode,
	pressedIcon: ReactNode | undefined,
) {
	return pressed && pressedIcon !== undefined ? pressedIcon : resting;
}

export function Toggle(props: ToggleProps) {
	if (typeof props.label === "string") {
		return <ToggleAsIconButton {...props} />;
	}

	return <ToggleAsButton {...props} />;
}

function ToggleAsButton({
	ref,
	children,
	className,
	pressedIcon,
	shape = "default",
	size = "md",
	startSlot,
	style,
	xstyle,
	variant = "ghost",
	m,
	mx,
	my,
	mt,
	mb,
	ms,
	me,
	...props
}: ToggleButtonProps) {
	return (
		<BaseToggle
			ref={ref}
			{...props}
			render={(renderProps, state) => (
				<Button
					{...renderProps}
					className={attrJoin(toggleStyleProps.className, className)}
					shape={shape}
					size={size}
					startSlot={resolvePressedSlot(state.pressed, startSlot, pressedIcon)}
					style={mergeStyle(toggleStyleProps.style, style)}
					xstyle={xstyle}
					{...{ m, mx, my, mt, mb, ms, me }}
					variant={variant}
				>
					{children}
				</Button>
			)}
		/>
	);
}

function ToggleAsIconButton({
	ref,
	className,
	icon,
	label,
	pressedIcon,
	shape = "square",
	size = "md",
	style,
	xstyle,
	tooltip,
	variant = "ghost",
	m,
	mx,
	my,
	mt,
	mb,
	ms,
	me,
	...props
}: ToggleIconButtonProps) {
	return (
		<BaseToggle
			ref={ref}
			{...props}
			render={(renderProps, state) => {
				const { children: _children, ...iconButtonProps } = renderProps;
				void _children;

				return (
					<IconButton
						closeTooltipOnClick={false}
						{...iconButtonProps}
						className={attrJoin(toggleStyleProps.className, className)}
						icon={resolvePressedSlot(state.pressed, icon, pressedIcon)}
						label={label}
						shape={shape}
						size={size}
						style={mergeStyle(toggleStyleProps.style, style)}
						xstyle={xstyle}
						{...{ m, mx, my, mt, mb, ms, me }}
						tooltip={tooltip}
						variant={variant}
					/>
				);
			}}
		/>
	);
}

export function ToggleGroup({
	ref,
	className,
	join = false,
	orientation = "horizontal",
	style,
	xstyle,
	...props
}: ToggleGroupProps) {
	const { marginStyles, rest } = extractMarginProps(props);
	const sx = stylex.props(toggleGroupMarker, toggleGroupStyles.root, marginStyles, xstyle);

	return (
		<BaseToggleGroup
			{...rest}
			ref={ref}
			orientation={orientation}
			data-join={join ? "" : undefined}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
		/>
	);
}
