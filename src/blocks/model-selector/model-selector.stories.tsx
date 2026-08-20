import { CirclesThreeIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button, type ButtonSize, type ButtonVariant } from "@/components";
import { Stack } from "@/components/layout/layout";
import { Text } from "@/components/text/text";

import {
	ModelSelector,
	type ModelSelectorGroup,
	type ModelSelectorValue,
} from "./model-selector";
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
		<Stack align="start" gap={5} pt={8}>
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
		</Stack>
	),
};

export const NormalizationRegression: Story = {
	render: () => <NormalizationRegressionFixture />,
};

function NormalizationRegressionFixture() {
	const [dynamicGroups, setDynamicGroups] = useState(exampleModelGroups);
	const [dynamicEvents, setDynamicEvents] = useState<RegressionEvent[]>([]);

	function removeSelectedModel() {
		setDynamicGroups((groups) =>
			groups.map((group) => ({
				...group,
				options: group.options.filter((option) => option.value !== "gpt-5.6-terra"),
			})),
		);
	}

	return (
		<Stack align="start" gap={5} pt={8}>
			<NormalizationCase
				label="Controlled invalid model"
				statusTestId="controlled-status"
				value={{ model: "removed-model", effort: "Medium", speed: "Default" }}
			/>
			<NormalizationCase
				label="Uncontrolled invalid default"
				statusTestId="uncontrolled-status"
				defaultValue={{ model: "removed-model", effort: "Medium", speed: "Default" }}
			/>
			<Stack align="start" gap={2}>
				<Text size="1" color="muted">
					Dynamic model removal
				</Text>
				<Button onClick={removeSelectedModel}>Remove selected model</Button>
				<ModelSelector.Root
					groups={dynamicGroups}
					effortOptions={exampleEffortOptions}
					speedOptions={exampleSpeedOptions}
					defaultValue={{ model: "gpt-5.6-terra", effort: "Medium", speed: "Default" }}
					onValueChange={(value, details) => setDynamicEvents((events) => [...events, { value, reason: details.reason }])}>
					<ModelSelector.Trigger aria-label="Dynamic model removal selector" />
					<ModelSelector.Popup />
				</ModelSelector.Root>
				<RegressionStatus testId="dynamic-status" events={dynamicEvents} />
			</Stack>
		</Stack>
	);
}

function NormalizationCase({
	defaultValue,
	label,
	statusTestId,
	value,
}: {
	defaultValue?: ModelSelectorValue;
	label: string;
	statusTestId: string;
	value?: ModelSelectorValue;
}) {
	const [events, setEvents] = useState<RegressionEvent[]>([]);
	return (
		<Stack align="start" gap={2}>
			<Text size="1" color="muted">
				{label}
			</Text>
			<ModelSelector.Root
				groups={emptyFirstGroupModelGroups}
				effortOptions={exampleEffortOptions}
				speedOptions={exampleSpeedOptions}
				defaultValue={defaultValue ?? { model: "gpt-5.6-sol", effort: "Medium", speed: "Default" }}
				value={value}
				onValueChange={(nextValue, details) => setEvents((current) => [...current, { value: nextValue, reason: details.reason }])}>
				<ModelSelector.Trigger aria-label={`${label} selector`} />
				<ModelSelector.Popup />
			</ModelSelector.Root>
			<RegressionStatus testId={statusTestId} events={events} />
		</Stack>
	);
}

type RegressionEvent = { value: ModelSelectorValue; reason: string };

function RegressionStatus({ events, testId }: { events: readonly RegressionEvent[]; testId: string }) {
	const latest = events.at(-1);
	return (
		<Text aria-live="polite" data-testid={testId}>
			{`${events.length}|${latest?.value.model ?? ""}|${latest?.value.effort ?? ""}|${latest?.value.speed ?? ""}|${latest?.reason ?? ""}`}
		</Text>
	);
}

const emptyFirstGroupModelGroups = [
	{ id: "empty", label: "Empty group", options: [] },
	{
		...exampleModelGroups[0],
		options: exampleModelGroups[0].options.slice(0, 2),
	},
] satisfies readonly ModelSelectorGroup[];

function ModelSelectorSample({
	defaultValue,
	groups,
	label,
	showEffort,
	size,
	variant,
}: {
	defaultValue: ModelSelectorValue;
	groups: readonly ModelSelectorGroup[];
	label: string;
	showEffort?: boolean;
	size: ButtonSize;
	variant: ButtonVariant;
}) {
	return (
		<Stack align="start" gap={2}>
			<Text size="1" color="muted">
				{label}
			</Text>
			<ModelSelector.Root
				groups={groups}
				effortOptions={exampleEffortOptions}
				speedOptions={exampleSpeedOptions}
				defaultValue={defaultValue}>
				<ModelSelector.Trigger showEffort={showEffort} size={size} variant={variant} />
				<ModelSelector.Popup />
			</ModelSelector.Root>
		</Stack>
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
] satisfies readonly ModelSelectorGroup[];
