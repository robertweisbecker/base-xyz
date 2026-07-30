import * as stylex from "@stylexjs/stylex";
import { color } from "../tokens.stylex";

/**
 * Focus rings must look identical on every control, so they are centrally
 * owned here. Pick by where the ring should sit:
 *
 * - `inset` — ring drawn just inside the edge; for bordered controls (inputs,
 *   triggers) where an outer ring would clip against neighbors.
 * - `outset` — ring offset outside the edge; for filled or borderless controls
 *   (buttons, links, toolbar items).
 * - `within` — ring on a wrapper when a descendant input holds focus (input
 *   groups, composite fields).
 */
export const focusRing = stylex.create({
	inset: {
		outlineColor: {
			default: "transparent",
			":focus-visible": color.focus,
			':focus-visible[aria-invalid="true"]': color.bgDanger,
			":focus-visible[data-invalid]": color.bgDanger,
		},
		outlineOffset: "-1px",
		outlineStyle: "solid",
		outlineWidth: "2px",
		zIndex: {
			default: null,
			":focus-visible": 1,
		},
	},
	outset: {
		outlineColor: {
			default: "transparent",
			":focus-visible": color.focus,
			':focus-visible[aria-invalid="true"]': color.bgDanger,
			":focus-visible[data-invalid]": color.bgDanger,
		},
		outlineOffset: "2px",
		outlineStyle: "solid",
		outlineWidth: "2px",
	},
	within: {
		outlineColor: {
			default: "transparent",
			":focus-within": color.focus,
			':focus-within:has([aria-invalid="true"])': color.bgDanger,
			":focus-within:has([data-invalid])": color.bgDanger,
			":focus-within[data-invalid]": color.bgDanger,
		},
		outlineOffset: "-1px",
		outlineStyle: "solid",
		outlineWidth: "2px",
	},
});
