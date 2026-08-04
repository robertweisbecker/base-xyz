import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { tokens } from "@/theme/tokens.stylex";
import { Box, Stack } from "./layout";

const meta = {
	title: "Components/Layout/Stack",
	component: Stack,
	args: { gap: 3, orientation: "vertical" },
	argTypes: {
		align: { control: "select", options: ["start", "center", "end", "stretch", "baseline"] },
		gap: { control: "select", options: [0, 1, 2, 3, 4, 5, 6, 8] },
		justify: { control: "select", options: ["start", "center", "end", "space-between", "space-around", "space-evenly"] },
		orientation: { control: "inline-radio", options: ["vertical", "horizontal"] },
		reverse: { control: "boolean" },
		wrap: { control: "select", options: ["nowrap", "wrap", "wrap-reverse"] },
	},
	render: (args) => (
		<Stack {...args}>
			<Box p={3} style={styles.item}>First</Box>
			<Box p={3} style={styles.item}>Second</Box>
			<Box p={3} style={styles.item}>Third</Box>
		</Stack>
	),
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Orientation: Story = {
	args: { gap: 4, orientation: "horizontal" },
	parameters: { controls: { disable: true } },
};

export const Reverse: Story = {
	args: { orientation: "horizontal", reverse: true },
	parameters: { controls: { disable: true } },
};

const styles = stylex.create({
	item: { borderColor: tokens["--border"], borderRadius: tokens["--radius-sm"], borderStyle: "solid", borderWidth: 1, backgroundColor: tokens["--surface-subtle"] },
});
