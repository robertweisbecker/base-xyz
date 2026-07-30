import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { color, fontSize, letterSpacing, lineHeight, space } from "@/styles/tokens.stylex";
import * as Progress from "./progress";

const meta = {
	title: "Components/Progress",
	component: Progress.Root,
	args: {
		value: 64,
	},
	argTypes: {
		format: { control: false },
		getAriaValueText: { control: false },
		locale: { control: false },
		value: {
			control: { type: "number", min: 0, max: 100, step: 1 },
		},
	},
	parameters: {
		controls: {
			include: ["value"],
		},
	},
	decorators: [
		(Story) => (
			<div {...stylex.props(storyStyles.frame)}>
				<Story />
			</div>
		),
	],
	render: (args) => (
		<Progress.Root {...args}>
			<Progress.Label>Indexing project</Progress.Label>
			<Progress.Value />
			<Progress.Track>
				<Progress.Indicator />
			</Progress.Track>
		</Progress.Root>
	),
} satisfies Meta<typeof Progress.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(storyStyles.stack)}>
			<section {...stylex.props(storyStyles.specimen)}>
				<span {...stylex.props(storyStyles.label)}>Determinate</span>
				<Progress.Root value={42}>
					<Progress.Label>Uploading design assets</Progress.Label>
					<Progress.Value />
					<Progress.Track>
						<Progress.Indicator />
					</Progress.Track>
				</Progress.Root>
			</section>
			<section {...stylex.props(storyStyles.specimen)}>
				<span {...stylex.props(storyStyles.label)}>Indeterminate</span>
				<Progress.Root aria-valuetext="Preparing workspace" value={null}>
					<Progress.Label>Preparing workspace</Progress.Label>
					<Progress.Value>{() => "In progress"}</Progress.Value>
					<Progress.Track>
						<Progress.Indicator />
					</Progress.Track>
				</Progress.Root>
			</section>
			<section {...stylex.props(storyStyles.specimen)}>
				<span {...stylex.props(storyStyles.label)}>Complete</span>
				<Progress.Root value={100}>
					<Progress.Label>Workspace ready</Progress.Label>
					<Progress.Value />
					<Progress.Track>
						<Progress.Indicator />
					</Progress.Track>
				</Progress.Root>
			</section>
		</div>
	),
};

const storyStyles = stylex.create({
	frame: {
		maxWidth: "28rem",
		width: "100%",
	},
	stack: {
		gap: space.x8,
		display: "flex",
		flexDirection: "column",
	},
	specimen: {
		gap: space.x2,
		display: "flex",
		flexDirection: "column",
	},
	label: {
		color: color.fgMuted,
		fontSize: fontSize.x1,
		letterSpacing: letterSpacing.x1,
		lineHeight: lineHeight.x1,
	},
});
