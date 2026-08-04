import {
	Badge,
	Box,
	type BoxThemeProps,
	Button,
	type ButtonProps,
	Card,
	type CardProps,
	Checkbox,
	CheckboxGroup,
	type CheckboxGroupProps,
	type CheckboxProps,
	ComboboxField,
	type ComboboxFieldProps,
	type ComboboxMultipleProps,
	type ContainerSize,
	type EmptyStateProps,
	type GridLayoutProps,
	Heading,
	type IconButtonProps,
	NumberField,
	type NumberFieldInputWidth,
	type NumberFieldProps,
	Radio,
	type RadioGroupProps,
	type RadioProps,
	Select,
	Stack,
	type SpaceStep,
	type FlexProps,
	type StackThemeProps,
	Switch,
	type SwitchProps,
	Text,
	TextField,
	type TextFieldProps,
	type TextareaProps,
	type ToggleProps,
} from "@/components";

export const publicGroupedThemeTypes: FlexProps & GridLayoutProps = {
	columns: 3,
	gap: 2,
	orientation: "vertical",
};

export const tokenDerivedThemeValues = {
	container: "container.3xl" as const,
	space: 1.5 as const,
} satisfies { container: ContainerSize; space: SpaceStep };

export const publicLayoutThemeTypes: BoxThemeProps & StackThemeProps = {
	gap: 2,
	p: 4,
};

type HasKey<Props, Key extends PropertyKey> = Key extends keyof Props ? true : false;

export const themePropExclusions = {
	buttonBg: false as HasKey<ButtonProps, "bg">,
	buttonColor: false as HasKey<ButtonProps, "color">,
	cardBg: false as HasKey<CardProps, "bg">,
	cardColor: false as HasKey<CardProps, "color">,
	checkboxBg: false as HasKey<CheckboxProps, "bg">,
	checkboxColor: false as HasKey<CheckboxProps, "color">,
	checkboxGroupBg: false as HasKey<CheckboxGroupProps, "bg">,
	checkboxGroupColor: false as HasKey<CheckboxGroupProps, "color">,
	comboboxBg: false as HasKey<ComboboxFieldProps, "bg">,
	comboboxColor: false as HasKey<ComboboxFieldProps, "color">,
	comboboxMultipleBg: false as HasKey<ComboboxMultipleProps, "bg">,
	comboboxMultipleColor: false as HasKey<ComboboxMultipleProps, "color">,
	emptyStateBg: false as HasKey<EmptyStateProps, "bg">,
	emptyStateColor: false as HasKey<EmptyStateProps, "color">,
	iconButtonBg: false as HasKey<IconButtonProps, "bg">,
	iconButtonColor: false as HasKey<IconButtonProps, "color">,
	numberFieldBg: false as HasKey<NumberFieldProps, "bg">,
	numberFieldColor: false as HasKey<NumberFieldProps, "color">,
	radioBg: false as HasKey<RadioProps, "bg">,
	radioColor: false as HasKey<RadioProps, "color">,
	radioGroupBg: false as HasKey<RadioGroupProps, "bg">,
	radioGroupColor: false as HasKey<RadioGroupProps, "color">,
	selectBg: false as HasKey<Select.SelectRootProps<string>, "bg">,
	selectColor: false as HasKey<Select.SelectRootProps<string>, "color">,
	switchBg: false as HasKey<SwitchProps, "bg">,
	switchColor: false as HasKey<SwitchProps, "color">,
	textFieldBg: false as HasKey<TextFieldProps, "bg">,
	textFieldColor: false as HasKey<TextFieldProps, "color">,
	textareaBg: false as HasKey<TextareaProps, "bg">,
	textareaColor: false as HasKey<TextareaProps, "color">,
	toggleBg: false as HasKey<ToggleProps, "bg">,
	toggleColor: false as HasKey<ToggleProps, "color">,
} satisfies Record<string, false>;

export const numberFieldContract: {
	hasInputWidth: HasKey<NumberFieldProps, "inputWidth">;
	inputWidth: NumberFieldInputWidth;
} = {
	hasInputWidth: true,
	inputWidth: "7ch",
};

export const validThemePropExamples = (
	<>
		<Box
			bg="surface"
			color="fg"
			insetEnd={-2}
			insetStart={2}
			m={2}
			maxWidth="container.3xl"
			position="relative"
			width="2/3"
		/>
		<Stack gap={4} orientation="horizontal" />
		<Card orientation="horizontal" radius="lg" shadow="lg" />
		<Button width="full" p={3} />
		<Badge mb={2}>Status</Badge>
		<Text mb={2} ms="auto" textAlign="center" />
		<Heading me={-2} textAlign="end" />
		<NumberField label="Seats" inputWidth="7ch" width="full" />
		<TextField gap={2} label="Name" orientation="horizontal" />
		<Checkbox label="Updates" />
		<Radio label="Daily" value="daily" />
		<Switch label="Notifications" />
		<ComboboxField items={["One"]} label="Choice" />
		<Select.Root defaultValue="one" />
	</>
);

export const invalidThemePropExamples = (
	<>
		{/* @ts-expect-error Card intentionally has no shared color prop. */}
		<Card color="fg" />
		{/* @ts-expect-error Button intentionally has no shared background prop. */}
		<Button bg="bgAccent" />
		{/* @ts-expect-error Field wrappers intentionally have no shared color prop. */}
		<TextField color="fg" label="Name" />
		{/* @ts-expect-error Field wrappers intentionally have no shared background prop. */}
		<Switch bg="surface" label="Notifications" />
		{/* @ts-expect-error Padding accepts only defined nonnegative token steps. */}
		<Box p={11} />
		{/* @ts-expect-error Padding never accepts negative token steps. */}
		<Box p={-2} />
		{/* @ts-expect-error Gap never accepts negative token steps. */}
		<Stack gap={-2} />
		{/* @ts-expect-error Physical inline spacing names are not part of the API. */}
		<Box ml={2} />
		{/* @ts-expect-error Positioning uses the inset-prefixed logical name. */}
		<Box start={2} />
		<Box width="calc(100% - 2rem)" height="40px" maxWidth="none" />
		{/* @ts-expect-error None is valid only for max dimensions. */}
		<Box height="none" />
		{/* @ts-expect-error Fractions are a width-only convenience. */}
		<Box height="1/2" />
		{/* @ts-expect-error Fractions are a width-only convenience. */}
		<Box maxWidth="1/3" />
		{/* @ts-expect-error Fractions are a width-only convenience. */}
		<Box flexBasis="3/4" />
		{/* @ts-expect-error Typography spacing is numeric rather than numeric strings. */}
		<Text mb="2" />
		{/* @ts-expect-error Typography uses textAlign, with no align alias. */}
		<Heading align="center" />
		{/* @ts-expect-error Theme props are scalar; responsive sets belong in predeclared StyleX styles. */}
		<Card orientation={{ default: "vertical", md: "horizontal" }} />
		{/* @ts-expect-error Theme props are scalar; responsive sets belong in predeclared StyleX styles. */}
		<Button width={{ md: "full" }} />
		{/* @ts-expect-error Theme props are scalar; responsive sets belong in predeclared StyleX styles. */}
		<Badge width={{ md: "full" }}>Status</Badge>
		{/* @ts-expect-error Theme props are scalar; responsive sets belong in predeclared StyleX styles. */}
		<Text mb={{ md: 2 }} />
		{/* @ts-expect-error Theme props are scalar; responsive sets belong in predeclared StyleX styles. */}
		<TextField label="Name" orientation={{ md: "horizontal" }} />
		{/* @ts-expect-error Theme props are scalar; responsive sets belong in predeclared StyleX styles. */}
		<CheckboxGroup label="Choices" inline={{ md: true }} />
		{/* @ts-expect-error Layout primitive theme props are scalar too. */}
		<Box bg={{ md: "surface" }} />
		{/* @ts-expect-error Layout primitive theme props are scalar too. */}
		<Box shadow={{ md: "lg" }} />
		{/* @ts-expect-error Responsive grid spans use predeclared StyleX styles. */}
		<Box columnSpan={{ default: 12, md: 6 }} />
		{/* @ts-expect-error Responsive objects are not part of the theme-prop contract. */}
		<Box width={{ tablet: "full" }} />
	</>
);
