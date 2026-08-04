import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { useMergedRefs } from "@base-ui/utils/useMergedRefs";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import {
	createContext,
	type ComponentPropsWithRef,
	type ReactNode,
	useContext,
	useEffect,
	useMemo,
	useRef,
} from "react";
import type { ButtonSize } from "@/components/button/button";
import { textSizeStyles, textWeightStyles } from "@/components/text/text.stylex";
import { focusRing } from "@/styles/recipes/focus";
import { tokens } from "@/theme/tokens.stylex";

export type TabsSize = Extract<ButtonSize, "sm" | "md" | "lg">;

type TabsContextValue = {
	orientation: BaseTabs.Root.Orientation;
	size: TabsSize;
};

const TabsContext = createContext<TabsContextValue | null>(null);

export type TabsRootProps = Omit<BaseTabs.Root.Props, "className" | "style"> & {
	className?: string;
	size?: TabsSize;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export function Root({
	ref,
	children,
	className,
	orientation = "horizontal",
	size: tabsSize = "md",
	style,
	...props
}: TabsRootProps) {
	const sx = stylex.props(tabsParts.root, rootOrientationStyles[orientation], style);
	const contextValue = useMemo(() => ({ orientation, size: tabsSize }), [orientation, tabsSize]);

	return (
		<TabsContext value={contextValue}>
			<BaseTabs.Root
				ref={ref}
				orientation={orientation}
				data-size={tabsSize}
				className={mergeClassNames(sx.className, className)}
				style={sx.style}
				{...props}>
				{children}
			</BaseTabs.Root>
		</TabsContext>
	);
}

export type TabsListProps = Omit<BaseTabs.List.Props, "className" | "style"> & {
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export function List({ ref, children, className, style, ...props }: TabsListProps) {
	const { orientation, size: tabsSize } = useTabsContext();
	const listRef = useRef<HTMLDivElement | null>(null);
	const indicatorRef = useRef<HTMLSpanElement | null>(null);
	const mergedRef = useMergedRefs(ref, listRef);
	const sx = stylex.props(tabsParts.list, listOrientationStyles[orientation], tabsRadiusStyles[tabsSize], style);
	const indicatorSx = stylex.props(tabsParts.indicator);

	useEffect(() => {
		const listElement = listRef.current;
		const indicatorElement = indicatorRef.current;

		if (listElement === null || indicatorElement === null || typeof ResizeObserver === "undefined") {
			return;
		}

		let frame = 0;
		const snapIndicator = () => {
			indicatorElement.dataset.snap = "";
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => {
				void indicatorElement.offsetWidth;
				delete indicatorElement.dataset.snap;
			});
		};
		const resizeObserver = new ResizeObserver(snapIndicator);
		resizeObserver.observe(listElement);
		listElement.querySelectorAll<HTMLElement>('[role="tab"]').forEach((tab) => resizeObserver.observe(tab));
		snapIndicator();

		return () => {
			cancelAnimationFrame(frame);
			resizeObserver.disconnect();
		};
	}, []);

	return (
		<BaseTabs.List ref={mergedRef} className={mergeClassNames(sx.className, className)} style={sx.style} {...props}>
			{children}
			<BaseTabs.Indicator ref={indicatorRef} className={indicatorSx.className} style={indicatorSx.style} />
		</BaseTabs.List>
	);
}

export type TabsTabProps = Omit<BaseTabs.Tab.Props, "children" | "className" | "style"> & {
	children: ReactNode;
	className?: string;
	/** Visual content positioned before the label. */
	startSlot?: ReactNode;
	/** Visual content positioned after the label. */
	endSlot?: ReactNode;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export function Tab({ ref, children, className, endSlot, startSlot, style, type = "button", ...props }: TabsTabProps) {
	const { orientation, size: tabsSize } = useTabsContext();
	const sx = stylex.props(
		focusRing.outset,
		tabsParts.tab,
		textWeightStyles.medium,
		tabTextSizeStyles[tabsSize],
		tabOrientationStyles[orientation],
		tabSizeStyles[tabsSize],
		style,
	);

	return (
		<BaseTabs.Tab
			ref={ref}
			type={type}
			className={mergeClassNames(sx.className, className)}
			style={sx.style}
			{...props}>
			{renderSlot(startSlot, "start", tabsSize)}
			{children}
			{renderSlot(endSlot, "end", tabsSize)}
		</BaseTabs.Tab>
	);
}

type TabsContentElementProps = Omit<ComponentPropsWithRef<"div">, "className" | "style"> & {
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export type TabsContentProps = TabsContentElementProps;

export function Content({ ref, className, style, ...props }: TabsContentProps) {
	const sx = stylex.props(tabsParts.content, style);
	return <div ref={ref} {...props} className={mergeClassNames(sx.className, className)} style={sx.style} />;
}

export type TabsPanelProps = Omit<BaseTabs.Panel.Props, "className" | "style"> & {
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export function Panel({ ref, className, style, ...props }: TabsPanelProps) {
	const sx = stylex.props(tabsParts.panel, focusRing.inset, style);
	return <BaseTabs.Panel ref={ref} className={mergeClassNames(sx.className, className)} style={sx.style} {...props} />;
}

function useTabsContext() {
	const context = useContext(TabsContext);
	if (context === null) {
		throw new Error("Tabs parts must be rendered inside Tabs.Root.");
	}
	return context;
}

function renderSlot(slot: ReactNode, role: "start" | "end", tabsSize: TabsSize) {
	if (slot == null || typeof slot === "boolean") {
		return null;
	}

	const sx = stylex.props(
		tabsParts.slot,
		slotSizeStyles[tabsSize],
		role === "start" ? startSlotOffsetStyles[tabsSize] : endSlotOffsetStyles[tabsSize],
	);

	return (
		<span aria-hidden className={sx.className} style={sx.style}>
			{slot}
		</span>
	);
}

function mergeClassNames(...classNames: Array<string | undefined>) {
	return classNames.filter(Boolean).join(" ");
}

const tabsParts = stylex.create({
	root: {
		gap: tokens["--space-3"],
		boxSizing: "border-box",
		display: "flex",
		minWidth: 0,
		width: "100%",
	},
	list: {
		padding: "1px",
		borderRadius: "var(--_tabs-list-radius)",
		cornerShape: "superellipse(1.3)",
		flex: "none",
		gap: tokens["--space-1"],
		backgroundColor: tokens["--color-gray-s1"],
		boxSizing: "border-box",
		display: "inline-flex",
		isolation: "isolate",
		outlineColor: tokens["--border"],
		outlineStyle: "solid",
		outlineWidth: 1,
		position: "relative",
	},
	indicator: {
		borderRadius: "calc(var(--_tabs-list-radius) - 1px)",
		cornerShape: "superellipse(1.3)",
		backgroundColor: tokens["--elevated"],
		boxShadow: tokens["--shadow-sm"],
		insetBlockStart: 0,
		insetInlineStart: 0,
		pointerEvents: "none",
		position: "absolute",
		transitionDuration: {
			"[data-snap]": "0ms",
			default: tokens["--motion-duration-medium"],
			"@media (prefers-reduced-motion: reduce)": "0ms",
		},
		transitionProperty: "translate, width, height",
		transitionTimingFunction: tokens["--motion-ease-smooth-out"],
		translate: "var(--active-tab-left) var(--active-tab-top)",
		willChange: "translate, width, height",
		zIndex: 0,
		height: "var(--active-tab-height)",
		width: "var(--active-tab-width)",
	},
	tab: {
		margin: 0,
		borderRadius: "calc(var(--_tabs-list-radius) - 1px)",
		borderStyle: "none",
		cornerShape: "superellipse(1.3)",
		gap: tokens["--space-2"],
		paddingBlock: 0,
		alignItems: "center",
		appearance: "none",
		backgroundColor: "transparent",
		boxSizing: "border-box",
		color: {
			"[data-active]": tokens["--fg"],
			default: tokens["--fg-muted"],
			":hover": tokens["--fg"],
		},
		cursor: "default",
		display: "inline-flex",
		fontFamily: "inherit",
		opacity: {
			"[data-disabled]": 0.48,
			default: 1,
		},
		pointerEvents: {
			"[data-disabled]": "none",
			default: "auto",
		},
		position: "relative",
		transitionDuration: {
			default: tokens["--motion-duration-medium"],
			"@media (prefers-reduced-motion: reduce)": "0ms",
		},
		transitionProperty: "color",
		transitionTimingFunction: tokens["--motion-ease-smooth-out"],
		userSelect: "none",
		whiteSpace: "nowrap",
		zIndex: 1,
	},
	slot: {
		flex: "none",
		alignItems: "center",
		color: "currentColor",
		display: "inline-flex",
		justifyContent: "center",
		lineHeight: 0,
		pointerEvents: "none",
		height: "1em",
		width: "1em",
	},
	content: {
		flex: "1 1 auto",
		display: "grid",
		gridTemplateColumns: "minmax(0, 1fr)",
		minWidth: 0,
		width: "100%",
	},
	panel: {
		gridArea: "1 / 1",
		paddingBlock: tokens["--space-3"],
		outlineStyle: "solid",
		outlineWidth: 0,
		minWidth: 0,
	},
});

const rootOrientationStyles = stylex.create({
	horizontal: {
		alignItems: "stretch",
		flexDirection: "column",
	},
	vertical: {
		alignItems: "flex-start",
		flexDirection: "row",
	},
});

const listOrientationStyles = stylex.create({
	horizontal: {
		alignItems: "center",
		alignSelf: "flex-start",
		flexDirection: "row",
	},
	vertical: {
		alignItems: "stretch",
		alignSelf: "stretch",
		flexDirection: "column",
	},
});

const tabOrientationStyles = stylex.create({
	horizontal: {
		justifyContent: "center",
	},
	vertical: {
		justifyContent: "flex-start",
		width: "100%",
	},
});

const tabsRadiusStyles = stylex.create({
	sm: { "--_tabs-list-radius": tokens["--radius-sm"] },
	md: { "--_tabs-list-radius": tokens["--radius-md"] },
	lg: { "--_tabs-list-radius": tokens["--radius-md"] },
});

const tabTextSizeStyles = {
	sm: textSizeStyles["1"],
	md: textSizeStyles["2"],
	lg: textSizeStyles["2"],
} as const;

const tabSizeStyles = stylex.create({
	sm: {
		paddingInline: tokens["--space-3"],
		height: tokens["--size-control-sm"],
		minWidth: tokens["--size-control-sm"],
	},
	md: {
		paddingInline: tokens["--space-3"],
		height: tokens["--size-control-md"],
		minWidth: tokens["--size-control-md"],
	},
	lg: {
		paddingInline: tokens["--space-4"],
		height: tokens["--size-control-lg"],
		minWidth: tokens["--size-control-lg"],
	},
});

const slotSizeStyles = stylex.create({
	sm: { fontSize: "1em" },
	md: { fontSize: "1rem" },
	lg: { fontSize: "1.125em" },
});

const startSlotOffsetStyles = stylex.create({
	sm: { marginInlineStart: "-0.25rem" },
	md: { marginInlineStart: "-0.25rem" },
	lg: { marginInlineStart: "-0.1875rem" },
});

const endSlotOffsetStyles = stylex.create({
	sm: { marginInlineEnd: "-0.25rem" },
	md: { marginInlineEnd: "-0.25rem" },
	lg: { marginInlineEnd: "-0.1875rem" },
});
