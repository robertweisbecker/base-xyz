import { ArrowClockwiseIcon } from "@phosphor-icons/react/dist/csr/ArrowClockwise";
import { CopyIcon } from "@phosphor-icons/react/dist/csr/Copy";
import { SquareIcon } from "@phosphor-icons/react/dist/csr/Square";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { useState } from "react";
import { Separator, Toolbar } from "@/components";
import { tokens } from "@/theme/tokens.stylex";

import { StreamingResponse, type StreamingResponseStatus } from "./streaming-response";
const meta = {
	title: "Blocks/Streaming response",
	component: StreamingResponse.Root,
	parameters: {
		controls: { disable: true },
	},
} satisfies Meta<typeof StreamingResponse.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const responseContent = {
	streaming:
		"The project uses Base UI for accessible behavior and StyleX for its visual system. I’m checking the remaining stories against those conventions…",
	complete:
		"The Storybook review is complete. The updated stories now follow the shared structure and control conventions.",
	stopped: "Generation stopped after reviewing the current Storybook inventory.",
	error: "The response could not be completed. Try again when the connection is restored.",
} satisfies Record<StreamingResponseStatus, string>;

function ResponseActions({ onRetry, retry = true }: { onRetry?: () => void; retry?: boolean }) {
	return (
		<StreamingResponse.Actions>
			<Toolbar.Button aria-label="Copy response">
				<CopyIcon aria-hidden size={16} weight="bold" />
			</Toolbar.Button>
			{retry ? (
				<Toolbar.Button aria-label="Try again" onClick={onRetry}>
					<ArrowClockwiseIcon aria-hidden size={16} weight="bold" />
				</Toolbar.Button>
			) : null}
		</StreamingResponse.Actions>
	);
}

export const Examples: Story = {
	render: () => (
		<div {...stylex.props(storyParts.list)}>
			<InteractiveResponseExample />
			<Separator />
			<ResponseExample label="Complete" status="complete" />
			<Separator />
			<ResponseExample label="Stopped" status="stopped" />
			<Separator />
			<ResponseExample label="Error" status="error" />
		</div>
	),
};

export const ReplacementReset: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => <ReplacementResetExample />,
};

function ReplacementResetExample() {
	const [response, setResponse] = useState("The initial response contains enough words to expose stale reveal state");
	const [streamKey, setStreamKey] = useState(0);
	const [completionCount, setCompletionCount] = useState(0);

	return (
		<div {...stylex.props(storyParts.example)}>
			<p data-testid="streaming-replacement-phase" {...stylex.props(storyParts.label)}>
				Streaming response replacement test
			</p>
			<StreamingResponse.Root aria-label="Streaming replacement response" status="streaming">
				<StreamingResponse.Status />
				<StreamingResponse.Content
					data-testid="streaming-replacement-content"
					onStreamingComplete={() => setCompletionCount((count) => count + 1)}
					streamKey={streamKey}>
					{response}
				</StreamingResponse.Content>
				<p data-testid="streaming-completion-count">{completionCount}</p>
				<div>
					<button type="button" onClick={() => setResponse("The replacement response is ready")}>
						Replace response
					</button>
					<button type="button" onClick={() => setStreamKey((key) => key + 1)}>
						Retry same response
					</button>
				</div>
			</StreamingResponse.Root>
		</div>
	);
}

function InteractiveResponseExample() {
	const [status, setStatus] = useState<StreamingResponseStatus>("streaming");
	const [streamKey, setStreamKey] = useState(0);

	function retry() {
		setStreamKey((currentKey) => currentKey + 1);
		setStatus("streaming");
	}

	return (
		<section {...stylex.props(storyParts.example)}>
			<h2 {...stylex.props(storyParts.label)}>Streaming</h2>
			<StreamingResponse.Root aria-label="Streaming response" elapsedSeconds={131} status={status}>
				<StreamingResponse.Status />
				<StreamingResponse.Content streamKey={streamKey} onStreamingComplete={() => setStatus("complete")}>
					{responseContent.streaming}
				</StreamingResponse.Content>
				{status === "streaming" ? (
					<StreamingResponse.Actions>
						<Toolbar.Button aria-label="Stop generating" onClick={() => setStatus("stopped")}>
							<SquareIcon aria-hidden size={12} weight="fill" />
						</Toolbar.Button>
					</StreamingResponse.Actions>
				) : (
					<ResponseActions onRetry={retry} />
				)}
			</StreamingResponse.Root>
		</section>
	);
}

function ResponseExample({ label, status }: { label: string; status: StreamingResponseStatus }) {
	return (
		<section {...stylex.props(storyParts.example)}>
			<h2 {...stylex.props(storyParts.label)}>{label}</h2>
			<StreamingResponse.Root aria-label={`${label} response`} elapsedSeconds={131} status={status}>
				<StreamingResponse.Status />
				<StreamingResponse.Content>{responseContent[status]}</StreamingResponse.Content>
				{status === "streaming" ? (
					<StreamingResponse.Actions>
						<Toolbar.Button aria-label="Stop generating">
							<SquareIcon aria-hidden size={12} weight="fill" />
						</Toolbar.Button>
					</StreamingResponse.Actions>
				) : status === "error" ? (
					<StreamingResponse.Actions>
						<Toolbar.Button aria-label="Try again">
							<ArrowClockwiseIcon aria-hidden size={16} weight="bold" />
						</Toolbar.Button>
					</StreamingResponse.Actions>
				) : (
					<ResponseActions />
				)}
			</StreamingResponse.Root>
		</section>
	);
}

const storyParts = stylex.create({
	list: {
		gap: tokens["--space-6"],
		display: "flex",
		flexDirection: "column",
		maxWidth: "46rem",
	},
	example: {
		gap: tokens["--space-3"],
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
