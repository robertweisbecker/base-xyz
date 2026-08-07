import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentProps, ReactNode } from "react";
import { positioningThemeProps } from "@/theme/theme-props-layout.stylex";
import { tokens } from "@/theme/tokens.stylex";
import { resolveThemeProps, type VerifyThemeProps } from "@/theme/theme-props";
import type { PositioningProps } from "@/theme/theme-props.types";
import { Heading } from "@/components/heading/heading";
import { Text } from "@/components/text/text";
import { VisuallyHidden } from "@/components/visually-hidden/visually-hidden";

export type CalloutHue = "accent" | "error" | "warning" | "success" | "neutral";
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
		borderWidth: tokens["--border-width"],
		boxSizing: "border-box",
		color: tokens["--fg"],
		fontSize: tokens["--font-size-2"],
		isolation: "isolate",
		lineHeight: tokens["--line-height-2"],
		width: "100%",
	},
	body: {
		alignItems: "start",
		boxSizing: "border-box",
		columnGap: tokens["--space-2"],
		display: "flex",
		width: "100%",
	},
	icon: {
		alignItems: "center",
		display: "flex",
		flexShrink: 0,
		fontSize: "1.25em",
		justifyContent: "center",
		transform: "translateY(-0.03125em)",
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
		gap: tokens["--space-2"],
		alignItems: "center",
		display: "flex",
		flexShrink: 0,
		flexWrap: "wrap",
		justifyContent: "end",
	},
});

const calloutVariantStyles = stylex.create({
	default: {
		borderRadius: tokens["--radius-md"],
		paddingBlock: tokens["--space-2"],
		paddingInlineEnd: tokens["--space-2"],
		paddingInlineStart: tokens["--space-3"],
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
		paddingBlock: tokens["--space-2"],
		paddingInline: tokens["--space-3"],
		alignItems: "center",
		columnGap: tokens["--space-2"],
		maxWidth: tokens["--size-container-4xl"],
	},
});

const calloutContentVariantStyles = stylex.create({
	default: {
		flexDirection: "column",
	},
	banner: {
		alignItems: "baseline",
		columnGap: tokens["--space-2"],
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
		backgroundColor: tokens["--color-accent-c1"],
		// borderColor: colors["--color-accent-b1"],
		color: tokens["--color-accent-t2"],
	},
	error: {
		backgroundColor: tokens["--color-error-c1"],
		// borderColor: colors["--color-error-b1"],
		color: tokens["--color-error-t2"],
	},
	warning: {
		backgroundColor: tokens["--color-warning-c1"],
		// borderColor: colors["--color-warning-b1"],
		color: tokens["--color-warning-t2"],
	},
	success: {
		backgroundColor: tokens["--color-success-c1"],
		// borderColor: colors["--color-success-b1"],
		color: tokens["--color-success-t2"],
	},
	neutral: {
		backgroundColor: tokens["--color-gray-c1"],
		// borderColor: colors["--color-gray-b2"],
		color: tokens["--color-gray-t3"],
	},
});

const calloutIconHueStyles = stylex.create({
	accent: {
		color: tokens["--color-accent-t1"],
	},
	error: {
		color: tokens["--color-error-t1"],
	},
	warning: {
		color: tokens["--color-warning-t1"],
	},
	success: {
		color: tokens["--color-success-t1"],
	},
	neutral: {
		color: tokens["--fg-muted"],
	},
});
