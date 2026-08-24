import { BrowserIcon } from "@phosphor-icons/react/dist/csr/Browser";
import { CursorClickIcon } from "@phosphor-icons/react/dist/csr/CursorClick";
import { RobotIcon } from "@phosphor-icons/react/dist/csr/Robot";
import { SlidersHorizontalIcon } from "@phosphor-icons/react/dist/csr/SlidersHorizontal";
import { TableIcon } from "@phosphor-icons/react/dist/csr/Table";
import { WrenchIcon } from "@phosphor-icons/react/dist/csr/Wrench";

export const blocksNavigationGroup = {
	description: "Explore composed patterns grouped by their role in product workflows.",
	icon: <BrowserIcon weight="duotone" />,
	label: "Blocks",
	to: "/experiments/blocks",
	items: [
		{
			description: "Reusable application workflows for credentials, confirmations, page structure, and progress.",
			icon: <WrenchIcon aria-hidden weight="duotone" />,
			label: "Utilities",
			to: "/experiments/blocks/utilities",
		},
		{
			description: "Composed surfaces for prompting, model context, approvals, jobs, and generated responses.",
			icon: <RobotIcon aria-hidden weight="duotone" />,
			label: "Agent Blocks",
			to: "/experiments/blocks/agent-blocks",
		},
	],
} as const;

export const componentsNavigationGroup = {
	description: "Browse core controls grouped by the interaction patterns they support.",
	icon: <BrowserIcon weight="duotone" />,
	label: "Components",
	to: "/experiments/components",
	items: [
		{
			description: "Form controls for collecting, selecting, and validating structured values.",
			icon: <SlidersHorizontalIcon aria-hidden weight="duotone" />,
			label: "Inputs",
			to: "/experiments/components/inputs",
		},
		{
			description: "Layered interactions for contextual details, menus, dialogs, and focused tasks.",
			icon: <CursorClickIcon aria-hidden weight="duotone" />,
			label: "Popups",
			to: "/experiments/components/popups",
		},
		{
			description: "Structured data displays with sorting, filtering, selection, and row actions.",
			icon: <TableIcon aria-hidden weight="duotone" />,
			label: "Tables",
			to: "/experiments/components/tables",
		},
	],
} as const;

export const experimentNavigationGroups = [blocksNavigationGroup, componentsNavigationGroup] as const;

export type ExperimentNavigationGroup = (typeof experimentNavigationGroups)[number];
export type ExperimentNavigationItem = ExperimentNavigationGroup["items"][number];
export type ExperimentNavigationPath = ExperimentNavigationGroup["to"] | ExperimentNavigationItem["to"];
