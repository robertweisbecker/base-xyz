import * as stylex from "@stylexjs/stylex";
import { media } from "@/styles/constants.stylex";
import { menuItemVars } from "@/components/menu/menu-item-vars.stylex";
import { tokens } from "@/theme/tokens.stylex";

export const navListParts = stylex.create({
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

export const navListText = stylex.create({
	sectionLabel: {
		color: tokens["--fg-subtle"],
	},
	description: {
		color: tokens["--fg-muted"],
	},
});
