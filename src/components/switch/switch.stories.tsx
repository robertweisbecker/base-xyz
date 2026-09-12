import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { useRef, useState } from "react";
import { Button, Field, Form, Label } from "@/components";
import { Box, Stack } from "@/components/layout/layout";
import { Text } from "@/components/text/text";
import { Switch, type SwitchProps } from "./switch";

type SwitchStoryArgs = SwitchProps & {
	_label: string;
	_description: string;
	_invalid: boolean;
};

const meta = {
	title: "Components/Switch",
	component: Switch,
	args: {
		_label: "Weekly summary",
		_description: "Receive a short digest every Friday.",
		_invalid: false,
		defaultChecked: true,
		disabled: false,
		readOnly: false,
		required: false,
		size: "md",
	},
	argTypes: {
		"aria-invalid": { control: "boolean" },
		_label: { control: "text" },
		_description: { control: "text" },
		_invalid: { control: "boolean" },
		defaultChecked: { control: "boolean" },
		disabled: { control: "boolean" },
		readOnly: { control: "boolean" },
		required: { control: "boolean" },
		size: { control: "inline-radio", options: ["sm", "md", "lg"] },
	},
	parameters: {
		controls: {
			include: [
				"_label",
				"_description",
				"_invalid",
				"aria-invalid",
				"defaultChecked",
				"disabled",
				"readOnly",
				"required",
				"size",
			],
		},
	},
	decorators: [
		(Story) => (
			<Box xstyle={styles.frame}>
				<Story />
			</Box>
		),
	],
} satisfies Meta<SwitchStoryArgs>;

export default meta;
type Story = StoryObj<SwitchStoryArgs>;

export const Playground: Story = {
	render: ({ _label, _description, _invalid, disabled, ...args }) => (
		<Field.Root disabled={disabled} invalid={_invalid}>
			<Stack orientation="horizontal" align="center" justify="space-between" gap={4}>
				<Stack gap={1}>
					<Label variant="item">{_label}</Label>
					{_description && <Field.Description>{_description}</Field.Description>}
				</Stack>
				<Switch key={String(args.defaultChecked)} {...args} />
			</Stack>
		</Field.Root>
	),
};

export const Sizes: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<Stack gap={4}>
			<Field.Root>
				<Stack orientation="horizontal" align="center" justify="space-between" gap={2}>
					<Label variant="item">Small</Label>
					<Switch size="sm" defaultChecked />
				</Stack>
			</Field.Root>
			<Field.Root>
				<Stack orientation="horizontal" align="center" justify="space-between" gap={2}>
					<Label variant="item">Medium</Label>
					<Switch size="md" defaultChecked />
				</Stack>
			</Field.Root>
			<Field.Root>
				<Stack orientation="horizontal" align="center" justify="space-between" gap={2}>
					<Label variant="item">Large</Label>
					<Switch size="lg" defaultChecked />
				</Stack>
			</Field.Root>
		</Stack>
	),
};

export const States: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<Stack gap={8}>
			<Stack gap={4}>
				<Text color="muted" size="1">
					Selection
				</Text>
				<Field.Root>
					<Stack orientation="horizontal" align="center" justify="space-between" gap={2}>
						<Label variant="item">Off</Label>
						<Switch />
					</Stack>
				</Field.Root>
				<Field.Root>
					<Stack orientation="horizontal" align="center" justify="space-between" gap={2}>
						<Label variant="item">On</Label>
						<Switch defaultChecked />
					</Stack>
				</Field.Root>
			</Stack>
			<Stack gap={4}>
				<Text color="muted" size="1">
					Interaction
				</Text>
				<Field.Root disabled>
					<Stack orientation="horizontal" align="center" justify="space-between" gap={2}>
						<Label variant="item">Disabled</Label>
						<Switch />
					</Stack>
				</Field.Root>
				<Field.Root>
					<Stack orientation="horizontal" align="center" justify="space-between" gap={2}>
						<Label variant="item">Read-only</Label>
						<Switch defaultChecked readOnly />
					</Stack>
				</Field.Root>
				<Field.Root>
					<Stack orientation="horizontal" align="center" justify="space-between" gap={2}>
						<Label variant="item">Required</Label>
						<Switch required />
					</Stack>
				</Field.Root>
			</Stack>
		</Stack>
	),
};

export const Standalone: Story = {
	parameters: { controls: { disable: true } },
	render: () => <StandaloneUpdates />,
};

function StandaloneUpdates() {
	const [submitted, setSubmitted] = useState("");
	return (
		<form
			onSubmit={(event) => {
				event.preventDefault();
				setSubmitted(String(new FormData(event.currentTarget).get("updates")));
			}}
		>
			<Stack gap={3}>
				<Switch
					aria-label="Toggle live updates"
					name="updates"
					value="enabled"
					uncheckedValue="off"
				/>
				<Switch aria-label="Read-only updates" defaultChecked readOnly />
				<Button type="submit">Submit updates</Button>
				<output aria-label="Submitted updates">{submitted}</output>
			</Stack>
		</form>
	);
}

export const Controlled: Story = {
	parameters: { controls: { disable: true } },
	render: () => <ControlledAlerts />,
};

function ControlledAlerts() {
	const [checked, setChecked] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const switchRef = useRef<HTMLElement>(null);
	return (
		<Form<{ alerts: boolean }> onFormSubmit={(values) => setSubmitted(values.alerts)}>
			<Stack gap={3}>
				<Field.Root name="alerts">
					<Stack orientation="horizontal" align="center" justify="space-between" gap={4}>
						<Stack gap={1}>
							<Label variant="item">Security alerts</Label>
							<Field.Description>
								Receive urgent notifications about your account.
							</Field.Description>
						</Stack>
						<Switch
							ref={switchRef}
							checked={checked}
							onCheckedChange={setChecked}
							value="enabled"
							required
						/>
					</Stack>
					<Field.Error />
				</Field.Root>
				<Stack orientation="horizontal" gap={2}>
					<Button type="submit">Save alerts</Button>
					<Button type="button" variant="secondary" onClick={() => setChecked(false)}>
						Disable alerts
					</Button>
					<Button type="button" variant="secondary" onClick={() => switchRef.current?.focus()}>
						Focus alerts
					</Button>
				</Stack>
				<output aria-label="Alerts submitted">{String(submitted)}</output>
			</Stack>
		</Form>
	);
}

const styles = stylex.create({
	frame: { maxWidth: "420px" },
});
