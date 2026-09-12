import * as stylex from "@stylexjs/stylex";
import {
	createContext,
	isValidElement,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
	type ReactNode,
} from "react";
import { Popover } from "@/components/popover/popover";
import type { BaseStyleProps } from "@/styles/props/base";
import {
	NavListPresentationContext,
	NavListPresentationProvider,
	ScrollContext,
} from "./nav-list-context";
import { Row, CollapsedPopoverTrigger, type PopoverTriggerProps } from "./nav-list-row";
import { navListParts } from "./nav-list.stylex";
import type { NavListItemProps } from "./nav-list.types";

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

export function DrilldownTrigger({ to, ...props }: NavListDrilldownTriggerProps) {
	const drilldown = useContext(DrilldownContext);
	const { presentation, popoverSide } = useContext(NavListPresentationContext);
	if (presentation === "icon" && drilldown) {
		return (
			<CollapsedDrilldownPopover triggerProps={props} popoverSide={popoverSide} targetValue={to} />
		);
	}
	return (
		<Row
			{...props}
			asListItem
			disclosure="forward"
			forceButton
			onDisclosureClick={(event) => drilldown?.setValue(to, "forward", event.currentTarget)}
		/>
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

function CollapsedDrilldownPopover({
	triggerProps,
	targetValue,
	popoverSide,
}: {
	triggerProps: PopoverTriggerProps;
	targetValue: string;
	popoverSide: "left" | "right";
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
			<CollapsedPopoverTrigger {...triggerProps} />
			<Popover.Popup
				positionerProps={{ side: popoverSide, align: "start" }}
				showClose={false}
				xstyle={navListParts.childPopover}
			>
				{localContext && panel ? (
					<NavListPresentationProvider presentation="expanded" popoverSide={popoverSide}>
						<DrilldownContext.Provider value={localContext}>
							<div aria-label={panel.label} role="group">
								<DrilldownPanelContext.Provider value={panel.label}>
									{panel.node}
								</DrilldownPanelContext.Provider>
							</div>
						</DrilldownContext.Provider>
					</NavListPresentationProvider>
				) : null}
			</Popover.Popup>
		</Popover.Root>
	);
}
