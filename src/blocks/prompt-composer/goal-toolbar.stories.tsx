import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";
import { tokens } from "@/theme/tokens.stylex";

import { GoalToolbar } from "./goal-toolbar";

type StoryArgs = ComponentProps<typeof GoalToolbar>;

const meta = {
	title: "Blocks/Goal toolbar",
	component: GoalToolbar,
	parameters: {
		controls: { disable: true },
	},
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<StoryArgs>;

export const Examples: Story = {
	render: () => (
		<div {...stylex.props(storyParts.examples)}>
			<section {...stylex.props(storyParts.example)}>
				<h2 {...stylex.props(storyParts.label)}>Active goal</h2>
				<GoalToolbar active description="Standardize Storybook stories across the component library." />
			</section>
			<section {...stylex.props(storyParts.example)}>
				<h2 {...stylex.props(storyParts.label)}>Inactive goal</h2>
				<GoalToolbar active={false} description="Standardize Storybook stories across the component library." />
			</section>
			<section {...stylex.props(storyParts.example)}>
				<h2 {...stylex.props(storyParts.label)}>Long description</h2>
				<GoalToolbar
					active
					description="Audit every component and block story, consolidate repetitive examples, preserve meaningful controls, and verify the resulting Storybook navigation and behavior."
				/>
			</section>
		</div>
	),
};

const storyParts = stylex.create({
	examples: {
		gap: tokens["--space-8"],
		display: "flex",
		flexDirection: "column",
	},
	example: {
		gap: tokens["--space-3"],
		display: "flex",
		flexDirection: "column",
		maxWidth: "42rem",
	},
	label: {
		margin: 0,
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-1"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
	},
});
