import { useRender } from "@base-ui/react/use-render";
import type { ReactNode } from "react";
import { renderButtonSlot } from "@/components/button/button-presentation";
import {
	getButtonRootStyleProps,
	type ButtonShape,
	type ButtonSize,
	type ButtonVariant,
} from "@/components/button/button.stylex";
import { mergeStyle } from "@/styles/props/base";
import { extractMarginProps } from "@/styles/props/spacing.stylex";
import { attrJoin } from "@/utils/attr-join";
import type { LinkProps } from "./link";
import { externalLinkIndicator, resolveExternalLinkProps } from "./link-utils";

export type LinkButtonProps = Omit<LinkProps, "color"> & {
	render?: useRender.RenderProp;
	variant?: ButtonVariant;
	size?: ButtonSize;
	shape?: ButtonShape;
	/** Visual content positioned before the label. */
	startSlot?: ReactNode;
	/** Visual content positioned after the label. */
	endSlot?: ReactNode;
};

/** A semantic link with the Button family's presentation. Renders an anchor by default. */
export function LinkButton({
	ref,
	children,
	className,
	external = false,
	rel,
	render,
	style,
	target,
	variant = "primary",
	size = "md",
	shape = "default",
	startSlot,
	endSlot,
	xstyle,
	...props
}: LinkButtonProps) {
	const resolvedLinkProps = resolveExternalLinkProps({ external, rel, target });
	const { marginStyles, rest } = extractMarginProps(props);
	const sx = getButtonRootStyleProps({ variant, size, shape }, [marginStyles, xstyle]);
	const resolvedEndSlot = endSlot === undefined && external ? externalLinkIndicator : endSlot;

	return useRender<{}, HTMLAnchorElement>({
		defaultTagName: "a",
		ref,
		render,
		props: {
			...rest,
			className: attrJoin(sx.className, className),
			style: mergeStyle(sx.style, style),
			rel: resolvedLinkProps.rel,
			target: resolvedLinkProps.target,
			"data-shape": shape,
			"data-size": size,
			"data-variant": variant,
			children: (
				<>
					{renderButtonSlot(startSlot, "start", size, variant, false)}
					{children}
					{renderButtonSlot(resolvedEndSlot, "end", size, variant, false)}
				</>
			),
		},
	});
}
