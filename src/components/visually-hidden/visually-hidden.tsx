import { useRender } from "@base-ui/react/use-render";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { attrJoin } from "@/utils/attr-join";

export type VisuallyHiddenProps = Omit<useRender.ComponentProps<"span">, "className" | "render" | "style"> & {
	className?: string;
	render?: useRender.RenderProp;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export function VisuallyHidden({ ref, className, render, style, ...props }: VisuallyHiddenProps) {
	const sx = stylex.props(styles.root, style);

	return useRender<{}, HTMLElement>({
		defaultTagName: "span",
		ref,
		render,
		props: {
			...props,
			className: attrJoin(sx.className, className),
			style: sx.style,
		},
	});
}

const styles = stylex.create({
	root: {
		margin: "-1px",
		padding: 0,
		borderWidth: 0,
		overflow: "hidden",
		clip: "rect(0 0 0 0)",
		clipPath: "inset(50%)",
		color: "transparent",
		opacity: 0,
		position: "absolute",
		whiteSpace: "nowrap",
		zIndex: -1,
		height: "1px",
		left: 0,
		top: 0,
		width: "1px",
	},
});
