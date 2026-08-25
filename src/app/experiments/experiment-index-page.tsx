import { Link as RouterLink } from "@tanstack/react-router";
import * as stylex from "@stylexjs/stylex";
import { Card, Grid } from "@/components";
import { media } from "@/styles/constants.stylex";
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
			<Grid gap={4} columns={3}>
				{items.map((item) => (
					<Card.Root
						key={item.to}
						{...stylex.props(styles.link, focusRing.offset)}
						render={<RouterLink to={item.to} search={true} />}>
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
	// grid: {
	// 	gridTemplateColumns: "repeat(auto-fit, minmax(min(16rem, 100%), 1fr))",
	// },
	link: {
		borderRadius: tokens["--radius-lg"],
		textDecoration: "none",
		backgroundColor: {
			default: tokens["--surface"],
			":hover": {
				[media.canHover]: tokens["--surface-subtle"],
			},
		},
		color: "inherit",
	},
	icon: {
		borderRadius: tokens["--radius-sm"],
		alignItems: "center",
		backgroundColor: tokens["--surface-subtle"],
		color: tokens["--fg-muted"],
		display: "inline-flex",
		justifyContent: "center",
		height: tokens["--space-8"],
		width: tokens["--space-8"],
		marginBlock: tokens["--space-2"],
	},
});
