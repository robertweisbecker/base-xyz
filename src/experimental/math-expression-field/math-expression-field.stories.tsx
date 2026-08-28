import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/button/button";
import { Separator } from "@/components/separator/separator";
import { Stack } from "@/components/layout/layout";
import { Text } from "@/components/text/text";
import { MathExpressionField, type MathExpressionFieldProps } from "./math-expression-field";

type MathExpressionFieldStoryArgs = Pick<
	MathExpressionFieldProps,
	| "label"
	| "description"
	| "defaultValue"
	| "min"
	| "max"
	| "required"
	| "disabled"
	| "readOnly"
	| "error"
	| "prefix"
	| "inputMode"
>;

const meta = {
	title: "Experimental/Math expression field",
	args: {
		label: "Amount",
		description: "Type an expression such as 100 / 5.",
		defaultValue: 12,
		min: undefined,
		max: undefined,
		required: false,
		disabled: false,
		readOnly: false,
		error: "",
		prefix: "W",
		inputMode: "decimal",
	},
	argTypes: {
		label: { control: "text" },
		description: { control: "text" },
		defaultValue: { control: "number" },
		min: { control: "number" },
		max: { control: "number" },
		required: { control: "boolean" },
		disabled: { control: "boolean" },
		readOnly: { control: "boolean" },
		error: { control: "text" },
		prefix: { control: "text" },
		inputMode: { control: "inline-radio", options: ["decimal", "numeric", "text"] },
	},
	parameters: {
		controls: {
			include: [
				"label",
				"description",
				"defaultValue",
				"min",
				"max",
				"required",
				"disabled",
				"readOnly",
				"error",
				"prefix",
				"inputMode",
			],
		},
	},
} satisfies Meta<MathExpressionFieldStoryArgs>;

export default meta;
type Story = StoryObj<MathExpressionFieldStoryArgs>;

export const Playground: Story = {
	render: ({
		label,
		description,
		defaultValue,
		min,
		max,
		required,
		disabled,
		readOnly,
		error,
		prefix,
		inputMode,
	}) => (
		<MathExpressionField
			key={`${defaultValue}-${min}-${max}-${required}-${disabled}-${readOnly}-${error}-${prefix}-${inputMode}`}
			label={label}
			description={description}
			defaultValue={defaultValue}
			min={min}
			max={max}
			required={required}
			disabled={disabled}
			readOnly={readOnly}
			error={error || undefined}
			prefix={prefix || undefined}
			inputMode={inputMode}
		/>
	),
};

export const Examples: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack gap={6} maxWidth="420px">
			<Example label="Evaluates on blur or Enter">
				<MathExpressionField
					label="Amount"
					prefix="W"
					defaultValue={12}
					description="Type an expression such as 100 / 5."
				/>
			</Example>
			<Separator />
			<Example label="Clamped between 0 and 50">
				<MathExpressionField label="Clamped amount" prefix="H" defaultValue={10} min={0} max={50} />
			</Example>
			<Separator />
			<Example label="Required">
				<MathExpressionField label="Required amount" prefix="X" defaultValue={5} required />
			</Example>
			<Separator />
			<Example label="Read-only and disabled">
				<Stack gap={4}>
					<MathExpressionField label="Read-only" prefix="Y" defaultValue={20} readOnly />
					<MathExpressionField label="Disabled" prefix="Y" defaultValue={20} disabled />
				</Stack>
			</Example>
			<Separator />
			<Example label="Form submission">
				<MathExpressionFormExample />
			</Example>
			<Separator />
			<Example label="Controlled with external updates">
				<MathExpressionControlledExample />
			</Example>
		</Stack>
	),
};

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

function MathExpressionFormExample() {
	const [submitted, setSubmitted] = useState<string | null>(null);
	return (
		<form
			onSubmit={(event) => {
				event.preventDefault();
				const data = new FormData(event.currentTarget);
				const quantity = String(data.get("quantity"));
				const locked = data.has("locked") ? String(data.get("locked")) : "omitted";
				setSubmitted(`${quantity}; locked ${locked}`);
			}}
			onReset={() => setSubmitted(null)}
		>
			<Stack gap={3} align="start">
				<MathExpressionField label="Quantity" prefix="W" name="quantity" defaultValue={4} />
				<MathExpressionField
					label="Locked quantity"
					prefix="Y"
					name="locked"
					defaultValue={9}
					disabled
				/>
				<Button type="submit">Submit</Button>
				<Button type="reset">Reset</Button>
				<Text size="1" color="muted">
					{submitted === null ? "Not submitted" : `Submitted: ${submitted}`}
				</Text>
			</Stack>
		</form>
	);
}

function MathExpressionControlledExample() {
	const [value, setValue] = useState<number | null>(10);
	const [commits, setCommits] = useState(0);
	const [tick, setTick] = useState(0);
	useEffect(() => {
		const interval = setInterval(() => setTick((current) => current + 1), 700);
		return () => clearInterval(interval);
	}, []);
	return (
		<Stack gap={3} align="start">
			<Text size="1" color="muted">{`Tick: ${tick}`}</Text>
			<Text size="1" color="muted">{`Commits: ${commits}`}</Text>
			<MathExpressionField
				label="Controlled amount"
				prefix="W"
				value={value}
				onValueCommitted={(next) => {
					setValue(next);
					setCommits((current) => current + 1);
				}}
			/>
			<Button onClick={() => setValue(42)}>Set to 42</Button>
		</Stack>
	);
}
