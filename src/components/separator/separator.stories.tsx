import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { colors, space } from "@/styles/tokens.stylex";
import { fontSize, fontWeight, letterSpacing, lineHeight } from "@/styles/tokens.stylex";
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
		minHeight: space[4],
	},
	story: {
		gap: space[8],
		display: "flex",
		flexDirection: "column",
	},
	section: {
		gap: space[4],
		display: "flex",
		flexDirection: "column",
	},
	heading: {
		margin: 0,
		color: colors["--text-muted"],
		fontSize: fontSize.x1,
		fontWeight: fontWeight.regular,
		letterSpacing: letterSpacing.x1,
		lineHeight: lineHeight.x1,
	},
	stack: {
		gap: space[3],
		display: "flex",
		flexDirection: "column",
	},
	row: {
		gap: space[3],
		alignItems: "center",
		color: colors["--text"],
		display: "flex",
		fontSize: fontSize.x2,
		letterSpacing: letterSpacing.x2,
		lineHeight: lineHeight.x2,
	},
	text: {
		margin: 0,
		color: colors["--text"],
		fontSize: fontSize.x2,
		letterSpacing: letterSpacing.x2,
		lineHeight: lineHeight.x2,
	},
	mutedText: {
		margin: 0,
		color: colors["--text-muted"],
		fontSize: fontSize.x2,
		letterSpacing: letterSpacing.x2,
		lineHeight: lineHeight.x2,
	},
});
