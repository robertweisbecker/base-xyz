import { Meter as BaseMeter } from "@base-ui/react/meter";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { textStyles } from "@/components/text/text.stylex";
import { tokens } from "@/theme/tokens.stylex";

const gaugeSizes = {
	16: { fontSize: 6, fontWeight: tokens["--font-weight-regular"], gap: 9, strokeWidth: 14 },
	20: { fontSize: 7, fontWeight: tokens["--font-weight-regular"], gap: 7.5, strokeWidth: 10 },
	32: { fontSize: 11, fontWeight: tokens["--font-weight-medium"], gap: 6, strokeWidth: 10 },
	64: { fontSize: 20, fontWeight: tokens["--font-weight-medium"], gap: 5, strokeWidth: 10 },
	128: { fontSize: 32, fontWeight: tokens["--font-weight-medium"], gap: 5, strokeWidth: 10 },
} as const;

export type MeterGaugeSize = keyof typeof gaugeSizes;
export type MeterGaugeArc = "primary" | "equal";

export type MeterGaugeProps = Omit<
	BaseMeter.Root.Props,
	"children" | "className" | "max" | "min" | "style" | "value"
> & {
	/** Controls how the gap is distributed between the primary and secondary arcs. */
	arc?: MeterGaugeArc;
	/** Replaces the value at the center of the gauge. */
	children?: ReactNode;
	className?: string;
	/** Primary arc color. */
	fillColor?: string;
	/** Visible label associated with the meter. */
	label?: ReactNode;
	/** Secondary arc color. */
	trackColor?: string;
	/** Whether to show the numeric value when custom children are not provided. */
	showValue?: boolean;
	size?: MeterGaugeSize;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
	value: number;
};

function clamp(value: number) {
	if (Number.isNaN(value)) return 0;
	return Math.min(100, Math.max(0, value));
}

export function MeterGauge({
	arc = "primary",
	children,
	className,
	fillColor = tokens["--fill-accent"],
	label,
	trackColor = tokens["--fill-track"],
	showValue = true,
	size = 32,
	style,
	value,
	...rootProps
}: MeterGaugeProps) {
	const config = gaugeSizes[size];
	const percentage = clamp(value);
	const gap = percentage === 0 || percentage === 100 ? 0 : config.gap;
	const equalOffset = arc === "equal" ? 0.5 : 0;
	const primaryPercentage = arc === "equal" ? Math.max(0, percentage - gap) : percentage;
	const secondaryPercentage =
		arc === "equal" ? Math.max(0, 100 - percentage - gap) : Math.max(0, 100 - percentage - gap * 2);
	const radius = 50 - config.strokeWidth / 2;
	const circumference = 2 * Math.PI * radius;
	const primaryLength = primaryPercentage * (circumference / 100);
	const secondaryLength = secondaryPercentage * (circumference / 100);
	const primaryRotation = -90 + gap * equalOffset * 3.6;
	const secondaryRotation = 270 - gap * (1 - equalOffset) * 3.6;
	const sx = stylex.props(meterGaugeParts.root, style);

	return (
		<BaseMeter.Root
			{...rootProps}
			className={[sx.className, className].filter(Boolean).join(" ")}
			max={100}
			min={0}
			style={sx.style}
			value={percentage}>
			{label != null ? (
				<BaseMeter.Label {...stylex.props(textStyles.supporting, meterGaugeParts.label)}>{label}</BaseMeter.Label>
			) : null}

			<span {...stylex.props(meterGaugeParts.gauge(size))}>
				<BaseMeter.Track
					{...stylex.props(meterGaugeParts.track)}
					render={<svg aria-hidden fill="none" height={size} viewBox="0 0 100 100" width={size} />}>
					<circle
						{...stylex.props(
							meterGaugeParts.arc,
							meterGaugeParts.arcColor(trackColor),
							meterGaugeParts.arcGeometry(
								`${secondaryLength} ${circumference}`,
								`rotate(${secondaryRotation}deg) scaleY(-1)`,
							),
							secondaryPercentage === 0 && meterGaugeParts.hidden,
						)}
						cx="50"
						cy="50"
						r={radius}
						strokeWidth={config.strokeWidth}
					/>

					<BaseMeter.Indicator
						render={
							<circle
								{...stylex.props(
									meterGaugeParts.arc,
									meterGaugeParts.arcColor(fillColor),
									meterGaugeParts.arcGeometry(`${primaryLength} ${circumference}`, `rotate(${primaryRotation}deg)`),
									primaryPercentage === 0 && meterGaugeParts.hidden,
								)}
								cx="50"
								cy="50"
								r={radius}
								strokeWidth={config.strokeWidth}
							/>
						}
					/>
				</BaseMeter.Track>

				{children != null ? (
					<span
						aria-hidden
						{...stylex.props(meterGaugeParts.content, meterGaugeParts.value(config.fontSize, config.fontWeight))}>
						{children}
					</span>
				) : showValue && size !== 16 ? (
					<BaseMeter.Value
						{...stylex.props(
							meterGaugeParts.content,
							meterGaugeParts.value(config.fontSize, config.fontWeight),
							size === 20 && meterGaugeParts.compactValue,
						)}>
						{(_, currentValue) => Math.round(clamp(currentValue))}
					</BaseMeter.Value>
				) : null}
			</span>
		</BaseMeter.Root>
	);
}

const meterGaugeParts = stylex.create({
	root: {
		gap: tokens["--space-2"],
		alignItems: "center",
		color: tokens["--fg"],
		display: "inline-flex",
		flexDirection: "column",
		justifyContent: "center",
		width: "fit-content",
	},
	label: {
		color: tokens["--fg-muted"],
		textAlign: "center",
	},
	gauge: (size) => ({
		placeItems: "center",
		display: "grid",
		position: "relative",
		height: size,
		width: size,
	}),
	track: {
		overflow: "visible",
		display: "block",
		gridColumnStart: "1",
		gridRowStart: "1",
	},
	arc: {
		fill: "none",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		transformOrigin: "50% 50%",
		transitionDuration: tokens["--motion-duration-long"],
		transitionProperty: "stroke-dasharray, transform, stroke, opacity",
		transitionTimingFunction: tokens["--motion-ease-smooth-out"],
	},
	arcColor: (color) => ({
		stroke: color,
	}),
	arcGeometry: (strokeDasharray, transform) => ({
		strokeDasharray,
		transform,
	}),
	hidden: {
		opacity: 0,
	},
	content: {
		placeItems: "center",
		display: "grid",
		gridColumnStart: "1",
		gridRowStart: "1",
		pointerEvents: "none",
	},
	compactValue: {
		letterSpacing: "-0.02em",
	},
	value: (fontSize, fontWeight) => ({
		fontSize,
		fontVariantNumeric: "tabular-nums",
		fontWeight,
		lineHeight: 1,
	}),
});
