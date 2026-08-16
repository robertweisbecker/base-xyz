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

export const themePropKeys = {
	display: defineThemePropKeys<DisplayProps>()(["display"]),
	margin: defineThemePropKeys<MarginProps>()(["m", "mx", "my", "mt", "mb", "ms", "me"]),
	padding: defineThemePropKeys<PaddingProps>()(["p", "px", "py", "pt", "pb", "ps", "pe"]),
	sizing: defineThemePropKeys<SizingProps>()(["width", "height", "minWidth", "maxWidth", "minHeight", "maxHeight"]),
	positioning: defineThemePropKeys<PositioningProps>()([
		"position",
		"inset",
		"insetX",
		"insetY",
		"insetTop",
		"insetBottom",
		"insetStart",
		"insetEnd",
		"zIndex",
	]),
	childLayout: defineThemePropKeys<ChildLayoutProps>()([
		"alignSelf",
		"justifySelf",
		"flexBasis",
		"flexGrow",
		"flexShrink",
		"order",
		"columnSpan",
		"rowSpan",
	]),
	surfaceColor: defineThemePropKeys<SurfaceColorProps>()(["color", "bg"]),
	radius: defineThemePropKeys<RadiusThemeProps>()(["radius"]),
	shadow: defineThemePropKeys<ShadowThemeProps>()(["shadow"]),
	gap: defineThemePropKeys<GapProps>()(["gap", "gapX", "gapY"]),
	flexLayout: defineThemePropKeys<FlexLayoutProps>()(["orientation", "reverse", "align", "justify", "wrap"]),
	gridComposition: defineThemePropKeys<GridCompositionProps>()(["columns", "flow", "align", "justify"]),
	textAlign: defineThemePropKeys<TextAlignProps>()(["textAlign"]),
};

const knownThemePropKeys = new Set<string>(Object.values(themePropKeys).flat());

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
export type ThemePropsOf<Definition> = Simplify<DefinitionProps<Definition>>;

export function createThemePropDefinition<Props extends object>(
	keys: readonly Extract<keyof Props, string>[],
	compile: (props: Props) => StyleXStyles[],
): ThemePropDefinition<Props> {
	const leaf: ThemePropLeaf = Object.freeze({
		keys,
		// SAFETY: Each definition compiles only the keys declared for its Props contract.
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
				// SAFETY: Each leaf key originates from a definition included in the Props intersection.
				const typedKey = key as Extract<keyof Props, string>;
				if (keys.has(typedKey)) {
					throw new Error(`Theme prop "${key}" was composed more than once.`);
				}
				keys.add(typedKey);
			}
			leaves.push(leaf);
		}
	}

	return Object.freeze({ keys, leaves });
}

type ExtractedThemeProps<Props, RestProps> = {
	themeProps: Partial<Props>;
	restProps: RestProps;
};

type ResolvedThemeProps<Props, RestProps> = ExtractedThemeProps<Props, RestProps> & {
	styles: StyleXStyles[];
};

export function extractThemeProps<
	Props extends object,
	T extends object & Partial<Props>,
>(
	props: T,
	definition: ThemePropDefinition<Props>,
): ExtractedThemeProps<Props, Omit<T, keyof Props>> {
	const themeProps: Partial<Props> = {};
	const restProps = { ...props };

	for (const [key, value] of Object.entries(props)) {
		// SAFETY: The definition owns the complete runtime key set for Props.
		if (value !== undefined && definition.keys.has(key as Extract<keyof Props, string>)) {
			Object.assign(themeProps, { [key]: value });
		}
		if (knownThemePropKeys.has(key)) Reflect.deleteProperty(restProps, key);
	}

	return { themeProps, restProps };
}

export function resolveThemeProps<
	Props extends object,
	T extends object & Partial<Props>,
>(
	props: T,
	definition: ThemePropDefinition<Props>,
): ResolvedThemeProps<Props, Omit<T, keyof Props>> {
	const { restProps, themeProps } = extractThemeProps(props, definition);

	const styles = definition.leaves.flatMap((leaf) =>
		leaf.keys.some((key) => key in themeProps) ? leaf.compile(themeProps) : [],
	);
	return { themeProps, restProps, styles };
}
