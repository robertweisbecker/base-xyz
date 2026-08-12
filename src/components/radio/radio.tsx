import { Radio as BaseRadio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import { Field } from "@base-ui/react/field";
import { Fieldset } from "@base-ui/react/fieldset";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { createContext, useContext, useId, type ReactNode } from "react";
import { resolveThemeProps } from "@/theme/theme-props";
import type { FieldThemeProps } from "@/components/field/field.types";
import { fieldChoiceGroupStyles, fieldStyles, fieldThemeProps, labelMarker } from "@/components/field/field.stylex";
import { textStyles } from "@/components/text/text.stylex";
import { focusRing } from "@/styles/recipes/focus";
import { pressable } from "@/styles/recipes/transitions";
import { tokens } from "@/theme/tokens.stylex";
import { VisuallyHidden } from "@/components/visually-hidden/visually-hidden";

export type RadioSize = "sm" | "md";

export type RadioProps = Omit<
	BaseRadio.Root.Props,
	"children" | "className" | "color" | "style" | keyof FieldThemeProps
> &
	FieldThemeProps & {
		label: ReactNode;
		description?: ReactNode;
		/** Hides the label visually while keeping it available to assistive tech. */
		visuallyHideLabel?: boolean;
		size?: RadioSize;
		className?: string;
		/** StyleX overrides, applied after the component's own styles. */
		style?: StyleXStyles;
	};

export type RadioGroupProps = Omit<BaseRadioGroup.Props, "className" | "color" | "style" | keyof FieldThemeProps> &
	FieldThemeProps & {
		label: ReactNode;
		description?: ReactNode;
		/** Displays the group items in a horizontal row that wraps when needed. */
		inline?: boolean;
		size?: RadioSize;
		className?: string;
		/** StyleX overrides, applied after the component's own styles. */
		style?: StyleXStyles;
	};

const RadioGroupStateContext = createContext<{
	disabled: boolean;
	readOnly: boolean;
	size?: RadioSize;
}>({ disabled: false, readOnly: false });

export function Radio({
	ref,
	label,
	description,
	visuallyHideLabel = false,
	className,
	style,
	disabled,
	required,
	size,
	id: providedId,
	"aria-describedby": ariaDescribedBy,
	...props
}: RadioProps) {
	const { restProps, styles } = resolveThemeProps(props, fieldThemeProps);
	const groupState = useContext(RadioGroupStateContext);
	const selfOrGroupDisabled = Boolean(disabled || groupState.disabled);
	// const selfOrGroupReadOnly = Boolean(readOnly || groupState.readOnly);
	const resolvedSize = size ?? groupState.size ?? "md";
	const generatedId = useId();
	const id = providedId ?? `${generatedId}-control`;
	const descriptionId = description ? `${generatedId}-description` : undefined;
	const itemSx = stylex.props(radioParts.item, ...styles, style);
	const itemClassName = [itemSx.className, className].filter(Boolean).join(" ");
	const labelContent = (
		<>
			{label}
			{required ? (
				<span aria-hidden {...stylex.props(fieldStyles.requiredIndicator)}>
					*
				</span>
			) : null}
		</>
	);

	return (
		<Field.Item
			// SLOP: don't think this is necessary because the parent sets it -
			// data-readonly={selfOrGroupReadOnly ? "" : undefined}
			disabled={selfOrGroupDisabled}
			// ^^ seemingly this one is necessary?
			className={itemClassName}
			style={itemSx.style}>
			<Field.Label htmlFor={id} {...stylex.props(labelMarker, radioParts.labelRoot)}>
				<BaseRadio.Root
					ref={ref}
					id={id}
					// SLOP: don't think this is necessary because the parent sets it -
					// disabled={selfOrGroupDisabled}
					// readOnly={selfOrGroupReadOnly}
					required={required}
					aria-describedby={mergeIds(ariaDescribedBy, descriptionId)}
					{...stylex.props(
						radioParts.control,
						radioControlSizeStyles[resolvedSize],
						focusRing.offset,
						pressable.transition,
					)}
					{...restProps}>
					<BaseRadio.Indicator
						{...stylex.props(
							radioParts.indicator,
							radioIndicatorSizeStyles[resolvedSize],
							radioParts.indicatorTransition,
						)}
					/>
				</BaseRadio.Root>
				{visuallyHideLabel ? (
					<VisuallyHidden>{labelContent}</VisuallyHidden>
				) : (
					<span {...stylex.props(radioLabelStyles[resolvedSize])}>{labelContent}</span>
				)}
			</Field.Label>
			{/* Place description outside of the label so ariaDescribedBy doesn't read twice */}
			{description ? (
				<Field.Description
					id={descriptionId}
					{...stylex.props(fieldStyles.description, radioParts.description, radioDescriptionStyles[resolvedSize])}>
					{description}
				</Field.Description>
			) : null}
		</Field.Item>
	);
}

export function RadioGroup({
	ref,
	label,
	description,
	children,
	className,
	style,
	disabled,
	inline = false,
	readOnly,
	required,
	size = "md",
	"aria-describedby": ariaDescribedBy,
	name,
	...props
}: RadioGroupProps) {
	const { restProps, styles } = resolveThemeProps(props, fieldThemeProps);
	const generatedId = useId();
	const descriptionId = description ? `${generatedId}-description` : undefined;
	const groupSx = stylex.props(radioParts.fieldset, ...styles, style);

	return (
		<Field.Root
			name={name}
			// disabled={disabled}
			render={
				<Fieldset.Root
					render={
						<BaseRadioGroup
							ref={ref}
							name={name}
							// disabled={disabled}
							// readOnly={readOnly}
							// required={required}
							aria-describedby={mergeIds(ariaDescribedBy, descriptionId)}
							{...restProps}
						/>
					}
				/>
			}
			className={[groupSx.className, className].filter(Boolean).join(" ")}
			style={groupSx.style}>
			<div {...stylex.props(radioParts.title)}>
				<Fieldset.Legend {...stylex.props(fieldStyles.groupLabel)}>
					{label}
					{required ? (
						<span aria-hidden {...stylex.props(fieldStyles.requiredIndicator)}>
							*
						</span>
					) : null}
				</Fieldset.Legend>
				{description ? (
					<p id={descriptionId} {...stylex.props(fieldStyles.description, radioParts.fieldsetDescription)}>
						{description}
					</p>
				) : null}
			</div>
			<RadioGroupStateContext.Provider value={{ disabled: Boolean(disabled), readOnly: Boolean(readOnly), size }}>
				<div {...stylex.props(fieldChoiceGroupStyles.root, inline && fieldChoiceGroupStyles.inline)}>{children}</div>
			</RadioGroupStateContext.Provider>
		</Field.Root>
	);
}

function mergeIds(...ids: Array<string | undefined>) {
	return ids.filter(Boolean).join(" ") || undefined;
}

const radioControlSizeStyles = stylex.create({
	sm: {
		height: tokens["--size-indicator-sm"],
		width: tokens["--size-indicator-sm"],
	},
	md: {
		height: tokens["--size-indicator-md"],
		width: tokens["--size-indicator-md"],
	},
});

const radioLabelStyles = {
	sm: textStyles.supporting,
	md: textStyles.label,
} as const satisfies Record<RadioSize, unknown>;

const radioDescriptionStyles = stylex.create({
	sm: {
		paddingInlineStart: `calc(${tokens["--size-indicator-sm"]} + ${tokens["--space-2"]} + 2px)`,
	},
	md: {
		paddingInlineStart: `calc(${tokens["--size-indicator-md"]} + ${tokens["--space-2"]} + 2px)`,
	},
});

const radioIndicatorSizeStyles = stylex.create({
	sm: {
		height: `calc((${tokens["--size-indicator-sm"]} - 2px) / 2)`,
		width: `calc((${tokens["--size-indicator-sm"]} - 2px) / 2)`,
	},
	md: {
		height: `calc((${tokens["--size-indicator-md"]} - 2px) / 2)`,
		width: `calc((${tokens["--size-indicator-md"]} - 2px) / 2)`,
	},
});

const radioParts = stylex.create({
	fieldset: {
		margin: 0,
		padding: 0,
		borderWidth: 0,
		gap: tokens["--space-3"],
		display: "flex",
		flexDirection: "column",
		minInlineSize: 0,
	},
	title: {
		gap: tokens["--space-1"],
		display: "flex",
		flexDirection: "column",
	},
	fieldsetLegend: {
		// fontWeight: fontWeight.regular,
	},
	fieldsetDescription: {
		// margin: 0,
	},
	item: {
		gap: tokens["--space-1"],
		cursor: {
			"[data-disabled]": "not-allowed",
			"[data-readonly]": "default",
			default: "default",
		},
		display: "flex",
		flexDirection: "column",
		opacity: {
			"[data-disabled]": 0.48,
			default: 1,
		},
		width: "fit-content",
	},
	labelRoot: {
		"--_radio-bg": {
			default: tokens["--surface"],
			":hover": {
				"@media (hover: hover) and (pointer: fine)": tokens["--surface-subtle"],
			},
			":active": tokens["--surface-subtle-active"],
		},
		"--_radio-bg-checked": {
			default: tokens["--bg-primary"],
			":hover": {
				"@media (hover: hover) and (pointer: fine)": tokens["--bg-primary-highlight"],
			},
			":active": tokens["--bg-primary-highlight"],
		},
		"--_radio-border": {
			default: tokens["--border-input"],
			":hover": {
				"@media (hover: hover) and (pointer: fine)": tokens["--border-input-hover"],
			},
			":active": tokens["--bg-primary-highlight"],
		},
		"--_radio-press-scale": {
			default: "1",
			":active": "0.94",
		},
		gap: tokens["--space-2"],
		alignItems: "flex-start",
		color: tokens["--fg"],
		cursor: "inherit",
		display: "inline-flex",
	},
	control: {
		borderColor: {
			"[data-checked]": "var(--_radio-bg-checked)",
			"[data-checked][data-disabled]": tokens["--bg-neutral"],
			"[data-checked][data-readonly]": tokens["--fg-muted"],
			"[data-disabled]": tokens["--border-disabled"],
			"[data-readonly]": tokens["--border"],
			default: "var(--_radio-border)",
		},
		borderRadius: tokens["--radius-full"],
		borderStyle: "solid",
		borderWidth: "1px",
		alignItems: "center",
		backgroundColor: {
			"[data-checked]": "var(--_radio-bg-checked)",
			"[data-checked][data-disabled]": tokens["--bg-neutral"],
			"[data-checked][data-readonly]": tokens["--bg-neutral"],
			default: "var(--_radio-bg)",
		},
		display: "inline-flex",
		flexShrink: 0,
		justifyContent: "center",
		marginBlockStart: "1px",
		position: "relative",
		transform: {
			"[data-disabled]": "scale(1)",
			"[data-readonly]": "scale(1)",
			default: "scale(var(--_radio-press-scale))",
		},
		"::after": {
			inset: 0,
			borderRadius: "inherit",
			boxShadow: `0 -1px 0 ${tokens["--color-white-a3"]}, 0 1px 0 ${tokens["--color-black-a2"]}`,
			content: "''",
			position: "absolute",
			zIndex: 1,
		},
	},
	indicator: {
		borderRadius: tokens["--radius-full"],
		backgroundColor: tokens["--fg-accent-contrast"],
		boxShadow: `0 -1px 1px ${tokens["--color-gray-a2"]}, 0 1px 0 ${tokens["--color-black-a3"]}`,
	},
	indicatorTransition: {
		opacity: {
			"[data-ending-style]": 1,
			"[data-starting-style]": 0,
			default: 1,
		},
		transform: {
			"[data-ending-style]": "scale(0.5)",
			"[data-starting-style]": "scale(0.5)",
			default: "scale(1)",
		},
		transitionDuration: {
			default: tokens["--motion-duration-quick"],
			"@media (prefers-reduced-motion: reduce)": "0ms",
		},
		transitionProperty: "transform, opacity",
		transitionTimingFunction: tokens["--motion-ease-out"],
	},
	description: {
		margin: 0,
	},
});
