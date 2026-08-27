import { useMergedRefs } from "@base-ui/utils/useMergedRefs";
import { move } from "@dnd-kit/helpers";
import {
	DragDropProvider,
	DragOverlay,
	useDroppable,
	type DragEndEvent,
	type DragOverEvent,
	type DragStartEvent,
} from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import {
	ArchiveIcon,
	BellIcon,
	DotsSixVerticalIcon,
	EnvelopeSimpleIcon,
	FolderIcon,
} from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { useRef, useState } from "react";
import { Button, Menu } from "@/components";
import { demoStyles } from "../drag-and-drop-demo.stylex";
import { DemoInstructions, DemoPanel } from "../demo-parts";

type MenuAction = Readonly<{
	id: string;
	label: string;
	shortcut: string;
	icon: ReactNode;
}>;

type MenuGroupId = "record" | "followUp";
type MenuGroupState = {
	record: MenuAction[];
	followUp: MenuAction[];
};
type MenuOpenState = {
	record: boolean;
	followUp: boolean;
};

const MENU_ITEM_TYPE = "application/x-stylex-experimental-menu-item";

const MENU_GROUPS: ReadonlyArray<{ id: MenuGroupId; trigger: string; label: string }> = [
	{ id: "record", trigger: "Record actions", label: "Record actions" },
	{ id: "followUp", trigger: "Follow-up actions", label: "Follow-up actions" },
];

const INITIAL_MENU_GROUPS: MenuGroupState = {
	record: [
		{
			id: "assign-folder",
			label: "Assign folder",
			shortcut: "A",
			icon: <FolderIcon size={16} weight="regular" />,
		},
		{
			id: "notify-team",
			label: "Notify team",
			shortcut: "N",
			icon: <BellIcon size={16} weight="regular" />,
		},
	],
	followUp: [
		{
			id: "email-owner",
			label: "Email owner",
			shortcut: "E",
			icon: <EnvelopeSimpleIcon size={16} weight="regular" />,
		},
		{
			id: "archive-record",
			label: "Archive record",
			shortcut: "⌘⌫",
			icon: <ArchiveIcon size={16} weight="regular" />,
		},
	],
};

const INITIAL_MENU_OPEN_STATE: MenuOpenState = {
	record: true,
	followUp: true,
};

const overlayRootStyle = {
	insetBlockStart: 0,
	insetInlineStart: 0,
	overflow: "visible",
	pointerEvents: "none",
	position: "fixed",
	zIndex: 1,
} as const;

export function DndKitMenuDemo() {
	const [items, setItems] = useState<MenuGroupState>(() => cloneMenuGroups());
	const [openMenus, setOpenMenus] = useState<MenuOpenState>(() => ({ ...INITIAL_MENU_OPEN_STATE }));
	const [snapshot, setSnapshot] = useState<MenuGroupState | null>(null);
	const [activeLabel, setActiveLabel] = useState<string | null>(null);
	const isDraggingRef = useRef(false);
	const isDragging = activeLabel !== null;
	const [status, setStatus] = useState(
		"Ready. Open either menu from its trigger, then reorder rows or move them between open menus.",
	);

	function reset() {
		setItems(cloneMenuGroups());
		setOpenMenus({ ...INITIAL_MENU_OPEN_STATE });
		setSnapshot(null);
		setActiveLabel(null);
		isDraggingRef.current = false;
		setStatus(
			"Ready. Open either menu from its trigger, then reorder rows or move them between open menus.",
		);
	}

	function handleOpenChange(groupId: MenuGroupId, open: boolean) {
		if (isDraggingRef.current) return;

		setOpenMenus((current) => ({
			...current,
			[groupId]: open,
		}));
	}

	function handleDragStart(event: DragStartEvent) {
		isDraggingRef.current = true;
		setOpenMenus({ ...INITIAL_MENU_OPEN_STATE });
		setSnapshot(cloneMenuGroups(items));
		setActiveLabel(String(event.operation.source?.data?.label ?? "Menu item"));
		setStatus("Dragging a Base UI menu item. Both menus stay open for this specimen.");
	}

	function handleDragOver(event: DragOverEvent) {
		setItems((current) => move(current, event));
	}

	function handleDragEnd(event: DragEndEvent) {
		if (event.canceled && snapshot) {
			setItems(snapshot);
			setStatus("Drag cancelled. Original menu order restored.");
		} else {
			setStatus("Drop finished. The visible menu order was retained.");
		}
		setSnapshot(null);
		setActiveLabel(null);
		isDraggingRef.current = false;
	}

	return (
		<DragDropProvider
			onDragStart={handleDragStart}
			onDragOver={handleDragOver}
			onDragEnd={handleDragEnd}
		>
			<DemoPanel
				title="dnd-kit with Base UI menu items"
				description="Sortable refs attach directly to the design-system Menu.Item rows while Base UI keeps menu row semantics."
				instructions={
					<DemoInstructions>
						<li>Both menus default open so the sortable behavior is inspectable.</li>
						<li>
							Close and reopen a menu from its trigger to test Base UI keyboard navigation before
							dragging.
						</li>
						<li>Focus a row and press Space or Enter to start keyboard dragging.</li>
						<li>Use arrow keys to reorder, then Space or Enter to drop, or Escape to cancel.</li>
					</DemoInstructions>
				}
				status={status}
				onReset={reset}
			>
				<div {...stylex.props(demoStyles.menuDemo)}>
					{MENU_GROUPS.map((group) => (
						<SortableMenu
							key={group.id}
							groupId={group.id}
							trigger={group.trigger}
							label={group.label}
							items={items[group.id]}
							open={isDragging || openMenus[group.id]}
							onOpenChange={(open) => handleOpenChange(group.id, open)}
						/>
					))}
				</div>
				<DragOverlay style={overlayRootStyle}>
					{activeLabel ? <MenuOverlay label={activeLabel} /> : null}
				</DragOverlay>
			</DemoPanel>
		</DragDropProvider>
	);
}

function SortableMenu({
	groupId,
	trigger,
	label,
	items,
	open,
	onOpenChange,
}: {
	groupId: MenuGroupId;
	trigger: string;
	label: string;
	items: MenuAction[];
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const { ref, isDropTarget } = useDroppable({
		id: groupId,
		accept: MENU_ITEM_TYPE,
		type: MENU_ITEM_TYPE,
	});

	return (
		<Menu.Root open={open} onOpenChange={onOpenChange} modal={false}>
			<Menu.Trigger render={<Button variant="neutral" />}>{trigger}</Menu.Trigger>
			<Menu.Popup
				ref={ref}
				data-drop-target={isDropTarget || undefined}
				positionerProps={{ side: "bottom", align: "start" }}
				xstyle={demoStyles.sortableMenuPopup}
			>
				<Menu.Group>
					<Menu.GroupLabel>{label}</Menu.GroupLabel>
					{items.length === 0 ? <EmptyMenuGroup label={label} /> : null}
					{items.map((item, index) => (
						<SortableMenuItem key={item.id} item={item} index={index} groupId={groupId} />
					))}
				</Menu.Group>
			</Menu.Popup>
		</Menu.Root>
	);
}

function EmptyMenuGroup({ label }: { label: string }) {
	return (
		<Menu.Item disabled closeOnClick={false} xstyle={demoStyles.emptyMenuItem}>
			Add {label.toLowerCase()}
		</Menu.Item>
	);
}

function SortableMenuItem({
	item,
	index,
	groupId,
}: {
	item: MenuAction;
	index: number;
	groupId: MenuGroupId;
}) {
	const { ref, handleRef, isDragging, isDropTarget } = useSortable({
		id: item.id,
		index,
		group: groupId,
		type: MENU_ITEM_TYPE,
		accept: MENU_ITEM_TYPE,
		data: {
			label: item.label,
			groupId,
		},
	});

	const mergedRef = useMergedRefs(ref, handleRef);

	return (
		<Menu.Item
			ref={mergedRef}
			closeOnClick={false}
			data-dragging={isDragging || undefined}
			data-drop-target={isDropTarget || undefined}
			xstyle={demoStyles.sortableMenuItem}
		>
			<Menu.ItemIcon>
				<DotsSixVerticalIcon weight="bold" />
			</Menu.ItemIcon>
			<Menu.ItemLabel>{item.label}</Menu.ItemLabel>
			<Menu.ItemShortcut>{item.shortcut}</Menu.ItemShortcut>
		</Menu.Item>
	);
}

function MenuOverlay({ label }: { label: string }) {
	return (
		<div {...stylex.props(demoStyles.menuOverlay)}>
			<DotsSixVerticalIcon aria-hidden weight="bold" />
			<span>{label}</span>
		</div>
	);
}

function cloneMenuGroups(groups: MenuGroupState = INITIAL_MENU_GROUPS): MenuGroupState {
	return {
		record: [...groups.record],
		followUp: [...groups.followUp],
	};
}
