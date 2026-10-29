import {
	IconAgentSimple,
	IconFolder,
	IconPictureInPicture,
	IconTable,
	IconTextBox,
	IconWrench,
} from "fyicons";

export const blocksNavigationGroup = {
	description: "Explore composed patterns grouped by their role in product workflows.",
	icon: <IconFolder size="1em" />,
	label: "Blocks",
	to: "/experiments/blocks",
	items: [
		{
			description: "Common, reusable, opinionated component compositions.",
			icon: <IconWrench size="1em" aria-hidden />,
			label: "Utilities",
			to: "/experiments/blocks/utilities",
		},
		{
			description: "Compositions for use in agent interfaces.",
			icon: <IconAgentSimple size="1em" aria-hidden />,
			label: "Agent Blocks",
			to: "/experiments/blocks/agent-blocks",
		},
	],
} as const;

export const componentsNavigationGroup = {
	description: "Browse core controls grouped by the interaction patterns they support.",
	icon: <IconFolder size="1em" />,
	label: "Components",
	to: "/experiments/components",
	items: [
		{
			description: "Form controls for collecting, selecting, and validating structured values.",
			icon: <IconTextBox size="1em" aria-hidden />,
			label: "Inputs",
			to: "/experiments/components/inputs",
		},
		{
			description:
				"Layered interactions for contextual details, menus, dialogs, and focused tasks.",
			icon: <IconPictureInPicture size="1em" aria-hidden />,
			label: "Popups",
			to: "/experiments/components/popups",
		},
		{
			description: "Structured data displays with sorting, filtering, selection, and row actions.",
			icon: <IconTable size="1em" aria-hidden />,
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
