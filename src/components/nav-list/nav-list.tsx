import * as stylex from "@stylexjs/stylex";
import { useContext, useId, useMemo, useRef } from "react";
import { typescaleStyles, textStyles, fontWeightStyles } from "@/components/text/text.stylex";
import { Tooltip } from "@/components/tooltip/tooltip";
import { VisuallyHidden } from "@/components/visually-hidden/visually-hidden";
import { mergeStyle } from "@/styles/props/base";
import { extractMarginProps } from "@/styles/props/spacing.stylex";
import { attrJoin } from "@/utils/attr-join";
import {
	NavListContext,
	NavListPresentationContext,
	NavListPresentationProvider,
	ScrollContext,
} from "./nav-list-context";
import {
	CollapsibleGroup,
	CollapsibleGroupTrigger,
	CollapsibleGroupPanel,
} from "./nav-list-collapsible";
import { Drilldown, DrilldownPanel, DrilldownTrigger, DrilldownBack } from "./nav-list-drilldown";
import { Item } from "./nav-list-row";
import { navListParts, navListText } from "./nav-list.stylex";
import type { NavListRootProps, NavListSectionProps } from "./nav-list.types";

export type {
	NavListRootProps,
	NavListSize,
	NavListCurrent,
	NavListIndentLevel,
	NavListSectionProps,
	NavListItemProps,
} from "./nav-list.types";

export type {
	CollapsibleGroupProps,
	CollapsibleGroupTriggerProps,
	CollapsibleGroupPanelProps,
} from "./nav-list-collapsible";
export type {
	NavListDrilldownProps,
	NavListDrilldownPanelProps,
	NavListDrilldownTriggerProps,
	NavListDrilldownBackProps,
} from "./nav-list-drilldown";
export {
	NavListPresentationProvider,
	Item,
	CollapsibleGroup,
	CollapsibleGroupTrigger,
	CollapsibleGroupPanel,
	Drilldown,
	DrilldownPanel,
	DrilldownTrigger,
	DrilldownBack,
};

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
		popoverSide,
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

	const navigation = (
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
	);

	return (
		<NavListContext.Provider value={context}>
			<ScrollContext.Provider value={scrollContext}>
				{presentation === "icon" ? (
					<Tooltip.Group positionerProps={{ side: popoverSide }}>{navigation}</Tooltip.Group>
				) : (
					navigation
				)}
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
