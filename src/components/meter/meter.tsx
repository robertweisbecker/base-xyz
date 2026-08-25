import { Meter as BaseMeter } from "@base-ui/react/meter";
import * as stylex from "@stylexjs/stylex";
import { textStyles } from "@/components/text/text.stylex";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { extractMarginProps, type MarginProps } from "@/styles/props/spacing.stylex";
import { createContext, useContext, type CSSProperties } from "react";
import { tokens } from "@/theme/tokens.stylex";
import { attrJoin } from "@/utils/attr-join";

type PartProps<T> = Omit<T, "className" | "style" | "xstyle"> & BaseStyleProps & { className?: string };

type MeterStyle = CSSProperties & {
	"--_meter-indicator-color"?: string;
	"--_meter-segment-count"?: number;
};

export type MeterVariant = "bar" | "segmented";

export type RootProps = Omit<BaseMeter.Root.Props, "className" | "style" | "xstyle" | "color" | keyof MarginProps> &
	MarginProps &
	PartProps<BaseMeter.Root.Props> & {
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
export type LabelProps = PartProps<BaseMeter.Label.Props>;
export type ValueProps = PartProps<BaseMeter.Value.Props>;
export type TrackProps = PartProps<BaseMeter.Track.Props>;
export type IndicatorProps = PartProps<BaseMeter.Indicator.Props>;

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
	xstyle,
	value,
	variant = "bar",
	...props
}: RootProps) {
	const { marginStyles, rest } = extractMarginProps(props);
	const meterValues = resolveMeterValues({ high, low, max, min, optimum, value });
	const hasSemanticThresholds = [low, high, optimum].some(isValidMeterNumber);
	const meterState = hasSemanticThresholds ? getMeterState(meterValues) : undefined;
	const resolvedIndicatorColor = indicatorColor ?? (meterState ? meterStateColors[meterState] : undefined);
	const sx = stylex.props(meterParts.root, variant === "segmented" && meterParts.segmentedRoot, marginStyles, xstyle);
	const meterStyle: MeterStyle = {
		...mergeStyle(sx.style, style),
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
				className={attrJoin(sx.className, className)}
				data-meter-state={meterState}
				max={meterValues.maximumValue}
				min={meterValues.minimumValue}
				style={meterStyle}
				value={meterValues.actualValue}
				{...rest}
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

export function Label({ ref, className, style, xstyle, ...props }: LabelProps) {
	const variant = useContext(MeterVariantContext);
	const sx = stylex.props(
		textStyles.supporting,
		meterParts.label,
		variant === "segmented" && meterParts.segmentedLabel,
		xstyle,
	);

	return (
		<BaseMeter.Label
			ref={ref}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...props}
		/>
	);
}

export function Value({ ref, className, style, xstyle, ...props }: ValueProps) {
	const variant = useContext(MeterVariantContext);
	const sx = stylex.props(
		textStyles.supporting,
		meterParts.value,
		variant === "segmented" && meterParts.segmentedValue,
		xstyle,
	);

	return (
		<BaseMeter.Value
			ref={ref}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...props}
		/>
	);
}

export function Track({ ref, className, style, xstyle, ...props }: TrackProps) {
	const variant = useContext(MeterVariantContext);
	const sx = stylex.props(meterParts.track, variant === "segmented" && meterParts.segmentedTrack, xstyle);

	return (
		<BaseMeter.Track
			ref={ref}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...props}
		/>
	);
}

export function Indicator({ ref, className, style, xstyle, ...props }: IndicatorProps) {
	const variant = useContext(MeterVariantContext);
	const sx = stylex.props(meterParts.indicator, variant === "segmented" && meterParts.segmentedIndicator, xstyle);

	return (
		<BaseMeter.Indicator
			ref={ref}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
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
		overflow: "hidden",
		backgroundColor: tokens["--fill-track"],
		gridColumnEnd: "-1",
		gridColumnStart: "1",
		height: tokens["--space-2"],
	},
	segmentedTrack: {
		borderRadius: 0,
		gridRow: "1",
		backgroundColor: tokens["--fill-track"],
		boxShadow: "none",
		gridColumnEnd: "auto",
		gridColumnStart: "1",
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
		// boxShadow: tokens["--shadow-sm"],
		transitionDuration: tokens["--motion-duration-medium"],
		transitionProperty: "width, background-color",
		transitionTimingFunction: tokens["--motion-ease-smooth-out"],
	},
	segmentedIndicator: {
		borderRadius: 0,
		boxShadow: "none",
	},
});

export const Meter = {
	Root,
	Label,
	Value,
	Track,
	Indicator,
} as const;
