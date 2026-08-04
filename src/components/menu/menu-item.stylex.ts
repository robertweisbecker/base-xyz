import * as stylex from "@stylexjs/stylex";
import { textSizeStyles, textStyles } from "@/components/text/text.stylex";
import { colors, radius, size, space } from "@/styles/tokens.stylex";
import type { MenuItemSize } from "./menu.types";

/** Inherited layout variables for Menu items and components that intentionally match them. */
export const menuItemVars = stylex.defineVars({
	columns: `${space[4]} minmax(0, 1fr) auto`,
	columnGap: space[2],
	minHeight: size["control.md"],
	paddingBlock: space[1],
	paddingInlineEnd: space[2],
	paddingInlineStart: space[3],
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
		borderRadius: radius.md,
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
		display: "inline-flex",
		justifyContent: "center",
		visibility: {
			"[data-checked]": "visible",
			"[data-selected]": "visible",
			default: "hidden",
		},
		height: space[4],
		width: space[4],
	},
	itemSm: {
		minHeight: size["control.sm"],
	},
	itemMd: {
		minHeight: size["control.md"],
	},
	itemLg: {
		minHeight: size["control.lg"],
	},
});

export const menuItemStyles = {
	item: [textStyles.body, menuItemParts.itemBase],
	label: menuItemParts.label,
	indicator: menuItemParts.indicatorSizing,
} as const;

/** Selectable-row typography and height aligned with the shared field-control sizes. */
export const menuItemSizeStyles = {
	sm: [textSizeStyles["2"], menuItemParts.itemSm],
	md: [textSizeStyles["2"], menuItemParts.itemMd],
	lg: [textSizeStyles["3"], menuItemParts.itemLg],
} as const satisfies Record<MenuItemSize, unknown>;

export const menuItemVariantStyles = stylex.create({
	default: {
		backgroundColor: {
			"[data-highlighted]": colors["--highlight"],
			default: "transparent",
		},
		color: {
			"[data-highlighted]": colors["--text"],
			default: colors["--text"],
		},
	},
	primary: {
		backgroundColor: {
			"[data-highlighted]": colors["--accent"],
			default: "transparent",
		},
		color: {
			"[data-highlighted]": colors["--accent-contrast"],
			default: colors["--text"],
		},
	},
	danger: {
		backgroundColor: {
			"[data-highlighted]": colors["--danger-subtle"],
			default: "transparent",
		},
		color: {
			"[data-highlighted]": colors["--danger"],
			default: colors["--danger"],
		},
	},
});
