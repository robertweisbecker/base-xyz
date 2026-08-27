import { ExperimentIndexPage } from "./experiment-index-page";
import { blocksNavigationGroup } from "./experiment-navigation";

const group = blocksNavigationGroup;

export function BlocksIndexPage() {
	return (
		<ExperimentIndexPage description={group.description} items={group.items} title={group.label} />
	);
}
