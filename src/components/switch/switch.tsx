import { Switch as BaseSwitch } from "@base-ui/react/switch";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useId } from "react";
import { media } from "@/styles/constants.stylex";
import { resolveThemeProps } from "@/theme/theme-props";
import type { FieldThemeProps } from "@/components/field/field.types";
import { fieldStyles, fieldThemeProps, labelMarker } from "@/components/field/field.stylex";
import { focusRing } from "@/styles/recipes/focus";
import { tokens } from "@/theme/tokens.stylex";
import { Icon } from "@/components/icons";
import { VisuallyHidden } from "@/components/visually-hidden/visually-hidden";
import { attrJoin } from "@/utils/attr-join";

export type SwitchSize = "sm" | "md" | "lg";

const ENABLED_HOVER = ":hover:not([data-disabled],[data-readonly])";
const ENABLED_ACTIVE = ":active:not([data-disabled],[data-readonly])";

export type SwitchProps = Omit<BaseSwitch.Root.Props, "className" | "color" | "style" | keyof FieldThemeProps> &
	FieldThemeProps & {
		label: string;
		description?: string;
		/** Hides the label visually while keeping it available to assistive tech. */
		visuallyHideLabel?: boolean;
		size?: SwitchSize;
		className?: string;
		/** StyleX overrides, applied after the component's own styles. */
		style?: StyleXStyles;
	};

export function Switch({
	label,
	description,
	visuallyHideLabel = false,
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
		<div className={[rootSx.className, className].filter(Boolean).join(" ")} style={rootSx.style}>
			<label
				htmlFor={id}
				data-disabled={disabled ? "" : undefined}
				data-readonly={readOnly ? "" : undefined}
				{...stylex.props(labelMarker, switchParts.labelRoot)}>
				{visuallyHideLabel ? (
					<VisuallyHidden>{labelContent}</VisuallyHidden>
				) : (
					<span
						{...stylex.props(
							fieldStyles.itemLabel,
							disabled && switchParts.labelDisabled,
							readOnly && switchParts.labelReadOnly,
						)}>
						{labelContent}
					</span>
				)}
				<BaseSwitch.Root
					id={id}
					disabled={disabled}
					readOnly={readOnly}
					required={required}
					aria-describedby={attrJoin(ariaDescribedBy, descriptionId) || undefined}
					nativeButton
					render={<button type="button" />}
					{...stylex.props(switchParts.track, sizeVariants[size], focusRing.offset)}
					{...restProps}>
					<BaseSwitch.Thumb {...stylex.props(switchParts.thumb)}>
						<Icon.Checkmark {...stylex.props(switchParts.icon)} strokeWidth={3} />
					</BaseSwitch.Thumb>
				</BaseSwitch.Root>
			</label>
			{description ? (
				<p id={descriptionId} {...stylex.props(fieldStyles.description)}>
					{description}
				</p>
			) : null}
		</div>
	);
}

const switchParts = stylex.create({
	root: {
		gap: tokens["--space-1"],
		alignItems: "stretch",
		display: "flex",
		flexDirection: "column",
	},
	labelRoot: {
		"--_switch-border-color": {
			[ENABLED_ACTIVE]: tokens["--bg-primary-highlight"],
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[ENABLED_HOVER]: {
				[media.canHover]: tokens["--border-input-hover"],
			},
			default: tokens["--border-input"],
		},
		"--_switch-press-scale": {
			[ENABLED_ACTIVE]: "0.94",
			default: "1",
		},
		"--_switch-selected-color": {
			[ENABLED_ACTIVE]: tokens["--bg-primary-highlight"],
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[ENABLED_HOVER]: {
				[media.canHover]: tokens["--bg-primary-highlight"],
			},
			default: tokens["--bg-primary"],
		},
		gap: tokens["--space-2"],
		alignItems: "center",
		display: "flex",
		justifyContent: "space-between",
	},
	labelDisabled: {
		color: tokens["--fg-muted"],
		cursor: "not-allowed",
		opacity: 0.48,
	},
	labelReadOnly: {
		color: tokens["--fg-muted"],
	},
	track: {
		padding: "calc(var(--_switch-track-height) / 14)",
		borderColor: {
			"[data-checked]": "var(--_switch-selected-color)",
			"[data-checked][data-disabled]": tokens["--border-disabled"],
			"[data-checked][data-readonly]": tokens["--border"],
			"[data-disabled]": tokens["--border-disabled"],
			"[data-readonly]": tokens["--border"],
			default: "var(--_switch-border-color)",
		},
		borderRadius: tokens["--radius-full"],
		alignItems: "center",
		alignSelf: "start",
		backgroundColor: {
			"[data-checked]": "var(--_switch-selected-color)",
			"[data-checked][data-disabled]": tokens["--fill-disabled"],
			"[data-checked][data-readonly]": tokens["--bg-neutral"],
			"[data-disabled]": tokens["--fill-disabled"],
			default: tokens["--fill-track"],
		},
		boxShadow: {
			"[data-disabled]": "none",
			"[data-readonly]": null,
			default: tokens["--shadow-inset"],
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
		transitionDuration: tokens["--motion-duration-quick"],
		transitionProperty: "background-color, border-color, transform",
		transitionTimingFunction: "ease-out",
		height: "var(--_switch-track-height)",
		width: "calc(var(--_switch-track-height) * 1.5)",
	},
	thumb: {
		borderRadius: tokens["--radius-full"],
		alignItems: "center",
		aspectRatio: 1,
		backgroundColor: {
			"[data-disabled]": tokens["--fill-disabled"],
			default: tokens["--color-white"],
		},
		boxShadow: {
			"[data-disabled]": "none",
			default: tokens["--shadow-sm"],
		},
		display: "flex",
		flexShrink: 0,
		justifyContent: "center",
		transform: {
			"[data-checked]": "translateX(calc(var(--_switch-track-height) / 2))",
			default: "translateX(0)",
		},
		transitionDuration: tokens["--motion-duration-short"],
		transitionProperty: "transform",
		transitionTimingFunction: tokens["--motion-ease-out"],
		height: "100%",
	},
	icon: {
		stroke: "currentColor",
		color: {
			"[data-checked]": tokens["--fg-accent"],
			default: tokens["--fg"],
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
		"--_switch-track-height": tokens["--space-5"],
	},
	md: {
		"--_switch-track-height": tokens["--space-6"],
	},
	lg: {
		"--_switch-track-height": tokens["--space-7"],
	},
});
