import { useRender } from "@base-ui/react/use-render";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { useTextTruncation } from "@/hooks/use-text-truncation";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { extractMarginProps, type MarginProps } from "@/styles/props/spacing.stylex";
import { focusRing } from "@/styles/recipes/focus";
import { tokens } from "@/theme/tokens.stylex";

import { Tooltip } from "@/components/tooltip/tooltip";
import { VisuallyHidden } from "@/components/visually-hidden/visually-hidden";
import { attrJoin } from "@/utils/attr-join";

const badgeParts = stylex.create({
	root: {
		overflow: "hidden",
		alignItems: "center",
		boxSizing: "border-box",
		display: "inline-flex",
		flexShrink: 1,
		fontWeight: tokens["--font-weight-medium"],
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

const slotColors = stylex.create({
	accent: {
		color: tokens["--fill-accent"],
	},
	error: {
		color: tokens["--fill-error"],
	},
	neutral: {
		color: tokens["--fill-neutral"],
	},
	warning: {
		color: tokens["--fill-warning"],
	},
	success: {
		color: tokens["--fill-success"],
	},
});

const labeledSlotSizes = stylex.create({
	xs: { fontSize: "0.75rem" },
	sm: { fontSize: "0.875rem" },
	md: { fontSize: "0.875rem" },
});

const iconOnlySlotSizes = stylex.create({
	xs: { fontSize: "0.75rem" },
	sm: { fontSize: "1rem" },
	md: { fontSize: "1rem" },
});

const startSlotOffsets = stylex.create({
	xs: { marginInlineStart: "-0.125em" },
	sm: { marginInlineStart: "-0.2em" },
	md: { marginInlineStart: "-0.25em" },
});

const endSlotOffsets = stylex.create({
	xs: { marginInlineEnd: "-0.2em" },
	sm: { marginInlineEnd: "-0.2em" },
	md: { marginInlineEnd: "-0.25em" },
});

const variantAppearance = stylex.create({
	elevated: {
		backgroundColor: tokens["--surface"],
		boxShadow: tokens["--shadow-xs-2"],
	},
});

const hueColors = stylex.create({
	accentSubtle: {
		backgroundColor: tokens["--bg-accent-hover"],
		color: tokens["--fg-accent"],
	},
	accentElevated: {
		color: tokens["--fg-accent"],
	},
	accentSolid: {
		backgroundColor: tokens["--bg-primary"],
		color: tokens["--fg-accent-contrast"],
	},
	errorSubtle: {
		backgroundColor: tokens["--bg-error"],
		color: tokens["--fg-error"],
	},
	errorElevated: {
		color: tokens["--fg-error"],
	},
	errorSolid: {
		backgroundColor: tokens["--bg-error-primary"],
		color: tokens["--fg-error-contrast"],
	},
	warningSubtle: {
		backgroundColor: tokens["--bg-warning-subtle"],
		color: tokens["--fg-warning"],
	},
	warningElevated: {
		color: tokens["--fg-warning"],
	},
	warningSolid: {
		backgroundColor: tokens["--bg-warning-primary"],
		color: tokens["--fg-warning-contrast"],
	},
	successSubtle: {
		backgroundColor: tokens["--bg-success"],
		color: tokens["--fg-success"],
	},
	successElevated: {
		color: tokens["--fg-success"],
	},
	successSolid: {
		backgroundColor: tokens["--bg-success-primary"],
		color: tokens["--fg-success-contrast"],
	},
	neutralSubtle: {
		backgroundColor: tokens["--surface-subtle"],
		color: tokens["--fg-muted"],
	},
	neutralElevated: {
		color: tokens["--fg"],
	},
	neutralSolid: {
		backgroundColor: tokens["--bg-neutral"],
		color: tokens["--fg-neutral-contrast"],
	},
});

const sizeVariants = stylex.create({
	xs: {
		borderRadius: tokens["--radius-xs"],
		gap: tokens["--space-0-5"],
		paddingInline: tokens["--space-1"],
		fontSize: "11px",
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--space-4"],
		height: tokens["--space-4"],
	},
	sm: {
		borderRadius: tokens["--radius-xs"],
		gap: tokens["--space-1"],
		paddingInline: tokens["--space-1"],
		fontSize: "11px",
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--space-4"],
		height: tokens["--space-4"],
	},
	md: {
		borderRadius: tokens["--radius-sm"],
		gap: tokens["--space-1"],
		paddingInline: tokens["--space-1-5"],
		fontSize: tokens["--font-size-1"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--space-5"],
		height: tokens["--space-5"],
	},
});

const shapeVariants = stylex.create({
	default: {
		cornerShape: "superellipse(1.2)",
	},
	pill: {
		borderRadius: tokens["--radius-full"],
	},
	circle: {
		borderRadius: tokens["--radius-full"],
		paddingInline: 0,
		aspectRatio: 1,
	},
	square: {
		borderRadius: tokens["--radius-xs"],
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
	error: {
		subtle: hueColors.errorSubtle,
		elevated: hueColors.errorElevated,
		solid: hueColors.errorSolid,
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

type BadgeSharedProps = Omit<
	useRender.ComponentProps<"span">,
	"className" | "children" | "color" | "height" | "render" | "style" | "width" | keyof MarginProps
> &
	MarginProps &
	BaseStyleProps & {
		className?: string;
		hue?: BadgeHue;
		render?: useRender.RenderProp;
		shape?: BadgeShape;
		size?: BadgeSize;
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
	xstyle,
	tabIndex,
	tooltip,
	variant = "subtle",
	...props
}: BadgeProps) {
	const truncation = useTextTruncation<HTMLSpanElement>({ normalizeWhitespace: true });
	const { marginStyles, rest } = extractMarginProps(props);

	const sx = stylex.props(
		badgeParts.root,
		focusRing.offset,
		variant === "elevated" && variantAppearance.elevated,
		stylesByHue[hue][variant],
		sizeVariants[size],
		shapeVariants[shape],
		...marginStyles,
		xstyle,
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
			...rest,
			className: attrJoin(sx.className, className),
			style: mergeStyle(sx.style, style),
			tabIndex: tabIndex ?? (hasTooltip ? 0 : undefined),
			children: (
				<>
					{renderSlot(startSlot, "start", size, iconOnly, hue, variant)}
					{children != null ? (
						<span ref={truncation.ref} {...stylex.props(badgeParts.label)}>
							{children}
						</span>
					) : null}
					{iconOnly && label ? <VisuallyHidden>{label}</VisuallyHidden> : null}
					{renderSlot(endSlot, "end", size, iconOnly, hue, variant)}
				</>
			),
		},
	});

	return (
		<Tooltip.Root disabled={!hasTooltip}>
			<Tooltip.Trigger render={element} {...stylex.props(hasTooltip && badgeParts.tooltipTrigger)} />
			<Tooltip.Popup positionerProps={{ side: "inline-start" }}>{resolvedTooltipText}</Tooltip.Popup>
		</Tooltip.Root>
	);
}

function renderSlot(
	slot: ReactNode,
	position: "start" | "end",
	size: BadgeSize,
	iconOnly: boolean,
	hue: BadgeHue,
	variant: BadgeVariant,
) {
	if (slot == null) {
		return null;
	}

	const sx = stylex.props(
		badgeParts.slot,
		iconOnly ? iconOnlySlotSizes[size] : labeledSlotSizes[size],
		variant !== "solid" && slotColors[hue],
		!iconOnly && position === "start" && startSlotOffsets[size],
		!iconOnly && position === "end" && endSlotOffsets[size],
	);

	return (
		<span aria-hidden className={sx.className} style={sx.style}>
			{slot}
		</span>
	);
}
