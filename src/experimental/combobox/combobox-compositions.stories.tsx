import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { CaretUpDownIcon } from "@phosphor-icons/react/dist/csr/CaretUpDown";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/csr/MagnifyingGlass";
import { PlusCircleIcon } from "@phosphor-icons/react/dist/csr/PlusCircle";
import { XIcon } from "@phosphor-icons/react/dist/csr/X";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { Button } from "@/components/button/button";
import { fieldStyles, fieldTextStyles } from "@/components/field/field.stylex";
import { Icon } from "@/components/icons";
import { menuItemStyles, menuItemVariantStyles } from "@/components/menu/menu-item.stylex";
import { popupMotionStyles, popupPositionerStyles } from "@/components/popover/popover.stylex";
import { popupVars } from "@/components/popover/popover-vars.stylex";
import { Text } from "@/components/text/text";
import { focusRing } from "@/styles/recipes/focus";
import { pressable } from "@/styles/recipes/transitions";
import { tokens } from "@/theme/tokens.stylex";

const frameworks = ["React", "Vue", "Svelte", "Solid", "Preact", "Qwik", "Angular"];
const summaryOptions = ["Option X", "Option Y", "Option Z", "Option W", "Option V"];

const meta = {
	title: "Experimental/Combobox",
	parameters: {
		controls: { disable: true },
	},
	decorators: [
		(Story) => (
			<div {...stylex.props(styles.frame)}>
				<Story />
			</div>
		),
	],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const PopupInput: Story = {
	render: () => <SingleSelectPopupExample />,
};

export const PopupInputMultiple: Story = {
	render: () => <MultipleSummaryPopupExample />,
};

export const InlineFilterChips: Story = {
	render: () => <FilterChipsPopupExample />,
};

function SingleSelectPopupExample() {
	return (
		<BaseCombobox.Root items={[...frameworks]}>
			<div {...stylex.props(fieldStyles.root, styles.fieldLayout)}>
				<BaseCombobox.Label {...stylex.props(fieldStyles.label)}>Framework</BaseCombobox.Label>
				<BaseCombobox.Trigger
					render={
						<Button
							variant="secondary"
							style={styles.trigger}
							width="fit-content"
							endSlot={<CaretUpDownIcon aria-hidden weight="bold" />}
						/>
					}>
					<BaseCombobox.Value>
						{(selectedValue: string | null) =>
							selectedValue ?? <span {...stylex.props(styles.triggerPlaceholder)}>Select framework</span>
						}
					</BaseCombobox.Value>
				</BaseCombobox.Trigger>
			</div>
			<PopupContent label="frameworks" />
		</BaseCombobox.Root>
	);
}

function MultipleSummaryPopupExample() {
	return (
		<BaseCombobox.Root
			items={[...summaryOptions]}
			multiple
			defaultValue={["Option X", "Option Y", "Option Z", "Option W"]}>
			<div {...stylex.props(fieldStyles.root, styles.fieldLayout)}>
				<BaseCombobox.Label {...stylex.props(fieldStyles.label)}>Options</BaseCombobox.Label>
				<BaseCombobox.Trigger
					render={
						<Button
							variant="secondary"
							style={styles.trigger}
							endSlot={<CaretUpDownIcon aria-hidden weight="bold" />}
						/>
					}>
					<BaseCombobox.Value placeholder="Select">
						{(selectedValue: string[]) => {
							const hiddenCount = Math.max(0, selectedValue.length - 1);
							return selectedValue.length > 0 ? (
								`${selectedValue[0]}${hiddenCount > 0 ? `, +${hiddenCount} more` : ""}`
							) : (
								<span {...stylex.props(styles.triggerPlaceholder)}>Select options</span>
							);
						}}
					</BaseCombobox.Value>
				</BaseCombobox.Trigger>
			</div>
			<PopupContent label="options" />
		</BaseCombobox.Root>
	);
}

function FilterChipsPopupExample() {
	return (
		<BaseCombobox.Root items={[...frameworks]} multiple defaultValue={["React", "Vue"]}>
			<div {...stylex.props(fieldStyles.root, styles.fieldLayout)}>
				<BaseCombobox.Label {...stylex.props(fieldStyles.label)}>Frameworks</BaseCombobox.Label>
				<BaseCombobox.Chips {...stylex.props(styles.filterChips)}>
					<BaseCombobox.Value>
						{(selectedValue: string[]) =>
							selectedValue.map((item) => (
								<BaseCombobox.Chip key={item} aria-label={item} {...stylex.props(styles.chip)}>
									<span {...stylex.props(styles.chipLabel)}>{item}</span>
									<BaseCombobox.ChipRemove
										aria-label={`Remove ${item}`}
										{...stylex.props(styles.chipRemove, focusRing.offset, pressable.transition)}>
										<XIcon aria-hidden size={12} weight="bold" />
									</BaseCombobox.ChipRemove>
								</BaseCombobox.Chip>
							))
						}
					</BaseCombobox.Value>
					<BaseCombobox.Trigger
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
				</BaseCombobox.Chips>
			</div>
			<PopupContent label="frameworks" />
		</BaseCombobox.Root>
	);
}

function PopupContent({ label }: { label: string }) {
	return (
		<BaseCombobox.Portal>
			<BaseCombobox.Positioner align="start" sideOffset={6} {...stylex.props(popupPositionerStyles)}>
				<BaseCombobox.Popup
					aria-label={`Select ${label}`}
					{...stylex.props(styles.panelSurface, styles.popup, popupMotionStyles.anchoredPopup)}>
					<div {...stylex.props(styles.popupInputRegion)}>
						<BaseCombobox.InputGroup
							{...stylex.props(fieldStyles.inputUnstyled, styles.popupInputControl)}
							style={{ outline: "none", boxShadow: "none", border: "none" }}>
							<MagnifyingGlassIcon aria-hidden size={16} weight="bold" {...stylex.props(styles.searchIcon)} />
							<BaseCombobox.Input
								aria-label={`Filter ${label}`}
								placeholder={`Filter ${label}…`}
								{...stylex.props(
									fieldStyles.inputUnstyled,
									fieldStyles.inputStandard,
									fieldTextStyles.md,
									styles.popupInput,
								)}
							/>
						</BaseCombobox.InputGroup>
					</div>
					<BaseCombobox.Empty {...stylex.props(styles.empty)}>No matching options.</BaseCombobox.Empty>
					<BaseCombobox.List className={stylex.props(styles.list).className}>
						{(item: string) => (
							<BaseCombobox.Item
								key={item}
								value={item}
								className={stylex.props(menuItemStyles.item, menuItemVariantStyles.default).className}>
								<BaseCombobox.ItemIndicator
									keepMounted
									className={stylex.props(menuItemStyles.indicator).className}>
									<Icon.Checkmark width="1em" height="1em" strokeWidth={2} />
								</BaseCombobox.ItemIndicator>
								<span {...stylex.props(menuItemStyles.label)}>{item}</span>
							</BaseCombobox.Item>
						)}
					</BaseCombobox.List>

					<BaseCombobox.Clear
						style={{
							position: "absolute",
							right: 12,
							top: 6,
							zIndex: 1,
						}}>
						<Text render={<span />} size="1">
							Clear
						</Text>
					</BaseCombobox.Clear>
				</BaseCombobox.Popup>
			</BaseCombobox.Positioner>
		</BaseCombobox.Portal>
	);
}

const styles = stylex.create({
	frame: {
		maxWidth: "420px",
	},
	fieldLayout: {
		alignItems: "flex-start",
	},
	trigger: {
		justifyContent: "space-between",
	},
	triggerPlaceholder: {
		color: tokens["--fg-placeholder"],
		fontWeight: tokens["--font-weight-regular"],
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
