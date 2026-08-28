import type { BadgeProps } from "@/components/badge/badge";
import type { ButtonProps } from "@/components/button/button";
import type {
	CardContentProps,
	CardDescriptionProps,
	CardFooterProps,
	CardHeaderProps,
	CardRootProps,
	CardTitleProps,
} from "@/components/card/card";
import type { CalloutProps } from "@/components/callout/callout";
import type { CodeBlockProps } from "@/components/code-block/code-block";
import type { ComboboxRootProps } from "@/components/combobox/combobox-field";
import type { DialogCloseProps, DialogPopupProps } from "@/components/dialog/dialog";
import type { EmptyStateProps } from "@/components/empty-state/empty-state";
import type { HeadingProps } from "@/components/heading/heading";
import type { BoxProps } from "@/components/layout/layout";
import type { NumberFieldProps } from "@/components/number-field/number-field";
import type { PopoverPopupProps } from "@/components/popover/popover";
import type { MenuItemProps } from "@/components/menu/menu";
import type { SelectPopupProps, SelectRootProps } from "@/components/select/select";
import type { TabsListProps } from "@/components/tabs/tabs";
import {
	Stepper,
	type StepperContentProps,
	type StepperDescriptionProps,
	type StepperHeadingProps,
	type StepperListProps,
	type StepperMarkerProps,
	type StepperPanelProps,
	type StepperRootProps,
	type StepperStepProps,
	type StepperTitleProps,
} from "@/components/stepper/stepper";
import type { TextFieldProps } from "@/components/text-field/text-field";
import type { TextProps } from "@/components/text/text";
import type { TextareaProps } from "@/components/textarea/textarea";
import type { TooltipPopupProps } from "@/components/tooltip/tooltip";
import type { WorkflowProgressTitleProps } from "@/blocks/workflow-progress/workflow-progress";
import type { SpaceStep, SpaceValue } from "@/styles/props/spacing.stylex";

type Expect<Value extends true> = Value;
type HasKey<Value, Key extends PropertyKey> = Key extends keyof Value ? true : false;
type Not<Value extends boolean> = Value extends true ? false : true;
type Accepts<Value, Candidate> = Candidate extends Value ? true : false;

export type LayoutGatewayContract = [
	Expect<HasKey<BoxProps, "width">>,
	Expect<HasKey<BoxProps, "p">>,
	Expect<HasKey<BoxProps, "position">>,
	Expect<HasKey<BoxProps, "alignSelf">>,
];

export type SemanticRootContract = [
	Expect<HasKey<ButtonProps, "m">>,
	Expect<HasKey<ButtonProps, "ms">>,
	Expect<HasKey<ButtonProps, "xstyle">>,
	Expect<Not<HasKey<ButtonProps, "width">>>,
	Expect<Not<HasKey<ButtonProps, "position">>>,
	Expect<Not<HasKey<ButtonProps, "insetStart">>>,
	Expect<Not<HasKey<ButtonProps, "alignSelf">>>,
	Expect<HasKey<BadgeProps, "m">>,
	Expect<HasKey<BadgeProps, "ms">>,
	Expect<HasKey<BadgeProps, "xstyle">>,
	Expect<Not<HasKey<BadgeProps, "width">>>,
	Expect<Not<HasKey<BadgeProps, "position">>>,
	Expect<Not<HasKey<BadgeProps, "insetStart">>>,
	Expect<Not<HasKey<BadgeProps, "alignSelf">>>,
];

export type CompositionContract = [
	Expect<HasKey<CalloutProps, "m">>,
	Expect<Not<HasKey<CalloutProps, "p">>>,
	Expect<Not<HasKey<CalloutProps, "width">>>,
	Expect<HasKey<EmptyStateProps, "m">>,
	Expect<Not<HasKey<EmptyStateProps, "p">>>,
	Expect<Not<HasKey<EmptyStateProps, "width">>>,
	Expect<HasKey<CardRootProps, "m">>,
	Expect<Not<HasKey<CardRootProps, "p">>>,
	Expect<Not<HasKey<CardRootProps, "width">>>,
	Expect<Not<HasKey<CardHeaderProps, "m">>>,
	Expect<Not<HasKey<CardContentProps, "m">>>,
	Expect<Not<HasKey<CardFooterProps, "m">>>,
	Expect<Not<HasKey<CardTitleProps, "m">>>,
	Expect<Not<HasKey<CardDescriptionProps, "m">>>,
];

export type TypographyContract = [
	Expect<HasKey<TextProps, "m">>,
	Expect<HasKey<TextProps, "size">>,
	Expect<HasKey<TextProps, "fontWeight">>,
	Expect<HasKey<TextProps, "textAlign">>,
	Expect<Not<HasKey<TextProps, "fontSize">>>,
	Expect<Not<HasKey<TextProps, "lineHeight">>>,
	Expect<Not<HasKey<TextProps, "position">>>,
	Expect<Not<HasKey<TextProps, "alignSelf">>>,
	Expect<HasKey<HeadingProps, "m">>,
	Expect<HasKey<HeadingProps, "size">>,
	Expect<HasKey<HeadingProps, "fontWeight">>,
	Expect<HasKey<HeadingProps, "textAlign">>,
	Expect<Not<HasKey<HeadingProps, "fontSize">>>,
	Expect<Not<HasKey<HeadingProps, "lineHeight">>>,
	Expect<Not<HasKey<HeadingProps, "position">>>,
	Expect<Not<HasKey<HeadingProps, "alignSelf">>>,
];

export type FieldWrapperContract = [
	Expect<HasKey<TextFieldProps, "m">>,
	Expect<HasKey<TextareaProps, "m">>,
	Expect<HasKey<NumberFieldProps, "m">>,
	Expect<HasKey<SelectRootProps<string>, "m">>,
	Expect<HasKey<ComboboxRootProps<string>, "m">>,
];

export type DelegatedMarginContract = [
	Expect<HasKey<CodeBlockProps, "m">>,
	Expect<HasKey<CodeBlockProps, "id">>,
	Expect<HasKey<CodeBlockProps, "aria-label">>,
	Expect<HasKey<CodeBlockProps, "onCopy">>,
];

export type PositionedSurfaceContract = [
	Expect<Not<HasKey<DialogPopupProps, "m">>>,
	Expect<HasKey<DialogPopupProps, "className">>,
	Expect<HasKey<DialogPopupProps, "style">>,
	Expect<HasKey<DialogPopupProps, "xstyle">>,
	Expect<Not<HasKey<PopoverPopupProps, "m">>>,
	Expect<HasKey<PopoverPopupProps, "style">>,
	Expect<HasKey<PopoverPopupProps, "xstyle">>,
	Expect<Not<HasKey<TooltipPopupProps, "m">>>,
	Expect<HasKey<TooltipPopupProps, "style">>,
	Expect<HasKey<TooltipPopupProps, "xstyle">>,
];

export type StyledSurfaceEscapeHatchContract = [
	Expect<HasKey<DialogCloseProps, "className">>,
	Expect<HasKey<DialogCloseProps, "style">>,
	Expect<HasKey<DialogCloseProps, "xstyle">>,
	Expect<HasKey<MenuItemProps, "className">>,
	Expect<HasKey<MenuItemProps, "style">>,
	Expect<HasKey<MenuItemProps, "xstyle">>,
	Expect<HasKey<SelectPopupProps, "style">>,
	Expect<HasKey<SelectPopupProps, "xstyle">>,
	Expect<HasKey<TabsListProps, "style">>,
	Expect<HasKey<TabsListProps, "xstyle">>,
	Expect<HasKey<WorkflowProgressTitleProps, "style">>,
	Expect<HasKey<WorkflowProgressTitleProps, "xstyle">>,
];

export type StepperContract = [
	Expect<Not<HasKey<typeof Stepper, "Previous">>>,
	Expect<Not<HasKey<typeof Stepper, "Next">>>,
	Expect<HasKey<StepperRootProps, "m">>,
	Expect<HasKey<StepperRootProps, "ms">>,
	Expect<HasKey<StepperRootProps, "style">>,
	Expect<HasKey<StepperRootProps, "xstyle">>,
	Expect<Accepts<StepperRootProps["defaultValue"], null>>,
	Expect<Accepts<StepperRootProps["value"], null>>,
	Expect<Not<HasKey<StepperRootProps, "width">>>,
	Expect<Not<HasKey<StepperRootProps, "position">>>,
	Expect<Not<HasKey<StepperRootProps, "p">>>,
	Expect<HasKey<StepperListProps, "style">>,
	Expect<HasKey<StepperListProps, "xstyle">>,
	Expect<Not<HasKey<StepperListProps, "m">>>,
	Expect<HasKey<StepperStepProps, "style">>,
	Expect<HasKey<StepperStepProps, "xstyle">>,
	Expect<Not<HasKey<StepperStepProps, "m">>>,
	Expect<HasKey<StepperMarkerProps, "style">>,
	Expect<HasKey<StepperMarkerProps, "xstyle">>,
	Expect<Not<HasKey<StepperMarkerProps, "m">>>,
	Expect<HasKey<StepperHeadingProps, "style">>,
	Expect<HasKey<StepperHeadingProps, "xstyle">>,
	Expect<Not<HasKey<StepperHeadingProps, "m">>>,
	Expect<HasKey<StepperTitleProps, "style">>,
	Expect<HasKey<StepperTitleProps, "xstyle">>,
	Expect<Not<HasKey<StepperTitleProps, "m">>>,
	Expect<HasKey<StepperDescriptionProps, "style">>,
	Expect<HasKey<StepperDescriptionProps, "xstyle">>,
	Expect<Not<HasKey<StepperDescriptionProps, "m">>>,
	Expect<HasKey<StepperContentProps, "style">>,
	Expect<HasKey<StepperContentProps, "xstyle">>,
	Expect<Not<HasKey<StepperContentProps, "m">>>,
	Expect<HasKey<StepperPanelProps, "style">>,
	Expect<HasKey<StepperPanelProps, "xstyle">>,
	Expect<Not<HasKey<StepperPanelProps, "m">>>,
	Expect<Not<HasKey<StepperListProps, "width">>>,
	Expect<Not<HasKey<StepperStepProps, "position">>>,
	Expect<Not<HasKey<StepperContentProps, "p">>>,
];

export type SpacingValueContract = [
	Expect<Accepts<SpaceStep, 0>>,
	Expect<Accepts<SpaceStep, 0.5>>,
	Expect<Accepts<SpaceStep, 16>>,
	Expect<Not<Accepts<SpaceStep, 2.5>>>,
	Expect<Accepts<SpaceValue, -0.5>>,
	Expect<Accepts<SpaceValue, -16>>,
	Expect<Accepts<SpaceValue, "auto">>,
	Expect<Accepts<SpaceValue, "calc(1rem + 1vw)">>,
	Expect<Not<Accepts<SpaceValue, 2.5>>>,
	Expect<Accepts<BoxProps["p"], "1.25rem">>,
	Expect<Accepts<SpaceValue, "clamp(0.5rem, 2vw, 2rem)">>,
	Expect<Accepts<BoxProps["insetTop"], "var(--floating-offset)">>,
];
