import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";
import { useRender } from "@base-ui/react/use-render";
import { Collapsible } from "@/components/collapsible/collapsible";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import {
	cloneElement,
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
	type CSSProperties,
	type MouseEvent,
	type ReactElement,
	type ReactNode,
	type Ref,
	type RefObject,
} from "react";
import {
	menuItemSizeStyles,
	menuItemStyles,
	menuItemVars,
	menuItemVariantStyles,
} from "@/components/menu/menu-item.stylex";
import { Popover } from "@/components/popover/popover";
import { typescaleStyles, textStyles, fontWeightStyles } from "@/components/text/text.stylex";
import { Tooltip } from "@/components/tooltip/tooltip";
import { VisuallyHidden } from "@/components/visually-hidden/visually-hidden";
import { focusRing } from "@/styles/recipes/focus";
import { tokens } from "@/theme/tokens.stylex";

type StyledProps<T> = Omit<T, "className" | "style"> & {
	className?: string;
	style?: StyleXStyles;
};

export type NavListSize = "sm" | "md";
export type NavListCurrent = "page" | "location";

export type NavListRootProps = StyledProps<ComponentProps<"nav">> & {
	children: ReactNode;
	size?: NavListSize;
	onNavigate?: (event: MouseEvent<HTMLElement>) => void;
};

export type NavListSectionProps = {
	label: string;
	description?: string;
	endSlot?: ReactNode;
	visuallyHideLabel?: boolean;
	children: ReactNode;
	className?: string;
	style?: StyleXStyles;
};

export type NavListItemProps = {
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
	disabled?: boolean;
	tooltip?: string | false;
	"aria-label"?: string;
	onClick?: MouseEventHandler<HTMLElement>;
	className?: string;
	style?: StyleXStyles;
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
const NavListDepthContext = createContext(0);

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

	return <NavListPresentationContext.Provider value={value}>{children}</NavListPresentationContext.Provider>;
}

export function Root({ ref, className, style, children, size = "md", onNavigate, ...props }: NavListRootProps) {
	const localScrollRef = useRef<HTMLDivElement>(null);
	const { presentation, scrollMode, scrollRef: externalScrollRef } = useContext(NavListPresentationContext);
	const context = useMemo(() => ({ size, onNavigate }), [onNavigate, size]);
	const scrollRef = externalScrollRef ?? localScrollRef;
	const scrollContext = useMemo(() => ({ scrollRef }), [scrollRef]);
	const { className: sxClassName, style: sxStyle } = stylex.props(
		navListParts.root,
		scrollMode === "external" && navListParts.rootExternal,
		style,
	);

	if (import.meta.env.DEV && props["aria-label"] == null && props["aria-labelledby"] == null) {
		console.error("NavList.Root requires aria-label or aria-labelledby.");
	}

	return (
		<NavListContext.Provider value={context}>
			<ScrollContext.Provider value={scrollContext}>
				<nav
					ref={ref}
					className={[sxClassName, className].filter(Boolean).join(" ")}
					style={sxStyle}
					data-presentation={presentation}
					data-scroll-mode={scrollMode}
					data-size={size}
					{...props}>
					<div
						ref={localScrollRef}
						{...stylex.props(navListParts.scroller, scrollMode === "external" && navListParts.scrollerExternal)}>
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
}: NavListSectionProps) {
	const headingId = useId();
	const { className: sxClassName, style: sxStyle } = stylex.props(navListParts.section, style);
	const heading = (
		<div
			id={headingId}
			{...stylex.props(
				textStyles.body,
				typescaleStyles["1"],
				fontWeightStyles.medium,
				navListText.sectionLabel,
				navListParts.sectionLabel,
			)}>
			<span {...stylex.props(navListParts.sectionLabelText)}>{label}</span>
			{endSlot ? <span {...stylex.props(navListParts.sectionEndSlot)}>{endSlot}</span> : null}
			{description ? (
				<span
					{...stylex.props(
						textStyles.body,
						typescaleStyles["1"],
						navListText.description,
						navListParts.sectionDescription,
					)}>
					{description}
				</span>
			) : null}
		</div>
	);

	return (
		<section
			role="group"
			aria-labelledby={headingId}
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}>
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
}: RowProps) {
	const navList = useContext(NavListContext);
	const { presentation, popoverSide } = useContext(NavListPresentationContext);
	const depth = useContext(NavListDepthContext);
	const size = navList?.size ?? "md";
	const isIconMode = presentation === "icon";
	const showTooltip = isIconMode && (tooltip ?? label) !== false;
	const visualIcon = icon ?? startSlot;
	const backIcon = disclosure === "back";
	const hasLeadingVisual = backIcon || (visualIcon !== null && visualIcon !== undefined && visualIcon !== false);
	const isTextRow = !isIconMode && !hasLeadingVisual;
	const isNestedTextRow = isTextRow && depth > 0;
	const resolvedEndSlot = endSlot ?? badge;
	const resolvedAriaLabel = isIconMode ? (ariaLabel ?? label) : ariaLabel;
	const isLink = Boolean(href && !forceButton);
	const isAction = forceButton || Boolean(onClick || onDisclosureClick);
	const isStatic = !isLink && !isAction;
	const renderedIcon = backIcon ? (
		<span aria-hidden {...stylex.props(navListParts.icon)}>
			<ArrowLeftIcon />
		</span>
	) : visualIcon ? (
		<span aria-hidden {...stylex.props(navListParts.icon)}>
			{visualIcon}
		</span>
	) : isTextRow ? null : (
		<span aria-hidden {...stylex.props(navListParts.iconPlaceholder)} />
	);
	const content = isIconMode ? (
		renderedIcon
	) : (
		<>
			{renderedIcon}
			<span {...stylex.props(menuItemStyles.label, navListParts.labelCell, isTextRow && navListParts.textRowLabelCell)}>
				<span {...stylex.props(navListParts.labelText)}>{children ?? label}</span>
			</span>
			{resolvedEndSlot ? (
				<span {...stylex.props(navListParts.endSlot, isTextRow && navListParts.textRowEndSlot)}>{resolvedEndSlot}</span>
			) : null}
			{disclosure && disclosure !== "back" ? (
				<span
					aria-hidden
					{...stylex.props(
						navListParts.disclosureIcon,
						isTextRow && navListParts.textRowDisclosureIcon,
						disclosure === "collapse" && navListParts.collapseIcon,
						disclosure === "collapse" && collapseOpen && navListParts.collapseIconOpen,
					)}>
					{disclosure === "collapse" ? <Collapsible.Icon /> : <ArrowRightIcon />}
				</span>
			) : null}
		</>
	);
	const row = useRender<{}, HTMLElement>({
		defaultTagName: isLink ? "a" : isAction ? "button" : "div",
		ref,
		render,
		props: {
			href: isLink && !disabled ? href : undefined,
			type: isAction && !href && !render ? "button" : undefined,
			disabled: isAction && !href && disabled ? true : undefined,
			"aria-current": current || (active ? "page" : undefined),
			"aria-label": resolvedAriaLabel,
			"aria-disabled": (isStatic || isLink) && disabled ? true : undefined,
			"data-current": current || active ? "" : undefined,
			"data-disabled": disabled ? "" : undefined,
			"data-icon-mode": isIconMode ? "" : undefined,
			"data-nav-list-back": dataNavListBack ? "" : undefined,
			className,
			style,
			onClick: isStatic
				? undefined
				: (event: MouseEvent<HTMLElement>) => {
						if (disabled) {
							event.preventDefault();
							event.stopPropagation();
							return;
						}

						onClick?.(event);
						if (event.defaultPrevented) {
							return;
						}

						if (onDisclosureClick) {
							onDisclosureClick(event);
							return;
						}

						if (suppressNavigate) {
							return;
						}

						navList?.onNavigate?.(event);
					},
			children: content,
		},
	});
	const rowElement = cloneRowWithStyles(row as ReactElement<Record<string, unknown>>, [
		menuItemStyles.item,
		menuItemSizeStyles[size],
		menuItemVariantStyles.default,
		focusRing.inset,
		navListParts.row,
		(current || active) && !disabled && navListParts.currentRow,
		disclosure === "collapse" && collapseOpen && !disabled && navListParts.collapsibleTriggerOpen,
		disclosure === "back" && navListParts.backRow,
		isTextRow && navListParts.textRow,
		isNestedTextRow && navListParts.nestedItemRow,
		isIconMode && navListParts.iconModeRow,
		style,
	]);
	const rowWithTooltip = showTooltip ? (
		<Tooltip.Root>
			<Tooltip.Trigger render={rowElement} />
			<Tooltip.Popup positionerProps={{ side: popoverSide }}>{tooltip ?? label}</Tooltip.Popup>
		</Tooltip.Root>
	) : (
		rowElement
	);

	if (!asListItem) {
		return rowWithTooltip;
	}

	return <li {...stylex.props(navListParts.listItem)}>{rowWithTooltip}</li>;
}

function cloneRowWithStyles(element: ReactElement<Record<string, unknown>>, styles: Array<unknown>) {
	const sx = (stylex.props as (...args: Array<unknown>) => { className?: string; style?: CSSProperties })(...styles);
	return cloneElement(element, {
		className: [sx.className, element.props.className].filter(Boolean).join(" "),
		style: sx.style,
	});
}

export type CollapsibleGroupProps = {
	children: ReactNode;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	className?: string;
	style?: StyleXStyles;
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
	const { className: sxClassName, style: sxStyle } = stylex.props(navListParts.collapsibleGroup, style);

	return (
		<li ref={ref} className={[sxClassName, className].filter(Boolean).join(" ")} style={sxStyle}>
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
					open={open}>
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
				triggerStyle={style}>
				<ul {...stylex.props(navListParts.list)}>{group?.popoverContent}</ul>
			</CollapsedChildrenPopover>
		);
	}

	return (
		<Row
			asListItem={false}
			className={className}
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
			style={style}
			suppressNavigate
			tooltip={tooltip}>
			{children}
		</Row>
	);
}

export type CollapsibleGroupPanelProps = {
	children: ReactNode;
	keepMounted?: boolean;
	className?: string;
	style?: StyleXStyles;
};

export function CollapsibleGroupPanel({
	ref,
	children,
	keepMounted = true,
	className,
	style,
}: CollapsibleGroupPanelProps & { ref?: Ref<HTMLDivElement> }) {
	const group = useContext(CollapsibleGroupContext);
	useEffect(() => {
		group?.setPopoverContent(children);
	}, [children, group]);
	const { presentation } = useContext(NavListPresentationContext);
	const depth = useContext(NavListDepthContext);

	if (presentation === "icon") {
		return null;
	}

	return (
		<BaseCollapsible.Panel
			ref={ref}
			keepMounted={keepMounted}
			render={(panelProps, state) => {
				const { hidden: _hidden, ...restPanelProps } = panelProps;
				const sx = stylex.props(navListParts.collapsiblePanel, style);

				return (
					<ul
						{...restPanelProps}
						aria-hidden={state.open ? undefined : true}
						inert={state.open ? undefined : true}
						className={[sx.className, className].filter(Boolean).join(" ")}
						style={sx.style}>
						<NavListDepthContext.Provider value={depth + 1}>{children}</NavListDepthContext.Provider>
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

export type NavListDrilldownBackProps = {
	to: string;
	label?: string;
	className?: string;
	style?: StyleXStyles;
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
		console.error(`NavList.Drilldown defaultValue "${defaultValue}" does not match a DrilldownPanel value.`);
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
				drilldownRef.current?.querySelector<HTMLElement>("[data-active] [data-nav-list-back]")?.focus();
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
							{...stylex.props(navListParts.drilldownPanel)}>
							{panel.node}
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
				triggerStyle={style}
			/>
		);
	}

	return (
		<Row
			asListItem
			className={className}
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
			style={style}
			tooltip={tooltip}>
			{children}
		</Row>
	);
}

export function DrilldownBack({ to, label, className, style }: NavListDrilldownBackProps) {
	const drilldown = useContext(DrilldownContext);
	const destinationLabel = drilldown?.panels.get(to)?.label;
	const visibleLabel = label ?? drilldown?.panels.get(drilldown.value)?.label ?? "Back";
	const accessibleLabelPrefix = label ?? "Back";
	const accessibleLabel = destinationLabel ? `${accessibleLabelPrefix} to ${destinationLabel}` : accessibleLabelPrefix;

	if (drilldown?.hideBack) {
		return null;
	}

	return (
		<Row
			aria-label={accessibleLabel}
			asListItem={false}
			className={className}
			dataNavListBack
			disclosure="back"
			forceButton
			label={visibleLabel}
			onDisclosureClick={() => drilldown?.setValue(to, "back")}
			style={[navListParts.backControl, style]}
			tooltip={false}
		/>
	);
}

function collectPanels(children: ReactNode) {
	const panels = new Map<string, DrilldownPanelRecord>();

	for (const child of ChildrenToArray(children)) {
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

function ChildrenToArray(children: ReactNode) {
	return Array.isArray(children) ? children : [children];
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
						disclosure="forward"
						forceButton
						icon={icon}
						label={label}
						startSlot={startSlot}
						style={triggerStyle}
						tooltip={tooltip}
					/>
				}
			/>
			<Popover.Popup
				positionerProps={{ side: popoverSide, align: "start", sideOffset: -8 }}
				showClose={false}
				style={navListParts.childPopover}>
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
					setStack((currentStack) => {
						if (currentStack.length <= 1) {
							setOpen(false);
							return [targetValue];
						}

						return currentStack.slice(0, -1);
					});
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
			}}>
			<Popover.Trigger
				disabled={disabled}
				render={
					<Row
						asListItem={false}
						className={triggerClassName}
						disclosure="forward"
						forceButton
						icon={icon}
						label={label}
						startSlot={startSlot}
						style={triggerStyle}
						tooltip={tooltip}
					/>
				}
			/>
			<Popover.Popup
				positionerProps={{ side: popoverSide, align: "start" }}
				showClose={false}
				style={navListParts.childPopover}>
				{localContext && panel ? (
					<NavListPresentationContext.Provider
						value={{ presentation: "expanded", popoverSide, scrollMode: "internal" }}>
						<DrilldownContext.Provider value={localContext}>
							<div aria-label={panel.label} role="group">
								{panel.node}
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
		flex: "1 1 auto",
		gap: tokens["--space-2"],
		overscrollBehavior: "contain",
		paddingBlock: tokens["--space-1"],
		display: "flex",
		flexDirection: "column",
		minHeight: 0,
		overflowY: "auto",
	},
	scrollerExternal: {
		flex: "1 0 auto",
		overflowY: "visible",
	},
	list: {
		margin: 0,
		padding: 0,
		gap: 0,
		listStyle: "none",
		display: "flex",
		flexDirection: "column",
	},
	listItem: {
		minWidth: 0,
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
				"@media (hover: hover) and (pointer: fine)": tokens["--bg-highlight"],
			},
		},
		color: {
			"[data-current]": tokens["--fg"],
			"[data-disabled]": tokens["--fg-subtle"],
			default: tokens["--fg"],
			":hover": {
				"@media (hover: hover) and (pointer: fine)": tokens["--fg"],
			},
		},
		fontFamily: "inherit",
		textAlign: "start",
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
		color: tokens["--fg-subtle"],
		marginBlockEnd: tokens["--space-1"],
		// fontSize: tokens["--font-size-1"],
		// lineHeight: tokens["--line-height-1"],
		// letterSpacing: tokens["--letter-spacing-1"],
	},
	iconModeRow: {
		[menuItemVars.columns]: "1fr",
		[menuItemVars.columnGap]: 0,
		[menuItemVars.minHeight]: tokens["--size-control-lg"],
		[menuItemVars.paddingInlineEnd]: 0,
		[menuItemVars.paddingInlineStart]: 0,
		justifyContent: "center",
		minInlineSize: tokens["--size-control-lg"],
	},
	textRow: {
		[menuItemVars.columns]: "minmax(0, 1fr) auto",
	},
	nestedItemRow: {
		[menuItemVars.paddingInlineStart]: tokens["--space-2"],
		marginInlineStart: `calc(${tokens["--space-1-5"]} * -1)`,
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
		// marginInlineStart: `calc(${tokens["--space-1-5"]} * -1)`,
	},
	iconPlaceholder: {
		gridColumn: "1",
		display: "inline-flex",
		justifySelf: "center",
		height: tokens["--space-4"],
		width: tokens["--space-4"],
	},
	labelCell: {
		overflow: "hidden",
		display: "flex",
		flexDirection: "column",
	},
	textRowLabelCell: {
		gridColumn: "1",
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
	textRowEndSlot: {
		gridColumn: "2",
	},
	disclosureIcon: {
		gridColumn: "3",
		color: tokens["--fg-subtle"],
		display: "inline-flex",
		justifySelf: "end",
	},
	textRowDisclosureIcon: {
		gridColumn: "2",
	},
	collapseIcon: {
		transform: {
			default: "rotate(0deg)",
		},
		transitionDuration: {
			default: tokens["--motion-duration-short"],
			"@media (prefers-reduced-motion: reduce)": "0ms",
		},
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
		paddingBlock: tokens["--space-1"],
		paddingInline: tokens["--space-3"],
		display: "grid",
		fontSize: tokens["--font-size-1"],
		fontWeight: tokens["--font-weight-regular"],
		gridTemplateColumns: "1fr auto",
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
		rowGap: tokens["--space-0-5"],
	},
	sectionLabelText: {
		gridColumn: "1",
	},
	sectionDescription: {
		gridColumn: "1 / -1",
	},
	sectionEndSlot: {
		gridColumn: "2",
		color: tokens["--fg-muted"],
	},
	collapsibleGroup: {
		display: "flex",
		flexDirection: "column",
	},
	collapsiblePanel: {
		margin: 0,
		gap: 0,
		listStyle: "none",
		overflow: "hidden",
		paddingBlock: {
			'[aria-hidden="true"]': 0,
			"[data-ending-style]": 0,
			"[data-starting-style]": 0,
			default: tokens["--space-1"],
		},
		borderInlineStartColor: tokens["--border"],
		borderInlineStartStyle: "solid",
		borderInlineStartWidth: tokens["--border-width"],
		boxSizing: "border-box",
		display: "flex",
		flexDirection: "column",
		marginInlineStart: tokens["--space-4"],
		paddingInlineEnd: tokens["--space-1"],
		paddingInlineStart: tokens["--space-3"],
		transitionDuration: {
			default: tokens["--motion-duration-short"],
			"@media (prefers-reduced-motion: reduce)": "0ms",
		},
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
		gridArea: "1 / 1",
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
		transitionDuration: {
			default: tokens["--motion-duration-medium"],
			"@media (prefers-reduced-motion: reduce)": "0ms",
		},
		transitionProperty: "opacity, transform",
		transitionTimingFunction: tokens["--motion-ease-smooth-out"],
		minWidth: 0,
	},
	backControl: {
		marginBlockEnd: tokens["--space-1"],
	},
	childPopover: {
		gap: tokens["--space-1"],
		paddingBlock: tokens["--space-1"],
		paddingInline: tokens["--space-1"],
		inlineSize: "min(16rem, calc(100vw - 2rem))",
		minWidth: "12rem",
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
