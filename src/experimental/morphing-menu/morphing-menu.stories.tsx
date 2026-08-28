import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { MorphingMenu, type MorphingMenuProps } from "./morphing-menu";

type MorphingMenuStoryArgs = Pick<MorphingMenuProps, "defaultOpen" | "label">;

const meta = {
	title: "Experimental/Morphing menu",
	args: {
		defaultOpen: true,
		label: "Document actions",
	},
	argTypes: {
		defaultOpen: { control: "boolean" },
		label: { control: "text" },
	},
	parameters: {
		controls: { include: ["defaultOpen", "label"] },
		docs: {
			description: {
				component:
					"An experimental StyleX port of the iOS-style popup demo from Base UI PR #5335. Open Share, then More, to inspect the nested morphing transition.",
			},
		},
		layout: "fullscreen",
	},
} satisfies Meta<MorphingMenuStoryArgs>;

export default meta;
type Story = StoryObj<MorphingMenuStoryArgs>;

export const Playground: Story = {
	render: ({ defaultOpen, label }) => (
		<div {...stylex.props(storyStyles.frame)}>
			<MorphingMenu key={`${defaultOpen}-${label}`} defaultOpen={defaultOpen} label={label} />
		</div>
	),
};

const storyStyles = stylex.create({
	frame: {
		padding: "4rem",
		alignItems: "center",
		display: "grid",
		justifyItems: "center",
		minHeight: "30rem",
	},
});
