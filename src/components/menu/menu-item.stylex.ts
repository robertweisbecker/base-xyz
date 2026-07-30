import * as stylex from "@stylexjs/stylex";
import { textStyles } from "@/components/text/text.stylex";
import { color, radius, size, space } from "@/styles/tokens.stylex";

/** Inherited layout variables for Menu items and components that intentionally match them. */
export const menuItemVars = stylex.defineVars({
	columns: `${space.x4} minmax(0, 1fr) auto`,
	columnGap: space.x2,
	minHeight: size["control.md"],
	paddingBlock: space.x1,
	paddingInlineEnd: space.x2,
	paddingInlineStart: space.x3,
	rowGap: "0px",
});

/**
 * Canonical selectable-row styles owned by Menu.
 *
 * Select, Combobox, and other components that intentionally look like Menu
 * items compose these styles before their component-specific overrides.
 */
const menuItemParts = stylex.create({
	row: {
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
	indicator: {
		gridColumn: "1",
		alignItems: "center",
		display: "inline-flex",
		justifyContent: "center",
		visibility: {
			"[data-checked]": "visible",
			"[data-selected]": "visible",
			default: "hidden",
		},
		height: space.x4,
		width: space.x4,
	},
});

export const menuItemStyles = {
	row: [textStyles.body, menuItemParts.row],
	label: menuItemParts.label,
	indicator: menuItemParts.indicator,
} as const;

export const menuItemVariantStyles = stylex.create({
	default: {
		backgroundColor: {
			"[data-highlighted]": color.highlight,
			default: "transparent",
		},
		color: {
			"[data-highlighted]": color.fg,
			default: color.fg,
		},
	},
	primary: {
		backgroundColor: {
			"[data-highlighted]": color.bgAccent,
			default: "transparent",
		},
		color: {
			"[data-highlighted]": color.fgAccentContrast,
			default: color.fg,
		},
	},
	danger: {
		backgroundColor: {
			"[data-highlighted]": color.bgDangerSubtle,
			default: "transparent",
		},
		color: {
			"[data-highlighted]": color.bgDanger,
			default: color.bgDanger,
		},
	},
});

export type MenuItemVariant = keyof typeof menuItemVariantStyles;
