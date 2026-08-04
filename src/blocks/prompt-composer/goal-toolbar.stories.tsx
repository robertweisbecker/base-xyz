import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { useEffect, useRef, useState, type ComponentProps, type ReactNode, type RefObject } from "react";
import { Loader } from "@/components/loader/loader";
import * as Toast from "@/components/toast";
import { tokens } from "@/theme/tokens.stylex";

import { GoalToolbar } from "./goal-toolbar";
import * as PromptComposer from "./prompt-composer";

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
		<div {...stylex.props(storyParts.examples)}>
			<section {...stylex.props(storyParts.example)}>
				<h2 {...stylex.props(storyParts.label)}>Active goal</h2>
				<GoalToolbar active description="Standardize Storybook stories across the component library." />
			</section>
			<section {...stylex.props(storyParts.example)}>
				<h2 {...stylex.props(storyParts.label)}>Inactive goal</h2>
				<GoalToolbar active={false} description="Standardize Storybook stories across the component library." />
			</section>
			<section {...stylex.props(storyParts.example)}>
				<h2 {...stylex.props(storyParts.label)}>Long description</h2>
				<GoalToolbar
					active
					description="Audit every component and block story, consolidate repetitive examples, preserve meaningful controls, and verify the resulting Storybook navigation and behavior."
				/>
			</section>
		</div>
	),
};

export const Composition: Story = {
	render: () => (
		<div {...stylex.props(storyParts.compositionExamples)}>
			<section {...stylex.props(storyParts.compositionExample)}>
				<h2 {...stylex.props(storyParts.label)}>Anchored progress</h2>
				<div {...stylex.props(storyParts.compositionStage)}>
					<GoalProgressDemo id="goal-toolbar-progress" />
				</div>
			</section>
			<section {...stylex.props(storyParts.compositionExample)}>
				<h2 {...stylex.props(storyParts.label)}>Stacked prompt input</h2>
				<div {...stylex.props(storyParts.compositionStage)}>
					<GoalPromptStackDemo id="goal-toolbar-prompt-progress" />
				</div>
			</section>
		</div>
	),
};

function GoalProgressDemo({ id }: { id: string }) {
	return (
		<GoalProgressProvider id={id}>
			{({ anchorRef, setGoalActive }) => (
				<div ref={anchorRef}>
					<GoalToolbar
						active
						description="Refactor the command palette and data table stories."
						onActiveChange={setGoalActive}
					/>
				</div>
			)}
		</GoalProgressProvider>
	);
}

function GoalPromptStackDemo({ id }: { id: string }) {
	return (
		<GoalProgressProvider id={id}>
			{({ anchorRef, setGoalActive }) => (
				<div ref={anchorRef} {...stylex.props(storyParts.promptStack)}>
					<GoalToolbar
						active
						description="Wire the goal state into the next prompt before continuing."
						onActiveChange={setGoalActive}
					/>
					<PromptComposer.Root
						clearOnSubmit={false}
						defaultValue="Continue with the current goal and summarize the next change."
						onSubmit={() => undefined}
						style={storyParts.promptRoot}>
						<PromptComposer.Surface variant="standard" style={storyParts.promptSurface}>
							<PromptComposer.Input placeholder="Ask about the current goal…" />
							<PromptComposer.Footer>
								<PromptComposer.Options />
								<PromptComposer.Actions>
									<PromptComposer.Submit />
								</PromptComposer.Actions>
							</PromptComposer.Footer>
						</PromptComposer.Surface>
					</PromptComposer.Root>
				</div>
			)}
		</GoalProgressProvider>
	);
}

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
			title: "Step 1 / 5 · 4 files changed",
			description: <ChangeCount additions={12} deletions={3} />,
			timeout: 0,
			positionerProps: {
				anchor: anchorRef.current,
				side: "top",
				align: "start",
				sideOffset: 12,
			},
			data: {
				variant: "pill",
				tone: "accent",
				status: "ongoing",
				icon: <Loader aria-hidden />,
				dismissible: false,
			},
		});
	}, [goalActive, id]);

	return children({ anchorRef, setGoalActive });
}

function ChangeCount({ additions, deletions }: { additions: number; deletions: number }) {
	return (
		<span
			aria-label={`${additions} additions and ${deletions} deletions`}
			{...stylex.props(storyParts.changeCount)}>
			<span aria-hidden {...stylex.props(storyParts.additions)}>
				+{additions}
			</span>
			<span aria-hidden {...stylex.props(storyParts.deletions)}>
				−{deletions}
			</span>
		</span>
	);
}

const storyParts = stylex.create({
	examples: {
		gap: tokens["--space-8"],
		display: "flex",
		flexDirection: "column",
	},
	example: {
		gap: tokens["--space-3"],
		display: "flex",
		flexDirection: "column",
		maxWidth: "42rem",
	},
	compositionExamples: {
		gap: tokens["--space-12"],
		display: "flex",
		flexDirection: "column",
		paddingBlockStart: tokens["--space-10"],
		maxWidth: "42rem",
	},
	compositionExample: {
		gap: tokens["--space-3"],
		display: "flex",
		flexDirection: "column",
	},
	compositionStage: {
		paddingBlockStart: tokens["--space-8"],
	},
	promptStack: {
		gap: 0,
		display: "flex",
		flexDirection: "column",
		width: "100%",
	},
	promptRoot: {
		gap: 0,
		maxWidth: "none",
	},
	promptSurface: {
		borderTopLeftRadius: 0,
		borderTopRightRadius: 0,
	},
	label: {
		margin: 0,
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-1"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
	},
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
});
