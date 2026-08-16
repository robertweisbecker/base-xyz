import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { createElement, type ComponentProps, type ReactNode } from "react";
import { Box, Stack, Text } from "@/components";
import { tokens } from "@/theme/tokens.stylex";

export type PageHeaderHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type PageHeaderProps = Omit<ComponentProps<"section">, "style" | "title"> & {
	actions?: ReactNode;
	breadcrumbs?: ReactNode;
	description?: ReactNode;
	endSlot?: ReactNode;
	headingLevel?: PageHeaderHeadingLevel;
	metadata?: ReactNode;
	navigation?: ReactNode;
	startSlot?: ReactNode;
	title: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export function PageHeader({
	actions,
	breadcrumbs,
	className,
	description,
	endSlot,
	headingLevel = 1,
	metadata,
	navigation,
	startSlot,
	style,
	title,
	...props
}: PageHeaderProps) {
	const sx = stylex.props(parts.root, style);
	const titleNode = createElement(`h${headingLevel}`, stylex.props(parts.title), title);

	return (
		<section className={[sx.className, className].filter(Boolean).join(" ")} style={sx.style} {...props}>
			<Stack gap={4}>
				{breadcrumbs ? <Box style={parts.breadcrumbs}>{breadcrumbs}</Box> : null}
				<Box style={parts.content}>
					<Box style={parts.headingArea}>
						<Stack gap={1} style={parts.textArea}>
							<Box style={parts.titleRow}>
								{startSlot}
								{titleNode}
								{metadata ? (
									<Text color="muted" size="1" style={parts.metadata}>
										{metadata}
									</Text>
								) : null}
							</Box>
							{description ? (
								<Text color="muted" size="2" wrap="pretty" style={parts.description}>
									{description}
								</Text>
							) : null}
						</Stack>
						{endSlot == null || typeof endSlot === "boolean" ? null : (
							<span {...stylex.props(parts.endSlot)}>{endSlot}</span>
						)}
					</Box>
					{actions ? <Box style={parts.actions}>{actions}</Box> : null}
				</Box>
				{navigation ? <Box style={parts.navigation}>{navigation}</Box> : null}
			</Stack>
		</section>
	);
}

const parts = stylex.create({
	root: {
		paddingBlock: tokens["--space-5"],
		borderBlockEndColor: tokens["--border"],
		borderBlockEndStyle: "solid",
		borderBlockEndWidth: "1px",
		color: tokens["--fg"],
		width: "100%",
	},
	breadcrumbs: {
		minWidth: 0,
	},
	content: {
		gap: tokens["--space-4"],
		alignItems: "flex-start",
		display: "flex",
		flexWrap: "wrap",
		justifyContent: "space-between",
		minWidth: 0,
	},
	headingArea: {
		flex: "1 1 24rem",
		gap: tokens["--space-3"],
		alignItems: "flex-start",
		display: "flex",
		minWidth: 0,
	},
	textArea: {
		flex: "1 1 auto",
		minWidth: 0,
	},
	titleRow: {
		gap: tokens["--space-2"],
		alignItems: "center",
		display: "flex",
		flexWrap: "wrap",
		minWidth: 0,
	},
	title: {
		margin: 0,
		color: tokens["--fg"],
		fontSize: tokens["--font-size-5"],
		fontWeight: tokens["--font-weight-semibold"],
		letterSpacing: tokens["--letter-spacing-5"],
		lineHeight: tokens["--line-height-5"],
		textWrap: "balance",
	},
	description: {
		maxWidth: "52rem",
	},
	metadata: {
		flexShrink: 0,
	},
	endSlot: {
		alignItems: "center",
		display: "inline-flex",
		flexShrink: 0,
		marginInlineStart: "auto",
	},
	actions: {
		flex: "0 1 auto",
		gap: tokens["--space-2"],
		alignItems: "center",
		display: "flex",
		flexWrap: "wrap",
		justifyContent: "flex-end",
	},
	navigation: {
		minWidth: 0,
	},
});
