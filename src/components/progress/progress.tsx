import { Progress as BaseProgress } from "@base-ui/react/progress";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { textColorStyles, textStyles } from "@/components/text/text.stylex";
import { motion } from "@/styles/tokens.stylex";
import { color, radius, space } from "@/styles/tokens.stylex";

type StyledProps<T> = Omit<T, "className" | "style"> & {
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export type RootProps = StyledProps<BaseProgress.Root.Props>;
export type LabelProps = StyledProps<BaseProgress.Label.Props>;
export type ValueProps = StyledProps<BaseProgress.Value.Props>;
export type TrackProps = StyledProps<BaseProgress.Track.Props>;
export type IndicatorProps = StyledProps<BaseProgress.Indicator.Props>;

export function Root({ ref, className, style, ...props }: RootProps) {
	const sx = stylex.props(progressParts.root, style);

	return (
		<BaseProgress.Root
			ref={ref}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}
		/>
	);
}

export function Label({ ref, className, style, ...props }: LabelProps) {
	const sx = stylex.props(textStyles.supporting, textColorStyles.muted, progressParts.label, style);

	return (
		<BaseProgress.Label
			ref={ref}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}
		/>
	);
}

export function Value({ ref, className, style, ...props }: ValueProps) {
	const sx = stylex.props(textStyles.supporting, progressParts.value, style);

	return (
		<BaseProgress.Value
			ref={ref}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}
		/>
	);
}

export function Track({ ref, className, style, ...props }: TrackProps) {
	const sx = stylex.props(progressParts.track, style);

	return (
		<BaseProgress.Track
			ref={ref}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}
		/>
	);
}

export function Indicator({ ref, className, style, ...props }: IndicatorProps) {
	const sx = stylex.props(progressParts.indicator, style);

	return (
		<BaseProgress.Indicator
			ref={ref}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}
		/>
	);
}

const indeterminateSlide = stylex.keyframes({
	"0%": {
		transform: "translateX(-110%)",
	},
	"100%": {
		transform: "translateX(260%)",
	},
});

const progressParts = stylex.create({
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
		borderRadius: radius.full,
		gridColumn: "1 / -1",
		overflow: "hidden",
		backgroundColor: color.fillTrack,
		height: "0.375rem",
	},
	indicator: {
		borderRadius: radius.full,
		animationDuration: {
			"[data-indeterminate]": motion.durationLong,
			default: "0ms",
		},
		animationIterationCount: {
			"[data-indeterminate]": "infinite",
			default: 1,
		},
		animationName: {
			"[data-indeterminate]": {
				default: indeterminateSlide,
				"@media (prefers-reduced-motion: reduce)": "none",
			},
			default: "none",
		},
		animationTimingFunction: motion.easeSmoothOut,
		backgroundColor: {
			"[data-complete]": color.bgSuccess,
			default: color.bgAccent,
		},
		transform: "translateX(0)",
		transitionDuration: {
			default: motion.durationMedium,
			"@media (prefers-reduced-motion: reduce)": "0ms",
		},
		transitionProperty: "width, background-color",
		transitionTimingFunction: motion.easeSmoothOut,
		width: {
			"[data-indeterminate]": "40%",
			default: 0,
		},
	},
});
