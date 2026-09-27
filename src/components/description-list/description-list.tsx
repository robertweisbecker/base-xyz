import * as stylex from "@stylexjs/stylex";
import { createContext, useContext, useMemo, type ComponentPropsWithRef } from "react";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { extractMarginProps, type MarginProps } from "@/styles/props/spacing.stylex";
import { attrJoin } from "@/utils/attr-join";
import {
	actionsStyles,
	alignStyles,
	itemStyles,
	labelStyles,
	rootStyles,
	valueStyles,
} from "./description-list.stylex";
import { fontWeightStyles, textStyles } from "@/components/text/text.stylex";
const valueSizeStyles = {
	sm: textStyles.supporting,
	md: textStyles.body,
	lg: textStyles.large,
} as const;
const actionSizeStyles = {
	sm: textStyles.supporting,
	md: textStyles.body,
	lg: textStyles.body,
} as const;

export type DescriptionListOrientation = "horizontal" | "vertical" | "grid";
export type DescriptionListSize = "sm" | "md" | "lg";
export type DescriptionListVariant = "plain" | "divided";
export type DescriptionListItemAlign = "start" | "center" | "baseline";

type DescriptionListPartStyleProps<T> = Omit<T, "className" | "style" | "xstyle"> &
	BaseStyleProps & { className?: string };

export type DescriptionListRootProps = Omit<
	ComponentPropsWithRef<"dl">,
	"className" | "style" | "xstyle" | keyof MarginProps
> &
	MarginProps &
	BaseStyleProps & {
		className?: string;
		labelWidth?: string;
		orientation?: DescriptionListOrientation;
		size?: DescriptionListSize;
		variant?: DescriptionListVariant;
	};
export type DescriptionListItemProps = DescriptionListPartStyleProps<
	ComponentPropsWithRef<"div">
> & {
	align?: DescriptionListItemAlign;
};
export type DescriptionListLabelProps = DescriptionListPartStyleProps<ComponentPropsWithRef<"dt">>;
export type DescriptionListValueProps = DescriptionListPartStyleProps<ComponentPropsWithRef<"dd">>;
export type DescriptionListActionsProps = DescriptionListPartStyleProps<
	ComponentPropsWithRef<"dd">
>;

type RootContextValue = {
	orientation: DescriptionListOrientation;
	size: DescriptionListSize;
	variant: DescriptionListVariant;
};
const RootContext = createContext<RootContextValue | null>(null);
const ItemContext = createContext(false);

function invariantDev(condition: boolean, message: string) {
	if (import.meta.env.DEV && !condition) throw new Error(message);
}

export function Root({
	ref,
	className,
	style,
	xstyle,
	children,
	labelWidth = "6.5rem",
	orientation = "horizontal",
	size = "md",
	variant = "plain",
	...props
}: DescriptionListRootProps) {
	const { marginStyles, rest } = extractMarginProps(props);
	const sx = stylex.props(
		rootStyles.base,
		orientation === "grid" && rootStyles.grid,
		rootStyles.labelWidth(labelWidth),
		marginStyles,
		xstyle,
	);
	const contextValue = useMemo(
		() => ({ orientation, size, variant }),
		[orientation, size, variant],
	);
	return (
		<RootContext.Provider value={contextValue}>
			<dl
				ref={ref}
				className={attrJoin(sx.className, className)}
				style={mergeStyle(sx.style, style)}
				{...rest}
			>
				{children}
			</dl>
		</RootContext.Provider>
	);
}

export function Item({
	ref,
	className,
	style,
	xstyle,
	align = "baseline",
	children,
	...props
}: DescriptionListItemProps) {
	const root = useContext(RootContext);
	invariantDev(root !== null, "DescriptionList.Item must be rendered inside DescriptionList.Root.");
	const sx = stylex.props(
		itemStyles.base,
		root?.orientation === "horizontal" && itemStyles.horizontal,
		root?.orientation === "grid" && itemStyles.grid,
		alignStyles[align],
		root?.variant === "divided" &&
			(root.orientation === "grid" ? itemStyles.gridDivided : itemStyles.divided),
		root?.size && itemStyles[root.size],
		xstyle,
	);
	return (
		<ItemContext.Provider value>
			<div
				ref={ref}
				className={attrJoin(sx.className, className)}
				style={mergeStyle(sx.style, style)}
				{...props}
			>
				{children}
			</div>
		</ItemContext.Provider>
	);
}

export function Label({
	ref,
	className,
	style,
	xstyle,
	children,
	...props
}: DescriptionListLabelProps) {
	invariantDev(
		useContext(ItemContext),
		"DescriptionList.Label must be rendered inside DescriptionList.Item.",
	);
	const sx = stylex.props(
		labelStyles.base,
		textStyles.supporting,
		fontWeightStyles.regular,
		xstyle,
	);
	return (
		<dt
			ref={ref}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...props}
		>
			{children}
		</dt>
	);
}

export function Value({
	ref,
	className,
	style,
	xstyle,
	children,
	...props
}: DescriptionListValueProps) {
	invariantDev(
		useContext(ItemContext),
		"DescriptionList.Value must be rendered inside DescriptionList.Item.",
	);
	const root = useContext(RootContext);
	const sx = stylex.props(
		valueStyles.base,
		root?.size && valueSizeStyles[root.size],
		root?.orientation === "horizontal" && valueStyles.wide,
		xstyle,
	);
	return (
		<dd
			ref={ref}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...props}
		>
			{children}
		</dd>
	);
}

export function Actions({
	ref,
	className,
	style,
	xstyle,
	children,
	...props
}: DescriptionListActionsProps) {
	invariantDev(
		useContext(ItemContext),
		"DescriptionList.Actions must be rendered inside DescriptionList.Item.",
	);
	const root = useContext(RootContext);
	const sx = stylex.props(
		actionsStyles.base,
		root?.size && actionSizeStyles[root.size],
		root?.orientation === "horizontal" && actionsStyles.wide,
		xstyle,
	);
	return (
		<dd
			ref={ref}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...props}
		>
			{children}
		</dd>
	);
}

export const DescriptionList = { Root, Item, Label, Value, Actions } as const;
