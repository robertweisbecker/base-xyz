import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentProps } from "react";
import { color, radius as radiusToken, space, shadow } from "@/styles/tokens.stylex";
import { fontSize, fontWeight, letterSpacing, lineHeight } from "@/styles/tokens.stylex";
import { cardVars } from "./card-vars.stylex";

type StyledProps<T> = Omit<T, "style"> & {
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

type DivProps = StyledProps<ComponentProps<"div">>;

export type CardVariant = "elevated" | "outline";
export type CardSize = keyof typeof cardSizeVariants;
export type CardRadius = keyof typeof cardRadiusVariants;

export type CardProps = DivProps & {
	radius?: CardRadius;
	size?: CardSize;
	variant?: CardVariant;
};

export function Card({ className, radius = "lg", size = "md", style, variant = "elevated", ...props }: CardProps) {
	const sx = stylex.props(
		cardParts.root,
		cardSizeVariants[size],
		cardRadiusVariants[radius],
		cardVariants[variant],
		style,
	);

	return <div className={[sx.className, className].filter(Boolean).join(" ")} style={sx.style} {...props} />;
}

export function CardHeader({ className, style, ...props }: DivProps) {
	const sx = stylex.props(cardParts.header, style);

	return <div className={[sx.className, className].filter(Boolean).join(" ")} style={sx.style} {...props} />;
}

export function CardTitle({ className, style, ...props }: StyledProps<ComponentProps<"h3">>) {
	const sx = stylex.props(cardParts.title, style);

	return <h3 className={[sx.className, className].filter(Boolean).join(" ")} style={sx.style} {...props} />;
}

export function CardDescription({ className, style, ...props }: StyledProps<ComponentProps<"p">>) {
	const sx = stylex.props(cardParts.description, style);

	return <p className={[sx.className, className].filter(Boolean).join(" ")} style={sx.style} {...props} />;
}

export function CardContent({ className, style, ...props }: DivProps) {
	const sx = stylex.props(cardParts.content, style);

	return <div className={[sx.className, className].filter(Boolean).join(" ")} style={sx.style} {...props} />;
}

export function CardFooter({ className, style, ...props }: DivProps) {
	const sx = stylex.props(cardParts.footer, style);

	return <div className={[sx.className, className].filter(Boolean).join(" ")} style={sx.style} {...props} />;
}

const cardParts = stylex.create({
	root: {
		borderRadius: cardVars.radius,
		gap: space.x1,
		overflow: "hidden",
		color: color.fg,
		display: "flex",
		flexDirection: "column",
		isolation: "isolate",
	},
	header: {
		gap: cardVars.headerGap,
		paddingInline: cardVars.headerPaddingInline,
		display: "flex",
		flexDirection: "column",
		paddingBlockStart: cardVars.headerPaddingBlockStart,
	},
	title: {
		margin: 0,
		color: color.fg,
		fontSize: cardVars.titleFontSize,
		fontWeight: fontWeight.semibold,
		letterSpacing: cardVars.titleLetterSpacing,
		lineHeight: cardVars.titleLineHeight,
		textWrap: "balance",
	},
	description: {
		margin: 0,
		color: color.fgMuted,
		fontSize: cardVars.descriptionFontSize,
		letterSpacing: cardVars.descriptionLetterSpacing,
		lineHeight: cardVars.descriptionLineHeight,
	},
	content: {
		paddingBlock: cardVars.contentPaddingBlock,
		paddingInline: cardVars.contentPaddingInline,
		fontSize: cardVars.contentFontSize,
		letterSpacing: cardVars.contentLetterSpacing,
		lineHeight: cardVars.contentLineHeight,
	},
	footer: {
		margin: "1px",
		gap: space.x3,
		paddingInline: cardVars.footerPaddingInline,
		alignItems: "center",
		backgroundColor: color.canvas,
		display: "flex",
		paddingBlockEnd: cardVars.footerPaddingBlock,
		paddingBlockStart: `calc(${cardVars.footerPaddingBlock} / 2)`,
		borderBottomLeftRadius: `calc(${cardVars.radius} - 1px)`,
		borderBottomRightRadius: `calc(${cardVars.radius} - 1px)`,
	},
});

const cardSizeVariants = stylex.create({
	sm: {
		[cardVars.contentFontSize]: fontSize.x1,
		[cardVars.contentLetterSpacing]: letterSpacing.x1,
		[cardVars.contentLineHeight]: lineHeight.x1,
		[cardVars.contentPaddingBlock]: space.x4,
		[cardVars.contentPaddingInline]: space.x4,
		[cardVars.descriptionFontSize]: fontSize.x1,
		[cardVars.descriptionLetterSpacing]: letterSpacing.x1,
		[cardVars.descriptionLineHeight]: lineHeight.x1,
		[cardVars.footerPaddingBlock]: space.x2,
		[cardVars.footerPaddingInline]: space.x2,
		[cardVars.headerGap]: space.x1,
		[cardVars.headerPaddingBlockStart]: space.x4,
		[cardVars.headerPaddingInline]: space.x4,
		[cardVars.titleFontSize]: fontSize.x2,
		[cardVars.titleLetterSpacing]: letterSpacing.x2,
		[cardVars.titleLineHeight]: lineHeight.x2,
	},
	md: {
		[cardVars.contentFontSize]: fontSize.x2,
		[cardVars.contentLetterSpacing]: letterSpacing.x2,
		[cardVars.contentLineHeight]: lineHeight.x2,
		[cardVars.contentPaddingBlock]: space.x5,
		[cardVars.contentPaddingInline]: space.x5,
		[cardVars.descriptionFontSize]: fontSize.x2,
		[cardVars.descriptionLetterSpacing]: letterSpacing.x2,
		[cardVars.descriptionLineHeight]: lineHeight.x2,
		[cardVars.footerPaddingBlock]: space.x3,
		[cardVars.footerPaddingInline]: space.x3,
		[cardVars.headerGap]: space.x1,
		[cardVars.headerPaddingBlockStart]: space.x5,
		[cardVars.headerPaddingInline]: space.x5,
		[cardVars.titleFontSize]: fontSize.x3,
		[cardVars.titleLetterSpacing]: letterSpacing.x3,
		[cardVars.titleLineHeight]: lineHeight.x3,
	},
	lg: {
		[cardVars.contentFontSize]: fontSize.x3,
		[cardVars.contentLetterSpacing]: letterSpacing.x3,
		[cardVars.contentLineHeight]: lineHeight.x3,
		[cardVars.contentPaddingBlock]: space.x6,
		[cardVars.contentPaddingInline]: space.x6,
		[cardVars.descriptionFontSize]: fontSize.x3,
		[cardVars.descriptionLetterSpacing]: letterSpacing.x3,
		[cardVars.descriptionLineHeight]: lineHeight.x3,
		[cardVars.footerPaddingBlock]: space.x4,
		[cardVars.footerPaddingInline]: space.x4,
		[cardVars.headerGap]: space.x2,
		[cardVars.headerPaddingBlockStart]: space.x6,
		[cardVars.headerPaddingInline]: space.x6,
		[cardVars.titleFontSize]: fontSize.x4,
		[cardVars.titleLetterSpacing]: letterSpacing.x3,
		[cardVars.titleLineHeight]: lineHeight.x4,
	},
});

const cardRadiusVariants = stylex.create({
	xxs: {
		[cardVars.radius]: radiusToken.xxs,
	},
	xs: {
		[cardVars.radius]: radiusToken.xs,
	},
	sm: {
		[cardVars.radius]: radiusToken.sm,
	},
	md: {
		[cardVars.radius]: radiusToken.md,
	},
	lg: {
		[cardVars.radius]: radiusToken.lg,
	},
	xl: {
		[cardVars.radius]: radiusToken.xl,
	},
	full: {
		[cardVars.radius]: radiusToken.full,
	},
});

const cardVariants = stylex.create({
	elevated: {
		borderWidth: 0,
		boxShadow: shadow.md,
		backgroundColor: color.bgElevated,
	},
	outline: {
		borderColor: color.border,
		borderStyle: "solid",
		borderWidth: "1px",
		boxShadow: "none",
		backgroundColor: color.surface,
	},
});
