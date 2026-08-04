import { XIcon } from "@phosphor-icons/react/dist/csr/X";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentProps } from "react";
import { focusRing } from "@/styles/recipes/focus";
import { pressable } from "@/styles/recipes/transitions";
import { colors, radius, size } from "@/styles/tokens.stylex";

export type CloseButtonProps = Omit<ComponentProps<"button">, "aria-label" | "children" | "style"> & {
	className?: string;
	label?: string;
	style?: StyleXStyles;
};

/** Shared visual control used by overlay-specific close primitives. */
export function CloseButton({ ref, className, label = "Close", style, type = "button", ...props }: CloseButtonProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(
		closeButtonParts.control,
		focusRing.outset,
		pressable.transition,
		style,
	);

	return (
		<button
			ref={ref}
			aria-label={label}
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}
			type={type}
			{...props}>
			<XIcon aria-hidden size="1em" weight="bold" />
		</button>
	);
}

const closeButtonParts = stylex.create({
	control: {
		padding: 0,
		borderRadius: radius.full,
		borderWidth: 0,
		alignItems: "center",
		backgroundColor: {
			default: colors["--gray-a1"],
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			":hover:not(:active)": {
				"@media (hover: hover) and (pointer: fine)": colors["--gray-a3"],
			},
			":active": colors["--gray-a2"],
		},
		color: {
			default: colors["--gray-a5"],
			":hover": {
				"@media (hover: hover) and (pointer: fine)": colors["--gray-t2"],
			},
		},
		display: "inline-flex",
		fontSize: ".75rem",
		justifyContent: "center",
		lineHeight: 0,
		height: size["control.xs"],
		width: size["control.xs"],
	},
});
