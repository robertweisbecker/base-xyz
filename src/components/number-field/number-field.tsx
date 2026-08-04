import { Field } from "@base-ui/react/field";
import { NumberField as BaseNumberField } from "@base-ui/react/number-field";
import { ArrowsLeftRightIcon } from "@phosphor-icons/react/dist/csr/ArrowsLeftRight";
import { MinusIcon } from "@phosphor-icons/react/dist/csr/Minus";
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useId, type CSSProperties } from "react";
import { resolveThemeProps } from "@/theme/theme-props";
import type { FieldSize, FieldThemeProps } from "@/components/field/field.types";
import { fieldStyles, fieldTextStyles, fieldThemeProps } from "@/components/field/field.stylex";
import { focusRing } from "@/styles/recipes/focus";
import { pressable } from "@/styles/recipes/transitions";
import { tokens } from "@/theme/tokens.stylex";
import { WarningOctagonIcon } from "@phosphor-icons/react";

const STEPPER_HOVER = ":hover:not([data-disabled]):not([data-readonly]):not(:active)";
const STEPPER_ACTIVE = ":active:not([data-disabled]):not([data-readonly])";
const INPUT_HOVER =
	':hover:not(:focus-visible):not([aria-invalid="true"]):not([data-disabled]):not([data-invalid]):not([data-readonly]):not([readonly])';

export type NumberFieldProps = Omit<
	BaseNumberField.Root.Props,
	"children" | "className" | "color" | "id" | "style" | keyof FieldThemeProps
> &
	FieldThemeProps & {
		label: string;
		description?: string;
		error?: string;
		className?: string;
		/** StyleX overrides, applied after the component's own styles. */
		style?: StyleXStyles;
		id?: string;
		/**
		 * Width of the nested input. Use `"fill"` to occupy the available inline
		 * space, or provide any CSS width such as `"10ch"`, `"80px"`, or `240`.
		 * @default "5ch"
		 */
		inputWidth?: NumberFieldInputWidth;
		decrementLabel?: string;
		incrementLabel?: string;
		size?: FieldSize;
	};

export type NumberFieldInputWidth = CSSProperties["width"] | "fill";

export function NumberField({
	label,
	description,
	error,
	className,
	style,
	id: providedId,
	decrementLabel = "Decrease value",
	incrementLabel = "Increase value",
	disabled,
	name,
	readOnly,
	required,
	size: fieldSize = "md",
	inputWidth = "5ch",
	...props
}: NumberFieldProps) {
	const { restProps, styles } = resolveThemeProps(props, fieldThemeProps);
	const generatedId = useId();
	const id = providedId ?? generatedId;
	const descriptionId = description ? `${id}-description` : undefined;
	const errorId = error ? `${id}-error` : undefined;
	const rootSx = stylex.props(fieldStyles.root, numberFieldParts.root, ...styles, style);

	return (
		<Field.Root
			className={[rootSx.className, className].filter(Boolean).join(" ")}
			style={rootSx.style}
			disabled={disabled}
			invalid={Boolean(error)}
			name={name}
			render={
				<BaseNumberField.Root id={id} disabled={disabled} readOnly={readOnly} required={required} {...restProps} />
			}>
			<BaseNumberField.ScrubArea {...stylex.props(numberFieldParts.scrubArea)}>
				<Field.Label htmlFor={id} {...stylex.props(fieldStyles.label, numberFieldParts.label)}>
					{label}
					{required ? (
						<span aria-hidden {...stylex.props(fieldStyles.requiredIndicator)}>
							*
						</span>
					) : null}
				</Field.Label>
				<BaseNumberField.ScrubAreaCursor {...stylex.props(numberFieldParts.scrubCursor)}>
					<ArrowsLeftRightIcon aria-hidden size={14} weight="bold" />
				</BaseNumberField.ScrubAreaCursor>
			</BaseNumberField.ScrubArea>
			<BaseNumberField.Group {...stylex.props(numberFieldParts.group, numberFieldGroupSizes[fieldSize])}>
				<BaseNumberField.Decrement
					aria-label={decrementLabel}
					{...stylex.props(
						numberFieldParts.stepper,
						numberFieldStepperSizes[fieldSize],
						numberFieldDecrementRadii[fieldSize],
						numberFieldParts.decrement,
						pressable.transition,
					)}>
					<MinusIcon aria-hidden size={12} weight="bold" />
				</BaseNumberField.Decrement>
				<BaseNumberField.Input
					aria-describedby={[descriptionId, errorId].filter(Boolean).join(" ") || undefined}
					aria-invalid={Boolean(error)}
					{...stylex.props(
						fieldStyles.inputUnstyled,
						fieldStyles.inputStandard,
						fieldTextStyles[fieldSize],
						numberFieldParts.input,
						numberFieldInputPaddingSizes[fieldSize],
						focusRing.inset,
					)}
					style={{ width: inputWidth === "fill" ? "100%" : inputWidth }}
				/>
				<BaseNumberField.Increment
					aria-label={incrementLabel}
					{...stylex.props(
						numberFieldParts.stepper,
						numberFieldStepperSizes[fieldSize],
						numberFieldIncrementRadii[fieldSize],
						numberFieldParts.increment,
						pressable.transition,
					)}>
					<PlusIcon aria-hidden size={12} weight="bold" />
				</BaseNumberField.Increment>
			</BaseNumberField.Group>
			{description ? (
				<Field.Description id={descriptionId} {...stylex.props(fieldStyles.description)}>
					{description}
				</Field.Description>
			) : null}
			{error ? (
				<Field.Error id={errorId} match {...stylex.props(fieldStyles.error)}>
					<WarningOctagonIcon aria-hidden size={"1em"} weight="duotone" />
					{error}
				</Field.Error>
			) : null}
		</Field.Root>
	);
}

const numberFieldParts = stylex.create({
	root: {
		gap: tokens["--space-1"],
		display: "flex",
		flexDirection: "column",
		minWidth: 0,
	},
	scrubArea: {
		alignSelf: "flex-start",
		cursor: {
			"[data-disabled]": "not-allowed",
			"[data-readonly]": "default",
			default: "ew-resize",
		},
		userSelect: "none",
	},
	label: {
		cursor: "inherit",
	},
	scrubCursor: {
		borderRadius: tokens["--radius-full"],
		paddingBlock: tokens["--space-1"],
		paddingInline: tokens["--space-2"],
		alignItems: "center",
		backgroundColor: tokens["--bg-inverse"],
		boxShadow: tokens["--shadow-sm"],
		color: tokens["--fg-inverse"],
		display: "flex",
		justifyContent: "center",
	},
	group: {
		alignItems: "stretch",
		display: "flex",
		flexDirection: "row",
		isolation: "isolate",
		minHeight: 0,
		width: "fit-content",
	},
	input: {
		borderColor: {
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[INPUT_HOVER]: {
				"@media (hover: hover) and (pointer: fine)": tokens["--border-input-hover"],
			},
			'[aria-invalid="true"]': tokens["--bg-error-primary"],
			"[data-readonly]": `${tokens["--border"]} transparent ${tokens["--border"]}`,
			"[readonly]": `${tokens["--border"]} transparent ${tokens["--border"]}`,
			default: tokens["--border-input"],
			":focus-visible": tokens["--focus"],
			':focus-visible[aria-invalid="true"]': tokens["--bg-error-primary"],
		},
		borderRadius: 0,
		borderStyle: "solid",
		borderWidth: "1px",
		marginInline: "-1px",
		outline: "0",
		paddingBlock: 0,
		appearance: "textfield",
		backgroundColor: {
			"[data-disabled]": tokens["--surface-subtle"],
			"[data-readonly]": "transparent",
			default: tokens["--surface"],
		},
		fontFamily: "inherit",
		fontVariantNumeric: "tabular-nums",
		textAlign: "center",
		zIndex: 1,
		height: "100%",
		minWidth: "6ch",
		"::-webkit-inner-spin-button": {
			appearance: "none",
		},
		"::-webkit-outer-spin-button": {
			appearance: "none",
		},
	},
	stepper: {
		padding: 0,
		borderColor: tokens["--border-input"],
		borderStyle: "solid",
		borderWidth: "1px",
		outline: "0",
		alignItems: "center",
		backgroundColor: {
			[STEPPER_ACTIVE]: tokens["--surface-subtle-active"],
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[STEPPER_HOVER]: {
				"@media (hover: hover) and (pointer: fine)": tokens["--surface-subtle-hover"],
			},
			"[data-disabled]": tokens["--bg-canvas"],
			default: "transparent",
		},
		color: {
			"[data-disabled]": `color-mix(in srgb, ${tokens["--fg-subtle"]} 48%, transparent)`,
			"[data-readonly]": `color-mix(in srgb, ${tokens["--fg-subtle"]} 48%, transparent)`,
			default: tokens["--fg-muted"],
			":hover": {
				"@media (hover: hover) and (pointer: fine)": tokens["--fg"],
			},
		},
		cursor: {
			"[data-disabled]": "not-allowed",
			default: "default",
		},
		display: "flex",
		justifyContent: "center",
		userSelect: "none",
		zIndex: -1,
	},
	decrement: {
		borderRightWidth: 0,
	},
	increment: {
		borderLeftWidth: 0,
	},
});

const numberFieldGroupSizes = stylex.create({
	sm: {
		height: tokens["--size-control-sm"],
	},
	md: {
		height: tokens["--size-control-md"],
	},
	lg: {
		height: tokens["--size-control-lg"],
	},
});

const numberFieldStepperSizes = stylex.create({
	sm: {
		minWidth: tokens["--size-control-sm"],
	},
	md: {
		minWidth: tokens["--size-control-md"],
	},
	lg: {
		minWidth: tokens["--size-control-lg"],
	},
});

const numberFieldInputPaddingSizes = stylex.create({
	sm: {
		paddingInline: tokens["--space-3"],
	},
	md: {
		paddingInline: tokens["--space-3"],
	},
	lg: {
		paddingInline: tokens["--space-5"],
	},
});

const numberFieldDecrementRadii = stylex.create({
	sm: {
		borderEndStartRadius: tokens["--radius-sm"],
		borderStartStartRadius: tokens["--radius-sm"],
	},
	md: {
		borderEndStartRadius: tokens["--radius-md"],
		borderStartStartRadius: tokens["--radius-md"],
	},
	lg: {
		borderEndStartRadius: tokens["--radius-lg"],
		borderStartStartRadius: tokens["--radius-lg"],
	},
});

const numberFieldIncrementRadii = stylex.create({
	sm: {
		borderEndEndRadius: tokens["--radius-sm"],
		borderStartEndRadius: tokens["--radius-sm"],
	},
	md: {
		borderEndEndRadius: tokens["--radius-md"],
		borderStartEndRadius: tokens["--radius-md"],
	},
	lg: {
		borderEndEndRadius: tokens["--radius-lg"],
		borderStartEndRadius: tokens["--radius-lg"],
	},
});
