import type {
	colorDefaults,
	radiusDefaults,
	shadowDefaults,
	sizeDefaults,
	spaceDefaults,
} from "../styles/tokens.stylex";

export type SpaceStep = Extract<keyof typeof spaceDefaults, number>;
type Negate<Value extends number> = `-${Value}` extends `${infer NegativeValue extends number}`
	? NegativeValue
	: never;
export type NegativeSpaceStep = Negate<Exclude<SpaceStep, 0>>;
export type MarginValue = SpaceStep | NegativeSpaceStep | "auto";
export type PaddingValue = SpaceStep;
export type GapValue = SpaceStep;
export type OffsetValue = SpaceStep | NegativeSpaceStep | "auto";

export type ContainerSize = Extract<keyof typeof sizeDefaults, `container.${string}`>;
export type SizeKeyword = "auto" | "full" | "min-content" | "max-content" | "fit-content" | "stretch";
export type CssLengthUnit =
	| "px"
	| "rem"
	| "em"
	| "ch"
	| "ex"
	| "cap"
	| "ic"
	| "lh"
	| "rlh"
	| "vw"
	| "vh"
	| "vmin"
	| "vmax"
	| "svw"
	| "svh"
	| "lvw"
	| "lvh"
	| "dvw"
	| "dvh"
	| "cqw"
	| "cqh"
	| "cqi"
	| "cqb"
	| "cqmin"
	| "cqmax"
	| "cm"
	| "mm"
	| "in"
	| "pt"
	| "pc";
export type CssDimensionString =
	| `${number}${CssLengthUnit}`
	| `${number}%`
	| `${"calc" | "min" | "max" | "clamp" | "var" | "env" | "fit-content" | "anchor-size"}(${string})`
	| "inherit"
	| "initial"
	| "unset"
	| "revert"
	| "revert-layer";
export type DimensionValue = SpaceStep | ContainerSize | SizeKeyword | CssDimensionString;
export type MaxDimensionValue = DimensionValue | "none";
export type WidthFraction = "1/2" | "1/3" | "2/3" | "1/4" | "3/4";
export type WidthValue = DimensionValue | WidthFraction;

export type DisplayValue =
	| "none"
	| "block"
	| "inline"
	| "inline-block"
	| "contents"
	| "flex"
	| "inline-flex"
	| "grid"
	| "inline-grid";
export type PositionValue = "static" | "relative" | "absolute" | "fixed" | "sticky";
export type AlignValue = "start" | "center" | "end" | "stretch" | "baseline";
export type JustifyValue = "start" | "center" | "end" | "stretch" | "space-between" | "space-around" | "space-evenly";
export type WrapValue = "nowrap" | "wrap" | "wrap-reverse";
export type Orientation = "horizontal" | "vertical";
export type GridFlow = "row" | "column" | "dense" | "row dense" | "column dense";
export type GridSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | "full";
export type GridColumns = Exclude<GridSpan, "full">;
export type RadiusValue = keyof typeof radiusDefaults;
export type ShadowValue = keyof typeof shadowDefaults | "none";
export type SemanticColor = keyof typeof colorDefaults;

export type DisplayProps = {
	display?: DisplayValue;
};

export type MarginProps = {
	m?: MarginValue;
	mx?: MarginValue;
	my?: MarginValue;
	mt?: MarginValue;
	mb?: MarginValue;
	ms?: MarginValue;
	me?: MarginValue;
};

export type PaddingProps = {
	p?: PaddingValue;
	px?: PaddingValue;
	py?: PaddingValue;
	pt?: PaddingValue;
	pb?: PaddingValue;
	ps?: PaddingValue;
	pe?: PaddingValue;
};

export type SpacingProps = MarginProps & PaddingProps;

export type SizingProps = {
	width?: WidthValue;
	height?: DimensionValue;
	minWidth?: DimensionValue;
	maxWidth?: MaxDimensionValue;
	minHeight?: DimensionValue;
	maxHeight?: MaxDimensionValue;
};

export type PositioningProps = {
	position?: PositionValue;
	inset?: OffsetValue;
	insetX?: OffsetValue;
	insetY?: OffsetValue;
	insetTop?: OffsetValue;
	insetBottom?: OffsetValue;
	insetStart?: OffsetValue;
	insetEnd?: OffsetValue;
	zIndex?: number | string;
};

export type ChildLayoutProps = {
	alignSelf?: AlignValue | "auto";
	justifySelf?: AlignValue | "auto";
	flexBasis?: DimensionValue;
	flexGrow?: number;
	flexShrink?: number;
	order?: number;
	columnSpan?: GridSpan;
	rowSpan?: GridSpan;
};

export type RadiusThemeProps = {
	radius?: RadiusValue;
};

export type ShadowThemeProps = {
	shadow?: ShadowValue;
};

export type SurfaceThemeProps = RadiusThemeProps &
	ShadowThemeProps & {
	color?: SemanticColor;
	bg?: SemanticColor;
};

export type GapProps = {
	gap?: GapValue;
	gapX?: GapValue;
	gapY?: GapValue;
};

export type FlexProps = GapProps & {
	orientation?: Orientation;
	reverse?: boolean;
	align?: AlignValue;
	justify?: JustifyValue;
	wrap?: WrapValue;
};

export type TextAlignProps = {
	textAlign?: "start" | "center" | "end" | "justify";
};

export type GridLayoutProps = GapProps & {
	columns?: GridColumns;
	flow?: GridFlow;
	align?: AlignValue;
	justify?: AlignValue;
};
