import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { useState } from "react";
import { Separator } from "@/components/separator/separator";
import { breakpoints } from "@/styles/constants.stylex";
import { color, space } from "@/styles/tokens.stylex";
import { fontSize, fontWeight, letterSpacing, lineHeight } from "@/styles/tokens.stylex";
import * as PasswordField from "./password-field";

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
		<div {...stylex.props(storyParts.list)}>
			<StorySection title="Sign in">
				<div {...stylex.props(storyParts.frame)}>
					<PasswordField.Root>
						<PasswordField.Label>Password</PasswordField.Label>
						<PasswordField.Control>
							<PasswordField.Input autoComplete="current-password" placeholder="Enter your password" />
							<PasswordField.Actions>
								<PasswordField.VisibilityToggle />
							</PasswordField.Actions>
						</PasswordField.Control>
						<PasswordField.Description>Enter the password for your account.</PasswordField.Description>
					</PasswordField.Root>
				</div>
			</StorySection>

			<Separator />

			<StorySection title="Password strength">
				<div {...stylex.props(storyParts.frame)}>
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
				</div>
			</StorySection>

			<Separator />

			<StorySection title="Controlled value and visibility">
				<ControlledExample />
			</StorySection>

			<Separator />

			<StorySection title="States">
				<div {...stylex.props(storyParts.grid)}>
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
				</div>
			</StorySection>
		</div>
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
			disabled={inputProps.disabled}>
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
		<div {...stylex.props(storyParts.frame)}>
			<PasswordField.Root value={value} onValueChange={setValue} visible={visible} onVisibleChange={setVisible}>
				<PasswordField.Label>API password</PasswordField.Label>
				<PasswordField.Control>
					<PasswordField.Input />
					<PasswordField.Actions>
						<PasswordField.VisibilityToggle />
					</PasswordField.Actions>
				</PasswordField.Control>
				<PasswordField.Description>The value and visibility state are controlled by the caller.</PasswordField.Description>
			</PasswordField.Root>
		</div>
	);
}

function StorySection({ children, title }: { children: React.ReactNode; title: string }) {
	return (
		<section {...stylex.props(storyParts.section)}>
			<h2 {...stylex.props(storyParts.heading)}>{title}</h2>
			{children}
		</section>
	);
}

function State({ children, title }: { children: React.ReactNode; title: string }) {
	return (
		<section {...stylex.props(storyParts.state)}>
			<h3 {...stylex.props(storyParts.subheading)}>{title}</h3>
			{children}
		</section>
	);
}

const storyParts = stylex.create({
	list: {
		gap: space[8],
		display: "flex",
		flexDirection: "column",
	},
	section: {
		gap: space[3],
		display: "flex",
		flexDirection: "column",
	},
	frame: {
		maxWidth: "32rem",
	},
	grid: {
		gap: space[8],
		display: "grid",
		gridTemplateColumns: {
			default: "1fr",
			[breakpoints.md]: "repeat(2, minmax(0, 1fr))",
		},
		maxWidth: "56rem",
	},
	state: {
		gap: space[3],
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
	subheading: {
		margin: 0,
		color: color.fgMuted,
		fontSize: fontSize.x1,
		fontWeight: fontWeight.regular,
		letterSpacing: letterSpacing.x1,
		lineHeight: lineHeight.x1,
	},
});
