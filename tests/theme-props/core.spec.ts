import { expect, test } from "@playwright/test";
import {
	composeThemeProps,
	createThemePropDefinition,
	defineThemePropKeys,
	extractThemeProps,
	resolveThemeProps,
} from "../../src/theme/theme-props";

test("unsupported known theme props are removed instead of reaching the rendered root", () => {
	type WidthProps = { width?: string };
	const widthKeys = defineThemePropKeys<WidthProps>()(["width"]);
	const widthThemeProps = createThemePropDefinition<WidthProps>(widthKeys, () => []);

	const result = extractThemeProps(
		{ bg: "surface", id: "root", title: "Example", width: "full" },
		widthThemeProps,
	);

	expect(result.themeProps).toEqual({ width: "full" });
	expect(result.restProps).toEqual({ id: "root", title: "Example" });
});

test("composing the same theme prop twice fails immediately", () => {
	type GapProps = { gap?: number };
	const gapKeys = defineThemePropKeys<GapProps>()(["gap"]);
	const first = createThemePropDefinition<GapProps>(gapKeys, () => []);
	const second = createThemePropDefinition<GapProps>(gapKeys, () => []);

	expect(() => composeThemeProps(first, second)).toThrow('Theme prop "gap" was composed more than once.');
});

test("only leaves containing active props are compiled", () => {
	type GapProps = { gap?: number };
	type WidthProps = { width?: string };
	const gapKeys = defineThemePropKeys<GapProps>()(["gap"]);
	const widthKeys = defineThemePropKeys<WidthProps>()(["width"]);
	let gapCompilations = 0;
	let widthCompilations = 0;
	const gap = createThemePropDefinition<GapProps>(gapKeys, () => {
		gapCompilations += 1;
		return [];
	});
	const width = createThemePropDefinition<WidthProps>(widthKeys, () => {
		widthCompilations += 1;
		return [];
	});

	resolveThemeProps({ gap: 2 }, composeThemeProps(gap, width));

	expect(gapCompilations).toBe(1);
	expect(widthCompilations).toBe(0);
});
