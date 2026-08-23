import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { Button, Collapsible, Separator } from "@/components";
import { Stack } from "@/components/layout/layout";
import { Text } from "@/components/text/text";

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
		<Collapsible.Root xstyle={storyParts.disclosure}>
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
		<Stack gap={8}>
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
						<Text render={<span />}>Collected 148 of 240 files</Text>
						<Text render={<span />}>Compressed 86 MB</Text>
						<Text render={<span />}>Estimated time remaining: 24 seconds</Text>
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
						<Text render={<span />}>Created workspace-export.zip</Text>
						<Text render={<span />}>240 files · 132 MB</Text>
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
					<Stack align="start" gap={3} justify="space-between" minWidth={0} orientation="horizontal">
						<Details label="Show error details">
							<Text render={<span />}>UploadError: Storage destination is unavailable</Text>
							<Text render={<span />}>Last successful file: assets/research-notes.pdf</Text>
						</Details>
						<AsyncJobProgress.Actions>
							<Button size="sm">Retry</Button>
						</AsyncJobProgress.Actions>
					</Stack>
				</AsyncJobProgress.Root>
			</State>
		</Stack>
	),
};

function State({ children, title }: { children: React.ReactNode; title: string }) {
	return (
		<Stack gap={3}>
			<Text size="1" color="muted">
				{title}
			</Text>
			{children}
		</Stack>
	);
}

const storyParts = stylex.create({
	disclosure: {
		flexBasis: "auto",
		flexGrow: "1",
		flexShrink: "1",
		minWidth: 0,
	},
});
