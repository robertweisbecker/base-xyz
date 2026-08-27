import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { useState } from "react";
import { Separator } from "@/components";
import { Box, Grid, Stack } from "@/components/layout/layout";
import { Text } from "@/components/text/text";
import { breakpoints } from "@/styles/constants.stylex";

import { PasswordField } from "./password-field";

const passwordRequirements = [/.{8,}/, /[0-9]/, /[a-z]/, /[A-Z]/] as const;

const meta = {
	title: "Blocks/Password field",
	component: PasswordField.Root,
	parameters: {
		controls: { disable: true },
	},
} satisfies Meta<typeof PasswordField.Root>;

export default meta;
type Story = StoryObj;

export const Examples: Story = {
	render: () => (
		<Stack gap={8}>
			<StorySection title="Sign in">
				<Box maxWidth="32rem">
					<PasswordField.Root>
						<PasswordField.Label>Password</PasswordField.Label>
						<PasswordField.Control>
							<PasswordField.Input
								autoComplete="current-password"
								placeholder="Enter your password"
							/>
							<PasswordField.Actions>
								<PasswordField.VisibilityToggle />
							</PasswordField.Actions>
						</PasswordField.Control>
						<PasswordField.Description>
							Enter the password for your account.
						</PasswordField.Description>
					</PasswordField.Root>
				</Box>
			</StorySection>

			<Separator />

			<StorySection title="Password strength">
				<Box maxWidth="32rem">
					<PasswordField.Root defaultValue="Password">
						<PasswordField.Label>Create a password</PasswordField.Label>
						<PasswordField.Control>
							<PasswordField.Input autoComplete="new-password" placeholder="Enter a password" />
							<PasswordField.Actions>
								<PasswordField.VisibilityToggle />
							</PasswordField.Actions>
						</PasswordField.Control>
						<PasswordField.Description>
							Min. 8 characters with at least one of each: uppercase, lowercase, number.
						</PasswordField.Description>
						<PasswordField.Meter requirements={passwordRequirements} />
					</PasswordField.Root>
				</Box>
			</StorySection>

			<Separator />

			<StorySection title="Controlled value and visibility">
				<ControlledExample />
			</StorySection>

			<Separator />

			<StorySection title="States">
				<Grid gap={8} maxWidth="56rem" xstyle={storyParts.statesGrid}>
					<State title="Empty">
						<PasswordExample label="Password" placeholder="Enter your password" />
					</State>
					<State title="Filled">
						<PasswordExample label="Password" defaultValue="password123" />
					</State>
					<State title="Required">
						<PasswordExample
							label="Account password"
							description="Required to continue."
							placeholder="Enter your password"
							required
						/>
					</State>
					<State title="Read-only">
						<PasswordExample label="Generated password" defaultValue="secure-pass-4821" readOnly />
					</State>
					<State title="Visible">
						<PasswordExample label="Password" defaultValue="password123" defaultVisible />
					</State>
					<State title="Disabled">
						<PasswordExample label="Password" defaultValue="password123" disabled />
					</State>
					<State title="Invalid">
						<PasswordField.Root defaultValue="short" invalid>
							<PasswordField.Label>New password</PasswordField.Label>
							<PasswordField.Control>
								<PasswordField.Input autoComplete="new-password" />
								<PasswordField.Actions>
									<PasswordField.VisibilityToggle />
								</PasswordField.Actions>
							</PasswordField.Control>
							<PasswordField.Error>Use at least eight characters.</PasswordField.Error>
						</PasswordField.Root>
					</State>
				</Grid>
			</StorySection>
		</Stack>
	),
};

function PasswordExample({
	label,
	...inputProps
}: {
	label: string;
	defaultValue?: string;
	defaultVisible?: boolean;
	description?: string;
	disabled?: boolean;
	placeholder?: string;
	readOnly?: boolean;
	required?: boolean;
}) {
	return (
		<PasswordField.Root
			defaultValue={inputProps.defaultValue}
			defaultVisible={inputProps.defaultVisible}
			disabled={inputProps.disabled}
		>
			<PasswordField.Label>{label}</PasswordField.Label>
			<PasswordField.Control>
				<PasswordField.Input
					disabled={inputProps.disabled}
					placeholder={inputProps.placeholder}
					readOnly={inputProps.readOnly}
					required={inputProps.required}
				/>
				<PasswordField.Actions>
					<PasswordField.VisibilityToggle disabled={inputProps.disabled} />
				</PasswordField.Actions>
			</PasswordField.Control>
			{inputProps.description ? (
				<PasswordField.Description>{inputProps.description}</PasswordField.Description>
			) : null}
		</PasswordField.Root>
	);
}

function ControlledExample() {
	const [value, setValue] = useState("correct horse battery staple");
	const [visible, setVisible] = useState(false);

	return (
		<Box maxWidth="32rem">
			<PasswordField.Root
				value={value}
				onValueChange={setValue}
				visible={visible}
				onVisibleChange={setVisible}
			>
				<PasswordField.Label>API password</PasswordField.Label>
				<PasswordField.Control>
					<PasswordField.Input />
					<PasswordField.Actions>
						<PasswordField.VisibilityToggle />
					</PasswordField.Actions>
				</PasswordField.Control>
				<PasswordField.Description>
					The value and visibility state are controlled by the caller.
				</PasswordField.Description>
			</PasswordField.Root>
		</Box>
	);
}

function StorySection({ children, title }: { children: React.ReactNode; title: string }) {
	return (
		<Stack gap={3}>
			<Text size="1" color="muted">
				{title}
			</Text>
			{children}
		</Stack>
	);
}

function State({ children, title }: { children: React.ReactNode; title: string }) {
	return (
		<Stack gap={3}>
			<Text size="1" color="muted">
				{title}
			</Text>
			{children}
		</Stack>
	);
}

const storyParts = stylex.create({
	statesGrid: {
		gridTemplateColumns: {
			default: "1fr",
			[breakpoints.md]: "repeat(2, minmax(0, 1fr))",
		},
	},
});
