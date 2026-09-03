import {
	Children,
	createContext,
	Fragment,
	isValidElement,
	useContext,
	useState,
	type CSSProperties,
	type ComponentPropsWithRef,
	type ReactNode,
} from "react";
import * as stylex from "@stylexjs/stylex";
import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { useMediaQuery } from "@base-ui/react/unstable-use-media-query";
import { WarningIcon } from "@phosphor-icons/react/dist/csr/Warning";
import { Icon } from "@/components/icons";
import { fontWeightStyles, textStyles, textTruncationStyles } from "@/components/text/text.stylex";
import { VisuallyHidden } from "@/components/visually-hidden/visually-hidden";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { extractMarginProps, type MarginProps } from "@/styles/props/spacing.stylex";
import { focusRing } from "@/styles/recipes/focus";
import { media } from "@/styles/constants.stylex";
import { tokens } from "@/theme/tokens.stylex";
import { attrJoin } from "@/utils/attr-join";
import { stepperRootMarker, stepperStepMarker } from "./stepper.stylex";

const ENABLED_HOVER = ":hover:not([data-disabled])";
const LAST_STEP = ":last-of-type:not(:first-of-type)";
const FIRST_TAB_ACTIVE = ':has([role="tab"][data-active]:first-of-type)';
const LAST_TAB_ACTIVE = ':has([role="tab"][data-active]:last-of-type:not(:first-of-type))';

const stepperParts = stylex.create({
	root: {
		"--_stepper-connector-thickness": "0.125rem",
		"--_stepper-marker-size": tokens["--size-control-xs"],
		boxSizing: "border-box",
		display: "grid",
		minWidth: 0,
		width: "100%",
	},
	list: {
		gap: 0,
		alignSelf: "stretch",
		boxSizing: "border-box",
		display: "flex",
		flexWrap: "nowrap",
		gridColumnEnd: "steps",
		gridColumnStart: "steps",
		gridRowEnd: "steps",
		gridRowStart: "steps",
		isolation: "isolate",
		position: "relative",
		minHeight: 0,
		minWidth: 0,
		width: "100%",
		"::before": {
			borderRadius: tokens["--radius-full"],
			backgroundColor: tokens["--fill-track"],
			content: '""',
			insetBlockStart:
				"calc(var(--_stepper-marker-size) / 2 - var(--_stepper-connector-thickness) / 2)",
			insetInlineEnd: "calc(var(--_stepper-marker-size) / 2)",
			insetInlineStart: "calc(var(--_stepper-marker-size) / 2)",
			pointerEvents: "none",
			position: "absolute",
			zIndex: 0,
			height: "var(--_stepper-connector-thickness)",
		},
	},
	step: {
		margin: 0,
		padding: 0,
		borderStyle: "none",
		gap: tokens["--space-2"],
		appearance: "none",
		backgroundColor: "transparent",
		boxSizing: "border-box",
		color: {
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports chained pseudo-class conditions; the lint rule is stricter than the compiler.
			[ENABLED_HOVER]: {
				[media.canHover]: tokens["--fg"],
			},
			"[data-active]": tokens["--fg"],
			"[data-disabled]": tokens["--fg-subtle"],
			default: tokens["--fg-muted"],
		},
		cursor: "default",
		display: "grid",
		flexGrow: 0,
		flexShrink: 0,
		fontFamily: "inherit",
		pointerEvents: {
			"[data-disabled]": "none",
			default: "auto",
		},
		position: "relative",
		transitionDuration: tokens["--motion-duration-medium"],
		transitionProperty: "color",
		transitionTimingFunction: tokens["--motion-ease-smooth-out"],
		userSelect: "none",
	},
	indicator: {
		borderRadius: tokens["--radius-full"],
		backgroundColor: tokens["--fill-accent"],
		pointerEvents: "none",
		position: "absolute",
		transitionDuration: {
			default: tokens["--motion-duration-medium"],
			[media.reducedMotion]: "0ms",
		},
		transitionProperty: "width, height",
		transitionTimingFunction: tokens["--motion-ease-smooth-out"],
		zIndex: 1,
	},
	marker: {
		borderColor: {
			default: tokens["--border-strong"],
			[stylex.when.ancestor('[data-active][data-status="incomplete"]', stepperStepMarker)]:
				tokens["--fill-accent"],
			[stylex.when.ancestor('[data-status="completed"]', stepperStepMarker)]:
				tokens["--bg-primary"],
			[stylex.when.ancestor('[data-status="invalid"]', stepperStepMarker)]: tokens["--fill-error"],
		},
		borderRadius: tokens["--radius-full"],
		borderStyle: "solid",
		borderWidth: tokens["--border-width"],
		flex: "none",
		alignItems: "center",
		backgroundColor: {
			default: tokens["--canvas"],
			[stylex.when.ancestor('[data-active][data-status="incomplete"]', stepperStepMarker)]:
				tokens["--bg-accent"],
			[stylex.when.ancestor('[data-status="completed"]', stepperStepMarker)]:
				tokens["--bg-primary"],
			[stylex.when.ancestor('[data-status="invalid"]', stepperStepMarker)]: tokens["--bg-error"],
		},
		boxSizing: "border-box",
		color: {
			default: tokens["--fg"],
			[stylex.when.ancestor('[data-active][data-status="incomplete"]', stepperStepMarker)]:
				tokens["--fg-accent-strong"],
			[stylex.when.ancestor('[data-status="completed"]', stepperStepMarker)]:
				tokens["--fg-accent-contrast"],
			[stylex.when.ancestor('[data-status="invalid"]', stepperStepMarker)]: tokens["--fg-error"],
		},
		display: "inline-flex",
		fontSize: tokens["--font-size-2"],
		fontVariantNumeric: "tabular-nums",
		justifyContent: "center",
		letterSpacing: tokens["--letter-spacing-2"],
		lineHeight: tokens["--line-height-2"],
		opacity: {
			default: 1,
			[stylex.when.ancestor("[data-disabled]", stepperStepMarker)]: 0.48,
		},
		position: "relative",
		transitionDuration: tokens["--motion-duration-medium"],
		transitionProperty: "background-color, border-color, box-shadow, color",
		transitionTimingFunction: tokens["--motion-ease-smooth-out"],
		zIndex: 2,
		height: "var(--_stepper-marker-size)",
		width: "var(--_stepper-marker-size)",
	},
	heading: {
		gap: tokens["--space-0-5"],
		display: "flex",
		flexDirection: "column",
		opacity: {
			default: 1,
			[stylex.when.ancestor("[data-disabled]", stepperStepMarker)]: 0.48,
		},
		position: "relative",
		zIndex: 2,
		minWidth: 0,
	},
	title: {
		color: "inherit",
		minWidth: 0,
		width: "100%",
	},
	description: {
		color: tokens["--fg-subtle"],
		minWidth: 0,
		width: "100%",
	},
	content: {
		display: "grid",
		gridColumnEnd: "content",
		gridColumnStart: "content",
		gridRowEnd: "content",
		gridRowStart: "content",
		gridTemplateColumns: "minmax(0, 1fr)",
		minWidth: 0,
	},
	panel: {
		gap: tokens["--space-4"],
		paddingBlock: tokens["--space-4"],
		display: "flex",
		flexDirection: "column",
		gridColumnStart: "1",
		gridRowStart: "1",
		outlineStyle: "solid",
		outlineWidth: 0,
		minWidth: 0,
	},
});

const rootOrientationStyles = stylex.create({
	horizontal: {
		gridTemplateAreas: '"steps" "content"',
		alignItems: "stretch",
		gridTemplateColumns: "minmax(0, 1fr)",
		rowGap: tokens["--space-3"],
	},
	vertical: {
		gridTemplateAreas: '"steps content"',
		alignItems: "start",
		columnGap: tokens["--space-6"],
		gridTemplateColumns: "minmax(12rem, 24rem) minmax(0, 1fr)",
		gridTemplateRows: "auto",
		rowGap: tokens["--space-4"],
	},
});

const listLayoutStyles = stylex.create({
	horizontal: {
		alignItems: "flex-start",
		containerType: "inline-size",
		flexDirection: "row",
		justifyContent: "space-between",
		"::before": {
			display: "block",
		},
	},
	vertical: {
		alignItems: "stretch",
		flexDirection: "column",
		justifyContent: "flex-start",
		maxWidth: "24rem",
		"::before": {
			display: "none",
		},
	},
});

const stepLayoutStyles = stylex.create({
	horizontal: {
		flexBasis: "var(--_stepper-marker-size)",
		gridTemplateColumns: "var(--_stepper-marker-size)",
		justifyItems: {
			[LAST_STEP]: "end",
			default: "center",
			":first-of-type": "start",
		},
		textAlign: {
			[LAST_STEP]: "end",
			default: "center",
			":first-of-type": "start",
		},
		maxWidth: "var(--_stepper-marker-size)",
		minWidth: "var(--_stepper-marker-size)",
		width: "var(--_stepper-marker-size)",
	},
	vertical: {
		alignItems: "start",
		flexBasis: "auto",
		gridTemplateColumns: "var(--_stepper-marker-size) minmax(0, 1fr)",
		justifyItems: "start",
		paddingBlockEnd: {
			default: tokens["--space-6"],
			":last-of-type": 0,
		},
		textAlign: "start",
		minWidth: 0,
		width: "100%",
		"::after": {
			borderRadius: tokens["--radius-full"],
			backgroundColor: tokens["--fill-track"],
			content: '""',
			display: {
				default: "block",
				":last-of-type": "none",
			},
			insetBlockStart: "calc(var(--_stepper-marker-size) / 2)",
			insetInlineStart:
				"calc(var(--_stepper-marker-size) / 2 - var(--_stepper-connector-thickness) / 2)",
			pointerEvents: "none",
			position: "absolute",
			zIndex: 0,
			height: "100%",
			width: "var(--_stepper-connector-thickness)",
		},
	},
});

const headingLayoutStyles = stylex.create({
	horizontal: {
		width:
			"calc((100cqw - var(--_stepper-marker-size)) / max(1, var(--_stepper-step-count, 2) - 1))",
	},
	vertical: {
		maxWidth: "100%",
		width: "100%",
	},
});

const indicatorLayoutStyles = stylex.create({
	horizontal: {
		height: "var(--_stepper-connector-thickness)",
		left: "calc(var(--_stepper-marker-size) / 2)",
		top: "calc(var(--active-tab-top) + var(--_stepper-marker-size) / 2 - var(--_stepper-connector-thickness) / 2)",
		width: {
			default:
				"calc(var(--active-tab-left) + var(--active-tab-width) / 2 - var(--_stepper-marker-size) / 2)",
			[stylex.when.ancestor(FIRST_TAB_ACTIVE, stepperRootMarker)]: "var(--active-tab-left)",
			[stylex.when.ancestor(LAST_TAB_ACTIVE, stepperRootMarker)]:
				"calc(var(--active-tab-left) + var(--active-tab-width) - var(--_stepper-marker-size))",
		},
	},
	vertical: {
		height: "var(--active-tab-top)",
		left: "calc(var(--active-tab-left) + var(--_stepper-marker-size) / 2 - var(--_stepper-connector-thickness) / 2)",
		top: "calc(var(--_stepper-marker-size) / 2)",
		width: "var(--_stepper-connector-thickness)",
	},
});

export type StepperOrientation = BaseTabs.Root.Orientation;
export type StepperStatus = "incomplete" | "completed" | "invalid";
export type StepperValue = string;

const StepperStatusContext = createContext<StepperStatus>("incomplete");
const StepperVisitContext = createContext<ReadonlySet<StepperValue>>(new Set());
const StepperOrientationContext = createContext<StepperOrientation>("horizontal");

function countStepperSteps(children: ReactNode): number {
	let count = 0;
	Children.forEach(children, (child) => {
		if (!isValidElement(child)) return;
		// SAFETY: ReactElement props are unknown here; a Fragment's only field we inspect is its standard optional children prop.
		count +=
			child.type === Fragment
				? countStepperSteps((child.props as { children?: ReactNode }).children)
				: 1;
	});
	return Math.max(count, 1);
}

function initialVisitedValues(
	value: StepperValue | null | undefined,
	defaultValue: StepperValue | null | undefined,
): Set<StepperValue> {
	const initial = value !== undefined ? value : defaultValue;
	return new Set<StepperValue>(initial == null ? [] : [initial]);
}

function resolveStepperStatus(
	status: StepperStatus,
	completeOnVisit: boolean,
	visited: boolean,
): StepperStatus {
	switch (status) {
		case "invalid":
			return "invalid";
		case "completed":
			return "completed";
		case "incomplete":
			return completeOnVisit && visited ? "completed" : "incomplete";
		default: {
			const exhaustive: never = status;
			return exhaustive;
		}
	}
}

function statusAccessibleLabel(status: StepperStatus): string | null {
	switch (status) {
		case "completed":
			return "Completed";
		case "invalid":
			return "Invalid";
		case "incomplete":
			return null;
		default: {
			const exhaustive: never = status;
			return exhaustive;
		}
	}
}

type StepperPartStyleProps = BaseStyleProps & {
	className?: string;
};

export type StepperRootProps = Omit<
	BaseTabs.Root.Props,
	"className" | "defaultValue" | "onValueChange" | "style" | "value" | keyof MarginProps
> &
	MarginProps &
	BaseStyleProps & {
		className?: string;
		defaultValue?: StepperValue | null;
		onValueChange?: (
			value: StepperValue | null,
			eventDetails: BaseTabs.Root.ChangeEventDetails,
		) => void;
		orientation?: StepperOrientation;
		value?: StepperValue | null;
	};

export function Root({
	ref,
	className,
	defaultValue,
	onValueChange,
	orientation = "horizontal",
	style,
	value,
	xstyle,
	...props
}: StepperRootProps) {
	const { marginStyles, rest } = extractMarginProps(props);
	const isWide = useMediaQuery("(min-width: 48rem)", { defaultMatches: true });
	const effectiveOrientation = orientation === "vertical" && !isWide ? "horizontal" : orientation;
	const sx = stylex.props(
		stepperRootMarker,
		stepperParts.root,
		rootOrientationStyles[effectiveOrientation],
		marginStyles,
		xstyle,
	);
	const [visited, setVisited] = useState(() => initialVisitedValues(value, defaultValue));

	if (value != null && !visited.has(value)) {
		setVisited(new Set(visited).add(value));
	}

	return (
		<StepperOrientationContext value={effectiveOrientation}>
			<StepperVisitContext value={visited}>
				<BaseTabs.Root
					{...rest}
					ref={ref}
					className={attrJoin(sx.className, className)}
					data-orientation={effectiveOrientation}
					defaultValue={defaultValue}
					onValueChange={(nextValue, eventDetails) => {
						onValueChange?.(nextValue, eventDetails);
						if (value === undefined && nextValue != null && !eventDetails.isCanceled) {
							setVisited((current) =>
								current.has(nextValue) ? current : new Set(current).add(nextValue),
							);
						}
					}}
					orientation={effectiveOrientation}
					style={mergeStyle(sx.style, style)}
					value={value}
				/>
			</StepperVisitContext>
		</StepperOrientationContext>
	);
}

export type StepperListProps = Omit<
	BaseTabs.List.Props,
	"activateOnFocus" | "className" | "loopFocus" | "render" | "style"
> &
	StepperPartStyleProps;

export function List({ ref, children, className, style, xstyle, ...props }: StepperListProps) {
	const orientation = useContext(StepperOrientationContext);
	const stepCount = countStepperSteps(children);
	const sx = stylex.props(stepperParts.list, listLayoutStyles[orientation], xstyle);
	const indicatorSx = stylex.props(stepperParts.indicator, indicatorLayoutStyles[orientation]);

	return (
		<BaseTabs.List
			ref={ref}
			activateOnFocus={false}
			className={attrJoin(sx.className, className)}
			loopFocus={false}
			style={mergeStyle(
				// SAFETY: `--_stepper-step-count` is a unitless custom property for heading calc(); CSSProperties does not declare it.
				{ ...sx.style, "--_stepper-step-count": String(stepCount) } as CSSProperties,
				style,
			)}
			{...props}
		>
			{children}
			<BaseTabs.Indicator className={indicatorSx.className} style={indicatorSx.style} />
		</BaseTabs.List>
	);
}

export type StepperStepProps = Omit<
	BaseTabs.Tab.Props,
	"className" | "render" | "style" | "value"
> &
	StepperPartStyleProps & {
		/** When true, the step is completed once it has been selected. */
		completeOnVisit?: boolean;
		status?: StepperStatus;
		value: StepperValue;
	};

export function Step({
	ref,
	children,
	className,
	completeOnVisit = false,
	status = "incomplete",
	style,
	type = "button",
	value,
	xstyle,
	...props
}: StepperStepProps) {
	const visited = useContext(StepperVisitContext).has(value);
	const orientation = useContext(StepperOrientationContext);
	const effectiveStatus = resolveStepperStatus(status, completeOnVisit, visited);
	const sx = stylex.props(
		stepperStepMarker,
		focusRing.offset,
		stepperParts.step,
		stepLayoutStyles[orientation],
		xstyle,
	);
	const statusLabel = statusAccessibleLabel(effectiveStatus);

	return (
		<BaseTabs.Tab
			{...props}
			ref={ref}
			className={attrJoin(sx.className, className)}
			data-status={effectiveStatus}
			style={mergeStyle(sx.style, style)}
			type={type}
			value={value}
		>
			<StepperStatusContext value={effectiveStatus}>{children}</StepperStatusContext>
			{statusLabel ? <VisuallyHidden>{statusLabel}</VisuallyHidden> : null}
		</BaseTabs.Tab>
	);
}

export type StepperMarkerProps = Omit<
	ComponentPropsWithRef<"span">,
	"aria-hidden" | "children" | "className" | "style"
> &
	StepperPartStyleProps & {
		children: ReactNode;
	};

export function Marker({ children, className, style, xstyle, ...props }: StepperMarkerProps) {
	const status = useContext(StepperStatusContext);
	const sx = stylex.props(stepperParts.marker, fontWeightStyles.medium, xstyle);
	const marker =
		status === "completed" ? (
			<Icon.Checkmark size="1em" strokeWidth={3} />
		) : status === "invalid" ? (
			<WarningIcon aria-hidden size="1em" weight="fill" />
		) : (
			children
		);
	return (
		<span
			{...props}
			aria-hidden
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
		>
			{marker}
		</span>
	);
}

export type StepperHeadingProps = Omit<ComponentPropsWithRef<"span">, "className" | "style"> &
	StepperPartStyleProps;

export function Heading({ className, style, xstyle, ...props }: StepperHeadingProps) {
	const orientation = useContext(StepperOrientationContext);
	const sx = stylex.props(stepperParts.heading, headingLayoutStyles[orientation], xstyle);
	return (
		<span
			{...props}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
		/>
	);
}

export type StepperTitleProps = Omit<ComponentPropsWithRef<"span">, "className" | "style"> &
	StepperPartStyleProps;

export function Title({ className, style, xstyle, ...props }: StepperTitleProps) {
	const sx = stylex.props(
		textStyles.label,
		fontWeightStyles.medium,
		textTruncationStyles.truncate,
		stepperParts.title,
		xstyle,
	);
	return (
		<span
			{...props}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
		/>
	);
}

export type StepperDescriptionProps = Omit<ComponentPropsWithRef<"span">, "className" | "style"> &
	StepperPartStyleProps;

export function Description({ className, style, xstyle, ...props }: StepperDescriptionProps) {
	const sx = stylex.props(textStyles.supporting, stepperParts.description, xstyle);
	return (
		<span
			{...props}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
		/>
	);
}

export type StepperContentProps = Omit<ComponentPropsWithRef<"div">, "className" | "style"> &
	StepperPartStyleProps;

export function Content({ className, style, xstyle, ...props }: StepperContentProps) {
	const sx = stylex.props(stepperParts.content, xstyle);
	return (
		<div
			{...props}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
		/>
	);
}

export type StepperPanelProps = Omit<BaseTabs.Panel.Props, "className" | "style" | "value"> &
	StepperPartStyleProps & {
		value: StepperValue;
	};

export function Panel({ ref, className, style, value, xstyle, ...props }: StepperPanelProps) {
	const sx = stylex.props(stepperParts.panel, focusRing.inset, xstyle);
	return (
		<BaseTabs.Panel
			ref={ref}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			value={value}
			{...props}
		/>
	);
}

export const Stepper = {
	Root,
	List,
	Step,
	Marker,
	Heading,
	Title,
	Description,
	Content,
	Panel,
} as const;
