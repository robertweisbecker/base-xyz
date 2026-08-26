import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { useMergedRefs } from "@base-ui/utils/useMergedRefs";
import * as stylex from "@stylexjs/stylex";
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
import { typescaleStyles, fontWeightStyles } from "@/components/text/text.stylex";
import { media } from "@/styles/constants.stylex";
import { focusRing } from "@/styles/recipes/focus";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { extractMarginProps, type MarginProps } from "@/styles/props/spacing.stylex";
import { tokens } from "@/theme/tokens.stylex";
import { attrJoin } from "@/utils/attr-join";

export type TabsSize = Extract<ButtonSize, "sm" | "md" | "lg">;
export type TabsVariant = "default" | "underline";

type TabsContextValue = {
	orientation: BaseTabs.Root.Orientation;
	size: TabsSize;
	variant: TabsVariant;
};

const TabsContext = createContext<TabsContextValue | null>(null);

type TabsPartStyleProps = BaseStyleProps & {
	className?: string;
};

export type TabsRootProps = Omit<BaseTabs.Root.Props, "className" | "style" | keyof MarginProps> &
	MarginProps &
	BaseStyleProps & {
		className?: string;
		size?: TabsSize;
		variant?: TabsVariant;
	};

export function Root({
	ref,
	children,
	className,
	orientation = "horizontal",
	size: tabsSize = "md",
	style,
	variant = "default",
	xstyle,
	...props
}: TabsRootProps) {
	const { marginStyles, rest } = extractMarginProps(props);
	const sx = stylex.props(
		tabsParts.root,
		rootOrientationStyles[orientation],
		marginStyles,
		xstyle,
	);
	const contextValue = useMemo(
		() => ({ orientation, size: tabsSize, variant }),
		[orientation, tabsSize, variant],
	);

	return (
		<TabsContext value={contextValue}>
			<BaseTabs.Root
				ref={ref}
				orientation={orientation}
				data-size={tabsSize}
				className={attrJoin(sx.className, className)}
				style={mergeStyle(sx.style, style)}
				{...rest}>
				{children}
			</BaseTabs.Root>
		</TabsContext>
	);
}

export type TabsListProps = Omit<BaseTabs.List.Props, "className" | "style"> & TabsPartStyleProps;

export function List({ ref, children, className, style, xstyle, ...props }: TabsListProps) {
	const { orientation, size: tabsSize, variant } = useTabsContext();
	const listRef = useRef<HTMLDivElement | null>(null);
	const indicatorRef = useRef<HTMLSpanElement | null>(null);
	const mergedRef = useMergedRefs(ref, listRef);
	const sx = stylex.props(
		tabsParts.list,
		listOrientationStyles[orientation],
		tabsRadiusStyles[tabsSize],
		variant === "underline" && underlineListStyles.base,
		variant === "underline" && underlineListOrientationStyles[orientation],
		xstyle,
	);
	const indicatorSx = stylex.props(
		tabsParts.indicator,
		variant === "underline" && underlineIndicatorStyles.base,
		variant === "underline" && underlineIndicatorOrientationStyles[orientation],
	);

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
		<BaseTabs.List
			ref={mergedRef}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...props}>
			{children}
			<BaseTabs.Indicator
				ref={indicatorRef}
				className={indicatorSx.className}
				style={indicatorSx.style}
			/>
		</BaseTabs.List>
	);
}

export type TabsTabProps = Omit<BaseTabs.Tab.Props, "children" | "className" | "style"> &
	TabsPartStyleProps & {
		children: ReactNode;
		/** Visual content positioned before the label. */
		startSlot?: ReactNode;
		/** Visual content positioned after the label. */
		endSlot?: ReactNode;
	};

export function Tab({ ref, children, className, endSlot, startSlot, style, xstyle, type = "button", ...props }: TabsTabProps) {
	const { orientation, size: tabsSize, variant } = useTabsContext();
	const sx = stylex.props(
		focusRing.offset,
		tabsParts.tab,
		fontWeightStyles.medium,
		tabTextSizeStyles[tabsSize],
		tabOrientationStyles[orientation],
		tabSizeStyles[tabsSize],
		variant === "underline" && underlineTabStyles.root,
		xstyle,
	);

	return (
		<BaseTabs.Tab
			ref={ref}
			type={type}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...props}>
			{renderSlot(startSlot, "start", tabsSize)}
			{children}
			{renderSlot(endSlot, "end", tabsSize)}
		</BaseTabs.Tab>
	);
}

type TabsContentElementProps = Omit<ComponentPropsWithRef<"div">, "className" | "style"> & TabsPartStyleProps;

export type TabsContentProps = TabsContentElementProps;

export function Content({ ref, className, style, xstyle, ...props }: TabsContentProps) {
	const sx = stylex.props(tabsParts.content, xstyle);
	return (
		<div
			ref={ref}
			{...props}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
		/>
	);
}

export type TabsPanelProps = Omit<BaseTabs.Panel.Props, "className" | "style"> & TabsPartStyleProps;

export function Panel({ ref, className, style, xstyle, ...props }: TabsPanelProps) {
	const sx = stylex.props(tabsParts.panel, focusRing.inset, xstyle);
	return (
		<BaseTabs.Panel
			ref={ref}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...props}
		/>
	);
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
		backgroundColor: tokens["--surface-subtle"],
		boxSizing: "border-box",
		display: "inline-flex",
		isolation: "isolate",
		outlineColor: tokens["--border-disabled"],
		outlineOffset: -1,
		outlineStyle: "solid",
		outlineWidth: 1,
		position: "relative",
	},
	indicator: {
		borderRadius: "calc(var(--_tabs-list-radius) - 1px)",
		cornerShape: "superellipse(1.3)",
		backgroundColor: tokens["--elevated"],
		boxShadow: tokens["--shadow-sm"],
		pointerEvents: "none",
		position: "absolute",
		transitionDuration: {
			"[data-snap]": "0ms",
			default: tokens["--motion-duration-medium"],
			[media.reducedMotion]: "0ms",
		},
		transitionProperty: "translate, width, height",
		transitionTimingFunction: tokens["--motion-ease-smooth-out"],
		translate: "var(--active-tab-left) var(--active-tab-top)",
		willChange: "translate, width, height",
		zIndex: 0,
		height: "var(--active-tab-height)",
		left: 0,
		top: 0,
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
			"[data-disabled]": tokens["--fg-subtle"],
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
		transitionDuration: tokens["--motion-duration-medium"],
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
		opacity: {
			default: 1,
			":has(svg)": 0.72,
		},
		pointerEvents: "none",
		height: {
			default: null,
			":is(svg)": "1em",
		},
		width: {
			default: null,
			":is(svg)": "1em",
		},
	},
	content: {
		display: "grid",
		flexBasis: "auto",
		flexGrow: "1",
		flexShrink: "1",
		gridTemplateColumns: "minmax(0, 1fr)",
		minWidth: 0,
		width: "100%",
	},
	panel: {
		paddingBlock: tokens["--space-3"],
		gridColumnStart: "1",
		gridRowStart: "1",
		outlineStyle: "solid",
		outlineWidth: 0,
		minWidth: 0,
	},
});

const underlineListStyles = stylex.create({
	base: {
		padding: 0,
		borderRadius: 0,
		backgroundColor: "transparent",
		outlineStyle: "none",
		outlineWidth: 0,
	},
});

const underlineListOrientationStyles = stylex.create({
	horizontal: {
		alignSelf: "stretch",
		borderBottomColor: tokens["--border"],
		borderBottomStyle: "solid",
		borderBottomWidth: tokens["--border-width"],
		paddingBottom: tokens["--space-1"],
		width: "100%",
	},
	vertical: {
		borderRightColor: tokens["--border"],
		borderRightStyle: "solid",
		borderRightWidth: tokens["--border-width"],
		paddingRight: tokens["--space-1"],
	},
});

const underlineIndicatorStyles = stylex.create({
	base: {
		borderRadius: 0,
		backgroundColor: tokens["--fill-accent"],
		boxShadow: "none",
	},
});

const underlineIndicatorOrientationStyles = stylex.create({
	horizontal: {
		translate: "var(--active-tab-left) 0",
		bottom: `calc(0px - ${tokens["--border-width"]})`,
		height: "2px",
		left: 0,
		right: "auto",
		top: "auto",
		width: "var(--active-tab-width)",
	},
	vertical: {
		translate: "0 var(--active-tab-top)",
		bottom: "auto",
		height: "var(--active-tab-height)",
		left: "auto",
		right: `calc(0px - ${tokens["--border-width"]})`,
		top: 0,
		width: "2px",
	},
});

const underlineTabStyles = stylex.create({
	root: {
		backgroundColor: {
			default: "transparent",
			":hover": {
				[media.canHover]: tokens["--surface-subtle-hover"],
			},
			":active": tokens["--surface-subtle-active"],
		},
		transitionProperty: "background-color, color",
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
	lg: { "--_tabs-list-radius": tokens["--radius-lg"] },
});

const tabTextSizeStyles = {
	sm: typescaleStyles["1"],
	md: typescaleStyles["2"],
	lg: typescaleStyles["2"],
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
	sm: { fontSize: ".875rem" },
	md: { fontSize: "1rem" },
	lg: { fontSize: "1.125rem" },
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

export const Tabs = {
	Root,
	List,
	Tab,
	Content,
	Panel,
} as const;
