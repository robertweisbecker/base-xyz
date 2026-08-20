import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { tokens } from "@/theme/tokens.stylex";
import { Box, Grid, Stack } from "@/components/layout/layout";
import { Code } from "@/components/code/code";
import { CodeBlock } from "@/components/code-block/code-block";
import { Heading } from "@/components/heading/heading";
import { Separator } from "@/components/separator/separator";
import { Text } from "./text";
import { textStyles } from "./text.stylex";

const sizeOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;

const meta = {
	title: "Components/Text",
	component: Text,
	args: {
		children:
			"Turmoil has engulfed the Galactic Republic. " +
			"The taxation of trade routes to outlying star systems is in dispute.\n" +
			"Hoping to resolve the matter with a blockade " +
			"of deadly battleships, the greedy Trade Federation " +
			"has stopped all shipping to the small planet of Naboo.\n" +
			"While the congress of the Republic endlessly debates " +
			"this alarming chain of events, the Supreme Chancellor " +
			"has secretly dispatched two Jedi Knights, the guardians " +
			"of peace and justice in the galaxy, to settle the conflict....",
		color: "default",
		fontFamily: "sans",
		fontWeight: "regular",
		size: "2",
		truncate: false,
		wrap: "wrap",
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
			<Box maxWidth="720px">
				<Story />
			</Box>
		),
	],
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Layout: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<Box maxWidth="720px">
			<Heading mb={3} textAlign="center" size="4">
				Logical, token-backed spacing
			</Heading>
			<Text ms={4} textAlign="center">
				This text uses logical inline spacing and scalar alignment.
			</Text>
		</Box>
	),
};

export const Sizes: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack gap={3}>
			{sizeOptions.map((size) => (
				<Grid key={size} align="baseline" gap={4} style={storyStyles.specimen}>
					<Text size="1" color="muted" fontFamily="mono">
						{size}
					</Text>
					<Text size={size}>Text size {size}</Text>
				</Grid>
			))}
		</Stack>
	),
};

export const Styles: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Grid gap={3} style={storyStyles.styleGrid}>
			{(["sans", "serif", "mono"] as const).flatMap((fontFamily) =>
				(["regular", "medium", "semibold", "bold"] as const).map((fontWeight) => (
					<Text key={`${fontFamily}-${fontWeight}`} fontFamily={fontFamily} fontWeight={fontWeight} size="3">
						{fontFamily} · {fontWeight}
					</Text>
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
		<Stack gap={3}>
			{(["default", "subtle", "muted", "accent", "error", "success", "warning"] as const).map((textColor) => (
				<Text key={textColor} color={textColor} fontWeight="medium">
					{textColor}
				</Text>
			))}
		</Stack>
	),
};

export const Rendering: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack gap={8}>
			<Stack gap={3}>
				<Heading render={<h2 />} size="4">
					Rendering as another element
				</Heading>
				<Text render={<label htmlFor="workspace-name" />} fontWeight="medium">
					Render <Code>Text</Code> as a label
				</Text>
				<input id="workspace-name" {...stylex.props(storyStyles.input)} />
			</Stack>
			<Separator />
			<Stack gap={3}>
				<Heading render={<h2 />} size="4">
					Exported text styles
				</Heading>
				<Text size="2">
					Use the exported StyleX compositions when another component needs the same typography without nesting Text.
				</Text>
				<span {...stylex.props(textStyles.body)}>Body styles on a span</span>
				<CodeBlock>stylex.props(textStyles.body)</CodeBlock>
				<span {...stylex.props(textStyles.label)}>Label styles on a span</span>
				<CodeBlock>stylex.props(textStyles.label)</CodeBlock>
				<code {...stylex.props(textStyles.code)}>Code styles on a code element</code>
				<CodeBlock>stylex.props(textStyles.code)</CodeBlock>
			</Stack>
		</Stack>
	),
};

const storyStyles = stylex.create({
	styleGrid: {
		gridTemplateColumns: "repeat(auto-fit, minmax(12rem, 1fr))",
	},
	specimen: {
		gridTemplateColumns: `${tokens["--space-6"]} minmax(0, 1fr)`,
	},
	input: {
		borderColor: tokens["--border-input"],
		borderRadius: "0.4375rem",
		borderStyle: "solid",
		borderWidth: "1px",
		paddingInline: tokens["--space-2"],
		minHeight: tokens["--space-8"],
	},
});
