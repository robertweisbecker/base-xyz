import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import type { ButtonSize, ButtonVariant } from "@/components/button/button";
import { tokens } from "@/theme/tokens.stylex";

import * as ModelSelector from "./model-selector";
import {
	exampleDefaultValue,
	exampleEffortOptions,
	exampleModelGroups,
	exampleSpeedOptions,
} from "./model-selector.examples";
import { CirclesThreeIcon } from "@phosphor-icons/react";

const meta = {
	title: "Blocks/Model selector",
	parameters: {
		controls: { disable: true },
	},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Examples: Story = {
	render: () => (
		<div {...stylex.props(storyParts.stack)}>
			<ModelSelectorSample
				label="Brand icons"
				groups={exampleModelGroups}
				defaultValue={exampleDefaultValue}
				size="md"
				variant="secondary"
			/>
			<ModelSelectorSample
				label="Fallback icons"
				groups={modelGroupsWithIcons}
				defaultValue={{ model: "claude-fable-5", effort: "Medium", speed: "Default" }}
				size="md"
				variant="neutral"
			/>
			<ModelSelectorSample
				label="No icons"
				groups={iconlessModelGroups}
				defaultValue={{ model: "composer-2-5", effort: "Medium", speed: "Default" }}
				size="md"
				variant="secondary"
			/>
			<ModelSelectorSample
				label="Effort hidden"
				groups={exampleModelGroups}
				defaultValue={{ model: "gpt-5.6-terra", effort: "High", speed: "Default" }}
				showEffort={false}
				size="md"
				variant="secondary"
			/>
		</div>
	),
};

function ModelSelectorSample({
	defaultValue,
	groups,
	label,
	showEffort,
	size,
	variant,
}: {
	defaultValue: ModelSelector.ModelSelectorValue;
	groups: readonly ModelSelector.ModelSelectorGroup[];
	label: string;
	showEffort?: boolean;
	size: ButtonSize;
	variant: ButtonVariant;
}) {
	return (
		<section {...stylex.props(storyParts.sample)}>
			<h2 {...stylex.props(storyParts.label)}>{label}</h2>
			<ModelSelector.Root
				groups={groups}
				effortOptions={exampleEffortOptions}
				speedOptions={exampleSpeedOptions}
				defaultValue={defaultValue}>
				<ModelSelector.Trigger showEffort={showEffort} size={size} variant={variant} />
				<ModelSelector.Popup />
			</ModelSelector.Root>
		</section>
	);
}

const modelGroupsWithIcons = exampleModelGroups.map((group) => ({
	...group,
	options: group.options.map((option) => ({
		...option,
		icon: <CirclesThreeIcon aria-hidden weight="duotone" />,
	})),
}));

const iconlessModelGroups = [
	{
		id: "other",
		label: "Other models",
		options: [
			{
				value: "composer-2-5",
				label: "Composer 2.5",
				description: "Editor-native agent model",
			},
			{
				value: "grok-4-5",
				label: "Grok 4.5",
				description: "Agentic coding and workflow model",
			},
			{
				value: "kimi-k2-6",
				label: "Kimi K2.6",
				description: "Multimodal agent model",
			},
			{
				value: "gemini-3-6-flash",
				label: "Gemini 3.6 Flash",
				description: "Efficient agentic multimodal model",
			},
		],
	},
] satisfies readonly ModelSelector.ModelSelectorGroup[];

const storyParts = stylex.create({
	stack: {
		gap: tokens["--space-5"],
		alignItems: "flex-start",
		display: "flex",
		flexDirection: "column",
		paddingBlockStart: tokens["--space-8"],
	},
	sample: {
		gap: tokens["--space-2"],
		alignItems: "flex-start",
		display: "flex",
		flexDirection: "column",
	},
	label: {
		margin: 0,
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-1"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
	},
});
