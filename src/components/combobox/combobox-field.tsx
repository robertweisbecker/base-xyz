import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { Field } from "@base-ui/react/field";
import { CaretDownIcon } from "@phosphor-icons/react/dist/csr/CaretDown";
import { XCircleIcon } from "@phosphor-icons/react/dist/csr/XCircle";
import { XIcon } from "@phosphor-icons/react/dist/csr/X";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { createContext, useContext, type ComponentProps, type ReactNode, type RefObject } from "react";
import { fieldControlSizes, fieldStyles, fieldTextStyles, fieldThemeProps } from "@/components/field/field.stylex";
import type { FieldSize, FieldThemeProps } from "@/components/field/field.types";
import { Icon } from "@/components/icons";
import { menuItemSizeStyles, menuItemStyles, menuItemVariantStyles } from "@/components/menu/menu-item.stylex";
import type { MenuItemVariant } from "@/components/menu/menu.types";
import { popupMotionStyles, popupPositionerStyles } from "@/components/popover/popover.stylex";
import { Tooltip } from "@/components/tooltip/tooltip";
import { focusRing } from "@/styles/recipes/focus";
import { pressable } from "@/styles/recipes/transitions";
import { resolveThemeProps } from "@/theme/theme-props";
import {
	comboboxActionSizeVariants,
	comboboxGroupSizeVariants,
	comboboxInputSizeVariants,
	comboboxMarker,
	comboboxParts,
	inputGroupVariants,
	inputVariants,
} from "./combobox.stylex";

type StyledProps<T> = Omit<T, "className" | "style"> & {
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

type ComboboxMultipleMode = boolean | undefined;

type ComboboxContextValue = {
	multiple: boolean;
	readOnly: boolean;
	size: FieldSize;
};

const ComboboxContext = createContext<ComboboxContextValue>({ multiple: false, readOnly: false, size: "md" });
const ComboboxChipsContext = createContext(false);

export type ComboboxRootProps<Value, Multiple extends ComboboxMultipleMode = false> = Omit<
	BaseCombobox.Root.Props<Value, Multiple>,
	"className" | "color" | "size" | "style" | keyof FieldThemeProps
> &
	FieldThemeProps & {
		className?: string;
		invalid?: boolean;
		size?: FieldSize;
		/** StyleX overrides, applied after the component's own styles. */
		style?: StyleXStyles;
	};

export function Root<Value, Multiple extends ComboboxMultipleMode = false>({
	children,
	className,
	disabled,
	invalid,
	multiple,
	readOnly = false,
	size = "md",
	style,
	...props
}: ComboboxRootProps<Value, Multiple>) {
	const { restProps, styles } = resolveThemeProps(props, fieldThemeProps);
	const sx = stylex.props(fieldStyles.root, ...styles, style);

	return (
		<Field.Root
			disabled={disabled}
			invalid={invalid}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}>
			<ComboboxContext.Provider value={{ multiple: multiple === true, readOnly, size }}>
				<BaseCombobox.Root disabled={disabled} multiple={multiple} readOnly={readOnly} {...restProps}>
					{children}
				</BaseCombobox.Root>
			</ComboboxContext.Provider>
		</Field.Root>
	);
}

export type ComboboxLabelProps = StyledProps<Field.Label.Props>;

export function Label({ ref, className, style, ...props }: ComboboxLabelProps) {
	const sx = stylex.props(fieldStyles.label, style);

	return (
		<Field.Label
			ref={ref}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}
		/>
	);
}

export type ComboboxInputGroupVariant = "input" | "chips";

export type ComboboxInputGroupProps = StyledProps<BaseCombobox.InputGroup.Props> & {
	variant?: ComboboxInputGroupVariant;
};

export function InputGroup({ ref, children, className, style, variant = "input", ...props }: ComboboxInputGroupProps) {
	const { multiple, size } = useContext(ComboboxContext);
	const withChips = variant === "chips";
	const sx = stylex.props(
		fieldStyles.inputBase,
		fieldTextStyles[size],
		comboboxParts.inputGroup,
		fieldControlSizes[size],
		comboboxGroupSizeVariants[size],
		focusRing.within,
		withChips && inputGroupVariants.withChips,
		multiple && inputGroupVariants.multiple,
		comboboxMarker,
		style,
	);

	return (
		<ComboboxChipsContext.Provider value={withChips}>
			<BaseCombobox.InputGroup
				ref={ref}
				className={[sx.className, className].filter(Boolean).join(" ")}
				style={sx.style}
				{...props}>
				{children}
				<Actions />
			</BaseCombobox.InputGroup>
		</ComboboxChipsContext.Provider>
	);
}

export type ComboboxInputProps = StyledProps<BaseCombobox.Input.Props>;

export function Input({ ref, className, style, ...props }: ComboboxInputProps) {
	const { readOnly, size } = useContext(ComboboxContext);
	const withinChips = useContext(ComboboxChipsContext);
	const sx = stylex.props(
		fieldStyles.inputUnstyled,
		fieldStyles.inputStandard,
		fieldTextStyles[size],
		comboboxParts.input,
		comboboxInputSizeVariants[size],
		withinChips && inputVariants.withChips,
		readOnly && comboboxParts.inputReadOnly,
		style,
	);

	return (
		<BaseCombobox.Input
			ref={ref}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}
		/>
	);
}

function Actions() {
	const { multiple } = useContext(ComboboxContext);
	const action = multiple ? (
		<Clear>Clear all</Clear>
	) : (
		<BaseCombobox.Value>{(value: unknown) => (value == null ? <Trigger /> : <Clear />)}</BaseCombobox.Value>
	);

	return <div {...stylex.props(comboboxParts.actions)}>{action}</div>;
}

type ComboboxClearProps = StyledProps<BaseCombobox.Clear.Props>;

function Clear({ ref, "aria-label": ariaLabel, children, className, style, ...props }: ComboboxClearProps) {
	const { size } = useContext(ComboboxContext);
	const hasVisibleLabel = children != null;
	const sx = stylex.props(
		comboboxParts.action,
		hasVisibleLabel ? comboboxParts.textAction : comboboxActionSizeVariants[size],
		focusRing.offset,
		pressable.transition,
		style,
	);

	return (
		<BaseCombobox.Clear
			ref={ref}
			aria-label={ariaLabel ?? (children == null ? "Clear selection" : undefined)}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}>
			{children ?? <XCircleIcon aria-hidden size="1.25em" weight="fill" />}
		</BaseCombobox.Clear>
	);
}

type ComboboxTriggerProps = StyledProps<BaseCombobox.Trigger.Props>;

function Trigger({ ref, "aria-label": ariaLabel, children, className, style, ...props }: ComboboxTriggerProps) {
	const { size } = useContext(ComboboxContext);
	const sx = stylex.props(
		comboboxParts.action,
		comboboxActionSizeVariants[size],
		focusRing.offset,
		pressable.transition,
		style,
	);

	return (
		<BaseCombobox.Trigger
			ref={ref}
			aria-label={ariaLabel ?? (children == null ? "Show options" : undefined)}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}>
			{children ?? <CaretDownIcon aria-hidden size="1em" weight="bold" />}
		</BaseCombobox.Trigger>
	);
}

export const Value = BaseCombobox.Value;

export type ComboboxChipsProps = StyledProps<BaseCombobox.Chips.Props>;

export function Chips({ ref, children, className, style, ...props }: ComboboxChipsProps) {
	const sx = stylex.props(comboboxParts.chips, style);

	return (
		<ComboboxChipsContext.Provider value>
			<BaseCombobox.Chips
				ref={ref}
				className={[sx.className, className].filter(Boolean).join(" ")}
				style={sx.style}
				{...props}>
				{children}
			</BaseCombobox.Chips>
		</ComboboxChipsContext.Provider>
	);
}

export type ComboboxChipProps = StyledProps<BaseCombobox.Chip.Props> & {
	/** Visual content positioned before the chip label. */
	startSlot?: ReactNode;
	/** Optional removal control positioned after the chip label. */
	endSlot?: ReactNode;
};

export function Chip({ children, className, endSlot, ref, startSlot, style, ...props }: ComboboxChipProps) {
	const sx = stylex.props(comboboxParts.chip, comboboxMarker, style);

	return (
		<BaseCombobox.Chip
			ref={ref}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}>
			{startSlot != null ? (
				<span aria-hidden {...stylex.props(comboboxParts.chipSlot)}>
					{startSlot}
				</span>
			) : null}
			<span {...stylex.props(comboboxParts.chipLabel)}>{children}</span>
			{endSlot != null ? <span {...stylex.props(comboboxParts.chipSlot)}>{endSlot}</span> : null}
		</BaseCombobox.Chip>
	);
}

export type ComboboxChipRemoveProps = StyledProps<BaseCombobox.ChipRemove.Props>;

export function ChipRemove({
	ref,
	"aria-label": ariaLabel,
	"aria-labelledby": ariaLabelledBy,
	children,
	className,
	style,
	...props
}: ComboboxChipRemoveProps) {
	const sx = stylex.props(
		comboboxParts.action,
		comboboxParts.chipRemove,
		focusRing.offset,
		pressable.transition,
		style,
	);

	return (
		<BaseCombobox.ChipRemove
			ref={ref}
			aria-label={ariaLabel ?? (children == null && ariaLabelledBy == null ? "Remove selection" : undefined)}
			aria-labelledby={ariaLabelledBy}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}>
			{children ?? <XIcon aria-hidden size={12} weight="bold" />}
		</BaseCombobox.ChipRemove>
	);
}

type TooltipTriggerProps = ComponentProps<typeof Tooltip.Trigger>;

export type ComboboxChipOverflowProps = Omit<TooltipTriggerProps, "children" | "className" | "style"> & {
	anchor: RefObject<Element | null>;
	children: ReactNode;
	className?: string;
	label: ReactNode;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export function ChipOverflow({ anchor, children, className, label, ref, style, ...props }: ComboboxChipOverflowProps) {
	const sx = stylex.props(comboboxParts.chipOverflow, style);

	return (
		<Tooltip.Root>
			<Tooltip.Trigger
				ref={ref}
				className={[sx.className, className].filter(Boolean).join(" ")}
				style={sx.style}
				{...props}>
				{label}
			</Tooltip.Trigger>
			<Tooltip.Popup positionerProps={{ anchor, align: "start", side: "bottom", sideOffset: 0 }}>
				{children}
			</Tooltip.Popup>
		</Tooltip.Root>
	);
}

export type ComboboxPositionerProps = StyledProps<BaseCombobox.Positioner.Props>;

export type ComboboxPopupProps = StyledProps<BaseCombobox.Popup.Props> & {
	portalProps?: Omit<BaseCombobox.Portal.Props, "children">;
	positionerProps?: ComboboxPositionerProps;
};

export function Popup({ ref, children, className, portalProps, positionerProps, style, ...props }: ComboboxPopupProps) {
	const {
		align = "center",
		className: positionerClassName,
		side = "bottom",
		sideOffset = 6,
		style: positionerStyle,
		...otherPositionerProps
	} = positionerProps ?? {};
	const sx = stylex.props(comboboxParts.panelSurface, comboboxParts.popup, popupMotionStyles.anchoredPopup, style);
	const positionerSx = stylex.props(popupPositionerStyles, positionerStyle);

	return (
		<BaseCombobox.Portal {...portalProps}>
			<BaseCombobox.Positioner
				align={align}
				side={side}
				sideOffset={sideOffset}
				className={[positionerSx.className, positionerClassName].filter(Boolean).join(" ")}
				style={positionerSx.style}
				{...otherPositionerProps}>
				<BaseCombobox.Popup
					ref={ref}
					className={[sx.className, className].filter(Boolean).join(" ")}
					style={sx.style}
					{...props}>
					{children}
				</BaseCombobox.Popup>
			</BaseCombobox.Positioner>
		</BaseCombobox.Portal>
	);
}

export type ComboboxListProps = StyledProps<BaseCombobox.List.Props>;

export function List({ ref, className, style, ...props }: ComboboxListProps) {
	const sx = stylex.props(comboboxParts.list, style);

	return (
		<BaseCombobox.List
			ref={ref}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}
		/>
	);
}

export type ComboboxItemVariant = MenuItemVariant;

export type ComboboxItemProps = Omit<StyledProps<BaseCombobox.Item.Props>, "children"> & {
	children?: ReactNode;
	variant?: ComboboxItemVariant;
};

export function Item({ ref, children, className, style, variant = "default", ...props }: ComboboxItemProps) {
	const { size } = useContext(ComboboxContext);
	const sx = stylex.props(
		menuItemStyles.item,
		menuItemSizeStyles[size],
		menuItemVariantStyles[variant],
		focusRing.inset,
		style,
	);

	return (
		<BaseCombobox.Item
			ref={ref}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}>
			<BaseCombobox.ItemIndicator keepMounted {...stylex.props(menuItemStyles.indicator)}>
				<Icon.Checkmark width="1em" height="1em" strokeWidth={3} />
			</BaseCombobox.ItemIndicator>
			<div {...stylex.props(menuItemStyles.label)}>{children}</div>
		</BaseCombobox.Item>
	);
}

export type ComboboxEmptyProps = StyledProps<BaseCombobox.Empty.Props>;

export function Empty({ ref, className, style, ...props }: ComboboxEmptyProps) {
	const sx = stylex.props(comboboxParts.empty, style);

	return (
		<BaseCombobox.Empty
			ref={ref}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}
		/>
	);
}

export const Combobox = {
	Root,
	Label,
	InputGroup,
	Input,
	Value,
	Chips,
	Chip,
	ChipRemove,
	ChipOverflow,
	Popup,
	List,
	Item,
	Empty,
} as const;
