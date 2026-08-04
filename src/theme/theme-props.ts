import type { StyleXStyles } from "@stylexjs/stylex";
import type {
	ChildLayoutProps,
	DisplayProps,
	FlexProps,
	GapProps,
	GridLayoutProps,
	MarginProps,
	PaddingProps,
	PositioningProps,
	RadiusThemeProps,
	ShadowThemeProps,
	SizingProps,
	SurfaceThemeProps,
	TextAlignProps,
} from "./theme-props.types";

type ExactKeys<Props extends object, Keys extends readonly PropertyKey[]> =
	Exclude<keyof Props, Keys[number]> extends never
		? Exclude<Keys[number], keyof Props> extends never
			? unknown
			: never
		: never;

/** Declares the complete runtime key list for one public capability contract. */
export function defineThemePropKeys<Props extends object>() {
	return <const Keys extends readonly Extract<keyof Props, string>[]>(keys: Keys & ExactKeys<Props, Keys>) => keys;
}

type FlexLayoutProps = Omit<FlexProps, keyof GapProps>;
type GridCompositionProps = Omit<GridLayoutProps, keyof GapProps>;
type SurfaceColorProps = Pick<SurfaceThemeProps, "color" | "bg">;

export const displayThemePropKeys = defineThemePropKeys<DisplayProps>()(["display"] as const);
export const marginThemePropKeys = defineThemePropKeys<MarginProps>()([
	"m",
	"mx",
	"my",
	"mt",
	"mb",
	"ms",
	"me",
] as const);
export const paddingThemePropKeys = defineThemePropKeys<PaddingProps>()([
	"p",
	"px",
	"py",
	"pt",
	"pb",
	"ps",
	"pe",
] as const);
export const sizingThemePropKeys = defineThemePropKeys<SizingProps>()([
	"width",
	"height",
	"minWidth",
	"maxWidth",
	"minHeight",
	"maxHeight",
] as const);
export const positioningThemePropKeys = defineThemePropKeys<PositioningProps>()([
	"position",
	"inset",
	"insetX",
	"insetY",
	"insetTop",
	"insetBottom",
	"insetStart",
	"insetEnd",
	"zIndex",
] as const);
export const childLayoutThemePropKeys = defineThemePropKeys<ChildLayoutProps>()([
	"alignSelf",
	"justifySelf",
	"flexBasis",
	"flexGrow",
	"flexShrink",
	"order",
	"columnSpan",
	"rowSpan",
] as const);
export const surfaceColorThemePropKeys = defineThemePropKeys<SurfaceColorProps>()(["color", "bg"] as const);
export const radiusThemePropKeys = defineThemePropKeys<RadiusThemeProps>()(["radius"] as const);
export const shadowThemePropKeys = defineThemePropKeys<ShadowThemeProps>()(["shadow"] as const);
export const gapThemePropKeys = defineThemePropKeys<GapProps>()(["gap", "gapX", "gapY"] as const);
export const flexLayoutThemePropKeys = defineThemePropKeys<FlexLayoutProps>()([
	"orientation",
	"reverse",
	"align",
	"justify",
	"wrap",
] as const);
export const gridCompositionThemePropKeys = defineThemePropKeys<GridCompositionProps>()([
	"columns",
	"flow",
	"align",
	"justify",
] as const);
export const textAlignThemePropKeys = defineThemePropKeys<TextAlignProps>()(["textAlign"] as const);

const knownThemePropKeys = new Set<string>([
	...displayThemePropKeys,
	...marginThemePropKeys,
	...paddingThemePropKeys,
	...sizingThemePropKeys,
	...positioningThemePropKeys,
	...childLayoutThemePropKeys,
	...surfaceColorThemePropKeys,
	...radiusThemePropKeys,
	...shadowThemePropKeys,
	...gapThemePropKeys,
	...flexLayoutThemePropKeys,
	...gridCompositionThemePropKeys,
	...textAlignThemePropKeys,
]);

type ThemePropLeaf = {
	readonly keys: readonly string[];
	readonly compile: (props: object) => StyleXStyles[];
};

export type ThemePropDefinition<Props extends object> = {
	readonly keys: ReadonlySet<Extract<keyof Props, string>>;
	readonly leaves: readonly ThemePropLeaf[];
	readonly __themeProps?: Props;
};

type AnyThemePropDefinition = {
	readonly keys: ReadonlySet<string>;
	readonly leaves: readonly ThemePropLeaf[];
	readonly __themeProps?: object;
};
type DefinitionProps<Definition> = Definition extends { readonly __themeProps?: infer Props extends object }
	? Props
	: never;
type UnionToIntersection<Union> = (Union extends unknown ? (value: Union) => void : never) extends (
	value: infer Intersection,
) => void
	? Intersection
	: never;
type Simplify<Type> = { [Key in keyof Type]: Type[Key] };
type ExactThemeProps<Actual extends object, Expected extends object> = Exclude<keyof Actual, keyof Expected> extends never
	? Exclude<keyof Expected, keyof Actual> extends never
		? Actual extends Expected
			? Expected extends Actual
				? true
				: false
			: false
		: false
	: false;

export type VerifyThemeProps<Expected extends object, Definition> = ExactThemeProps<
	DefinitionProps<Definition>,
	Expected
> extends true
	? Expected
	: never;

export function createThemePropDefinition<Props extends object>(
	keys: readonly Extract<keyof Props, string>[],
	compile: (props: Props) => StyleXStyles[],
): ThemePropDefinition<Props> {
	const leaf: ThemePropLeaf = Object.freeze({
		keys,
		compile: (props: object) => compile(props as Props),
	});
	return Object.freeze({
		keys: new Set(keys),
		leaves: [leaf],
	});
}

export function composeThemeProps<const Definitions extends readonly AnyThemePropDefinition[]>(
	...definitions: Definitions
): ThemePropDefinition<Simplify<UnionToIntersection<DefinitionProps<Definitions[number]>>>> {
	type Props = Simplify<UnionToIntersection<DefinitionProps<Definitions[number]>>>;
	const keys = new Set<Extract<keyof Props, string>>();
	const leaves: ThemePropLeaf[] = [];

	for (const definition of definitions) {
		for (const leaf of definition.leaves) {
			for (const key of leaf.keys) {
				if (keys.has(key as Extract<keyof Props, string>)) {
					throw new Error(`Theme prop "${key}" was composed more than once.`);
				}
				keys.add(key as Extract<keyof Props, string>);
			}
			leaves.push(leaf);
		}
	}

	return Object.freeze({ keys, leaves });
}

export function extractThemeProps<Props extends object, T extends object & Partial<Props>>(
	props: T,
	definition: ThemePropDefinition<Props>,
): {
	themeProps: Props;
	restProps: Omit<T, keyof Props>;
	activeThemePropKeys: ReadonlySet<string>;
} {
	const pickedProps: Record<string, unknown> = {};
	const restProps: Record<string, unknown> = {};
	const activeThemePropKeys = new Set<string>();

	for (const [key, value] of Object.entries(props)) {
		if (definition.keys.has(key as Extract<keyof Props, string>)) {
			pickedProps[key] = value;
			if (value !== undefined) activeThemePropKeys.add(key);
		} else if (!knownThemePropKeys.has(key)) {
			restProps[key] = value;
		}
	}

	return {
		themeProps: pickedProps as Props,
		restProps: restProps as Omit<T, keyof Props>,
		activeThemePropKeys,
	};
}

export function resolveThemeProps<Props extends object, T extends object & Partial<Props>>(
	props: T,
	definition: ThemePropDefinition<Props>,
): {
	themeProps: Props;
	restProps: Omit<T, keyof Props>;
	styles: StyleXStyles[];
} {
	const { activeThemePropKeys, restProps, themeProps } = extractThemeProps(props, definition);
	if (activeThemePropKeys.size === 0) return { themeProps, restProps, styles: [] };

	const styles = definition.leaves.flatMap((leaf) =>
		leaf.keys.some((key) => activeThemePropKeys.has(key)) ? leaf.compile(themeProps) : [],
	);
	return { themeProps, restProps, styles };
}
