import { Form as BaseForm } from "@base-ui/react/form";
import * as stylex from "@stylexjs/stylex";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { extractMarginProps, type MarginProps } from "@/styles/props/spacing.stylex";
import { attrJoin } from "@/utils/attr-join";

export type {
	FormActions,
	FormSubmitEventDetails,
	FormSubmitEventReason,
	FormValidationMode,
} from "@base-ui/react/form";

export type FormProps<Values extends BaseForm.Values = BaseForm.Values> = Omit<
	BaseForm.Props<Values>,
	"className" | "style" | keyof MarginProps
> &
	MarginProps &
	BaseStyleProps & { className?: string };

/** Native form and validation owner. Choose layout explicitly with children or xstyle. */
export function Form<Values extends BaseForm.Values = BaseForm.Values>({
	className,
	style,
	xstyle,
	...props
}: FormProps<Values>) {
	const { marginStyles, rest } = extractMarginProps(props);
	const sx = stylex.props(marginStyles, xstyle);

	return (
		<BaseForm<Values>
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...rest}
		/>
	);
}
