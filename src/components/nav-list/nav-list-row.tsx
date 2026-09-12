import { useRender } from "@base-ui/react/use-render";
import { ArrowLeftIcon, ArrowRightIcon, FileIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import { useContext, type MouseEvent, type ReactElement, type ReactNode, type Ref } from "react";
import { Collapsible } from "@/components/collapsible/collapsible";
import {
	menuItemSizeStyles,
	menuItemStyles,
	menuItemVariantStyles,
} from "@/components/menu/menu-item.stylex";
import { Popover } from "@/components/popover/popover";
import { Tooltip } from "@/components/tooltip/tooltip";
import { focusRing } from "@/styles/recipes/focus";
import { mergeStyle } from "@/styles/props/base";
import { attrJoin } from "@/utils/attr-join";
import {
	NavListContext,
	NavListPresentationContext,
	type NavListContextValue,
	type Presentation,
} from "./nav-list-context";
import { navListParts } from "./nav-list.stylex";
import type { NavListItemProps, NavListSize, MouseEventHandler } from "./nav-list.types";

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

export function Row({
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
	const { presentation } = useContext(NavListPresentationContext);
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
		showTooltip: isIconMode && !disclosure && (tooltip ?? label) !== false,
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
		"aria-disabled": disabled || undefined,
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

	return (event: MouseEvent<HTMLElement> & { preventBaseUIHandler?: () => void }) => {
		if (disabled) {
			event.preventDefault();
			event.preventBaseUIHandler?.();
			event.stopPropagation();
			return;
		}

		onClick?.(event);
		if (event.defaultPrevented) {
			event.preventBaseUIHandler?.();
			return;
		}

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
	row,
	rowModel,
	tooltip,
}: Pick<RowProps, "asListItem" | "indentLevel" | "label" | "tooltip"> & {
	row: ReactElement;
	rowModel: ResolvedRowModel;
}) {
	const rowWithTooltip = rowModel.showTooltip ? (
		<Tooltip.Trigger payload={tooltip ?? label} render={row} />
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

export type PopoverTriggerProps = Omit<NavListItemProps, "current" | "href" | "render">;

export function CollapsedPopoverTrigger(props: PopoverTriggerProps) {
	return (
		<Row
			{...props}
			asListItem={false}
			disclosure="forward"
			forceButton
			suppressNavigate
			render={<Popover.Trigger disabled={props.disabled} />}
		/>
	);
}
