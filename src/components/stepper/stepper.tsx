import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { useMediaQuery } from "@base-ui/react/unstable-use-media-query";
import { WarningIcon } from "@phosphor-icons/react/dist/csr/Warning";
import * as stylex from "@stylexjs/stylex";
import { createContext, useContext, type ComponentPropsWithRef, type ReactNode } from "react";
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

const stepperParts = stylex.create({
	root: {
		"--_stepper-connector-thickness": "0.125rem",
		"--_stepper-list-padding": tokens["--space-2"],
		"--_stepper-marker-size": tokens["--size-control-md"],
		boxSizing: "border-box",
		display: "grid",
		minWidth: 0,
		width: "100%",
	},
	list: {
		gap: 0,
		paddingBlock: "var(--_stepper-list-padding)",
		paddingInline: "var(--_stepper-list-padding)",
		alignItems: {
			default: "flex-start",
			[stylex.when.ancestor("[data-orientation=vertical]", stepperRootMarker)]: "stretch",
		},
		alignSelf: "stretch",
		boxSizing: "border-box",
		display: "flex",
		flexDirection: {
			default: "row",
			[stylex.when.ancestor("[data-orientation=vertical]", stepperRootMarker)]: "column",
		},
		flexWrap: "nowrap",
		gridColumnEnd: "steps",
		gridColumnStart: "steps",
		gridRowEnd: "steps",
		gridRowStart: "steps",
		isolation: "isolate",
		position: "relative",
		maxWidth: {
			default: null,
			[stylex.when.ancestor("[data-orientation=vertical]", stepperRootMarker)]: "24rem",
		},
		minHeight: 0,
		minWidth: 0,
		width: "100%",
	},
	step: {
		"--_stepper-content-opacity": {
			"[data-disabled]": 0.48,
			default: 1,
		},
		"--_stepper-title-color": {
			"[data-active]": tokens["--fg"],
			"[data-disabled]": tokens["--fg-subtle"],
			default: tokens["--fg-muted"],
		},
		margin: 0,
		padding: 0,
		borderStyle: "none",
		gap: tokens["--space-2"],
		alignItems: {
			default: null,
			[stylex.when.ancestor("[data-orientation=vertical]", stepperRootMarker)]: "start",
		},
		appearance: "none",
		backgroundColor: "transparent",
		boxSizing: "border-box",
		color: tokens["--fg-muted"],
		cursor: "default",
		display: "grid",
		flexBasis: {
			default: 0,
			[stylex.when.ancestor("[data-orientation=vertical]", stepperRootMarker)]: "auto",
		},
		flexGrow: {
			default: 1,
			[stylex.when.ancestor("[data-orientation=vertical]", stepperRootMarker)]: 0,
		},
		flexShrink: 1,
		fontFamily: "inherit",
		gridTemplateColumns: {
			default: "minmax(0, 1fr)",
			[stylex.when.ancestor("[data-orientation=vertical]", stepperRootMarker)]:
				"var(--_stepper-marker-size) minmax(0, 1fr)",
		},
		justifyItems: {
			default: "start",
			[stylex.when.ancestor("[data-orientation=vertical]", stepperRootMarker)]: null,
		},
		paddingBlockEnd: {
			default: 0,
			[stylex.when.ancestor("[data-orientation=vertical]", stepperRootMarker)]: tokens["--space-6"],
			":last-of-type": 0,
		},
		paddingInlineEnd: {
			default: tokens["--space-6"],
			[stylex.when.ancestor("[data-orientation=vertical]", stepperRootMarker)]: 0,
			":last-of-type": 0,
		},
		pointerEvents: {
			"[data-disabled]": "none",
			default: "auto",
		},
		position: "relative",
		textAlign: "start",
		userSelect: "none",
		minWidth: 0,
		width: {
			default: null,
			[stylex.when.ancestor("[data-orientation=vertical]", stepperRootMarker)]: "100%",
		},
		"::after": {
			borderRadius: tokens["--radius-full"],
			backgroundColor: tokens["--fill-track"],
			content: '""',
			display: {
				default: "block",
				":last-of-type": "none",
			},
			insetBlockStart: {
				default: "calc(var(--_stepper-marker-size) / 2 - var(--_stepper-connector-thickness) / 2)",
				[stylex.when.ancestor("[data-orientation=vertical]", stepperRootMarker)]:
					"calc(var(--_stepper-marker-size) / 2)",
			},
			insetInlineStart: {
				default: "calc(var(--_stepper-marker-size) / 2)",
				[stylex.when.ancestor("[data-orientation=vertical]", stepperRootMarker)]:
					"calc(var(--_stepper-marker-size) / 2 - var(--_stepper-connector-thickness) / 2)",
			},
			pointerEvents: "none",
			position: "absolute",
			zIndex: 0,
			height: {
				default: "var(--_stepper-connector-thickness)",
				[stylex.when.ancestor("[data-orientation=vertical]", stepperRootMarker)]: "100%",
			},
			width: {
				default: "100%",
				[stylex.when.ancestor("[data-orientation=vertical]", stepperRootMarker)]:
					"var(--_stepper-connector-thickness)",
			},
		},
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
		height: {
			default: "var(--_stepper-connector-thickness)",
			[stylex.when.ancestor("[data-orientation=vertical]", stepperRootMarker)]:
				"calc(var(--active-tab-top) - var(--_stepper-list-padding))",
		},
		left: {
			default: "calc(var(--_stepper-list-padding) + var(--_stepper-marker-size) / 2)",
			[stylex.when.ancestor("[data-orientation=vertical]", stepperRootMarker)]:
				"calc(var(--active-tab-left) + var(--_stepper-marker-size) / 2 - var(--_stepper-connector-thickness) / 2)",
		},
		top: {
			default:
				"calc(var(--active-tab-top) + var(--_stepper-marker-size) / 2 - var(--_stepper-connector-thickness) / 2)",
			[stylex.when.ancestor("[data-orientation=vertical]", stepperRootMarker)]:
				"calc(var(--_stepper-list-padding) + var(--_stepper-marker-size) / 2)",
		},
		width: {
			default: "calc(var(--active-tab-left) - var(--_stepper-list-padding))",
			[stylex.when.ancestor("[data-orientation=vertical]", stepperRootMarker)]:
				"var(--_stepper-connector-thickness)",
		},
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
			default: tokens["--fg-muted"],
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
		opacity: "var(--_stepper-content-opacity)",
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
		opacity: "var(--_stepper-content-opacity)",
		position: "relative",
		zIndex: 2,
		minWidth: 0,
	},
	title: {
		color: "var(--_stepper-title-color)",
		minWidth: 0,
	},
	description: {
		color: tokens["--fg-subtle"],
		minWidth: 0,
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

export type StepperOrientation = BaseTabs.Root.Orientation;
export type StepperStatus = "incomplete" | "completed" | "invalid";
export type StepperValue = string;

const StepperStatusContext = createContext<StepperStatus>("incomplete");

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

	return (
		<BaseTabs.Root
			{...rest}
			ref={ref}
			className={attrJoin(sx.className, className)}
			data-orientation={effectiveOrientation}
			defaultValue={defaultValue}
			onValueChange={onValueChange}
			orientation={effectiveOrientation}
			style={mergeStyle(sx.style, style)}
			value={value}
		/>
	);
}

export type StepperListProps = Omit<
	BaseTabs.List.Props,
	"activateOnFocus" | "className" | "loopFocus" | "render" | "style"
> &
	StepperPartStyleProps;

export function List({ ref, children, className, style, xstyle, ...props }: StepperListProps) {
	const sx = stylex.props(stepperParts.list, xstyle);
	const indicatorSx = stylex.props(stepperParts.indicator);

	return (
		<BaseTabs.List
			ref={ref}
			activateOnFocus={false}
			className={attrJoin(sx.className, className)}
			loopFocus={false}
			style={mergeStyle(sx.style, style)}
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
		status?: StepperStatus;
		value: StepperValue;
	};

export function Step({
	ref,
	children,
	className,
	status = "incomplete",
	style,
	type = "button",
	value,
	xstyle,
	...props
}: StepperStepProps) {
	const sx = stylex.props(stepperStepMarker, focusRing.offset, stepperParts.step, xstyle);
	const statusLabel =
		status === "completed" ? "Completed" : status === "invalid" ? "Invalid" : null;

	return (
		<BaseTabs.Tab
			{...props}
			ref={ref}
			className={attrJoin(sx.className, className)}
			data-status={status}
			style={mergeStyle(sx.style, style)}
			type={type}
			value={value}
		>
			<StepperStatusContext value={status}>{children}</StepperStatusContext>
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
	const sx = stylex.props(stepperParts.heading, xstyle);
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
	const sx = stylex.props(
		textStyles.supporting,
		textTruncationStyles.truncate,
		stepperParts.description,
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
