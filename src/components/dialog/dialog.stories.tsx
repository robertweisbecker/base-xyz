import type { Meta, StoryObj } from "@storybook/react-vite";
import x from "@stylexjs/atoms";
import * as stylex from "@stylexjs/stylex";
import { useRef, useState } from "react";
import { tokens } from "@/theme/tokens.stylex";

import { AlertDialog } from "@/components/alert-dialog/alert-dialog";
import { Button } from "@/components/button/button";
import { Heading } from "@/components/heading/heading";
import { Stack } from "@/components/layout/layout";
import { ScrollArea } from "@/components/scroll-area/scroll-area";
import { Text } from "@/components/text/text";
import { Textarea } from "@/components/textarea/textarea";
import { Dialog, type DialogScrollBehavior } from "./dialog";
type StoryArgs = {
	defaultOpen: boolean;
	disablePointerDismissal: boolean;
	modal: boolean | "trap-focus";
	_scrollBehavior: DialogScrollBehavior;
	_showBackdrop: boolean;
	_showClose: boolean;
};

const meta = {
	title: "Components/Dialog",
	args: {
		defaultOpen: true,
		disablePointerDismissal: false,
		modal: true,
		_scrollBehavior: "popup",
		_showBackdrop: true,
		_showClose: true,
	},
	argTypes: {
		defaultOpen: { control: "boolean" },
		disablePointerDismissal: { control: "boolean" },
		modal: { control: "select", options: [true, false, "trap-focus"] },
		_scrollBehavior: { control: "inline-radio", options: ["popup", "inside", "outside"] },
		_showBackdrop: { control: "boolean" },
		_showClose: { control: "boolean" },
	},
	parameters: {
		docs: {
			story: {
				height: "640px",
				inline: false,
			},
		},
	},
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<StoryArgs>;

function DialogFrame({
	scrollBehavior = "popup",
	showBackdrop = true,
	showClose = true,
}: {
	scrollBehavior?: DialogScrollBehavior;
	showBackdrop?: boolean;
	showClose?: boolean;
}) {
	return (
		<Dialog.Popup backdropProps={showBackdrop ? {} : false} scrollBehavior={scrollBehavior} showClose={showClose}>
			<Dialog.Header>
				<Dialog.Title>Edit profile</Dialog.Title>
				<Dialog.Description>Make changes to how your name appears to teammates.</Dialog.Description>
			</Dialog.Header>
			<Dialog.Body>Your profile settings would live here.</Dialog.Body>
			<Dialog.Footer>
				<Dialog.Close render={<Button variant="neutral" />}>Cancel</Dialog.Close>
				<Dialog.Close render={<Button />}>Save changes</Dialog.Close>
			</Dialog.Footer>
		</Dialog.Popup>
	);
}

export const Playground: Story = {
	render: ({ defaultOpen, disablePointerDismissal, modal, _scrollBehavior, _showBackdrop, _showClose }) => (
		<Dialog.Root
			key={`${defaultOpen}-${disablePointerDismissal}-${modal}-${_scrollBehavior}-${_showBackdrop}-${_showClose}`}
			defaultOpen={defaultOpen}
			disablePointerDismissal={disablePointerDismissal}
			modal={modal}>
			<Dialog.Trigger render={<Button />}>Edit profile</Dialog.Trigger>
			<DialogFrame scrollBehavior={_scrollBehavior} showBackdrop={_showBackdrop} showClose={_showClose} />
		</Dialog.Root>
	),
};

const dialogSections = [
	{
		title: "Choose the right surface",
		body: "Use a dialog for a focused task that should temporarily interrupt the current page without navigating away.",
	},
	{
		title: "Keep the title specific",
		body: "A concise title and description help everyone understand why the dialog opened and what they can do next.",
	},
	{
		title: "Manage keyboard focus",
		body: "Focus moves into the dialog, stays contained while it is open, and returns to the trigger after it closes.",
	},
	{
		title: "Offer a visible close action",
		body: "Do not rely only on Escape or backdrop clicks. A clear button gives pointer and assistive-technology users an explicit exit.",
	},
	{
		title: "Keep forms short",
		body: "Long multi-step workflows usually deserve a page. Dialog forms work best when the requested action is narrow and easy to review.",
	},
	{
		title: "Explain destructive choices",
		body: "Use concrete action labels and confirmation language so the consequence is clear before the user commits.",
	},
	{
		title: "Respect reduced motion",
		body: "Transitions should clarify the layer change without delaying access to the content or causing unnecessary movement.",
	},
	{
		title: "Plan for longer translations",
		body: "Allow titles, descriptions, and buttons to wrap without hiding important controls or forcing horizontal scrolling.",
	},
	{
		title: "Preserve useful context",
		body: "The page remains visible behind the backdrop so users can understand where they will return when the dialog closes.",
	},
	{
		title: "Confirm completion",
		body: "After a successful action, close the dialog and update the surrounding interface so the result is immediately visible.",
	},
] as const;

function DialogSections() {
	return (
		<Stack gap={5}>
			{dialogSections.map((section) => (
				<Stack key={section.title} gap={1}>
					<Heading render={<h3 />} size="2">
						{section.title}
					</Heading>
					<Text color="muted">{section.body}</Text>
				</Stack>
			))}
		</Stack>
	);
}

function InsideScrollDialog() {
	return (
		<Dialog.Root>
			<Dialog.Trigger render={<Button />}>Open inside-scroll dialog</Dialog.Trigger>
			<Dialog.Popup scrollBehavior="inside" xstyle={storyParts.insideScrollPopup}>
				<Dialog.Header>
					<Dialog.Title>Dialog guidelines</Dialog.Title>
					<Dialog.Description>
						The popup stays on screen while the ScrollArea inside it holds the long content.
					</Dialog.Description>
				</Dialog.Header>
				<ScrollArea
					label="Dialog guidelines"
					size="content"
					xstyle={storyParts.insideScrollArea}>
					<div {...stylex.props(x.padding(tokens["--space-5"]))}>
						<DialogSections />
					</div>
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
			<Dialog.Trigger render={<Button />}>Open outside-scroll dialog</Dialog.Trigger>
			<Dialog.Popup ref={popupRef} initialFocus={popupRef} scrollBehavior="outside">
				<Dialog.Header>
					<Dialog.Title>Dialog guidelines</Dialog.Title>
					<Dialog.Description>
						The popup may extend past the screen while the surrounding ScrollArea provides scrolling.
					</Dialog.Description>
				</Dialog.Header>
				<Dialog.Body>
					<DialogSections />
				</Dialog.Body>
				<Dialog.Footer>
					<Dialog.Close render={<Button variant="neutral" />}>Close</Dialog.Close>
				</Dialog.Footer>
			</Dialog.Popup>
		</Dialog.Root>
	);
}

export const ScrollBehavior: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack gap={5}>
			<Stack gap={1}>
				<Heading size="2">Inside</Heading>
				<Text color="muted">The popup remains fixed while its content area scrolls.</Text>
				<InsideScrollDialog />
			</Stack>
			<Stack gap={1}>
				<Heading size="2">Outside</Heading>
				<Text color="muted">The surrounding viewport scrolls when the popup exceeds the screen.</Text>
				<OutsideScrollDialog />
			</Stack>
		</Stack>
	),
};

function NonModalExample() {
	const [outsideCount, setOutsideCount] = useState(0);

	return (
		<Stack align="center" gap={5} xstyle={storyParts.nonModalStage}>
			<Stack align="center" gap={6} justify="space-between" orientation="horizontal" width="full">
				<Stack gap={1}>
					<Heading size="2">Workspace canvas</Heading>
					<Text color="muted" size="1">
						This remains interactive while the dialog is open.
					</Text>
				</Stack>
				<Button variant="neutral" onClick={() => setOutsideCount((count) => count + 1)}>
					Outside action · {outsideCount}
				</Button>
			</Stack>
			<Dialog.Root defaultOpen modal={false} disablePointerDismissal>
				<Dialog.Trigger render={<Button />}>Open inspector</Dialog.Trigger>
				<Dialog.Popup
					backdropProps={false}
					viewportProps={{ xstyle: storyParts.nonModalViewport }}
					xstyle={storyParts.nonModalPopup}>
					<Dialog.Header>
						<Dialog.Title>Selection inspector</Dialog.Title>
						<Dialog.Description>A non-modal dialog for supporting controls.</Dialog.Description>
					</Dialog.Header>
					<Dialog.Body>
						The popup animates independently while pointer and keyboard interaction remain available outside it.
					</Dialog.Body>
					<Dialog.Footer>
						<Dialog.Close render={<Button variant="neutral" />}>Close inspector</Dialog.Close>
					</Dialog.Footer>
				</Dialog.Popup>
			</Dialog.Root>
		</Stack>
	);
}

export const NonModal: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => <NonModalExample />,
};

export const Nested: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Dialog.Root defaultOpen>
			<Dialog.Trigger render={<Button />}>Open project</Dialog.Trigger>
			<Dialog.Popup>
				<Dialog.Header>
					<Dialog.Title>Project settings</Dialog.Title>
					<Dialog.Description>The parent scales and dims when its nested dialog opens.</Dialog.Description>
				</Dialog.Header>
				<Dialog.Body>
					<Dialog.Root>
						<Dialog.Trigger render={<Button variant="secondary" />}>Manage access</Dialog.Trigger>
						<Dialog.Popup>
							<Dialog.Header>
								<Dialog.Title>Manage access</Dialog.Title>
								<Dialog.Description>Invite collaborators to this project.</Dialog.Description>
							</Dialog.Header>
							<Dialog.Body>Nested dialogs retain their own focus scope and animated lifecycle.</Dialog.Body>
							<Dialog.Footer>
								<Dialog.Close render={<Button variant="neutral" />}>Done</Dialog.Close>
							</Dialog.Footer>
						</Dialog.Popup>
					</Dialog.Root>
				</Dialog.Body>
				<Dialog.Footer>
					<Dialog.Close render={<Button variant="neutral" />}>Close project</Dialog.Close>
				</Dialog.Footer>
			</Dialog.Popup>
		</Dialog.Root>
	),
};

function CloseConfirmationDialog() {
	const [dialogOpen, setDialogOpen] = useState(true);
	const [confirmationOpen, setConfirmationOpen] = useState(false);
	const [draft, setDraft] = useState("");

	return (
		<Dialog.Root
			open={dialogOpen}
			onOpenChange={(open) => {
				if (!open && draft) {
					setConfirmationOpen(true);
					return;
				}

				if (!open) {
					setDraft("");
				}
				setDialogOpen(open);
			}}>
			<Dialog.Trigger render={<Button />}>Compose note</Dialog.Trigger>
			<Dialog.Popup>
				<Dialog.Header>
					<Dialog.Title>New note</Dialog.Title>
					<Dialog.Description>Type something, then try to close this dialog.</Dialog.Description>
				</Dialog.Header>
				<form
					onSubmit={(event) => {
						event.preventDefault();
						setDraft("");
						setDialogOpen(false);
					}}>
					<Dialog.Body>
						<Textarea
							label="Note"
							value={draft}
							onChange={(event) => setDraft(event.target.value)}
							placeholder="Capture a thought…"
							rows={5}
						/>
					</Dialog.Body>
					<Dialog.Footer>
						<Dialog.Close render={<Button variant="neutral" />}>Cancel</Dialog.Close>
						<Button type="submit">Save note</Button>
					</Dialog.Footer>
				</form>
			</Dialog.Popup>

			<AlertDialog.Root open={confirmationOpen} onOpenChange={setConfirmationOpen}>
				<AlertDialog.Popup>
					<AlertDialog.Header>
						<AlertDialog.Title>Discard this note?</AlertDialog.Title>
						<AlertDialog.Description>Your unsaved changes will be lost.</AlertDialog.Description>
					</AlertDialog.Header>
					<AlertDialog.Footer>
						<AlertDialog.Close render={<Button variant="neutral" />}>Keep editing</AlertDialog.Close>
						<Button
							variant="error"
							onClick={() => {
								setConfirmationOpen(false);
								setDraft("");
								setDialogOpen(false);
							}}>
							Discard note
						</Button>
					</AlertDialog.Footer>
				</AlertDialog.Popup>
			</AlertDialog.Root>
		</Dialog.Root>
	);
}

export const CloseToConfirm: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => <CloseConfirmationDialog />,
};

const storyParts = stylex.create({
	insideScrollPopup: {
		height: `min(620px, calc(100dvh - ${tokens["--space-8"]}))`,
	},
	insideScrollArea: {
		flexBasis: "auto",
		flexGrow: "1",
		flexShrink: "1",
		minHeight: 0,
	},
	nonModalStage: {
		minWidth: "min(680px, calc(100vw - 48px))",
	},
	nonModalViewport: {
		pointerEvents: "none",
	},
	nonModalPopup: {
		pointerEvents: "auto",
		transformOrigin: "center bottom",
	},
});
