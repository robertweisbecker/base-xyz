import { GitForkIcon } from "@phosphor-icons/react/dist/csr/GitFork";
import { LockIcon } from "@phosphor-icons/react/dist/csr/Lock";
import { RocketLaunchIcon } from "@phosphor-icons/react/dist/csr/RocketLaunch";
import { ConfirmationDialog, CopyButton, PageHeader, PasswordField, WorkflowProgress } from "@/blocks";
import { Badge, Box, Button, Icon, Stack, Tabs, Text } from "@/components";
import { tokens } from "@/theme/tokens.stylex";
import { ExperimentPage, ExperimentSection } from "./experiment-page";

const passwordRequirements = [/.{12,}/, /[0-9]/, /[a-z]/, /[A-Z]/] as const;

export function UtilitiesPage() {
	return (
		<ExperimentPage description="Reusable component compositions" title="Utilities">
			<ExperimentSection title="Copy Button">
				<Stack gap={4}>
					<Stack gap={1}>
						<Text fontWeight="medium" size="2">
							Checkout accessibility review
						</Text>
						<Text color="muted" size="1">
							Ready · Updated 4 minutes ago
						</Text>
					</Stack>
					<Stack align="center" gap={3} orientation="horizontal" wrap="wrap">
						<CopyButton value="https://checkout-a11y.example.com" variant="secondary">
							Copy preview URL
						</CopyButton>
						<CopyButton tooltip="Copy deployment ID" value="dep_4yf72" variant="neutral" />
					</Stack>
				</Stack>
			</ExperimentSection>

			<ExperimentSection description="InputGroup composed with Meter and Toggle." title="Password Field">
				<Stack maxWidth="32rem">
					<PasswordField.Root defaultValue="ReviewAccess7">
						<PasswordField.Label>Create a service password</PasswordField.Label>
						<PasswordField.Control>
							<PasswordField.Input autoComplete="new-password" />
							<PasswordField.Actions>
								<PasswordField.VisibilityToggle />
							</PasswordField.Actions>
						</PasswordField.Control>
						<PasswordField.Description>
							Use at least 12 characters with uppercase, lowercase, and a number.
						</PasswordField.Description>
						<PasswordField.Meter requirements={passwordRequirements} />
					</PasswordField.Root>
				</Stack>
			</ExperimentSection>

			<ExperimentSection
				description="Compose identity, metadata, actions, and supporting copy without rebuilding page chrome."
				title="PageHeader">
				<PageHeader
					actions={
						<Button startSlot={<GitForkIcon aria-hidden />} variant="secondary">
							Action
						</Button>
					}
					description="React primitives and workflow blocks composed with Base UI and StyleX."
					headingLevel={3}
					title="base-xyz"
					startSlot={
						<Box bg="elevated" height={8} placeContent="center" radius="md" width={8} shadow="sm" display="grid">
							<Icon.StarFilled />
						</Box>
					}
					navSlot={
						<Tabs.Root>
							<Tabs.List>
								<Tabs.Tab value="overview">Overview</Tabs.Tab>
								<Tabs.Tab value="settings">Settings</Tabs.Tab>
							</Tabs.List>
						</Tabs.Root>
					}
					endSlot={<Button variant="neutral">End slot</Button>}
					titleAddon={
						<Badge hue="neutral" startSlot={<LockIcon aria-hidden weight="fill" />}>
							Private
						</Badge>
					}
				/>
			</ExperimentSection>

			<ExperimentSection
				description="A complete confirmation workflow with focus management, explicit actions, and success feedback."
				title="Confirmation Dialog">
				<Stack align="start">
					<ConfirmationDialog.Root
						trigger={<Button>Confirm deploy</Button>}
						successToast={{
							title: "Deployment promoted",
							description: "checkout-a11y.example.com is now serving production traffic.",
						}}>
						<ConfirmationDialog.Header>
							<ConfirmationDialog.Visual color="accent" bg="accent" size={12} radius="full">
								<RocketLaunchIcon aria-hidden size={24} weight="duotone" />
							</ConfirmationDialog.Visual>
							<ConfirmationDialog.Title>Deploy branch</ConfirmationDialog.Title>
							<ConfirmationDialog.Description>
								Replacing a live deployment requires administrator approval. Confirm below.
							</ConfirmationDialog.Description>
						</ConfirmationDialog.Header>
						<ConfirmationDialog.Body>
							Production traffic will move to the selected preview immediately. The current production deployment
							remains available for rollback from the deployment history.
						</ConfirmationDialog.Body>
						<ConfirmationDialog.Footer>
							<ConfirmationDialog.Actions>
								<ConfirmationDialog.Cancel>Cancel</ConfirmationDialog.Cancel>
								<ConfirmationDialog.Confirm>Promote deployment</ConfirmationDialog.Confirm>
							</ConfirmationDialog.Actions>
						</ConfirmationDialog.Footer>
					</ConfirmationDialog.Root>
				</Stack>
			</ExperimentSection>

			<ExperimentSection
				description="A compact timeline makes completed, active, approval, and queued work distinguishable."
				title="Workflow Progress">
				<WorkflowProgress.Root aria-label="Release workflow progress">
					<WorkflowItem
						description="Read routing and component conventions."
						status="complete"
						title="Inspected the repository"
					/>
					<WorkflowItem
						description="Building realistic child pages and navigation."
						status="running"
						title="Implemented experiments"
					/>
					<WorkflowItem
						description="Permission is required before publishing."
						status="approval"
						title="Push the branch"
					/>
					<WorkflowItem description="Run app and Storybook checks." status="queued" title="Verify the experience" />
				</WorkflowProgress.Root>
			</ExperimentSection>
		</ExperimentPage>
	);
}

function WorkflowItem({
	description,
	status,
	title,
}: {
	description: string;
	status: "approval" | "complete" | "queued" | "running";
	title: string;
}) {
	return (
		<WorkflowProgress.Item status={status}>
			<WorkflowProgress.Marker />
			<WorkflowProgress.Content>
				<WorkflowProgress.Header>
					<WorkflowProgress.Title>{title}</WorkflowProgress.Title>
					<WorkflowProgress.Description>{description}</WorkflowProgress.Description>
					<WorkflowProgress.Metadata>
						<WorkflowProgress.Status />
					</WorkflowProgress.Metadata>
				</WorkflowProgress.Header>
			</WorkflowProgress.Content>
		</WorkflowProgress.Item>
	);
}
