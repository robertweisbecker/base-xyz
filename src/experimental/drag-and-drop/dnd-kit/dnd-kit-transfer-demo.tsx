import { DragDropProvider, useDraggable, useDroppable, type DragEndEvent } from "@dnd-kit/react";
import * as stylex from "@stylexjs/stylex";
import { useRef, useState } from "react";
import { focusRing } from "@/styles/recipes/focus";
import { ASSET_TYPE, TASK_TYPE, TRANSFER_DESTINATIONS, TRANSFER_ITEM } from "../demo-data";
import { DemoCard, DemoDropZone, DemoHandle, DemoInstructions, DemoPanel } from "../demo-parts";
import { demoStyles } from "../drag-and-drop-demo.stylex";
import { EmptyState } from "@/components/empty-state/empty-state";
import { TrayIcon } from "@phosphor-icons/react";

type Location = "source" | "planning";

export function DndKitTransferDemo() {
	const [location, setLocation] = useState<Location>("source");
	const [isDragging, setIsDragging] = useState(false);
	const [isInvalidHover, setIsInvalidHover] = useState(false);
	const [isRejected, setIsRejected] = useState(false);
	const [status, setStatus] = useState("Ready. Quarterly roadmap starts in the source tray.");
	const lastTargetWasInvalidRef = useRef(false);

	function reset() {
		setLocation("source");
		setIsDragging(false);
		setIsInvalidHover(false);
		setIsRejected(false);
		lastTargetWasInvalidRef.current = false;
		setStatus("Ready. Quarterly roadmap starts in the source tray.");
	}

	function handleDragEnd(event: DragEndEvent) {
		setIsDragging(false);
		if (event.canceled) {
			setStatus("Drag cancelled. The item stayed put.");
			return;
		}

		if (event.operation.target?.id === TRANSFER_DESTINATIONS.planning.id) {
			setLocation("planning");
			setIsRejected(false);
			setStatus("Dropped Quarterly roadmap into Planning queue.");
			return;
		}

		if (
			lastTargetWasInvalidRef.current ||
			event.operation.target?.id === TRANSFER_DESTINATIONS.assets.id
		) {
			setIsRejected(true);
			setIsInvalidHover(false);
			lastTargetWasInvalidRef.current = false;
			setStatus("Asset library rejected the task. The item stayed put.");
			return;
		}

		setIsInvalidHover(false);
		lastTargetWasInvalidRef.current = false;
		setStatus("Drop target was missing. The item stayed put.");
	}

	return (
		<DragDropProvider
			onDragStart={() => {
				setIsDragging(true);
				lastTargetWasInvalidRef.current = false;
				setIsInvalidHover(false);
				setIsRejected(false);
				setStatus("dnd-kit drag started.");
			}}
			onDragEnd={handleDragEnd}>
			<DemoPanel
				title="dnd-kit 0.5"
				description="The provider owns the drag session, and draggable IDs, types, and data drive validation."
				instructions={
					<DemoInstructions>
						<li {...stylex.props(demoStyles.instructionItem)}>Focus the handle and press Space or Enter to start.</li>
						<li {...stylex.props(demoStyles.instructionItem)}>
							Use arrow keys to reach a target, then press Space or Enter to drop.
						</li>
						<li {...stylex.props(demoStyles.instructionItem)}>
							Pointer and touch activation also start from the handle in this baseline.
						</li>
					</DemoInstructions>
				}
				status={status}
				onReset={reset}>
				<div {...stylex.props(demoStyles.transferGrid)}>
					<div {...stylex.props(demoStyles.sourceTray)} aria-label="Source tray">
						{location === "source" ? (
							<DndKitTransferCard />
						) : (
							<EmptyState
								headingLevel="h3"
								size="sm"
								title="No more items"
								description="Tray is empty."
								icon={<TrayIcon weight="duotone" />}
							/>
						)}
					</div>
					<DndKitTransferDropZone
						id={TRANSFER_DESTINATIONS.planning.id}
						label={TRANSFER_DESTINATIONS.planning.label}
						description="Accepts tasks."
						accept={TASK_TYPE}>
						{location === "planning" ? (
							<DemoCard label={TRANSFER_ITEM.label} meta="Dropped task" startSlot={<span aria-hidden />} />
						) : null}
					</DndKitTransferDropZone>
					<DndKitTransferDropZone
						id={TRANSFER_DESTINATIONS.assets.id}
						label={TRANSFER_DESTINATIONS.assets.label}
						description="Accepts assets. This task should be rejected."
						accept={ASSET_TYPE}
						isDragging={isDragging}
						isInvalid={isInvalidHover || isRejected}
						onInvalidHoverChange={(isHovering) => {
							if (isHovering) lastTargetWasInvalidRef.current = true;
							setIsInvalidHover(isHovering);
						}}
					/>
				</div>
			</DemoPanel>
		</DragDropProvider>
	);
}

function DndKitTransferCard() {
	const { ref, handleRef, isDragging } = useDraggable({
		id: TRANSFER_ITEM.id,
		type: TASK_TYPE,
		data: {
			label: TRANSFER_ITEM.label,
			kind: TRANSFER_ITEM.kind,
		},
	});

	return (
		<DemoCard
			ref={ref}
			data-dragging={isDragging || undefined}
			label={TRANSFER_ITEM.label}
			meta="Task item"
			endSlot={<DemoHandle ref={handleRef} label={`Move ${TRANSFER_ITEM.label}`} />}
		/>
	);
}

function DndKitTransferDropZone({
	id,
	label,
	description,
	accept,
	isDragging,
	isInvalid,
	onInvalidHoverChange,
	children,
}: {
	id: string;
	label: string;
	description: string;
	accept: string;
	isDragging?: boolean;
	isInvalid?: boolean;
	onInvalidHoverChange?: (isHovering: boolean) => void;
	children?: React.ReactNode;
}) {
	const { ref, isDropTarget } = useDroppable({ id, accept });

	return (
		<div
			ref={ref}
			role="group"
			aria-label={label}
			data-drop-target={isDropTarget || undefined}
			data-invalid={isInvalid || undefined}
			onPointerEnter={() => {
				if (isDragging && accept !== TASK_TYPE) onInvalidHoverChange?.(true);
			}}
			onPointerLeave={() => onInvalidHoverChange?.(false)}
			{...stylex.props(demoStyles.dropZone, focusRing.within)}>
			<DemoDropZone label={label} description={description} isInvalid={isInvalid}>
				{children}
			</DemoDropZone>
		</div>
	);
}
