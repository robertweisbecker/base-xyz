import { NumberField as BaseNumberField } from "@base-ui/react/number-field";
import { ArrowsHorizontalIcon } from "@phosphor-icons/react/dist/csr/ArrowsHorizontal";
import { MinusIcon } from "@phosphor-icons/react/dist/csr/Minus";
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import * as stylex from "@stylexjs/stylex";
import { createContext, useContext, type ComponentProps, type CSSProperties } from "react";
import { media } from "@/styles/constants.stylex";
import type { FieldSize } from "@/components/field/field.types";
import { fieldStyles, fieldTextStyles } from "@/components/field/field.stylex";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { extractMarginProps, type MarginProps } from "@/styles/props/spacing.stylex";
import { focusRing } from "@/styles/recipes/focus";
import { pressable } from "@/styles/recipes/transitions";
import { tokens } from "@/theme/tokens.stylex";
import { attrJoin } from "@/utils/attr-join";

const STEPPER_HOVER = ":hover:not([data-disabled]):not([data-readonly]):not(:active)";
const STEPPER_ACTIVE = ":active:not([data-disabled]):not([data-readonly])";
const INPUT_HOVER =
	':hover:not(:focus-visible):not([aria-invalid="true"]):not([data-disabled]):not([data-invalid]):not([data-readonly]):not([readonly])';

const NumberFieldSizeContext = createContext<FieldSize>("md");

export type NumberFieldRootProps = Omit<
	ComponentProps<typeof BaseNumberField.Root>,
	"className" | "style" | keyof MarginProps
> &
	MarginProps &
	BaseStyleProps & { className?: string; size?: FieldSize };

export type NumberFieldControlProps = Omit<
	ComponentProps<typeof BaseNumberField.Input>,
	"className" | "style"
> &
	BaseStyleProps & {
		className?: string;
		/** Width of the visible input. Use "fill" or any CSS width. @default "5ch" */
		inputWidth?: NumberFieldInputWidth;
		decrementLabel?: string;
		incrementLabel?: string;
	};

export type NumberFieldScrubAreaProps = Omit<
	ComponentProps<typeof BaseNumberField.ScrubArea>,
	"className" | "style"
> &
	BaseStyleProps & { className?: string };

export type NumberFieldInputWidth = CSSProperties["width"] | "fill";

/** Owns numeric state and the widget host. Field composition stays with the caller. */
export function Root({ className, style, xstyle, size = "md", ...props }: NumberFieldRootProps) {
	const { marginStyles, rest } = extractMarginProps(props);
	const sx = stylex.props(numberFieldParts.root, marginStyles, xstyle);
	return (
		<NumberFieldSizeContext.Provider value={size}>
			<BaseNumberField.Root
				className={attrJoin(sx.className, className)}
				style={mergeStyle(sx.style, style)}
				{...rest}
			/>
		</NumberFieldSizeContext.Provider>
	);
}

/** Input props and ref target the visible input; group and steppers remain private. */
export function Control({
	className,
	style,
	xstyle,
	inputWidth = "5ch",
	decrementLabel = "Decrease value",
	incrementLabel = "Increase value",
	...props
}: NumberFieldControlProps) {
	const size = useContext(NumberFieldSizeContext);
	const sx = stylex.props(
		fieldStyles.inputUnstyled,
		fieldStyles.inputDefault,
		fieldTextStyles[size],
		numberFieldParts.input,
		numberFieldInputPaddingSizes.default,
		size === "lg" && numberFieldInputPaddingSizes.lg,
		focusRing.inset,
		numberFieldParts.inputWidth(inputWidth),
		xstyle,
	);
	return (
		<BaseNumberField.Group {...stylex.props(numberFieldParts.group, numberFieldGroupSizes[size])}>
			<BaseNumberField.Decrement
				aria-label={decrementLabel}
				{...stylex.props(
					numberFieldParts.stepper,
					numberFieldStepperSizes[size],
					numberFieldDecrementRadii.default,
					size === "sm" && numberFieldDecrementRadii.sm,
					numberFieldParts.decrement,
					pressable.transition,
				)}
			>
				<MinusIcon aria-hidden size={12} weight="bold" />
			</BaseNumberField.Decrement>
			<BaseNumberField.Input
				className={attrJoin(sx.className, className)}
				style={mergeStyle(sx.style, style)}
				{...props}
			/>
			<BaseNumberField.Increment
				aria-label={incrementLabel}
				{...stylex.props(
					numberFieldParts.stepper,
					numberFieldStepperSizes[size],
					numberFieldIncrementRadii.default,
					size === "sm" && numberFieldIncrementRadii.sm,
					numberFieldParts.increment,
					pressable.transition,
				)}
			>
				<PlusIcon aria-hidden size={12} weight="bold" />
			</BaseNumberField.Increment>
		</BaseNumberField.Group>
	);
}

/** Optional scrub target around caller content, with the cursor kept private. */
export function ScrubArea({
	children,
	className,
	style,
	xstyle,
	...props
}: NumberFieldScrubAreaProps) {
	const sx = stylex.props(numberFieldParts.scrubArea, xstyle);
	return (
		<BaseNumberField.ScrubArea
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...props}
		>
			{children}
			<BaseNumberField.ScrubAreaCursor {...stylex.props(numberFieldParts.scrubCursor)}>
				<ArrowsHorizontalIcon
					aria-hidden
					size={24}
					weight="fill"
					strokeWidth={8}
					fill="black"
					stroke="white"
				/>
			</BaseNumberField.ScrubAreaCursor>
		</BaseNumberField.ScrubArea>
	);
}

export const NumberField = { Root, Control, ScrubArea } as const;

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
