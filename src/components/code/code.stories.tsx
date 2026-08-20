import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text } from "@/components/text/text";
import { Code } from "./code";

const meta = {
	title: "Components/Code",
	component: Code,
	args: {
		children: "npm run build",
	},
	argTypes: {
		children: { control: "text" },
	},
	parameters: {
		controls: {
			include: ["children"],
		},
	},
	render: (args) => (
		<Text>
			Run <Code {...args} /> before opening a pull request.
		</Text>
	),
} satisfies Meta<typeof Code>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
