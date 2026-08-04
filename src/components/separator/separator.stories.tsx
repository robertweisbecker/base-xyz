import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { tokens } from "@/theme/tokens.stylex";

import { Separator } from "./separator";

const meta = {
	title: "Components/Separator",
	component: Separator,
	args: {
		orientation: "horizontal",
	},
	argTypes: {
		orientation: {
			control: "inline-radio",
			options: ["horizontal", "vertical"],
		},
	},
	parameters: {
		controls: {
			include: ["orientation"],
		},
	},
	decorators: [
		(Story) => (
			<div {...stylex.props(storyStyles.frame)}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Orientation: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(storyStyles.story)}>
			<section {...stylex.props(storyStyles.section)}>
				<h2 {...stylex.props(storyStyles.heading)}>Horizontal</h2>
				<div {...stylex.props(storyStyles.stack)}>
					<p {...stylex.props(storyStyles.text)}>The quick brown fox</p>
					<Separator />
					<p {...stylex.props(storyStyles.mutedText)}>No updates in the last hour.</p>
				</div>
			</section>
			<section {...stylex.props(storyStyles.section)}>
				<h2 {...stylex.props(storyStyles.heading)}>Vertical</h2>
				<div {...stylex.props(storyStyles.row)}>
					<span>Overview</span>
					<Separator orientation="vertical" />
					<span>Activity</span>
					<Separator orientation="vertical" />
					<span>Settings</span>
				</div>
			</section>
		</div>
	),
};

const storyStyles = stylex.create({
	frame: {
		maxWidth: "560px",
		minHeight: tokens["--space-4"],
	},
	story: {
		gap: tokens["--space-8"],
		display: "flex",
		flexDirection: "column",
	},
	section: {
		gap: tokens["--space-4"],
		display: "flex",
		flexDirection: "column",
	},
	heading: {
		margin: 0,
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-1"],
		fontWeight: tokens["--font-weight-regular"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
	},
	stack: {
		gap: tokens["--space-3"],
		display: "flex",
		flexDirection: "column",
	},
	row: {
		gap: tokens["--space-3"],
		alignItems: "center",
		color: tokens["--fg"],
		display: "flex",
		fontSize: tokens["--font-size-2"],
		letterSpacing: tokens["--letter-spacing-2"],
		lineHeight: tokens["--line-height-2"],
	},
	text: {
		margin: 0,
		color: tokens["--fg"],
		fontSize: tokens["--font-size-2"],
		letterSpacing: tokens["--letter-spacing-2"],
		lineHeight: tokens["--line-height-2"],
	},
	mutedText: {
		margin: 0,
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-2"],
		letterSpacing: tokens["--letter-spacing-2"],
		lineHeight: tokens["--line-height-2"],
	},
});
