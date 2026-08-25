import { useRender } from "@base-ui/react/use-render";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { extractMarginProps, type MarginProps } from "@/styles/props/spacing.stylex";
import { tokens } from "@/theme/tokens.stylex";

import { Heading, type HeadingProps } from "@/components/heading/heading";
import { Text, type TextProps } from "@/components/text/text";
import { cardVars } from "./card-vars.stylex";
import { attrJoin } from "@/utils/attr-join";

type StyledPartProps<T> = Omit<T, "className" | "style" | "xstyle"> &
	BaseStyleProps & {
		className?: string;
	};

export type CardVariant = "elevated" | "muted" | "outline";
export type CardSize = keyof typeof cardSizeVariants;

export type CardRootProps = Omit<StyledPartProps<useRender.ComponentProps<"div">>, "render" | keyof MarginProps> &
	MarginProps & {
		render?: useRender.RenderProp;
		size?: CardSize;
		variant?: CardVariant;
	};
export type CardHeaderProps = StyledPartProps<ComponentProps<"div">>;
export type CardFooterProps = StyledPartProps<ComponentProps<"div">>;
export type CardContentProps = StyledPartProps<ComponentProps<"div">>;
export type CardTitleProps = Omit<HeadingProps, keyof MarginProps>;
export type CardDescriptionProps = Omit<TextProps, keyof MarginProps>;

export function Root({ className, ref, render, size = "md", style, xstyle, variant = "elevated", ...props }: CardRootProps) {
	const { marginStyles, rest } = extractMarginProps(props);
	const sx = stylex.props(cardParts.root, cardSizeVariants[size], cardVariants[variant], ...marginStyles, xstyle);

	return useRender<{}, HTMLElement>({
		defaultTagName: "div",
		ref,
		render,
		props: {
			...rest,
			className: attrJoin(sx.className, className),
			style: mergeStyle(sx.style, style),
		},
	});
}

export function Header({ className, style, xstyle, ...props }: CardHeaderProps) {
	const sx = stylex.props(cardParts.header, xstyle);

	return <div className={attrJoin(sx.className, className)} style={mergeStyle(sx.style, style)} {...props} />;
}

export function Title(props: CardTitleProps) {
	return <Heading render={<h3 />} size="3" {...props} />;
}

export function Description(props: CardDescriptionProps) {
	return <Text size="2" color="muted" {...props} />;
}

export function Content({ className, style, xstyle, ...props }: CardContentProps) {
	const sx = stylex.props(cardParts.content, xstyle);

	return <div className={attrJoin(sx.className, className)} style={mergeStyle(sx.style, style)} {...props} />;
}

export function Footer({ className, style, xstyle, ...props }: CardFooterProps) {
	const sx = stylex.props(cardParts.footer, xstyle);

	return <div className={attrJoin(sx.className, className)} style={mergeStyle(sx.style, style)} {...props} />;
}

const cardParts = stylex.create({
	root: {
		gap: tokens["--space-1"],
		overflow: "hidden",
		color: tokens["--fg"],
		display: "flex",
		flexDirection: "column",
		isolation: "isolate",
		borderRadius: tokens["--radius-lg"],
	},
	header: {
		gap: cardVars.headerGap,
		display: "flex",
		flexDirection: "column",
		paddingInline: cardVars.headerPaddingInline,
		paddingInlineEnd: cardVars.headerPaddingBlock,
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
		justifyContent: "flex-end",
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
		boxShadow: tokens["--shadow-sm"],
	},
	outline: {
		borderColor: tokens["--border"],
		borderStyle: "solid",
		borderWidth: "1px",
		backgroundColor: tokens["--surface"],
		boxShadow: "none",
	},
	muted: {
		backgroundColor: tokens["--surface-subtle"],
	},
});

export const Card = {
	Root,
	Header,
	Title,
	Description,
	Content,
	Footer,
} as const;
