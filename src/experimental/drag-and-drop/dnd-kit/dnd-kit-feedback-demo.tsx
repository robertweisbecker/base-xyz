import { PointerActivationConstraints, PointerSensor } from "@dnd-kit/dom";
import { arrayMove } from "@dnd-kit/helpers";
import {
	DragDropProvider,
	DragOverlay,
	type DragEndEvent,
	type DragOverEvent,
	type DragStartEvent,
} from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import * as stylex from "@stylexjs/stylex";
import { useState } from "react";
import { TASK_TYPE, type DemoItem } from "../demo-data";
import { DemoCard, DemoHandle, DemoInstructions, DemoPanel } from "../demo-parts";
import { demoStyles } from "../drag-and-drop-demo.stylex";

const INITIAL_ITEMS: DemoItem[] = [
	{ id: "triage-signups", label: "Triage signups", kind: "task" },
	{ id: "score-expansion", label: "Score expansion leads", kind: "task" },
	{ id: "draft-playbook", label: "Draft renewal playbook", kind: "task" },
];

const overlayRootStyle = {
	insetBlockStart: 0,
	insetInlineStart: 0,
	overflow: "visible",
	pointerEvents: "none",
	position: "fixed",
	zIndex: 1,
} as const;

export function DndKitFeedbackDemo() {
	const [items, setItems] = useState(INITIAL_ITEMS);
	const [snapshot, setSnapshot] = useState<DemoItem[] | null>(null);
	const [activeLabel, setActiveLabel] = useState<string | null>(null);
	const [status, setStatus] = useState(
		"Ready. Pointer activation requires 5px movement, or 250ms touch hold within 5px.",
	);

	function reset() {
		setItems(INITIAL_ITEMS);
		setSnapshot(null);
		setActiveLabel(null);
		setStatus("Ready. Pointer activation requires 5px movement, or 250ms touch hold within 5px.");
	}

	function handleDragStart(event: DragStartEvent) {
		setSnapshot(items);
		setActiveLabel(String(event.operation.source?.data?.label ?? "Dragged task"));
		setStatus("Drag started. Overlay and live reflow are active.");
	}

	function handleDragOver(event: DragOverEvent) {
		const sourceId = String(event.operation.source?.id ?? "");
		const targetId = String(event.operation.target?.id ?? "");
		if (!sourceId || !targetId || sourceId === targetId) return;
		setItems((current) => {
			const from = current.findIndex((item) => item.id === sourceId);
			const to = current.findIndex((item) => item.id === targetId);
			return from >= 0 && to >= 0 ? arrayMove(current, from, to) : current;
		});
	}

	function handleDragEnd(event: DragEndEvent) {
		if (event.canceled && snapshot) {
			setItems(snapshot);
			setStatus("Drag cancelled. Snapshot restored.");
		} else {
			setStatus("Drop finished. Overlay removed after drop animation.");
		}
		setSnapshot(null);
		setActiveLabel(null);
	}

	return (
		<DragDropProvider
			sensors={(defaults) => [
				PointerSensor.configure({
					activationConstraints: (event) =>
						event.pointerType === "touch"
							? [new PointerActivationConstraints.Delay({ value: 250, tolerance: 5 })]
							: [new PointerActivationConstraints.Distance({ value: 5 })],
				}),
				...defaults.filter((sensor) => sensor !== PointerSensor),
			]}
			onDragStart={handleDragStart}
			onDragOver={handleDragOver}
			onDragEnd={handleDragEnd}
		>
			<DemoPanel
				title="dnd-kit sensors and overlay"
				description="The current adapter keeps keyboard defaults while allowing pointer activation constraints and custom overlays."
				instructions={
					<DemoInstructions>
						<li {...stylex.props(demoStyles.instructionItem)}>
							Mouse or pen: move at least 5px before drag starts.
						</li>
						<li {...stylex.props(demoStyles.instructionItem)}>
							Touch: hold 250ms and stay within 5px tolerance before activation.
						</li>
						<li {...stylex.props(demoStyles.instructionItem)}>
							Keyboard: Space or Enter starts, arrows move, Space or Enter drops, Escape cancels.
						</li>
					</DemoInstructions>
				}
				status={status}
				onReset={reset}
			>
				<div {...stylex.props(demoStyles.shortList)}>
					{items.map((item, index) => (
						<DndKitFeedbackItem key={item.id} item={item} index={index} />
					))}
				</div>
				<DragOverlay style={overlayRootStyle}>
					{activeLabel ? (
						<DemoCard label={activeLabel} meta="Overlay preview" style={demoStyles.overlay} />
					) : null}
				</DragOverlay>
			</DemoPanel>
		</DragDropProvider>
	);
}

function DndKitFeedbackItem({ item, index }: { item: DemoItem; index: number }) {
	const { ref, handleRef, isDragging, isDropTarget } = useSortable({
		id: item.id,
		index,
		group: "feedback-list",
		type: TASK_TYPE,
		accept: TASK_TYPE,
		data: {
			label: item.label,
		},
	});

	return (
		<DemoCard
			ref={ref}
			data-dragging={isDragging || undefined}
			data-drop-target={isDropTarget || undefined}
			label={item.label}
			meta="Sortable task"
			endSlot={<DemoHandle ref={handleRef} label={`Move ${item.label}`} />}
		/>
	);
}
