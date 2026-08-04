import { Toast as BaseToast } from "@base-ui/react/toast";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { type ComponentProps } from "react";
import { zIndex } from "@/styles/constants.stylex";
import { motion } from "@/styles/tokens.stylex";
import { pressable } from "@/styles/recipes/transitions";
import { colors, radius, shadow, space } from "@/styles/tokens.stylex";
import { toastMotion } from "./toast-motion.stylex";
import { toastControlStyles, toastTextStyles } from "./toast-parts";

type StyledProps<T> = Omit<T, "className" | "style"> & {
	className?: string;
	style?: StyleXStyles;
};

export function Viewport({ ref, className, style, ...props }: StyledProps<BaseToast.Viewport.Props>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(toastParts.viewport, style);

	return (
		<BaseToast.Viewport
			ref={ref}
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}
			{...props}
		/>
	);
}

export function Root({ ref, className, style, ...props }: StyledProps<BaseToast.Root.Props>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(toastParts.root, style);

	return (
		<BaseToast.Root
			ref={ref}
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}
			{...props}
		/>
	);
}

export function Content({ ref, className, style, ...props }: StyledProps<BaseToast.Content.Props>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(toastParts.content, style);

	return (
		<BaseToast.Content
			ref={ref}
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}
			{...props}
		/>
	);
}

export function Title({ ref, className, style, ...props }: StyledProps<BaseToast.Title.Props>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(toastTextStyles.title, style);

	return (
		<BaseToast.Title
			ref={ref}
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}
			{...props}
		/>
	);
}

export function Description({ ref, className, style, ...props }: StyledProps<BaseToast.Description.Props>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(toastTextStyles.description, style);

	return (
		<BaseToast.Description
			ref={ref}
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}
			{...props}
		/>
	);
}

export function Action({ ref, className, style, ...props }: StyledProps<BaseToast.Action.Props>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(toastControlStyles.action, style);

	return (
		<BaseToast.Action
			ref={ref}
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}
			{...props}
		/>
	);
}

export function Close({ ref, className, style, ...props }: StyledProps<BaseToast.Close.Props>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(
		toastControlStyles.close,
		toastControlStyles.stackedClose,
		pressable.transition,
		style,
	);

	return (
		<BaseToast.Close
			ref={ref}
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}
			{...props}
		/>
	);
}

export function Text({ className, style, ...props }: StyledProps<ComponentProps<"div">>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(toastParts.text, style);

	return <div className={[sxClassName, className].filter(Boolean).join(" ")} style={sxStyle} {...props} />;
}

export const Provider = BaseToast.Provider;
export const Portal = BaseToast.Portal;

const toastParts = stylex.create({
	viewport: {
		margin: "0 auto",
		outline: "0",
		pointerEvents: "none",
		position: "fixed",
		zIndex: zIndex.toast,
		bottom: {
			default: space[4],
			"@media (min-width: 500px)": space[8],
		},
		left: "auto",
		right: {
			default: space[4],
			"@media (min-width: 500px)": space[8],
		},
		top: "auto",
		width: {
			default: "calc(100vw - 32px)",
			"@media (min-width: 500px)": "360px",
		},
	},
	root: {
		"--toast-expanded-offset-y":
			"calc((var(--toast-offset-y) * -1) + (var(--toast-index) * var(--toast-gap) * -1) + var(--toast-swipe-movement-y))",
		"--toast-gap": space[3],
		"--toast-peek": space[3],
		"--toast-scale": "calc(max(0, 1 - (var(--toast-index) * 0.1)))",
		"--toast-shrink": "calc(1 - var(--toast-scale))",
		"--toast-stack-height": "var(--toast-frontmost-height, var(--toast-height))",
		margin: "0 auto",
		borderRadius: radius.md,
		backgroundColor: colors["--elevated"],
		boxShadow: shadow.md,
		boxSizing: "border-box",
		color: colors["--text"],
		cursor: "default",
		opacity: {
			"[data-ending-style]": 0,
			"[data-limited]": 0,
			default: 1,
		},
		pointerEvents: "auto",
		position: "absolute",
		transform: {
			"[data-ending-style]": "translateY(150%)",
			"[data-ending-style][data-swipe-direction='down']": "translateY(calc(var(--toast-swipe-movement-y) + 150%))",
			"[data-ending-style][data-swipe-direction='left']":
				"translateX(calc(var(--toast-swipe-movement-x) - 150%)) translateY(var(--toast-expanded-offset-y))",
			"[data-ending-style][data-swipe-direction='right']":
				"translateX(calc(var(--toast-swipe-movement-x) + 150%)) translateY(var(--toast-expanded-offset-y))",
			"[data-ending-style][data-swipe-direction='up']": "translateY(calc(var(--toast-swipe-movement-y) - 150%))",
			"[data-expanded]": "translateX(var(--toast-swipe-movement-x)) translateY(var(--toast-expanded-offset-y))",
			"[data-starting-style]": "translateY(150%)",
			default:
				"translateX(var(--toast-swipe-movement-x)) translateY(calc(var(--toast-swipe-movement-y) - (var(--toast-index) * var(--toast-peek)) - (var(--toast-shrink) * var(--toast-stack-height)))) scale(var(--toast-scale))",
		},
		transformOrigin: "bottom center",
		transitionDuration: {
			default: `${toastMotion.stackDuration}, ${toastMotion.stackDuration}, ${toastMotion.heightDuration}`,
			"@media (prefers-reduced-motion: reduce)": "0ms",
		},
		transitionProperty: "transform, opacity, height",
		transitionTimingFunction: `${motion.easeSmoothOut}, ease, ease`,
		userSelect: "none",
		willChange: "transform, opacity, height",
		zIndex: `calc(${toastMotion.stackItemZIndex} - var(--toast-index))`,
		bottom: 0,
		height: {
			"[data-expanded]": "var(--toast-height)",
			default: "var(--toast-stack-height)",
		},
		left: "auto",
		marginRight: 0,
		right: 0,
		width: "100%",
		"::after": {
			content: '""',
			position: "absolute",
			height: "calc(var(--toast-gap) + 1px)",
			left: 0,
			top: "100%",
			width: "100%",
		},
	},
	content: {
		padding: space[4],
		gap: space[3],
		overflow: "hidden",
		alignItems: "center",
		boxSizing: "border-box",
		display: "flex",
		opacity: {
			"[data-behind]": 0,
			"[data-expanded]": 1,
			default: 1,
		},
		transitionDuration: {
			default: motion.durationMedium,
			"@media (prefers-reduced-motion: reduce)": "0ms",
		},
		transitionProperty: "opacity",
		transitionTimingFunction: motion.easeSmoothOut,
		height: "100%",
	},
	text: {
		gap: space[1],
		display: "flex",
		flexDirection: "column",
		flexGrow: 1,
		minWidth: 0,
	},
});
