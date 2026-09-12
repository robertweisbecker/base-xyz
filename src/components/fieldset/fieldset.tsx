import { Fieldset as BaseFieldset } from "@base-ui/react/fieldset";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";
import { fieldStyles } from "@/components/field/field.stylex";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { extractMarginProps, type MarginProps } from "@/styles/props/spacing.stylex";
import { attrJoin } from "@/utils/attr-join";

export type FieldsetRootProps = Omit<
	ComponentProps<typeof BaseFieldset.Root>,
	"className" | "style" | keyof MarginProps
> &
	MarginProps &
	BaseStyleProps & { className?: string };
export type FieldsetLegendProps = Omit<
	ComponentProps<typeof BaseFieldset.Legend>,
	"className" | "style"
> &
	BaseStyleProps & { className?: string };

/** Groups related controls; each logical field still owns its own Field.Root. */
export function Root({ className, style, xstyle, ...props }: FieldsetRootProps) {
	const { marginStyles, rest } = extractMarginProps(props);
	const sx = stylex.props(fieldsetParts.root, marginStyles, xstyle);

	return (
		<BaseFieldset.Root
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...rest}
		/>
	);
}

export function Legend({ className, style, xstyle, ...props }: FieldsetLegendProps) {
	const sx = stylex.props(fieldStyles.groupLabel, fieldsetParts.legend, xstyle);

	return (
		<BaseFieldset.Legend
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...props}
		/>
	);
}

const fieldsetParts = stylex.create({
	root: {
		margin: 0,
		padding: 0,
		borderWidth: 0,
		minWidth: 0,
	},
	legend: { padding: 0 },
});

export const Fieldset = { Root, Legend } as const;
