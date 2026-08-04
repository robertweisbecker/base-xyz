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
} from "@/theme/theme-props-layout.stylex";
import { spacingThemeProps } from "@/theme/theme-props-spacing.stylex";
import { radiusThemeProps, shadowThemeProps } from "@/theme/theme-props-surface.stylex";
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
import { tokens } from "@/theme/tokens.stylex";

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
		gap: tokens["--space-1"],
		overflow: "hidden",
		color: tokens["--fg"],
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
		gap: tokens["--space-3"],
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
		[cardVars.contentFontSize]: tokens["--font-size-1"],
		[cardVars.contentLetterSpacing]: tokens["--letter-spacing-1"],
		[cardVars.contentLineHeight]: tokens["--line-height-1"],
		[cardVars.contentPaddingBlock]: tokens["--space-2"],
		[cardVars.contentPaddingInline]: tokens["--space-4"],
		[cardVars.footerPaddingBlock]: tokens["--space-2"],
		[cardVars.footerPaddingInline]: tokens["--space-2"],
		[cardVars.headerGap]: tokens["--space-1"],
		[cardVars.headerPaddingBlock]: tokens["--space-2"],
		[cardVars.headerPaddingInline]: tokens["--space-4"],
	},
	md: {
		[cardVars.contentFontSize]: tokens["--font-size-2"],
		[cardVars.contentLetterSpacing]: tokens["--letter-spacing-2"],
		[cardVars.contentLineHeight]: tokens["--line-height-2"],
		[cardVars.contentPaddingBlock]: tokens["--space-3"],
		[cardVars.contentPaddingInline]: tokens["--space-5"],
		[cardVars.footerPaddingBlock]: tokens["--space-3"],
		[cardVars.footerPaddingInline]: tokens["--space-3"],
		[cardVars.headerGap]: tokens["--space-1"],
		[cardVars.headerPaddingBlock]: tokens["--space-3"],
		[cardVars.headerPaddingInline]: tokens["--space-5"],
	},
	lg: {
		[cardVars.contentFontSize]: tokens["--font-size-3"],
		[cardVars.contentLetterSpacing]: tokens["--letter-spacing-3"],
		[cardVars.contentLineHeight]: tokens["--line-height-3"],
		[cardVars.contentPaddingBlock]: tokens["--space-4"],
		[cardVars.contentPaddingInline]: tokens["--space-6"],
		[cardVars.footerPaddingBlock]: tokens["--space-4"],
		[cardVars.footerPaddingInline]: tokens["--space-4"],
		[cardVars.headerGap]: tokens["--space-1"],
		[cardVars.headerPaddingBlock]: tokens["--space-4"],
		[cardVars.headerPaddingInline]: tokens["--space-6"],
	},
});

const cardVariants = stylex.create({
	elevated: {
		borderWidth: 0,
		backgroundColor: tokens["--panel"],
		boxShadow: tokens["--shadow-md"],
	},
	outline: {
		borderColor: tokens["--border"],
		borderStyle: "solid",
		borderWidth: "1px",
		backgroundColor: tokens["--surface"],
		boxShadow: "none",
	},
});
