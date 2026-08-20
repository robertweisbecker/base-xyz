import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import { ToggleGroup as BaseToggleGroup } from "@base-ui/react/toggle-group";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { extractThemeProps } from "@/theme/theme-props";
import {
	Button,
	IconButton,
	type ButtonShape,
	type ButtonSize,
	type ButtonVariant,
	type IconButtonProps,
} from "@/components/button/button";
import { buttonThemeProps, type ButtonThemeProps } from "@/components/button/button-theme-props";
import { attrJoin } from "@/utils/attr-join";
import { toggleGroupMarker, toggleGroupStyles, toggleJoinStyles, toggleMarker } from "./toggle.stylex";

type ToggleBaseProps = Omit<
	BaseToggle.Props,
	"children" | "className" | "color" | "height" | "nativeButton" | "render" | "style" | "width" | keyof ButtonThemeProps
> &
	ButtonThemeProps & {
		className?: string;
		/** Visual content that replaces `startSlot` or `icon` while the toggle is pressed. */
		pressedIcon?: ReactNode;
		/** StyleX overrides, applied after the component's own styles. */
		style?: StyleXStyles;
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

/** Icon-only toggle rendered as `IconButton` — square control sizing and required accessible `label`. */
export type ToggleIconButtonProps = ToggleBaseProps & {
	children?: never;
	/** Icon shown in the icon-only configuration. */
	icon: ReactNode;
	/** Accessible name for the icon-only configuration. */
	label: string;
	startSlot?: never;
	shape?: Extract<ButtonShape, "circle" | "square">;
	/** Visible tooltip text. Defaults to `label`; use `false` to disable it. */
	tooltip?: IconButtonProps["tooltip"];
};

export type ToggleProps = ToggleButtonProps | ToggleIconButtonProps;

export type ToggleGroupProps = Omit<BaseToggleGroup.Props, "className" | "style"> & {
	className?: string;
	/**
	 * Collapse group gap and inner radii so adjacent toggles share edges.
	 * Ghost selected toggles restore their radius except on edges shared with another selected toggle.
	 * Other variants stay fully joined when selected.
	 */
	join?: boolean;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export type ToggleVariant = ButtonVariant;
export type ToggleSize = ButtonSize;
export type ToggleShape = ButtonShape;

function resolvePressedSlot(pressed: boolean, resting: ReactNode, pressedIcon: ReactNode | undefined) {
	return pressed && pressedIcon !== undefined ? pressedIcon : resting;
}

function toggleClassName(className: string | undefined) {
	return attrJoin(stylex.props(toggleMarker, toggleJoinStyles.root).className, className);
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
	variant = "ghost",
	...props
}: ToggleButtonProps) {
	const { restProps, themeProps } = extractThemeProps(props, buttonThemeProps);

	return (
		<BaseToggle
			ref={ref}
			render={(renderProps, state) => (
				<Button
					{...renderProps}
					className={toggleClassName(className)}
					shape={shape}
					size={size}
					startSlot={resolvePressedSlot(state.pressed, startSlot, pressedIcon)}
					style={style}
					variant={variant}
					{...themeProps}>
					{children}
				</Button>
			)}
			{...restProps}
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
	tooltip,
	variant = "ghost",
	...props
}: ToggleIconButtonProps) {
	const { restProps, themeProps } = extractThemeProps(props, buttonThemeProps);

	return (
		<BaseToggle
			ref={ref}
			render={(renderProps, state) => {
				const { children: _children, ...iconButtonProps } = renderProps;
				void _children;

				return (
					<IconButton
						{...iconButtonProps}
						className={toggleClassName(className)}
						icon={resolvePressedSlot(state.pressed, icon, pressedIcon)}
						label={label}
						shape={shape}
						size={size}
						style={style}
						tooltip={tooltip}
						variant={variant}
						{...themeProps}
					/>
				);
			}}
			{...restProps}
		/>
	);
}

export function ToggleGroup({
	ref,
	className,
	join = false,
	orientation = "horizontal",
	style,
	...props
}: ToggleGroupProps) {
	const sx = stylex.props(toggleGroupMarker, toggleGroupStyles.root, style);

	return (
		<BaseToggleGroup
			{...props}
			ref={ref}
			orientation={orientation}
			data-join={join ? "" : undefined}
			className={attrJoin(sx.className, className)}
			style={sx.style}
		/>
	);
}
