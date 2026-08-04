import { useRender } from "@base-ui/react/use-render";
import { ArrowLineLeftIcon } from "@phosphor-icons/react/dist/csr/ArrowLineLeft";
import { ArrowLineRightIcon } from "@phosphor-icons/react/dist/csr/ArrowLineRight";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { createContext, useContext, useMemo, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { IconButton, type IconButtonProps } from "@/components/button/button";
import { NavListPresentationProvider } from "@/components/nav-list/nav-list";
import { ScrollArea } from "@/components/scroll-area/scroll-area";
import { textSizeStyles, textStyles, textWeightStyles } from "@/components/text/text.stylex";
import { tokens } from "@/theme/tokens.stylex";

type StyledProps<T> = Omit<T, "className" | "style"> & {
	className?: string;
	style?: StyleXStyles;
};

export type SidebarCollapseMode = "icon" | "offcanvas";
export type SidebarSide = "start" | "end";

export type SidebarRootProps = {
	children: ReactNode;
	collapseMode?: SidebarCollapseMode;
	collapsed?: boolean;
	defaultCollapsed?: boolean;
	onCollapsedChange?: (collapsed: boolean) => void;
	side?: SidebarSide;
};

export type SidebarPanelProps = StyledProps<useRender.ComponentProps<"aside">> & {
	render?: useRender.RenderProp;
};

export type SidebarHeaderProps = StyledProps<ComponentProps<"div">> & {
	endSlot?: ReactNode;
	startSlot?: ReactNode;
};

export type SidebarContentProps = StyledProps<ComponentProps<"div">>;
export type SidebarFooterProps = StyledProps<ComponentProps<"div">>;
export type SidebarTitleProps = StyledProps<ComponentProps<"div">>;
export type SidebarDescriptionProps = StyledProps<ComponentProps<"div">>;

export type SidebarTriggerProps = Omit<IconButtonProps, "icon" | "label"> & {
	collapseLabel?: string;
	expandLabel?: string;
};

type SidebarContextValue = {
	collapseMode: SidebarCollapseMode;
	collapsed: boolean;
	setCollapsed: (collapsed: boolean) => void;
	side: SidebarSide;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function Root({
	children,
	collapseMode = "icon",
	collapsed,
	defaultCollapsed = false,
	onCollapsedChange,
	side = "start",
}: SidebarRootProps) {
	const controlled = collapsed !== undefined;
	const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
	const resolvedCollapsed = collapsed ?? internalCollapsed;
	const value = useMemo(
		() => ({
			collapseMode,
			collapsed: resolvedCollapsed,
			side,
			setCollapsed(nextCollapsed: boolean) {
				if (!controlled) {
					setInternalCollapsed(nextCollapsed);
				}
				onCollapsedChange?.(nextCollapsed);
			},
		}),
		[collapseMode, controlled, onCollapsedChange, resolvedCollapsed, side],
	);

	return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function Panel({ ref, children, className, style, render, ...props }: SidebarPanelProps) {
	const sidebar = useSidebarContext("Sidebar.Panel");
	const collapsed = sidebar.collapsed;
	const offcanvasHidden = collapsed && sidebar.collapseMode === "offcanvas";
	const iconCollapsed = collapsed && sidebar.collapseMode === "icon";
	const sx = stylex.props(
		sidebarParts.panel,
		sidebar.side === "end" && sidebarParts.panelEnd,
		iconCollapsed && sidebarParts.panelIconCollapsed,
		offcanvasHidden && sidebarParts.panelOffcanvasCollapsed,
		style,
	);
	const element = useRender<{}, HTMLElement>({
		defaultTagName: "aside",
		ref,
		render,
		props: {
			...props,
			"aria-hidden": offcanvasHidden ? true : props["aria-hidden"],
			"data-collapse-mode": sidebar.collapseMode,
			"data-collapsed": collapsed ? "" : undefined,
			"data-side": sidebar.side,
			inert: offcanvasHidden ? true : undefined,
			className: [sx.className, className].filter(Boolean).join(" "),
			style: sx.style,
			children: (
				<div {...stylex.props(sidebarParts.rail, iconCollapsed && sidebarParts.railIconCollapsed)}>
					<div
						{...stylex.props(
							sidebarParts.content,
							iconCollapsed && sidebarParts.contentIconCollapsed,
							offcanvasHidden && sidebarParts.contentOffcanvasHidden,
						)}>
						{children}
					</div>
				</div>
			),
		},
	});

	return element;
}

export function Content({ className, style, children, ...props }: SidebarContentProps) {
	const sidebar = useSidebarContext("Sidebar.Content");
	const iconCollapsed = sidebar.collapsed && sidebar.collapseMode === "icon";
	const scrollRef = useRef<HTMLDivElement>(null);
	const sx = stylex.props(sidebarParts.contentArea, style);

	return (
		<ScrollArea
			{...props}
			disableFade
			label="Sidebar content"
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			contentStyle={sidebarParts.scrollContent}
			viewportRef={scrollRef}
			viewportStyle={sidebarParts.scrollViewport}>
			<NavListPresentationProvider
				presentation={iconCollapsed ? "icon" : "expanded"}
				popoverSide={sidebar.side === "start" ? "right" : "left"}
				scrollMode="external"
				scrollRef={scrollRef}>
				{children}
			</NavListPresentationProvider>
		</ScrollArea>
	);
}

export function Header({ startSlot, endSlot, children, className, style, ...props }: SidebarHeaderProps) {
	const sidebar = useSidebarContext("Sidebar.Header");
	const iconCollapsed = sidebar.collapsed && sidebar.collapseMode === "icon";
	const hasStartSlot = startSlot !== null && startSlot !== undefined && startSlot !== false;
	const hasEndSlot = endSlot !== null && endSlot !== undefined && endSlot !== false;
	const sx = stylex.props(sidebarParts.header, iconCollapsed && sidebarParts.headerRailCollapsed, style);

	return (
		<div
			{...props}
			className={[sx.className, className].filter(Boolean).join(" ")}
			data-collapsed={iconCollapsed ? "" : undefined}
			data-side={sidebar.side}
			style={sx.style}>
			{hasStartSlot ? <span {...stylex.props(sidebarParts.headerStartSlot)}>{startSlot}</span> : null}
			<div
				{...stylex.props(
					sidebarParts.headerContent,
					iconCollapsed && sidebarParts.headerContentIconCollapsed,
				)}>
				{children}
			</div>
			{hasEndSlot ? <span {...stylex.props(sidebarParts.headerEndSlot)}>{endSlot}</span> : null}
		</div>
	);
}

export function Footer({ className, style, ...props }: SidebarFooterProps) {
	const sx = stylex.props(sidebarParts.footer, style);

	return <div className={[sx.className, className].filter(Boolean).join(" ")} style={sx.style} {...props} />;
}

export function Title({ className, style, ...props }: SidebarTitleProps) {
	const sx = stylex.props(
		textStyles.body,
		textSizeStyles["2"],
		textWeightStyles.medium,
		sidebarParts.headerTitle,
		style,
	);

	return <div className={[sx.className, className].filter(Boolean).join(" ")} style={sx.style} {...props} />;
}

export function Description({ className, style, ...props }: SidebarDescriptionProps) {
	const sx = stylex.props(textStyles.body, textSizeStyles["1"], sidebarParts.headerDescription, style);

	return <div className={[sx.className, className].filter(Boolean).join(" ")} style={sx.style} {...props} />;
}

export function Trigger({
	collapseLabel = "Collapse sidebar",
	expandLabel = "Expand sidebar",
	variant = "ghost",
	tooltip = false,
	onClick,
	style,
	...props
}: SidebarTriggerProps) {
	const sidebar = useSidebarContext("Sidebar.Trigger");
	const label = sidebar.collapsed ? expandLabel : collapseLabel;
	const CollapseIcon = sidebar.side === "start" ? ArrowLineLeftIcon : ArrowLineRightIcon;
	const ExpandIcon = sidebar.side === "start" ? ArrowLineRightIcon : ArrowLineLeftIcon;
	const TriggerIcon = sidebar.collapsed ? ExpandIcon : CollapseIcon;

	return (
		<IconButton
			{...props}
			icon={<TriggerIcon />}
			label={label}
			tooltip={tooltip}
			variant={variant}
			onClick={(event) => {
				onClick?.(event);
				if (!event.defaultPrevented) {
					sidebar.setCollapsed(!sidebar.collapsed);
				}
			}}
			style={style}
		/>
	);
}

function useSidebarContext(componentName: string) {
	const context = useContext(SidebarContext);
	if (!context) {
		throw new Error(`${componentName} must be rendered inside Sidebar.Root.`);
	}

	return context;
}

const sidebarParts = stylex.create({
	panel: {
		flex: "0 0 auto",
		overflow: "hidden",
		backgroundColor: tokens["--surface"],
		borderInlineEndColor: tokens["--border"],
		borderInlineEndStyle: "solid",
		borderInlineEndWidth: tokens["--border-width"],
		display: "block",
		inlineSize: tokens["--size-sidebar"],
		minBlockSize: 0,
		transitionDuration: {
			default: tokens["--motion-duration-medium"],
			"@media (prefers-reduced-motion: reduce)": "0ms",
		},
		transitionProperty: "inline-size",
		transitionTimingFunction: tokens["--motion-ease-smooth-out"],
	},
	panelEnd: {
		borderInlineEndWidth: 0,
		borderInlineStartColor: tokens["--border"],
		borderInlineStartStyle: "solid",
		borderInlineStartWidth: tokens["--border-width"],
	},
	panelIconCollapsed: {
		inlineSize: tokens["--size-sidebar-rail"],
	},
	panelOffcanvasCollapsed: {
		inlineSize: 0,
	},
	rail: {
		overflow: "hidden",
		blockSize: "100%",
		inlineSize: tokens["--size-sidebar"],
		minBlockSize: 0,
	},
	railIconCollapsed: {
		inlineSize: tokens["--size-sidebar-rail"],
	},
	content: {
		padding: tokens["--space-3"],
		blockSize: "100%",
		boxSizing: "border-box",
		display: "flex",
		flexDirection: "column",
		inlineSize: tokens["--size-sidebar"],
		minBlockSize: 0,
		transform: "translateX(0)",
		transitionDuration: {
			default: tokens["--motion-duration-medium"],
			"@media (prefers-reduced-motion: reduce)": "0ms",
		},
		transitionProperty: "inline-size, padding, transform",
		transitionTimingFunction: tokens["--motion-ease-smooth-out"],
	},
	contentArea: {
		flex: "1 1 auto",
		minBlockSize: 0,
		minInlineSize: 0,
	},
	contentIconCollapsed: {
		paddingBlock: tokens["--space-3"],
		paddingInline: tokens["--space-2"],
		inlineSize: tokens["--size-sidebar-rail"],
	},
	scrollArea: {
		flex: "1 1 auto",
		minBlockSize: 0,
		minInlineSize: 0,
	},
	scrollViewport: {
		minBlockSize: 0,
	},
	scrollContent: {
		display: "flex",
		minBlockSize: "100%",
	},
	contentOffcanvasHidden: {
		pointerEvents: "none",
		transform: {
			"[data-side='end'] &": "translateX(100%)",
			"[data-side='start'] &": "translateX(-100%)",
			"[dir='rtl'] [data-side='end'] &": "translateX(-100%)",
			"[dir='rtl'] [data-side='start'] &": "translateX(100%)",
			default: "translateX(-100%)",
		},
	},
	header: {
		gap: tokens["--space-2"],
		paddingInline: tokens["--space-3"],
		alignItems: "center",
		color: tokens["--fg"],
		display: "flex",
		minBlockSize: tokens["--size-control-lg"],
		minInlineSize: 0,
	},
	headerRailCollapsed: {
		paddingInline: 0,
		alignItems: "center",
		flexDirection: "column",
		inlineSize: tokens["--size-control-lg"],
	},
	headerStartSlot: {
		flex: "none",
		alignItems: "center",
		color: "currentColor",
		display: "inline-flex",
		justifyContent: "center",
		minInlineSize: 0,
	},
	headerContent: {
		flex: "1 1 auto",
		overflow: "hidden",
		display: "flex",
		flexDirection: "column",
		minInlineSize: 0,
	},
	headerContentIconCollapsed: {
		display: "none",
	},
	headerEndSlot: {
		flex: "none",
		alignItems: "center",
		display: "inline-flex",
		justifyContent: "center",
		minInlineSize: 0,
	},
	headerTitle: {
		overflow: "hidden",
		color: tokens["--fg"],
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
	},
	headerDescription: {
		overflow: "hidden",
		color: tokens["--fg-muted"],
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
	},
	footer: {
		flex: "none",
		gap: tokens["--space-2"],
		display: "flex",
		justifyContent: {
			"[data-collapsed] &": "center",
			default: "flex-start",
		},
	},
});
