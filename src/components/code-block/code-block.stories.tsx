import type { Meta, StoryObj } from "@storybook/react-vite";
import { CodeBlock } from "./code-block";

const meta = {
	title: "Components/Code block",
	component: CodeBlock,
	args: {
		children: `const message = "Ready for review";

submitForReview(message);`,
	},
	argTypes: {
		children: { control: "text" },
	},
	parameters: {
		controls: {
			include: ["children"],
		},
	},
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
