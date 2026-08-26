import { ClockIcon } from "@phosphor-icons/react/dist/csr/Clock";
import { WarningIcon } from "@phosphor-icons/react/dist/csr/Warning";
import * as stylex from "@stylexjs/stylex";
import { createContext, type ComponentProps, createElement, useContext, useId } from "react";
import { Badge, type BadgeHue, Button, Icon, Loader, Progress as ProgressComponent } from "@/components";
import { tokens } from "@/theme/tokens.stylex";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import type { MarginProps } from "@/styles/props/spacing.stylex";
import { attrJoin } from "@/utils/attr-join";
import { ArrowClockwiseIcon, CaretRightIcon, TrashIcon, XCircleIcon } from "@phosphor-icons/react";

export type AsyncJobStatus = "queued" | "running" | "complete" | "error";
export type AsyncJobHeadingLevel = 2 | 3 | 4 | 5 | 6;

type AsyncJobProgressContextValue = {
	status: AsyncJobStatus;
	titleId: string;
	value: number | null;
	valueText?: string;
};

const AsyncJobProgressContext = createContext<AsyncJobProgressContextValue | null>(null);

type StyledProps<T> = Omit<T, "style" | "xstyle"> & BaseStyleProps;

export type AsyncJobProgressRootProps = StyledProps<ComponentProps<"section">> & {
	status: AsyncJobStatus;
	value?: number | null;
	valueText?: string;
};
export type AsyncJobProgressHeaderProps = StyledProps<ComponentProps<"div">>;
export type AsyncJobProgressHeadingProps = StyledProps<ComponentProps<"div">>;
export type AsyncJobProgressTitleProps = StyledProps<ComponentProps<"h3">> & {
	level?: AsyncJobHeadingLevel;
};
export type AsyncJobProgressDescriptionProps = StyledProps<ComponentProps<"p">>;
export type AsyncJobProgressStatusProps = StyledProps<ComponentProps<"span">>;
export type AsyncJobProgressProgressProps = Omit<
	ComponentProps<typeof ProgressComponent.Root>,
	"value" | "aria-labelledby" | "aria-valuetext" | keyof MarginProps
>;
export type AsyncJobProgressActionsProps = StyledProps<ComponentProps<"div">>;

const statusPresentation = {
	queued: {
		badgeLabel: "Queued",
		hue: "neutral",
		statusLabel: "Waiting…",
		buttonLabel: "Remove",
		buttonIcon: <TrashIcon aria-hidden />,
	},
	running: {
		badgeLabel: "Running",
		hue: "accent",
		statusLabel: "In progress",
		buttonLabel: "Stop",
		buttonIcon: <XCircleIcon aria-hidden weight="fill" />,
	},
	complete: {
		badgeLabel: "Complete",
		hue: "success",
		statusLabel: "Complete",
		buttonLabel: "View output",
		buttonIcon: <CaretRightIcon aria-hidden />,
	},
	error: {
		badgeLabel: "Failed",
		hue: "error",
		statusLabel: "Failed",
		buttonLabel: "Retry",
		buttonIcon: <ArrowClockwiseIcon aria-hidden />,
	},
} satisfies Record<
	AsyncJobStatus,
	{ badgeLabel: string; hue: BadgeHue; statusLabel: string; buttonLabel: string; buttonIcon: React.ReactNode }
>;

export function Root({ status, value, valueText, className, style, xstyle, ...props }: AsyncJobProgressRootProps) {
	const titleId = useId();
	const progressValue = getProgressValue(status, value);
	const sx = stylex.props(parts.root, xstyle);

	return (
		<AsyncJobProgressContext.Provider value={{ status, titleId, value: progressValue, valueText }}>
			<section className={attrJoin(sx.className, className)} style={mergeStyle(sx.style, style)} {...props} />
		</AsyncJobProgressContext.Provider>
	);
}

export function Header({ className, style, xstyle, ...props }: AsyncJobProgressHeaderProps) {
	const sx = stylex.props(parts.header, xstyle);
	return <div className={attrJoin(sx.className, className)} style={mergeStyle(sx.style, style)} {...props} />;
}

export function Heading({ className, style, xstyle, ...props }: AsyncJobProgressHeadingProps) {
	const sx = stylex.props(parts.heading, xstyle);
	return <div className={attrJoin(sx.className, className)} style={mergeStyle(sx.style, style)} {...props} />;
}

export function Title({ level = 3, id, className, style, xstyle, ...props }: AsyncJobProgressTitleProps) {
	const context = useAsyncJobProgressContext("Title");
	const sx = stylex.props(parts.title, xstyle);

	return createElement(`h${level}`, {
		...props,
		id: id ?? context.titleId,
		className: attrJoin(sx.className, className),
		style: mergeStyle(sx.style, style),
	});
}

export function Description({ className, style, xstyle, ...props }: AsyncJobProgressDescriptionProps) {
	const sx = stylex.props(parts.description, xstyle);
	return <p className={attrJoin(sx.className, className)} style={mergeStyle(sx.style, style)} {...props} />;
}

export function Status({ className, style, xstyle, ...props }: AsyncJobProgressStatusProps) {
	const { status } = useAsyncJobProgressContext("Status");
	const presentation = statusPresentation[status];
	const statusIcon = renderStatusIcon(status);
	const sx = stylex.props(parts.status, xstyle);

	return (
		<span
			role="status"
			aria-atomic="true"
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...props}>
			<Badge hue={presentation.hue} startSlot={statusIcon}>
				{presentation.badgeLabel}
			</Badge>
		</span>
	);
}

export function Progress(props: AsyncJobProgressProgressProps) {
	const { status, titleId, value, valueText } = useAsyncJobProgressContext("Progress");
	const ariaValueText = valueText ?? getAriaValueText(status, value);

	return (
		<ProgressComponent.Root aria-labelledby={titleId} aria-valuetext={ariaValueText} value={value} {...props}>
			<ProgressComponent.Value xstyle={parts.progressValue}>
				{(formattedValue, currentValue) =>
					valueText ??
					(status === "queued"
						? "Waiting…"
						: status === "error" && value === 0
							? "Failed"
							: currentValue === null
								? "In progress"
								: formattedValue)
				}
			</ProgressComponent.Value>
			<ProgressComponent.Track>
				<ProgressComponent.Indicator xstyle={indicatorStatus[status]} />
			</ProgressComponent.Track>
		</ProgressComponent.Root>
	);
}

export function Actions({ className, style, xstyle, ...props }: AsyncJobProgressActionsProps) {
	const sx = stylex.props(parts.actions, xstyle);
	return <div className={attrJoin(sx.className, className)} style={mergeStyle(sx.style, style)} {...props} />;
}

export function ActionButton({ variant = "ghost", size = "xs", ...props }: React.ComponentProps<typeof Button>) {
	const { status } = useAsyncJobProgressContext("ActionButton");
	return (
		<Button me={-1} variant={variant} size={size} endSlot={statusPresentation[status].buttonIcon} {...props}>
			{statusPresentation[status].buttonLabel}
		</Button>
	);
}

function useAsyncJobProgressContext(part: string) {
	const context = useContext(AsyncJobProgressContext);
	if (!context) {
		throw new Error(`AsyncJobProgress.${part} must be used inside AsyncJobProgress.Root.`);
	}
	return context;
}

function getProgressValue(status: AsyncJobStatus, value: number | null | undefined) {
	switch (status) {
		case "queued":
			return 0;
		case "running":
			return value == null ? null : normalizeProgressValue(value);
		case "complete":
			return 100;
		case "error":
			return value == null ? 0 : normalizeProgressValue(value);
	}
}

function normalizeProgressValue(value: number) {
	if (!Number.isFinite(value)) return 0;
	return Math.min(100, Math.max(0, value));
}

function getAriaValueText(status: AsyncJobStatus, value: number | null) {
	switch (status) {
		case "queued":
			return "Queued";
		case "running":
			return value === null ? "In progress" : `${value}% complete`;
		case "complete":
			return "Complete";
		case "error":
			return value !== null && value > 0 ? `Failed at ${value}%` : "Failed";
	}
}

function renderStatusIcon(status: AsyncJobStatus) {
	switch (status) {
		case "queued":
			return <ClockIcon aria-hidden weight="bold" size={12} />;
		case "running":
			return <Loader aria-hidden size="10px" />;
		case "complete":
			return <Icon.Checkmark aria-hidden size={12} />;
		case "error":
			return <WarningIcon aria-hidden weight="fill" size={12} />;
	}
}

const parts = stylex.create({
	root: {
		gap: tokens["--space-3"],
		color: tokens["--fg"],
		display: "flex",
		flexDirection: "column",
		maxWidth: "36rem",
		width: "100%",
		borderRadius: tokens["--radius-md"],
		borderWidth: 1,
		borderStyle: "solid",
		borderColor: tokens["--border"],
		padding: tokens["--space-3"],
	},
	header: {
		gap: tokens["--space-4"],
		alignItems: "flex-start",
		display: "flex",
		justifyContent: "space-between",
	},
	heading: {
		gap: tokens["--space-0-5"],
		display: "flex",
		flexDirection: "column",
		minWidth: 0,
	},
	title: {
		margin: 0,
		color: tokens["--fg"],
		fontSize: tokens["--font-size-2"],
		fontWeight: tokens["--font-weight-semibold"],
		letterSpacing: tokens["--letter-spacing-2"],
		lineHeight: tokens["--line-height-2"],
		textWrap: "balance",
	},
	description: {
		margin: 0,
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-1"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
	},
	status: { display: "inline-flex", flexShrink: 0 },
	progressValue: { gridColumn: "2" },
	actions: {
		gap: tokens["--space-2"],
		alignItems: "center",
		display: "flex",
		justifyContent: "flex-end",
	},
});

const indicatorStatus = stylex.create({
	queued: { backgroundColor: tokens["--bg-neutral"] },
	running: {},
	complete: {},
	error: {
		backgroundColor: tokens["--bg-error-primary"],
	},
});

export const AsyncJobProgress = {
	Root,
	Header,
	Heading,
	Title,
	Description,
	Status,
	Progress,
	Actions,
	ActionButton,
} as const;
