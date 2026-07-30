import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { type ComponentProps } from "react";
import { modalBackdropStyles, modalPopupStyles, modalTextStyles, modalViewportStyles } from "@/components/dialog/dialog.stylex";
import { color, space } from "@/styles/tokens.stylex";

type StyledProps<T> = Omit<T, "className" | "style"> & {
	className?: string;
	style?: StyleXStyles;
};

export type DialogScrollBehavior = "popup" | "inside" | "outside";

export type DialogBackdropProps = StyledProps<BaseDialog.Backdrop.Props>;
export type DialogViewportProps = StyledProps<BaseDialog.Viewport.Props>;
export type DialogPopupProps = StyledProps<BaseDialog.Popup.Props> & {
	backdropProps?: DialogBackdropProps | false;
	portalProps?: Omit<BaseDialog.Portal.Props, "children">;
	scrollBehavior?: DialogScrollBehavior;
	viewportProps?: DialogViewportProps;
};

type InternalDialogViewportProps = DialogViewportProps & {
	scrollBehavior?: DialogScrollBehavior;
};

function Backdrop({ ref, className, style, ...props }: DialogBackdropProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(modalBackdropStyles, style);

	return (
		<BaseDialog.Backdrop
			ref={ref}
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}
			{...props}
		/>
	);
}

function Viewport({ ref, className, style, scrollBehavior = "popup", ...props }: InternalDialogViewportProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(
		modalViewportStyles,
		scrollBehavior === "outside" && dialogParts.outsideScrollViewport,
		style,
	);

	return (
		<BaseDialog.Viewport
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
	scrollBehavior = "popup",
	style,
	viewportProps,
	...props
}: DialogPopupProps) {
	const { className: sxClassName, style: sxStyle } = stylex.props(
		modalPopupStyles,
		dialogParts.popup,
		dialogScrollBehavior[scrollBehavior],
		style,
	);

	return (
		<BaseDialog.Portal {...portalProps}>
			{backdropProps === false ? null : <Backdrop {...backdropProps} />}
			<Viewport scrollBehavior={scrollBehavior} {...viewportProps}>
				<BaseDialog.Popup
					ref={ref}
					className={[sxClassName, className].filter(Boolean).join(" ")}
					style={sxStyle}
					{...props}
				>
					{children}
				</BaseDialog.Popup>
			</Viewport>
		</BaseDialog.Portal>
	);
}

export function Title({ ref, className, style, ...props }: StyledProps<BaseDialog.Title.Props>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(modalTextStyles.title, style);

	return (
		<BaseDialog.Title
			ref={ref}
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}
			{...props}
		/>
	);
}

export function Description({ ref, className, style, ...props }: StyledProps<BaseDialog.Description.Props>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(modalTextStyles.description, style);

	return (
		<BaseDialog.Description
			ref={ref}
			className={[sxClassName, className].filter(Boolean).join(" ")}
			style={sxStyle}
			{...props}
		/>
	);
}

export function Header({ className, style, ...props }: StyledProps<ComponentProps<"div">>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(dialogParts.header, style);

	return <div className={[sxClassName, className].filter(Boolean).join(" ")} style={sxStyle} {...props} />;
}

export function Body({ className, style, ...props }: StyledProps<ComponentProps<"div">>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(modalTextStyles.body, dialogParts.body, style);

	return <div className={[sxClassName, className].filter(Boolean).join(" ")} style={sxStyle} {...props} />;
}

export function Footer({ className, style, ...props }: StyledProps<ComponentProps<"div">>) {
	const { className: sxClassName, style: sxStyle } = stylex.props(modalTextStyles.footer, dialogParts.footer, style);

	return <div className={[sxClassName, className].filter(Boolean).join(" ")} style={sxStyle} {...props} />;
}

export const Root = BaseDialog.Root;
export const Trigger = BaseDialog.Trigger;
export const Close = BaseDialog.Close;

const dialogParts = stylex.create({
	popup: {
		maxWidth: "440px",
	},
	outsideScrollViewport: {
		paddingBlock: space.x8,
		alignItems: "flex-start",
		overflowY: "auto",
	},
	header: {
		gap: space.x1,
		paddingInline: space.x6,
		display: "flex",
		flexDirection: "column",
		paddingBlockStart: space.x6,
	},
	body: {
		padding: space.x6,
	},
	footer: {
		gap: space.x3,
		paddingBlock: space.x4,
		paddingInlineEnd: space.x4,
		paddingInlineStart: space.x6,
		borderTopColor: color.border,
		borderTopStyle: "solid",
		borderTopWidth: "0.5px",
	},
});

const dialogScrollBehavior = stylex.create({
	popup: {
		overflow: "auto",
		maxHeight: `calc(100dvh - ${space.x8})`,
	},
	inside: {
		overflow: "hidden",
		maxHeight: `calc(100dvh - ${space.x8})`,
	},
	outside: {
		overflow: "visible",
		maxHeight: "none",
	},
});
