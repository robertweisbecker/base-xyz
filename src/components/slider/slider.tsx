import { Slider as BaseSlider } from "@base-ui/react/slider";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { createContext, type ComponentPropsWithoutRef, useContext, useMemo } from "react";
import { media } from "@/styles/constants.stylex";
import { fieldStyles } from "@/components/field/field.stylex";
import { typescaleStyles, fontWeightStyles } from "@/components/text/text.stylex";
import { focusRing } from "@/styles/recipes/focus";
import { tokens } from "@/theme/tokens.stylex";

type SliderValue = number | readonly number[];

export type SliderSize = "sm" | "md" | "lg";

export type SliderRootProps<Value extends SliderValue = SliderValue> = Omit<
	BaseSlider.Root.Props<Value>,
	"className" | "style" | "thumbAlignment"
> & {
	size?: SliderSize;
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export type SliderHeaderProps = StyledDivProps;
export type SliderRowProps = StyledDivProps;
export type SliderLabelProps = StyledPartProps<BaseSlider.Label.Props>;
export type SliderValueProps = StyledPartProps<BaseSlider.Value.Props>;
export type SliderControlProps = StyledPartProps<BaseSlider.Control.Props> & {
	/** Renders the standard marker layer. Pass options to display every N slider steps. */
	markers?: boolean | SliderMarkersOptions;
};
export type SliderThumbProps = StyledPartProps<BaseSlider.Thumb.Props>;
export type SliderMarkersOptions = {
	/** Renders one marker for every N slider steps. */
	every?: number;
};

type StyledPartProps<Props> = Omit<Props, "className" | "style"> & {
	className?: string;
	style?: StyleXStyles;
};

type StyledDivProps = Omit<ComponentPropsWithoutRef<"div">, "className" | "style"> & {
	className?: string;
	style?: StyleXStyles;
};

type SliderContextValue = {
	format: Intl.NumberFormatOptions | undefined;
	locale: Intl.LocalesArgument | undefined;
	max: number;
	min: number;
	orientation: "horizontal" | "vertical";
	step: number;
};

const SliderContext = createContext<SliderContextValue | null>(null);

export function Root<Value extends SliderValue = number>({
	className,
	style,
	size: sliderSize = "md",
	min = 0,
	max = 100,
	step = 1,
	orientation = "horizontal",
	format,
	locale,
	children,
	...props
}: SliderRootProps<Value>) {
	const sx = stylex.props(sliderParts.root, sizeVariants[sliderSize], style);
	const contextValue = useMemo(
		() => ({ format, locale, max, min, orientation, step }),
		[format, locale, max, min, orientation, step],
	);

	return (
		<SliderContext value={contextValue}>
			<BaseSlider.Root
				min={min}
				max={max}
				step={step}
				orientation={orientation}
				format={format}
				locale={locale}
				thumbAlignment="edge"
				data-size={sliderSize}
				className={mergeClassNames(sx.className, className)}
				style={sx.style}
				{...props}>
				{children}
			</BaseSlider.Root>
		</SliderContext>
	);
}

export function Header({ className, style, ...props }: SliderHeaderProps) {
	const sx = stylex.props(sliderParts.header, style);
	return <div {...props} className={mergeClassNames(sx.className, className)} style={sx.style} />;
}

export function Label({ className, style, ...props }: SliderLabelProps) {
	const sx = stylex.props(fieldStyles.itemLabel, sliderParts.label, style);
	return <BaseSlider.Label {...props} className={mergeClassNames(sx.className, className)} style={sx.style} />;
}

export function Value({ children, className, style, ...props }: SliderValueProps) {
	const { format, locale, max, min } = useSliderContext();
	const sx = stylex.props(typescaleStyles["2"], fontWeightStyles.regular, sliderParts.value, style);

	return (
		<BaseSlider.Value {...props} className={mergeClassNames(sx.className, className)} style={sx.style}>
			{(formattedValues, values) => {
				const minValues = values.map(() => min);
				const maxValues = values.map(() => max);

				return (
					<>
						<span aria-hidden {...stylex.props(sliderParts.valueReserve)}>
							{renderValueContent(children, formatValues(minValues, locale, format), minValues)}
						</span>
						<span aria-hidden {...stylex.props(sliderParts.valueReserve)}>
							{renderValueContent(children, formatValues(maxValues, locale, format), maxValues)}
						</span>
						<span {...stylex.props(sliderParts.valueContent)}>
							{renderValueContent(children, formattedValues, values)}
						</span>
					</>
				);
			}}
		</BaseSlider.Value>
	);
}

export function Row({ className, style, ...props }: SliderRowProps) {
	const sx = stylex.props(sliderParts.row, style);
	return <div {...props} className={mergeClassNames(sx.className, className)} style={sx.style} />;
}

export function Control({ children, className, markers = false, style, ...props }: SliderControlProps) {
	const sx = stylex.props(sliderParts.control, style);
	const trackSx = stylex.props(sliderParts.track);
	const indicatorSx = stylex.props(sliderParts.indicator);

	return (
		<BaseSlider.Control {...props} className={mergeClassNames(sx.className, className)} style={sx.style}>
			<BaseSlider.Track className={trackSx.className} style={trackSx.style}>
				<BaseSlider.Indicator className={indicatorSx.className} style={indicatorSx.style} />
				{markers ? <Markers every={typeof markers === "boolean" ? 1 : markers.every} /> : null}
			</BaseSlider.Track>
			{children}
		</BaseSlider.Control>
	);
}

function Markers({ every = 1 }: SliderMarkersOptions) {
	const { max, min, orientation, step } = useSliderContext();
	const markerValues = getMarkerValues(min, max, step, every);
	const sx = stylex.props(sliderParts.markers);

	return (
		<div aria-hidden data-orientation={orientation} className={sx.className} style={sx.style}>
			{markerValues.map((markerValue) => {
				const markerPosition = `${getMarkerPosition(markerValue, min, max)}%`;
				const markerStyle =
					orientation === "horizontal"
						? { insetBlockStart: "50%", insetInlineStart: markerPosition }
						: { insetBlockEnd: markerPosition, insetInlineStart: "50%" };

				return <span key={markerValue} {...stylex.props(sliderParts.marker)} style={markerStyle} />;
			})}
		</div>
	);
}

export function Thumb({ className, style, ...props }: SliderThumbProps) {
	const sx = stylex.props(focusRing.offset, sliderParts.thumb, style);
	return <BaseSlider.Thumb {...props} className={mergeClassNames(sx.className, className)} style={sx.style} />;
}

function useSliderContext() {
	const context = useContext(SliderContext);
	if (context === null) {
		throw new Error("Slider parts must be rendered inside Slider.Root.");
	}
	return context;
}

function getMarkerValues(min: number, max: number, step: number, every: number) {
	if (!(step > 0) || !(every > 0) || !Number.isFinite(step) || !Number.isFinite(every)) {
		return [];
	}

	const stepCount = Math.floor((max - min) / step + Number.EPSILON);
	const markerInterval = Math.max(1, Math.round(every));
	const markerValues: number[] = [];

	for (let stepIndex = 0; stepIndex <= stepCount; stepIndex += markerInterval) {
		markerValues.push(Number((min + stepIndex * step).toPrecision(12)));
	}

	return markerValues;
}

function getMarkerPosition(value: number, min: number, max: number) {
	const range = max - min;
	if (!(range > 0)) return 0;
	return Math.min(100, Math.max(0, ((value - min) / range) * 100));
}

function formatValues(
	values: readonly number[],
	locale: Intl.LocalesArgument | undefined,
	format: Intl.NumberFormatOptions | undefined,
) {
	const formatter = new Intl.NumberFormat(locale, format);
	return values.map((value) => formatter.format(value));
}

function renderValueContent(
	children: BaseSlider.Value.Props["children"],
	formattedValues: readonly string[],
	values: readonly number[],
) {
	if (typeof children === "function") {
		return children(formattedValues, values);
	}

	return values.map((value, index) => formattedValues[index] || value).join(" – ");
}

function mergeClassNames(...classNames: Array<string | undefined>) {
	return classNames.filter(Boolean).join(" ");
}

const sliderParts = stylex.create({
	root: {
		"--_slider-fill": tokens["--bg-neutral"],
		gap: tokens["--space-2"],
		display: "flex",
		flexDirection: "column",
		minWidth: 0,
		width: "100%",
	},
	header: {
		gap: tokens["--space-3"],
		alignItems: "baseline",
		display: "flex",
		justifyContent: "space-between",
		minWidth: 0,
	},
	label: {
		color: {
			"[data-disabled]": tokens["--fg-muted"],
			default: tokens["--fg"],
		},
		opacity: {
			"[data-disabled]": 0.48,
			default: 1,
		},
	},
	value: {
		color: tokens["--fg-muted"],
		display: "inline-grid",
		opacity: {
			"[data-disabled]": 0.48,
			default: 1,
		},
		whiteSpace: "nowrap",
		minWidth: 0,
	},
	valueContent: {
		gridArea: "1 / 1",
		justifySelf: "end",
	},
	valueReserve: {
		gridArea: "1 / 1",
		justifySelf: "end",
		visibility: "hidden",
	},
	row: {
		gap: tokens["--space-2"],
		alignItems: "center",
		display: "flex",
		minWidth: 0,
	},
	control: {
		"--_slider-fill": {
			"[data-disabled]": tokens["--bg-neutral"],
			default: tokens["--bg-primary"],
			":hover": {
				[media.canHover]: tokens["--bg-primary-highlight"],
			},
		},
		flex: {
			'[data-orientation="horizontal"]': "1 1 auto",
			'[data-orientation="vertical"]': "none",
		},
		cursor: {
			"[data-disabled]": "not-allowed",
			"[data-dragging]": "grabbing",
			default: "default",
		},
		position: "relative",
		touchAction: "none",
		userSelect: "none",
		height: {
			'[data-orientation="horizontal"]': "var(--_slider-visual-size)",
			'[data-orientation="vertical"]': "12rem",
		},
		minWidth: 0,
		width: {
			'[data-orientation="horizontal"]': "100%",
			'[data-orientation="vertical"]': "var(--_slider-visual-size)",
		},
	},
	track: {
		borderRadius: tokens["--radius-full"],
		overflow: "hidden",
		backgroundColor: {
			"[data-disabled]": tokens["--fill-disabled"],
			default: tokens["--fill-track"],
		},
		boxShadow: {
			"[data-disabled]": "none",
			"[data-invalid]": `0 0 0 2px ${tokens["--surface"]}, 0 0 0 4px ${tokens["--bg-error-primary"]}`,
			default: tokens["--shadow-inset"],
		},
		height: "100%",
		width: "100%",
	},
	indicator: {
		borderRadius: 0,
		backgroundColor: {
			"[data-disabled]": tokens["--border"],
			default: "var(--_slider-fill)",
		},
		transitionDuration: tokens["--motion-duration-quick"],
		transitionProperty: "background-color",
		transitionTimingFunction: tokens["--motion-ease-out"],
		height: "100%",
	},
	markers: {
		insetBlock: {
			'[data-orientation="horizontal"]': 0,
			'[data-orientation="vertical"]': "calc(var(--_slider-visual-size) / 2)",
		},
		insetInline: {
			'[data-orientation="horizontal"]': "calc(var(--_slider-visual-size) / 2)",
			'[data-orientation="vertical"]': 0,
		},
		pointerEvents: "none",
		position: "absolute",
		zIndex: 1,
	},
	marker: {
		position: "absolute",
		height: 0,
		width: 0,
		"::before": {
			borderRadius: tokens["--radius-full"],
			backgroundColor: tokens["--color-gray-a3"],
			content: '""',
			opacity: 1,
			position: "absolute",
			transform: "translate(-50%, -50%)",
			height: tokens["--space-1"],
			left: "50%",
			top: "50%",
			width: tokens["--space-1"],
		},
	},
	thumb: {
		borderRadius: tokens["--radius-full"],
		backgroundColor: tokens["--fg-accent-contrast"],
		boxShadow: {
			"[data-disabled]": "none",
			default: null,
			":has(input:focus-visible)": "0 0 0 8px var(--canvas)",
		},
		outlineColor: {
			"[data-disabled]": "transparent",
			default: "var(--_slider-fill)",
			":active:not([data-disabled])": tokens["--fg-accent"],
			":has(input:focus-visible)": tokens["--fg"],
			':has(input:focus-visible[aria-invalid="true"])': tokens["--bg-error-primary"],
			":has(input:focus-visible[data-invalid])": tokens["--bg-error-primary"],
		},
		outlineOffset: {
			default: 0,
			":has(input:focus-visible)": 2,
		},
		outlineWidth: {
			"[data-disabled]": 0,
			default: 2,
			":has(input:focus-visible)": 2,
		},
		position: "relative",
		transitionDuration: tokens["--motion-duration-quick"],
		transitionProperty: "background-color, box-shadow, scale",
		transitionTimingFunction: tokens["--motion-ease-out"],
		zIndex: 2,
		height: "calc(var(--_slider-visual-size) - 4px)",
		width: "calc(var(--_slider-visual-size) - 4px)",
		"::before": {
			borderRadius: tokens["--radius-full"],
			content: '""',
			insetInlineStart: "50%",
			pointerEvents: "auto",
			position: "absolute",
			transform: "translate(-50%, -50%)",
			height: "var(--_slider-tap-size)",
			top: "50%",
			width: "var(--_slider-tap-size)",
		},
	},
});

const sizeVariants = stylex.create({
	sm: {
		"--_slider-tap-size": tokens["--size-control-md"],
		"--_slider-visual-size": tokens["--size-indicator-sm"],
	},
	md: {
		"--_slider-tap-size": tokens["--size-control-md"],
		"--_slider-visual-size": tokens["--size-indicator-md"],
	},
	lg: {
		"--_slider-tap-size": tokens["--size-control-lg"],
		"--_slider-visual-size": tokens["--space-7"],
	},
});

export const Slider = {
	Root,
	Header,
	Label,
	Value,
	Row,
	Control,
	Thumb,
} as const;
