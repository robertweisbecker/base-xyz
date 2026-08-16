import { Drawer as BaseDrawer } from "@base-ui/react/drawer";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { type ComponentProps } from "react";
import { tokens } from "@/theme/tokens.stylex";
import { modalChromeStyles, modalTextStyles } from "@/components/dialog/dialog.stylex";

type StyledProps<T> = Omit<T, "className" | "style"> & {
	className?: string;
	style?: StyleXStyles;
};

type DrawerPopupProps = StyledProps<BaseDrawer.Popup.Props> & {
	layout?: "default" | "snap-points";
};

type DrawerContentProps = StyledProps<BaseDrawer.Content.Props> & {
	scrollable?: boolean;
};

export function Backdrop({ ref, className, style, ...props }: StyledProps<BaseDrawer.Backdrop.Props>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(
		modalChromeStyles.backdrop,
		modalChromeStyles.modalBackdropLayer,
		drawerParts.backdrop,
		style,
	);

	return (
		<BaseDrawer.Backdrop
			ref={ref}
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}
			{...props}
		/>
	);
}

export function Viewport({ ref, className, style, ...props }: StyledProps<BaseDrawer.Viewport.Props>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(
		modalChromeStyles.viewport,
		modalChromeStyles.modalLayer,
		drawerParts.viewport,
		style,
	);

	return (
		<BaseDrawer.Viewport
			ref={ref}
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}
			{...props}
		/>
	);
}

export function Popup({ ref, className, style, layout = "default", ...props }: DrawerPopupProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(
		modalChromeStyles.surface,
		drawerParts.popup,
		layout === "snap-points" && drawerParts.snapPointPopup,
		stylex.defaultMarker(),
		style,
	);

	return (
		<BaseDrawer.Popup
			ref={ref}
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}
			{...props}
		/>
	);
}

export function Content({ ref, className, style, scrollable = false, ...props }: DrawerContentProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(
		drawerParts.content,
		scrollable && drawerParts.scrollableContent,
		style,
	);

	return (
		<BaseDrawer.Content
			ref={ref}
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}
			{...props}
		/>
	);
}

export function Title({ ref, className, style, ...props }: StyledProps<BaseDrawer.Title.Props>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(modalTextStyles.title, style);

	return (
		<BaseDrawer.Title
			ref={ref}
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}
			{...props}
		/>
	);
}

export function Description({ ref, className, style, ...props }: StyledProps<BaseDrawer.Description.Props>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(modalTextStyles.description, style);

	return (
		<BaseDrawer.Description
			ref={ref}
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}
			{...props}
		/>
	);
}

export function Handle({ className, style, ...props }: StyledProps<ComponentProps<"div">>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(drawerParts.handle, style);

	return <div aria-hidden className={[sxClassName, className].filter(Boolean).join(" ")} style={sxStyle} {...props} />;
}

export function Header({ className, style, ...props }: StyledProps<ComponentProps<"div">>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(drawerParts.header, style);

	return <div className={[sxClassName, className].filter(Boolean).join(" ")} style={sxStyle} {...props} />;
}

export function Body({ className, style, ...props }: StyledProps<ComponentProps<"div">>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(modalTextStyles.body, drawerParts.body, style);

	return <div className={[sxClassName, className].filter(Boolean).join(" ")} style={sxStyle} {...props} />;
}

export function Footer({ className, style, ...props }: StyledProps<ComponentProps<"div">>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(modalTextStyles.footer, drawerParts.footer, style);

	return <div className={[sxClassName, className].filter(Boolean).join(" ")} style={sxStyle} {...props} />;
}

export const Root = BaseDrawer.Root;
export const Trigger = BaseDrawer.Trigger;
export const Portal = BaseDrawer.Portal;
export const Close = BaseDrawer.Close;

const DRAWER_RELEASE_DURATION = "400ms";
const DRAWER_EASING = "cubic-bezier(0.32, 0.72, 0, 1)";

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
		"--_drawer-bleed": "3rem",
		"--_drawer-peek": ".5rem",
		"--_drawer-stack-height":
			"max(0px, calc(var(--drawer-frontmost-height, var(--drawer-height)) - var(--_drawer-bleed)))",
		"--_drawer-stack-peek-offset":
			"max(0px, calc((var(--nested-drawers) - var(--_drawer-stack-progress)) * var(--_drawer-peek)))",
		"--_drawer-stack-progress": "clamp(0, var(--drawer-swipe-progress), 1)",
		"--_drawer-stack-scale":
			"calc(var(--_drawer-stack-scale-base) + (var(--_drawer-stack-step) * var(--_drawer-stack-progress)))",
		"--_drawer-stack-scale-base": "max(0, calc(1 - (var(--nested-drawers) * var(--_drawer-stack-step))))",
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
		paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px) + var(--_drawer-bleed))",
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
		height: `calc(100dvh - ${tokens["--space-4"]})`,
		marginBottom: 0,
		maxHeight: `calc(100dvh - ${tokens["--space-4"]})`,
		overflowY: "hidden",
		paddingBottom: 0,
	},
	content: {
		marginInline: "auto",
		display: "flex",
		flexDirection: "column",
		opacity: {
			default: "1",
			[stylex.when.ancestor("[data-nested-drawer-open]")]: "0",
			[stylex.when.ancestor("[data-nested-drawer-open][data-nested-drawer-swiping]")]: "1",
		},
		transitionDuration: tokens["--motion-duration-medium"],
		transitionProperty: "opacity",
		transitionTimingFunction: tokens["--motion-ease-out"],
		width: "100%",
	},
	scrollableContent: {
		flex: "1 1 auto",
		overscrollBehavior: "contain",
		minHeight: 0,
		overflowY: "auto",
	},
	handle: {
		borderRadius: tokens["--radius-full"],
		marginBlock: tokens["--space-1"],
		marginInline: "auto",
		backgroundColor: tokens["--border-input"],
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
		gap: tokens["--space-1"],
		paddingInline: tokens["--space-5"],
		display: "flex",
		flexDirection: "column",
		paddingBlockEnd: tokens["--space-3"],
		paddingBlockStart: tokens["--space-2"],
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
		borderTopColor: tokens["--border"],
		borderTopStyle: "solid",
		borderTopWidth: "1px",
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
