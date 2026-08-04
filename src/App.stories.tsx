import type { Meta, StoryObj } from "@storybook/react-vite";
import { GalleryGrid } from "./App";

const meta = {
	title: "Gallery/App",
	component: GalleryGrid,
	parameters: {
		layout: "fullscreen",
		controls: { disable: true },
	},
	tags: [],
} satisfies Meta<typeof GalleryGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Gallery: Story = {};
