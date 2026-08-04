import * as stylex from "@stylexjs/stylex";
import { space } from "@/styles/tokens.stylex";
import { fontSize, letterSpacing, lineHeight } from "@/styles/tokens.stylex";

export const cardVars = stylex.defineVars({
	contentFontSize: fontSize.x2,
	contentLetterSpacing: letterSpacing.x2,
	contentLineHeight: lineHeight.x2,
	contentPaddingBlock: space[5],
	contentPaddingInline: space[5],
	footerPaddingBlock: space[3],
	footerPaddingInline: space[3],
	headerGap: space[1],
	headerPaddingBlock: space[5],
	headerPaddingInline: space[5],
});
