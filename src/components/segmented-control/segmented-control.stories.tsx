import { CalendarBlankIcon } from "@phosphor-icons/react/dist/csr/CalendarBlank";
import { ClockIcon } from "@phosphor-icons/react/dist/csr/Clock";
import { ListBulletsIcon } from "@phosphor-icons/react/dist/csr/ListBullets";
import { SquaresFourIcon } from "@phosphor-icons/react/dist/csr/SquaresFour";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type FormEvent, type ReactNode, useState } from "react";
import { Button } from "@/components/button/button";
import { Stack } from "@/components/layout/layout";
import { Text } from "@/components/text/text";
import { SegmentedControl, type SegmentedControlSize } from "./segmented-control";

const iconOptions = {
	None: undefined,
	Calendar: <CalendarBlankIcon aria-hidden weight="duotone" />,
	Clock: <ClockIcon aria-hidden weight="duotone" />,
	Grid: <SquaresFourIcon aria-hidden weight="duotone" />,
	List: <ListBulletsIcon aria-hidden weight="duotone" />,
};

type SegmentedControlPlaygroundArgs = {
	_itemDisabled: boolean;
	defaultValue: string;
	disabled: boolean;
	endSlot: ReactNode;
	readOnly: boolean;
	required: boolean;
	size: SegmentedControlSize;
	startSlot: ReactNode;
};

const meta = {
	title: "Components/Segmented control",
	component: SegmentedControl.Root,
	args: {
		_itemDisabled: false,
		defaultValue: "week",
		disabled: false,
		endSlot: undefined,
		readOnly: false,
		required: false,
		size: "md",
		startSlot: undefined,
	},
	argTypes: {
		_itemDisabled: { control: "boolean", name: "item disabled" },
		defaultValue: {
			control: "inline-radio",
			options: ["day", "week", "month"],
		},
		disabled: { control: "boolean" },
		endSlot: {
			control: "select",
			mapping: iconOptions,
			options: Object.keys(iconOptions),
		},
		readOnly: { control: "boolean" },
		required: { control: "boolean" },
		size: {
			control: "inline-radio",
			options: ["sm", "md", "lg"],
		},
		startSlot: {
			control: "select",
			mapping: iconOptions,
			options: Object.keys(iconOptions),
		},
	},
	parameters: {
		controls: {
			include: [
				"_itemDisabled",
				"defaultValue",
				"disabled",
				"endSlot",
				"readOnly",
				"required",
				"size",
				"startSlot",
			],
		},
	},
} satisfies Meta<SegmentedControlPlaygroundArgs>;

export default meta;
type Story = StoryObj<SegmentedControlPlaygroundArgs>;

export const Playground: Story = {
	render: ({
		_itemDisabled,
		defaultValue,
		disabled,
		endSlot,
		readOnly,
		required,
		size,
		startSlot,
	}) => (
		<SegmentedControl.Root
			key={`${defaultValue}-${disabled}-${readOnly}-${required}-${size}`}
			aria-label="View range"
			data-testid="playground-segmented-control"
			defaultValue={defaultValue}
			disabled={disabled}
			readOnly={readOnly}
			required={required}
			size={size}
		>
			<SegmentedControl.Item endSlot={endSlot} startSlot={startSlot} value="day">
				Day
			</SegmentedControl.Item>
			<SegmentedControl.Item value="week">Week</SegmentedControl.Item>
			<SegmentedControl.Item disabled={_itemDisabled} value="month">
				Month
			</SegmentedControl.Item>
		</SegmentedControl.Root>
	),
};

export const SizesAndIcons: Story = {
	name: "Sizes and icons",
	parameters: { controls: { disable: true } },
	render: () => (
		<Stack gap={5}>
			{(["sm", "md", "lg"] as const).map((size) => (
				<Stack key={size} gap={2} align="start">
					<Text color="muted" size="1">
						{size === "sm" ? "Small" : size === "md" ? "Medium" : "Large"}
					</Text>
					<SegmentedControl.Root aria-label={`${size} layout`} defaultValue="grid" size={size}>
						<SegmentedControl.Item
							startSlot={<SquaresFourIcon aria-hidden weight="duotone" />}
							value="grid"
						>
							Grid
						</SegmentedControl.Item>
						<SegmentedControl.Item
							startSlot={<ListBulletsIcon aria-hidden weight="duotone" />}
							value="list"
						>
							List
						</SegmentedControl.Item>
					</SegmentedControl.Root>
				</Stack>
			))}
		</Stack>
	),
};

export const States: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<Stack gap={6}>
			<Stack gap={2} align="start">
				<Text color="muted" size="1">
					Selected, unselected, and disabled
				</Text>
				<SegmentedControl.Root aria-label="State examples" defaultValue="selected">
					<SegmentedControl.Item value="selected">Selected</SegmentedControl.Item>
					<SegmentedControl.Item value="unselected">Unselected</SegmentedControl.Item>
					<SegmentedControl.Item disabled value="disabled">
						Disabled
					</SegmentedControl.Item>
				</SegmentedControl.Root>
			</Stack>
			<Stack gap={2} align="start">
				<Text color="muted" size="1">
					Disabled group
				</Text>
				<SegmentedControl.Root aria-label="Disabled example" defaultValue="grid" disabled>
					<SegmentedControl.Item value="grid">Grid</SegmentedControl.Item>
					<SegmentedControl.Item value="list">List</SegmentedControl.Item>
				</SegmentedControl.Root>
			</Stack>
			<Stack gap={2} align="start">
				<Text color="muted" size="1">
					Read-only group
				</Text>
				<SegmentedControl.Root aria-label="Read-only example" defaultValue="day" readOnly>
					<SegmentedControl.Item value="day">Day</SegmentedControl.Item>
					<SegmentedControl.Item value="week">Week</SegmentedControl.Item>
				</SegmentedControl.Root>
			</Stack>
		</Stack>
	),
};

export const Form: Story = {
	parameters: { controls: { disable: true } },
	render: () => <FormExample />,
};

function FormExample() {
	const [submittedValue, setSubmittedValue] = useState<string | null>(null);

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		setSubmittedValue(String(data.get("range")));
	}

	return (
		<form onSubmit={handleSubmit}>
			<Stack gap={4} align="start">
				<SegmentedControl.Root aria-label="Report range" name="range" required>
					<SegmentedControl.Item value="day">Day</SegmentedControl.Item>
					<SegmentedControl.Item value="week">Week</SegmentedControl.Item>
					<SegmentedControl.Item value="month">Month</SegmentedControl.Item>
				</SegmentedControl.Root>
				<Button type="submit" size="sm">
					Apply range
				</Button>
				<Text aria-live="polite" size="1" color="muted">
					{submittedValue === null ? "Nothing submitted yet." : `Submitted: ${submittedValue}`}
				</Text>
			</Stack>
		</form>
	);
}
