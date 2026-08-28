import { ConfirmationDialog } from "@/blocks";
import {
	AlertDialog,
	Button,
	Checkbox,
	CommandPalette,
	Dialog,
	LinkPreview,
	Menu,
	Popover,
	Select,
	Stack,
	TextField,
	Tooltip,
} from "@/components";
import { popupsPageStyles as styles } from "./popups-page.styles";

const environmentItems = [
	{ label: "Production", value: "production" },
	{ label: "Preview", value: "preview" },
	{ label: "Development", value: "development" },
];

const commandItems = [
	"Create project",
	"Invite teammate",
	"Open deployment logs",
	"Change theme",
	"View keyboard shortcuts",
];

export function MenuExample() {
	return (
		<Menu.Root>
			<Menu.Trigger render={<Button variant="neutral" />}>Menu</Menu.Trigger>
			<Menu.Popup positionerProps={{ align: "start" }}>
				<Menu.Item>
					<Menu.ItemLabel>Duplicate project</Menu.ItemLabel>
					<Menu.ItemShortcut>⌘D</Menu.ItemShortcut>
				</Menu.Item>
				<Menu.Item>
					<Menu.ItemLabel>Move to archive</Menu.ItemLabel>
				</Menu.Item>
				<Menu.SubmenuRoot>
					<Menu.SubmenuTrigger>
						<Menu.ItemLabel>Share</Menu.ItemLabel>
					</Menu.SubmenuTrigger>
					<Menu.Popup positionerProps={{ align: "start", side: "inline-end", sideOffset: 4 }}>
						<Menu.Item>
							<Menu.ItemLabel>Copy link</Menu.ItemLabel>
						</Menu.Item>
						<Menu.Item>
							<Menu.ItemLabel>Email teammate</Menu.ItemLabel>
						</Menu.Item>
					</Menu.Popup>
				</Menu.SubmenuRoot>
				<Menu.Separator />
				<Menu.Item variant="error">
					<Menu.ItemLabel>Delete project</Menu.ItemLabel>
				</Menu.Item>
			</Menu.Popup>
		</Menu.Root>
	);
}

export function SelectExample() {
	return (
		<Select.Root<string> defaultValue="production" items={environmentItems}>
			<Select.Trigger render={<Button variant="neutral" />}>Select</Select.Trigger>
			<Select.Popup positionerProps={{ alignItemWithTrigger: false }}>
				<Select.List>
					{environmentItems.map((item) => (
						<Select.Item key={item.value} value={item.value}>
							{item.label}
						</Select.Item>
					))}
				</Select.List>
			</Select.Popup>
		</Select.Root>
	);
}

export function PopoverExample() {
	return (
		<Popover.Root>
			<Popover.Trigger render={<Button variant="neutral" />}>Popover</Popover.Trigger>
			<Popover.Popup positionerProps={{ align: "start" }} showClose>
				<Popover.Title>Create a preview deployment</Popover.Title>
				<Popover.Description>
					Mixed content combines supporting copy, form controls, and actions.
				</Popover.Description>
				<Stack gap={3} mt={4}>
					<TextField label="Branch" defaultValue="feature/popup-lab" />
					<Checkbox defaultChecked label="Include environment variables" />
				</Stack>
				<Popover.Footer>
					<Button size="sm">Create preview</Button>
				</Popover.Footer>
			</Popover.Popup>
		</Popover.Root>
	);
}

export function LinkPreviewExample() {
	return (
		<LinkPreview.Root>
			<LinkPreview.Trigger
				closeDelay={100}
				delay={0}
				xstyle={styles.linkPreviewButton}
				render={<Button variant="neutral" />}
			>
				Link Preview
			</LinkPreview.Trigger>
			<LinkPreview.Popup positionerProps={{ align: "start" }}>
				<LinkPreview.Content>
					<LinkPreview.Title>Base UI popup primitives</LinkPreview.Title>
					<LinkPreview.Description>
						Accessible positioning, focus management, collision handling, and composable rendering.
					</LinkPreview.Description>
				</LinkPreview.Content>
			</LinkPreview.Popup>
		</LinkPreview.Root>
	);
}

export function TooltipExample() {
	return (
		<Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger delay={0} render={<Button variant="neutral" />}>
					Tooltip
				</Tooltip.Trigger>
				<Tooltip.Popup>This tooltip opens on hover or keyboard focus.</Tooltip.Popup>
			</Tooltip.Root>
		</Tooltip.Provider>
	);
}

export function CommandPaletteExample() {
	return (
		<CommandPalette.Root<string>
			items={commandItems}
			itemToStringValue={(item) => item}
			label="Command palette example"
			trigger={<Button variant="neutral">Command Palette</Button>}
		>
			<CommandPalette.Input placeholder="Search commands…" />
			<CommandPalette.List>
				<CommandPalette.Items>
					{(item: string) => (
						<CommandPalette.Item key={item} value={item}>
							{item}
						</CommandPalette.Item>
					)}
				</CommandPalette.Items>
			</CommandPalette.List>
			<CommandPalette.Empty />
		</CommandPalette.Root>
	);
}

export function AlertDialogExample() {
	return (
		<AlertDialog.Root>
			<AlertDialog.Trigger render={<Button variant="neutral" />}>Alert Dialog</AlertDialog.Trigger>
			<AlertDialog.Popup>
				<AlertDialog.Header>
					<AlertDialog.Title>Discard the draft?</AlertDialog.Title>
					<AlertDialog.Description>
						Your unsaved popup test notes will be permanently lost.
					</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Close render={<Button variant="neutral" />}>Keep editing</AlertDialog.Close>
					<AlertDialog.Close render={<Button variant="error" />}>Discard</AlertDialog.Close>
				</AlertDialog.Footer>
			</AlertDialog.Popup>
		</AlertDialog.Root>
	);
}

export function ConfirmationDialogExample() {
	return (
		<ConfirmationDialog.Root
			successToast={false}
			trigger={<Button variant="neutral">Confirmation Dialog</Button>}
		>
			<ConfirmationDialog.Header>
				<ConfirmationDialog.Title>Publish this project?</ConfirmationDialog.Title>
				<ConfirmationDialog.Description>
					The current preview will become the production deployment.
				</ConfirmationDialog.Description>
			</ConfirmationDialog.Header>
			<ConfirmationDialog.Body>
				Review the production environment and confirm when you are ready.
			</ConfirmationDialog.Body>
			<ConfirmationDialog.Footer>
				<ConfirmationDialog.Actions>
					<ConfirmationDialog.Cancel>Cancel</ConfirmationDialog.Cancel>
					<ConfirmationDialog.Confirm>Publish</ConfirmationDialog.Confirm>
				</ConfirmationDialog.Actions>
			</ConfirmationDialog.Footer>
		</ConfirmationDialog.Root>
	);
}

export function NestedPopupsExample() {
	return (
		<Dialog.Root>
			<Dialog.Trigger render={<Button variant="neutral" />}>Nested popups</Dialog.Trigger>
			<Dialog.Popup>
				<Dialog.Header>
					<Dialog.Title>Nested popup stack</Dialog.Title>
					<Dialog.Description>
						Open each child layer and verify it remains interactive above its parent.
					</Dialog.Description>
				</Dialog.Header>
				<Dialog.Body>
					<Stack gap={4} orientation="horizontal" wrap="wrap">
						<Popover.Root>
							<Popover.Trigger render={<Button variant="secondary" />}>
								Open nested popover
							</Popover.Trigger>
							<Popover.Popup positionerProps={{ align: "start" }}>
								<Popover.Title>Nested popover</Popover.Title>
								<Popover.Description>
									This anchored layer should sit above the modal dialog.
								</Popover.Description>
								<Stack mt={4}>
									<Menu.Root>
										<Menu.Trigger render={<Button variant="secondary" />}>
											Open nested menu
										</Menu.Trigger>
										<Menu.Popup positionerProps={{ align: "start" }}>
											<Menu.Item>
												<Menu.ItemLabel>First nested action</Menu.ItemLabel>
											</Menu.Item>
											<Menu.Item>
												<Menu.ItemLabel>Second nested action</Menu.ItemLabel>
											</Menu.Item>
										</Menu.Popup>
									</Menu.Root>
								</Stack>
							</Popover.Popup>
						</Popover.Root>
						<Tooltip.Provider>
							<Tooltip.Root>
								<Tooltip.Trigger delay={0} render={<Button variant="secondary" />}>
									Nested tooltip
								</Tooltip.Trigger>
								<Tooltip.Popup>Tooltip above modal content</Tooltip.Popup>
							</Tooltip.Root>
						</Tooltip.Provider>
					</Stack>
				</Dialog.Body>
				<Dialog.Footer>
					<Dialog.Close render={<Button variant="neutral" />}>Close</Dialog.Close>
				</Dialog.Footer>
			</Dialog.Popup>
		</Dialog.Root>
	);
}
