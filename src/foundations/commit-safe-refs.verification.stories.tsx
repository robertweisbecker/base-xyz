import type { Meta, StoryObj } from "@storybook/react-vite";
import { StrictMode, useCallback, useEffect, useRef, useState } from "react";
import { InlineEdit } from "@/experimental/inline-edit/inline-edit";
import { useScrollFade, type ScrollFadeAxis } from "@/hooks/use-scroll-fade";
import { useTextareaAutoResize } from "@/hooks/use-textarea-auto-resize";

const meta = {
	title: "Foundations/Commit-safe refs verification",
	parameters: { controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	render: () => (
		<StrictMode>
			<div style={{ display: "grid", gap: "2rem" }}>
				<ScrollFadeFixture />
				<TextareaFixture />
				<InlineEditFixture />
			</div>
		</StrictMode>
	),
};

function ScrollFadeFixture() {
	const [axis, setAxis] = useState<ScrollFadeAxis>("y");
	const [content, setContent] = useState<"short" | "wide">("short");
	const { ref: scrollFadeRef, overflowing: scrollFadeOverflowing } = useScrollFade({
		axis,
		contentKey: content,
	});
	const targetRef = useRef<HTMLDivElement | null>(null);
	const setTargetRef = useCallback(
		(element: HTMLDivElement | null) => {
			targetRef.current = element;
			const cleanup = scrollFadeRef(element);
			return () => {
				cleanup?.();
				targetRef.current = null;
			};
		},
		[scrollFadeRef],
	);

	useEffect(() => {
		targetRef.current?.setAttribute("data-overflowing", String(scrollFadeOverflowing));
	}, [scrollFadeOverflowing]);

	return (
		<section aria-label="Scroll fade verification">
			<button type="button" data-testid="scroll-fade-toggle-axis" onClick={() => setAxis("x")}>
				Use horizontal axis
			</button>{" "}
			<button
				type="button"
				data-testid="scroll-fade-toggle-content"
				onClick={() => setContent("wide")}
			>
				Make content wide
			</button>
			<div
				ref={setTargetRef}
				data-testid="scroll-fade-target"
				data-axis={axis}
				data-overflowing="false"
				style={{ height: "50px", overflow: "auto", width: "100px" }}
			>
				<div
					style={{
						height: axis === "y" ? "100px" : "20px",
						width: axis === "x" && content === "wide" ? "120px" : "20px",
					}}
				/>
			</div>
		</section>
	);
}

function TextareaFixture() {
	const [enabled, setEnabled] = useState(false);
	const [minRows, setMinRows] = useState(1);
	const [maxRows, setMaxRows] = useState<number | undefined>(undefined);
	const { ref, resize } = useTextareaAutoResize({
		enabled,
		rows: 1,
		minRows,
		maxRows,
	});

	return (
		<section aria-label="Textarea auto-resize verification">
			<button type="button" data-testid="textarea-enable" onClick={() => setEnabled(true)}>
				Enable resizing
			</button>{" "}
			<button type="button" data-testid="textarea-increase-min" onClick={() => setMinRows(3)}>
				Set minimum rows
			</button>{" "}
			<button type="button" data-testid="textarea-set-max" onClick={() => setMaxRows(2)}>
				Set maximum rows
			</button>{" "}
			<button
				type="button"
				data-testid="textarea-disable"
				onClick={() => {
					setEnabled(false);
					setMinRows(1);
					setMaxRows(undefined);
				}}
			>
				Disable resizing
			</button>
			<textarea
				ref={ref}
				data-testid="textarea-target"
				defaultValue="First line"
				onChange={resize}
				rows={1}
			/>
		</section>
	);
}

function InlineEditFixture() {
	const [uncontrolledProp, setUncontrolledProp] = useState(false);
	const [controlledProp, setControlledProp] = useState(true);
	const [controlledEditing, setControlledEditing] = useState(false);
	const [callbackVersion, setCallbackVersion] = useState(1);
	const [lastCallback, setLastCallback] = useState("none");
	const [showControlled, setShowControlled] = useState(true);
	const [confirmationSettled, setConfirmationSettled] = useState(false);

	const onEditingChange = useCallback(
		(editing: boolean, details: { reason: string }) => {
			setLastCallback(`${callbackVersion}:${editing ? "edit" : details.reason}`);
		},
		[callbackVersion],
	);

	return (
		<section aria-label="Inline edit verification">
			<button
				type="button"
				data-testid="inline-uncontrolled-prop"
				onClick={() => setUncontrolledProp(true)}
			>
				Add controlled prop to uncontrolled editor
			</button>{" "}
			<button
				type="button"
				data-testid="inline-controlled-prop"
				onClick={() => setControlledProp(false)}
			>
				Remove controlled prop from controlled editor
			</button>{" "}
			<button
				type="button"
				data-testid="inline-replace-callback"
				onClick={() => setCallbackVersion(2)}
			>
				Replace callback
			</button>
			<button type="button" data-testid="inline-unmount" onClick={() => setShowControlled(false)}>
				Unmount controlled editor
			</button>
			<div data-testid="inline-last-callback">{lastCallback}</div>
			<div data-testid="inline-confirmation-settled" data-settled={confirmationSettled}>
				{confirmationSettled ? "settled" : "pending"}
			</div>
			<div data-testid="inline-uncontrolled-editor">
				<InlineEdit.Root
					data-testid="inline-uncontrolled-root"
					editing={uncontrolledProp ? false : undefined}
					onEditingChange={onEditingChange}
				>
					<InlineEdit.Value label="Edit uncontrolled value">Uncontrolled value</InlineEdit.Value>
					<InlineEdit.Input aria-label="Uncontrolled input" defaultValue="Uncontrolled value" />
				</InlineEdit.Root>
			</div>
			{showControlled ? (
				<div data-testid="inline-controlled-editor">
					<InlineEdit.Root
						data-testid="inline-controlled-root"
						editing={controlledProp ? controlledEditing : undefined}
						onEditingChange={(editing, details) => {
							setLastCallback(`${callbackVersion}:${editing ? "edit" : details.reason}`);
							setControlledEditing(editing);
						}}
						onConfirm={() =>
							new Promise<void>((resolve) =>
								window.setTimeout(() => {
									setConfirmationSettled(true);
									resolve();
								}, 150),
							)
						}
					>
						<InlineEdit.Value label="Edit controlled value">Controlled value</InlineEdit.Value>
						<InlineEdit.Input aria-label="Controlled input" defaultValue="Controlled value" />
						<InlineEdit.Actions>
							<InlineEdit.Confirm />
						</InlineEdit.Actions>
					</InlineEdit.Root>
				</div>
			) : null}
		</section>
	);
}
