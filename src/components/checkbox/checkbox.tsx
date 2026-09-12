import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { CheckboxGroup as BaseCheckboxGroup } from "@base-ui/react/checkbox-group";
import * as stylex from "@stylexjs/stylex";
import { createContext, useContext, useMemo, type ComponentProps } from "react";
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
	ComponentProps<typeof BaseCheckboxGroup>,
	"className" | "color" | "style" | keyof MarginProps
> &
	MarginProps &
	BaseStyleProps & {
		size?: CheckboxSize;
		className?: string;
	};

const CheckboxGroupContext = createContext<{
	disabled: boolean;
	size?: CheckboxSize;
}>({ disabled: false });

export function Checkbox({ className, style, xstyle, size, ...props }: CheckboxProps) {
	const { marginStyles, rest } = extractMarginProps(props);
	const groupContext = useContext(CheckboxGroupContext);
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
	children,
	className,
	style,
	xstyle,
	disabled,
	size,
	...props
}: CheckboxGroupProps) {
	const { marginStyles, rest } = extractMarginProps(props);
	const parentGroup = useContext(CheckboxGroupContext);
	const isDisabled = Boolean(disabled || parentGroup.disabled);
	const resolvedSize = size ?? parentGroup.size ?? "md";
	const groupValue = useMemo(
		() => ({ disabled: isDisabled, size: resolvedSize }),
		[isDisabled, resolvedSize],
	);
	const sx = stylex.props(marginStyles, xstyle);

	return (
		<CheckboxGroupContext.Provider value={groupValue}>
			<BaseCheckboxGroup
				disabled={isDisabled}
				className={attrJoin(sx.className, className)}
				style={mergeStyle(sx.style, style)}
				{...rest}
			>
				{children}
			</BaseCheckboxGroup>
		</CheckboxGroupContext.Provider>
	);
}
