import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
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
			<div {...stylex.props(styles.frame)}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const styles = stylex.create({
	frame: {
		maxWidth: "22rem",
	},
});
