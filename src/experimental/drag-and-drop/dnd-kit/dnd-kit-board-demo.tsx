import { move } from "@dnd-kit/helpers";
import {
	DragDropProvider,
	useDroppable,
	type DragEndEvent,
	type DragOverEvent,
} from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import * as stylex from "@stylexjs/stylex";
import { useState } from "react";
import { EmptyState } from "@/components";
import { focusRing } from "@/styles/recipes/focus";
import {
	BOARD_COLUMNS,
	cloneBoardState,
	createInitialBoardState,
	TASK_TYPE,
	type DemoBoardState,
	type DemoColumnId,
	type DemoItem,
} from "../demo-data";
import { DemoCard, DemoHandle, DemoInstructions, DemoPanel } from "../demo-parts";
import { demoStyles } from "../drag-and-drop-demo.stylex";
import { KanbanIcon } from "@phosphor-icons/react";

export function DndKitBoardDemo() {
	const [board, setBoard] = useState<DemoBoardState>(() => createInitialBoardState());
	const [snapshot, setSnapshot] = useState<DemoBoardState | null>(null);
	const [status, setStatus] = useState(
		"Ready. Use the drag handles to reorder tasks or move them between columns.",
	);

	function reset() {
		setBoard(createInitialBoardState());
		setSnapshot(null);
		setStatus("Ready. Use the drag handles to reorder tasks or move them between columns.");
	}

	function handleDragStart() {
		setSnapshot(cloneBoardState(board));
		setStatus("dnd-kit drag started. Items reflow optimistically while dragging.");
	}

	function handleDragOver(event: DragOverEvent) {
		setBoard((current) => move(current, event));
	}

	function handleDragEnd(event: DragEndEvent) {
		if (event.canceled && snapshot) {
			setBoard(snapshot);
			setStatus("Drag cancelled. Snapshot restored.");
		} else {
			setStatus("Drop finished. The live reflow state was retained.");
		}
		setSnapshot(null);
	}

	return (
		<DragDropProvider
			onDragStart={handleDragStart}
			onDragOver={handleDragOver}
			onDragEnd={handleDragEnd}
		>
			<DemoPanel
				title="dnd-kit board"
				description="Sortable primitives provide optimistic geometric reflow while the provider reconciles drag events."
				instructions={
					<DemoInstructions>
						<li {...stylex.props(demoStyles.instructionItem)}>
							Focus a handle and press Space or Enter to start.
						</li>
						<li {...stylex.props(demoStyles.instructionItem)}>
							Use arrow keys to move through positions or columns.
						</li>
						<li {...stylex.props(demoStyles.instructionItem)}>
							Press Escape to cancel and restore the snapshot.
						</li>
					</DemoInstructions>
				}
				status={status}
				onReset={reset}
			>
				<div {...stylex.props(demoStyles.board)}>
					{BOARD_COLUMNS.map((column) => (
						<DndKitBoardColumn
							key={column.id}
							columnId={column.id}
							label={column.label}
							items={board[column.id]}
						/>
					))}
				</div>
			</DemoPanel>
		</DragDropProvider>
	);
}

function DndKitBoardColumn({
	columnId,
	label,
	items,
}: {
	columnId: DemoColumnId;
	label: string;
	items: DemoItem[];
}) {
	const { ref, isDropTarget } = useDroppable({
		id: columnId,
		accept: TASK_TYPE,
		type: TASK_TYPE,
	});

	return (
		<section
			ref={ref}
			aria-label={label}
			data-drop-target={isDropTarget || undefined}
			{...stylex.props(demoStyles.column, focusRing.within)}
		>
			<div {...stylex.props(demoStyles.columnHeader)}>
				<span {...stylex.props(demoStyles.columnTitle)}>{label}</span>
				<span {...stylex.props(demoStyles.columnCount)}>{items.length} tasks</span>
			</div>
			<ul {...stylex.props(demoStyles.list)}>
				{items.length === 0 ? (
					<li>
						<EmptyState
							headingLevel="h3"
							size="sm"
							icon={<KanbanIcon weight="duotone" />}
							title="No items"
							description="Move completed tasks here."
							xstyle={demoStyles.empty}
						/>
					</li>
				) : null}
				{items.map((item, index) => (
					<DndKitSortableTask key={item.id} item={item} index={index} columnId={columnId} />
				))}
			</ul>
		</section>
	);
}

function DndKitSortableTask({
	item,
	index,
	columnId,
}: {
	item: DemoItem;
	index: number;
	columnId: DemoColumnId;
}) {
	const { ref, handleRef, isDragging, isDropTarget } = useSortable({
		id: item.id,
		index,
		group: columnId,
		type: TASK_TYPE,
		accept: TASK_TYPE,
		data: {
			label: item.label,
			columnId,
		},
	});

	return (
		<li>
			<DemoCard
				ref={ref}
				data-dragging={isDragging || undefined}
				data-drop-target={isDropTarget || undefined}
				label={item.label}
				meta="Task"
				endSlot={<DemoHandle ref={handleRef} label={`Move ${item.label}`} />}
			/>
		</li>
	);
}
