import * as stylex from "@stylexjs/stylex";
import { radius, space } from "@/styles/tokens.stylex";
import { fontSize, letterSpacing, lineHeight } from "@/styles/tokens.stylex";

export const cardVars = stylex.defineVars({
	contentFontSize: fontSize.x2,
	contentLetterSpacing: letterSpacing.x2,
	contentLineHeight: lineHeight.x2,
	contentPaddingBlock: space.x5,
	contentPaddingInline: space.x5,
	descriptionFontSize: fontSize.x2,
	descriptionLetterSpacing: letterSpacing.x2,
	descriptionLineHeight: lineHeight.x2,
	footerPaddingBlock: space.x3,
	footerPaddingInline: space.x3,
	headerGap: space.x1,
	headerPaddingBlockStart: space.x5,
	headerPaddingInline: space.x5,
	radius: radius.lg,
	titleFontSize: fontSize.x3,
	titleLetterSpacing: letterSpacing.x3,
	titleLineHeight: lineHeight.x3,
});
