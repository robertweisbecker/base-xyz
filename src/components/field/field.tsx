import { Field as BaseField } from "@base-ui/react/field";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { extractMarginProps, type MarginProps } from "@/styles/props/spacing.stylex";
import { attrJoin } from "@/utils/attr-join";
import { fieldStyles } from "./field.stylex";

export type {
	FieldControlChangeEventDetails,
	FieldControlChangeEventReason,
	FieldRootActions,
	FieldValidityProps,
	FieldValidityState,
} from "@base-ui/react/field";

type FieldPartProps<Props> = Omit<Props, "className" | "style"> &
	BaseStyleProps & { className?: string };

export type FieldRootProps = Omit<
	FieldPartProps<ComponentProps<typeof BaseField.Root>>,
	keyof MarginProps
> &
	MarginProps;
export type FieldControlProps = FieldPartProps<ComponentProps<typeof BaseField.Control>>;
export type FieldItemProps = FieldPartProps<ComponentProps<typeof BaseField.Item>>;
export type FieldDescriptionProps = FieldPartProps<ComponentProps<typeof BaseField.Description>>;
export type FieldErrorProps = FieldPartProps<ComponentProps<typeof BaseField.Error>>;

/** Owns one logical field's value, labels, descriptions, and validation. */
export function Root({ className, style, xstyle, ...props }: FieldRootProps) {
	const { marginStyles, rest } = extractMarginProps(props);
	const sx = stylex.props(fieldStyles.root, marginStyles, xstyle);

	return (
		<BaseField.Root
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...rest}
		/>
	);
}

/** Unstyled bridge for native/custom controls. Base UI controls already register themselves. */
export function Control({ className, style, xstyle, ...props }: FieldControlProps) {
	const sx = stylex.props(xstyle);

	return (
		<BaseField.Control
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...props}
		/>
	);
}

/** Scopes an option's label and description within an explicit Field.Root. */
export function Item({ className, style, xstyle, ...props }: FieldItemProps) {
	const sx = stylex.props(xstyle);

	return (
		<BaseField.Item
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...props}
		/>
	);
}

export function Description({ className, style, xstyle, ...props }: FieldDescriptionProps) {
	const sx = stylex.props(fieldStyles.description, xstyle);

	return (
		<BaseField.Description
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...props}
		/>
	);
}

export function Error({ className, style, xstyle, ...props }: FieldErrorProps) {
	const sx = stylex.props(fieldStyles.error, xstyle);

	return (
		<BaseField.Error
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...props}
		/>
	);
}

export const Field = {
	Root,
	Control,
	Item,
	Description,
	Error,
	Validity: BaseField.Validity,
} as const;
