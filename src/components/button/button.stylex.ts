import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { media } from "@/styles/constants.stylex";
import { focusRing } from "@/styles/recipes/focus";
import { pressable } from "@/styles/recipes/transitions";
import { tokens } from "@/theme/tokens.stylex";

/** Marker for detecting descendants of Button-family controls via `stylex.when.ancestor`. */
export const buttonMarker = stylex.defineMarker();

const HOVER_NOT_PRESSED_OR_OPEN = ":hover:not([data-disabled],:active,[data-pressed])";
const PRESSED = ':is([aria-pressed="true"],[data-active],[data-pressed]):not([data-panel-open],[data-disabled])';

const buttonParts = stylex.create({
	root: {
		gap: tokens["--space-1-5"],
		overflow: "hidden",
		textDecoration: "none",
		alignItems: "center",
		cursor: {
			"[aria-busy]": "wait",
			"[data-disabled]": "not-allowed",
			default: "default",
			":is(a[href])": "pointer",
			":disabled": "not-allowed",
		},
		display: "inline-flex",
		fontSize: tokens["--font-size-2"],
		fontWeight: tokens["--font-weight-medium"],
		justifyContent: "center",
		letterSpacing: tokens["--letter-spacing-2"],
		lineHeight: tokens["--line-height-2"],
		opacity: {
			"[data-disabled]": 0.48,
			default: 1,
		},
		pointerEvents: {
			"[aria-busy]": "none",
			default: "auto",
		},
		position: "relative",
		transform: {
			default: "scale(1)",
			":active:not([data-disabled])": "scale(0.98)",
		},
		userSelect: "none",
		whiteSpace: "nowrap",
	},
});

const slotParts = stylex.create({
	root: {
		flex: "none",
		alignItems: "center",
		color: "currentColor",
		display: "inline-flex",
		justifyContent: "center",
		lineHeight: 0,
		pointerEvents: "none",
		minHeight: "1em",
		minWidth: "1em",
	},
	muted: {
		color: {
			default: tokens["--fg-subtle"],
			":is(svg)": tokens["--fill-neutral"],
			[stylex.when.ancestor("[data-pressed]", buttonMarker)]: tokens["--fg"],
		},
	},
});

const slotSizes = stylex.create({
	xs: { fontSize: "0.875rem" },
	sm: { fontSize: "1rem" },
	md: { fontSize: "1rem" },
	lg: { fontSize: "1.125rem" },
});

const iconOnlySlotSizes = stylex.create({
	xs: { fontSize: ".875rem" }, // 14px
	sm: { fontSize: "1rem" }, // 16px
	md: { fontSize: "1.125rem" }, // 20px
	lg: { fontSize: "1.25rem" }, // 24px
});

const iconOnlyControlSizes = stylex.create({
	xs: {
		padding: 0,
		flexShrink: 0,
		height: tokens["--size-control-xs"],
		minWidth: 0,
		width: tokens["--size-control-xs"],
	},
	sm: {
		padding: 0,
		flexShrink: 0,
		height: tokens["--size-control-sm"],
		minWidth: 0,
		width: tokens["--size-control-sm"],
	},
	md: {
		padding: 0,
		flexShrink: 0,
		height: tokens["--size-control-md"],
		// minWidth: tokens["--size-control-md"],
		width: tokens["--size-control-md"],
	},
	lg: {
		padding: 0,
		flexShrink: 0,
		height: tokens["--size-control-lg"],
		// minWidth: tokens["--size-control-lg"],
		width: tokens["--size-control-lg"],
	},
});

const startSlotOffsets = stylex.create({
	xs: { marginInlineStart: "-0.125rem" },
	sm: { marginInlineStart: "-0.25rem" },
	md: { marginInlineStart: "-0.25rem" },
	lg: { marginInlineStart: "-0.1875rem" },
});

const endSlotOffsets = stylex.create({
	xs: { marginInlineEnd: "-0.125rem" },
	sm: { marginInlineEnd: "-0.25rem" },
	md: { marginInlineEnd: "-0.25rem" },
	lg: { marginInlineEnd: "-0.1875rem" },
});

const colorVariants = stylex.create({
	primary: {
		backgroundColor: {
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[HOVER_NOT_PRESSED_OR_OPEN]: {
				[media.canHover]: tokens["--bg-primary-highlight"],
			},
			[PRESSED]: `color-mix(in srgb, ${tokens["--bg-primary"]} 90%, var(--color-black))`,
			"[data-popup-open]": tokens["--bg-primary-highlight"],
			default: tokens["--bg-primary"],
			":active:not([data-disabled])": `color-mix(in srgb, ${tokens["--bg-primary-highlight"]} 95%, var(--color-black))`,
		},
		// backgroundImage: `linear-gradient(to bottom, ${colors["--bg-primary-highlight"]},transparent 40%)`,
		boxShadow: {
			[PRESSED]: tokens["--shadow-primary-pressed"],
			"[data-disabled]": "none",
			default: tokens["--shadow-primary"],
			":active:not([data-disabled])": tokens["--shadow-primary-pressed"],
		},
		color: tokens["--fg-accent-contrast"],
		// textShadow: `0 .03em .06em oklch(from ${tokens["--bg-primary"]} calc(l*0.7) calc(c*1.1) h)`,
	},
	subtle: {
		backgroundColor: {
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[HOVER_NOT_PRESSED_OR_OPEN]: {
				[media.canHover]: tokens["--bg-accent-hover"],
			},
			[PRESSED]: tokens["--bg-accent-active"],
			default: tokens["--bg-accent"],
			":active:not([data-disabled])": tokens["--bg-accent-active"],
		},
		color: {
			[HOVER_NOT_PRESSED_OR_OPEN]: tokens["--fg-accent-strong"],
			[PRESSED]: tokens["--fg-accent-strong"],
			default: tokens["--fg-accent"],
		},
	},
	secondary: {
		backgroundColor: {
			[HOVER_NOT_PRESSED_OR_OPEN]: `light-dark(${tokens["--elevated-2"]}, ${tokens["--elevated"]})`,
			[PRESSED]: tokens["--inset"],
			"[data-popup-open]": tokens["--inset"],
			default: `light-dark(${tokens["--elevated"]}, ${tokens["--elevated-2"]})`,
			":active:not([data-disabled])": tokens["--inset"],
		},
		boxShadow: {
			[PRESSED]: tokens["--shadow-inset"],
			"[data-disabled]": "none",
			default: tokens["--shadow-sm"],
			":active:not([data-disabled])": tokens["--shadow-inset"],
		},
		color: tokens["--fg"],
	},
	neutral: {
		backgroundColor: {
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[HOVER_NOT_PRESSED_OR_OPEN]: {
				[media.canHover]: tokens["--surface-subtle-hover"],
			},
			[PRESSED]: tokens["--surface-subtle-active"],
			"[data-popup-open]": tokens["--surface-subtle-hover"],
			default: tokens["--surface-subtle"],
			":active:not([data-disabled])": tokens["--surface-subtle-hover"],
		},
		color: {
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[HOVER_NOT_PRESSED_OR_OPEN]: {
				[media.canHover]: tokens["--fg"],
			},
			[PRESSED]: tokens["--fg"],
			"[data-popup-open]": tokens["--fg"],
			default: tokens["--fg-muted"],
			":active:not([data-disabled])": tokens["--fg"],
		},
	},
	ghost: {
		borderColor: "transparent",
		backgroundColor: {
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[HOVER_NOT_PRESSED_OR_OPEN]: {
				[media.canHover]: tokens["--surface-subtle"],
			},
			[PRESSED]: tokens["--surface-subtle-active"],
			"[data-popup-open]": tokens["--surface-subtle-hover"],
			// ":active:not([data-disabled])": tokens["--bg-highlight"],
			default: "transparent",
			":active:not([data-disabled])": tokens["--surface-subtle-active"],
		},
		color: {
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[HOVER_NOT_PRESSED_OR_OPEN]: {
				[media.canHover]: tokens["--fg"],
			},
			[PRESSED]: tokens["--fg"],
			default: tokens["--fg-muted"],
			":active:not([data-disabled])": tokens["--fg"],
		},
	},
	plain: {
		paddingInline: 0,
		backgroundColor: {
			"[data-disabled]": "none",
			default: "transparent",
		},
		color: {
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[HOVER_NOT_PRESSED_OR_OPEN]: {
				[media.canHover]: tokens["--fg-muted"],
			},
			[PRESSED]: tokens["--fg"],
			default: tokens["--fg-subtle"],
			":active:not([data-disabled])": tokens["--fg"],
		},
	},
	error: {
		backgroundColor: {
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[HOVER_NOT_PRESSED_OR_OPEN]: {
				[media.canHover]: tokens["--color-error-c2"],
			},
			[PRESSED]: tokens["--color-error-c3"],
			default: tokens["--color-error-c1"],
			":active:not([data-disabled])": tokens["--color-error-c3"],
		},
		color: {
			// // eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			// [HOVER_NOT_PRESSED_OR_OPEN]: {
			// 	[media.canHover]: tokens["--color-error-t2"],
			// },
			[PRESSED]: tokens["--color-error-t2"],
			default: tokens["--color-error-t1"],
		},
	},
});

const sizeVariants = stylex.create({
	xs: {
		borderRadius: tokens["--radius-sm"],
		gap: tokens["--space-1"],
		paddingBlock: tokens["--space-2"],
		paddingInline: tokens["--space-2"],
		fontSize: tokens["--font-size-1"],
		fontWeight: tokens["--font-weight-medium"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--size-control-xs"],
		height: tokens["--size-control-xs"],
		minWidth: tokens["--size-control-xs"],
	},
	sm: {
		borderRadius: tokens["--radius-md"],
		gap: tokens["--space-1-5"],
		paddingInline: tokens["--space-3"],
		fontSize: "13px",
		fontWeight: tokens["--font-weight-medium"],
		letterSpacing: "-.0125em",
		lineHeight: tokens["--size-control-sm"],
		height: tokens["--size-control-sm"],
		minWidth: tokens["--size-control-sm"],
	},
	md: {
		borderRadius: tokens["--radius-md"],
		paddingInline: tokens["--space-3"],
		fontWeight: tokens["--font-weight-medium"],
		lineHeight: tokens["--size-control-md"],
		height: tokens["--size-control-md"],
		minWidth: tokens["--size-control-md"],
	},
	lg: {
		borderRadius: tokens["--radius-lg"],
		paddingInline: tokens["--space-4"],
		fontSize: tokens["--font-size-3"],
		letterSpacing: tokens["--letter-spacing-3"],
		lineHeight: tokens["--size-control-lg"],
		height: tokens["--size-control-lg"],
		minWidth: tokens["--size-control-lg"],
	},
});

const shapeVariants = stylex.create({
	default: {
		cornerShape: {
			"[data-size='sm']": "superellipse(1.5)",
			default: "superellipse(1.3)",
		},
	},
	pill: {
		borderRadius: tokens["--radius-full"],
	},
	circle: {
		padding: 0,
		borderRadius: tokens["--radius-full"],
		aspectRatio: "1 / 1",
	},
	square: {
		padding: 0,
		cornerShape: "superellipse(1.3)",
		aspectRatio: "1 / 1",
	},
});

export type ButtonVariant = keyof typeof colorVariants;
export type ButtonSize = keyof typeof sizeVariants;
export type ButtonShape = keyof typeof shapeVariants;

type ButtonRootStyleOptions = {
	variant: ButtonVariant;
	size: ButtonSize;
	shape: ButtonShape;
	iconOnly?: boolean;
};

export function getButtonRootStyleProps(
	{ variant, size, shape, iconOnly = false }: ButtonRootStyleOptions,
	overrides?: StyleXStyles,
) {
	return stylex.props(
		buttonMarker,
		buttonParts.root,
		focusRing.offset,
		pressable.transition,
		colorVariants[variant],
		sizeVariants[size],
		shapeVariants[shape],
		iconOnly && iconOnlyControlSizes[size],
		overrides,
	);
}

export function getButtonSlotStyleProps(
	role: "start" | "end" | "loading",
	size: ButtonSize,
	variant: ButtonVariant,
	iconOnly: boolean,
) {
	return stylex.props(
		slotParts.root,
		iconOnly ? iconOnlySlotSizes[size] : slotSizes[size],
		!iconOnly && role === "start" && startSlotOffsets[size],
		!iconOnly && role === "end" && endSlotOffsets[size],
		!iconOnly && (variant === "neutral" || variant === "secondary" || variant === "ghost") && slotParts.muted,
	);
}
