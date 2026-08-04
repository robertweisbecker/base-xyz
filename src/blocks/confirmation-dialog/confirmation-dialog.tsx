import { XIcon } from "@phosphor-icons/react/dist/csr/X";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { createContext, type ComponentProps, type ReactElement, type ReactNode, useContext } from "react";
import { Button, type ButtonProps } from "@/components/button/button";
import * as Dialog from "@/components/dialog/dialog";
import { ScrollArea } from "@/components/scroll-area/scroll-area";
import * as Toast from "@/components/toast";
import { color, radius, space } from "@/styles/tokens.stylex";

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
	/**
	 * Content announced after confirmation. Pass `false` to suppress feedback.
	 */
	successToast?: ConfirmationDialogSuccessToast | false;
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
	successToast: ConfirmationDialogSuccessToast | false;
};

const ConfirmationDialogContext = createContext<(() => void) | null>(null);

const defaultSuccessToast: ConfirmationDialogSuccessToast = {
	title: "Changes confirmed",
	description: "Your changes were saved successfully.",
};

export function Root({
	trigger,
	children,
	size = "md",
	successToast = defaultSuccessToast,
	...rootProps
}: ConfirmationDialogProps) {
	return (
		<Toast.Provider timeout={5000}>
			<ConfirmationDialogRoot {...rootProps} trigger={trigger} size={size} successToast={successToast}>
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

function ConfirmationDialogRoot({ trigger, children, size, successToast, ...rootProps }: ConfirmationDialogRootProps) {
	const toastManager = Toast.useToastManager();

	function notifySuccess() {
		if (successToast) {
			toastManager.add(successToast);
		}
	}

	return (
		<ConfirmationDialogContext.Provider value={notifySuccess}>
			<Dialog.Root {...rootProps} modal disablePointerDismissal>
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
	const notifySuccess = useContext(ConfirmationDialogContext);

	return (
		<Dialog.Close
			render={
				<Button
					variant={variant}
					{...props}
					onClick={(event) => {
						onClick?.(event);
						if (!event.defaultPrevented) {
							notifySuccess?.();
						}
					}}
				/>
			}>
			{children}
		</Dialog.Close>
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
		maxHeight: `calc(100dvh - ${space[8]})`,
	},
	header: {
		alignItems: "stretch",
		flexShrink: 0,
		paddingBlockStart: space[5],
		textAlign: "start",
	},
	visual: {
		borderRadius: radius.sm,
		alignItems: "center",
		alignSelf: "flex-start",
		backgroundColor: color.surfaceSubtle,
		color: color.fg,
		display: "flex",
		justifyContent: "center",
		marginBlockEnd: space[2],
		height: space[10],
		width: space[10],
	},
	body: {
		flex: "1 1 auto",
		minHeight: 0,
	},
	bodyViewport: {
		maxHeight: "min(50dvh, 28rem)",
	},
	bodyContent: {
		padding: space[5],
	},
	footer: {
		flexShrink: 0,
		justifyContent: "space-between",
	},
	footerActions: {
		flex: "0 0 auto",
		gap: space[2],
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
