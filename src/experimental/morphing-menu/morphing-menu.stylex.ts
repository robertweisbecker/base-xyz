import * as stylex from "@stylexjs/stylex";
import { media, zIndex } from "@/styles/constants.stylex";
import { tokens } from "@/theme/tokens.stylex";

const blockPointerEvents = stylex.keyframes({
	from: { pointerEvents: "none" },
	to: { pointerEvents: "none" },
});

/** Markers keep the experiment's relational motion scoped to this menu family. */
export const morphingRootPopupMarker = stylex.defineMarker();
export const morphingChildPopupMarker = stylex.defineMarker();
export const morphingSubmenuTriggerMarker = stylex.defineMarker();

export const morphingMenuStyles = stylex.create({
	scope: {
		"--_morph-background-scale": "0.96",
		"--_morph-bloom-close-ease": tokens["--motion-ease-smooth-out"],
		"--_morph-bloom-content-spring":
			"linear(0, 0.03 9.524%, 0.161 14.286%, 0.413 28.571%, 0.645 38.095%, 0.767 47.619%, 0.853 57.143%, 0.965 71.429%, 1 85.714%, 1)",
		"--_morph-bloom-enter-spring":
			"linear(0, 0.0534 4%, 0.1757 8%, 0.3248 12%, 0.4744 16%, 0.6097 20%, 0.7238 24%, 0.8149 28%, 0.8841 32%, 0.9343 36%, 0.969 40%, 0.9915 44%, 1.0049 48%, 1.012 52%, 1.0148 56%, 1.015 60%, 1.0136 64%, 1.0115 68%, 1.0092 72%, 1.007 76%, 1.0051 80%, 1.0035 84%, 1.0023 88%, 1.0014 92%, 1.0007 96%, 1.0003)",
		"--_morph-bloom-open-spring":
			"linear(0, 0.0461 4%, 0.154 8%, 0.2892 12%, 0.4289 16%, 0.5594 20%, 0.6734 24%, 0.7682 28%, 0.8435 32%, 0.901 36%, 0.9433 40%, 0.9729 44%, 0.9926 48%, 1.0048 52%, 1.0116 56%, 1.0146 60%, 1.0151 64%, 1.0142 68%, 1.0124 72%, 1.0103 76%, 1.0082 80%, 1.0063 84%, 1.0046 88%, 1.0032 92%, 1.0022 96%, 1.0013)",
		"--_morph-inactive-opacity": "1",
		"--_morph-lead": "-8ms",
		"--_morph-menu-padding": tokens["--space-1"],
		"--_morph-menu-row-height": `calc(${tokens["--size-control-md"]} + ${tokens["--space-1"]})`,
		"--_morph-menu-width": "10rem",
		"--_morph-nested-background-scale": "1.0176",
		"--_morph-root-menu-height":
			"calc(6 * var(--_morph-menu-row-height) + 2 * var(--_morph-menu-padding))",
		"--_morph-submenu-enter-ease": tokens["--motion-ease-smooth-out"],
		"--_morph-submenu-scale": "1.06",
	},
	menuWidth: (width: string) => ({
		"--_morph-menu-width": width,
	}),
	rootRows: (rows: number) => ({
		// The absolutely positioned root surface cannot provide intrinsic height to
		// Base UI's initial measurement, so seed the target height from its rows.
		"--_morph-root-menu-height": `calc(${rows} * var(--_morph-menu-row-height) + 2 * var(--_morph-menu-padding))`,
	}),
	root: {
		display: "inline-flex",
	},
	trigger: {
		padding: 0,
		borderRadius: tokens["--radius-full"],
		borderWidth: 0,
		alignItems: "center",
		appearance: "none",
		backgroundColor: {
			"[data-morphing]": "transparent",
			"[data-popup-open]": "transparent",
			default: tokens["--elevated"],
			":hover": {
				[media.canHover]: tokens["--surface-subtle-hover"],
			},
		},
		boxShadow: {
			"[data-morphing]": "none",
			"[data-popup-open]": "none",
			default: tokens["--shadow-sm"],
		},
		boxSizing: "border-box",
		color: {
			default: tokens["--fg-muted"],
			":hover": {
				[media.canHover]: tokens["--fg"],
			},
		},
		display: "grid",
		filter: {
			[media.reducedMotion]: "none",
			"[data-popup-open]": "blur(8px)",
			default: "blur(0)",
		},
		justifyItems: "center",
		opacity: {
			"[data-popup-open]": 0,
			default: 1,
		},
		outlineColor: {
			default: "transparent",
			":focus-visible": tokens["--focus"],
			":focus-visible[data-morphing]": "transparent",
			":focus-visible[data-popup-open]": "transparent",
		},
		outlineOffset: "2px",
		outlineStyle: "solid",
		outlineWidth: "2px",
		pointerEvents: {
			"[data-popup-open]": "none",
			default: "auto",
		},
		position: "relative",
		transitionDelay: "var(--_morph-lead)",
		transitionDuration: {
			[media.reducedMotion]: "0s",
			default: "210ms, 210ms",
		},
		transitionProperty: "opacity, filter",
		transitionTimingFunction:
			"var(--_morph-bloom-content-spring), var(--_morph-bloom-content-spring)",
		zIndex: {
			"[data-morphing]": zIndex.popup,
			"[data-popup-open]": zIndex.popup,
			default: "auto",
		},
		height: tokens["--size-control-lg"],
		minHeight: tokens["--size-control-lg"],
		minWidth: tokens["--size-control-lg"],
		width: tokens["--size-control-lg"],
	},
	triggerIcon: {
		height: tokens["--space-5"],
		width: tokens["--space-5"],
	},
	positioner: {
		height: "var(--positioner-height)",
		outline: "0",
		width: "var(--positioner-width)",
		zIndex: zIndex.popup,
	},
	childPositioner: {
		pointerEvents: "none",
		zIndex: zIndex.tooltip,
	},
	popup: {
		"--_morph-inactive-opacity": {
			"[data-has-open-submenu]": "0.5",
			default: "1",
		},
		WebkitFontSmoothing: "antialiased",
		outline: "0",
		boxSizing: "border-box",
		color: tokens["--fg"],
		fontFamily: tokens["--font-family-sans"],
		fontSize: tokens["--font-size-2"],
		fontWeight: tokens["--font-weight-regular"],
		lineHeight: tokens["--line-height-2"],
		pointerEvents: "auto",
		position: "relative",
	},
	popupWidth: {
		overflow: "visible",
		backgroundColor: "transparent",
		minWidth: "var(--_morph-menu-width)",
		width: "var(--_morph-menu-width)",
	},
	rootPopup: {
		"--_morph-root-content-enter-offset": {
			"[data-side='bottom']": `calc(0rem - ${tokens["--space-2"]})`,
			default: tokens["--space-2"],
		},
		"--_morph-root-content-exit-offset": {
			"[data-side='bottom']": "-1.875rem",
			default: "1.875rem",
		},
		"--_morph-root-surface-start": {
			"[data-side='bottom']": `calc(${tokens["--space-2"]} + ${tokens["--space-0-5"]} - var(--anchor-height))`,
			default: `calc(100% - ${tokens["--space-2"]} - ${tokens["--space-0-5"]})`,
		},
		padding: 0,
		animationDuration: {
			[media.reducedMotion]: "0s",
			"[data-ending-style]": "280ms",
			default: "0s",
		},
		animationName: {
			[media.reducedMotion]: "none",
			"[data-ending-style]": blockPointerEvents,
			default: "none",
		},
		opacity: {
			"[data-ending-style]": 0.99999,
			default: 1,
		},
		pointerEvents: {
			"[data-ending-style]": "none",
			default: "auto",
		},
		transform: {
			"[data-has-open-submenu]": "scale(var(--_morph-background-scale))",
			default: "scale(1)",
		},
		transformOrigin: "center",
		transitionDelay: {
			"[data-ending-style]": "var(--_morph-lead), var(--_morph-lead)",
			default: "0s",
		},
		transitionDuration: {
			[media.reducedMotion]: "0s",
			"[data-ending-style]": {
				[media.reducedMotion]: "0s",
				default: "320ms, 320ms",
			},
			"[data-starting-style]": "0s",
			default: "400ms, 300ms",
		},
		transitionProperty: "transform, opacity",
		transitionTimingFunction: {
			"[data-ending-style]": "var(--_morph-bloom-close-ease), linear",
			default: "var(--_morph-bloom-open-spring), linear",
		},
		willChange: "transform",
		height: "var(--_morph-root-menu-height)",
	},
	rootSurface: {
		padding: "var(--_morph-menu-padding)",
		borderRadius: {
			default: tokens["--radius-md"],
			[stylex.when.ancestor("[data-ending-style]", morphingRootPopupMarker)]: tokens["--radius-lg"],
			[stylex.when.ancestor("[data-starting-style]", morphingRootPopupMarker)]:
				tokens["--radius-lg"],
		},
		overflow: "hidden",
		backgroundColor: tokens["--elevated"],
		boxShadow: {
			default: tokens["--shadow-md"],
			[stylex.when.ancestor("[data-ending-style]", morphingRootPopupMarker)]: tokens["--shadow-sm"],
			[stylex.when.ancestor("[data-starting-style]", morphingRootPopupMarker)]:
				tokens["--shadow-sm"],
		},
		boxSizing: "border-box",
		insetInlineEnd: {
			default: "auto",
			[stylex.when.ancestor("[data-align='end']", morphingRootPopupMarker)]: 0,
		},
		insetInlineStart: {
			default: 0,
			[stylex.when.ancestor("[data-align='end']", morphingRootPopupMarker)]: "auto",
		},
		position: "absolute",
		transitionDelay: {
			default: "0s",
			[stylex.when.ancestor("[data-ending-style]", morphingRootPopupMarker)]: "var(--_morph-lead)",
		},
		transitionDuration: {
			[media.reducedMotion]: "0s",
			[stylex.when.ancestor("[data-ending-style]", morphingRootPopupMarker)]: {
				[media.reducedMotion]: "0s",
				default: "280ms",
			},
			default: "300ms",
			[stylex.when.ancestor("[data-starting-style]", morphingRootPopupMarker)]: "0s",
		},
		transitionProperty: "top, width, height, border-radius, box-shadow",
		transitionTimingFunction: "var(--_morph-bloom-close-ease)",
		willChange: "top, width, height",
		zIndex: 0,
		height: {
			default: "var(--_morph-root-menu-height)",
			[stylex.when.ancestor("[data-ending-style]", morphingRootPopupMarker)]:
				"var(--anchor-height)",
			[stylex.when.ancestor("[data-starting-style]", morphingRootPopupMarker)]:
				"var(--anchor-height)",
		},
		top: {
			default: 0,
			[stylex.when.ancestor("[data-ending-style]", morphingRootPopupMarker)]:
				"var(--_morph-root-surface-start)",
			[stylex.when.ancestor("[data-starting-style]", morphingRootPopupMarker)]:
				"var(--_morph-root-surface-start)",
		},
		width: {
			default: "var(--_morph-menu-width)",
			[stylex.when.ancestor("[data-ending-style]", morphingRootPopupMarker)]: "var(--anchor-width)",
			[stylex.when.ancestor("[data-starting-style]", morphingRootPopupMarker)]:
				"var(--anchor-width)",
		},
	},
	popupContent: {
		animationDuration: "120ms",
		animationName: {
			[media.reducedMotion]: "none",
			default: "none",
			[stylex.when.ancestor("[data-open]", morphingRootPopupMarker)]: blockPointerEvents,
		},
		filter: {
			default: "blur(0)",
			[stylex.when.ancestor("[data-ending-style]", morphingRootPopupMarker)]: "blur(10px)",
			[stylex.when.ancestor("[data-starting-style]", morphingRootPopupMarker)]: "blur(10px)",
		},
		opacity: {
			default: 1,
			[stylex.when.ancestor("[data-ending-style]", morphingRootPopupMarker)]: 0,
			[stylex.when.ancestor("[data-starting-style]", morphingRootPopupMarker)]: 0,
		},
		position: "relative",
		transform: {
			default: "translate3d(0, 0, 0) scale(1)",
			[stylex.when.ancestor("[data-ending-style]", morphingRootPopupMarker)]:
				"translate3d(0, var(--_morph-root-content-exit-offset), 0) scale(0.9)",
			[stylex.when.ancestor("[data-starting-style]", morphingRootPopupMarker)]:
				"translate3d(0, var(--_morph-root-content-enter-offset), 0) scale(0.95)",
		},
		transitionDelay: {
			default: "6ms",
			[stylex.when.ancestor("[data-ending-style]", morphingRootPopupMarker)]: "var(--_morph-lead)",
		},
		transitionDuration: {
			[media.reducedMotion]: "0s",
			[stylex.when.ancestor("[data-ending-style]", morphingRootPopupMarker)]: {
				[media.reducedMotion]: "0s",
				default: "200ms",
			},
			default: "210ms",
			[stylex.when.ancestor("[data-starting-style]", morphingRootPopupMarker)]: "0s",
		},
		transitionProperty: "opacity, filter, transform",
		transitionTimingFunction: {
			default: "var(--_morph-bloom-content-spring)",
			[stylex.when.ancestor("[data-ending-style]", morphingRootPopupMarker)]:
				"cubic-bezier(0.4, 0, 1, 1)",
		},
		zIndex: 1,
	},
	row: {
		padding: tokens["--space-2"],
		gap: tokens["--space-2"],
		alignItems: "center",
		boxSizing: "border-box",
		display: "flex",
		fontFamily: "inherit",
		fontSize: "inherit",
		fontWeight: "inherit",
		lineHeight: "inherit",
		userSelect: "none",
		height: "var(--_morph-menu-row-height)",
		minHeight: "var(--_morph-menu-row-height)",
		width: "100%",
	},
	interactiveRow: {
		opacity: "var(--_morph-inactive-opacity)",
		position: "relative",
		transitionDuration: {
			[media.reducedMotion]: "0s",
			default: "400ms",
		},
		transitionProperty: "opacity, transform",
		transitionTimingFunction: "var(--_morph-bloom-open-spring)",
	},
	radioIndicator: {
		gridColumn: "auto",
		alignSelf: "center",
		marginInlineStart: "auto",
	},
	itemIcon: {
		alignItems: "center",
		color: tokens["--fg-subtle"],
		display: "inline-flex",
		flexShrink: 0,
		justifyContent: "center",
		height: tokens["--space-4"],
		width: tokens["--space-4"],
	},
	itemLabel: {
		gap: tokens["--space-2"],
		alignItems: "center",
		display: "flex",
		minWidth: 0,
	},
	chevron: {
		color: tokens["--fg-subtle"],
		flexShrink: 0,
		transform: {
			default: "rotate(0deg)",
			[stylex.when.ancestor("[data-popup-open]", morphingSubmenuTriggerMarker)]: "rotate(90deg)",
		},
		transitionDuration: {
			[media.reducedMotion]: "0s",
			default: tokens["--motion-duration-short"],
		},
		transitionProperty: "transform",
		transitionTimingFunction: tokens["--motion-ease-out"],
		height: tokens["--space-4"],
		width: tokens["--space-4"],
	},
	chevronBack: {
		transform: "rotate(90deg)",
	},
	submenuTrigger: {
		"--_morph-submenu-trigger-open-scale": {
			default: "1.10417",
			[stylex.when.ancestor("[data-ending-style]", morphingChildPopupMarker)]: "1.04167",
			[stylex.when.ancestor("[data-open]", morphingChildPopupMarker)]: "1.04167",
			[stylex.when.ancestor("[data-starting-style]", morphingChildPopupMarker)]: "1.04167",
		},
		justifyContent: "space-between",
		opacity: {
			"[data-popup-open]": 0,
			default: "var(--_morph-inactive-opacity)",
		},
		transform: {
			"[data-popup-open]": "scale(var(--_morph-submenu-trigger-open-scale))",
			default: "scale(1)",
		},
		transformOrigin: "center",
		transitionDuration: {
			[media.reducedMotion]: "0s",
			default: "320ms",
		},
		transitionProperty: "opacity, transform",
		transitionTimingFunction: "var(--_morph-submenu-enter-ease)",
		zIndex: {
			"[data-morphing]": 2,
			"[data-popup-open]": 2,
			default: "auto",
		},
	},
	childPopup: {
		padding: "var(--_morph-menu-padding)",
		display: {
			"[data-side='top']": "flex",
			default: "block",
		},
		flexDirection: {
			"[data-side='top']": "column-reverse",
			default: "column",
		},
		opacity: {
			"[data-ending-style]": 0,
			default: 1,
		},
		transform: {
			"[data-ending-style]": "scale(1)",
			"[data-has-open-submenu]": "scale(var(--_morph-nested-background-scale))",
			"[data-starting-style]": "scale(1)",
			default: "scale(var(--_morph-submenu-scale))",
		},
		transformOrigin: "var(--transform-origin)",
		transitionDelay: {
			"[data-ending-style]": "var(--_morph-lead), var(--_morph-lead)",
			default: "0s",
		},
		transitionDuration: {
			[media.reducedMotion]: "0s",
			"[data-ending-style]": {
				[media.reducedMotion]: "0s",
				default: "320ms, 150ms",
			},
			"[data-starting-style]": "0s",
			default: "320ms, 150ms",
		},
		transitionProperty: "transform, opacity",
		transitionTimingFunction: {
			"[data-ending-style]": "var(--_morph-bloom-close-ease), ease-out",
			default: "var(--_morph-submenu-enter-ease), linear",
		},
		willChange: "transform, opacity",
	},
	childSurface: {
		borderRadius: tokens["--radius-md"],
		backgroundColor: tokens["--elevated"],
		boxShadow: tokens["--shadow-sm"],
		insetInlineEnd: 0,
		insetInlineStart: 0,
		pointerEvents: "none",
		position: "absolute",
		transitionDelay: {
			default: "0s",
			[stylex.when.ancestor("[data-ending-style]", morphingChildPopupMarker)]: "var(--_morph-lead)",
		},
		transitionDuration: {
			[media.reducedMotion]: "0s",
			[stylex.when.ancestor("[data-ending-style]", morphingChildPopupMarker)]: {
				[media.reducedMotion]: "0s",
				default: "320ms",
			},
			default: "400ms",
			[stylex.when.ancestor("[data-starting-style]", morphingChildPopupMarker)]: "0s",
		},
		transitionProperty: "height",
		transitionTimingFunction: {
			default: "var(--_morph-bloom-enter-spring)",
			[stylex.when.ancestor("[data-ending-style]", morphingChildPopupMarker)]:
				"var(--_morph-bloom-close-ease)",
		},
		willChange: "height",
		zIndex: 0,
		bottom: {
			default: "auto",
			[stylex.when.ancestor("[data-side='top']", morphingChildPopupMarker)]: 0,
		},
		height: {
			default: "100%",
			[stylex.when.ancestor("[data-ending-style]", morphingChildPopupMarker)]:
				"calc(var(--_morph-menu-row-height) + 2 * var(--_morph-menu-padding))",
			[stylex.when.ancestor("[data-starting-style]", morphingChildPopupMarker)]:
				"calc(var(--_morph-menu-row-height) + 2 * var(--_morph-menu-padding))",
		},
		top: {
			default: 0,
			[stylex.when.ancestor("[data-side='top']", morphingChildPopupMarker)]: "auto",
		},
	},
	submenuHeader: {
		borderWidth: 0,
		backgroundColor: "transparent",
		color: "inherit",
		insetInlineEnd: "var(--_morph-menu-padding)",
		insetInlineStart: "var(--_morph-menu-padding)",
		justifyContent: "space-between",
		opacity: "var(--_morph-inactive-opacity)",
		pointerEvents: "inherit",
		position: "absolute",
		textAlign: "start",
		transitionDuration: {
			[media.reducedMotion]: "0s",
			default: "400ms",
		},
		transitionProperty: "opacity",
		transitionTimingFunction: "var(--_morph-bloom-open-spring)",
		zIndex: 2,
		bottom: {
			default: "auto",
			[stylex.when.ancestor("[data-side='top']", morphingChildPopupMarker)]: 0,
		},
		top: {
			default: 0,
			[stylex.when.ancestor("[data-side='top']", morphingChildPopupMarker)]: "auto",
		},
		width: "auto",
	},
	submenuHeaderSpacer: {
		height: "var(--_morph-menu-row-height)",
	},
	submenuSeparator: {
		backgroundColor: tokens["--border"],
		filter: {
			default: "blur(0)",
			[stylex.when.ancestor("[data-ending-style]", morphingChildPopupMarker)]: "blur(8px)",
			[stylex.when.ancestor("[data-starting-style]", morphingChildPopupMarker)]: "blur(8px)",
		},
		marginBlockEnd: {
			default: "var(--_morph-menu-padding)",
			[stylex.when.ancestor("[data-side='top']", morphingChildPopupMarker)]: 0,
		},
		marginBlockStart: {
			default: 0,
			[stylex.when.ancestor("[data-side='top']", morphingChildPopupMarker)]:
				"var(--_morph-menu-padding)",
		},
		marginInlineEnd: "var(--_morph-menu-padding)",
		marginInlineStart: "var(--_morph-menu-padding)",
		opacity: {
			default: 1,
			[stylex.when.ancestor("[data-ending-style]", morphingChildPopupMarker)]: 0,
			[stylex.when.ancestor("[data-starting-style]", morphingChildPopupMarker)]: 0,
		},
		position: "relative",
		transitionDelay: {
			default: "33ms",
			[stylex.when.ancestor("[data-ending-style]", morphingChildPopupMarker)]: "var(--_morph-lead)",
		},
		transitionDuration: {
			[media.reducedMotion]: "0s",
			[stylex.when.ancestor("[data-ending-style]", morphingChildPopupMarker)]: {
				[media.reducedMotion]: "0s",
				default: "150ms",
			},
			default: "210ms",
			[stylex.when.ancestor("[data-starting-style]", morphingChildPopupMarker)]: "0s",
		},
		transitionProperty: "opacity, filter",
		transitionTimingFunction: {
			default: "var(--_morph-bloom-content-spring)",
			[stylex.when.ancestor("[data-ending-style]", morphingChildPopupMarker)]: "ease-out",
		},
		zIndex: 1,
		height: "1px",
	},
	childItems: {
		clipPath: {
			default: "inset(0 0 0 0)",
			[stylex.when.ancestor("[data-ending-style]", morphingChildPopupMarker)]: "inset(0 0 100% 0)",
			[stylex.when.ancestor("[data-side='top'][data-ending-style]", morphingChildPopupMarker)]:
				"inset(100% 0 0 0)",
			[stylex.when.ancestor("[data-side='top'][data-starting-style]", morphingChildPopupMarker)]:
				"inset(100% 0 0 0)",
			[stylex.when.ancestor("[data-starting-style]", morphingChildPopupMarker)]:
				"inset(0 0 100% 0)",
		},
		filter: {
			default: "blur(0)",
			[stylex.when.ancestor("[data-ending-style]", morphingChildPopupMarker)]: "blur(8px)",
			[stylex.when.ancestor("[data-starting-style]", morphingChildPopupMarker)]: "blur(8px)",
		},
		opacity: {
			default: 1,
			[stylex.when.ancestor("[data-ending-style]", morphingChildPopupMarker)]: 0,
			[stylex.when.ancestor("[data-starting-style]", morphingChildPopupMarker)]: 0,
		},
		position: "relative",
		transitionDelay: {
			default: "33ms",
			[stylex.when.ancestor("[data-ending-style]", morphingChildPopupMarker)]: "var(--_morph-lead)",
		},
		transitionDuration: {
			[media.reducedMotion]: "0s",
			[stylex.when.ancestor("[data-ending-style]", morphingChildPopupMarker)]: {
				[media.reducedMotion]: "0s",
				default: "320ms, 150ms, 150ms",
			},
			default: "400ms, 210ms, 210ms",
			[stylex.when.ancestor("[data-starting-style]", morphingChildPopupMarker)]: "0s",
		},
		transitionProperty: "clip-path, opacity, filter",
		transitionTimingFunction: {
			default:
				"var(--_morph-bloom-enter-spring), var(--_morph-bloom-content-spring), var(--_morph-bloom-content-spring)",
			[stylex.when.ancestor("[data-ending-style]", morphingChildPopupMarker)]:
				"var(--_morph-bloom-close-ease), ease-out, ease-out",
		},
		zIndex: 1,
	},
});
