import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentProps, ElementType, ReactNode } from "react";
import { color, radius, space } from "@/styles/tokens.stylex";
import { Heading } from "../heading/heading";
import { Text } from "../text/text";

export type EmptyStateSize = "sm" | "md" | "lg";
export type EmptyStateHeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type EmptyStateProps = Omit<ComponentProps<"div">, "children" | "style" | "title"> & {
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
	const rootSx = stylex.props(emptyStateStyles.root, rootSizeStyles[size], style);
	const Title = headingLevel as ElementType;

	return (
		<div className={[rootSx.className, className].filter(Boolean).join(" ")} style={rootSx.style} {...props}>
			{icon ? <div {...stylex.props(emptyStateStyles.icon, iconSizeStyles[size])}>{icon}</div> : null}
			<div {...stylex.props(emptyStateStyles.message)}>
				<Heading
					align="center"
					render={<Title />}
					size={size === "sm" ? "2" : size === "md" ? "4" : "5"}
					style={emptyStateStyles.title}>
					{title}
				</Heading>
				{description ? (
					<Text
						align="center"
						color="muted"
						render={<p />}
						size={size === "lg" ? "3" : "2"}
						style={emptyStateStyles.description}
						mt={size === "sm" ? "1" : size === "md" ? "2" : "3"}
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
		color: color.fg,
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		textAlign: "center",
		width: "100%",
		flex: 1,
	},
	icon: {
		borderRadius: radius.full,
		flex: "none",
		alignItems: "center",
		backgroundColor: color.highlight,
		// borderWidth: 1,
		// borderStyle: "dashed",
		// borderColor: color.borderStrong,
		color: color.fgMuted,
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
		gap: space.x3,
		paddingBlock: space.x6,
		paddingInline: space.x4,
		minHeight: "10rem",
	},
	md: {
		gap: space.x4,
		paddingBlock: space.x10,
		paddingInline: space.x6,
		minHeight: "14rem",
	},
	lg: {
		gap: space.x5,
		paddingBlock: space.x16,
		paddingInline: space.x8,
		minHeight: "18rem",
	},
});

const iconSizeStyles = stylex.create({
	sm: {
		fontSize: "1.25rem",
		height: space.x10,
		width: space.x10,
	},
	md: {
		fontSize: "1.5rem",
		height: space.x12,
		width: space.x12,
	},
	lg: {
		fontSize: "2rem",
		height: space.x16,
		width: space.x16,
	},
});

const actionSizeStyles = stylex.create({
	sm: {
		gap: space.x2,
		marginBlockStart: space.x1,
	},
	md: {
		gap: space.x2,
		marginBlockStart: space.x2,
	},
	lg: {
		gap: space.x3,
		marginBlockStart: space.x3,
	},
});
