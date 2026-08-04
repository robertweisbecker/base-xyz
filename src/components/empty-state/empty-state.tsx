import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentProps, ElementType, ReactNode } from "react";
import { composeThemeProps, resolveThemeProps, type VerifyThemeProps } from "@/theme/theme-props";
import {
	childLayoutThemeProps,
	displayThemeProps,
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
	RadiusThemeProps,
	ShadowThemeProps,
	SizingProps,
	SpacingProps,
} from "@/theme/theme-props.types";
import { tokens } from "@/theme/tokens.stylex";
import { Heading } from "../heading/heading";
import { Text } from "../text/text";

export type EmptyStateSize = "sm" | "md" | "lg";
export type EmptyStateHeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export interface EmptyStateThemeProps
	extends
		SpacingProps,
		SizingProps,
		PositioningProps,
		ChildLayoutProps,
		RadiusThemeProps,
		ShadowThemeProps,
		FlexProps,
		DisplayProps {}

const emptyStateThemeProps = composeThemeProps(
	spacingThemeProps,
	sizingThemeProps,
	positioningThemeProps,
	childLayoutThemeProps,
	radiusThemeProps,
	shadowThemeProps,
	verticalFlexThemeProps,
	displayThemeProps,
);
type VerifiedEmptyStateThemeProps = VerifyThemeProps<EmptyStateThemeProps, typeof emptyStateThemeProps>;

export type EmptyStateProps = Omit<
	ComponentProps<"div">,
	"children" | "color" | "height" | "style" | "title" | "width" | keyof VerifiedEmptyStateThemeProps
> &
	VerifiedEmptyStateThemeProps & {
		/** Actions or other supporting content rendered below the description. */
		children?: ReactNode;
		description?: ReactNode;
		/** Semantic heading element used for the title. */
		headingLevel?: EmptyStateHeadingLevel;
		icon?: ReactNode;
		size?: EmptyStateSize;
		/** StyleX overrides, applied after the component's own styles. */
		style?: StyleXStyles;
		title: ReactNode;
	};

export function EmptyState({
	children,
	className,
	description,
	headingLevel = "h2",
	icon,
	size = "md",
	style,
	title,
	...props
}: EmptyStateProps) {
	const { restProps, styles } = resolveThemeProps(props, emptyStateThemeProps);
	const rootSx = stylex.props(emptyStateStyles.root, rootSizeStyles[size], ...styles, style);
	const Title = headingLevel as ElementType;

	return (
		<div className={[rootSx.className, className].filter(Boolean).join(" ")} style={rootSx.style} {...restProps}>
			{icon ? <div {...stylex.props(emptyStateStyles.icon, iconSizeStyles[size])}>{icon}</div> : null}
			<div {...stylex.props(emptyStateStyles.message)}>
				<Heading
					textAlign="center"
					render={<Title />}
					size={size === "sm" ? "2" : size === "md" ? "4" : "5"}
					style={emptyStateStyles.title}>
					{title}
				</Heading>
				{description ? (
					<Text
						textAlign="center"
						color="muted"
						render={<p />}
						size={size === "lg" ? "3" : "2"}
						style={emptyStateStyles.description}
						mt={size === "sm" ? 1 : size === "md" ? 2 : 3}
						wrap="pretty">
						{description}
					</Text>
				) : null}
			</div>
			{children ? <div {...stylex.props(emptyStateStyles.actions, actionSizeStyles[size])}>{children}</div> : null}
		</div>
	);
}

const emptyStateStyles = stylex.create({
	root: {
		alignItems: "center",
		boxSizing: "border-box",
		color: tokens["--fg"],
		display: "flex",
		flexBasis: 0,
		flexDirection: "column",
		flexGrow: 1,
		flexShrink: 1,
		justifyContent: "center",
		textAlign: "center",
		width: "100%",
	},
	icon: {
		borderRadius: tokens["--radius-full"],
		flex: "none",
		alignItems: "center",
		backgroundColor: tokens["--bg-highlight"],
		// borderWidth: 1,
		// borderStyle: "dashed",
		// borderColor: colors["--border-input"],
		color: tokens["--fg-muted"],
		display: "flex",
		justifyContent: "center",
		lineHeight: 0,
	},
	message: {
		alignItems: "center",
		display: "flex",
		flexDirection: "column",
		width: "100%",
	},
	title: {
		maxWidth: "32rem",
	},
	description: {
		maxWidth: "32rem",
	},
	actions: {
		alignItems: "center",
		display: "flex",
		flexWrap: "wrap",
		justifyContent: "center",
	},
});

const rootSizeStyles = stylex.create({
	sm: {
		gap: tokens["--space-3"],
		paddingBlock: tokens["--space-6"],
		paddingInline: tokens["--space-4"],
		minHeight: "10rem",
	},
	md: {
		gap: tokens["--space-4"],
		paddingBlock: tokens["--space-10"],
		paddingInline: tokens["--space-6"],
		minHeight: "14rem",
	},
	lg: {
		gap: tokens["--space-5"],
		paddingBlock: tokens["--space-16"],
		paddingInline: tokens["--space-8"],
		minHeight: "18rem",
	},
});

const iconSizeStyles = stylex.create({
	sm: {
		fontSize: "1.25rem",
		height: tokens["--space-10"],
		width: tokens["--space-10"],
	},
	md: {
		fontSize: "1.5rem",
		height: tokens["--space-12"],
		width: tokens["--space-12"],
	},
	lg: {
		fontSize: "2rem",
		height: tokens["--space-16"],
		width: tokens["--space-16"],
	},
});

const actionSizeStyles = stylex.create({
	sm: {
		gap: tokens["--space-2"],
		marginBlockStart: tokens["--space-1"],
	},
	md: {
		gap: tokens["--space-2"],
		marginBlockStart: tokens["--space-2"],
	},
	lg: {
		gap: tokens["--space-3"],
		marginBlockStart: tokens["--space-3"],
	},
});
