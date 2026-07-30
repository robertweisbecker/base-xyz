import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { space } from "@/styles/tokens.stylex";
import { Text } from "../text/text";
import { Heading } from "./heading";

const sizeOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;

const meta = {
	title: "Components/Heading",
	component: Heading,
	args: {
		children: "Workspace activity",
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
} satisfies Meta<typeof Heading>;

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
					<Heading truncate size={size}>
						Heading size {size}
					</Heading>
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
					<Heading key={`${fontFamily}-${fontWeight}`} fontFamily={fontFamily} fontWeight={fontWeight} size="4">
						{fontFamily} · {fontWeight}
					</Heading>
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
			{(["default", "subtle", "muted", "accent", "danger", "success", "warning"] as const).map((headingColor) => (
				<Heading key={headingColor} color={headingColor} size="4">
					{headingColor}
				</Heading>
			))}
		</div>
	),
};

export const SemanticLevels: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<section {...stylex.props(storyStyles.stack)}>
			<Heading render={<h2 />} size="6">
				Account settings
			</Heading>
			<Text render={<p />} color="muted" size="3">
				The semantic heading level and visual size are configured independently.
			</Text>
			<section {...stylex.props(storyStyles.subsection)}>
				<Heading render={<h3 />} size="4">
					Profile
				</Heading>
				<Text render={<p />}>Update your public name and account details.</Text>
			</section>
			<section {...stylex.props(storyStyles.subsection)}>
				<Heading render={(props) => <h3 {...props} data-story-element="render-callback" />} size="4">
					Notifications
				</Heading>
				<Text render={<p />}>Choose when the workspace should contact you.</Text>
			</section>
		</section>
	),
};

const storyStyles = stylex.create({
	frame: {
		maxWidth: "760px",
	},
	stack: {
		gap: space.x4,
		display: "flex",
		flexDirection: "column",
	},
	sections: {
		gap: space.x8,
		display: "flex",
		flexDirection: "column",
	},
	styleGrid: {
		gap: space.x4,
		display: "grid",
		gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))",
	},
	specimen: {
		gap: space.x4,
		alignItems: "baseline",
		display: "grid",
		gridTemplateColumns: `${space.x6} minmax(0, 1fr)`,
	},
	subsection: {
		gap: space.x2,
		display: "flex",
		flexDirection: "column",
		marginBlockStart: space.x4,
	},
});
