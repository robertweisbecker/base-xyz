import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { Separator } from "@/components";
import { tokens } from "@/theme/tokens.stylex";

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
		<div {...stylex.props(storyParts.list)}>
			<Example title="Common uses">
				<div {...stylex.props(storyParts.row)}>
					<CopyButton value="pnpm add @base-ui/react" variant="secondary">
						Copy install command
					</CopyButton>
					<CopyButton tooltip="Copy project ID" value="project_4f28ac" variant="neutral" />
				</div>
			</Example>

			<Separator />

			<Example title="Sizes">
				<div {...stylex.props(storyParts.row)}>
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
				</div>
			</Example>

			<Separator />

			<Example title="Variants">
				<div {...stylex.props(storyParts.row)}>
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
				</div>
			</Example>

			<Separator />

			<Example title="Shapes">
				<div {...stylex.props(storyParts.row)}>
					<CopyButton shape="default" value="Default">
						Default
					</CopyButton>
					<CopyButton shape="pill" value="Pill">
						Pill
					</CopyButton>
					<CopyButton shape="square" tooltip="Copy square token" value="square-token" />
					<CopyButton shape="circle" tooltip="Copy circular token" value="circle-token" />
				</div>
			</Example>
		</div>
	),
};

function Example({ children, title }: { children: React.ReactNode; title: string }) {
	return (
		<section {...stylex.props(storyParts.example)}>
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
	example: {
		gap: tokens["--space-3"],
		display: "flex",
		flexDirection: "column",
	},
	row: {
		gap: tokens["--space-3"],
		alignItems: "center",
		display: "flex",
		flexWrap: "wrap",
	},
	heading: {
		margin: 0,
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-1"],
		fontWeight: tokens["--font-weight-regular"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
	},
});
