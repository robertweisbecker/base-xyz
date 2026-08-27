import { ShieldCheckIcon } from "@phosphor-icons/react/dist/csr/ShieldCheck";
import { UserIcon } from "@phosphor-icons/react/dist/csr/User";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/button/button";
import { Box, Stack } from "@/components/layout/layout";
import { Separator } from "@/components/separator/separator";
import { Text } from "@/components/text/text";
import { TextField } from "@/components/text-field/text-field";
import { Stepper, type StepperOrientation, type StepperStatus } from "./stepper";

const iconOptions = {
	None: undefined,
	Profile: <UserIcon aria-hidden weight="duotone" />,
	Security: <ShieldCheckIcon aria-hidden weight="duotone" />,
};

type StepperPlaygroundArgs = {
	_locked: boolean;
	_marker: ReactNode;
	_status: StepperStatus;
	defaultValue: string;
	orientation: StepperOrientation;
};

const meta = {
	title: "Components/Stepper",
	component: Stepper.Root,
	args: {
		_locked: false,
		_marker: undefined,
		_status: "incomplete",
		defaultValue: "profile",
		orientation: "horizontal",
	},
	argTypes: {
		_locked: { control: "boolean", name: "_locked" },
		_marker: {
			control: "select",
			mapping: iconOptions,
			name: "_marker",
			options: Object.keys(iconOptions),
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
			orientation={args.orientation}>
			<Stepper.List aria-label="Account setup progress">
				<AccountStep
					description="Add your personal details."
					marker={args.defaultValue === "profile" ? args._marker : undefined}
					status={args.defaultValue === "profile" ? args._status : "completed"}
					title="Profile"
					value="profile"
				/>
				<AccountStep
					description="Choose authentication options."
					disabled={args._locked && args.defaultValue === "security"}
					marker={args._marker}
					status={args.defaultValue === "security" ? args._status : "incomplete"}
					title="Security"
					value="security"
				/>
				<AccountStep
					description="Add a payment method."
					disabled={args._locked}
					marker={args.defaultValue === "billing" ? args._marker : undefined}
					status={args.defaultValue === "billing" ? args._status : "incomplete"}
					title="Billing"
					value="billing"
				/>
			</Stepper.List>
			<Stepper.Content>
				<AccountPanel value="profile">
					Enter the name and contact details that should appear on the account.
				</AccountPanel>
				<AccountPanel value="security">
					Select a password and a second factor before continuing.
				</AccountPanel>
				<AccountPanel value="billing">
					Choose how this workspace will be billed.
				</AccountPanel>
				<StepperPager />
			</Stepper.Content>
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
				<ExampleStepper defaultValue="profile" />
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
					<AccountStep description="Saved contact details." status="completed" title="Account" value="account" />
					<AccountStep description="Confirm the submitted information." title="Review" value="review" />
					<AccountStep description="Not started yet." title="Billing" value="billing" />
					<AccountStep
						description="A required document is missing."
						status="invalid"
						title="Documents"
						value="documents"
					/>
					<AccountStep description="Unlocks after billing is complete." disabled title="Finish" value="finish" />
				</Stepper.List>
				<Stepper.Content>
					<AccountPanel value="account">Account details are complete.</AccountPanel>
					<AccountPanel value="review">Review the submitted profile before continuing.</AccountPanel>
					<AccountPanel value="billing">Billing is still incomplete.</AccountPanel>
					<AccountPanel value="documents">Upload the missing identity document.</AccountPanel>
					<AccountPanel value="finish">This step stays locked until billing is complete.</AccountPanel>
					<StepperPager />
				</Stepper.Content>
			</Stepper.Root>
		</Stack>
	),
};

export const Navigation: Story = {
	parameters: { controls: { disable: true } },
	render: () => <NavigationExamples />,
};

function NavigationExamples() {
	return (
		<Stack gap={8}>
			<Stack data-testid="pager-stepper" gap={2} minWidth={0}>
				<Text color="muted" size="1">
					Previous and next
				</Text>
				<ExampleStepper defaultValue="profile" />
			</Stack>
			<Separator />
			<Stack data-testid="mounted-panel-stepper" gap={2} minWidth={0}>
				<Text color="muted" size="1">
					Mounted and unmounted panels
				</Text>
				<MountedPanelStepper />
			</Stack>
			<Separator />
			<Stack data-testid="cancel-stepper" gap={2} minWidth={0}>
				<Text color="muted" size="1">
					Cancelable navigation
				</Text>
				<CancelableStepper />
			</Stack>
			<Separator />
			<Stack data-testid="domain-stepper" gap={2} minWidth={0}>
				<Text color="muted" size="1">
					Disabled current step and removed current step
				</Text>
				<DomainStepper />
			</Stack>
		</Stack>
	);
}

function ExampleStepper({
	defaultValue = "profile",
	orientation = "horizontal",
}: {
	defaultValue?: string;
	orientation?: StepperOrientation;
}) {
	return (
		<Stepper.Root defaultValue={defaultValue} orientation={orientation}>
			<Stepper.List aria-label="Account setup progress">
				<AccountStep description="Add your personal details." title="Profile" value="profile" />
				<AccountStep description="Choose authentication options." title="Security" value="security" />
				<AccountStep description="Add a payment method for the workspace." title="Billing" value="billing" />
			</Stepper.List>
			<Stepper.Content>
				<AccountPanel value="profile">
					<Stack gap={3}>
						<Text>
							Use the legal name and email that should appear on invoices. Vertical examples keep this copy long enough
							to show the panel sitting beside the step rail.
						</Text>
						<Text>
							The workspace can invite teammates after this step, but the account owner should be complete first.
						</Text>
					</Stack>
				</AccountPanel>
				<AccountPanel value="security">
					<Stack gap={3}>
						<Text>Choose a password and a second factor. Recovery codes are shown after authentication is saved.</Text>
						<Text>A locked later step cannot be opened until the consumer unlocks it.</Text>
					</Stack>
				</AccountPanel>
				<AccountPanel value="billing">
					<Stack gap={3}>
						<Text>Add a card or invoice contact. This is the last adjacent step, so Next stays disabled here.</Text>
						<Text>Billing details stay local to this panel.</Text>
					</Stack>
				</AccountPanel>
				<StepperPager />
			</Stepper.Content>
		</Stepper.Root>
	);
}

function MountedPanelStepper() {
	return (
		<Stepper.Root defaultValue="kept">
			<Stepper.List aria-label="Panel mounting">
				<AccountStep description="Keeps typed values after you leave." title="Kept" value="kept" />
				<AccountStep description="Unmounts when inactive." title="Resetting" value="resetting" />
			</Stepper.List>
			<Stepper.Content>
				<AccountPanel value="kept">
					<TextField label="Display name" />
				</AccountPanel>
				<Stepper.Panel keepMounted={false} value="resetting">
					<TextField label="Temporary note" />
				</Stepper.Panel>
				<StepperPager />
			</Stepper.Content>
		</Stepper.Root>
	);
}

function CancelableStepper() {
	const [value, setValue] = useState("profile");
	const [blocked, setBlocked] = useState(false);
	const [ignored, setIgnored] = useState(false);

	return (
		<Stack gap={3}>
			<Stack orientation="horizontal" gap={2}>
				<Button
					aria-pressed={blocked}
					onClick={() => setBlocked((current) => !current)}
					variant={blocked ? "primary" : "secondary"}>
					{blocked ? "Allow navigation" : "Block navigation"}
				</Button>
				<Button
					aria-pressed={ignored}
					onClick={() => setIgnored((current) => !current)}
					variant={ignored ? "primary" : "secondary"}>
					{ignored ? "Accept navigation" : "Ignore navigation"}
				</Button>
			</Stack>
			<Stepper.Root
				onValueChange={(nextValue, details) => {
					if (blocked) {
						details.cancel();
						return;
					}
					if (ignored) {
						return;
					}
					setValue(nextValue);
				}}
				value={value}>
				<Stepper.List aria-label="Cancelable account setup">
					<AccountStep description="Add your personal details." title="Profile" value="profile" />
					<AccountStep description="Choose authentication options." title="Security" value="security" />
					<AccountStep description="Add a payment method." title="Billing" value="billing" />
				</Stepper.List>
				<Stepper.Content>
					<AccountPanel value="profile">
						Profile stays selected when navigation is blocked.
					</AccountPanel>
					<AccountPanel value="security">
						Security is only reached when navigation is allowed.
					</AccountPanel>
					<AccountPanel value="billing">
						Billing is the last step.
					</AccountPanel>
					<StepperPager />
				</Stepper.Content>
			</Stepper.Root>
		</Stack>
	);
}

function DomainStepper() {
	const [currentDisabled, setCurrentDisabled] = useState(false);
	const [includeReview, setIncludeReview] = useState(true);
	const [lastChange, setLastChange] = useState("none");
	const [reversed, setReversed] = useState(false);
	const steps = reversed
		? (["billing", "review", "profile"] as const)
		: (["profile", "review", "billing"] as const);

	return (
		<Stack gap={3}>
			<Stack orientation="horizontal" gap={2}>
				<Button onClick={() => setCurrentDisabled((current) => !current)} variant="secondary">
					{currentDisabled ? "Enable current step" : "Disable current step"}
				</Button>
				<Button onClick={() => setIncludeReview(false)} variant="secondary">
					Remove current step
				</Button>
				<Button onClick={() => setReversed((current) => !current)} variant="secondary">
					Reverse step order
				</Button>
			</Stack>
			<Text color="muted" data-testid="domain-last-change" size="1">
				Last change: {lastChange}
			</Text>
			<Stepper.Root
				defaultValue="review"
				onValueChange={(nextValue) => {
					setLastChange(nextValue);
				}}>
				<Stepper.List aria-label="Domain fallback">
					{steps.map((value) => {
						if (value === "review" && !includeReview) {
							return null;
						}
						if (value === "profile") {
							return (
								<AccountStep
									key="profile"
									description="Already saved."
									status="completed"
									title="Profile"
									value="profile"
								/>
							);
						}
						if (value === "review") {
							return (
								<AccountStep
									key="review"
									description="Confirm the submitted information."
									disabled={currentDisabled}
									title="Review"
									value="review"
								/>
							);
						}
						return (
							<AccountStep key="billing" description="Add a payment method." title="Billing" value="billing" />
						);
					})}
				</Stepper.List>
				<Stepper.Content>
					<AccountPanel value="profile">
						Profile remains available as the silent fallback.
					</AccountPanel>
					{includeReview ? (
						<AccountPanel value="review">
							Review stays selected when it becomes disabled.
						</AccountPanel>
					) : null}
					<AccountPanel value="billing">
						Billing is the last remaining adjacent step.
					</AccountPanel>
					<StepperPager />
				</Stepper.Content>
			</Stepper.Root>
		</Stack>
	);
}

function AccountStep({
	description,
	disabled,
	marker,
	status,
	title,
	value,
}: {
	description: string;
	disabled?: boolean;
	marker?: ReactNode;
	status?: StepperStatus;
	title: string;
	value: string;
}) {
	return (
		<Stepper.Step disabled={disabled} status={status} value={value}>
			<Stepper.Marker>{marker}</Stepper.Marker>
			<Stepper.Heading>
				<Stepper.Title>{title}</Stepper.Title>
				<Stepper.Description>{description}</Stepper.Description>
			</Stepper.Heading>
		</Stepper.Step>
	);
}

function AccountPanel({
	children,
	value,
}: {
	children: ReactNode;
	value: string;
}) {
	return (
		<Stepper.Panel value={value}>
			{typeof children === "string" ? <Text>{children}</Text> : children}
		</Stepper.Panel>
	);
}

function StepperPager() {
	return (
		<Stack gap={2} mt={4} orientation="horizontal">
			<Stepper.Previous>Back</Stepper.Previous>
			<Stepper.Next>Continue</Stepper.Next>
		</Stack>
	);
}
