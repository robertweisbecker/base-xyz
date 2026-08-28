/* eslint-disable react/only-export-components -- Compound component parts are intentionally grouped into the InlineEdit namespace. */
import { Button as BaseButton } from "@base-ui/react/button";
import { Input as BaseInput } from "@base-ui/react/input";
import { XIcon } from "@phosphor-icons/react/dist/csr/X";
import * as stylex from "@stylexjs/stylex";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
	type ReactNode,
	type Ref,
} from "react";
import { IconButton, type IconButtonProps } from "@/components/button/button";
import { fieldStyles } from "@/components/field/field.stylex";
import { Icon } from "@/components/icons";
import {
	textColorStyles,
	textTabularStyles,
	textTruncationStyles,
	textWrapStyles,
	typescaleStyles,
} from "@/components/text/text.stylex";
import type {
	TypographyColor,
	TypographyFontFamily,
	TypographyFontWeight,
	TypographySize,
	TypographyWrap,
} from "@/components/text/text.types";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { extractMarginProps, type MarginProps } from "@/styles/props/spacing.stylex";
import { resolveTypography, type TypographyProps } from "@/styles/props/typography.stylex";
import { focusRing } from "@/styles/recipes/focus";
import { media } from "@/styles/constants.stylex";
import { tokens } from "@/theme/tokens.stylex";
import { attrJoin } from "@/utils/attr-join";

export type InlineEditChangeReason = "edit" | "confirm" | "cancel";

export type InlineEditChangeDetails = {
	reason: InlineEditChangeReason;
};

type InlineEditTypographyProps = {
	color?: TypographyColor;
	fontFamily?: TypographyFontFamily;
	fontWeight?: TypographyFontWeight;
	size?: TypographySize;
	tabular?: boolean;
	textAlign?: TypographyProps["textAlign"];
	truncate?: boolean;
	wrap?: TypographyWrap;
};

export type InlineEditRootProps = Omit<
	React.ComponentPropsWithRef<"span">,
	| "children"
	| "className"
	| "color"
	| "onBlur"
	| "onKeyDown"
	| "style"
	| keyof MarginProps
	| keyof InlineEditTypographyProps
> &
	MarginProps &
	BaseStyleProps &
	InlineEditTypographyProps & {
		className?: string;
		children: ReactNode;
		defaultEditing?: boolean;
		disabled?: boolean;
		editing?: boolean;
		confirmOnBlur?: boolean;
		confirmOnEnter?: boolean;
		onConfirm?: () => void | Promise<void>;
		onConfirmError?: (error: unknown) => void;
		onEditingChange?: (editing: boolean, details: InlineEditChangeDetails) => void;
	};

export type InlineEditValueProps = Omit<
	BaseButton.Props,
	"aria-label" | "children" | "className" | "nativeButton" | "render" | "style" | "type"
> &
	BaseStyleProps & {
		children: ReactNode;
		className?: string;
		label: string;
	};

export type InlineEditInputProps = Omit<BaseInput.Props, "className" | "style"> &
	BaseStyleProps & {
		className?: string;
	};

export type InlineEditActionsProps = Omit<
	React.ComponentPropsWithRef<"span">,
	"className" | "style"
> &
	BaseStyleProps & {
		className?: string;
	};

export type InlineEditConfirmProps = Omit<IconButtonProps, "icon" | "loading" | "shape">;

export type InlineEditCancelProps = Omit<IconButtonProps, "icon" | "loading" | "shape">;

type InlineEditContextValue = {
	disabled: boolean;
	editing: boolean;
	inputRef: React.RefObject<HTMLInputElement | null>;
	pending: boolean;
	valueRef: React.RefObject<HTMLButtonElement | null>;
	cancel: () => void;
	confirm: (restoreFocus?: boolean) => Promise<void>;
	startEditing: () => void;
	truncate: boolean;
	wrap: TypographyWrap | undefined;
};

const InlineEditContext = createContext<InlineEditContextValue | null>(null);

function useInlineEditContext(part: string) {
	const context = useContext(InlineEditContext);
	if (context === null) {
		throw new Error(`InlineEdit.${part} must be rendered within InlineEdit.Root.`);
	}
	return context;
}

function InlineEditRoot({
	ref,
	children,
	className,
	color,
	confirmOnBlur = true,
	confirmOnEnter = false,
	defaultEditing = false,
	disabled = false,
	editing: controlledEditing,
	fontFamily,
	fontWeight,
	onConfirm,
	onConfirmError,
	onEditingChange,
	size,
	style,
	tabular = false,
	textAlign,
	truncate = false,
	wrap,
	xstyle,
	...props
}: InlineEditRootProps) {
	const { marginStyles, rest } = extractMarginProps(props);
	const [uncontrolledEditing, setUncontrolledEditing] = useState(defaultEditing);
	const [pending, setPending] = useState(false);
	const controlledModeRef = useRef(controlledEditing !== undefined);
	const editing = controlledModeRef.current ? (controlledEditing ?? false) : uncontrolledEditing;
	const rootRef = useRef<HTMLSpanElement | null>(null);
	const inputRef = useRef<HTMLInputElement | null>(null);
	const valueRef = useRef<HTMLButtonElement | null>(null);
	const mountedRef = useRef(false);
	const pendingRef = useRef(false);
	const restoreFocusRef = useRef(false);
	const previousEditingRef = useRef(false);
	const editingRef = useRef(editing);
	const onEditingChangeRef = useRef(onEditingChange);

	editingRef.current = editing;
	onEditingChangeRef.current = onEditingChange;

	useEffect(() => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
		};
	}, []);

	const requestEditing = useCallback((nextEditing: boolean, reason: InlineEditChangeReason) => {
		if (editingRef.current === nextEditing) return;
		if (!controlledModeRef.current) setUncontrolledEditing(nextEditing);
		onEditingChangeRef.current?.(nextEditing, { reason });
	}, []);

	const startEditing = useCallback(() => {
		if (disabled || pendingRef.current) return;
		restoreFocusRef.current = false;
		requestEditing(true, "edit");
	}, [disabled, requestEditing]);

	const cancel = useCallback(() => {
		if (!editingRef.current || disabled || pendingRef.current) return;
		restoreFocusRef.current = true;
		requestEditing(false, "cancel");
	}, [disabled, requestEditing]);

	const confirm = useCallback(
		async (restoreFocus = true) => {
			if (!editingRef.current || disabled || pendingRef.current) return;
			if (inputRef.current && !inputRef.current.checkValidity()) {
				inputRef.current.reportValidity();
				return;
			}
			pendingRef.current = true;
			setPending(true);
			try {
				await onConfirm?.();
				if (!mountedRef.current) return;
				restoreFocusRef.current = restoreFocus;
				requestEditing(false, "confirm");
			} catch (error) {
				if (mountedRef.current) {
					onConfirmError?.(error);
					if (mountedRef.current) queueMicrotask(() => inputRef.current?.focus());
				}
			} finally {
				pendingRef.current = false;
				if (mountedRef.current) setPending(false);
			}
		},
		[disabled, onConfirm, onConfirmError, requestEditing],
	);

	useEffect(() => {
		if (editing && !previousEditingRef.current) {
			restoreFocusRef.current = true;
			inputRef.current?.focus();
		}
		if (!editing && previousEditingRef.current && restoreFocusRef.current) {
			valueRef.current?.focus();
		}
		previousEditingRef.current = editing;
	}, [editing]);

	const contextValue = useMemo<InlineEditContextValue>(
		() => ({
			cancel,
			confirm,
			disabled,
			editing,
			inputRef,
			pending,
			startEditing,
			truncate,
			valueRef,
			wrap,
		}),
		[cancel, confirm, disabled, editing, pending, startEditing, truncate, wrap],
	);

	const sx = stylex.props(
		inlineEditStyles.root,
		editing ? inlineEditStyles.rootEditing : inlineEditStyles.rootIdle,
		editing && focusRing.within,
		color !== undefined && textColorStyles[color],
		size !== undefined && typescaleStyles[size],
		tabular && textTabularStyles.tabular,
		...resolveTypography({ fontFamily, fontWeight, textAlign }),
		...marginStyles,
		xstyle,
	);

	return (
		<InlineEditContext.Provider value={contextValue}>
			<span
				ref={useComposedRef(ref, rootRef)}
				{...rest}
				aria-busy={pending || undefined}
				data-disabled={disabled ? "" : undefined}
				data-editing={editing ? "" : undefined}
				data-pending={pending ? "" : undefined}
				className={attrJoin(sx.className, className)}
				style={mergeStyle(sx.style, style)}
				onBlur={(event) => {
					if (event.defaultPrevented || !confirmOnBlur || !editing || pending) return;
					if (
						event.relatedTarget instanceof Node &&
						event.currentTarget.contains(event.relatedTarget)
					) {
						return;
					}
					queueMicrotask(() => {
						if (!rootRef.current?.contains(document.activeElement)) void confirm(false);
					});
				}}
				onKeyDown={(event) => {
					if (
						event.defaultPrevented ||
						!editing ||
						disabled ||
						pending ||
						event.repeat ||
						event.nativeEvent.isComposing
					) {
						return;
					}
					if (event.key === "Escape") {
						event.preventDefault();
						cancel();
						return;
					}
					if (
						confirmOnEnter &&
						event.key === "Enter" &&
						event.target === inputRef.current &&
						!event.altKey &&
						!event.ctrlKey &&
						!event.metaKey &&
						!event.shiftKey
					) {
						event.preventDefault();
						void confirm();
					}
				}}
			>
				{children}
			</span>
		</InlineEditContext.Provider>
	);
}

function InlineEditValue({
	ref,
	children,
	className,
	disabled,
	label,
	onClick,
	style,
	xstyle,
	...props
}: InlineEditValueProps) {
	const context = useInlineEditContext("Value");
	const composedRef = useComposedRef(ref, context.valueRef);
	if (context.editing) return null;
	const isDisabled = context.disabled || disabled;
	const sx = stylex.props(
		inlineEditStyles.value,
		!isDisabled && inlineEditStyles.valueEnabled,
		context.wrap !== undefined && textWrapStyles[context.wrap],
		context.truncate && textTruncationStyles.truncate,
		focusRing.offset,
		xstyle,
	);
	return (
		<BaseButton
			ref={composedRef}
			{...props}
			disabled={isDisabled}
			aria-label={label}
			nativeButton
			type="button"
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			onClick={(event) => {
				onClick?.(event);
				if (!event.defaultPrevented) context.startEditing();
			}}
		>
			{children}
		</BaseButton>
	);
}

function InlineEditInput({
	ref,
	className,
	disabled,
	readOnly,
	style,
	xstyle,
	...props
}: InlineEditInputProps) {
	const context = useInlineEditContext("Input");
	const composedRef = useComposedRef(ref, context.inputRef);
	const sx = stylex.props(
		fieldStyles.inputUnstyled,
		inlineEditStyles.input,
		!context.editing && inlineEditStyles.inputIdle,
		xstyle,
	);
	return (
		<BaseInput
			ref={composedRef}
			{...props}
			disabled={context.disabled || disabled}
			readOnly={context.pending || readOnly}
			tabIndex={context.editing ? props.tabIndex : -1}
			aria-hidden={context.editing ? undefined : true}
			aria-busy={context.pending || undefined}
			data-pending={context.pending ? "" : undefined}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
		/>
	);
}

function InlineEditActions({ ref, className, style, xstyle, ...props }: InlineEditActionsProps) {
	const context = useInlineEditContext("Actions");
	if (!context.editing) return null;
	const sx = stylex.props(inlineEditStyles.actions, xstyle);
	return (
		<span
			ref={ref}
			{...props}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
		/>
	);
}

function InlineEditConfirm({
	label,
	onClick,
	size = "xs",
	variant = "ghost",
	...props
}: InlineEditConfirmProps) {
	const context = useInlineEditContext("Confirm");
	return (
		<IconButton
			{...props}
			type="button"
			icon={<Icon.Checkmark strokeWidth={3} />}
			label={label}
			loading={context.pending}
			disabled={context.disabled || props.disabled}
			size={size}
			shape="square"
			variant={variant}
			onClick={(event) => {
				onClick?.(event);
				if (!event.defaultPrevented) void context.confirm();
			}}
		/>
	);
}

function InlineEditCancel({
	label,
	onClick,
	size = "xs",
	variant = "ghost",
	...props
}: InlineEditCancelProps) {
	const context = useInlineEditContext("Cancel");
	return (
		<IconButton
			{...props}
			type="button"
			icon={<XIcon aria-hidden weight="bold" />}
			label={label}
			disabled={context.disabled || context.pending || props.disabled}
			size={size}
			shape="square"
			variant={variant}
			onClick={(event) => {
				onClick?.(event);
				if (!event.defaultPrevented) context.cancel();
			}}
		/>
	);
}

export const InlineEdit = {
	Actions: InlineEditActions,
	Cancel: InlineEditCancel,
	Confirm: InlineEditConfirm,
	Input: InlineEditInput,
	Root: InlineEditRoot,
	Value: InlineEditValue,
} as const;

function useComposedRef<T>(...refs: Array<Ref<T> | undefined>) {
	return useCallback(
		(value: T | null) => {
			const cleanups = refs.map((ref) => setRef(ref, value));
			return () => {
				for (const cleanup of cleanups) cleanup?.();
			};
		},
		// The refs passed by these compound parts are stable in practice, while the
		// array wrapper is newly allocated on every render.
		// eslint-disable-next-line react-hooks/exhaustive-deps
		refs,
	);
}

function setRef<T>(ref: Ref<T> | undefined, value: T | null) {
	if (typeof ref === "function") {
		const cleanup = ref(value);
		return typeof cleanup === "function" ? cleanup : () => ref(null);
	}
	if (ref !== null && ref !== undefined) {
		ref.current = value;
		return () => {
			ref.current = null;
		};
	}
	return undefined;
}

const inlineEditStyles = stylex.create({
	root: {
		font: "inherit",
		boxSizing: "border-box",
		color: "inherit",
		letterSpacing: "inherit",
		textTransform: "inherit",
		verticalAlign: "baseline",
		minWidth: 0,
	},
	rootIdle: {
		display: "inline",
	},
	rootEditing: {
		borderColor: tokens["--border-input"],
		borderRadius: tokens["--radius-sm"],
		borderStyle: "solid",
		borderWidth: "1px",
		paddingBlock: tokens["--space-0-5"],
		paddingInline: tokens["--space-1"],
		alignItems: "center",
		backgroundColor: tokens["--surface"],
		columnGap: tokens["--space-1"],
		display: "inline-flex",
	},
	value: {
		font: "inherit",
		margin: 0,
		padding: 0,
		borderColor: "transparent",
		borderRadius: tokens["--radius-xxs"],
		borderStyle: "solid",
		borderWidth: 0,
		appearance: "none",
		backgroundColor: "transparent",
		boxSizing: "border-box",
		color: "inherit",
		cursor: {
			"[data-disabled]": "not-allowed",
			default: "default",
		},
		display: "inline",
		fontVariantNumeric: "inherit",
		letterSpacing: "inherit",
		lineHeight: "inherit",
		opacity: 1,
		textAlign: "inherit",
		textTransform: "inherit",
		transform: "none",
		userSelect: "text",
		verticalAlign: "baseline",
		whiteSpace: "inherit",
		minHeight: 0,
	},
	valueEnabled: {
		backgroundColor: {
			default: null,
			":hover": {
				[media.canHover]: tokens["--surface-subtle-hover"],
			},
		},
	},
	input: {
		font: "inherit",
		padding: 0,
		borderWidth: 0,
		appearance: "none",
		backgroundColor: "transparent",
		boxSizing: "border-box",
		color: "inherit",
		flexGrow: 1,
		fontVariantNumeric: "inherit",
		letterSpacing: "inherit",
		lineHeight: "inherit",
		textAlign: "inherit",
		textTransform: "inherit",
		minWidth: "8ch",
		width: "20ch",
	},
	inputIdle: {
		margin: "-1px",
		overflow: "hidden",
		clip: "rect(0 0 0 0)",
		clipPath: "inset(50%)",
		position: "absolute",
		whiteSpace: "nowrap",
		height: "1px",
		width: "1px",
	},
	actions: {
		alignItems: "center",
		columnGap: tokens["--space-0-5"],
		display: "inline-flex",
		flexShrink: 0,
	},
});
