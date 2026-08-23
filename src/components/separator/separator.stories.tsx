import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { Box, Stack } from "@/components/layout/layout";
import { Text } from "@/components/text/text";
import { Separator } from "./separator";

const meta = {
	title: "Components/Separator",
	component: Separator,
	args: {
		orientation: "horizontal",
	},
	argTypes: {
		orientation: {
			control: "inline-radio",
			options: ["horizontal", "vertical"],
		},
	},
	parameters: {
		controls: {
			include: ["orientation"],
		},
	},
	decorators: [
		(Story) => (
			<Box xstyle={storyStyles.frame}>
				<Story />
			</Box>
		),
	],
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Orientation: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack gap={8}>
			<Stack gap={4}>
				<Text color="muted" size="1">
					Horizontal
				</Text>
				<Stack gap={3}>
					<Text size="2">The quick brown fox</Text>
					<Separator />
					<Text color="muted" size="2">
						No updates in the last hour.
					</Text>
				</Stack>
			</Stack>
			<Stack gap={4}>
				<Text color="muted" size="1">
					Vertical
				</Text>
				<Stack align="center" gap={3} orientation="horizontal">
					<Text render={<span />} size="2">
						Overview
					</Text>
					<Separator orientation="vertical" />
					<Text render={<span />} size="2">
						Activity
					</Text>
					<Separator orientation="vertical" />
					<Text render={<span />} size="2">
						Settings
					</Text>
				</Stack>
			</Stack>
		</Stack>
	),
};

const storyStyles = stylex.create({
	frame: {
		maxWidth: "560px",
		minHeight: "1rem",
	},
});
