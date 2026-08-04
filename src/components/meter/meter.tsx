import { Meter as BaseMeter } from "@base-ui/react/meter";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { textStyles } from "@/components/text/text.stylex";
import { createContext, useContext, type CSSProperties } from "react";
import { tokens } from "@/theme/tokens.stylex";

type StyledProps<T> = Omit<T, "className" | "style"> & {
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

type MeterStyle = CSSProperties & {
	"--_meter-indicator-color"?: string;
	"--_meter-segment-count"?: number;
};

export type MeterVariant = "bar" | "segmented";

export type RootProps = Omit<StyledProps<BaseMeter.Root.Props>, "color"> & {
	/** The lower boundary of the middle range. */
	low?: number;
	/** The upper boundary of the middle range. */
	high?: number;
	/** A value in the range considered most desirable. */
	optimum?: number;
	/** Overrides the indicator color, including colors derived from semantic thresholds. */
	color?: string;
	/** The visual treatment of the meter. */
	variant?: MeterVariant;
};
export type LabelProps = StyledProps<BaseMeter.Label.Props>;
export type ValueProps = StyledProps<BaseMeter.Value.Props>;
export type TrackProps = StyledProps<BaseMeter.Track.Props>;
export type IndicatorProps = StyledProps<BaseMeter.Indicator.Props>;

type MeterState = "optimum" | "suboptimum" | "critical";

type ResolvedMeterValues = {
	actualValue: number;
	highBoundary: number;
	lowBoundary: number;
	maximumValue: number;
	minimumValue: number;
	optimumPoint: number;
};

const MeterVariantContext = createContext<MeterVariant>("bar");

const meterStateColors = {
	optimum: tokens["--bg-success-primary"],
	suboptimum: tokens["--bg-warning-primary"],
	critical: tokens["--bg-error-primary"],
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
	variant = "bar",
	...props
}: RootProps) {
	const meterValues = resolveMeterValues({ high, low, max, min, optimum, value });
	const hasSemanticThresholds = [low, high, optimum].some(isValidMeterNumber);
	const meterState = hasSemanticThresholds ? getMeterState(meterValues) : undefined;
	const resolvedIndicatorColor = indicatorColor ?? (meterState ? meterStateColors[meterState] : undefined);
	const sx = stylex.props(meterParts.root, variant === "segmented" && meterParts.segmentedRoot, style);
	const meterStyle: MeterStyle = {
		...sx.style,
		...(resolvedIndicatorColor && {
			"--_meter-indicator-color": resolvedIndicatorColor,
		}),
		...(variant === "segmented" && {
			"--_meter-segment-count": getSegmentCount(meterValues.minimumValue, meterValues.maximumValue),
		}),
	};

	return (
		<MeterVariantContext.Provider value={variant}>
			<BaseMeter.Root
				ref={ref}
				className={[sx.className, className].filter(Boolean).join(" ")}
				data-meter-state={meterState}
				max={meterValues.maximumValue}
				min={meterValues.minimumValue}
				style={meterStyle}
				value={meterValues.actualValue}
				{...props}
			/>
		</MeterVariantContext.Provider>
	);
}

function getSegmentCount(min: number, max: number) {
	const range = max - min;
	return Number.isFinite(range) && range > 0 ? Math.ceil(range) : 1;
}

function resolveMeterValues({
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
}): ResolvedMeterValues {
	const minimumValue = isValidMeterNumber(min) ? min : 0;
	const candidateMaximumValue = isValidMeterNumber(max) ? max : 100;
	const maximumValue = Math.max(minimumValue, candidateMaximumValue);
	const actualValue = clampMeterValue(isValidMeterNumber(value) ? value : 0, minimumValue, maximumValue);
	const lowBoundary = clampMeterValue(isValidMeterNumber(low) ? low : minimumValue, minimumValue, maximumValue);
	const highBoundary = clampMeterValue(isValidMeterNumber(high) ? high : maximumValue, lowBoundary, maximumValue);
	const optimumPoint = clampMeterValue(
		isValidMeterNumber(optimum) ? optimum : minimumValue + (maximumValue - minimumValue) / 2,
		minimumValue,
		maximumValue,
	);

	return {
		actualValue,
		highBoundary,
		lowBoundary,
		maximumValue,
		minimumValue,
		optimumPoint,
	};
}

function getMeterState({ actualValue, highBoundary, lowBoundary, optimumPoint }: ResolvedMeterValues): MeterState {
	const valueRegion = getMeterRegion(actualValue, lowBoundary, highBoundary);
	const optimumRegion = getMeterRegion(optimumPoint, lowBoundary, highBoundary);

	if (valueRegion === optimumRegion) {
		return "optimum";
	}

	if (valueRegion === "middle" || optimumRegion === "middle") {
		return "suboptimum";
	}

	return "critical";
}

function isValidMeterNumber(value: number | undefined): value is number {
	return value !== undefined && Number.isFinite(value);
}

function clampMeterValue(value: number, min: number, max: number) {
	return Math.max(min, Math.min(value, max));
}

function getMeterRegion(value: number, low: number, high: number) {
	if (value < low) return "low";
	if (value > high) return "high";
	return "middle";
}

export function Label({ ref, className, style, ...props }: LabelProps) {
	const variant = useContext(MeterVariantContext);
	const sx = stylex.props(
		textStyles.supporting,
		meterParts.label,
		variant === "segmented" && meterParts.segmentedLabel,
		style,
	);

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
	const variant = useContext(MeterVariantContext);
	const sx = stylex.props(
		textStyles.supporting,
		meterParts.value,
		variant === "segmented" && meterParts.segmentedValue,
		style,
	);

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
	const variant = useContext(MeterVariantContext);
	const sx = stylex.props(meterParts.track, variant === "segmented" && meterParts.segmentedTrack, style);

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
	const variant = useContext(MeterVariantContext);
	const sx = stylex.props(meterParts.indicator, variant === "segmented" && meterParts.segmentedIndicator, style);

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
		columnGap: tokens["--space-3"],
		display: "grid",
		gridTemplateColumns: "minmax(0, 1fr) auto",
		rowGap: tokens["--space-1-5"],
		width: "100%",
	},
	segmentedRoot: {
		alignItems: "center",
		gridTemplateColumns: "auto minmax(0, 1fr) auto",
		rowGap: 0,
	},
	label: {
		overflow: "hidden",
		color: tokens["--fg-muted"],
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
		minWidth: 0,
	},
	segmentedLabel: {
		gridColumn: "2",
		gridRow: "1",
	},
	value: {
		color: tokens["--fg"],
		fontVariantNumeric: "tabular-nums",
		textAlign: "end",
		whiteSpace: "nowrap",
	},
	segmentedValue: {
		gridColumn: "3",
		gridRow: "1",
	},
	track: {
		borderRadius: "2px",
		gridColumn: "1 / -1",
		overflow: "hidden",
		backgroundColor: tokens["--fill-track"],
		height: tokens["--space-2"],
	},
	segmentedTrack: {
		borderRadius: 0,
		gridColumn: "1",
		gridRow: "1",
		backgroundColor: tokens["--fill-track"],
		boxShadow: "none",
		maskImage:
			"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 16'%3E%3Crect width='6' height='16' rx='1' fill='black'/%3E%3C/svg%3E\")",
		maskPosition: "left center",
		maskRepeat: "repeat-x",
		maskSize: `calc(10px) ${tokens["--size-indicator-sm"]}`,
		outlineWidth: 0,
		height: tokens["--size-indicator-sm"],
		width: `calc(var(--_meter-segment-count) * (10px) - ${tokens["--space-1"]})`,
	},
	indicator: {
		backgroundColor: `var(--_meter-indicator-color, ${tokens["--color-gray-p1"]})`,
		borderEndStartRadius: "inherit",
		borderStartStartRadius: "inherit",
		boxShadow: tokens["--shadow-sm"],
		transitionDuration: {
			default: tokens["--motion-duration-medium"],
			"@media (prefers-reduced-motion: reduce)": "0ms",
		},
		transitionProperty: "width, background-color",
		transitionTimingFunction: tokens["--motion-ease-smooth-out"],
	},
	segmentedIndicator: {
		borderRadius: 0,
		boxShadow: "none",
	},
});
