import { Field } from "@base-ui/react/field";
import * as stylex from "@stylexjs/stylex";
import { useId, type ReactNode } from "react";
import { fieldStyles } from "@/components/field/field.stylex";
import { InputGroup } from "@/components/input-group/input-group";
import { attrJoin } from "@/utils/attr-join";
import {
	useMathExpressionInput,
	type UseMathExpressionInputOptions,
} from "@/hooks/use-math-expression-input";

export type MathExpressionFieldProps = UseMathExpressionInputOptions & {
	label: string;
	description?: string;
	/** Submits the committed numeric value through a hidden input. */
	name?: string;
	/** Consumer-owned error; expression-validity errors take precedence. */
	error?: string;
	/** Decorative start addon, such as Figma-style dimension letters. */
	prefix?: ReactNode;
};

/**
 * Experimental field that accepts arithmetic expressions, then commits a number
 * on blur or Enter. Base UI NumberField filters expression characters, so this
 * attaches the math-expression hook to a plain text input inside InputGroup.
 */
export function MathExpressionField({
	label,
	description,
	name,
	error: consumerError,
	prefix,
	...options
}: MathExpressionFieldProps) {
	const { committedValue, error: expressionError, inputProps } = useMathExpressionInput(options);
	const error = expressionError ?? consumerError;
	const id = useId();
	const descriptionId = description ? `${id}-description` : undefined;
	const errorId = error ? `${id}-error` : undefined;

	return (
		<Field.Root
			{...stylex.props(fieldStyles.root)}
			disabled={options.disabled}
			invalid={Boolean(error)}
		>
			<Field.Label htmlFor={id} {...stylex.props(fieldStyles.label)}>
				{label}
			</Field.Label>
			<InputGroup.Root data-invalid={error ? "" : undefined}>
				{prefix ? (
					<InputGroup.Addon aria-hidden position="start">
						{prefix}
					</InputGroup.Addon>
				) : null}
				<InputGroup.Input
					id={id}
					aria-describedby={attrJoin(descriptionId, errorId) || undefined}
					{...inputProps}
					aria-invalid={error ? true : undefined}
				/>
			</InputGroup.Root>
			{name ? (
				<input
					type="hidden"
					name={name}
					value={committedValue ?? ""}
					disabled={options.disabled || Boolean(expressionError)}
				/>
			) : null}
			{description ? (
				<Field.Description id={descriptionId} {...stylex.props(fieldStyles.description)}>
					{description}
				</Field.Description>
			) : null}
			{error ? (
				<Field.Error id={errorId} match {...stylex.props(fieldStyles.error)}>
					{error}
				</Field.Error>
			) : null}
		</Field.Root>
	);
}
