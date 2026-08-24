import * as stylex from "@stylexjs/stylex";
import { PageHeader } from "@/blocks";
import { EmptyState } from "@/components";
import { tokens } from "@/theme/tokens.stylex";

export function ExperimentsPage() {
	return (
		<main {...stylex.props(styles.page)}>
			<PageHeader
				description="Focused pages for testing component compositions and application behavior outside Storybook."
				title="Experiments"
			/>
			<EmptyState
				description="Add durable integration scenarios as routes alongside this page."
				headingLevel="h2"
				title="No experiments yet"
			/>
		</main>
	);
}

const styles = stylex.create({
	page: {
		marginInline: "auto",
		paddingInline: tokens["--space-4"],
		maxWidth: "80rem",
		width: "100%",
	},
});
