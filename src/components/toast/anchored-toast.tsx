import { CheckCircleIcon } from "@phosphor-icons/react/dist/csr/CheckCircle";
import { InfoIcon } from "@phosphor-icons/react/dist/csr/Info";
import { WarningCircleIcon } from "@phosphor-icons/react/dist/csr/WarningCircle";
import { XIcon } from "@phosphor-icons/react/dist/csr/X";
import { Toast as BaseToast } from "@base-ui/react/toast";
import type { ToastManager } from "@base-ui/react/toast";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { zIndex } from "@/styles/constants.stylex";
import { tokens } from "@/theme/tokens.stylex";
import { focusRing } from "@/styles/recipes/focus";
import { Loader } from "@/components/loader/loader";
import { popupMotionStyles } from "@/components/popover/popover.stylex";
import { tooltipStyles } from "@/components/tooltip/tooltip.stylex";
import { popupVars } from "@/components/popover/popover-vars.stylex";
import { pressable } from "@/styles/recipes/transitions";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";

import {
	anchoredToastManager,
	type AnchoredToastData,
	type AnchoredToastStatus,
	type AnchoredToastTone,
	useAnchoredToastManager,
} from "./anchored-toast-manager";
import { toastMotion } from "./toast-motion.stylex";
import { toastControlStyles, toastTextStyles } from "./toast-parts";
import { attrJoin } from "@/utils/attr-join";

export type AnchoredToastObject = BaseToast.Root.ToastObject<AnchoredToastData>;

type StyledProps<T> = Omit<T, "className" | "style" | "xstyle"> &
	BaseStyleProps & { className?: string };

export function AnchoredViewport({
	ref,
	className,
	style,
	xstyle,
	...props
}: StyledProps<BaseToast.Viewport.Props>) {
	const sx = stylex.props(anchoredParts.viewport, xstyle);

	return (
		<BaseToast.Viewport
			ref={ref}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...props}
		/>
	);
}

export function AnchoredPositioner({
	ref,
	className,
	style,
	xstyle,
	...props
}: StyledProps<BaseToast.Positioner.Props>) {
	// The positioner must snap to Base UI's first resolved coordinates.
	// Entry/exit motion belongs to the toast root so it grows from the anchor.
	const sx = stylex.props(anchoredParts.positioner, xstyle);

	return (
		<BaseToast.Positioner
			ref={ref}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...props}
		/>
	);
}

export type AnchoredToastProps = BaseStyleProps & {
	toast: AnchoredToastObject;
	className?: string;
	positionerClassName?: string;
	positionerStyle?: BaseStyleProps["style"];
	positionerXstyle?: StyleXStyles;
};

/**
 * Opinionated renderer for a Base UI toast anchored to a trigger element.
 *
 * Use this directly for custom viewports, or use AnchoredProvider for the
 * complete provider/portal/viewport composition.
 */
export function AnchoredToast({
	toast,
	className,
	positionerClassName,
	positionerStyle,
	positionerXstyle,
	style,
	xstyle,
}: AnchoredToastProps) {
	const data = toast.data ?? {};
	const variant = data.variant ?? "default";
	const status = data.status ?? (variant === "pill" ? "ongoing" : "idle");
	const tone = data.tone ?? toneForStatus(status);
	const dismissible = data.dismissible ?? variant === "default";
	const defaultIcon = variant !== "tooltip" && (status !== "idle" || variant === "pill");
	const customIcon =
		data.icon !== undefined && data.icon !== null && data.icon !== false && data.icon !== true;
	const showGeneratedIcon = data.icon === true || (data.icon === undefined && defaultIcon);
	const showIcon = customIcon || showGeneratedIcon;
	const sideOffset = toast.positionerProps?.sideOffset ?? (variant === "tooltip" ? 4 : 8);
	const updateKey = toast.updateKey ?? 0;
	const pulseStyle =
		updateKey === 0
			? null
			: updateKey % 2 === 0
				? anchoredMotion.renotifyEven
				: anchoredMotion.renotifyOdd;
	const rootSx = stylex.props(
		anchoredParts.root,
		popupMotionStyles.anchoredPopup,
		variant === "tooltip" && popupMotionStyles.tooltipPopup,
		variant !== "tooltip" && anchoredMotion.feedbackPopup,
		variant === "tooltip" && tooltipStyles.chrome,
		(variant === "default" || variant === "popover") && anchoredParts.panelSurface,
		rootVariants[variant],
		pulseStyle,
		focusRing.inset,
		xstyle,
	);

	return (
		<AnchoredPositioner
			toast={toast}
			sideOffset={sideOffset}
			className={positionerClassName}
			style={positionerStyle}
			xstyle={positionerXstyle}
		>
			<BaseToast.Root
				toast={toast}
				data-variant={variant}
				data-tone={tone}
				data-status={status}
				className={attrJoin(rootSx.className, className)}
				style={mergeStyle(rootSx.style, style)}
			>
				<BaseToast.Content
					{...stylex.props(
						anchoredParts.content,
						contentVariants[variant === "popover" ? "default" : variant],
						variant === "pill" && anchoredParts.pillContent,
					)}
				>
					{showIcon ? (
						<span
							aria-hidden
							{...stylex.props(
								anchoredParts.icon,
								iconToneVariants[tone],
								variant === "tooltip" && anchoredParts.tooltipIcon,
								variant === "pill" && anchoredParts.pillIcon,
								variant === "pill" && pillIconToneVariants[tone],
							)}
						>
							{customIcon
								? data.icon
								: statusIcon(status, variant === "tooltip" ? "1em" : variant === "pill" ? 16 : 18)}
						</span>
					) : null}
					{variant === "tooltip" ? (
						<BaseToast.Title {...stylex.props(anchoredParts.tooltipTitle)}>
							{toast.title ?? toast.description}
						</BaseToast.Title>
					) : (
						<span
							{...stylex.props(anchoredParts.text, variant === "pill" && anchoredParts.pillText)}
						>
							{toast.title != null ? (
								<BaseToast.Title {...stylex.props(variant === "pill" && anchoredParts.pillTitle)} />
							) : null}
							{toast.description != null ? (
								<BaseToast.Description
									{...stylex.props(
										toastTextStyles.description,
										variant === "pill" && anchoredParts.pillDescription,
									)}
								/>
							) : null}
						</span>
					)}
					{variant !== "tooltip" && toast.actionProps != null ? (
						<BaseToast.Action
							{...stylex.props(toastControlStyles.action, focusRing.offset, pressable.transition)}
						/>
					) : null}
					{variant !== "tooltip" && dismissible ? (
						<BaseToast.Close
							aria-label="Dismiss notification"
							{...stylex.props(
								toastControlStyles.close,
								toastControlStyles.anchoredClose,
								focusRing.offset,
								pressable.transition,
							)}
						>
							<XIcon aria-hidden size={14} weight="bold" />
						</BaseToast.Close>
					) : null}
				</BaseToast.Content>
			</BaseToast.Root>
		</AnchoredPositioner>
	);
}

export type AnchoredProviderProps = Omit<BaseToast.Provider.Props, "toastManager"> & {
	toastManager?: ToastManager<AnchoredToastData>;
	portalProps?: BaseToast.Portal.Props;
	viewportProps?: StyledProps<BaseToast.Viewport.Props>;
};

/**
 * Complete anchored-toast channel. It intentionally owns a manager separate
 * from the stacked toast provider, as recommended by Base UI.
 */
export function AnchoredProvider({
	children,
	toastManager = anchoredToastManager,
	portalProps,
	viewportProps,
	timeout = 4000,
	limit = 5,
	...props
}: AnchoredProviderProps) {
	return (
		<BaseToast.Provider toastManager={toastManager} timeout={timeout} limit={limit} {...props}>
			{children}
			<AnchoredToastList portalProps={portalProps} viewportProps={viewportProps} />
		</BaseToast.Provider>
	);
}

function AnchoredToastList({
	portalProps,
	viewportProps,
}: Pick<AnchoredProviderProps, "portalProps" | "viewportProps">) {
	const { toasts } = useAnchoredToastManager();

	return (
		<BaseToast.Portal {...portalProps}>
			<AnchoredViewport {...viewportProps}>
				{toasts
					.filter((toast) => toast.positionerProps?.anchor != null)
					.map((toast) => (
						<AnchoredToast key={toast.id} toast={toast} />
					))}
			</AnchoredViewport>
		</BaseToast.Portal>
	);
}

function toneForStatus(status: AnchoredToastStatus): AnchoredToastTone {
	if (status === "success") return "success";
	if (status === "error") return "error";
	if (status === "loading" || status === "ongoing") return "accent";
	return "neutral";
}

function statusIcon(status: AnchoredToastStatus, size: number | string = 18) {
	if (status === "success") return <CheckCircleIcon size={size} weight="fill" />;
	if (status === "error") return <WarningCircleIcon size={size} weight="fill" />;
	if (status === "loading" || status === "ongoing") {
		const loaderStyle =
			size === 16
				? anchoredParts.generatedPillLoader
				: size === "1em"
					? anchoredParts.generatedTooltipLoader
					: anchoredParts.generatedLoader;
		return <Loader aria-hidden style={loaderStyle} />;
	}
	return <InfoIcon size={size} weight="fill" />;
}

const renotifyEven = stylex.keyframes({
	"0%, 100%": { scale: 1 },
	"50%": { scale: 1.04 },
});

const renotifyOdd = stylex.keyframes({
	"0%, 100%": { scale: 1 },
	// Keep this visually equivalent to renotifyEven while preventing StyleX
	// from hashing both keyframes to the same animation name.
	"49.9%": { scale: 1.04 },
});

const anchoredMotion = stylex.create({
	feedbackPopup: {
		[popupVars.duration]: tokens["--motion-duration-medium"],
		[popupVars.easing]: tokens["--motion-ease-out"],
	},
	renotifyEven: {
		animationDuration: toastMotion.renotifyDuration,
		animationName: renotifyEven,
		animationTimingFunction: "ease",
	},
	renotifyOdd: {
		animationDuration: toastMotion.renotifyDuration,
		animationName: renotifyOdd,
		animationTimingFunction: "ease",
	},
});

const anchoredParts = stylex.create({
	panelSurface: {
		[popupVars.background]: tokens["--panel"],
		[popupVars.border]: tokens["--border"],
		[popupVars.foreground]: tokens["--fg"],
		borderRadius: tokens["--radius-lg"],
		backgroundColor: popupVars.background,
		boxShadow: tokens["--shadow-md"],
		color: popupVars.foreground,
	},
	viewport: {
		outline: "0",
		pointerEvents: "none",
	},
	positioner: {
		pointerEvents: "none",
		visibility: {
			"[data-anchor-hidden]": "hidden",
			default: "visible",
		},
		zIndex: `calc(${zIndex.toast} - var(--toast-index))`,
	},
	root: {
		boxSizing: "border-box",
		cursor: "default",
		display: "flex",
		flexDirection: "column",
		fontSize: tokens["--font-size-2"],
		letterSpacing: tokens["--letter-spacing-2"],
		lineHeight: tokens["--line-height-2"],
		pointerEvents: "auto",
		position: "relative",
		transformOrigin: "var(--transform-origin)",
		maxWidth: `min(calc(100vw - 24px), ${tokens["--size-container-xs"]})`,
		width: "max-content",
	},
	content: {
		alignItems: "flex-start",
		boxSizing: "border-box",
		display: "flex",
	},
	text: {
		gap: tokens["--space-1"],
		display: "flex",
		flexDirection: "column",
		flexGrow: 1,
		minWidth: 0,
	},
	tooltipTitle: {
		margin: 0,
		fontSize: "inherit",
		lineHeight: "inherit",
	},
	icon: {
		borderRadius: tokens["--radius-full"],
		alignItems: "center",
		display: "inline-flex",
		flexShrink: 0,
		justifyContent: "center",
		height: "28px",
		width: "28px",
	},
	tooltipIcon: {
		backgroundColor: "transparent",
		color: "inherit",
		fontSize: "inherit",
		height: "1em",
		width: "1em",
	},
	pillIcon: {
		backgroundColor: "transparent",
		marginInlineStart: "-.25em",
		height: "16px",
		width: "16px",
	},
	pillContent: {
		alignItems: "center",
		boxSizing: "border-box",
		display: "flex",
		justifyContent: "space-between",
		height: "100%",
	},
	pillText: {
		margin: 0,
		gap: tokens["--space-2"],
		overflow: "hidden",
		alignItems: "center",
		flexDirection: "row",
	},
	pillTitle: {
		margin: 0,
		overflow: "hidden",
		color: tokens["--fg"],
		flexShrink: 1,
		fontSize: tokens["--font-size-2"],
		fontWeight: tokens["--font-weight-regular"],
		letterSpacing: tokens["--letter-spacing-2"],
		lineHeight: tokens["--line-height-2"],
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
	},
	pillDescription: {
		color: tokens["--fg-subtle"],
		display: "inline-flex",
		flexShrink: 0,
		fontSize: tokens["--font-size-2"],
		letterSpacing: tokens["--letter-spacing-2"],
		lineHeight: tokens["--line-height-2"],
		whiteSpace: "nowrap",
	},
	generatedLoader: {
		fontSize: "18px",
	},
	generatedTooltipLoader: {
		fontSize: "1em",
	},
	generatedPillLoader: {
		fontSize: "16px",
	},
});

const rootVariants = stylex.create({
	default: {
		minWidth: "128px",
	},
	tooltip: {
		minWidth: 0,
	},
	popover: {
		maxWidth: "min(320px, calc(100vw - 24px))",
	},
	pill: {
		[popupVars.background]: tokens["--surface-subtle"],
		[popupVars.border]: "rgb(255 255 255 / 9%)",
		[popupVars.foreground]: tokens["--fg"],
		borderRadius: tokens["--radius-md"],
		alignItems: "center",
		backgroundColor: popupVars.background,
		boxShadow: tokens["--shadow-md"],
		color: popupVars.foreground,
		outlineColor: popupVars.border,
		outlineOffset: "-1px",
		outlineStyle: "solid",
		outlineWidth: "1px",
		height: tokens["--size-control-md"],
		maxWidth: "min(360px, calc(100vw - 24px))",
		minWidth: 0,
	},
});

const contentVariants = stylex.create({
	default: {
		padding: tokens["--space-3"],
		gap: tokens["--space-3"],
	},
	tooltip: {
		padding: 0,
		gap: tokens["--space-1"],
	},
	pill: {
		gap: tokens["--space-2"],
		paddingBlock: "0",
		paddingInline: tokens["--space-3"],
	},
});

const iconToneVariants = stylex.create({
	neutral: {
		backgroundColor: tokens["--surface-subtle"],
		color: tokens["--fill-neutral"],
	},
	accent: {
		backgroundColor: tokens["--bg-accent"],
		color: tokens["--fill-accent"],
	},
	success: {
		backgroundColor: tokens["--bg-success"],
		color: tokens["--fill-success"],
	},
	error: {
		backgroundColor: tokens["--bg-error"],
		color: tokens["--fill-error"],
	},
});

const pillIconToneVariants = stylex.create({
	neutral: {
		color: tokens["--fill-neutral"],
	},
	accent: {
		color: tokens["--fill-accent"],
	},
	success: {
		color: tokens["--fill-success"],
	},
	error: {
		color: tokens["--fill-error"],
	},
});
