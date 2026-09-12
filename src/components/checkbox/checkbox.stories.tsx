import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { useId, useRef, useState } from "react";
import { Button, Field, Fieldset, Form, Label } from "@/components";
import { Heading } from "@/components/heading/heading";
import { Stack } from "@/components/layout/layout";
import { Separator } from "@/components/separator/separator";
import { tokens } from "@/theme/tokens.stylex";

import { Checkbox, CheckboxGroup, type CheckboxProps } from "./checkbox";

type CheckboxStoryArgs = CheckboxProps & {
	_label: string;
	_description: string;
	_invalid: boolean;
};

const meta = {
	title: "Components/Checkbox",
	component: Checkbox,
	args: {
		_label: "Product updates",
		_description: "Receive news about features and improvements.",
		defaultChecked: true,
		disabled: false,
		_invalid: false,
		readOnly: false,
		required: false,
		indeterminate: false,
		size: "md",
	},
	argTypes: {
		"aria-invalid": { control: "boolean" },
		_label: { control: "text" },
		_description: { control: "text" },
		defaultChecked: { control: "boolean" },
		disabled: { control: "boolean" },
		_invalid: { control: "boolean" },
		readOnly: { control: "boolean" },
		required: { control: "boolean" },
		indeterminate: { control: "boolean" },
		size: { control: "inline-radio", options: ["sm", "md"] },
	},
	parameters: {
		controls: {
			include: [
				"_label",
				"_description",
				"aria-invalid",
				"defaultChecked",
				"disabled",
				"_invalid",
				"readOnly",
				"required",
				"indeterminate",
				"size",
			],
		},
	},
} satisfies Meta<CheckboxStoryArgs>;

export default meta;
type Story = StoryObj<CheckboxStoryArgs>;

export const Playground: Story = {
	render: ({ _label, _description, _invalid, disabled, ...args }) => (
		<Field.Root disabled={disabled} invalid={_invalid}>
			<Stack render={<Label variant="item" />} orientation="horizontal" align="start" gap={2}>
				<Checkbox
					data-testid="checkbox-playground-control"
					key={`${args.defaultChecked}-${args.indeterminate}`}
					{...args}
				/>
				{_label}
			</Stack>
			{_description && <Field.Description>{_description}</Field.Description>}
		</Field.Root>
	),
};

export const Sizes: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack gap={3}>
			<Field.Root>
				<Stack render={<Label variant="item" />} orientation="horizontal" align="start" gap={2}>
					<Checkbox size="sm" defaultChecked />
					Small
				</Stack>
			</Field.Root>
			<Field.Root>
				<Stack render={<Label variant="item" />} orientation="horizontal" align="start" gap={2}>
					<Checkbox size="md" defaultChecked />
					Medium
				</Stack>
			</Field.Root>
		</Stack>
	),
};

export const Groups: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: function RenderGroups() {
		const notificationsLegendId = useId();
		const protocolsLegendId = useId();
		return (
			<Stack gap={8}>
				<Stack align="start" gap={4}>
					<Heading size="1" color="muted" fontWeight="regular">
						With descriptions
					</Heading>
					<Fieldset.Root>
						<Fieldset.Legend id={notificationsLegendId}>Notification methods</Fieldset.Legend>
						<Field.Root name="channels" mt={2}>
							<Field.Description>Choose all the ways we may contact you.</Field.Description>
							<CheckboxGroup
								defaultValue={["email", "push"]}
								aria-labelledby={notificationsLegendId}
							>
								<Stack gap={3}>
									<Field.Item>
										<Stack
											render={<Label variant="item" />}
											orientation="horizontal"
											align="start"
											gap={2}
										>
											<Checkbox value="email" />
											Email
										</Stack>
										<Field.Description>Receive account updates by email.</Field.Description>
									</Field.Item>
									<Field.Item>
										<Stack
											render={<Label variant="item" />}
											orientation="horizontal"
											align="start"
											gap={2}
										>
											<Checkbox value="push" />
											Push
										</Stack>
										<Field.Description>Receive notifications on this device.</Field.Description>
									</Field.Item>
									<Field.Item>
										<Stack
											render={<Label variant="item" />}
											orientation="horizontal"
											align="start"
											gap={2}
										>
											<Checkbox value="sms" />
											SMS
										</Stack>
										<Field.Description>Receive urgent alerts by text message.</Field.Description>
									</Field.Item>
								</Stack>
							</CheckboxGroup>
						</Field.Root>
					</Fieldset.Root>
				</Stack>
				<Separator />
				<Stack align="start" gap={4}>
					<Heading size="1" color="muted" fontWeight="regular">
						Inline group
					</Heading>
					<Fieldset.Root>
						<Fieldset.Legend id={protocolsLegendId}>Allowed network protocols</Fieldset.Legend>
						<Field.Root name="protocols" mt={2}>
							<CheckboxGroup aria-labelledby={protocolsLegendId}>
								<Stack orientation="horizontal" align="start" wrap="wrap" gap={6}>
									<Field.Item>
										<Stack
											render={<Label variant="item" />}
											orientation="horizontal"
											align="start"
											gap={2}
										>
											<Checkbox value="http" />
											HTTP
										</Stack>
									</Field.Item>
									<Field.Item>
										<Stack
											render={<Label variant="item" />}
											orientation="horizontal"
											align="start"
											gap={2}
										>
											<Checkbox value="https" />
											HTTPS
										</Stack>
									</Field.Item>
									<Field.Item>
										<Stack
											render={<Label variant="item" />}
											orientation="horizontal"
											align="start"
											gap={2}
										>
											<Checkbox value="ssh" />
											SSH
										</Stack>
									</Field.Item>
								</Stack>
							</CheckboxGroup>
						</Field.Root>
					</Fieldset.Root>
				</Stack>
			</Stack>
		);
	},
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
					<Field.Root>
						<Stack render={<Label variant="item" />} orientation="horizontal" align="start" gap={2}>
							<Checkbox />
							Unchecked
						</Stack>
					</Field.Root>
					<Field.Root>
						<Stack render={<Label variant="item" />} orientation="horizontal" align="start" gap={2}>
							<Checkbox defaultChecked />
							Checked
						</Stack>
					</Field.Root>
					<Field.Root>
						<Stack render={<Label variant="item" />} orientation="horizontal" align="start" gap={2}>
							<Checkbox indeterminate />
							Indeterminate
						</Stack>
					</Field.Root>
				</Stack>
			</Stack>
			<Separator />
			<Stack align="start" gap={4}>
				<Heading size="1" color="muted" fontWeight="regular">
					Interaction
				</Heading>
				<Stack gap={3}>
					<Field.Root disabled>
						<Stack render={<Label variant="item" />} orientation="horizontal" align="start" gap={2}>
							<Checkbox />
							Disabled
						</Stack>
					</Field.Root>
					<Field.Root disabled>
						<Stack render={<Label variant="item" />} orientation="horizontal" align="start" gap={2}>
							<Checkbox defaultChecked />
							Disabled, checked
						</Stack>
					</Field.Root>
					<Field.Root invalid>
						<Stack render={<Label variant="item" />} orientation="horizontal" align="start" gap={2}>
							<Checkbox />
							Invalid
						</Stack>
					</Field.Root>
					<Field.Root invalid>
						<Stack render={<Label variant="item" />} orientation="horizontal" align="start" gap={2}>
							<Checkbox defaultChecked />
							Invalid, checked
						</Stack>
					</Field.Root>
					<Field.Root>
						<Stack render={<Label variant="item" />} orientation="horizontal" align="start" gap={2}>
							<Checkbox readOnly />
							Read-only
						</Stack>
					</Field.Root>
					<Field.Root disabled>
						<Stack render={<Label variant="item" />} orientation="horizontal" align="start" gap={2}>
							<Checkbox readOnly />
							Read-only, disabled
						</Stack>
					</Field.Root>
					<Field.Root>
						<Stack render={<Label variant="item" />} orientation="horizontal" align="start" gap={2}>
							<Checkbox defaultChecked readOnly />
							Read-only, checked
						</Stack>
					</Field.Root>
					<Field.Root invalid>
						<Stack render={<Label variant="item" />} orientation="horizontal" align="start" gap={2}>
							<Checkbox readOnly />
							Read-only, invalid
						</Stack>
					</Field.Root>
					<Field.Root invalid>
						<Stack render={<Label variant="item" />} orientation="horizontal" align="start" gap={2}>
							<Checkbox defaultChecked readOnly />
							Read-only, invalid, checked
						</Stack>
					</Field.Root>
					<Field.Root>
						<Stack render={<Label variant="item" />} orientation="horizontal" align="start" gap={2}>
							<Checkbox required />
							Required
						</Stack>
					</Field.Root>
				</Stack>
			</Stack>
		</Stack>
	),
};

export const Standalone: Story = {
	parameters: { controls: { disable: true } },
	render: () => <StandaloneSelection />,
};

function StandaloneSelection() {
	const [selection, setSelection] = useState("");
	return (
		<form
			onSubmit={(event) => {
				event.preventDefault();
				setSelection(String(new FormData(event.currentTarget).get("document") ?? "None"));
			}}
		>
			<Stack gap={3}>
				<Stack orientation="horizontal" gap={4}>
					<Checkbox aria-label="Select document" name="document" value="readme" />
					<Checkbox aria-label="Invalid selection" aria-invalid="true" defaultChecked />
					<Checkbox
						aria-label="Read-only invalid selection"
						aria-invalid="true"
						defaultChecked
						readOnly
					/>
				</Stack>
				<Button type="submit">Submit selection</Button>
				<output aria-label="Selected document">{selection}</output>
			</Stack>
		</form>
	);
}

export const Controlled: Story = {
	parameters: { controls: { disable: true } },
	render: () => <ControlledAgreement />,
};

function ControlledAgreement() {
	const [checked, setChecked] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const checkboxRef = useRef<HTMLElement>(null);
	return (
		<Form<{ agreement: boolean }> onFormSubmit={(values) => setSubmitted(values.agreement)}>
			<Stack gap={3}>
				<Field.Root name="agreement">
					<Stack render={<Label variant="item" />} orientation="horizontal" align="start" gap={2}>
						<Checkbox
							ref={checkboxRef}
							checked={checked}
							onCheckedChange={setChecked}
							value="accepted"
							required
						/>
						Accept the workspace terms
					</Stack>
					<Field.Error />
				</Field.Root>
				<Stack orientation="horizontal" gap={2}>
					<Button type="submit">Continue</Button>
					<Button type="button" variant="secondary" onClick={() => setChecked(false)}>
						Clear selection
					</Button>
					<Button type="button" variant="secondary" onClick={() => checkboxRef.current?.focus()}>
						Focus agreement
					</Button>
				</Stack>
				<output aria-label="Agreement submitted">{String(submitted)}</output>
			</Stack>
		</Form>
	);
}

const mainPermissions = ["view-dashboard", "manage-users", "access-reports"];
const userManagementPermissions = ["create-user", "edit-user", "delete-user", "assign-roles"];

function NestedParentCheckboxes() {
	const [mainValue, setMainValue] = useState<string[]>([]);
	const [managementValue, setManagementValue] = useState<string[]>([]);
	const managementIsPartial =
		managementValue.length > 0 && managementValue.length !== userManagementPermissions.length;

	return (
		<Field.Root name="permissions">
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
				allValues={mainPermissions}
			>
				<Stack gap={3}>
					<Field.Item>
						<Stack render={<Label variant="item" />} orientation="horizontal" align="start" gap={2}>
							<Checkbox parent indeterminate={managementIsPartial} />
							User permissions
						</Stack>
					</Field.Item>
					<Stack gap={3} xstyle={storyParts.permissionChildren}>
						<Field.Item>
							<Stack
								render={<Label variant="item" />}
								orientation="horizontal"
								align="start"
								gap={2}
							>
								<Checkbox value="view-dashboard" />
								View dashboard
							</Stack>
						</Field.Item>
						<Field.Item>
							<Stack
								render={<Label variant="item" />}
								orientation="horizontal"
								align="start"
								gap={2}
							>
								<Checkbox value="access-reports" />
								Access reports
							</Stack>
						</Field.Item>
						<Field.Root name="management">
							<CheckboxGroup
								aria-label="Manage users"
								value={managementValue}
								onValueChange={(value) => {
									if (value.length === userManagementPermissions.length) {
										setMainValue((current) => Array.from(new Set([...current, "manage-users"])));
									} else {
										setMainValue((current) =>
											current.filter((permission) => permission !== "manage-users"),
										);
									}

									setManagementValue(value);
								}}
								allValues={userManagementPermissions}
							>
								<Stack gap={3}>
									<Field.Item>
										<Stack
											render={<Label variant="item" />}
											orientation="horizontal"
											align="start"
											gap={2}
										>
											<Checkbox parent />
											Manage users
										</Stack>
									</Field.Item>
									<Stack gap={3} xstyle={storyParts.permissionChildren}>
										<Field.Item>
											<Stack
												render={<Label variant="item" />}
												orientation="horizontal"
												align="start"
												gap={2}
											>
												<Checkbox value="create-user" />
												Create user
											</Stack>
										</Field.Item>
										<Field.Item>
											<Stack
												render={<Label variant="item" />}
												orientation="horizontal"
												align="start"
												gap={2}
											>
												<Checkbox value="edit-user" />
												Edit user
											</Stack>
										</Field.Item>
										<Field.Item>
											<Stack
												render={<Label variant="item" />}
												orientation="horizontal"
												align="start"
												gap={2}
											>
												<Checkbox value="delete-user" />
												Delete user
											</Stack>
										</Field.Item>
										<Field.Item>
											<Stack
												render={<Label variant="item" />}
												orientation="horizontal"
												align="start"
												gap={2}
											>
												<Checkbox value="assign-roles" />
												Assign roles
											</Stack>
										</Field.Item>
									</Stack>
								</Stack>
							</CheckboxGroup>
						</Field.Root>
					</Stack>
				</Stack>
			</CheckboxGroup>
		</Field.Root>
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
