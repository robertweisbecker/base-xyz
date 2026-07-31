import { Radio as BaseRadio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
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

export type RadioSize = "sm" | "md";

export type RadioProps = Omit<BaseRadio.Root.Props, "children" | "className" | "style"> & {
	label: ReactNode;
	description?: ReactNode;
	size?: RadioSize;
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export type RadioGroupProps = Omit<BaseRadioGroup.Props, "className" | "style"> & {
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
	className,
	style,
	disabled,
	required,
	size,
	id: providedId,
	"aria-describedby": ariaDescribedBy,
	...props
}: RadioProps) {
	const groupState = useContext(RadioGroupStateContext);
	const selfOrGroupDisabled = Boolean(disabled || groupState.disabled);
	// const selfOrGroupReadOnly = Boolean(readOnly || groupState.readOnly);
	const resolvedSize = size ?? groupState.size ?? "md";
	const generatedId = useId();
	const id = providedId ?? `${generatedId}-control`;
	const descriptionId = description ? `${generatedId}-description` : undefined;
	const itemSx = stylex.props(radioParts.item, style);
	const itemClassName = [itemSx.className, className].filter(Boolean).join(" ");

	return (
		<Field.Item
			// SLOP: don't think this is necessary because the parent sets it -
			// data-readonly={selfOrGroupReadOnly ? "" : undefined}
			disabled={selfOrGroupDisabled}
			// ^^ seemingly this one is necessary?
			className={itemClassName}
			style={itemSx.style}>
			<Field.Label htmlFor={id} {...stylex.props(radioParts.labelRoot)}>
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
						focusRing.outset,
						pressable.transition,
					)}
					{...props}>
					<BaseRadio.Indicator
						{...stylex.props(
							radioParts.indicator,
							radioIndicatorSizeStyles[resolvedSize],
							radioParts.indicatorTransition,
						)}
					/>
				</BaseRadio.Root>
				<span {...stylex.props(radioLabelStyles[resolvedSize])}>
					{label}
					{required ? (
						<span aria-hidden {...stylex.props(fieldStyles.requiredIndicator)}>
							*
						</span>
					) : null}
				</span>
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
	const generatedId = useId();
	const descriptionId = description ? `${generatedId}-description` : undefined;
	const groupSx = stylex.props(radioParts.fieldset, style);

	return (
		<Field.Root
			name={name}
			// disabled={disabled}
		>
			<Fieldset.Root
				// disabled={disabled}
				// data-readonly={readOnly ? "" : undefined}
				// data-required={required ? "" : undefined}
				render={
					<BaseRadioGroup
						ref={ref}
						name={name}
						// disabled={disabled}
						// readOnly={readOnly}
						// required={required}
						aria-describedby={mergeIds(ariaDescribedBy, descriptionId)}
						{...props}
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
					<div {...stylex.props(radioParts.group, inline && radioParts.groupInline)}>{children}</div>
				</RadioGroupStateContext.Provider>
			</Fieldset.Root>
		</Field.Root>
	);
}

function mergeIds(...ids: Array<string | undefined>) {
	return ids.filter(Boolean).join(" ") || undefined;
}

const radioControlSizeStyles = stylex.create({
	sm: {
		height: sizeToken["indicator.sm"],
		width: sizeToken["indicator.sm"],
	},
	md: {
		height: sizeToken["indicator.md"],
		width: sizeToken["indicator.md"],
	},
});

const radioLabelStyles = {
	sm: textStyles.supporting,
	md: textStyles.label,
} as const satisfies Record<RadioSize, unknown>;

const radioDescriptionStyles = stylex.create({
	sm: {
		paddingInlineStart: `calc(${sizeToken["indicator.sm"]} + ${space.x2} + 2px)`,
	},
	md: {
		paddingInlineStart: `calc(${sizeToken["indicator.md"]} + ${space.x2} + 2px)`,
	},
});

const radioIndicatorSizeStyles = stylex.create({
	sm: {
		height: `calc((${sizeToken["indicator.sm"]} - 2px) / 2)`,
		width: `calc((${sizeToken["indicator.sm"]} - 2px) / 2)`,
	},
	md: {
		height: `calc((${sizeToken["indicator.md"]} - 2px) / 2)`,
		width: `calc((${sizeToken["indicator.md"]} - 2px) / 2)`,
	},
});

const radioParts = stylex.create({
	fieldset: {
		margin: 0,
		padding: 0,
		borderWidth: 0,
		gap: space.x3,
		display: "flex",
		flexDirection: "column",
		minInlineSize: 0,
	},
	title: {
		display: "flex",
		flexDirection: "column",
		gap: space.x1,
	},
	fieldsetLegend: {
		// fontWeight: fontWeight.regular,
	},
	fieldsetDescription: {
		// margin: 0,
	},
	group: {
		gap: space.x3,
		display: "flex",
		flexDirection: "column",
	},
	groupInline: {
		alignItems: "flex-start",
		columnGap: space.x6,
		flexDirection: "row",
		flexWrap: "wrap",
		rowGap: space.x3,
	},
	item: {
		gap: space.x1,
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
		"--ds-radio-border-color": {
			default: color.borderStrong,
			":hover": {
				"@media (hover: hover) and (pointer: fine)": color.borderHover,
			},
			":active": color.bgAccentHover,
		},
		"--ds-radio-press-scale": {
			default: "1",
			":active": "0.94",
		},
		"--ds-radio-selected-color": {
			default: color.bgAccent,
			":hover": {
				"@media (hover: hover) and (pointer: fine)": color.bgAccentHover,
			},
			":active": color.bgAccentHover,
		},
		gap: space.x2,
		alignItems: "flex-start",
		color: color.fg,
		cursor: "inherit",
		display: "inline-flex",
	},
	control: {
		borderColor: {
			"[data-checked]": "var(--ds-radio-selected-color)",
			"[data-checked][data-disabled]": color.bgNeutral,
			"[data-checked][data-readonly]": color.fgMuted,
			"[data-disabled]": color.borderDisabled,
			"[data-readonly]": color.border,
			default: "var(--ds-radio-border-color)",
		},
		borderRadius: radius.full,
		borderStyle: "solid",
		borderWidth: "1px",
		alignItems: "center",
		backgroundColor: {
			"[data-checked]": "var(--ds-radio-selected-color)",
			"[data-checked][data-disabled]": color.bgNeutral,
			"[data-checked][data-readonly]": color.fgMuted,
			default: color.surface,
		},
		display: "inline-flex",
		flexShrink: 0,
		justifyContent: "center",
		marginBlockStart: "1px",
		transform: {
			"[data-disabled]": "scale(1)",
			"[data-readonly]": "scale(1)",
			default: "scale(var(--ds-radio-press-scale))",
		},
	},
	indicator: {
		borderRadius: radius.full,
		backgroundColor: color.fgAccentContrast,
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
