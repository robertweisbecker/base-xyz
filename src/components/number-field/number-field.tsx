import { Field } from "@base-ui/react/field";
import { NumberField as BaseNumberField } from "@base-ui/react/number-field";
import { ArrowsHorizontalIcon } from "@phosphor-icons/react/dist/csr/ArrowsHorizontal";
import { MinusIcon } from "@phosphor-icons/react/dist/csr/Minus";
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import * as stylex from "@stylexjs/stylex";
import { useId, type CSSProperties } from "react";
import { media } from "@/styles/constants.stylex";
import type { FieldSize } from "@/components/field/field.types";
import { fieldStyles, fieldTextStyles } from "@/components/field/field.stylex";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { extractMarginProps, type MarginProps } from "@/styles/props/spacing.stylex";
import { focusRing } from "@/styles/recipes/focus";
import { pressable } from "@/styles/recipes/transitions";
import { tokens } from "@/theme/tokens.stylex";
import { WarningOctagonIcon } from "@phosphor-icons/react";
import { attrJoin } from "@/utils/attr-join";

const STEPPER_HOVER = ":hover:not([data-disabled]):not([data-readonly]):not(:active)";
const STEPPER_ACTIVE = ":active:not([data-disabled]):not([data-readonly])";
const INPUT_HOVER =
	':hover:not(:focus-visible):not([aria-invalid="true"]):not([data-disabled]):not([data-invalid]):not([data-readonly]):not([readonly])';

export type NumberFieldProps = Omit<
	BaseNumberField.Root.Props,
	"children" | "className" | "color" | "id" | "style" | keyof MarginProps
> &
	MarginProps &
	BaseStyleProps & {
		label: string;
		description?: string;
		error?: string;
		className?: string;
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
	xstyle,
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
	const { marginStyles, rest } = extractMarginProps(props);
	const generatedId = useId();
	const id = providedId ?? generatedId;
	const descriptionId = description ? `${id}-description` : undefined;
	const errorId = error ? `${id}-error` : undefined;
	const rootSx = stylex.props(fieldStyles.root, numberFieldParts.root, marginStyles, xstyle);

	return (
		<Field.Root
			className={attrJoin(rootSx.className, className)}
			style={mergeStyle(rootSx.style, style)}
			disabled={disabled}
			invalid={Boolean(error)}
			name={name}
			render={
				<BaseNumberField.Root
					id={id}
					disabled={disabled}
					readOnly={readOnly}
					required={required}
					{...rest}
				/>
			}
		>
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
					<ArrowsHorizontalIcon
						aria-hidden
						size={24}
						weight="fill"
						strokeWidth={8}
						fill="black"
						stroke={"white"}
					/>
				</BaseNumberField.ScrubAreaCursor>
			</BaseNumberField.ScrubArea>
			<BaseNumberField.Group
				{...stylex.props(numberFieldParts.group, numberFieldGroupSizes[fieldSize])}
			>
				<BaseNumberField.Decrement
					aria-label={decrementLabel}
					{...stylex.props(
						numberFieldParts.stepper,
						numberFieldStepperSizes[fieldSize],
						numberFieldDecrementRadii.default,
						fieldSize === "sm" && numberFieldDecrementRadii.sm,
						numberFieldParts.decrement,
						pressable.transition,
					)}
				>
					<MinusIcon aria-hidden size={12} weight="bold" />
				</BaseNumberField.Decrement>
				<BaseNumberField.Input
					aria-describedby={attrJoin(descriptionId, errorId) || undefined}
					aria-invalid={Boolean(error)}
					{...stylex.props(
						fieldStyles.inputUnstyled,
						fieldStyles.inputDefault,
						fieldTextStyles[fieldSize],
						numberFieldParts.input,
						numberFieldInputPaddingSizes.default,
						fieldSize === "lg" && numberFieldInputPaddingSizes.lg,
						focusRing.inset,
						numberFieldParts.inputWidth(inputWidth),
					)}
				/>
				<BaseNumberField.Increment
					aria-label={incrementLabel}
					{...stylex.props(
						numberFieldParts.stepper,
						numberFieldStepperSizes[fieldSize],
						numberFieldIncrementRadii.default,
						fieldSize === "sm" && numberFieldIncrementRadii.sm,
						numberFieldParts.increment,
						pressable.transition,
					)}
				>
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
		alignItems: "center",
		color: tokens["--fg"],
		display: "flex",
		filter: "drop-shadow(0 1px 1px rgba(0, 0, 0, 0.4))",
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
				[media.canHover]: tokens["--border-input-hover"],
			},
			'[aria-invalid="true"]': tokens["--bg-error-primary"],
			"[data-disabled]": `${tokens["--border"]} transparent ${tokens["--border"]}`,
			"[data-readonly]": `${tokens["--border"]} transparent ${tokens["--border"]}`,
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
			"[data-disabled]": "transparent",
			"[data-readonly]": tokens["--canvas"],
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
	inputWidth: (width: NumberFieldInputWidth) => ({
		width: width === "fill" ? "100%" : width,
	}),
	stepper: {
		padding: 0,
		borderColor: {
			"[data-disabled]": tokens["--border"],
			"[data-readonly]": tokens["--border"],
			default: tokens["--border-input"],
		},
		borderStyle: "solid",
		borderWidth: "1px",
		outline: "0",
		alignItems: "center",
		backgroundColor: {
			[STEPPER_ACTIVE]: tokens["--surface-subtle-active"],
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[STEPPER_HOVER]: {
				[media.canHover]: tokens["--surface-subtle-hover"],
			},
			"[data-disabled]": tokens["--canvas"],
			default: "transparent",
		},
		color: {
			"[data-disabled]": `color-mix(in srgb, ${tokens["--fg-subtle"]} 48%, transparent)`,
			"[data-readonly]": `color-mix(in srgb, ${tokens["--fg-subtle"]} 48%, transparent)`,
			default: tokens["--fg-muted"],
			":hover": {
				[media.canHover]: tokens["--fg"],
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
	default: {
		paddingInline: tokens["--space-3"],
	},
	lg: {
		paddingInline: tokens["--space-5"],
	},
});

const numberFieldDecrementRadii = stylex.create({
	default: {
		borderEndStartRadius: tokens["--radius-md"],
		borderStartStartRadius: tokens["--radius-md"],
	},
	sm: {
		borderEndStartRadius: tokens["--radius-sm"],
		borderStartStartRadius: tokens["--radius-sm"],
	},
});

const numberFieldIncrementRadii = stylex.create({
	default: {
		borderEndEndRadius: tokens["--radius-md"],
		borderStartEndRadius: tokens["--radius-md"],
	},
	sm: {
		borderEndEndRadius: tokens["--radius-sm"],
		borderStartEndRadius: tokens["--radius-sm"],
	},
});
