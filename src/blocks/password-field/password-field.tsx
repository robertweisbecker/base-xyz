import { Field } from "@base-ui/react/field";
import { EyeIcon } from "@phosphor-icons/react/dist/csr/Eye";
import { EyeClosedIcon } from "@phosphor-icons/react/dist/csr/EyeClosed";
import * as stylex from "@stylexjs/stylex";
import {
	createContext,
	type ComponentProps,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";
import { fieldStyles } from "@/components/field/field.stylex";
import { InputGroup, Meter as MeterPrimitive, Toggle } from "@/components";
import type { ToggleIconButtonProps } from "@/components";
import { iconSwapTransition } from "@/styles/recipes/transitions";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { tokens } from "@/theme/tokens.stylex";
import { attrJoin } from "@/utils/attr-join";

type StyledProps<T> = Omit<T, "className" | "style" | "xstyle"> &
	BaseStyleProps & {
		className?: string;
	};

type PasswordFieldContextValue = {
	value: string;
	visible: boolean;
	setValue: (value: string) => void;
	setVisible: (visible: boolean) => void;
};

const PasswordFieldContext = createContext<PasswordFieldContextValue | null>(null);

export type PasswordFieldRootProps = StyledProps<Field.Root.Props> & {
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	visible?: boolean;
	defaultVisible?: boolean;
	onVisibleChange?: (visible: boolean) => void;
};
export type PasswordFieldLabelProps = StyledProps<Field.Label.Props>;
export type PasswordFieldControlProps = ComponentProps<typeof InputGroup.Root>;
export type PasswordFieldInputProps = Omit<
	ComponentProps<typeof InputGroup.Input>,
	"defaultValue" | "type" | "value"
>;
export type PasswordFieldActionsProps = ComponentProps<typeof InputGroup.Actions>;
export type PasswordFieldVisibilityToggleProps = Omit<
	ToggleIconButtonProps,
	"icon" | "label" | "pressed" | "onPressedChange"
> & {
	icon?: ToggleIconButtonProps["icon"];
	label?: string;
};
export type PasswordFieldDescriptionProps = StyledProps<Field.Description.Props>;
export type PasswordFieldErrorProps = StyledProps<Field.Error.Props>;
export type PasswordFieldMeterProps = Omit<
	ComponentProps<typeof MeterPrimitive.Root>,
	"children" | "color" | "max" | "min" | "value"
> & {
	requirements: readonly [RegExp, ...RegExp[]];
	label?: string;
	getStrengthLabel?: (score: number, maximum: number) => string;
};

export function Root({
	value,
	defaultValue = "",
	onValueChange,
	visible,
	defaultVisible = false,
	onVisibleChange,
	className,
	style,
	xstyle,
	...props
}: PasswordFieldRootProps) {
	const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
	const [uncontrolledVisible, setUncontrolledVisible] = useState(defaultVisible);
	const isValueControlled = value !== undefined;
	const currentValue = isValueControlled ? value : uncontrolledValue;
	const isControlled = visible !== undefined;
	const currentVisible = isControlled ? visible : uncontrolledVisible;

	const setValue = useCallback(
		(nextValue: string) => {
			if (!isValueControlled) {
				setUncontrolledValue(nextValue);
			}
			onValueChange?.(nextValue);
		},
		[isValueControlled, onValueChange],
	);

	const setVisible = useCallback(
		(nextVisible: boolean) => {
			if (!isControlled) {
				setUncontrolledVisible(nextVisible);
			}
			onVisibleChange?.(nextVisible);
		},
		[isControlled, onVisibleChange],
	);

	const contextValue = useMemo(
		() => ({ value: currentValue, visible: currentVisible, setValue, setVisible }),
		[currentValue, currentVisible, setValue, setVisible],
	);

	const rootSx = stylex.props(fieldStyles.root, xstyle);

	return (
		<PasswordFieldContext.Provider value={contextValue}>
			<Field.Root
				className={attrJoin(rootSx.className, className)}
				style={mergeStyle(rootSx.style, style)}
				{...props}
			/>
		</PasswordFieldContext.Provider>
	);
}

export function Label({ className, style, xstyle, ...props }: PasswordFieldLabelProps) {
	const sx = stylex.props(fieldStyles.label, xstyle);
	return (
		<Field.Label
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...props}
		/>
	);
}

export function Control({ className, ...props }: PasswordFieldControlProps) {
	return <InputGroup.Root className={className} {...props} />;
}

export function Input({ onChange, ...props }: PasswordFieldInputProps) {
	const { value, visible, setValue } = usePasswordFieldContext("Input");

	return (
		<InputGroup.Input
			autoCapitalize="none"
			onChange={(event) => {
				onChange?.(event);
				if (!event.defaultPrevented) {
					setValue(event.currentTarget.value);
				}
			}}
			spellCheck={false}
			type={visible ? "text" : "password"}
			value={value}
			{...props}
		/>
	);
}

export const Actions = InputGroup.Actions;

export function VisibilityToggle({
	icon,
	label,
	shape = "square",
	size = "xs",
	variant = "plain",
	...props
}: PasswordFieldVisibilityToggleProps) {
	const { visible, setVisible } = usePasswordFieldContext("VisibilityToggle");

	return (
		<Toggle
			{...props}
			icon={
				icon ?? (
					<span aria-hidden {...stylex.props(iconSwapTransition.slot)}>
						<EyeClosedIcon
							aria-hidden
							{...stylex.props(
								iconSwapTransition.icon,
								visible ? iconSwapTransition.hidden : iconSwapTransition.visible,
							)}
						/>

						<EyeIcon
							aria-hidden
							{...stylex.props(
								iconSwapTransition.icon,
								iconSwapTransition.to,
								visible ? iconSwapTransition.visible : iconSwapTransition.hidden,
							)}
						/>
					</span>
				)
			}
			label={label ?? (visible ? "Hide password" : "Show password")}
			pressed={visible}
			onPressedChange={setVisible}
			shape={shape}
			size={size}
			variant={variant}
		/>
	);
}

export function Description({ className, style, xstyle, ...props }: PasswordFieldDescriptionProps) {
	const sx = stylex.props(fieldStyles.description, xstyle);
	return (
		<Field.Description
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...props}
		/>
	);
}

export function Error({
	className,
	match = true,
	style,
	xstyle,
	...props
}: PasswordFieldErrorProps) {
	const sx = stylex.props(fieldStyles.error, xstyle);
	return (
		<Field.Error
			className={attrJoin(sx.className, className)}
			match={match}
			style={mergeStyle(sx.style, style)}
			{...props}
		/>
	);
}

export function Meter({
	requirements,
	label = "Strength",
	getStrengthLabel = getDefaultStrengthLabel,
	"aria-valuetext": ariaValueText,
	style,
	xstyle,
	...props
}: PasswordFieldMeterProps) {
	const { value } = usePasswordFieldContext("Meter");
	const score = requirements.reduce(
		(total, requirement) => total + Number(testRequirement(requirement, value)),
		0,
	);
	const maximum = requirements.length;
	const strengthLabel = getStrengthLabel(score, maximum);
	const tone =
		score === 0
			? "neutral"
			: score === maximum
				? "strong"
				: score <= maximum / 2
					? "weak"
					: "medium";

	return (
		<MeterPrimitive.Root
			aria-valuetext={ariaValueText ?? strengthLabel}
			color={meterToneColors[tone]}
			max={maximum}
			min={0}
			value={score}
			{...props}
			style={style}
			xstyle={[parts.meter, xstyle]}
		>
			<MeterPrimitive.Track>
				<MeterPrimitive.Indicator />
			</MeterPrimitive.Track>
			<MeterPrimitive.Label>{label}</MeterPrimitive.Label>
			<MeterPrimitive.Value>{() => strengthLabel}</MeterPrimitive.Value>
		</MeterPrimitive.Root>
	);
}

function testRequirement(requirement: RegExp, value: string) {
	return new RegExp(requirement.source, requirement.flags).test(value);
}

function getDefaultStrengthLabel(score: number, maximum: number) {
	if (score === 0) return "";
	if (score === maximum) return "Strong";
	if (score <= maximum / 2) return "Weak";
	return "Medium";
}

function usePasswordFieldContext(part: string) {
	const context = useContext(PasswordFieldContext);
	if (!context) {
		throw new globalThis.Error(`PasswordField.${part} must be used inside PasswordField.Root.`);
	}
	return context;
}

const meterToneColors = {
	neutral: tokens["--fill-neutral"],
	weak: tokens["--fill-error"],
	medium: tokens["--fill-warning"],
	strong: tokens["--fill-success"],
} as const;

const parts = stylex.create({
	meter: {
		marginBlockStart: tokens["--space-2"],
	},
});

export const PasswordField = {
	Root,
	Label,
	Control,
	Input,
	Actions,
	VisibilityToggle,
	Description,
	Error,
	Meter,
} as const;
