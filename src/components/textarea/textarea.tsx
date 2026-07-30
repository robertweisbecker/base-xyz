import { Field } from "@base-ui/react/field";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useId, type ComponentProps } from "react";
import { fieldStyles, fieldInputStyles, type FieldSize } from "@/components/field/field.stylex";
import { focusRing } from "@/styles/recipes/focus";

export type TextareaProps = Omit<ComponentProps<"textarea">, "className" | "style"> & {
	label: string;
	description?: string;
	error?: string;
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
	size?: FieldSize;
};

export function Textarea({
	ref,
	label,
	description,
	error,
	className,
	style,
	disabled,
	id: providedId,
	readOnly,
	rows = 4,
	size = "md",
	"aria-describedby": ariaDescribedBy,
	"aria-invalid": ariaInvalid,
	...props
}: TextareaProps) {
	const generatedId = useId();
	const id = providedId ?? generatedId;
	const descriptionId = description ? `${id}-description` : undefined;
	const errorId = error ? `${id}-error` : undefined;
	const rootSx = stylex.props(fieldStyles.root, style);

	return (
		<Field.Root
			className={[rootSx.className, className].filter(Boolean).join(" ")}
			style={rootSx.style}
			disabled={disabled}
			invalid={Boolean(error)}
		>
			<Field.Label htmlFor={id} {...stylex.props(fieldStyles.label)}>
				{label}
			</Field.Label>
			<textarea
				ref={ref}
				id={id}
				aria-describedby={mergeIds(ariaDescribedBy, descriptionId, errorId)}
				aria-invalid={error ? true : ariaInvalid}
				data-disabled={disabled ? "" : undefined}
				data-invalid={error ? "" : undefined}
				data-readonly={readOnly ? "" : undefined}
				disabled={disabled}
				readOnly={readOnly}
				rows={rows}
				{...stylex.props(fieldInputStyles[size], textareaParts.control, focusRing.inset)}
				{...props}
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

function mergeIds(...ids: Array<string | undefined>) {
	return ids.filter(Boolean).join(" ") || undefined;
}

const textareaParts = stylex.create({
	control: {
		fontFamily: "inherit",
		resize: "vertical",
		height: "auto",
	},
});
