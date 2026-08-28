import { ShieldCheckIcon } from "@phosphor-icons/react/dist/csr/ShieldCheck";
import { UserIcon } from "@phosphor-icons/react/dist/csr/User";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/button/button";
import { Box, Stack } from "@/components/layout/layout";
import { Separator } from "@/components/separator/separator";
import { Text } from "@/components/text/text";
import { Stepper, type StepperOrientation, type StepperStatus, type StepperValue } from "./stepper";

const markerOptions = {
	Number: null,
	Profile: <UserIcon aria-hidden weight="duotone" />,
	Security: <ShieldCheckIcon aria-hidden weight="duotone" />,
};

type StepperPlaygroundArgs = {
	_locked: boolean;
	_marker: ReactNode;
	_status: StepperStatus;
	defaultValue: StepperValue;
	orientation: StepperOrientation;
};

const meta = {
	title: "Components/Stepper",
	component: Stepper.Root,
	args: {
		_locked: false,
		_marker: null,
		_status: "incomplete",
		defaultValue: "profile",
		orientation: "horizontal",
	},
	argTypes: {
		_locked: { control: "boolean", name: "_locked" },
		_marker: {
			control: "select",
			mapping: markerOptions,
			name: "_marker",
			options: Object.keys(markerOptions),
		},
		_status: {
			control: "inline-radio",
			name: "_status",
			options: ["incomplete", "completed", "invalid"],
		},
		defaultValue: {
			control: "select",
			options: ["profile", "security", "billing"],
		},
		orientation: {
			control: "inline-radio",
			options: ["horizontal", "vertical"],
		},
	},
	parameters: {
		controls: {
			include: ["defaultValue", "orientation", "_status", "_locked", "_marker"],
		},
	},
	decorators: [
		(Story) => (
			<Box maxWidth="48rem" width="100%">
				<Story />
			</Box>
		),
	],
} satisfies Meta<StepperPlaygroundArgs>;

export default meta;
type Story = StoryObj<StepperPlaygroundArgs>;

export const Playground: Story = {
	render: (args) => (
		<Stepper.Root
			key={`${args.defaultValue}-${args.orientation}`}
			defaultValue={args.defaultValue}
			orientation={args.orientation}
		>
			<Stepper.List aria-label="Account setup progress">
				<AccountStep
					description="Add your personal details."
					marker={1}
					status="completed"
					title="Profile"
					value="profile"
				/>
				<AccountStep
					description="Choose authentication options."
					marker={args._marker ?? 2}
					status={args._status}
					title="Security"
					value="security"
				/>
				<AccountStep
					description="Add a payment method."
					disabled={args._locked}
					marker={3}
					title="Billing"
					value="billing"
				/>
			</Stepper.List>
			<AccountPanels />
		</Stepper.Root>
	),
};

export const Orientations: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<Stack gap={8}>
			<Stack data-testid="horizontal-stepper" gap={2} minWidth={0}>
				<Text color="muted" size="1">
					Horizontal
				</Text>
				<ExampleStepper />
			</Stack>
			<Separator />
			<Stack data-testid="vertical-stepper" gap={2} minWidth={0}>
				<Text color="muted" size="1">
					Vertical
				</Text>
				<ExampleStepper defaultValue="security" orientation="vertical" />
			</Stack>
		</Stack>
	),
};

export const States: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<Stack data-testid="states-stepper" gap={2} minWidth={0}>
			<Text color="muted" size="1">
				Completed, current, incomplete, invalid, and locked
			</Text>
			<Stepper.Root defaultValue="review">
				<Stepper.List aria-label="Verification progress">
					<AccountStep
						description="Saved contact details."
						marker={1}
						markerTestId="completed-step-marker"
						status="completed"
						title="Account"
						value="account"
					/>
					<AccountStep
						description="Confirm the submitted information."
						marker={2}
						title="Review"
						value="review"
					/>
					<AccountStep description="Not started yet." marker={3} title="Billing" value="billing" />
					<AccountStep
						description="A required document is missing."
						marker={4}
						markerTestId="invalid-step-marker"
						status="invalid"
						title="Documents"
						value="documents"
					/>
					<AccountStep
						description="Unlocks after billing is complete."
						disabled
						marker={5}
						title="Finish"
						value="finish"
					/>
				</Stepper.List>
				<Stepper.Content>
					<Stepper.Panel value="account">Account details are complete.</Stepper.Panel>
					<Stepper.Panel value="review">
						Review the submitted profile before continuing.
					</Stepper.Panel>
					<Stepper.Panel value="billing">Billing is still incomplete.</Stepper.Panel>
					<Stepper.Panel value="documents">Upload the missing identity document.</Stepper.Panel>
					<Stepper.Panel value="finish">
						This step stays locked until billing is complete.
					</Stepper.Panel>
				</Stepper.Content>
			</Stepper.Root>
		</Stack>
	),
};

export const Controlled: Story = {
	parameters: { controls: { disable: true } },
	render: () => <ControlledStepper />,
};

function ControlledStepper() {
	const values = ["profile", "security", "billing"] as const;
	const [value, setValue] = useState<StepperValue>(values[0]);
	const [billingLocked, setBillingLocked] = useState(true);
	const index = values.findIndex((candidate) => candidate === value);
	const previous = values[index - 1];
	const next = values[index + 1];

	return (
		<Stepper.Root
			onValueChange={(nextValue) => {
				if (nextValue != null) {
					setValue(nextValue);
				}
			}}
			value={value}
		>
			<Stepper.List aria-label="Controlled account setup">
				<AccountStep
					description="Add your personal details."
					marker={1}
					status="completed"
					title="Profile"
					value="profile"
				/>
				<AccountStep
					description="Choose authentication options."
					marker={2}
					title="Security"
					value="security"
				/>
				<AccountStep
					description="Add a payment method."
					disabled={billingLocked}
					marker={3}
					title="Billing"
					value="billing"
				/>
			</Stepper.List>
			<AccountPanels />
			<Stack gap={2} mt={4} orientation="horizontal">
				<Button
					data-testid="stepper-back"
					disabled={previous == null}
					onClick={() => previous && setValue(previous)}
					variant="secondary"
				>
					Back
				</Button>
				<Button
					data-testid="stepper-continue"
					disabled={next == null || (next === "billing" && billingLocked)}
					onClick={() => next && setValue(next)}
				>
					Continue
				</Button>
				<Button
					data-testid="stepper-toggle-billing"
					onClick={() => setBillingLocked((locked) => !locked)}
					variant="ghost"
				>
					{billingLocked ? "Unlock billing" : "Lock billing"}
				</Button>
			</Stack>
		</Stepper.Root>
	);
}

function ExampleStepper({
	defaultValue = "profile",
	orientation = "horizontal",
}: {
	defaultValue?: StepperValue;
	orientation?: StepperOrientation;
}) {
	return (
		<Stepper.Root defaultValue={defaultValue} orientation={orientation}>
			<Stepper.List aria-label="Account setup progress">
				<AccountStep
					description="Add your personal details."
					marker={1}
					status="completed"
					title="Profile"
					value="profile"
				/>
				<AccountStep
					description="Choose authentication options."
					marker={<ShieldCheckIcon aria-hidden weight="duotone" />}
					title="Security"
					value="security"
				/>
				<AccountStep
					description="Add a payment method for the workspace."
					marker={3}
					title="Billing"
					value="billing"
				/>
			</Stepper.List>
			<AccountPanels />
		</Stepper.Root>
	);
}

function AccountStep({
	description,
	disabled,
	marker,
	markerTestId,
	status,
	title,
	value,
}: {
	description: string;
	disabled?: boolean;
	marker: ReactNode;
	markerTestId?: string;
	status?: StepperStatus;
	title: string;
	value: StepperValue;
}) {
	return (
		<Stepper.Step disabled={disabled} status={status} value={value}>
			<Stepper.Marker data-testid={markerTestId}>{marker}</Stepper.Marker>
			<Stepper.Heading>
				<Stepper.Title>{title}</Stepper.Title>
				<Stepper.Description>{description}</Stepper.Description>
			</Stepper.Heading>
		</Stepper.Step>
	);
}

function AccountPanels() {
	return (
		<Stepper.Content>
			<Stepper.Panel value="profile">
				Enter the name and contact details that should appear on the account.
			</Stepper.Panel>
			<Stepper.Panel value="security">
				Select a password and a second factor before continuing.
			</Stepper.Panel>
			<Stepper.Panel value="billing">Choose how this workspace will be billed.</Stepper.Panel>
		</Stepper.Content>
	);
}
