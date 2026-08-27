import { Link as RouterLink } from "@tanstack/react-router";
import * as stylex from "@stylexjs/stylex";
import { Card, Grid } from "@/components";
import { breakpoints, media } from "@/styles/constants.stylex";
import { focusRing } from "@/styles/recipes/focus";
import { tokens } from "@/theme/tokens.stylex";
import { ExperimentPage } from "./experiment-page";
import type { ExperimentNavigationItem } from "./experiment-navigation";

export function ExperimentIndexPage({
	description,
	items,
	title,
}: {
	description: string;
	items: readonly ExperimentNavigationItem[];
	title: string;
}) {
	return (
		<ExperimentPage description={description} title={title}>
			<Grid data-experiment-index-grid gap={4} xstyle={styles.grid}>
				{items.map((item) => (
					<Card.Root
						key={item.to}
						render={<RouterLink to={item.to} search={true} />}
						xstyle={[styles.link, focusRing.offset]}
					>
						<Card.Header>
							<span {...stylex.props(styles.icon)}>{item.icon}</span>
							<Card.Title render={<h2 />}>{item.label}</Card.Title>
						</Card.Header>
						<Card.Content>
							<Card.Description>{item.description}</Card.Description>
						</Card.Content>
					</Card.Root>
				))}
			</Grid>
		</ExperimentPage>
	);
}

const styles = stylex.create({
	grid: {
		gridTemplateColumns: {
			default: "minmax(0, 1fr)",
			[breakpoints.md]: "repeat(3, minmax(0, 1fr))",
		},
	},
	link: {
		borderRadius: tokens["--radius-lg"],
		textDecoration: "none",
		backgroundColor: {
			default: tokens["--surface"],
			":hover": {
				default: null,
				[media.canHover]: tokens["--surface-subtle"],
			},
		},
		color: "inherit",
	},
	icon: {
		borderRadius: tokens["--radius-sm"],
		marginBlock: tokens["--space-2"],
		alignItems: "center",
		backgroundColor: tokens["--surface-subtle"],
		color: tokens["--fg-muted"],
		display: "inline-flex",
		justifyContent: "center",
		height: tokens["--space-8"],
		width: tokens["--space-8"],
	},
});
