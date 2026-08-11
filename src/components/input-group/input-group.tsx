import { Field } from "@base-ui/react/field";
import { Input as BaseInput } from "@base-ui/react/input";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { type ComponentProps, type ReactElement } from "react";
import { fieldStyles, fieldControlSizes, fieldTextStyles } from "@/components/field/field.stylex";
import type { FieldSize } from "@/components/field/field.types";
import { focusRing } from "@/styles/recipes/focus";
import { tokens } from "@/theme/tokens.stylex";

/** Disabled chrome follows a nested input/textarea, not addon action buttons. */
const GROUP_HAS_DISABLED = ":has(:is(input, textarea):is([data-disabled], :disabled))";

const GROUP_HOVER = `:hover:not(:focus-within):not(:has([aria-invalid="true"])):not(${GROUP_HAS_DISABLED}):not(:has([data-invalid])):not(:has([readonly]))`;

export type InputGroupRootProps = Omit<ComponentProps<"div">, "className" | "style"> & {
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
	size?: FieldSize;
	variant?: InputGroupVariant;
};

export type InputGroupVariant = "standard" | "elevated" | "subtle";
/** Inline Addon placement relative to the control. Default `start`. */
export type InputGroupAddonPosition = "start" | "end";

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
	/** Inline placement relative to the control. Default `start`. */
	position?: InputGroupAddonPosition;
};

export type InputGroupActionsProps = Omit<ComponentProps<"div">, "className" | "style"> & {
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export type InputGroupHeaderProps = Omit<ComponentProps<"div">, "className" | "style"> & {
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export type InputGroupFooterProps = Omit<ComponentProps<"div">, "className" | "style"> & {
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export function Root({ ref, className, style, size = "md", variant = "standard", ...props }: InputGroupRootProps) {
	const sx = stylex.props(
		fieldStyles.inputBase,
		inputGroupParts.root,
		focusRing.within,
		fieldControlSizes[size],
		fieldTextStyles[size],
		inputGroupSizes[size],
		inputGroupVariants[variant],
		style,
	);

	return (
		<div
			{...props}
			ref={ref}
			data-variant={variant}
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

export function Textarea({ ref, className, style, rows = 1, disabled, ...props }: InputGroupTextareaProps) {
	const sx = stylex.props(fieldStyles.inputUnstyled, inputGroupParts.input, inputGroupParts.textarea, style);
	const control = (
		<textarea
			ref={ref}
			rows={rows}
			disabled={disabled}
			{...(disabled && { "data-disabled": true })}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}
		/>
	);

	return <Field.Control render={control as ReactElement} disabled={disabled} />;
}

export function Addon({ ref, className, style, onClick, position = "start", ...props }: InputGroupAddonProps) {
	const sx = stylex.props(inputGroupParts.addon, inputGroupAddonPositions[position], style);

	return (
		<span
			ref={ref}
			data-position={position}
			className={[sx.className, "xyz-input-group-addon", className].filter(Boolean).join(" ")}
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

export function Header({ ref, className, style, ...props }: InputGroupHeaderProps) {
	const sx = stylex.props(inputGroupParts.header, style);

	return (
		<div
			ref={ref}
			data-slot="header"
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}
		/>
	);
}

export function Footer({ ref, className, style, ...props }: InputGroupFooterProps) {
	const sx = stylex.props(inputGroupParts.footer, style);

	return (
		<div
			ref={ref}
			data-slot="footer"
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}
		/>
	);
}

const inputGroupParts = stylex.create({
	root: {
		borderColor: {
			[GROUP_HAS_DISABLED]: tokens["--border-disabled"],
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[GROUP_HOVER]: {
				"@media (hover: hover) and (pointer: fine)": tokens["--border-input-hover"],
			},
			default: tokens["--border-input"],
			":has([data-invalid])": tokens["--bg-error-primary"],
			":has([readonly])": tokens["--border"],
		},
		overflow: "hidden",
		alignItems: "center",
		backgroundColor: {
			// Match field `inputBase` disabled: transparent surface + root opacity.
			[GROUP_HAS_DISABLED]: "transparent",
			default: tokens["--surface"],
		},
		boxShadow: {
			[GROUP_HAS_DISABLED]: "none",
			default: null,
		},
		color: {
			[GROUP_HAS_DISABLED]: tokens["--fg-subtle"],
			default: null,
		},
		cursor: {
			[GROUP_HAS_DISABLED]: "not-allowed",
			default: null,
		},
		display: "flex",
		flexWrap: "wrap",
		minWidth: 0,
	},
	input: {
		borderWidth: 0,
		flex: "1 1 8rem",
		outline: "0",
		// Block padding stays on Textarea / Header / Footer; Input stays flush in the row.
		paddingBlock: tokens["--space-1"],
		paddingInline: "var(--_input-padding)",
		appearance: "none",
		backgroundColor: "transparent",
		fontFamily: "inherit",
		height: "auto",
		minWidth: 0,
		width: "100%",
		"::placeholder": {
			color: tokens["--fg-placeholder"],
		},
	},
	textarea: {
		paddingBlock: "var(--_input-padding)",
		// Own top/bottom inset so placeholder is not flush; matches Header / Footer outer edge.
		paddingInline: "var(--_input-padding)",
		// Own a full row inside the wrapping Root (with Header/Footer).
		flexBasis: "100%",
		resize: "none",
		// Hug `rows` / content — callers that need a taller box pass `rows` or `style`.
		height: "auto",
		// minHeight: "64px",
		width: "100%",
	},
	addon: {
		alignItems: "center",
		color: tokens["--fg-subtle"],
		cursor: "text",
		display: "inline-flex",
		flexShrink: 0,
	},
	actions: {
		gap: tokens["--space-1"],
		alignItems: "center",
		// paddingInline: "var(--_input-padding)",
		display: "flex",
		flexShrink: 0,
	},
	header: {
		gap: tokens["--space-2"],
		paddingInline: "var(--_input-padding)",
		alignItems: "center",
		display: "flex",
		flexBasis: "100%",
		justifyContent: "flex-start",
		paddingBlockEnd: 0,
		paddingBlockStart: "var(--_input-padding)",
		minWidth: 0,
		width: "100%",
	},
	footer: {
		gap: tokens["--space-2"],
		paddingInline: "var(--_input-padding)",
		alignItems: "center",
		display: "flex",
		flexBasis: "100%",
		justifyContent: "space-between",
		paddingBlockEnd: "var(--_input-group-padding)",
		minWidth: 0,
		width: "100%",
	},
});

const inputGroupAddonPositions = stylex.create({
	start: {
		paddingBlock: 0,
		order: -1,
		paddingInlineEnd: 0,
		paddingInlineStart: "var(--_input-group-padding)",
	},
	end: {
		paddingBlock: 0,
		order: 1,
		paddingInlineEnd: {
			default: "var(--_input-group-padding)",
			":has(button)": "calc(var(--_input-padding) / 2)",
		},
		paddingInlineStart: 0,
	},
});

const inputGroupVariants = stylex.create({
	standard: {},
	elevated: {
		borderWidth: 0,
		backgroundColor: {
			[GROUP_HAS_DISABLED]: tokens["--panel"],
			default: tokens["--elevated"],
		},
		boxShadow: {
			[GROUP_HAS_DISABLED]: tokens["--shadow-xs"],
			default: tokens["--shadow-sm"],
		},
	},
	subtle: {
		borderWidth: 0,
		backgroundColor: {
			[GROUP_HAS_DISABLED]: "transparent",
			default: tokens["--surface-subtle"],
			":hover:not(:focus-within)": tokens["--surface-subtle-hover"],
		},
	},
});

/**
 * Size chrome: Root keeps size padding for every layout (solo, addons, Header /
 * Footer). Height stays auto with a control minHeight so Textarea rows can grow;
 * denser product shells override via `style`.
 */
const inputGroupSizes = stylex.create({
	sm: {
		"--_input-group-icon-size": "0.875rem",
		"--_input-group-padding": tokens["--space-1"],
		"--_input-padding": tokens["--space-1"],
		paddingBlock: tokens["--space-1"],
		paddingInline: tokens["--space-1"],
		height: "auto",
		minHeight: tokens["--size-control-sm"],
	},
	md: {
		"--_input-group-icon-size": "1rem",
		"--_input-group-padding": tokens["--space-2"],
		"--_input-padding": tokens["--space-2"],
		// paddingBlock: tokens["--space-1"],
		// paddingInline: tokens["--space-1"],
		height: "auto",
		minHeight: tokens["--size-control-md"],
	},
	lg: {
		"--_input-group-icon-size": "1rem",
		"--_input-group-padding": tokens["--space-3"],
		"--_input-padding": tokens["--space-3"],
		// paddingBlock: tokens["--space-1"],
		// paddingInline: tokens["--space-1"],
		height: "auto",
		minHeight: tokens["--size-control-lg"],
	},
});

export const InputGroup = {
	Root,
	Input,
	Textarea,
	Addon,
	Header,
	Footer,
	Actions,
} as const;
