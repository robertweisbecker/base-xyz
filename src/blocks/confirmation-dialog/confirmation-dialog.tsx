import { XIcon } from "@phosphor-icons/react/dist/csr/X";
import * as stylex from "@stylexjs/stylex";
import {
	createContext,
	type ComponentProps,
	type ReactElement,
	type ReactNode,
	useContext,
	useEffect,
	useRef,
	useCallback,
	useMemo,
	useState,
} from "react";
import { Box, Button, Dialog, ScrollArea, Toast } from "@/components";
import type { BoxProps, ButtonProps } from "@/components";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { tokens } from "@/theme/tokens.stylex";
import { attrJoin } from "@/utils/attr-join";

export type ConfirmationDialogSize = "sm" | "md" | "lg";

export type ConfirmationDialogSuccessToast = {
	title: ReactNode;
	description?: ReactNode;
};

type DialogRootProps = Omit<
	ComponentProps<typeof Dialog.Root>,
	"children" | "disablePointerDismissal" | "modal"
>;

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

type StyledProps<T> = Omit<T, "style" | "xstyle"> & BaseStyleProps;

export type ConfirmationDialogHeaderProps = ComponentProps<typeof Dialog.Header>;
export type ConfirmationDialogVisualProps = BoxProps & { size?: number };
export type ConfirmationDialogTitleProps = ComponentProps<typeof Dialog.Title>;
export type ConfirmationDialogDescriptionProps = ComponentProps<typeof Dialog.Description>;

export type ConfirmationDialogBodyProps = BaseStyleProps & {
	children: ReactNode;
	/**
	 * Accessible name for the internally scrollable region.
	 */
	label?: string;
	className?: string;
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

type ConfirmationDialogActions = Exclude<
	NonNullable<DialogRootProps["actionsRef"]>["current"],
	null
>;

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
				failureToast={failureToast}
			>
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
	const { add: addToast } = Toast.useToastManager();
	const internalActionsRef = useRef<ConfirmationDialogActions | null>(null);
	const resolvedActionsRef = actionsRef ?? internalActionsRef;
	const pendingRef = useRef(false);
	const mountedRef = useRef(true);
	const [pending, setPending] = useState(false);

	useEffect(() => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
		};
	}, []);

	const confirm = useCallback(async () => {
		if (pendingRef.current) return;

		pendingRef.current = true;
		setPending(true);

		try {
			await onConfirm?.();
			if (!mountedRef.current) return;
			if (successToast) addToast(successToast);
			resolvedActionsRef.current?.close();
		} catch (error) {
			if (!mountedRef.current) return;
			if (failureToast) addToast(failureToast);
			onConfirmError?.(error);
		} finally {
			pendingRef.current = false;
			if (mountedRef.current) {
				setPending(false);
			}
		}
	}, [addToast, failureToast, onConfirm, onConfirmError, resolvedActionsRef, successToast]);
	const contextValue = useMemo(() => ({ confirm, pending }), [confirm, pending]);

	return (
		<ConfirmationDialogContext.Provider value={contextValue}>
			<Dialog.Root {...rootProps} actionsRef={resolvedActionsRef} modal disablePointerDismissal>
				{trigger ? <Dialog.Trigger render={trigger} /> : null}
				<Dialog.Popup
					scrollBehavior="inside"
					{...stylex.props(confirmationDialogParts.popup, dialogSizes[size])}
					showClose={false}
				>
					{children}
				</Dialog.Popup>
			</Dialog.Root>
		</ConfirmationDialogContext.Provider>
	);
}

export function Header({ xstyle, ...props }: ConfirmationDialogHeaderProps) {
	return <Dialog.Header xstyle={[confirmationDialogParts.header, xstyle]} {...props} />;
}

export function Visual({ size, xstyle, ...props }: ConfirmationDialogVisualProps) {
	return (
		<Box
			align="center"
			alignSelf="start"
			bg={props.bg ?? "surfaceSubtle"}
			color={props.color ?? "default"}
			display="flex"
			height={`calc(${size ?? 10} * ${tokens["--space-1"]})`}
			justify="center"
			mb={4}
			radius="sm"
			width={`calc(${size ?? 10} * ${tokens["--space-1"]})`}
			{...props}
			data-confirmation-dialog-visual
			xstyle={xstyle}
		/>
	);
}

export const Title = Dialog.Title;
export const Description = Dialog.Description;

export function Body({
	children,
	label = "Confirmation details",
	className,
	style,
	xstyle,
}: ConfirmationDialogBodyProps) {
	return (
		<ScrollArea
			label={label}
			size="content"
			className={className}
			style={style}
			xstyle={[confirmationDialogParts.body, confirmationDialogParts.bodyMaxHeight, xstyle]}
		>
			<div {...stylex.props(confirmationDialogParts.bodyContent)}>{children}</div>
		</ScrollArea>
	);
}

export function Footer({ xstyle, ...props }: ConfirmationDialogFooterProps) {
	return <Dialog.Footer xstyle={[confirmationDialogParts.footer, xstyle]} {...props} />;
}

export function Actions({ className, style, xstyle, ...props }: ConfirmationDialogActionsProps) {
	const sx = stylex.props(confirmationDialogParts.footerActions, xstyle);

	return (
		<div
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...props}
		/>
	);
}

export function Cancel({ children, variant = "neutral", ...props }: ConfirmationDialogCancelProps) {
	return <Dialog.Close render={<Button variant={variant} {...props} />}>{children}</Dialog.Close>;
}

export function Confirm({
	children,
	onClick,
	variant = "primary",
	...props
}: ConfirmationDialogConfirmProps) {
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
			}}
		>
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
	body: {
		flexBasis: "auto",
		flexGrow: "1",
		flexShrink: "1",
		minHeight: 0,
	},
	bodyMaxHeight: {
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
		gap: tokens["--space-2"],
		alignItems: "center",
		display: "flex",
		flexBasis: "auto",
		flexGrow: "0",
		flexShrink: "0",
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
