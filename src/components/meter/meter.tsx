import { Meter as BaseMeter } from "@base-ui/react/meter";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { textColorStyles, textStyles } from "@/components/text/text.stylex";
import type { CSSProperties } from "react";
import { motion, shadow } from "@/styles/tokens.stylex";
import { color, space } from "@/styles/tokens.stylex";

type StyledProps<T> = Omit<T, "className" | "style"> & {
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

type MeterStyle = CSSProperties & {
	"--ds-meter-indicator-color"?: string;
};

export type RootProps = Omit<StyledProps<BaseMeter.Root.Props>, "color"> & {
	/** The lower boundary of the middle range. */
	low?: number;
	/** The upper boundary of the middle range. */
	high?: number;
	/** A value in the range considered most desirable. */
	optimum?: number;
	/** Overrides the indicator color, including colors derived from semantic thresholds. */
	color?: string;
};
export type LabelProps = StyledProps<BaseMeter.Label.Props>;
export type ValueProps = StyledProps<BaseMeter.Value.Props>;
export type TrackProps = StyledProps<BaseMeter.Track.Props>;
export type IndicatorProps = StyledProps<BaseMeter.Indicator.Props>;

type MeterState = "optimum" | "suboptimum" | "even-less-good";

const meterStateColors = {
	optimum: color.bgSuccess,
	suboptimum: color.bgWarning,
	"even-less-good": color.bgDanger,
} satisfies Record<MeterState, string>;

export function Root({
	ref,
	className,
	color: indicatorColor,
	high,
	low,
	max = 100,
	min = 0,
	optimum,
	style,
	value,
	...props
}: RootProps) {
	const hasSemanticThresholds = low !== undefined || high !== undefined || optimum !== undefined;
	const meterState = hasSemanticThresholds ? getMeterState({ high, low, max, min, optimum, value }) : undefined;
	const resolvedIndicatorColor = indicatorColor ?? (meterState ? meterStateColors[meterState] : undefined);
	const sx = stylex.props(meterParts.root, style);
	const meterStyle = resolvedIndicatorColor
		? ({
				...sx.style,
				"--ds-meter-indicator-color": resolvedIndicatorColor,
			} satisfies MeterStyle)
		: sx.style;

	return (
		<BaseMeter.Root
			ref={ref}
			className={[sx.className, className].filter(Boolean).join(" ")}
			data-meter-state={meterState}
			max={max}
			min={min}
			style={meterStyle}
			value={value}
			{...props}
		/>
	);
}

function getMeterState({
	high,
	low,
	max,
	min,
	optimum,
	value,
}: {
	high?: number;
	low?: number;
	max: number;
	min: number;
	optimum?: number;
	value: number;
}): MeterState {
	const lowValue = normalizeThreshold(low, min, min, max);
	const highValue = normalizeThreshold(high, max, lowValue, max);
	const optimumValue = normalizeThreshold(optimum, min + (max - min) / 2, min, max);
	const valueRegion = getMeterRegion(normalizeThreshold(value, min, min, max), lowValue, highValue);
	const optimumRegion = getMeterRegion(optimumValue, lowValue, highValue);

	if (valueRegion === optimumRegion) {
		return "optimum";
	}

	if (valueRegion === "middle" || optimumRegion === "middle") {
		return "suboptimum";
	}

	return "even-less-good";
}

function normalizeThreshold(value: number | undefined, fallback: number, min: number, max: number) {
	const resolvedValue = value === undefined || Number.isNaN(value) ? fallback : value;
	return Math.max(min, Math.min(resolvedValue, max));
}

function getMeterRegion(value: number, low: number, high: number) {
	if (value < low) return "low";
	if (value > high) return "high";
	return "middle";
}

export function Label({ ref, className, style, ...props }: LabelProps) {
	const sx = stylex.props(textStyles.supporting, textColorStyles.muted, meterParts.label, style);

	return (
		<BaseMeter.Label
			ref={ref}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}
		/>
	);
}

export function Value({ ref, className, style, ...props }: ValueProps) {
	const sx = stylex.props(textStyles.supporting, meterParts.value, style);

	return (
		<BaseMeter.Value
			ref={ref}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}
		/>
	);
}

export function Track({ ref, className, style, ...props }: TrackProps) {
	const sx = stylex.props(meterParts.track, style);

	return (
		<BaseMeter.Track
			ref={ref}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}
		/>
	);
}

export function Indicator({ ref, className, style, ...props }: IndicatorProps) {
	const sx = stylex.props(meterParts.indicator, style);

	return (
		<BaseMeter.Indicator
			ref={ref}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}
		/>
	);
}

const meterParts = stylex.create({
	root: {
		color: color.fg,
		columnGap: space.x3,
		display: "grid",
		gridTemplateColumns: "minmax(0, 1fr) auto",
		rowGap: space.x2,
		width: "100%",
	},
	label: {
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
		minWidth: 0,
	},
	value: {
		color: color.fg,
		fontVariantNumeric: "tabular-nums",
		textAlign: "end",
		whiteSpace: "nowrap",
	},
	track: {
		borderRadius: "2px",
		gridColumn: "1 / -1",
		overflow: "hidden",
		backgroundColor: color.canvas,
		boxShadow: shadow.inset,
		outlineColor: color.fillTrack,
		outlineOffset: "-1px",
		outlineStyle: "solid",
		outlineWidth: "1px",
		height: "0.375rem",
	},
	indicator: {
		backgroundColor: "var(--ds-meter-indicator-color, var(--ds-color-text))",
		borderEndStartRadius: "inherit",
		borderStartStartRadius: "inherit",
		boxShadow: shadow.sm,
		transitionDuration: {
			default: motion.durationMedium,
			"@media (prefers-reduced-motion: reduce)": "0ms",
		},
		transitionProperty: "width, background-color",
		transitionTimingFunction: motion.easeSmoothOut,
	},
});
