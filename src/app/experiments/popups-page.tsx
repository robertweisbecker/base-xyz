import * as stylex from "@stylexjs/stylex";
import { useRef, useState } from "react";
import { ConfirmationDialog } from "@/blocks";
import {
	AlertDialog,
	Button,
	Checkbox,
	CommandPalette,
	createLinkPreviewHandle,
	createPopoverHandle,
	createTooltipHandle,
	Dialog,
	Drawer,
	LinkPreview,
	Menu,
	Popover,
	ScrollArea,
	Select,
	Stack,
	Text,
	Textarea,
	TextField,
	Tooltip,
	Toast,
} from "@/components";
import { popupMotionStyles } from "@/components/popover/popover.stylex";
import { tokens } from "@/theme/tokens.stylex";
import { ExperimentPage } from "./experiment-page";

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

const longFormSections = [
	"Choose the right surface for the task.",
	"Keep titles specific and action-oriented.",
	"Move focus into the popup when it opens.",
	"Keep keyboard focus contained for modal work.",
	"Return focus to the trigger after dismissal.",
	"Use explicit close actions in addition to Escape.",
	"Allow translated labels and descriptions to wrap.",
	"Keep destructive actions visually distinct.",
	"Preserve useful page context behind the backdrop.",
	"Verify long content at short viewport heights.",
];

const drawerSnapPoints: Array<string | number> = ["22rem", "36rem", 1];

const sharedTooltip = createTooltipHandle<string>();
const sharedTooltipItems = [
	{ label: "Notifications", content: "Review notification settings" },
	{ label: "Information", content: "Read workspace information" },
	{ label: "Settings", content: "Open workspace settings" },
];

type SharedPopupPayload = {
	title: string;
	description: string;
};

const sharedLinkPreview = createLinkPreviewHandle<SharedPopupPayload>();
const sharedPreviewItems: Array<SharedPopupPayload & { label: string }> = [
	{ label: "Dialog", title: "Dialog", description: "A focused surface for short, interruptive workflows." },
	{ label: "Drawer", title: "Drawer", description: "A bottom sheet for contextual tasks and progressive disclosure." },
	{ label: "Popover", title: "Popover", description: "An anchored surface for lightweight supporting content." },
];

const sharedPopover = createPopoverHandle<SharedPopupPayload>();
const sharedPopoverItems: Array<SharedPopupPayload & { label: string }> = [
	{ label: "Inbox", title: "Inbox zero", description: "There are no unread messages." },
	{
		label: "Mentions",
		title: "Two mentions",
		description: "Alex mentioned you in Design critique and Release planning.",
	},
	{ label: "Updates", title: "Product updates", description: "The component lab was updated a few seconds ago." },
];

export function PopupsPage() {
	return (
		<ExperimentPage
			description="Open each popup directly, then exercise focus, dismissal, scrolling, nesting, and stacking behavior."
			title="Popups">
			<Stack data-popup-trigger-grid align="start" gap={3} orientation="horizontal" wrap="wrap">
				<MenuExample />
				<SelectExample />
				<PopoverExample />
				<LinkPreviewExample />
				<TooltipExample />
				<CommandPaletteExample />
				<DialogExample />
				<AlertDialogExample />
				<ConfirmationDialogExample />
				<DrawerExample />
				<NestedPopupsExample />
				<SharedTransitionsExample />
				<TooltipToAnchoredToastExample />
			</Stack>
		</ExperimentPage>
	);
}

function SharedTransitionsExample() {
	return (
		<Dialog.Root>
			<Dialog.Trigger render={<Button variant="neutral" />}>Shared transitions</Dialog.Trigger>
			<Dialog.Popup xstyle={styles.largeDialog}>
				<Dialog.Header>
					<Dialog.Title>Shared transitions</Dialog.Title>
					<Dialog.Description>
						Move focus or pointer between each group’s triggers to reuse one animated popup.
					</Dialog.Description>
				</Dialog.Header>
				<Dialog.Body>
					<Stack gap={6}>
						<SharedTooltipTransition />
						<SharedLinkPreviewTransition />
						<SharedPopoverTransition />
					</Stack>
				</Dialog.Body>
				<Dialog.Footer>
					<Dialog.Close render={<Button variant="neutral" />}>Done</Dialog.Close>
				</Dialog.Footer>
			</Dialog.Popup>
		</Dialog.Root>
	);
}

function SharedTooltipTransition() {
	return (
		<Tooltip.Provider>
			<Stack aria-label="Shared Tooltip transition" gap={2} render={<section />}>
				<Text color="muted" size="1">
					Tooltip
				</Text>
				<Stack gap={2} orientation="horizontal" wrap="wrap">
					{sharedTooltipItems.map(({ label, content }) => (
						<Tooltip.Trigger
							key={label}
							closeDelay={100}
							delay={0}
							handle={sharedTooltip}
							payload={content}
							render={<Button size="sm" variant="secondary" />}>
							{label}
						</Tooltip.Trigger>
					))}
				</Stack>
				<Tooltip.Root handle={sharedTooltip}>
					{({ payload }) => (
						<Tooltip.Popup
							data-shared-transition-popup="tooltip"
							positionerProps={{
								className: "popup-transition-positioner-tooltip",
								xstyle: popupMotionStyles.movingPositioner,
							}}
							xstyle={popupMotionStyles.movingPopup}>
							<Tooltip.Viewport>{payload}</Tooltip.Viewport>
						</Tooltip.Popup>
					)}
				</Tooltip.Root>
			</Stack>
		</Tooltip.Provider>
	);
}

function SharedLinkPreviewTransition() {
	return (
		<Stack aria-label="Shared Link Preview transition" gap={2} render={<section />}>
			<Text color="muted" size="1">
				Link Preview
			</Text>
			<Stack gap={2} orientation="horizontal" wrap="wrap">
				{sharedPreviewItems.map(({ label, title, description }) => (
					<LinkPreview.Trigger
						key={label}
						closeDelay={100}
						delay={0}
						handle={sharedLinkPreview}
						payload={{ title, description }}
						render={<Button size="sm" variant="secondary" />}
						xstyle={styles.linkPreviewButton}>
						{label}
					</LinkPreview.Trigger>
				))}
			</Stack>
			<LinkPreview.Root handle={sharedLinkPreview}>
				{({ payload }) => (
					<LinkPreview.Popup
						data-shared-transition-popup="link-preview"
						positionerProps={{
							className: "popup-transition-positioner-link-preview",
							xstyle: popupMotionStyles.movingPositioner,
						}}
						xstyle={popupMotionStyles.movingPopup}>
						<LinkPreview.Viewport>
							{payload ? (
								<LinkPreview.Content>
									<LinkPreview.Title>{payload.title}</LinkPreview.Title>
									<LinkPreview.Description>{payload.description}</LinkPreview.Description>
								</LinkPreview.Content>
							) : null}
						</LinkPreview.Viewport>
					</LinkPreview.Popup>
				)}
			</LinkPreview.Root>
		</Stack>
	);
}

function SharedPopoverTransition() {
	return (
		<Stack aria-label="Shared Popover transition" gap={2} render={<section />}>
			<Text color="muted" size="1">
				Popover
			</Text>
			<Stack gap={2} orientation="horizontal" wrap="wrap">
				{sharedPopoverItems.map(({ label, title, description }) => (
					<Popover.Trigger
						key={label}
						handle={sharedPopover}
						payload={{ title, description }}
						render={<Button size="sm" variant="secondary" />}>
						{label}
					</Popover.Trigger>
				))}
			</Stack>
			<Popover.Root handle={sharedPopover}>
				{({ payload }) => (
					<Popover.Popup
						data-shared-transition-popup="popover"
						positionerProps={{
							className: "popup-transition-positioner-popover",
							xstyle: popupMotionStyles.movingPositioner,
						}}
						xstyle={popupMotionStyles.movingPopup}>
						<Popover.Viewport>
							<Popover.Title>{payload?.title}</Popover.Title>
							<Popover.Description>{payload?.description}</Popover.Description>
						</Popover.Viewport>
					</Popover.Popup>
				)}
			</Popover.Root>
		</Stack>
	);
}

function TooltipToAnchoredToastExample() {
	const [toastManager] = useState(() => Toast.createAnchoredToastManager());

	return (
		<Toast.AnchoredProvider toastManager={toastManager} timeout={1600}>
			<Tooltip.Provider>
				<TooltipToAnchoredToastControl />
			</Tooltip.Provider>
		</Toast.AnchoredProvider>
	);
}

function TooltipToAnchoredToastControl() {
	const manager = Toast.useAnchoredToastManager();
	const anchorRef = useRef<HTMLButtonElement | null>(null);
	const [feedbackVisible, setFeedbackVisible] = useState(false);

	async function showFeedback() {
		setFeedbackVisible(true);
		let description = "Copied invite link";
		let status: "success" | "error" = "success";
		let tone: "neutral" | "error" = "neutral";

		try {
			if (!navigator.clipboard) throw new Error("Clipboard API unavailable");
			await navigator.clipboard.writeText("https://example.com/invite/design-system");
		} catch {
			description = "Unable to copy invite link";
			status = "error";
			tone = "error";
		}

		manager.add({
			id: "popup-lab-tooltip-feedback",
			description,
			timeout: 1600,
			onClose: () => setFeedbackVisible(false),
			positionerProps: {
				anchor: anchorRef.current,
				align: "center",
				side: "top",
				sideOffset: 6,
			},
			data: {
				variant: "tooltip",
				tone,
				status,
				dismissible: false,
			},
		});
	}

	return (
		<Tooltip.Root disabled={feedbackVisible}>
			<Tooltip.Trigger
				ref={anchorRef}
				closeOnClick={false}
				delay={0}
				render={<Button onClick={() => void showFeedback()} variant="neutral" />}>
				Tooltip to toast
			</Tooltip.Trigger>
			<Tooltip.Popup>Copy invite link</Tooltip.Popup>
		</Tooltip.Root>
	);
}

function MenuExample() {
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

function SelectExample() {
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

function PopoverExample() {
	return (
		<Popover.Root>
			<Popover.Trigger render={<Button variant="neutral" />}>Popover</Popover.Trigger>
			<Popover.Popup positionerProps={{ align: "start" }} showClose>
				<Popover.Title>Create a preview deployment</Popover.Title>
				<Popover.Description>Mixed content combines supporting copy, form controls, and actions.</Popover.Description>
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

function LinkPreviewExample() {
	return (
		<LinkPreview.Root>
			<LinkPreview.Trigger
				closeDelay={100}
				delay={0}
				xstyle={styles.linkPreviewButton}
				render={<Button variant="neutral" />}>
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

function TooltipExample() {
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

function CommandPaletteExample() {
	return (
		<CommandPalette.Root<string>
			items={commandItems}
			itemToStringValue={(item) => item}
			label="Command palette example"
			trigger={<Button variant="neutral">Command Palette</Button>}>
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

function DialogExample() {
	return (
		<Dialog.Root>
			<Dialog.Trigger render={<Button variant="neutral" />}>Dialog</Dialog.Trigger>
			<Dialog.Popup>
				<Dialog.Header>
					<Dialog.Title>Dialog variations</Dialog.Title>
					<Dialog.Description>Open sizes and scroll behaviors without leaving the popup laboratory.</Dialog.Description>
				</Dialog.Header>
				<Dialog.Body>
					<Stack gap={3} orientation="horizontal" wrap="wrap">
						<SmallDialog />
						<LargeDialog />
						<PopupScrollDialog />
						<InsideScrollDialog />
						<OutsideScrollDialog />
					</Stack>
				</Dialog.Body>
				<Dialog.Footer>
					<Dialog.Close render={<Button variant="neutral" />}>Done</Dialog.Close>
				</Dialog.Footer>
			</Dialog.Popup>
		</Dialog.Root>
	);
}

function SmallDialog() {
	return (
		<Dialog.Root>
			<Dialog.Trigger render={<Button size="sm" variant="secondary" />}>Small</Dialog.Trigger>
			<Dialog.Popup xstyle={styles.smallDialog}>
				<Dialog.Header>
					<Dialog.Title>Small dialog</Dialog.Title>
					<Dialog.Description>A compact confirmation-sized surface.</Dialog.Description>
				</Dialog.Header>
				<Dialog.Body>Use this size for short, focused tasks.</Dialog.Body>
				<Dialog.Footer>
					<Dialog.Close render={<Button variant="neutral" />}>Close</Dialog.Close>
				</Dialog.Footer>
			</Dialog.Popup>
		</Dialog.Root>
	);
}

function LargeDialog() {
	return (
		<Dialog.Root>
			<Dialog.Trigger render={<Button size="sm" variant="secondary" />}>Large</Dialog.Trigger>
			<Dialog.Popup xstyle={styles.largeDialog}>
				<Dialog.Header>
					<Dialog.Title>Large dialog</Dialog.Title>
					<Dialog.Description>A wider workspace for a composed form.</Dialog.Description>
				</Dialog.Header>
				<Dialog.Body>
					<Stack gap={4}>
						<TextField label="Project name" defaultValue="Design system" />
						<Textarea label="Release notes" rows={5} />
					</Stack>
				</Dialog.Body>
				<Dialog.Footer>
					<Dialog.Close render={<Button variant="neutral" />}>Cancel</Dialog.Close>
					<Dialog.Close render={<Button />}>Save</Dialog.Close>
				</Dialog.Footer>
			</Dialog.Popup>
		</Dialog.Root>
	);
}

function PopupScrollDialog() {
	return (
		<Dialog.Root>
			<Dialog.Trigger render={<Button size="sm" variant="secondary" />}>Popup scroll</Dialog.Trigger>
			<Dialog.Popup scrollBehavior="popup">
				<Dialog.Header>
					<Dialog.Title>Popup scrolling</Dialog.Title>
					<Dialog.Description>The entire popup scrolls while staying within the viewport.</Dialog.Description>
				</Dialog.Header>
				<Dialog.Body>
					<LongDialogContent />
				</Dialog.Body>
				<Dialog.Footer>
					<Dialog.Close render={<Button variant="neutral" />}>Close</Dialog.Close>
				</Dialog.Footer>
			</Dialog.Popup>
		</Dialog.Root>
	);
}

function InsideScrollDialog() {
	return (
		<Dialog.Root>
			<Dialog.Trigger render={<Button size="sm" variant="secondary" />}>Inside scroll</Dialog.Trigger>
			<Dialog.Popup scrollBehavior="inside" xstyle={styles.insideScrollDialog}>
				<Dialog.Header>
					<Dialog.Title>Inside scrolling</Dialog.Title>
					<Dialog.Description>The header and footer stay fixed around a scrollable region.</Dialog.Description>
				</Dialog.Header>
				<ScrollArea label="Inside-scroll dialog guidance" size="content" xstyle={styles.dialogScrollArea}>
					<Dialog.Body>
						<LongDialogContent />
					</Dialog.Body>
				</ScrollArea>
				<Dialog.Footer>
					<Dialog.Close render={<Button variant="neutral" />}>Close</Dialog.Close>
				</Dialog.Footer>
			</Dialog.Popup>
		</Dialog.Root>
	);
}

function OutsideScrollDialog() {
	const popupRef = useRef<HTMLDivElement>(null);

	return (
		<Dialog.Root>
			<Dialog.Trigger render={<Button size="sm" variant="secondary" />}>Outside scroll</Dialog.Trigger>
			<Dialog.Popup initialFocus={popupRef} ref={popupRef} scrollBehavior="outside">
				<Dialog.Header>
					<Dialog.Title>Outside scrolling</Dialog.Title>
					<Dialog.Description>The viewport scrolls around content taller than the screen.</Dialog.Description>
				</Dialog.Header>
				<Dialog.Body>
					<LongDialogContent />
				</Dialog.Body>
				<Dialog.Footer>
					<Dialog.Close render={<Button variant="neutral" />}>Close</Dialog.Close>
				</Dialog.Footer>
			</Dialog.Popup>
		</Dialog.Root>
	);
}

function LongDialogContent() {
	return (
		<Stack gap={4}>
			{longFormSections.map((section, index) => (
				<Stack gap={1} key={section}>
					<Text fontWeight="medium">
						{index + 1}. {section}
					</Text>
					<Text color="muted" size="1">
						Check focus order, wrapping, and scroll reachability at this point in the content.
					</Text>
				</Stack>
			))}
		</Stack>
	);
}

function AlertDialogExample() {
	return (
		<AlertDialog.Root>
			<AlertDialog.Trigger render={<Button variant="neutral" />}>Alert Dialog</AlertDialog.Trigger>
			<AlertDialog.Popup>
				<AlertDialog.Header>
					<AlertDialog.Title>Discard the draft?</AlertDialog.Title>
					<AlertDialog.Description>Your unsaved popup test notes will be permanently lost.</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Close render={<Button variant="neutral" />}>Keep editing</AlertDialog.Close>
					<AlertDialog.Close render={<Button variant="error" />}>Discard</AlertDialog.Close>
				</AlertDialog.Footer>
			</AlertDialog.Popup>
		</AlertDialog.Root>
	);
}

function ConfirmationDialogExample() {
	return (
		<ConfirmationDialog.Root successToast={false} trigger={<Button variant="neutral">Confirmation Dialog</Button>}>
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

function DrawerExample() {
	const [mode, setMode] = useState<"details" | "activity">("details");
	const [snapPoint, setSnapPoint] = useState<string | number | null>(drawerSnapPoints[0]);

	return (
		<Drawer.Root
			snapPoints={drawerSnapPoints}
			snapPoint={snapPoint}
			onSnapPointChange={setSnapPoint}
			snapToSequentialPoints>
			<Drawer.Trigger render={<Button variant="neutral" />}>Drawer</Drawer.Trigger>
			<Drawer.Portal>
				<Drawer.Backdrop />
				<Drawer.Viewport>
					<Drawer.Popup layout="snap-points">
						<Drawer.Handle />
						<Drawer.Header>
							<Drawer.Title>Drawer variations</Drawer.Title>
							<Drawer.Description>
								Switch content, change snap points, scroll, and open a nested drawer.
							</Drawer.Description>
						</Drawer.Header>
						<Drawer.Content aria-label="Drawer variation content" role="region" scrollable>
							<Drawer.Body>
								<Stack gap={4}>
									<Stack gap={2} orientation="horizontal" wrap="wrap">
										<Button
											aria-pressed={mode === "details"}
											onClick={() => setMode("details")}
											size="sm"
											variant={mode === "details" ? "primary" : "secondary"}>
											Details
										</Button>
										<Button
											aria-pressed={mode === "activity"}
											onClick={() => setMode("activity")}
											size="sm"
											variant={mode === "activity" ? "primary" : "secondary"}>
											Activity
										</Button>
										<Button
											aria-pressed={snapPoint === drawerSnapPoints[0]}
											onClick={() => setSnapPoint(drawerSnapPoints[0])}
											size="sm"
											variant="secondary">
											Compact
										</Button>
										<Button
											aria-pressed={snapPoint === drawerSnapPoints[2]}
											onClick={() => setSnapPoint(drawerSnapPoints[2])}
											size="sm"
											variant="secondary">
											Full height
										</Button>
									</Stack>
									{mode === "details" ? <DrawerDetails /> : <DrawerActivity />}
									<NestedDrawer />
								</Stack>
							</Drawer.Body>
						</Drawer.Content>
						<Drawer.Footer>
							<Drawer.Close render={<Button variant="secondary" />}>Close</Drawer.Close>
						</Drawer.Footer>
					</Drawer.Popup>
				</Drawer.Viewport>
			</Drawer.Portal>
		</Drawer.Root>
	);
}

function DrawerDetails() {
	return (
		<Stack gap={4}>
			<TextField label="Project name" defaultValue="BaseX lab" />
			<Checkbox defaultChecked label="Require preview authentication" />
			<Textarea label="Description" rows={4} />
		</Stack>
	);
}

function DrawerActivity() {
	return (
		<Stack gap={3}>
			{Array.from({ length: 14 }, (_, index) => (
				<Stack gap={1} key={index} xstyle={styles.activityRow}>
					<Text fontWeight="medium">Activity {index + 1}</Text>
					<Text color="muted" size="1">
						A teammate updated popup experiment settings.
					</Text>
				</Stack>
			))}
		</Stack>
	);
}

function NestedDrawer() {
	return (
		<Drawer.Root>
			<Drawer.Trigger render={<Button variant="secondary" />}>Open nested drawer</Drawer.Trigger>
			<Drawer.Portal>
				<Drawer.Backdrop />
				<Drawer.Viewport>
					<Drawer.Popup>
						<Drawer.Handle />
						<Drawer.Content>
							<Drawer.Header>
								<Drawer.Title>Nested drawer</Drawer.Title>
								<Drawer.Description>
									The parent drawer should scale and remain visible behind this layer.
								</Drawer.Description>
							</Drawer.Header>
							<Drawer.Body>Nested focus and swipe dismissal stay scoped to the frontmost drawer.</Drawer.Body>
							<Drawer.Footer>
								<Drawer.Close render={<Button variant="secondary" />}>Back</Drawer.Close>
							</Drawer.Footer>
						</Drawer.Content>
					</Drawer.Popup>
				</Drawer.Viewport>
			</Drawer.Portal>
		</Drawer.Root>
	);
}

function NestedPopupsExample() {
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
							<Popover.Trigger render={<Button variant="secondary" />}>Open nested popover</Popover.Trigger>
							<Popover.Popup positionerProps={{ align: "start" }}>
								<Popover.Title>Nested popover</Popover.Title>
								<Popover.Description>This anchored layer should sit above the modal dialog.</Popover.Description>
								<Stack mt={4}>
									<Menu.Root>
										<Menu.Trigger render={<Button variant="secondary" />}>Open nested menu</Menu.Trigger>
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

const styles = stylex.create({
	linkPreviewButton: { textDecoration: "none" },
	smallDialog: { maxWidth: "22rem" },
	largeDialog: { maxWidth: "48rem" },
	insideScrollDialog: { height: "min(32rem, calc(100dvh - 4rem))" },
	dialogScrollArea: { flexBasis: "auto", flexGrow: 1, flexShrink: 1, minHeight: 0 },
	activityRow: {
		padding: tokens["--space-3"],
		borderColor: tokens["--border"],
		borderRadius: tokens["--radius-md"],
		borderStyle: "solid",
		borderWidth: tokens["--border-width"],
		backgroundColor: tokens["--surface-subtle"],
	},
});
