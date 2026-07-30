import { RobotIcon } from "@phosphor-icons/react/dist/csr/Robot";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import type { ButtonSize, ButtonVariant } from "@/components/button/button";
import { color, space } from "@/styles/tokens.stylex";
import { fontSize, letterSpacing, lineHeight } from "@/styles/tokens.stylex";
import * as ModelSelector from "./model-selector";
import {
	exampleDefaultValue,
	exampleEffortOptions,
	exampleModelGroups,
	exampleSpeedOptions,
} from "./model-selector.examples";

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
				label="Primary model with icons"
				groups={modelGroupsWithIcons}
				defaultValue={exampleDefaultValue}
				size="lg"
				variant="secondary"
			/>
			<ModelSelectorSample
				label="Alternative model"
				groups={exampleModelGroups}
				defaultValue={{ model: "claude-fable-5", effort: "Medium", speed: "Default" }}
				size="md"
				variant="neutral"
			/>
			<ModelSelectorSample
				label="Options without icons"
				groups={iconlessModelGroups}
				defaultValue={{ model: "composer-2-5", effort: "Medium", speed: "Default" }}
				size="lg"
				variant="secondary"
			/>
			<ModelSelectorSample
				label="Effort hidden"
				groups={exampleModelGroups}
				defaultValue={{ model: "gpt-5.6-terra", effort: "High", speed: "Default" }}
				showEffort={false}
				size="lg"
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
		icon: <RobotIcon aria-hidden weight="duotone" />,
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
		gap: space.x5,
		alignItems: "flex-start",
		display: "flex",
		flexDirection: "column",
		paddingBlockStart: space.x8,
	},
	sample: {
		gap: space.x2,
		alignItems: "flex-start",
		display: "flex",
		flexDirection: "column",
	},
	label: {
		margin: 0,
		color: color.fgMuted,
		fontSize: fontSize.x1,
		letterSpacing: letterSpacing.x1,
		lineHeight: lineHeight.x1,
	},
});
