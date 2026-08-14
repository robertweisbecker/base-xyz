import { XIcon } from "@phosphor-icons/react/dist/csr/X";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import {
	createContext,
	type ComponentProps,
	type ReactElement,
	type ReactNode,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { Button, Dialog, ScrollArea, Toast } from "@/components";
import type { ButtonProps } from "@/components";
import { tokens } from "@/theme/tokens.stylex";

export type ConfirmationDialogSize = "sm" | "md" | "lg";

export type ConfirmationDialogSuccessToast = {
	title: ReactNode;
	description?: ReactNode;
};

type DialogRootProps = Omit<ComponentProps<typeof Dialog.Root>, "children" | "disablePointerDismissal" | "modal">;

export type ConfirmationDialogProps = DialogRootProps & {
	/**
	 * The control that opens the dialog. Omit it when the dialog is controlled
	 * by the `open` prop.
	 */
	trigger?: ReactElement;
	children: ReactNode;
	size?: ConfirmationDialogSize;
	/** The operation to settle before the dialog closes and success is announced. */
	onConfirm?: () => void | Promise<void>;
	/** Observes a rejected confirmation operation after failure feedback is shown. */
	onConfirmError?: (error: unknown) => void;
	/**
	 * Content announced after confirmation. Pass `false` to suppress feedback.
	 */
	successToast?: ConfirmationDialogSuccessToast | false;
	/** Content announced when confirmation fails. Pass `false` to suppress feedback. */
	failureToast?: ConfirmationDialogSuccessToast | false;
};

type StyledProps<T> = Omit<T, "style"> & {
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export type ConfirmationDialogHeaderProps = ComponentProps<typeof Dialog.Header>;
export type ConfirmationDialogVisualProps = StyledProps<ComponentProps<"div">>;
export type ConfirmationDialogTitleProps = ComponentProps<typeof Dialog.Title>;
export type ConfirmationDialogDescriptionProps = ComponentProps<typeof Dialog.Description>;

export type ConfirmationDialogBodyProps = {
	children: ReactNode;
	/**
	 * Accessible name for the internally scrollable region.
	 */
	label?: string;
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export type ConfirmationDialogFooterProps = ComponentProps<typeof Dialog.Footer>;
export type ConfirmationDialogActionsProps = StyledProps<ComponentProps<"div">>;
export type ConfirmationDialogCancelProps = ButtonProps;
export type ConfirmationDialogConfirmProps = ButtonProps;

type ConfirmationDialogRootProps = DialogRootProps & {
	trigger?: ReactElement;
	children: ReactNode;
	size: ConfirmationDialogSize;
	onConfirm?: () => void | Promise<void>;
	onConfirmError?: (error: unknown) => void;
	successToast: ConfirmationDialogSuccessToast | false;
	failureToast: ConfirmationDialogSuccessToast | false;
};

type ConfirmationDialogActions = Exclude<NonNullable<DialogRootProps["actionsRef"]>["current"], null>;

type ConfirmationDialogContextValue = {
	confirm: () => Promise<void>;
	pending: boolean;
};

const ConfirmationDialogContext = createContext<ConfirmationDialogContextValue | null>(null);

const defaultSuccessToast: ConfirmationDialogSuccessToast = {
	title: "Changes confirmed",
	description: "Your changes were saved successfully.",
};

const defaultFailureToast: ConfirmationDialogSuccessToast = {
	title: "Couldn’t complete action",
	description: "Try again.",
};

export function Root({
	trigger,
	children,
	size = "md",
	onConfirm,
	onConfirmError,
	successToast = defaultSuccessToast,
	failureToast = defaultFailureToast,
	actionsRef,
	...rootProps
}: ConfirmationDialogProps) {
	return (
		<Toast.Provider timeout={5000}>
			<ConfirmationDialogRoot
				{...rootProps}
				actionsRef={actionsRef}
				trigger={trigger}
				size={size}
				onConfirm={onConfirm}
				onConfirmError={onConfirmError}
				successToast={successToast}
				failureToast={failureToast}>
				{children}
			</ConfirmationDialogRoot>
			<Toast.Portal>
				<Toast.Viewport>
					<ToastList />
				</Toast.Viewport>
			</Toast.Portal>
		</Toast.Provider>
	);
}

function ConfirmationDialogRoot({
	actionsRef,
	trigger,
	children,
	size,
	onConfirm,
	onConfirmError,
	successToast,
	failureToast,
	...rootProps
}: ConfirmationDialogRootProps) {
	const toastManager = Toast.useToastManager();
	const internalActionsRef = useRef<ConfirmationDialogActions | null>(null);
	const resolvedActionsRef = actionsRef ?? internalActionsRef;
	const pendingRef = useRef(false);
	const mountedRef = useRef(true);
	const [pending, setPending] = useState(false);

	useEffect(() => {
		return () => {
			mountedRef.current = false;
		};
	}, []);

	function notifySuccess() {
		if (successToast) {
			toastManager.add(successToast);
		}
	}

	function notifyFailure() {
		if (failureToast) {
			toastManager.add(failureToast);
		}
	}

	async function confirm() {
		if (pendingRef.current) return;

		pendingRef.current = true;
		setPending(true);

		try {
			await onConfirm?.();
			if (!mountedRef.current) return;
			notifySuccess();
			resolvedActionsRef.current?.close();
		} catch (error) {
			if (!mountedRef.current) return;
			notifyFailure();
			onConfirmError?.(error);
		} finally {
			pendingRef.current = false;
			if (mountedRef.current) {
				setPending(false);
			}
		}
	}

	return (
		<ConfirmationDialogContext.Provider value={{ confirm, pending }}>
			<Dialog.Root {...rootProps} actionsRef={resolvedActionsRef} modal disablePointerDismissal>
				{trigger ? <Dialog.Trigger render={trigger} /> : null}
				<Dialog.Popup scrollBehavior="inside" style={[confirmationDialogParts.popup, dialogSizes[size]]}>
					{children}
				</Dialog.Popup>
			</Dialog.Root>
		</ConfirmationDialogContext.Provider>
	);
}

export function Header({ style, ...props }: ConfirmationDialogHeaderProps) {
	return <Dialog.Header style={[confirmationDialogParts.header, style]} {...props} />;
}

export function Visual({ className, style, ...props }: ConfirmationDialogVisualProps) {
	const sx = stylex.props(confirmationDialogParts.visual, style);

	return (
		<div
			data-confirmation-dialog-visual
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}
		/>
	);
}

export const Title = Dialog.Title;
export const Description = Dialog.Description;

export function Body({ children, label = "Confirmation details", className, style }: ConfirmationDialogBodyProps) {
	return (
		<ScrollArea
			label={label}
			size="content"
			className={className}
			style={[confirmationDialogParts.body, style]}
			viewportStyle={confirmationDialogParts.bodyViewport}
			contentStyle={confirmationDialogParts.bodyContent}>
			{children}
		</ScrollArea>
	);
}

export function Footer({ style, ...props }: ConfirmationDialogFooterProps) {
	return <Dialog.Footer style={[confirmationDialogParts.footer, style]} {...props} />;
}

export function Actions({ className, style, ...props }: ConfirmationDialogActionsProps) {
	const sx = stylex.props(confirmationDialogParts.footerActions, style);

	return <div className={[sx.className, className].filter(Boolean).join(" ")} style={sx.style} {...props} />;
}

export function Cancel({ children, variant = "neutral", ...props }: ConfirmationDialogCancelProps) {
	return <Dialog.Close render={<Button variant={variant} {...props} />}>{children}</Dialog.Close>;
}

export function Confirm({ children, onClick, variant = "primary", ...props }: ConfirmationDialogConfirmProps) {
	const context = useContext(ConfirmationDialogContext);

	return (
		<Button
			variant={variant}
			{...props}
			loading={context?.pending || props.loading}
			onClick={(event) => {
				onClick?.(event);
				if (!event.defaultPrevented) {
					void context?.confirm();
				}
			}}>
			{children}
		</Button>
	);
}

function ToastList() {
	const { toasts } = Toast.useToastManager();

	return toasts.map((toast) => (
		<Toast.Root key={toast.id} toast={toast} swipeDirection={["up", "down", "left", "right"]}>
			<Toast.Content>
				<Toast.Text>
					<Toast.Title />
					<Toast.Description />
				</Toast.Text>
				<Toast.Close aria-label="Dismiss notification">
					<XIcon aria-hidden size={16} weight="bold" />
				</Toast.Close>
			</Toast.Content>
		</Toast.Root>
	));
}

const confirmationDialogParts = stylex.create({
	popup: {
		maxHeight: `calc(100dvh - ${tokens["--space-8"]})`,
	},
	header: {
		alignItems: "stretch",
		flexShrink: 0,
		paddingBlockStart: tokens["--space-5"],
		textAlign: "start",
	},
	visual: {
		borderRadius: tokens["--radius-sm"],
		alignItems: "center",
		alignSelf: "flex-start",
		backgroundColor: tokens["--surface-subtle"],
		color: tokens["--fg"],
		display: "flex",
		justifyContent: "center",
		marginBlockEnd: tokens["--space-2"],
		height: tokens["--space-10"],
		width: tokens["--space-10"],
	},
	body: {
		flex: "1 1 auto",
		minHeight: 0,
	},
	bodyViewport: {
		maxHeight: "min(50dvh, 28rem)",
	},
	bodyContent: {
		padding: tokens["--space-5"],
	},
	footer: {
		flexShrink: 0,
		justifyContent: "space-between",
	},
	footerActions: {
		flex: "0 0 auto",
		gap: tokens["--space-2"],
		alignItems: "center",
		display: "flex",
		marginInlineStart: "auto",
	},
});

const dialogSizes = stylex.create({
	sm: { maxWidth: "22rem" },
	md: { maxWidth: "30rem" },
	lg: { maxWidth: "40rem" },
});

export const ConfirmationDialog = {
	Root,
	Header,
	Visual,
	Title,
	Description,
	Body,
	Footer,
	Actions,
	Cancel,
	Confirm,
} as const;
