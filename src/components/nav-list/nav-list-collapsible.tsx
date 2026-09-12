import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";
import * as stylex from "@stylexjs/stylex";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
	type Ref,
} from "react";
import { Popover } from "@/components/popover/popover";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { attrJoin } from "@/utils/attr-join";
import { NavListPresentationContext, NavListPresentationProvider } from "./nav-list-context";
import { Row, CollapsedPopoverTrigger, type PopoverTriggerProps } from "./nav-list-row";
import { navListParts } from "./nav-list.stylex";
import type { NavListItemProps } from "./nav-list.types";

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
	registerPanel: (content: ReactNode) => () => void;
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
	const [panel, setPanel] = useState<{ content: ReactNode } | null>(null);
	const registerPanel = useCallback((content: ReactNode) => {
		const registration = { content };
		setPanel(registration);
		return () => setPanel((current) => (current === registration ? null : current));
	}, []);
	const context = useMemo(
		() => ({ open: resolvedOpen, popoverContent: panel?.content, registerPanel }),
		[panel, resolvedOpen, registerPanel],
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

export function CollapsibleGroupTrigger(props: CollapsibleGroupTriggerProps) {
	const { presentation, popoverSide } = useContext(NavListPresentationContext);
	const group = useContext(CollapsibleGroupContext);
	if (presentation === "icon") {
		return (
			<CollapsedChildrenPopover triggerProps={props} popoverSide={popoverSide}>
				<ul {...stylex.props(navListParts.list)}>{group?.popoverContent}</ul>
			</CollapsedChildrenPopover>
		);
	}
	return (
		<Row
			{...props}
			asListItem={false}
			collapseOpen={group?.open}
			disclosure="collapse"
			forceButton
			render={<BaseCollapsible.Trigger />}
			suppressNavigate
		/>
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
	const registerPanel = useContext(CollapsibleGroupContext)?.registerPanel;
	useEffect(() => registerPanel?.(children), [children, registerPanel]);
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

function CollapsedChildrenPopover({
	triggerProps,
	children,
	popoverSide,
}: {
	triggerProps: PopoverTriggerProps;
	children: ReactNode;
	popoverSide: "left" | "right";
}) {
	return (
		<Popover.Root>
			<CollapsedPopoverTrigger {...triggerProps} />
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
