import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@/components/layout/layout";
import { Text } from "@/components/text/text";
import { Radio, RadioGroup, type RadioSize } from "./radio";

type RadioStoryArgs = {
	_label: string;
	_description: string;
	defaultValue: string;
	disabled: boolean;
	readOnly: boolean;
	required: boolean;
	size: RadioSize;
	visuallyHideLabel: boolean;
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
		visuallyHideLabel: false,
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
		visuallyHideLabel: { control: "boolean" },
	},
	parameters: {
		controls: {
			include: [
				"_label",
				"_description",
				"defaultValue",
				"disabled",
				"readOnly",
				"required",
				"size",
				"visuallyHideLabel",
			],
		},
	},
} satisfies Meta<RadioStoryArgs>;

export default meta;
type Story = StoryObj<RadioStoryArgs>;

export const Playground: Story = {
	render: ({
		_label,
		_description,
		defaultValue,
		disabled,
		readOnly,
		required,
		size,
		visuallyHideLabel,
	}) => (
		<RadioGroup
			key={defaultValue}
			label="Notification channel"
			name="playground-channel"
			defaultValue={defaultValue}
			disabled={disabled}
			readOnly={readOnly}
			required={required}
			size={size}
		>
			<Radio
				value="email"
				label={_label}
				description={_description}
				visuallyHideLabel={visuallyHideLabel}
			/>
			<Radio
				value="push"
				label="Push"
				description="Show updates on this device."
				visuallyHideLabel={visuallyHideLabel}
			/>
			<Radio
				value="none"
				label="None"
				description="Do not send updates."
				visuallyHideLabel={visuallyHideLabel}
			/>
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
		<Stack gap={8} p={4}>
			<Stack gap={4}>
				<Text color="muted" size="1">
					With descriptions
				</Text>
				<RadioGroup
					label="Project visibility"
					description="Choose who can access this project."
					name="visibility"
					defaultValue="team"
				>
					<Radio value="private" label="Private" description="Only you can access this project." />
					<Radio
						value="team"
						label="Team"
						description="Everyone in your workspace can access it."
					/>
				</RadioGroup>
			</Stack>
			<Stack gap={4}>
				<Text color="muted" size="1">
					Inline group
				</Text>
				<RadioGroup label="Billing cycle" name="billing-cycle" defaultValue="monthly" inline>
					<Radio value="monthly" label="Monthly" />
					<Radio value="quarterly" label="Quarterly" />
					<Radio value="yearly" label="Yearly" />
				</RadioGroup>
			</Stack>
		</Stack>
	),
};

export const States: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack gap={8} p={4}>
			<Stack gap={4}>
				<Text color="muted" size="1">
					Selected and unselected
				</Text>
				<RadioGroup label="Plan" name="states-plan" defaultValue="free">
					<Radio value="free" label="Free" />
					<Radio value="pro" label="Pro" />
					<Radio value="pro-plus" label="Pro+" description="Read-only" readOnly />
					<Radio value="ultra" label="Ultra" description="Disabled" disabled />
				</RadioGroup>
			</Stack>
			<Stack gap={4}>
				<Text color="muted" size="1">
					Disabled group
				</Text>
				<RadioGroup label="Region" name="states-region" disabled defaultValue="americas">
					<Radio value="americas" label="Americas" />
					<Radio value="europe" label="Europe" />
				</RadioGroup>
			</Stack>
			<Stack gap={4}>
				<Text color="muted" size="1">
					Read-only
				</Text>
				<RadioGroup
					data-testid="readonly-radio-group"
					label="Access level"
					name="states-access"
					defaultValue="editor"
					readOnly
				>
					<Radio data-testid="readonly-radio-viewer" value="viewer" label="Viewer" />
					<Radio data-testid="readonly-radio-editor" value="editor" label="Editor" />
				</RadioGroup>
			</Stack>
			<Stack gap={4}>
				<Text color="muted" size="1">
					Required
				</Text>
				<RadioGroup label="Deployment region" name="states-required" required>
					<Radio value="us" label="United States" />
					<Radio value="eu" label="Europe" />
				</RadioGroup>
			</Stack>
		</Stack>
	),
};
