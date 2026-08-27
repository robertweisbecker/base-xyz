import { useRender } from "@base-ui/react/use-render";
import * as stylex from "@stylexjs/stylex";
import {
	Children,
	createContext,
	Fragment,
	isValidElement,
	type ComponentPropsWithoutRef,
	type ReactNode,
	type Ref,
	useContext,
} from "react";
import {
	textColorStyles,
	textTabularStyles,
	textWrapStyles,
	typescaleStyles,
} from "@/components/text/text.stylex";
import type {
	TypographyColor,
	TypographyFontFamily,
	TypographyFontWeight,
	TypographySize,
	TypographyWrap,
} from "@/components/text/text.types";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { extractMarginProps, type MarginProps } from "@/styles/props/spacing.stylex";
import { resolveTypography, type TypographyProps } from "@/styles/props/typography.stylex";
import { attrJoin } from "@/utils/attr-join";
import { listStyles, orderedMarkerStyles, unorderedMarkerStyles } from "./list.stylex";

type MarkerDepth = "0" | "1" | "2";

type ListTypographyProps = {
	color?: TypographyColor;
	fontFamily?: TypographyFontFamily;
	fontWeight?: TypographyFontWeight;
	size?: TypographySize;
	tabular?: boolean;
	textAlign?: TypographyProps["textAlign"];
	wrap?: TypographyWrap;
};

export type ListRootProps = Omit<
	ComponentPropsWithoutRef<"ol">,
	"className" | "color" | "style" | keyof MarginProps
> &
	MarginProps &
	BaseStyleProps & {
		className?: string;
		/**
		 * Renders an `ol` when true and a `ul` otherwise. Custom markers on direct `List.Item`
		 * children force unordered semantics; wrapper components should set `ordered={false}`.
		 */
		ordered?: boolean;
		ref?: Ref<HTMLOListElement | HTMLUListElement>;
	} & Pick<ListTypographyProps, "color" | "size">;

export type ListItemProps = Omit<ComponentPropsWithoutRef<"li">, "className" | "color" | "style"> &
	BaseStyleProps &
	ListTypographyProps & {
		className?: string;
		/** A decorative per-item marker. Supplying one makes the containing List unordered. */
		marker?: ReactNode;
		ref?: Ref<HTMLLIElement>;
	};

const ListDepthContext = createContext(-1);

export function Root({
	ref,
	children,
	className,
	color = "default",
	ordered = false,
	reversed,
	size = "2",
	start,
	style,
	type,
	xstyle,
	...props
}: ListRootProps) {
	const parentDepth = useContext(ListDepthContext);
	const depth = parentDepth + 1;
	const markerDepth = getMarkerDepth(depth);
	const isOrdered = ordered && !hasCustomItemMarker(children);
	const { marginStyles, rest } = extractMarginProps(props);
	const nativeProps = isOrdered ? { ...rest, reversed, start, type } : rest;
	const sx = stylex.props(
		listStyles.root,
		depth > 0 && listStyles.nested,
		isOrdered ? orderedMarkerStyles[markerDepth] : unorderedMarkerStyles[markerDepth],
		typescaleStyles[size],
		textColorStyles[color],
		...marginStyles,
		xstyle,
	);
	const sharedProps = {
		...nativeProps,
		className: attrJoin(sx.className, className),
		style: mergeStyle(sx.style, style),
	};

	const element = useRender<{}, HTMLOListElement | HTMLUListElement>({
		defaultTagName: isOrdered ? "ol" : "ul",
		ref,
		props: {
			...sharedProps,
			children,
		},
	});

	return <ListDepthContext.Provider value={depth}>{element}</ListDepthContext.Provider>;
}

export function Item({
	ref,
	children,
	className,
	color,
	fontFamily,
	fontWeight,
	marker,
	size,
	style,
	tabular = false,
	textAlign,
	wrap,
	xstyle,
	...props
}: ListItemProps) {
	const hasMarker = isPresent(marker);
	const sx = stylex.props(
		listStyles.item,
		hasMarker && listStyles.customMarkerItem,
		size && typescaleStyles[size],
		color && textColorStyles[color],
		wrap && textWrapStyles[wrap],
		tabular && textTabularStyles.tabular,
		...resolveTypography({ fontFamily, fontWeight, textAlign }),
		xstyle,
	);

	return (
		<li
			ref={ref}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...props}
		>
			{hasMarker ? (
				<>
					<span aria-hidden {...stylex.props(listStyles.customMarker)}>
						{marker}
					</span>
					<div {...stylex.props(listStyles.content)}>{children}</div>
				</>
			) : (
				children
			)}
		</li>
	);
}

function isPresent(value: ReactNode) {
	return value !== undefined && value !== null && value !== false && value !== "";
}

function getMarkerDepth(depth: number): MarkerDepth {
	const remainder = depth % 3;
	if (remainder === 1) return "1";
	if (remainder === 2) return "2";
	return "0";
}

function hasCustomItemMarker(children: ReactNode): boolean {
	return Children.toArray(children).some((child) => {
		if (isValidElement<ListItemProps>(child) && child.type === Item) {
			return isPresent(child.props.marker);
		}
		if (isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment) {
			return hasCustomItemMarker(child.props.children);
		}
		return false;
	});
}
