import { Field } from "@base-ui/react/field";
import { Select as BaseSelect } from "@base-ui/react/select";
import { CaretDownIcon } from "@phosphor-icons/react/dist/csr/CaretDown";
import { CaretUpIcon } from "@phosphor-icons/react/dist/csr/CaretUp";
import { CaretUpDownIcon } from "@phosphor-icons/react/dist/csr/CaretUpDown";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { createContext, useContext, type ReactNode } from "react";
import { media } from "@/styles/constants.stylex";
import { resolveThemeProps } from "@/theme/theme-props";
import type { FieldSize, FieldThemeProps } from "@/components/field/field.types";
import { fieldStyles, fieldControlStyles, fieldThemeProps } from "@/components/field/field.stylex";
import { focusRing } from "@/styles/recipes/focus";
import { modalMotionStyles } from "@/components/dialog/dialog.stylex";
import { popupMotionStyles, popupPositionerStyles } from "@/components/popover/popover.stylex";
import { popupVars } from "@/components/popover/popover-vars.stylex";
import { tokens } from "@/theme/tokens.stylex";

import { menuItemSizeStyles, menuItemStyles, menuItemVariantStyles } from "@/components/menu/menu-item.stylex";
import type { MenuItemVariant } from "@/components/menu/menu.types";
import { Icon } from "@/components/icons";

const HOVER_WHEN_INACTIVE = ":hover:not([data-disabled]):not([data-popup-open]):not([data-pressed])";
const SelectSizeContext = createContext<FieldSize>("md");

type SelectMultiple = boolean | undefined;

export type SelectRootProps<Value, Multiple extends SelectMultiple = false> = Omit<
	BaseSelect.Root.Props<Value, Multiple>,
	"className" | "color" | "size" | "style" | keyof FieldThemeProps
> &
	FieldThemeProps & {
		className?: string;
		invalid?: boolean;
		size?: FieldSize;
		/** StyleX overrides, applied after the component's own styles. */
		style?: StyleXStyles;
	};

export function Root<Value, Multiple extends SelectMultiple = false>({
	children,
	className,
	disabled,
	invalid,
	size = "md",
	style,
	...props
}: SelectRootProps<Value, Multiple>) {
	const { restProps, styles } = resolveThemeProps(props, fieldThemeProps);
	const sx = stylex.props(selectParts.root, ...styles, style);

	return (
		<Field.Root
			disabled={disabled}
			invalid={invalid}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}>
			<SelectSizeContext.Provider value={size}>
				<BaseSelect.Root disabled={disabled} {...restProps}>
					{children}
				</BaseSelect.Root>
			</SelectSizeContext.Provider>
		</Field.Root>
	);
}

export type SelectLabelProps = Omit<BaseSelect.Label.Props, "className" | "style"> & {
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export function Label({ ref, className, style, ...props }: SelectLabelProps) {
	const sx = stylex.props(fieldStyles.label, style);

	return (
		<BaseSelect.Label
			ref={ref}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}
		/>
	);
}

export type SelectTriggerProps = Omit<BaseSelect.Trigger.Props, "children" | "className" | "style"> & {
	children?: BaseSelect.Value.Props["children"];
	className?: string;
	placeholder?: ReactNode;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
	variant?: SelectTriggerVariant;
};

export type SelectTriggerVariant = "default" | "inline";

export function Trigger({
	ref,
	children,
	className,
	placeholder = "Select an option",
	style,
	variant = "default",
	...props
}: SelectTriggerProps) {
	const size = useContext(SelectSizeContext);
	const sx = stylex.props(
		fieldControlStyles[size],
		selectParts.trigger,
		variant === "inline" && selectParts.inlineTrigger,
		focusRing.inset,
		style,
	);

	return (
		<BaseSelect.Trigger
			ref={ref}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}>
			<BaseSelect.Value placeholder={placeholder} {...stylex.props(selectParts.value)}>
				{children}
			</BaseSelect.Value>
			<BaseSelect.Icon {...stylex.props(selectParts.triggerIcon)}>
				{variant === "inline" ? (
					<CaretDownIcon aria-hidden size=".875em" weight="bold" />
				) : (
					<CaretUpDownIcon aria-hidden size="1em" weight="bold" />
				)}
			</BaseSelect.Icon>
		</BaseSelect.Trigger>
	);
}

export type SelectBackdropProps = Omit<BaseSelect.Backdrop.Props, "className" | "style"> & {
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export type SelectPositionerProps = Omit<BaseSelect.Positioner.Props, "className" | "style"> & {
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export type SelectPopupProps = Omit<BaseSelect.Popup.Props, "className" | "style"> & {
	backdrop?: boolean;
	backdropProps?: SelectBackdropProps;
	className?: string;
	portalProps?: Omit<BaseSelect.Portal.Props, "children">;
	positionerProps?: SelectPositionerProps;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export function Popup({
	ref,
	backdrop = false,
	backdropProps,
	children,
	className,
	portalProps,
	positionerProps,
	style,
	...props
}: SelectPopupProps) {
	const {
		align = "start",
		alignItemWithTrigger = true,
		alignOffset,
		className: positionerClassName,
		side = "bottom",
		sideOffset = 6,
		style: positionerStyle,
		...otherPositionerProps
	} = positionerProps ?? {};

	const sx = stylex.props(selectParts.panelSurface, selectParts.popup, popupMotionStyles.anchoredPopup, style);
	const positionerSx = stylex.props(popupPositionerStyles, selectParts.positioner, positionerStyle);
	const { className: backdropClassName, style: backdropStyle, ...otherBackdropProps } = backdropProps ?? {};
	const backdropSx = stylex.props(selectParts.backdrop, modalMotionStyles.backdrop, backdropStyle);

	return (
		<BaseSelect.Portal {...portalProps}>
			{backdrop ? (
				<BaseSelect.Backdrop
					className={[backdropSx.className, backdropClassName].filter(Boolean).join(" ")}
					style={backdropSx.style}
					{...otherBackdropProps}
				/>
			) : null}
			<BaseSelect.Positioner
				align={align}
				alignItemWithTrigger={alignItemWithTrigger}
				alignOffset={alignOffset}
				side={side}
				sideOffset={sideOffset}
				className={[positionerSx.className, positionerClassName].filter(Boolean).join(" ")}
				style={positionerSx.style}
				{...otherPositionerProps}>
				<BaseSelect.Popup
					ref={ref}
					className={[sx.className, className].filter(Boolean).join(" ")}
					style={sx.style}
					{...props}>
					{children}
				</BaseSelect.Popup>
			</BaseSelect.Positioner>
		</BaseSelect.Portal>
	);
}

export type SelectListProps = Omit<BaseSelect.List.Props, "className" | "style"> & {
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export function List({ ref, className, style, ...props }: SelectListProps) {
	const sx = stylex.props(selectParts.list, style);

	return (
		<>
			<BaseSelect.ScrollUpArrow {...stylex.props(selectParts.scrollArrow, selectParts.scrollUp)}>
				<CaretUpIcon aria-hidden size={14} weight="bold" {...stylex.props(selectParts.scrollArrowIcon)} />
			</BaseSelect.ScrollUpArrow>
			<BaseSelect.List
				ref={ref}
				className={[sx.className, className].filter(Boolean).join(" ")}
				style={sx.style}
				{...props}
			/>
			<BaseSelect.ScrollDownArrow {...stylex.props(selectParts.scrollArrow, selectParts.scrollDown)}>
				<CaretDownIcon aria-hidden size={14} weight="bold" {...stylex.props(selectParts.scrollArrowIcon)} />
			</BaseSelect.ScrollDownArrow>
		</>
	);
}

export type SelectItemProps = Omit<BaseSelect.Item.Props, "children" | "className" | "style"> & {
	children?: ReactNode;
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
	variant?: SelectItemVariant;
};

export type SelectItemVariant = MenuItemVariant;

export function Item({ ref, children, className, style, variant = "primary", ...props }: SelectItemProps) {
	const size = useContext(SelectSizeContext);
	const sx = stylex.props(
		menuItemStyles.item,
		menuItemSizeStyles[size],
		menuItemVariantStyles[variant],
		focusRing.inset,
		style,
	);

	return (
		<BaseSelect.Item
			ref={ref}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}>
			<BaseSelect.ItemIndicator keepMounted {...stylex.props(menuItemStyles.indicator)}>
				<Icon.Checkmark width="1em" height="1em" strokeWidth={3} />
			</BaseSelect.ItemIndicator>
			<BaseSelect.ItemText {...stylex.props(menuItemStyles.label, selectParts.itemText)}>
				{children}
			</BaseSelect.ItemText>
		</BaseSelect.Item>
	);
}

export type SelectGroupProps = Omit<BaseSelect.Group.Props, "className" | "style"> & {
	className?: string;
	label?: ReactNode;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export function Group({ ref, children, className, label, style, ...props }: SelectGroupProps) {
	const sx = stylex.props(selectParts.group, style);

	return (
		<BaseSelect.Group
			ref={ref}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}>
			{label ? <BaseSelect.GroupLabel {...stylex.props(selectParts.groupLabel)}>{label}</BaseSelect.GroupLabel> : null}
			{children}
		</BaseSelect.Group>
	);
}

export type SelectSeparatorProps = Omit<BaseSelect.Separator.Props, "className" | "style"> & {
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export function Separator({ ref, className, style, ...props }: SelectSeparatorProps) {
	const sx = stylex.props(selectParts.separator, style);

	return (
		<BaseSelect.Separator
			ref={ref}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}
		/>
	);
}

const selectParts = stylex.create({
	panelSurface: {
		// [popupVars.background]: tokens["--elevated"],
		// [popupVars.border]: tokens["--border"],
		// [popupVars.foreground]: tokens["--fg"],
		borderRadius: tokens["--radius-lg"],
		cornerShape: "superellipse(1.3)",
		backgroundColor: popupVars.background,
		color: popupVars.foreground,
		boxShadow: tokens["--shadow-md"],
		minWidth: "calc(var(--anchor-width) + 1.75rem)",
		overscrollBehavior: "contain",
	},
	root: {
		gap: tokens["--space-2"],
		display: "flex",
		flexDirection: "column",
		minWidth: 0,
		width: "fit-content",
	},
	trigger: {
		alignItems: "center",
		color: {
			"[data-placeholder]": tokens["--fg-muted"],
			default: tokens["--fg"],
		},
		columnGap: tokens["--space-3"],
		cursor: {
			"[data-disabled]": "not-allowed",
			default: "default",
		},
		display: "inline-flex",
		justifyContent: "space-between",
		opacity: {
			"[data-disabled]": 0.48,
			default: 1,
		},
		textAlign: "start",
		maxWidth: "min(24rem, calc(100vw - 2rem))",
		minWidth: "12rem",
		width: "auto",
	},
	inlineTrigger: {
		borderColor: {
			"[data-invalid]": tokens["--bg-error-primary"],
			default: "transparent",
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			":hover:not([data-invalid])": {
				[media.canHover]: "transparent",
			},
		},
		borderRadius: tokens["--radius-xs"],
		paddingBlock: 0,
		textDecoration: "underline",
		backgroundColor: {
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[HOVER_WHEN_INACTIVE]: {
				[media.canHover]: tokens["--surface-subtle"],
			},
			"[data-popup-open]": tokens["--bg-accent"],
			default: "transparent",
			":active": tokens["--bg-accent"],
		},
		color: {
			"[data-placeholder]": tokens["--fg-subtle"],
			"[data-placeholder]:hover": tokens["--fg-accent"],
			default: tokens["--fg-accent"],
		},
		columnGap: "2px",
		fontWeight: {
			"[data-placeholder]": tokens["--font-weight-regular"],
			default: tokens["--font-weight-medium"],
		},
		marginBlockEnd: "-1px",
		marginBlockStart: "-1px",
		paddingInlineEnd: "2px",
		paddingInlineStart: "2px",
		textDecorationColor: tokens["--fg-subtle"],
		textDecorationStyle: "dotted",
		textDecorationThickness: "2px",
		textUnderlineOffset: "4px",
		height: "auto",
		minHeight: 0,
		minWidth: 0,
	},
	value: {
		overflow: "hidden",
		opacity: {
			"[data-placeholder]": 0.72,
			default: 1,
		},
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
		minWidth: 0,
	},
	triggerIcon: {
		alignItems: "center",
		display: "inline-flex",
		flexShrink: 0,
		justifyContent: "center",
		marginInlineEnd: "-2px",
	},
	positioner: {
		minHeight: tokens["--size-control-md"],
	},
	popup: {
		outline: "0",
		maxWidth: "min(24rem, var(--available-width))",
		minWidth: {
			"[data-side='none']": "calc(var(--anchor-width) + var(--size-control-md))",
			default: "var(--anchor-width)",
		},
		transitionDuration: {
			"[data-side='none']": 0,
			default: tokens["--motion-duration-content"],
		},
		opacity: {
			"[data-side='none']": 1,
			default: 1,
		},
	},
	list: {
		padding: tokens["--space-1"],
		overscrollBehavior: "contain",
		// eslint-disable-next-line @stylexjs/valid-styles -- scroll-padding-block is valid CSS the lint rule does not know yet; the compiler emits it correctly.
		scrollPaddingBlock: tokens["--space-6"],
		maxHeight: "var(--available-height)",
		overflowY: "auto",
	},
	scrollArrow: {
		insetInline: "1px",
		alignItems: "center",
		color: tokens["--fg-muted"],
		display: "flex",
		justifyContent: "center",
		zIndex: 2,
		height: tokens["--size-control-xs"],
		width: "auto",
	},
	scrollUp: {
		borderStartEndRadius: `calc(${tokens["--radius-lg"]} - 1px)`,
		borderStartStartRadius: `calc(${tokens["--radius-lg"]} - 1px)`,
		top: "1px",
		"::before": {
			insetInline: 0,
			backgroundImage: `linear-gradient(
				to bottom,
				${tokens["--elevated"]} 10%,
				transparent 100%
			)`,
			borderStartEndRadius: `calc(${tokens["--radius-lg"]} - 1px)`,
			borderStartStartRadius: `calc(${tokens["--radius-lg"]} - 1px)`,
			content: '""',
			pointerEvents: "none",
			position: "absolute",
			height: tokens["--space-10"],
			top: 0,
		},
	},
	scrollDown: {
		borderEndEndRadius: `calc(${tokens["--radius-lg"]} - 1px)`,
		borderEndStartRadius: `calc(${tokens["--radius-lg"]} - 1px)`,
		bottom: "1px",
		"::before": {
			insetInline: 0,
			backgroundImage: `linear-gradient(
				to top,
				${tokens["--elevated"]} 10%,
				transparent 100%
			)`,
			borderEndEndRadius: `calc(${tokens["--radius-lg"]} - 1px)`,
			borderEndStartRadius: `calc(${tokens["--radius-lg"]} - 1px)`,
			content: '""',
			pointerEvents: "none",
			position: "absolute",
			bottom: 0,
			height: tokens["--space-10"],
		},
	},
	scrollArrowIcon: {
		position: "relative",
		zIndex: 1,
	},
	itemText: {
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
	},
	group: {
		display: "flex",
		flexDirection: "column",
	},
	groupLabel: {
		paddingBlock: tokens["--space-2"],
		paddingInline: tokens["--space-3"],
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-1"],
		fontWeight: tokens["--font-weight-semibold"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
	},
	separator: {
		marginBlock: tokens["--space-1"],
		marginInline: tokens["--space-3"],
		backgroundColor: tokens["--border"],
		height: "1px",
	},
	backdrop: {
		inset: 0,
		backdropFilter: "blur(8px)",
		backgroundColor: "rgb(0 0 0 / 16%)",
		position: "fixed",
	},
});

// const itemOverrides = stylex.create({
// 	xs: {
// 		paddingInlineEnd: tokens["--size-control-xs"],
// 	},
// 	sm: {
// 		paddingInlineEnd: tokens["--size-control-sm"],
// 	},
// 	md: {
// 		paddingInlineEnd: tokens["--size-control-md"],
// 	},
// 	lg: {
// 		paddingInlineEnd: tokens["--size-control-lg"],
// 	},
// });

export const Select = {
	Root,
	Label,
	Trigger,
	Popup,
	List,
	Item,
	Group,
	Separator,
} as const;
