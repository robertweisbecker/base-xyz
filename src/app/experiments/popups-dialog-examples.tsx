import { useRef } from "react";
import { Button, Dialog, ScrollArea, Stack, Text, Textarea, TextField } from "@/components";
import { popupsPageStyles as styles } from "./popups-page.styles";

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

export function DialogExample() {
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
