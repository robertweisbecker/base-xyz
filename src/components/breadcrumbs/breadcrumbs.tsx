import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { type ComponentProps, type ReactNode } from "react";
import { CopyButton } from "@/blocks/copy-button/copy-button";
import { Link as LinkPrimitive, type LinkColor } from "@/components/link/link";
import { Loader } from "@/components/loader/loader";
import { shimmerTextStyles } from "@/styles/recipes/shimmer-text.stylex";
import { tokens } from "@/theme/tokens.stylex";

type StyledProps<T> = Omit<T, "className" | "style"> & {
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

type SlotProps = {
	startSlot?: ReactNode;
	endSlot?: ReactNode;
};

export type BreadcrumbsSize = "sm" | "md";
export type BreadcrumbsRootProps = StyledProps<ComponentProps<"nav">> & {
	size?: BreadcrumbsSize;
	label?: string;
};
export type BreadcrumbsLinkProps = StyledProps<ComponentProps<"a">> &
	SlotProps & {
		color?: LinkColor;
	};
export type BreadcrumbsCurrentProps = StyledProps<ComponentProps<"span">> &
	SlotProps & {
		loading?: boolean;
	};
export type BreadcrumbsSeparatorProps = StyledProps<ComponentProps<"li">>;
export type BreadcrumbsCopyProps = Omit<StyledProps<ComponentProps<"button">>, "children" | "onClick"> & {
	label?: string;
	text: string;
};
export type BreadcrumbsClipboardProps = BreadcrumbsCopyProps;

export function Root({
	ref,
	children,
	className,
	label = "Breadcrumbs",
	size = "md",
	style,
	...props
}: BreadcrumbsRootProps) {
	const sx = stylex.props(parts.root, sizeStyles[size], style);

	return (
		<nav
			ref={ref}
			aria-label={label}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}>
			<ol {...stylex.props(parts.list)}>{children}</ol>
		</nav>
	);
}

export function Link({
	ref,
	children,
	className,
	startSlot,
	endSlot,
	color = "accent",
	style,
	...props
}: BreadcrumbsLinkProps) {
	const sx = stylex.props(parts.link, style);

	return (
		<li {...stylex.props(parts.item)}>
			<LinkPrimitive
				ref={ref}
				className={[sx.className, className].filter(Boolean).join(" ")}
				style={sx.style}
				color={color}
				{...props}>
				{renderSlot(startSlot)}
				<span {...stylex.props(parts.label)}>{children}</span>
				{renderSlot(endSlot)}
			</LinkPrimitive>
		</li>
	);
}

export function Current({
	ref,
	children,
	className,
	endSlot,
	loading,
	startSlot,
	style,
	...props
}: BreadcrumbsCurrentProps) {
	const sx = stylex.props(parts.current, loading && parts.loadingCurrent, style);

	return (
		<li {...stylex.props(parts.item)}>
			<span
				ref={ref}
				aria-current={loading ? undefined : "page"}
				aria-busy={loading ? true : undefined}
				className={[sx.className, className].filter(Boolean).join(" ")}
				style={sx.style}
				{...props}>
				{renderSlot(startSlot)}
				{loading ? (
					<>
						<Loader aria-hidden />
						<span {...stylex.props(parts.label, shimmerTextStyles.effect)}>Loading…</span>
					</>
				) : (
					<span {...stylex.props(parts.label)}>{children}</span>
				)}
				{renderSlot(endSlot)}
			</span>
		</li>
	);
}

export function Separator({ ref, children, className, style, ...props }: BreadcrumbsSeparatorProps) {
	const sx = stylex.props(parts.separator, style);

	return (
		<li
			ref={ref}
			aria-hidden
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}>
			{children ?? (
				<svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="1.25em" height="1.25em">
					<path strokeLinecap="round" strokeLinejoin="round" d="m9 20.247 6-16.5" />
				</svg>
			)}
		</li>
	);
}

export function Copy({ label = "Copy breadcrumb link", text, ...props }: BreadcrumbsCopyProps) {
	return (
		<li {...stylex.props(parts.item)}>
			<CopyButton {...props} aria-label={label} size="xs" tooltip={label} value={text} variant="ghost" />
		</li>
	);
}

export const Clipboard = Copy;

function renderSlot(slot: ReactNode) {
	if (slot == null || typeof slot === "boolean") {
		return null;
	}
	return (
		<span aria-hidden {...stylex.props(parts.slot)}>
			{slot}
		</span>
	);
}

const parts = stylex.create({
	root: {
		color: tokens["--fg-muted"],
		minWidth: 0,
	},
	list: {
		margin: 0,
		padding: 0,
		gap: tokens["--space-1-5"],
		listStyle: "none",
		alignItems: "center",
		display: "flex",
		flexWrap: "wrap",
		minWidth: 0,
	},
	item: {
		gap: tokens["--space-1-5"],
		alignItems: "center",
		display: "inline-flex",
		minWidth: 0,
	},
	link: {
		textDecorationLine: "none",
	},
	current: {
		gap: tokens["--space-1-5"],
		alignItems: "center",
		color: tokens["--fg"],
		display: "inline-flex",
		minWidth: 0,
	},
	loadingCurrent: {
		color: tokens["--fg-muted"],
	},
	separator: {
		alignItems: "center",
		color: tokens["--border-input"],
		display: "inline-flex",
		flexShrink: 0,
		justifyContent: "center",
		// marginInline: `calc(${tokens["--space-1"]} * -1)`,
	},
	slot: {
		fill: tokens["--fg-subtle"],
		alignItems: "center",
		color: "currentColor",
		display: "inline-flex",
		flexShrink: 0,
		justifyContent: "center",
		height: "1em",
		width: "1em",
	},
	label: {
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
		minWidth: 0,
	},
});

const sizeStyles = stylex.create({
	sm: {
		fontSize: tokens["--font-size-1"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
	},
	md: {
		fontSize: tokens["--font-size-2"],
		letterSpacing: tokens["--letter-spacing-2"],
		lineHeight: tokens["--line-height-2"],
	},
});

export const Breadcrumbs = {
	Root, Link, Current, Separator, Copy, Clipboard,
} as const;
