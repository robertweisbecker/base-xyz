import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, useState } from "react";
import { Button, Field, Form, Label } from "@/components";
import { Stack } from "@/components/layout/layout";
import { Text } from "@/components/text/text";
import { Radio, RadioGroup, type RadioProps, type RadioSize } from "./radio";

type RadioStoryArgs = Pick<RadioProps, "aria-invalid"> & {
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
		"aria-invalid": { control: "boolean" },
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
			include: [
				"_label",
				"_description",
				"aria-invalid",
				"defaultValue",
				"disabled",
				"readOnly",
				"required",
				"size",
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
		"aria-invalid": ariaInvalid,
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
			<Field.Item>
				<Stack render={<Label variant="item" />} orientation="horizontal" align="start" gap={2}>
					<Radio value="email" aria-invalid={ariaInvalid} />
					{_label}
				</Stack>
				{_description && <Field.Description>{_description}</Field.Description>}
			</Field.Item>
			<Field.Item>
				<Stack render={<Label variant="item" />} orientation="horizontal" align="start" gap={2}>
					<Radio value="push" />
					Push
				</Stack>
				<Field.Description>Show updates on this device.</Field.Description>
			</Field.Item>
			<Field.Item>
				<Stack render={<Label variant="item" />} orientation="horizontal" align="start" gap={2}>
					<Radio value="none" />
					None
				</Stack>
				<Field.Description>Do not send updates.</Field.Description>
			</Field.Item>
		</RadioGroup>
	),
};

export const Sizes: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<RadioGroup label="Density" name="density" defaultValue="sm">
			<Field.Item>
				<Stack render={<Label variant="item" />} orientation="horizontal" align="start" gap={2}>
					<Radio size="sm" value="sm" />
					Small
				</Stack>
			</Field.Item>
			<Field.Item>
				<Stack render={<Label variant="item" />} orientation="horizontal" align="start" gap={2}>
					<Radio size="md" value="md" />
					Medium
				</Stack>
			</Field.Item>
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
					<Field.Item>
						<Stack render={<Label variant="item" />} orientation="horizontal" align="start" gap={2}>
							<Radio value="private" />
							Private
						</Stack>
						<Field.Description>Only you can access this project.</Field.Description>
					</Field.Item>
					<Field.Item>
						<Stack render={<Label variant="item" />} orientation="horizontal" align="start" gap={2}>
							<Radio value="team" />
							Team
						</Stack>
						<Field.Description>Everyone in your workspace can access it.</Field.Description>
					</Field.Item>
				</RadioGroup>
			</Stack>
			<Stack gap={4}>
				<Text color="muted" size="1">
					Inline group
				</Text>
				<RadioGroup label="Billing cycle" name="billing-cycle" defaultValue="monthly" inline>
					<Field.Item>
						<Stack render={<Label variant="item" />} orientation="horizontal" align="start" gap={2}>
							<Radio value="monthly" />
							Monthly
						</Stack>
					</Field.Item>
					<Field.Item>
						<Stack render={<Label variant="item" />} orientation="horizontal" align="start" gap={2}>
							<Radio value="quarterly" />
							Quarterly
						</Stack>
					</Field.Item>
					<Field.Item>
						<Stack render={<Label variant="item" />} orientation="horizontal" align="start" gap={2}>
							<Radio value="yearly" />
							Yearly
						</Stack>
					</Field.Item>
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
					<Field.Item>
						<Stack render={<Label variant="item" />} orientation="horizontal" align="start" gap={2}>
							<Radio value="free" />
							Free
						</Stack>
					</Field.Item>
					<Field.Item>
						<Stack render={<Label variant="item" />} orientation="horizontal" align="start" gap={2}>
							<Radio value="pro" />
							Pro
						</Stack>
					</Field.Item>
					<Field.Item>
						<Stack render={<Label variant="item" />} orientation="horizontal" align="start" gap={2}>
							<Radio value="pro-plus" readOnly />
							Pro+
						</Stack>
						<Field.Description>Read-only</Field.Description>
					</Field.Item>
					<Field.Item disabled>
						<Stack render={<Label variant="item" />} orientation="horizontal" align="start" gap={2}>
							<Radio value="ultra" />
							Ultra
						</Stack>
						<Field.Description>Disabled</Field.Description>
					</Field.Item>
				</RadioGroup>
			</Stack>
			<Stack gap={4}>
				<Text color="muted" size="1">
					Disabled group
				</Text>
				<RadioGroup label="Region" name="states-region" disabled defaultValue="americas">
					<Field.Item>
						<Stack render={<Label variant="item" />} orientation="horizontal" align="start" gap={2}>
							<Radio value="americas" />
							Americas
						</Stack>
					</Field.Item>
					<Field.Item>
						<Stack render={<Label variant="item" />} orientation="horizontal" align="start" gap={2}>
							<Radio value="europe" />
							Europe
						</Stack>
					</Field.Item>
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
					<Field.Item>
						<Stack render={<Label variant="item" />} orientation="horizontal" align="start" gap={2}>
							<Radio data-testid="readonly-radio-viewer" value="viewer" />
							Viewer
						</Stack>
					</Field.Item>
					<Field.Item>
						<Stack render={<Label variant="item" />} orientation="horizontal" align="start" gap={2}>
							<Radio data-testid="readonly-radio-editor" value="editor" />
							Editor
						</Stack>
					</Field.Item>
				</RadioGroup>
			</Stack>
			<Stack gap={4}>
				<Text color="muted" size="1">
					Required
				</Text>
				<RadioGroup label="Deployment region" name="states-required" required>
					<Field.Item>
						<Stack render={<Label variant="item" />} orientation="horizontal" align="start" gap={2}>
							<Radio value="us" />
							United States
						</Stack>
					</Field.Item>
					<Field.Item>
						<Stack render={<Label variant="item" />} orientation="horizontal" align="start" gap={2}>
							<Radio value="eu" />
							Europe
						</Stack>
					</Field.Item>
				</RadioGroup>
			</Stack>
		</Stack>
	),
};

export const Controlled: Story = {
	parameters: { controls: { disable: true } },
	render: () => <ControlledVisibility />,
};

function ControlledVisibility() {
	const [visibility, setVisibility] = useState("");
	const [submitted, setSubmitted] = useState("");
	const privateRef = useRef<HTMLElement>(null);
	return (
		<Form<{ visibility: string }> onFormSubmit={(values) => setSubmitted(values.visibility)}>
			<Stack gap={3}>
				<RadioGroup
					label="Project visibility"
					name="visibility"
					value={visibility}
					onValueChange={setVisibility}
					required
				>
					<Field.Item>
						<Stack render={<Label variant="item" />} orientation="horizontal" align="start" gap={2}>
							<Radio ref={privateRef} value="private" />
							Private
						</Stack>
						<Field.Description>Only invited collaborators can access it.</Field.Description>
					</Field.Item>
					<Field.Item>
						<Stack render={<Label variant="item" />} orientation="horizontal" align="start" gap={2}>
							<Radio value="team" />
							Team
						</Stack>
						<Field.Description>Everyone in the workspace can access it.</Field.Description>
					</Field.Item>
					<Field.Error />
				</RadioGroup>
				<Stack orientation="horizontal" gap={2}>
					<Button type="submit">Save visibility</Button>
					<Button type="button" variant="secondary" onClick={() => setVisibility("private")}>
						Select private
					</Button>
					<Button type="button" variant="secondary" onClick={() => privateRef.current?.focus()}>
						Focus private
					</Button>
				</Stack>
				<output aria-label="Submitted visibility">{submitted}</output>
			</Stack>
		</Form>
	);
}
