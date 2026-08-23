import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import * as stylex from "@stylexjs/stylex";
import { type ComponentProps } from "react";
import {
	modalBackdropStyles,
	modalPopupStyles,
	modalTextStyles,
	modalViewportStyles,
} from "@/components/dialog/dialog.stylex";
import { tokens } from "@/theme/tokens.stylex";
import { CloseButton as CloseButtonControl } from "@/components/button/close-button";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { attrJoin } from "@/utils/attr-join";

type StyledProps<T> = Omit<T, "className" | "style" | "xstyle"> & BaseStyleProps & { className?: string };

export type DialogScrollBehavior = "popup" | "inside" | "outside";

export type DialogBackdropProps = StyledProps<BaseDialog.Backdrop.Props>;
export type DialogViewportProps = StyledProps<BaseDialog.Viewport.Props>;
export type DialogPopupProps = StyledProps<BaseDialog.Popup.Props> & {
	backdropProps?: DialogBackdropProps | false;
	portalProps?: Omit<BaseDialog.Portal.Props, "children">;
	scrollBehavior?: DialogScrollBehavior;
	showClose?: boolean;
	viewportProps?: DialogViewportProps;
};

export type DialogCloseProps = StyledProps<BaseDialog.Close.Props>;
export type DialogCloseButtonProps = Omit<DialogCloseProps, "aria-label" | "children" | "render"> & {
	"aria-label"?: string;
};

type InternalDialogViewportProps = DialogViewportProps & {
	scrollBehavior?: DialogScrollBehavior;
};

function Backdrop({ ref, className, style, xstyle, ...props }: DialogBackdropProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(modalBackdropStyles, xstyle);

	return (
		<BaseDialog.Backdrop
			ref={ref}
			className={attrJoin(sxClassName, className)}
			style={mergeStyle(sxStyle, style)}
			{...props}
		/>
	);
}

function Viewport({ ref, className, style, xstyle, scrollBehavior = "popup", ...props }: InternalDialogViewportProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(
		modalViewportStyles,
		scrollBehavior === "outside" && dialogParts.outsideScrollViewport,
		xstyle,
	);

	return (
		<BaseDialog.Viewport
			ref={ref}
			className={attrJoin(sxClassName, className)}
			style={mergeStyle(sxStyle, style)}
			{...props}
		/>
	);
}

export function Popup({
	ref,
	backdropProps = {},
	children,
	className,
	portalProps,
	scrollBehavior = "popup",
	showClose = true,
	style,
	xstyle,
	viewportProps,
	...props
}: DialogPopupProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(
		modalPopupStyles,
		dialogParts.popup,
		dialogScrollBehavior[scrollBehavior],
		xstyle,
	);

	return (
		<BaseDialog.Portal {...portalProps}>
			{backdropProps === false ? null : <Backdrop {...backdropProps} />}
			<Viewport scrollBehavior={scrollBehavior} {...viewportProps}>
				<BaseDialog.Popup
					ref={ref}
					className={attrJoin(sxClassName, className)}
					style={mergeStyle(sxStyle, style)}
					{...props}>
					{children}
					{showClose && <CloseButton />}
				</BaseDialog.Popup>
			</Viewport>
		</BaseDialog.Portal>
	);
}

export function Title({ ref, className, style, xstyle, ...props }: StyledProps<BaseDialog.Title.Props>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(modalTextStyles.title, xstyle);

	return (
		<BaseDialog.Title
			ref={ref}
			className={attrJoin(sxClassName, className)}
			style={mergeStyle(sxStyle, style)}
			{...props}
		/>
	);
}

export function Description({ ref, className, style, xstyle, ...props }: StyledProps<BaseDialog.Description.Props>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(modalTextStyles.description, xstyle);

	return (
		<BaseDialog.Description
			ref={ref}
			className={attrJoin(sxClassName, className)}
			style={mergeStyle(sxStyle, style)}
			{...props}
		/>
	);
}

export function Header({ className, style, xstyle, ...props }: StyledProps<ComponentProps<"div">>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(dialogParts.header, xstyle);

	return <div className={attrJoin(sxClassName, className)} style={mergeStyle(sxStyle, style)} {...props} />;
}

export function Body({ className, style, xstyle, ...props }: StyledProps<ComponentProps<"div">>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(modalTextStyles.body, dialogParts.body, xstyle);

	return <div className={attrJoin(sxClassName, className)} style={mergeStyle(sxStyle, style)} {...props} />;
}

export function Footer({ className, style, xstyle, ...props }: StyledProps<ComponentProps<"div">>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(modalTextStyles.footer, dialogParts.footer, xstyle);

	return <div className={attrJoin(sxClassName, className)} style={mergeStyle(sxStyle, style)} {...props} />;
}

/** Unstyled close primitive for custom buttons and footer actions. */
export function Close({ ref, className, style, xstyle, ...props }: DialogCloseProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(xstyle);

	return (
		<BaseDialog.Close
			ref={ref}
			className={attrJoin(sxClassName, className) || undefined}
			style={mergeStyle(sxStyle, style)}
			{...props}
		/>
	);
}

/** Neutral circular X button, absolutely positioned in the popup by default. */
export function CloseButton({
	ref,
	"aria-label": ariaLabel = "Close",
	className,
	xstyle,
	...props
}: DialogCloseButtonProps) {
	return (
		<Close
			ref={ref}
			aria-label={ariaLabel}
			className={className}
			nativeButton
			render={<CloseButtonControl size="md" label={ariaLabel} xstyle={[dialogParts.closeButton, xstyle]} />}
			{...props}
		/>
	);
}

export const Root = BaseDialog.Root;
export const Trigger = BaseDialog.Trigger;

const dialogParts = stylex.create({
	popup: {
		"--_dialog-header-padding-inline-end": tokens["--space-6"],
		maxWidth: "440px",
	},
	closeButton: {
		flexShrink: 0,
		insetBlockStart: tokens["--space-3"],
		insetInlineEnd: tokens["--space-3"],
		position: "absolute",
		zIndex: 1,
	},
	outsideScrollViewport: {
		paddingBlock: tokens["--space-8"],
		alignItems: "flex-start",
		overflowY: "auto",
	},
	header: {
		gap: tokens["--space-1"],
		paddingInline: tokens["--space-6"],
		display: "flex",
		flexDirection: "column",
		paddingBlockStart: tokens["--space-6"],
		paddingInlineEnd: "var(--_dialog-header-padding-inline-end)",
	},
	body: {
		paddingBlock: tokens["--space-4"],
		paddingInline: tokens["--space-6"],
	},
	footer: {
		gap: tokens["--space-3"],
		paddingBlockEnd: tokens["--space-4"],
		paddingBlockStart: tokens["--space-4"],
		paddingInlineEnd: tokens["--space-4"],
		paddingInlineStart: tokens["--space-6"],
		borderTopColor: tokens["--border"],
		borderTopStyle: "solid",
		borderTopWidth: "0.5px",
	},
});

const dialogScrollBehavior = stylex.create({
	popup: {
		overflow: "auto",
		maxHeight: `calc(100dvh - ${tokens["--space-8"]})`,
	},
	inside: {
		overflow: "hidden",
		maxHeight: `calc(100dvh - ${tokens["--space-8"]})`,
	},
	outside: {
		overflow: "visible",
		maxHeight: "none",
	},
});

export const Dialog = {
	Root,
	Trigger,
	Popup,
	Title,
	Description,
	Header,
	Body,
	Footer,
	Close,
	CloseButton,
} as const;
