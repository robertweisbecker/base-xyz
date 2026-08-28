import { type ReactNode } from "react";
import * as stylex from "@stylexjs/stylex";
import {
	AgentActionApproval,
	AsyncJobProgress,
	ConfirmationDialog,
	ContextPopover,
	CopyButton,
	GoalToolbar,
	ModelSelector,
	PageHeader,
	PasswordField,
	PromptComposer,
	StreamingResponse,
	WorkflowProgress,
} from "@/blocks";
import { BlueprintIcon } from "@phosphor-icons/react/dist/csr/Blueprint";
import { CopyIcon } from "@phosphor-icons/react/dist/csr/Copy";
import { FolderOpenIcon } from "@phosphor-icons/react/dist/csr/FolderOpen";
import { GithubLogoIcon } from "@phosphor-icons/react/dist/csr/GithubLogo";
import { InfoIcon } from "@phosphor-icons/react/dist/csr/Info";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/csr/MagnifyingGlass";
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import { XIcon } from "@phosphor-icons/react/dist/csr/X";
import {
	AlertDialog,
	Avatar,
	Badge,
	Breadcrumbs,
	Button,
	Callout,
	Card,
	Checkbox,
	CheckboxGroup,
	Code,
	CodeBlock,
	Collapsible,
	Combobox,
	CommandPalette,
	DataTable,
	type DataTableColumnDef,
	Dialog,
	Drawer,
	EmptyState,
	Heading,
	IconButton,
	InfoTip,
	InputGroup,
	Item,
	Link,
	LinkPreview,
	Loader,
	Menu,
	Meter,
	NumberField,
	Popover,
	Progress,
	Radio,
	RadioGroup,
	ScrollArea,
	Select,
	Separator,
	Slider,
	Stack,
	Stepper,
	Switch,
	Table,
	Tabs,
	Text,
	Textarea,
	TextField,
	Toast,
	Toggle,
	ToggleGroup,
	Toolbar,
	Tooltip,
	VisuallyHidden,
} from "@/components";
import {
	exampleDefaultValue,
	exampleEffortOptions,
	exampleModelGroups,
	exampleSpeedOptions,
} from "@/blocks/model-selector/model-selector.examples";
import { breakpoints } from "@/styles/constants.stylex";
import { tokens } from "@/theme/tokens.stylex";

import {
	ArrowRightIcon,
	FileSearchIcon,
	TextBIcon,
	ThumbsDownIcon,
	ThumbsUpIcon,
	TrashIcon,
} from "@phosphor-icons/react";

type GalleryCell = {
	title: string;
	content: ReactNode;
};

const componentNames = ["React", "Vue", "Svelte", "Solid"];
type GalleryDeployment = {
	status: "Ready" | "Failed";
	url: string;
	updated: string;
};
const galleryDeployments: GalleryDeployment[] = [
	{ status: "Ready", url: "app.example.com", updated: "2m ago" },
	{ status: "Failed", url: "preview.example.com", updated: "18m ago" },
];
const galleryDeploymentColumns: Array<DataTableColumnDef<GalleryDeployment>> = [
	{ accessorKey: "url", header: "URL" },
	{ accessorKey: "status", header: "Status" },
	{ accessorKey: "updated", header: "Updated" },
];
function getComponentCells(): GalleryCell[] {
	return [
		{
			title: "AlertDialog",
			content: (
				<AlertDialog.Root>
					<AlertDialog.Trigger render={<Button variant="secondary" />}>
						Delete item
					</AlertDialog.Trigger>
					<AlertDialog.Popup>
						<AlertDialog.Header>
							<AlertDialog.Title>Delete item?</AlertDialog.Title>
							<AlertDialog.Description>
								This action can be cancelled from the dialog.
							</AlertDialog.Description>
						</AlertDialog.Header>
						<AlertDialog.Footer>
							<AlertDialog.Close render={<Button variant="ghost" />}>Cancel</AlertDialog.Close>
							<AlertDialog.Close render={<Button variant="error" />}>Delete</AlertDialog.Close>
						</AlertDialog.Footer>
					</AlertDialog.Popup>
				</AlertDialog.Root>
			),
		},
		{
			title: "Avatar",
			content: <Avatar image="/avatar-example.svg" name="Ada Lovelace" size={10} />,
		},
		{
			title: "Badge",
			content: (
				<div {...stylex.props(styles.badgeStack)}>
					<Badge hue="accent" variant="solid">
						Primary
					</Badge>
					<Badge hue="error" variant="solid">
						Error
					</Badge>
					<Badge hue="neutral" variant="subtle">
						Neutral
					</Badge>
					<Badge hue="neutral" variant="elevated">
						Elevated
					</Badge>
				</div>
			),
		},
		{
			title: "Breadcrumbs",
			content: (
				<Breadcrumbs.Root size="sm">
					<Breadcrumbs.Link href="#">Home</Breadcrumbs.Link>
					<Breadcrumbs.Separator />
					<Breadcrumbs.Link href="#">Docs</Breadcrumbs.Link>
					<Breadcrumbs.Separator />
					<Breadcrumbs.Current>Components</Breadcrumbs.Current>
				</Breadcrumbs.Root>
			),
		},
		{
			title: "Button",
			content: (
				<div {...stylex.props(styles.buttonStack)}>
					<Button size="sm" startSlot={<PlusIcon aria-hidden weight="bold" />} variant="secondary">
						Create project
					</Button>
					<Button size="sm" startSlot={<PlusIcon aria-hidden weight="bold" />}>
						Create project
					</Button>
					<Button size="sm" startSlot={<PlusIcon aria-hidden weight="bold" />} variant="ghost">
						Create project
					</Button>
				</div>
			),
		},
		{
			title: "Callout",
			content: (
				<Callout
					description="A new version is ready to install."
					hue="accent"
					icon={<InfoIcon aria-hidden weight="fill" />}
					title="Update available"
				/>
			),
		},
		{
			title: "Card",
			content: (
				<Card.Root size="sm" xstyle={styles.cardSample}>
					<Card.Header>
						<Card.Title>Next steps</Card.Title>
						<Card.Description>Review changes</Card.Description>
					</Card.Header>
					<Card.Footer>
						<Button size="xs" variant="ghost">
							View details
						</Button>
					</Card.Footer>
				</Card.Root>
			),
		},
		{
			title: "Checkbox",
			content: <Checkbox label="Max bandwidth" defaultChecked />,
		},
		{
			title: "CheckboxGroup",
			content: (
				<CheckboxGroup label="Files" defaultValue={["readme"]}>
					<Checkbox value="readme" label="Readme" />
					<Checkbox value="changelog" label="Changelog" />
				</CheckboxGroup>
			),
		},
		{
			title: "Code",
			content: (
				<span style={{ fontSize: "14px" }}>
					Built with <Code>StyleX</Code> & <Code>Base UI</Code>
				</span>
			),
		},
		{
			title: "CodeBlock",
			content: (
				<CodeBlock xstyle={styles.codeSample}>
					{"const sum = (a, b) => {\n  return a + b;\n};"}
				</CodeBlock>
			),
		},
		{
			title: "Collapsible",
			content: (
				<Collapsible.Root defaultOpen xstyle={styles.compactWide}>
					<Collapsible.Trigger>
						Details
						<Collapsible.Icon />
					</Collapsible.Trigger>
					<Collapsible.Panel>
						<Collapsible.Content>Here's some expandable content.</Collapsible.Content>
					</Collapsible.Panel>
				</Collapsible.Root>
			),
		},
		{
			title: "Combobox",
			content: <ComboboxGalleryExample />,
		},
		{
			title: "Combobox multiple",
			content: <ComboboxGalleryExample multiple />,
		},
		{
			title: "CommandPalette",
			content: (
				<CommandPalette.Root
					inline
					items={["Create project", "Search docs", "Open settings"]}
					xstyle={styles.galleryWide}
				>
					<CommandPalette.Input placeholder="Search commands..." />
					<CommandPalette.List>
						{(item: string) => (
							<CommandPalette.Item key={item} value={item}>
								{item}
							</CommandPalette.Item>
						)}
					</CommandPalette.List>
					<CommandPalette.Empty />
				</CommandPalette.Root>
			),
		},
		{
			title: "DataTable",
			content: (
				<DataTable
					columns={galleryDeploymentColumns}
					data={galleryDeployments}
					filterColumnId="url"
					filterPlaceholder="Filter"
					rowSelection={false}
					xstyle={styles.galleryWide}
				/>
			),
		},
		{
			title: "Dialog",
			content: (
				<Dialog.Root>
					<Dialog.Trigger render={<Button variant="secondary" />}>Open dialog</Dialog.Trigger>
					<Dialog.Popup>
						<Dialog.Header>
							<Dialog.Title>Workspace settings</Dialog.Title>
							<Dialog.Description>Adjust shared project settings.</Dialog.Description>
						</Dialog.Header>
						<Dialog.Body>
							<TextField label="Name" defaultValue="StyleX Lab" />
						</Dialog.Body>
						<Dialog.Footer>
							<Dialog.Close render={<Button variant="ghost" />}>Cancel</Dialog.Close>
							<Dialog.Close render={<Button />}>Save</Dialog.Close>
						</Dialog.Footer>
					</Dialog.Popup>
				</Dialog.Root>
			),
		},
		{
			title: "Drawer",
			content: (
				<Drawer.Root>
					<Drawer.Trigger render={<Button variant="secondary" />}>Open drawer</Drawer.Trigger>
					<Drawer.Portal>
						<Drawer.Backdrop />
						<Drawer.Viewport>
							<Drawer.Popup>
								<Drawer.Handle />
								<Drawer.Header>
									<Drawer.Title>Deployment</Drawer.Title>
									<Drawer.Description>Review the pending release.</Drawer.Description>
								</Drawer.Header>
								<Drawer.Body>All checks passed.</Drawer.Body>
								<Drawer.Footer>
									<Drawer.Close
										render={<Button xstyle={styles.fullWidth} shape="pill" size="lg" />}
									>
										Done
									</Drawer.Close>
								</Drawer.Footer>
							</Drawer.Popup>
						</Drawer.Viewport>
					</Drawer.Portal>
				</Drawer.Root>
			),
		},
		{
			title: "EmptyState",
			content: (
				<EmptyState
					description="Create a project to get started."
					icon={<FolderOpenIcon aria-hidden size="1em" weight="duotone" />}
					size="sm"
					title="No projects yet"
				>
					<Button size="sm">Create project</Button>
				</EmptyState>
			),
		},
		{
			title: "Heading",
			content: (
				<Heading textAlign="center" size="6">
					The quick brown fox
				</Heading>
			),
		},
		{
			title: "IconButton",
			content: (
				<IconButton
					icon={<PlusIcon aria-hidden weight="bold" />}
					label="Add item"
					variant="secondary"
				/>
			),
		},
		{
			title: "InfoTip",
			content: <InfoTip content="This setting applies to everyone in the workspace." />,
		},
		{
			title: "InputGroup",
			content: (
				<InputGroup.Root xstyle={styles.inputGroupSample}>
					<InputGroup.Addon>
						<FileSearchIcon aria-hidden size={13} />
					</InputGroup.Addon>
					<InputGroup.Input aria-label="Worker URL" defaultValue="stylex-lab" />
					<InputGroup.Addon position="end">
						<IconButton
							icon={<ArrowRightIcon aria-hidden />}
							label="Copy URL"
							size="xs"
							tooltip={false}
							variant="ghost"
						/>
					</InputGroup.Addon>
				</InputGroup.Root>
			),
		},
		{
			title: "Item",
			content: (
				<Item
					description="Organize files and collaborators."
					endSlot={
						<Badge hue="accent" size="sm" variant="subtle">
							Beta
						</Badge>
					}
					label="Projects"
					startSlot={<FolderOpenIcon aria-hidden size="1.25em" weight="duotone" />}
				/>
			),
		},
		{
			title: "Link",
			content: (
				<div {...stylex.props(styles.linkStack)}>
					<Link href="#top" color="accent">
						Default (accent) link
					</Link>
					<Link href="#top" color="neutral">
						Neutral link
					</Link>
					<Link aria-current="page" href="#top" color="inherit">
						Inherited color link
					</Link>
					<Link href="https://base-ui.com/" external>
						External link
					</Link>
				</div>
			),
		},
		{
			title: "LinkPreview",
			content: (
				<LinkPreview.Root>
					<LinkPreview.Trigger href="#top" render={<Link color="accent" />}>
						Hover preview
					</LinkPreview.Trigger>
					<LinkPreview.Popup>
						<LinkPreview.Content>
							<Stack orientation="horizontal" gap={2}>
								<Avatar image="/avatar-example.svg" name="Ada Lovelace" size={10} />
								<Stack>
									<LinkPreview.Title>Base + StyleX Lab</LinkPreview.Title>
									<LinkPreview.Description>Reusable primitives and blocks.</LinkPreview.Description>
								</Stack>
							</Stack>
						</LinkPreview.Content>
					</LinkPreview.Popup>
				</LinkPreview.Root>
			),
		},
		{
			title: "Loader",
			content: <Loader aria-label="Loading" />,
		},
		{
			title: "Menu",
			content: (
				<Menu.Root>
					<Menu.Trigger render={<Button variant="secondary" />}>Open menu</Menu.Trigger>
					<Menu.Popup positionerProps={{ align: "start" }}>
						<Menu.Item>
							<PlusIcon aria-hidden weight="regular" />
							<Menu.ItemLabel>New file</Menu.ItemLabel>
						</Menu.Item>
						<Menu.Item>
							<CopyIcon aria-hidden weight="regular" />
							<Menu.ItemLabel>Duplicate</Menu.ItemLabel>
						</Menu.Item>
						<Menu.Separator />
						<Menu.Item variant="error">
							<TrashIcon aria-hidden weight="regular" />
							<Menu.ItemLabel>Delete</Menu.ItemLabel>
						</Menu.Item>
					</Menu.Popup>
				</Menu.Root>
			),
		},
		{
			title: "Meter",
			content: (
				<Meter.Root value={100} max={500} color={tokens["--bg-warning-primary"]}>
					<Meter.Label>My meter</Meter.Label>
					<Meter.Value />
					<Meter.Track>
						<Meter.Indicator />
					</Meter.Track>
				</Meter.Root>
			),
		},
		{
			title: "NumberField",
			content: <NumberField label="Seats" defaultValue={12} inputWidth="7ch" />,
		},
		{
			title: "Popover",
			content: (
				<Popover.Root>
					<Popover.Trigger render={<Button variant="secondary" />}>Open popover</Popover.Trigger>
					<Popover.Popup positionerProps={{ side: "top" }}>
						<Popover.Title>Notifications</Popover.Title>
						<Popover.Description>You are all caught up.</Popover.Description>
					</Popover.Popup>
				</Popover.Root>
			),
		},
		{
			title: "Progress",
			content: (
				<Progress.Root value={null} aria-label="Build progress">
					<Progress.Label>Build</Progress.Label>
					<Progress.Value />
					<Progress.Track>
						<Progress.Indicator />
					</Progress.Track>
				</Progress.Root>
			),
		},
		{
			title: "Radio",
			content: (
				<RadioGroup label="Selection" defaultValue="selected">
					<Radio value="selected" label="Selected option" />
				</RadioGroup>
			),
		},
		{
			title: "RadioGroup",
			content: (
				<RadioGroup label="Fave ape" defaultValue="one">
					<Radio value="one" label="Caesar" />
					<Radio value="two" label="Koba" />
				</RadioGroup>
			),
		},
		{
			title: "ScrollArea",
			content: (
				<ScrollArea label="Recent component updates" xstyle={styles.scrollAreaSample}>
					<div {...stylex.props(styles.scrollAreaContent)}>
						{[
							"Button refined",
							"Menu grouped",
							"Toast anchored",
							"Dialog opened",
							"Tooltip tuned",
						].map((item) => (
							<div key={item} {...stylex.props(styles.scrollItem)}>
								{item}
							</div>
						))}
					</div>
				</ScrollArea>
			),
		},
		{
			title: "Select",
			content: (
				<Select.Root defaultValue="v1">
					<Select.Trigger placeholder="Select version" />
					<Select.Popup>
						<Select.List>
							<Select.Item value="v1">Version 1</Select.Item>
							<Select.Item value="v2">Version 2</Select.Item>
						</Select.List>
					</Select.Popup>
				</Select.Root>
			),
		},
		{
			title: "Separator",
			content: (
				<div {...stylex.props(styles.separatorSample)}>
					<span>Before</span>
					<Separator />
					<span>After</span>
				</div>
			),
		},
		{
			title: "Slider",
			content: (
				<Slider.Root defaultValue={60} step={10}>
					<Slider.Header>
						<Slider.Label>Volume</Slider.Label>
						<Slider.Value />
					</Slider.Header>
					<Slider.Row>
						<Slider.Control markers={{ every: 2 }}>
							<Slider.Thumb />
						</Slider.Control>
					</Slider.Row>
				</Slider.Root>
			),
		},
		{
			title: "Stepper",
			content: (
				<Stepper.Root defaultValue="profile">
					<Stepper.List aria-label="Account setup">
						<Stepper.Step value="profile">
							<Stepper.Marker>1</Stepper.Marker>
							<Stepper.Heading>
								<Stepper.Title>Profile</Stepper.Title>
							</Stepper.Heading>
						</Stepper.Step>
						<Stepper.Step value="security">
							<Stepper.Marker>2</Stepper.Marker>
							<Stepper.Heading>
								<Stepper.Title>Security</Stepper.Title>
							</Stepper.Heading>
						</Stepper.Step>
						<Stepper.Step value="review">
							<Stepper.Marker>3</Stepper.Marker>
							<Stepper.Heading>
								<Stepper.Title>Review</Stepper.Title>
							</Stepper.Heading>
						</Stepper.Step>
					</Stepper.List>
					<Stepper.Content>
						<Stepper.Panel value="profile">Add your personal details.</Stepper.Panel>
						<Stepper.Panel value="security">Choose authentication options.</Stepper.Panel>
						<Stepper.Panel value="review">Confirm the account setup.</Stepper.Panel>
					</Stepper.Content>
				</Stepper.Root>
			),
		},
		{
			title: "Switch",
			content: <Switch label="Realtime sync" defaultChecked size="sm" />,
		},
		{
			title: "Table",
			content: (
				<Table.Root>
					<Table.Container>
						<Table.Content caption={<VisuallyHidden>Recent deployments</VisuallyHidden>}>
							<Table.Header>
								<Table.Row>
									<Table.HeaderCell>URL</Table.HeaderCell>
									<Table.HeaderCell>Status</Table.HeaderCell>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								<Table.Row>
									<Table.Cell>app.example.com</Table.Cell>
									<Table.Cell>Ready</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell>preview.example.com</Table.Cell>
									<Table.Cell>Building</Table.Cell>
								</Table.Row>
							</Table.Body>
						</Table.Content>
					</Table.Container>
				</Table.Root>
			),
		},
		{
			title: "Tabs",
			content: (
				<Tabs.Root defaultValue="overview" size="sm">
					<Tabs.List>
						<Tabs.Tab value="overview">Overview</Tabs.Tab>
						<Tabs.Tab value="activity">Activity</Tabs.Tab>
					</Tabs.List>
					<Tabs.Content>
						<Tabs.Panel value="overview">
							<Text size="1">Workspace summary</Text>
						</Tabs.Panel>
						<Tabs.Panel value="activity">
							<Text size="1">Recent activity</Text>
						</Tabs.Panel>
					</Tabs.Content>
				</Tabs.Root>
			),
		},
		{
			title: "Text",
			content: (
				<Text textAlign="center" color="muted" size="3" wrap="balance">
					Reusable typography for interface copy.
				</Text>
			),
		},
		{
			title: "Textarea",
			content: (
				<Textarea
					label="Message"
					placeholder="Enter your name"
					rows={2}
					xstyle={styles.compactField}
				/>
			),
		},
		{
			title: "TextField",
			content: (
				<div {...stylex.props(styles.controlStack)}>
					<TextField label="Name" placeholder="Type something..." xstyle={styles.compactField} />
					<TextField
						label="Project"
						defaultValue="Invalid"
						error="Use at least 8 characters."
						xstyle={styles.compactField}
					/>
				</div>
			),
		},
		{
			title: "Toast",
			content: <ToastExample />,
		},
		{
			title: "Toggle",
			content: (
				<div>
					<Toggle startSlot={<TextBIcon aria-hidden weight="bold" />}>Bold</Toggle>
				</div>
			),
		},
		{
			title: "ToggleGroup",
			content: (
				<div {...stylex.props(styles.toggleRow)}>
					<ToggleGroup defaultValue={["bold"]}>
						<Toggle
							icon={<ThumbsDownIcon aria-hidden weight="regular" />}
							pressedIcon={
								<ThumbsDownIcon aria-hidden weight="duotone" color={tokens["--fg-error"]} />
							}
							label="Bad response"
							value="thumbs-down"
						/>
						<Toggle
							icon={<ThumbsUpIcon aria-hidden weight="regular" />}
							pressedIcon={
								<ThumbsUpIcon aria-hidden weight="duotone" color={tokens["--fg-success"]} />
							}
							label="Good response"
							value="thumbs-up"
						/>
					</ToggleGroup>
				</div>
			),
		},
		{
			title: "Toolbar",
			content: (
				<Toolbar.Root aria-label="Search toolbar">
					<Toolbar.Input aria-label="Search" placeholder="Search..." />
					<Toolbar.Button aria-label="Search">
						<MagnifyingGlassIcon aria-hidden size={15} />
					</Toolbar.Button>
					<Toolbar.Button aria-label="Add">
						<PlusIcon aria-hidden size={15} />
					</Toolbar.Button>
				</Toolbar.Root>
			),
		},
		{
			title: "Tooltip",
			content: (
				<Tooltip.Provider>
					<Tooltip.Root open={true}>
						<Tooltip.Trigger
							render={
								<IconButton
									icon={<PlusIcon aria-hidden />}
									label="Add item"
									tooltip={false}
									variant="secondary"
								/>
							}
						/>
						<Tooltip.Popup>Add</Tooltip.Popup>
					</Tooltip.Root>
				</Tooltip.Provider>
			),
		},
	];
}

function ComboboxGalleryExample({ multiple = false }: { multiple?: boolean }) {
	if (multiple) {
		return (
			<Combobox.Root<string, true>
				items={componentNames}
				multiple
				defaultValue={["React", "Solid"]}
			>
				<Combobox.Label>Libraries</Combobox.Label>
				<Combobox.InputGroup variant="chips">
					<Combobox.Chips>
						<Combobox.Value>
							{(value: string[]) => (
								<>
									{value.map((item) => (
										<Combobox.Chip
											key={item}
											endSlot={<Combobox.ChipRemove aria-label={`Remove ${item}`} />}
										>
											{item}
										</Combobox.Chip>
									))}
									<Combobox.Input placeholder={value.length > 0 ? "" : "Choose libraries"} />
								</>
							)}
						</Combobox.Value>
					</Combobox.Chips>
				</Combobox.InputGroup>
				<ComboboxGalleryPopup />
			</Combobox.Root>
		);
	}

	return (
		<Combobox.Root items={componentNames}>
			<Combobox.Label>Framework</Combobox.Label>
			<Combobox.InputGroup>
				<Combobox.Input placeholder="Select an issue..." />
			</Combobox.InputGroup>
			<ComboboxGalleryPopup />
		</Combobox.Root>
	);
}

function ComboboxGalleryPopup() {
	return (
		<Combobox.Popup>
			<Combobox.Empty>No matching components.</Combobox.Empty>
			<Combobox.List>
				{(item: string) => (
					<Combobox.Item key={item} value={item}>
						{item}
					</Combobox.Item>
				)}
			</Combobox.List>
		</Combobox.Popup>
	);
}

function getBlockCells(): GalleryCell[] {
	return [
		{
			title: "AgentActionApproval",
			content: (
				<AgentActionApproval.Root>
					<AgentActionApproval.Header>
						<AgentActionApproval.Title>Approve command</AgentActionApproval.Title>
						<Badge hue="accent" size="sm">
							Review
						</Badge>
					</AgentActionApproval.Header>
					<AgentActionApproval.Content>
						<AgentActionApproval.Summary>
							<AgentActionApproval.Icon>
								<BlueprintIcon aria-hidden size={14} weight="duotone" />
							</AgentActionApproval.Icon>
							<AgentActionApproval.SummaryContent>
								<AgentActionApproval.Action>Run npm test</AgentActionApproval.Action>
								<AgentActionApproval.ActionDescription>
									Executes the repository test suite.
								</AgentActionApproval.ActionDescription>
							</AgentActionApproval.SummaryContent>
						</AgentActionApproval.Summary>
						<AgentActionApproval.Details>
							<AgentActionApproval.Detail>
								<AgentActionApproval.DetailLabel>cwd</AgentActionApproval.DetailLabel>
								<AgentActionApproval.DetailValue>/Sites/stylex</AgentActionApproval.DetailValue>
							</AgentActionApproval.Detail>
						</AgentActionApproval.Details>
					</AgentActionApproval.Content>
					<AgentActionApproval.Footer>
						<AgentActionApproval.Actions>
							<Button size="sm" variant="ghost">
								Deny
							</Button>
							<Button size="sm">Allow</Button>
						</AgentActionApproval.Actions>
					</AgentActionApproval.Footer>
				</AgentActionApproval.Root>
			),
		},
		{
			title: "AsyncJobProgress",
			content: (
				<AsyncJobProgress.Root status="running" value={68}>
					<AsyncJobProgress.Header>
						<AsyncJobProgress.Heading>
							<AsyncJobProgress.Title>Publishing package</AsyncJobProgress.Title>
							<AsyncJobProgress.Description>
								Bundling component artifacts.
							</AsyncJobProgress.Description>
						</AsyncJobProgress.Heading>
						<AsyncJobProgress.Status />
					</AsyncJobProgress.Header>
					<AsyncJobProgress.Progress />
					<AsyncJobProgress.Actions>
						<Button size="sm" variant="ghost">
							Cancel
						</Button>
					</AsyncJobProgress.Actions>
				</AsyncJobProgress.Root>
			),
		},
		{
			title: "ConfirmationDialog",
			content: (
				<ConfirmationDialog.Root
					trigger={
						<Button size="sm" variant="secondary">
							Open confirmation
						</Button>
					}
					successToast={false}
				>
					<ConfirmationDialog.Header>
						<ConfirmationDialog.Visual>
							<BlueprintIcon aria-hidden size={20} weight="duotone" />
						</ConfirmationDialog.Visual>
						<ConfirmationDialog.Title>Confirm release</ConfirmationDialog.Title>
						<ConfirmationDialog.Description>
							This will publish the current component build.
						</ConfirmationDialog.Description>
					</ConfirmationDialog.Header>
					<ConfirmationDialog.Body>Version 0.0.0 is ready for review.</ConfirmationDialog.Body>
					<ConfirmationDialog.Footer>
						<ConfirmationDialog.Actions>
							<ConfirmationDialog.Cancel size="sm">Cancel</ConfirmationDialog.Cancel>
							<ConfirmationDialog.Confirm size="sm">Confirm</ConfirmationDialog.Confirm>
						</ConfirmationDialog.Actions>
					</ConfirmationDialog.Footer>
				</ConfirmationDialog.Root>
			),
		},
		{
			title: "ContextPopover",
			content: <ContextPopover total={258_000} usage={207_000} />,
		},
		{
			title: "CopyButton",
			content: (
				<CopyButton value="yo@bob.fyi" variant="ghost">
					yo@bob.fyi
				</CopyButton>
			),
		},
		{
			title: "GoalToolbar",
			content: (
				<div {...stylex.props(styles.blockWide)}>
					<GoalToolbar defaultActive defaultDescription="Redesign the demo gallery" />
				</div>
			),
		},
		{
			title: "ModelSelector",
			content: (
				<ModelSelector.Root
					groups={exampleModelGroups}
					effortOptions={exampleEffortOptions}
					speedOptions={exampleSpeedOptions}
					defaultValue={exampleDefaultValue}
				>
					<ModelSelector.Trigger size="sm" variant="secondary" />
					<ModelSelector.Popup />
				</ModelSelector.Root>
			),
		},
		{
			title: "PageHeader",
			content: (
				<PageHeader
					title="Component library"
					description="Primitives, blocks, and verification stories."
					headingLevel={2}
					startSlot={
						<Avatar icon={<GithubLogoIcon aria-hidden weight="fill" />} name="GitHub" size={8} />
					}
					breadcrumbs={
						<Breadcrumbs.Root size="sm">
							<Breadcrumbs.Link href="#">Docs</Breadcrumbs.Link>
							<Breadcrumbs.Separator />
							<Breadcrumbs.Current>Components</Breadcrumbs.Current>
						</Breadcrumbs.Root>
					}
					xstyle={styles.blockWide}
					actions={
						<Button size="sm" variant="neutral">
							New
						</Button>
					}
				/>
			),
		},
		{
			title: "PasswordField",
			content: (
				<PasswordField.Root defaultValue="correct-horse-2" xstyle={styles.galleryWide}>
					<PasswordField.Label>Password</PasswordField.Label>
					<PasswordField.Control>
						<PasswordField.Input />
						<PasswordField.Actions>
							<PasswordField.VisibilityToggle />
						</PasswordField.Actions>
					</PasswordField.Control>
					<PasswordField.Meter requirements={[/[a-z]/, /[A-Z]/, /\d/, /.{12,}/]} />
				</PasswordField.Root>
			),
		},
		{
			title: "PromptComposer",
			content: (
				<PromptComposer.Root
					defaultValue="Summarize the component API changes"
					onSubmit={() => {}}
					clearOnSubmit={false}
					xstyle={styles.blockWide}
				>
					<PromptComposer.Surface>
						<PromptComposer.Input />
						<PromptComposer.Footer>
							<PromptComposer.Options>
								<Menu.Root>
									<PromptComposer.AddTrigger />
								</Menu.Root>
								<ContextPopover total={128_000} usage={40_000} />
							</PromptComposer.Options>
							<PromptComposer.Actions>
								<PromptComposer.Submit />
							</PromptComposer.Actions>
						</PromptComposer.Footer>
					</PromptComposer.Surface>
				</PromptComposer.Root>
			),
		},
		{
			title: "StreamingResponse",
			content: (
				<StreamingResponse.Root status="streaming">
					<StreamingResponse.Status />
					<StreamingResponse.Content>
						The component grid now separates primitives from blocks and keeps larger compositions in
						a roomier layout.
					</StreamingResponse.Content>
					<StreamingResponse.Actions>
						<Toolbar.Button
							aria-label="Copy response"
							render={
								<CopyButton
									variant="ghost"
									value="The component grid now separates primitives from blocks and keeps larger compositions in a roomier layout."
								/>
							}
						/>
					</StreamingResponse.Actions>
				</StreamingResponse.Root>
			),
		},
		{
			title: "WorkflowProgress",
			content: (
				<WorkflowProgress.Root>
					<WorkflowProgress.Item status="complete">
						<WorkflowProgress.Marker />
						<WorkflowProgress.Content>
							<WorkflowProgress.Header>
								<WorkflowProgress.Title>Read exports</WorkflowProgress.Title>
								<WorkflowProgress.Description>
									Mapped components and blocks.
								</WorkflowProgress.Description>
								<WorkflowProgress.Metadata>
									<WorkflowProgress.Status />
								</WorkflowProgress.Metadata>
							</WorkflowProgress.Header>
						</WorkflowProgress.Content>
					</WorkflowProgress.Item>
					<WorkflowProgress.Item status="running">
						<WorkflowProgress.Marker />
						<WorkflowProgress.Content>
							<WorkflowProgress.Header>
								<WorkflowProgress.Title>Verify layout</WorkflowProgress.Title>
								<WorkflowProgress.Description>
									Check desktop and mobile grids.
								</WorkflowProgress.Description>
								<WorkflowProgress.Metadata>
									<WorkflowProgress.Status />
								</WorkflowProgress.Metadata>
							</WorkflowProgress.Header>
						</WorkflowProgress.Content>
					</WorkflowProgress.Item>
				</WorkflowProgress.Root>
			),
		},
	];
}

function ToastExample() {
	return (
		<Toast.Provider timeout={5000}>
			<ToastButton />
			<Toast.Portal>
				<Toast.Viewport>
					<ToastList />
				</Toast.Viewport>
			</Toast.Portal>
		</Toast.Provider>
	);
}

function ToastButton() {
	const manager = Toast.useToastManager();

	return (
		<Button
			variant="secondary"
			onClick={() =>
				manager.add({
					title: "Changes saved",
					description: "Your project settings are up to date.",
				})
			}
		>
			Create toast
		</Button>
	);
}

function ToastList() {
	const { toasts } = Toast.useToastManager();

	return toasts.map((toast) => (
		<Toast.Root key={toast.id} toast={toast}>
			<Toast.Content>
				<Toast.Text>
					<Toast.Title />
					<Toast.Description />
				</Toast.Text>
				<Toast.Close
					render={
						<IconButton
							icon={<XIcon aria-hidden weight="bold" />}
							label="Dismiss notification"
							tooltip={false}
							variant="ghost"
						/>
					}
				/>
			</Toast.Content>
		</Toast.Root>
	));
}

/** Specimen grids used by the demo app and the Storybook Gallery story. */
export function GalleryGrid() {
	return (
		<main>
			<GallerySection title="Components" cells={getComponentCells()} variant="components" />
			<GallerySection title="Blocks" cells={getBlockCells()} variant="blocks" />
		</main>
	);
}

function GallerySection({
	title,
	cells,
	variant,
}: {
	title: string;
	cells: GalleryCell[];
	variant: "components" | "blocks";
}) {
	return (
		<section aria-labelledby={`${variant}`} {...stylex.props(styles.section)}>
			<div {...stylex.props(styles.sectionHeader)}>
				<h2 id={`${variant}`} {...stylex.props(styles.sectionTitle)}>
					{title}
				</h2>
				<Badge size="sm" variant="subtle" hue="neutral">
					{cells.length}
				</Badge>
			</div>
			<div {...stylex.props(variant === "components" ? styles.componentGrid : styles.blockGrid)}>
				{cells.map((cell) => (
					<section
						key={cell.title}
						{...stylex.props(variant === "components" ? styles.componentCell : styles.blockCell)}
						aria-label={cell.title}
					>
						<div {...stylex.props(styles.cellContent)}>{cell.content}</div>
						<h3 {...stylex.props(styles.cellTitle)}>{cell.title}</h3>
					</section>
				))}
				{variant === "components" ? (
					<>
						<div
							aria-hidden
							{...stylex.props(styles.componentFillerCell, styles.componentFillerOne)}
						/>
						<div
							aria-hidden
							{...stylex.props(styles.componentFillerCell, styles.componentFillerLarge)}
						/>
						<div
							aria-hidden
							{...stylex.props(styles.componentFillerCell, styles.componentFillerLarge)}
						/>
					</>
				) : null}
			</div>
		</section>
	);
}

const styles = stylex.create({
	section: {
		width: "100%",
	},
	sectionHeader: {
		gap: tokens["--space-2"],
		paddingBlock: tokens["--space-4"],
		paddingInline: tokens["--space-4"],
		alignItems: "center",
		display: "flex",
	},
	sectionTitle: {
		margin: 0,
		color: tokens["--fg"],
		fontSize: tokens["--font-size-2"],
		fontWeight: tokens["--font-weight-regular"],
		letterSpacing: tokens["--letter-spacing-2"],
		lineHeight: tokens["--line-height-2"],
	},
	componentGrid: {
		gap: "1px",
		paddingInline: 1,
		display: "grid",
		gridTemplateColumns: {
			default: "1fr",
			[breakpoints.sm]: "repeat(2, minmax(0, 1fr))",
			[breakpoints.lg]: "repeat(4, minmax(0, 1fr))",
		},
	},
	blockGrid: {
		gap: "1px",
		display: "grid",
		gridTemplateColumns: {
			default: "1fr",
			[breakpoints.lg]: "repeat(2, minmax(0, 1fr))",
		},
	},
	componentCell: {
		padding: tokens["--space-4"],
		borderRadius: tokens["--radius-md"],
		backgroundColor: tokens["--color-gray-s1"],
		boxSizing: "border-box",
		display: "grid",
		gridTemplateRows: "minmax(0, 1fr) auto",
		minHeight: { default: "220px", [breakpoints.sm]: "248px" },
		minWidth: 0,
	},
	blockCell: {
		padding: tokens["--space-4"],
		borderRadius: tokens["--radius-lg"],
		backgroundColor: tokens["--color-gray-s1"],
		boxSizing: "border-box",
		display: "grid",
		gridTemplateRows: "minmax(0, 1fr) auto",
		minHeight: { default: "320px", [breakpoints.sm]: "360px" },
		minWidth: 0,
	},
	componentFillerCell: {
		borderRadius: tokens["--radius-md"],
		backgroundColor: tokens["--color-gray-s1"],
		boxSizing: "border-box",
		minHeight: { default: "220px", [breakpoints.sm]: "248px" },
	},
	componentFillerOne: {
		display: {
			default: "none",
			[breakpoints.sm]: "block",
		},
	},
	componentFillerLarge: {
		display: {
			default: "none",
			[breakpoints.lg]: "block",
		},
	},
	cellTitle: {
		margin: 0,
		color: tokens["--fg-subtle"],
		fontSize: tokens["--font-size-1"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
		textAlign: "center",
	},
	cellContent: {
		paddingBlock: tokens["--space-4"],
		alignItems: "center",
		display: "flex",
		justifyContent: "center",
		minHeight: 0,
		minWidth: 0,
	},
	buttonStack: {
		gap: tokens["--space-2"],
		alignItems: "center",
		display: "flex",
		flexDirection: "column",
	},
	controlStack: {
		gap: tokens["--space-3"],
		display: "flex",
		flexDirection: "column",
		width: "min(100%, 180px)",
	},
	compactField: {
		width: "min(100%, 180px)",
	},
	compactWide: {
		width: "min(100%, 220px)",
	},
	cardSample: {
		width: "min(100%, 230px)",
	},
	badgeStack: {
		gap: tokens["--space-2"],
		alignItems: "center",
		display: "flex",
		flexWrap: "wrap",
	},
	codeSample: {
		width: "min(100%, 210px)",
	},
	galleryWide: {
		width: "min(100%, 24rem)",
	},
	inputGroupSample: {
		width: "min(100%, 240px)",
	},
	linkStack: {
		gap: tokens["--space-1"],
		display: "flex",
		flexDirection: "column",
		fontSize: tokens["--font-size-1"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
	},
	scrollAreaSample: {
		borderColor: tokens["--border"],
		borderRadius: tokens["--radius-md"],
		borderStyle: "solid",
		borderWidth: "1px",
		backgroundColor: tokens["--canvas"],
		height: "112px",
		width: "min(100%, 210px)",
	},
	scrollAreaContent: {
		padding: tokens["--space-2"],
		gap: tokens["--space-1"],
		display: "flex",
		flexDirection: "column",
	},
	scrollItem: {
		borderRadius: tokens["--radius-sm"],
		paddingBlock: tokens["--space-2"],
		paddingInline: tokens["--space-3"],
		backgroundColor: tokens["--surface"],
		fontSize: tokens["--font-size-1"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
	},
	separatorSample: {
		gap: tokens["--space-2"],
		alignItems: "center",
		color: tokens["--fg-muted"],
		display: "flex",
		flexDirection: "column",
		fontSize: tokens["--font-size-1"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
		width: "min(100%, 180px)",
	},
	toggleRow: {
		padding: 2,
		borderRadius: tokens["--radius-md"],
		gap: 1,
		outline: `1px solid ${tokens["--border"]}`,
		alignItems: "center",
		backgroundColor: tokens["--canvas"],
		display: "inline-flex",
	},
	blockWide: {
		width: "min(100%, 36rem)",
	},
	fullWidth: {
		width: "100%",
	},
});
