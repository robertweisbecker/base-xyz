import { AlertDialog as BaseAlertDialog } from "@base-ui/react/alert-dialog";
import * as stylex from "@stylexjs/stylex";
import { type ComponentProps } from "react";
import {
	alertBackdropStyles,
	alertViewportStyles,
	modalPopupStyles,
	modalTextStyles,
} from "@/components/dialog/dialog.stylex";
import { tokens } from "@/theme/tokens.stylex";
import { attrJoin } from "@/utils/attr-join";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";

type StyledProps<T> = Omit<T, "className" | "style" | "xstyle"> & BaseStyleProps & { className?: string };

export type AlertDialogBackdropProps = StyledProps<BaseAlertDialog.Backdrop.Props>;
export type AlertDialogViewportProps = StyledProps<BaseAlertDialog.Viewport.Props>;
export type AlertDialogPopupProps = StyledProps<BaseAlertDialog.Popup.Props> & {
	backdropProps?: AlertDialogBackdropProps | false;
	portalProps?: Omit<BaseAlertDialog.Portal.Props, "children">;
	viewportProps?: AlertDialogViewportProps;
};

function Backdrop({ ref, className, style, xstyle, ...props }: AlertDialogBackdropProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(alertBackdropStyles, xstyle);

	return (
		<BaseAlertDialog.Backdrop
			ref={ref}
			className={attrJoin(sxClassName, className)}
			style={mergeStyle(sxStyle, style)}
			{...props}
		/>
	);
}

function Viewport({ ref, className, style, xstyle, ...props }: AlertDialogViewportProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(alertViewportStyles, xstyle);

	return (
		<BaseAlertDialog.Viewport
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
	style,
	xstyle,
	viewportProps,
	...props
}: AlertDialogPopupProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(modalPopupStyles, alertDialogParts.popup, xstyle);

	return (
		<BaseAlertDialog.Portal {...portalProps}>
			{backdropProps === false ? null : <Backdrop {...backdropProps} />}
			<Viewport {...viewportProps}>
				<BaseAlertDialog.Popup
					ref={ref}
					className={attrJoin(sxClassName, className)}
					style={mergeStyle(sxStyle, style)}
					{...props}
				>
					{children}
				</BaseAlertDialog.Popup>
			</Viewport>
		</BaseAlertDialog.Portal>
	);
}

export function Title({ ref, className, style, xstyle, ...props }: StyledProps<BaseAlertDialog.Title.Props>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(modalTextStyles.title, alertDialogParts.title, xstyle);

	return (
		<BaseAlertDialog.Title
			ref={ref}
			className={attrJoin(sxClassName, className)}
			style={mergeStyle(sxStyle, style)}
			{...props}
		/>
	);
}

export function Description({ ref, className, style, xstyle, ...props }: StyledProps<BaseAlertDialog.Description.Props>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(modalTextStyles.description, xstyle);

	return (
		<BaseAlertDialog.Description
			ref={ref}
			className={attrJoin(sxClassName, className)}
			style={mergeStyle(sxStyle, style)}
			{...props}
		/>
	);
}

export function Header({ className, style, xstyle, ...props }: StyledProps<ComponentProps<"div">>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(alertDialogParts.header, xstyle);

	return <div className={attrJoin(sxClassName, className)} style={mergeStyle(sxStyle, style)} {...props} />;
}

export function Footer({ className, style, xstyle, ...props }: StyledProps<ComponentProps<"div">>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(modalTextStyles.footer, alertDialogParts.footer, xstyle);

	return <div className={attrJoin(sxClassName, className)} style={mergeStyle(sxStyle, style)} {...props} />;
}

export const Root = BaseAlertDialog.Root;
export const Trigger = BaseAlertDialog.Trigger;
export const Close = BaseAlertDialog.Close;

const alertDialogParts = stylex.create({
	popup: {
		maxWidth: "22rem",
	},
	header: {
		padding: tokens["--space-6"],
		gap: tokens["--space-2"],
		display: "flex",
		flexDirection: "column",
	},
	title: {
		fontSize: tokens["--font-size-3"],
		letterSpacing: tokens["--letter-spacing-3"],
		lineHeight: tokens["--line-height-3"],
	},
	footer: {
		gap: tokens["--space-2"],
		paddingInline: tokens["--space-4"],
		paddingBlockEnd: tokens["--space-4"],
	},
});

export const AlertDialog = {
	Root,
	Trigger,
	Close,
	Popup,
	Title,
	Description,
	Header,
	Footer,
} as const;
