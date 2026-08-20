import { useRender } from "@base-ui/react/use-render";
import { DotsSixVerticalIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { Button, Heading, Text } from "@/components";
import { focusRing } from "@/styles/recipes/focus";
import { demoStyles } from "./drag-and-drop-demo.stylex";
import { attrJoin } from "@/utils/attr-join";

export function DemoComparison({ children }: { children: ReactNode }) {
	return <div {...stylex.props(demoStyles.comparison)}>{children}</div>;
}

export function DemoPanel({
	title,
	description,
	instructions,
	status,
	onReset,
	children,
}: {
	title: string;
	description: string;
	instructions?: ReactNode;
	status: string;
	onReset: () => void;
	children: ReactNode;
}) {
	return (
		<section {...stylex.props(demoStyles.panel)} aria-label={title}>
			<div {...stylex.props(demoStyles.panelHeader)}>
				<Heading size="3" mb={0}>
					{title}
				</Heading>
				<Text color="muted" size="2" mb={0}>
					{description}
				</Text>
			</div>
			{instructions}
			<div {...stylex.props(demoStyles.workArea)}>{children}</div>
			<div {...stylex.props(demoStyles.panelFooter)}>
				<DemoStatus>{status}</DemoStatus>
				<Button size="sm" variant="secondary" onClick={onReset}>
					Reset
				</Button>
			</div>
		</section>
	);
}

export type DemoCardProps = Omit<useRender.ComponentProps<"article">, "className" | "render" | "style"> & {
	className?: string;
	render?: useRender.RenderProp;
	style?: StyleXStyles;
	label: string;
	meta?: string;
	startSlot?: ReactNode;
	endSlot?: ReactNode;
};

export function DemoCard({
	ref,
	className,
	render,
	style,
	label,
	meta,
	startSlot,
	endSlot,
	children,
	...props
}: DemoCardProps) {
	const sx = stylex.props(demoStyles.card, style);

	return useRender<{}, HTMLElement>({
		defaultTagName: "article",
		render,
		ref,
		props: {
			...props,
			className: attrJoin(sx.className, className),
			style: sx.style,
			children: children ?? (
				<>
					{startSlot}
					<span {...stylex.props(demoStyles.cardText)}>
						<span {...stylex.props(demoStyles.cardLabel)}>{label}</span>
						{meta ? <span {...stylex.props(demoStyles.cardMeta)}>{meta}</span> : null}
					</span>
					{endSlot}
				</>
			),
		},
	});
}

export function DemoDropZone({
	label,
	description,
	isInvalid,
	children,
}: {
	label: string;
	description: string;
	isInvalid?: boolean;
	children?: ReactNode;
}) {
	return (
		<>
			<span {...stylex.props(demoStyles.dropZoneLabel, isInvalid && demoStyles.invalidLabel)}>{label}</span>
			<span {...stylex.props(demoStyles.dropZoneDescription)}>{description}</span>
			{children}
		</>
	);
}

export type DemoHandleProps = Omit<useRender.ComponentProps<"button">, "children" | "className" | "style"> & {
	label: string;
	className?: string;
	style?: StyleXStyles;
};

export function DemoHandle({ ref, label, className, style, type = "button", ...props }: DemoHandleProps) {
	const sx = stylex.props(demoStyles.handle, focusRing.offset, style);

	return (
		<button
			{...props}
			ref={ref}
			type={type}
			aria-label={label}
			className={attrJoin(sx.className, className)}
			style={sx.style}>
			<DotsSixVerticalIcon aria-hidden focusable="false" size={18} weight="bold" />
		</button>
	);
}

export function DemoStatus({ children }: { children: ReactNode }) {
	return <p {...stylex.props(demoStyles.status)}>{children}</p>;
}

export function DemoInstructions({ children }: { children: ReactNode }) {
	return <ol {...stylex.props(demoStyles.instructions)}>{children}</ol>;
}
