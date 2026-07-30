import { Field } from "@base-ui/react/field";
import { NumberField as BaseNumberField } from "@base-ui/react/number-field";
import { ArrowsLeftRightIcon } from "@phosphor-icons/react/dist/csr/ArrowsLeftRight";
import { MinusIcon } from "@phosphor-icons/react/dist/csr/Minus";
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useId, type CSSProperties } from "react";
import { fieldStyles, fieldTextStyles, type FieldSize } from "@/components/field/field.stylex";
import { focusRing } from "@/styles/recipes/focus";
import { pressable } from "@/styles/recipes/transitions";
import { color, radius, size, space, shadow } from "@/styles/tokens.stylex";
import { WarningOctagonIcon } from "@phosphor-icons/react";

const STEPPER_HOVER = ":hover:not([data-disabled]):not([data-readonly]):not(:active)";
const STEPPER_ACTIVE = ":active:not([data-disabled]):not([data-readonly])";
const INPUT_HOVER =
	':hover:not(:focus-visible):not([aria-invalid="true"]):not([data-disabled]):not([data-invalid]):not([data-readonly]):not([readonly])';

export type NumberFieldProps = Omit<BaseNumberField.Root.Props, "children" | "className" | "id" | "style"> & {
	label: string;
	description?: string;
	error?: string;
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
	id?: string;
	/**
	 * Width of the entire fieldStyles. Use `"fill"` to occupy the available inline
	 * space, or provide any CSS width such as `"10ch"`, `"80px"`, or `240`.
	 * @default "5ch"
	 */
	width?: NumberFieldWidth;
	decrementLabel?: string;
	incrementLabel?: string;
	size?: FieldSize;
};

export type NumberFieldWidth = CSSProperties["width"] | "fill";

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
	width = "5ch",
	...props
}: NumberFieldProps) {
	const generatedId = useId();
	const id = providedId ?? generatedId;
	const descriptionId = description ? `${id}-description` : undefined;
	const errorId = error ? `${id}-error` : undefined;
	const rootSx = stylex.props(fieldStyles.root, numberFieldParts.root, style);

	return (
		<Field.Root
			className={[rootSx.className, className].filter(Boolean).join(" ")}
			style={rootSx.style}
			disabled={disabled}
			invalid={Boolean(error)}
			name={name}
			render={<BaseNumberField.Root id={id} disabled={disabled} readOnly={readOnly} required={required} {...props} />}>
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
					style={{ width: width === "fill" ? "100%" : width }}
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
		gap: space.x1,
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
		borderRadius: radius.full,
		paddingBlock: space.x1,
		paddingInline: space.x2,
		alignItems: "center",
		backgroundColor: color.bgInverse,
		boxShadow: shadow.sm,
		color: color.fgInverse,
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
				"@media (hover: hover) and (pointer: fine)": color.borderHover,
			},
			'[aria-invalid="true"]': color.bgDanger,
			"[data-readonly]": `${color.border} transparent ${color.border}`,
			"[readonly]": `${color.border} transparent ${color.border}`,
			default: color.borderStrong,
			":focus-visible": color.focus,
			':focus-visible[aria-invalid="true"]': color.bgDanger,
		},
		borderRadius: 0,
		borderStyle: "solid",
		borderWidth: "1px",
		marginInline: "-1px",
		outline: "0",
		paddingBlock: 0,
		appearance: "textfield",
		backgroundColor: {
			"[data-disabled]": color.surfaceSubtle,
			"[data-readonly]": "transparent",
			default: color.surface,
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
		borderColor: color.borderStrong,
		borderStyle: "solid",
		borderWidth: "1px",
		outline: "0",
		alignItems: "center",
		backgroundColor: {
			[STEPPER_ACTIVE]: color.surfaceSubtleActive,
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[STEPPER_HOVER]: {
				"@media (hover: hover) and (pointer: fine)": color.surfaceSubtleHover,
			},
			"[data-disabled]": color.canvas,
			default: "transparent",
		},
		color: {
			"[data-disabled]": `color-mix(in srgb, ${color.fgSubtle} 48%, transparent)`,
			"[data-readonly]": `color-mix(in srgb, ${color.fgSubtle} 48%, transparent)`,
			default: color.fgMuted,
			":hover": {
				"@media (hover: hover) and (pointer: fine)": color.fg,
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
		height: size["control.sm"],
	},
	md: {
		height: size["control.md"],
	},
	lg: {
		height: size["control.lg"],
	},
});

const numberFieldStepperSizes = stylex.create({
	sm: {
		minWidth: size["control.sm"],
	},
	md: {
		minWidth: size["control.md"],
	},
	lg: {
		minWidth: size["control.lg"],
	},
});

const numberFieldInputPaddingSizes = stylex.create({
	sm: {
		paddingInline: space.x3,
	},
	md: {
		paddingInline: space.x3,
	},
	lg: {
		paddingInline: space.x5,
	},
});

const numberFieldDecrementRadii = stylex.create({
	sm: {
		borderEndStartRadius: radius.sm,
		borderStartStartRadius: radius.sm,
	},
	md: {
		borderEndStartRadius: radius.md,
		borderStartStartRadius: radius.md,
	},
	lg: {
		borderEndStartRadius: radius.lg,
		borderStartStartRadius: radius.lg,
	},
});

const numberFieldIncrementRadii = stylex.create({
	sm: {
		borderEndEndRadius: radius.sm,
		borderStartEndRadius: radius.sm,
	},
	md: {
		borderEndEndRadius: radius.md,
		borderStartEndRadius: radius.md,
	},
	lg: {
		borderEndEndRadius: radius.lg,
		borderStartEndRadius: radius.lg,
	},
});
