import * as stylex from "@stylexjs/stylex";
import { tokens } from "@/theme/tokens.stylex";

export const cardVars = stylex.defineVars({
	contentFontSize: tokens["--font-size-2"],
	contentLetterSpacing: tokens["--letter-spacing-2"],
	contentLineHeight: tokens["--line-height-2"],
	contentPaddingBlock: tokens["--space-5"],
	contentPaddingInline: tokens["--space-5"],
	footerPaddingBlock: tokens["--space-3"],
	footerPaddingInline: tokens["--space-3"],
	headerGap: tokens["--space-1"],
	headerPaddingBlock: tokens["--space-5"],
	headerPaddingInline: tokens["--space-5"],
});
