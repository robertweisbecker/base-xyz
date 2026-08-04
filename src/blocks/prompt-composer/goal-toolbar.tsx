import { TargetIcon } from "@phosphor-icons/react/dist/csr/Target";
import { PauseCircleIcon } from "@phosphor-icons/react/dist/csr/PauseCircle";
import { PencilIcon } from "@phosphor-icons/react/dist/csr/Pencil";
import { PlayCircleIcon } from "@phosphor-icons/react/dist/csr/PlayCircle";
import { TrashIcon } from "@phosphor-icons/react/dist/csr/Trash";
import * as stylex from "@stylexjs/stylex";
import { useState, type FormEvent } from "react";
import { Button, IconButton } from "@/components/button/button";
import * as Collapsible from "@/components/collapsible/collapsible";
import * as Dialog from "@/components/dialog/dialog";
import { ScrollArea } from "@/components/scroll-area/scroll-area";
import { Textarea } from "@/components/textarea/textarea";
import * as Tooltip from "@/components/tooltip/tooltip";
import * as Toolbar from "@/components/toolbar/toolbar";
import { iconSwapTransition } from "@/styles/recipes/transitions";
import { colors, radius, size, space } from "@/styles/tokens.stylex";
import { fontSize, fontWeight, letterSpacing, lineHeight } from "@/styles/tokens.stylex";

type GoalToolbarProps = {
	active: boolean;
	description: string;
};

export function GoalToolbar({ active, description }: GoalToolbarProps) {
	const [currentActive, setCurrentActive] = useState(active);
	const [currentDescription, setCurrentDescription] = useState(description);
	const [draftDescription, setDraftDescription] = useState(description);
	const [editOpen, setEditOpen] = useState(false);
	const [detailsOpen, setDetailsOpen] = useState(false);
	const detailsLabel = detailsOpen ? "Collapse goal details" : "Expand goal details";

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
				<Collapsible.Root open={detailsOpen} onOpenChange={setDetailsOpen} style={parts.root}>
					<Toolbar.Root aria-label="Goal status" variant="unstyled" style={parts.summary}>
						<span {...stylex.props(parts.statusLabel)}>
							<span aria-hidden {...stylex.props(parts.statusIcon)}>
								<TargetIcon size={16} weight="regular" />
							</span>
							{currentActive ? "Pursuing goal" : "Goal paused"}
						</span>

						<span hidden={detailsOpen} title={currentDescription} {...stylex.props(parts.description)}>
							{currentDescription}
						</span>
						<span {...stylex.props(parts.elapsed)}>12m 24s</span>
						<Toolbar.Group aria-label="Goal actions" style={parts.actions}>
							<IconButton
								icon={<PencilIcon aria-hidden weight="regular" />}
								label="Edit goal"
								render={<Dialog.Trigger render={<Toolbar.Button style={parts.wideAction} />} />}
								nativeButton
								variant="ghost"
							/>
							<IconButton
								icon={
									<span aria-hidden {...stylex.props(iconSwapTransition.slot)}>
										<span
											{...stylex.props(
												iconSwapTransition.icon,
												iconSwapTransition.from,
												currentActive ? iconSwapTransition.visible : iconSwapTransition.hidden,
											)}>
											<PauseCircleIcon aria-hidden weight="duotone" />
										</span>
										<span
											{...stylex.props(
												iconSwapTransition.icon,
												iconSwapTransition.to,
												currentActive ? iconSwapTransition.hidden : iconSwapTransition.visible,
											)}>
											<PlayCircleIcon aria-hidden weight="fill" />
										</span>
									</span>
								}
								label={currentActive ? "Pause goal" : "Resume goal"}
								nativeButton
								onClick={() => setCurrentActive((isActive) => !isActive)}
								render={<Toolbar.Button />}
								variant="ghost"
							/>
							<IconButton
								icon={<TrashIcon aria-hidden weight="regular" />}
								label="Delete goal"
								nativeButton
								render={<Toolbar.Button style={parts.wideAction} />}
								variant="ghost"
							/>
							<IconButton
								icon={<Collapsible.Icon />}
								label={detailsLabel}
								nativeButton
								render={<Collapsible.Trigger render={<Toolbar.Button />} shape="square" size="md" />}
								variant="ghost"
							/>
						</Toolbar.Group>
					</Toolbar.Root>
					<Collapsible.Panel>
						<Collapsible.Content style={parts.details}>
							<ScrollArea
								label="Goal description"
								size="content"
								style={parts.descriptionScroll}
								viewportStyle={parts.descriptionScrollViewport}
								contentStyle={parts.descriptionScrollContent}>
								{currentDescription}
							</ScrollArea>
							<Toolbar.Root aria-label="Additional goal actions" variant="unstyled">
								<Toolbar.Group>
									<Dialog.Trigger render={<Toolbar.Button style={parts.compactAction} />}>
										<PencilIcon aria-hidden size={16} weight="regular" /> Edit
									</Dialog.Trigger>
									<Toolbar.Button style={parts.compactAction}>
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
		borderColor: colors["--border"],
		borderStyle: "solid",
		borderWidth: "1px",
		overflow: "hidden",
		boxSizing: "border-box",
		containerType: "inline-size",
		borderBottomWidth: 0,
		borderTopLeftRadius: radius.lg,
		borderTopRightRadius: radius.lg,
	},
	summary: {
		padding: space[1],
		gap: space[2],
		alignItems: "center",
		display: "flex",
		minHeight: size["control.lg"],
		width: "100%",
	},
	statusIcon: {
		color: colors["--text-muted"],
		display: "inline-flex",
		flexShrink: 0,
		opacity: 0.64,
		paddingInlineEnd: space[1],
		paddingInlineStart: space[2],
	},
	statusLabel: {
		gap: space[1],
		alignItems: "center",
		color: colors["--text"],
		display: "flex",
		flexShrink: 0,
		fontSize: fontSize.x2,
		fontWeight: fontWeight.medium,
		letterSpacing: letterSpacing.x2,
		lineHeight: lineHeight.x2,
	},
	description: {
		overflow: "hidden",
		color: colors["--text-muted"],
		fontSize: fontSize.x2,
		letterSpacing: letterSpacing.x2,
		lineHeight: lineHeight.x2,
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
		minWidth: 0,
	},
	elapsed: {
		color: colors["--text-subtle"],
		flexShrink: 0,
		fontSize: fontSize.x2,
		fontVariantNumeric: "tabular-nums",
		letterSpacing: letterSpacing.x2,
		lineHeight: lineHeight.x2,
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
		color: colors["--text-subtle"],
		lineHeight: 1.5,
		paddingInlineStart: space[3],
	},
	descriptionScroll: {
		minWidth: 0,
		width: "100%",
	},
	descriptionScrollViewport: {
		maxHeight: "8lh",
	},
	descriptionScrollContent: {
		paddingInlineEnd: space[3],
	},
});
