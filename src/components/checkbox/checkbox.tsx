import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { CheckboxGroup as BaseCheckboxGroup } from "@base-ui/react/checkbox-group";
import { Field } from "@base-ui/react/field";
import { Fieldset } from "@base-ui/react/fieldset";
import * as stylex from "@stylexjs/stylex";
import { createContext, useContext, useId, useMemo, type ReactNode } from "react";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { extractMarginProps, type MarginProps } from "@/styles/props/spacing.stylex";
import { focusRing } from "@/styles/recipes/focus";
import { pressable } from "@/styles/recipes/transitions";
import { VisuallyHidden } from "@/components/visually-hidden/visually-hidden";
import { attrJoin } from "@/utils/attr-join";
import { Icon } from "@/components/icons";
import {
	checkboxControlSizeStyles,
	checkboxDescriptionStyles,
	checkboxLabelStyles,
	checkboxStyles,
	type CheckboxSize,
} from "./checkbox.stylex";
import { choiceGroupStyles } from "../choice/choice.stylex";

export type { CheckboxSize } from "./checkbox.stylex";

export type CheckboxProps = Omit<
	BaseCheckbox.Root.Props,
	"children" | "className" | "color" | "style" | keyof MarginProps
> &
	MarginProps &
	BaseStyleProps & {
		label: ReactNode;
		description?: ReactNode;
		/** Hides the label visually while keeping it available to assistive tech. */
		visuallyHideLabel?: boolean;
		invalid?: boolean;
		size?: CheckboxSize;
		className?: string;
	};

export type CheckboxGroupProps = Omit<
	BaseCheckboxGroup.Props,
	"className" | "color" | "style" | keyof MarginProps
> &
	MarginProps &
	BaseStyleProps & {
		label?: ReactNode;
		description?: ReactNode;
		name?: string;
		/** Displays the group items in a horizontal row that wraps when needed. */
		inline?: boolean;
		size?: CheckboxSize;
		className?: string;
	};

const CheckboxGroupFieldContext = createContext<{
	disabled: boolean;
	inGroup: boolean;
	size?: CheckboxSize;
}>({ disabled: false, inGroup: false });

export function Checkbox({
	ref,
	label,
	description,
	visuallyHideLabel = false,
	className,
	style,
	xstyle,
	disabled,
	invalid,
	readOnly,
	required,
	size,
	id: providedId,
	"aria-describedby": ariaDescribedBy,
	...props
}: CheckboxProps) {
	const { marginStyles, rest } = extractMarginProps(props);
	const groupContext = useContext(CheckboxGroupFieldContext);
	const isDisabled = Boolean(disabled || groupContext.disabled);
	const resolvedSize = size ?? groupContext.size ?? "md";
	const generatedId = useId();
	const id = providedId ?? `${generatedId}-control`;
	const descriptionId = description ? `${generatedId}-description` : undefined;
	const labelContent = (
		<>
			{label}
			{required ? (
				<span aria-hidden {...stylex.props(checkboxStyles.requiredIndicator)}>
					*
				</span>
			) : null}
		</>
	);
	const content = (
		<>
			<Field.Label
				data-disabled={isDisabled ? "" : undefined}
				data-readonly={readOnly ? "" : undefined}
				{...stylex.props(checkboxStyles.labelRoot)}
			>
				<BaseCheckbox.Root
					ref={ref}
					id={id}
					disabled={isDisabled}
					readOnly={readOnly}
					required={required}
					aria-describedby={attrJoin(ariaDescribedBy, descriptionId) || undefined}
					aria-invalid={invalid || undefined}
					data-invalid={invalid ? "" : undefined}
					{...stylex.props(
						checkboxStyles.control,
						checkboxControlSizeStyles[resolvedSize],
						focusRing.offset,
						pressable.transition,
					)}
					{...rest}
				>
					<BaseCheckbox.Indicator
						{...stylex.props(checkboxStyles.indicator, checkboxStyles.indicatorTransition)}
						render={(indicatorProps, state) => (
							<span {...indicatorProps}>
								{state.indeterminate ? (
									<Icon.Minus width="100%" height="100%" strokeWidth={3} />
								) : (
									<Icon.Checkmark width="100%" height="100%" strokeWidth={3} />
								)}
							</span>
						)}
					/>
				</BaseCheckbox.Root>
				{visuallyHideLabel ? (
					<VisuallyHidden>{labelContent}</VisuallyHidden>
				) : (
					<span {...stylex.props(checkboxLabelStyles[resolvedSize])}>{labelContent}</span>
				)}
			</Field.Label>
			{description ? (
				<Field.Description
					id={descriptionId}
					{...stylex.props(checkboxStyles.description, checkboxDescriptionStyles[resolvedSize])}
				>
					{description}
				</Field.Description>
			) : null}
		</>
	);
	const containerSx = stylex.props(checkboxStyles.item, marginStyles, xstyle);
	const containerClassName = attrJoin(containerSx.className, className);
	const containerStyle = mergeStyle(containerSx.style, style);

	return groupContext.inGroup ? (
		<Field.Item
			disabled={isDisabled}
			data-invalid={invalid ? "" : undefined}
			data-readonly={readOnly ? "" : undefined}
			className={containerClassName}
			style={containerStyle}
		>
			{content}
		</Field.Item>
	) : (
		<Field.Root
			disabled={isDisabled}
			invalid={invalid}
			data-readonly={readOnly ? "" : undefined}
			className={containerClassName}
			style={containerStyle}
		>
			{content}
		</Field.Root>
	);
}

export function CheckboxGroup({
	ref,
	label,
	description,
	children,
	className,
	style,
	xstyle,
	disabled,
	inline = false,
	size,
	"aria-describedby": ariaDescribedBy,
	name,
	...props
}: CheckboxGroupProps) {
	const { marginStyles, rest } = extractMarginProps(props);
	const parentGroupContext = useContext(CheckboxGroupFieldContext);
	const isDisabled = Boolean(disabled || parentGroupContext.disabled);
	const resolvedSize = size ?? parentGroupContext.size ?? "md";
	const generatedId = useId();
	const descriptionId = description ? `${generatedId}-description` : undefined;
	const groupSx = stylex.props(checkboxStyles.group, marginStyles, xstyle);
	const groupValue = useMemo(
		() => ({ disabled: isDisabled, inGroup: true, size: resolvedSize }),
		[isDisabled, resolvedSize],
	);

	return (
		<Field.Root
			name={name}
			disabled={isDisabled}
			render={
				<Fieldset.Root
					disabled={isDisabled}
					render={
						<BaseCheckboxGroup
							ref={ref}
							disabled={isDisabled}
							aria-describedby={attrJoin(ariaDescribedBy, descriptionId) || undefined}
							{...rest}
						/>
					}
				/>
			}
			className={attrJoin(groupSx.className, className)}
			style={mergeStyle(groupSx.style, style)}
		>
			{label ? (
				<Fieldset.Legend {...stylex.props(checkboxStyles.groupLabel, checkboxStyles.legend)}>
					{label}
				</Fieldset.Legend>
			) : null}
			{description ? (
				<p id={descriptionId} {...stylex.props(checkboxStyles.groupDescription)}>
					{description}
				</p>
			) : null}
			<CheckboxGroupFieldContext.Provider value={groupValue}>
				<div {...stylex.props(choiceGroupStyles.root, inline && choiceGroupStyles.inline)}>
					{children}
				</div>
			</CheckboxGroupFieldContext.Provider>
		</Field.Root>
	);
}
