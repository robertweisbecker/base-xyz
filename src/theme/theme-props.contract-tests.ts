import {
	defineThemePropKeys,
	type VerifyThemeProps,
} from "./theme-props";
import type { MarginProps, PaddingProps } from "./theme-props.types";

export const exactMarginKeys = defineThemePropKeys<MarginProps>()([
	"m",
	"mx",
	"my",
	"mt",
	"mb",
	"ms",
	"me",
] as const);

// @ts-expect-error Every public capability key must have a runtime key.
export const incompleteMarginKeys = defineThemePropKeys<MarginProps>()(["m", "mx"] as const);

export const extraMarginKeys = defineThemePropKeys<MarginProps>()([
	"m",
	"mx",
	"my",
	"mt",
	"mb",
	"ms",
	"me",
	// @ts-expect-error Runtime keys cannot exceed the public capability contract.
	"marginLeft",
] as const);

type MarginDefinition = { readonly __themeProps?: MarginProps };
type PaddingDefinition = { readonly __themeProps?: PaddingProps };
type NumericValueDefinition = { readonly __themeProps?: { value?: number } };
type StringValueProps = { value?: string };

export type MatchingThemeProps = VerifyThemeProps<MarginProps, MarginDefinition>;
export type MismatchedThemeProps = VerifyThemeProps<MarginProps, PaddingDefinition>;
export type IncompatibleValueThemeProps = VerifyThemeProps<StringValueProps, NumericValueDefinition>;

export const matchingThemeProps: MatchingThemeProps = {};
// @ts-expect-error A component contract must exactly match its runtime definition.
export const mismatchedThemeProps: MismatchedThemeProps = {};
// @ts-expect-error Matching keys with incompatible values are not an exact contract.
export const incompatibleValueThemeProps: IncompatibleValueThemeProps = {};
