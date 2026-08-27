import { Callout, Stack, Text } from "@/components";
import { ExperimentPage, ExperimentSection } from "./experiment-page";

export function ExperimentsOverviewPage() {
	return (
		<ExperimentPage
			description="Durable integration scenarios for testing component compositions and application behavior outside Storybook."
			title="Experiments"
		>
			<Callout
				description="Choose a page from the sidebar. Each route preserves the active theme in the URL, so scenarios can be linked directly."
				title="A companion to Storybook"
			/>
			<ExperimentSection
				title="What belongs here"
				description="Use these pages when a component needs realistic surrounding UI or route-level behavior."
			>
				<Stack gap={2}>
					<Text size="2">
						Blocks combine repeatable workflows such as approvals, progress, and confirmation.
					</Text>
					<Text size="2">
						Components exercise input, popup, and table primitives in product-shaped examples.
					</Text>
				</Stack>
			</ExperimentSection>
		</ExperimentPage>
	);
}
