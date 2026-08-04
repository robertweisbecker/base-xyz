import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentProps } from "react";
import { composeThemeProps, resolveThemeProps, type VerifyThemeProps } from "@/theme/theme-props";
import {
	childLayoutThemeProps,
	displayThemeProps,
	horizontalFlexThemeProps,
	positioningThemeProps,
	sizingThemeProps,
	verticalFlexThemeProps,
} from "@/styles/theme-props-layout.stylex";
import { spacingThemeProps } from "@/styles/theme-props-spacing.stylex";
import { radiusThemeProps, shadowThemeProps } from "@/styles/theme-props-surface.stylex";
import type {
	ChildLayoutProps,
	DisplayProps,
	FlexProps,
	PositioningProps,
	RadiusValue,
	RadiusThemeProps,
	ShadowThemeProps,
	SizingProps,
	SpacingProps,
} from "@/theme/theme-props.types";
import { colors, space, shadow } from "@/styles/tokens.stylex";
import { fontSize, letterSpacing, lineHeight } from "@/styles/tokens.stylex";
import { Heading, type HeadingProps } from "../heading/heading";
import { Text, type TextProps } from "../text/text";
import { cardVars } from "./card-vars.stylex";

type StyledProps<T, ThemeProps = {}> = Omit<
	T,
	"align" | "className" | "color" | "height" | "style" | "width" | keyof ThemeProps
> &
	ThemeProps & {
		className?: string;
		/** StyleX overrides, applied after the component's own styles. */
		style?: StyleXStyles;
	};

export type CardVariant = "elevated" | "outline";
export type CardSize = keyof typeof cardSizeVariants;
export type CardRadius = RadiusValue;
export interface CardThemeProps
	extends
		SpacingProps,
		SizingProps,
		PositioningProps,
		ChildLayoutProps,
		RadiusThemeProps,
		ShadowThemeProps,
		FlexProps,
		DisplayProps {}
interface CardSectionThemeProps extends SpacingProps, FlexProps {}
interface CardContentThemeProps extends SpacingProps, SizingProps, PositioningProps, ChildLayoutProps {}

const cardThemeProps = composeThemeProps(
	spacingThemeProps,
	sizingThemeProps,
	positioningThemeProps,
	childLayoutThemeProps,
	radiusThemeProps,
	shadowThemeProps,
	verticalFlexThemeProps,
	displayThemeProps,
);
const cardHeaderThemeProps = composeThemeProps(spacingThemeProps, verticalFlexThemeProps);
const cardFooterThemeProps = composeThemeProps(spacingThemeProps, horizontalFlexThemeProps);
const cardContentThemeProps = composeThemeProps(
	spacingThemeProps,
	sizingThemeProps,
	positioningThemeProps,
	childLayoutThemeProps,
);
type VerifiedCardThemeProps = VerifyThemeProps<CardThemeProps, typeof cardThemeProps>;
type VerifiedCardSectionThemeProps = VerifyThemeProps<CardSectionThemeProps, typeof cardHeaderThemeProps>;
type VerifiedCardFooterThemeProps = VerifyThemeProps<CardSectionThemeProps, typeof cardFooterThemeProps>;
type VerifiedCardContentThemeProps = VerifyThemeProps<CardContentThemeProps, typeof cardContentThemeProps>;

export type CardProps = StyledProps<ComponentProps<"div">, VerifiedCardThemeProps> & {
	size?: CardSize;
	variant?: CardVariant;
};
export type CardHeaderProps = StyledProps<ComponentProps<"div">, VerifiedCardSectionThemeProps>;
export type CardFooterProps = StyledProps<ComponentProps<"div">, VerifiedCardFooterThemeProps>;
export type CardContentProps = StyledProps<ComponentProps<"div">, VerifiedCardContentThemeProps>;
export type CardTitleProps = HeadingProps;
export type CardDescriptionProps = TextProps;

export function Card({ className, radius = "lg", size = "md", style, variant = "elevated", ...props }: CardProps) {
	const { restProps, styles } = resolveThemeProps({ ...props, radius }, cardThemeProps);
	const sx = stylex.props(cardParts.root, cardSizeVariants[size], cardVariants[variant], ...styles, style);

	return <div className={[sx.className, className].filter(Boolean).join(" ")} style={sx.style} {...restProps} />;
}

export function CardHeader({ className, style, ...props }: CardHeaderProps) {
	const { restProps, styles } = resolveThemeProps(props, cardHeaderThemeProps);
	const sx = stylex.props(cardParts.header, ...styles, style);

	return <div className={[sx.className, className].filter(Boolean).join(" ")} style={sx.style} {...restProps} />;
}

export function CardTitle(props: CardTitleProps) {
	return <Heading render={<h3 />} size="3" {...props} />;
}

export function CardDescription(props: CardDescriptionProps) {
	return <Text size="2" color="muted" {...props} />;
}

export function CardContent({ className, style, ...props }: CardContentProps) {
	const { restProps, styles } = resolveThemeProps(props, cardContentThemeProps);
	const sx = stylex.props(cardParts.content, ...styles, style);

	return <div className={[sx.className, className].filter(Boolean).join(" ")} style={sx.style} {...restProps} />;
}

export function CardFooter({ className, style, ...props }: CardFooterProps) {
	const { restProps, styles } = resolveThemeProps(props, cardFooterThemeProps);
	const sx = stylex.props(cardParts.footer, ...styles, style);

	return <div className={[sx.className, className].filter(Boolean).join(" ")} style={sx.style} {...restProps} />;
}

const cardParts = stylex.create({
	root: {
		gap: space[1],
		overflow: "hidden",
		color: colors["--text"],
		display: "flex",
		flexDirection: "column",
		isolation: "isolate",
	},
	header: {
		gap: cardVars.headerGap,
		paddingInline: cardVars.headerPaddingInline,
		display: "flex",
		flexDirection: "column",
		paddingBlockEnd: `calc(${cardVars.headerPaddingBlock} / 1.5)`,
		paddingBlockStart: cardVars.headerPaddingBlock,
	},
	content: {
		paddingBlock: cardVars.contentPaddingBlock,
		paddingInline: cardVars.contentPaddingInline,
		fontSize: cardVars.contentFontSize,
		letterSpacing: cardVars.contentLetterSpacing,
		lineHeight: cardVars.contentLineHeight,
	},
	footer: {
		gap: space[3],
		paddingBlock: cardVars.footerPaddingBlock,
		paddingInline: cardVars.footerPaddingInline,
		alignItems: "center",
		borderEndEndRadius: "inherit",
		borderEndStartRadius: "inherit",
		display: "flex",
	},
});

const cardSizeVariants = stylex.create({
	sm: {
		[cardVars.contentFontSize]: fontSize.x1,
		[cardVars.contentLetterSpacing]: letterSpacing.x1,
		[cardVars.contentLineHeight]: lineHeight.x1,
		[cardVars.contentPaddingBlock]: space[2],
		[cardVars.contentPaddingInline]: space[4],
		[cardVars.footerPaddingBlock]: space[2],
		[cardVars.footerPaddingInline]: space[2],
		[cardVars.headerGap]: space[1],
		[cardVars.headerPaddingBlock]: space[2],
		[cardVars.headerPaddingInline]: space[4],
	},
	md: {
		[cardVars.contentFontSize]: fontSize.x2,
		[cardVars.contentLetterSpacing]: letterSpacing.x2,
		[cardVars.contentLineHeight]: lineHeight.x2,
		[cardVars.contentPaddingBlock]: space[3],
		[cardVars.contentPaddingInline]: space[5],
		[cardVars.footerPaddingBlock]: space[3],
		[cardVars.footerPaddingInline]: space[3],
		[cardVars.headerGap]: space[1],
		[cardVars.headerPaddingBlock]: space[3],
		[cardVars.headerPaddingInline]: space[5],
	},
	lg: {
		[cardVars.contentFontSize]: fontSize.x3,
		[cardVars.contentLetterSpacing]: letterSpacing.x3,
		[cardVars.contentLineHeight]: lineHeight.x3,
		[cardVars.contentPaddingBlock]: space[4],
		[cardVars.contentPaddingInline]: space[6],
		[cardVars.footerPaddingBlock]: space[4],
		[cardVars.footerPaddingInline]: space[4],
		[cardVars.headerGap]: space[1],
		[cardVars.headerPaddingBlock]: space[4],
		[cardVars.headerPaddingInline]: space[6],
	},
});

const cardVariants = stylex.create({
	elevated: {
		borderWidth: 0,
		backgroundColor: colors["--panel"],
		boxShadow: shadow.md,
	},
	outline: {
		borderColor: colors["--border"],
		borderStyle: "solid",
		borderWidth: "1px",
		backgroundColor: colors["--surface"],
		boxShadow: "none",
	},
});
