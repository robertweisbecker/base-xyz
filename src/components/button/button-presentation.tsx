import type { ReactNode } from "react";
import {
	getButtonSlotStyleProps,
	type ButtonSize,
	type ButtonVariant,
} from "./button.stylex";

export function renderButtonSlot(
	slot: ReactNode,
	role: "start" | "end" | "loading",
	size: ButtonSize,
	variant: ButtonVariant,
	iconOnly: boolean,
) {
	if (slot == null || typeof slot === "boolean") {
		return null;
	}

	const sx = getButtonSlotStyleProps(role, size, variant, iconOnly);

	return (
		<span className={sx.className} style={sx.style}>
			{slot}
		</span>
	);
}
