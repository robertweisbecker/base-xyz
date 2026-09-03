import { Drawer as BaseDrawer } from "@base-ui/react/drawer";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";
import { tokens } from "@/theme/tokens.stylex";
import { modalChromeStyles, modalTextStyles } from "@/components/dialog/dialog.stylex";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { attrJoin } from "@/utils/attr-join";

type StyledProps<T> = Omit<T, "className" | "style" | "xstyle"> &
	BaseStyleProps & { className?: string };

type DrawerPopupProps = StyledProps<BaseDrawer.Popup.Props> & {
	layout?: "default" | "snap-points";
};

type DrawerContentProps = StyledProps<BaseDrawer.Content.Props> & {
	scrollable?: boolean;
};

export function Backdrop({
	ref,
	className,
	style,
	xstyle,
	...props
}: StyledProps<BaseDrawer.Backdrop.Props>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(
		modalChromeStyles.backdrop,
		modalChromeStyles.modalBackdropLayer,
		drawerParts.backdrop,
		xstyle,
	);

	return (
		<BaseDrawer.Backdrop
			ref={ref}
			className={attrJoin(sxClassName, className)}
			style={mergeStyle(sxStyle, style)}
			{...props}
		/>
	);
}

export function Viewport({
	ref,
	className,
	style,
	xstyle,
	...props
}: StyledProps<BaseDrawer.Viewport.Props>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(
		modalChromeStyles.viewport,
		modalChromeStyles.modalLayer,
		drawerParts.viewport,
		xstyle,
	);

	return (
		<BaseDrawer.Viewport
			ref={ref}
			className={attrJoin(sxClassName, className)}
			style={mergeStyle(sxStyle, style)}
			{...props}
		/>
	);
}

export function Popup({
	ref,
	className,
	style,
	xstyle,
	layout = "default",
	...props
}: DrawerPopupProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(
		modalChromeStyles.surface,
		drawerParts.popup,
		layout === "snap-points" && drawerParts.snapPointPopup,
		stylex.defaultMarker(),
		xstyle,
	);

	return (
		<BaseDrawer.Popup
			ref={ref}
			className={attrJoin(sxClassName, className)}
			style={mergeStyle(sxStyle, style)}
			{...props}
		/>
	);
}

export function Content({
	ref,
	className,
	style,
	xstyle,
	scrollable = false,
	...props
}: DrawerContentProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(
		drawerParts.content,
		scrollable && drawerParts.scrollableContent,
		xstyle,
	);

	return (
		<BaseDrawer.Content
			ref={ref}
			className={attrJoin(sxClassName, className)}
			style={mergeStyle(sxStyle, style)}
			{...props}
		/>
	);
}

export function Title({
	ref,
	className,
	style,
	xstyle,
	...props
}: StyledProps<BaseDrawer.Title.Props>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(modalTextStyles.title, xstyle);

	return (
		<BaseDrawer.Title
			ref={ref}
			className={attrJoin(sxClassName, className)}
			style={mergeStyle(sxStyle, style)}
			{...props}
		/>
	);
}

export function Description({
	ref,
	className,
	style,
	xstyle,
	...props
}: StyledProps<BaseDrawer.Description.Props>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(
		modalTextStyles.description,
		xstyle,
	);

	return (
		<BaseDrawer.Description
			ref={ref}
			className={attrJoin(sxClassName, className)}
			style={mergeStyle(sxStyle, style)}
			{...props}
		/>
	);
}

export function Handle({ className, style, xstyle, ...props }: StyledProps<ComponentProps<"div">>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(drawerParts.handle, xstyle);

	return (
		<div
			aria-hidden
			className={attrJoin(sxClassName, className)}
			style={mergeStyle(sxStyle, style)}
			{...props}
		/>
	);
}

export function Header({ className, style, xstyle, ...props }: StyledProps<ComponentProps<"div">>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(drawerParts.header, xstyle);

	return (
		<div
			className={attrJoin(sxClassName, className)}
			style={mergeStyle(sxStyle, style)}
			{...props}
		/>
	);
}

export function Body({ className, style, xstyle, ...props }: StyledProps<ComponentProps<"div">>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(
		modalTextStyles.body,
		drawerParts.body,
		xstyle,
	);

	return (
		<div
			className={attrJoin(sxClassName, className)}
			style={mergeStyle(sxStyle, style)}
			{...props}
		/>
	);
}

export function Footer({ className, style, xstyle, ...props }: StyledProps<ComponentProps<"div">>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(
		modalTextStyles.footer,
		drawerParts.footer,
		xstyle,
	);

	return (
		<div
			data-slot="footer"
			className={attrJoin(sxClassName, className)}
			style={mergeStyle(sxStyle, style)}
			{...props}
		/>
	);
}

export const Root = BaseDrawer.Root;
export const Trigger = BaseDrawer.Trigger;
export const Portal = BaseDrawer.Portal;
export const Close = BaseDrawer.Close;

const DRAWER_RELEASE_DURATION = "400ms";
const DRAWER_EASING = "cubic-bezier(0.32, 0.72, 0, 1)";
const DRAWER_BLEED = "3rem";

const drawerParts = stylex.create({
	backdrop: {
		opacity: {
			"[data-ending-style]": 0,
			"[data-starting-style]": 0,
			default: "calc(1 - var(--drawer-swipe-progress))",
		},
		pointerEvents: {
			"[data-ending-style]": "none",
			default: "auto",
		},
		transitionDuration: {
			"[data-ending-style]": `calc(var(--drawer-swipe-strength) * ${DRAWER_RELEASE_DURATION})`,
			"[data-swiping]": "0ms",
			default: tokens["--motion-duration-long"],
		},
		transitionProperty: "opacity",
		transitionTimingFunction: DRAWER_EASING,
		minHeight: "100dvh",
	},
	viewport: {
		padding: 0,
		alignItems: "flex-end",
	},
	popup: {
		"--_drawer-bleed": DRAWER_BLEED,
		"--_drawer-footer-padding-bottom": "0px",
		"--_drawer-peek": ".5rem",
		"--_drawer-popup-padding-bottom":
			"calc(1.5rem + env(safe-area-inset-bottom, 0px) + var(--_drawer-bleed))",
		"--_drawer-stack-height":
			"max(0px, calc(var(--drawer-frontmost-height, var(--drawer-height)) - var(--_drawer-bleed)))",
		"--_drawer-stack-peek-offset":
			"max(0px, calc((var(--nested-drawers) - var(--_drawer-stack-progress)) * var(--_drawer-peek)))",
		"--_drawer-stack-progress": "clamp(0, var(--drawer-swipe-progress), 1)",
		"--_drawer-stack-scale":
			"calc(var(--_drawer-stack-scale-base) + (var(--_drawer-stack-step) * var(--_drawer-stack-progress)))",
		"--_drawer-stack-scale-base":
			"max(0, calc(1 - (var(--nested-drawers) * var(--_drawer-stack-step))))",
		"--_drawer-stack-shrink": "calc(1 - var(--_drawer-stack-scale))",
		"--_drawer-stack-step": 0.05,
		"--_drawer-translate-y":
			"calc(var(--drawer-snap-point-offset, 0px) + var(--drawer-swipe-movement-y) - var(--_drawer-stack-peek-offset) - (var(--_drawer-stack-shrink) * var(--_drawer-stack-height)))",
		overscrollBehavior: "contain",
		boxSizing: "border-box",
		opacity: {
			"[data-ending-style]": 0.9999,
			default: 1,
		},
		position: "relative",
		transform: {
			"[data-ending-style]": "translateY(calc(100% - var(--_drawer-bleed) + 2px)) scale(1)",
			"[data-starting-style]": "translateY(calc(100% - var(--_drawer-bleed) + 2px)) scale(1)",
			default: "translateY(var(--_drawer-translate-y)) scale(var(--_drawer-stack-scale))",
		},
		transformOrigin: "50% calc(100% - var(--_drawer-bleed))",
		transitionDuration: {
			"[data-ending-style]": `calc(var(--drawer-swipe-strength) * ${DRAWER_RELEASE_DURATION})`,
			"[data-nested-drawer-swiping]": "0ms",
			"[data-swiping]": "0ms",
			default: tokens["--motion-duration-long"],
		},
		transitionProperty: "transform, height, opacity",
		transitionTimingFunction: DRAWER_EASING,
		willChange: "transform",
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
		borderTopLeftRadius: tokens["--radius-xl"],
		borderTopRightRadius: tokens["--radius-xl"],
		height: {
			"[data-nested-drawer-open]": "calc(var(--_drawer-stack-height) + var(--_drawer-bleed))",
			default: "var(--drawer-height, auto)",
		},
		marginBottom: "calc(-1 * var(--_drawer-bleed))",
		maxHeight: "calc(80vh + var(--_drawer-bleed))",
		maxWidth: "640px",
		overflowY: {
			"[data-nested-drawer-open]": "hidden",
			default: "auto",
		},
		paddingBottom: {
			default: "var(--_drawer-popup-padding-bottom)",
			":has([data-slot='footer'])": "var(--_drawer-footer-padding-bottom)",
		},
		"::after": {
			backgroundColor: {
				"[data-close-confirmation-open]": "rgb(0 0 0 / 5%)",
				"[data-nested-drawer-open]": "rgb(0 0 0 / 5%)",
				default: "rgb(0 0 0 / 0%)",
			},
			transitionDuration: tokens["--motion-duration-long"],
			transitionProperty: "background-color, opacity",
			transitionTimingFunction: DRAWER_EASING,
		},
	},
	snapPointPopup: {
		"--_drawer-bleed": "0px",
		"--_drawer-footer-padding-bottom": "var(--_drawer-popup-padding-bottom)",
		"--_drawer-popup-padding-bottom":
			"max(0px, calc(var(--drawer-snap-point-offset, 0px) + var(--drawer-swipe-movement-y)))",
		overscrollBehavior: "auto",
		touchAction: "none",
		transitionDuration: {
			"[data-ending-style]": `calc(var(--drawer-swipe-strength) * ${DRAWER_RELEASE_DURATION})`,
			"[data-swiping]": tokens["--motion-duration-long"],
			default: tokens["--motion-duration-long"],
		},
		transitionProperty: {
			"[data-nested-drawer-open]": "transform, height, opacity",
			default: "transform, box-shadow",
		},
		zIndex: 1,
		height: "auto",
		marginBottom: 0,
		maxHeight: `calc(100dvh - ${tokens["--space-4"]})`,
		overflowY: "visible",
		"::before": {
			insetInline: 0,
			backgroundColor: "inherit",
			content: '""',
			pointerEvents: "none",
			position: "absolute",
			height: DRAWER_BLEED,
			top: "100%",
		},
	},
	content: {
		marginInline: "auto",
		display: "flex",
		flexDirection: "column",
		opacity: {
			"@starting-style": 0,
			default: 1,
			[stylex.when.ancestor("[data-nested-drawer-open]")]: 0,
			[stylex.when.ancestor("[data-nested-drawer-open][data-nested-drawer-swiping]")]: 1,
		},
		transitionDuration: tokens["--motion-duration-medium"],
		transitionProperty: "opacity, height",
		transitionTimingFunction: tokens["--motion-ease-out"],
		width: "100%",
	},
	scrollableContent: {
		overscrollBehavior: "contain",
		flexBasis: "auto",
		flexGrow: "1",
		flexShrink: "1",
		touchAction: "auto",
		minHeight: 0,
		overflowY: "auto",
	},
	handle: {
		borderRadius: tokens["--radius-full"],
		marginBlock: tokens["--space-1"],
		marginInline: "auto",
		backgroundColor: tokens["--border-input"],
		cursor: "grab",
		flexShrink: 0,
		opacity: {
			default: "1",
			[stylex.when.ancestor("[data-nested-drawer-open]")]: "0",
			[stylex.when.ancestor("[data-nested-drawer-open][data-nested-drawer-swiping]")]: "1",
		},
		transitionDuration: tokens["--motion-duration-short"],
		transitionProperty: "opacity",
		transitionTimingFunction: tokens["--motion-ease-out"],
		height: "4px",
		width: "58px",
	},
	header: {
		paddingInline: tokens["--space-5"],
		paddingBlockEnd: tokens["--space-3"],
		paddingBlockStart: tokens["--space-2"],
		touchAction: "none",
		userSelect: "none",
		borderBottomColor: tokens["--border"],
		borderBottomStyle: "solid",
		borderBottomWidth: "0.5px",
	},
	body: {
		padding: tokens["--space-5"],
	},
	footer: {
		gap: tokens["--space-3"],
		paddingInline: tokens["--space-5"],
		paddingBlockStart: tokens["--space-3"],
		position: "sticky",
		zIndex: 1,
		borderTopColor: tokens["--border"],
		borderTopStyle: "solid",
		borderTopWidth: "0.5px",
		bottom: 0,
		paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px) + var(--_drawer-bleed))",
	},
});

export const Drawer = {
	Root,
	Trigger,
	Portal,
	Close,
	Backdrop,
	Viewport,
	Popup,
	Content,
	Title,
	Description,
	Handle,
	Header,
	Body,
	Footer,
} as const;
