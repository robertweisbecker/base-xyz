import { Form } from "@base-ui/react/form";
import { useMergedRefs } from "@base-ui/utils/useMergedRefs";
import { ArrowUpIcon } from "@phosphor-icons/react/dist/csr/ArrowUp";
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import { SquareIcon } from "@phosphor-icons/react/dist/csr/Square";
import * as stylex from "@stylexjs/stylex";
import {
	createContext,
	type ComponentProps,
	type KeyboardEvent,
	type RefObject,
	useContext,
	useRef,
	useState,
} from "react";
import { Button, IconButton, InputGroup, Kbd, Menu } from "@/components";
import type { ButtonProps } from "@/components";
import { useScrollFade } from "@/hooks/use-scroll-fade";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { tokens } from "@/theme/tokens.stylex";
import { attrJoin } from "@/utils/attr-join";

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

type StyledProps<T> = Omit<T, "style" | "xstyle"> & BaseStyleProps;

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
	xstyle,
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

	const sx = stylex.props(parts.root, xstyle);

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
			<Form
				className={attrJoin(sx.className, className)}
				onFormSubmit={submit}
				style={mergeStyle(sx.style, style)}
				{...props}
			/>
		</PromptComposerContext.Provider>
	);
}

export function Surface({ ref: forwardedRef, variant = "elevated", xstyle, ...props }: PromptComposerSurfaceProps) {
	const { surfaceRef } = usePromptComposerContext("Surface");
	const mergedRef = useMergedRefs(forwardedRef, surfaceRef);

	return <InputGroup.Root ref={mergedRef} size="lg" variant={variant} {...props} xstyle={[parts.inputGroup, xstyle]} />;
}

export function Input({
	"aria-label": ariaLabel = "Message",
	placeholder = "Ask anything…",
	rows = 3,
	minRows,
	maxRows,
	className,
	style,
	onChange,
	onKeyDown,
	ref,
	...props
}: PromptComposerInputProps) {
	const context = usePromptComposerContext("Input");
	const resolvedMinRows = minRows ?? rows;
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
			className={attrJoin(scrollFade.className, inputSx.className, className)}
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
			maxRows={maxRows}
			style={style}
			value={context.value}
			{...props}
		/>
	);
}

export const Header = InputGroup.Header;

export const Footer = InputGroup.Footer;

export function Options({ className, style, xstyle, ...props }: PromptComposerOptionsProps) {
	const sx = stylex.props(parts.options, xstyle);
	return <div className={attrJoin(sx.className, className)} style={mergeStyle(sx.style, style)} {...props} />;
}

export const Actions = InputGroup.Actions;

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
				icon={<ArrowUpIcon aria-hidden />}
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
				icon={<SquareIcon aria-hidden weight="fill" />}
				label={ariaLabel}
				shape={shape === "square" ? "square" : "circle"}
				size={size}
				type={type}
				variant="primary"
			/>
		);
	}

	return (
		<Button aria-label={ariaLabel} shape={shape} size={size} type={type} variant="primary" {...props}>
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
						icon={<PlusIcon aria-hidden />}
						label="Add files and more"
						tooltip={
							<>
								Add files and more
								<Kbd variant="inverse" size="sm" ms={1}>
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
			{...props}>
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

export function AddItemContent({ className, style, xstyle, ...props }: PromptComposerAddItemContentProps) {
	const sx = stylex.props(parts.addMenuCopy, xstyle);
	return <span className={attrJoin(sx.className, className)} style={mergeStyle(sx.style, style)} {...props} />;
}

export function AddItemDescription({ className, style, xstyle, ...props }: PromptComposerAddItemDescriptionProps) {
	const sx = stylex.props(parts.addMenuDescription, xstyle);
	return <span className={attrJoin(sx.className, className)} style={mergeStyle(sx.style, style)} {...props} />;
}

function usePromptComposerContext(part: string) {
	const context = useContext(PromptComposerContext);
	if (!context) {
		throw new Error(`PromptComposer.${part} must be used inside PromptComposer.Root.`);
	}
	return context;
}

const parts = stylex.create({
	root: {
		gap: tokens["--space-0"],
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
		"--_input-group-padding": tokens["--space-4"],
		"--_input-padding": tokens["--space-4"],
		borderRadius: "2.5rem",
		gap: 0,
		minHeight: null,
	},
	/** Fade size + expand-on-focus; both are composer behavior, not InputGroup. */
	input: {
		"--scroll-fade-size": tokens["--space-8"],
		minHeight: "0px",
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
		alignItems: "baseline",
		display: "flex",
		gridColumnEnd: "4",
		gridColumnStart: "2",
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
