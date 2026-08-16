import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { createContext, type ComponentProps, useContext, useId } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components";
import { tokens } from "@/theme/tokens.stylex";
import { attrJoin } from "@/utils/attr-join";

type StyledProps<T> = Omit<T, "style"> & {
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

type DivProps = StyledProps<ComponentProps<"div">>;

type AgentActionApprovalContextValue = {
	titleId: string;
};

const AgentActionApprovalContext = createContext<AgentActionApprovalContextValue | null>(null);

export type AgentActionApprovalRootProps = ComponentProps<typeof Card>;
export type AgentActionApprovalHeaderProps = ComponentProps<typeof CardHeader>;
export type AgentActionApprovalTitleProps = ComponentProps<typeof CardTitle>;
export type AgentActionApprovalDescriptionProps = ComponentProps<typeof CardDescription>;
export type AgentActionApprovalContentProps = ComponentProps<typeof CardContent>;
export type AgentActionApprovalSummaryProps = DivProps;
export type AgentActionApprovalIconProps = DivProps;
export type AgentActionApprovalSummaryContentProps = DivProps;
export type AgentActionApprovalActionProps = DivProps;
export type AgentActionApprovalActionDescriptionProps = DivProps;
export type AgentActionApprovalDetailsProps = StyledProps<ComponentProps<"dl">>;
export type AgentActionApprovalDetailProps = DivProps;
export type AgentActionApprovalDetailLabelProps = StyledProps<ComponentProps<"dt">>;
export type AgentActionApprovalDetailValueProps = StyledProps<ComponentProps<"dd">>;
export type AgentActionApprovalFooterProps = ComponentProps<typeof CardFooter>;
export type AgentActionApprovalActionsProps = DivProps;

export function Root({
	"aria-labelledby": ariaLabelledBy,
	role = "group",
	style,
	variant = "outline",
	...props
}: AgentActionApprovalRootProps) {
	const titleId = useId();

	return (
		<AgentActionApprovalContext.Provider value={{ titleId }}>
			<Card
				aria-labelledby={ariaLabelledBy ?? titleId}
				role={role}
				style={[parts.root, style]}
				variant={variant}
				{...props}
			/>
		</AgentActionApprovalContext.Provider>
	);
}

export function Header({ style, ...props }: AgentActionApprovalHeaderProps) {
	return <CardHeader style={[parts.header, style]} {...props} />;
}

export function Title({ id, style, ...props }: AgentActionApprovalTitleProps) {
	const context = useContext(AgentActionApprovalContext);

	return <CardTitle id={id ?? context?.titleId} style={[parts.title, style]} {...props} />;
}

export function Description({ style, ...props }: AgentActionApprovalDescriptionProps) {
	return <CardDescription style={[parts.description, style]} {...props} />;
}

export function Content({ style, ...props }: AgentActionApprovalContentProps) {
	return <CardContent style={[parts.content, style]} {...props} />;
}

export function Summary({ className, style, ...props }: AgentActionApprovalSummaryProps) {
	const sx = stylex.props(parts.summary, style);
	return <div className={attrJoin(sx.className, className)} style={sx.style} {...props} />;
}

export function Icon({ className, style, ...props }: AgentActionApprovalIconProps) {
	const sx = stylex.props(parts.icon, style);
	return <div className={attrJoin(sx.className, className)} style={sx.style} {...props} />;
}

export function SummaryContent({ className, style, ...props }: AgentActionApprovalSummaryContentProps) {
	const sx = stylex.props(parts.summaryContent, style);
	return <div className={attrJoin(sx.className, className)} style={sx.style} {...props} />;
}

export function Action({ className, style, ...props }: AgentActionApprovalActionProps) {
	const sx = stylex.props(parts.action, style);
	return <div className={attrJoin(sx.className, className)} style={sx.style} {...props} />;
}

export function ActionDescription({ className, style, ...props }: AgentActionApprovalActionDescriptionProps) {
	const sx = stylex.props(parts.actionDescription, style);
	return <div className={attrJoin(sx.className, className)} style={sx.style} {...props} />;
}

export function Details({ className, style, ...props }: AgentActionApprovalDetailsProps) {
	const sx = stylex.props(parts.details, style);
	return <dl className={attrJoin(sx.className, className)} style={sx.style} {...props} />;
}

export function Detail({ className, style, ...props }: AgentActionApprovalDetailProps) {
	const sx = stylex.props(parts.detail, style);
	return <div className={attrJoin(sx.className, className)} style={sx.style} {...props} />;
}

export function DetailLabel({ className, style, ...props }: AgentActionApprovalDetailLabelProps) {
	const sx = stylex.props(parts.detailLabel, style);
	return <dt className={attrJoin(sx.className, className)} style={sx.style} {...props} />;
}

export function DetailValue({ className, style, ...props }: AgentActionApprovalDetailValueProps) {
	const sx = stylex.props(parts.detailValue, style);
	return <dd className={attrJoin(sx.className, className)} style={sx.style} {...props} />;
}

export function Footer({ style, ...props }: AgentActionApprovalFooterProps) {
	return <CardFooter style={[parts.footer, style]} {...props} />;
}

export function Actions({ className, style, ...props }: AgentActionApprovalActionsProps) {
	const sx = stylex.props(parts.actions, style);
	return <div className={attrJoin(sx.className, className)} style={sx.style} {...props} />;
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
