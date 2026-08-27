import { useRender } from "@base-ui/react/use-render";
import * as stylex from "@stylexjs/stylex";
import {
	createContext,
	useContext,
	useMemo,
	useRef,
	useState,
	type ComponentProps,
	type ReactNode,
} from "react";
import { IconButton, type IconButtonProps } from "@/components/button/button";
import { NavListPresentationProvider } from "@/components/nav-list/nav-list";
import { ScrollArea } from "@/components/scroll-area/scroll-area";
import { typescaleStyles, textStyles, fontWeightStyles } from "@/components/text/text.stylex";
import { tokens } from "@/theme/tokens.stylex";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { attrJoin } from "@/utils/attr-join";

type StyledProps<T> = Omit<T, "className" | "style" | "xstyle"> &
	BaseStyleProps & { className?: string };

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

export function Panel({
	ref,
	children,
	className,
	style,
	xstyle,
	render,
	...props
}: SidebarPanelProps) {
	const sidebar = useSidebarContext("Sidebar.Panel");
	const collapsed = sidebar.collapsed;
	const offcanvasHidden = collapsed && sidebar.collapseMode === "offcanvas";
	const iconCollapsed = collapsed && sidebar.collapseMode === "icon";
	const sx = stylex.props(
		sidebarParts.panel,
		sidebar.side === "end" && sidebarParts.panelEnd,
		iconCollapsed && sidebarParts.panelIconCollapsed,
		offcanvasHidden && sidebarParts.panelOffcanvasCollapsed,
		xstyle,
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
			className: attrJoin(sx.className, className),
			style: mergeStyle(sx.style, style),
			children: (
				<div {...stylex.props(sidebarParts.rail, iconCollapsed && sidebarParts.railIconCollapsed)}>
					<div
						{...stylex.props(
							sidebarParts.content,
							iconCollapsed && sidebarParts.contentIconCollapsed,
							offcanvasHidden && sidebarParts.contentOffcanvasHidden,
						)}
					>
						{children}
					</div>
				</div>
			),
		},
	});

	return element;
}

export function Content({ className, style, xstyle, children, ...props }: SidebarContentProps) {
	const sidebar = useSidebarContext("Sidebar.Content");
	const iconCollapsed = sidebar.collapsed && sidebar.collapseMode === "icon";
	const scrollRef = useRef<HTMLDivElement>(null);
	const sx = stylex.props(sidebarParts.contentArea, xstyle);

	return (
		<ScrollArea
			{...props}
			disableFade
			label="Sidebar content"
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			viewportRef={scrollRef}
		>
			<div {...stylex.props(sidebarParts.scrollContent)}>
				<NavListPresentationProvider
					presentation={iconCollapsed ? "icon" : "expanded"}
					popoverSide={sidebar.side === "start" ? "right" : "left"}
					scrollMode="external"
					scrollRef={scrollRef}
				>
					{children}
				</NavListPresentationProvider>
			</div>
		</ScrollArea>
	);
}

export function Header({
	startSlot,
	endSlot,
	children,
	className,
	style,
	xstyle,
	...props
}: SidebarHeaderProps) {
	const sidebar = useSidebarContext("Sidebar.Header");
	const iconCollapsed = sidebar.collapsed && sidebar.collapseMode === "icon";
	const hasStartSlot = startSlot !== null && startSlot !== undefined && startSlot !== false;
	const hasEndSlot = endSlot !== null && endSlot !== undefined && endSlot !== false;
	const sx = stylex.props(
		sidebarParts.header,
		iconCollapsed && sidebarParts.headerRailCollapsed,
		xstyle,
	);

	return (
		<div
			{...props}
			className={attrJoin(sx.className, className)}
			data-collapsed={iconCollapsed ? "" : undefined}
			data-side={sidebar.side}
			style={mergeStyle(sx.style, style)}
		>
			{hasStartSlot ? (
				<span {...stylex.props(sidebarParts.headerStartSlot)}>{startSlot}</span>
			) : null}
			<div
				{...stylex.props(
					sidebarParts.headerContent,
					iconCollapsed && sidebarParts.headerContentIconCollapsed,
				)}
			>
				{children}
			</div>
			{hasEndSlot ? <span {...stylex.props(sidebarParts.headerEndSlot)}>{endSlot}</span> : null}
		</div>
	);
}

export function Footer({ className, style, xstyle, ...props }: SidebarFooterProps) {
	const sx = stylex.props(sidebarParts.footer, xstyle);

	return (
		<div
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...props}
		/>
	);
}

export function Title({ className, style, xstyle, ...props }: SidebarTitleProps) {
	const sx = stylex.props(
		textStyles.body,
		typescaleStyles["2"],
		fontWeightStyles.medium,
		sidebarParts.headerTitle,
		xstyle,
	);

	return (
		<div
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...props}
		/>
	);
}

export function Description({ className, style, xstyle, ...props }: SidebarDescriptionProps) {
	const sx = stylex.props(
		textStyles.body,
		typescaleStyles["1"],
		sidebarParts.headerDescription,
		xstyle,
	);

	return (
		<div
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...props}
		/>
	);
}

export function Trigger({
	collapseLabel = "Collapse sidebar",
	expandLabel = "Expand sidebar",
	variant = "ghost",
	tooltip = false,
	onClick,
	xstyle,
	...props
}: SidebarTriggerProps) {
	const sidebar = useSidebarContext("Sidebar.Trigger");
	const label = sidebar.collapsed ? expandLabel : collapseLabel;

	return (
		<IconButton
			{...props}
			icon={<SidebarPanelIcon collapsed={sidebar.collapsed} side={sidebar.side} />}
			label={label}
			tooltip={tooltip}
			variant={variant}
			onClick={(event) => {
				onClick?.(event);
				if (!event.defaultPrevented) {
					sidebar.setCollapsed(!sidebar.collapsed);
				}
			}}
			xstyle={xstyle}
		/>
	);
}

function SidebarPanelIcon({ collapsed, side }: { collapsed: boolean; side: SidebarSide }) {
	const expandedStyle =
		side === "start"
			? sidebarParts.triggerIconDividerStartExpanded
			: sidebarParts.triggerIconDividerEndExpanded;
	const collapsedStyle =
		side === "start"
			? sidebarParts.triggerIconDividerStartCollapsed
			: sidebarParts.triggerIconDividerEndCollapsed;

	return (
		<svg
			aria-hidden="true"
			data-collapsed={collapsed ? "" : undefined}
			data-side={side}
			data-sidebar-trigger-icon=""
			focusable="false"
			fill="none"
			height="16"
			stroke="currentColor"
			strokeLinecap="round"
			strokeWidth="1.5"
			viewBox="0 0 24 24"
			width="16"
			{...stylex.props(sidebarParts.triggerIcon)}
		>
			<path d="M21.25 6.72v10.56a2.97 2.97 0 0 1-2.97 2.97H5.72a2.97 2.97 0 0 1-2.97-2.97V6.72a2.97 2.97 0 0 1 2.97-2.97h12.56a2.97 2.97 0 0 1 2.97 2.97" />
			<path
				d="M6.25 7.25v9.5"
				{...stylex.props(
					sidebarParts.triggerIconDivider,
					collapsed ? collapsedStyle : expandedStyle,
				)}
			/>
		</svg>
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
		overflow: "hidden",
		paddingBlock: tokens["--space-1"],
		backgroundColor: tokens["--surface"],
		boxShadow: `inset -1px 0 0 0 ${tokens["--border"]}`,
		display: "block",
		flexBasis: "auto",
		flexGrow: "0",
		flexShrink: "0",
		inlineSize: tokens["--size-sidebar"],
		minBlockSize: 0,
		transitionDuration: tokens["--motion-duration-medium"],
		transitionProperty: "inline-size",
		transitionTimingFunction: tokens["--motion-ease-smooth-out"],
	},
	panelEnd: {
		boxShadow: `inset 1px 0 0 0 ${tokens["--border"]}`,
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
		gap: tokens["--space-2"],
		paddingInline: tokens["--space-3"],
		alignItems: "stretch",
		blockSize: "100%",
		boxSizing: "border-box",
		display: "flex",
		flexDirection: "column",
		inlineSize: tokens["--size-sidebar"],
		minBlockSize: 0,
		transform: "translateX(0)",
		transitionDuration: tokens["--motion-duration-medium"],
		transitionProperty: "inline-size, padding, transform",
		transitionTimingFunction: tokens["--motion-ease-smooth-out"],
	},
	contentArea: {
		paddingBlock: tokens["--space-2"],
		flexBasis: "auto",
		flexGrow: "1",
		flexShrink: "1",
		minBlockSize: 0,
		minInlineSize: 0,
	},
	contentIconCollapsed: {
		paddingInline: tokens["--space-2"],
		inlineSize: tokens["--size-sidebar-rail"],
	},
	scrollContent: {
		gap: "1px",
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
		gap: tokens["--space-3"],
		paddingInline: tokens["--space-0"],
		alignItems: "center",
		borderBlockEndColor: tokens["--border"],
		borderBlockEndStyle: "solid",
		borderBlockEndWidth: tokens["--border-width"],
		color: tokens["--fg"],
		display: "flex",
		minInlineSize: 0,
		paddingBlockEnd: tokens["--space-3"],
		paddingBlockStart: tokens["--space-2"],
	},
	headerRailCollapsed: {
		gap: tokens["--space-1"],
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
		overflow: "hidden",
		display: "flex",
		flexBasis: "auto",
		flexDirection: "column",
		flexGrow: "1",
		flexShrink: "1",
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
		paddingBlock: tokens["--space-2"],
		paddingInline: tokens["--space-1"],
		borderBlockStartColor: tokens["--border"],
		borderBlockStartStyle: "solid",
		borderBlockStartWidth: tokens["--border-width"],
		display: "flex",
		justifyContent: {
			"[data-collapsed] &": "center",
			default: "flex-start",
		},
	},
	triggerIcon: {
		display: "block",
		flexShrink: 0,
	},
	triggerIconDivider: {
		transformBox: "fill-box",
		transitionDuration: tokens["--motion-duration-medium"],
		transitionProperty: "transform",
		transitionTimingFunction: tokens["--motion-ease-smooth-out"],
	},
	triggerIconDividerStartExpanded: {
		transform: "translateX(1px)",
	},
	triggerIconDividerStartCollapsed: {
		transform: "translateX(10.5px)",
	},
	triggerIconDividerEndExpanded: {
		transform: "translateX(10.5px)",
	},
	triggerIconDividerEndCollapsed: {
		transform: "translateX(1px)",
	},
});

export const Sidebar = {
	Root,
	Panel,
	Content,
	Header,
	Footer,
	Title,
	Description,
	Trigger,
} as const;
