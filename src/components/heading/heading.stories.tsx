import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { tokens } from "@/theme/tokens.stylex";
import { Code } from "@/components/code/code";
import { Box, Grid, Stack } from "@/components/layout/layout";
import { Text } from "@/components/text/text";
import { Heading } from "./heading";

const sizeOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;

const meta = {
	title: "Components/Heading",
	component: Heading,
	args: {
		children: "The quick brown fox",
		color: "default",
		fontFamily: "sans",
		fontWeight: "semibold",
		size: "5",
		truncate: false,
		wrap: "balance",
	},
	argTypes: {
		children: { control: "text" },
		size: { control: "select", options: sizeOptions },
		fontFamily: { control: "inline-radio", options: ["sans", "serif", "mono"] },
		fontWeight: { control: "select", options: ["regular", "medium", "semibold", "bold"] },
		color: {
			control: "select",
			options: ["default", "subtle", "muted", "accent", "error", "success", "warning", "inverse", "inverse-muted"],
		},
		textAlign: { control: "inline-radio", options: ["start", "center", "end", "justify"] },
		wrap: { control: "inline-radio", options: ["wrap", "nowrap", "pretty", "balance"] },
		truncate: { control: "boolean" },
		m: { control: false },
		mb: { control: false },
		ms: { control: false },
		me: { control: false },
		mt: { control: false },
		mx: { control: false },
		my: { control: false },
		render: { control: false },
	},
	parameters: {
		controls: {
			include: ["children", "size", "fontFamily", "fontWeight", "color", "textAlign", "wrap", "truncate"],
		},
	},
	decorators: [
		(Story) => (
			<Box style={storyStyles.frame}>
				<Story />
			</Box>
		),
	],
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack gap={4}>
			{sizeOptions.map((size) => (
				<Stack key={size} align="baseline" gap={4} orientation="horizontal">
					<Text color="muted" fontFamily="mono" size="1" style={storyStyles.specimenLabel}>
						{size}
					</Text>
					<Heading truncate size={size}>
						Heading size {size}
					</Heading>
				</Stack>
			))}
		</Stack>
	),
};

export const Styles: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Grid columns={4} gap={4}>
			{(["sans", "serif", "mono"] as const).flatMap((fontFamily) =>
				(["regular", "medium", "semibold", "bold"] as const).map((fontWeight) => (
					<Heading key={`${fontFamily}-${fontWeight}`} fontFamily={fontFamily} fontWeight={fontWeight} size="3">
						{fontFamily} {fontWeight}
					</Heading>
				)),
			)}
		</Grid>
	),
};

export const Colors: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack gap={4}>
			{(["default", "subtle", "muted", "accent", "error", "success", "warning"] as const).map((headingColor) => (
				<Heading key={headingColor} color={headingColor} size="4">
					{headingColor}
				</Heading>
			))}
		</Stack>
	),
};

export const SemanticLevels: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack gap={4}>
			<Heading render={<h2 />} size="6">
				Account settings <Code>h2</Code>
			</Heading>
			<Text color="muted" size="3">
				The semantic heading level and visual size are configured independently.
			</Text>
			<Stack gap={2} mt={4}>
				<Heading render={<h3 />} size="4">
					Profile <Code>h3</Code>
				</Heading>
				<Text>Update your public name and account details.</Text>
			</Stack>
			<Stack gap={2} mt={4}>
				<Heading render={(props) => <h3 {...props} data-story-element="render-callback" />} size="4">
					Notifications <Code>h3</Code>
				</Heading>
				<Text>Choose when the workspace should contact you.</Text>
			</Stack>
		</Stack>
	),
};

const storyStyles = stylex.create({
	frame: {
		maxWidth: "760px",
	},
	specimenLabel: {
		minWidth: tokens["--space-6"],
	},
});
