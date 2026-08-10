import { Menu as BaseMenu } from "@base-ui/react/menu";
import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";
import { CaretDownIcon } from "@phosphor-icons/react/dist/csr/CaretDown";
import { CaretRightIcon } from "@phosphor-icons/react/dist/csr/CaretRight";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { createContext, useContext, type ReactNode } from "react";
import { fontFamilyStyles, textStyles, fontWeightStyles } from "@/components/text/text.stylex";
import { tokens } from "@/theme/tokens.stylex";
import { popupMotionStyles, popupPositionerStyles, popupViewportStyles } from "@/components/popover/popover.stylex";
import { popupVars } from "@/components/popover/popover-vars.stylex";

import { Icon } from "@/components/icons";
import { menuItemSizeStyles, menuItemStyles, menuItemVariantStyles } from "./menu-item.stylex";
import type { MenuItemSize, MenuItemVariant } from "./menu.types";

const MenuSizeContext = createContext<MenuItemSize>("md");

type StyledProps<T> = Omit<T, "className" | "style"> & {
	className?: string;
	style?: StyleXStyles;
};

export type { MenuItemSize, MenuItemVariant } from "./menu.types";
export type MenuRootProps<Payload = unknown> = Omit<BaseMenu.Root.Props<Payload>, "size"> & {
	size?: MenuItemSize;
};
export type MenuPositionerProps = StyledProps<BaseMenu.Positioner.Props>;
export type MenuViewportProps = StyledProps<BaseMenu.Viewport.Props>;
export type MenuPopupProps = StyledProps<BaseMenu.Popup.Props> & {
	portalProps?: Omit<BaseMenu.Portal.Props, "children">;
	positionerProps?: MenuPositionerProps;
};

export type MenuItemProps = StyledProps<BaseMenu.Item.Props> & {
	variant?: MenuItemVariant;
};
export type CollapsibleGroupProps = StyledProps<BaseCollapsible.Root.Props>;
export type CollapsibleGroupTriggerProps = Omit<MenuItemProps, "closeOnClick" | "nativeButton" | "render" | "variant">;
export type CollapsibleGroupPanelProps = StyledProps<BaseCollapsible.Panel.Props>;

export function Root<Payload = unknown>({ children, size = "md", ...props }: MenuRootProps<Payload>) {
	return (
		<MenuSizeContext.Provider value={size}>
			<BaseMenu.Root {...props}>{children}</BaseMenu.Root>
		</MenuSizeContext.Provider>
	);
}

function useMenuItemSizeStyle() {
	return menuItemSizeStyles[useContext(MenuSizeContext)];
}

function Positioner({
	ref,
	align = "center",
	alignOffset,
	className,
	style,
	sideOffset = 6,
	...props
}: MenuPositionerProps) {
	const defaultAlignOffset = align === "center" ? undefined : -2;
	const { className: sxClassName, style: sxStyle } = stylex.props(popupPositionerStyles, style);

	return (
		<BaseMenu.Positioner
			ref={ref}
			align={align}
			alignOffset={alignOffset ?? defaultAlignOffset}
			sideOffset={sideOffset}
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}
			{...props}
		/>
	);
}

export function Popup({ ref, children, className, portalProps, positionerProps, style, ...props }: MenuPopupProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(
		menuParts.panelSurface,
		menuParts.popup,
		popupMotionStyles.anchoredPopup,
		style,
	);

	return (
		<BaseMenu.Portal {...portalProps}>
			<Positioner {...positionerProps}>
				<BaseMenu.Popup
					ref={ref}
					className={[sxClassName, className].filter(Boolean).join(" ")}
					style={sxStyle}
					{...props}>
					{children}
				</BaseMenu.Popup>
			</Positioner>
		</BaseMenu.Portal>
	);
}

export function Viewport({ ref, className, style, ...props }: MenuViewportProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(menuParts.viewport, popupViewportStyles, style);

	return (
		<BaseMenu.Viewport
			ref={ref}
			className={[sxClassName, "xyz-popup-viewport", className].filter(Boolean).join(" ")}
			style={sxStyle}
			{...props}
		/>
	);
}

export function Item({ ref, className, style, variant = "default", ...props }: MenuItemProps) {
	const sizeStyle = useMenuItemSizeStyle();
	const { className: sxClassName, style: sxStyle } = stylex.props(
		menuItemStyles.item,
		sizeStyle,
		menuItemVariantStyles[variant],
		style,
	);

	return (
		<BaseMenu.Item
			ref={ref}
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}
			{...props}
		/>
	);
}

export function LinkItem({ ref, className, style, ...props }: StyledProps<BaseMenu.LinkItem.Props>) {
	const sizeStyle = useMenuItemSizeStyle();
	const { className: sxClassName, style: sxStyle } = stylex.props(
		menuItemStyles.item,
		sizeStyle,
		menuItemVariantStyles.default,
		style,
	);

	return (
		<BaseMenu.LinkItem
			ref={ref}
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}
			{...props}
		/>
	);
}

export function CheckboxItem({ ref, children, className, style, ...props }: StyledProps<BaseMenu.CheckboxItem.Props>) {
	const sizeStyle = useMenuItemSizeStyle();
	const { className: sxClassName, style: sxStyle } = stylex.props(
		menuItemStyles.item,
		sizeStyle,
		menuItemVariantStyles.default,
		style,
	);

	return (
		<BaseMenu.CheckboxItem
			ref={ref}
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}
			{...props}>
			<BaseMenu.CheckboxItemIndicator keepMounted {...stylex.props(menuItemStyles.indicator)}>
				<Icon.Checkmark width="1em" height="1em" />
			</BaseMenu.CheckboxItemIndicator>
			{children}
		</BaseMenu.CheckboxItem>
	);
}

export function SwitchItem({ ref, children, className, style, ...props }: StyledProps<BaseMenu.CheckboxItem.Props>) {
	const sizeStyle = useMenuItemSizeStyle();
	const { className: sxClassName, style: sxStyle } = stylex.props(
		menuItemStyles.item,
		sizeStyle,
		menuItemVariantStyles.default,
		style,
	);

	return (
		<BaseMenu.CheckboxItem
			ref={ref}
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}
			{...props}>
			<BaseMenu.CheckboxItemIndicator
				keepMounted
				{...stylex.props(menuParts.switchIndicator)}
				render={(indicatorProps, state) => (
					<span {...indicatorProps}>
						<span data-checked={state.checked ? "" : undefined} {...stylex.props(menuParts.switchThumb)} />
					</span>
				)}
			/>
			{children}
		</BaseMenu.CheckboxItem>
	);
}

export function RadioItem({ ref, children, className, style, ...props }: StyledProps<BaseMenu.RadioItem.Props>) {
	const sizeStyle = useMenuItemSizeStyle();
	const { className: sxClassName, style: sxStyle } = stylex.props(
		menuItemStyles.item,
		sizeStyle,
		menuItemVariantStyles.default,
		style,
	);

	return (
		<BaseMenu.RadioItem
			ref={ref}
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}
			{...props}>
			<BaseMenu.RadioItemIndicator keepMounted {...stylex.props(menuItemStyles.indicator)}>
				<span {...stylex.props(menuParts.indicatorDot)} />
			</BaseMenu.RadioItemIndicator>
			{children}
		</BaseMenu.RadioItem>
	);
}

export function SubmenuTrigger({
	ref,
	children,
	className,
	style,
	...props
}: StyledProps<BaseMenu.SubmenuTrigger.Props>) {
	const sizeStyle = useMenuItemSizeStyle();
	const { className: sxClassName, style: sxStyle } = stylex.props(
		menuItemStyles.item,
		sizeStyle,
		menuItemVariantStyles.default,
		menuParts.submenuTrigger,
		style,
	);

	return (
		<BaseMenu.SubmenuTrigger
			ref={ref}
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}
			{...props}>
			{children}
			<CaretRightIcon aria-hidden size="1em" weight="bold" {...stylex.props(menuParts.submenuIcon)} />
		</BaseMenu.SubmenuTrigger>
	);
}

export function CollapsibleGroup({ ref, className, style, ...props }: CollapsibleGroupProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(menuParts.collapsibleGroup, style);

	return (
		<BaseCollapsible.Root
			ref={ref}
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}
			{...props}
		/>
	);
}

export function CollapsibleGroupTrigger({ ref, children, className, style, ...props }: CollapsibleGroupTriggerProps) {
	const sizeStyle = useMenuItemSizeStyle();
	const { className: sxClassName, style: sxStyle } = stylex.props(
		menuItemStyles.item,
		sizeStyle,
		menuItemVariantStyles.default,
		menuParts.collapsibleGroupTrigger,
		stylex.defaultMarker(),
		style,
	);

	return (
		<BaseMenu.Item
			ref={ref}
			render={<BaseCollapsible.Trigger />}
			closeOnClick={false}
			nativeButton
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}
			{...props}>
			{children}
			<CaretDownIcon
				aria-hidden
				size="1em"
				weight="bold"
				{...stylex.props(menuParts.submenuIcon, menuParts.collapsibleGroupIcon)}
			/>
		</BaseMenu.Item>
	);
}

export function CollapsibleGroupPanel({
	ref,
	className,
	style,
	keepMounted = true,
	render,
	...props
}: CollapsibleGroupPanelProps) {
	const panelRender =
		render ??
		((panelProps, state) => {
			const { hidden: _hidden, ...groupProps } = panelProps;

			return (
				<BaseMenu.Group
					{...groupProps}
					aria-hidden={state.open ? undefined : true}
					inert={state.open ? undefined : true}
				/>
			);
		});
	const { className: sxClassName, style: sxStyle } = stylex.props(menuParts.collapsibleGroupPanel, style);

	return (
		<BaseCollapsible.Panel
			ref={ref}
			keepMounted={keepMounted}
			render={panelRender}
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}
			{...props}
		/>
	);
}

export function GroupLabel({ ref, className, style, ...props }: StyledProps<BaseMenu.GroupLabel.Props>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(menuText.groupLabel, menuParts.groupLabel, style);

	return (
		<BaseMenu.GroupLabel
			ref={ref}
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}
			{...props}
		/>
	);
}

export function Separator({ ref, className, style, ...props }: StyledProps<BaseMenu.Separator.Props>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(menuParts.separator, style);

	return (
		<BaseMenu.Separator
			ref={ref}
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}
			{...props}
		/>
	);
}

export function ItemLabel({ children }: { children: ReactNode }) {
	return <span {...stylex.props(menuItemStyles.label)}>{children}</span>;
}

export function ItemIcon({ children }: { children: ReactNode }) {
	return (
		<span aria-hidden {...stylex.props(menuParts.itemIcon)}>
			{children}
		</span>
	);
}

export function ItemShortcut({ children }: { children: ReactNode }) {
	return <kbd {...stylex.props(menuText.shortcut, menuParts.itemShortcut)}>{children}</kbd>;
}

export const Trigger = BaseMenu.Trigger;
export const Group = BaseMenu.Group;
export const RadioGroup = BaseMenu.RadioGroup;
export const SubmenuRoot = BaseMenu.SubmenuRoot;

const menuParts = stylex.create({
	panelSurface: {
		[popupVars.background]: `color-mix(in srgb, ${tokens["--elevated"]} 84%, transparent)`,
		[popupVars.border]: tokens["--border"],
		[popupVars.foreground]: tokens["--fg"],
		borderRadius: tokens["--radius-lg"],
		backdropFilter: "blur(6px)",
		backgroundColor: popupVars.background,
		boxShadow: tokens["--shadow-lg"],
		color: popupVars.foreground,
	},
	popup: {
		padding: tokens["--space-1"],
		outline: "0",
		minWidth: "8rem",
	},
	viewport: {
		display: "flex",
		flexDirection: "column",
	},
	itemShortcut: {
		gridColumn: "3",
		justifySelf: "end",
		opacity: 0.6,
	},
	itemIcon: {
		gridColumn: "1",
		alignItems: "center",
		display: "inline-flex",
		justifyContent: "center",
		height: tokens["--space-4"],
		width: tokens["--space-4"],
	},
	submenuTrigger: {
		backgroundColor: {
			"[data-highlighted]": tokens["--bg-highlight"],
			"[data-popup-open]": tokens["--surface-subtle"],
			"[data-popup-open][data-highlighted]": tokens["--surface-subtle"],
			default: "transparent",
		},
		color: {
			"[data-highlighted]": tokens["--fg"],
			"[data-popup-open]": tokens["--fg-muted"],
			"[data-popup-open][data-highlighted]": tokens["--fg-muted"],
			default: tokens["--fg"],
		},
	},
	submenuIcon: {
		gridColumn: "3",
		color: tokens["--fg-subtle"],
		justifySelf: "end",
	},
	collapsibleGroup: {
		display: "flex",
		flexDirection: "column",
		width: "100%",
	},
	collapsibleGroupTrigger: {
		borderColor: "transparent",
		borderStyle: "solid",
		borderWidth: "0",
		backgroundColor: {
			"[data-highlighted]": tokens["--bg-highlight"],
			"[data-panel-open]": `color-mix(in srgb, ${tokens["--bg-highlight"]} 50%, transparent)`,
			default: "transparent",
		},
		color: {
			"[data-highlighted]": tokens["--fg"],
			"[data-panel-open]": tokens["--fg"],
			default: tokens["--fg-muted"],
		},
		fontFamily: "inherit",
		textAlign: "start",
		width: "100%",
	},
	collapsibleGroupIcon: {
		transform: {
			default: "rotate(0deg)",
			[stylex.when.ancestor("[data-panel-open]")]: "rotate(180deg)",
		},
		transitionDuration: {
			default: tokens["--motion-duration-short"],
			"@media (prefers-reduced-motion: reduce)": "0ms",
		},
		transitionProperty: "transform",
		transitionTimingFunction: tokens["--motion-ease-smooth-out"],
	},
	collapsibleGroupPanel: {
		overflow: "hidden",
		display: "block",
		transitionDuration: {
			default: tokens["--motion-duration-short"],
			"@media (prefers-reduced-motion: reduce)": "0ms",
		},
		transitionProperty: "height",
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
		minWidth: "var(--collapsible-panel-width)",
	},
	indicatorDot: {
		borderRadius: tokens["--radius-full"],
		backgroundColor: "currentColor",
		height: tokens["--space-2"],
		width: tokens["--space-2"],
	},
	switchIndicator: {
		borderRadius: tokens["--radius-full"],
		gridColumn: "1",
		alignItems: "center",
		backgroundColor: {
			"[data-checked]": tokens["--bg-primary"],
			default: tokens["--bg-neutral"],
		},
		display: "inline-flex",
		justifySelf: "start",
		marginInlineStart: "-0.33rem",
		transitionDuration: {
			default: tokens["--motion-duration-quick"],
			"@media (prefers-reduced-motion: reduce)": "0ms",
		},
		transitionProperty: "background-color",
		transitionTimingFunction: tokens["--motion-ease-smooth-out"],
		height: tokens["--space-4"],
		width: tokens["--space-6"],
	},
	switchThumb: {
		borderRadius: tokens["--radius-full"],
		marginInline: "0.125rem",
		aspectRatio: 1,
		backgroundColor: tokens["--fg-inverse"],
		transform: {
			"[data-checked]": `translateX(${tokens["--space-2"]})`,
			default: "translateX(0)",
		},
		transitionDuration: {
			default: tokens["--motion-duration-quick"],
			"@media (prefers-reduced-motion: reduce)": "0ms",
		},
		transitionProperty: "transform",
		transitionTimingFunction: tokens["--motion-ease-out"],
		height: "calc(100% - 0.25rem)",
	},
	groupLabel: {
		paddingBlock: tokens["--space-1"],
		paddingInline: tokens["--space-2"],
		color: tokens["--fg-subtle"],
	},
	separator: {
		marginBlock: tokens["--space-1"],
		backgroundColor: tokens["--border"],
		marginInlineEnd: `calc(-1 * ${tokens["--space-1"]})`,
		marginInlineStart: tokens["--space-3"],
		height: "1px",
	},
});

const menuText = {
	shortcut: [textStyles.supporting, fontFamilyStyles.sans],
	groupLabel: [textStyles.supporting, fontWeightStyles.medium],
} as const;

export const Menu = {
	Root,
	Trigger,
	Popup,
	Viewport,
	Item,
	LinkItem,
	CheckboxItem,
	SwitchItem,
	RadioItem,
	SubmenuRoot,
	SubmenuTrigger,
	Group,
	GroupLabel,
	RadioGroup,
	Separator,
	CollapsibleGroup,
	CollapsibleGroupTrigger,
	CollapsibleGroupPanel,
	ItemLabel,
	ItemIcon,
	ItemShortcut,
} as const;
