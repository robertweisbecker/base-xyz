import * as stylex from "@stylexjs/stylex";
import { media } from "@/styles/constants.stylex";
import { popupVars } from "@/components/popover/popover-vars.stylex";
import { tokens } from "@/theme/tokens.stylex";

const HOVER_WHEN_INACTIVE = ":hover:not([data-disabled]):not([data-popup-open]):not([data-pressed])";

export const comboboxMarker = stylex.defineMarker();

export const comboboxParts = stylex.create({
	panelSurface: {
		[popupVars.background]: tokens["--elevated"],
		[popupVars.border]: tokens["--border"],
		[popupVars.foreground]: tokens["--fg"],
		borderRadius: tokens["--radius-lg"],
		backgroundColor: popupVars.background,
		boxShadow: tokens["--shadow-md"],
		color: popupVars.foreground,
	},
	inputGroup: {
		borderColor: {
			"[data-disabled]": tokens["--border"],
			"[data-readonly]": tokens["--border"],
			default: tokens["--border-input"],
			":focus-within:not([data-disabled]):not([data-readonly])": tokens["--focus"],
			":hover:not(:focus-within):not([data-disabled]):not([data-readonly])": tokens["--border-input-hover"],
		},
		alignItems: "center",
		display: "flex",
		position: "relative",
		transitionDuration: tokens["--motion-duration-long"],
		transitionProperty: "height",
		transitionTimingFunction: tokens["--motion-ease-smooth-out"],
	},
	input: {
		borderWidth: 0,
		outline: "0",
		backgroundColor: "transparent",
		flexGrow: 1,
		minWidth: 0,
	},
	inputReadOnly: {
		"::placeholder": {
			opacity: 0,
		},
	},
	chips: {
		alignItems: "center",
		columnGap: tokens["--space-1"],
		display: "flex",
		flexWrap: "wrap",
		rowGap: 2,
		minWidth: 0,
	},
	chip: {
		padding: "2px",
		borderRadius: tokens["--radius-sm"],
		cornerShape: "superellipse(1.1)",
		overflow: "hidden",
		alignItems: "center",
		backgroundColor: {
			default: tokens["--surface-subtle"],
			":focus-within": tokens["--bg-primary"],
		},
		color: {
			default: tokens["--fg"],
			":focus-within": tokens["--fg-accent-contrast"],
		},
		display: "inline-flex",
		fontSize: tokens["--font-size-1"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
		height: "24px",
	},
	chipLabel: {
		overflow: "hidden",
		paddingInline: tokens["--space-1"],
		display: "block",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
		maxWidth: "12rem",
		minWidth: 0,
	},
	chipSlot: {
		alignItems: "center",
		display: "inline-flex",
		flexShrink: 0,
		justifyContent: "center",
		lineHeight: 0,
	},
	creatableIndicator: {
		visibility: "visible",
	},
	chipOverflow: {
		paddingInline: tokens["--space-1"],
		alignItems: "center",
		color: {
			default: tokens["--fg-subtle"],
			":hover": tokens["--fg-muted"],
		},
		display: "inline-flex",
		flexShrink: 0,
		fontSize: tokens["--font-size-1"],
		fontWeight: tokens["--font-weight-medium"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
		whiteSpace: "nowrap",
		height: "24px",
	},
	chipRemove: {
		borderRadius: tokens["--radius-xs"],
		outline: "0",
		backgroundColor: {
			default: "transparent",
			[stylex.when.ancestor('[aria-readonly="true"]', comboboxMarker)]: "transparent",
			[stylex.when.ancestor("[data-disabled]", comboboxMarker)]: "transparent",
			[stylex.when.ancestor("[data-readonly]", comboboxMarker)]: "transparent",
			":hover": {
				[media.canHover]: tokens["--bg-highlight"],
			},
		},
		height: tokens["--space-5"],
		width: tokens["--space-5"],
	},
	actions: {
		gap: 0,
		display: "flex",
		insetBlockStart: -1,
		insetInlineEnd: 2,
		position: "absolute",
		height: "100%",
	},
	action: {
		padding: 0,
		borderRadius: tokens["--radius-sm"],
		borderWidth: 0,
		alignItems: "center",
		color: {
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[HOVER_WHEN_INACTIVE]: {
				[media.canHover]: tokens["--fg"],
			},
			default: tokens["--fg-muted"],
			[stylex.when.ancestor('[aria-readonly="true"]', comboboxMarker)]: tokens["--fg-subtle"],
			[stylex.when.ancestor("[data-disabled]", comboboxMarker)]: tokens["--fg-subtle"],
			[stylex.when.ancestor("[data-readonly]", comboboxMarker)]: tokens["--fg-subtle"],
		},
		cursor: {
			"[data-disabled]": "not-allowed",
			default: "default",
			[stylex.when.ancestor('[aria-readonly="true"]', comboboxMarker)]: "default",
			[stylex.when.ancestor("[data-readonly]", comboboxMarker)]: "default",
		},
		display: "flex",
		fontSize: "inherit",
		justifyContent: "center",
		opacity: {
			default: 1,
			[stylex.when.ancestor('[aria-readonly="true"]', comboboxMarker)]: 0.48,
			[stylex.when.ancestor("[data-disabled]", comboboxMarker)]: 0.48,
			[stylex.when.ancestor("[data-readonly]", comboboxMarker)]: 0.48,
		},
		pointerEvents: {
			"[data-disabled]": "none",
			default: "auto",
			[stylex.when.ancestor('[aria-readonly="true"]', comboboxMarker)]: "none",
			[stylex.when.ancestor("[data-disabled]", comboboxMarker)]: "none",
			[stylex.when.ancestor("[data-readonly]", comboboxMarker)]: "none",
		},
	},
	textAction: {
		padding: tokens["--space-2"],
		textDecoration: {
			default: "none",
			":hover": "underline",
		},
		alignSelf: "start",
		color: {
			default: tokens["--fg-muted"],
			":hover": tokens["--fg"],
		},
		fontSize: tokens["--font-size-1"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
		whiteSpace: "nowrap",
		width: "auto",
	},
	popup: {
		overflow: "hidden",
		minWidth: "var(--anchor-width)",
	},
	list: {
		padding: {
			"[data-empty]": 0,
			default: tokens["--space-1"],
		},
		overscrollBehavior: "contain",
		maxHeight: "min(22.5rem, var(--available-height))",
		overflowY: "auto",
	},
	empty: {
		padding: {
			default: tokens["--space-3"],
			":empty": 0,
		},
		alignItems: "center",
		color: tokens["--fg-muted"],
		display: "flex",
		fontSize: tokens["--font-size-2"],
		justifyContent: "center",
		letterSpacing: tokens["--letter-spacing-2"],
		lineHeight: tokens["--line-height-2"],
		textAlign: "center",
	},
});

export const comboboxGroupSizeVariants = stylex.create({
	sm: {
		paddingInlineEnd: tokens["--size-control-sm"],
		paddingInlineStart: tokens["--space-1"],
	},
	md: {
		paddingInlineEnd: tokens["--space-8"],
		paddingInlineStart: tokens["--space-1"],
	},
	lg: {
		paddingInlineEnd: tokens["--size-control-lg"],
		paddingInlineStart: tokens["--space-2"],
	},
});

export const comboboxInputSizeVariants = stylex.create({
	sm: {
		paddingBlock: tokens["--space-1"],
		paddingInlineStart: tokens["--space-1-5"],
		height: tokens["--size-control-sm"],
	},
	md: {
		paddingBlock: tokens["--space-1"],
		paddingInlineStart: tokens["--space-2"],
		height: tokens["--size-control-md"],
	},
	lg: {
		paddingBlock: tokens["--space-1"],
		paddingInlineStart: tokens["--space-2"],
		height: tokens["--size-control-lg"],
	},
});

export const comboboxActionSizeVariants = stylex.create({
	sm: {
		height: tokens["--size-control-sm"],
		width: tokens["--size-control-sm"],
	},
	md: {
		height: tokens["--size-control-md"],
		width: tokens["--size-control-md"],
	},
	lg: {
		height: tokens["--size-control-lg"],
		width: tokens["--size-control-lg"],
	},
});

export const inputGroupVariants = stylex.create({
	withChips: {
		gap: tokens["--space-1"],
		paddingBlock: "3px",
		alignItems: "start",
		flexWrap: "wrap",
		paddingBlockStart: "3px",
		paddingInlineEnd: tokens["--space-8"],
		paddingInlineStart: tokens["--space-1"],
		height: "auto",
	},
	multiple: {
		paddingInlineEnd: tokens["--space-16"],
	},
});

export const inputVariants = stylex.create({
	withChips: {
		paddingBlock: 0,
		flexBasis: tokens["--space-16"], // acts as a min-width to force newline wrap
		paddingInlineStart: tokens["--space-2"],
		height: "26px",
	},
});
