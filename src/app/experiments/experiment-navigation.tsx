import { FolderSimpleIcon, PictureInPictureIcon, TextboxIcon } from "@phosphor-icons/react";
import { RobotIcon } from "@phosphor-icons/react/dist/csr/Robot";
import { TableIcon } from "@phosphor-icons/react/dist/csr/Table";
import { WrenchIcon } from "@phosphor-icons/react/dist/csr/Wrench";

export const blocksNavigationGroup = {
	description: "Explore composed patterns grouped by their role in product workflows.",
	icon: <FolderSimpleIcon weight="duotone" />,
	label: "Blocks",
	to: "/experiments/blocks",
	items: [
		{
			description: "Common, reusable, opinionated component compositions.",
			icon: <WrenchIcon aria-hidden />,
			label: "Utilities",
			to: "/experiments/blocks/utilities",
		},
		{
			description: "Compositions for use in agent interfaces.",
			icon: <RobotIcon aria-hidden />,
			label: "Agent Blocks",
			to: "/experiments/blocks/agent-blocks",
		},
	],
} as const;

export const componentsNavigationGroup = {
	description: "Browse core controls grouped by the interaction patterns they support.",
	icon: <FolderSimpleIcon weight="duotone" />,
	label: "Components",
	to: "/experiments/components",
	items: [
		{
			description: "Form controls for collecting, selecting, and validating structured values.",
			icon: <TextboxIcon aria-hidden />,
			label: "Inputs",
			to: "/experiments/components/inputs",
		},
		{
			description:
				"Layered interactions for contextual details, menus, dialogs, and focused tasks.",
			icon: <PictureInPictureIcon weight="duotone" aria-hidden />,
			label: "Popups",
			to: "/experiments/components/popups",
		},
		{
			description: "Structured data displays with sorting, filtering, selection, and row actions.",
			icon: <TableIcon aria-hidden />,
			label: "Tables",
			to: "/experiments/components/tables",
		},
	],
} as const;

export const experimentNavigationGroups = [
	blocksNavigationGroup,
	componentsNavigationGroup,
] as const;

export type ExperimentNavigationGroup = (typeof experimentNavigationGroups)[number];
export type ExperimentNavigationItem = ExperimentNavigationGroup["items"][number];
export type ExperimentNavigationPath =
	ExperimentNavigationGroup["to"] | ExperimentNavigationItem["to"];
