import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { Heading } from "@/components/heading/heading";
import { tokens } from "@/theme/tokens.stylex";
import { Box } from "./layout";

const meta = {
	title: "Components/Layout/Box",
	component: Box,
	args: {
		bg: "surfaceSubtle",
		p: 4,
		radius: "md",
		shadow: "sm",
	},
	argTypes: {
		bg: { control: "select", options: ["canvas", "surface", "surfaceSubtle", "elevated"] },
		color: { control: "select", options: ["default", "muted", "accent", "error"] },
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
		<Box height="12rem" position="relative" xstyle={styles.frame}>
			<Box bg="accent" insetEnd={2} insetStart={-2} insetTop={4} p={3} position="absolute" radius="lg">
				Logical insets
			</Box>
		</Box>
	),
};

export const Polymorphic: Story = {
	args: { bg: undefined, p: undefined, radius: undefined, shadow: undefined },
	parameters: { controls: { disable: true } },
	render: () => (
		<Box render={<section aria-labelledby="box-heading" />} p={4} xstyle={styles.frame}>
			<Heading id="box-heading" render={<h2 />} size="4">
				Rendered as a section
			</Heading>
		</Box>
	),
};

export const CustomWidthAndPrecedence: Story = {
	args: { bg: undefined, p: undefined, radius: undefined, shadow: undefined },
	parameters: { controls: { disable: true } },
	render: () => (
		<Box width="40rem">
			<Box data-testid="custom-width" bg="surfaceSubtle" p={2} width="calc(100% - 2rem)">
				Custom CSS width
			</Box>
			<Box data-testid="style-wins" bg="surfaceSubtle" p={2} xstyle={styles.precedenceWidth} width="full">
				Final style wins
			</Box>
			<Box data-testid="mixed-spacing" m={1} mx={2} xstyle={styles.itemOutline}>
				Axis spacing wins
			</Box>
		</Box>
	),
};

const styles = stylex.create({
	frame: { borderColor: tokens["--border"], borderRadius: tokens["--radius-md"], borderStyle: "solid", borderWidth: 1 },
	precedenceWidth: { width: "12rem" },
	itemOutline: { borderColor: tokens["--border"], borderStyle: "solid", borderWidth: 1 },
});
