import * as stylex from "@stylexjs/stylex";
import { zIndex, media } from "@/styles/constants.stylex";
import { tokens } from "@/theme/tokens.stylex";
import { popupVars } from "./popover-vars.stylex";

/**
 * Shared behavior for anchored popups (menus, popovers, selects, comboboxes,
 * link previews, tooltips).
 *
 * This module owns what must stay consistent across every popup: positioner
 * behavior, enter/exit motion, arrow geometry, and tooltip chrome. Panel
 * appearance (background, radius, shadow, padding) is simple chrome and lives
 * in each component's own file.
 *
 * Apply one export per element role:
 *
 * | Element                                | Export                                          |
 * | -------------------------------------- | ----------------------------------------------- |
 * | Base UI `Positioner`          | `popupPositionerStyles`                        |
 * | `Popup` element (panel-style) | own chrome + `popupMotionStyles.anchoredPopup` |
 * | Moving detached trigger       | `popupMotionStyles.movingPositioner` + `.movingPopup` |
 * | Optional `Viewport` child     | `popupViewportStyles`                          |
 * | Base UI `Arrow`               | `popupArrowStyles`                             |
 *
 * Compose as `stylex.props(ownParts, <shared motion>, style)` so shared motion
 * wins over local geometry and the caller's `style` always comes last.
 */

/** Popup lifecycle motion matching Base UI's standard anchored-popup demos. */
export const popupMotionStyles = stylex.create({
	positioner: {
		outline: "0",
		zIndex: zIndex.popup,
		height: "var(--positioner-height)",
		maxWidth: "var(--available-width)",
		width: "var(--positioner-width)",
	},
	anchoredPopup: {
		[popupVars.duration]: tokens["--motion-duration-popup"],
		[popupVars.easing]: tokens["--motion-ease-popup"],
		opacity: {
			"[data-ending-style]": 0,
			"[data-side='none']": 1,
			"[data-starting-style]": 0,
			default: 1,
		},
		transform: {
			"[data-ending-style]": "scale(0.98)",
			"[data-side='none']": "scale(1)",
			"[data-starting-style]": "scale(0.98)",
			default: "scale(1)",
		},
		transformOrigin: "var(--transform-origin)",
		transitionDuration: `${popupVars.duration}`,
		transitionProperty: {
			"[data-instant]": "none",
			"[data-side='none']": "none",
			default: "transform, opacity",
		},
		transitionTimingFunction: popupVars.easing,
		height: "var(--popup-height, auto)",
		width: "var(--popup-width, auto)",
	},
	tooltipPopup: {
		scale: {
			"[data-ending-style]": 0.9,
			"[data-starting-style]": 1,
			default: 1,
		},
		transform: "none",
		transitionProperty: {
			"[data-instant]": "none",
			default: "opacity",
		},
	},
	movingPositioner: {
		transitionDuration: {
			default: `${tokens["--motion-duration-content"]}`,
			":has(> [data-starting-style])": "0ms",
		},
		transitionProperty: "top, right, bottom, left, transform",
		transitionTimingFunction: tokens["--motion-ease-smooth-out"],
	},
	movingPopup: {
		transitionDuration: {
			"[data-instant]": "0ms",
			default: `${tokens["--motion-duration-content"]}`,
			[media.reducedMotion]: "0ms",
		},
		transitionProperty: "width, height, transform, opacity",
		transitionTimingFunction: tokens["--motion-ease-smooth-out"],
	},
	viewport: {
		"--popup-motion-duration": tokens["--motion-duration-content"],
		"--popup-motion-ease": tokens["--motion-ease-smooth-out"],
		overflow: "clip",
		boxSizing: "border-box",
		position: "relative",
		height: "100%",
		width: "100%",
	},
});

const arrowStyles = stylex.create({
	arrow: {
		overflow: "clip",
		boxSizing: "border-box",
		display: "block",
		flexShrink: 0,
		position: "relative",
		rotate: {
			"[data-side='left']": "90deg",
			"[data-side='right']": "-90deg",
			"[data-side='top']": "180deg",
			default: "0deg",
		},
		bottom: {
			"[data-side='top']": "-6px",
			default: "auto",
		},
		height: "6px",
		left: {
			"[data-side='right']": "-9px",
			default: "auto",
		},
		right: {
			"[data-side='left']": "-9px",
			default: "auto",
		},
		top: {
			"[data-side='bottom']": "-6px",
			default: "auto",
		},
		width: "12px",
		"::before": {
			borderColor: popupVars.border,
			borderStyle: "solid",
			borderWidth: "1px",
			backgroundColor: popupVars.background,
			boxSizing: "border-box",
			content: '""',
			position: "absolute",
			transform: "translate(-50%, 50%) rotate(45deg)",
			bottom: 0,
			height: "calc(6px * 1.4142)",
			left: "50%",
			width: "calc(6px * 1.4142)",
		},
	},
});

/** Apply to a normal anchored Base UI `Positioner`. */
export const popupPositionerStyles = [popupMotionStyles.positioner] as const;

/** Apply to an optional Base UI `Viewport` child. */
export const popupViewportStyles = [popupMotionStyles.viewport] as const;

/** Apply to a Base UI `Arrow`; paints via `popupVars` so it matches its surface. */
export const popupArrowStyles = [arrowStyles.arrow] as const;
