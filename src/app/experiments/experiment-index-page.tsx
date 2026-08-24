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
			<Grid gap={4} xstyle={styles.grid}>
				{items.map((item) => (
					<RouterLink
						key={item.to}
						to={item.to}
						search={true}
						{...stylex.props(styles.link, focusRing.offset)}>
						<Card.Root variant="outline" xstyle={styles.card}>
							<Card.Header>
								<span {...stylex.props(styles.icon)}>{item.icon}</span>
								<Card.Title render={<h2 />}>{item.label}</Card.Title>
								<Card.Description>{item.description}</Card.Description>
							</Card.Header>
						</Card.Root>
					</RouterLink>
				))}
			</Grid>
		</ExperimentPage>
	);
}

const styles = stylex.create({
	grid: {
		gridTemplateColumns: "repeat(auto-fit, minmax(min(16rem, 100%), 1fr))",
	},
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
	card: {
		backgroundColor: "transparent",
		height: "100%",
	},
	icon: {
		borderRadius: tokens["--radius-md"],
		alignItems: "center",
		backgroundColor: tokens["--surface-subtle"],
		color: tokens["--fg-muted"],
		display: "inline-flex",
		justifyContent: "center",
		height: tokens["--space-8"],
		width: tokens["--space-8"],
	},
});
