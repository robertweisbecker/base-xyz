import * as stylex from "@stylexjs/stylex";
import { colors } from "../tokens.stylex";

/**
 * Focus rings must look identical on every control, so they are centrally
 * owned here. Pick by where the ring should sit:
 *
 * - `inset` — ring drawn just inside the edge; for bordered controls (inputs,
 *   triggers) where an outer ring would clip against neighbors.
 * - `outset` — ring offset outside the edge; for filled or borderless controls
 *   (buttons, links, toolbar items).
 * - `outsetInteractive` — the same outset ring, limited to elements that
 *   ultimately render as a native button or link.
 * - `within` — ring on a wrapper when a descendant input holds focus (input
 *   groups, composite fields).
 */
export const focusRing = stylex.create({
	inset: {
		outlineColor: {
			default: "transparent",
			":focus-visible": colors["--focus"],
			':focus-visible[aria-invalid="true"]': colors["--danger"],
			":focus-visible[data-invalid]": colors["--danger"],
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
			":focus-visible": colors["--focus"],
			':focus-visible[aria-invalid="true"]': colors["--danger"],
			":focus-visible[data-invalid]": colors["--danger"],
		},
		outlineOffset: "2px",
		outlineStyle: "solid",
		outlineWidth: "2px",
	},
	outsetInteractive: {
		outlineColor: {
			default: "transparent",
			":is(button, a[href]):focus-visible": colors["--focus"],
		},
		outlineOffset: "2px",
		outlineStyle: "solid",
		outlineWidth: "2px",
	},
	within: {
		outlineColor: {
			default: "transparent",
			":focus-within": colors["--focus"],
			':focus-within:has([aria-invalid="true"])': colors["--danger"],
			":focus-within:has([data-invalid])": colors["--danger"],
			":focus-within[data-invalid]": colors["--danger"],
		},
		outlineOffset: "-1px",
		outlineStyle: "solid",
		outlineWidth: "2px",
	},
});
