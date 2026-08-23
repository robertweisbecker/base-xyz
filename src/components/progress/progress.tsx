import { Progress as BaseProgress } from "@base-ui/react/progress";
import * as stylex from "@stylexjs/stylex";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { extractMarginProps, type MarginProps } from "@/styles/props/spacing.stylex";
import { media } from "@/styles/constants.stylex";
import { textStyles } from "@/components/text/text.stylex";
import { tokens } from "@/theme/tokens.stylex";
import { attrJoin } from "@/utils/attr-join";

type PartProps<T> = Omit<T, "className" | "style" | "xstyle"> & BaseStyleProps & { className?: string };

export type RootProps = Omit<BaseProgress.Root.Props, "className" | "style" | "xstyle" | keyof MarginProps> &
	MarginProps &
	PartProps<BaseProgress.Root.Props>;
export type LabelProps = PartProps<BaseProgress.Label.Props>;
export type ValueProps = PartProps<BaseProgress.Value.Props>;
export type TrackProps = PartProps<BaseProgress.Track.Props>;
export type IndicatorProps = PartProps<BaseProgress.Indicator.Props>;

export function Root({ ref, className, style, xstyle, ...props }: RootProps) {
	const { marginStyles, rest } = extractMarginProps(props);
	const sx = stylex.props(
		progressParts.root,
		marginStyles,
		xstyle,
	);

	return (
		<BaseProgress.Root
			ref={ref}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...rest}
		/>
	);
}

export function Label({ ref, className, style, xstyle, ...props }: LabelProps) {
	const sx = stylex.props(textStyles.supporting, progressParts.label, xstyle);

	return (
		<BaseProgress.Label
			ref={ref}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...props}
		/>
	);
}

export function Value({ ref, className, style, xstyle, ...props }: ValueProps) {
	const sx = stylex.props(textStyles.supporting, progressParts.value, xstyle);

	return (
		<BaseProgress.Value
			ref={ref}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...props}
		/>
	);
}

export function Track({ ref, className, style, xstyle, ...props }: TrackProps) {
	const sx = stylex.props(progressParts.track, xstyle);

	return (
		<BaseProgress.Track
			ref={ref}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...props}
		/>
	);
}

export function Indicator({ ref, className, style, xstyle, ...props }: IndicatorProps) {
	const sx = stylex.props(progressParts.indicator, xstyle);

	return (
		<BaseProgress.Indicator
			ref={ref}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
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
