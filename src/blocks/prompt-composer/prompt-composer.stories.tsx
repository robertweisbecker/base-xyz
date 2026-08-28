import { GlobeIcon } from "@phosphor-icons/react/dist/csr/Globe";
import { LinkSimpleIcon } from "@phosphor-icons/react/dist/csr/LinkSimple";
import { PaperclipIcon } from "@phosphor-icons/react/dist/csr/Paperclip";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { useState, type ReactNode } from "react";
import { Button, Menu, Separator } from "@/components";
import { Stack } from "@/components/layout/layout";
import { Text } from "@/components/text/text";

import { ModelSelector } from "@/blocks/model-selector/model-selector";
import {
	exampleDefaultValue,
	exampleEffortOptions,
	exampleModelGroups,
	exampleSpeedOptions,
	getExampleModelLabel,
} from "@/blocks/model-selector/model-selector.examples";
import { PromptComposer, type PromptComposerRootProps } from "./prompt-composer";

type ComposerDemoProps = Pick<
	PromptComposerRootProps,
	"clearOnSubmit" | "defaultValue" | "disabled"
>;

const meta = {
	title: "Blocks/Prompt composer",
	component: PromptComposer.Root,
	args: {
		onSubmit: () => undefined,
	},
	argTypes: {
		onSubmit: { control: false },
	},
	parameters: {
		controls: { disable: true },
	},
} satisfies Meta<typeof PromptComposer.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Examples: Story = {
	render: () => (
		<Stack gap={6} maxWidth="42rem">
			<Example label="Ready, empty">
				<ComposerDemo clearOnSubmit defaultValue="" disabled={false} />
			</Example>
			<Separator />
			<Example label="Ready, filled">
				<ComposerDemo clearOnSubmit={false} defaultValue="Summarize the open review comments." />
			</Example>
			<Separator />
			<Example label="Growing input" testId="growing-prompt-composer">
				<ComposerDemo
					clearOnSubmit={false}
					defaultValue={
						"Summarize the open review comments.\nInclude the affected components and the verification steps."
					}
				/>
			</Example>
			<Separator />
			<Example label="Disabled">
				<DisabledDemo />
			</Example>
			<Separator />
			<Example label="Generating">
				<GeneratingDemo />
			</Example>
		</Stack>
	),
};

function ComposerSurface({
	children,
	submitting = false,
	onStop,
}: {
	children?: React.ReactNode;
	submitting?: boolean;
	onStop?: () => void;
}) {
	return (
		<PromptComposer.Surface>
			<PromptComposer.Input />
			<PromptComposer.Footer>
				<PromptComposer.Options>{children}</PromptComposer.Options>
				<PromptComposer.Actions>
					{submitting ? <PromptComposer.Stop onClick={onStop} /> : <PromptComposer.Submit />}
				</PromptComposer.Actions>
			</PromptComposer.Footer>
		</PromptComposer.Surface>
	);
}

function AddMenu({ setFeedback }: { setFeedback: (message: string) => void }) {
	return (
		<Menu.Root>
			<PromptComposer.AddTrigger />
			<PromptComposer.AddPopup>
				<Menu.Group>
					<Menu.GroupLabel>Add</Menu.GroupLabel>
					<Menu.Item onClick={() => setFeedback("Attachment action requested.")}>
						<Menu.ItemIcon>
							<PaperclipIcon aria-hidden size={16} weight="bold" />
						</Menu.ItemIcon>
						<PromptComposer.AddItemContent>Files and folders</PromptComposer.AddItemContent>
					</Menu.Item>
					<Menu.Item onClick={() => setFeedback("Link action requested.")}>
						<Menu.ItemIcon>
							<LinkSimpleIcon aria-hidden size={16} weight="bold" />
						</Menu.ItemIcon>
						<PromptComposer.AddItemContent>
							<span>Add a link</span>
							<PromptComposer.AddItemDescription>Paste a URL</PromptComposer.AddItemDescription>
						</PromptComposer.AddItemContent>
					</Menu.Item>
				</Menu.Group>
			</PromptComposer.AddPopup>
		</Menu.Root>
	);
}

function GeneratingDemo() {
	const [feedback, setFeedback] = useState("Generating a response…");
	const [submitting, setSubmitting] = useState(true);
	const [webSearch, setWebSearch] = useState(false);

	return (
		<Stack gap={3} maxWidth="42rem" width="full">
			<PromptComposer.Root
				defaultValue="Summarize the open review comments."
				onSubmit={(prompt) => setFeedback(`Submitted: ${prompt}`)}
				submitting={submitting}
			>
				<ComposerSurface
					submitting={submitting}
					onStop={() => {
						setSubmitting(false);
						setFeedback("Generation stopped.");
					}}
				>
					<Button
						variant="neutral"
						size="sm"
						shape="pill"
						startSlot={<GlobeIcon aria-hidden />}
						aria-label="Search the web"
						aria-pressed={webSearch}
						onClick={() => {
							setWebSearch((enabled) => !enabled);
							setFeedback(webSearch ? "Web search disabled." : "Web search enabled.");
						}}
					>
						Search
					</Button>
				</ComposerSurface>
			</PromptComposer.Root>
			<Feedback>{feedback}</Feedback>
		</Stack>
	);
}

function DisabledDemo() {
	return (
		<PromptComposer.Root
			defaultValue="Summarize the open review comments."
			disabled
			onSubmit={() => undefined}
		>
			<ComposerSurface />
		</PromptComposer.Root>
	);
}

function ComposerDemo({ clearOnSubmit, defaultValue, disabled }: ComposerDemoProps) {
	const [feedback, setFeedback] = useState(
		"Press Enter to send. Use Shift + Enter for a new line.",
	);

	return (
		<Stack gap={3} maxWidth="42rem" width="full">
			<PromptComposer.Root
				clearOnSubmit={clearOnSubmit}
				defaultValue={defaultValue}
				disabled={disabled}
				onSubmit={(prompt) => setFeedback(`Submitted: ${prompt}`)}
			>
				<ComposerSurface>
					<AddMenu setFeedback={setFeedback} />

					<ModelSelector.Root
						groups={exampleModelGroups}
						effortOptions={exampleEffortOptions}
						speedOptions={exampleSpeedOptions}
						defaultValue={exampleDefaultValue}
						onValueChange={(value, { reason }) => {
							if (reason === "reset") {
								setFeedback("Model settings reset to defaults.");
								return;
							}
							if (reason === "model") {
								setFeedback(`Model changed to ${getExampleModelLabel(value.model)}.`);
								return;
							}
							if (reason === "effort") {
								setFeedback(`Effort changed to ${value.effort}.`);
								return;
							}
							setFeedback(`Speed changed to ${value.speed}.`);
						}}
					>
						<ModelSelector.Trigger
							variant="neutral"
							size="sm"
							shape="pill"
							xstyle={storyParts.modelTrigger}
						/>
						<ModelSelector.Popup />
					</ModelSelector.Root>
				</ComposerSurface>
			</PromptComposer.Root>
			<Feedback>{feedback}</Feedback>
		</Stack>
	);
}

function Example({
	children,
	label,
	testId,
}: {
	children: ReactNode;
	label: string;
	testId?: string;
}) {
	return (
		<Stack data-testid={testId} gap={3}>
			<Text size="1" color="muted">
				{label}
			</Text>
			{children}
		</Stack>
	);
}

function Feedback({ children }: { children: ReactNode }) {
	return (
		<Text aria-live="polite" size="1" color="muted">
			{children}
		</Text>
	);
}

const storyParts = stylex.create({
	modelTrigger: {
		maxWidth: "100%",
	},
});
