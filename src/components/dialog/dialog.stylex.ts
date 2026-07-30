import * as stylex from "@stylexjs/stylex";
import { headingStyles, textStyles } from "@/components/text/text.stylex";
import { zIndex } from "@/styles/constants.stylex";
import { color, motion, radius, shadow, space } from "@/styles/tokens.stylex";

/**
 * Shared behavior and chrome for modal surfaces (dialogs, alert dialogs,
 * drawers).
 *
 * This module owns what must stay consistent across every modal: backdrop
 * dimming, viewport centering, the surface with its nested-dialog
 * choreography, enter/exit motion, and the text roles inside a modal.
 *
 * Apply one export per element role:
 *
 * | Element                      | Export                                  |
 * | ---------------------------- | --------------------------------------- |
 * | `Backdrop`                   | `modalBackdropStyles` / `alertBackdropStyles`       |
 * | Viewport wrapper             | `modalViewportStyles` / `alertViewportStyles`       |
 * | `Popup` surface              | `modalPopupStyles`                            |
 * | `Title`                      | `modalTextStyles.title`                       |
 * | `Description`                | `modalTextStyles.description`                 |
 * | Scrollable body              | `modalTextStyles.body`                        |
 * | Footer / action row          | `modalTextStyles.footer`                      |
 *
 * Drawers reuse `modalChromeStyles.backdrop` and the modal layers but own their
 * slide motion; see drawer.tsx.
 */

/** Granular modal chrome; prefer the role bundles below. */
export const modalChromeStyles = stylex.create({
	backdrop: {
		inset: 0,
		backgroundColor: color.overlay,
		position: "fixed",
	},
	viewport: {
		inset: 0,
		padding: space.x4,
		alignItems: "center",
		display: "flex",
		justifyContent: "center",
		position: "fixed",
	},
	surface: {
		borderRadius: radius.xl,
		outline: "0",
		backgroundColor: {
			"[data-close-confirmation-open]": color.surface,
			"[data-nested-dialog-open]": color.surface,
			default: color.bgElevated,
		},
		boxShadow: shadow.lg,
		color: color.fg,
		display: "flex",
		flexDirection: "column",
		width: "100%",
		"::after": {
			inset: 0,
			borderRadius: "inherit",
			backdropFilter: {
				"[data-close-confirmation-open]": "saturation(0)",
				"[data-nested-dialog-open]": "saturation(0)",
				default: null,
			},
			backgroundColor: {
				"[data-close-confirmation-open]": "rgb(0 0 0 / 10%)",
				"[data-nested-dialog-open]": "rgb(0 0 0 / 10%)",
				default: "rgb(0 0 0 / 0%)",
			},
			content: '""',
			pointerEvents: "none",
			position: "absolute",
			transitionDuration: {
				default: motion.durationMedium,
				"@media (prefers-reduced-motion: reduce)": "0ms",
			},
			transitionProperty: "background-color, opacity",
			transitionTimingFunction: motion.easeOut,
		},
	},
	modalBackdropLayer: {
		zIndex: zIndex.modalBackdropStyles,
	},
	modalLayer: {
		zIndex: zIndex.modal,
	},
	alertBackdropLayer: {
		zIndex: zIndex.alertBackdropStyles,
	},
	alertLayer: {
		zIndex: zIndex.alert,
	},
});

/** Modal enter/exit motion: backdrop fade and surface scale/fade. */
export const modalMotionStyles = stylex.create({
	backdrop: {
		opacity: {
			"[data-ending-style]": 0,
			"[data-starting-style]": 0,
			default: 1,
		},
		transitionDuration: {
			default: motion.durationMedium,
			"@media (prefers-reduced-motion: reduce)": "0ms",
		},
		transitionProperty: "opacity",
		transitionTimingFunction: motion.easeOut,
	},
	popup: {
		opacity: {
			"[data-ending-style]": 0,
			"[data-nested-dialog-open]": "calc(1 - var(--nested-dialogs) * 0.1)",
			"[data-starting-style]": 0,
			default: 1,
		},
		position: "relative",
		transform: {
			"[data-ending-style]": "scale(0.96) translateY(8px)",
			"[data-starting-style]": "scale(0.96) translateY(8px)",
			default: "scale(calc(1 - (0.04 * var(--nested-dialogs, 0)))) translateY(calc(8px * var(--nested-dialogs, 0)))",
		},
		transformOrigin: "center center",
		transitionDuration: {
			default: motion.durationMedium,
			"@media (prefers-reduced-motion: reduce)": "0ms",
		},
		transitionProperty: "opacity, transform",
		transitionTimingFunction: motion.easeOut,
		willChange: "transform, opacity",
	},
});

/** Text roles inside a modal; keep these consistent across dialog kinds. */
const modalTextParts = stylex.create({
	title: {
		margin: 0,
		textWrap: "balance",
	},
	description: {
		margin: 0,
		color: color.fgMuted,
	},
	body: {
		color: color.fg,
	},
	footer: {
		alignItems: "center",
		display: "flex",
		flexWrap: "wrap",
		justifyContent: "flex-end",
	},
});

export const modalTextStyles = {
	title: [headingStyles["6"], modalTextParts.title],
	description: [textStyles.body, modalTextParts.description],
	body: [textStyles.body, modalTextParts.body],
	footer: modalTextParts.footer,
} as const;

/** Apply to a dialog `Backdrop`. */
export const modalBackdropStyles = [modalChromeStyles.backdrop, modalChromeStyles.modalBackdropLayer, modalMotionStyles.backdrop] as const;

/** Apply to an alert dialog `Backdrop`. */
export const alertBackdropStyles = [modalChromeStyles.backdrop, modalChromeStyles.alertBackdropLayer, modalMotionStyles.backdrop] as const;

/** Apply to a dialog viewport wrapper. */
export const modalViewportStyles = [modalChromeStyles.viewport, modalChromeStyles.modalLayer] as const;

/** Apply to an alert dialog viewport wrapper. */
export const alertViewportStyles = [modalChromeStyles.viewport, modalChromeStyles.alertLayer] as const;

/** Apply to a dialog `Popup` surface (chrome plus scale/fade motion). */
export const modalPopupStyles = [modalChromeStyles.surface, modalMotionStyles.popup] as const;
