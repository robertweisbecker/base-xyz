import { CheckCircleIcon } from "@phosphor-icons/react/dist/csr/CheckCircle";
import { CircleNotchIcon } from "@phosphor-icons/react/dist/csr/CircleNotch";
import { InfoIcon } from "@phosphor-icons/react/dist/csr/Info";
import { WarningCircleIcon } from "@phosphor-icons/react/dist/csr/WarningCircle";
import { XIcon } from "@phosphor-icons/react/dist/csr/X";
import { Toast as BaseToast } from "@base-ui/react/toast";
import type { ToastManager } from "@base-ui/react/toast";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { zIndex } from "@/styles/constants.stylex";
import { motion } from "@/styles/tokens.stylex";
import { focusRing } from "@/styles/recipes/focus";
import { popupMotionStyles } from "@/components/popover/popover.stylex";
import { tooltipStyles } from "@/components/tooltip/tooltip.stylex";
import { popupVars } from "@/components/popover/popover-vars.stylex";
import { pressable } from "@/styles/recipes/transitions";
import { color, radius, shadow, size, space } from "@/styles/tokens.stylex";
import { fontSize, fontWeight, letterSpacing, lineHeight } from "@/styles/tokens.stylex";
import {
	anchoredToastManager,
	type AnchoredToastData,
	type AnchoredToastStatus,
	type AnchoredToastTone,
	useAnchoredToastManager,
} from "./anchored-toast-manager";
import { toastMotion } from "./toast-motion.stylex";
import { toastControlStyles, toastTextStyles } from "./toast-parts";

export type AnchoredToastObject = BaseToast.Root.ToastObject<AnchoredToastData>;

type StyledProps<T> = Omit<T, "className" | "style"> & {
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export function AnchoredViewport({ ref, className, style, ...props }: StyledProps<BaseToast.Viewport.Props>) {
	const sx = stylex.props(anchoredParts.viewport, style);

	return (
		<BaseToast.Viewport
			ref={ref}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}
		/>
	);
}

export function AnchoredPositioner({ ref, className, style, ...props }: StyledProps<BaseToast.Positioner.Props>) {
	// The positioner must snap to Base UI's first resolved coordinates.
	// Entry/exit motion belongs to the toast root so it grows from the anchor.
	const sx = stylex.props(anchoredParts.positioner, style);

	return (
		<BaseToast.Positioner
			ref={ref}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}
		/>
	);
}

export type AnchoredToastProps = {
	toast: AnchoredToastObject;
	className?: string;
	positionerClassName?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
	/** StyleX overrides for the positioner, applied after its own styles. */
	positionerStyle?: StyleXStyles;
};

/**
 * Opinionated renderer for a Base UI toast anchored to a trigger element.
 *
 * Use this directly for custom viewports, or use AnchoredProvider for the
 * complete provider/portal/viewport composition.
 */
export function AnchoredToast({ toast, className, positionerClassName, style, positionerStyle }: AnchoredToastProps) {
	const data = toast.data ?? {};
	const variant = data.variant ?? "default";
	const status = data.status ?? (variant === "pill" ? "ongoing" : "idle");
	const tone = data.tone ?? toneForStatus(status);
	const dismissible = data.dismissible ?? variant === "default";
	const defaultIcon = variant !== "tooltip" && (status !== "idle" || variant === "pill");
	const customIcon = data.icon !== undefined && data.icon !== null && data.icon !== false && data.icon !== true;
	const showGeneratedIcon = data.icon === true || (data.icon === undefined && defaultIcon);
	const showIcon = customIcon || showGeneratedIcon;
	const sideOffset = toast.positionerProps?.sideOffset ?? (variant === "tooltip" ? 4 : 8);
	const updateKey = toast.updateKey ?? 0;
	const pulseStyle =
		updateKey === 0 ? null : updateKey % 2 === 0 ? anchoredMotion.renotifyEven : anchoredMotion.renotifyOdd;
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
		style,
	);

	return (
		<AnchoredPositioner toast={toast} sideOffset={sideOffset} className={positionerClassName} style={positionerStyle}>
			<BaseToast.Root
				toast={toast}
				data-variant={variant}
				data-tone={tone}
				data-status={status}
				className={[rootSx.className, className].filter(Boolean).join(" ")}
				style={rootSx.style}>
				<BaseToast.Content
					className={
						stylex.props(
							anchoredParts.content,
							contentVariants[variant],
							variant === "pill" && anchoredParts.pillContent,
						).className
					}>
					{showIcon ? (
						<span
							aria-hidden
							{...stylex.props(
								anchoredParts.icon,
								iconToneVariants[tone],
								variant === "tooltip" && anchoredParts.tooltipIcon,
								variant === "pill" && anchoredParts.pillIcon,
								variant === "pill" && pillIconToneVariants[tone],
								showGeneratedIcon && (status === "loading" || status === "ongoing") && anchoredMotion.spin,
							)}>
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
						<span {...stylex.props(anchoredParts.text, variant === "pill" && anchoredParts.pillText)}>
							{toast.title != null ? (
								<BaseToast.Title
									className={
										stylex.props(toastTextStyles.title, variant === "pill" && anchoredParts.pillTitle).className
									}
								/>
							) : null}
							{toast.description != null ? (
								<BaseToast.Description
									className={
										stylex.props(toastTextStyles.description, variant === "pill" && anchoredParts.pillDescription)
											.className
									}
								/>
							) : null}
						</span>
					)}
					{variant !== "tooltip" && toast.actionProps != null ? (
						<BaseToast.Action
							className={stylex.props(toastControlStyles.action, focusRing.outset, pressable.transition).className}
						/>
					) : null}
					{variant !== "tooltip" && dismissible ? (
						<BaseToast.Close
							aria-label="Dismiss notification"
							className={
								stylex.props(
									toastControlStyles.close,
									toastControlStyles.anchoredClose,
									focusRing.outset,
									pressable.transition,
								).className
							}>
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
	if (status === "error") return "danger";
	if (status === "loading" || status === "ongoing") return "accent";
	return "neutral";
}

function statusIcon(status: AnchoredToastStatus, size: number | string = 18) {
	if (status === "success") return <CheckCircleIcon size={size} weight="fill" />;
	if (status === "error") return <WarningCircleIcon size={size} weight="fill" />;
	if (status === "loading" || status === "ongoing") return <CircleNotchIcon size={size} weight="bold" />;
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

const rotate = stylex.keyframes({
	to: { transform: "rotate(360deg)" },
});

const anchoredMotion = stylex.create({
	feedbackPopup: {
		[popupVars.duration]: motion.durationMedium,
		[popupVars.easing]: motion.easeOut,
	},
	renotifyEven: {
		animationDuration: {
			default: toastMotion.renotifyDuration,
			"@media (prefers-reduced-motion: reduce)": "0ms",
		},
		animationName: renotifyEven,
		animationTimingFunction: "ease",
	},
	renotifyOdd: {
		animationDuration: {
			default: toastMotion.renotifyDuration,
			"@media (prefers-reduced-motion: reduce)": "0ms",
		},
		animationName: renotifyOdd,
		animationTimingFunction: "ease",
	},
	spin: {
		animationDuration: {
			default: toastMotion.spinnerDuration,
			"@media (prefers-reduced-motion: reduce)": "0ms",
		},
		animationIterationCount: {
			default: "infinite",
			"@media (prefers-reduced-motion: reduce)": 1,
		},
		animationName: rotate,
		animationTimingFunction: "linear",
	},
});

const anchoredParts = stylex.create({
	panelSurface: {
		[popupVars.background]: color.bgElevated,
		[popupVars.border]: color.border,
		[popupVars.foreground]: color.fg,
		borderRadius: radius.lg,
		backgroundColor: popupVars.background,
		boxShadow: shadow.md,
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
		pointerEvents: "auto",
		position: "relative",
		transformOrigin: "var(--transform-origin)",
		maxWidth: "calc(100vw - 24px)",
		width: "max-content",
	},
	content: {
		alignItems: "center",
		boxSizing: "border-box",
		display: "flex",
	},
	text: {
		gap: space[1],
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
		borderRadius: radius.full,
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
		height: "16px",
		width: "16px",
	},
	pillContent: {
		height: "100%",
	},
	pillText: {
		gap: space[2],
		overflow: "hidden",
		alignItems: "center",
		flexDirection: "row",
	},
	pillTitle: {
		overflow: "hidden",
		color: color.fgInverseMuted,
		flexShrink: 1,
		fontSize: fontSize.x2,
		fontWeight: fontWeight.regular,
		letterSpacing: letterSpacing.x2,
		lineHeight: lineHeight.x2,
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
	},
	pillDescription: {
		color: color.fgInverseMuted,
		display: "inline-flex",
		flexShrink: 0,
		fontSize: fontSize.x2,
		letterSpacing: letterSpacing.x2,
		lineHeight: lineHeight.x2,
		whiteSpace: "nowrap",
	},
});

const rootVariants = stylex.create({
	default: {
		minWidth: "260px",
	},
	tooltip: {
		minWidth: 0,
	},
	popover: {
		maxWidth: "min(320px, calc(100vw - 24px))",
	},
	pill: {
		[popupVars.background]: color.bgInverse,
		[popupVars.border]: "rgb(255 255 255 / 9%)",
		[popupVars.foreground]: color.fgInverse,
		borderRadius: radius.md,
		backgroundColor: popupVars.background,
		boxShadow: shadow.md,
		color: popupVars.foreground,
		outlineColor: popupVars.border,
		outlineOffset: "-1px",
		outlineStyle: "solid",
		outlineWidth: "1px",
		height: size["control.md"],
		maxWidth: "min(360px, calc(100vw - 24px))",
		minWidth: 0,
	},
});

const contentVariants = stylex.create({
	default: {
		padding: space[3],
		gap: space[3],
	},
	tooltip: {
		padding: 0,
		gap: space[1],
	},
	popover: {
		padding: space[3],
		gap: space[3],
	},
	pill: {
		gap: space[2],
		paddingBlock: "0",
		paddingInline: space[3],
	},
});

const iconToneVariants = stylex.create({
	neutral: {
		backgroundColor: color.surfaceSubtle,
		color: color.fgMuted,
	},
	accent: {
		backgroundColor: color.bgAccentSoft,
		color: color.bgAccent,
	},
	success: {
		backgroundColor: color.bgSuccessSubtle,
		color: color.fgSuccess,
	},
	danger: {
		backgroundColor: color.bgDangerSubtle,
		color: color.fgDanger,
	},
});

const pillIconToneVariants = stylex.create({
	neutral: {
		color: color.fgInverseMuted,
	},
	accent: {
		color: color.bgAccent,
	},
	success: {
		color: color.fgSuccess,
	},
	danger: {
		color: color.fgDanger,
	},
});
