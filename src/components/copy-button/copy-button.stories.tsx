import type { Meta, StoryObj } from "@storybook/react-vite";
import { CopyButton as BlockCopyButton } from "@/blocks";
import { Separator } from "@/components";
import { Stack } from "@/components/layout/layout";
import { Text } from "@/components/text/text";

import { CopyButton } from "./copy-button";

const meta = {
	title: "Components/Copy button",
	component: CopyButton,
	args: {
		value: "pnpm add @base-ui/react",
		children: "Copy install command",
		tooltip: "Copy to clipboard",
		size: "md",
		variant: "primary",
		shape: "default",
		disabled: false,
	},
	argTypes: {
		value: { control: "text" },
		children: { control: "text" },
		tooltip: { control: "text" },
		size: { control: "inline-radio", options: ["xs", "sm", "md", "lg"] },
		variant: {
			control: "select",
			options: ["primary", "subtle", "secondary", "neutral", "ghost", "error"],
		},
		shape: { control: "inline-radio", options: ["default", "pill", "square", "circle"] },
		disabled: { control: "boolean" },
	},
	parameters: {
		controls: { include: ["value", "children", "tooltip", "size", "variant", "shape", "disabled"] },
	},
} satisfies Meta<typeof CopyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Examples: Story = {
	parameters: {
		controls: { disable: true },
	},
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

			<Separator />

			<Example title="Canceled by the caller">
				<CopyButton value="restricted-token" onClick={(event) => event.preventDefault()}>
					Copy restricted token
				</CopyButton>
			</Example>

			<Separator />

			<Example title="Compatible block import">
				<BlockCopyButton value="project_4f28ac" variant="secondary">
					Copy project reference
				</BlockCopyButton>
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
