import { AlertDialog as BaseAlertDialog } from "@base-ui/react/alert-dialog";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { type ComponentProps } from "react";
import {
	alertBackdropStyles,
	alertViewportStyles,
	modalPopupStyles,
	modalTextStyles,
} from "@/components/dialog/dialog.stylex";
import { tokens } from "@/theme/tokens.stylex";


type StyledProps<T> = Omit<T, "className" | "style"> & {
	className?: string;
	style?: StyleXStyles;
};

export type AlertDialogBackdropProps = StyledProps<BaseAlertDialog.Backdrop.Props>;
export type AlertDialogViewportProps = StyledProps<BaseAlertDialog.Viewport.Props>;
export type AlertDialogPopupProps = StyledProps<BaseAlertDialog.Popup.Props> & {
	backdropProps?: AlertDialogBackdropProps | false;
	portalProps?: Omit<BaseAlertDialog.Portal.Props, "children">;
	viewportProps?: AlertDialogViewportProps;
};

function Backdrop({ ref, className, style, ...props }: AlertDialogBackdropProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(alertBackdropStyles, style);

	return (
		<BaseAlertDialog.Backdrop
			ref={ref}
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}
			{...props}
		/>
	);
}

function Viewport({ ref, className, style, ...props }: AlertDialogViewportProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(alertViewportStyles, style);

	return (
		<BaseAlertDialog.Viewport
			ref={ref}
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}
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
	viewportProps,
	...props
}: AlertDialogPopupProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(modalPopupStyles, alertDialogParts.popup, style);

	return (
		<BaseAlertDialog.Portal {...portalProps}>
			{backdropProps === false ? null : <Backdrop {...backdropProps} />}
			<Viewport {...viewportProps}>
				<BaseAlertDialog.Popup
					ref={ref}
					className={[sxClassName, className].filter(Boolean).join(" ")}
					style={sxStyle}
					{...props}
				>
					{children}
				</BaseAlertDialog.Popup>
			</Viewport>
		</BaseAlertDialog.Portal>
	);
}

export function Title({ ref, className, style, ...props }: StyledProps<BaseAlertDialog.Title.Props>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(modalTextStyles.title, alertDialogParts.title, style);

	return (
		<BaseAlertDialog.Title
			ref={ref}
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}
			{...props}
		/>
	);
}

export function Description({ ref, className, style, ...props }: StyledProps<BaseAlertDialog.Description.Props>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(modalTextStyles.description, style);

	return (
		<BaseAlertDialog.Description
			ref={ref}
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}
			{...props}
		/>
	);
}

export function Header({ className, style, ...props }: StyledProps<ComponentProps<"div">>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(alertDialogParts.header, style);

	return <div className={[sxClassName, className].filter(Boolean).join(" ")} style={sxStyle} {...props} />;
}

export function Footer({ className, style, ...props }: StyledProps<ComponentProps<"div">>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(modalTextStyles.footer, alertDialogParts.footer, style);

	return <div className={[sxClassName, className].filter(Boolean).join(" ")} style={sxStyle} {...props} />;
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
