import { ListChecksIcon } from "@phosphor-icons/react/dist/csr/ListChecks";
import { Icon, Badge, Loader } from "@/components";
import type { BadgeHue, BadgeProps } from "@/components";
import { ClockIcon } from "@phosphor-icons/react/dist/csr/Clock";
import { WarningDiamondIcon } from "@phosphor-icons/react/dist/csr/WarningDiamond";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { textStyles, fontWeightStyles } from "@/components/text/text.stylex";
import { createContext, type ComponentProps, type ReactNode, useContext } from "react";
import { tokens } from "@/theme/tokens.stylex";
import { attrJoin } from "@/utils/attr-join";

type StyledProps<T> = Omit<T, "style"> & {
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export type WorkflowProgressStatus = "queued" | "running" | "complete" | "approval" | "error";

const WorkflowProgressItemContext = createContext<WorkflowProgressStatus | null>(null);

export type WorkflowProgressRootProps = StyledProps<ComponentProps<"ol">>;
export type WorkflowProgressItemProps = StyledProps<ComponentProps<"li">> & {
	status: WorkflowProgressStatus;
};
export type WorkflowProgressMarkerProps = StyledProps<ComponentProps<"div">>;
export type WorkflowProgressContentProps = StyledProps<ComponentProps<"div">>;
export type WorkflowProgressHeaderProps = StyledProps<ComponentProps<"div">>;
export type WorkflowProgressTitleProps = StyledProps<ComponentProps<"div">>;
export type WorkflowProgressDescriptionProps = StyledProps<ComponentProps<"div">>;
export type WorkflowProgressMetadataProps = StyledProps<ComponentProps<"div">>;
export type WorkflowProgressMetaProps = StyledProps<ComponentProps<"span">>;
export type WorkflowProgressStatusProps = Omit<BadgeProps, "children" | "endSlot" | "label" | "startSlot"> & {
	children?: ReactNode;
	endSlot?: ReactNode;
	icon?: ReactNode;
	startSlot?: ReactNode;
};

const statusPresentation = {
	queued: { label: "Queued", hue: "neutral" },
	running: { label: "Running", hue: "accent" },
	complete: { label: "Complete", hue: "success" },
	approval: { label: "Needs approval", hue: "warning" },
	error: { label: "Failed", hue: "error" },
} satisfies Record<WorkflowProgressStatus, { label: string; hue: BadgeHue }>;

export function Root({
	"aria-label": ariaLabel = "Workflow progress",
	className,
	style,
	...props
}: WorkflowProgressRootProps) {
	const sx = stylex.props(parts.timeline, style);
	return <ol aria-label={ariaLabel} className={attrJoin(sx.className, className)} style={sx.style} {...props} />;
}

export function Item({ status, className, style, ...props }: WorkflowProgressItemProps) {
	const sx = stylex.props(parts.item, style);
	return (
		<WorkflowProgressItemContext.Provider value={status}>
			<li className={attrJoin(sx.className, className)} style={sx.style} {...props} />
		</WorkflowProgressItemContext.Provider>
	);
}

export function Marker({ className, style, ...props }: WorkflowProgressMarkerProps) {
	const status = useWorkflowProgressStatus("Marker");
	const sx = stylex.props(parts.marker, markerStatus[status], style);
	return (
		<div aria-hidden className={attrJoin(sx.className, className)} style={sx.style} {...props}>
			{renderStatusIcon(status)}
		</div>
	);
}

export function Content({ className, style, ...props }: WorkflowProgressContentProps) {
	const sx = stylex.props(parts.content, style);
	return <div className={attrJoin(sx.className, className)} style={sx.style} {...props} />;
}

export function Header({ className, style, ...props }: WorkflowProgressHeaderProps) {
	const sx = stylex.props(parts.header, style);
	return <div className={attrJoin(sx.className, className)} style={sx.style} {...props} />;
}

export function Title({ className, style, ...props }: WorkflowProgressTitleProps) {
	const sx = stylex.props(textStyles.body, fontWeightStyles.semibold, parts.title, style);
	return <div className={attrJoin(sx.className, className)} style={sx.style} {...props} />;
}

export function Description({ className, style, ...props }: WorkflowProgressDescriptionProps) {
	const sx = stylex.props(textStyles.body, parts.description, style);
	return <div className={attrJoin(sx.className, className)} style={sx.style} {...props} />;
}

export function Metadata({ className, style, ...props }: WorkflowProgressMetadataProps) {
	const sx = stylex.props(parts.metadata, style);
	return <div className={attrJoin(sx.className, className)} style={sx.style} {...props} />;
}

export function Meta({ className, style, ...props }: WorkflowProgressMetaProps) {
	const sx = stylex.props(textStyles.supporting, parts.meta, style);
	return <span className={attrJoin(sx.className, className)} style={sx.style} {...props} />;
}

export function Status({
	children,
	endSlot,
	hue,
	icon,
	size = "sm",
	startSlot,
	...props
}: WorkflowProgressStatusProps) {
	const status = useWorkflowProgressStatus("Status");
	const presentation = statusPresentation[status];
	return (
		<Badge endSlot={endSlot} hue={hue ?? presentation.hue} size={size} startSlot={startSlot ?? icon} {...props}>
			{children ?? presentation.label}
		</Badge>
	);
}

function useWorkflowProgressStatus(part: string) {
	const status = useContext(WorkflowProgressItemContext);
	if (!status) {
		throw new Error(`WorkflowProgress.${part} must be used inside WorkflowProgress.Item.`);
	}
	return status;
}

function renderStatusIcon(status: WorkflowProgressStatus) {
	switch (status) {
		case "queued":
			return <Icon.Dot aria-hidden />;
		case "running":
			return <Loader aria-hidden />;
		case "complete":
			return <ListChecksIcon aria-hidden />;
		case "approval":
			return <ClockIcon aria-hidden />;
		case "error":
			return <WarningDiamondIcon aria-hidden weight="duotone" />;
	}
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
		gap: tokens["--space-3"],
		display: "grid",
		gridTemplateColumns: `${tokens["--space-6"]} minmax(0, 1fr)`,
		paddingBlockEnd: tokens["--space-5"],
		position: "relative",
		"::before": {
			backgroundColor: tokens["--border"],
			content: '""',
			display: {
				default: "block",
				":last-child": "none",
			},
			insetBlockStart: tokens["--space-6"],
			insetInlineStart: "0.71875rem",
			position: "absolute",
			height: `calc(100% - ${tokens["--space-5"]})`,
			width: "1px",
		},
	},
	marker: {
		borderRadius: tokens["--radius-full"],
		alignItems: "center",
		display: "flex",
		justifyContent: "center",
		position: "relative",
		zIndex: 1,
		height: tokens["--space-6"],
		width: tokens["--space-6"],
	},
	content: {
		gap: tokens["--space-3"],
		display: "flex",
		flexDirection: "column",
		paddingBlockStart: "0.125rem",
		minWidth: 0,
	},
	header: {
		alignItems: "flex-start",
		columnGap: tokens["--space-4"],
		display: "grid",
		gridTemplateColumns: "minmax(0, 1fr) auto",
		rowGap: tokens["--space-1"],
	},
	title: {
		gridColumn: "1",
		gridRow: "1",
		minWidth: 0,
	},
	description: {
		gridColumn: "1",
		gridRow: "2",
		color: tokens["--fg-muted"],
		minWidth: 0,
	},
	metadata: {
		gap: tokens["--space-2"],
		gridColumn: "2",
		gridRow: "1 / span 2",
		alignItems: "center",
		alignSelf: "start",
		display: "flex",
	},
	meta: {
		color: tokens["--fg-muted"],
		fontVariantNumeric: "tabular-nums",
	},
});

const markerStatus = stylex.create({
	queued: { backgroundColor: tokens["--surface-subtle"], color: tokens["--fg-muted"] },
	running: { backgroundColor: tokens["--bg-neutral"], color: tokens["--color-white"] },
	complete: { backgroundColor: tokens["--surface-subtle"], color: tokens["--fg"] },
	approval: { backgroundColor: tokens["--bg-accent"], color: tokens["--bg-primary"] },
	error: { backgroundColor: tokens["--bg-error"], color: tokens["--bg-error-primary"] },
});

export const WorkflowProgress = {
	Root,
	Item,
	Marker,
	Content,
	Header,
	Title,
	Description,
	Metadata,
	Meta,
	Status,
} as const;
