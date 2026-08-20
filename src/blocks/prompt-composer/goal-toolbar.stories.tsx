import { LinkSimpleIcon } from "@phosphor-icons/react/dist/csr/LinkSimple";
import { PaperclipIcon } from "@phosphor-icons/react/dist/csr/Paperclip";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { useEffect, useRef, useState, type ComponentProps, type ReactNode, type RefObject } from "react";
import { Menu, MeterGauge, Toast, Toolbar } from "@/components";
import { Box, Stack } from "@/components/layout/layout";
import { Text } from "@/components/text/text";
import { tokens } from "@/theme/tokens.stylex";

import { ModelSelector } from "@/blocks/model-selector/model-selector";
import {
	exampleDefaultValue,
	exampleEffortOptions,
	exampleModelGroups,
	exampleSpeedOptions,
} from "@/blocks/model-selector/model-selector.examples";
import { GoalToolbar } from "./goal-toolbar";
import { PromptComposer } from "./prompt-composer";

type StoryArgs = ComponentProps<typeof GoalToolbar>;

const meta = {
	title: "Blocks/Goal toolbar",
	component: GoalToolbar,
	parameters: {
		controls: { disable: true },
	},
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<StoryArgs>;

export const Examples: Story = {
	render: () => (
		<Stack gap={8} maxWidth="42rem">
			<Example title="Active goal">
				<GoalToolbar active description="Standardize Storybook stories across the component library." />
			</Example>
			<Example title="Inactive goal">
				<GoalToolbar active={false} description="Standardize Storybook stories across the component library." />
			</Example>
			<Example title="Long description">
				<GoalToolbar
					active
					description="Audit every component and block story, consolidate repetitive examples, preserve meaningful controls, and verify the resulting Storybook navigation and behavior."
				/>
			</Example>
		</Stack>
	),
};

export const Composition: Story = {
	render: () => (
		<Stack gap={12} maxWidth="42rem" pt={10}>
			<Example title="Anchored progress">
				<Box pt={8}>
					<GoalProgressDemo id="goal-toolbar-progress" />
				</Box>
			</Example>
			<Example title="Stacked prompt input">
				<Box pt={8}>
					<GoalPromptStackDemo id="goal-toolbar-prompt-progress" />
				</Box>
			</Example>
		</Stack>
	),
};

function Example({ children, title }: { children: ReactNode; title: string }) {
	return (
		<Stack gap={3}>
			<Text size="1" color="muted">
				{title}
			</Text>
			{children}
		</Stack>
	);
}

function GoalProgressDemo({ id }: { id: string }) {
	return (
		<GoalProgressProvider id={id}>
			{({ anchorRef, setGoalActive }) => (
				<Box ref={anchorRef} mx={6}>
					<GoalToolbar
						active
						description="Refactor the command palette and data table stories."
						onActiveChange={setGoalActive}
					/>
				</Box>
			)}
		</GoalProgressProvider>
	);
}

function GoalPromptStackDemo({ id }: { id: string }) {
	return (
		<GoalProgressProvider id={id}>
			{({ anchorRef, setGoalActive }) => (
				<Stack gap={0} width="full">
					<Box ref={anchorRef} mx={6}>
						<GoalToolbar
							active
							description="Wire the goal state into the next prompt before continuing."
							onActiveChange={setGoalActive}
						/>
					</Box>
					<PromptComposer.Root
						clearOnSubmit={false}
						defaultValue="Continue with the current goal and summarize the next change."
						onSubmit={() => undefined}>
						<PromptComposer.Surface>
							<PromptComposer.Input placeholder="Ask about the current goal…" />
							<PromptComposer.Footer>
								<PromptComposer.Options>
									<GoalComposerAddMenu />
									<Toolbar.Root aria-label="Prompt options" variant="unstyled">
										<ModelSelector.Root
											groups={exampleModelGroups}
											effortOptions={exampleEffortOptions}
											speedOptions={exampleSpeedOptions}
											defaultValue={exampleDefaultValue}>
											<ModelSelector.Trigger render={<Toolbar.Button style={storyParts.modelTrigger} />} />
											<ModelSelector.Popup />
										</ModelSelector.Root>
									</Toolbar.Root>
								</PromptComposer.Options>
								<PromptComposer.Actions>
									<PromptComposer.Submit />
								</PromptComposer.Actions>
							</PromptComposer.Footer>
						</PromptComposer.Surface>
					</PromptComposer.Root>
				</Stack>
			)}
		</GoalProgressProvider>
	);
}

function GoalComposerAddMenu() {
	return (
		<Menu.Root>
			<PromptComposer.AddTrigger />
			<PromptComposer.AddPopup>
				<Menu.Group>
					<Menu.GroupLabel>Add</Menu.GroupLabel>
					<Menu.Item>
						<Menu.ItemIcon>
							<PaperclipIcon aria-hidden size={16} weight="bold" />
						</Menu.ItemIcon>
						<PromptComposer.AddItemContent>Files and folders</PromptComposer.AddItemContent>
					</Menu.Item>
					<Menu.Item>
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

const goalProgressStep = 1;
const goalProgressSteps = 5;

function GoalProgressProvider({
	children,
	id,
}: {
	children: (props: {
		anchorRef: RefObject<HTMLDivElement | null>;
		setGoalActive: (active: boolean) => void;
	}) => ReactNode;
	id: string;
}) {
	const [toastManager] = useState(() => Toast.createAnchoredToastManager());

	return (
		<Toast.AnchoredProvider toastManager={toastManager} timeout={0} limit={1}>
			<GoalProgressContent id={id}>{children}</GoalProgressContent>
		</Toast.AnchoredProvider>
	);
}

function GoalProgressContent({
	children,
	id,
}: {
	children: (props: {
		anchorRef: RefObject<HTMLDivElement | null>;
		setGoalActive: (active: boolean) => void;
	}) => ReactNode;
	id: string;
}) {
	const manager = Toast.useAnchoredToastManager();
	const managerRef = useRef(manager);
	const anchorRef = useRef<HTMLDivElement | null>(null);
	const [goalActive, setGoalActive] = useState(true);

	managerRef.current = manager;

	useEffect(() => {
		if (!goalActive) {
			managerRef.current.close(id);
			return;
		}

		managerRef.current.add({
			id,
			title: `Step ${goalProgressStep} / ${goalProgressSteps} · 4 files changed`,
			description: <ChangeCount additions={12} deletions={3} />,
			timeout: 0,
			positionerProps: {
				anchor: anchorRef.current,
				side: "top",
				align: "center",
				sideOffset: 12,
			},
			data: {
				variant: "pill",
				tone: "accent",
				status: "ongoing",
				icon: (
					<MeterGauge
						aria-hidden
						fillColor="currentColor"
						showValue={false}
						size={16}
						style={storyParts.progressGauge}
						trackColor="color-mix(in srgb, currentColor 25%, transparent)"
						value={(goalProgressStep / goalProgressSteps) * 100}
					/>
				),
				dismissible: false,
			},
		});
	}, [goalActive, id]);

	return children({ anchorRef, setGoalActive });
}

function ChangeCount({ additions, deletions }: { additions: number; deletions: number }) {
	return (
		<Text
			aria-label={`${additions} additions and ${deletions} deletions`}
			render={<span />}
			style={storyParts.changeCount}>
			<Text aria-hidden render={<span />} style={storyParts.additions}>
				+{additions}
			</Text>
			<Text aria-hidden render={<span />} style={storyParts.deletions}>
				−{deletions}
			</Text>
		</Text>
	);
}

const storyParts = stylex.create({
	changeCount: {
		gap: tokens["--space-1"],
		display: "inline-flex",
	},
	additions: {
		color: tokens["--bg-success-primary"],
	},
	deletions: {
		color: tokens["--bg-error-primary"],
	},
	modelTrigger: {
		maxWidth: "100%",
	},
	progressGauge: {
		color: "inherit",
	},
});
