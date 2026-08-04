import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { colors, space } from "@/styles/tokens.stylex";
import { fontSize, fontWeight, letterSpacing, lineHeight } from "@/styles/tokens.stylex";
import { Radio, RadioGroup, type RadioSize } from "./radio";

type RadioStoryArgs = {
	_label: string;
	_description: string;
	defaultValue: string;
	disabled: boolean;
	readOnly: boolean;
	required: boolean;
	size: RadioSize;
};

const meta = {
	title: "Components/Radio",
	args: {
		_label: "Email",
		_description: "Send updates to your email address.",
		defaultValue: "email",
		disabled: false,
		readOnly: false,
		required: false,
		size: "md",
	},
	argTypes: {
		_label: { control: "text" },
		_description: { control: "text" },
		defaultValue: {
			control: "inline-radio",
			options: ["email", "push", "none"],
		},
		disabled: { control: "boolean" },
		readOnly: { control: "boolean" },
		required: { control: "boolean" },
		size: {
			control: "inline-radio",
			options: ["sm", "md"],
		},
	},
	parameters: {
		controls: {
			include: ["_label", "_description", "defaultValue", "disabled", "readOnly", "required", "size"],
		},
	},
} satisfies Meta<RadioStoryArgs>;

export default meta;
type Story = StoryObj<RadioStoryArgs>;

export const Playground: Story = {
	render: ({ _label, _description, defaultValue, disabled, readOnly, required, size }) => (
		<RadioGroup
			key={defaultValue}
			label="Notification channel"
			name="playground-channel"
			defaultValue={defaultValue}
			disabled={disabled}
			readOnly={readOnly}
			required={required}
			size={size}>
			<Radio value="email" label={_label} description={_description} />
			<Radio value="push" label="Push" description="Show updates on this device." />
			<Radio value="none" label="None" description="Do not send updates." />
		</RadioGroup>
	),
};

export const Sizes: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<RadioGroup label="Density" name="density" defaultValue="sm">
			<Radio size="sm" value="sm" label="Small" />
			<Radio size="md" value="md" label="Medium" />
		</RadioGroup>
	),
};

export const Groups: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(storyStyles.story)}>
			<section {...stylex.props(storyStyles.section)}>
				<h2 {...stylex.props(storyStyles.heading)}>With descriptions</h2>
				<RadioGroup
					label="Project visibility"
					description="Choose who can access this project."
					name="visibility"
					defaultValue="team">
					<Radio value="private" label="Private" description="Only you can access this project." />
					<Radio value="team" label="Team" description="Everyone in your workspace can access it." />
				</RadioGroup>
			</section>
			<section {...stylex.props(storyStyles.section)}>
				<h2 {...stylex.props(storyStyles.heading)}>Inline group</h2>
				<RadioGroup label="Billing cycle" name="billing-cycle" defaultValue="monthly" inline>
					<Radio value="monthly" label="Monthly" />
					<Radio value="quarterly" label="Quarterly" />
					<Radio value="yearly" label="Yearly" />
				</RadioGroup>
			</section>
		</div>
	),
};

export const States: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(storyStyles.story)}>
			<section {...stylex.props(storyStyles.section)}>
				<h2 {...stylex.props(storyStyles.heading)}>Selected and unselected</h2>
				<RadioGroup label="Plan" name="states-plan" defaultValue="free">
					<Radio value="free" label="Free" />
					<Radio value="pro" label="Pro" />
					<Radio value="pro-plus" label="Pro+" description="Read-only" readOnly />
					<Radio value="ultra" label="Ultra" description="Disabled" disabled />
				</RadioGroup>
			</section>
			<section {...stylex.props(storyStyles.section)}>
				<h2 {...stylex.props(storyStyles.heading)}>Disabled group</h2>
				<RadioGroup label="Region" name="states-region" disabled defaultValue="americas">
					<Radio value="americas" label="Americas" />
					<Radio value="europe" label="Europe" />
				</RadioGroup>
			</section>
			<section {...stylex.props(storyStyles.section)}>
				<h2 {...stylex.props(storyStyles.heading)}>Read-only</h2>
				<RadioGroup label="Access level" name="states-access" defaultValue="editor" readOnly>
					<Radio value="viewer" label="Viewer" />
					<Radio value="editor" label="Editor" />
				</RadioGroup>
			</section>
			<section {...stylex.props(storyStyles.section)}>
				<h2 {...stylex.props(storyStyles.heading)}>Required</h2>
				<RadioGroup label="Deployment region" name="states-required" required>
					<Radio value="us" label="United States" />
					<Radio value="eu" label="Europe" />
				</RadioGroup>
			</section>
		</div>
	),
};

const storyStyles = stylex.create({
	story: {
		padding: space[4],
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
});
