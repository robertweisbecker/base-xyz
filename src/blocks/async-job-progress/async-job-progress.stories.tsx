import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { Button, Collapsible, Separator } from "@/components";
import { tokens } from "@/theme/tokens.stylex";

import { AsyncJobProgress, type AsyncJobHeadingLevel } from "./async-job-progress";
const meta = {
	title: "Blocks/Async job progress",
	component: AsyncJobProgress.Root,
	parameters: {
		controls: { disable: true },
	},
} satisfies Meta<typeof AsyncJobProgress.Root>;

export default meta;
type Story = StoryObj;

function JobHeader({
	description,
	level = 3,
	title,
}: {
	description: string;
	level?: AsyncJobHeadingLevel;
	title: string;
}) {
	return (
		<AsyncJobProgress.Header>
			<AsyncJobProgress.Heading>
				<AsyncJobProgress.Title level={level}>{title}</AsyncJobProgress.Title>
				<AsyncJobProgress.Description>{description}</AsyncJobProgress.Description>
			</AsyncJobProgress.Heading>
			<AsyncJobProgress.Status />
		</AsyncJobProgress.Header>
	);
}

function Details({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<Collapsible.Root style={storyParts.disclosure}>
			<Collapsible.Trigger size="sm" variant="link">
				{label}
				<Collapsible.Icon />
			</Collapsible.Trigger>
			<Collapsible.Panel>
				<Collapsible.Content>{children}</Collapsible.Content>
			</Collapsible.Panel>
		</Collapsible.Root>
	);
}

export const Examples: Story = {
	render: () => (
		<div {...stylex.props(storyParts.list)}>
			<State title="Queued">
				<AsyncJobProgress.Root status="queued">
					<JobHeader title="Export workspace data" description="The export will start when the current job finishes." />
					<AsyncJobProgress.Progress />
					<AsyncJobProgress.Actions>
						<Button size="sm" variant="neutral">
							Cancel
						</Button>
					</AsyncJobProgress.Actions>
				</AsyncJobProgress.Root>
			</State>

			<Separator />

			<State title="Running with known progress">
				<AsyncJobProgress.Root status="running" value={62}>
					<JobHeader title="Export workspace data" description="Collecting files and preparing the archive." />
					<AsyncJobProgress.Progress />
					<Details label="Show export log">
						<span>Collected 148 of 240 files</span>
						<span>Compressed 86 MB</span>
						<span>Estimated time remaining: 24 seconds</span>
					</Details>
					<AsyncJobProgress.Actions>
						<Button size="sm" variant="neutral">
							Cancel
						</Button>
					</AsyncJobProgress.Actions>
				</AsyncJobProgress.Root>
			</State>

			<Separator />

			<State title="Running without a known value">
				<AsyncJobProgress.Root status="running" value={null}>
					<JobHeader title="Index knowledge base" description="Discovering documents before indexing begins." />
					<AsyncJobProgress.Progress />
					<AsyncJobProgress.Actions>
						<Button size="sm" variant="neutral">
							Cancel
						</Button>
					</AsyncJobProgress.Actions>
				</AsyncJobProgress.Root>
			</State>

			<Separator />

			<State title="Complete">
				<AsyncJobProgress.Root status="complete">
					<JobHeader level={4} title="Export workspace data" description="The archive is ready to download." />
					<AsyncJobProgress.Progress />
					<Details label="Show export summary">
						<span>Created workspace-export.zip</span>
						<span>240 files · 132 MB</span>
					</Details>
					<AsyncJobProgress.Actions>
						<Button size="sm">Download archive</Button>
					</AsyncJobProgress.Actions>
				</AsyncJobProgress.Root>
			</State>

			<Separator />

			<State title="Failed">
				<AsyncJobProgress.Root status="error" value={76}>
					<JobHeader
						title="Export workspace data"
						description="The export stopped before the archive could be created."
					/>
					<AsyncJobProgress.Progress />
					<div {...stylex.props(storyParts.controls)}>
						<Details label="Show error details">
							<span>UploadError: Storage destination is unavailable</span>
							<span>Last successful file: assets/research-notes.pdf</span>
						</Details>
						<AsyncJobProgress.Actions>
							<Button size="sm">Retry</Button>
						</AsyncJobProgress.Actions>
					</div>
				</AsyncJobProgress.Root>
			</State>
		</div>
	),
};

function State({ children, title }: { children: React.ReactNode; title: string }) {
	return (
		<section {...stylex.props(storyParts.state)}>
			<h2 {...stylex.props(storyParts.heading)}>{title}</h2>
			{children}
		</section>
	);
}

const storyParts = stylex.create({
	list: {
		gap: tokens["--space-8"],
		display: "flex",
		flexDirection: "column",
	},
	state: {
		gap: tokens["--space-3"],
		display: "flex",
		flexDirection: "column",
	},
	heading: {
		margin: 0,
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-1"],
		fontWeight: tokens["--font-weight-regular"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
	},
	controls: {
		gap: tokens["--space-3"],
		alignItems: "flex-start",
		display: "flex",
		justifyContent: "space-between",
		minWidth: 0,
	},
	disclosure: {
		flexBasis: "auto",
		flexGrow: "1",
		flexShrink: "1",
		minWidth: 0,
	},
});
