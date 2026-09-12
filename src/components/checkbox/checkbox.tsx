import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { CheckboxGroup as BaseCheckboxGroup } from "@base-ui/react/checkbox-group";
import { Field } from "@base-ui/react/field";
import { Fieldset } from "@base-ui/react/fieldset";
import * as stylex from "@stylexjs/stylex";
import {
	createContext,
	useContext,
	useId,
	useMemo,
	type ComponentProps,
	type ReactNode,
} from "react";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { extractMarginProps, type MarginProps } from "@/styles/props/spacing.stylex";
import { focusRing } from "@/styles/recipes/focus";
import { pressable } from "@/styles/recipes/transitions";
import { attrJoin } from "@/utils/attr-join";
import { Icon } from "@/components/icons";
import { checkboxControlSizeStyles, checkboxStyles, type CheckboxSize } from "./checkbox.stylex";

export type { CheckboxSize } from "./checkbox.stylex";

export type CheckboxProps = Omit<
	ComponentProps<typeof BaseCheckbox.Root>,
	"children" | "className" | "color" | "style" | keyof MarginProps
> &
	MarginProps &
	BaseStyleProps & {
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
	size?: CheckboxSize;
}>({ disabled: false });

export function Checkbox({ className, style, xstyle, size, ...props }: CheckboxProps) {
	const { marginStyles, rest } = extractMarginProps(props);
	const groupContext = useContext(CheckboxGroupFieldContext);
	const resolvedSize = size ?? groupContext.size ?? "md";
	const sx = stylex.props(
		checkboxStyles.control,
		checkboxControlSizeStyles[resolvedSize],
		focusRing.offset,
		pressable.transition,
		marginStyles,
		xstyle,
	);

	return (
		<BaseCheckbox.Root
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
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
		() => ({ disabled: isDisabled, size: resolvedSize }),
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
				<div
					{...stylex.props(
						checkboxStyles.groupOptions,
						inline && checkboxStyles.groupOptionsInline,
					)}
				>
					{children}
				</div>
			</CheckboxGroupFieldContext.Provider>
		</Field.Root>
	);
}
