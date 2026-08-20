import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { useState } from "react";
import { tokens } from "@/theme/tokens.stylex";

import { AlertDialog } from "@/components/alert-dialog/alert-dialog";
import { Button } from "@/components/button/button";
import { Stack } from "@/components/layout/layout";
import { createDrawerHandle } from "@/components/popup-handles";
import { Text } from "@/components/text/text";
import { Textarea } from "@/components/textarea/textarea";
import { Drawer } from "./drawer";
type StoryArgs = {
	defaultOpen: boolean;
	disablePointerDismissal: boolean;
	modal: boolean | "trap-focus";
};

const meta = {
	title: "Components/Drawer",
	args: {
		defaultOpen: true,
		disablePointerDismissal: false,
		modal: true,
	},
	argTypes: {
		defaultOpen: { control: "boolean" },
		disablePointerDismissal: { control: "boolean" },
		modal: { control: "select", options: [true, false, "trap-focus"] },
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

function DrawerExample({
	title,
	description,
	body,
	closeLabel = "Close",
	backdrop = true,
}: {
	title: string;
	description: string;
	body: React.ReactNode;
	closeLabel?: string;
	backdrop?: boolean;
}) {
	return (
		<Drawer.Portal>
			{backdrop && <Drawer.Backdrop />}
			<Drawer.Viewport>
				<Drawer.Popup>
					<Drawer.Handle />
					<Drawer.Content>
						<Drawer.Header>
							<Drawer.Title>{title}</Drawer.Title>
							<Drawer.Description>{description}</Drawer.Description>
						</Drawer.Header>
						<Drawer.Body>{body}</Drawer.Body>
						<Drawer.Footer>
							<Drawer.Close render={<Button variant="secondary" />}>{closeLabel}</Drawer.Close>
						</Drawer.Footer>
					</Drawer.Content>
				</Drawer.Popup>
			</Drawer.Viewport>
		</Drawer.Portal>
	);
}

export const Playground: Story = {
	render: ({ defaultOpen, disablePointerDismissal, modal }) => (
		<Drawer.Root
			key={`${defaultOpen}-${disablePointerDismissal}-${modal}`}
			defaultOpen={defaultOpen}
			disablePointerDismissal={disablePointerDismissal}
			modal={modal}>
			<Drawer.Trigger render={<Button />}>Open drawer</Drawer.Trigger>
			<DrawerExample
				title="Project settings"
				description="Swipe down or use the close button to dismiss."
				body="Drawer content can hold forms, navigation, or focused workflows."
			/>
		</Drawer.Root>
	),
};

const snapPoints: Array<string | number> = ["18rem", "30rem", 1];
const snapPointOptions = [
	{ label: "Compact", value: snapPoints[0] },
	{ label: "Medium", value: snapPoints[1] },
	{ label: "Full", value: snapPoints[2] },
] as const;

function SnapPointsDrawer() {
	const [snapPoint, setSnapPoint] = useState<string | number | null>(snapPoints[0]);

	return (
		<Drawer.Root snapPoints={snapPoints} snapPoint={snapPoint} onSnapPointChange={setSnapPoint} snapToSequentialPoints>
			<Drawer.Trigger render={<Button />}>Open snap-point drawer</Drawer.Trigger>
			<Drawer.Portal>
				<Drawer.Backdrop />
				<Drawer.Viewport>
					<Drawer.Popup layout="snap-points">
						<Drawer.Handle />
						<Drawer.Header>
							<Drawer.Title>Project activity</Drawer.Title>
							<Drawer.Description>Drag between the compact, medium, and full-height snap points.</Drawer.Description>
						</Drawer.Header>
						<Drawer.Content scrollable role="region" aria-label="Project activity list">
							<Drawer.Body>
								<Stack gap={2} mb={5} wrap="wrap">
									{snapPointOptions.map((option) => (
										<Button
											key={option.label}
											size="sm"
											variant={snapPoint === option.value ? "primary" : "neutral"}
											onClick={() => setSnapPoint(option.value)}>
											{option.label}
										</Button>
									))}
								</Stack>
								<Stack gap={3}>
									{Array.from({ length: 16 }, (_, index) => (
										<Stack key={index} gap={1} style={storyParts.activityCard}>
											<Text fontWeight="medium">Activity {index + 1}</Text>
											<Text color="muted" size="1">
												Project details were updated by a teammate.
											</Text>
										</Stack>
									))}
								</Stack>
							</Drawer.Body>
						</Drawer.Content>
						<Drawer.Footer style={storyParts.snapPointFooter}>
							<Drawer.Close render={<Button variant="secondary" />}>Close</Drawer.Close>
						</Drawer.Footer>
					</Drawer.Popup>
				</Drawer.Viewport>
			</Drawer.Portal>
		</Drawer.Root>
	);
}

export const SnapPoints: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => <SnapPointsDrawer />,
};

type DrawerPayload = {
	title: string;
	description: string;
	body: string;
};

const detachedDrawer = createDrawerHandle<DrawerPayload>();
const drawerDestinations: Array<DrawerPayload & { label: string }> = [
	{
		label: "Activity",
		title: "Recent activity",
		description: "Changes across this workspace.",
		body: "Three components were updated today. The detached trigger passes this content as its payload.",
	},
	{
		label: "Members",
		title: "Workspace members",
		description: "People with access to this project.",
		body: "Alex, Sam, and Taylor can edit. Morgan has view-only access.",
	},
	{
		label: "Billing",
		title: "Billing details",
		description: "Plan and invoice information.",
		body: "You are on the Studio plan. The next invoice is due on the first of the month.",
	},
];

export const DetachedTriggers: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack align="center" gap={3}>
			<Text color="muted" size="1">
				Several triggers share one drawer and supply its active payload.
			</Text>
			<Stack gap={2} wrap="wrap">
				{drawerDestinations.map(({ label, ...payload }) => (
					<Drawer.Trigger key={label} handle={detachedDrawer} payload={payload} render={<Button variant="secondary" />}>
						{label}
					</Drawer.Trigger>
				))}
			</Stack>
			<Drawer.Root handle={detachedDrawer} modal={false} disablePointerDismissal>
				{({ payload }) =>
					payload ? (
						<Drawer.Portal>
							<Drawer.Viewport style={storyParts.detachedViewport}>
								<Drawer.Popup>
									<Drawer.Handle />
									<Drawer.Content key={payload.title}>
										<Drawer.Header>
											<Stack orientation="horizontal">
												<Stack orientation="vertical" gap={0}>
													<Drawer.Title>{payload.title}</Drawer.Title>
													<Drawer.Description>{payload.description}</Drawer.Description>
												</Stack>
												<Drawer.Close render={<Button variant="ghost" />}>Done</Drawer.Close>
											</Stack>
										</Drawer.Header>
										<Drawer.Body>{payload.body}</Drawer.Body>
										<Drawer.Footer>
											<Drawer.Close render={<Button variant="secondary" />}>Done</Drawer.Close>
										</Drawer.Footer>
									</Drawer.Content>
								</Drawer.Popup>
							</Drawer.Viewport>
						</Drawer.Portal>
					) : null
				}
			</Drawer.Root>
		</Stack>
	),
};

export const Nested: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Drawer.Root>
			<Drawer.Trigger render={<Button />}>Open project drawer</Drawer.Trigger>
			<Drawer.Portal>
				<Drawer.Backdrop />
				<Drawer.Viewport>
					<Drawer.Popup>
						<Drawer.Handle />
						<Drawer.Content>
							<Drawer.Header>
								<Drawer.Title>Project settings</Drawer.Title>
								<Drawer.Description>The parent drawer scales and peeks behind nested surfaces.</Drawer.Description>
							</Drawer.Header>
							<Drawer.Body>
								<Drawer.Root>
									<Drawer.Trigger render={<Button variant="secondary" />}>Open permissions drawer</Drawer.Trigger>
									<Drawer.Portal>
										<Drawer.Backdrop />
										<Drawer.Viewport>
											<Drawer.Popup>
												<Drawer.Handle />
												<Drawer.Content>
													<Drawer.Header>
														<Drawer.Title>Permissions</Drawer.Title>
														<Drawer.Description>Configure who can edit this project.</Drawer.Description>
													</Drawer.Header>
													<Drawer.Body>
														<Drawer.Root>
															<Drawer.Trigger render={<Button variant="secondary" />}>
																Review inherited access
															</Drawer.Trigger>
															<Drawer.Portal>
																<Drawer.Backdrop />
																<Drawer.Viewport>
																	<Drawer.Popup>
																		<Drawer.Handle />
																		<Drawer.Content>
																			<Drawer.Header>
																				<Drawer.Title>Inherited access</Drawer.Title>
																				<Drawer.Description>
																					This project inherits access from Design systems.
																				</Drawer.Description>
																			</Drawer.Header>
																			<Drawer.Body>
																				The three-layer stack exposes the scale, height, and content fade transitions.
																			</Drawer.Body>
																			<Drawer.Footer>
																				<Drawer.Close render={<Button variant="secondary" />}>Done</Drawer.Close>
																			</Drawer.Footer>
																		</Drawer.Content>
																	</Drawer.Popup>
																</Drawer.Viewport>
															</Drawer.Portal>
														</Drawer.Root>
													</Drawer.Body>
													<Drawer.Footer>
														<Drawer.Close render={<Button variant="secondary" />}>Back</Drawer.Close>
													</Drawer.Footer>
												</Drawer.Content>
											</Drawer.Popup>
										</Drawer.Viewport>
									</Drawer.Portal>
								</Drawer.Root>
							</Drawer.Body>
							<Drawer.Footer>
								<Drawer.Close render={<Button variant="secondary" />}>Close</Drawer.Close>
							</Drawer.Footer>
						</Drawer.Content>
					</Drawer.Popup>
				</Drawer.Viewport>
			</Drawer.Portal>
		</Drawer.Root>
	),
};

function CloseConfirmationDrawer() {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [confirmationOpen, setConfirmationOpen] = useState(false);
	const [draft, setDraft] = useState("");

	return (
		<Drawer.Root
			open={drawerOpen}
			onOpenChange={(open, eventDetails) => {
				if (!open && draft) {
					eventDetails.cancel();
					setConfirmationOpen(true);
					return;
				}

				if (!open) {
					setDraft("");
				}
				setDrawerOpen(open);
			}}>
			<Drawer.Trigger render={<Button />}>Compose update</Drawer.Trigger>
			<Drawer.Portal>
				<Drawer.Backdrop />
				<Drawer.Viewport>
					<Drawer.Popup data-close-confirmation-open={confirmationOpen || undefined}>
						<Drawer.Handle />
						<Drawer.Content>
							<Drawer.Header>
								<Drawer.Title>New project update</Drawer.Title>
								<Drawer.Description>Type something, then swipe down or press Cancel.</Drawer.Description>
							</Drawer.Header>
							<form
								onSubmit={(event) => {
									event.preventDefault();
									setDraft("");
									setDrawerOpen(false);
								}}>
								<Drawer.Body>
									<Textarea
										label="Update"
										value={draft}
										onChange={(event) => setDraft(event.target.value)}
										placeholder="What changed?"
										rows={5}
									/>
								</Drawer.Body>
								<Drawer.Footer>
									<Drawer.Close render={<Button variant="secondary" />}>Cancel</Drawer.Close>
									<Button type="submit">Publish update</Button>
								</Drawer.Footer>
							</form>
						</Drawer.Content>
					</Drawer.Popup>
				</Drawer.Viewport>
			</Drawer.Portal>

			<AlertDialog.Root open={confirmationOpen} onOpenChange={setConfirmationOpen}>
				<AlertDialog.Popup>
					<AlertDialog.Header>
						<AlertDialog.Title>Discard this update?</AlertDialog.Title>
						<AlertDialog.Description>Your unsaved changes will be lost.</AlertDialog.Description>
					</AlertDialog.Header>
					<AlertDialog.Footer>
						<AlertDialog.Close render={<Button variant="secondary" />}>Keep editing</AlertDialog.Close>
						<Button
							variant="error"
							onClick={() => {
								setConfirmationOpen(false);
								setDraft("");
								setDrawerOpen(false);
							}}>
							Discard update
						</Button>
					</AlertDialog.Footer>
				</AlertDialog.Popup>
			</AlertDialog.Root>
		</Drawer.Root>
	);
}

export const CloseToConfirm: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => <CloseConfirmationDrawer />,
};

const storyParts = stylex.create({
	snapPointFooter: {
		paddingBlockEnd: tokens["--space-4"],
	},
	activityCard: {
		padding: tokens["--space-3"],
		borderColor: tokens["--border"],
		borderRadius: tokens["--radius-md"],
		borderStyle: "solid",
		borderWidth: "1px",
		backgroundColor: tokens["--surface-subtle"],
	},
	detachedViewport: {
		pointerEvents: "none",
	},
});
