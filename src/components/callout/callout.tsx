import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentProps, ReactNode } from "react";
import { positioningThemeProps } from "@/styles/theme-props-layout.stylex";
import { border, color, fontSize, lineHeight, radius, size, space } from "@/styles/tokens.stylex";
import { resolveThemeProps, type VerifyThemeProps } from "@/theme/theme-props";
import type { PositioningProps } from "@/theme/theme-props.types";
import { Heading } from "../heading/heading";
import { Text } from "../text/text";
import { VisuallyHidden } from "../visually-hidden/visually-hidden";

export type CalloutHue = "accent" | "danger" | "warning" | "success" | "neutral";
export type CalloutVariant = "default" | "banner";
export interface CalloutThemeProps extends PositioningProps {}

type VerifiedCalloutThemeProps = VerifyThemeProps<CalloutThemeProps, typeof positioningThemeProps>;

export type CalloutProps = Omit<
	ComponentProps<"div">,
	"children" | "color" | "role" | "style" | "title" | keyof VerifiedCalloutThemeProps
> &
	VerifiedCalloutThemeProps & {
		/** Renders the callout as an assertive ARIA alert. */
		alert?: boolean;
		/** Optional trailing action, such as a button or link. */
		action?: ReactNode;
		description: ReactNode;
		/** Decorative leading visual. */
		icon?: ReactNode;
		hue?: CalloutHue;
		/** StyleX overrides, applied after the component's own styles. */
		style?: StyleXStyles;
		/** Visible h2 content. A semantic fallback is rendered when omitted. */
		title?: ReactNode;
		variant?: CalloutVariant;
	};

export function Callout({
	ref,
	action,
	alert = false,
	className,
	description,
	hue = "accent",
	icon,
	style,
	title,
	variant = "default",
	...props
}: CalloutProps) {
	const { restProps, styles } = resolveThemeProps(props, positioningThemeProps);
	const sx = stylex.props(calloutParts.root, calloutHueStyles[hue], calloutVariantStyles[variant], ...styles, style);
	const hasVisibleTitle = title !== undefined && title !== null && title !== false && title !== "";

	return (
		<div
			ref={ref}
			{...restProps}
			className={[sx.className, className].filter(Boolean).join(" ")}
			role={alert ? "alert" : undefined}
			style={sx.style}>
			<div {...stylex.props(calloutParts.body, calloutBodyVariantStyles[variant])}>
				{icon ? (
					<div
						aria-hidden
						{...stylex.props(calloutParts.icon, calloutIconHueStyles[hue], calloutIconVariantStyles[variant])}>
						{icon}
					</div>
				) : null}
				<div {...stylex.props(calloutParts.content, calloutContentVariantStyles[variant])}>
					{hasVisibleTitle ? (
						<Heading size="2" style={calloutParts.title} wrap="pretty" fontWeight="medium">
							{title}
						</Heading>
					) : (
						<VisuallyHidden render={<h2 />}>{alert ? "Alert" : "Information"}</VisuallyHidden>
					)}
					<Text
						render={<p />}
						size={variant === "banner" ? "1" : "2"}
						style={calloutParts.description}
						wrap="pretty"
						truncate={variant === "banner" ? true : undefined}>
						{description}
					</Text>
				</div>
				{action ? (
					<div {...stylex.props(calloutParts.action, calloutActionVariantStyles[variant])}>{action}</div>
				) : null}
			</div>
		</div>
	);
}

const calloutParts = stylex.create({
	root: {
		borderColor: "transparent",
		borderStyle: "solid",
		borderWidth: border.width,
		boxSizing: "border-box",
		color: color.fg,
		fontSize: fontSize.x2,
		isolation: "isolate",
		lineHeight: lineHeight.x2,
		width: "100%",
	},
	body: {
		alignItems: "start",
		boxSizing: "border-box",
		columnGap: space[3],
		display: "flex",
		width: "100%",
	},
	icon: {
		alignItems: "center",
		display: "flex",
		flexShrink: 0,
		fontSize: "1.25em",
		justifyContent: "center",
		height: "1lh",
	},
	content: {
		display: "flex",
		flexGrow: 1,
		minWidth: 0,
	},
	title: {
		color: "currentColor",
		flexShrink: 0,
	},
	description: {
		color: "currentColor",
		opacity: 0.84,
		minWidth: 0,
	},
	action: {
		gap: space[2],
		alignItems: "center",
		display: "flex",
		flexShrink: 0,
		flexWrap: "wrap",
		justifyContent: "end",
	},
});

const calloutVariantStyles = stylex.create({
	default: {
		borderRadius: radius.md,
		paddingBlock: space[2],
		paddingInlineEnd: space[2],
		paddingInlineStart: space[3],
	},
	banner: {
		borderRadius: 0,
	},
});

const calloutBodyVariantStyles = stylex.create({
	default: {
		maxWidth: "none",
	},
	banner: {
		marginInline: "auto",
		paddingBlock: space[2],
		paddingInline: space[3],
		alignItems: "center",
		columnGap: space[2],
		maxWidth: size["container.4xl"],
	},
});

const calloutContentVariantStyles = stylex.create({
	default: {
		flexDirection: "column",
	},
	banner: {
		alignItems: "baseline",
		columnGap: space[2],
		flexDirection: "row",
	},
});

const calloutIconVariantStyles = stylex.create({
	default: {
		height: "1lh",
	},
	banner: {
		marginBlockStart: 0,
	},
});

const calloutActionVariantStyles = stylex.create({
	default: {
		alignSelf: "start",
	},
	banner: {
		alignSelf: "center",
	},
});

const calloutHueStyles = stylex.create({
	accent: {
		backgroundColor: "var(--indigo-c1)",
		// borderColor: "var(--indigo-o1)",
		color: "var(--indigo-t2)",
	},
	danger: {
		backgroundColor: "var(--red-c2)",
		// borderColor: "var(--red-o1)",
		color: "var(--red-t2)",
	},
	warning: {
		backgroundColor: "var(--orange-c1)",
		// borderColor: "var(--orange-o1)",
		color: "var(--orange-t2)",
	},
	success: {
		backgroundColor: "var(--green-c2)",
		// borderColor: "var(--green-o1)",
		color: "var(--green-t2)",
	},
	neutral: {
		backgroundColor: "var(--gray-s2)",
		// borderColor: "var(--gray-o2)",
		color: "var(--gray-t3)",
	},
});

const calloutIconHueStyles = stylex.create({
	accent: {
		color: "var(--indigo-p2)",
	},
	danger: {
		color: "var(--red-p2)",
	},
	warning: {
		color: "var(--orange-p2)",
	},
	success: {
		color: "var(--green-p2)",
	},
	neutral: {
		color: color.fgMuted,
	},
});
