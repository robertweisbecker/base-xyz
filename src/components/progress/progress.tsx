import { Progress as BaseProgress } from "@base-ui/react/progress";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { textStyles } from "@/components/text/text.stylex";
import { motion } from "@/styles/tokens.stylex";
import { colors, radius, space } from "@/styles/tokens.stylex";

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
	const sx = stylex.props(textStyles.supporting, progressParts.label, style);

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

const indeterminatePingPong = stylex.keyframes({
	"0%": {
		backgroundPosition: "100% 0",
	},
	"100%": {
		backgroundPosition: "0% 0",
	},
});

const indeterminatePingPongDuration = "2500ms";

const progressParts = stylex.create({
	root: {
		color: colors["--text"],
		columnGap: space[3],
		display: "grid",
		gridTemplateColumns: "minmax(0, 1fr) auto",
		rowGap: space[2],
		width: "100%",
	},
	label: {
		overflow: "hidden",
		color: colors["--text-muted"],
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
		minWidth: 0,
	},
	value: {
		color: colors["--text"],
		fontVariantNumeric: "tabular-nums",
		textAlign: "end",
		whiteSpace: "nowrap",
	},
	track: {
		backgroundPosition: {
			"[data-indeterminate]": "50% 0",
			default: "0% 0",
		},
		borderRadius: radius.full,
		gridColumn: "1 / -1",
		overflow: "hidden",
		animationDirection: {
			"[data-indeterminate]": "alternate",
			default: "normal",
		},
		animationDuration: {
			"[data-indeterminate]": indeterminatePingPongDuration,
			default: "0ms",
		},
		animationIterationCount: {
			"[data-indeterminate]": "infinite",
			default: 1,
		},
		animationName: {
			"[data-indeterminate]": {
				default: indeterminatePingPong,
				"@media (prefers-reduced-motion: reduce)": "none",
			},
			default: "none",
		},
		animationTimingFunction: "ease-in-out",
		backgroundColor: colors["--fill-track"],
		backgroundImage: {
			"[data-indeterminate]": `linear-gradient(90deg, transparent 0%, transparent 28%, ${colors["--fill-track"]} 40%, ${colors["--accent"]} 48%, ${colors["--accent"]} 52%, ${colors["--fill-track"]} 60%, transparent 72%, transparent 100%)`,
			default: `linear-gradient(90deg, transparent 0%, transparent 100%)`,
		},
		backgroundRepeat: "no-repeat",
		backgroundSize: {
			"[data-indeterminate]": "200% 100%",
			default: "auto",
		},
		outlineColor: colors["--border"],
		outlineOffset: -1,
		outlineStyle: "solid",
		outlineWidth: 1,
		height: "0.375rem",
	},
	indicator: {
		borderRadius: radius.full,
		backgroundColor: {
			"[data-complete]": colors["--success"],
			"[data-indeterminate]": "transparent",
			default: colors["--accent"],
		},
		transitionDuration: {
			default: motion.durationMedium,
			"@media (prefers-reduced-motion: reduce)": "0ms",
		},
		transitionProperty: "width, background-color",
		transitionTimingFunction: motion.easeSmoothOut,
		width: {
			"[data-indeterminate]": 0,
			default: 0,
		},
	},
});
