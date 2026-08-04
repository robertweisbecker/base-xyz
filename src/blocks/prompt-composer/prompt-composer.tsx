import { ArrowUpIcon } from "@phosphor-icons/react/dist/csr/ArrowUp";
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import { SquareIcon } from "@phosphor-icons/react/dist/csr/Square";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { createContext, type ComponentProps, type FormEvent, type KeyboardEvent, useContext, useState } from "react";
import { Button, type ButtonProps, IconButton } from "@/components/button/button";
import * as InputGroup from "@/components/input-group/input-group";
import * as Menu from "@/components/menu/menu";
import { colors, space } from "@/styles/tokens.stylex";
import { fontSize, letterSpacing, lineHeight } from "@/styles/tokens.stylex";

const ADD_MENU_SIDE_OFFSET = 106;

type PromptComposerContextValue = {
	canSubmit: boolean;
	disabled: boolean;
	submitting: boolean;
	value: string;
	updateValue: (value: string) => void;
	submit: () => void;
};

const PromptComposerContext = createContext<PromptComposerContextValue | null>(null);

type StyledProps<T> = Omit<T, "style"> & {
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

type FormProps = StyledProps<Omit<ComponentProps<"form">, "onSubmit">>;
export type PromptComposerRootProps = FormProps & {
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	onSubmit: (value: string) => void;
	disabled?: boolean;
	submitting?: boolean;
	clearOnSubmit?: boolean;
};
export type PromptComposerSurfaceProps = ComponentProps<typeof InputGroup.Root>;
export type PromptComposerInputProps = Omit<
	ComponentProps<typeof InputGroup.Textarea>,
	"value" | "defaultValue" | "disabled"
>;
export type PromptComposerFooterProps = ComponentProps<typeof InputGroup.Footer>;
export type PromptComposerOptionsProps = StyledProps<ComponentProps<"div">>;
export type PromptComposerActionsProps = ComponentProps<typeof InputGroup.Actions>;
export type PromptComposerSubmitProps = ButtonProps;
export type PromptComposerStopProps = ButtonProps;
export type PromptComposerAddTriggerProps = ComponentProps<typeof Menu.Trigger>;
export type PromptComposerAddPopupProps = ComponentProps<typeof Menu.Popup>;
export type PromptComposerAddItemContentProps = StyledProps<ComponentProps<"span">>;
export type PromptComposerAddItemDescriptionProps = StyledProps<ComponentProps<"span">>;

export function Root({
	value,
	defaultValue = "",
	onValueChange,
	onSubmit,
	disabled = false,
	submitting = false,
	clearOnSubmit = true,
	className,
	style,
	...props
}: PromptComposerRootProps) {
	const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
	const isControlled = value !== undefined;
	const currentValue = isControlled ? value : uncontrolledValue;
	const canSubmit = currentValue.trim().length > 0 && !disabled && !submitting;

	function updateValue(nextValue: string) {
		if (!isControlled) setUncontrolledValue(nextValue);
		onValueChange?.(nextValue);
	}

	function submit() {
		const prompt = currentValue.trim();
		if (!prompt || disabled || submitting) return;
		onSubmit(prompt);
		if (clearOnSubmit) updateValue("");
	}

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		submit();
	}

	const sx = stylex.props(parts.root, style);

	return (
		<PromptComposerContext.Provider
			value={{
				canSubmit,
				disabled,
				submitting,
				value: currentValue,
				updateValue,
				submit,
			}}>
			<form className={joinClassNames(sx.className, className)} onSubmit={handleSubmit} style={sx.style} {...props} />
		</PromptComposerContext.Provider>
	);
}

export function Surface({ variant = "elevated", ...props }: PromptComposerSurfaceProps) {
	return <InputGroup.Root orientation="vertical" variant={variant} {...props} />;
}

export function Input({
	"aria-label": ariaLabel = "Message",
	placeholder = "Ask anything…",
	rows = 3,
	onChange,
	onKeyDown,
	...props
}: PromptComposerInputProps) {
	const context = usePromptComposerContext("Input");

	function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
		onKeyDown?.(event);
		if (!event.defaultPrevented && event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
			event.preventDefault();
			context.submit();
		}
	}

	return (
		<InputGroup.Textarea
			aria-label={ariaLabel}
			disabled={context.disabled}
			onChange={(event) => {
				onChange?.(event);
				if (!event.defaultPrevented) context.updateValue(event.currentTarget.value);
			}}
			onKeyDown={handleKeyDown}
			placeholder={placeholder}
			rows={rows}
			value={context.value}
			{...props}
		/>
	);
}

export const Footer = InputGroup.Footer;

export function Options({ className, style, ...props }: PromptComposerOptionsProps) {
	const sx = stylex.props(parts.options, style);
	return <div className={joinClassNames(sx.className, className)} style={sx.style} {...props} />;
}

export const Actions = InputGroup.Actions;

export function Submit({
	children,
	"aria-label": ariaLabel = "Send message",
	disabled,
	shape = "square",
	size = "md",
	type = "submit",
	variant,
	...props
}: PromptComposerSubmitProps) {
	const { canSubmit } = usePromptComposerContext("Submit");
	const buttonProps = {
		disabled: disabled ?? !canSubmit,
		size,
		type,
		variant: variant ?? (canSubmit ? "primary" : "neutral"),
		...props,
	} as const;

	if (children == null) {
		return (
			<IconButton
				{...buttonProps}
				icon={<ArrowUpIcon aria-hidden weight="bold" />}
				label={ariaLabel}
				shape={shape === "circle" ? "circle" : "square"}
			/>
		);
	}

	return (
		<Button aria-label={ariaLabel} shape={shape} {...buttonProps}>
			{children}
		</Button>
	);
}

export function Stop({
	children,
	"aria-label": ariaLabel = "Stop generating",
	shape = "square",
	size = "md",
	type = "button",
	variant = "secondary",
	...props
}: PromptComposerStopProps) {
	if (children == null) {
		return (
			<IconButton
				{...props}
				icon={<SquareIcon aria-hidden weight="fill" />}
				label={ariaLabel}
				shape={shape === "circle" ? "circle" : "square"}
				size={size}
				type={type}
				variant={variant}
			/>
		);
	}

	return (
		<Button aria-label={ariaLabel} shape={shape} size={size} type={type} variant={variant} {...props}>
			{children}
		</Button>
	);
}

export function AddTrigger({ children, render, ...props }: PromptComposerAddTriggerProps) {
	const { disabled } = usePromptComposerContext("AddTrigger");
	return (
		<Menu.Trigger
			render={
				render ?? (
					<IconButton
						disabled={disabled}
						icon={<PlusIcon aria-hidden weight="bold" />}
						label="Add"
						shape="circle"
						tooltip={false}
						variant="neutral"
					/>
				)
			}
			{...props}>
			{children}
		</Menu.Trigger>
	);
}

export function AddPopup({ positionerProps, style, ...props }: PromptComposerAddPopupProps) {
	return (
		<Menu.Popup
			positionerProps={{
				align: "start",
				side: "top",
				sideOffset: ADD_MENU_SIDE_OFFSET,
				...positionerProps,
			}}
			style={[parts.addMenu, style]}
			{...props}
		/>
	);
}

export function AddItemContent({ className, style, ...props }: PromptComposerAddItemContentProps) {
	const sx = stylex.props(parts.addMenuCopy, style);
	return <span className={joinClassNames(sx.className, className)} style={sx.style} {...props} />;
}

export function AddItemDescription({ className, style, ...props }: PromptComposerAddItemDescriptionProps) {
	const sx = stylex.props(parts.addMenuDescription, style);
	return <span className={joinClassNames(sx.className, className)} style={sx.style} {...props} />;
}

function usePromptComposerContext(part: string) {
	const context = useContext(PromptComposerContext);
	if (!context) {
		throw new Error(`PromptComposer.${part} must be used inside PromptComposer.Root.`);
	}
	return context;
}

function joinClassNames(...classNames: Array<string | undefined>) {
	return classNames.filter(Boolean).join(" ");
}

const parts = stylex.create({
	root: {
		gap: space[2],
		color: colors["--text"],
		display: "flex",
		flexDirection: "column",
		maxWidth: "42rem",
		width: "100%",
	},
	options: {
		gap: space[1],
		alignItems: "center",
		display: "flex",
		minWidth: 0,
	},
	addMenu: { minWidth: "15rem" },
	addMenuCopy: {
		gap: space[2],
		gridColumn: "2 / 4",
		alignItems: "baseline",
		display: "flex",
		minWidth: 0,
	},
	addMenuDescription: {
		overflow: "hidden",
		color: colors["--text-muted"],
		fontSize: fontSize.x1,
		letterSpacing: letterSpacing.x1,
		lineHeight: lineHeight.x1,
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
	},
});
