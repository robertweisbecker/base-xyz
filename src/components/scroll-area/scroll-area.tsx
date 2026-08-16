import { ScrollArea as BaseScrollArea } from "@base-ui/react/scroll-area";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ReactNode, Ref } from "react";
import { tokens } from "@/theme/tokens.stylex";

export type ScrollAreaProps = Omit<BaseScrollArea.Root.Props, "children" | "className" | "style"> & {
	children: ReactNode;
	label?: string;
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
	viewportClassName?: string;
	viewportRef?: Ref<HTMLDivElement>;
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
	viewportRef,
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
	const rootSx = stylex.props(parts.root, sizeVariants[size], style);
	const viewportSx = stylex.props(parts.viewport, !disableFade && parts.fade, viewportStyle);
	const contentSx = stylex.props(parts.content, contentStyle);
	const verticalScrollbarSx = stylex.props(
		parts.scrollbar,
		scrollbarVisibilities[showScrollbar],
		scrollbarOrientations.vertical,
		scrollbarStyle,
	);
	const horizontalScrollbarSx = stylex.props(
		parts.scrollbar,
		scrollbarVisibilities[showScrollbar],
		scrollbarOrientations.horizontal,
		scrollbarStyle,
	);

	return (
		<BaseScrollArea.Root
			className={[rootSx.className, className].filter(Boolean).join(" ")}
			style={rootSx.style}
			{...props}>
			<BaseScrollArea.Viewport
				ref={viewportRef}
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
					<BaseScrollArea.Thumb {...stylex.props(parts.thumb, thumbOrientationVariants.vertical)} />
				</BaseScrollArea.Scrollbar>
			) : null}
			{orientation !== "vertical" ? (
				<BaseScrollArea.Scrollbar
					orientation="horizontal"
					className={[horizontalScrollbarSx.className, scrollbarClassName].filter(Boolean).join(" ")}
					style={horizontalScrollbarSx.style}>
					<BaseScrollArea.Thumb {...stylex.props(parts.thumb, thumbOrientationVariants.horizontal)} />
				</BaseScrollArea.Scrollbar>
			) : null}
			{orientation === "both" ? <BaseScrollArea.Corner {...stylex.props(parts.corner)} /> : null}
		</BaseScrollArea.Root>
	);
}

const parts = stylex.create({
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
	content: {
		"--scroll-area-overflow-x-end": "inherit",
		"--scroll-area-overflow-x-start": "inherit",
		"--scroll-area-overflow-y-end": "inherit",
		"--scroll-area-overflow-y-start": "inherit",
		overscrollBehavior: "contain",
	},
	fade: {
		// "--scroll-area-mask-x-end": {
		// 	"[data-overflow-x-end]": tokens["--space-10"],
		// },
		// "--scroll-area-mask-x-start": {
		// 	"[data-overflow-x-start]": tokens["--space-10"],
		// },
		// "--scroll-area-mask-y-end": {
		// 	"[data-overflow-y-end]": tokens["--space-10"],
		// },
		// "--scroll-area-mask-y-start": {
		// 	"[data-overflow-y-start]": tokens["--space-10"],
		// },
		maskComposite: "intersect",
		maskImage:
			"linear-gradient(to right, transparent 0, black min(40px, var(--scroll-area-overflow-x-start)), black calc(100% - min(40px, var(--scroll-area-overflow-x-end, 40px))), transparent 100%), linear-gradient(to bottom, transparent 0, black min(40px, var(--scroll-area-overflow-y-start)), black calc(100% - min(40px, var(--scroll-area-overflow-y-end, 40px))), transparent 100%)",
		maskRepeat: "no-repeat",
	},
	scrollbar: {
		borderRadius: tokens["--radius-full"],
		backgroundColor: tokens["--fill-track"],
		display: "flex",
		position: "absolute",
		touchAction: "none",
		userSelect: "none",
	},
	thumb: {
		borderRadius: tokens["--radius-full"],
		backgroundColor: {
			default: tokens["--fill-neutral"],
			":active": tokens["--fg-subtle"],
		},
		transitionDuration: tokens["--motion-duration-short"],
		transitionProperty: "background-color, width",
		transitionTimingFunction: tokens["--motion-ease-out"],
	},
	corner: {
		insetInlineEnd: 0,
		position: "absolute",
		bottom: 0,
		height: "10px",
		width: "10px",
	},
});

const scrollbarVisibilities = stylex.create({
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
			default: tokens["--motion-duration-short"],
		},
		transitionProperty: "opacity",
		transitionTimingFunction: tokens["--motion-ease-out"],
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
			default: tokens["--motion-duration-short"],
		},
		transitionProperty: "opacity",
		transitionTimingFunction: tokens["--motion-ease-out"],
	},
});

const scrollbarOrientations = stylex.create({
	vertical: {
		insetBlock: 0,
		marginBlock: tokens["--space-2"],
		marginInline: "3px",
		insetInlineEnd: 0,
		justifyContent: "center",
	},
	horizontal: {
		insetInline: 0,
		marginBlock: "3px",
		marginInline: tokens["--space-2"],
		alignItems: "center",
		justifyContent: "flex-start",
		bottom: 0,
	},
});

const thumbOrientationVariants = stylex.create({
	vertical: {
		minHeight: "36px",
		width: {
			default: "4px",
			":hover": "6px",
		},
	},
	horizontal: {
		height: {
			default: "4px",
			":hover": "6px",
		},
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
