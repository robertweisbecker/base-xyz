import { ExperimentIndexPage } from "./experiment-index-page";
import { componentsNavigationGroup } from "./experiment-navigation";

const group = componentsNavigationGroup;

export function ComponentsIndexPage() {
	return (
		<ExperimentIndexPage
				description={group.description}
				items={group.items}
				title={group.label}
		/>
	);
}
