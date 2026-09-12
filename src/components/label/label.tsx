import { Field as BaseField } from "@base-ui/react/field";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";
import { fieldStyles } from "@/components/field/field.stylex";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { attrJoin } from "@/utils/attr-join";

export type LabelVariant = "field" | "item";
export type LabelProps = Omit<ComponentProps<typeof BaseField.Label>, "className" | "style"> &
	BaseStyleProps & {
		className?: string;
		variant?: LabelVariant;
	};

/** Label for an explicit Field.Root or Field.Item. Use native labels for standalone controls. */
export function Label({ className, style, xstyle, variant = "field", ...props }: LabelProps) {
	const sx = stylex.props(variant === "field" ? fieldStyles.label : fieldStyles.itemLabel, xstyle);

	return (
		<BaseField.Label
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...props}
		/>
	);
}
