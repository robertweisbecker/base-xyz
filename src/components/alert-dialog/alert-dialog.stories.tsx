import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/components/button/button";
import { AlertDialog } from "./alert-dialog";
type StoryArgs = {
	defaultOpen: boolean;
	_triggerDisabled: boolean;
};

const meta = {
	title: "Components/Alert dialog",
	args: {
		defaultOpen: true,
		_triggerDisabled: false,
	},
	argTypes: {
		defaultOpen: { control: "boolean" },
		_triggerDisabled: { control: "boolean" },
	},
	parameters: {
		docs: {
			story: {
				height: "420px",
				inline: false,
			},
		},
	},
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<StoryArgs>;

export const Playground: Story = {
	render: ({ defaultOpen, _triggerDisabled }) => (
		<AlertDialog.Root key={`${defaultOpen}-${_triggerDisabled}`} defaultOpen={defaultOpen}>
			<AlertDialog.Trigger disabled={_triggerDisabled} render={<Button variant="error" />}>
				Discard draft
			</AlertDialog.Trigger>
			<AlertDialog.Popup>
				<AlertDialog.Header>
					<AlertDialog.Title>Discard this draft?</AlertDialog.Title>
					<AlertDialog.Description>Your unsaved changes will be permanently lost.</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Close render={<Button variant="neutral" />}>Keep editing</AlertDialog.Close>
					<AlertDialog.Close render={<Button variant="error" />}>Discard draft</AlertDialog.Close>
				</AlertDialog.Footer>
			</AlertDialog.Popup>
		</AlertDialog.Root>
	),
};

export const DetailedMessage: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<AlertDialog.Root>
			<AlertDialog.Trigger render={<Button variant="error" />}>Delete environment</AlertDialog.Trigger>
			<AlertDialog.Popup>
				<AlertDialog.Header>
					<AlertDialog.Title>Delete the staging environment?</AlertDialog.Title>
					<AlertDialog.Description>
						The environment, its variables, and its deployment history will be permanently removed. Production will
						remain available.
					</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Close render={<Button variant="neutral" />}>Cancel</AlertDialog.Close>
					<AlertDialog.Close render={<Button variant="error" />}>Delete environment</AlertDialog.Close>
				</AlertDialog.Footer>
			</AlertDialog.Popup>
		</AlertDialog.Root>
	),
};
