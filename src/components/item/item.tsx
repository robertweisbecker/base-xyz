import { useRender } from "@base-ui/react/use-render";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { media } from "@/styles/constants.stylex";
import { typescaleStyles, textStyles } from "@/components/text/text.stylex";
import { focusRing } from "@/styles/recipes/focus";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { extractMarginProps, type MarginProps } from "@/styles/props/spacing.stylex";
import { tokens } from "@/theme/tokens.stylex";
import { attrJoin } from "@/utils/attr-join";

/**
 * How the description sits relative to the label.
 *
 * - `stack` — description beneath the label (default)
 * - `inline` — description beside the label on one line
 * - `inline-wrap` — description starts beside the label and can wrap below
 */
export type ItemDescriptionLayout = "stack" | "inline" | "inline-wrap";
export type ItemAlign = "start" | "center" | "end" | "baseline";
export type ItemVariant = "default" | "embedded";

export type ItemProps = Omit<
	useRender.ComponentProps<"div">,
	"children" | "className" | "render" | "style" | keyof MarginProps
> &
	MarginProps &
	BaseStyleProps & {
		align?: ItemAlign;
		className?: string;
		/** Supporting text beside or beneath the label. */
		description?: ReactNode;
		/** Placement of `description` relative to `label`. Defaults to `stack`. */
		descriptionLayout?: ItemDescriptionLayout;
		/** Trailing visual such as a badge, kbd, icon, or short text. */
		endSlot?: ReactNode;
		/** Primary text for the row. */
		label: ReactNode;
		render?: useRender.RenderProp;
		/** Leading visual such as an icon, indicator, or avatar. */
		startSlot?: ReactNode;
		/** `embedded` removes padding and inherits colors when another component owns the row chrome and state. */
		variant?: ItemVariant;
	};

export function Item({
	ref,
	align = "start",
	className,
	description,
	descriptionLayout = "stack",
	endSlot,
	label,
	render,
	startSlot,
	style,
	xstyle,
	variant = "default",
	...props
}: ItemProps) {
	const { marginStyles, rest } = extractMarginProps(props);
	const hasDescription =
		description !== undefined &&
		description !== null &&
		description !== false &&
		description !== "";
	const sx = stylex.props(
		itemParts.root,
		itemVariantStyles[variant],
		focusRing.offset,
		...marginStyles,
		xstyle,
	);

	return useRender<{ align: ItemAlign }, HTMLElement>({
		defaultTagName: "div",
		ref,
		render,
		state: { align },
		props: {
			...rest,
			className: attrJoin(sx.className, className),
			style: mergeStyle(sx.style, style),
			children: (
				<>
					{startSlot ? (
						<span
							aria-hidden
							{...stylex.props(itemParts.startSlot, itemSlotVariantStyles[variant])}
						>
							{startSlot}
						</span>
					) : null}
					<span
						{...stylex.props(
							itemParts.content,
							descriptionLayoutStyles[descriptionLayout],
							hasDescription && descriptionLayout === "stack" && itemParts.contentStackGap,
						)}
					>
						<span
							{...stylex.props(
								textStyles.body,
								typescaleStyles["2"],
								itemParts.label,
								itemLabelVariantStyles[variant],
								descriptionLayout === "inline-wrap" && itemParts.labelInline,
							)}
						>
							{label}
						</span>
						{hasDescription ? (
							<span
								{...stylex.props(
									textStyles.body,
									typescaleStyles["1"],
									itemParts.description,
									itemDescriptionVariantStyles[variant],
									descriptionLayout === "inline" && itemParts.descriptionInline,
									descriptionLayout === "inline-wrap" && itemParts.descriptionInlineWrap,
								)}
							>
								{description}
							</span>
						) : null}
					</span>
					{endSlot ? (
						<span {...stylex.props(itemParts.endSlot, itemSlotVariantStyles[variant])}>
							{endSlot}
						</span>
					) : null}
				</>
			),
		},
	});
}

const itemParts = stylex.create({
	root: {
		borderRadius: tokens["--radius-md"],
		outline: "0",
		textDecoration: "none",
		alignItems: {
			"[data-align='baseline']": "baseline",
			"[data-align='center']": "center",
			"[data-align='end']": "end",
			"[data-align='start']": "start",
		},
		backgroundColor: {
			default: "transparent",
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			":is(a[href]):hover": {
				[media.canHover]: tokens["--bg-highlight"],
			},
		},
		boxSizing: "border-box",
		columnGap: tokens["--space-2"],
		cursor: {
			default: "default",
			":is(a[href])": "pointer",
		},
		display: "flex",
		width: "100%",
	},
	startSlot: {
		alignItems: "center",
		display: "inline-flex",
		flexShrink: 0,
		justifyContent: "center",
		lineHeight: 0,
		minHeight: "1lh",
	},
	content: {
		display: "flex",
		flexGrow: 1,
		minWidth: 0,
	},
	contentStackGap: {
		rowGap: tokens["--space-0"],
	},
	label: {
		minWidth: 0,
	},
	labelInline: {
		display: "inline",
	},
	description: {
		minWidth: 0,
	},
	descriptionInline: {
		overflow: "hidden",
		flexShrink: 1,
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
	},
	descriptionInlineWrap: {
		display: "inline",
		fontSize: null,
		letterSpacing: null,
		lineHeight: null,
		marginInlineStart: tokens["--space-2"],
	},
	endSlot: {
		alignItems: "center",
		columnGap: tokens["--space-2"],
		display: "inline-flex",
		flexShrink: 0,
		justifyContent: "end",
	},
});

const itemVariantStyles = stylex.create({
	default: {
		paddingBlock: tokens["--space-2"],
		paddingInline: tokens["--space-3"],
		color: tokens["--fg"],
	},
	embedded: {
		padding: 0,
		color: "inherit",
	},
});

const itemLabelVariantStyles = stylex.create({
	default: {
		color: tokens["--fg"],
		flexShrink: 0,
	},
	embedded: {
		overflow: "hidden",
		color: "inherit",
		flexShrink: 1,
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
	},
});

const itemDescriptionVariantStyles = stylex.create({
	default: {
		color: tokens["--fg-muted"],
	},
	embedded: {
		color: "inherit",
		opacity: 0.68,
	},
});

const itemSlotVariantStyles = stylex.create({
	default: {
		color: tokens["--fg-muted"],
	},
	embedded: {
		color: "inherit",
	},
});

const descriptionLayoutStyles = stylex.create({
	stack: {
		flexDirection: "column",
	},
	inline: {
		alignItems: "baseline",
		columnGap: tokens["--space-1-5"],
		flexDirection: "row",
		flexWrap: "nowrap",
	},
	"inline-wrap": {
		display: "block",
	},
});
