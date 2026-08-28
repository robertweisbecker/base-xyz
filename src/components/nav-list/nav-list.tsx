import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";
import { useRender } from "@base-ui/react/use-render";
import { media } from "@/styles/constants.stylex";
import { Collapsible } from "@/components/collapsible/collapsible";
import { ArrowLeftIcon, ArrowRightIcon, FileIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import {
	createContext,
	isValidElement,
	useCallback,
	useContext,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
	type ComponentProps,
	type MouseEvent,
	type ReactElement,
	type ReactNode,
	type Ref,
	type RefObject,
} from "react";
import {
	menuItemSizeStyles,
	menuItemStyles,
	menuItemVariantStyles,
} from "@/components/menu/menu-item.stylex";
import { menuItemVars } from "@/components/menu/menu-item-vars.stylex";
import { Popover } from "@/components/popover/popover";
import { typescaleStyles, textStyles, fontWeightStyles } from "@/components/text/text.stylex";
import { Tooltip } from "@/components/tooltip/tooltip";
import { VisuallyHidden } from "@/components/visually-hidden/visually-hidden";
import { focusRing } from "@/styles/recipes/focus";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { extractMarginProps, type MarginProps } from "@/styles/props/spacing.stylex";
import { tokens } from "@/theme/tokens.stylex";
import { attrJoin } from "@/utils/attr-join";

export type NavListRootProps = Omit<
	ComponentProps<"nav">,
	"className" | "style" | keyof MarginProps
> &
	MarginProps &
	BaseStyleProps & {
		className?: string;
		children: ReactNode;
		size?: NavListSize;
		onNavigate?: (event: MouseEvent<HTMLElement>) => void;
	};

export type NavListSize = "sm" | "md";
export type NavListCurrent = "page" | "location";
export type NavListIndentLevel = 0 | 1;

export type NavListSectionProps = BaseStyleProps & {
	label: string;
	description?: string;
	endSlot?: ReactNode;
	visuallyHideLabel?: boolean;
	children: ReactNode;
	className?: string;
};

export type NavListItemProps = BaseStyleProps & {
	label: string;
	icon?: ReactNode;
	startSlot?: ReactNode;
	endSlot?: ReactNode;
	children?: ReactNode;
	badge?: ReactNode;
	href?: string;
	render?: useRender.RenderProp;
	current?: NavListCurrent | false;
	active?: boolean;
	indentLevel?: NavListIndentLevel;
	disabled?: boolean;
	tooltip?: string | false;
	"aria-label"?: string;
	onClick?: MouseEventHandler<HTMLElement>;
	className?: string;
};

type MouseEventHandler<T extends HTMLElement> = (event: MouseEvent<T>) => void;

type NavListContextValue = {
	size: NavListSize;
	onNavigate?: (event: MouseEvent<HTMLElement>) => void;
};

type Presentation = "expanded" | "icon";
type ScrollMode = "internal" | "external";

type PresentationContextValue = {
	presentation: Presentation;
	popoverSide: "left" | "right";
	scrollMode: ScrollMode;
	scrollRef?: RefObject<HTMLElement | null>;
};

const NavListContext = createContext<NavListContextValue | null>(null);
const NavListPresentationContext = createContext<PresentationContextValue>({
	presentation: "expanded",
	popoverSide: "right",
	scrollMode: "internal",
});
const ScrollContext = createContext<{ scrollRef: RefObject<HTMLElement | null> } | null>(null);

export function NavListPresentationProvider({
	children,
	presentation,
	popoverSide = "right",
	scrollMode = "internal",
	scrollRef,
}: {
	children: ReactNode;
	presentation: Presentation;
	popoverSide?: "left" | "right";
	scrollMode?: ScrollMode;
	scrollRef?: RefObject<HTMLElement | null>;
}) {
	const value = useMemo(
		() => ({ presentation, popoverSide, scrollMode, scrollRef }),
		[presentation, popoverSide, scrollMode, scrollRef],
	);

	return (
		<NavListPresentationContext.Provider value={value}>
			{children}
		</NavListPresentationContext.Provider>
	);
}

export function Root({
	ref,
	className,
	style,
	xstyle,
	children,
	size = "md",
	onNavigate,
	...props
}: NavListRootProps) {
	const localScrollRef = useRef<HTMLDivElement>(null);
	const {
		presentation,
		scrollMode,
		scrollRef: externalScrollRef,
	} = useContext(NavListPresentationContext);
	const context = useMemo(() => ({ size, onNavigate }), [onNavigate, size]);
	const scrollRef = externalScrollRef ?? localScrollRef;
	const scrollContext = useMemo(() => ({ scrollRef }), [scrollRef]);
	const { marginStyles, rest } = extractMarginProps(props);
	const sx = stylex.props(
		navListParts.root,
		scrollMode === "external" && navListParts.rootExternal,
		marginStyles,
		xstyle,
	);

	if (import.meta.env.DEV && props["aria-label"] == null && props["aria-labelledby"] == null) {
		console.error("NavList.Root requires aria-label or aria-labelledby.");
	}

	return (
		<NavListContext.Provider value={context}>
			<ScrollContext.Provider value={scrollContext}>
				<nav
					ref={ref}
					className={attrJoin(sx.className, className)}
					style={mergeStyle(sx.style, style)}
					data-presentation={presentation}
					data-scroll-mode={scrollMode}
					data-size={size}
					{...rest}
				>
					<div
						ref={localScrollRef}
						{...stylex.props(
							navListParts.scroller,
							scrollMode === "external" && navListParts.scrollerExternal,
						)}
					>
						{children}
					</div>
				</nav>
			</ScrollContext.Provider>
		</NavListContext.Provider>
	);
}

export function Section({
	label,
	description,
	endSlot,
	visuallyHideLabel = false,
	children,
	className,
	style,
	xstyle,
}: NavListSectionProps) {
	const headingId = useId();
	const { className: sxClassName, style: sxStyle } = stylex.props(navListParts.section, xstyle);
	const heading = (
		<div
			id={headingId}
			{...stylex.props(
				textStyles.body,
				typescaleStyles["1"],
				fontWeightStyles.medium,
				navListText.sectionLabel,
				navListParts.sectionLabel,
			)}
		>
			<span {...stylex.props(navListParts.sectionLabelText)}>{label}</span>
			{endSlot ? <span {...stylex.props(navListParts.sectionEndSlot)}>{endSlot}</span> : null}
			{description ? (
				<span
					{...stylex.props(
						textStyles.body,
						typescaleStyles["1"],
						navListText.description,
						navListParts.sectionDescription,
					)}
				>
					{description}
				</span>
			) : null}
		</div>
	);

	return (
		<section
			role="group"
			aria-labelledby={headingId}
			className={attrJoin(sxClassName, className)}
			style={mergeStyle(sxStyle, style)}
		>
			{visuallyHideLabel ? <VisuallyHidden id={headingId}>{label}</VisuallyHidden> : heading}
			<ul {...stylex.props(navListParts.list)}>{children}</ul>
		</section>
	);
}

export function Item({ ref, ...props }: NavListItemProps & { ref?: Ref<HTMLElement> }) {
	return <Row ref={ref} asListItem {...props} />;
}

type RowProps = NavListItemProps & {
	asListItem: boolean;
	collapseOpen?: boolean;
	disclosure?: "collapse" | "forward" | "back";
	forceButton?: boolean;
	dataNavListBack?: boolean;
	"aria-label"?: string;
	onDisclosureClick?: MouseEventHandler<HTMLElement>;
	suppressNavigate?: boolean;
	ref?: Ref<HTMLElement>;
};

function Row({
	ref,
	asListItem,
	label,
	icon,
	startSlot,
	endSlot,
	children,
	badge,
	collapseOpen,
	href,
	render,
	current,
	active,
	indentLevel = 0,
	disabled = false,
	tooltip,
	"aria-label": ariaLabel,
	onClick,
	disclosure,
	forceButton = false,
	dataNavListBack = false,
	onDisclosureClick,
	suppressNavigate = false,
	className,
	style,
	xstyle,
}: RowProps) {
	const navList = useContext(NavListContext);
	const { presentation, popoverSide } = useContext(NavListPresentationContext);
	const size = navList?.size ?? "md";
	const rowModel = resolveRowModel({
		ariaLabel,
		badge,
		endSlot,
		forceButton,
		href,
		icon,
		label,
		onClick,
		onDisclosureClick,
		presentation,
		startSlot,
		tooltip,
		disclosure,
	});
	const rowSx = rowStyles({
		active,
		collapseOpen,
		current,
		disabled,
		disclosure,
		size,
		rowModel,
		xstyle,
	});
	const content = (
		<RowContent
			collapseOpen={collapseOpen}
			disclosure={disclosure}
			label={label}
			rowModel={rowModel}
		>
			{children}
		</RowContent>
	);
	const row = useRender<{}, HTMLElement>({
		defaultTagName: rowModel.defaultTagName,
		ref,
		render,
		props: {
			...rowNativeProps({ disabled, href, render, rowModel }),
			...rowStateAttributes({ active, current, dataNavListBack, disabled, rowModel }),
			className: attrJoin(rowSx.className, className),
			style: mergeStyle(rowSx.style, style),
			onClick: createRowClickHandler({
				disabled,
				onClick,
				onDisclosureClick,
				onNavigate: navList?.onNavigate,
				rowModel,
				suppressNavigate,
			}),
			children: content,
		},
	});

	return (
		<RowPresentation
			asListItem={asListItem}
			indentLevel={indentLevel}
			label={label}
			popoverSide={popoverSide}
			row={row}
			rowModel={rowModel}
			tooltip={tooltip}
		/>
	);
}

function resolveRowModel({
	ariaLabel,
	badge,
	disclosure,
	endSlot,
	forceButton,
	href,
	icon,
	label,
	onClick,
	onDisclosureClick,
	presentation,
	startSlot,
	tooltip,
}: Pick<
	RowProps,
	| "badge"
	| "disclosure"
	| "endSlot"
	| "forceButton"
	| "href"
	| "icon"
	| "label"
	| "onClick"
	| "onDisclosureClick"
	| "startSlot"
	| "tooltip"
> & {
	ariaLabel: RowProps["aria-label"];
	presentation: Presentation;
}) {
	const isIconMode = presentation === "icon";
	const isLink = Boolean(href && !forceButton);
	const isAction = forceButton || Boolean(onClick || onDisclosureClick);

	return {
		backIcon: disclosure === "back",
		defaultTagName: defaultRowTagName(isLink, isAction),
		isAction,
		isIconMode,
		isLink,
		isStatic: !isLink && !isAction,
		resolvedAriaLabel: isIconMode ? (ariaLabel ?? label) : ariaLabel,
		resolvedEndSlot: endSlot ?? badge,
		showTooltip: isIconMode && (tooltip ?? label) !== false,
		visualIcon: icon || startSlot || <FileIcon weight="duotone" />,
	};
}

type ResolvedRowModel = ReturnType<typeof resolveRowModel>;

function defaultRowTagName(isLink: boolean, isAction: boolean): "a" | "button" | "div" {
	if (isLink) return "a";
	if (isAction) return "button";
	return "div";
}

function RowContent({
	collapseOpen,
	children,
	disclosure,
	label,
	rowModel,
}: Pick<RowProps, "collapseOpen" | "children" | "disclosure" | "label"> & {
	rowModel: ResolvedRowModel;
}) {
	const renderedIcon = <RowIcon backIcon={rowModel.backIcon}>{rowModel.visualIcon}</RowIcon>;
	if (rowModel.isIconMode) return renderedIcon;

	return (
		<>
			{renderedIcon}
			<span {...stylex.props(menuItemStyles.label, navListParts.labelCell)}>
				<span {...stylex.props(navListParts.labelText)}>{children ?? label}</span>
			</span>
			{rowModel.resolvedEndSlot ? (
				<span {...stylex.props(navListParts.endSlot)}>{rowModel.resolvedEndSlot}</span>
			) : null}
			{disclosure && disclosure !== "back" ? (
				<span
					aria-hidden
					{...stylex.props(
						navListParts.disclosureIcon,
						disclosure === "collapse" && navListParts.collapseIcon,
						disclosure === "collapse" && collapseOpen && navListParts.collapseIconOpen,
					)}
				>
					{disclosure === "collapse" ? <Collapsible.Icon /> : <ArrowRightIcon />}
				</span>
			) : null}
		</>
	);
}

function RowIcon({ backIcon, children }: { backIcon: boolean; children: ReactNode }) {
	return (
		<span aria-hidden {...stylex.props(navListParts.icon)}>
			{backIcon ? <ArrowLeftIcon /> : children}
		</span>
	);
}

function rowStyles({
	active,
	collapseOpen,
	current,
	disabled,
	disclosure,
	size,
	rowModel,
	xstyle,
}: Pick<RowProps, "active" | "collapseOpen" | "current" | "disabled" | "disclosure" | "xstyle"> & {
	size: NavListSize;
	rowModel: ResolvedRowModel;
}) {
	return stylex.props(
		menuItemStyles.item,
		menuItemSizeStyles[size],
		menuItemVariantStyles.default,
		focusRing.inset,
		navListParts.row,
		(current || active) && !disabled && navListParts.currentRow,
		disclosure === "collapse" && collapseOpen && !disabled && navListParts.collapsibleTriggerOpen,
		disclosure === "back" && navListParts.backRow,
		rowModel.isIconMode && navListParts.iconModeRow,
		xstyle,
	);
}

function rowNativeProps({
	disabled,
	href,
	render,
	rowModel,
}: Pick<RowProps, "disabled" | "href" | "render"> & { rowModel: ResolvedRowModel }) {
	const buttonType = "button";
	const disabledState = true;

	return {
		href: rowModel.isLink && !disabled ? href : undefined,
		type: rowModel.isAction && !href && !render ? buttonType : undefined,
		disabled: rowModel.isAction && !href && disabled ? disabledState : undefined,
	};
}

function rowStateAttributes({
	active,
	current,
	dataNavListBack,
	disabled,
	rowModel,
}: Pick<RowProps, "active" | "current" | "dataNavListBack" | "disabled"> & {
	rowModel: ResolvedRowModel;
}) {
	return {
		"aria-current": current || (active ? "page" : undefined),
		"aria-label": rowModel.resolvedAriaLabel,
		"aria-disabled": (rowModel.isStatic || rowModel.isLink) && disabled ? true : undefined,
		"data-current": current || active ? "" : undefined,
		"data-disabled": disabled ? "" : undefined,
		"data-icon-mode": rowModel.isIconMode ? "" : undefined,
		"data-nav-list-back": dataNavListBack ? "" : undefined,
	};
}

function createRowClickHandler({
	disabled,
	onClick,
	onDisclosureClick,
	onNavigate,
	rowModel,
	suppressNavigate,
}: Pick<RowProps, "disabled" | "onClick" | "onDisclosureClick" | "suppressNavigate"> & {
	onNavigate: NavListContextValue["onNavigate"];
	rowModel: ResolvedRowModel;
}) {
	if (rowModel.isStatic) return undefined;

	return (event: MouseEvent<HTMLElement>) => {
		if (disabled) {
			event.preventDefault();
			event.stopPropagation();
			return;
		}

		onClick?.(event);
		if (event.defaultPrevented) return;

		if (onDisclosureClick) {
			onDisclosureClick(event);
			return;
		}

		if (!suppressNavigate) onNavigate?.(event);
	};
}

function RowPresentation({
	asListItem,
	indentLevel,
	label,
	popoverSide,
	row,
	rowModel,
	tooltip,
}: Pick<RowProps, "asListItem" | "indentLevel" | "label" | "tooltip"> & {
	popoverSide: PresentationContextValue["popoverSide"];
	row: ReactElement;
	rowModel: ResolvedRowModel;
}) {
	const rowWithTooltip = rowModel.showTooltip ? (
		<Tooltip.Root>
			<Tooltip.Trigger render={row} />
			<Tooltip.Popup positionerProps={{ side: popoverSide }}>{tooltip ?? label}</Tooltip.Popup>
		</Tooltip.Root>
	) : (
		row
	);

	if (!asListItem) return rowWithTooltip;

	return (
		<li
			{...stylex.props(
				navListParts.listItem,
				!rowModel.isIconMode && indentLevel === 1 && navListParts.indentedListItem,
			)}
		>
			{rowWithTooltip}
		</li>
	);
}

export type CollapsibleGroupProps = BaseStyleProps & {
	children: ReactNode;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	className?: string;
};

type CollapsibleGroupContextValue = {
	open: boolean;
	popoverContent: ReactNode;
	setPopoverContent: (content: ReactNode) => void;
};

const CollapsibleGroupContext = createContext<CollapsibleGroupContextValue | null>(null);

export function CollapsibleGroup({
	ref,
	children,
	className,
	defaultOpen = false,
	onOpenChange,
	open,
	style,
	xstyle,
	...props
}: CollapsibleGroupProps & { ref?: Ref<HTMLLIElement> }) {
	const controlled = open !== undefined;
	const [internalOpen, setInternalOpen] = useState(defaultOpen);
	const resolvedOpen = open ?? internalOpen;
	const [popoverContent, setPopoverContent] = useState<ReactNode>(null);
	const context = useMemo(
		() => ({ open: resolvedOpen, popoverContent, setPopoverContent }),
		[popoverContent, resolvedOpen],
	);
	const { className: sxClassName, style: sxStyle } = stylex.props(
		navListParts.collapsibleGroup,
		xstyle,
	);

	return (
		<li ref={ref} className={attrJoin(sxClassName, className)} style={mergeStyle(sxStyle, style)}>
			<CollapsibleGroupContext.Provider value={context}>
				<BaseCollapsible.Root
					{...props}
					defaultOpen={controlled ? undefined : defaultOpen}
					onOpenChange={(nextOpen) => {
						if (!controlled) {
							setInternalOpen(nextOpen);
						}
						onOpenChange?.(nextOpen);
					}}
					open={open}
				>
					{children}
				</BaseCollapsible.Root>
			</CollapsibleGroupContext.Provider>
		</li>
	);
}

export type CollapsibleGroupTriggerProps = Omit<NavListItemProps, "current" | "href" | "render">;

export function CollapsibleGroupTrigger({
	label,
	icon,
	startSlot,
	endSlot,
	children,
	badge,
	disabled,
	tooltip,
	"aria-label": ariaLabel,
	onClick,
	className,
	style,
	xstyle,
}: CollapsibleGroupTriggerProps) {
	const { presentation, popoverSide } = useContext(NavListPresentationContext);
	const group = useContext(CollapsibleGroupContext);

	if (presentation === "icon") {
		return (
			<CollapsedChildrenPopover
				disabled={disabled}
				icon={icon}
				label={label}
				popoverSide={popoverSide}
				startSlot={startSlot}
				tooltip={tooltip}
				triggerClassName={className}
				triggerInlineStyle={style}
				triggerStyle={xstyle}
			>
				<ul {...stylex.props(navListParts.list)}>{group?.popoverContent}</ul>
			</CollapsedChildrenPopover>
		);
	}

	return (
		<Row
			asListItem={false}
			className={className}
			style={style}
			collapseOpen={group?.open}
			disclosure="collapse"
			disabled={disabled}
			aria-label={ariaLabel}
			badge={badge}
			endSlot={endSlot}
			forceButton
			icon={icon}
			label={label}
			onClick={onClick}
			render={<BaseCollapsible.Trigger />}
			xstyle={xstyle}
			suppressNavigate
			tooltip={tooltip}
		>
			{children}
		</Row>
	);
}

export type CollapsibleGroupPanelProps = BaseStyleProps & {
	children: ReactNode;
	keepMounted?: boolean;
	className?: string;
};

export function CollapsibleGroupPanel({
	ref,
	children,
	keepMounted = true,
	className,
	style,
	xstyle,
}: CollapsibleGroupPanelProps & { ref?: Ref<HTMLDivElement> }) {
	const group = useContext(CollapsibleGroupContext);
	useEffect(() => {
		group?.setPopoverContent(children);
	}, [children, group]);
	const { presentation } = useContext(NavListPresentationContext);

	if (presentation === "icon") {
		return null;
	}

	return (
		<BaseCollapsible.Panel
			ref={ref}
			keepMounted={keepMounted}
			render={(panelProps, state) => {
				const { hidden: _hidden, ...restPanelProps } = panelProps;
				const sx = stylex.props(navListParts.collapsiblePanel, xstyle);

				return (
					<ul
						{...restPanelProps}
						aria-hidden={state.open ? undefined : true}
						inert={state.open ? undefined : true}
						className={attrJoin(sx.className, className)}
						style={mergeStyle(sx.style, style)}
					>
						{children}
					</ul>
				);
			}}
		/>
	);
}

export type NavListDrilldownProps = {
	value?: string;
	defaultValue: string;
	onValueChange?: (value: string, details: { direction: "forward" | "back" }) => void;
	children: ReactNode;
};

export type NavListDrilldownPanelProps = {
	value: string;
	label: string;
	children: ReactNode;
};

export type NavListDrilldownTriggerProps = Omit<NavListItemProps, "current" | "href" | "render"> & {
	to: string;
};

export type NavListDrilldownBackProps = BaseStyleProps & {
	to: string;
	label?: string;
	className?: string;
};

type DrilldownPanelRecord = {
	label: string;
	node: ReactNode;
};

type DrilldownContextValue = {
	value: string;
	direction: "forward" | "back";
	hideBack?: boolean;
	panels: Map<string, DrilldownPanelRecord>;
	setValue: (value: string, direction: "forward" | "back", trigger?: HTMLElement | null) => void;
};

const DrilldownContext = createContext<DrilldownContextValue | null>(null);
const DrilldownPanelContext = createContext<string | null>(null);

export function Drilldown({ value, defaultValue, onValueChange, children }: NavListDrilldownProps) {
	const controlled = value !== undefined;
	const [internalValue, setInternalValue] = useState(defaultValue);
	const [direction, setDirection] = useState<"forward" | "back">("forward");
	const currentValue = value ?? internalValue;
	const scroll = useContext(ScrollContext);
	const drilldownRef = useRef<HTMLDivElement>(null);
	const scrollPositions = useRef(new Map<string, number>());
	const openerByPanel = useRef(new Map<string, HTMLElement>());
	const pendingNavigation = useRef<{
		direction: "forward" | "back";
		fromValue: string;
		value: string;
	} | null>(null);
	const panels = useMemo(() => collectPanels(children), [children]);

	if (import.meta.env.DEV && !panels.has(defaultValue)) {
		console.error(
			`NavList.Drilldown defaultValue "${defaultValue}" does not match a DrilldownPanel value.`,
		);
	}

	const setValue = useCallback(
		(nextValue: string, nextDirection: "forward" | "back", trigger?: HTMLElement | null) => {
			if (!panels.has(nextValue)) {
				if (import.meta.env.DEV) {
					console.error(`NavList.Drilldown could not find destination value "${nextValue}".`);
				}
				return;
			}

			if (scroll?.scrollRef.current) {
				scrollPositions.current.set(currentValue, scroll.scrollRef.current.scrollTop);
			}

			if (trigger && nextDirection === "forward") {
				openerByPanel.current.set(nextValue, trigger);
			}

			pendingNavigation.current = {
				direction: nextDirection,
				fromValue: currentValue,
				value: nextValue,
			};
			setDirection(nextDirection);
			if (!controlled) {
				setInternalValue(nextValue);
			}
			onValueChange?.(nextValue, { direction: nextDirection });
		},
		[controlled, currentValue, onValueChange, panels, scroll],
	);
	useEffect(() => {
		const pending = pendingNavigation.current;

		if (!pending || pending.value !== currentValue) {
			return;
		}

		pendingNavigation.current = null;
		const scroller = scroll?.scrollRef.current;
		if (scroller) {
			scroller.scrollTop = scrollPositions.current.get(currentValue) ?? 0;
		}

		requestAnimationFrame(() => {
			if (pending.direction === "forward") {
				drilldownRef.current
					?.querySelector<HTMLElement>("[data-active] [data-nav-list-back]")
					?.focus();
				return;
			}

			openerByPanel.current.get(pending.fromValue)?.focus();
		});
	}, [currentValue, scroll]);
	const context = useMemo(
		() => ({ value: currentValue, direction, panels, setValue }),
		[currentValue, direction, panels, setValue],
	);
	const panelEntries = Array.from(panels);
	const currentIndex = panelEntries.findIndex(([panelValue]) => panelValue === currentValue);

	return (
		<DrilldownContext.Provider value={context}>
			<div ref={drilldownRef} {...stylex.props(navListParts.drilldown)} data-direction={direction}>
				{panelEntries.map(([panelValue, panel], panelIndex) => {
					const active = panelValue === currentValue;
					const position = active ? "active" : panelIndex < currentIndex ? "before" : "after";

					return (
						<section
							key={panelValue}
							aria-hidden={active ? undefined : true}
							aria-label={panel.label}
							data-active={active ? "" : undefined}
							data-position={position}
							inert={active ? undefined : true}
							role="group"
							tabIndex={active ? -1 : undefined}
							{...stylex.props(navListParts.drilldownPanel)}
						>
							<DrilldownPanelContext.Provider value={panel.label}>
								{panel.node}
							</DrilldownPanelContext.Provider>
						</section>
					);
				})}
			</div>
		</DrilldownContext.Provider>
	);
}

export function DrilldownPanel({ children }: NavListDrilldownPanelProps) {
	return children;
}

export function DrilldownTrigger({
	to,
	label,
	icon,
	startSlot,
	endSlot,
	children,
	badge,
	disabled,
	tooltip,
	"aria-label": ariaLabel,
	onClick,
	className,
	style,
	xstyle,
}: NavListDrilldownTriggerProps) {
	const drilldown = useContext(DrilldownContext);
	const { presentation, popoverSide } = useContext(NavListPresentationContext);

	if (presentation === "icon" && drilldown) {
		return (
			<CollapsedDrilldownPopover
				disabled={disabled}
				icon={icon}
				label={label}
				popoverSide={popoverSide}
				startSlot={startSlot}
				targetValue={to}
				tooltip={tooltip}
				triggerClassName={className}
				triggerInlineStyle={style}
				triggerStyle={xstyle}
			/>
		);
	}

	return (
		<Row
			asListItem
			className={className}
			style={style}
			disclosure="forward"
			disabled={disabled}
			aria-label={ariaLabel}
			badge={badge}
			endSlot={endSlot}
			forceButton
			icon={icon}
			label={label}
			onClick={onClick}
			onDisclosureClick={(event) => drilldown?.setValue(to, "forward", event.currentTarget)}
			xstyle={xstyle}
			tooltip={tooltip}
		>
			{children}
		</Row>
	);
}

export function DrilldownBack({ to, label, className, style, xstyle }: NavListDrilldownBackProps) {
	const drilldown = useContext(DrilldownContext);
	const panelLabel = useContext(DrilldownPanelContext);
	const destinationLabel = drilldown?.panels.get(to)?.label;
	const visibleLabel = label ?? panelLabel ?? "Back";
	const accessibleLabelPrefix = label ?? "Back";
	const accessibleLabel = destinationLabel
		? `${accessibleLabelPrefix} to ${destinationLabel}`
		: accessibleLabelPrefix;

	if (drilldown?.hideBack) {
		return null;
	}

	return (
		<Row
			aria-label={accessibleLabel}
			asListItem={false}
			className={className}
			style={style}
			dataNavListBack
			disclosure="back"
			forceButton
			label={visibleLabel}
			onDisclosureClick={() => drilldown?.setValue(to, "back")}
			xstyle={[navListParts.backControl, xstyle]}
			tooltip={false}
		/>
	);
}

function collectPanels(children: ReactNode) {
	const panels = new Map<string, DrilldownPanelRecord>();

	for (const child of Array.isArray(children) ? children : [children]) {
		if (!isValidElement<NavListDrilldownPanelProps>(child)) {
			continue;
		}

		const { value, label, children: panelChildren } = child.props;
		if (value == null) {
			continue;
		}

		if (import.meta.env.DEV && panels.has(value)) {
			console.error(`NavList.Drilldown received duplicate panel value "${value}".`);
		}
		panels.set(value, { label, node: panelChildren });
	}

	return panels;
}

function CollapsedChildrenPopover({
	label,
	icon,
	startSlot,
	children,
	disabled,
	tooltip,
	popoverSide,
	triggerClassName,
	triggerInlineStyle,
	triggerStyle,
}: {
	label: string;
	icon?: ReactNode;
	startSlot?: ReactNode;
	children: ReactNode;
	disabled?: boolean;
	tooltip?: string | false;
	popoverSide: "left" | "right";
	triggerClassName?: string;
	triggerInlineStyle?: BaseStyleProps["style"];
	triggerStyle?: StyleXStyles;
}) {
	return (
		<Popover.Root>
			<Popover.Trigger
				disabled={disabled}
				render={
					<Row
						asListItem={false}
						className={triggerClassName}
						style={triggerInlineStyle}
						disclosure="forward"
						forceButton
						icon={icon}
						label={label}
						startSlot={startSlot}
						xstyle={triggerStyle}
						tooltip={tooltip}
					/>
				}
			/>
			<Popover.Popup
				positionerProps={{ side: popoverSide, align: "start" }}
				showClose={false}
				xstyle={navListParts.childPopover}
			>
				<NavListPresentationProvider presentation="expanded" popoverSide={popoverSide}>
					{children}
				</NavListPresentationProvider>
			</Popover.Popup>
		</Popover.Root>
	);
}

function CollapsedDrilldownPopover({
	label,
	icon,
	startSlot,
	disabled,
	tooltip,
	targetValue,
	popoverSide,
	triggerClassName,
	triggerInlineStyle,
	triggerStyle,
}: {
	label: string;
	icon?: ReactNode;
	startSlot?: ReactNode;
	disabled?: boolean;
	tooltip?: string | false;
	targetValue: string;
	popoverSide: "left" | "right";
	triggerClassName?: string;
	triggerInlineStyle?: BaseStyleProps["style"];
	triggerStyle?: StyleXStyles;
}) {
	const drilldown = useContext(DrilldownContext);
	const [open, setOpen] = useState(false);
	const [stack, setStack] = useState([targetValue]);
	const localValue = stack[stack.length - 1] ?? targetValue;
	const panel = drilldown?.panels.get(localValue);
	const localContext = useMemo<DrilldownContextValue | null>(() => {
		if (!drilldown) {
			return null;
		}

		return {
			...drilldown,
			hideBack: stack.length <= 1,
			value: localValue,
			setValue(nextValue, nextDirection) {
				if (!drilldown.panels.has(nextValue)) {
					if (import.meta.env.DEV) {
						console.error(`NavList.Drilldown could not find destination value "${nextValue}".`);
					}
					return;
				}

				if (nextDirection === "back") {
					if (stack.length <= 1) {
						setOpen(false);
						setStack([targetValue]);
					} else {
						setStack((currentStack) => currentStack.slice(0, -1));
					}
					return;
				}

				setStack((currentStack) => [...currentStack, nextValue]);
			},
		};
	}, [drilldown, localValue, stack.length, targetValue]);

	return (
		<Popover.Root
			open={open}
			onOpenChange={(nextOpen) => {
				setOpen(nextOpen);
				if (nextOpen) {
					setStack([targetValue]);
				}
			}}
		>
			<Popover.Trigger
				disabled={disabled}
				render={
					<Row
						asListItem={false}
						className={triggerClassName}
						style={triggerInlineStyle}
						disclosure="forward"
						forceButton
						icon={icon}
						label={label}
						startSlot={startSlot}
						xstyle={triggerStyle}
						tooltip={tooltip}
					/>
				}
			/>
			<Popover.Popup
				positionerProps={{ side: popoverSide, align: "start" }}
				showClose={false}
				xstyle={navListParts.childPopover}
			>
				{localContext && panel ? (
					<NavListPresentationContext.Provider
						value={{ presentation: "expanded", popoverSide, scrollMode: "internal" }}
					>
						<DrilldownContext.Provider value={localContext}>
							<div aria-label={panel.label} role="group">
								<DrilldownPanelContext.Provider value={panel.label}>
									{panel.node}
								</DrilldownPanelContext.Provider>
							</div>
						</DrilldownContext.Provider>
					</NavListPresentationContext.Provider>
				) : null}
			</Popover.Popup>
		</Popover.Root>
	);
}

const navListParts = stylex.create({
	root: {
		gap: tokens["--space-2"],
		blockSize: "100%",
		color: tokens["--fg"],
		display: "flex",
		flexDirection: "column",
		maxBlockSize: "100%",
		minHeight: 0,
		width: "100%",
	},
	rootExternal: {
		blockSize: "auto",
		minBlockSize: "100%",
	},
	scroller: {
		gap: tokens["--space-2"],
		overscrollBehavior: "contain",
		// paddingBlock: tokens["--space-1"],
		display: "flex",
		flexBasis: "auto",
		flexDirection: "column",
		flexGrow: "1",
		flexShrink: "1",
		minHeight: 0,
		overflowY: "auto",
	},
	scrollerExternal: {
		flexBasis: "auto",
		flexGrow: "1",
		flexShrink: "0",
		overflowY: "visible",
	},
	list: {
		margin: 0,
		padding: 0,
		gap: 1,
		listStyle: "none",
		display: "flex",
		flexDirection: "column",
	},
	listItem: {
		minWidth: 0,
	},
	indentedListItem: {
		borderInlineStartColor: tokens["--border"],
		borderInlineStartStyle: "solid",
		borderInlineStartWidth: tokens["--border-width"],
		boxSizing: "border-box",
		marginInlineStart: tokens["--space-4"],
		paddingInlineStart: tokens["--space-1-5"],
	},
	row: {
		[menuItemVars.columns]: `${tokens["--space-4"]} minmax(0, 1fr) auto`,
		[menuItemVars.columnGap]: tokens["--space-2"],
		[menuItemVars.paddingInlineEnd]: tokens["--space-2"],
		[menuItemVars.paddingInlineStart]: tokens["--space-2"],
		borderColor: "transparent",
		borderRadius: tokens["--radius-md"],
		borderStyle: "solid",
		borderWidth: "1px",
		backgroundColor: {
			"[data-current]": tokens["--surface-subtle"],
			default: "transparent",
			":hover": {
				[media.canHover]: tokens["--bg-highlight"],
			},
		},
		color: {
			"[data-current]": tokens["--fg"],
			"[data-disabled]": tokens["--fg-subtle"],
			default: tokens["--fg"],
			":hover": {
				[media.canHover]: tokens["--fg"],
			},
		},
		fontFamily: "inherit",
		textAlign: "start",
		height: tokens["--size-control-md"],
		width: "100%",
	},
	currentRow: {
		backgroundColor: tokens["--surface-subtle-active"],
		color: tokens["--fg"],
	},
	collapsibleTriggerOpen: {
		color: tokens["--fg"],
	},
	backRow: {
		color: {
			default: tokens["--fg-subtle"],
			":hover": tokens["--fg"],
		},
		marginBlockEnd: tokens["--space-1"],
	},
	iconModeRow: {
		[menuItemVars.columns]: "1fr",
		[menuItemVars.columnGap]: 0,
		[menuItemVars.minHeight]: tokens["--size-control-md"],
		[menuItemVars.paddingInlineEnd]: 0,
		[menuItemVars.paddingInlineStart]: 0,
		justifyContent: "center",
		minInlineSize: [menuItemVars.minHeight],
	},
	icon: {
		gridColumn: "1",
		alignItems: "center",
		color: "currentColor",
		display: "inline-flex",
		justifyContent: "center",
		justifySelf: "center",
		height: tokens["--space-4"],
		width: tokens["--space-4"],
	},
	labelCell: {
		overflow: "hidden",
		display: "flex",
		flexDirection: "column",
	},
	labelText: {
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
	},
	endSlot: {
		gridColumn: "3",
		color: tokens["--fg-muted"],
		display: "inline-flex",
		justifySelf: "end",
	},
	disclosureIcon: {
		gridColumn: "3",
		color: tokens["--fg-subtle"],
		display: "inline-flex",
		justifySelf: "end",
	},
	collapseIcon: {
		transform: {
			default: "rotate(0deg)",
		},
		transitionDuration: tokens["--motion-duration-short"],
		transitionProperty: "transform",
		transitionTimingFunction: tokens["--motion-ease-smooth-out"],
	},
	collapseIconOpen: {
		transform: "rotate(180deg)",
	},
	section: {
		gap: tokens["--space-1"],
		display: "flex",
		flexDirection: "column",
	},
	sectionLabel: {
		paddingInline: tokens["--space-3"],
		display: "grid",
		fontSize: tokens["--font-size-1"],
		fontWeight: tokens["--font-weight-regular"],
		gridTemplateColumns: "1fr auto",
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
		paddingBlockEnd: tokens["--space-1"],
		paddingBlockStart: tokens["--space-3"],
		rowGap: tokens["--space-0-5"],
	},
	sectionLabelText: {
		gridColumn: "1",
	},
	sectionDescription: {
		gridColumnEnd: "-1",
		gridColumnStart: "1",
	},
	sectionEndSlot: {
		gridColumn: "2",
		color: tokens["--fg-muted"],
	},
	collapsibleGroup: {
		gap: 1,
		display: "flex",
		flexDirection: "column",
	},
	collapsiblePanel: {
		margin: 0,
		gap: 1,
		listStyle: "none",
		marginBlock: {
			'[aria-hidden="true"]': 0,
			"[data-ending-style]": 0,
			"[data-starting-style]": 0,
			default: 2,
		},
		overflow: "hidden",
		borderInlineStartColor: tokens["--border"],
		borderInlineStartStyle: "solid",
		borderInlineStartWidth: tokens["--border-width"],
		boxSizing: "border-box",
		display: "flex",
		flexDirection: "column",
		marginInlineStart: tokens["--space-4"],
		paddingInlineEnd: tokens["--space-0"],
		paddingInlineStart: tokens["--space-1-5"],
		transitionDuration: tokens["--motion-duration-short"],
		transitionProperty: "height, padding",
		transitionTimingFunction: tokens["--motion-ease-out"],
		visibility: {
			'[aria-hidden="true"]': "hidden",
			default: "visible",
		},
		height: {
			'[aria-hidden="true"]': 0,
			"[data-ending-style]": 0,
			"[data-starting-style]": 0,
			default: "var(--collapsible-panel-height)",
		},
	},
	drilldown: {
		overflow: "hidden",
		display: "grid",
		position: "relative",
	},
	drilldownPanel: {
		gridColumnStart: "1",
		gridRowStart: "1",
		opacity: {
			'[aria-hidden="true"]': 0,
			default: 1,
		},
		pointerEvents: {
			'[aria-hidden="true"]': "none",
			default: "auto",
		},
		transform: {
			"[data-active]": "translateX(0)",
			'[data-position="after"]': {
				"[dir='rtl'] &": "translateX(-16px)",
				default: "translateX(16px)",
			},
			'[data-position="before"]': {
				"[dir='rtl'] &": "translateX(16px)",
				default: "translateX(-16px)",
			},
		},
		transitionDuration: tokens["--motion-duration-medium"],
		transitionProperty: "opacity, transform",
		transitionTimingFunction: tokens["--motion-ease-smooth-out"],
		minWidth: 0,
	},
	backControl: {
		paddingBlock: tokens["--space-1"],
		fontSize: tokens["--font-size-1"],
		fontWeight: tokens["--font-weight-regular"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
		marginBlockEnd: 1,
	},
	childPopover: {
		gap: tokens["--space-1"],
		paddingBlock: tokens["--space-1"],
		paddingInline: tokens["--space-1"],
		maxWidth: "min(10rem, calc(100vw - 2rem))",
		// minWidth: "8rem",
	},
});

const navListText = stylex.create({
	sectionLabel: {
		color: tokens["--fg-subtle"],
	},
	description: {
		color: tokens["--fg-muted"],
	},
});

export const NavList = {
	NavListPresentationProvider,
	Root,
	Section,
	Item,
	CollapsibleGroup,
	CollapsibleGroupTrigger,
	CollapsibleGroupPanel,
	Drilldown,
	DrilldownPanel,
	DrilldownTrigger,
	DrilldownBack,
} as const;
