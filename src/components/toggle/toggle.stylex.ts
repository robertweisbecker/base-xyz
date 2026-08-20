import * as stylex from "@stylexjs/stylex";
import { tokens } from "@/theme/tokens.stylex";

/** Marker for Toggle controls observed by joined-group sibling and ancestor rules. */
export const toggleMarker = stylex.defineMarker();

/** Marker for ToggleGroup roots observed by descendant join radius and origin styles. */
export const toggleGroupMarker = stylex.defineMarker();

const TOGGLE_PRESSED = ':is([aria-pressed="true"], [data-pressed])';
/** Button already sets `data-variant`; StyleX self-conditions use `:is(...)` like the pressed selector. */
const GHOST = ':is([data-variant="ghost"])';
const NOT_GHOST = ':not(:is([data-variant="ghost"]))';

/** Non-ghost inner start: always 0, including when selected. First-child keeps the group outer start. */
const NOT_GHOST_NOT_FIRST = `${NOT_GHOST}:not(:first-child)`;
/** Non-ghost inner end: always 0, including when selected. Last-child keeps the group outer end. */
const NOT_GHOST_NOT_LAST = `${NOT_GHOST}:not(:last-child)`;
/** Ghost selected + next sibling selected → zero end radius. */
const GHOST_NEXT_SELECTED = `${GHOST}:has(+ ${TOGGLE_PRESSED})`;
/** Ghost immediately after a selected sibling → zero start radius. */
const GHOST_PREV_SELECTED = `:where(${TOGGLE_PRESSED} + ${GHOST})`;
/** Ghost unselected, not first: zero start/inner radius only. Selected ghost restores radius unless the previous sibling is selected. */
const GHOST_UNSELECTED_NOT_FIRST = `${GHOST}:not(:first-child):not(${TOGGLE_PRESSED})`;
/** Ghost unselected, not last: zero end/inner radius only. Selected ghost restores radius unless the next sibling is selected. */
const GHOST_UNSELECTED_NOT_LAST = `${GHOST}:not(:last-child):not(${TOGGLE_PRESSED})`;
/** First in a group with a sibling. `:only-child` is also `:last-child`, so it stays center. */
const GROUP_FIRST = ":first-child:not(:last-child)";
/** Last in a group with a sibling. `:only-child` is also `:first-child`, so it stays center. */
const GROUP_LAST = ":last-child:not(:first-child)";

export const toggleGroupStyles = stylex.create({
	root: {
		gap: {
			"[data-join]": 0,
			default: tokens["--space-0-5"],
		},
		alignItems: "stretch",
		display: "inline-flex",
		flexDirection: {
			"[data-orientation=vertical]": "column",
			default: "row",
		},
		isolation: {
			"[data-join]": "isolate",
			default: "auto",
		},
	},
});

export const toggleJoinStyles = stylex.create({
	root: {
		transformOrigin: {
			// eslint-disable-next-line @stylexjs/valid-styles -- nested when() conditions; the compiler supports this, the lint rule does not.
			[stylex.when.ancestor("[data-orientation=horizontal]", toggleGroupMarker)]: {
				[GROUP_FIRST]: "right center",
				[GROUP_LAST]: "left center",
				default: null,
			},
			// eslint-disable-next-line @stylexjs/valid-styles -- nested when() conditions; the compiler supports this, the lint rule does not.
			[stylex.when.ancestor("[data-orientation=vertical]", toggleGroupMarker)]: {
				[GROUP_FIRST]: "center bottom",
				[GROUP_LAST]: "center top",
				default: null,
			},
		},
		borderEndEndRadius: {
			// eslint-disable-next-line @stylexjs/valid-styles -- nested when() conditions; the compiler supports this, the lint rule does not.
			[stylex.when.ancestor("[data-join][data-orientation=horizontal]", toggleGroupMarker)]: {
				[NOT_GHOST_NOT_LAST]: 0,
				[GHOST_NEXT_SELECTED]: 0,
				[GHOST_UNSELECTED_NOT_LAST]: 0,
				default: null,
			},
			// eslint-disable-next-line @stylexjs/valid-styles -- nested when() conditions; the compiler supports this, the lint rule does not.
			[stylex.when.ancestor("[data-join][data-orientation=vertical]", toggleGroupMarker)]: {
				[NOT_GHOST_NOT_LAST]: 0,
				[GHOST_NEXT_SELECTED]: 0,
				[GHOST_UNSELECTED_NOT_LAST]: 0,
				default: null,
			},
		},
		borderEndStartRadius: {
			// eslint-disable-next-line @stylexjs/valid-styles -- nested when() conditions; the compiler supports this, the lint rule does not.
			[stylex.when.ancestor("[data-join][data-orientation=horizontal]", toggleGroupMarker)]: {
				[NOT_GHOST_NOT_FIRST]: 0,
				[GHOST_PREV_SELECTED]: 0,
				[GHOST_UNSELECTED_NOT_FIRST]: 0,
				default: null,
			},
			// eslint-disable-next-line @stylexjs/valid-styles -- nested when() conditions; the compiler supports this, the lint rule does not.
			[stylex.when.ancestor("[data-join][data-orientation=vertical]", toggleGroupMarker)]: {
				[NOT_GHOST_NOT_LAST]: 0,
				[GHOST_NEXT_SELECTED]: 0,
				[GHOST_UNSELECTED_NOT_LAST]: 0,
				default: null,
			},
		},
		borderStartEndRadius: {
			// eslint-disable-next-line @stylexjs/valid-styles -- nested when() conditions; the compiler supports this, the lint rule does not.
			[stylex.when.ancestor("[data-join][data-orientation=horizontal]", toggleGroupMarker)]: {
				[NOT_GHOST_NOT_LAST]: 0,
				[GHOST_NEXT_SELECTED]: 0,
				[GHOST_UNSELECTED_NOT_LAST]: 0,
				default: null,
			},
			// eslint-disable-next-line @stylexjs/valid-styles -- nested when() conditions; the compiler supports this, the lint rule does not.
			[stylex.when.ancestor("[data-join][data-orientation=vertical]", toggleGroupMarker)]: {
				[NOT_GHOST_NOT_FIRST]: 0,
				[GHOST_PREV_SELECTED]: 0,
				[GHOST_UNSELECTED_NOT_FIRST]: 0,
				default: null,
			},
		},
		borderStartStartRadius: {
			// eslint-disable-next-line @stylexjs/valid-styles -- nested when() conditions; the compiler supports this, the lint rule does not.
			[stylex.when.ancestor("[data-join][data-orientation=horizontal]", toggleGroupMarker)]: {
				[NOT_GHOST_NOT_FIRST]: 0,
				[GHOST_PREV_SELECTED]: 0,
				[GHOST_UNSELECTED_NOT_FIRST]: 0,
				default: null,
			},
			// eslint-disable-next-line @stylexjs/valid-styles -- nested when() conditions; the compiler supports this, the lint rule does not.
			[stylex.when.ancestor("[data-join][data-orientation=vertical]", toggleGroupMarker)]: {
				[NOT_GHOST_NOT_FIRST]: 0,
				[GHOST_PREV_SELECTED]: 0,
				[GHOST_UNSELECTED_NOT_FIRST]: 0,
				default: null,
			},
		},
		zIndex: {
			// eslint-disable-next-line @stylexjs/valid-styles -- nested when() conditions; the compiler supports this, the lint rule does not.
			[stylex.when.ancestor("[data-join]", toggleGroupMarker)]: {
				[TOGGLE_PRESSED]: 2,
				default: 0,
				":focus-visible": 10,
				":hover": 1,
			},
		},
	},
});
