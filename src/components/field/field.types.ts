import type {
	ChildLayoutProps,
	DisplayProps,
	FlexProps,
	PositioningProps,
	RadiusThemeProps,
	ShadowThemeProps,
	SizingProps,
	SpacingProps,
} from "@/theme/theme-props.types";

export type FieldSize = "sm" | "md" | "lg";

/** Theme props owned by the public root of a field component. */
export type FieldThemeProps = SpacingProps &
	SizingProps &
	PositioningProps &
	ChildLayoutProps &
	RadiusThemeProps &
	ShadowThemeProps &
	FlexProps &
	DisplayProps;
