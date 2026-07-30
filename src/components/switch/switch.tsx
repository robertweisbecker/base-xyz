import { Switch as BaseSwitch } from "@base-ui/react/switch";
import * as stylex from "@stylexjs/stylex";
import { useId } from "react";
import { fieldStyles } from "@/components/field/field.stylex";
import { focusRing } from "@/styles/recipes/focus";
import { color, motion, radius, space, shadow } from "@/styles/tokens.stylex";

export type SwitchSize = "sm" | "md";

export type SwitchProps = Omit<BaseSwitch.Root.Props, "className"> & {
	label: string;
	description?: string;
	size?: SwitchSize;
};

export function Switch({
	label,
	description,
	size = "md",
	disabled,
	readOnly,
	required,
	id: providedId,
	"aria-describedby": ariaDescribedBy,
	...props
}: SwitchProps) {
	const generatedId = useId();
	const id = providedId ?? generatedId;
	const descriptionId = description ? `${generatedId}-description` : undefined;

	return (
		<div {...stylex.props(switchParts.root)}>
			<label htmlFor={id} {...stylex.props(switchParts.labelRoot)}>
				<span
					{...stylex.props(
						fieldStyles.itemLabel,
						switchParts.label,
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
					{...props}>
					<BaseSwitch.Thumb {...stylex.props(switchParts.thumb)} />
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
		alignItems: "center",
		columnGap: space.x4,
		display: "grid",
		gridTemplateColumns: "minmax(0, 1fr) auto",
		rowGap: space.x1,
	},
	labelRoot: {
		"--ds-switch-border-color": {
			default: color.borderStrong,
			":hover": {
				"@media (hover: hover) and (pointer: fine)": color.borderHover,
			},
			":active": color.bgAccentHover,
		},
		"--ds-switch-press-scale": {
			default: "1",
			":active": "0.94",
		},
		"--ds-switch-selected-color": {
			default: color.bgAccent,
			":hover": {
				"@media (hover: hover) and (pointer: fine)": color.bgAccentHover,
			},
			":active": color.bgAccentHover,
		},
		display: "contents",
	},
	label: {
		gridColumn: "1",
		gridRow: "1",
		cursor: "default",
	},
	labelDisabled: {
		color: color.fgMuted,
		cursor: "not-allowed",
		opacity: 0.48,
	},
	labelReadOnly: {
		color: color.fgMuted,
		cursor: "default",
	},
	description: {
		margin: 0,
		gridColumn: "1",
		gridRow: "2",
	},
	track: {
		padding: "calc(var(--ds-switch-track-height) / 14)",
		borderColor: {
			"[data-checked]": "var(--ds-switch-selected-color)",
			"[data-checked][data-disabled]": color.bgNeutral,
			"[data-checked][data-readonly]": color.fgMuted,
			"[data-disabled]": color.borderDisabled,
			"[data-readonly]": color.border,
			default: "var(--ds-switch-border-color)",
		},
		borderRadius: radius.full,
		borderStyle: "solid",
		borderWidth: "1px",
		gridColumn: "2",
		gridRow: "1 / span 2",
		alignItems: "center",
		backgroundColor: {
			"[data-checked]": "var(--ds-switch-selected-color)",
			"[data-checked][data-disabled]": color.bgNeutral,
			"[data-checked][data-readonly]": color.fillDisabled,
			default: color.fillTrack,
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
			default: "scale(var(--ds-switch-press-scale))",
		},
		transitionDuration: motion.durationQuick,
		transitionProperty: "background-color, border-color, transform",
		transitionTimingFunction: "ease-out",
		height: "var(--ds-switch-track-height)",
		width: "calc(var(--ds-switch-track-height) * 1.5)",
	},
	thumb: {
		borderRadius: radius.full,
		aspectRatio: 1,
		backgroundColor: "#ffffff",
		boxShadow: shadow.sm,
		display: "block",
		transform: {
			"[data-checked]": "translateX(calc(var(--ds-switch-track-height) / 2))",
			default: "translateX(0)",
		},
		transitionDuration: motion.durationShort,
		transitionProperty: "transform",
		transitionTimingFunction: motion.easeOut,
		height: "100%",
	},
});

const sizeVariants = stylex.create({
	sm: {
		"--ds-switch-track-height": space.x6,
	},
	md: {
		"--ds-switch-track-height": space.x7,
	},
});
