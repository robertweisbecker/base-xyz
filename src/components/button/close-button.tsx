import { IconX } from "fyicons";
import { IconButton, type IconButtonProps } from "./button";

export type CloseButtonProps = Omit<IconButtonProps, "icon" | "label" | "shape"> & {
	label?: string;
};

/** Shared circular X control used by overlay and dismiss surfaces. */
export function CloseButton({
	label = "Close",
	size = "xs",
	variant = "neutral",
	...props
}: CloseButtonProps) {
	return (
		<IconButton
			icon={<IconX aria-hidden size={12} />}
			label={label}
			shape="circle"
			size={size}
			variant={variant}
			{...props}
		/>
	);
}
