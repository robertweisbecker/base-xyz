import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { Box, Stack } from "@/components/layout/layout";
import { Text } from "@/components/text/text";
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
		visuallyHideLabel: false,
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
		visuallyHideLabel: { control: "boolean" },
	},
	parameters: {
		controls: {
			include: [
				"label",
				"description",
				"defaultChecked",
				"disabled",
				"readOnly",
				"required",
				"size",
				"visuallyHideLabel",
			],
		},
	},
	decorators: [
		(Story) => (
			<Box xstyle={styles.frame}>
				<Story />
			</Box>
		),
	],
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	render: (args) => (
		<Switch key={`${args.defaultChecked}-${args.readOnly}-${args.disabled}`} {...args} />
	),
};

export const Sizes: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack gap={4}>
			<Switch label="Small" size="sm" defaultChecked />
			<Switch label="Medium" size="md" defaultChecked />
			<Switch label="Large" size="lg" defaultChecked />
		</Stack>
	),
};

export const States: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack gap={8}>
			<Stack gap={4}>
				<Text color="muted" size="1">
					Selection
				</Text>
				<Switch label="Off" />
				<Switch label="On" defaultChecked />
			</Stack>
			<Stack gap={4}>
				<Text color="muted" size="1">
					Interaction
				</Text>
				<Switch label="Disabled" disabled />
				<Switch label="Read-only" defaultChecked readOnly />
				<Switch label="Required" required />
			</Stack>
		</Stack>
	),
};

const styles = stylex.create({
	frame: { maxWidth: "420px" },
});
