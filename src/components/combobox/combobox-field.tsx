import { Combobox } from "@base-ui/react/combobox";
import { CaretDownIcon } from "@phosphor-icons/react/dist/csr/CaretDown";
import { XCircleIcon } from "@phosphor-icons/react/dist/csr/XCircle";
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import { XIcon } from "@phosphor-icons/react/dist/csr/X";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useId, useMemo, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import { resolveThemeProps } from "@/theme/theme-props";
import type { FieldSize, FieldThemeProps } from "@/components/field/field.types";
import { fieldStyles, fieldControlSizes, fieldTextStyles, fieldThemeProps } from "@/components/field/field.stylex";
import { focusRing } from "@/styles/recipes/focus";
import { popupMotionStyles, popupPositionerStyles } from "@/components/popover/popover.stylex";
import { popupVars } from "@/components/popover/popover-vars.stylex";
import { pressable } from "@/styles/recipes/transitions";
import { tokens } from "@/theme/tokens.stylex";

import { menuItemSizeStyles, menuItemStyles, menuItemVariantStyles } from "@/components/menu/menu-item.stylex";
import type { MenuItemVariant } from "@/components/menu/menu.types";
import { Icon } from "@/components/icons";
import { comboboxMarker } from "./combobox.stylex";
import { Tooltip } from "@/components/tooltip/tooltip";

const HOVER_WHEN_INACTIVE = ":hover:not([data-disabled]):not([data-popup-open]):not([data-pressed])";

type ChipOverflowAnchorRefs = {
	inputGroupRef: RefObject<HTMLDivElement | null>;
	triggerRef: RefObject<HTMLButtonElement | null>;
};

export type ComboboxFieldProps = FieldThemeProps & {
	label: string;
	items: readonly string[];
	placeholder?: string;
	disabled?: boolean;
	itemVariant?: MenuItemVariant;
	readOnly?: boolean;
	size?: FieldSize;
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export type ComboboxMultipleProps = ComboboxFieldProps & {
	chipPlacement?: "inside" | "outside";
	creatable?: boolean;
	defaultValue?: readonly string[];
	expandChips?: "input-focus" | "always";
	maxVisibleChips?: number;
	onCreate?: (value: string) => void;
	onValueChange?: (value: string[]) => void;
	value?: readonly string[];
};

export function ComboboxField({
	label,
	items,
	placeholder = "Choose an option",
	disabled,
	itemVariant = "default",
	readOnly,
	size = "md",
	className,
	style,
	...props
}: ComboboxFieldProps) {
	const { styles } = resolveThemeProps(props, fieldThemeProps);
	const id = useId();
	const rootSx = stylex.props(fieldStyles.root, ...styles, style);

	return (
		<Combobox.Root items={[...items]} disabled={disabled} readOnly={readOnly}>
			<div className={[rootSx.className, className].filter(Boolean).join(" ")} style={rootSx.style}>
				<label htmlFor={id} {...stylex.props(fieldStyles.label)}>
					{label}
				</label>
				<Combobox.InputGroup
					{...stylex.props(
						fieldStyles.inputBase,
						fieldTextStyles[size],
						comboboxParts.inputGroup,
						fieldControlSizes[size],
						comboboxGroupSizeVariants[size],
						focusRing.within,
						comboboxMarker,
					)}>
					<Combobox.Input
						id={id}
						placeholder={placeholder}
						{...stylex.props(
							fieldStyles.inputUnstyled,
							fieldStyles.inputStandard,
							fieldTextStyles[size],
							comboboxParts.input,
							comboboxInputSizeVariants[size],
							readOnly && comboboxParts.inputReadOnly,
						)}
					/>
					<ComboboxActions size={size} />
				</Combobox.InputGroup>
			</div>
			<ComboboxPopup itemVariant={itemVariant} size={size} />
		</Combobox.Root>
	);
}

export function ComboboxMultiple({
	label,
	items,
	placeholder = "Choose options",
	disabled,
	itemVariant = "default",
	readOnly,
	chipPlacement = "inside",
	creatable = false,
	defaultValue = [],
	expandChips,
	maxVisibleChips,
	onCreate,
	onValueChange,
	size = "md",
	value,
	className,
	style,
	...props
}: ComboboxMultipleProps) {
	const { styles } = resolveThemeProps(props, fieldThemeProps);
	const id = useId();
	const rootSx = stylex.props(fieldStyles.root, ...styles, style);
	const chipsInside = chipPlacement === "inside";
	const [createdItems, setCreatedItems] = useState<string[]>([]);
	const [inputFocused, setInputFocused] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const [uncontrolledValue, setUncontrolledValue] = useState<string[]>(() => [...defaultValue]);
	const highlightedItemRef = useRef<string | undefined>(undefined);
	const inputGroupRef = useRef<HTMLDivElement>(null);
	const chipOverflowTriggerRef = useRef<HTMLButtonElement>(null);
	const selectedValues = value === undefined ? uncontrolledValue : [...value];
	const availableItems = useMemo(() => mergeUniqueItems(items, createdItems), [items, createdItems]);
	const trimmedInputValue = inputValue.trim();
	const normalizedInputValue = normalizeItemValue(trimmedInputValue);
	const matchingItem =
		normalizedInputValue === ""
			? undefined
			: availableItems.find((item) => normalizeItemValue(item) === normalizedInputValue);
	const creatableItem =
		creatable && normalizedInputValue !== "" && matchingItem === undefined ? trimmedInputValue : undefined;
	const itemsForView = useMemo(
		() => (creatableItem === undefined ? availableItems : [...availableItems, creatableItem]),
		[availableItems, creatableItem],
	);
	const chipLimit =
		expandChips === "always" || (expandChips === "input-focus" && inputFocused)
			? undefined
			: normalizeChipLimit(maxVisibleChips);

	function updateSelectedValues(nextValue: string[]) {
		if (value === undefined) {
			setUncontrolledValue(nextValue);
		}
		onValueChange?.(nextValue);
	}

	function selectExistingItem(item: string) {
		if (!selectedValues.some((selectedItem) => normalizeItemValue(selectedItem) === normalizeItemValue(item))) {
			updateSelectedValues([...selectedValues, item]);
		}
		setInputValue("");
	}

	function createItem(item: string) {
		const trimmedItem = item.trim();
		if (trimmedItem === "") {
			return;
		}

		const existingItem = availableItems.find(
			(availableItem) => normalizeItemValue(availableItem) === normalizeItemValue(trimmedItem),
		);
		if (existingItem !== undefined) {
			selectExistingItem(existingItem);
			return;
		}

		if (selectedValues.some((selectedItem) => normalizeItemValue(selectedItem) === normalizeItemValue(trimmedItem))) {
			setInputValue("");
			return;
		}

		setCreatedItems((currentItems) => mergeUniqueItems(currentItems, [trimmedItem]));
		updateSelectedValues([...selectedValues, trimmedItem]);
		onCreate?.(trimmedItem);
		setInputValue("");
	}

	function commitInputValue() {
		if (matchingItem !== undefined) {
			selectExistingItem(matchingItem);
			return;
		}
		if (creatableItem !== undefined) {
			createItem(creatableItem);
		}
	}

	function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
		if (event.key === ",") {
			event.preventDefault();
			commitInputValue();
			return;
		}

		if (event.key === "Enter" && highlightedItemRef.current === undefined && trimmedInputValue !== "") {
			event.preventDefault();
			commitInputValue();
		}
	}

	function handleRootValueChange(nextValue: string[]) {
		const selectedCreatableItem =
			creatableItem !== undefined &&
			nextValue.some((item) => normalizeItemValue(item) === normalizeItemValue(creatableItem));

		if (selectedCreatableItem) {
			createItem(creatableItem);
			return;
		}

		updateSelectedValues(nextValue);
		setInputValue("");
	}

	return (
		<Combobox.Root
			items={itemsForView}
			multiple
			disabled={disabled}
			readOnly={readOnly}
			value={selectedValues}
			onValueChange={handleRootValueChange}
			inputValue={inputValue}
			onInputValueChange={setInputValue}
			onItemHighlighted={
				creatable
					? (item) => {
							highlightedItemRef.current = item;
						}
					: undefined
			}>
			<div className={[rootSx.className, className].filter(Boolean).join(" ")} style={rootSx.style}>
				<label htmlFor={id} {...stylex.props(fieldStyles.label)}>
					{label}
				</label>

				{!chipsInside ? (
					<Combobox.Chips {...stylex.props(comboboxParts.chips, chipPlacementVariants.outside)}>
						<Combobox.Value>
							{(value: string[]) =>
								value.length > 0 ? (
									renderChips(value, chipLimit)
								) : (
									<span {...stylex.props(comboboxParts.noChips)}>No selections</span>
								)
							}
						</Combobox.Value>
					</Combobox.Chips>
				) : null}

				<Combobox.InputGroup
					ref={inputGroupRef}
					{...stylex.props(
						fieldStyles.inputBase,
						fieldTextStyles[size],
						comboboxParts.inputGroup,
						fieldControlSizes[size],
						comboboxGroupSizeVariants[size],
						focusRing.within,
						chipsInside && inputGroupVariants.withChips,
						comboboxMarker,
					)}>
					{chipsInside ? (
						<Combobox.Chips {...stylex.props(comboboxParts.chips, chipPlacementVariants.inside)}>
							<Combobox.Value>
								{(value: string[]) => (
									<>
										{renderChips(value, chipLimit, {
											inputGroupRef,
											triggerRef: chipOverflowTriggerRef,
										})}
										<Combobox.Input
											id={id}
											placeholder={value.length > 0 ? "" : placeholder}
											onFocus={() => {
												setInputFocused(true);
											}}
											onBlur={() => {
												setInputFocused(false);
											}}
											onKeyDown={creatable ? handleInputKeyDown : undefined}
											{...stylex.props(
												fieldStyles.inputUnstyled,
												fieldStyles.inputStandard,
												fieldTextStyles[size],
												comboboxParts.input,
												comboboxInputSizeVariants[size],
												inputVariants.withChips,
												readOnly && comboboxParts.inputReadOnly,
											)}
										/>
									</>
								)}
							</Combobox.Value>
						</Combobox.Chips>
					) : (
						<Combobox.Input
							id={id}
							placeholder={placeholder}
							onFocus={() => {
								setInputFocused(true);
							}}
							onBlur={() => {
								setInputFocused(false);
							}}
							onKeyDown={creatable ? handleInputKeyDown : undefined}
							{...stylex.props(
								fieldStyles.inputUnstyled,
								fieldStyles.inputStandard,
								fieldTextStyles[size],
								comboboxParts.input,
								comboboxInputSizeVariants[size],
								readOnly && comboboxParts.inputReadOnly,
							)}
						/>
					)}
					<ComboboxActions showClear={false} size={size} />
				</Combobox.InputGroup>
			</div>
			<ComboboxPopup itemVariant={itemVariant} creatableItem={creatableItem} size={size} />
		</Combobox.Root>
	);
}

function ComboboxActions({ showClear = true, size }: { showClear?: boolean; size: FieldSize }) {
	return (
		<div {...stylex.props(comboboxParts.actions)}>
			{showClear ? (
				<Combobox.Clear
					aria-label="Clear selection"
					{...stylex.props(
						comboboxParts.action,
						comboboxActionSizeVariants[size],
						focusRing.offset,
						pressable.transition,
					)}>
					<XCircleIcon aria-hidden size={"1.25em"} weight="fill" />
				</Combobox.Clear>
			) : null}
			<Combobox.Trigger
				aria-label="Show options"
				{...stylex.props(
					comboboxParts.action,
					comboboxActionSizeVariants[size],
					focusRing.offset,
					pressable.transition,
				)}>
				<CaretDownIcon aria-hidden size="1em" weight="bold" />
			</Combobox.Trigger>
		</div>
	);
}

function ComboboxPopup({
	itemVariant,
	creatableItem,
	size,
}: {
	itemVariant: MenuItemVariant;
	creatableItem?: string;
	size: FieldSize;
}) {
	return (
		<Combobox.Portal>
			<Combobox.Positioner sideOffset={6} align="center" {...stylex.props(popupPositionerStyles)}>
				<Combobox.Popup
					{...stylex.props(comboboxParts.panelSurface, comboboxParts.popup, popupMotionStyles.anchoredPopup)}>
					<Combobox.Empty {...stylex.props(comboboxParts.empty)}>No matching options.</Combobox.Empty>
					<Combobox.List className={stylex.props(comboboxParts.list).className}>
						{(item: string) => {
							const isCreatableItem =
								creatableItem !== undefined && normalizeItemValue(item) === normalizeItemValue(creatableItem);

							return (
								<Combobox.Item
									key={isCreatableItem ? `create:${item}` : item}
									value={item}
									className={
										stylex.props(
											menuItemStyles.item,
											menuItemSizeStyles[size],
											menuItemVariantStyles[itemVariant],
											focusRing.inset,
										).className
									}>
									{isCreatableItem ? (
										<span {...stylex.props(menuItemStyles.indicator, comboboxParts.creatableIndicator)}>
											<PlusIcon aria-hidden size="1em" weight="bold" />
										</span>
									) : (
										<Combobox.ItemIndicator keepMounted className={stylex.props(menuItemStyles.indicator).className}>
											<Icon.Checkmark width="1em" height="1em" />
										</Combobox.ItemIndicator>
									)}
									<span {...stylex.props(menuItemStyles.label)}>{isCreatableItem ? `Create “${item}”` : item}</span>
								</Combobox.Item>
							);
						}}
					</Combobox.List>
				</Combobox.Popup>
			</Combobox.Positioner>
		</Combobox.Portal>
	);
}

function renderChips(values: string[], maxVisibleChips?: number, tooltipAnchorRefs?: ChipOverflowAnchorRefs) {
	const visibleValues = maxVisibleChips === undefined ? values : values.slice(0, maxVisibleChips);
	const hiddenCount = values.length - visibleValues.length;
	const overflowLabel = visibleValues.length === 0 ? `${hiddenCount} selected` : `+${hiddenCount}`;

	return (
		<>
			{visibleValues.map((value) => (
				<Combobox.Chip key={value} aria-label={value} {...stylex.props(comboboxParts.chip, comboboxMarker)}>
					<span {...stylex.props(comboboxParts.chipLabel)}>{value}</span>
					<Combobox.ChipRemove
						aria-label={`Remove ${value}`}
						{...stylex.props(comboboxParts.action, comboboxParts.chipRemove, focusRing.offset, pressable.transition)}>
						<XIcon aria-hidden size={12} weight="bold" />
					</Combobox.ChipRemove>
				</Combobox.Chip>
			))}
			{hiddenCount > 0 ? (
				<Tooltip.Root>
					<Tooltip.Trigger
						ref={tooltipAnchorRefs?.triggerRef}
						aria-label={overflowLabel}
						{...stylex.props(comboboxParts.chipOverflow)}>
						{overflowLabel}
					</Tooltip.Trigger>
					<Tooltip.Popup
						positionerProps={
							tooltipAnchorRefs
								? {
										anchor: () => getChipOverflowAnchor(tooltipAnchorRefs),
										align: "start",
										collisionAvoidance: { align: "none", side: "none" },
										side: "bottom",
										sideOffset: 0,
									}
								: { align: "start", side: "inline-start" }
						}>
						<Combobox.Value />
					</Tooltip.Popup>
				</Tooltip.Root>
			) : null}
		</>
	);
}

function getChipOverflowAnchor({ inputGroupRef, triggerRef }: ChipOverflowAnchorRefs) {
	const inputGroup = inputGroupRef.current;
	const trigger = triggerRef.current;

	if (!inputGroup || !trigger) {
		return null;
	}

	return {
		contextElement: inputGroup,
		getBoundingClientRect() {
			const inputGroupRect = inputGroup.getBoundingClientRect();
			const triggerRect = trigger.getBoundingClientRect();
			const inputGroupStyle = getComputedStyle(inputGroup);
			const inlineStartInset =
				Number.parseFloat(inputGroupStyle.borderInlineStartWidth) +
				Number.parseFloat(inputGroupStyle.paddingInlineStart);
			const x =
				inputGroupStyle.direction === "rtl"
					? inputGroupRect.right - inlineStartInset
					: inputGroupRect.left + inlineStartInset;
			const y = triggerRect.top;

			return {
				bottom: y,
				height: 0,
				left: x,
				right: x,
				top: y,
				width: 0,
				x,
				y,
			};
		},
	};
}

function normalizeItemValue(value: string) {
	return value.trim().toLocaleLowerCase();
}

function mergeUniqueItems(primaryItems: readonly string[], additionalItems: readonly string[]) {
	const mergedItems = [...primaryItems];
	const normalizedItems = new Set(primaryItems.map(normalizeItemValue));

	additionalItems.forEach((item) => {
		const normalizedItem = normalizeItemValue(item);
		if (!normalizedItems.has(normalizedItem)) {
			normalizedItems.add(normalizedItem);
			mergedItems.push(item);
		}
	});

	return mergedItems;
}

function normalizeChipLimit(limit?: number) {
	if (limit === undefined || !Number.isFinite(limit)) {
		return undefined;
	}
	return Math.max(0, Math.floor(limit));
}

const comboboxParts = stylex.create({
	panelSurface: {
		[popupVars.background]: tokens["--elevated"],
		[popupVars.border]: tokens["--border"],
		[popupVars.foreground]: tokens["--fg"],
		borderRadius: tokens["--radius-lg"],
		backgroundColor: popupVars.background,
		boxShadow: tokens["--shadow-md"],
		color: popupVars.foreground,
	},
	inputGroup: {
		borderColor: {
			"[data-disabled]": tokens["--border"],
			"[data-readonly]": tokens["--border"],
			default: tokens["--border-input"],
			":focus-within:not([data-disabled]):not([data-readonly])": tokens["--focus"],
			":hover:not(:focus-within):not([data-disabled]):not([data-readonly])": tokens["--border-input-hover"],
		},
		alignItems: "center",
		display: "flex",
		position: "relative",
		transitionDuration: tokens["--motion-duration-long"],
		transitionProperty: "height",
		transitionTimingFunction: tokens["--motion-ease-smooth-out"],
	},
	input: {
		borderWidth: 0,
		outline: "0",
		backgroundColor: "transparent",
		flexGrow: 1,
		minWidth: 0,
	},
	inputReadOnly: {
		"::placeholder": {
			opacity: 0,
		},
	},
	chips: {
		alignItems: "center",
		columnGap: tokens["--space-1"],
		display: "flex",
		flexWrap: "wrap",
		rowGap: 2,
		minWidth: 0,
	},
	chip: {
		padding: "2px",
		borderRadius: tokens["--radius-sm"],
		cornerShape: "superellipse(1.1)",
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
		height: "24px",
	},
	chipLabel: {
		gap: tokens["--space-1"],
		overflow: "hidden",
		paddingInline: tokens["--space-1"],
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
	},
	chipOverflow: {
		borderRadius: tokens["--radius-sm"],
		paddingInline: tokens["--space-2"],
		alignItems: "center",
		backgroundColor: {
			default: tokens["--surface-subtle"],
			":hover": tokens["--bg-highlight"],
		},
		color: tokens["--fg"],
		display: "inline-flex",
		flexShrink: 0,
		fontSize: tokens["--font-size-1"],
		fontVariantNumeric: "tabular-nums",
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
		whiteSpace: "nowrap",
		height: "24px",
	},
	chipRemove: {
		borderRadius: tokens["--radius-xs"],
		outline: "0",
		backgroundColor: {
			default: "transparent",
			[stylex.when.ancestor('[aria-readonly="true"]', comboboxMarker)]: "transparent",
			[stylex.when.ancestor("[data-disabled]", comboboxMarker)]: "transparent",
			[stylex.when.ancestor("[data-readonly]", comboboxMarker)]: "transparent",
			":hover": {
				"@media (hover: hover) and (pointer: fine)": tokens["--surface"],
			},
		},
		height: tokens["--space-5"],
		width: tokens["--space-5"],
	},
	noChips: {
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-1"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
	},
	creatableIndicator: {
		visibility: "visible",
	},
	actions: {
		gap: 0,
		display: "flex",
		insetInlineEnd: 2,
		position: "absolute",
	},
	action: {
		padding: 0,
		borderRadius: tokens["--radius-sm"],
		borderWidth: 0,
		alignItems: "center",
		color: {
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[HOVER_WHEN_INACTIVE]: {
				"@media (hover: hover) and (pointer: fine)": tokens["--fg"],
			},
			default: tokens["--fg-subtle"],
			[stylex.when.ancestor('[aria-readonly="true"]', comboboxMarker)]: tokens["--fg-subtle"],
			[stylex.when.ancestor("[data-disabled]", comboboxMarker)]: tokens["--fg-subtle"],
			[stylex.when.ancestor("[data-readonly]", comboboxMarker)]: tokens["--fg-subtle"],
		},
		cursor: {
			"[data-disabled]": "not-allowed",
			default: "default",
			[stylex.when.ancestor('[aria-readonly="true"]', comboboxMarker)]: "default",
			[stylex.when.ancestor("[data-readonly]", comboboxMarker)]: "default",
		},
		display: "flex",
		fontSize: "inherit",
		justifyContent: "center",
		opacity: {
			default: 1,
			[stylex.when.ancestor('[aria-readonly="true"]', comboboxMarker)]: 0.48,
			[stylex.when.ancestor("[data-disabled]", comboboxMarker)]: 0.48,
			[stylex.when.ancestor("[data-readonly]", comboboxMarker)]: 0.48,
		},
		pointerEvents: {
			"[data-disabled]": "none",
			default: "auto",
			[stylex.when.ancestor('[aria-readonly="true"]', comboboxMarker)]: "none",
			[stylex.when.ancestor("[data-disabled]", comboboxMarker)]: "none",
			[stylex.when.ancestor("[data-readonly]", comboboxMarker)]: "none",
		},
	},
	popup: {
		overflow: "hidden",
		minWidth: "var(--anchor-width)",
	},
	list: {
		padding: {
			"[data-empty]": 0,
			default: tokens["--space-1"],
		},
		maxHeight: "260px",
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

const comboboxGroupSizeVariants = stylex.create({
	sm: {
		paddingInlineEnd: tokens["--size-control-md"],
		paddingInlineStart: tokens["--space-1"],
	},
	md: {
		paddingInlineEnd: tokens["--space-8"],
		paddingInlineStart: tokens["--space-1"],
	},
	lg: {
		paddingInlineEnd: tokens["--size-control-lg"],
		paddingInlineStart: tokens["--space-2"],
	},
});

const comboboxInputSizeVariants = stylex.create({
	sm: {
		paddingBlock: tokens["--space-2"],
		paddingInlineStart: tokens["--space-2"],
		height: tokens["--size-control-sm"],
	},
	md: {
		paddingBlock: tokens["--space-3"],
		paddingInlineStart: tokens["--space-2"],
		height: tokens["--size-control-md"],
	},
	lg: {
		paddingBlock: tokens["--space-4"],
		paddingInlineStart: tokens["--space-3"],
		height: tokens["--size-control-lg"],
	},
});

const comboboxActionSizeVariants = stylex.create({
	sm: {
		height: tokens["--size-control-xs"],
		width: tokens["--size-control-xs"],
	},
	md: {
		height: tokens["--size-control-sm"],
		width: tokens["--size-control-sm"],
	},
	lg: {
		height: tokens["--size-control-md"],
		width: tokens["--size-control-md"],
	},
});

const inputGroupVariants = stylex.create({
	withChips: {
		gap: tokens["--space-1"],
		paddingBlock: "3px",
		flexWrap: "wrap",
		paddingBlockStart: "3px",
		paddingInlineEnd: tokens["--space-8"],
		paddingInlineStart: tokens["--space-1"],
		height: "auto",
	},
});

const inputVariants = stylex.create({
	withChips: {
		paddingBlock: 0,
		flexBasis: tokens["--space-16"], // acts as a min-width to force newline wrap
		paddingInlineStart: tokens["--space-1"],
		height: "26px",
	},
});

const chipPlacementVariants = stylex.create({
	inside: {
		flexGrow: 1,
	},
	outside: {
		minHeight: "30px",
	},
});
