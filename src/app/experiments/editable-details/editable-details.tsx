import * as stylex from "@stylexjs/stylex";
import { useEffect, useId, useRef, useState } from "react";
import { Badge, Button, DescriptionList, Heading, Separator, Stack, Text } from "@/components";
import { tokens } from "@/theme/tokens.stylex";
import { InlineEdit } from "@/experimental/inline-edit/inline-edit";

/** Local-only example: each field commits only after its simulated request resolves. */
export function EditableDetails() {
	const [failNextSave, setFailNextSave] = useState(false);
	const failureRef = useRef(false);
	function consumeFailure() {
		const fail = failureRef.current;
		failureRef.current = false;
		setFailNextSave(false);
		return fail;
	}
	return (
		<Stack gap={5} maxWidth="48rem" width="100%">
			<Stack gap={1}>
				<Heading render={<h3 />} size="4" fontWeight="medium">
					Workspace details
				</Heading>
				<Text color="muted" size="2">
					Manage the details used on invoices and internal reports.
				</Text>
			</Stack>
			<DescriptionList.Root variant="divided" labelWidth="8rem" aria-label="Workspace details">
				<EditableDetail
					label="Workspace name"
					initialValue="Acme Design"
					description="Use 2–60 characters. Visible to everyone in this workspace."
					validate={(value) =>
						value.length < 2 || value.length > 60 ? "Use between 2 and 60 characters." : null
					}
					consumeFailure={consumeFailure}
				/>
				<EditableDetail
					label="Billing email"
					initialValue="billing@acme.design"
					description="Invoices and receipts are sent to this address."
					type="email"
					validate={(value) =>
						/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : "Enter a valid email address."
					}
					consumeFailure={consumeFailure}
				/>
				<EditableDetail
					label="Cost code"
					initialValue="DESIGN-042"
					description="Use 3–20 uppercase letters, numbers, or hyphens."
					validate={(value) =>
						/^[A-Z0-9-]{3,20}$/.test(value)
							? null
							: "Use 3–20 uppercase letters, numbers, or hyphens."
					}
					consumeFailure={consumeFailure}
				/>
				<DescriptionList.Item>
					<DescriptionList.Label>Plan</DescriptionList.Label>
					<DescriptionList.Value>
						<Badge hue="neutral" variant="elevated">
							Team
						</Badge>
					</DescriptionList.Value>
				</DescriptionList.Item>
			</DescriptionList.Root>
			<Separator />
			<Stack gap={2} align="start">
				<Text color="muted" size="1">
					Local demo · Enter saves, Escape cancels. Changes last until this page reloads.
				</Text>
				<Button
					size="sm"
					variant="secondary"
					aria-pressed={failNextSave}
					onClick={() => {
						failureRef.current = !failureRef.current;
						setFailNextSave(failureRef.current);
					}}
				>
					{failNextSave ? "Next save will fail" : "Simulate a failed save"}
				</Button>
				<Text color="muted" size="1">
					The next valid save will fail once. Keep your draft and save again to retry.
				</Text>
			</Stack>
		</Stack>
	);
}

function EditableDetail({
	label,
	initialValue,
	description,
	type = "text",
	validate,
	consumeFailure,
}: {
	label: string;
	initialValue: string;
	description: string;
	type?: "text" | "email";
	validate: (value: string) => string | null;
	consumeFailure: () => boolean;
}) {
	const id = useId();
	const [value, setValue] = useState(initialValue);
	const [draft, setDraft] = useState(initialValue);
	const [editing, setEditing] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [status, setStatus] = useState("");
	const mounted = useRef(false);
	useEffect(() => {
		mounted.current = true;
		return () => {
			mounted.current = false;
		};
	}, []);
	async function save() {
		const next = draft.trim();
		const invalid = validate(next);
		if (invalid) throw new Error(invalid);
		setError(null);
		setStatus(`Saving ${label.toLowerCase()}…`);
		const fail = consumeFailure();
		await new Promise<void>((resolve) => setTimeout(resolve, 900));
		if (!mounted.current) return;
		if (fail) throw new Error("Could not save. Your draft is kept. Try saving again.");
		setValue(next);
		setDraft(next);
		setStatus(`${label} saved.`);
	}
	return (
		<DescriptionList.Item>
			<DescriptionList.Label id={`${id}-label`}>{label}</DescriptionList.Label>
			<DescriptionList.Value>
				<Stack gap={2}>
					<InlineEdit.Root
						confirmOnBlur={false}
						confirmOnEnter
						editing={editing}
						onConfirm={save}
						onConfirmError={(failure) => {
							setError(failure instanceof Error ? failure.message : "Could not save. Try again.");
							setStatus("");
						}}
						onEditingChange={(next, details) => {
							setEditing(next);
							if (details.reason !== "confirm") {
								setDraft(value);
								setError(null);
								setStatus("");
							}
						}}
						xstyle={styles.editor}
					>
						<InlineEdit.Value label={`Edit ${label.toLowerCase()}: ${value}`}>
							{value}
						</InlineEdit.Value>
						<InlineEdit.Input
							aria-labelledby={`${id}-label`}
							aria-describedby={`${id}-hint${error ? ` ${id}-error` : ""}`}
							aria-invalid={error ? true : undefined}
							type={type}
							onInvalid={(event) => {
								event.preventDefault();
								event.currentTarget.focus();
								setError(validate(draft.trim()) ?? "Check this value before saving.");
							}}
							value={draft}
							onValueChange={(next) => {
								setDraft(next);
								setError(null);
							}}
							xstyle={[styles.input, editing && styles.inputEditing]}
						/>
						<InlineEdit.Actions>
							<InlineEdit.Confirm />
							<InlineEdit.Cancel />
						</InlineEdit.Actions>
					</InlineEdit.Root>
					<Text id={`${id}-hint`} color="muted" size="1">
						{description}
					</Text>
					{error && (
						<Text id={`${id}-error`} role="alert" color="error" size="1">
							{error}
						</Text>
					)}
					<Text role="status" aria-live="polite" color="muted" size="1" xstyle={styles.status}>
						{status}
					</Text>
				</Stack>
			</DescriptionList.Value>
		</DescriptionList.Item>
	);
}

const styles = stylex.create({
	editor: { boxSizing: "border-box", maxWidth: "100%" },
	input: { fontSize: tokens["--type-large-size"], minWidth: 0 },
	inputEditing: { width: "100%" },
	status: { minHeight: tokens["--type-supporting-line-height"] },
});
