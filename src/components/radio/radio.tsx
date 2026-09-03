import { Radio as BaseRadio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import { Field } from "@base-ui/react/field";
import { Fieldset } from "@base-ui/react/fieldset";
import * as stylex from "@stylexjs/stylex";
import { createContext, useContext, useId, useMemo, type ReactNode } from "react";
import { focusRing } from "@/styles/recipes/focus";
import { pressable } from "@/styles/recipes/transitions";
import { attrJoin } from "@/utils/attr-join";
import { VisuallyHidden } from "@/components/visually-hidden/visually-hidden";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { extractMarginProps, type MarginProps } from "@/styles/props/spacing.stylex";
import {
	radioControlSizeStyles,
	radioDescriptionStyles,
	radioIndicatorSizeStyles,
	radioLabelStyles,
	radioStyles,
	type RadioSize,
} from "./radio.stylex";

export type { RadioSize } from "./radio.stylex";

export type RadioProps = Omit<
	BaseRadio.Root.Props,
	"children" | "className" | "color" | "style" | keyof MarginProps
> &
	MarginProps &
	BaseStyleProps & {
		label: ReactNode;
		description?: ReactNode;
		/** Hides the label visually while keeping it available to assistive tech. */
		visuallyHideLabel?: boolean;
		size?: RadioSize;
		className?: string;
	};

export type RadioGroupProps = Omit<
	BaseRadioGroup.Props,
	"className" | "color" | "style" | keyof MarginProps
> &
	MarginProps &
	BaseStyleProps & {
		label: ReactNode;
		description?: ReactNode;
		/** Displays the group items in a horizontal row that wraps when needed. */
		inline?: boolean;
		size?: RadioSize;
		className?: string;
	};

const RadioGroupStateContext = createContext<{
	disabled: boolean;
	readOnly: boolean;
	size?: RadioSize;
}>({ disabled: false, readOnly: false });

export function Radio({
	ref,
	label,
	description,
	visuallyHideLabel = false,
	className,
	style,
	xstyle,
	disabled,
	required,
	size,
	id: providedId,
	"aria-describedby": ariaDescribedBy,
	...props
}: RadioProps) {
	const { marginStyles, rest } = extractMarginProps(props);
	const groupState = useContext(RadioGroupStateContext);
	const selfOrGroupDisabled = Boolean(disabled || groupState.disabled);
	const selfOrGroupReadOnly = Boolean(rest.readOnly || groupState.readOnly);
	const resolvedSize = size ?? groupState.size ?? "md";
	const generatedId = useId();
	const id = providedId ?? `${generatedId}-control`;
	const descriptionId = description ? `${generatedId}-description` : undefined;
	const itemSx = stylex.props(radioStyles.item, marginStyles, xstyle);
	const itemClassName = attrJoin(itemSx.className, className);
	const itemStyle = mergeStyle(itemSx.style, style);
	const labelContent = (
		<>
			{label}
			{required ? (
				<span aria-hidden {...stylex.props(radioStyles.requiredIndicator)}>
					*
				</span>
			) : null}
		</>
	);

	return (
		<Field.Item
			data-readonly={selfOrGroupReadOnly ? "" : undefined}
			disabled={selfOrGroupDisabled}
			className={itemClassName}
			style={itemStyle}
		>
			<Field.Label
				htmlFor={id}
				data-disabled={selfOrGroupDisabled ? "" : undefined}
				data-readonly={selfOrGroupReadOnly ? "" : undefined}
				{...stylex.props(radioStyles.labelRoot)}
			>
				<BaseRadio.Root
					ref={ref}
					id={id}
					required={required}
					aria-describedby={attrJoin(ariaDescribedBy, descriptionId) || undefined}
					{...stylex.props(
						radioStyles.control,
						radioControlSizeStyles[resolvedSize],
						focusRing.offset,
						pressable.transition,
					)}
					{...rest}
				>
					<BaseRadio.Indicator
						{...stylex.props(
							radioStyles.indicator,
							radioIndicatorSizeStyles[resolvedSize],
							radioStyles.indicatorTransition,
						)}
					/>
				</BaseRadio.Root>
				{visuallyHideLabel ? (
					<VisuallyHidden>{labelContent}</VisuallyHidden>
				) : (
					<span {...stylex.props(radioLabelStyles[resolvedSize])}>{labelContent}</span>
				)}
			</Field.Label>
			{/* Place description outside of the label so ariaDescribedBy doesn't read twice */}
			{description ? (
				<Field.Description
					id={descriptionId}
					{...stylex.props(radioStyles.description, radioDescriptionStyles[resolvedSize])}
				>
					{description}
				</Field.Description>
			) : null}
		</Field.Item>
	);
}

export function RadioGroup({
	ref,
	label,
	description,
	children,
	className,
	style,
	xstyle,
	disabled,
	inline = false,
	readOnly,
	required,
	size = "md",
	"aria-describedby": ariaDescribedBy,
	name,
	...props
}: RadioGroupProps) {
	const { marginStyles, rest } = extractMarginProps(props);
	const generatedId = useId();
	const descriptionId = description ? `${generatedId}-description` : undefined;
	const groupSx = stylex.props(radioStyles.fieldset, marginStyles, xstyle);
	const groupValue = useMemo(
		() => ({ disabled: Boolean(disabled), readOnly: Boolean(readOnly), size }),
		[disabled, readOnly, size],
	);

	return (
		<Field.Root
			name={name}
			render={
				<Fieldset.Root
					render={
						<BaseRadioGroup
							ref={ref}
							name={name}
							disabled={disabled}
							readOnly={readOnly}
							required={required}
							aria-describedby={attrJoin(ariaDescribedBy, descriptionId) || undefined}
							{...rest}
						/>
					}
				/>
			}
			className={attrJoin(groupSx.className, className)}
			style={mergeStyle(groupSx.style, style)}
		>
			<div {...stylex.props(radioStyles.title)}>
				<Fieldset.Legend {...stylex.props(radioStyles.groupLabel)}>
					{label}
					{required ? (
						<span aria-hidden {...stylex.props(radioStyles.requiredIndicator)}>
							*
						</span>
					) : null}
				</Fieldset.Legend>
				{description ? (
					<p id={descriptionId} {...stylex.props(radioStyles.groupDescription)}>
						{description}
					</p>
				) : null}
			</div>
			<RadioGroupStateContext.Provider value={groupValue}>
				<div {...stylex.props(radioStyles.groupOptions, inline && radioStyles.groupOptionsInline)}>
					{children}
				</div>
			</RadioGroupStateContext.Provider>
		</Field.Root>
	);
}
