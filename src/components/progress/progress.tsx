import { Progress as BaseProgress } from "@base-ui/react/progress";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { media } from "@/styles/constants.stylex";
import { textStyles } from "@/components/text/text.stylex";
import { tokens } from "@/theme/tokens.stylex";

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

const indeterminatePingPongDuration = "1500ms";

const progressParts = stylex.create({
	root: {
		color: tokens["--fg"],
		columnGap: tokens["--space-3"],
		display: "grid",
		gridTemplateColumns: "minmax(0, 1fr) auto",
		rowGap: tokens["--space-2"],
		width: "100%",
	},
	label: {
		overflow: "hidden",
		color: tokens["--fg-muted"],
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
		minWidth: 0,
	},
	value: {
		color: tokens["--fg"],
		fontVariantNumeric: "tabular-nums",
		textAlign: "end",
		whiteSpace: "nowrap",
	},
	track: {
		backgroundPosition: {
			"[data-indeterminate]": "100% 0",
			default: "0% 0",
		},
		borderRadius: tokens["--radius-full"],
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
				[media.reducedMotion]: "none",
			},
			default: "none",
		},
		animationTimingFunction: "cubic-bezier(0.455, 0.03, 0.515, 0.955)",
		backgroundColor: tokens["--fill-track"],
		backgroundImage: {
			"[data-indeterminate]": `linear-gradient(90deg, transparent 0%, transparent 28%, ${tokens["--bg-primary"]} 40%, ${tokens["--bg-primary"]} 48%, ${tokens["--bg-primary"]} 52%, ${tokens["--bg-primary"]} 60%, transparent 72%, transparent 100%)`,
			default: `linear-gradient(90deg, transparent 0%, transparent 100%)`,
		},
		backgroundRepeat: "no-repeat",
		backgroundSize: {
			"[data-indeterminate]": "300% 100%",
			default: "auto",
		},
		gridColumnEnd: "-1",
		gridColumnStart: "1",
		outlineColor: tokens["--border"],
		outlineOffset: -1,
		outlineStyle: "solid",
		outlineWidth: 1,
		height: "0.375rem",
	},
	indicator: {
		borderRadius: tokens["--radius-full"],
		backgroundColor: {
			"[data-complete]": tokens["--bg-success-primary"],
			"[data-indeterminate]": "transparent",
			default: tokens["--bg-primary"],
		},
		transitionDuration: tokens["--motion-duration-short"],
		transitionProperty: "width, background-color",
		transitionTimingFunction: tokens["--motion-ease-smooth-out"],
		width: {
			"[data-indeterminate]": 0,
			default: 0,
		},
	},
});

export const Progress = {
	Root,
	Label,
	Value,
	Track,
	Indicator,
} as const;
