import { useLayoutEffect, useState, type ReactNode } from "react";
import * as stylex from "@stylexjs/stylex";
import * as Blocks from "./blocks";
import { BlueprintIcon } from "@phosphor-icons/react/dist/csr/Blueprint";
import { CopyIcon } from "@phosphor-icons/react/dist/csr/Copy";
import { FolderOpenIcon } from "@phosphor-icons/react/dist/csr/FolderOpen";
import { InfoIcon } from "@phosphor-icons/react/dist/csr/Info";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/csr/MagnifyingGlass";
import { StairsIcon } from "@phosphor-icons/react/dist/csr/Stairs";
import { MoonIcon } from "@phosphor-icons/react/dist/csr/Moon";
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import { SunIcon } from "@phosphor-icons/react/dist/csr/Sun";
import { XIcon } from "@phosphor-icons/react/dist/csr/X";
import {
	AlertDialog,
	Avatar,
	Badge,
	Button,
	Callout,
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Checkbox,
	CheckboxGroup,
	Code,
	CodeBlock,
	Collapsible,
	ComboboxField,
	ComboboxMultiple,
	Dialog,
	Drawer,
	EmptyState,
	Heading,
	IconButton,
	InfoTip,
	InputGroup,
	Link,
	Loader,
	Menu,
	Meter,
	NumberField,
	Popover,
	PreviewCard,
	Progress,
	Radio,
	RadioGroup,
	ScrollArea,
	Select,
	Separator,
	Slider,
	Switch,
	Tabs,
	Text,
	Textarea,
	TextField,
	Toast,
	Toggle,
	ToggleGroup,
	Toolbar,
	Tooltip,
} from "./components";
import {
	exampleDefaultValue,
	exampleEffortOptions,
	exampleModelGroups,
	exampleSpeedOptions,
} from "./blocks/model-selector/model-selector.examples";
import { breakpoints, zIndex } from "@/styles/constants.stylex";
import { colors, radius, space } from "@/styles/tokens.stylex";
import { fontSize, fontWeight, letterSpacing, lineHeight } from "@/styles/tokens.stylex";
import { textStyles } from "@/components/text/text.stylex";
import { ThemeProvider, useTheme, type ResolvedThemeMode, type ThemeMode } from "./theme";
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
const themeIconSize = 18;
const themeModeStorageKey = "base-stylex-theme";

function getComponentCells(): GalleryCell[] {
	return [
		{
			title: "AlertDialog",
			content: (
				<AlertDialog.Root>
					<AlertDialog.Trigger render={<Button variant="secondary" />}>Delete item</AlertDialog.Trigger>
					<AlertDialog.Popup>
						<AlertDialog.Header>
							<AlertDialog.Title>Delete item?</AlertDialog.Title>
							<AlertDialog.Description>This action can be cancelled from the dialog.</AlertDialog.Description>
						</AlertDialog.Header>
						<AlertDialog.Footer>
							<AlertDialog.Close render={<Button variant="ghost" />}>Cancel</AlertDialog.Close>
							<AlertDialog.Close render={<Button variant="danger" />}>Delete</AlertDialog.Close>
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
					<Badge hue="danger" variant="solid">
						Danger
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
			title: "Button",
			content: (
				<div {...stylex.props(styles.buttonStack)}>
					<Button size="sm" startSlot={<PlusIcon aria-hidden weight="bold" />} variant="secondary">
						Create worker
					</Button>
					<Button size="sm" startSlot={<PlusIcon aria-hidden weight="bold" />}>
						Create worker
					</Button>
					<Button size="sm" startSlot={<PlusIcon aria-hidden weight="bold" />} variant="ghost">
						Create worker
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
				<Card size="sm" style={styles.cardSample}>
					<CardHeader>
						<CardTitle>Next steps</CardTitle>
						<CardDescription>Review changes</CardDescription>
					</CardHeader>
					<CardFooter>
						<Button size="xs" variant="ghost">
							View details
						</Button>
					</CardFooter>
				</Card>
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
			content: <CodeBlock style={styles.codeSample}>{"const sum = (a, b) => {\n  return a + b;\n};"}</CodeBlock>,
		},
		{
			title: "Collapsible",
			content: (
				<Collapsible.Root defaultOpen style={styles.compactWide}>
					<Collapsible.Trigger size="sm">
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
			title: "ComboboxField",
			content: <ComboboxField label="Framework" items={componentNames} placeholder="Select an issue..." />,
		},
		{
			title: "ComboboxMultiple",
			content: (
				<ComboboxMultiple
					label="Libraries"
					items={componentNames}
					defaultValue={["React", "Solid"]}
					placeholder="Choose libraries"
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
					<Drawer.Trigger render={<Button size="sm" variant="secondary" />}>Open drawer</Drawer.Trigger>
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
									<Drawer.Close render={<Button size="sm" />}>Done</Drawer.Close>
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
					title="No projects yet">
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
			content: <IconButton icon={<PlusIcon aria-hidden weight="bold" />} label="Add item" variant="secondary" />,
		},
		{
			title: "InfoTip",
			content: <InfoTip content="This setting applies to everyone in the workspace." />,
		},
		{
			title: "InputGroup",
			content: (
				<InputGroup.Root style={styles.inputGroupSample}>
					<InputGroup.Addon>
						<FileSearchIcon aria-hidden size={13} weight="bold" />
					</InputGroup.Addon>
					<InputGroup.Input aria-label="Worker URL" defaultValue="stylex-lab" />
					<InputGroup.Actions>
						<IconButton
							icon={<ArrowRightIcon aria-hidden weight="bold" />}
							label="Copy URL"
							size="xs"
							tooltip={false}
							variant="ghost"
						/>
					</InputGroup.Actions>
				</InputGroup.Root>
			),
		},
		{
			title: "Link",
			content: (
				<div {...stylex.props(styles.linkStack)}>
					<Link href="#top">Default link</Link>
					<Link aria-current="page" href="#top">
						Current color link
					</Link>
					<Link href="https://base-ui.com/" external>
						External link
					</Link>
				</div>
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
						<Menu.Item variant="danger">
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
				<Meter.Root value={100} max={500} color={colors["--warning"]}>
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
			title: "PreviewCard",
			content: (
				<PreviewCard.Root>
					<PreviewCard.Trigger href="#top">Hover preview</PreviewCard.Trigger>
					<PreviewCard.Popup>
						<PreviewCard.Content>
							<PreviewCard.Title>Base + StyleX Lab</PreviewCard.Title>
							<PreviewCard.Description>Reusable primitives and blocks.</PreviewCard.Description>
						</PreviewCard.Content>
					</PreviewCard.Popup>
				</PreviewCard.Root>
			),
		},
		{
			title: "Progress",
			content: (
				<Progress.Root value={62} aria-label="Build progress">
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
				<ScrollArea
					label="Recent component updates"
					style={styles.scrollAreaSample}
					contentStyle={styles.scrollAreaContent}>
					{["Button refined", "Menu grouped", "Toast anchored", "Dialog opened", "Tooltip tuned"].map((item) => (
						<div key={item} {...stylex.props(styles.scrollItem)}>
							{item}
						</div>
					))}
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
			title: "Switch",
			content: <Switch label="Realtime sync" defaultChecked size="sm" />,
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
			content: <Textarea label="Message" placeholder="Enter your name" rows={2} style={styles.compactField} />,
		},
		{
			title: "TextField",
			content: (
				<div {...stylex.props(styles.controlStack)}>
					<TextField label="Name" placeholder="Type something..." style={styles.compactField} />
					<TextField
						label="Project"
						defaultValue="Invalid"
						error="Use at least 8 characters."
						style={styles.compactField}
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
					<Toggle>
						<TextBIcon aria-hidden weight="bold" />
						Bold
					</Toggle>
				</div>
			),
		},
		{
			title: "ToggleGroup",
			content: (
				<div {...stylex.props(styles.toggleRow)}>
					<ToggleGroup defaultValue={["bold"]}>
						<Toggle value="thumbs-down" aria-label="Thumbs down">
							<ThumbsDownIcon aria-hidden weight="regular" />
						</Toggle>
						<Toggle value="thumbs-up" aria-label="Thumbs up">
							<ThumbsUpIcon aria-hidden weight="regular" />
						</Toggle>
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
						<MagnifyingGlassIcon aria-hidden size={15} weight="bold" />
					</Toolbar.Button>
					<Toolbar.Button aria-label="Add">
						<PlusIcon aria-hidden size={15} weight="bold" />
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
								<IconButton icon={<PlusIcon aria-hidden />} label="Add item" tooltip={false} variant="secondary" />
							}
						/>
						<Tooltip.Popup>Add</Tooltip.Popup>
					</Tooltip.Root>
				</Tooltip.Provider>
			),
		},
	];
}

function getBlockCells(): GalleryCell[] {
	return [
		{
			title: "AgentActionApproval",
			content: (
				<Blocks.AgentActionApproval.Root>
					<Blocks.AgentActionApproval.Header>
						<Blocks.AgentActionApproval.Title>Approve command</Blocks.AgentActionApproval.Title>
						<Badge hue="accent" size="sm">
							Review
						</Badge>
					</Blocks.AgentActionApproval.Header>
					<Blocks.AgentActionApproval.Content>
						<Blocks.AgentActionApproval.Summary>
							<Blocks.AgentActionApproval.Icon>
								<BlueprintIcon aria-hidden size={14} weight="duotone" />
							</Blocks.AgentActionApproval.Icon>
							<Blocks.AgentActionApproval.SummaryContent>
								<Blocks.AgentActionApproval.Action>Run npm test</Blocks.AgentActionApproval.Action>
								<Blocks.AgentActionApproval.ActionDescription>
									Executes the repository test suite.
								</Blocks.AgentActionApproval.ActionDescription>
							</Blocks.AgentActionApproval.SummaryContent>
						</Blocks.AgentActionApproval.Summary>
						<Blocks.AgentActionApproval.Details>
							<Blocks.AgentActionApproval.Detail>
								<Blocks.AgentActionApproval.DetailLabel>cwd</Blocks.AgentActionApproval.DetailLabel>
								<Blocks.AgentActionApproval.DetailValue>/Sites/stylex</Blocks.AgentActionApproval.DetailValue>
							</Blocks.AgentActionApproval.Detail>
						</Blocks.AgentActionApproval.Details>
					</Blocks.AgentActionApproval.Content>
					<Blocks.AgentActionApproval.Footer>
						<Blocks.AgentActionApproval.Actions>
							<Button size="sm" variant="ghost">
								Deny
							</Button>
							<Button size="sm">Allow</Button>
						</Blocks.AgentActionApproval.Actions>
					</Blocks.AgentActionApproval.Footer>
				</Blocks.AgentActionApproval.Root>
			),
		},
		{
			title: "AsyncJobProgress",
			content: (
				<Blocks.AsyncJobProgress.Root status="running" value={68}>
					<Blocks.AsyncJobProgress.Header>
						<Blocks.AsyncJobProgress.Heading>
							<Blocks.AsyncJobProgress.Title>Publishing package</Blocks.AsyncJobProgress.Title>
							<Blocks.AsyncJobProgress.Description>Bundling component artifacts.</Blocks.AsyncJobProgress.Description>
						</Blocks.AsyncJobProgress.Heading>
						<Blocks.AsyncJobProgress.Status />
					</Blocks.AsyncJobProgress.Header>
					<Blocks.AsyncJobProgress.Progress />
					<Blocks.AsyncJobProgress.Actions>
						<Button size="sm" variant="ghost">
							Cancel
						</Button>
					</Blocks.AsyncJobProgress.Actions>
				</Blocks.AsyncJobProgress.Root>
			),
		},
		{
			title: "ConfirmationDialog",
			content: (
				<Blocks.ConfirmationDialog.Root
					trigger={
						<Button size="sm" variant="secondary">
							Open confirmation
						</Button>
					}
					successToast={false}>
					<Blocks.ConfirmationDialog.Header>
						<Blocks.ConfirmationDialog.Visual>
							<BlueprintIcon aria-hidden size={20} weight="duotone" />
						</Blocks.ConfirmationDialog.Visual>
						<Blocks.ConfirmationDialog.Title>Confirm release</Blocks.ConfirmationDialog.Title>
						<Blocks.ConfirmationDialog.Description>
							This will publish the current component build.
						</Blocks.ConfirmationDialog.Description>
					</Blocks.ConfirmationDialog.Header>
					<Blocks.ConfirmationDialog.Body>Version 0.0.0 is ready for review.</Blocks.ConfirmationDialog.Body>
					<Blocks.ConfirmationDialog.Footer>
						<Blocks.ConfirmationDialog.Actions>
							<Blocks.ConfirmationDialog.Cancel size="sm">Cancel</Blocks.ConfirmationDialog.Cancel>
							<Blocks.ConfirmationDialog.Confirm size="sm">Confirm</Blocks.ConfirmationDialog.Confirm>
						</Blocks.ConfirmationDialog.Actions>
					</Blocks.ConfirmationDialog.Footer>
				</Blocks.ConfirmationDialog.Root>
			),
		},
		{
			title: "CopyButton",
			content: (
				<Blocks.CopyButton value="yo@bob.fyi" variant="ghost">
					yo@bob.fyi
				</Blocks.CopyButton>
			),
		},
		{
			title: "GoalToolbar",
			content: (
				<div className={stylex.props(styles.blockWide).className}>
					<Blocks.GoalToolbar active description="Redesign the demo gallery" />
				</div>
			),
		},
		{
			title: "ModelSelector",
			content: (
				<Blocks.ModelSelector.Root
					groups={exampleModelGroups}
					effortOptions={exampleEffortOptions}
					speedOptions={exampleSpeedOptions}
					defaultValue={exampleDefaultValue}>
					<Blocks.ModelSelector.Trigger size="sm" variant="secondary" />
					<Blocks.ModelSelector.Popup />
				</Blocks.ModelSelector.Root>
			),
		},
		{
			title: "PasswordField",
			content: (
				<Blocks.PasswordField.Root defaultValue="correct-horse-2" style={styles.blockField}>
					<Blocks.PasswordField.Label>Password</Blocks.PasswordField.Label>
					<Blocks.PasswordField.Control>
						<Blocks.PasswordField.Input />
						<Blocks.PasswordField.Actions>
							<Blocks.PasswordField.VisibilityToggle />
						</Blocks.PasswordField.Actions>
					</Blocks.PasswordField.Control>
					<Blocks.PasswordField.Meter requirements={[/[a-z]/, /[A-Z]/, /\d/, /.{12,}/]} />
				</Blocks.PasswordField.Root>
			),
		},
		{
			title: "PromptComposer",
			content: (
				<Blocks.PromptComposer.Root
					defaultValue="Summarize the component API changes"
					onSubmit={() => {}}
					clearOnSubmit={false}
					style={styles.blockWide}>
					<Blocks.PromptComposer.Surface>
						<Blocks.PromptComposer.Input rows={2} />
						<Blocks.PromptComposer.Footer>
							<Blocks.PromptComposer.Options>
								<Menu.Root>
									<Blocks.PromptComposer.AddTrigger />
								</Menu.Root>
								<Button size="sm" variant="ghost">
									Context
								</Button>
							</Blocks.PromptComposer.Options>
							<Blocks.PromptComposer.Actions>
								<Blocks.PromptComposer.Submit />
							</Blocks.PromptComposer.Actions>
						</Blocks.PromptComposer.Footer>
					</Blocks.PromptComposer.Surface>
				</Blocks.PromptComposer.Root>
			),
		},
		{
			title: "StreamingResponse",
			content: (
				<Blocks.StreamingResponse.Root status="streaming">
					<Blocks.StreamingResponse.Status />
					<Blocks.StreamingResponse.Content>
						The component grid now separates primitives from blocks and keeps larger compositions in a roomier layout.
					</Blocks.StreamingResponse.Content>
					<Blocks.StreamingResponse.Actions>
						<Toolbar.Button aria-label="Copy response">
							<CopyIcon aria-hidden size={15} weight="bold" />
						</Toolbar.Button>
					</Blocks.StreamingResponse.Actions>
				</Blocks.StreamingResponse.Root>
			),
		},
		{
			title: "ToolActivityTimeline",
			content: (
				<Blocks.ToolActivityTimeline.Root>
					<Blocks.ToolActivityTimeline.Item status="complete">
						<Blocks.ToolActivityTimeline.Marker />
						<Blocks.ToolActivityTimeline.Content>
							<Blocks.ToolActivityTimeline.Header>
								<Blocks.ToolActivityTimeline.Title>Read exports</Blocks.ToolActivityTimeline.Title>
								<Blocks.ToolActivityTimeline.Description>
									Mapped components and blocks.
								</Blocks.ToolActivityTimeline.Description>
								<Blocks.ToolActivityTimeline.Metadata>
									<Blocks.ToolActivityTimeline.Status />
								</Blocks.ToolActivityTimeline.Metadata>
							</Blocks.ToolActivityTimeline.Header>
						</Blocks.ToolActivityTimeline.Content>
					</Blocks.ToolActivityTimeline.Item>
					<Blocks.ToolActivityTimeline.Item status="running">
						<Blocks.ToolActivityTimeline.Marker />
						<Blocks.ToolActivityTimeline.Content>
							<Blocks.ToolActivityTimeline.Header>
								<Blocks.ToolActivityTimeline.Title>Verify layout</Blocks.ToolActivityTimeline.Title>
								<Blocks.ToolActivityTimeline.Description>
									Check desktop and mobile grids.
								</Blocks.ToolActivityTimeline.Description>
								<Blocks.ToolActivityTimeline.Metadata>
									<Blocks.ToolActivityTimeline.Status />
								</Blocks.ToolActivityTimeline.Metadata>
							</Blocks.ToolActivityTimeline.Header>
						</Blocks.ToolActivityTimeline.Content>
					</Blocks.ToolActivityTimeline.Item>
				</Blocks.ToolActivityTimeline.Root>
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
			}>
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

function App() {
	const [mode, setMode] = useState<ThemeMode>(getInitialThemeMode);

	useLayoutEffect(() => {
		localStorage.setItem(themeModeStorageKey, mode);
	}, [mode]);

	return (
		<ThemeProvider mode={mode} render={<div id="top" />} style={styles.app}>
			<AppContent onModeChange={setMode} />
		</ThemeProvider>
	);
}

function AppContent({ onModeChange }: { onModeChange: (mode: ThemeMode) => void }) {
	const { resolvedMode } = useTheme();
	const nextMode: ResolvedThemeMode = resolvedMode === "light" ? "dark" : "light";

	return (
		<>
			<header {...stylex.props(styles.header)}>
				<a href="#top" {...stylex.props(textStyles.supporting, styles.brand)}>
					<span {...stylex.props(styles.brandMark)}>
						<StairsIcon aria-hidden size={16} weight="duotone" />
					</span>
					<span>BaseX</span>
				</a>
				<div {...stylex.props(styles.headerMeta)}>
					<Link href="#components" style={styles.headerNavLink}>
						components
					</Link>{" "}
					<Link href="#blocks" style={styles.headerNavLink}>
						blocks
					</Link>
					<Separator orientation="vertical" />
					<IconButton
						icon={
							<span {...stylex.props(styles.themeIcon)}>
								{resolvedMode === "light" ? (
									<MoonIcon aria-hidden size={themeIconSize} weight="duotone" />
								) : (
									<SunIcon aria-hidden size={themeIconSize} weight="duotone" />
								)}
							</span>
						}
						label={`Switch to ${nextMode} mode`}
						variant="ghost"
						shape="circle"
						size="sm"
						onClick={() => onModeChange(nextMode)}
					/>
				</div>
			</header>

			<main>
				<GallerySection title="Components" cells={getComponentCells()} variant="components" />
				<GallerySection title="Blocks" cells={getBlockCells()} variant="blocks" />
			</main>
		</>
	);
}

function getInitialThemeMode(): ThemeMode {
	if (typeof window === "undefined") return "system";
	const storedMode = localStorage.getItem(themeModeStorageKey);
	return storedMode === "light" || storedMode === "dark" || storedMode === "system" ? storedMode : "system";
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
						aria-label={cell.title}>
						<div {...stylex.props(styles.cellContent)}>{cell.content}</div>
						<h3 {...stylex.props(styles.cellTitle)}>{cell.title}</h3>
					</section>
				))}
				{variant === "components" ? (
					<>
						<div aria-hidden {...stylex.props(styles.componentFillerCell, styles.componentFillerOne)} />
						<div aria-hidden {...stylex.props(styles.componentFillerCell, styles.componentFillerTwo)} />
						<div aria-hidden {...stylex.props(styles.componentFillerCell, styles.componentFillerThree)} />
					</>
				) : null}
			</div>
		</section>
	);
}

const styles = stylex.create({
	app: {
		backgroundColor: colors["--canvas"],
		color: colors["--text"],
		minHeight: "100svh",
	},
	header: {
		paddingInline: { default: space[4], [breakpoints.sm]: space[4] },
		alignItems: "center",
		backgroundImage: `linear-gradient(to bottom, ${colors["--canvas"]}, transparent)`,
		display: "flex",
		justifyContent: "space-between",
		position: "sticky",
		zIndex: zIndex.sticky,
		height: "48px",
		top: 0,
	},
	brand: {
		gap: space[2],
		textDecoration: "none",
		alignItems: "center",
		color: colors["--text"],
		display: "inline-flex",
	},
	brandMark: {
		borderRadius: radius.xs,
		outline: `1px solid ${colors["--canvas"]}`,
		alignItems: "center",
		aspectRatio: 1,
		backgroundColor: colors["--border"],
		color: colors["--text-muted"],
		display: "inline-flex",
		justifyContent: "center",
		height: "20px",
	},
	headerMeta: {
		gap: space[3],
		alignItems: "center",
		display: "flex",
	},
	headerNavLink: {
		fontSize: fontSize.x1,
	},
	themeIcon: {
		alignItems: "center",
		display: "inline-flex",
		justifyContent: "center",
		lineHeight: 0,
		height: `${themeIconSize}px`,
		width: `${themeIconSize}px`,
	},
	section: {
		width: "100%",
	},
	sectionHeader: {
		gap: space[2],
		paddingBlock: space[4],
		paddingInline: space[4],
		alignItems: "center",
		// backgroundColor: colors["--surface"],
		// borderBottomColor: colors["--border"],
		// borderBottomStyle: "solid",
		// borderBottomWidth: "1px",
		display: "flex",
	},
	sectionTitle: {
		margin: 0,
		color: colors["--text"],
		fontSize: fontSize.x2,
		fontWeight: fontWeight.regular,
		letterSpacing: letterSpacing.x2,
		lineHeight: lineHeight.x2,
	},
	componentGrid: {
		gap: "1px",
		paddingInline: 1,
		// borderBottomColor: colors["--border"],
		// borderBottomStyle: "solid",
		// borderBottomWidth: "1px",
		// borderLeftColor: colors["--border"],
		// borderLeftStyle: "solid",
		// borderLeftWidth: "1px",
		// borderRightColor: colors["--border"],
		// borderRightStyle: "solid",
		// borderRightWidth: "1px",
		display: "grid",
		gridTemplateColumns: {
			default: "1fr",
			[breakpoints.sm]: "repeat(2, minmax(0, 1fr))",
			[breakpoints.lg]: "repeat(4, minmax(0, 1fr))",
		},
	},
	blockGrid: {
		gap: "1px",
		// backgroundColor: colors["--border"],
		// borderBottomColor: colors["--border"],
		// borderBottomStyle: "solid",
		// borderBottomWidth: "1px",
		// borderLeftColor: colors["--border"],
		// borderLeftStyle: "solid",
		// borderLeftWidth: "1px",
		// borderRightColor: colors["--border"],
		// borderRightStyle: "solid",
		// borderRightWidth: "1px",
		display: "grid",
		gridTemplateColumns: {
			default: "1fr",
			[breakpoints.lg]: "repeat(2, minmax(0, 1fr))",
		},
	},
	componentCell: {
		padding: space[4],
		borderRadius: radius.sm,
		backgroundColor: colors["--gray-s2"],
		boxSizing: "border-box",
		display: "grid",
		gridTemplateRows: "minmax(0, 1fr) auto",
		minHeight: { default: "220px", [breakpoints.sm]: "248px" },
		minWidth: 0,
	},
	blockCell: {
		padding: space[4],
		borderRadius: radius.md,
		backgroundColor: colors["--gray-s2"],
		boxSizing: "border-box",
		display: "grid",
		gridTemplateRows: "minmax(0, 1fr) auto",
		minHeight: { default: "320px", [breakpoints.sm]: "360px" },
		minWidth: 0,
	},
	componentFillerCell: {
		borderRadius: radius.md,
		backgroundColor: colors["--gray-s2"],
		boxSizing: "border-box",
		minHeight: { default: "220px", [breakpoints.sm]: "248px" },
	},
	componentFillerOne: {
		display: {
			default: "none",
			[breakpoints.sm]: "block",
		},
	},
	componentFillerTwo: {
		display: {
			default: "none",
			[breakpoints.lg]: "block",
		},
	},
	componentFillerThree: {
		display: {
			default: "none",
			[breakpoints.lg]: "block",
		},
	},
	cellTitle: {
		margin: 0,
		color: colors["--text-subtle"],
		fontSize: fontSize.x1,
		letterSpacing: letterSpacing.x1,
		lineHeight: lineHeight.x1,
		textAlign: "center",
	},
	cellContent: {
		paddingBlock: space[4],
		alignItems: "center",
		display: "flex",
		justifyContent: "center",
		minHeight: 0,
		minWidth: 0,
	},
	buttonStack: {
		gap: space[2],
		alignItems: "center",
		display: "flex",
		flexDirection: "column",
	},
	controlStack: {
		gap: space[3],
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
		gap: space[2],
		alignItems: "center",
		display: "flex",
		flexWrap: "wrap",
	},
	codeSample: {
		width: "min(100%, 210px)",
	},
	inputGroupSample: {
		width: "min(100%, 240px)",
	},
	linkStack: {
		gap: space[1],
		display: "flex",
		flexDirection: "column",
		fontSize: fontSize.x1,
		letterSpacing: letterSpacing.x1,
		lineHeight: lineHeight.x1,
	},
	scrollAreaSample: {
		// backgroundColor: colors["--surface-subtle"],
		borderColor: colors["--border"],
		borderRadius: radius.md,
		borderStyle: "solid",
		borderWidth: "1px",
		height: "112px",
		width: "min(100%, 210px)",
	},
	scrollAreaContent: {
		padding: space[2],
		gap: space[1],
		display: "flex",
		flexDirection: "column",
	},
	scrollItem: {
		borderRadius: radius.sm,
		paddingBlock: space[2],
		paddingInline: space[3],
		backgroundColor: colors["--surface"],
		fontSize: fontSize.x1,
		letterSpacing: letterSpacing.x1,
		lineHeight: lineHeight.x1,
	},
	separatorSample: {
		gap: space[2],
		alignItems: "center",
		color: colors["--text-muted"],
		display: "flex",
		flexDirection: "column",
		fontSize: fontSize.x1,
		letterSpacing: letterSpacing.x1,
		lineHeight: lineHeight.x1,
		width: "min(100%, 180px)",
	},
	toggleRow: {
		padding: 2,
		borderRadius: radius.md,
		gap: 1,
		outline: `1px solid ${colors["--border"]}`,
		alignItems: "center",
		backgroundColor: colors["--canvas"],
		display: "inline-flex",
	},
	blockWide: {
		width: "min(100%, 36rem)",
	},
	blockField: {
		width: "min(100%, 24rem)",
	},
});

export default App;
