import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";
import { Field } from "@/components/field/field";
import type { FieldSize } from "@/components/field/field.types";
import { fieldInputStyles } from "@/components/field/field.stylex";
import { useMergedRefs } from "@/hooks/use-merged-refs";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { extractMarginProps, type MarginProps } from "@/styles/props/spacing.stylex";
import { focusRing } from "@/styles/recipes/focus";
import { attrJoin } from "@/utils/attr-join";
import { useTextareaAutoResize } from "@/hooks/use-textarea-auto-resize";

export type TextareaProps = Omit<
	ComponentProps<"textarea">,
	"className" | "color" | "height" | "style" | "width" | keyof MarginProps
> &
	MarginProps &
	BaseStyleProps & {
		className?: string;
		size?: FieldSize;
		/** Enables content-based resizing with this minimum row count; defaults to `rows`. */
		minRows?: number;
		/** Enables content-based resizing with this maximum row count; content beyond this scrolls. */
		maxRows?: number;
	};

export function Textarea({
	ref,
	className,
	style,
	xstyle,
	disabled,
	id,
	name,
	value,
	defaultValue,
	autoFocus,
	readOnly,
	required,
	"aria-describedby": ariaDescribedBy,
	"aria-invalid": ariaInvalid,
	rows = 4,
	size = "md",
	minRows,
	maxRows,
	onChange,
	...props
}: TextareaProps) {
	const { marginStyles, rest } = extractMarginProps(props);
	const autoResizeEnabled = minRows !== undefined || maxRows !== undefined;
	const autoResizeState = useTextareaAutoResize({
		enabled: autoResizeEnabled,
		rows,
		minRows,
		maxRows,
	});
	const mergedRef = useMergedRefs(ref, autoResizeState.ref);
	const sx = stylex.props(
		fieldInputStyles[size],
		textareaParts.control,
		autoResizeEnabled && textareaParts.autoResize,
		focusRing.inset,
		marginStyles,
		xstyle,
	);

	return (
		<Field.Control
			aria-describedby={ariaDescribedBy}
			aria-invalid={ariaInvalid}
			autoFocus={autoFocus}
			defaultValue={defaultValue}
			disabled={disabled}
			id={id}
			name={name}
			readOnly={readOnly}
			required={required}
			value={value}
			render={
				<textarea
					ref={mergedRef}
					rows={autoResizeEnabled ? autoResizeState.minRows : rows}
					onChange={(event) => {
						onChange?.(event);
						// React restores the accepted controlled value after this event.
						queueMicrotask(autoResizeState.resize);
					}}
					className={attrJoin(sx.className, className)}
					style={mergeStyle(sx.style, style)}
					{...rest}
				/>
			}
		/>
	);
}

const textareaParts = stylex.create({
	control: {
		fontFamily: "inherit",
		resize: "vertical",
		height: "auto",
	},
	autoResize: {
		resize: "none",
	},
});
