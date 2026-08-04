import * as stylex from "@stylexjs/stylex";
import { tokens } from "@/theme/tokens.stylex";

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
			":focus-visible": tokens["--focus"],
			':focus-visible[aria-invalid="true"]': tokens["--bg-error-primary"],
			":focus-visible[data-invalid]": tokens["--bg-error-primary"],
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
			":focus-visible": tokens["--focus"],
			':focus-visible[aria-invalid="true"]': tokens["--bg-error-primary"],
			":focus-visible[data-invalid]": tokens["--bg-error-primary"],
		},
		outlineOffset: "2px",
		outlineStyle: "solid",
		outlineWidth: "2px",
	},
	outsetInteractive: {
		outlineColor: {
			default: "transparent",
			":is(button, a[href]):focus-visible": tokens["--focus"],
		},
		outlineOffset: "2px",
		outlineStyle: "solid",
		outlineWidth: "2px",
	},
	within: {
		outlineColor: {
			default: "transparent",
			":focus-within": tokens["--focus"],
			':focus-within:has([aria-invalid="true"])': tokens["--bg-error-primary"],
			":focus-within:has([data-invalid])": tokens["--bg-error-primary"],
			":focus-within[data-invalid]": tokens["--bg-error-primary"],
		},
		outlineOffset: "-1px",
		outlineStyle: "solid",
		outlineWidth: "2px",
	},
});
