import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { Field } from "@base-ui/react/field";
import { CaretDownIcon } from "@phosphor-icons/react/dist/csr/CaretDown";
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import { XCircleIcon } from "@phosphor-icons/react/dist/csr/XCircle";
import { XIcon } from "@phosphor-icons/react/dist/csr/X";
import * as stylex from "@stylexjs/stylex";
import { createContext, useContext, type ComponentProps, type ReactNode, type RefObject } from "react";
import { fieldControlSizes, fieldStyles, fieldTextStyles } from "@/components/field/field.stylex";
import type { FieldSize } from "@/components/field/field.types";
import { Icon } from "@/components/icons";
import { menuItemSizeStyles, menuItemStyles, menuItemVariantStyles } from "@/components/menu/menu-item.stylex";
import type { MenuItemVariant } from "@/components/menu/menu.types";
import { popupMotionStyles, popupPositionerStyles } from "@/components/popover/popover.stylex";
import { Tooltip } from "@/components/tooltip/tooltip";
import { focusRing } from "@/styles/recipes/focus";
import { pressable } from "@/styles/recipes/transitions";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { extractMarginProps, type MarginProps } from "@/styles/props/spacing.stylex";
import { attrJoin } from "@/utils/attr-join";
import {
	comboboxActionSizeVariants,
	comboboxGroupSizeVariants,
	comboboxInputSizeVariants,
	comboboxMarker,
	comboboxParts,
	inputGroupVariants,
	inputVariants,
} from "./combobox.stylex";

type StyledProps<T> = Omit<T, "className" | "style"> &
	BaseStyleProps & {
		className?: string;
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
	"className" | "color" | "size" | "style" | keyof MarginProps
> &
	MarginProps &
	BaseStyleProps & {
		className?: string;
		invalid?: boolean;
		size?: FieldSize;
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
	xstyle,
	...props
}: ComboboxRootProps<Value, Multiple>) {
	const { marginStyles, rest } = extractMarginProps(props);
	const sx = stylex.props(fieldStyles.root, marginStyles, xstyle);

	return (
		<Field.Root
			disabled={disabled}
			invalid={invalid}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}>
			<ComboboxContext.Provider value={{ multiple: multiple === true, readOnly, size }}>
				<BaseCombobox.Root disabled={disabled} multiple={multiple} readOnly={readOnly} {...rest}>
					{children}
				</BaseCombobox.Root>
			</ComboboxContext.Provider>
		</Field.Root>
	);
}

export type ComboboxLabelProps = StyledProps<Field.Label.Props>;

export function Label({ ref, className, style, xstyle, ...props }: ComboboxLabelProps) {
	const sx = stylex.props(fieldStyles.label, xstyle);

	return (
		<Field.Label
			ref={ref}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...props}
		/>
	);
}

export type ComboboxInputGroupVariant = "input" | "chips";

export type ComboboxInputGroupProps = StyledProps<BaseCombobox.InputGroup.Props> & {
	variant?: ComboboxInputGroupVariant;
};

export function InputGroup({
	ref,
	children,
	className,
	style,
	xstyle,
	variant = "input",
	...props
}: ComboboxInputGroupProps) {
	const { multiple, size } = useContext(ComboboxContext);
	const withChips = variant === "chips";
	const sx = stylex.props(
		fieldStyles.input,
		fieldTextStyles[size],
		comboboxParts.inputGroup,
		fieldControlSizes[size],
		comboboxGroupSizeVariants[size],
		focusRing.within,
		withChips && inputGroupVariants.withChips,
		multiple && inputGroupVariants.multiple,
		comboboxMarker,
		xstyle,
	);

	return (
		<ComboboxChipsContext.Provider value={withChips}>
			<BaseCombobox.InputGroup
				ref={ref}
				className={attrJoin(sx.className, className)}
				style={mergeStyle(sx.style, style)}
				{...props}>
				{children}
				<Actions />
			</BaseCombobox.InputGroup>
		</ComboboxChipsContext.Provider>
	);
}

export type ComboboxInputProps = StyledProps<BaseCombobox.Input.Props>;

export function Input({ ref, className, style, xstyle, ...props }: ComboboxInputProps) {
	const { readOnly, size } = useContext(ComboboxContext);
	const withinChips = useContext(ComboboxChipsContext);
	const sx = stylex.props(
		fieldStyles.inputUnstyled,
		fieldStyles.inputDefault,
		fieldTextStyles[size],
		comboboxParts.input,
		comboboxInputSizeVariants[size],
		withinChips && inputVariants.withChips,
		readOnly && comboboxParts.inputReadOnly,
		xstyle,
	);

	return (
		<BaseCombobox.Input
			ref={ref}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
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

function Clear({ ref, "aria-label": ariaLabel, children, className, style, xstyle, ...props }: ComboboxClearProps) {
	const { size } = useContext(ComboboxContext);
	const hasVisibleLabel = children != null;
	const sx = stylex.props(
		comboboxParts.action,
		hasVisibleLabel ? comboboxParts.textAction : comboboxActionSizeVariants[size],
		focusRing.offset,
		pressable.transition,
		xstyle,
	);

	return (
		<BaseCombobox.Clear
			ref={ref}
			aria-label={ariaLabel ?? (children == null ? "Clear selection" : undefined)}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...props}>
			{children ?? <XCircleIcon aria-hidden size="1.25em" weight="fill" />}
		</BaseCombobox.Clear>
	);
}

type ComboboxTriggerProps = StyledProps<BaseCombobox.Trigger.Props>;

function Trigger({ ref, "aria-label": ariaLabel, children, className, style, xstyle, ...props }: ComboboxTriggerProps) {
	const { size } = useContext(ComboboxContext);
	const sx = stylex.props(
		comboboxParts.action,
		comboboxActionSizeVariants[size],
		focusRing.offset,
		pressable.transition,
		xstyle,
	);

	return (
		<BaseCombobox.Trigger
			ref={ref}
			aria-label={ariaLabel ?? (children == null ? "Show options" : undefined)}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...props}>
			{children ?? <CaretDownIcon aria-hidden size="1em" weight="bold" />}
		</BaseCombobox.Trigger>
	);
}

export const Value = BaseCombobox.Value;

export type ComboboxChipsProps = StyledProps<BaseCombobox.Chips.Props>;

export function Chips({ ref, children, className, style, xstyle, ...props }: ComboboxChipsProps) {
	const sx = stylex.props(comboboxParts.chips, xstyle);

	return (
		<ComboboxChipsContext.Provider value>
			<BaseCombobox.Chips
				ref={ref}
				className={attrJoin(sx.className, className)}
				style={mergeStyle(sx.style, style)}
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

export function Chip({ children, className, endSlot, ref, startSlot, style, xstyle, ...props }: ComboboxChipProps) {
	const sx = stylex.props(comboboxParts.chip, comboboxMarker, xstyle);

	return (
		<BaseCombobox.Chip
			ref={ref}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
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
	xstyle,
	...props
}: ComboboxChipRemoveProps) {
	const sx = stylex.props(
		comboboxParts.action,
		comboboxParts.chipRemove,
		focusRing.offset,
		pressable.transition,
		xstyle,
	);

	return (
		<BaseCombobox.ChipRemove
			ref={ref}
			aria-label={ariaLabel ?? (children == null && ariaLabelledBy == null ? "Remove selection" : undefined)}
			aria-labelledby={ariaLabelledBy}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...props}>
			{children ?? <XIcon aria-hidden size={12} weight="bold" />}
		</BaseCombobox.ChipRemove>
	);
}

type TooltipTriggerProps = ComponentProps<typeof Tooltip.Trigger>;

export type ComboboxChipOverflowProps = Omit<TooltipTriggerProps, "children"> & {
	anchor: RefObject<Element | null>;
	children: ReactNode;
	label: ReactNode;
};

export function ChipOverflow({ anchor, children, label, xstyle, ...props }: ComboboxChipOverflowProps) {
	return (
		<Tooltip.Root>
			<Tooltip.Trigger xstyle={[comboboxParts.chipOverflow, xstyle]} {...props}>
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

export function Popup({
	ref,
	children,
	className,
	portalProps,
	positionerProps,
	style,
	xstyle,
	...props
}: ComboboxPopupProps) {
	const {
		align = "center",
		className: positionerClassName,
		side = "bottom",
		sideOffset = 6,
		style: positionerStyle,
		xstyle: positionerXstyle,
		...otherPositionerProps
	} = positionerProps ?? {};
	const sx = stylex.props(comboboxParts.panelSurface, comboboxParts.popup, popupMotionStyles.anchoredPopup, xstyle);
	const positionerSx = stylex.props(popupPositionerStyles, positionerXstyle);

	return (
		<BaseCombobox.Portal {...portalProps}>
			<BaseCombobox.Positioner
				align={align}
				side={side}
				sideOffset={sideOffset}
				className={attrJoin(positionerSx.className, positionerClassName)}
				style={mergeStyle(positionerSx.style, positionerStyle)}
				{...otherPositionerProps}>
				<BaseCombobox.Popup
					ref={ref}
					className={attrJoin(sx.className, className)}
					style={mergeStyle(sx.style, style)}
					{...props}>
					{children}
				</BaseCombobox.Popup>
			</BaseCombobox.Positioner>
		</BaseCombobox.Portal>
	);
}

export type ComboboxListProps = StyledProps<BaseCombobox.List.Props>;

export function List({ ref, className, style, xstyle, ...props }: ComboboxListProps) {
	const sx = stylex.props(comboboxParts.list, xstyle);

	return (
		<BaseCombobox.List
			ref={ref}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...props}
		/>
	);
}

export type ComboboxItemVariant = MenuItemVariant;

export type ComboboxItemProps = Omit<StyledProps<BaseCombobox.Item.Props>, "children"> & {
	children?: ReactNode;
	/** Shows a plus affordance in the shared indicator slot for a creatable item. */
	creatable?: boolean;
	variant?: ComboboxItemVariant;
};

export function Item({
	ref,
	children,
	className,
	creatable = false,
	style,
	xstyle,
	variant = "default",
	...props
}: ComboboxItemProps) {
	const { size } = useContext(ComboboxContext);
	const sx = stylex.props(
		menuItemStyles.item,
		menuItemSizeStyles[size],
		menuItemVariantStyles[variant],
		focusRing.inset,
		xstyle,
	);

	return (
		<BaseCombobox.Item
			ref={ref}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...props}>
			{creatable ? (
				<span aria-hidden {...stylex.props(menuItemStyles.indicator, comboboxParts.creatableIndicator)}>
					<PlusIcon aria-hidden size={16} weight="bold" />
				</span>
			) : (
				<BaseCombobox.ItemIndicator keepMounted {...stylex.props(menuItemStyles.indicator)}>
					<Icon.Checkmark width="1em" height="1em" strokeWidth={3} />
				</BaseCombobox.ItemIndicator>
			)}
			<div {...stylex.props(menuItemStyles.label)}>{children}</div>
		</BaseCombobox.Item>
	);
}

export type ComboboxEmptyProps = StyledProps<BaseCombobox.Empty.Props>;

export function Empty({ ref, className, style, xstyle, ...props }: ComboboxEmptyProps) {
	const sx = stylex.props(comboboxParts.empty, xstyle);

	return (
		<BaseCombobox.Empty
			ref={ref}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
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
