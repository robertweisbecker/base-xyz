import { Radio as BaseRadio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import { Field } from "@base-ui/react/field";
import { Fieldset } from "@base-ui/react/fieldset";
import * as stylex from "@stylexjs/stylex";
import { createContext, useContext, useId, type ComponentProps, type ReactNode } from "react";
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

	return (
		<Field.Root
			disabled={disabled}
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
			<RadioGroupSizeContext.Provider value={size}>
				<div {...stylex.props(radioStyles.groupOptions, inline && radioStyles.groupOptionsInline)}>
					{children}
				</div>
			</RadioGroupSizeContext.Provider>
		</Field.Root>
	);
}
