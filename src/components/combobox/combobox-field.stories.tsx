import { Combobox } from "@base-ui/react/combobox";
import { CaretUpDownIcon } from "@phosphor-icons/react/dist/csr/CaretUpDown";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/csr/MagnifyingGlass";
import { PlusCircleIcon } from "@phosphor-icons/react/dist/csr/PlusCircle";
import { XIcon } from "@phosphor-icons/react/dist/csr/X";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { type ReactNode, useState } from "react";
import { fieldStyles, fieldTextStyles } from "@/components/field/field.stylex";
import { focusRing } from "@/styles/recipes/focus";
import { menuItemStyles, menuItemVariantStyles } from "@/components/menu/menu-item.stylex";
import { popupMotionStyles, popupPositionerStyles } from "@/components/popover/popover.stylex";
import { popupVars } from "@/components/popover/popover-vars.stylex";
import { pressable } from "@/styles/recipes/transitions";
import { tokens } from "@/theme/tokens.stylex";

import { Button } from "@/components/button/button";
import { ComboboxField, ComboboxMultiple, type ComboboxMultipleProps } from "@/components/combobox/combobox-field";
import { Icon } from "@/components/icons";
import { Text } from "@/components/text/text";

const frameworks = ["React", "Vue", "Svelte", "Solid", "Preact", "Qwik", "Angular"];
const languages = ["JavaScript", "TypeScript", "Python", "Rust", "Go", "Swift", "Kotlin"];
const apps = ["Codex", "Claude", "Cursor", "Zed"];
const summaryOptions = ["Option X", "Option Y", "Option Z", "Option W", "Option V"];

const meta = {
	title: "Components/Combobox",
	component: ComboboxField,
	args: {
		itemVariant: "default",
		label: "Framework",
		items: frameworks,
		placeholder: "Filter frameworks…",
		size: "md",
	},
	argTypes: {
		itemVariant: { control: "select", options: ["default", "primary", "error"] },
		size: { control: "inline-radio", options: ["sm", "md", "lg"] },
	},
	decorators: [
		(Story) => (
			<div {...stylex.props(styles.frame)}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof ComboboxField>;

export default meta;
type Story = StoryObj<typeof meta>;
type MultipleStory = StoryObj<ComboboxMultipleProps>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const ReadOnly: Story = { args: { readOnly: true } };
export const EmptyState: Story = { args: { items: [] } };

export const Sizes: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(styles.sizeStack)}>
			<ComboboxField label="Small" items={frameworks} placeholder="Choose a framework" size="sm" />
			<ComboboxField label="Medium" items={frameworks} placeholder="Choose a framework" size="md" />
			<ComboboxField label="Large" items={frameworks} placeholder="Choose a framework" size="lg" />
		</div>
	),
};

export const MultiplePlayground: MultipleStory = {
	args: {
		chipPlacement: "inside",
		creatable: false,
		defaultValue: ["TypeScript", "Rust", "Go", "Swift"],
		expandChips: "input-focus",
		itemVariant: "default",
		label: "Programming languages",
		items: languages,
		maxVisibleChips: 2,
		placeholder: "Filter languages…",
		size: "md",
	},
	argTypes: {
		chipPlacement: { control: "inline-radio", options: ["inside", "outside"] },
		creatable: { control: "boolean" },
		expandChips: { control: "select", options: ["input-focus", "always"] },
		itemVariant: { control: "select", options: ["default", "primary", "error"] },
		maxVisibleChips: { control: { type: "number", min: 0, step: 1 } },
		onCreate: { control: false },
		onValueChange: { control: false },
		size: { control: "inline-radio", options: ["sm", "md", "lg"] },
		value: { control: false },
	},
	render: (args) => <ComboboxMultiple {...args} />,
};

export const ChipPlacementOptions: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(styles.variantStack)}>
			<ExampleSection title="Inside" description="Selected values share the control with the filter input.">
				<ComboboxMultiple
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
				<ComboboxMultiple
					label="Programming languages"
					items={languages}
					placeholder="Filter languages…"
					defaultValue={languages.slice(0, 4)}
					maxVisibleChips={2}
					expandChips="input-focus"
					chipPlacement="outside"
				/>
			</ExampleSection>
		</div>
	),
};

export const CreatableTags: Story = {
	render: () => <CreatableTagsExample />,
};

export const LimitedChips: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(styles.variantStack)}>
			<ExampleSection
				title="Fixed limit"
				description="The configured limit remains applied while the input is focused.">
				<ComboboxMultiple
					label="Programming languages"
					items={languages}
					placeholder="Filter languages…"
					defaultValue={languages}
					maxVisibleChips={2}
				/>
			</ExampleSection>
			<ExampleSection
				title="Expand on input focus"
				description="Focus the filter input to reveal every selected value; blur it to restore the limit.">
				<ComboboxMultiple
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
				<ComboboxMultiple
					label="Programming languages"
					items={languages}
					placeholder="Filter languages…"
					defaultValue={languages}
					maxVisibleChips={2}
					expandChips="always"
				/>
			</ExampleSection>
		</div>
	),
};

export const ChipLimitExamples: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(styles.variantStack)}>
			<ExampleSection title="No limit" description="Omitting the limit renders every selected value.">
				<ComboboxMultiple
					label="Programming languages"
					items={languages}
					placeholder="Filter languages…"
					defaultValue={languages.slice(0, 4)}
				/>
			</ExampleSection>
			<ExampleSection
				title="Zero visible chips"
				description="Only the overflow count is shown, and the filter input remains available.">
				<ComboboxMultiple
					label="Programming languages"
					items={languages}
					placeholder="Filter languages…"
					defaultValue={languages.slice(0, 4)}
					maxVisibleChips={0}
				/>
			</ExampleSection>
			<ExampleSection title="One visible chip" description="The first selection is followed by the remaining count.">
				<ComboboxMultiple
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
				<ComboboxMultiple
					label="Programming languages"
					items={languages}
					placeholder="Filter languages…"
					defaultValue={languages.slice(0, 3)}
					maxVisibleChips={3}
				/>
			</ExampleSection>
		</div>
	),
};

export const ControlledMultiple: Story = {
	render: () => <ControlledMultipleExample />,
};

export const PopupInput: Story = {
	render: () => <SingleSelectPopupExample />,
};

export const PopupInputMultiple: Story = {
	render: () => <MultipleSummaryPopupExample />,
};

export const InlineFilterChips: Story = {
	render: () => <FilterChipsPopupExample />,
};

function CreatableTagsExample() {
	const [createdItems, setCreatedItems] = useState<string[]>([]);

	return (
		<div {...stylex.props(styles.exampleStack)}>
			<ComboboxMultiple
				label="Harness"
				items={apps}
				placeholder="Type to choose…"
				creatable
				onCreate={(item) => {
					setCreatedItems((currentItems) => [...currentItems, item]);
				}}
			/>
			<p aria-live="polite" {...stylex.props(styles.status)}>
				{createdItems.length > 0 ? `Created: ${createdItems.join(", ")}` : "Type a new color and press Enter or comma."}
			</p>
		</div>
	);
}

function ControlledMultipleExample() {
	const [value, setValue] = useState(["TypeScript", "Rust", "Go", "Swift"]);

	return (
		<ComboboxMultiple
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
		<section {...stylex.props(styles.exampleSection)}>
			<div {...stylex.props(styles.exampleHeading)}>
				<h3 {...stylex.props(styles.exampleTitle)}>{title}</h3>
				<p {...stylex.props(styles.exampleDescription)}>{description}</p>
			</div>
			{children}
		</section>
	);
}

function SingleSelectPopupExample() {
	return (
		<Combobox.Root items={[...frameworks]}>
			<div {...stylex.props(fieldStyles.root, styles.fieldLayout)}>
				<Combobox.Label {...stylex.props(fieldStyles.label)}>Framework</Combobox.Label>
				<Combobox.Trigger
					render={
						<Button
							variant="secondary"
							style={styles.trigger}
							endSlot={<CaretUpDownIcon aria-hidden weight="bold" />}
						/>
					}>
					<Combobox.Value>
						{(selectedValue: string | null) =>
							selectedValue ?? <span {...stylex.props(styles.triggerPlaceholder)}>Select framework</span>
						}
					</Combobox.Value>
				</Combobox.Trigger>
			</div>
			<PopupContent label="frameworks" />
		</Combobox.Root>
	);
}

function MultipleSummaryPopupExample() {
	return (
		<Combobox.Root items={[...summaryOptions]} multiple defaultValue={["Option X", "Option Y", "Option Z", "Option W"]}>
			<div {...stylex.props(fieldStyles.root, styles.fieldLayout)}>
				<Combobox.Label {...stylex.props(fieldStyles.label)}>Options</Combobox.Label>
				<Combobox.Trigger
					render={
						<Button
							variant="secondary"
							style={styles.trigger}
							endSlot={<CaretUpDownIcon aria-hidden weight="bold" />}
						/>
					}>
					<Combobox.Value placeholder="Select">
						{(selectedValue: string[]) => {
							const hiddenCount = Math.max(0, selectedValue.length - 1);
							return selectedValue.length > 0 ? (
								`${selectedValue[0]}${hiddenCount > 0 ? `, +${hiddenCount} more` : ""}`
							) : (
								<span {...stylex.props(styles.triggerPlaceholder)}>Select options</span>
							);
						}}
					</Combobox.Value>
				</Combobox.Trigger>
			</div>
			<PopupContent label="options" />
		</Combobox.Root>
	);
}

function FilterChipsPopupExample() {
	return (
		<Combobox.Root items={[...frameworks]} multiple defaultValue={["React", "Vue"]}>
			<div {...stylex.props(fieldStyles.root, styles.fieldLayout)}>
				<Combobox.Label {...stylex.props(fieldStyles.label)}>Frameworks</Combobox.Label>
				<Combobox.Chips {...stylex.props(styles.filterChips)}>
					<Combobox.Value>
						{(selectedValue: string[]) =>
							selectedValue.map((item) => (
								<Combobox.Chip key={item} aria-label={item} {...stylex.props(styles.chip)}>
									<span {...stylex.props(styles.chipLabel)}>{item}</span>
									<Combobox.ChipRemove
										aria-label={`Remove ${item}`}
										{...stylex.props(styles.chipRemove, focusRing.offset, pressable.transition)}>
										<XIcon aria-hidden size={12} weight="bold" />
									</Combobox.ChipRemove>
								</Combobox.Chip>
							))
						}
					</Combobox.Value>
					<Combobox.Trigger
						nativeButton
						render={
							<Button
								size="sm"
								shape="pill"
								variant="plain"
								style={styles.addTrigger}
								startSlot={<PlusCircleIcon aria-hidden weight="bold" />}>
								Add
							</Button>
						}
					/>
				</Combobox.Chips>
			</div>
			<PopupContent label="frameworks" />
		</Combobox.Root>
	);
}

function PopupContent({ label }: { label: string }) {
	return (
		<Combobox.Portal>
			<Combobox.Positioner align="start" sideOffset={6} {...stylex.props(popupPositionerStyles)}>
				<Combobox.Popup
					aria-label={`Select ${label}`}
					{...stylex.props(styles.panelSurface, styles.popup, popupMotionStyles.anchoredPopup)}>
					<div {...stylex.props(styles.popupInputRegion)}>
						<Combobox.InputGroup
							{...stylex.props(fieldStyles.inputUnstyled, styles.popupInputControl)}
							style={{ outline: "none", boxShadow: "none", border: "none" }}>
							<MagnifyingGlassIcon aria-hidden size={16} weight="bold" {...stylex.props(styles.searchIcon)} />
							<Combobox.Input
								aria-label={`Filter ${label}`}
								placeholder={`Filter ${label}…`}
								{...stylex.props(
									fieldStyles.inputUnstyled,
									fieldStyles.inputStandard,
									fieldTextStyles.md,
									styles.popupInput,
								)}
							/>
						</Combobox.InputGroup>
					</div>
					<Combobox.Empty {...stylex.props(styles.empty)}>No matching options.</Combobox.Empty>
					<Combobox.List className={stylex.props(styles.list).className}>
						{(item: string) => (
							<Combobox.Item
								key={item}
								value={item}
								className={stylex.props(menuItemStyles.item, menuItemVariantStyles.default).className}>
								<Combobox.ItemIndicator keepMounted className={stylex.props(menuItemStyles.indicator).className}>
									<Icon.Checkmark width="1em" height="1em" strokeWidth={1.5} />
								</Combobox.ItemIndicator>
								<span {...stylex.props(menuItemStyles.label)}>{item}</span>
							</Combobox.Item>
						)}
					</Combobox.List>

					<Combobox.Clear
						style={{
							position: "absolute",
							right: 12,
							top: 6,
							zIndex: 1,
						}}>
						<Text render={<span />} size={"1"}>
							Clear
						</Text>
					</Combobox.Clear>
				</Combobox.Popup>
			</Combobox.Positioner>
		</Combobox.Portal>
	);
}

const styles = stylex.create({
	frame: {
		maxWidth: "420px",
	},
	sizeStack: {
		gap: tokens["--space-6"],
		display: "flex",
		flexDirection: "column",
		maxWidth: "420px",
	},
	exampleStack: {
		gap: tokens["--space-2"],
		display: "flex",
		flexDirection: "column",
	},
	variantStack: {
		gap: tokens["--space-8"],
		display: "flex",
		flexDirection: "column",
	},
	exampleSection: {
		gap: tokens["--space-3"],
		display: "flex",
		flexDirection: "column",
	},
	exampleHeading: {
		gap: tokens["--space-1"],
		display: "flex",
		flexDirection: "column",
	},
	exampleTitle: {
		margin: 0,
		color: tokens["--fg"],
		fontSize: tokens["--font-size-2"],
		letterSpacing: tokens["--letter-spacing-2"],
		lineHeight: tokens["--line-height-2"],
	},
	exampleDescription: {
		margin: 0,
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-1"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
	},
	status: {
		margin: 0,
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-1"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
	},
	fieldLayout: {
		alignItems: "flex-start",
	},
	trigger: {
		justifyContent: "space-between",
		minWidth: "240px",
	},
	triggerPlaceholder: {
		color: tokens["--fg-subtle"],
	},
	filterChips: {
		alignItems: "center",
		columnGap: tokens["--space-1"],
		display: "flex",
		flexWrap: "wrap",
		rowGap: 2,
		minWidth: 0,
	},
	addTrigger: {
		flexShrink: 0,
	},
	chip: {
		padding: tokens["--space-1"],
		borderRadius: tokens["--radius-sm"],
		overflow: "hidden",
		alignItems: "center",
		backgroundColor: {
			default: tokens["--surface-subtle"],
			":focus-within": tokens["--bg-primary"],
		},
		color: {
			default: tokens["--fg"],
			":focus-within": tokens["--fg-accent-contrast"],
		},
		display: "inline-flex",
		fontSize: tokens["--font-size-1"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
		height: "28px",
	},
	chipLabel: {
		overflow: "hidden",
		paddingInline: tokens["--space-1"],
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
	},
	chipRemove: {
		padding: 0,
		borderRadius: tokens["--radius-xs"],
		borderWidth: 0,
		outline: "0",
		alignItems: "center",
		backgroundColor: {
			default: "transparent",
			":hover": {
				"@media (hover: hover) and (pointer: fine)": tokens["--surface"],
			},
		},
		color: {
			default: tokens["--fg-muted"],
			":hover": tokens["--fg"],
		},
		display: "flex",
		justifyContent: "center",
		height: tokens["--space-5"],
		width: tokens["--space-5"],
	},
	panelSurface: {
		[popupVars.background]: tokens["--elevated"],
		[popupVars.border]: tokens["--border"],
		[popupVars.foreground]: tokens["--fg"],
		borderRadius: tokens["--radius-lg"],
		backgroundColor: popupVars.background,
		boxShadow: tokens["--shadow-md"],
		color: popupVars.foreground,
	},
	popup: {
		overflow: "hidden",
		maxWidth: "var(--available-width)",
		minWidth: "240px",
		width: "var(--anchor-width)",
	},
	popupInputRegion: {
		padding: tokens["--space-1"],
	},
	popupInputControl: {
		gap: tokens["--space-2"],
		paddingInline: tokens["--space-3"],
		alignItems: "center",
		display: "flex",
	},
	popupInput: {
		padding: 0,
		borderWidth: 0,
		flex: "1",
		outline: "0",
		appearance: "none",
		backgroundColor: "transparent",
		boxSizing: "border-box",
		height: tokens["--size-control-md"],
		minWidth: 0,
		width: "100%",
	},
	searchIcon: {
		color: tokens["--fg-subtle"],
		flexShrink: 0,
	},
	list: {
		padding: {
			"[data-empty]": 0,
			default: tokens["--space-1"],
		},
		maxHeight: "240px",
		overflowY: "auto",
	},
	empty: {
		padding: {
			default: tokens["--space-3"],
			":empty": 0,
		},
		alignItems: "center",
		color: tokens["--fg-muted"],
		display: "flex",
		fontSize: tokens["--font-size-2"],
		justifyContent: "center",
		letterSpacing: tokens["--letter-spacing-2"],
		lineHeight: tokens["--line-height-2"],
		textAlign: "center",
	},
});
