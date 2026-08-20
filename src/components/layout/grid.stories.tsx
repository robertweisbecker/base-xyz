import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { breakpoints } from "@/styles/constants.stylex";
import { tokens } from "@/theme/tokens.stylex";
import { Card } from "@/components/card/card";
import { Box, Grid } from "./layout";

const meta = {
	title: "Components/Layout/Grid",
	component: Grid,
	args: { columns: 3, gap: 3 },
	argTypes: {
		align: { control: "select", options: ["start", "center", "end", "stretch", "baseline"] },
		columns: { control: { type: "number", min: 1, max: 12, step: 1 } },
		flow: { control: "select", options: ["row", "column", "dense", "row dense", "column dense"] },
		gap: { control: "select", options: [0, 1, 2, 3, 4, 5, 6, 8] },
		justify: { control: "select", options: ["start", "center", "end", "stretch"] },
	},
	render: (args) => (
		<Grid {...args}>
			<Box columnSpan={2} p={3} style={styles.item}>Spans two columns</Box>
			<Box p={3} style={styles.item}>One column</Box>
			<Box columnSpan="full" p={3} style={styles.item}>Full row</Box>
		</Grid>
	),
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const ResponsiveSpanStyle: Story = {
	args: { columns: 12, gap: 3 },
	parameters: { controls: { disable: true } },
	render: (args) => (
		<Grid {...args}>
			<Card.Root style={styles.responsiveSpan}>
				<Card.Content><Card.Title>Predeclared responsive span</Card.Title></Card.Content>
			</Card.Root>
			<Card.Root columnSpan={6}><Card.Content>Scalar six-column span</Card.Content></Card.Root>
		</Grid>
	),
};

const styles = stylex.create({
	item: { borderColor: tokens["--border"], borderRadius: tokens["--radius-sm"], borderStyle: "solid", borderWidth: 1, backgroundColor: tokens["--surface-subtle"] },
	responsiveSpan: {
		gridColumn: {
			default: "span 12 / span 12",
			[breakpoints.md]: "span 6 / span 6",
		},
	},
});
