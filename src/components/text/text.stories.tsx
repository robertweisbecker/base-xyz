import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { color, space } from "@/styles/tokens.stylex";
import { Heading } from "../heading/heading";
import { Text } from "./text";
import { textStyles } from "./text.stylex";
import { Separator } from "../separator/separator";
import { CodeBlock } from "../code-block/code-block";

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
			options: ["default", "subtle", "muted", "accent", "danger", "success", "warning", "inverse", "inverse-muted"],
		},
		align: { control: "inline-radio", options: ["start", "center", "end", "justify"] },
		wrap: { control: "inline-radio", options: ["wrap", "nowrap", "pretty", "balance"] },
		truncate: { control: "boolean" },
		m: { control: false },
		mb: { control: false },
		ml: { control: false },
		mr: { control: false },
		mt: { control: false },
		mx: { control: false },
		my: { control: false },
		render: { control: false },
	},
	parameters: {
		controls: {
			include: ["children", "size", "fontFamily", "fontWeight", "color", "align", "wrap", "truncate"],
		},
	},
	decorators: [
		(Story) => (
			<div {...stylex.props(storyStyles.frame)}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(storyStyles.stack)}>
			{sizeOptions.map((size) => (
				<div key={size} {...stylex.props(storyStyles.specimen)}>
					<Text size="1" color="muted" fontFamily="mono">
						{size}
					</Text>
					<Text size={size}>Text size {size}</Text>
				</div>
			))}
		</div>
	),
};

export const Styles: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(storyStyles.styleGrid)}>
			{(["sans", "serif", "mono"] as const).flatMap((fontFamily) =>
				(["regular", "medium", "semibold", "bold"] as const).map((fontWeight) => (
					<Text key={`${fontFamily}-${fontWeight}`} fontFamily={fontFamily} fontWeight={fontWeight} size="3">
						{fontFamily} · {fontWeight}
					</Text>
				)),
			)}
		</div>
	),
};

export const Colors: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(storyStyles.stack)}>
			{(["default", "subtle", "muted", "accent", "danger", "success", "warning"] as const).map((textColor) => (
				<Text key={textColor} color={textColor} fontWeight="medium">
					{textColor}
				</Text>
			))}
		</div>
	),
};

export const Rendering: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(storyStyles.sections)}>
			<section {...stylex.props(storyStyles.section)}>
				<Heading render={<h2 />} size="4">
					Rendering as another element
				</Heading>
				<Text render={<label htmlFor="workspace-name" />} fontWeight="medium">
					Render <code>Text</code> as a label
				</Text>
				<input id="workspace-name" {...stylex.props(storyStyles.input)} />
			</section>
			<Separator />
			<section {...stylex.props(storyStyles.section)}>
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
			</section>
		</div>
	),
};

const storyStyles = stylex.create({
	frame: {
		maxWidth: "720px",
	},
	sections: {
		gap: space.x8,
		display: "flex",
		flexDirection: "column",
	},
	section: {
		gap: space.x3,
		display: "flex",
		flexDirection: "column",
	},
	stack: {
		gap: space.x3,
		display: "flex",
		flexDirection: "column",
	},
	styleGrid: {
		gap: space.x3,
		display: "grid",
		gridTemplateColumns: "repeat(auto-fit, minmax(12rem, 1fr))",
	},
	specimen: {
		gap: space.x4,
		alignItems: "baseline",
		display: "grid",
		gridTemplateColumns: `${space.x6} minmax(0, 1fr)`,
	},
	input: {
		borderColor: color.borderStrong,
		borderRadius: "0.4375rem",
		borderStyle: "solid",
		borderWidth: "1px",
		paddingInline: space.x2,
		minHeight: space.x8,
	},
});
