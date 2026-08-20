import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { CheckboxGroup as BaseCheckboxGroup } from "@base-ui/react/checkbox-group";
import { Field } from "@base-ui/react/field";
import { Fieldset } from "@base-ui/react/fieldset";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { createContext, useContext, useId, type ReactNode } from "react";
import { media } from "@/styles/constants.stylex";
import { resolveThemeProps } from "@/theme/theme-props";
import type { FieldThemeProps } from "@/components/field/field.types";
import { fieldChoiceGroupStyles, fieldStyles, fieldThemeProps, labelMarker } from "@/components/field/field.stylex";
import { textStyles } from "@/components/text/text.stylex";
import { focusRing } from "@/styles/recipes/focus";
import { pressable } from "@/styles/recipes/transitions";
import { tokens } from "@/theme/tokens.stylex";
import { VisuallyHidden } from "@/components/visually-hidden/visually-hidden";
import { attrJoin } from "@/utils/attr-join";
import { Icon } from "@/components/icons";

export type CheckboxSize = "sm" | "md";

const ENABLED_HOVER = ":hover:not([data-disabled],[data-readonly])";
const ENABLED_ACTIVE = ":active:not([data-disabled],[data-readonly])";

export type CheckboxProps = Omit<
	BaseCheckbox.Root.Props,
	"children" | "className" | "color" | "style" | keyof FieldThemeProps
> &
	FieldThemeProps & {
		label: ReactNode;
		description?: ReactNode;
		/** Hides the label visually while keeping it available to assistive tech. */
		visuallyHideLabel?: boolean;
		invalid?: boolean;
		size?: CheckboxSize;
		className?: string;
		/** StyleX overrides, applied after the component's own styles. */
		style?: StyleXStyles;
	};

export type CheckboxGroupProps = Omit<
	BaseCheckboxGroup.Props,
	"className" | "color" | "style" | keyof FieldThemeProps
> &
	FieldThemeProps & {
		label?: ReactNode;
		description?: ReactNode;
		name?: string;
		/** Displays the group items in a horizontal row that wraps when needed. */
		inline?: boolean;
		size?: CheckboxSize;
		className?: string;
		/** StyleX overrides, applied after the component's own styles. */
		style?: StyleXStyles;
	};

const CheckboxGroupFieldContext = createContext<{
	disabled: boolean;
	inGroup: boolean;
	size?: CheckboxSize;
}>({ disabled: false, inGroup: false });

export function Checkbox({
	ref,
	label,
	description,
	visuallyHideLabel = false,
	className,
	style,
	disabled,
	invalid,
	readOnly,
	required,
	size,
	id: providedId,
	"aria-describedby": ariaDescribedBy,
	...props
}: CheckboxProps) {
	const { restProps, styles } = resolveThemeProps(props, fieldThemeProps);
	const groupContext = useContext(CheckboxGroupFieldContext);
	const isDisabled = Boolean(disabled || groupContext.disabled);
	const resolvedSize = size ?? groupContext.size ?? "md";
	const generatedId = useId();
	const id = providedId ?? `${generatedId}-control`;
	const descriptionId = description ? `${generatedId}-description` : undefined;
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
	const content = (
		<>
			<Field.Label
				data-disabled={isDisabled ? "" : undefined}
				data-readonly={readOnly ? "" : undefined}
				{...stylex.props(labelMarker, checkboxParts.labelRoot)}>
				<BaseCheckbox.Root
					ref={ref}
					id={id}
					disabled={isDisabled}
					readOnly={readOnly}
					required={required}
					aria-describedby={attrJoin(ariaDescribedBy, descriptionId) || undefined}
					aria-invalid={invalid || undefined}
					data-invalid={invalid ? "" : undefined}
					{...stylex.props(
						checkboxParts.control,
						checkboxControlSizeStyles[resolvedSize],
						focusRing.offset,
						pressable.transition,
					)}
					{...restProps}>
					<BaseCheckbox.Indicator
						{...stylex.props(checkboxParts.indicator, checkboxParts.indicatorTransition)}
						render={(indicatorProps, state) => (
							<span {...indicatorProps}>
								{state.indeterminate ? (
									<Icon.Minus width="100%" height="100%" strokeWidth={3} />
								) : (
									<Icon.Checkmark width="100%" height="100%" strokeWidth={3} />
								)}
							</span>
						)}
					/>
				</BaseCheckbox.Root>
				{visuallyHideLabel ? (
					<VisuallyHidden>{labelContent}</VisuallyHidden>
				) : (
					<span {...stylex.props(checkboxLabelStyles[resolvedSize])}>{labelContent}</span>
				)}
			</Field.Label>
			{description ? (
				<Field.Description
					id={descriptionId}
					{...stylex.props(
						fieldStyles.description,
						checkboxParts.description,
						checkboxDescriptionStyles[resolvedSize],
					)}>
					{description}
				</Field.Description>
			) : null}
		</>
	);
	const containerSx = stylex.props(checkboxParts.item, ...styles, style);
	const containerClassName = attrJoin(containerSx.className, className);

	return groupContext.inGroup ? (
		<Field.Item
			disabled={isDisabled}
			data-invalid={invalid ? "" : undefined}
			data-readonly={readOnly ? "" : undefined}
			className={containerClassName}
			style={containerSx.style}>
			{content}
		</Field.Item>
	) : (
		<Field.Root
			disabled={isDisabled}
			invalid={invalid}
			data-readonly={readOnly ? "" : undefined}
			className={containerClassName}
			style={containerSx.style}>
			{content}
		</Field.Root>
	);
}

export function CheckboxGroup({
	ref,
	label,
	description,
	children,
	className,
	style,
	disabled,
	inline = false,
	size,
	"aria-describedby": ariaDescribedBy,
	name,
	...props
}: CheckboxGroupProps) {
	const { restProps, styles } = resolveThemeProps(props, fieldThemeProps);
	const parentGroupContext = useContext(CheckboxGroupFieldContext);
	const isDisabled = Boolean(disabled || parentGroupContext.disabled);
	const resolvedSize = size ?? parentGroupContext.size ?? "md";
	const generatedId = useId();
	const descriptionId = description ? `${generatedId}-description` : undefined;
	const groupSx = stylex.props(checkboxParts.group, ...styles, style);

	return (
		<Field.Root
			name={name}
			disabled={isDisabled}
			render={
				<Fieldset.Root
					disabled={isDisabled}
					render={
						<BaseCheckboxGroup
							ref={ref}
							disabled={isDisabled}
							aria-describedby={attrJoin(ariaDescribedBy, descriptionId) || undefined}
							{...restProps}
						/>
					}
				/>
			}
			className={attrJoin(groupSx.className, className)}
			style={groupSx.style}>
			{label ? (
				<Fieldset.Legend {...stylex.props(fieldStyles.groupLabel, checkboxParts.legend)}>{label}</Fieldset.Legend>
			) : null}
			{description ? (
				<p id={descriptionId} {...stylex.props(fieldStyles.description, checkboxParts.groupDescription)}>
					{description}
				</p>
			) : null}
			<CheckboxGroupFieldContext.Provider value={{ disabled: isDisabled, inGroup: true, size: resolvedSize }}>
				<div {...stylex.props(fieldChoiceGroupStyles.root, inline && fieldChoiceGroupStyles.inline)}>{children}</div>
			</CheckboxGroupFieldContext.Provider>
		</Field.Root>
	);
}

const checkboxControlSizeStyles = stylex.create({
	sm: {
		height: tokens["--size-indicator-sm"],
		width: tokens["--size-indicator-sm"],
	},
	md: {
		height: tokens["--size-indicator-md"],
		width: tokens["--size-indicator-md"],
	},
});

const checkboxLabelStyles = {
	sm: textStyles.supporting,
	md: textStyles.label,
} as const satisfies Record<CheckboxSize, StyleXStyles>;

const checkboxDescriptionStyles = stylex.create({
	sm: {
		paddingInlineStart: `calc(${tokens["--size-indicator-sm"]} + ${tokens["--space-2"]} + 2px)`,
	},
	md: {
		paddingInlineStart: `calc(${tokens["--size-indicator-md"]} + ${tokens["--space-2"]} + 2px)`,
	},
});

const checkboxParts = stylex.create({
	group: {
		margin: 0,
		padding: 0,
		borderWidth: 0,
		gap: tokens["--space-2"],
		display: "flex",
		flexDirection: "column",
		minInlineSize: 0,
	},
	legend: {
		padding: 0,
	},
	groupDescription: {
		marginBlockEnd: tokens["--space-2"],
	},
	item: {
		gap: 0,
		color: {
			"[data-disabled]": tokens["--fg-subtle"],
			default: tokens["--fg"],
		},
		cursor: {
			"[data-disabled]": "not-allowed",
			default: "default",
		},
		display: "flex",
		flexDirection: "column",
		width: "fit-content",
	},
	labelRoot: {
		"--_checkbox-bg": {
			[ENABLED_ACTIVE]: tokens["--surface-subtle-active"],
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[ENABLED_HOVER]: {
				[media.canHover]: tokens["--surface-subtle"],
			},
			default: tokens["--surface"],
		},
		"--_checkbox-bg-checked": {
			[ENABLED_ACTIVE]: tokens["--bg-primary"],
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[ENABLED_HOVER]: {
				[media.canHover]: tokens["--bg-primary-highlight"],
			},
			default: tokens["--bg-primary"],
		},
		"--_checkbox-border": {
			[ENABLED_ACTIVE]: tokens["--bg-primary-highlight"],
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[ENABLED_HOVER]: {
				[media.canHover]: tokens["--border-input-hover"],
			},
			default: tokens["--border-input"],
		},
		"--_checkbox-press-scale": {
			[ENABLED_ACTIVE]: "0.94",
			default: "1",
		},
		"--_checkbox-radius": {
			default: tokens["--radius-xs"],
		},
		gap: tokens["--space-2"],
		alignItems: "flex-start",
		color: {
			"[data-disabled]": tokens["--fg-subtle"],
			"[data-readonly]": tokens["--fg-muted"],
			default: tokens["--fg"],
		},
		cursor: "inherit",
		display: "inline-flex",
	},
	control: {
		padding: 2,
		borderColor: {
			"[data-checked]": tokens["--fg-accent"],
			"[data-checked][data-disabled]": tokens["--border"],
			"[data-disabled]": tokens["--border-disabled"],
			"[data-indeterminate]": "var(--_checkbox-bg-checked)",
			"[data-indeterminate][data-disabled]": tokens["--border"],
			"[data-indeterminate][data-readonly]": tokens["--border-input"],
			"[data-invalid]": tokens["--fg-error"],
			"[data-readonly]": tokens["--border-input"],
			default: "var(--_checkbox-border)",
		},
		borderRadius: "var(--_checkbox-radius)",
		borderStyle: "solid",
		borderWidth: "1px",
		alignItems: "center",
		backgroundColor: {
			"[data-checked]": "var(--_checkbox-bg-checked)",
			"[data-checked][data-disabled]": tokens["--surface-subtle"],
			"[data-checked][data-invalid]": tokens["--bg-error-primary"],
			"[data-checked][data-readonly]": tokens["--surface"],
			"[data-readonly]": tokens["--surface"],
			default: "var(--_checkbox-bg)",
		},
		display: "inline-flex",
		flexShrink: 0,
		justifyContent: "center",
		marginBlockStart: 1,
		position: "relative",
		transform: {
			"[data-disabled]": "scale(1)",
			"[data-readonly]": "scale(1)",
			default: "scale(var(--_checkbox-press-scale))",
		},
		"::after": {
			inset: 0,
			borderRadius: "calc(var(--_checkbox-radius) - 1px)",
			boxShadow: `0 -1px 0 ${tokens["--color-white-a3"]}, 0 1px ${tokens["--color-black-a2"]}`,
			content: "''",
			position: "absolute",
			zIndex: 1,
		},
	},
	indicator: {
		alignItems: "center",
		color: {
			"[data-disabled]": tokens["--fg-subtle"],
			"[data-indeterminate]": "var(--_checkbox-bg-checked)",
			"[data-invalid]": tokens["--fg-accent-contrast"],
			"[data-readonly]": tokens["--fg"],
			default: tokens["--fg-accent-contrast"],
		},
		display: "flex",
		filter: {
			"[data-disabled]": null,
			default: `drop-shadow(0 1px 1px ${tokens["--color-black-a3"]})`,
		},
		justifyContent: "center",
		height: "100%",
		width: "100%",
	},
	indicatorTransition: {
		opacity: {
			"[data-ending-style]": 0,
			"[data-starting-style]": 1,
			default: 1,
		},
		transform: {
			"[data-ending-style]": "scale(0)",
			"[data-starting-style]": "scale(0.5)",
			default: "scale(1)",
		},
		transitionDuration: tokens["--motion-duration-medium"],
		transitionProperty: "transform, opacity",
		transitionTimingFunction: tokens["--motion-ease-out"],
	},
	description: {
		margin: 0,
	},
});
