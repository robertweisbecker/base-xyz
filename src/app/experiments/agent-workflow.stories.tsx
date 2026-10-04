import type { Meta, StoryObj } from "@storybook/react-vite";
import { AgentWorkflow } from "./agent-workflow";

const meta = {
	title: "Experimental/Agent workflow",
	component: AgentWorkflow,
	tags: ["autodocs"],
	parameters: { controls: { disable: true } },
} satisfies Meta<typeof AgentWorkflow>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Examples: Story = {};
