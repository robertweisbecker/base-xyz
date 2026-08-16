import { DotsSixVerticalIcon, KanbanIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import { useState } from "react";
import {
	Button as AriaButton,
	GridList,
	GridListItem,
	type Key,
	useDragAndDrop,
	useListData,
	DropIndicator,
	isTextDropItem,
} from "react-aria-components";
import type { DroppableCollectionInsertDropEvent, DroppableCollectionRootDropEvent } from "react-aria-components";
import { EmptyState } from "@/components";
import { focusRing } from "@/styles/recipes/focus";
import { BOARD_COLUMNS, createInitialBoardItems, TASK_TYPE, type DemoBoardItem, type DemoColumnId } from "../demo-data";
import { DemoCard, DemoInstructions, DemoPanel } from "../demo-parts";
import { demoStyles } from "../drag-and-drop-demo.stylex";

export function ReactAriaBoardDemo() {
	const [boardKey, setBoardKey] = useState(0);

	return <ReactAriaBoardDemoInner key={boardKey} onReset={() => setBoardKey((key) => key + 1)} />;
}

function ReactAriaBoardDemoInner({ onReset }: { onReset: () => void }) {
	const list = useListData<DemoBoardItem>({
		initialItems: createInitialBoardItems(),
		getKey: (item) => item.id,
	});
	const [status, setStatus] = useState("Ready. Use the drag handles to reorder tasks or move them between columns.");

	return (
		<DemoPanel
			title="React Aria board"
			description="GridList collection APIs show insertion targets and commit moves from drop callbacks."
			instructions={
				<DemoInstructions>
					<li {...stylex.props(demoStyles.instructionItem)}>
						Focus a row handle and press Enter to start accessible drag mode.
					</li>
					<li {...stylex.props(demoStyles.instructionItem)}>
						Use arrow keys to choose an insertion point in the collection.
					</li>
					<li {...stylex.props(demoStyles.instructionItem)}>Press Enter to drop or Escape to cancel.</li>
				</DemoInstructions>
			}
			status={status}
			onReset={onReset}>
			<div {...stylex.props(demoStyles.board)}>
				{BOARD_COLUMNS.map((column) => (
					<ReactAriaBoardColumn
						key={column.id}
						columnId={column.id}
						label={column.label}
						items={list.items.filter((item) => item.columnId === column.id)}
						remove={list.remove}
						insertBefore={list.insertBefore}
						insertAfter={list.insertAfter}
						append={list.append}
						moveBefore={list.moveBefore}
						moveAfter={list.moveAfter}
						onStatus={setStatus}
					/>
				))}
			</div>
		</DemoPanel>
	);
}

function ReactAriaBoardColumn({
	columnId,
	label,
	items,
	remove,
	insertBefore,
	insertAfter,
	append,
	moveBefore,
	moveAfter,
	onStatus,
}: {
	columnId: DemoColumnId;
	label: string;
	items: DemoBoardItem[];
	remove: (key: Key) => void;
	insertBefore: (key: Key, item: DemoBoardItem) => void;
	insertAfter: (key: Key, item: DemoBoardItem) => void;
	append: (item: DemoBoardItem) => void;
	moveBefore: (key: Key, keys: Iterable<Key>) => void;
	moveAfter: (key: Key, keys: Iterable<Key>) => void;
	onStatus: (message: string) => void;
}) {
	const { dragAndDropHooks } = useDragAndDrop<DemoBoardItem>({
		getItems: (_keys, draggedItems) =>
			draggedItems.map((item) => ({
				[TASK_TYPE]: JSON.stringify(item),
				"text/plain": item.label,
			})),
		acceptedDragTypes: [TASK_TYPE],
		getDropOperation: () => "move",
		renderDropIndicator: (target) => (
			<DropIndicator target={target} className={stylex.props(demoStyles.dropIndicator).className} />
		),
		onReorder(event) {
			if (event.target.dropPosition === "before") {
				moveBefore(event.target.key, event.keys);
			} else if (event.target.dropPosition === "after") {
				moveAfter(event.target.key, event.keys);
			}
			onStatus(`Moved task within ${label}.`);
		},
		async onInsert(event) {
			const moved = await readReactAriaBoardItem(event);
			if (!moved) return;
			const next = { ...moved, columnId };
			remove(next.id);
			if (event.target.dropPosition === "before") {
				insertBefore(event.target.key, next);
			} else {
				insertAfter(event.target.key, next);
			}
			onStatus(`Moved ${next.label} to ${label}.`);
		},
		async onRootDrop(event) {
			const moved = await readReactAriaBoardItem(event);
			if (!moved) return;
			const next = { ...moved, columnId };
			remove(next.id);
			append(next);
			onStatus(`Moved ${next.label} to empty space in ${label}.`);
		},
	});

	return (
		<section {...stylex.props(demoStyles.column, focusRing.within)} aria-label={label}>
			<div {...stylex.props(demoStyles.columnHeader)}>
				<span {...stylex.props(demoStyles.columnTitle)}>{label}</span>
				<span {...stylex.props(demoStyles.columnCount)}>{items.length} tasks</span>
			</div>
			<GridList
				aria-label={`${label} tasks`}
				items={items}
				selectionMode="none"
				dragAndDropHooks={dragAndDropHooks}
				renderEmptyState={() => (
					<EmptyState
						headingLevel="h3"
						size="sm"
						title="No items"
						description="Move completed tasks here."
						icon={<KanbanIcon weight="duotone" />}
					/>
				)}
				className={stylex.props(demoStyles.list).className}>
				{(item) => (
					<GridListItem id={item.id} textValue={item.label} value={item}>
						<DemoCard
							label={item.label}
							meta="Task"
							endSlot={
								<AriaButton
									slot="drag"
									aria-label={`Move ${item.label}`}
									className={stylex.props(demoStyles.handle, focusRing.offset).className}>
									<DotsSixVerticalIcon aria-hidden focusable="false" size={18} weight="bold" />
								</AriaButton>
							}
						/>
					</GridListItem>
				)}
			</GridList>
		</section>
	);
}

async function readReactAriaBoardItem(
	event: DroppableCollectionInsertDropEvent | DroppableCollectionRootDropEvent,
): Promise<DemoBoardItem | null> {
	const item = event.items.find((dropItem) => isTextDropItem(dropItem) && dropItem.types.has(TASK_TYPE));
	if (!item || !isTextDropItem(item)) return null;
	return parseBoardItem(await item.getText(TASK_TYPE));
}

function parseBoardItem(serializedItem: string): DemoBoardItem | null {
	const item: unknown = JSON.parse(serializedItem);
	if (
		typeof item !== "object" ||
		item === null ||
		!("id" in item) ||
		!("label" in item) ||
		!("kind" in item) ||
		!("columnId" in item) ||
		typeof item.id !== "string" ||
		typeof item.label !== "string" ||
		(item.kind !== "task" && item.kind !== "asset") ||
		(item.columnId !== "backlog" && item.columnId !== "done")
	) {
		return null;
	}
	return { id: item.id, label: item.label, kind: item.kind, columnId: item.columnId };
}
