import { CheckCircleIcon } from "@phosphor-icons/react/dist/csr/CheckCircle";
import { SquareIcon } from "@phosphor-icons/react/dist/csr/Square";
import { WarningCircleIcon } from "@phosphor-icons/react/dist/csr/WarningCircle";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { createContext, type ComponentProps, useContext } from "react";
import * as ToolbarPrimitive from "@/components/toolbar/toolbar";
import { Loader } from "@/components/loader/loader";
import { textSizeStyles, textStyles } from "@/components/text/text.stylex";
import { shimmerTextStyles } from "./shimmer-text.stylex";
import { typingTextStyles } from "./typing-text.stylex";
import { colors, space } from "@/styles/tokens.stylex";
import { lineHeight } from "@/styles/tokens.stylex";

export type StreamingResponseStatus = "streaming" | "complete" | "stopped" | "error";

const StreamingResponseContext = createContext<StreamingResponseStatus | null>(null);

type StyledProps<T> = Omit<T, "style"> & {
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export type StreamingResponseRootProps = StyledProps<ComponentProps<"article">> & {
	status?: StreamingResponseStatus;
};
export type StreamingResponseStatusProps = StyledProps<ComponentProps<"div">>;
export type StreamingResponseContentProps = StyledProps<ComponentProps<"div">>;
export type StreamingResponseActionsProps = ComponentProps<typeof ToolbarPrimitive.Root>;

const statusLabels: Record<StreamingResponseStatus, string> = {
	streaming: "Generating",
	complete: "Complete",
	stopped: "Stopped",
	error: "Response failed",
};

export function Root({
	status = "complete",
	"aria-label": ariaLabel = "Assistant response",
	className,
	style,
	...props
}: StreamingResponseRootProps) {
	const sx = stylex.props(parts.root, style);
	return (
		<StreamingResponseContext.Provider value={status}>
			<article aria-label={ariaLabel} className={joinClassNames(sx.className, className)} style={sx.style} {...props} />
		</StreamingResponseContext.Provider>
	);
}

export function Status({ className, style, ...props }: StreamingResponseStatusProps) {
	const status = useStreamingResponseContext("Status");
	const isStreaming = status === "streaming";
	const sx = stylex.props(textStyles.supporting, parts.status, statusColor[status], style);

	return (
		<div
			role="status"
			aria-live={isStreaming ? "polite" : "off"}
			className={joinClassNames(sx.className, className)}
			style={sx.style}
			{...props}>
			{renderStatusIcon(status)}
			<span {...stylex.props(isStreaming && shimmerTextStyles.effect)}>{statusLabels[status]}</span>
		</div>
	);
}

export function Content({ children, className, style, ...props }: StreamingResponseContentProps) {
	const status = useStreamingResponseContext("Content");
	const isStreaming = status === "streaming";
	const sx = stylex.props(textSizeStyles["3"], parts.content, style);

	return (
		<div aria-busy={isStreaming} className={joinClassNames(sx.className, className)} style={sx.style} {...props}>
			{isStreaming ? (
				<>
					<span {...stylex.props(typingTextStyles.reveal)}>{children}</span>
					<span aria-hidden {...stylex.props(typingTextStyles.caret)} />
				</>
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
			return <CheckCircleIcon aria-hidden size={14} weight="fill" />;
		case "stopped":
			return <SquareIcon aria-hidden size={11} weight="fill" />;
		case "error":
			return <WarningCircleIcon aria-hidden size={14} weight="fill" />;
	}
}

function joinClassNames(...classNames: Array<string | undefined>) {
	return classNames.filter(Boolean).join(" ");
}

const parts = stylex.create({
	root: {
		gap: space[3],
		color: colors["--text"],
		display: "flex",
		flexDirection: "column",
		maxWidth: "46rem",
		minWidth: 0,
		width: "100%",
	},
	status: {
		gap: space[1],
		alignItems: "center",
		display: "inline-flex",
		width: "fit-content",
	},
	content: {
		color: colors["--text"],
		lineHeight: lineHeight.x4,
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
	streaming: { color: colors["--text-muted"] },
	complete: { color: colors["--success"] },
	stopped: { color: colors["--text-muted"] },
	error: { color: colors["--text-danger"] },
});
