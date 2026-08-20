import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import {
	Fragment,
	useMemo,
	useRef,
	useState,
	type FocusEvent,
	type KeyboardEvent,
	type ReactNode,
} from "react";
import { Avatar } from "@/components/avatar/avatar";
import {
	Combobox,
	type ComboboxInputProps,
	type ComboboxItemVariant,
	type ComboboxRootProps,
} from "@/components/combobox/combobox-field";
import { Heading } from "@/components/heading/heading";
import { Box, Stack } from "@/components/layout/layout";
import { Item } from "@/components/item/item";
import { userOptions, type UserOption } from "@/components/storybook/user-options";
import { Text } from "@/components/text/text";
import { tokens } from "@/theme/tokens.stylex";

const frameworks = ["React", "Vue", "Svelte", "Solid", "Preact", "Qwik", "Angular"];
const languages = ["JavaScript", "TypeScript", "Python", "Rust", "Go", "Swift", "Kotlin"];
const apps = ["Codex", "Claude", "Cursor", "Zed"];

type PlaygroundArgs = {
	disabled: boolean;
	invalid: boolean;
	_itemVariant: ComboboxItemVariant;
	_label: string;
	_placeholder: string;
	readOnly: boolean;
	required: boolean;
	size: ComboboxRootProps<string>["size"];
};

const meta = {
	title: "Components/Combobox",
	args: {
		disabled: false,
		invalid: false,
		_itemVariant: "default",
		_label: "Framework",
		_placeholder: "Filter frameworks…",
		readOnly: false,
		required: false,
		size: "md",
	},
	argTypes: {
		disabled: { control: "boolean" },
		invalid: { control: "boolean" },
		_itemVariant: { control: "select", options: ["default", "primary", "error"] },
		_label: { control: "text" },
		_placeholder: { control: "text" },
		readOnly: { control: "boolean" },
		required: { control: "boolean" },
		size: { control: "inline-radio", options: ["sm", "md", "lg"] },
	},
	parameters: {
		controls: {
			include: [
				"_label",
				"_placeholder",
				"disabled",
				"readOnly",
				"required",
				"invalid",
				"size",
				"_itemVariant",
			],
		},
	},
	decorators: [
		(Story) => (
			<Box maxWidth="420px">
				<Story />
			</Box>
		),
	],
} satisfies Meta<PlaygroundArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	render: ({ _itemVariant, _label, _placeholder, ...props }) => (
		<SingleCombobox
			{...props}
			itemVariant={_itemVariant}
			items={frameworks}
			label={_label}
			placeholder={_placeholder}
		/>
	),
};

export const States: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<Stack gap={6}>
			<SingleCombobox disabled items={frameworks} label="Disabled" placeholder="Filter frameworks…" />
			<SingleCombobox readOnly items={frameworks} label="Read only" placeholder="Filter frameworks…" />
			<SingleCombobox required items={frameworks} label="Required" placeholder="Filter frameworks…" />
			<SingleCombobox invalid items={frameworks} label="Invalid" placeholder="Filter frameworks…" />
			<SingleCombobox items={[]} label="Empty" placeholder="Filter frameworks…" />
		</Stack>
	),
};

export const Sizes: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<Stack gap={6} maxWidth="420px">
			<SingleCombobox label="Small" items={frameworks} placeholder="Choose a framework" size="sm" />
			<SingleCombobox label="Medium" items={frameworks} placeholder="Choose a framework" size="md" />
			<SingleCombobox label="Large" items={frameworks} placeholder="Choose a framework" size="lg" />
		</Stack>
	),
};

type MultiplePlaygroundArgs = {
	_chipPlacement: "inside" | "outside";
	_expandChips: "input-focus" | "always" | undefined;
	_itemVariant: ComboboxItemVariant;
	_label: string;
	_maxVisibleChips: number | undefined;
	_placeholder: string;
	disabled: boolean;
	readOnly: boolean;
	size: ComboboxRootProps<string, true>["size"];
};

export const MultiplePlayground: StoryObj<MultiplePlaygroundArgs> = {
	args: {
		_chipPlacement: "inside",
		_expandChips: "input-focus",
		_itemVariant: "default",
		_label: "Programming languages",
		_maxVisibleChips: 2,
		_placeholder: "Filter languages…",
		disabled: false,
		readOnly: false,
		size: "md",
	},
	argTypes: {
		_chipPlacement: { control: "inline-radio", options: ["inside", "outside"] },
		_expandChips: { control: "select", options: ["input-focus", "always", undefined] },
		_itemVariant: { control: "select", options: ["default", "primary", "error"] },
		_label: { control: "text" },
		_maxVisibleChips: { control: { type: "number", min: 0, step: 1 } },
		_placeholder: { control: "text" },
		disabled: { control: "boolean" },
		readOnly: { control: "boolean" },
		size: { control: "inline-radio", options: ["sm", "md", "lg"] },
	},
	parameters: {
		controls: {
			include: [
				"_label",
				"_placeholder",
				"_chipPlacement",
				"_maxVisibleChips",
				"_expandChips",
				"disabled",
				"readOnly",
				"size",
				"_itemVariant",
			],
		},
	},
	render: ({
		_chipPlacement,
		_expandChips,
		_itemVariant,
		_label,
		_maxVisibleChips,
		_placeholder,
		...props
	}) => (
		<MultipleCombobox
			{...props}
			chipPlacement={_chipPlacement}
			defaultValue={["TypeScript", "Rust", "Go", "Swift"]}
			expandChips={_expandChips}
			itemVariant={_itemVariant}
			items={languages}
			label={_label}
			maxVisibleChips={_maxVisibleChips}
			placeholder={_placeholder}
		/>
	),
};

export const UserSelection: Story = {
	name: "User select (object values)",
	parameters: { controls: { disable: true } },
	render: () => (
		<MultipleCombobox<UserOption>
			defaultValue={[userOptions[0], userOptions[1]]}
			isItemEqualToValue={(item, value) => item.id === value.id}
			itemToStringLabel={(user) => `${user.name} ${user.email}`}
			itemToStringValue={(user) => user.id}
			items={userOptions}
			label="Reviewers"
			placeholder="Search people…"
			renderChip={(user) => (
				<Combobox.Chip
					aria-label={`${user.name} ${user.email}`}
					startSlot={<Avatar aria-hidden initials={user.initials} size={5} shape="rounded" />}
					endSlot={<Combobox.ChipRemove aria-label={`Remove ${user.name}`} />}>
					<Text render={<span />} size="1" truncate style={[styles.userChipContent, styles.userName]}>
						{user.name}
					</Text>
				</Combobox.Chip>
			)}
			renderItem={(user) => (
				<Item
					description={user.email}
					label={user.name}
					startSlot={<Avatar initials={user.initials} size={8} />}
					style={styles.userOptionItem}
					variant="embedded"
				/>
			)}
		/>
	),
};

export const ChipPlacementOptions: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<Stack gap={8}>
			<ExampleSection title="Inside" description="Selected values share the control with the filter input.">
				<MultipleCombobox
					label="Programming languages"
					items={languages}
					placeholder="Filter languages…"
					defaultValue={languages.slice(0, 4)}
					maxVisibleChips={2}
					expandChips="input-focus"
					chipPlacement="inside"
				/>
			</ExampleSection>
			<ExampleSection title="Outside" description="Selected values sit above a dedicated filter input.">
				<MultipleCombobox
					label="Programming languages"
					items={languages}
					placeholder="Filter languages…"
					defaultValue={languages.slice(0, 4)}
					maxVisibleChips={2}
					expandChips="input-focus"
					chipPlacement="outside"
				/>
			</ExampleSection>
		</Stack>
	),
};

export const CreatableTags: Story = {
	render: () => <CreatableTagsExample />,
};

export const LimitedChips: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<Stack gap={8}>
			<ExampleSection title="Fixed limit" description="The configured limit remains applied while the input is focused.">
				<MultipleCombobox
					label="Programming languages"
					items={languages}
					placeholder="Filter languages…"
					defaultValue={languages}
					maxVisibleChips={2}
				/>
			</ExampleSection>
			<ExampleSection
				title="Expand on input focus"
				description="Focus the chip/input composite to reveal every selected value; leave it to restore the limit.">
				<MultipleCombobox
					label="Programming languages"
					items={languages}
					placeholder="Filter languages…"
					defaultValue={languages}
					maxVisibleChips={2}
					expandChips="input-focus"
				/>
			</ExampleSection>
			<ExampleSection
				title="Always expanded"
				description="All selected values remain visible even when a limit is configured.">
				<MultipleCombobox
					label="Programming languages"
					items={languages}
					placeholder="Filter languages…"
					defaultValue={languages}
					maxVisibleChips={2}
					expandChips="always"
				/>
			</ExampleSection>
		</Stack>
	),
};

export const ChipLimitExamples: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<Stack gap={8}>
			<ExampleSection title="No limit" description="Omitting the limit renders every selected value.">
				<MultipleCombobox
					label="Programming languages"
					items={languages}
					placeholder="Filter languages…"
					defaultValue={languages.slice(0, 4)}
				/>
			</ExampleSection>
			<ExampleSection
				title="Zero visible chips"
				description="Only the overflow count is shown, and the filter input remains available.">
				<MultipleCombobox
					label="Programming languages"
					items={languages}
					placeholder="Filter languages…"
					defaultValue={languages.slice(0, 4)}
					maxVisibleChips={0}
				/>
			</ExampleSection>
			<ExampleSection title="One visible chip" description="The first selection is followed by the remaining count.">
				<MultipleCombobox
					label="Programming languages"
					items={languages}
					placeholder="Filter languages…"
					defaultValue={languages.slice(0, 4)}
					maxVisibleChips={1}
				/>
			</ExampleSection>
			<ExampleSection
				title="Exact count"
				description="No overflow indicator appears when the selection count matches the limit.">
				<MultipleCombobox
					label="Programming languages"
					items={languages}
					placeholder="Filter languages…"
					defaultValue={languages.slice(0, 3)}
					maxVisibleChips={3}
				/>
			</ExampleSection>
		</Stack>
	),
};

export const ControlledMultiple: Story = {
	render: () => <ControlledMultipleExample />,
};

type SingleComboboxProps<Value> = Omit<ComboboxRootProps<Value>, "children" | "items"> & {
	itemVariant?: ComboboxItemVariant;
	items: readonly Value[];
	label: ReactNode;
	placeholder?: string;
	renderItem?: (item: Value) => ReactNode;
};

function SingleCombobox<Value>({
	itemVariant = "default",
	items,
	label,
	placeholder = "Choose an option",
	renderItem,
	...props
}: SingleComboboxProps<Value>) {
	return (
		<Combobox.Root<Value> items={items} {...props}>
			<Combobox.Label>{label}</Combobox.Label>
			<Combobox.InputGroup>
				<Combobox.Input placeholder={placeholder} />
			</Combobox.InputGroup>
			<Combobox.Popup>
				<Combobox.Empty>No matching options.</Combobox.Empty>
				<Combobox.List>
					{(item: Value) => (
						<Combobox.Item key={getItemKey(item, props)} value={item} variant={itemVariant}>
							{renderItem?.(item) ?? getItemLabel(item, props)}
						</Combobox.Item>
					)}
				</Combobox.List>
			</Combobox.Popup>
		</Combobox.Root>
	);
}

type MultipleComboboxProps<Value> = Omit<ComboboxRootProps<Value, true>, "children" | "items" | "multiple"> & {
	chipPlacement?: "inside" | "outside";
	creatableItem?: Value;
	expandChips?: "input-focus" | "always";
	inputProps?: ComboboxInputProps;
	itemVariant?: ComboboxItemVariant;
	items: readonly Value[];
	label: ReactNode;
	maxVisibleChips?: number;
	placeholder?: string;
	renderChip?: (item: Value) => ReactNode;
	renderItem?: (item: Value) => ReactNode;
};

function MultipleCombobox<Value>({
	chipPlacement = "inside",
	creatableItem,
	expandChips,
	inputProps,
	itemVariant = "default",
	items,
	label,
	maxVisibleChips,
	placeholder = "Choose options",
	renderChip,
	renderItem,
	...props
}: MultipleComboboxProps<Value>) {
	const inputGroupRef = useRef<HTMLDivElement>(null);
	const [focusWithin, setFocusWithin] = useState(false);
	const visibleChipLimit =
		expandChips === "always" || (expandChips === "input-focus" && focusWithin)
			? undefined
			: normalizeChipLimit(maxVisibleChips);
	const focusProps = {
		onFocusCapture: () => {
			setFocusWithin(true);
		},
		onBlurCapture: (event: FocusEvent<HTMLDivElement>) => {
			if (!event.currentTarget.contains(event.relatedTarget)) {
				setFocusWithin(false);
			}
		},
	};
	const renderValues = (value: Value[]) =>
		renderSelectedValues(value, visibleChipLimit, inputGroupRef, props, renderChip);

	return (
		<Combobox.Root<Value, true> items={items} multiple {...props}>
			<Combobox.Label>{label}</Combobox.Label>
			{chipPlacement === "inside" ? (
				<Combobox.InputGroup ref={inputGroupRef} variant="chips" {...focusProps}>
					<Combobox.Chips>
						<Combobox.Value>
							{(value: Value[]) => (
								<>
									{renderValues(value)}
									<Combobox.Input {...inputProps} placeholder={value.length > 0 ? "" : placeholder} />
								</>
							)}
						</Combobox.Value>
					</Combobox.Chips>
				</Combobox.InputGroup>
			) : (
				<Combobox.Chips style={styles.outsideComposition} {...focusProps}>
					<Combobox.Value>
						{(value: Value[]) => (
							<>
								<div {...stylex.props(styles.outsideChipList)}>
									{value.length > 0 ? (
										renderValues(value)
									) : (
										<Text size="1" color="muted">
											No selections
										</Text>
									)}
								</div>
								<Combobox.InputGroup ref={inputGroupRef}>
									<Combobox.Input {...inputProps} placeholder={placeholder} />
								</Combobox.InputGroup>
							</>
						)}
					</Combobox.Value>
				</Combobox.Chips>
			)}
			<Combobox.Popup>
				<Combobox.Empty>No matching options.</Combobox.Empty>
				<Combobox.List>
					{(item: Value) => (
						<Combobox.Item
							creatable={creatableItem !== undefined && item === creatableItem}
							key={getItemKey(item, props)}
							value={item}
							variant={itemVariant}>
							{renderItem?.(item) ?? getItemLabel(item, props)}
						</Combobox.Item>
					)}
				</Combobox.List>
			</Combobox.Popup>
		</Combobox.Root>
	);
}

function renderSelectedValues<Value>(
	values: Value[],
	maxVisibleChips: number | undefined,
	inputGroupRef: React.RefObject<HTMLDivElement | null>,
	itemProps: Pick<ComboboxRootProps<Value, true>, "itemToStringLabel" | "itemToStringValue">,
	renderChip?: (item: Value) => ReactNode,
) {
	const visibleValues = maxVisibleChips === undefined ? values : values.slice(0, maxVisibleChips);
	const hiddenCount = values.length - visibleValues.length;
	const overflowLabel = visibleValues.length === 0 ? `${hiddenCount} selected` : `+${hiddenCount}`;

	return (
		<>
			{visibleValues.map((value) => {
				const label = getItemLabel(value, itemProps);
				return (
					<Fragment key={getItemKey(value, itemProps)}>
						{renderChip?.(value) ?? (
							<Combobox.Chip
								aria-label={label}
								endSlot={<Combobox.ChipRemove aria-label={`Remove ${label}`} />}>
								{label}
							</Combobox.Chip>
						)}
					</Fragment>
				);
			})}
			{hiddenCount > 0 ? (
				<Combobox.ChipOverflow anchor={inputGroupRef} label={overflowLabel}>
					{values.map((value) => getItemLabel(value, itemProps)).join(", ")}
				</Combobox.ChipOverflow>
			) : null}
		</>
	);
}

function CreatableTagsExample() {
	const [createdItems, setCreatedItems] = useState<string[]>([]);
	const [inputValue, setInputValue] = useState("");
	const [selectedValues, setSelectedValues] = useState<string[]>([]);
	const highlightedItemRef = useRef<string | undefined>(undefined);
	const collator = useMemo(
		() => new Intl.Collator(undefined, { sensitivity: "base", usage: "search", ignorePunctuation: true }),
		[],
	);
	const availableItems = useMemo(() => [...new Set([...apps, ...createdItems])], [createdItems]);
	const trimmedInputValue = inputValue.trim();
	const matchingItem = availableItems.find((item) => collator.compare(item, trimmedInputValue) === 0);
	const creatableItem = trimmedInputValue !== "" && matchingItem === undefined ? trimmedInputValue : undefined;
	const itemsForView = creatableItem === undefined ? availableItems : [...availableItems, creatableItem];

	function commitInputValue() {
		const item = matchingItem ?? creatableItem;
		if (item === undefined) {
			return;
		}
		if (creatableItem !== undefined) {
			setCreatedItems((currentItems) => [...currentItems, creatableItem]);
		}
		if (!selectedValues.includes(item)) {
			setSelectedValues((currentItems) => [...currentItems, item]);
		}
		setInputValue("");
	}

	function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
		if (event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229) {
			return;
		}
		if (event.key === "," || (event.key === "Enter" && highlightedItemRef.current === undefined)) {
			event.preventDefault();
			commitInputValue();
		}
	}

	return (
		<Stack gap={2}>
			<MultipleCombobox
				inputValue={inputValue}
				items={itemsForView}
				creatableItem={creatableItem}
				label="Harness"
				placeholder="Type to choose…"
				value={selectedValues}
				inputProps={{ onKeyDown: handleInputKeyDown }}
				onInputValueChange={setInputValue}
				onItemHighlighted={(item) => {
					highlightedItemRef.current = item;
				}}
				onValueChange={(nextValue) => {
					const selectedCreatableItem =
						creatableItem !== undefined && nextValue.includes(creatableItem) && !selectedValues.includes(creatableItem);
					if (selectedCreatableItem) {
						setCreatedItems((currentItems) => [...currentItems, creatableItem]);
					}
					setSelectedValues(nextValue);
					setInputValue("");
				}}
				renderItem={(item) => (item === creatableItem ? `Create “${item}”` : item)}
			/>
			<Text aria-live="polite" color="muted" size="1">
				{createdItems.length > 0 ? `Created: ${createdItems.join(", ")}` : "Type a new value and press Enter or comma."}
			</Text>
		</Stack>
	);
}

function ControlledMultipleExample() {
	const [value, setValue] = useState(["TypeScript", "Rust", "Go", "Swift"]);

	return (
		<MultipleCombobox
			label="Controlled languages"
			items={languages}
			placeholder="Filter languages…"
			value={value}
			onValueChange={setValue}
			maxVisibleChips={2}
			expandChips="input-focus"
		/>
	);
}

function ExampleSection({ children, description, title }: { children: ReactNode; description: string; title: string }) {
	return (
		<Stack align="start" gap={3}>
			<Stack align="start" gap={1}>
				<Heading size="2" fontWeight="regular">
					{title}
				</Heading>
				<Text size="1" color="muted">
					{description}
				</Text>
			</Stack>
			{children}
		</Stack>
	);
}

function getItemLabel<Value>(
	item: Value,
	{ itemToStringLabel }: Pick<ComboboxRootProps<Value, boolean>, "itemToStringLabel">,
) {
	return itemToStringLabel?.(item) ?? String(item);
}

function getItemKey<Value>(
	item: Value,
	{
		itemToStringLabel,
		itemToStringValue,
	}: Pick<ComboboxRootProps<Value, boolean>, "itemToStringLabel" | "itemToStringValue">,
) {
	return itemToStringValue?.(item) ?? itemToStringLabel?.(item) ?? String(item);
}

function normalizeChipLimit(limit?: number) {
	if (limit === undefined || !Number.isFinite(limit)) {
		return undefined;
	}
	return Math.max(0, Math.floor(limit));
}

const styles = stylex.create({
	userOptionItem: {
		borderRadius: 0,
		columnGap: tokens["--space-2"],
		minWidth: 0,
	},
	userChipContent: {
		maxWidth: "9rem",
		minWidth: 0,
	},
	userName: {
		display: "block",
		minWidth: 0,
	},
	outsideComposition: {
		gap: tokens["--space-2"],
		alignItems: "stretch",
		flexDirection: "column",
	},
	outsideChipList: {
		alignItems: "center",
		columnGap: tokens["--space-1"],
		display: "flex",
		flexWrap: "wrap",
		rowGap: 2,
		minHeight: "30px",
	},
});
