import * as stylex from "@stylexjs/stylex";
import { useRef, useState } from "react";
import { useButton } from "react-aria/useButton";
import { useDrag } from "react-aria/useDrag";
import { isTextDropItem, type TextDropItem, useDrop } from "react-aria/useDrop";
import { Button } from "@/components";
import { focusRing } from "@/styles/recipes/focus";
import { parseDemoItemString, TASK_TYPE, TRANSFER_ITEM } from "../demo-data";
import { DemoCard, DemoDropZone, DemoHandle, DemoInstructions, DemoPanel } from "../demo-parts";
import { demoStyles } from "../drag-and-drop-demo.stylex";
import { EmptyState } from "@/components/empty-state/empty-state";
import { TrayIcon } from "@phosphor-icons/react";

type AccessibleLocation = "source" | "planning" | "release";

export function ReactAriaAccessibilityDemo() {
	const [location, setLocation] = useState<AccessibleLocation>("source");
	const [count, setCount] = useState(0);
	const [status, setStatus] = useState(
		"Ready. The nested action should work without starting a drag.",
	);

	function reset() {
		setLocation("source");
		setCount(0);
		setStatus("Ready. The nested action should work without starting a drag.");
	}

	const card = (
		<ReactAriaAccessibleCard
			count={count}
			onNestedAction={() => {
				setCount((value) => value + 1);
				setStatus("Nested action clicked without starting a drag.");
			}}
			onDragStart={() => setStatus("React Aria drag started from the card or handle.")}
			onDragEnd={(moved) => {
				if (!moved) {
					setStatus("Drag cancelled.");
				}
			}}
		/>
	);

	return (
		<DemoPanel
			title="React Aria accessibility and composition"
			description="The card can own arbitrary nested controls while React Aria keeps keyboard and screen-reader drag initiation on the explicit handle."
			instructions={
				<DemoInstructions>
					<li {...stylex.props(demoStyles.instructionItem)}>
						Keyboard: press Enter on the handle, Tab or Shift+Tab through valid targets, Enter to
						drop, Escape to cancel.
					</li>
					<li {...stylex.props(demoStyles.instructionItem)}>
						Collection story: use arrow keys to choose board insertion positions.
					</li>
					<li {...stylex.props(demoStyles.instructionItem)}>
						Touch screen reader: library documented as double-tap handle, swipe valid targets,
						double-tap to drop.
					</li>
				</DemoInstructions>
			}
			status={`${status} Current location: ${getLocationLabel(location)}. Nested action count: ${count}.`}
			onReset={reset}
		>
			<div {...stylex.props(demoStyles.transferGrid)}>
				<div {...stylex.props(demoStyles.sourceTray)} aria-label="Source tray">
					{location === "source" ? (
						card
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
				<ReactAriaAccessibleTarget
					label="Planning queue"
					onDrop={(label) => {
						setLocation("planning");
						setStatus(`Dropped ${label} into Planning queue.`);
					}}
				>
					{location === "planning" ? card : null}
				</ReactAriaAccessibleTarget>
				<ReactAriaAccessibleTarget
					label="Release queue"
					onDrop={(label) => {
						setLocation("release");
						setStatus(`Dropped ${label} into Release queue.`);
					}}
				>
					{location === "release" ? card : null}
				</ReactAriaAccessibleTarget>
			</div>
		</DemoPanel>
	);
}

function ReactAriaAccessibleCard({
	count,
	onNestedAction,
	onDragStart,
	onDragEnd,
}: {
	count: number;
	onNestedAction: () => void;
	onDragStart: () => void;
	onDragEnd: (moved: boolean) => void;
}) {
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const { dragProps, dragButtonProps, isDragging } = useDrag({
		hasDragButton: true,
		getAllowedDropOperations: () => ["move"],
		getItems: () => [
			{
				[TASK_TYPE]: JSON.stringify({ label: TRANSFER_ITEM.label }),
				"text/plain": TRANSFER_ITEM.label,
			},
		],
		onDragStart,
		onDragEnd: (event) => onDragEnd(event.dropOperation === "move"),
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
			meta="Article with nested action"
			endSlot={
				<>
					<Button
						size="sm"
						variant="secondary"
						onClick={onNestedAction}
						xstyle={demoStyles.nestedAction}
					>
						Count {count}
					</Button>
					<DemoHandle {...handleProps} ref={buttonRef} label={`Move ${TRANSFER_ITEM.label}`} />
				</>
			}
		/>
	);
}

function ReactAriaAccessibleTarget({
	label,
	onDrop,
	children,
}: {
	label: string;
	onDrop: (label: string) => void;
	children?: React.ReactNode;
}) {
	const ref = useRef<HTMLDivElement | null>(null);
	const { dropProps, isDropTarget } = useDrop({
		ref,
		getDropOperation: (types) => (types.has(TASK_TYPE) ? "move" : "cancel"),
		onDrop: async (event) => {
			const item = event.items.find((dropItem): dropItem is TextDropItem =>
				isTextDropItem(dropItem),
			);
			if (!item || !item.types.has(TASK_TYPE)) return;
			const label = parseDemoItemString(await item.getText(TASK_TYPE), "label");
			if (label) onDrop(label);
		},
	});

	return (
		<div
			{...dropProps}
			ref={ref}
			role="group"
			aria-label={label}
			data-drop-target={isDropTarget || undefined}
			{...stylex.props(demoStyles.dropZone, focusRing.within)}
		>
			<DemoDropZone label={label} description="Accepts this task.">
				{children}
			</DemoDropZone>
		</div>
	);
}

function getLocationLabel(location: AccessibleLocation) {
	if (location === "planning") return "Planning queue";
	if (location === "release") return "Release queue";
	return "Source tray";
}
