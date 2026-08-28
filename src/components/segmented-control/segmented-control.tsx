import { Radio as BaseRadio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import * as stylex from "@stylexjs/stylex";
import { createContext, type ReactNode, useContext, useMemo } from "react";
import type { ButtonSize } from "@/components/button/button";
import { typescaleStyles, fontWeightStyles } from "@/components/text/text.stylex";
import { media } from "@/styles/constants.stylex";
import { focusRing } from "@/styles/recipes/focus";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { extractMarginProps, type MarginProps } from "@/styles/props/spacing.stylex";
import { tokens } from "@/theme/tokens.stylex";
import { attrJoin } from "@/utils/attr-join";

export type SegmentedControlSize = Extract<ButtonSize, "sm" | "md" | "lg">;

const ENABLED_ACTIVE = ":active:not([data-disabled],[data-readonly])";
const ENABLED_HOVER = ":hover:not([data-disabled],[data-readonly])";
const UNSELECTED_ENABLED_HOVER = ":hover:not([data-checked],[data-disabled],[data-readonly])";

type SegmentedControlContextValue = {
	size: SegmentedControlSize;
};

const SegmentedControlContext = createContext<SegmentedControlContextValue | null>(null);

type SegmentedControlPartStyleProps = BaseStyleProps & {
	className?: string;
};

export type SegmentedControlRootProps = Omit<
	BaseRadioGroup.Props,
	"className" | "color" | "orientation" | "style" | keyof MarginProps
> &
	MarginProps &
	BaseStyleProps & {
		className?: string;
		size?: SegmentedControlSize;
	};

export function Root({
	ref,
	children,
	className,
	size = "md",
	style,
	xstyle,
	...props
}: SegmentedControlRootProps) {
	const { marginStyles, rest } = extractMarginProps(props);
	const sx = stylex.props(segmentedControlParts.root, rootRadiusStyles[size], marginStyles, xstyle);
	const contextValue = useMemo(() => ({ size }), [size]);

	return (
		<SegmentedControlContext value={contextValue}>
			<BaseRadioGroup
				ref={ref}
				className={attrJoin(sx.className, className)}
				style={mergeStyle(sx.style, style)}
				{...rest}
			>
				{children}
			</BaseRadioGroup>
		</SegmentedControlContext>
	);
}

export type SegmentedControlItemProps = Omit<
	BaseRadio.Root.Props,
	"children" | "className" | "color" | "style"
> &
	SegmentedControlPartStyleProps & {
		children: ReactNode;
		/** Visual content positioned before the label. */
		startSlot?: ReactNode;
		/** Visual content positioned after the label. */
		endSlot?: ReactNode;
	};

export function Item({
	ref,
	children,
	className,
	endSlot,
	startSlot,
	style,
	xstyle,
	...props
}: SegmentedControlItemProps) {
	const { size } = useSegmentedControlContext();
	const sx = stylex.props(
		focusRing.offset,
		segmentedControlParts.item,
		fontWeightStyles.medium,
		itemTextSizeStyles[size],
		itemSizeStyles[size],
		itemRadiusStyles[size],
		xstyle,
	);

	return (
		<BaseRadio.Root
			ref={ref}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...props}
		>
			{renderSlot(startSlot, "start", size)}
			{children}
			{renderSlot(endSlot, "end", size)}
		</BaseRadio.Root>
	);
}

function useSegmentedControlContext() {
	const context = useContext(SegmentedControlContext);
	if (context === null) {
		throw new Error("SegmentedControl.Item must be rendered inside SegmentedControl.Root.");
	}
	return context;
}

function renderSlot(slot: ReactNode, role: "start" | "end", size: SegmentedControlSize) {
	if (slot == null || typeof slot === "boolean") {
		return null;
	}

	const sx = stylex.props(
		segmentedControlParts.slot,
		slotSizeStyles[size],
		role === "start" ? startSlotOffsetStyles[size] : endSlotOffsetStyles[size],
	);

	return (
		<span aria-hidden className={sx.className} style={sx.style}>
			{slot}
		</span>
	);
}

const segmentedControlParts = stylex.create({
	root: {
		margin: 0,
		padding: tokens["--space-0-5"],
		borderWidth: 0,
		cornerShape: "superellipse(1.3)",
		gap: tokens["--space-0-5"],
		backgroundColor: tokens["--surface-subtle"],
		boxSizing: "border-box",
		display: "inline-flex",
		isolation: "isolate",
		outlineColor: tokens["--border-disabled"],
		outlineOffset: -1,
		outlineStyle: "solid",
		outlineWidth: 1,
		maxWidth: "100%",
	},
	item: {
		margin: 0,
		borderWidth: 0,
		cornerShape: "superellipse(1.3)",
		gap: tokens["--space-1-5"],
		paddingBlock: 0,
		alignItems: "center",
		appearance: "none",
		backgroundColor: {
			[ENABLED_ACTIVE]: tokens["--surface-subtle-active"],
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[UNSELECTED_ENABLED_HOVER]: {
				[media.canHover]: tokens["--surface-subtle-hover"],
			},
			"[data-checked]": tokens["--elevated"],
			default: "transparent",
		},
		boxShadow: {
			"[data-checked]": tokens["--shadow-sm"],
			"[data-disabled]": "none",
			default: "none",
		},
		boxSizing: "border-box",
		color: {
			[ENABLED_HOVER]: tokens["--fg"],
			"[data-checked]": tokens["--fg"],
			"[data-disabled]": tokens["--fg-subtle"],
			default: tokens["--fg-muted"],
		},
		cursor: {
			"[data-disabled]": "not-allowed",
			default: "default",
		},
		display: "inline-flex",
		flexBasis: 0,
		flexGrow: 1,
		fontFamily: "inherit",
		justifyContent: "center",
		opacity: {
			"[data-disabled]": 0.48,
			default: 1,
		},
		position: "relative",
		transform: {
			[ENABLED_ACTIVE]: "scale(0.98)",
			default: "scale(1)",
		},
		transitionDuration: {
			default: tokens["--motion-duration-medium"],
			[media.reducedMotion]: "0ms",
		},
		transitionProperty: "background-color, box-shadow, color, transform",
		transitionTimingFunction: tokens["--motion-ease-smooth-out"],
		userSelect: "none",
		whiteSpace: "nowrap",
	},
	slot: {
		flex: "none",
		alignItems: "center",
		color: "currentColor",
		display: "inline-flex",
		justifyContent: "center",
		lineHeight: 0,
		opacity: {
			default: 1,
			":has(svg)": 0.72,
		},
		pointerEvents: "none",
	},
});

const rootRadiusStyles = stylex.create({
	sm: { borderRadius: tokens["--radius-sm"] },
	md: { borderRadius: tokens["--radius-md"] },
	lg: { borderRadius: tokens["--radius-lg"] },
});

const itemRadiusStyles = stylex.create({
	sm: {
		borderRadius: `calc(${tokens["--radius-sm"]} - ${tokens["--space-0-5"]})`,
	},
	md: {
		borderRadius: `calc(${tokens["--radius-md"]} - ${tokens["--space-0-5"]})`,
	},
	lg: {
		borderRadius: `calc(${tokens["--radius-lg"]} - ${tokens["--space-0-5"]})`,
	},
});

const itemTextSizeStyles = {
	sm: typescaleStyles["1"],
	md: typescaleStyles["2"],
	lg: typescaleStyles["2"],
} as const;

const itemSizeStyles = stylex.create({
	sm: {
		paddingInline: tokens["--space-2"],
		height: tokens["--size-control-sm"],
		minWidth: tokens["--size-control-sm"],
	},
	md: {
		paddingInline: tokens["--space-3"],
		height: tokens["--size-control-md"],
		minWidth: tokens["--size-control-md"],
	},
	lg: {
		paddingInline: tokens["--space-4"],
		height: tokens["--size-control-lg"],
		minWidth: tokens["--size-control-lg"],
	},
});

const slotSizeStyles = stylex.create({
	sm: { fontSize: tokens["--font-size-2"] },
	md: { fontSize: tokens["--font-size-3"] },
	lg: { fontSize: tokens["--font-size-4"] },
});

const startSlotOffsetStyles = stylex.create({
	sm: { marginInlineStart: "-0.25rem" },
	md: { marginInlineStart: "-0.25rem" },
	lg: { marginInlineStart: "-0.1875rem" },
});

const endSlotOffsetStyles = stylex.create({
	sm: { marginInlineEnd: "-0.25rem" },
	md: { marginInlineEnd: "-0.25rem" },
	lg: { marginInlineEnd: "-0.1875rem" },
});

export const SegmentedControl = {
	Root,
	Item,
} as const;
