import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { colors, radius } from "@/styles/tokens.stylex";
import { Box } from "./layout";

const meta = {
	title: "Components/Box",
	component: Box,
	args: {
		bg: "surfaceSubtle",
		p: 4,
		radius: "md",
		shadow: "sm",
	},
	argTypes: {
		bg: { control: "select", options: ["canvas", "surface", "surfaceSubtle", "bgElevated"] },
		color: { control: "select", options: ["fg", "fgMuted", "fgAccent", "fgDanger"] },
		p: { control: "select", options: [0, 1, 2, 3, 4, 5, 6, 8] },
		radius: { control: "select", options: ["xxs", "xs", "sm", "md", "lg", "xl", "full"] },
		shadow: { control: "select", options: ["none", "sm", "md", "lg"] },
	},
	render: (args) => <Box {...args}>Token-backed box</Box>,
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Positioning: Story = {
	args: { bg: undefined, p: undefined, radius: undefined, shadow: undefined },
	parameters: { controls: { disable: true } },
	render: () => (
		<Box height="12rem" position="relative" style={styles.frame}>
			<Box
				bg="bgAccentSoft"
				insetEnd={2}
				insetStart={-2}
				insetTop={4}
				p={3}
				position="absolute"
				radius="lg"
			>
				Logical insets
			</Box>
		</Box>
	),
};

export const Polymorphic: Story = {
	args: { bg: undefined, p: undefined, radius: undefined, shadow: undefined },
	parameters: { controls: { disable: true } },
	render: () => (
		<Box render={<section aria-labelledby="box-heading" />} p={4} style={styles.frame}>
			<h2 id="box-heading" {...stylex.props(styles.heading)}>
				Rendered as a section
			</h2>
		</Box>
	),
};

export const CustomWidthAndPrecedence: Story = {
	args: { bg: undefined, p: undefined, radius: undefined, shadow: undefined },
	parameters: { controls: { disable: true } },
	render: () => (
		<div {...stylex.props(styles.widthFrame)}>
			<Box data-testid="custom-width" bg="surfaceSubtle" p={2} width="calc(100% - 2rem)">
				Custom CSS width
			</Box>
			<Box
				data-testid="style-wins"
				bg="surfaceSubtle"
				p={2}
				style={styles.precedenceWidth}
				width="full">
				Final style wins
			</Box>
			<Box data-testid="mixed-spacing" m={1} mx={2} style={styles.itemOutline}>
				Axis spacing wins
			</Box>
		</div>
	),
};

const styles = stylex.create({
	frame: { borderColor: colors["--border"], borderRadius: radius.md, borderStyle: "solid", borderWidth: 1 },
	heading: { margin: 0 },
	precedenceWidth: { width: "12rem" },
	itemOutline: { borderColor: colors["--border"], borderStyle: "solid", borderWidth: 1 },
	widthFrame: { width: "40rem" },
});
