import { Field } from "@base-ui/react/field";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { useState, type ReactNode } from "react";
import { fieldStyles } from "@/components/field/field.stylex";
import { Separator } from "@/components/separator/separator";
import { Stack } from "@/components/layout/layout";
import { Text } from "@/components/text/text";
import { InlineEdit, type InlineEditRootProps } from "./inline-edit";

type InlineEditStoryArgs = Pick<
	InlineEditRootProps,
	| "color"
	| "children"
	| "confirmOnBlur"
	| "confirmOnEnter"
	| "defaultEditing"
	| "disabled"
	| "fontFamily"
	| "fontWeight"
	| "size"
> & {
	_showActions: boolean;
	_value: string;
};

const meta = {
	title: "Experimental/Inline edit",
	component: InlineEdit.Root,
	args: {
		_showActions: true,
		_value: "Roadmap title",
		children: null,
		color: "inherit",
		confirmOnBlur: true,
		confirmOnEnter: true,
		defaultEditing: false,
		disabled: false,
		fontFamily: undefined,
		fontWeight: undefined,
		size: undefined,
	},
	argTypes: {
		_showActions: { control: "boolean", name: "Show actions" },
		_value: { control: "text", name: "Value" },
		color: {
			control: "select",
			options: ["inherit", "default", "muted", "subtle", "accent", "success", "warning", "error"],
		},
		confirmOnBlur: { control: "boolean" },
		confirmOnEnter: { control: "boolean" },
		defaultEditing: { control: "boolean" },
		disabled: { control: "boolean" },
		fontFamily: { control: "inline-radio", options: [undefined, "sans", "serif", "mono"] },
		fontWeight: {
			control: "select",
			options: [undefined, "regular", "medium", "semibold", "bold"],
		},
		size: {
			control: "select",
			options: [undefined, "1", "2", "3", "4", "5", "6", "7", "8", "9"],
		},
	},
	parameters: {
		controls: {
			include: [
				"_value",
				"defaultEditing",
				"disabled",
				"confirmOnBlur",
				"confirmOnEnter",
				"_showActions",
				"color",
				"fontFamily",
				"fontWeight",
				"size",
			],
		},
	},
} satisfies Meta<InlineEditStoryArgs>;

export default meta;
type Story = StoryObj<InlineEditStoryArgs>;

export const Playground: Story = {
	render: ({
		_showActions,
		_value,
		children: _children,
		confirmOnBlur,
		confirmOnEnter,
		disabled,
		...rootProps
	}) => (
		<InlineEditDemo
			key={`${_value}-${rootProps.defaultEditing}`}
			initialValue={_value}
			showActions={_showActions}
			confirmOnBlur={confirmOnBlur}
			confirmOnEnter={confirmOnEnter}
			disabled={disabled}
			rootProps={rootProps}
		/>
	),
};

export const Examples: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<Stack gap={6} align="start">
			<Example label="Explicit actions">
				<InlineEditDemo initialValue="Q4 launch plan" showActions />
			</Example>
			<Separator />
			<Example label="Enter confirms, Escape cancels">
				<InlineEditDemo initialValue="Product requirements" confirmOnEnter />
			</Example>
			<Separator />
			<Example label="Blur confirms after focus leaves the whole editor">
				<InlineEditDemo initialValue="Customer research" confirmOnBlur showActions />
			</Example>
		</Stack>
	),
};

export const States: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<Stack gap={6} align="start">
			<Example label="Disabled">
				<InlineEditDemo initialValue="Archived project" disabled showActions />
			</Example>
			<Separator />
			<Example label="Read only">
				<InlineEditDemo
					initialValue="Published"
					inputReadOnly
					rootProps={{ defaultEditing: true }}
					showActions
				/>
			</Example>
			<Separator />
			<Example label="Required and invalid state owned by Base UI Field">
				<FieldInlineEditDemo />
			</Example>
		</Stack>
	),
};

export const Typography: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<Stack gap={6} align="start">
			<Example label="Inherits the surrounding typography when no text styles are provided">
				<Text render={<span />} size="4" fontFamily="serif" fontWeight="semibold" color="accent">
					Project: <InlineEditDemo initialValue="Odyssey" confirmOnEnter />
				</Text>
			</Example>
			<Separator />
			<Example label="Accepts the same curated text styles as Text">
				<TypographyComparison
					value="INV-00482"
					typography={{
						color: "muted",
						fontFamily: "mono",
						fontWeight: "medium",
						size: "3",
						tabular: true,
					}}
				/>
			</Example>
			<Separator />
			<Example label="Explicit serif styles match an adjacent Text reference">
				<TypographyComparison
					value="Odyssey"
					typography={{
						color: "accent",
						fontFamily: "serif",
						fontWeight: "semibold",
						size: "4",
					}}
				/>
			</Example>
			<Separator />
			<Example label="Wrapping and truncation stay on Value rather than clipping edit controls">
				<Stack gap={2} align="start">
					<TypographyComparison
						value="A longer project name that can wrap naturally"
						typography={{ size: "2", wrap: "balance" }}
					/>
					<TypographyComparison
						value="A long identifier that truncates in constrained layouts"
						typography={{ fontFamily: "mono", size: "2", truncate: true }}
					/>
				</Stack>
			</Example>
			<Separator />
			<Example label="Idle value remains part of a sentence without persistent input chrome">
				<Text render={<span />} size="2">
					Assigned to <InlineEditDemo initialValue="Morgan Li" confirmOnEnter /> for review.
				</Text>
			</Example>
		</Stack>
	),
};

export const AsyncSettlement: Story = {
	name: "Async settlement",
	parameters: { controls: { disable: true } },
	render: () => <AsyncInlineEditDemo />,
};

type InlineEditDemoProps = Pick<
	InlineEditRootProps,
	"confirmOnBlur" | "confirmOnEnter" | "disabled"
> & {
	initialValue: string;
	inputReadOnly?: boolean;
	rootProps?: Omit<
		InlineEditRootProps,
		"children" | "confirmOnBlur" | "confirmOnEnter" | "disabled" | "onConfirm" | "onEditingChange"
	>;
	showActions?: boolean;
};

function InlineEditDemo({
	confirmOnBlur,
	confirmOnEnter,
	disabled,
	initialValue,
	inputReadOnly = false,
	rootProps,
	showActions = false,
}: InlineEditDemoProps) {
	const [value, setValue] = useState(initialValue);
	const [draft, setDraft] = useState(initialValue);

	return (
		<InlineEdit.Root
			{...rootProps}
			confirmOnBlur={confirmOnBlur}
			confirmOnEnter={confirmOnEnter}
			disabled={disabled}
			onEditingChange={(_, details) => {
				if (details.reason === "edit" || details.reason === "cancel") setDraft(value);
			}}
			onConfirm={() => setValue(draft)}
		>
			<InlineEdit.Value label={`Edit ${value}`}>{value}</InlineEdit.Value>
			<InlineEdit.Input
				aria-label="Editable value"
				readOnly={inputReadOnly}
				value={draft}
				onChange={(event) => setDraft(event.target.value)}
			/>
			{showActions ? (
				<InlineEdit.Actions>
					<InlineEdit.Confirm label="Save editable value" />
					<InlineEdit.Cancel label="Cancel editing value" />
				</InlineEdit.Actions>
			) : null}
		</InlineEdit.Root>
	);
}

function AsyncInlineEditDemo() {
	const [value, setValue] = useState("Quarterly report");
	const [draft, setDraft] = useState(value);
	const [rejectNext, setRejectNext] = useState(false);
	const [status, setStatus] = useState("Ready");
	const [operationCount, setOperationCount] = useState(0);
	const [errorCount, setErrorCount] = useState(0);

	return (
		<Stack gap={3} align="start">
			<InlineEdit.Root
				data-testid="async-inline-edit"
				confirmOnBlur={false}
				confirmOnEnter
				onEditingChange={(_, details) => {
					if (details.reason === "edit" || details.reason === "cancel") setDraft(value);
				}}
				onConfirm={async () => {
					setOperationCount((count) => count + 1);
					setStatus("Saving…");
					await new Promise((resolve) => setTimeout(resolve, 700));
					if (rejectNext) throw new Error("Example rejection");
					setValue(draft);
					setStatus("Saved");
				}}
				onConfirmError={() => {
					setErrorCount((count) => count + 1);
					setStatus("Could not save; the editor remains open");
				}}
			>
				<InlineEdit.Value label={`Edit ${value}`}>{value}</InlineEdit.Value>
				<InlineEdit.Input
					aria-label="Report name"
					data-testid="async-inline-edit-input"
					value={draft}
					onChange={(event) => setDraft(event.target.value)}
				/>
				<InlineEdit.Actions>
					<InlineEdit.Confirm label="Save report name" />
					<InlineEdit.Cancel label="Cancel editing report name" />
				</InlineEdit.Actions>
			</InlineEdit.Root>
			<label>
				<input
					type="checkbox"
					checked={rejectNext}
					onChange={(event) => setRejectNext(event.target.checked)}
				/>{" "}
				Reject next save
			</label>
			<Text size="1" color="muted" aria-live="polite">
				{status}
			</Text>
			<Text size="1" color="muted" data-testid="async-inline-edit-operation-count">
				Operations: {operationCount}; errors: {errorCount}
			</Text>
		</Stack>
	);
}

type TypographyExampleProps = Pick<
	InlineEditRootProps,
	"color" | "fontFamily" | "fontWeight" | "size" | "tabular" | "textAlign" | "truncate" | "wrap"
>;

function TypographyComparison({
	typography,
	value,
}: {
	typography: TypographyExampleProps;
	value: string;
}) {
	return (
		<span>
			<Text render={<span />} {...typography}>
				{value}
			</Text>{" "}
			<InlineEditDemo initialValue={value} confirmOnEnter rootProps={typography} />
		</span>
	);
}

function FieldInlineEditDemo() {
	const [value, setValue] = useState("x");
	const [draft, setDraft] = useState(value);
	return (
		<Field.Root invalid {...stylex.props(fieldStyles.root)}>
			<Field.Label {...stylex.props(fieldStyles.label)}>Workspace slug</Field.Label>
			<InlineEdit.Root
				defaultEditing
				onConfirm={() => setValue(draft)}
				onEditingChange={(_, details) => {
					if (details.reason === "edit" || details.reason === "cancel") setDraft(value);
				}}
			>
				<InlineEdit.Value label={`Edit workspace slug ${value}`}>{value}</InlineEdit.Value>
				<InlineEdit.Input
					required
					minLength={3}
					aria-invalid
					value={draft}
					onChange={(event) => setDraft(event.target.value)}
				/>
				<InlineEdit.Actions>
					<InlineEdit.Confirm label="Save workspace slug" />
					<InlineEdit.Cancel label="Cancel editing workspace slug" />
				</InlineEdit.Actions>
			</InlineEdit.Root>
			<Field.Description {...stylex.props(fieldStyles.description)}>
				Use at least three characters.
			</Field.Description>
			<Field.Error match {...stylex.props(fieldStyles.error)}>
				Workspace slug is too short.
			</Field.Error>
		</Field.Root>
	);
}

function Example({ children, label }: { children: ReactNode; label: string }) {
	return (
		<Stack align="start" gap={2}>
			<Text size="1" color="muted">
				{label}
			</Text>
			{children}
		</Stack>
	);
}
