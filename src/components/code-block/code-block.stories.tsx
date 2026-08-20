import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box } from "@/components/layout/layout";
import { CodeBlock } from "./code-block";

const meta = {
	title: "Components/Code block",
	component: CodeBlock,
	args: {
		children: `const message = "Ready for review with a deliberately long line that demonstrates horizontal scrolling";

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
	decorators: [
		(Story) => (
			<Box maxWidth="22rem">
				<Story />
			</Box>
		),
	],
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
