import { ScrollArea as BaseScrollArea } from "@base-ui/react/scroll-area";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { color, motion, radius, space } from "@/styles/tokens.stylex";

export type ScrollAreaProps = Omit<BaseScrollArea.Root.Props, "children" | "className" | "style"> & {
	children: ReactNode;
	label?: string;
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
	viewportClassName?: string;
	/** StyleX overrides, applied after the component's own styles. */
	viewportStyle?: StyleXStyles;
	/** Removes the viewport edge fade mask. @default false */
	disableFade?: boolean;
	contentClassName?: string;
	/** StyleX overrides, applied after the component's own styles. */
	contentStyle?: StyleXStyles;
	scrollbarClassName?: string;
	/** StyleX overrides, applied after the component's own styles. */
	scrollbarStyle?: StyleXStyles;
	orientation?: "vertical" | "horizontal" | "both";
	/** Controls when the scrollbar is visible. @default "hover" */
	showScrollbar?: "always" | "scroll" | "hover";
	size?: "fill" | "content";
};

export function ScrollArea({
	children,
	label,
	className,
	style,
	viewportClassName,
	viewportStyle,
	disableFade = false,
	contentClassName,
	contentStyle,
	scrollbarClassName,
	scrollbarStyle,
	orientation = "vertical",
	showScrollbar = "hover",
	size = "fill",
	...props
}: ScrollAreaProps) {
	const rootSx = stylex.props(scrollAreaParts.root, sizeVariants[size], style);
	const viewportSx = stylex.props(scrollAreaParts.viewport, !disableFade && scrollAreaParts.fade, viewportStyle);
	const contentSx = stylex.props(contentStyle);
	const verticalScrollbarSx = stylex.props(
		scrollAreaParts.scrollbar,
		scrollbarVisibilityVariants[showScrollbar],
		scrollbarVariants.vertical,
		scrollbarStyle,
	);
	const horizontalScrollbarSx = stylex.props(
		scrollAreaParts.scrollbar,
		scrollbarVisibilityVariants[showScrollbar],
		scrollbarVariants.horizontal,
		scrollbarStyle,
	);

	return (
		<BaseScrollArea.Root
			className={[rootSx.className, className].filter(Boolean).join(" ")}
			style={rootSx.style}
			{...props}>
			<BaseScrollArea.Viewport
				aria-label={label}
				style={(state) => ({
					...viewportSx.style,
					overflowX: orientation !== "vertical" && state.hasOverflowX ? "scroll" : "hidden",
					overflowY: orientation !== "horizontal" && state.hasOverflowY ? "scroll" : "hidden",
				})}
				className={[viewportSx.className, viewportClassName].filter(Boolean).join(" ")}>
				<BaseScrollArea.Content
					className={[contentSx.className, contentClassName].filter(Boolean).join(" ") || undefined}
					style={contentSx.style}>
					{children}
				</BaseScrollArea.Content>
			</BaseScrollArea.Viewport>
			{orientation !== "horizontal" ? (
				<BaseScrollArea.Scrollbar
					orientation="vertical"
					className={[verticalScrollbarSx.className, scrollbarClassName].filter(Boolean).join(" ")}
					style={verticalScrollbarSx.style}>
					<BaseScrollArea.Thumb {...stylex.props(scrollAreaParts.thumb, thumbVariants.vertical)} />
				</BaseScrollArea.Scrollbar>
			) : null}
			{orientation !== "vertical" ? (
				<BaseScrollArea.Scrollbar
					orientation="horizontal"
					className={[horizontalScrollbarSx.className, scrollbarClassName].filter(Boolean).join(" ")}
					style={horizontalScrollbarSx.style}>
					<BaseScrollArea.Thumb {...stylex.props(scrollAreaParts.thumb, thumbVariants.horizontal)} />
				</BaseScrollArea.Scrollbar>
			) : null}
			{orientation === "both" ? <BaseScrollArea.Corner {...stylex.props(scrollAreaParts.corner)} /> : null}
		</BaseScrollArea.Root>
	);
}

const scrollAreaParts = stylex.create({
	root: {
		overflow: "hidden",
		position: "relative",
	},
	viewport: {
		overscrollBehavior: "contain",
		scrollbarWidth: "none",
		height: "100%",
		width: "100%",
	},
	fade: {
		"--scroll-area-mask-x-end": {
			"[data-overflow-x-end]": space[6],
		},
		"--scroll-area-mask-x-start": {
			"[data-overflow-x-start]": space[6],
		},
		"--scroll-area-mask-y-end": {
			"[data-overflow-y-end]": space[6],
		},
		"--scroll-area-mask-y-start": {
			"[data-overflow-y-start]": space[6],
		},
		maskComposite: "intersect",
		maskImage:
			"linear-gradient(to right, transparent 0, #000 var(--scroll-area-mask-x-start, 0px), #000 calc(100% - var(--scroll-area-mask-x-end, 0px)), transparent 100%), linear-gradient(to bottom, transparent 0, #000 var(--scroll-area-mask-y-start, 0px), #000 calc(100% - var(--scroll-area-mask-y-end, 0px)), transparent 100%)",
	},
	scrollbar: {
		borderRadius: radius.full,
		backgroundColor: color.border,
		display: "flex",
		position: "absolute",
		touchAction: "none",
		userSelect: "none",
	},
	thumb: {
		borderRadius: radius.full,
		backgroundColor: {
			"[data-hovering]": color.fgMuted,
			default: color.fgSubtle,
			":hover": color.fgMuted,
		},
	},
	corner: {
		insetInlineEnd: 0,
		position: "absolute",
		bottom: 0,
		height: "10px",
		width: "10px",
	},
});

const scrollbarVisibilityVariants = stylex.create({
	always: {
		opacity: 1,
		pointerEvents: "auto",
	},
	scroll: {
		opacity: {
			"[data-scrolling]": 1,
			default: 0,
		},
		pointerEvents: {
			"[data-scrolling]": "auto",
			default: "none",
		},
		transitionDuration: {
			"[data-scrolling]": "0ms",
			default: motion.durationShort,
			"@media (prefers-reduced-motion: reduce)": "0ms",
		},
		transitionProperty: "opacity",
		transitionTimingFunction: motion.easeOut,
	},
	hover: {
		opacity: {
			"[data-hovering]": 1,
			"[data-scrolling]": 1,
			default: 0,
		},
		pointerEvents: {
			"[data-hovering]": "auto",
			"[data-scrolling]": "auto",
			default: "none",
		},
		transitionDuration: {
			"[data-scrolling]": "0ms",
			default: motion.durationShort,
			"@media (prefers-reduced-motion: reduce)": "0ms",
		},
		transitionProperty: "opacity",
		transitionTimingFunction: motion.easeOut,
	},
});

const scrollbarVariants = stylex.create({
	vertical: {
		insetBlock: 0,
		marginBlock: space[2],
		marginInline: "3px",
		insetInlineEnd: 0,
		justifyContent: "center",
	},
	horizontal: {
		insetInline: 0,
		marginBlock: "3px",
		marginInline: space[2],
		alignItems: "center",
		justifyContent: "flex-start",
		bottom: 0,
	},
});

const thumbVariants = stylex.create({
	vertical: {
		minHeight: "36px",
		width: "4px",
	},
	horizontal: {
		height: "4px",
		minWidth: "36px",
	},
});

const sizeVariants = stylex.create({
	fill: {
		height: "100%",
	},
	content: {
		height: "auto",
	},
});
