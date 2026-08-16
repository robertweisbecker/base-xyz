import * as stylex from "@stylexjs/stylex";
import { useRef, useState } from "react";
import { useButton } from "react-aria/useButton";
import { useDrag } from "react-aria/useDrag";
import { isTextDropItem, type TextDropItem, useDrop } from "react-aria/useDrop";
import { focusRing } from "@/styles/recipes/focus";
import { ASSET_TYPE, parseDemoItemString, TASK_TYPE, TRANSFER_DESTINATIONS, TRANSFER_ITEM } from "../demo-data";
import { DemoCard, DemoDropZone, DemoHandle, DemoInstructions, DemoPanel } from "../demo-parts";
import { demoStyles } from "../drag-and-drop-demo.stylex";
import { EmptyState } from "@/components/empty-state/empty-state";
import { TrayIcon } from "@phosphor-icons/react";

type Location = "source" | "planning";

export function ReactAriaTransferDemo() {
	const [location, setLocation] = useState<Location>("source");
	const [isInvalidHover, setIsInvalidHover] = useState(false);
	const [isRejected, setIsRejected] = useState(false);
	const [status, setStatus] = useState("Ready. Quarterly roadmap starts in the source tray.");
	const lastTargetWasInvalidRef = useRef(false);

	function reset() {
		setLocation("source");
		setIsInvalidHover(false);
		setIsRejected(false);
		lastTargetWasInvalidRef.current = false;
		setStatus("Ready. Quarterly roadmap starts in the source tray.");
	}

	return (
		<DemoPanel
			title="React Aria"
			description="Low-level hooks expose native drag data and target-focused keyboard navigation without an explicit provider."
			instructions={
				<DemoInstructions>
					<li {...stylex.props(demoStyles.instructionItem)}>Drag the card surface to Planning queue with a pointer.</li>
					<li {...stylex.props(demoStyles.instructionItem)}>
						Focus the handle, press Enter, Tab to a valid target, then press Enter to drop.
					</li>
					<li {...stylex.props(demoStyles.instructionItem)}>Press Escape during keyboard drag to cancel.</li>
				</DemoInstructions>
			}
			status={status}
			onReset={reset}>
			<div {...stylex.props(demoStyles.transferGrid)}>
				<div {...stylex.props(demoStyles.sourceTray)} aria-label="Source tray">
					{location === "source" ? (
						<ReactAriaTransferCard
							onDragStart={() => {
								lastTargetWasInvalidRef.current = false;
								setIsInvalidHover(false);
								setIsRejected(false);
								setStatus("React Aria drag started.");
							}}
							onDragEnd={(operation) => {
								if (operation === "cancel" && lastTargetWasInvalidRef.current) {
									setIsRejected(true);
									setIsInvalidHover(false);
									lastTargetWasInvalidRef.current = false;
									setStatus("Asset library rejected the task. The item stayed put.");
									return;
								}

								setIsInvalidHover(false);
								lastTargetWasInvalidRef.current = false;
								setStatus(operation === "cancel" ? "Drag cancelled. The item stayed put." : "Drag finished.");
							}}
						/>
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
				<ReactAriaTransferDropZone
					label={TRANSFER_DESTINATIONS.planning.label}
					description="Accepts tasks."
					accepts={TASK_TYPE}
					onDrop={(item) => {
						if (item.id !== TRANSFER_ITEM.id) return;
						setLocation("planning");
						setIsRejected(false);
						setStatus("Dropped Quarterly roadmap into Planning queue.");
					}}>
					{location === "planning" ? (
						<DemoCard label={TRANSFER_ITEM.label} meta="Dropped task" startSlot={<span aria-hidden />} />
					) : null}
				</ReactAriaTransferDropZone>
				<ReactAriaTransferDropZone
					label={TRANSFER_DESTINATIONS.assets.label}
					description="Accepts assets. This task should be rejected."
					accepts={ASSET_TYPE}
					isInvalid={isInvalidHover || isRejected}
					onInvalidHoverChange={(isHovering) => {
						if (isHovering) lastTargetWasInvalidRef.current = true;
						setIsInvalidHover(isHovering);
					}}
				/>
			</div>
		</DemoPanel>
	);
}

function ReactAriaTransferCard({
	onDragStart,
	onDragEnd,
}: {
	onDragStart: () => void;
	onDragEnd: (operation: "move" | "cancel") => void;
}) {
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const { dragProps, dragButtonProps, isDragging } = useDrag({
		hasDragButton: true,
		getAllowedDropOperations: () => ["move"],
		getItems: () => [
			{
				[TASK_TYPE]: JSON.stringify({ id: TRANSFER_ITEM.id }),
				"text/plain": TRANSFER_ITEM.label,
			},
		],
		onDragStart,
		onDragEnd: (event) => onDragEnd(event.dropOperation === "move" ? "move" : "cancel"),
	});
	const { buttonProps } = useButton(dragButtonProps, buttonRef);
	const { style: cardDomStyle, ...cardDragProps } = dragProps;
	const { style: handleDomStyle, ...handleProps } = buttonProps;
	void cardDomStyle;
	void handleDomStyle;

	return (
		<DemoCard
			{...cardDragProps}
			data-dragging={isDragging || undefined}
			label={TRANSFER_ITEM.label}
			meta="Task item"
			endSlot={<DemoHandle {...handleProps} ref={buttonRef} label={`Move ${TRANSFER_ITEM.label}`} />}
		/>
	);
}

function ReactAriaTransferDropZone({
	label,
	description,
	accepts,
	isInvalid,
	onDrop,
	onInvalidHoverChange,
	children,
}: {
	label: string;
	description: string;
	accepts: string;
	isInvalid?: boolean;
	onDrop?: (item: { id: string }) => void;
	onInvalidHoverChange?: (isHovering: boolean) => void;
	children?: React.ReactNode;
}) {
	const ref = useRef<HTMLDivElement | null>(null);
	const { dropProps, isDropTarget } = useDrop({
		ref,
		getDropOperation: (types) => (types.has(accepts) ? "move" : "cancel"),
		onDrop: async (event) => {
			const item = event.items.find((dropItem): dropItem is TextDropItem => isTextDropItem(dropItem));
			if (!item || !item.types.has(TASK_TYPE)) return;

			const id = parseDemoItemString(await item.getText(TASK_TYPE), "id");
			if (id) onDrop?.({ id });
		},
	});

	return (
		<div
			{...dropProps}
			ref={ref}
			role="group"
			aria-label={label}
			data-drop-target={isDropTarget || undefined}
			data-invalid={isInvalid || undefined}
			onDragEnter={() => {
				if (accepts !== TASK_TYPE) onInvalidHoverChange?.(true);
			}}
			onDragLeave={() => onInvalidHoverChange?.(false)}
			{...stylex.props(demoStyles.dropZone, focusRing.within)}>
			<DemoDropZone label={label} description={description} isInvalid={isInvalid}>
				{children}
			</DemoDropZone>
		</div>
	);
}
