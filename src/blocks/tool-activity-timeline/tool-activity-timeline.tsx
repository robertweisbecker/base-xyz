import { CheckIcon } from "@phosphor-icons/react/dist/csr/Check";
import { CircleIcon } from "@phosphor-icons/react/dist/csr/Circle";
import { ClockIcon } from "@phosphor-icons/react/dist/csr/Clock";
import { WarningIcon } from "@phosphor-icons/react/dist/csr/Warning";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { textStyles, textWeightStyles } from "@/components/text/text.stylex";
import { createContext, type ComponentProps, type ReactNode, useContext } from "react";
import { Badge, type BadgeHue, type BadgeProps } from "@/components/badge/badge";
import { Loader } from "@/components/loader/loader";
import { color, radius, space } from "@/styles/tokens.stylex";

type StyledProps<T> = Omit<T, "style"> & {
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export type ToolActivityStatus = "queued" | "running" | "complete" | "approval" | "error";

const ToolActivityItemContext = createContext<ToolActivityStatus | null>(null);

export type ToolActivityTimelineRootProps = StyledProps<ComponentProps<"ol">>;
export type ToolActivityTimelineItemProps = StyledProps<ComponentProps<"li">> & {
	status: ToolActivityStatus;
};
export type ToolActivityTimelineMarkerProps = StyledProps<ComponentProps<"div">>;
export type ToolActivityTimelineContentProps = StyledProps<ComponentProps<"div">>;
export type ToolActivityTimelineHeaderProps = StyledProps<ComponentProps<"div">>;
export type ToolActivityTimelineTitleProps = StyledProps<ComponentProps<"div">>;
export type ToolActivityTimelineDescriptionProps = StyledProps<ComponentProps<"div">>;
export type ToolActivityTimelineMetadataProps = StyledProps<ComponentProps<"div">>;
export type ToolActivityTimelineMetaProps = StyledProps<ComponentProps<"span">>;
export type ToolActivityTimelineStatusProps = Omit<BadgeProps, "children" | "endSlot" | "label" | "startSlot"> & {
	children?: ReactNode;
	endSlot?: ReactNode;
	icon?: ReactNode;
	startSlot?: ReactNode;
};

const statusPresentation: Record<ToolActivityStatus, { label: string; hue: BadgeHue }> = {
	queued: { label: "Queued", hue: "neutral" },
	running: { label: "Running", hue: "accent" },
	complete: { label: "Complete", hue: "neutral" },
	approval: { label: "Needs approval", hue: "accent" },
	error: { label: "Failed", hue: "danger" },
};

export function Root({
	"aria-label": ariaLabel = "Agent activity",
	className,
	style,
	...props
}: ToolActivityTimelineRootProps) {
	const sx = stylex.props(parts.timeline, style);
	return <ol aria-label={ariaLabel} className={joinClassNames(sx.className, className)} style={sx.style} {...props} />;
}

export function Item({ status, className, style, ...props }: ToolActivityTimelineItemProps) {
	const sx = stylex.props(parts.item, style);
	return (
		<ToolActivityItemContext.Provider value={status}>
			<li className={joinClassNames(sx.className, className)} style={sx.style} {...props} />
		</ToolActivityItemContext.Provider>
	);
}

export function Marker({ className, style, ...props }: ToolActivityTimelineMarkerProps) {
	const status = useToolActivityStatus("Marker");
	const sx = stylex.props(parts.marker, markerStatus[status], style);
	return (
		<div aria-hidden className={joinClassNames(sx.className, className)} style={sx.style} {...props}>
			{renderStatusIcon(status)}
		</div>
	);
}

export function Content({ className, style, ...props }: ToolActivityTimelineContentProps) {
	const sx = stylex.props(parts.content, style);
	return <div className={joinClassNames(sx.className, className)} style={sx.style} {...props} />;
}

export function Header({ className, style, ...props }: ToolActivityTimelineHeaderProps) {
	const sx = stylex.props(parts.header, style);
	return <div className={joinClassNames(sx.className, className)} style={sx.style} {...props} />;
}

export function Title({ className, style, ...props }: ToolActivityTimelineTitleProps) {
	const sx = stylex.props(textStyles.body, textWeightStyles.semibold, parts.title, style);
	return <div className={joinClassNames(sx.className, className)} style={sx.style} {...props} />;
}

export function Description({ className, style, ...props }: ToolActivityTimelineDescriptionProps) {
	const sx = stylex.props(textStyles.body, parts.description, style);
	return <div className={joinClassNames(sx.className, className)} style={sx.style} {...props} />;
}

export function Metadata({ className, style, ...props }: ToolActivityTimelineMetadataProps) {
	const sx = stylex.props(parts.metadata, style);
	return <div className={joinClassNames(sx.className, className)} style={sx.style} {...props} />;
}

export function Meta({ className, style, ...props }: ToolActivityTimelineMetaProps) {
	const sx = stylex.props(textStyles.supporting, parts.meta, style);
	return <span className={joinClassNames(sx.className, className)} style={sx.style} {...props} />;
}

export function Status({ children, endSlot, hue, icon, size = "sm", startSlot, ...props }: ToolActivityTimelineStatusProps) {
	const status = useToolActivityStatus("Status");
	const presentation = statusPresentation[status];
	return (
		<Badge
			endSlot={endSlot}
			hue={hue ?? presentation.hue}
			size={size}
			startSlot={startSlot ?? icon}
			{...props}>
			{children ?? presentation.label}
		</Badge>
	);
}

function useToolActivityStatus(part: string) {
	const status = useContext(ToolActivityItemContext);
	if (!status) {
		throw new Error(`ToolActivityTimeline.${part} must be used inside ToolActivityTimeline.Item.`);
	}
	return status;
}

function renderStatusIcon(status: ToolActivityStatus) {
	switch (status) {
		case "queued":
			return <CircleIcon aria-hidden weight="bold" />;
		case "running":
			return <Loader aria-hidden />;
		case "complete":
			return <CheckIcon aria-hidden weight="bold" />;
		case "approval":
			return <ClockIcon aria-hidden weight="bold" />;
		case "error":
			return <WarningIcon aria-hidden weight="fill" />;
	}
}

function joinClassNames(...classNames: Array<string | undefined>) {
	return classNames.filter(Boolean).join(" ");
}

const parts = stylex.create({
	timeline: {
		margin: 0,
		padding: 0,
		listStyle: "none",
		display: "flex",
		flexDirection: "column",
		maxWidth: "42rem",
	},
	item: {
		gap: space[3],
		display: "grid",
		gridTemplateColumns: `${space[6]} minmax(0, 1fr)`,
		paddingBlockEnd: space[5],
		position: "relative",
		"::before": {
			backgroundColor: color.border,
			content: '""',
			display: {
				default: "block",
				":last-child": "none",
			},
			insetBlockStart: space[6],
			insetInlineStart: "0.71875rem",
			position: "absolute",
			height: `calc(100% - ${space[5]})`,
			width: "1px",
		},
	},
	marker: {
		borderRadius: radius.full,
		alignItems: "center",
		display: "flex",
		justifyContent: "center",
		position: "relative",
		zIndex: 1,
		height: space[6],
		width: space[6],
	},
	content: {
		gap: space[3],
		display: "flex",
		flexDirection: "column",
		paddingBlockStart: "0.125rem",
		minWidth: 0,
	},
	header: {
		alignItems: "flex-start",
		columnGap: space[4],
		display: "grid",
		gridTemplateColumns: "minmax(0, 1fr) auto",
		rowGap: space[1],
	},
	title: {
		gridColumn: "1",
		gridRow: "1",
		minWidth: 0,
	},
	description: {
		gridColumn: "1",
		gridRow: "2",
		color: color.fgMuted,
		minWidth: 0,
	},
	metadata: {
		gap: space[2],
		gridColumn: "2",
		gridRow: "1 / span 2",
		alignItems: "center",
		alignSelf: "start",
		display: "flex",
	},
	meta: {
		color: color.fgMuted,
		fontVariantNumeric: "tabular-nums",
	},
});

const markerStatus = stylex.create({
	queued: { backgroundColor: color.surfaceSubtle, color: color.fgMuted },
	running: { backgroundColor: color.bgAccentSoft, color: color.bgAccent },
	complete: { backgroundColor: color.surfaceSubtle, color: color.fg },
	approval: { backgroundColor: color.bgAccentSoft, color: color.bgAccent },
	error: { backgroundColor: color.bgDangerSubtle, color: color.bgDanger },
});
