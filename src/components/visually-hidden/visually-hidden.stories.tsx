import { EyeIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/components/button/button";
import { VisuallyHidden } from "./visually-hidden";

const meta = {
	title: "Components/Layout/Visually hidden",
	component: VisuallyHidden,
	args: {
		children: "Opens account details in a new panel.",
	},
	argTypes: {
		children: { control: "text" },
		render: { control: false },
	},
	parameters: {
		controls: {
			include: ["children"],
		},
	},
} satisfies Meta<typeof VisuallyHidden>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	render: (args) => (
		<>
			<Button aria-describedby="visually-hidden-description" startSlot={<EyeIcon />}>
				View details
			</Button>
			<VisuallyHidden {...args} id="visually-hidden-description" />
		</>
	),
};
