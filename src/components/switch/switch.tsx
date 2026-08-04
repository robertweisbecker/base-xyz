import { Switch as BaseSwitch } from "@base-ui/react/switch";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useId } from "react";
import { resolveThemeProps } from "@/theme/theme-props";
import type { FieldThemeProps } from "@/components/field/field.types";
import { fieldStyles, fieldThemeProps } from "@/components/field/field.stylex";
import { focusRing } from "@/styles/recipes/focus";
import { colors, motion, radius, space, shadow } from "@/styles/tokens.stylex";
import { CheckmarkIcon } from "@/components/selection-icons";
export type SwitchSize = "sm" | "md" | "lg";

export type SwitchProps = Omit<BaseSwitch.Root.Props, "className" | "color" | "style" | keyof FieldThemeProps> &
	FieldThemeProps & {
		label: string;
		description?: string;
		size?: SwitchSize;
		className?: string;
		/** StyleX overrides, applied after the component's own styles. */
		style?: StyleXStyles;
	};

export function Switch({
	label,
	description,
	className,
	style,
	size = "md",
	disabled,
	readOnly,
	required,
	id: providedId,
	"aria-describedby": ariaDescribedBy,
	...props
}: SwitchProps) {
	const { restProps, styles } = resolveThemeProps(props, fieldThemeProps);
	const generatedId = useId();
	const id = providedId ?? generatedId;
	const descriptionId = description ? `${generatedId}-description` : undefined;

	const rootSx = stylex.props(switchParts.root, ...styles, style);

	return (
		<div className={[rootSx.className, className].filter(Boolean).join(" ")} style={rootSx.style}>
			<label htmlFor={id} {...stylex.props(switchParts.labelRoot)}>
				<span
					{...stylex.props(
						fieldStyles.itemLabel,
						disabled && switchParts.labelDisabled,
						readOnly && switchParts.labelReadOnly,
					)}>
					{label}
					{required ? (
						<span aria-hidden {...stylex.props(fieldStyles.requiredIndicator)}>
							*
						</span>
					) : null}
				</span>
				<BaseSwitch.Root
					id={id}
					disabled={disabled}
					readOnly={readOnly}
					required={required}
					aria-describedby={mergeIds(ariaDescribedBy, descriptionId)}
					nativeButton
					render={<button type="button" />}
					{...stylex.props(switchParts.track, sizeVariants[size], focusRing.outset)}
					{...restProps}>
					<BaseSwitch.Thumb {...stylex.props(switchParts.thumb)}>
						<CheckmarkIcon {...stylex.props(switchParts.icon)} strokeWidth={3} />
					</BaseSwitch.Thumb>
				</BaseSwitch.Root>
			</label>
			{description ? (
				<p id={descriptionId} {...stylex.props(fieldStyles.description, switchParts.description)}>
					{description}
				</p>
			) : null}
		</div>
	);
}

function mergeIds(...ids: Array<string | undefined>) {
	return ids.filter(Boolean).join(" ") || undefined;
}

const switchParts = stylex.create({
	root: {
		gap: space[1],
		alignItems: "stretch",
		display: "flex",
		flexDirection: "column",
	},
	labelRoot: {
		"--_switch-border-color": {
			default: colors["--border-strong"],
			":hover": {
				"@media (hover: hover) and (pointer: fine)": colors["--border-hover"],
			},
			":active": colors["--accent-hover"],
		},
		"--_switch-press-scale": {
			default: "1",
			":active": "0.94",
		},
		"--_switch-selected-color": {
			default: colors["--accent"],
			":hover": {
				"@media (hover: hover) and (pointer: fine)": colors["--accent-hover"],
			},
			":active": colors["--accent-hover"],
		},
		gap: space[2],
		alignItems: "center",
		display: "flex",
		justifyContent: "space-between",
	},
	labelDisabled: {
		color: colors["--text-muted"],
		cursor: "not-allowed",
		opacity: 0.48,
	},
	labelReadOnly: {
		color: colors["--text-muted"],
	},
	description: {
		// margin: 0,
	},
	track: {
		padding: "calc(var(--_switch-track-height) / 14)",
		borderColor: {
			"[data-checked]": "var(--_switch-selected-color)",
			"[data-checked][data-disabled]": colors["--border-disabled"],
			"[data-checked][data-readonly]": colors["--border"],
			"[data-disabled]": colors["--border-disabled"],
			"[data-readonly]": colors["--border"],
			default: "var(--_switch-border-color)",
		},
		borderRadius: radius.full,
		alignItems: "center",
		alignSelf: "start",
		backgroundColor: {
			"[data-checked]": "var(--_switch-selected-color)",
			"[data-checked][data-disabled]": colors["--fill-disabled"],
			"[data-checked][data-readonly]": colors["--neutral"],
			"[data-disabled]": colors["--fill-disabled"],
			default: colors["--fill-track"],
		},
		// borderStyle: "solid",
		// borderWidth: "1px",
		boxShadow: {
			"[data-disabled]": "none",
			"[data-readonly]": null,
			default: shadow.inset,
		},
		cursor: {
			"[data-disabled]": "not-allowed",
			"[data-readonly]": "default",
			default: "default",
		},
		display: "flex",
		transform: {
			"[data-disabled]": "scale(1)",
			"[data-readonly]": "scale(1)",
			default: "scale(var(--_switch-press-scale))",
		},
		transitionDuration: motion.durationQuick,
		transitionProperty: "background-color, border-color, transform",
		transitionTimingFunction: "ease-out",
		height: "var(--_switch-track-height)",
		width: "calc(var(--_switch-track-height) * 1.5)",
	},
	thumb: {
		borderRadius: radius.full,
		alignItems: "center",
		aspectRatio: 1,
		backgroundColor: {
			"[data-disabled]": colors["--fill-disabled"],
			default: colors["--white"],
		},
		boxShadow: {
			"[data-disabled]": "none",
			default: shadow.sm,
		},
		display: "flex",
		flexShrink: 0,
		justifyContent: "center",
		transform: {
			"[data-checked]": "translateX(calc(var(--_switch-track-height) / 2))",
			default: "translateX(0)",
		},
		transitionDuration: motion.durationShort,
		transitionProperty: "transform",
		transitionTimingFunction: motion.easeOut,
		height: "100%",
	},
	icon: {
		stroke: "currentColor",
		color: {
			"[data-checked]": colors["--text-accent"],
			default: colors["--text"],
		},
		display: {
			default: "none",
			[stylex.when.ancestor("[data-checked]")]: "block",
		},
		height: ".75em",
		width: ".75em",
	},
});

const sizeVariants = stylex.create({
	sm: {
		"--_switch-track-height": space[5],
	},
	md: {
		"--_switch-track-height": space[6],
	},
	lg: {
		"--_switch-track-height": space[7],
	},
});
