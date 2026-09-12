import { Radio as BaseRadio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import * as stylex from "@stylexjs/stylex";
import { createContext, useContext, type ComponentProps } from "react";
import { focusRing } from "@/styles/recipes/focus";
import { pressable } from "@/styles/recipes/transitions";
import { attrJoin } from "@/utils/attr-join";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { extractMarginProps, type MarginProps } from "@/styles/props/spacing.stylex";
import {
	radioControlSizeStyles,
	radioIndicatorSizeStyles,
	radioStyles,
	type RadioSize,
} from "./radio.stylex";

export type { RadioSize } from "./radio.stylex";

export type RadioProps = Omit<
	ComponentProps<typeof BaseRadio.Root>,
	"children" | "className" | "color" | "style" | keyof MarginProps
> &
	MarginProps &
	BaseStyleProps & {
		size?: RadioSize;
		className?: string;
	};

export type RadioGroupProps<Value = unknown> = Omit<
	ComponentProps<typeof BaseRadioGroup<Value>>,
	"className" | "color" | "style" | keyof MarginProps
> &
	MarginProps &
	BaseStyleProps & {
		size?: RadioSize;
		className?: string;
	};

const RadioGroupSizeContext = createContext<RadioSize>("md");

export function Radio({ className, style, xstyle, size, ...props }: RadioProps) {
	const { marginStyles, rest } = extractMarginProps(props);
	const groupSize = useContext(RadioGroupSizeContext);
	const resolvedSize = size ?? groupSize;
	const sx = stylex.props(
		radioStyles.control,
		radioControlSizeStyles[resolvedSize],
		focusRing.offset,
		pressable.transition,
		marginStyles,
		xstyle,
	);

	return (
		<BaseRadio.Root
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
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
	);
}

export function RadioGroup<Value = unknown>({
	children,
	className,
	style,
	xstyle,
	size = "md",
	...props
}: RadioGroupProps<Value>) {
	const { marginStyles, rest } = extractMarginProps(props);
	const sx = stylex.props(marginStyles, xstyle);

	return (
		<RadioGroupSizeContext.Provider value={size}>
			<BaseRadioGroup<Value>
				className={attrJoin(sx.className, className)}
				style={mergeStyle(sx.style, style)}
				{...rest}
			>
				{children}
			</BaseRadioGroup>
		</RadioGroupSizeContext.Provider>
	);
}
