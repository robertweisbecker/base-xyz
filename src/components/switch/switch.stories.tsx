import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { colors, space } from "@/styles/tokens.stylex";
import { fontSize, fontWeight, letterSpacing, lineHeight } from "@/styles/tokens.stylex";
import { Switch } from "./switch";

const meta = {
	title: "Components/Switch",
	component: Switch,
	args: {
		label: "Weekly summary",
		description: "Receive a short digest every Friday.",
		defaultChecked: true,
		disabled: false,
		readOnly: false,
		required: false,
		size: "md",
	},
	argTypes: {
		label: { control: "text" },
		description: { control: "text" },
		defaultChecked: { control: "boolean" },
		disabled: { control: "boolean" },
		readOnly: { control: "boolean" },
		required: { control: "boolean" },
		size: {
			control: "inline-radio",
			options: ["sm", "md", "lg"],
		},
	},
	parameters: {
		controls: {
			include: ["label", "description", "defaultChecked", "disabled", "readOnly", "required", "size"],
		},
	},
	decorators: [
		(Story) => (
			<div {...stylex.props(styles.frame)}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	render: (args) => <Switch key={`${args.defaultChecked}-${args.readOnly}-${args.disabled}`} {...args} />,
};

export const Sizes: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<section {...stylex.props(styles.section)}>
			<Switch label="Small" size="sm" defaultChecked />
			<Switch label="Medium" size="md" defaultChecked />
			<Switch label="Large" size="lg" defaultChecked />
		</section>
	),
};

export const States: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(styles.story)}>
			<section {...stylex.props(styles.section)}>
				<h2 {...stylex.props(styles.heading)}>Selection</h2>
				<Switch label="Off" />
				<Switch label="On" defaultChecked />
			</section>
			<section {...stylex.props(styles.section)}>
				<h2 {...stylex.props(styles.heading)}>Interaction</h2>
				<Switch label="Disabled" disabled />
				<Switch label="Read-only" defaultChecked readOnly />
				<Switch label="Required" required />
			</section>
		</div>
	),
};

const styles = stylex.create({
	frame: { maxWidth: "420px" },
	story: {
		gap: space[8],
		display: "flex",
		flexDirection: "column",
	},
	section: {
		gap: space[4],
		display: "flex",
		flexDirection: "column",
	},
	heading: {
		margin: 0,
		color: colors["--text-muted"],
		fontSize: fontSize.x1,
		fontWeight: fontWeight.regular,
		letterSpacing: letterSpacing.x1,
		lineHeight: lineHeight.x1,
	},
});
