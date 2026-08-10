import * as stylex from "@stylexjs/stylex";

/** Marker for detecting descendants of Button / IconButton (including CloseButton) via `stylex.when.ancestor`. */
export const buttonMarker = stylex.defineMarker();
