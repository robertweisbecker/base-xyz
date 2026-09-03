import { TargetIcon } from "@phosphor-icons/react/dist/csr/Target";
import { PauseCircleIcon } from "@phosphor-icons/react/dist/csr/PauseCircle";
import { PencilSimpleIcon } from "@phosphor-icons/react/dist/csr/PencilSimple";
import { PlayCircleIcon } from "@phosphor-icons/react/dist/csr/PlayCircle";
import { TrashIcon } from "@phosphor-icons/react/dist/csr/Trash";
import * as stylex from "@stylexjs/stylex";
import { useState, type FormEvent } from "react";
import {
	Button,
	IconButton,
	Collapsible,
	Dialog,
	ScrollArea,
	Textarea,
	Tooltip,
	Toolbar,
} from "@/components";
import { iconSwapTransition } from "@/styles/recipes/transitions";
import { tokens } from "@/theme/tokens.stylex";

type GoalToolbarProps = {
	defaultActive: boolean;
	defaultDescription: string;
	onActiveChange?: (active: boolean) => void;
};

export function GoalToolbar({
	defaultActive,
	defaultDescription,
	onActiveChange,
}: GoalToolbarProps) {
	const [currentActive, setCurrentActive] = useState(defaultActive);
	const [currentDescription, setCurrentDescription] = useState(defaultDescription);
	const [draftDescription, setDraftDescription] = useState(defaultDescription);
	const [editOpen, setEditOpen] = useState(false);
	const [detailsOpen, setDetailsOpen] = useState(false);

	function handleActiveToggle() {
		const nextActive = !currentActive;
		setCurrentActive(nextActive);
		onActiveChange?.(nextActive);
	}

	function handleEditOpenChange(nextOpen: boolean) {
		if (nextOpen) {
			setDraftDescription(currentDescription);
		}
		setEditOpen(nextOpen);
	}

	function handleSave(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setCurrentDescription(draftDescription);
		setEditOpen(false);
	}

	return (
		<Tooltip.Provider>
			<Dialog.Root open={editOpen} onOpenChange={handleEditOpenChange}>
				<Collapsible.Root
					open={detailsOpen}
					onOpenChange={setDetailsOpen}
					{...stylex.props(parts.root)}
				>
					<Toolbar.Root
						aria-label="Goal status"
						variant="unstyled"
						{...stylex.props(parts.summary)}
					>
						<span {...stylex.props(parts.statusLabel)}>
							<span aria-hidden {...stylex.props(parts.statusIcon)}>
								<TargetIcon size={16} weight="regular" />
							</span>
							{currentActive ? "Pursuing goal" : "Goal paused"}
						</span>

						<span
							hidden={detailsOpen}
							title={currentDescription}
							{...stylex.props(parts.description)}
						>
							{currentDescription}
						</span>
						<span {...stylex.props(parts.elapsed)}>12m 24s</span>
						<Toolbar.Group aria-label="Goal actions" {...stylex.props(parts.actions)}>
							<IconButton
								size="sm"
								icon={
									<span aria-hidden {...stylex.props(iconSwapTransition.slot)}>
										<span
											{...stylex.props(
												iconSwapTransition.icon,
												currentActive ? iconSwapTransition.visible : iconSwapTransition.hidden,
											)}
										>
											<PauseCircleIcon aria-hidden weight="fill" />
										</span>
										<span
											{...stylex.props(
												iconSwapTransition.icon,
												iconSwapTransition.to,
												currentActive ? iconSwapTransition.hidden : iconSwapTransition.visible,
											)}
										>
											<PlayCircleIcon aria-hidden weight="fill" />
										</span>
									</span>
								}
								label={currentActive ? "Pause goal" : "Resume goal"}
								nativeButton
								onClick={handleActiveToggle}
								render={<Toolbar.Button />}
								variant="ghost"
							/>
							<IconButton
								icon={<PencilSimpleIcon aria-hidden weight="duotone" />}
								label="Edit goal"
								size="sm"
								render={
									<Dialog.Trigger render={<Toolbar.Button {...stylex.props(parts.wideAction)} />} />
								}
								nativeButton
								variant="ghost"
							/>

							<IconButton
								size="sm"
								icon={<TrashIcon aria-hidden weight="regular" />}
								label="Delete goal"
								nativeButton
								render={<Toolbar.Button {...stylex.props(parts.wideAction)} />}
								variant="ghost"
							/>
							<IconButton
								size="sm"
								icon={<Collapsible.Icon />}
								label={detailsOpen ? "Collapse goal details" : "Expand goal details"}
								nativeButton
								render={<Collapsible.Trigger render={<Toolbar.Button />} shape="square" />}
								variant="ghost"
							/>
						</Toolbar.Group>
					</Toolbar.Root>
					<Collapsible.Panel>
						<Collapsible.Content {...stylex.props(parts.details)}>
							<ScrollArea
								label="Goal description"
								size="content"
								{...stylex.props(parts.descriptionScroll, parts.descriptionScrollMaxHeight)}
							>
								<div {...stylex.props(parts.descriptionScrollContent)}>{currentDescription}</div>
							</ScrollArea>
							<Toolbar.Root aria-label="Additional goal actions" variant="unstyled">
								<Toolbar.Group>
									<Dialog.Trigger
										render={<Toolbar.Button {...stylex.props(parts.compactAction)} />}
									>
										<PencilSimpleIcon aria-hidden size={16} weight="regular" /> Edit
									</Dialog.Trigger>
									<Toolbar.Button {...stylex.props(parts.compactAction)}>
										<TrashIcon aria-hidden size={16} weight="regular" /> Delete
									</Toolbar.Button>
								</Toolbar.Group>
							</Toolbar.Root>
						</Collapsible.Content>
					</Collapsible.Panel>
				</Collapsible.Root>
				<Dialog.Popup>
					<Dialog.Header>
						<Dialog.Title>Edit goal</Dialog.Title>
						<Dialog.Description>Update the description for this goal.</Dialog.Description>
					</Dialog.Header>
					<form onSubmit={handleSave}>
						<Dialog.Body>
							<Textarea
								autoFocus
								label="Goal description"
								rows={5}
								value={draftDescription}
								onChange={(event) => setDraftDescription(event.currentTarget.value)}
							/>
						</Dialog.Body>
						<Dialog.Footer>
							<Dialog.Close render={<Button variant="neutral" />}>Cancel</Dialog.Close>
							<Button type="submit">Save changes</Button>
						</Dialog.Footer>
					</form>
				</Dialog.Popup>
			</Dialog.Root>
		</Tooltip.Provider>
	);
}

const parts = stylex.create({
	root: {
		borderColor: tokens["--border"],
		borderStyle: "solid",
		borderWidth: "1px",
		overflow: "hidden",
		backgroundColor: tokens["--surface"],
		boxSizing: "border-box",
		containerType: "inline-size",
		borderBottomWidth: 0,
		borderTopLeftRadius: tokens["--radius-lg"],
		borderTopRightRadius: tokens["--radius-lg"],
	},
	summary: {
		padding: tokens["--space-1-5"],
		gap: tokens["--space-2"],
		alignItems: "center",
		display: "flex",
		minHeight: tokens["--size-control-lg"],
		width: "100%",
	},
	statusIcon: {
		color: tokens["--fg-muted"],
		display: "inline-flex",
		flexShrink: 0,
		opacity: 0.64,
		paddingInlineEnd: tokens["--space-1"],
		paddingInlineStart: tokens["--space-2"],
	},
	statusLabel: {
		gap: tokens["--space-1"],
		alignItems: "center",
		color: tokens["--fg"],
		display: "flex",
		flexShrink: 0,
		fontSize: tokens["--font-size-2"],
		fontWeight: tokens["--font-weight-medium"],
		letterSpacing: tokens["--letter-spacing-2"],
		lineHeight: tokens["--line-height-2"],
	},
	description: {
		overflow: "hidden",
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-2"],
		letterSpacing: tokens["--letter-spacing-2"],
		lineHeight: tokens["--line-height-2"],
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
		minWidth: 0,
	},
	elapsed: {
		color: tokens["--fg-subtle"],
		flexShrink: 0,
		fontSize: tokens["--font-size-2"],
		fontVariantNumeric: "tabular-nums",
		letterSpacing: tokens["--letter-spacing-2"],
		lineHeight: tokens["--line-height-2"],
	},
	actions: {
		marginInlineStart: "auto",
	},
	wideAction: {
		display: {
			default: "none",
			"@container (min-width: 32rem)": "inline-flex",
		},
	},
	compactAction: {
		display: {
			default: "inline-flex",
			"@container (min-width: 32rem)": "none",
		},
	},
	details: {
		color: tokens["--fg-subtle"],
		lineHeight: 1.5,
		paddingInlineStart: tokens["--space-3"],
	},
	descriptionScroll: {
		minWidth: 0,
		width: "100%",
	},
	descriptionScrollMaxHeight: {
		maxHeight: "8lh",
	},
	descriptionScrollContent: {
		paddingInlineEnd: tokens["--space-3"],
	},
});
