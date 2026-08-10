import { CheckCircleIcon } from "@phosphor-icons/react/dist/csr/CheckCircle";
import { WarningCircleIcon } from "@phosphor-icons/react/dist/csr/WarningCircle";
import { ProhibitInsetIcon } from "@phosphor-icons/react/dist/csr/ProhibitInset";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { createContext, type ComponentProps, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Toolbar as ToolbarPrimitive, Loader } from "@/components";
import { typescaleStyles, textStyles } from "@/components/text/text.stylex";
import { shimmerTextStyles } from "@/styles/recipes/shimmer-text.stylex";
import { typingTextStyles } from "./typing-text.stylex";
import { tokens } from "@/theme/tokens.stylex";

export type StreamingResponseStatus = "streaming" | "complete" | "stopped" | "error";

const StreamingResponseContext = createContext<StreamingResponseContextValue | null>(null);

type StyledProps<T> = Omit<T, "style"> & {
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

type StreamingResponseContextValue = {
	elapsedSeconds: number | undefined;
	status: StreamingResponseStatus;
};

export type StreamingResponseRootProps = StyledProps<ComponentProps<"article">> & {
	/** Elapsed work time in seconds, shown after streaming completes. */
	elapsedSeconds?: number;
	status?: StreamingResponseStatus;
};
export type StreamingResponseStatusProps = StyledProps<ComponentProps<"div">>;
export type StreamingResponseContentProps = StyledProps<ComponentProps<"div">> & {
	/** Called after all text chunks have been revealed. */
	onStreamingComplete?: () => void;
	/** Changes to this value restart the chunk reveal while status is streaming. */
	streamKey?: number | string;
};
export type StreamingResponseActionsProps = ComponentProps<typeof ToolbarPrimitive.Root>;

const statusLabels: Record<StreamingResponseStatus, string> = {
	streaming: "Generating",
	complete: "Complete",
	stopped: "Stopped",
	error: "Response failed",
};
const streamingChunkSize = 3;
const streamingChunkIntervalMs = 92;

export function Root({
	elapsedSeconds,
	status = "complete",
	"aria-label": ariaLabel = "Assistant response",
	className,
	style,
	...props
}: StreamingResponseRootProps) {
	const sx = stylex.props(parts.root, style);
	return (
		<StreamingResponseContext.Provider value={{ elapsedSeconds, status }}>
			<article aria-label={ariaLabel} className={joinClassNames(sx.className, className)} style={sx.style} {...props} />
		</StreamingResponseContext.Provider>
	);
}

export function Status({ className, style, ...props }: StreamingResponseStatusProps) {
	const { elapsedSeconds, status } = useStreamingResponseContext("Status");
	const isStreaming = status === "streaming";
	const sx = stylex.props(textStyles.supporting, parts.status, statusColor[status], style);
	const label =
		status === "complete" && elapsedSeconds != null
			? `Worked for ${formatElapsedTime(elapsedSeconds)}`
			: statusLabels[status];

	return (
		<div
			role="status"
			aria-live={isStreaming ? "polite" : "off"}
			className={joinClassNames(sx.className, className)}
			style={sx.style}
			{...props}>
			{renderStatusIcon(status)}
			<span {...stylex.props(isStreaming && shimmerTextStyles.effect)}>{label}</span>
		</div>
	);
}

export function Content({
	children,
	className,
	onStreamingComplete,
	streamKey,
	style,
	...props
}: StreamingResponseContentProps) {
	const { status } = useStreamingResponseContext("Content");
	const isStreaming = status === "streaming";
	const sx = stylex.props(typescaleStyles["3"], parts.content, style);

	return (
		<div aria-busy={isStreaming} className={joinClassNames(sx.className, className)} style={sx.style} {...props}>
			{isStreaming ? (
				<StreamingText onStreamingComplete={onStreamingComplete} streamKey={streamKey}>
					{children}
				</StreamingText>
			) : (
				children
			)}
		</div>
	);
}

export function Actions({
	"aria-label": ariaLabel = "Response actions",
	style,
	variant = "unstyled",
	...props
}: StreamingResponseActionsProps) {
	return <ToolbarPrimitive.Root aria-label={ariaLabel} style={[parts.toolbar, style]} variant={variant} {...props} />;
}

function useStreamingResponseContext(part: string) {
	const context = useContext(StreamingResponseContext);
	if (!context) {
		throw new Error(`StreamingResponse.${part} must be used inside StreamingResponse.Root.`);
	}
	return context;
}

function renderStatusIcon(status: StreamingResponseStatus) {
	switch (status) {
		case "streaming":
			return <Loader aria-hidden />;
		case "complete":
			return <CheckCircleIcon aria-hidden size={14} weight="duotone" />;
		case "stopped":
			return <ProhibitInsetIcon aria-hidden size={14} weight="duotone" />;
		case "error":
			return <WarningCircleIcon aria-hidden size={14} weight="duotone" />;
	}
}

function StreamingText({
	children,
	onStreamingComplete,
	streamKey,
}: Pick<StreamingResponseContentProps, "children" | "onStreamingComplete" | "streamKey">) {
	const text = getStreamableText(children);

	if (text == null) {
		return children;
	}

	return <ChunkedStreamingText onStreamingComplete={onStreamingComplete} streamKey={streamKey} text={text} />;
}

function ChunkedStreamingText({
	onStreamingComplete,
	streamKey,
	text,
}: {
	onStreamingComplete?: () => void;
	streamKey?: number | string;
	text: string;
}) {
	const chunks = useMemo(() => chunkStreamingText(text), [text]);
	const [visibleCount, setVisibleCount] = useState(1);
	const completionNotifiedRef = useRef(false);
	const onCompleteRef = useRef(onStreamingComplete);
	const caretSx = stylex.props(typingTextStyles.caret);

	onCompleteRef.current = onStreamingComplete;

	useEffect(() => {
		setVisibleCount(1);
		completionNotifiedRef.current = false;
	}, [streamKey, text]);

	useEffect(() => {
		if (visibleCount >= chunks.length) {
			if (!completionNotifiedRef.current) {
				completionNotifiedRef.current = true;
				onCompleteRef.current?.();
			}
			return;
		}

		const timeout = window.setTimeout(() => {
			setVisibleCount((currentCount) => Math.min(currentCount + 1, chunks.length));
		}, streamingChunkIntervalMs);

		return () => window.clearTimeout(timeout);
	}, [chunks.length, visibleCount]);

	const isStreaming = visibleCount < chunks.length;
	const visibleChunks = chunks.slice(0, visibleCount);

	return (
		<span {...stylex.props(typingTextStyles.chunks)}>
			{visibleChunks.map((chunk, index) => {
				const sx = stylex.props(typingTextStyles.chunk);
				return (
					<span key={`${chunk}-${index}`} className={sx.className} data-streaming-text-chunk="">
						{chunk}
					</span>
				);
			})}
			{isStreaming ? (
				<span aria-hidden className={caretSx.className} data-streaming-text-caret="" style={caretSx.style} />
			) : null}
		</span>
	);
}

function getStreamableText(children: StreamingResponseContentProps["children"]) {
	if (typeof children === "string" || typeof children === "number") {
		return String(children);
	}
	return null;
}

function chunkStreamingText(text: string) {
	const words = text.match(/\S+\s*/g);

	if (!words) {
		return [text];
	}

	const chunks: string[] = [];
	for (let index = 0; index < words.length; index += streamingChunkSize) {
		chunks.push(words.slice(index, index + streamingChunkSize).join(""));
	}
	return chunks;
}

function joinClassNames(...classNames: Array<string | undefined>) {
	return classNames.filter(Boolean).join(" ");
}

function formatElapsedTime(totalSeconds: number) {
	const safeTotalSeconds = Math.max(0, Math.floor(totalSeconds));
	const minutes = Math.floor(safeTotalSeconds / 60);
	const seconds = safeTotalSeconds % 60;
	return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
}

const parts = stylex.create({
	root: {
		gap: tokens["--space-3"],
		color: tokens["--fg"],
		display: "flex",
		flexDirection: "column",
		maxWidth: "46rem",
		minWidth: 0,
		width: "100%",
	},
	status: {
		gap: tokens["--space-1"],
		alignItems: "center",
		display: "inline-flex",
		width: "fit-content",
	},
	content: {
		color: tokens["--fg"],
		lineHeight: tokens["--line-height-4"],
		whiteSpace: "pre-wrap",
	},
	toolbar: {
		padding: 0,
		alignSelf: "flex-start",
		backgroundColor: "transparent",
		boxShadow: "none",
	},
});

const statusColor = stylex.create({
	streaming: { color: tokens["--fg-muted"] },
	complete: { color: tokens["--bg-success-primary"] },
	stopped: { color: tokens["--fg-muted"] },
	error: { color: tokens["--fg-error"] },
});

export const StreamingResponse = {
	Root,
	Status,
	Content,
	Actions,
} as const;
