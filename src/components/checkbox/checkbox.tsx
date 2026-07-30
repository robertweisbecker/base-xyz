import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { CheckboxGroup as BaseCheckboxGroup } from "@base-ui/react/checkbox-group";
import { Field } from "@base-ui/react/field";
import { Fieldset } from "@base-ui/react/fieldset";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { createContext, useContext, useId, type ReactNode } from "react";
import { fieldStyles } from "@/components/field/field.stylex";
import { textStyles } from "@/components/text/text.stylex";
import { focusRing } from "@/styles/recipes/focus";
import { pressable } from "@/styles/recipes/transitions";
import { color, motion, radius, size as sizeToken, space } from "@/styles/tokens.stylex";
import { CheckmarkIcon, IndeterminateIcon } from "../selection-icons";

export type CheckboxSize = "sm" | "md";

export type CheckboxProps = Omit<BaseCheckbox.Root.Props, "children" | "className" | "style"> & {
	label: ReactNode;
	description?: ReactNode;
	invalid?: boolean;
	size?: CheckboxSize;
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export type CheckboxGroupProps = Omit<BaseCheckboxGroup.Props, "className" | "style"> & {
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
					{...props}>
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
	const containerSx = stylex.props(checkboxParts.item, style);
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
	const parentGroupContext = useContext(CheckboxGroupFieldContext);
	const isDisabled = Boolean(disabled || parentGroupContext.disabled);
	const resolvedSize = size ?? parentGroupContext.size ?? "md";
	const generatedId = useId();
	const descriptionId = description ? `${generatedId}-description` : undefined;
	const groupSx = stylex.props(checkboxParts.group, style);

	return (
		<Field.Root name={name} disabled={isDisabled}>
			<Fieldset.Root
				disabled={isDisabled}
				render={
					<BaseCheckboxGroup
						ref={ref}
						disabled={isDisabled}
						aria-describedby={mergeIds(ariaDescribedBy, descriptionId)}
						{...props}
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
					<div {...stylex.props(checkboxParts.items, inline && checkboxParts.itemsInline)}>{children}</div>
				</CheckboxGroupFieldContext.Provider>
			</Fieldset.Root>
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
		paddingInlineStart: `calc(${sizeToken["indicator.sm"]} + ${space.x2} + 2px)`,
	},
	md: {
		paddingInlineStart: `calc(${sizeToken["indicator.md"]} + ${space.x2} + 2px)`,
	},
});

const checkboxParts = stylex.create({
	group: {
		margin: 0,
		padding: 0,
		borderWidth: 0,
		gap: space.x2,
		display: "flex",
		flexDirection: "column",
		minInlineSize: 0,
	},
	legend: {
		padding: 0,
	},
	groupDescription: {
		marginBlockEnd: space.x2,
	},
	items: {
		gap: space.x3,
		display: "flex",
		flexDirection: "column",
	},
	itemsInline: {
		alignItems: "flex-start",
		columnGap: space.x6,
		flexDirection: "row",
		flexWrap: "wrap",
		rowGap: space.x3,
	},
	item: {
		borderColor: {
			"[data-disabled]": color.border,
			default: "transparent",
		},
		gap: 0,
		color: {
			"[data-disabled]": color.fgSubtle,
			default: color.fg,
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
		"--ds-checkbox-border-color": {
			default: color.borderStrong,
			":hover": {
				"@media (hover: hover) and (pointer: fine)": color.borderHover,
			},
			":active": color.bgAccentHover,
		},
		"--ds-checkbox-press-scale": {
			default: "1",
			":active": "0.94",
		},
		"--ds-checkbox-selected-color": {
			default: color.bgAccent,
			":hover": {
				"@media (hover: hover) and (pointer: fine)": color.bgAccentHover,
			},
			":active": color.bgAccentHover,
		},
		gap: space.x2,
		alignItems: "flex-start",
		cursor: "inherit",
		display: "inline-flex",
	},
	control: {
		padding: 2,
		borderColor: {
			"[data-checked]": "var(--ds-checkbox-selected-color)",
			"[data-checked][data-disabled]": color.bgNeutral,
			"[data-checked][data-readonly]": color.fgMuted,
			"[data-disabled]": color.borderDisabled,
			"[data-indeterminate]": "var(--ds-checkbox-selected-color)",
			"[data-indeterminate][data-disabled]": color.bgNeutral,
			"[data-indeterminate][data-readonly]": color.fgMuted,
			"[data-invalid]": color.bgDanger,
			"[data-readonly]": color.border,
			default: "var(--ds-checkbox-border-color)",
		},
		borderRadius: radius.xs,
		borderStyle: "solid",
		borderWidth: "1px",
		alignItems: "center",
		backgroundColor: {
			"[data-checked]": "var(--ds-checkbox-selected-color)",
			"[data-checked][data-disabled]": color.surfaceSubtle,
			"[data-checked][data-invalid]": color.bgDanger,
			"[data-checked][data-readonly]": color.fgMuted,
			default: color.surface,
		},
		display: "inline-flex",
		flexShrink: 0,
		justifyContent: "center",
		marginBlockStart: 1,
		transform: {
			"[data-disabled]": "scale(1)",
			"[data-readonly]": "scale(1)",
			default: "scale(var(--ds-checkbox-press-scale))",
		},
	},
	indicator: {
		alignItems: "center",
		color: {
			"[data-indeterminate]": "var(--ds-checkbox-selected-color)",
			"[data-indeterminate][data-disabled]": color.bgNeutral,
			"[data-indeterminate][data-readonly]": color.fgMuted,
			default: color.fgAccentContrast,
		},
		display: "flex",
		justifyContent: "center",
		height: "100%",
		width: "100%",
	},
	indicatorTransition: {
		transform: {
			"[data-ending-style]": "scale(0.5)",
			"[data-starting-style]": "scale(0.5)",
			default: "scale(1)",
		},
		transitionDuration: {
			default: motion.durationMedium,
			"@media (prefers-reduced-motion: reduce)": "0ms",
		},
		transitionProperty: "transform",
		transitionTimingFunction: motion.easeOut,
	},
	description: {
		margin: 0,
	},
});
