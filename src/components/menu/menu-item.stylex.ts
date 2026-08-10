import * as stylex from "@stylexjs/stylex";
import { typescaleStyles, textStyles } from "@/components/text/text.stylex";
import { tokens } from "@/theme/tokens.stylex";
import type { MenuItemSize } from "./menu.types";

/** Inherited layout variables for Menu items and components that intentionally match them. */
export const menuItemVars = stylex.defineVars({
	columns: `${tokens["--space-4"]} minmax(0, 1fr) auto`,
	columnGap: tokens["--space-2"],
	indicatorColor: "inherit",
	minHeight: tokens["--size-control-md"],
	paddingBlock: tokens["--space-1"],
	paddingInlineEnd: tokens["--space-2"],
	paddingInlineStart: tokens["--space-3"],
	rowGap: "0px",
});

/**
 * Canonical selectable-row styles owned by Menu.
 *
 * Select, Combobox, and other components that intentionally look like Menu
 * items compose these styles before their component-specific overrides.
 */
const menuItemParts = stylex.create({
	itemBase: {
		borderRadius: tokens["--radius-md"],
		outline: "0",
		paddingBlock: menuItemVars.paddingBlock,
		textDecoration: "none",
		alignItems: "center",
		columnGap: menuItemVars.columnGap,
		cursor: {
			default: "default",
			":is(a[href])": "pointer",
		},
		display: "grid",
		gridTemplateColumns: menuItemVars.columns,
		opacity: {
			"[data-disabled]": 0.48,
			default: 1,
		},
		paddingInlineEnd: menuItemVars.paddingInlineEnd,
		paddingInlineStart: menuItemVars.paddingInlineStart,
		rowGap: menuItemVars.rowGap,
		userSelect: "none",
		minHeight: menuItemVars.minHeight,
	},
	label: {
		gridColumn: "2",
		minWidth: 0,
	},
	indicatorSizing: {
		gridColumn: "1",
		alignItems: "center",
		color: menuItemVars.indicatorColor,
		display: "inline-flex",
		justifyContent: "center",
		visibility: {
			"[data-checked]": "visible",
			"[data-selected]": "visible",
			default: "hidden",
		},
		height: tokens["--space-4"],
		width: tokens["--space-4"],
	},
	itemSm: {
		borderRadius: tokens["--radius-sm"],
		minHeight: tokens["--size-control-sm"],
	},
	itemMd: {
		minHeight: tokens["--size-control-md"],
	},
	itemLg: {
		minHeight: tokens["--size-control-lg"],
	},
});

export const menuItemStyles = {
	item: [textStyles.body, menuItemParts.itemBase],
	label: menuItemParts.label,
	indicator: menuItemParts.indicatorSizing,
} as const;

/** Selectable-row typography and height aligned with the shared field-control sizes. */
export const menuItemSizeStyles = {
	sm: [typescaleStyles["2"], menuItemParts.itemSm],
	md: [typescaleStyles["2"], menuItemParts.itemMd],
	lg: [typescaleStyles["3"], menuItemParts.itemLg],
} as const satisfies Record<MenuItemSize, unknown>;

export const menuItemVariantStyles = stylex.create({
	default: {
		backgroundColor: {
			"[data-highlighted]": tokens["--bg-highlight"],
			default: "transparent",
		},
		color: {
			"[data-highlighted]": tokens["--fg"],
			default: tokens["--fg"],
		},
		[menuItemVars.indicatorColor]: tokens["--fg-accent"],
	},
	primary: {
		backgroundColor: {
			"[data-highlighted]": tokens["--bg-primary"],
			default: "transparent",
		},
		color: {
			"[data-highlighted]": tokens["--fg-accent-contrast"],
			default: tokens["--fg"],
		},
	},
	error: {
		backgroundColor: {
			"[data-highlighted]": tokens["--bg-error"],
			default: "transparent",
		},
		color: {
			"[data-highlighted]": tokens["--bg-error-primary"],
			default: tokens["--bg-error-primary"],
		},
	},
});
