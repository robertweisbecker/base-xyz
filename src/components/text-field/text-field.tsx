import { Field } from "@base-ui/react/field";
import { Input } from "@base-ui/react/input";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useId, type ComponentProps } from "react";
import { resolveThemeProps } from "@/theme/theme-props";
import type { FieldSize, FieldThemeProps } from "@/components/field/field.types";
import { fieldStyles, fieldInputStyles, fieldThemeProps } from "@/components/field/field.stylex";
import { focusRing } from "@/styles/recipes/focus";

export type TextFieldProps = Omit<
	ComponentProps<typeof Input>,
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
};

export function TextField({
	label,
	description,
	error,
	className,
	style,
	id: providedId,
	size = "md",
	...props
}: TextFieldProps) {
	const { restProps, styles } = resolveThemeProps(props, fieldThemeProps);
	const generatedId = useId();
	const id = providedId ?? generatedId;
	const descriptionId = description ? `${id}-description` : undefined;
	const errorId = error ? `${id}-error` : undefined;
	const rootSx = stylex.props(fieldStyles.root, ...styles, style);

	return (
		<Field.Root
			className={[rootSx.className, className].filter(Boolean).join(" ")}
			style={rootSx.style}
			invalid={Boolean(error)}>
			<Field.Label htmlFor={id} {...stylex.props(fieldStyles.label)}>
				{label}
			</Field.Label>
			<Input
				id={id}
				aria-describedby={[descriptionId, errorId].filter(Boolean).join(" ") || undefined}
				aria-invalid={Boolean(error)}
				{...stylex.props(fieldInputStyles[size], focusRing.inset)}
				{...restProps}
			/>
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
