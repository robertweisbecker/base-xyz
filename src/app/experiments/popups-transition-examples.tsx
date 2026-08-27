import { useRef, useState } from "react";
import {
	Button,
	createLinkPreviewHandle,
	createPopoverHandle,
	createTooltipHandle,
	Dialog,
	LinkPreview,
	Popover,
	Stack,
	Text,
	Toast,
	Tooltip,
} from "@/components";
import { popupMotionStyles } from "@/components/popover/popover.stylex";
import { popupsPageStyles as styles } from "./popups-page.styles";

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
	{
		label: "Dialog",
		title: "Dialog",
		description: "A focused surface for short, interruptive workflows.",
	},
	{
		label: "Drawer",
		title: "Drawer",
		description: "A bottom sheet for contextual tasks and progressive disclosure.",
	},
	{
		label: "Popover",
		title: "Popover",
		description: "An anchored surface for lightweight supporting content.",
	},
];

const sharedPopover = createPopoverHandle<SharedPopupPayload>();
const sharedPopoverItems: Array<SharedPopupPayload & { label: string }> = [
	{ label: "Inbox", title: "Inbox zero", description: "There are no unread messages." },
	{
		label: "Mentions",
		title: "Two mentions",
		description: "Alex mentioned you in Design critique and Release planning.",
	},
	{
		label: "Updates",
		title: "Product updates",
		description: "The component lab was updated a few seconds ago.",
	},
];

export function SharedTransitionsExample() {
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
							render={<Button size="sm" variant="secondary" />}
						>
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
							xstyle={popupMotionStyles.movingPopup}
						>
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
						xstyle={styles.linkPreviewButton}
					>
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
						xstyle={popupMotionStyles.movingPopup}
					>
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
						render={<Button size="sm" variant="secondary" />}
					>
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
						xstyle={popupMotionStyles.movingPopup}
					>
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

export function TooltipToAnchoredToastExample() {
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
				render={<Button onClick={() => void showFeedback()} variant="neutral" />}
			>
				Tooltip to toast
			</Tooltip.Trigger>
			<Tooltip.Popup>Copy invite link</Tooltip.Popup>
		</Tooltip.Root>
	);
}
