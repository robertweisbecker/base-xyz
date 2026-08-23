import { Field as FieldBase } from "@base-ui/react/field";
import { Input as InputBase } from "@base-ui/react/input";
import * as stylex from "@stylexjs/stylex";
import { useId } from "react";
import type { FieldSize } from "@/components/field/field.types";
import { fieldStyles, fieldInputStyles } from "@/components/field/field.stylex";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { extractMarginProps, type MarginProps } from "@/styles/props/spacing.stylex";
import { focusRing } from "@/styles/recipes/focus";
import { InfoTip, type InfoTipProps } from "../info-tip";
import { attrJoin } from "@/utils/attr-join";

export type TextFieldProps = Omit<
	InputBase.Props,
	| "className"
	| "color"
	| "height"
	| "size"
	| "style"
	| "width"
	| keyof MarginProps
> &
	MarginProps &
	BaseStyleProps & {
		label: string;
		description?: string;
		error?: string;
		className?: string;
		size?: FieldSize;
		info?: InfoTipProps["content"];
	};

export function TextField({
	label,
	description,
	error,
	className,
	style,
	xstyle,
	id: providedId,
	size = "md",
	disabled,
	name,
	info,
	...props
}: TextFieldProps) {
	const { marginStyles, rest } = extractMarginProps(props);
	const generatedId = useId();
	const id = providedId ?? generatedId;
	const descriptionId = description ? `${id}-description` : undefined;
	const errorId = error ? `${id}-error` : undefined;
	const rootSx = stylex.props(
		fieldStyles.root,
		...marginStyles,
		xstyle,
	);

	return (
		<FieldBase.Root
			className={attrJoin(rootSx.className, className)}
			style={mergeStyle(rootSx.style, style)}
			disabled={disabled}
			invalid={Boolean(error)}
			name={name}>
			<FieldBase.Label htmlFor={id} {...stylex.props(fieldStyles.label)}>
				{label}
				{info ? <InfoTip content={info} size="xs" my={-1} {...stylex.props(infoTipStyles.inline)} /> : null}
			</FieldBase.Label>
			<InputBase
				id={id}
				disabled={disabled}
				aria-describedby={attrJoin(descriptionId, errorId) || undefined}
				aria-invalid={Boolean(error)}
				{...stylex.props(fieldInputStyles[size], focusRing.inset)}
				{...rest}
			/>
			{description ? (
				<FieldBase.Description id={descriptionId} {...stylex.props(fieldStyles.description)}>
					{description}
				</FieldBase.Description>
			) : null}
			{error ? (
				<FieldBase.Error id={errorId} match {...stylex.props(fieldStyles.error)}>
					{error}
				</FieldBase.Error>
			) : null}
		</FieldBase.Root>
	);
}

const infoTipStyles = stylex.create({
	inline: {
		display: "inline",
		paddingBlock: 2.5,
		paddingInline: 2.5,
		verticalAlign: "middle",
		lineHeight: "inherit",
	},
});
