import { useRender } from "@base-ui/react/use-render";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { typescaleStyles, textStyles, fontWeightStyles } from "@/components/text/text.stylex";
import { focusRing } from "@/styles/recipes/focus";
import { tokens } from "@/theme/tokens.stylex";

/**
 * How the description sits relative to the label.
 *
 * - `stack` — description beneath the label (default)
 * - `inline` — description beside the label on one line
 * - `inline-wrap` — description starts beside the label and can wrap below
 */
export type ItemDescriptionLayout = "stack" | "inline" | "inline-wrap";

export type ItemProps = Omit<useRender.ComponentProps<"div">, "children" | "className" | "render" | "style"> & {
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
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export function Item({
	ref,
	className,
	description,
	descriptionLayout = "stack",
	endSlot,
	label,
	render,
	startSlot,
	style,
	...props
}: ItemProps) {
	const hasDescription =
		description !== undefined && description !== null && description !== false && description !== "";
	const sx = stylex.props(itemParts.root, focusRing.offset, style);

	return useRender<{}, HTMLElement>({
		defaultTagName: "div",
		ref,
		render,
		props: {
			...props,
			className: [sx.className, className].filter(Boolean).join(" "),
			style: sx.style,
			children: (
				<>
					{startSlot ? (
						<span aria-hidden {...stylex.props(itemParts.startSlot)}>
							{startSlot}
						</span>
					) : null}
					<span
						{...stylex.props(
							itemParts.content,
							descriptionLayoutStyles[descriptionLayout],
							hasDescription && descriptionLayout === "stack" && itemParts.contentStackGap,
						)}>
						<span
							{...stylex.props(
								textStyles.body,
								typescaleStyles["2"],
								fontWeightStyles.medium,
								itemParts.label,
								descriptionLayout === "inline-wrap" && itemParts.labelInlineFlow,
							)}>
							{label}
						</span>
						{hasDescription ? (
							<span
								{...stylex.props(
									textStyles.body,
									typescaleStyles["1"],
									itemParts.description,
									descriptionLayout === "inline" && itemParts.descriptionInline,
									descriptionLayout === "inline-wrap" && itemParts.descriptionInlineWrap,
								)}>
								{description}
							</span>
						) : null}
					</span>
					{endSlot ? <span {...stylex.props(itemParts.endSlot)}>{endSlot}</span> : null}
				</>
			),
		},
	});
}

const itemParts = stylex.create({
	root: {
		borderRadius: tokens["--radius-md"],
		outline: "0",
		paddingBlock: tokens["--space-2"],
		paddingInline: tokens["--space-3"],
		textDecoration: "none",
		alignItems: "center",
		backgroundColor: {
			default: "transparent",
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			":is(a[href]):hover": {
				"@media (hover: hover) and (pointer: fine)": tokens["--bg-highlight"],
			},
		},
		boxSizing: "border-box",
		color: tokens["--fg"],
		columnGap: tokens["--space-3"],
		cursor: {
			default: "default",
			":is(a[href])": "pointer",
		},
		display: "flex",
		width: "100%",
	},
	startSlot: {
		alignItems: "center",
		alignSelf: "start",
		color: tokens["--fg-muted"],
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
		rowGap: tokens["--space-0-5"],
	},
	label: {
		color: tokens["--fg"],
		flexShrink: 0,
		minWidth: 0,
	},
	labelInlineFlow: {
		display: "inline",
	},
	description: {
		color: tokens["--fg-muted"],
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
		marginInlineStart: tokens["--space-2"],
	},
	endSlot: {
		alignItems: "center",
		color: tokens["--fg-muted"],
		columnGap: tokens["--space-2"],
		display: "inline-flex",
		flexShrink: 0,
		justifyContent: "end",
	},
});

const descriptionLayoutStyles = stylex.create({
	stack: {
		flexDirection: "column",
	},
	inline: {
		alignItems: "baseline",
		columnGap: tokens["--space-2"],
		flexDirection: "row",
		flexWrap: "nowrap",
	},
	"inline-wrap": {
		display: "block",
	},
});
