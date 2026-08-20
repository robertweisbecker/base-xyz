import { PaperPlaneTiltIcon } from "@phosphor-icons/react/dist/csr/PaperPlaneTilt";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { StrictMode, useState, type ComponentProps, type ReactElement } from "react";
import { Button, Checkbox, Separator } from "@/components";
import { Stack } from "@/components/layout/layout";
import { Text } from "@/components/text/text";

import { ConfirmationDialog, type ConfirmationDialogSuccessToast } from "./confirmation-dialog";

const meta = {
	title: "Blocks/Confirmation dialog",
	component: ConfirmationDialog.Root,
	parameters: {
		controls: { disable: true },
	},
} satisfies Meta<typeof ConfirmationDialog.Root>;

export default meta;
type Story = StoryObj;

const reviewItems = Array.from({ length: 28 }, (_, index) => ({
	label: `Milestone ${index + 1}`,
	status: index < 23 ? "Complete" : "Pending",
}));

export const Examples: Story = {
	render: () => (
		<Stack gap={8}>
			<Example title="Default">
				<ConfirmationDialog.Root
					trigger={<Button>Publish project</Button>}
					successToast={{
						title: "Project published",
						description: "The project is now available to everyone with access.",
					}}>
					<ConfirmationDialog.Header>
						<ConfirmationDialog.Title>Publish this project?</ConfirmationDialog.Title>
						<ConfirmationDialog.Description>
							Anyone with project access will be able to view the latest changes.
						</ConfirmationDialog.Description>
					</ConfirmationDialog.Header>
					<ConfirmationDialog.Body>
						Publishing makes the current version available immediately. You can continue editing and publish another
						version later.
					</ConfirmationDialog.Body>
					<ConfirmationDialog.Footer>
						<ConfirmationDialog.Actions>
							<ConfirmationDialog.Cancel>Cancel</ConfirmationDialog.Cancel>
							<ConfirmationDialog.Confirm>Publish</ConfirmationDialog.Confirm>
						</ConfirmationDialog.Actions>
					</ConfirmationDialog.Footer>
				</ConfirmationDialog.Root>
			</Example>

			<Separator />

			<Example title="With visual">
				<ConfirmationDialog.Root
					size="sm"
					trigger={<Button>Submit for review</Button>}
					successToast={{
						title: "App submitted",
						description: "The review team has been notified.",
					}}>
					<ConfirmationDialog.Header>
						<ConfirmationDialog.Visual>
							<PaperPlaneTiltIcon aria-hidden size={18} weight="duotone" />
						</ConfirmationDialog.Visual>
						<ConfirmationDialog.Title>Submit app for review?</ConfirmationDialog.Title>
						<ConfirmationDialog.Description>
							The review team will be notified and can leave feedback on this version.
						</ConfirmationDialog.Description>
					</ConfirmationDialog.Header>
					<ConfirmationDialog.Body>
						You can continue working on a new draft while this version is under review.
					</ConfirmationDialog.Body>
					<ConfirmationDialog.Footer>
						<ConfirmationDialog.Actions>
							<ConfirmationDialog.Cancel>Cancel</ConfirmationDialog.Cancel>
							<ConfirmationDialog.Confirm>Submit</ConfirmationDialog.Confirm>
						</ConfirmationDialog.Actions>
					</ConfirmationDialog.Footer>
				</ConfirmationDialog.Root>
			</Example>

			<Separator />

			<Example title="With footer option">
				<ConfirmationDialog.Root
					trigger={<Button>Archive project</Button>}
					successToast={{
						title: "Project archived",
						description: "You can restore it from the archive.",
					}}>
					<ConfirmationDialog.Header>
						<ConfirmationDialog.Title>Archive this project?</ConfirmationDialog.Title>
						<ConfirmationDialog.Description>
							Archived projects are hidden from the active workspace.
						</ConfirmationDialog.Description>
					</ConfirmationDialog.Header>
					<ConfirmationDialog.Body>
						The project will remain available to workspace administrators from the archive.
					</ConfirmationDialog.Body>
					<ConfirmationDialog.Footer>
						<Checkbox label="Do not ask again" name="skip-archive-confirmation" />
						<ConfirmationDialog.Actions>
							<ConfirmationDialog.Cancel>Cancel</ConfirmationDialog.Cancel>
							<ConfirmationDialog.Confirm>Archive</ConfirmationDialog.Confirm>
						</ConfirmationDialog.Actions>
					</ConfirmationDialog.Footer>
				</ConfirmationDialog.Root>
			</Example>

			<Separator />

			<Example title="Long content">
				<ConfirmationDialog.Root
					size="lg"
					trigger={<Button>Complete project</Button>}
					successToast={{
						title: "Project completed",
						description: "The project and its milestones are now read-only.",
					}}>
					<ConfirmationDialog.Header>
						<ConfirmationDialog.Title>Complete this project?</ConfirmationDialog.Title>
						<ConfirmationDialog.Description>
							Review the milestone status before making the project read-only.
						</ConfirmationDialog.Description>
					</ConfirmationDialog.Header>
					<ConfirmationDialog.Body label="Project milestone status">
						<Stack gap={3}>
							{reviewItems.map((item) => (
								<Stack key={item.label} align="center" gap={4} justify="space-between" orientation="horizontal">
									<Text size="2" fontWeight="medium">
										{item.label}
									</Text>
									<Text size="1" color="muted">
										{item.status}
									</Text>
								</Stack>
							))}
						</Stack>
					</ConfirmationDialog.Body>
					<ConfirmationDialog.Footer>
						<ConfirmationDialog.Actions>
							<ConfirmationDialog.Cancel>Cancel</ConfirmationDialog.Cancel>
							<ConfirmationDialog.Confirm>Complete project</ConfirmationDialog.Confirm>
						</ConfirmationDialog.Actions>
					</ConfirmationDialog.Footer>
				</ConfirmationDialog.Root>
			</Example>
		</Stack>
	),
};

export const AsyncSettlement: Story = {
	render: () => (
		<StrictMode>
			<AsyncSettlementFixture />
		</StrictMode>
	),
};

function AsyncSettlementFixture() {
	const [operationCount, setOperationCount] = useState(0);
	const [errorCount, setErrorCount] = useState(0);

	async function resolveAsyncAction() {
		setOperationCount((count) => count + 1);
		await settleAfterDelay();
	}

	async function rejectAsyncAction() {
		await settleAfterDelay();
		throw new Error("Async action failed");
	}

	return (
		<Stack gap={3}>
			<Text data-testid="confirmation-operation-count">{operationCount}</Text>
			<Text data-testid="confirmation-error-count">{errorCount}</Text>
			<AsyncSettlementDialog
				trigger={<Button>Resolve async action</Button>}
				confirmLabel="Confirm resolve async action"
				onConfirm={resolveAsyncAction}
				successToast={{ title: "Async action completed" }}
			/>
			<AsyncSettlementDialog
				trigger={<Button>Reject async action</Button>}
				confirmLabel="Confirm reject async action"
				onConfirm={rejectAsyncAction}
				onConfirmError={() => setErrorCount((count) => count + 1)}
				successToast={{ title: "Unexpected success" }}
				failureToast={{ title: "Async action failed" }}
			/>
			<AsyncSettlementDialog
				trigger={<Button>Prevent confirmation</Button>}
				confirmLabel="Prevent confirmation"
				onConfirmClick={(event) => event.preventDefault()}
				successToast={{ title: "Prevented action completed" }}
			/>
		</Stack>
	);
}

function AsyncSettlementDialog({
	confirmLabel,
	failureToast,
	onConfirm,
	onConfirmClick,
	onConfirmError,
	successToast,
	trigger,
}: {
	confirmLabel: string;
	failureToast?: ConfirmationDialogSuccessToast | false;
	onConfirm?: () => void | Promise<void>;
	onConfirmClick?: ComponentProps<typeof ConfirmationDialog.Confirm>["onClick"];
	onConfirmError?: (error: unknown) => void;
	successToast?: ConfirmationDialogSuccessToast | false;
	trigger: ReactElement;
}) {
	return (
		<ConfirmationDialog.Root
			trigger={trigger}
			onConfirm={onConfirm}
			onConfirmError={onConfirmError}
			successToast={successToast}
			failureToast={failureToast}>
			<ConfirmationDialog.Header>
				<ConfirmationDialog.Title>Confirm async action?</ConfirmationDialog.Title>
				<ConfirmationDialog.Description>The operation will settle before this dialog closes.</ConfirmationDialog.Description>
			</ConfirmationDialog.Header>
			<ConfirmationDialog.Body>Review the operation before confirming it.</ConfirmationDialog.Body>
			<ConfirmationDialog.Footer>
				<ConfirmationDialog.Actions>
					<ConfirmationDialog.Cancel>Cancel</ConfirmationDialog.Cancel>
					<ConfirmationDialog.Confirm onClick={onConfirmClick}>{confirmLabel}</ConfirmationDialog.Confirm>
				</ConfirmationDialog.Actions>
			</ConfirmationDialog.Footer>
		</ConfirmationDialog.Root>
	);
}

function settleAfterDelay() {
	return new Promise<void>((resolve) => {
		setTimeout(resolve, 500);
	});
}

function Example({ children, title }: { children: React.ReactNode; title: string }) {
	return (
		<Stack align="start" gap={3}>
			<Text size="1" color="muted">
				{title}
			</Text>
			{children}
		</Stack>
	);
}
