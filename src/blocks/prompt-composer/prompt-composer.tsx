import { Form } from "@base-ui/react/form";
import { IconArrowUp, IconPlus, IconStopFill } from "fyicons";
import * as stylex from "@stylexjs/stylex";
import {
	createContext,
	type ComponentProps,
	type KeyboardEvent,
	type RefObject,
	useContext,
	useCallback,
	useMemo,
	useRef,
	useState,
	useSyncExternalStore,
} from "react";
import { Button, IconButton, InputGroup, Kbd, Menu } from "@/components";
import type { ButtonProps } from "@/components";
import { useMergedRefs } from "@/hooks/use-merged-refs";
import { useScrollFade } from "@/hooks/use-scroll-fade";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { attrJoin } from "@/utils/attr-join";
import { useComposerLayout } from "./use-composer-layout";

import { composerMarker, promptComposerStyles as parts } from "./prompt-composer.stylex";

type PromptComposerContextValue = {
	layout: "adaptive" | "stacked";
	canSubmit: boolean;
	disabled: boolean;
	submitting: boolean;
	surfaceRef: RefObject<HTMLDivElement | null>;
	value: string;
	updateValue: (value: string) => void;
	submit: () => void;
};

const PromptComposerContext = createContext<PromptComposerContextValue | null>(null);

type StyledProps<T> = Omit<T, "style" | "xstyle"> & BaseStyleProps;

type FormProps = StyledProps<
	Omit<ComponentProps<typeof Form>, "className" | "onSubmit" | "onFormSubmit">
> & {
	className?: string;
};
export type PromptComposerRootProps = FormProps & {
	/** Controls share the input row when the draft fits. Defaults to adaptive. */
	layout?: "adaptive" | "stacked";
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
	layout = "adaptive",
	value,
	defaultValue = "",
	onValueChange,
	onSubmit,
	disabled = false,
	submitting = false,
	clearOnSubmit = true,
	className,
	style,
	xstyle,
	...props
}: PromptComposerRootProps) {
	const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
	const surfaceRef = useRef<HTMLDivElement | null>(null);
	const isControlled = value !== undefined;
	const currentValue = isControlled ? value : uncontrolledValue;
	const canSubmit = currentValue.trim().length > 0 && !disabled && !submitting;

	const updateValue = useCallback(
		(nextValue: string) => {
			if (!isControlled) setUncontrolledValue(nextValue);
			onValueChange?.(nextValue);
		},
		[isControlled, onValueChange],
	);

	const submit = useCallback(() => {
		const prompt = currentValue.trim();
		if (!prompt || disabled || submitting) return;
		onSubmit(prompt);
		if (clearOnSubmit) updateValue("");
	}, [clearOnSubmit, currentValue, disabled, onSubmit, submitting, updateValue]);

	const contextValue = useMemo(
		() => ({
			layout,
			canSubmit,
			disabled,
			submitting,
			surfaceRef,
			value: currentValue,
			updateValue,
			submit,
		}),
		[layout, canSubmit, currentValue, disabled, submit, submitting, updateValue],
	);

	const sx = stylex.props(parts.root, xstyle);

	return (
		<PromptComposerContext.Provider value={contextValue}>
			<Form
				className={attrJoin(sx.className, className)}
				onFormSubmit={submit}
				style={mergeStyle(sx.style, style)}
				{...props}
			/>
		</PromptComposerContext.Provider>
	);
}

export function Surface({
	ref: forwardedRef,
	variant = "elevated",
	className,
	style,
	xstyle,
	...props
}: PromptComposerSurfaceProps) {
	const { surfaceRef, layout, value } = usePromptComposerContext("Surface");
	const compact = useComposerLayout(surfaceRef, layout, value);
	const marker = stylex.props(composerMarker);
	const mergedRef = useMergedRefs(forwardedRef, surfaceRef);

	return (
		<InputGroup.Root
			ref={mergedRef}
			size="lg"
			variant={variant}
			{...props}
			data-compact={compact ? "" : undefined}
			className={attrJoin(marker.className, className)}
			style={mergeStyle(marker.style, style)}
			xstyle={[parts.inputGroup, compact && parts.compact, xstyle]}
		/>
	);
}

export function Input({
	"aria-label": ariaLabel = "Message",
	placeholder = "Ask anything…",
	rows = 1,
	minRows,
	maxRows,
	className,
	style,
	xstyle,
	onChange,
	onKeyDown,
	ref,
	...props
}: PromptComposerInputProps) {
	const context = usePromptComposerContext("Input");
	const resolvedMinRows = minRows ?? rows;
	const desktop = useSyncExternalStore(subscribeDesktop, isDesktop, () => false);
	const scrollFade = useScrollFade({ axis: "y", contentKey: context.value });
	const mergedRef = useMergedRefs(ref, scrollFade.ref);

	function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
		onKeyDown?.(event);
		if (
			!event.defaultPrevented &&
			event.key === "Enter" &&
			!event.shiftKey &&
			!event.nativeEvent.isComposing
		) {
			event.preventDefault();
			context.submit();
		}
	}

	return (
		<InputGroup.Textarea
			aria-label={ariaLabel}
			className={attrJoin(scrollFade.className, className)}
			disabled={context.disabled}
			onChange={(event) => {
				onChange?.(event);
				if (!event.defaultPrevented) context.updateValue(event.currentTarget.value);
			}}
			onKeyDown={handleKeyDown}
			placeholder={placeholder}
			ref={mergedRef}
			rows={rows}
			minRows={resolvedMinRows}
			maxRows={maxRows ?? (desktop ? 12 : 6)}
			style={style}
			value={context.value}
			{...props}
			xstyle={[parts.input, xstyle]}
		/>
	);
}

export const Header = InputGroup.Header;

export function Footer({ xstyle, ...props }: PromptComposerFooterProps) {
	return <InputGroup.Footer {...props} xstyle={[parts.footer, xstyle]} />;
}

export function Options({ className, style, xstyle, ...props }: PromptComposerOptionsProps) {
	const sx = stylex.props(parts.options, xstyle);
	return (
		<div
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...props}
			data-composer-options=""
		/>
	);
}

export function Actions({ xstyle, ...props }: PromptComposerActionsProps) {
	return (
		<InputGroup.Actions {...props} data-composer-actions="" xstyle={[parts.actions, xstyle]} />
	);
}

export function Submit({
	children,
	"aria-label": ariaLabel = "Send message",
	disabled,
	shape = "circle",
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
				icon={<IconArrowUp size="1em" aria-hidden />}
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
	shape = "circle",
	size = "md",
	type = "button",
	...props
}: PromptComposerStopProps) {
	if (children == null) {
		return (
			<IconButton
				{...props}
				icon={<IconStopFill size="1em" aria-hidden />}
				label={ariaLabel}
				shape={shape === "square" ? "square" : "circle"}
				size={size}
				type={type}
				variant="primary"
			/>
		);
	}

	return (
		<Button
			aria-label={ariaLabel}
			shape={shape}
			size={size}
			type={type}
			variant="primary"
			{...props}
		>
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
						icon={<IconPlus size="1em" aria-hidden />}
						label="Add files and more"
						tooltip={
							<>
								Add files and more
								<Kbd size="sm" ms={1}>
									@
								</Kbd>
							</>
						}
						shape="circle"
						variant="ghost"
						size="md"
					/>
				)
			}
			{...props}
		>
			{children}
		</Menu.Trigger>
	);
}

export function AddPopup({ positionerProps, xstyle, ...props }: PromptComposerAddPopupProps) {
	const { surfaceRef } = usePromptComposerContext("AddPopup");
	return (
		<Menu.Popup
			positionerProps={{
				align: "start",
				anchor: surfaceRef,
				side: "top",
				...positionerProps,
			}}
			xstyle={[parts.addMenu, xstyle]}
			{...props}
		/>
	);
}

export function AddItemContent({
	className,
	style,
	xstyle,
	...props
}: PromptComposerAddItemContentProps) {
	const sx = stylex.props(parts.addMenuCopy, xstyle);
	return (
		<span
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...props}
		/>
	);
}

export function AddItemDescription({
	className,
	style,
	xstyle,
	...props
}: PromptComposerAddItemDescriptionProps) {
	const sx = stylex.props(parts.addMenuDescription, xstyle);
	return (
		<span
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...props}
		/>
	);
}

function usePromptComposerContext(part: string) {
	const context = useContext(PromptComposerContext);
	if (!context) {
		throw new Error(`PromptComposer.${part} must be used inside PromptComposer.Root.`);
	}
	return context;
}

function isDesktop() {
	return window.matchMedia("(min-width: 48rem)").matches;
}

function subscribeDesktop(onChange: () => void) {
	const query = window.matchMedia("(min-width: 48rem)");
	query.addEventListener("change", onChange);
	return () => query.removeEventListener("change", onChange);
}

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
