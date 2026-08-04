import { Field } from "@base-ui/react/field";
import { Input as BaseInput } from "@base-ui/react/input";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { type ComponentProps, type ReactElement } from "react";
import { fieldStyles, fieldControlSizes, fieldTextStyles } from "@/components/field/field.stylex";
import type { FieldSize } from "@/components/field/field.types";
import { focusRing } from "@/styles/recipes/focus";
import { tokens } from "@/theme/tokens.stylex";

const GROUP_HOVER =
	':hover:not(:focus-within):not(:has([aria-invalid="true"])):not(:has([data-disabled])):not(:has([data-invalid])):not(:has([readonly]))';

export type InputGroupRootProps = Omit<ComponentProps<"div">, "className" | "style"> & {
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
	orientation?: InputGroupOrientation;
	size?: FieldSize;
	variant?: InputGroupVariant;
};

export type InputGroupOrientation = "horizontal" | "vertical";
export type InputGroupVariant = "standard" | "elevated";

export type InputGroupInputProps = Omit<BaseInput.Props, "className" | "style"> & {
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export type InputGroupTextareaProps = Omit<ComponentProps<"textarea">, "className" | "style"> & {
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export type InputGroupAddonProps = Omit<ComponentProps<"span">, "className" | "style"> & {
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
	position?: "start" | "end";
};

export type InputGroupActionsProps = Omit<ComponentProps<"div">, "className" | "style"> & {
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export type InputGroupFooterProps = Omit<ComponentProps<"div">, "className" | "style"> & {
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export function Root({
	ref,
	className,
	style,
	orientation = "horizontal",
	size = "md",
	variant = "standard",
	...props
}: InputGroupRootProps) {
	const sx = stylex.props(
		fieldStyles.inputBase,
		inputGroupParts.root,
		focusRing.within,
		fieldControlSizes[size],
		fieldTextStyles[size],
		inputGroupSizes[size],
		inputGroupOrientations[orientation],
		inputGroupVariants[variant],
		style,
	);

	return (
		<div
			{...props}
			ref={ref}
			data-orientation={orientation}
			data-size={size}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
		/>
	);
}

export function Input({ ref, className, style, ...props }: InputGroupInputProps) {
	const sx = stylex.props(fieldStyles.inputUnstyled, inputGroupParts.input, style);

	return (
		<BaseInput ref={ref} className={[sx.className, className].filter(Boolean).join(" ")} style={sx.style} {...props} />
	);
}

export function Textarea({ ref, className, style, rows = 3, ...props }: InputGroupTextareaProps) {
	const sx = stylex.props(fieldStyles.inputUnstyled, inputGroupParts.input, inputGroupParts.textarea, style);
	const control = (
		<textarea
			ref={ref}
			rows={rows}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}
		/>
	);

	return <Field.Control render={control as ReactElement} />;
}

export function Addon({ ref, className, style, onClick, position = "start", ...props }: InputGroupAddonProps) {
	const sx = stylex.props(inputGroupParts.addon, style);

	return (
		<span
			ref={ref}
			data-position={position}
			className={[sx.className, "ds-input-group-addon", className].filter(Boolean).join(" ")}
			style={sx.style}
			onClick={(event) => {
				onClick?.(event);
				if (event.defaultPrevented || isInteractiveTarget(event.target)) return;

				event.currentTarget.parentElement?.querySelector<HTMLElement>("input, textarea")?.focus();
			}}
			{...props}
		/>
	);
}

function isInteractiveTarget(target: EventTarget) {
	return (
		target instanceof Element &&
		target.closest(
			'button, a, input, select, textarea, [role="button"], [role="link"], [tabindex]:not([tabindex="-1"])',
		)
	);
}

export function Actions({ ref, className, style, ...props }: InputGroupActionsProps) {
	const sx = stylex.props(inputGroupParts.actions, style);

	return <div ref={ref} className={[sx.className, className].filter(Boolean).join(" ")} style={sx.style} {...props} />;
}

export function Footer({ ref, className, style, ...props }: InputGroupFooterProps) {
	const sx = stylex.props(inputGroupParts.footer, style);

	return <div ref={ref} className={[sx.className, className].filter(Boolean).join(" ")} style={sx.style} {...props} />;
}

const inputGroupParts = stylex.create({
	root: {
		borderColor: {
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[GROUP_HOVER]: {
				"@media (hover: hover) and (pointer: fine)": tokens["--border-input-hover"],
			},
			default: tokens["--border-input"],
			":has([data-invalid])": tokens["--bg-error-primary"],
			":has([readonly])": tokens["--border"],
		},
		gap: tokens["--space-1"],
		overflow: "hidden",
		alignItems: "center",
		backgroundColor: {
			default: tokens["--surface"],
			":has([data-disabled])": tokens["--surface-subtle"],
		},
		display: "flex",
		minWidth: 0,
	},
	input: {
		borderWidth: 0,
		flex: "1 1 8rem",
		outline: "0",
		paddingBlock: 0,
		paddingInline: "var(--_input-group-child-padding-inline)",
		appearance: "none",
		backgroundColor: "transparent",
		fontFamily: "inherit",
		height: {
			default: "100%",
			[stylex.when.ancestor('[data-orientation="vertical"]')]: "auto",
		},
		minWidth: 0,
		width: "100%",
		"::placeholder": {
			opacity: 0.72,
		},
	},
	textarea: {
		flexBasis: {
			default: "auto",
			[stylex.when.ancestor('[data-orientation="vertical"]')]: "100%",
		},
		resize: "none",
		height: "auto",
		minHeight: "5.5rem",
	},
	addon: {
		paddingInline: "var(--_input-group-child-padding-inline)",
		alignItems: "center",
		color: tokens["--fg-muted"],
		cursor: "text",
		display: "inline-flex",
		flexShrink: 0,
		paddingInlineEnd: {
			"[data-position=end]:has(button)": "0",
			"[data-position=start]": "0",
		},
		paddingInlineStart: {
			"[data-position=end]": "0",
		},
		// fontSize: fontSize.x1,
		// letterSpacing: letterSpacing.x1,
		// lineHeight: lineHeight.x1,
	},
	actions: {
		gap: tokens["--space-1"],
		alignItems: "center",
		display: "flex",
		flexShrink: 0,
	},
	footer: {
		gap: tokens["--space-2"],
		paddingInline: "var(--_input-group-child-padding-inline)",
		alignItems: "center",
		display: "flex",
		flexBasis: {
			default: "auto",
			[stylex.when.ancestor('[data-orientation="vertical"]')]: "100%",
		},
		justifyContent: "space-between",
		minWidth: 0,
	},
});

const inputGroupVariants = stylex.create({
	standard: {},
	elevated: {
		borderWidth: 0,
		backgroundColor: tokens["--elevated"],
		boxShadow: tokens["--shadow-sm"],
	},
});

const inputGroupOrientations = stylex.create({
	horizontal: {
		flexDirection: "row",
	},
	vertical: {
		paddingBlock: "var(--_input-group-vertical-padding-block)",
		alignItems: "stretch",
		flexDirection: "column",
		height: "auto",
	},
});

const inputGroupSizes = stylex.create({
	sm: {
		"--_input-group-child-padding-inline": tokens["--space-1"],
		"--_input-group-icon-size": "0.875rem",
		"--_input-group-vertical-padding-block": tokens["--space-2"],
		paddingBlock: tokens["--space-1"],
		paddingInline: tokens["--space-1"],
	},
	md: {
		"--_input-group-child-padding-inline": tokens["--space-1"],
		"--_input-group-icon-size": "1rem",
		"--_input-group-vertical-padding-block": tokens["--space-3"],
		paddingBlock: tokens["--space-1"],
		paddingInline: tokens["--space-1"],
	},
	lg: {
		"--_input-group-child-padding-inline": tokens["--space-1"],
		"--_input-group-icon-size": "1rem",
		"--_input-group-vertical-padding-block": tokens["--space-4"],
		paddingBlock: tokens["--space-2"],
		paddingInline: tokens["--space-2"],
	},
});
