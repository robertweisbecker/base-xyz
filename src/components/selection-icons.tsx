import type { ComponentProps } from "react";

type SelectionIconProps = ComponentProps<"svg">;

export function CheckmarkIcon(props: SelectionIconProps) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={2}
			stroke="currentColor"
			aria-hidden
			focusable="false"
			width={16}
			height={16}
			{...props}>
			<path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
		</svg>
	);
}

export function IndeterminateIcon(props: SelectionIconProps) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
			strokeWidth={2}
			stroke="currentColor"
			aria-hidden
			focusable="false"
			width={16}
			height={16}
			{...props}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
		</svg>
	);
}
