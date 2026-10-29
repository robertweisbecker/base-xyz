import type { Meta, StoryObj } from "@storybook/react-vite";
import { EditableDetails } from "./editable-details";

const meta = {
	title: "Experimental/Editable details",
	component: EditableDetails,
	parameters: { controls: { disable: true } },
	tags: ["autodocs"],
} satisfies Meta<typeof EditableDetails>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Examples: Story = {};
