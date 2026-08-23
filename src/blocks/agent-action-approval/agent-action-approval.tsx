import * as stylex from "@stylexjs/stylex";
import { createContext, type ComponentProps, useContext, useId } from "react";
import { Card } from "@/components";
import { tokens } from "@/theme/tokens.stylex";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { attrJoin } from "@/utils/attr-join";

type StyledProps<T> = Omit<T, "style" | "xstyle"> & BaseStyleProps;

type DivProps = StyledProps<ComponentProps<"div">>;

type AgentActionApprovalContextValue = {
	titleId: string;
};

const AgentActionApprovalContext = createContext<AgentActionApprovalContextValue | null>(null);

export type AgentActionApprovalRootProps = ComponentProps<typeof Card.Root>;
export type AgentActionApprovalHeaderProps = ComponentProps<typeof Card.Header>;
export type AgentActionApprovalTitleProps = ComponentProps<typeof Card.Title>;
export type AgentActionApprovalDescriptionProps = ComponentProps<typeof Card.Description>;
export type AgentActionApprovalContentProps = ComponentProps<typeof Card.Content>;
export type AgentActionApprovalSummaryProps = DivProps;
export type AgentActionApprovalIconProps = DivProps;
export type AgentActionApprovalSummaryContentProps = DivProps;
export type AgentActionApprovalActionProps = DivProps;
export type AgentActionApprovalActionDescriptionProps = DivProps;
export type AgentActionApprovalDetailsProps = StyledProps<ComponentProps<"dl">>;
export type AgentActionApprovalDetailProps = DivProps;
export type AgentActionApprovalDetailLabelProps = StyledProps<ComponentProps<"dt">>;
export type AgentActionApprovalDetailValueProps = StyledProps<ComponentProps<"dd">>;
export type AgentActionApprovalFooterProps = ComponentProps<typeof Card.Footer>;
export type AgentActionApprovalActionsProps = DivProps;

export function Root({
	"aria-labelledby": ariaLabelledBy,
	role = "group",
	xstyle,
	variant = "outline",
	...props
}: AgentActionApprovalRootProps) {
	const titleId = useId();

	return (
		<AgentActionApprovalContext.Provider value={{ titleId }}>
			<Card.Root
				aria-labelledby={ariaLabelledBy ?? titleId}
				role={role}
				xstyle={[parts.root, xstyle]}
				variant={variant}
				{...props}
			/>
		</AgentActionApprovalContext.Provider>
	);
}

export function Header({ xstyle, ...props }: AgentActionApprovalHeaderProps) {
	return <Card.Header xstyle={[parts.header, xstyle]} {...props} />;
}

export function Title({ id, xstyle, ...props }: AgentActionApprovalTitleProps) {
	const context = useContext(AgentActionApprovalContext);

	return <Card.Title id={id ?? context?.titleId} xstyle={[parts.title, xstyle]} {...props} />;
}

export function Description({ xstyle, ...props }: AgentActionApprovalDescriptionProps) {
	return <Card.Description xstyle={[parts.description, xstyle]} {...props} />;
}

export function Content({ xstyle, ...props }: AgentActionApprovalContentProps) {
	return <Card.Content xstyle={[parts.content, xstyle]} {...props} />;
}

export function Summary({ className, style, xstyle, ...props }: AgentActionApprovalSummaryProps) {
	const sx = stylex.props(parts.summary, xstyle);
	return <div className={attrJoin(sx.className, className)} style={mergeStyle(sx.style, style)} {...props} />;
}

export function Icon({ className, style, xstyle, ...props }: AgentActionApprovalIconProps) {
	const sx = stylex.props(parts.icon, xstyle);
	return <div className={attrJoin(sx.className, className)} style={mergeStyle(sx.style, style)} {...props} />;
}

export function SummaryContent({ className, style, xstyle, ...props }: AgentActionApprovalSummaryContentProps) {
	const sx = stylex.props(parts.summaryContent, xstyle);
	return <div className={attrJoin(sx.className, className)} style={mergeStyle(sx.style, style)} {...props} />;
}

export function Action({ className, style, xstyle, ...props }: AgentActionApprovalActionProps) {
	const sx = stylex.props(parts.action, xstyle);
	return <div className={attrJoin(sx.className, className)} style={mergeStyle(sx.style, style)} {...props} />;
}

export function ActionDescription({ className, style, xstyle, ...props }: AgentActionApprovalActionDescriptionProps) {
	const sx = stylex.props(parts.actionDescription, xstyle);
	return <div className={attrJoin(sx.className, className)} style={mergeStyle(sx.style, style)} {...props} />;
}

export function Details({ className, style, xstyle, ...props }: AgentActionApprovalDetailsProps) {
	const sx = stylex.props(parts.details, xstyle);
	return <dl className={attrJoin(sx.className, className)} style={mergeStyle(sx.style, style)} {...props} />;
}

export function Detail({ className, style, xstyle, ...props }: AgentActionApprovalDetailProps) {
	const sx = stylex.props(parts.detail, xstyle);
	return <div className={attrJoin(sx.className, className)} style={mergeStyle(sx.style, style)} {...props} />;
}

export function DetailLabel({ className, style, xstyle, ...props }: AgentActionApprovalDetailLabelProps) {
	const sx = stylex.props(parts.detailLabel, xstyle);
	return <dt className={attrJoin(sx.className, className)} style={mergeStyle(sx.style, style)} {...props} />;
}

export function DetailValue({ className, style, xstyle, ...props }: AgentActionApprovalDetailValueProps) {
	const sx = stylex.props(parts.detailValue, xstyle);
	return <dd className={attrJoin(sx.className, className)} style={mergeStyle(sx.style, style)} {...props} />;
}

export function Footer({ xstyle, ...props }: AgentActionApprovalFooterProps) {
	return <Card.Footer xstyle={[parts.footer, xstyle]} {...props} />;
}

export function Actions({ className, style, xstyle, ...props }: AgentActionApprovalActionsProps) {
	const sx = stylex.props(parts.actions, xstyle);
	return <div className={attrJoin(sx.className, className)} style={mergeStyle(sx.style, style)} {...props} />;
}

const parts = stylex.create({
	root: {
		maxWidth: "32rem",
		width: "100%",
	},
	header: {
		gap: tokens["--space-1"],
		alignItems: "baseline",
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
	},
	title: {
		fontSize: tokens["--font-size-3"],
		letterSpacing: tokens["--letter-spacing-3"],
		lineHeight: tokens["--line-height-3"],
	},
	description: {
		fontSize: tokens["--font-size-2"],
		letterSpacing: tokens["--letter-spacing-2"],
		lineHeight: tokens["--line-height-2"],
		maxWidth: "38ch",
	},
	content: {
		gap: tokens["--space-4"],
		display: "flex",
		flexDirection: "column",
	},
	summary: {
		padding: tokens["--space-2"],
		borderRadius: tokens["--radius-md"],
		gap: tokens["--space-3"],
		alignItems: "flex-start",
		backgroundImage: `linear-gradient(to bottom right, ${tokens["--surface-subtle"]}, transparent)`,
		display: "flex",
	},
	icon: {
		borderRadius: tokens["--radius-sm"],
		alignItems: "center",
		backgroundColor: tokens["--elevated"],
		boxShadow: tokens["--shadow-sm"],
		color: tokens["--fg-subtle"],
		display: "flex",
		flexShrink: 0,
		justifyContent: "center",
		height: tokens["--space-6"],
		width: tokens["--space-6"],
	},
	summaryContent: {
		gap: 0,
		display: "flex",
		flexDirection: "column",
		minWidth: 0,
	},
	action: {
		color: tokens["--fg"],
		fontSize: tokens["--font-size-2"],
		fontWeight: tokens["--font-weight-medium"],
		letterSpacing: tokens["--letter-spacing-2"],
		lineHeight: tokens["--line-height-2"],
	},
	actionDescription: {
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-2"],
		letterSpacing: tokens["--letter-spacing-2"],
		lineHeight: tokens["--line-height-2"],
	},
	details: {
		margin: 0,
		gap: tokens["--space-2"],
		display: "flex",
		flexDirection: "column",
	},
	detail: {
		gap: tokens["--space-3"],
		alignItems: "baseline",
		display: "grid",
		gridTemplateColumns: "6.5rem minmax(0, 1fr)",
	},
	detailLabel: {
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-1"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
	},
	detailValue: {
		margin: 0,
		color: tokens["--fg"],
		fontSize: tokens["--font-size-2"],
		letterSpacing: tokens["--letter-spacing-2"],
		lineHeight: tokens["--line-height-2"],
		overflowWrap: "anywhere",
	},
	footer: {
		margin: 0,
		borderRadius: 0,
		paddingBlock: tokens["--space-3"],
		paddingInline: tokens["--space-5"],
		backgroundColor: "transparent",
		borderBlockStartColor: tokens["--border"],
		borderBlockStartStyle: "solid",
		borderBlockStartWidth: "1px",
	},
	actions: {
		gap: tokens["--space-2"],
		alignItems: "center",
		display: "flex",
		marginInlineStart: "auto",
	},
});

export const AgentActionApproval = {
	Root,
	Header,
	Title,
	Description,
	Content,
	Summary,
	Icon,
	SummaryContent,
	Action,
	ActionDescription,
	Details,
	Detail,
	DetailLabel,
	DetailValue,
	Footer,
	Actions,
} as const;
