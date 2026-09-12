import { Input as InputBase } from "@base-ui/react/input";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";
import type { FieldSize } from "@/components/field/field.types";
import { fieldInputStyles } from "@/components/field/field.stylex";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { extractMarginProps, type MarginProps } from "@/styles/props/spacing.stylex";
import { focusRing } from "@/styles/recipes/focus";
import { attrJoin } from "@/utils/attr-join";

export type TextFieldProps = Omit<
	ComponentProps<typeof InputBase>,
	"className" | "color" | "height" | "size" | "style" | "width" | keyof MarginProps
> &
	MarginProps &
	BaseStyleProps & {
		className?: string;
		size?: FieldSize;
	};

export function TextField({ className, style, xstyle, size = "md", ...props }: TextFieldProps) {
	const { marginStyles, rest } = extractMarginProps(props);
	const sx = stylex.props(fieldInputStyles[size], focusRing.inset, marginStyles, xstyle);

	return (
		<InputBase
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...rest}
		/>
	);
}
