import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { useState } from "react";
import { Heading } from "@/components/heading/heading";
import { Stack } from "@/components/layout/layout";
import { Separator } from "@/components/separator/separator";
import { tokens } from "@/theme/tokens.stylex";

import { Checkbox, CheckboxGroup, type CheckboxSize } from "./checkbox";

type CheckboxStoryArgs = {
	label: string;
	description: string;
	defaultChecked: boolean;
	disabled: boolean;
	invalid: boolean;
	readOnly: boolean;
	required: boolean;
	indeterminate: boolean;
	size: CheckboxSize;
	visuallyHideLabel: boolean;
	_groupDefaultValue: string[];
	_groupDisabled: boolean;
};

const meta = {
	title: "Components/Checkbox",
	component: Checkbox,
	args: {
		label: "Product updates",
		description: "Receive news about features and improvements.",
		defaultChecked: true,
		disabled: false,
		invalid: false,
		readOnly: false,
		required: false,
		indeterminate: false,
		size: "md",
		visuallyHideLabel: false,
		_groupDefaultValue: ["email"],
		_groupDisabled: false,
	},
	argTypes: {
		label: { control: "text" },
		description: { control: "text" },
		defaultChecked: { control: "boolean" },
		disabled: { control: "boolean" },
		invalid: { control: "boolean" },
		readOnly: { control: "boolean" },
		required: { control: "boolean" },
		indeterminate: { control: "boolean" },
		size: {
			control: "inline-radio",
			options: ["sm", "md"],
		},
		visuallyHideLabel: { control: "boolean" },
		_groupDefaultValue: {
			control: "check",
			options: ["email", "push", "sms"],
		},
		_groupDisabled: { control: "boolean" },
	},
	parameters: {
		controls: {
			include: [
				"label",
				"description",
				"defaultChecked",
				"disabled",
				"invalid",
				"readOnly",
				"required",
				"indeterminate",
				"size",
				"visuallyHideLabel",
				"_groupDefaultValue",
				"_groupDisabled",
			],
		},
	},
} satisfies Meta<CheckboxStoryArgs>;

export default meta;
type Story = StoryObj<CheckboxStoryArgs>;

export const Playground: Story = {
	render: ({
		label,
		description,
		defaultChecked,
		disabled,
		invalid,
		readOnly,
		required,
		indeterminate,
		size,
		visuallyHideLabel,
		_groupDefaultValue,
		_groupDisabled,
	}) => (
		<Stack gap={8} p={4}>
			<Stack align="start" gap={4}>
				<Heading size="1" color="muted" fontWeight="regular">
					Single checkbox
				</Heading>
				<Checkbox
					key={`${defaultChecked}-${indeterminate}`}
					label={label}
					description={description}
					defaultChecked={defaultChecked}
					disabled={disabled}
					invalid={invalid}
					readOnly={readOnly}
					required={required}
					indeterminate={indeterminate}
					size={size}
					visuallyHideLabel={visuallyHideLabel}
				/>
			</Stack>
			<Stack align="start" gap={4}>
				<Heading size="1" color="muted" fontWeight="regular">
					Checkbox group
				</Heading>
				<CheckboxGroup
					key={_groupDefaultValue.join("-")}
					label="Notification methods"
					defaultValue={_groupDefaultValue}
					disabled={_groupDisabled}
					size={size}>
					<Checkbox value="email" label="Email" visuallyHideLabel={visuallyHideLabel} />
					<Checkbox value="push" label="Push" visuallyHideLabel={visuallyHideLabel} />
					<Checkbox value="sms" label="SMS" visuallyHideLabel={visuallyHideLabel} />
				</CheckboxGroup>
			</Stack>
		</Stack>
	),
};

export const Sizes: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack gap={3}>
			<Checkbox size="sm" label="Small" defaultChecked />
			<Checkbox size="md" label="Medium" defaultChecked />
		</Stack>
	),
};

export const Groups: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack gap={8}>
			<Stack align="start" gap={4}>
				<Heading size="1" color="muted" fontWeight="regular">
					With descriptions
				</Heading>
				<CheckboxGroup
					label="Notification methods"
					description="Choose all the ways we may contact you."
					defaultValue={["email", "push"]}>
					<Checkbox value="email" label="Email" description="Receive account updates by email." />
					<Checkbox value="push" label="Push" description="Receive notifications on this device." />
					<Checkbox value="sms" label="SMS" description="Receive urgent alerts by text message." />
				</CheckboxGroup>
			</Stack>
			<Separator />
			<Stack align="start" gap={4}>
				<Heading size="1" color="muted" fontWeight="regular">
					Inline group
				</Heading>
				<CheckboxGroup label="Allowed network protocols" inline>
					<Checkbox value="http" label="HTTP" />
					<Checkbox value="https" label="HTTPS" />
					<Checkbox value="ssh" label="SSH" />
				</CheckboxGroup>
			</Stack>
		</Stack>
	),
};

export const States: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack gap={8}>
			<Stack align="start" gap={4}>
				<Heading size="1" color="muted" fontWeight="regular">
					Selection
				</Heading>
				<Stack gap={3}>
					<Checkbox label="Unchecked" />
					<Checkbox label="Checked" defaultChecked />
					<Checkbox label="Indeterminate" indeterminate />
				</Stack>
			</Stack>
			<Separator />
			<Stack align="start" gap={4}>
				<Heading size="1" color="muted" fontWeight="regular">
					Interaction
				</Heading>
				<Stack gap={3}>
					<Checkbox label="Disabled" disabled />
					<Checkbox label="Disabled, checked" defaultChecked disabled />
					<Checkbox label="Invalid" invalid />
					<Checkbox label="Invalid, checked" invalid defaultChecked />
					<Checkbox label="Read-only" readOnly />
					<Checkbox label="Read-only, disabled" disabled readOnly />
					<Checkbox label="Read-only, checked" defaultChecked readOnly />
					<Checkbox label="Read-only, invalid" invalid readOnly />
					<Checkbox label="Read-only, invalid, checked" invalid defaultChecked readOnly />
					<Checkbox label="Required" required />
				</Stack>
			</Stack>
		</Stack>
	),
};

const mainPermissions = ["view-dashboard", "manage-users", "access-reports"];
const userManagementPermissions = ["create-user", "edit-user", "delete-user", "assign-roles"];

function NestedParentCheckboxes() {
	const [mainValue, setMainValue] = useState<string[]>([]);
	const [managementValue, setManagementValue] = useState<string[]>([]);
	const managementIsPartial = managementValue.length > 0 && managementValue.length !== userManagementPermissions.length;

	return (
		<CheckboxGroup
			aria-label="User permissions"
			value={mainValue}
			onValueChange={(value) => {
				if (value.includes("manage-users")) {
					setManagementValue(userManagementPermissions);
				} else if (managementValue.length === userManagementPermissions.length) {
					setManagementValue([]);
				}

				setMainValue(value);
			}}
			allValues={mainPermissions}>
			<Checkbox parent indeterminate={managementIsPartial} label="User permissions" />
			<Stack gap={3} xstyle={storyParts.permissionChildren}>
				<Checkbox value="view-dashboard" label="View dashboard" />
				<Checkbox value="access-reports" label="Access reports" />
				<CheckboxGroup
					aria-label="Manage users"
					value={managementValue}
					onValueChange={(value) => {
						if (value.length === userManagementPermissions.length) {
							setMainValue((current) => Array.from(new Set([...current, "manage-users"])));
						} else {
							setMainValue((current) => current.filter((permission) => permission !== "manage-users"));
						}

						setManagementValue(value);
					}}
					allValues={userManagementPermissions}>
					<Checkbox parent label="Manage users" />
					<Stack gap={3} xstyle={storyParts.permissionChildren}>
						<Checkbox value="create-user" label="Create user" />
						<Checkbox value="edit-user" label="Edit user" />
						<Checkbox value="delete-user" label="Delete user" />
						<Checkbox value="assign-roles" label="Assign roles" />
					</Stack>
				</CheckboxGroup>
			</Stack>
		</CheckboxGroup>
	);
}

export const NestedParent: Story = {
	name: "Nested parent selection",
	parameters: {
		controls: { disable: true },
	},
	render: () => <NestedParentCheckboxes />,
};

const storyParts = stylex.create({
	permissionChildren: {
		borderInlineStartColor: tokens["--border"],
		borderInlineStartStyle: "solid",
		borderInlineStartWidth: "1px",
		marginInlineStart: tokens["--space-2"],
		paddingInlineStart: tokens["--space-5"],
	},
});
