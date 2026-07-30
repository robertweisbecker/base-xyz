import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { useState } from "react";
import { color, space } from "@/styles/tokens.stylex";
import { fontSize, fontWeight, letterSpacing, lineHeight } from "@/styles/tokens.stylex";
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
			_groupDefaultValue,
			_groupDisabled,
	}) => (
		<div {...stylex.props(storyParts.story)}>
			<section {...stylex.props(storyParts.section)}>
				<h2 {...stylex.props(storyParts.heading)}>Single checkbox</h2>
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
				/>
			</section>
			<section {...stylex.props(storyParts.section)}>
				<h2 {...stylex.props(storyParts.heading)}>Checkbox group</h2>
				<CheckboxGroup
					key={_groupDefaultValue.join("-")}
					label="Notification methods"
					defaultValue={_groupDefaultValue}
					disabled={_groupDisabled}
					size={size}>
					<Checkbox value="email" label="Email" />
					<Checkbox value="push" label="Push" />
					<Checkbox value="sms" label="SMS" />
				</CheckboxGroup>
			</section>
		</div>
	),
};

export const Sizes: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(storyParts.stateList)}>
			<Checkbox size="sm" label="Small" defaultChecked />
			<Checkbox size="md" label="Medium" defaultChecked />
		</div>
	),
};

export const Groups: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(storyParts.story)}>
			<section {...stylex.props(storyParts.section)}>
				<h2 {...stylex.props(storyParts.heading)}>With descriptions</h2>
				<CheckboxGroup
					label="Notification methods"
					description="Choose all the ways we may contact you."
					defaultValue={["email", "push"]}>
					<Checkbox value="email" label="Email" description="Receive account updates by email." />
					<Checkbox value="push" label="Push" description="Receive notifications on this device." />
					<Checkbox value="sms" label="SMS" description="Receive urgent alerts by text message." />
				</CheckboxGroup>
			</section>
			<section {...stylex.props(storyParts.section)}>
				<h2 {...stylex.props(storyParts.heading)}>Inline group</h2>
				<CheckboxGroup label="Allowed network protocols" inline>
					<Checkbox value="http" label="HTTP" />
					<Checkbox value="https" label="HTTPS" />
					<Checkbox value="ssh" label="SSH" />
				</CheckboxGroup>
			</section>
		</div>
	),
};

export const States: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(storyParts.story)}>
			<section {...stylex.props(storyParts.section)}>
				<h2 {...stylex.props(storyParts.heading)}>Selection</h2>
				<div {...stylex.props(storyParts.stateList)}>
					<Checkbox label="Unchecked" />
					<Checkbox label="Checked" defaultChecked />
					<Checkbox label="Indeterminate" indeterminate />
				</div>
			</section>
			<section {...stylex.props(storyParts.section)}>
				<h2 {...stylex.props(storyParts.heading)}>Interaction</h2>
				<div {...stylex.props(storyParts.stateList)}>
					<Checkbox label="Disabled" disabled />
					<Checkbox label="Invalid" invalid />
					<Checkbox label="Read-only" defaultChecked readOnly />
					<Checkbox label="Required" required />
				</div>
			</section>
		</div>
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
			<div {...stylex.props(storyParts.permissionChildren)}>
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
					<div {...stylex.props(storyParts.permissionChildren)}>
						<Checkbox value="create-user" label="Create user" />
						<Checkbox value="edit-user" label="Edit user" />
						<Checkbox value="delete-user" label="Delete user" />
						<Checkbox value="assign-roles" label="Assign roles" />
					</div>
				</CheckboxGroup>
			</div>
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
	story: {
		padding: space.x4,
		gap: space.x8,
		display: "flex",
		flexDirection: "column",
	},
	section: {
		gap: space.x4,
		display: "flex",
		flexDirection: "column",
	},
	heading: {
		margin: 0,
		color: color.fgMuted,
		fontSize: fontSize.x1,
		fontWeight: fontWeight.regular,
		letterSpacing: letterSpacing.x1,
		lineHeight: lineHeight.x1,
	},
	stateList: {
		gap: space.x3,
		display: "grid",
	},
	permissionChildren: {
		gap: space.x3,
		borderInlineStartColor: color.border,
		borderInlineStartStyle: "solid",
		borderInlineStartWidth: "1px",
		display: "flex",
		flexDirection: "column",
		marginInlineStart: space.x2,
		paddingInlineStart: space.x5,
	},
});
