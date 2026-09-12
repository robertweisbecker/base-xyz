import type { Meta, StoryObj } from "@storybook/react-vite";
import { useId, useRef, useState } from "react";
import {
	Button,
	Checkbox,
	Field,
	Form,
	Label,
	NumberField,
	Separator,
	Stack,
	Text,
	Textarea,
	TextField,
	type FormActions,
	type FormValidationMode,
} from "@/components";

type FormStoryArgs = { validationMode: FormValidationMode };

const meta = {
	title: "Components/Form",
	component: Form,
	args: { validationMode: "onSubmit" },
	argTypes: {
		validationMode: { control: "inline-radio", options: ["onSubmit", "onBlur", "onChange"] },
	},
	parameters: { controls: { include: ["validationMode"] } },
} satisfies Meta<FormStoryArgs>;

export default meta;
type Story = StoryObj<FormStoryArgs>;

export const Playground: Story = {
	render: function Render({ validationMode }) {
		const [submitted, setSubmitted] = useState("");
		return (
			<Form<{ email: string }>
				key={validationMode}
				validationMode={validationMode}
				onFormSubmit={(values) => setSubmitted(JSON.stringify(values))}
			>
				<Stack gap={4} maxWidth="400px">
					<Field.Root name="email">
						<Label>Email address</Label>
						<TextField type="email" required placeholder="you@example.com" />
						<Field.Description>Receive account notifications.</Field.Description>
						<Field.Error match="valueMissing">Enter an email address.</Field.Error>
						<Field.Error match="typeMismatch">Enter a valid email address.</Field.Error>
					</Field.Root>
					<Button type="submit">Save email</Button>
					<output aria-label="Submitted email">{submitted}</output>
				</Stack>
			</Form>
		);
	},
};

export const Validation: Story = {
	parameters: {
		controls: { disable: true },
		docs: {
			description: {
				story:
					"The confirmation field validates on blur, overriding the form's on-submit timing. Submission validates every field with the current registered values.",
			},
		},
	},
	render: function Render() {
		const [submitted, setSubmitted] = useState("");
		return (
			<Form<{ email: string; confirmation: string }>
				validationMode="onSubmit"
				onFormSubmit={(values) => setSubmitted(JSON.stringify(values))}
			>
				<Stack gap={4} maxWidth="440px">
					<Field.Root name="email">
						<Label>Contact email</Label>
						<TextField type="email" required />
						<Field.Description>
							Use the address where you want project invitations.
						</Field.Description>
						<Field.Error match="valueMissing">Enter your contact email.</Field.Error>
						<Field.Error match="typeMismatch">Enter a valid email address.</Field.Error>
					</Field.Root>
					<Field.Root
						name="confirmation"
						validationMode="onBlur"
						validate={(value, values) =>
							value && value !== values.email ? "The email addresses must match." : null
						}
					>
						<Label>Confirm email</Label>
						<TextField type="email" required />
						<Field.Description>Checked when you leave this field.</Field.Description>
						<Field.Error match="valueMissing">Confirm your contact email.</Field.Error>
						<Field.Error match="typeMismatch">Enter a valid email address.</Field.Error>
						<Field.Error match="customError" />
					</Field.Root>
					<Button type="submit">Save contact details</Button>
					<output aria-label="Submitted contact details">{submitted}</output>
				</Stack>
			</Form>
		);
	},
};

export const ExternalErrors: Story = {
	name: "External errors",
	parameters: {
		controls: { disable: true },
		docs: {
			description: {
				story:
					"Named errors can come from a server or form action. This local example supplies an error for the workspace field; Base UI clears it when the value changes. Imperative validation does not submit the form.",
			},
		},
	},
	render: function Render() {
		const actionsRef = useRef<FormActions>(null);
		const [errors, setErrors] = useState<Record<string, string>>({});
		const [submitted, setSubmitted] = useState("");
		return (
			<Form<{ workspace: string }>
				actionsRef={actionsRef}
				errors={errors}
				onFormSubmit={(values) => setSubmitted(JSON.stringify(values))}
			>
				<Stack gap={4} maxWidth="440px">
					<Field.Root name="workspace">
						<Label>Workspace address</Label>
						<TextField defaultValue="design-team" required minLength={3} />
						<Field.Description>Use at least three characters.</Field.Description>
						<Field.Error />
					</Field.Root>
					<Stack orientation="horizontal" wrap="wrap" gap={2}>
						<Button type="submit">Save workspace</Button>
						<Button
							type="button"
							variant="secondary"
							onClick={() => setErrors({ workspace: "This workspace address is already in use." })}
						>
							Show external error
						</Button>
						<Button
							type="button"
							variant="secondary"
							onClick={() => actionsRef.current?.validate("workspace")}
						>
							Validate workspace
						</Button>
						<Button
							type="button"
							variant="secondary"
							onClick={() => actionsRef.current?.validate()}
						>
							Validate form
						</Button>
					</Stack>
					<output aria-label="Submitted workspace">{submitted}</output>
				</Stack>
			</Form>
		);
	},
};

export const NativeSubmission: Story = {
	name: "Native submission",
	parameters: {
		controls: { disable: true },
		docs: {
			description: {
				story:
					"Standalone controls need no Field or Form; NumberField retains its real widget Root. Native FormData contains successful control entries, including string checkbox values. Form also forwards native onSubmit; typed onFormSubmit is a separate registered-value API.",
			},
		},
	},
	render: function Render() {
		const nameId = useId();
		const notesId = useId();
		const updatesId = useId();
		const replicasId = useId();
		const [standalone, setStandalone] = useState("");
		const [native, setNative] = useState("");
		const [notes, setNotes] = useState("");
		return (
			<Stack gap={6} maxWidth="480px">
				<form
					onSubmit={(event) => {
						event.preventDefault();
						setStandalone(JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))));
					}}
				>
					<Stack gap={4}>
						<Text size="1" color="muted">
							Standalone controls
						</Text>
						<Stack gap={1}>
							<label htmlFor={nameId}>Your name</label>
							<TextField id={nameId} name="name" required />
						</Stack>
						<Stack gap={1}>
							<label htmlFor={notesId}>Notes</label>
							<Textarea
								id={notesId}
								name="notes"
								value={notes}
								onChange={(event) => setNotes(event.currentTarget.value)}
								rows={2}
							/>
						</Stack>
						<Stack gap={1}>
							<label htmlFor={replicasId}>Preview replicas</label>
							<NumberField.Root id={replicasId} name="replicas" defaultValue={2} min={1} max={10}>
								<NumberField.Control />
							</NumberField.Root>
						</Stack>
						<Stack orientation="horizontal" align="center" gap={2}>
							<Checkbox id={updatesId} name="updates" value="subscribed" />
							<label htmlFor={updatesId}>Send product updates</label>
						</Stack>
						<Button type="submit">Submit native controls</Button>
						<output aria-label="Native control values">{standalone}</output>
					</Stack>
				</form>
				<Separator />
				<Form
					onSubmit={(event) => {
						event.preventDefault();
						setNative(JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))));
					}}
				>
					<Stack gap={4}>
						<Text size="1" color="muted">
							Form with native onSubmit
						</Text>
						<Field.Root name="project">
							<Label>Project name</Label>
							<TextField required />
							<Field.Error match="valueMissing">Enter a project name.</Field.Error>
						</Field.Root>
						<Button type="submit">Submit with onSubmit</Button>
						<output aria-label="Native Form values">{native}</output>
					</Stack>
				</Form>
			</Stack>
		);
	},
};

export const NativeAction: Story = {
	name: "Native action",
	parameters: {
		controls: { disable: true },
		docs: {
			description: {
				story:
					"A native action receives FormData. This action is a local React callback; it makes no network request. React resets uncontrolled inputs after a successful action.",
			},
		},
	},
	render: function Render() {
		const [submitted, setSubmitted] = useState("");
		return (
			<Form action={(data) => setSubmitted(JSON.stringify(Object.fromEntries(data)))}>
				<Stack gap={4} maxWidth="400px">
					<Field.Root name="feedback">
						<Label>Feedback</Label>
						<Textarea required rows={3} />
						<Field.Error match="valueMissing">Enter your feedback.</Field.Error>
					</Field.Root>
					<Button type="submit">Send feedback</Button>
					<output aria-label="Action values">{submitted}</output>
				</Stack>
			</Form>
		);
	},
};

export const AsyncValidation: Story = {
	name: "Async validation",
	parameters: {
		controls: { disable: true },
		docs: {
			description: {
				story:
					"Base UI does not await async validators to stop onSubmit. Pending validity can be null; it is not a valid result. Native failures, and a previous custom error outside onSubmit mode, can still block synchronously. This local promise is resolved by the completion button, with no network or timer. Application-owned pending state prevents repeated submission while the latest check is pending.",
			},
		},
	},
	render: function Render() {
		const resolveCheck = useRef<((error: string | null) => void) | null>(null);
		const [candidate, setCandidate] = useState("");
		const [pending, setPending] = useState(false);
		const [submitted, setSubmitted] = useState("");
		return (
			<Form<{ alias: string }> onFormSubmit={(values) => setSubmitted(JSON.stringify(values))}>
				<Stack gap={4} maxWidth="480px">
					<Text size="1" color="muted">
						Submission does not wait for this availability check. Try “reserved”, submit, then
						finish the local check.
					</Text>
					<Field.Root
						name="alias"
						validate={(value) => {
							// Finish the superseded local check; Base UI ignores its stale result.
							resolveCheck.current?.(null);
							setCandidate(String(value));
							setPending(true);
							return new Promise<string | null>((resolve) => {
								resolveCheck.current = resolve;
							});
						}}
					>
						<Label>Project alias</Label>
						<TextField defaultValue="reserved" required />
						<Field.Description>
							“reserved” is unavailable; other nonempty names pass the local check.
						</Field.Description>
						<Field.Error />
						<Field.Validity>
							{({ validity }) => (
								<output aria-label="Alias validity">
									{validity.valid === null
										? "Not yet validated"
										: validity.valid
											? "Valid"
											: "Invalid"}
								</output>
							)}
						</Field.Validity>
					</Field.Root>
					<Stack orientation="horizontal" wrap="wrap" gap={2}>
						<Button type="submit" disabled={pending}>
							Submit alias
						</Button>
						<Button
							type="button"
							variant="secondary"
							disabled={!pending}
							onClick={() => {
								resolveCheck.current?.(
									candidate === "reserved" ? "This project alias is unavailable." : null,
								);
								resolveCheck.current = null;
								setPending(false);
							}}
						>
							Finish local check
						</Button>
					</Stack>
					<output aria-label="Availability check">{pending ? "Pending" : "Idle"}</output>
					<output aria-label="Submitted alias">{submitted}</output>
				</Stack>
			</Form>
		);
	},
};
