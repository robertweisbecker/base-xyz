import { CopyIcon } from "@phosphor-icons/react/dist/csr/Copy";
import { GitPullRequestIcon } from "@phosphor-icons/react/dist/csr/GitPullRequest";
import { LinkSimpleIcon } from "@phosphor-icons/react/dist/csr/LinkSimple";
import { MicrophoneIcon } from "@phosphor-icons/react/dist/csr/Microphone";
import { ThumbsUpIcon } from "@phosphor-icons/react/dist/csr/ThumbsUp";
import { ThumbsDownIcon } from "@phosphor-icons/react/dist/csr/ThumbsDown";
import * as stylex from "@stylexjs/stylex";
import { useState, type ReactNode } from "react";
import {
	AgentActionApproval,
	AsyncJobProgress,
	ContextPopover,
	GoalToolbar,
	ModelSelector,
	PromptComposer,
	StreamingResponse,
} from "@/blocks";
import {
	Badge,
	Button,
	Code,
	Grid,
	Link,
	Menu,
	Separator,
	Stack,
	Text,
	Toggle,
	ToggleGroup,
	Toolbar,
} from "@/components";
import { breakpoints } from "@/styles/constants.stylex";
import { tokens } from "@/theme/tokens.stylex";
import { experimentLayoutVars } from "./experiment-layout.stylex";
import { ExperimentPage, ExperimentSection } from "./experiment-page";
import { ImagesSquareIcon } from "@phosphor-icons/react/dist/ssr";

const agentModelGroups = [
	{
		id: "recommended",
		label: "Recommended",
		options: [
			{
				value: "gpt-5.6-sol",
				label: "5.6 Sol",
				description: "Frontier reasoning and coding",
			},
			{
				value: "gpt-5.6-terra",
				label: "5.6 Terra",
				description: "Balanced intelligence and cost",
			},
		],
	},
] as const;
const agentEffortOptions = ["Low", "Medium", "High"] as const;
const agentSpeedOptions = ["Default", "Fast"] as const;
const agentDefaultModel = { model: "gpt-5.6-sol", effort: "High", speed: "Default" } as const;

type AsyncStatus = "queued" | "running" | "complete" | "error";
type ResponseStatus = "streaming" | "complete" | "stopped" | "error";
type AgentBlockExampleProps = { description: string; id: string; title: string };

const agentBlockSections = [
	{
		id: "agent-action-approval",
		title: "Agent Action Approval",
		description: "A review boundary for consequential agent actions before execution.",
		Example: AgentActionApprovalExample,
	},
	{
		id: "async-job-progress",
		title: "Async Job Progress",
		description: "A stable surface for queued, active, completed, and failed background work.",
		Example: AsyncJobProgressExample,
	},
	{
		id: "context-popover",
		title: "Context Popover",
		description: "Composes Popover, MeterGauge, and Meter to show token usage on demand.",
		Example: ContextPopoverExample,
	},
	{
		id: "goal-toolbar",
		title: "Goal Toolbar",
		description: "Persistent goal context with built-in pause, edit, delete, and detail actions.",
		Example: GoalToolbarExample,
	},
	{
		id: "model-selector",
		title: "Model Selector",
		description: "One popup for choosing a model and tuning its effort and speed.",
		Example: ModelSelectorExample,
	},
	{
		id: "prompt-composer",
		title: "Prompt Composer",
		description: "A growing message input with contextual options and explicit submit behavior.",
		Example: PromptComposerExample,
	},
	{
		id: "streaming-response",
		title: "Streaming Response",
		description:
			"Generated content with explicit streaming, completion, interruption, and failure states.",
		Example: StreamingResponseExample,
	},
] as const;

export function AgentBlocksPage() {
	return (
		<ExperimentPage
			description="Agent workflows listed individually with their meaningful anatomy, states, and controls."
			title="Agent Blocks"
		>
			<Grid gap={8} xstyle={styles.pageLayout}>
				<AgentBlocksTableOfContents />
				<Stack gap={8} xstyle={styles.examples}>
					{agentBlockSections.map(({ Example, ...section }) => (
						<Example key={section.id} {...section} />
					))}
				</Stack>
			</Grid>
		</ExperimentPage>
	);
}

function AgentBlocksTableOfContents() {
	return (
		<aside {...stylex.props(styles.tableOfContents)}>
			<nav aria-label="Agent blocks on this page">
				<Stack gap={3}>
					<Text fontWeight="medium" size="1">
						On this page
					</Text>
					<ol {...stylex.props(styles.tableOfContentsList)}>
						{agentBlockSections.map((section) => (
							<li key={section.id}>
								<Text size="1">
									<Link color="neutral" href={`#${section.id}`}>
										{section.title}
									</Link>
								</Text>
							</li>
						))}
					</ol>
				</Stack>
			</nav>
		</aside>
	);
}

function AgentActionApprovalExample({ description, id, title }: AgentBlockExampleProps) {
	return (
		<ExperimentSection description={description} id={id} title={title}>
			<AnatomyNote>
				Header explains the decision, Summary names the proposed action, Details expose its scope,
				and Actions keep approval explicit.
			</AnatomyNote>
			<AgentActionApproval.Root>
				<AgentActionApproval.Header>
					<AgentActionApproval.Title>Allow this action?</AgentActionApproval.Title>
					<AgentActionApproval.Description>
						Review what the agent will publish before it continues.
					</AgentActionApproval.Description>
				</AgentActionApproval.Header>
				<AgentActionApproval.Content>
					<AgentActionApproval.Summary>
						<AgentActionApproval.Icon>
							<GitPullRequestIcon aria-hidden weight="duotone" />
						</AgentActionApproval.Icon>
						<AgentActionApproval.SummaryContent>
							<AgentActionApproval.Action>Open a draft pull request</AgentActionApproval.Action>
							<AgentActionApproval.ActionDescription>
								Publish the experiments branch and request review from the design-system team.
							</AgentActionApproval.ActionDescription>
						</AgentActionApproval.SummaryContent>
					</AgentActionApproval.Summary>
					<AgentActionApproval.Details>
						<AgentActionApproval.Detail>
							<AgentActionApproval.DetailLabel>Repository</AgentActionApproval.DetailLabel>
							<AgentActionApproval.DetailValue>
								<Code>acme/design-system</Code>
							</AgentActionApproval.DetailValue>
						</AgentActionApproval.Detail>
						<AgentActionApproval.Detail>
							<AgentActionApproval.DetailLabel>Branch</AgentActionApproval.DetailLabel>
							<AgentActionApproval.DetailValue>
								<Code>codex/add-experiment-routes</Code>
							</AgentActionApproval.DetailValue>
						</AgentActionApproval.Detail>
						<AgentActionApproval.Detail>
							<AgentActionApproval.DetailLabel>Visibility</AgentActionApproval.DetailLabel>
							<AgentActionApproval.DetailValue>
								<Badge size="sm" variant="subtle">
									Draft
								</Badge>
							</AgentActionApproval.DetailValue>
						</AgentActionApproval.Detail>
					</AgentActionApproval.Details>
				</AgentActionApproval.Content>
				<AgentActionApproval.Footer>
					<AgentActionApproval.Actions>
						<Button size="sm" variant="secondary">
							Cancel
						</Button>
						<Button size="sm">Allow</Button>
					</AgentActionApproval.Actions>
				</AgentActionApproval.Footer>
			</AgentActionApproval.Root>
		</ExperimentSection>
	);
}

function AsyncJobProgressExample({ description, id, title }: AgentBlockExampleProps) {
	const [status, setStatus] = useState<AsyncStatus>("running");
	const value = status === "running" || status === "error" ? 68 : undefined;

	return (
		<ExperimentSection description={description} id={id} title={title}>
			<StateControls
				label="Job state"
				onValueChange={setStatus}
				options={[
					{ label: "Queued", value: "queued" },
					{ label: "Running", value: "running" },
					{ label: "Complete", value: "complete" },
					{ label: "Error", value: "error" },
				]}
				value={status}
			/>
			<AsyncJobProgress.Root status={status} value={value}>
				<AsyncJobProgress.Header>
					<AsyncJobProgress.Heading>
						<AsyncJobProgress.Title>
							Build the component search index <AsyncJobProgress.Status />
						</AsyncJobProgress.Title>
						<AsyncJobProgress.Description>
							Generating embeddings for stories, usage guidance, and API references.
						</AsyncJobProgress.Description>
					</AsyncJobProgress.Heading>
					<AsyncJobProgress.Actions>
						<AsyncJobProgress.ActionButton />
					</AsyncJobProgress.Actions>
				</AsyncJobProgress.Header>
				<AsyncJobProgress.Progress />
			</AsyncJobProgress.Root>
		</ExperimentSection>
	);
}

function ContextPopoverExample({ description, id, title }: AgentBlockExampleProps) {
	const [usage, setUsage] = useState(71_420);

	return (
		<ExperimentSection description={description} id={id} title={title}>
			<StateControls
				label="Usage"
				onValueChange={setUsage}
				options={[
					{ label: "Low", value: 32_000 },
					{ label: "Medium", value: 71_420 },
					{ label: "High", value: 110_600 },
				]}
				value={usage}
			/>
			<Stack align="start" gap={2}>
				<ContextPopover total={128_000} usage={usage} variant="ghost" />
				<Text color="muted" size="1">
					Open the gauge to inspect the bounded token count and percentage.
				</Text>
			</Stack>
		</ExperimentSection>
	);
}

function GoalToolbarExample({ description, id, title }: AgentBlockExampleProps) {
	return (
		<ExperimentSection description={description} id={id} title={title}>
			<AnatomyNote>
				The summary keeps status, goal text, elapsed time, and actions in one toolbar. Expand it for
				the full description, or use its own controls to pause and edit the goal.
			</AnatomyNote>
			<GoalToolbar
				defaultActive
				defaultDescription="Audit the remaining component stories and summarize any inconsistent patterns."
			/>
		</ExperimentSection>
	);
}

function ModelSelectorExample({ description, id, title }: AgentBlockExampleProps) {
	const [message, setMessage] = useState("5.6 Sol · High effort · Default speed");

	return (
		<ExperimentSection description={description} id={id} title={title}>
			<Stack align="start" gap={3}>
				<ModelSelector.Root
					defaultValue={agentDefaultModel}
					effortOptions={agentEffortOptions}
					groups={agentModelGroups}
					onValueChange={(value) =>
						setMessage(`${value.model} · ${value.effort} effort · ${value.speed} speed`)
					}
					speedOptions={agentSpeedOptions}
				>
					<ModelSelector.Trigger variant="secondary" />
					<ModelSelector.Popup />
				</ModelSelector.Root>
				<Text aria-live="polite" color="muted" size="1">
					Current selection: {message}
				</Text>
			</Stack>
		</ExperimentSection>
	);
}

function PromptComposerExample({ description, id, title }: AgentBlockExampleProps) {
	const [feedback, setFeedback] = useState("Ready to send");

	return (
		<ExperimentSection description={description} id={id} title={title}>
			<AnatomyNote>
				Surface owns the input and footer; Options holds prompt-scoped controls; Actions owns submit
				or stop.
			</AnatomyNote>
			<Stack gap={3} maxWidth="42rem">
				<PromptComposer.Root
					clearOnSubmit
					defaultValue="Review the open Storybook gaps and propose the next three fixes."
					onSubmit={(prompt) => setFeedback(`Submitted ${prompt.length} characters`)}
				>
					<PromptComposer.Surface>
						<PromptComposer.Input placeholder="Ask about the current goal…" />
						<PromptComposer.Footer>
							<PromptComposer.Options>
								<Menu.Root>
									<PromptComposer.AddTrigger />
									<PromptComposer.AddPopup>
										<Menu.Group>
											<Menu.GroupLabel>Attach</Menu.GroupLabel>
											<Menu.Item onClick={() => setFeedback("File picker requested")}>
												<Menu.ItemIcon>
													<ImagesSquareIcon aria-hidden />
												</Menu.ItemIcon>
												<PromptComposer.AddItemContent>Upload files</PromptComposer.AddItemContent>
											</Menu.Item>
											<Menu.Item onClick={() => setFeedback("Link attachment requested")}>
												<Menu.ItemIcon>
													<LinkSimpleIcon aria-hidden />
												</Menu.ItemIcon>
												<PromptComposer.AddItemContent>Add from URL</PromptComposer.AddItemContent>
											</Menu.Item>
										</Menu.Group>
									</PromptComposer.AddPopup>
								</Menu.Root>
								<Separator orientation="vertical" mx={2} my={2} />
								<ContextPopover total={128_000} usage={71_420} variant="ghost" />
								<ModelSelector.Root
									defaultValue={agentDefaultModel}
									effortOptions={agentEffortOptions}
									groups={agentModelGroups}
									onValueChange={() => setFeedback("Model settings updated")}
									speedOptions={agentSpeedOptions}
								>
									<ModelSelector.Trigger shape="pill" variant="ghost" />
									<ModelSelector.Popup />
								</ModelSelector.Root>
							</PromptComposer.Options>
							<PromptComposer.Actions>
								<Toggle
									icon={<MicrophoneIcon aria-hidden />}
									label="Use microphone"
									onPressedChange={(pressed) =>
										setFeedback(pressed ? "Microphone enabled" : "Microphone disabled")
									}
									shape="circle"
								/>
								<PromptComposer.Submit />
							</PromptComposer.Actions>
						</PromptComposer.Footer>
					</PromptComposer.Surface>
				</PromptComposer.Root>
				<Text aria-live="polite" color="muted" size="1">
					{feedback}
				</Text>
			</Stack>
		</ExperimentSection>
	);
}

function StreamingResponseExample({ description, id, title }: AgentBlockExampleProps) {
	const [status, setStatus] = useState<ResponseStatus>("complete");
	const [streamKey, setStreamKey] = useState(0);
	const content =
		status === "error"
			? "The response could not be completed. Try again when the connection is restored."
			: status === "stopped"
				? "Generation stopped after reviewing the current Storybook inventory."
				: "The component audit is complete. Five stories need consolidated state examples, and two controls expose layout props that should remain fixed in documentation.";

	function changeStatus(nextStatus: ResponseStatus) {
		setStatus(nextStatus);
		if (nextStatus === "streaming") setStreamKey((key) => key + 1);
	}

	return (
		<ExperimentSection description={description} id={id} title={title}>
			<StateControls
				label="Response state"
				onValueChange={changeStatus}
				options={[
					{ label: "Streaming", value: "streaming" },
					{ label: "Complete", value: "complete" },
					{ label: "Stopped", value: "stopped" },
					{ label: "Error", value: "error" },
				]}
				value={status}
			/>
			<StreamingResponse.Root
				aria-label="Component audit response"
				elapsedSeconds={46}
				status={status}
			>
				<StreamingResponse.Status />
				<StreamingResponse.Content
					streamKey={streamKey}
					onStreamingComplete={() => setStatus("complete")}
				>
					{content}
				</StreamingResponse.Content>
				<StreamingResponse.Actions>
					<Toolbar.Button aria-label="Approve response">
						<ThumbsUpIcon aria-hidden />
					</Toolbar.Button>
					<Toolbar.Button aria-label="Reject response">
						<ThumbsDownIcon aria-hidden />
					</Toolbar.Button>
					<Toolbar.Button aria-label="Copy response">
						<CopyIcon aria-hidden />
					</Toolbar.Button>
				</StreamingResponse.Actions>
			</StreamingResponse.Root>
		</ExperimentSection>
	);
}

function AnatomyNote({ children }: { children: ReactNode }) {
	return (
		<Text color="muted" size="2" wrap="pretty">
			<strong>Anatomy:</strong> {children}
		</Text>
	);
}

function StateControls<Value extends number | string>({
	label,
	onValueChange,
	options,
	value,
}: {
	label: string;
	onValueChange: (value: Value) => void;
	options: readonly { label: string; value: Value }[];
	value: Value;
}) {
	const selectedValue = String(value);

	function handleValueChange(nextValues: string[]) {
		const nextValue = nextValues[0];
		if (nextValue === undefined) return;
		const nextOption = options.find((option) => String(option.value) === nextValue);
		if (nextOption) onValueChange(nextOption.value);
	}

	return (
		<Stack gap={2}>
			<Text color="muted" size="1">
				{label}
			</Text>
			<ToggleGroup
				aria-label={label}
				onValueChange={handleValueChange}
				value={[selectedValue]}
				xstyle={styles.stateControls}
			>
				{options.map((option) => (
					<Toggle
						key={String(option.value)}
						size="sm"
						value={String(option.value)}
						variant="secondary"
					>
						{option.label}
					</Toggle>
				))}
			</ToggleGroup>
		</Stack>
	);
}

const styles = stylex.create({
	pageLayout: {
		alignItems: "start",
		gridTemplateColumns: {
			default: "minmax(0, 1fr)",
			[breakpoints.lg]: "minmax(0, 1fr) 13rem",
		},
	},
	examples: {
		gridColumnStart: {
			default: "1",
			[breakpoints.lg]: "1",
		},
		gridRowStart: {
			default: "2",
			[breakpoints.lg]: "1",
		},
		minWidth: 0,
	},
	stateControls: {
		flexWrap: "wrap",
	},
	tableOfContents: {
		borderBlockEndColor: {
			default: tokens["--border"],
			[breakpoints.lg]: "transparent",
		},
		borderBlockEndStyle: {
			default: "solid",
			[breakpoints.lg]: "none",
		},
		borderBlockEndWidth: tokens["--border-width"],
		borderInlineStartColor: {
			default: "transparent",
			[breakpoints.lg]: tokens["--border"],
		},
		borderInlineStartStyle: {
			default: "none",
			[breakpoints.lg]: "solid",
		},
		borderInlineStartWidth: tokens["--border-width"],
		gridColumnStart: {
			default: "1",
			[breakpoints.lg]: "2",
		},
		gridRowStart: "1",
		paddingBlockEnd: {
			default: tokens["--space-5"],
			[breakpoints.lg]: 0,
		},
		paddingInlineStart: {
			default: 0,
			[breakpoints.lg]: tokens["--space-4"],
		},
		position: {
			default: "static",
			[breakpoints.lg]: "sticky",
		},
		top: {
			default: "auto",
			[breakpoints.lg]: experimentLayoutVars["--anchor-offset"],
		},
	},
	tableOfContentsList: {
		margin: 0,
		padding: 0,
		gap: tokens["--space-1"],
		listStyle: "none",
		display: "flex",
		flexDirection: "column",
	},
});
