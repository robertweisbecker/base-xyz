import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { tokens } from "@/theme/tokens.stylex";
import { MorphingMenu, type MorphingMenuProps } from "./morphing-menu";
import { MorphingModelSelector } from "./morphing-model-selector";

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

export const ModelSelector: Story = {
	parameters: {
		controls: { disable: true },
		docs: {
			description: {
				story:
					"A model-first adaptation: common models stay at the root while provider overflow, effort, and speed morph into focused levels.",
			},
		},
	},
	render: () => (
		<div {...stylex.props(storyStyles.frame)}>
			<div {...stylex.props(storyStyles.composer)}>
				<p {...stylex.props(storyStyles.prompt)}>
					Plan the smallest useful release and call out the tradeoffs.
				</p>
				<div {...stylex.props(storyStyles.composerFooter)}>
					<MorphingModelSelector />
					<span {...stylex.props(storyStyles.status)}>Ready to send</span>
				</div>
			</div>
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
	composer: {
		padding: tokens["--space-3"],
		borderColor: tokens["--border"],
		borderRadius: tokens["--radius-lg"],
		borderStyle: "solid",
		borderWidth: "1px",
		gap: tokens["--space-8"],
		backgroundColor: tokens["--surface"],
		boxShadow: tokens["--shadow-sm"],
		display: "grid",
		maxWidth: "42rem",
		minHeight: "12rem",
		width: "100%",
	},
	prompt: {
		margin: 0,
		color: tokens["--fg-muted"],
		fontFamily: tokens["--font-family-sans"],
		fontSize: tokens["--font-size-3"],
		lineHeight: tokens["--line-height-3"],
	},
	composerFooter: {
		alignItems: "center",
		display: "flex",
		justifyContent: "space-between",
	},
	status: {
		color: tokens["--fg-subtle"],
		fontFamily: tokens["--font-family-sans"],
		fontSize: tokens["--font-size-1"],
		lineHeight: tokens["--line-height-1"],
	},
});
