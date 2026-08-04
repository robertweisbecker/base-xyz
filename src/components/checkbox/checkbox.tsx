import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { CheckboxGroup as BaseCheckboxGroup } from "@base-ui/react/checkbox-group";
import { Field } from "@base-ui/react/field";
import { Fieldset } from "@base-ui/react/fieldset";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { createContext, useContext, useId, type ReactNode } from "react";
import { resolveThemeProps } from "@/theme/theme-props";
import type { FieldThemeProps } from "@/components/field/field.types";
import { fieldChoiceGroupStyles, fieldStyles, fieldThemeProps } from "@/components/field/field.stylex";
import { textStyles } from "@/components/text/text.stylex";
import { focusRing } from "@/styles/recipes/focus";
import { pressable } from "@/styles/recipes/transitions";
import { colors, motion, radius, size as sizeToken, space } from "@/styles/tokens.stylex";
import { CheckmarkIcon, IndeterminateIcon } from "../selection-icons";

export type CheckboxSize = "sm" | "md";

export type CheckboxProps = Omit<
	BaseCheckbox.Root.Props,
	"children" | "className" | "color" | "style" | keyof FieldThemeProps
> &
	FieldThemeProps & {
		label: ReactNode;
		description?: ReactNode;
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
	const content = (
		<>
			<Field.Label {...stylex.props(checkboxParts.labelRoot)}>
				<BaseCheckbox.Root
					ref={ref}
					id={id}
					disabled={isDisabled}
					readOnly={readOnly}
					required={required}
					aria-describedby={mergeIds(ariaDescribedBy, descriptionId)}
					aria-invalid={invalid || undefined}
					data-invalid={invalid ? "" : undefined}
					{...stylex.props(
						checkboxParts.control,
						checkboxControlSizeStyles[resolvedSize],
						focusRing.outset,
						pressable.transition,
					)}
					{...restProps}>
					<BaseCheckbox.Indicator
						{...stylex.props(checkboxParts.indicator, checkboxParts.indicatorTransition)}
						render={(indicatorProps, state) => (
							<span {...indicatorProps}>
								{state.indeterminate ? (
									<IndeterminateIcon width="100%" height="100%" strokeWidth={3} />
								) : (
									<CheckmarkIcon width="100%" height="100%" strokeWidth={3} />
								)}
							</span>
						)}
					/>
				</BaseCheckbox.Root>
				<span {...stylex.props(checkboxLabelStyles[resolvedSize])}>
					{label}
					{required ? (
						<span aria-hidden {...stylex.props(fieldStyles.requiredIndicator)}>
							*
						</span>
					) : null}
				</span>
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
	const containerClassName = [containerSx.className, className].filter(Boolean).join(" ");

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
							aria-describedby={mergeIds(ariaDescribedBy, descriptionId)}
							{...restProps}
						/>
					}
				/>
			}
			className={[groupSx.className, className].filter(Boolean).join(" ")}
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

function mergeIds(...ids: Array<string | undefined>) {
	return ids.filter(Boolean).join(" ") || undefined;
}

const checkboxControlSizeStyles = stylex.create({
	sm: {
		height: sizeToken["indicator.sm"],
		width: sizeToken["indicator.sm"],
	},
	md: {
		height: sizeToken["indicator.md"],
		width: sizeToken["indicator.md"],
	},
});

const checkboxLabelStyles = {
	sm: textStyles.supporting,
	md: textStyles.label,
} as const satisfies Record<CheckboxSize, unknown>;

const checkboxDescriptionStyles = stylex.create({
	sm: {
		paddingInlineStart: `calc(${sizeToken["indicator.sm"]} + ${space[2]} + 2px)`,
	},
	md: {
		paddingInlineStart: `calc(${sizeToken["indicator.md"]} + ${space[2]} + 2px)`,
	},
});

const checkboxParts = stylex.create({
	group: {
		margin: 0,
		padding: 0,
		borderWidth: 0,
		gap: space[2],
		display: "flex",
		flexDirection: "column",
		minInlineSize: 0,
	},
	legend: {
		padding: 0,
	},
	groupDescription: {
		marginBlockEnd: space[2],
	},
	item: {
		gap: 0,
		color: {
			"[data-disabled]": colors["--text-subtle"],
			default: colors["--text"],
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
			default: colors["--surface"],
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			":hover:not([data-disabled])": {
				"@media (hover: hover) and (pointer: fine)": colors["--surface-subtle"],
			},
			":active": colors["--surface-subtle-active"],
		},
		"--_checkbox-bg-checked": {
			default: colors["--accent"],
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			":hover:not([data-disabled])": {
				"@media (hover: hover) and (pointer: fine)": colors["--accent-hover"],
			},
			":active": colors["--accent"],
		},
		"--_checkbox-border": {
			default: colors["--border-strong"],
			":active:hover": colors["--accent-hover"],
			":hover": {
				"@media (hover: hover) and (pointer: fine)": colors["--border-hover"],
			},
		},
		"--_checkbox-press-scale": {
			default: "1",
			":active": "0.94",
		},
		"--_checkbox-radius": {
			default: radius.xs,
		},
		gap: space[2],
		alignItems: "flex-start",
		color: {
			"[data-disabled]": colors["--text-subtle"],
			"[data-readonly]": colors["--text-muted"],
			default: colors["--text"],
		},
		cursor: "inherit",
		display: "inline-flex",
	},
	control: {
		padding: 2,
		borderColor: {
			"[data-checked]": colors["--text-accent"],
			"[data-checked][data-disabled]": colors["--border"],
			"[data-disabled]": colors["--border-disabled"],
			"[data-indeterminate]": "var(--_checkbox-bg-checked)",
			"[data-indeterminate][data-disabled]": colors["--border"],
			"[data-indeterminate][data-readonly]": colors["--border-strong"],
			"[data-invalid]": colors["--text-danger"],
			"[data-readonly]": colors["--border-strong"],
			default: "var(--_checkbox-border)",
		},
		borderRadius: "var(--_checkbox-radius)",
		borderStyle: "solid",
		borderWidth: "1px",
		alignItems: "center",
		backgroundColor: {
			"[data-checked]": "var(--_checkbox-bg-checked)",
			"[data-checked][data-disabled]": colors["--surface-subtle"],
			"[data-checked][data-invalid]": colors["--danger"],
			"[data-readonly]": colors["--surface"],
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
			boxShadow: `0 -1px 0 ${colors["--white-a3"]}, 0 1px ${colors["--black-a2"]}`,
			content: "''",
			position: "absolute",
			zIndex: 1,
		},
	},
	indicator: {
		alignItems: "center",
		color: {
			"[data-disabled]": colors["--text-subtle"],
			"[data-indeterminate]": "var(--_checkbox-bg-checked)",
			"[data-indeterminate][data-disabled]": colors["--text-subtle"],
			"[data-invalid]": colors["--accent-contrast"],
			"[data-readonly]": colors["--text-accent"],
			default: colors["--accent-contrast"],
		},
		display: "flex",
		filter: {
			"[data-disabled]": null,
			default: `drop-shadow(0 1px 1px ${colors["--black-a3"]})`,
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
		transitionDuration: {
			default: motion.durationMedium,
			"@media (prefers-reduced-motion: reduce)": "0ms",
		},
		transitionProperty: "transform, opacity",
		transitionTimingFunction: motion.easeOut,
	},
	description: {
		margin: 0,
	},
});
