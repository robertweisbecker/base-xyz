import { Field as FieldBase } from "@base-ui/react/field";
import { Input as InputBase } from "@base-ui/react/input";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useId } from "react";
import { resolveThemeProps } from "@/theme/theme-props";
import type { FieldSize, FieldThemeProps } from "@/components/field/field.types";
import { fieldStyles, fieldInputStyles, fieldThemeProps } from "@/components/field/field.stylex";
import { focusRing } from "@/styles/recipes/focus";
import { InfoTip, type InfoTipProps } from "../info-tip";
import { attrJoin } from "@/utils/attr-join";

export type TextFieldProps = Omit<
	InputBase.Props,
	"className" | "color" | "height" | "size" | "style" | "width" | keyof FieldThemeProps
> &
	FieldThemeProps & {
		label: string;
		description?: string;
		error?: string;
		className?: string;
		/** StyleX overrides, applied after the component's own styles. */
		style?: StyleXStyles;
		size?: FieldSize;
		info?: InfoTipProps["content"];
	};

export function TextField({
	label,
	description,
	error,
	className,
	style,
	id: providedId,
	size = "md",
	disabled,
	name,
	info,
	...props
}: TextFieldProps) {
	const { restProps, styles } = resolveThemeProps(props, fieldThemeProps);
	const generatedId = useId();
	const id = providedId ?? generatedId;
	const descriptionId = description ? `${id}-description` : undefined;
	const errorId = error ? `${id}-error` : undefined;
	const rootSx = stylex.props(fieldStyles.root, ...styles, style);

	return (
		<FieldBase.Root
			className={attrJoin(rootSx.className, className)}
			style={rootSx.style}
			disabled={disabled}
			invalid={Boolean(error)}
			name={name}>
			<FieldBase.Label htmlFor={id} {...stylex.props(fieldStyles.label)}>
				{label}
				{info ? <InfoTip content={info} size="xs" my={-1} width={5} height={5} style={infoTipStyles.inline} /> : null}
			</FieldBase.Label>
			<InputBase
				id={id}
				disabled={disabled}
				aria-describedby={attrJoin(descriptionId, errorId) || undefined}
				aria-invalid={Boolean(error)}
				{...stylex.props(fieldInputStyles[size], focusRing.inset)}
				{...restProps}
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
