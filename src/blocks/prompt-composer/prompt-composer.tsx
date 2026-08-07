import { Form } from "@base-ui/react/form";
import { useMergedRefs } from "@base-ui/utils/useMergedRefs";
import { ArrowUpIcon } from "@phosphor-icons/react/dist/csr/ArrowUp";
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import { SquareIcon } from "@phosphor-icons/react/dist/csr/Square";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import {
	createContext,
	type ComponentProps,
	type KeyboardEvent,
	type RefObject,
	useContext,
	useRef,
	useState,
} from "react";
import { Button, IconButton, InputGroup, Menu } from "@/components";
import type { ButtonProps } from "@/components";
import { useScrollFade } from "@/hooks/use-scroll-fade";
import { tokens } from "@/theme/tokens.stylex";

type PromptComposerContextValue = {
	canSubmit: boolean;
	disabled: boolean;
	submitting: boolean;
	surfaceRef: RefObject<HTMLDivElement | null>;
	value: string;
	updateValue: (value: string) => void;
	submit: () => void;
};

const PromptComposerContext = createContext<PromptComposerContextValue | null>(null);

type StyledProps<T> = Omit<T, "style"> & {
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

type FormProps = StyledProps<Omit<ComponentProps<typeof Form>, "className" | "onSubmit" | "onFormSubmit">> & {
	className?: string;
};
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
export type PromptComposerHeaderProps = ComponentProps<typeof InputGroup.Header>;
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
	const surfaceRef = useRef<HTMLDivElement | null>(null);
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

	const sx = stylex.props(parts.root, style);

	return (
		<PromptComposerContext.Provider
			value={{
				canSubmit,
				disabled,
				submitting,
				surfaceRef,
				value: currentValue,
				updateValue,
				submit,
			}}>
			<Form className={joinClassNames(sx.className, className)} onFormSubmit={submit} style={sx.style} {...props} />
		</PromptComposerContext.Provider>
	);
}

export function Surface({ ref: forwardedRef, variant = "elevated", style, ...props }: PromptComposerSurfaceProps) {
	const { surfaceRef } = usePromptComposerContext("Surface");

	function setRefs(node: HTMLDivElement | null) {
		surfaceRef.current = node;
		if (typeof forwardedRef === "function") {
			forwardedRef(node);
		} else if (forwardedRef) {
			forwardedRef.current = node;
		}
	}

	return <InputGroup.Root ref={setRefs} variant={variant} {...props} style={[parts.inputGroup, style]} />;
}

export function Input({
	"aria-label": ariaLabel = "Message",
	placeholder = "Ask anything…",
	rows = 3,
	className,
	style,
	onChange,
	onKeyDown,
	ref,
	...props
}: PromptComposerInputProps) {
	const context = usePromptComposerContext("Input");
	const scrollFade = useScrollFade({ axis: "y", contentKey: context.value });
	const mergedRef = useMergedRefs(ref, scrollFade.ref);

	function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
		onKeyDown?.(event);
		if (!event.defaultPrevented && event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
			event.preventDefault();
			context.submit();
		}
	}

	const inputSx = stylex.props(parts.input);

	return (
		<InputGroup.Textarea
			aria-label={ariaLabel}
			className={joinClassNames(scrollFade.className, inputSx.className, className)}
			disabled={context.disabled}
			onChange={(event) => {
				onChange?.(event);
				if (!event.defaultPrevented) context.updateValue(event.currentTarget.value);
			}}
			onKeyDown={handleKeyDown}
			placeholder={placeholder}
			ref={mergedRef}
			rows={rows}
			style={style}
			value={context.value}
			{...props}
		/>
	);
}

export const Header = InputGroup.Header;

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
	shape = "circle",
	size = "lg",
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
	const { surfaceRef } = usePromptComposerContext("AddPopup");
	return (
		<Menu.Popup
			positionerProps={{
				align: "start",
				anchor: surfaceRef,
				side: "top",
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
		gap: tokens["--space-2"],
		color: tokens["--fg"],
		display: "flex",
		flexDirection: "column",
		maxWidth: "42rem",
		width: "100%",
	},
	/**
	 * Denser shell than InputGroup defaults: Root owns even inline inset; Header /
	 * Footer / Textarea own block edges. Child inline padding clears so Root inset wins.
	 */
	inputGroup: {
		"--_input-group-child-padding-inline": tokens["--space-0"],
		borderRadius: "2rem",
		gap: 0,
		paddingBlock: 0,
		paddingInline: tokens["--space-4"],
		alignItems: "stretch",
		height: "auto",
		minHeight: 0,
	},
	/** Fade size + expand-on-focus; both are composer behavior, not InputGroup. */
	input: {
		"--scroll-fade-size": tokens["--space-8"],
		fieldSizing: {
			default: "fixed",
			":focus-within": "content",
		},
	},
	options: {
		gap: tokens["--space-1"],
		alignItems: "center",
		display: "flex",
		minWidth: 0,
	},
	addMenu: { minWidth: "15rem" },
	addMenuCopy: {
		gap: tokens["--space-2"],
		gridColumn: "2 / 4",
		alignItems: "baseline",
		display: "flex",
		minWidth: 0,
	},
	addMenuDescription: {
		overflow: "hidden",
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-1"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
	},
});

export const PromptComposer = {
	Root,
	Surface,
	Input,
	Header,
	Footer,
	Options,
	Actions,
	Submit,
	Stop,
	AddTrigger,
	AddPopup,
	AddItemContent,
	AddItemDescription,
} as const;
