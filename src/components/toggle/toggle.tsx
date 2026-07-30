import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import { ToggleGroup as BaseToggleGroup } from "@base-ui/react/toggle-group";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { Button, type ButtonProps, type ButtonShape, type ButtonSize, type ButtonVariant } from "../button/button";

export type ToggleProps = Omit<BaseToggle.Props, "className" | "nativeButton" | "render" | "style"> &
	Pick<ButtonProps, "variant" | "size" | "shape"> & {
		className?: string;
		/** Visual content positioned before the label. */
		icon?: ReactNode;
		/** Visual content that replaces `icon` while the toggle is pressed. */
		pressedIcon?: ReactNode;
		/** StyleX overrides, applied after the component's own styles. */
		style?: StyleXStyles;
	};

export type ToggleGroupProps = Omit<BaseToggleGroup.Props, "className" | "style"> & {
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export type ToggleVariant = ButtonVariant;
export type ToggleSize = ButtonSize;
export type ToggleShape = ButtonShape;

export function Toggle({
	ref,
	className,
	icon,
	pressedIcon,
	shape = "default",
	size = "md",
	style,
	variant = "ghost",
	...props
}: ToggleProps) {
	return (
		<BaseToggle
			ref={ref}
			render={(renderProps, state) => (
				<Button
					{...renderProps}
					className={className}
					shape={shape}
					size={size}
					startSlot={state.pressed && pressedIcon !== undefined ? pressedIcon : icon}
					style={style}
					variant={variant}
				/>
			)}
			{...props}
		/>
	);
}

export function ToggleGroup({ ref, className, style, ...props }: ToggleGroupProps) {
	const sx = stylex.props(toggleParts.group, style);

	return (
		<BaseToggleGroup
			ref={ref}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}
		/>
	);
}

const toggleParts = stylex.create({
	group: {
		gap: 1,
		alignItems: "center",
		display: "inline-flex",
		flexDirection: {
			"[data-orientation=vertical]": "column",
			default: "row",
		},
	},
});
