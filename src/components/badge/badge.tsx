import { useRender } from "@base-ui/react/use-render";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { useTextTruncation } from "@/hooks/use-text-truncation";
import { composeThemeProps, resolveThemeProps, type VerifyThemeProps } from "@/theme/theme-props";
import { childLayoutThemeProps, positioningThemeProps, sizingThemeProps } from "@/styles/theme-props-layout.stylex";
import { gapThemeProps, spacingThemeProps } from "@/styles/theme-props-spacing.stylex";
import type {
	ChildLayoutProps,
	GapProps,
	PositioningProps,
	SizingProps,
	SpacingProps,
} from "@/theme/theme-props.types";
import { focusRing } from "@/styles/recipes/focus";
import { color, radius, shadow, space } from "@/styles/tokens.stylex";
import { fontSize, fontWeight, letterSpacing } from "@/styles/tokens.stylex";
import * as Tooltip from "../tooltip/tooltip";
import { VisuallyHidden } from "../visually-hidden/visually-hidden";

const badgeParts = stylex.create({
	root: {
		overflow: "hidden",
		alignItems: "center",
		boxSizing: "border-box",
		display: "inline-flex",
		flexShrink: 1,
		fontWeight: fontWeight.medium,
		justifyContent: "center",
		textDecorationLine: {
			"[href]": "underline",
			default: "none",
		},
		textUnderlineOffset: "0.16em",
		verticalAlign: "middle",
		whiteSpace: "nowrap",
		maxWidth: "fit-content",
		minWidth: 0,
	},
	unboundedWidth: {
		maxWidth: "none",
	},
	slot: {
		alignItems: "center",
		color: "currentColor",
		display: "inline-flex",
		flexShrink: 0,
		justifyContent: "center",
		lineHeight: 0,
		pointerEvents: "none",
		height: "1em",
		width: "1em",
	},
	label: {
		overflow: "hidden",
		display: "block",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
		minWidth: 0,
	},
	tooltipTrigger: {
		cursor: "help",
	},
});

const labeledSlotSizes = stylex.create({
	xs: { fontSize: "0.6875rem" },
	sm: { fontSize: "0.75rem" },
	md: { fontSize: "0.875rem" },
});

const iconOnlySlotSizes = stylex.create({
	xs: { fontSize: "0.75rem" },
	sm: { fontSize: "0.875rem" },
	md: { fontSize: "1rem" },
});

const startSlotOffsets = stylex.create({
	xs: { marginInlineStart: "-0.125rem" },
	sm: { marginInlineStart: "-0.125rem" },
	md: { marginInlineStart: "-0.125rem" },
});

const endSlotOffsets = stylex.create({
	xs: { marginInlineEnd: "-0.125rem" },
	sm: { marginInlineEnd: "-0.125rem" },
	md: { marginInlineEnd: "-0.125rem" },
});

const variantAppearance = stylex.create({
	subtle: {},
	elevated: {
		backgroundColor: color.bgElevated,
		boxShadow: shadow.xs,
	},
	solid: {},
});

const hueColors = stylex.create({
	accentSubtle: {
		backgroundColor: color.bgAccentSoftHover,
		color: color.fgAccent,
	},
	accentElevated: {
		color: color.fgAccent,
	},
	accentSolid: {
		backgroundColor: color.bgAccent,
		color: color.fgAccentContrast,
	},
	dangerSubtle: {
		backgroundColor: color.bgDangerSubtle,
		color: color.fgDanger,
	},
	dangerElevated: {
		color: color.fgDanger,
	},
	dangerSolid: {
		backgroundColor: color.bgDanger,
		color: color.fgAccentContrast,
	},
	warningSubtle: {
		backgroundColor: color.bgWarningSubtle,
		color: color.fgWarning,
	},
	warningElevated: {
		color: color.fgWarning,
	},
	warningSolid: {
		backgroundColor: color.bgWarning,
		color: color.fgWarningContrast,
	},
	successSubtle: {
		backgroundColor: color.bgSuccessSubtle,
		color: color.fgSuccess,
	},
	successElevated: {
		color: color.fgSuccess,
	},

	successSolid: {
		backgroundColor: color.bgSuccess,
		color: color.fgAccentContrast,
	},
	neutralSubtle: {
		backgroundColor: "var(--gray-a2)",
		color: "var(--gray-t2)",
	},
	neutralElevated: {
		color: color.fg,
	},
	neutralSolid: {
		backgroundColor: color.bgNeutralStrong,
		color: color.fgNeutralContrast,
	},
});

const sizeVariants = stylex.create({
	xs: {
		borderRadius: radius.xs,
		gap: space[1],
		paddingInline: space[1],
		fontSize: "11px",
		letterSpacing: letterSpacing.x1,
		lineHeight: space[4],
		height: space[4],
	},
	sm: {
		borderRadius: radius.xs,
		gap: space[1],
		paddingInline: space[1],
		fontSize: "11px",
		letterSpacing: letterSpacing.x1,
		lineHeight: space[4],
		height: space[4],
	},
	md: {
		borderRadius: radius.sm,
		gap: space[1],
		paddingInline: space[2],
		fontSize: fontSize.x1,
		letterSpacing: letterSpacing.x1,
		lineHeight: space[5],
		height: space[5],
	},
});

const shapeVariants = stylex.create({
	default: {
		cornerShape: "superellipse(1.2)",
	},
	pill: {
		borderRadius: radius.full,
	},
	circle: {
		borderRadius: radius.full,
		paddingInline: 0,
		aspectRatio: 1,
	},
	square: {
		borderRadius: radius.xs,
		paddingInline: 0,
		aspectRatio: 1,
	},
});

const stylesByHue = {
	accent: {
		subtle: hueColors.accentSubtle,
		elevated: hueColors.accentElevated,
		solid: hueColors.accentSolid,
	},
	danger: {
		subtle: hueColors.dangerSubtle,
		elevated: hueColors.dangerElevated,
		solid: hueColors.dangerSolid,
	},
	neutral: {
		subtle: hueColors.neutralSubtle,
		elevated: hueColors.neutralElevated,
		solid: hueColors.neutralSolid,
	},
	warning: {
		subtle: hueColors.warningSubtle,
		elevated: hueColors.warningElevated,
		solid: hueColors.warningSolid,
	},
	success: {
		subtle: hueColors.successSubtle,
		elevated: hueColors.successElevated,
		solid: hueColors.successSolid,
	},
} as const;

export type BadgeVariant = keyof (typeof stylesByHue)["neutral"];
export type BadgeHue = keyof typeof stylesByHue;
export type BadgeSize = keyof typeof sizeVariants;
export type BadgeShape = keyof typeof shapeVariants;
export interface BadgeThemeProps extends SpacingProps, SizingProps, PositioningProps, ChildLayoutProps, GapProps {}
const badgeThemeProps = composeThemeProps(
	spacingThemeProps,
	sizingThemeProps,
	positioningThemeProps,
	childLayoutThemeProps,
	gapThemeProps,
);
type VerifiedBadgeThemeProps = VerifyThemeProps<BadgeThemeProps, typeof badgeThemeProps>;

type BadgeSharedProps = Omit<
	useRender.ComponentProps<"span">,
	"className" | "children" | "color" | "height" | "render" | "style" | "width" | keyof VerifiedBadgeThemeProps
> &
	VerifiedBadgeThemeProps & {
		className?: string;
		hue?: BadgeHue;
		render?: useRender.RenderProp;
		shape?: BadgeShape;
		size?: BadgeSize;
		/** StyleX overrides, applied after the component's own styles. */
		style?: StyleXStyles;
		variant?: BadgeVariant;
	};

type BadgeWithLabelProps = BadgeSharedProps & {
	children: ReactNode;
	endSlot?: ReactNode;
	label?: never;
	startSlot?: ReactNode;
	tooltip?: string | false;
};

type BadgeIconOnlyProps = BadgeSharedProps & {
	children?: undefined;
	endSlot?: never;
	label: string;
	startSlot: ReactNode;
	tooltip?: string | false;
};

export type BadgeProps = BadgeWithLabelProps | BadgeIconOnlyProps;

export function Badge({
	ref,
	children,
	className,
	endSlot,
	hue = "neutral",
	label,
	render,
	shape = "default",
	size = "md",
	startSlot,
	style,
	tabIndex,
	tooltip,
	variant = "subtle",
	...props
}: BadgeProps) {
	const unboundedWidth = props.width !== undefined && props.maxWidth === undefined;
	const { restProps, styles } = resolveThemeProps(props, badgeThemeProps);
	const truncation = useTextTruncation<HTMLSpanElement>({ normalizeWhitespace: true });

	const sx = stylex.props(
		badgeParts.root,
		focusRing.outset,
		variantAppearance[variant],
		stylesByHue[hue][variant],
		sizeVariants[size],
		shapeVariants[shape],
		unboundedWidth && badgeParts.unboundedWidth,
		...styles,
		style,
	);
	const iconOnly = children == null;
	const resolvedTooltipText =
		tooltip === false
			? ""
			: (tooltip ?? (iconOnly ? (label ?? "") : truncation.isTruncated ? truncation.fullText : ""));
	const hasTooltip = resolvedTooltipText.length > 0;

	const element = useRender<{}, HTMLElement>({
		defaultTagName: "span",
		render,
		ref,
		props: {
			...restProps,
			className: [sx.className, className].filter(Boolean).join(" "),
			style: sx.style,
			tabIndex: tabIndex ?? (hasTooltip ? 0 : undefined),
			children: (
				<>
					{renderSlot(startSlot, "start", size, iconOnly)}
					{children != null ? (
						<span ref={truncation.ref} {...stylex.props(badgeParts.label)}>
							{children}
						</span>
					) : null}
					{iconOnly && label ? <VisuallyHidden>{label}</VisuallyHidden> : null}
					{renderSlot(endSlot, "end", size, iconOnly)}
				</>
			),
		},
	});

	return (
		<Tooltip.Root disabled={!hasTooltip}>
			<Tooltip.Trigger render={element} style={hasTooltip ? badgeParts.tooltipTrigger : undefined} />
			<Tooltip.Popup>{resolvedTooltipText}</Tooltip.Popup>
		</Tooltip.Root>
	);
}

function renderSlot(slot: ReactNode, position: "start" | "end", size: BadgeSize, iconOnly: boolean) {
	if (slot == null) {
		return null;
	}

	const sx = stylex.props(
		badgeParts.slot,
		iconOnly ? iconOnlySlotSizes[size] : labeledSlotSizes[size],
		!iconOnly && position === "start" && startSlotOffsets[size],
		!iconOnly && position === "end" && endSlotOffsets[size],
	);

	return (
		<span aria-hidden className={sx.className} style={sx.style}>
			{slot}
		</span>
	);
}
