import { useEffect, useRef, useState } from "react";
import { AgentActionApproval, AsyncJobProgress, PromptComposer, StreamingResponse } from "@/blocks";
import { Button, Stack, Text, Toggle } from "@/components";

type Phase =
	| "ready"
	| "reviewing"
	| "approval"
	| "publishing"
	| "responding"
	| "complete"
	| "failed"
	| "cancelled"
	| "rejected";
type Run = { phase: Phase; prompt: string; progress: number; attempt: number; failFirst: boolean };
const initialRun: Run = { phase: "ready", prompt: "", progress: 0, attempt: 1, failFirst: false };
const summary =
	"I reviewed the component stories and prepared three changes: consolidate form states, document keyboard interactions, and add narrow-screen examples. The proposed draft contains only these documentation changes. Review the scope before continuing.";
const labels = {
	ready: "Ready for a new request",
	reviewing: "Reviewing stories",
	approval: "Waiting for your approval",
	publishing: "Preparing the local draft",
	responding: "Writing the result",
	complete: "Draft ready",
	failed: "Preparation failed. Your approved scope is preserved.",
	cancelled: "Run cancelled. No draft was created.",
	rejected: "Action rejected. No draft was created.",
} satisfies Record<Phase, string>;

/** Local simulation: this composition never publishes or sends data. */
export function AgentWorkflow() {
	const [run, setRun] = useState(initialRun);
	const [prompt, setPrompt] = useState(
		"Review our component stories and prepare a draft with the next three improvements.",
	);
	const [failFirst, setFailFirst] = useState(false);
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const decisionRef = useRef<HTMLButtonElement>(null);
	const stopRef = useRef<HTMLButtonElement>(null);
	const resultRef = useRef<HTMLDivElement>(null);
	const active = ["reviewing", "approval", "publishing", "responding"].includes(run.phase);
	const working = ["reviewing", "publishing", "responding"].includes(run.phase);
	const terminal = ["complete", "failed", "cancelled", "rejected"].includes(run.phase);

	useEffect(() => {
		if (run.phase !== "publishing") return;
		const timer = window.setTimeout(() => {
			setRun((current) => {
				if (current.phase !== "publishing") return current;
				const progress = Math.min(current.progress + 20, 100);
				if (progress === 60 && current.failFirst && current.attempt === 1)
					return { ...current, progress, phase: "failed" };
				return { ...current, progress, phase: progress === 100 ? "responding" : "publishing" };
			});
		}, 650);
		return () => window.clearTimeout(timer);
	}, [run.phase, run.progress]);

	useEffect(() => {
		if (run.phase === "approval") decisionRef.current?.focus();
		else if (terminal) resultRef.current?.focus();
		else if (["publishing", "responding"].includes(run.phase)) stopRef.current?.focus();
	}, [run.phase, terminal]);

	function start(value: string) {
		if (active || terminal || !value.trim()) return;
		setRun({ ...initialRun, prompt: value.trim(), phase: "reviewing", failFirst });
	}
	const outcome = runOutcome(run);
	const composerHint = terminal
		? "Choose New run to send another request"
		: "Enter to send · Shift+Enter for a new line";

	function cancel() {
		setRun((current) => ({ ...current, phase: "cancelled" }));
	}
	function reset() {
		setRun(initialRun);
		inputRef.current?.focus();
	}
	function finishReview() {
		setRun((current) =>
			current.phase === "reviewing" ? { ...current, phase: "approval" } : current,
		);
	}
	function finishResponse() {
		setRun((current) =>
			current.phase === "responding" ? { ...current, phase: "complete" } : current,
		);
	}

	return (
		<Stack gap={5} maxWidth="44rem" minWidth={0}>
			<Text color="muted" size="1">
				Local demo · Nothing is published. Try approval, rejection, cancellation, or a recoverable
				failure.
			</Text>
			<Text aria-live="polite" aria-atomic="true" size="1" color="muted">
				{outcome}
			</Text>
			{run.phase !== "ready" && (
				<Stack gap={2}>
					<Text size="1" color="muted">
						Your request
					</Text>
					<Text wrap="pretty">{run.prompt}</Text>
				</Stack>
			)}
			{["reviewing", "approval", "publishing", "failed", "responding", "complete"].includes(
				run.phase,
			) && (
				<StreamingResponse.Root
					aria-label="Agent review"
					status={run.phase === "reviewing" ? "streaming" : "complete"}
				>
					<StreamingResponse.Status />
					<StreamingResponse.Content onStreamingComplete={finishReview}>
						{summary}
					</StreamingResponse.Content>
				</StreamingResponse.Root>
			)}
			{run.phase === "approval" && (
				<AgentActionApproval.Root>
					<AgentActionApproval.Header>
						<AgentActionApproval.Title>Prepare this draft?</AgentActionApproval.Title>
						<AgentActionApproval.Description>
							Approve the reviewed scope to continue the local simulation.
						</AgentActionApproval.Description>
					</AgentActionApproval.Header>
					<AgentActionApproval.Content>
						<AgentActionApproval.Summary>
							<AgentActionApproval.SummaryContent>
								<AgentActionApproval.Action>
									Prepare a documentation draft
								</AgentActionApproval.Action>
								<AgentActionApproval.ActionDescription>
									Three Storybook improvements, ready for your review.
								</AgentActionApproval.ActionDescription>
							</AgentActionApproval.SummaryContent>
						</AgentActionApproval.Summary>
						<AgentActionApproval.Details>
							<AgentActionApproval.Detail>
								<AgentActionApproval.DetailLabel>Scope</AgentActionApproval.DetailLabel>
								<AgentActionApproval.DetailValue>
									Stories and usage guidance only
								</AgentActionApproval.DetailValue>
							</AgentActionApproval.Detail>
							<AgentActionApproval.Detail>
								<AgentActionApproval.DetailLabel>Destination</AgentActionApproval.DetailLabel>
								<AgentActionApproval.DetailValue>
									Local preview · no external action
								</AgentActionApproval.DetailValue>
							</AgentActionApproval.Detail>
						</AgentActionApproval.Details>
					</AgentActionApproval.Content>
					<AgentActionApproval.Footer>
						<AgentActionApproval.Actions>
							<Button
								size="sm"
								variant="secondary"
								onClick={() => setRun((current) => ({ ...current, phase: "rejected" }))}
							>
								Reject action
							</Button>
							<Button
								ref={decisionRef}
								size="sm"
								onClick={() =>
									setRun((current) => ({ ...current, phase: "publishing", progress: 0 }))
								}
							>
								Approve draft
							</Button>
						</AgentActionApproval.Actions>
					</AgentActionApproval.Footer>
				</AgentActionApproval.Root>
			)}
			{["publishing", "failed", "responding", "complete"].includes(run.phase) && (
				<AsyncJobProgress.Root status={progressStatus(run.phase)} value={run.progress}>
					<AsyncJobProgress.Header>
						<AsyncJobProgress.Heading>
							<AsyncJobProgress.Title>Prepare documentation draft</AsyncJobProgress.Title>
							<AsyncJobProgress.Description>
								{run.phase === "failed"
									? "The simulated connection was interrupted. Retry the approved action without repeating the review."
									: "Collecting the approved changes and preparing a local preview."}
							</AsyncJobProgress.Description>
						</AsyncJobProgress.Heading>
						<AsyncJobProgress.Status />
					</AsyncJobProgress.Header>
					<AsyncJobProgress.Progress />
					{run.phase === "publishing" && (
						<AsyncJobProgress.Actions>
							<Button size="sm" variant="secondary" onClick={cancel}>
								Cancel preparation
							</Button>
						</AsyncJobProgress.Actions>
					)}
				</AsyncJobProgress.Root>
			)}
			{["responding", "complete"].includes(run.phase) && (
				<StreamingResponse.Root
					aria-label="Agent result"
					status={run.phase === "responding" ? "streaming" : "complete"}
				>
					<StreamingResponse.Status />
					<StreamingResponse.Content streamKey={run.attempt} onStreamingComplete={finishResponse}>
						Your local draft is ready. It covers form states, keyboard guidance, and responsive
						story examples. Nothing has been published; the proposed changes are ready for a
						separate implementation and review.
					</StreamingResponse.Content>
				</StreamingResponse.Root>
			)}
			{terminal && (
				<Stack ref={resultRef} tabIndex={-1} gap={3} aria-label="Run outcome">
					<Text>{outcome}</Text>
					<Stack orientation="horizontal" gap={3} wrap="wrap">
						{run.phase === "failed" && (
							<Button
								size="sm"
								onClick={() =>
									setRun((current) => ({
										...current,
										phase: "publishing",
										attempt: current.attempt + 1,
									}))
								}
							>
								Retry preparation
							</Button>
						)}
						{run.phase === "cancelled" && (
							<Button
								size="sm"
								onClick={() =>
									setRun({ ...initialRun, prompt: run.prompt, phase: "reviewing", failFirst })
								}
							>
								Retry request
							</Button>
						)}
						<Button size="sm" variant="secondary" onClick={reset}>
							New run
						</Button>
					</Stack>
				</Stack>
			)}
			<PromptComposer.Root
				clearOnSubmit={false}
				value={prompt}
				onValueChange={setPrompt}
				onSubmit={start}
				submitting={active}
			>
				<PromptComposer.Surface>
					<PromptComposer.Input
						ref={inputRef}
						aria-label="Request for the agent"
						readOnly={active || terminal}
						placeholder="Ask the agent to review your stories…"
					/>
					<PromptComposer.Footer>
						<PromptComposer.Options>
							<Text size="1" color="muted">
								{active ? "Request preserved during this run" : composerHint}
							</Text>
						</PromptComposer.Options>
						<PromptComposer.Actions>
							{working || run.phase === "approval" ? (
								<PromptComposer.Stop
									ref={stopRef}
									shape="default"
									size="sm"
									aria-label="Cancel run"
									onClick={cancel}
								>
									Cancel run
								</PromptComposer.Stop>
							) : (
								<PromptComposer.Submit disabled={terminal || !prompt.trim()} />
							)}
						</PromptComposer.Actions>
					</PromptComposer.Footer>
				</PromptComposer.Surface>
			</PromptComposer.Root>
			<Stack align="start" gap={2}>
				<Toggle
					pressed={failFirst}
					onPressedChange={setFailFirst}
					disabled={active || terminal}
					size="sm"
					variant="secondary"
				>
					Simulate a connection failure
				</Toggle>
				<Text size="1" color="muted">
					The first approved attempt fails; retry resumes successfully.
				</Text>
			</Stack>
		</Stack>
	);
}

function progressStatus(phase: Phase) {
	if (phase === "failed") return "error";
	if (phase === "publishing") return "running";
	return "complete";
}

function runOutcome(run: Run) {
	if (run.phase === "cancelled" && run.progress === 100)
		return "Response stopped. The local draft is ready; nothing was published.";
	return labels[run.phase];
}
