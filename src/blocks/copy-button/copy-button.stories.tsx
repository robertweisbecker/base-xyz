import type { Meta, StoryObj } from "@storybook/react-vite";
import { Separator } from "@/components";
import { Stack } from "@/components/layout/layout";
import { Text } from "@/components/text/text";

import { CopyButton } from "./copy-button";

const meta = {
	title: "Blocks/Copy button",
	component: CopyButton,
	parameters: {
		controls: { disable: true },
	},
} satisfies Meta<typeof CopyButton>;

export default meta;
type Story = StoryObj;

export const Examples: Story = {
	render: () => (
		<Stack gap={8}>
			<Example title="Common uses">
				<Stack align="center" gap={3} orientation="horizontal" wrap="wrap">
					<CopyButton value="pnpm add @base-ui/react" variant="secondary">
						Copy install command
					</CopyButton>
					<CopyButton tooltip="Copy project ID" value="project_4f28ac" variant="neutral" />
				</Stack>
			</Example>

			<Separator />

			<Example title="Sizes">
				<Stack align="center" gap={3} orientation="horizontal" wrap="wrap">
					<CopyButton size="xs" value="Extra small">
						Extra small
					</CopyButton>
					<CopyButton size="sm" value="Small">
						Small
					</CopyButton>
					<CopyButton size="md" value="Medium">
						Medium
					</CopyButton>
					<CopyButton size="lg" value="Large">
						Large
					</CopyButton>
				</Stack>
			</Example>

			<Separator />

			<Example title="Variants">
				<Stack align="center" gap={3} orientation="horizontal" wrap="wrap">
					<CopyButton value="Primary" variant="primary">
						Primary
					</CopyButton>
					<CopyButton value="Subtle" variant="subtle">
						Subtle
					</CopyButton>
					<CopyButton value="Secondary" variant="secondary">
						Secondary
					</CopyButton>
					<CopyButton value="Neutral" variant="neutral">
						Neutral
					</CopyButton>
					<CopyButton value="Ghost" variant="ghost">
						Ghost
					</CopyButton>
					<CopyButton value="Error" variant="error">
						Error
					</CopyButton>
				</Stack>
			</Example>

			<Separator />

			<Example title="Shapes">
				<Stack align="center" gap={3} orientation="horizontal" wrap="wrap">
					<CopyButton shape="default" value="Default">
						Default
					</CopyButton>
					<CopyButton shape="pill" value="Pill">
						Pill
					</CopyButton>
					<CopyButton shape="square" tooltip="Copy square token" value="square-token" />
					<CopyButton shape="circle" tooltip="Copy circular token" value="circle-token" />
				</Stack>
			</Example>
		</Stack>
	),
};

function Example({ children, title }: { children: React.ReactNode; title: string }) {
	return (
		<Stack gap={3}>
			<Text size="1" color="muted">
				{title}
			</Text>
			{children}
		</Stack>
	);
}
