import * as stylex from "@stylexjs/stylex";

/**
 * Themeable design-token source.
 *
 * Each family exposes its plain defaults next to its typed StyleX variables so
 * themes, documentation, and components all derive from the same values.
 * Palette CSS custom properties remain private implementation details of the
 * semantic color layer in `global.css`.
 */

export const colorDefaults = {
	canvas: "var(--color-canvas)",
	canvasSubtle: "var(--color-canvas-subtle)",
	surface: "var(--color-surface)",
	bgPanel: "var(--color-panel)",
	bgElevated: "var(--color-elevated)",
	bgElevatedActive: "var(--color-elevated-active)",
	surfaceSubtle: "var(--color-surface-subtle)",
	surfaceSubtleHover: "var(--color-surface-subtle-hover)",
	surfaceSubtleActive: "var(--color-surface-subtle-active)",
	highlight: "var(--color-highlight)",
	fg: "var(--color-text)",
	fgMuted: "var(--color-text-muted)",
	fgSubtle: "var(--color-text-subtle)",
	fgAccent: "var(--color-text-accent)",
	fgAccentStrong: "var(--color-text-accent-strong)",
	fgAccentHover: "var(--color-text-accent-hover)",
	border: "var(--gray-a2)",
	borderStrong: "var(--gray-a4)",
	borderHover: "var(--gray-a5)",
	borderDisabled: "var(--gray-a1)",
	bgAccent: "var(--color-accent)",
	bgAccentHover: "var(--color-accent-hover)",
	bgAccentSoft: "var(--color-accent-soft)",
	bgAccentSoftHover: "var(--color-accent-soft-hover)",
	bgAccentMuted: "var(--color-accent-muted)",
	fgAccentContrast: "var(--color-accent-contrast)",
	bgNeutral: "var(--color-neutral)",
	bgNeutralStrong: "var(--color-neutral-strong)",
	fgNeutralContrast: "var(--color-neutral-contrast)",
	bgDanger: "var(--color-danger)",
	fgDanger: "var(--color-text-danger)",
	bgDangerSubtle: "var(--color-danger-subtle)",
	fgSuccess: "var(--color-text-success)",
	bgSuccess: "var(--color-success)",
	bgSuccessSubtle: "var(--color-success-subtle)",
	fgWarning: "var(--color-text-warning)",
	bgWarning: "var(--color-warning)",
	bgWarningSubtle: "var(--color-warning-subtle)",
	bgInverse: "var(--color-inverse-surface)",
	fgInverse: "var(--color-inverse-text)",
	fgInverseMuted: "var(--color-inverse-text-muted)",
	focus: "var(--color-focus)",
	overlay: "var(--color-overlay)",
	fillTrack: "var(--color-fill-track)",
	fillDisabled: "var(--color-fill-disabled)",
	bgTooltip: "var(--color-tooltip)",
	fgWarningContrast: "var(--color-warning-contrast)",
} as const;

export const color = stylex.defineVars(colorDefaults);

export const spaceDefaults = {
	0: "0",
	0.5: "0.125rem",
	1: "0.25rem",
	1.5: "0.375rem",
	2: "0.5rem",
	3: "0.75rem",
	3.5: "0.875rem",
	4: "1rem",
	5: "1.25rem",
	6: "1.5rem",
	7: "1.75rem",
	8: "2rem",
	9: "2.25rem",
	10: "2.5rem",
	12: "3rem",
	16: "4rem",
	x1: "0.25rem",
	x1_5: "0.375rem",
	x2: "0.5rem",
	x3: "0.75rem",
	x4: "1rem",
	x5: "1.25rem",
	x6: "1.5rem",
	x7: "1.75rem",
	x8: "2rem",
	x9: "2.25rem",
	x10: "2.5rem",
	x12: "3rem",
	x16: "4rem",
} as const;

export const space = stylex.defineVars(spaceDefaults);

export const sizeDefaults = {
	full: "100%",
	"container.xs": "20rem",
	"container.sm": "24rem",
	"container.md": "28rem",
	"container.lg": "32rem",
	"container.xl": "36rem",
	"container.2xl": "42rem",
	"container.3xl": "48rem",
	"container.4xl": "56rem",
	"container.5xl": "64rem",
	"container.6xl": "72rem",
	"container.7xl": "80rem",
	"control.xs": "1.5rem",
	"control.sm": "1.75rem",
	"control.md": "2rem",
	"control.lg": "2.5rem",
	"indicator.sm": "1rem",
	"indicator.md": "1.125rem",
} as const;

export const size = stylex.defineVars(sizeDefaults);

export const borderDefaults = {
	width: "1px",
} as const;

export const border = stylex.defineVars(borderDefaults);

export const radiusDefaults = {
	xxs: "0.1875rem",
	xs: "0.3125rem",
	sm: "0.4375rem",
	md: "0.6875rem",
	lg: "0.9375rem",
	xl: "1.6875rem",
	full: "9999rem",
} as const;

export const radius = stylex.defineVars(radiusDefaults);

export const shadowDefaults = {
	inset:
		"var(--shadow-inset-ring), inset 0 0 0 1px rgba(0,0,0,0.086), inset 0 1.5px 2px 0 rgba(0,0,0,0.12), inset 0 1.5px 2px 0 rgba(0,0,0,0.02)",
	xs: "0 2px 2px -1px rgba(0,0,0,0.06), 0 1px var(--black-a1), 0 -1px var(--white-a3), 0 0 0 1px var(--gray-a1)",
	sm: "0px 2px 3px -1px rgba(0,0,0,0.1),0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08), var(--shadow-ring)",
	md: "0px 0px 0px 1px rgba(0,0,0,0.06), 0px 1px 1px -0.5px rgba(0,0,0,0.06), 0px 3px 3px -1.5px rgba(0,0,0,0.06), 0px 6px 6px -3px rgba(0,0,0,0.06), 0px 12px 12px -6px rgba(0,0,0,0.06), 0px 24px 24px -12px rgba(0,0,0,0.06), var(--shadow-ring)",
	lg: "0 2.8px 2.2px rgba(0, 0, 0, 0.034), 0 6.7px 5.3px rgba(0, 0, 0, 0.048), 0 12.5px 10px rgba(0, 0, 0, 0.06), 0 22.3px 17.9px rgba(0, 0, 0, 0.072), 0 41.8px 33.4px rgba(0, 0, 0, 0.086), 0 100px 80px rgba(0, 0, 0, 0.12), var(--shadow-ring)",
} as const;

export const shadow = stylex.defineVars(shadowDefaults);

export const fontFamilyDefaults = {
	sans: "var(--font-sans)",
	serif: "var(--font-serif)",
	mono: "var(--font-mono)",
} as const;

export const fontFamily = stylex.defineVars(fontFamilyDefaults);

// Radix Themes type scale:
// https://www.radix-ui.com/themes/docs/theme/typography#type-scale
export const fontSizeDefaults = {
	x1: "0.75rem",
	x2: "0.875rem",
	x3: "1rem",
	x4: "1.125rem",
	x5: "1.25rem",
	x6: "1.5rem",
	x7: "1.75rem",
	x8: "2.1875rem",
	x9: "3.75rem",
} as const;

export const fontSize = stylex.defineVars(fontSizeDefaults);

export const lineHeightDefaults = {
	x1: "1rem",
	x2: "1.25rem",
	x3: "1.5rem",
	x4: "1.625rem",
	x5: "1.75rem",
	x6: "1.875rem",
	x7: "2.25rem",
	x8: "2.5rem",
	x9: "3.75rem",
} as const;

export const lineHeight = stylex.defineVars(lineHeightDefaults);

export const letterSpacingDefaults = {
	x1: "0.0025em",
	x2: "-.001em",
	x3: "-.001em",
	x4: "-0.0025em",
	x5: "-0.005em",
	x6: "-0.00625em",
	x7: "-0.0075em",
	x8: "-0.01em",
	x9: "-0.025em",
} as const;

export const letterSpacing = stylex.defineVars(letterSpacingDefaults);

export const fontWeightDefaults = {
	regular: "400",
	medium: "500",
	semibold: "600",
	bold: "700",
} as const;

export const fontWeight = stylex.defineVars(fontWeightDefaults);

/**
 * Semantic text roles. Raw scale tokens remain available for Text's explicit
 * size escape hatch; component chrome should prefer these role tokens.
 */
export const typeScaleDefaults = {
	bodySize: fontSize.x2,
	bodyLineHeight: lineHeight.x2,
	bodyLetterSpacing: letterSpacing.x2,
	bodyWeight: fontWeight.regular,
	largeSize: fontSize.x3,
	largeLineHeight: lineHeight.x3,
	largeLetterSpacing: letterSpacing.x3,
	largeWeight: fontWeight.regular,
	labelSize: fontSize.x2,
	labelLineHeight: lineHeight.x2,
	labelLetterSpacing: letterSpacing.x2,
	labelWeight: fontWeight.medium,
	supportingSize: fontSize.x1,
	supportingLineHeight: lineHeight.x1,
	supportingLetterSpacing: letterSpacing.x1,
	supportingWeight: fontWeight.regular,
	codeSize: fontSize.x2,
	codeLineHeight: lineHeight.x2,
	codeLetterSpacing: letterSpacing.x2,
	codeWeight: fontWeight.regular,
	display1Size: fontSize.x9,
	display1LineHeight: lineHeight.x9,
	display1LetterSpacing: letterSpacing.x9,
	display1Weight: fontWeight.regular,
	display2Size: fontSize.x8,
	display2LineHeight: lineHeight.x8,
	display2LetterSpacing: letterSpacing.x8,
	display2Weight: fontWeight.regular,
	display3Size: fontSize.x7,
	display3LineHeight: lineHeight.x7,
	display3LetterSpacing: letterSpacing.x7,
	display3Weight: fontWeight.regular,
	heading1Size: fontSize.x9,
	heading1LineHeight: lineHeight.x9,
	heading1LetterSpacing: letterSpacing.x9,
	heading1Weight: fontWeight.semibold,
	heading2Size: fontSize.x8,
	heading2LineHeight: lineHeight.x8,
	heading2LetterSpacing: letterSpacing.x8,
	heading2Weight: fontWeight.semibold,
	heading3Size: fontSize.x7,
	heading3LineHeight: lineHeight.x7,
	heading3LetterSpacing: letterSpacing.x7,
	heading3Weight: fontWeight.semibold,
	heading4Size: fontSize.x6,
	heading4LineHeight: lineHeight.x6,
	heading4LetterSpacing: letterSpacing.x6,
	heading4Weight: fontWeight.semibold,
	heading5Size: fontSize.x5,
	heading5LineHeight: lineHeight.x5,
	heading5LetterSpacing: letterSpacing.x5,
	heading5Weight: fontWeight.semibold,
	heading6Size: fontSize.x4,
	heading6LineHeight: lineHeight.x4,
	heading6LetterSpacing: letterSpacing.x4,
	heading6Weight: fontWeight.semibold,
} as const;

export const typeScale = stylex.defineVars(typeScaleDefaults);

export const motionDefaults = {
	durationPopup: "100ms",
	durationQuick: "120ms",
	durationShort: "180ms",
	durationMedium: "250ms",
	durationContent: "350ms",
	durationLong: "450ms",
	easePopup: "ease-out",
	easeOut: "cubic-bezier(0.16, 1, 0.3, 1)",
	easeSmoothOut: "cubic-bezier(0.22, 1, 0.36, 1)",
} as const;

export const motion = stylex.defineVars(motionDefaults);
