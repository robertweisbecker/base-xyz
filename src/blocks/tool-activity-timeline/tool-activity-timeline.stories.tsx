import { ArrowRightIcon } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { CodeBlock } from "@/components/code-block/code-block";
import * as Collapsible from "@/components/collapsible/collapsible";
import { Separator } from "@/components/separator/separator";
import { color, space } from "@/styles/tokens.stylex";
import { fontSize, letterSpacing, lineHeight } from "@/styles/tokens.stylex";
import * as Timeline from "./tool-activity-timeline";

const meta = {
	title: "Blocks/Tool activity timeline",
	component: Timeline.Root,
	parameters: {
		controls: { disable: true },
	},
} satisfies Meta<typeof Timeline.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

function Details({ children }: { children: ReactNode }) {
	return (
		<Collapsible.Root>
			<Collapsible.Trigger size="xs" variant="link">
				Show details
				<Collapsible.Icon />
			</Collapsible.Trigger>
			<Collapsible.Panel>
				<Collapsible.Content><CodeBlock>{children}</CodeBlock></Collapsible.Content>
			</Collapsible.Panel>
		</Collapsible.Root>
	);
}

function Activity({
	status,
	title,
	description,
	endSlot,
	icon,
	meta,
	startSlot,
	details,
}: {
	status: Timeline.ToolActivityStatus;
	title: string;
	description?: string;
	endSlot?: ReactNode;
	icon?: ReactNode;
	meta?: string;
	startSlot?: ReactNode;
	details?: ReactNode;
}) {
	return (
		<Timeline.Item status={status}>
			<Timeline.Marker />
			<Timeline.Content>
				<Timeline.Header>
					<Timeline.Title>{title}</Timeline.Title>
					{description ? <Timeline.Description>{description}</Timeline.Description> : null}
					<Timeline.Metadata>
						{meta ? <Timeline.Meta>{meta}</Timeline.Meta> : null}
						<Timeline.Status endSlot={endSlot} icon={icon} startSlot={startSlot} />
					</Timeline.Metadata>
				</Timeline.Header>
				{details ? <Details>{details}</Details> : null}
			</Timeline.Content>
		</Timeline.Item>
	);
}

export const Examples: Story = {
	render: () => (
		<div {...stylex.props(storyParts.examples)}>
			<section {...stylex.props(storyParts.example)}>
				<h2 {...stylex.props(storyParts.label)}>Active workflow</h2>
				<Timeline.Root aria-label="Active agent workflow">
					<Activity
						status="complete"
						title="Inspected the repository"
						description="Read component conventions and current blocks."
						meta="1.2s"
						details={"Read AGENTS.md\nScanned src/components\nScanned src/blocks"}
					/>
					<Activity
						status="running"
						title="Updating stories"
						description="Consolidating related examples."
						icon={<PlusIcon aria-hidden weight="bold" />}
						meta="8s"
						details="Editing 4 files"
					/>
					<Activity
						status="approval"
						title="Publish the branch"
						description="Permission is required before pushing changes."
						endSlot={<ArrowRightIcon aria-hidden weight="bold" />}
					/>
					<Activity
						status="queued"
						title="Run verification"
						description="Typecheck, lint, and build Storybook."
					/>
				</Timeline.Root>
			</section>
			<Separator />
			<section {...stylex.props(storyParts.example)}>
				<h2 {...stylex.props(storyParts.label)}>Failed workflow</h2>
				<Timeline.Root aria-label="Failed agent workflow">
					<Activity status="complete" title="Searched component files" meta="420ms" />
					<Activity
						status="error"
						title="Built Storybook"
						description="The build stopped while compiling a story."
						meta="12s"
						details={"TypeError: Cannot read properties of undefined\nat ToolActivityTimeline.stories.tsx:42"}
					/>
				</Timeline.Root>
			</section>
		</div>
	),
};

const storyParts = stylex.create({
	examples: {
		gap: space[6],
		display: "flex",
		flexDirection: "column",
		maxWidth: "46rem",
	},
	example: {
		gap: space[3],
		display: "flex",
		flexDirection: "column",
	},
	label: {
		margin: 0,
		color: color.fgMuted,
		fontSize: fontSize.x1,
		letterSpacing: letterSpacing.x1,
		lineHeight: lineHeight.x1,
	},
});
