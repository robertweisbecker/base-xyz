import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { useMergedRefs } from "@base-ui/utils/useMergedRefs";
import * as stylex from "@stylexjs/stylex";
import {
	createContext,
	useCallback,
	useContext,
	useId,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
	useSyncExternalStore,
	type ComponentPropsWithRef,
} from "react";
import { Button, type ButtonProps } from "@/components/button/button";
import { fontWeightStyles, textStyles, textTruncationStyles } from "@/components/text/text.stylex";
import { VisuallyHidden } from "@/components/visually-hidden/visually-hidden";
import { media } from "@/styles/constants.stylex";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { extractMarginProps, type MarginProps } from "@/styles/props/spacing.stylex";
import { focusRing } from "@/styles/recipes/focus";
import { tokens } from "@/theme/tokens.stylex";
import { attrJoin } from "@/utils/attr-join";

export type StepperOrientation = "horizontal" | "vertical";
export type StepperStatus = "incomplete" | "completed" | "invalid";
export type StepperValue = string;

type StepperSelectionProps =
	| { value: StepperValue; defaultValue?: never }
	| { value?: never; defaultValue: StepperValue };

type StepperPartStyleProps = BaseStyleProps & {
	className?: string;
};

type DeclaredStep = {
	disabled: boolean;
	id: string;
	value: StepperValue;
};

type StepperChangeEventDetails = BaseTabs.Root.ChangeEventDetails;

type StepperRootContextValue = {
	commitValue: (next: StepperValue, details: StepperChangeEventDetails) => void;
	declaredSteps: readonly DeclaredStep[];
	effectiveOrientation: StepperOrientation;
	effectiveValue: StepperValue | null;
	queuePanelFocus: (value: StepperValue | null) => void;
	registerStep: (record: DeclaredStep) => () => void;
};

type StepperStepContextValue = {
	descriptionId: string;
	disabled: boolean;
	index: number;
	orientation: StepperOrientation;
	registerDescription: () => () => void;
	selected: boolean;
	status: StepperStatus;
	statusId: string;
	titleId: string;
};

const StepperRootContext = createContext<StepperRootContextValue | null>(null);
const StepperStepContext = createContext<StepperStepContextValue | null>(null);

/** Matches `breakpoints.md` (`@media (min-width: 48rem)`). */
const MD_MEDIA_QUERY = "(min-width: 48rem)";

export type StepperRootProps = Omit<
	BaseTabs.Root.Props,
	"className" | "defaultValue" | "onValueChange" | "style" | "value" | keyof MarginProps
> &
	MarginProps &
	BaseStyleProps &
	StepperSelectionProps & {
		className?: string;
		onValueChange?: (value: StepperValue, eventDetails: StepperChangeEventDetails) => void;
		orientation?: StepperOrientation;
	};

export function Root({
	ref,
	className,
	defaultValue,
	onValueChange,
	orientation = "horizontal",
	style,
	value: valueProp,
	xstyle,
	...props
}: StepperRootProps) {
	const { marginStyles, rest } = extractMarginProps(props);
	const rootRef = useRef<HTMLDivElement | null>(null);
	const mergedRef = useMergedRefs(ref, rootRef);
	const isControlled = valueProp !== undefined;
	const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
	const [declaredSteps, setDeclaredSteps] = useState<readonly DeclaredStep[]>([]);
	const [pendingFocusValue, setPendingFocusValue] = useState<StepperValue | null>(null);
	const registeredStepsRef = useRef<DeclaredStep[]>([]);
	const requestedValue = isControlled ? valueProp : uncontrolledValue;
	const isMdViewport = useIsMdViewport();
	const effectiveOrientation: StepperOrientation =
		orientation === "vertical" && isMdViewport ? "vertical" : "horizontal";
	const effectiveValue =
		requestedValue != null &&
		(declaredSteps.length === 0 || declaredSteps.some((step) => step.value === requestedValue))
			? requestedValue
			: (declaredSteps[0]?.value ?? requestedValue ?? null);
	const commitValue = useCallback(
		(next: StepperValue, details: StepperChangeEventDetails) => {
			onValueChange?.(next, details);
			if (details.isCanceled) {
				return;
			}
			if (!isControlled) {
				setUncontrolledValue(next);
			}
		},
		[isControlled, onValueChange],
	);
	const handleValueChange = useCallback(
		(next: BaseTabs.Tab.Value, details: StepperChangeEventDetails) => {
			if (details.reason !== "none" || typeof next !== "string") {
				return;
			}
			commitValue(next, details);
		},
		[commitValue],
	);
	const publishDeclaredSteps = useCallback(() => {
		const next = registeredStepsRef.current;
		setDeclaredSteps((current) => (sameDeclaredSteps(current, next) ? current : next));
	}, []);
	const registerStep = useCallback(
		(record: DeclaredStep) => {
			registeredStepsRef.current = upsertDeclaredStep(registeredStepsRef.current, record);
			warnDuplicateStepValues(registeredStepsRef.current);
			publishDeclaredSteps();
			return () => {
				registeredStepsRef.current = registeredStepsRef.current.filter((step) => step.id !== record.id);
				publishDeclaredSteps();
			};
		},
		[publishDeclaredSteps],
	);
	const queuePanelFocus = useCallback((value: StepperValue | null) => {
		setPendingFocusValue(value);
	}, []);

	useLayoutEffect(() => {
		if (pendingFocusValue == null) {
			return;
		}
		const shouldFocus = pendingFocusValue === effectiveValue;
		setPendingFocusValue(null);
		if (!shouldFocus) {
			return;
		}
		const panelId = rootRef.current
			?.querySelector("[role='tab'][aria-selected='true']")
			?.getAttribute("aria-controls");
		if (panelId) {
			document.getElementById(panelId)?.focus();
		}
	}, [effectiveValue, pendingFocusValue]);

	const contextValue = useMemo<StepperRootContextValue>(
		() => ({
			commitValue,
			declaredSteps,
			effectiveOrientation,
			effectiveValue,
			queuePanelFocus,
			registerStep,
		}),
		[commitValue, declaredSteps, effectiveOrientation, effectiveValue, queuePanelFocus, registerStep],
	);
	const sx = stylex.props(
		stepperParts.root,
		rootOrientationStyles[effectiveOrientation],
		marginStyles,
		xstyle,
	);

	return (
		<StepperRootContext value={contextValue}>
			<BaseTabs.Root
				className={attrJoin(sx.className, className)}
				onValueChange={handleValueChange}
				orientation={effectiveOrientation}
				style={mergeStyle(sx.style, style)}
				value={effectiveValue}
				{...rest}
				ref={mergedRef}
			/>
		</StepperRootContext>
	);
}

export type StepperListProps = Omit<
	BaseTabs.List.Props,
	"activateOnFocus" | "className" | "loopFocus" | "render" | "style"
> &
	StepperPartStyleProps;

export function List({ ref, children, className, style, xstyle, ...props }: StepperListProps) {
	const { effectiveOrientation } = useStepperRootContext();
	const sx = stylex.props(
		stepperParts.list,
		listOrientationStyles[effectiveOrientation],
		xstyle,
	);
	const indicatorSx = stylex.props(
		stepperParts.indicator,
		indicatorOrientationStyles[effectiveOrientation],
	);

	return (
		<BaseTabs.List
			activateOnFocus={false}
			className={attrJoin(sx.className, className)}
			loopFocus={false}
			style={mergeStyle(sx.style, style)}
			{...props}
			ref={ref}>
			{children}
			<BaseTabs.Indicator
				className={indicatorSx.className}
				data-stepper-indicator=""
				style={indicatorSx.style}
			/>
		</BaseTabs.List>
	);
}

export type StepperStepProps = Omit<BaseTabs.Tab.Props, "className" | "style" | "value"> &
	StepperPartStyleProps & {
		status?: StepperStatus;
		value: StepperValue;
	};

export function Step({
	ref,
	children,
	className,
	disabled = false,
	status = "incomplete",
	style,
	type = "button",
	value,
	xstyle,
	"aria-describedby": ariaDescribedBy,
	...props
}: StepperStepProps) {
	const { declaredSteps, effectiveOrientation, effectiveValue, registerStep } = useStepperRootContext();
	const instanceId = useId();
	const titleId = `${instanceId}-title`;
	const descriptionId = `${instanceId}-description`;
	const statusId = `${instanceId}-status`;
	const index = declaredSteps.findIndex((step) => step.value === value);
	const selected = effectiveValue === value;
	const statusLabel = getStatusLabel(status);
	const [hasDescription, setHasDescription] = useState(false);
	const registerDescription = useCallback(() => {
		setHasDescription(true);
		return () => setHasDescription(false);
	}, []);
	const describedBy = attrJoin(
		ariaDescribedBy,
		hasDescription ? descriptionId : undefined,
		statusLabel ? statusId : undefined,
	);

	const stepContext = useMemo<StepperStepContextValue>(
		() => ({
			descriptionId,
			disabled,
			index,
			orientation: effectiveOrientation,
			registerDescription,
			selected,
			status,
			statusId,
			titleId,
		}),
		[descriptionId, disabled, effectiveOrientation, index, registerDescription, selected, status, statusId, titleId],
	);

	useLayoutEffect(() => registerStep({ disabled, id: instanceId, value }), [disabled, instanceId, registerStep, value]);

	const sx = stylex.props(
		focusRing.offset,
		stepperParts.step,
		stepOrientationStyles[effectiveOrientation],
		stepBreathingStyles[effectiveOrientation],
		effectiveOrientation === "horizontal" && stepperParts.connectorHorizontal,
		effectiveOrientation === "vertical" && stepperParts.connectorVertical,
		xstyle,
	);

	return (
		<StepperStepContext value={stepContext}>
			<BaseTabs.Tab
				ref={ref}
				aria-labelledby={titleId}
				className={attrJoin(sx.className, className)}
				data-status={status}
				disabled={disabled}
				style={mergeStyle(sx.style, style)}
				type={type}
				value={value}
				{...props}
				aria-describedby={describedBy || undefined}>
				{children}
				{statusLabel ? (
					<VisuallyHidden id={statusId}>{statusLabel}</VisuallyHidden>
				) : null}
			</BaseTabs.Tab>
		</StepperStepContext>
	);
}

export type StepperMarkerProps = Omit<ComponentPropsWithRef<"span">, "className" | "style"> & StepperPartStyleProps;

export function Marker({ children, className, style, xstyle, ...props }: StepperMarkerProps) {
	const { disabled, index, selected, status } = useStepperStepContext();
	const sx = stylex.props(
		stepperParts.marker,
		fontWeightStyles.medium,
		status === "completed" && markerToneStyles.completed,
		status === "invalid" && markerToneStyles.invalid,
		selected && status === "incomplete" && !disabled && markerToneStyles.currentIncomplete,
		disabled && markerToneStyles.disabled,
		selected && markerToneStyles.current,
		xstyle,
	);
	const content = children == null || typeof children === "boolean" ? (index >= 0 ? index + 1 : null) : children;

	return (
		<span
			{...props}
			aria-hidden
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}>
			{content}
		</span>
	);
}

export type StepperHeadingProps = Omit<ComponentPropsWithRef<"span">, "className" | "style"> & StepperPartStyleProps;

export function Heading({ className, style, xstyle, ...props }: StepperHeadingProps) {
	const { orientation } = useStepperStepContext();
	const sx = stylex.props(stepperParts.heading, headingOrientationStyles[orientation], xstyle);

	return (
		<span
			{...props}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
		/>
	);
}

export type StepperTitleProps = Omit<ComponentPropsWithRef<"span">, "className" | "style"> & StepperPartStyleProps;

export function Title({ className, style, xstyle, ...props }: StepperTitleProps) {
	const { disabled, selected, titleId } = useStepperStepContext();
	const sx = stylex.props(
		textStyles.label,
		fontWeightStyles.medium,
		textTruncationStyles.truncate,
		stepperParts.title,
		selected && titleStateStyles.selected,
		disabled && !selected && titleStateStyles.disabled,
		xstyle,
	);

	return (
		<span
			{...props}
			className={attrJoin(sx.className, className)}
			id={titleId}
			style={mergeStyle(sx.style, style)}
		/>
	);
}

export type StepperDescriptionProps = Omit<ComponentPropsWithRef<"span">, "className" | "style"> &
	StepperPartStyleProps;

export function Description({ className, style, xstyle, ...props }: StepperDescriptionProps) {
	const { descriptionId, disabled, registerDescription } = useStepperStepContext();
	const sx = stylex.props(
		textStyles.supporting,
		textTruncationStyles.truncate,
		stepperParts.description,
		disabled && descriptionStateStyles.disabled,
		xstyle,
	);

	useLayoutEffect(() => registerDescription(), [registerDescription]);

	return (
		<span
			{...props}
			className={attrJoin(sx.className, className)}
			id={descriptionId}
			style={mergeStyle(sx.style, style)}
		/>
	);
}

export type StepperContentProps = Omit<ComponentPropsWithRef<"div">, "className" | "style"> & StepperPartStyleProps;

export function Content({ className, style, xstyle, ...props }: StepperContentProps) {
	const { effectiveOrientation } = useStepperRootContext();
	const sx = stylex.props(stepperParts.content, contentOrientationStyles[effectiveOrientation], xstyle);

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

export function Panel({
	ref,
	className,
	keepMounted = true,
	style,
	value,
	xstyle,
	...props
}: StepperPanelProps) {
	const sx = stylex.props(stepperParts.panel, focusRing.inset, xstyle);

	return (
		<BaseTabs.Panel
			ref={ref}
			className={attrJoin(sx.className, className)}
			keepMounted={keepMounted}
			style={mergeStyle(sx.style, style)}
			value={value}
			{...props}
		/>
	);
}

export function Previous({ disabled, onClick, variant = "secondary", ...props }: ButtonProps) {
	return <AdjacentButton delta={-1} disabled={disabled} onClick={onClick} variant={variant} {...props} />;
}

export function Next({ disabled, onClick, variant = "primary", ...props }: ButtonProps) {
	return <AdjacentButton delta={1} disabled={disabled} onClick={onClick} variant={variant} {...props} />;
}

function AdjacentButton({
	delta,
	disabled,
	onClick,
	...props
}: ButtonProps & { delta: -1 | 1 }) {
	const { commitValue, declaredSteps, effectiveValue, queuePanelFocus } = useStepperRootContext();
	const currentIndex = declaredSteps.findIndex((step) => step.value === effectiveValue);
	const target = currentIndex < 0 ? undefined : declaredSteps[currentIndex + delta];
	const adjacencyDisabled = target == null || target.disabled;

	return (
		<Button
			disabled={Boolean(disabled) || adjacencyDisabled}
			onClick={(event) => {
				onClick?.(event);
				if (event.defaultPrevented || target == null || target.disabled) {
					return;
				}
				const details = createCancelableChangeDetails(event.nativeEvent, event.currentTarget);
				commitValue(target.value, details);
				queuePanelFocus(details.isCanceled ? null : target.value);
			}}
			{...props}
		/>
	);
}

function useStepperRootContext() {
	const context = useContext(StepperRootContext);
	if (context === null) {
		throw new Error("Stepper parts must be rendered inside Stepper.Root.");
	}
	return context;
}

function useStepperStepContext() {
	const context = useContext(StepperStepContext);
	if (context === null) {
		throw new Error("Stepper marker and text parts must be rendered inside Stepper.Step.");
	}
	return context;
}

function useIsMdViewport() {
	return useSyncExternalStore(subscribeToMdViewport, getMdViewport, getServerMdViewport);
}

function subscribeToMdViewport(onStoreChange: () => void) {
	if (typeof window === "undefined") {
		return () => {};
	}
	const mediaQuery = window.matchMedia(MD_MEDIA_QUERY);
	mediaQuery.addEventListener("change", onStoreChange);
	return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function getMdViewport() {
	return typeof window !== "undefined" && window.matchMedia(MD_MEDIA_QUERY).matches;
}

function getServerMdViewport() {
	return false;
}

function upsertDeclaredStep(steps: readonly DeclaredStep[], record: DeclaredStep) {
	const index = steps.findIndex((step) => step.id === record.id);
	if (index === -1) {
		return [...steps, record];
	}
	return steps.map((step, stepIndex) => (stepIndex === index ? record : step));
}

function warnDuplicateStepValues(steps: readonly DeclaredStep[]) {
	if (!import.meta.env.DEV) {
		return;
	}
	const seen = new Set<string>();
	for (const step of steps) {
		if (seen.has(step.value)) {
			console.error(`Stepper received duplicate step value "${step.value}".`);
		}
		seen.add(step.value);
	}
}

function sameDeclaredSteps(current: readonly DeclaredStep[], next: readonly DeclaredStep[]) {
	if (current.length !== next.length) {
		return false;
	}
	return current.every((step, index) => {
		const other = next[index];
		return other != null && step.value === other.value && step.disabled === other.disabled;
	});
}

function getStatusLabel(status: StepperStatus) {
	switch (status) {
		case "incomplete":
			return null;
		case "completed":
			return "Completed";
		case "invalid":
			return "Invalid";
		default: {
			const exhaustive: never = status;
			return exhaustive;
		}
	}
}

function createCancelableChangeDetails(event: Event, trigger?: Element): StepperChangeEventDetails {
	const details = {
		activationDirection: "none" as const,
		allowPropagation() {
			details.isPropagationAllowed = true;
		},
		cancel() {
			details.isCanceled = true;
		},
		event,
		isCanceled: false,
		isPropagationAllowed: false,
		reason: "none" as const,
		trigger,
	};
	return details;
}

const stepperParts = stylex.create({
	root: {
		"--_stepper-connector-thickness": "0.125rem",
		"--_stepper-marker-size": tokens["--size-control-md"],
		boxSizing: "border-box",
		display: "grid",
		minWidth: 0,
		width: "100%",
	},
	list: {
		"--_stepper-list-padding": tokens["--space-2"],
		gap: 0,
		paddingBlock: "var(--_stepper-list-padding)",
		paddingInline: "var(--_stepper-list-padding)",
		boxSizing: "border-box",
		display: "flex",
		isolation: "isolate",
		position: "relative",
		minWidth: 0,
		width: "100%",
	},
	step: {
		margin: 0,
		padding: 0,
		borderStyle: "none",
		gap: tokens["--space-2"],
		appearance: "none",
		backgroundColor: "transparent",
		boxSizing: "border-box",
		color: tokens["--fg-muted"],
		cursor: "default",
		display: "grid",
		fontFamily: "inherit",
		opacity: {
			"[data-disabled]": 0.48,
			default: 1,
		},
		pointerEvents: {
			"[data-disabled]": "none",
			default: "auto",
		},
		position: "relative",
		textAlign: "start",
		userSelect: "none",
		zIndex: 1,
	},
	connectorHorizontal: {
		"::after": {
			borderRadius: tokens["--radius-full"],
			backgroundColor: tokens["--fill-track"],
			content: '""',
			display: {
				default: "block",
				":last-of-type": "none",
			},
			insetBlockStart: "calc(var(--_stepper-marker-size) / 2 - var(--_stepper-connector-thickness) / 2)",
			insetInlineStart: "calc(var(--_stepper-marker-size) / 2)",
			pointerEvents: "none",
			position: "absolute",
			zIndex: 0,
			height: "var(--_stepper-connector-thickness)",
			width: "100%",
		},
	},
	connectorVertical: {
		"::after": {
			borderRadius: tokens["--radius-full"],
			backgroundColor: tokens["--fill-track"],
			content: '""',
			display: {
				default: "block",
				":last-of-type": "none",
			},
			insetBlockStart: "calc(var(--_stepper-marker-size) / 2)",
			insetInlineStart: "calc(var(--_stepper-marker-size) / 2 - var(--_stepper-connector-thickness) / 2)",
			pointerEvents: "none",
			position: "absolute",
			zIndex: 0,
			height: "100%",
			width: "var(--_stepper-connector-thickness)",
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
		zIndex: 0,
	},
	marker: {
		borderColor: tokens["--border-strong"],
		borderRadius: tokens["--radius-full"],
		borderStyle: "solid",
		borderWidth: tokens["--border-width"],
		flex: "none",
		alignItems: "center",
		backgroundColor: tokens["--canvas"],
		boxSizing: "border-box",
		color: tokens["--fg-muted"],
		display: "inline-flex",
		fontSize: tokens["--font-size-2"],
		fontVariantNumeric: "tabular-nums",
		justifyContent: "center",
		letterSpacing: tokens["--letter-spacing-2"],
		lineHeight: tokens["--line-height-2"],
		position: "relative",
		transitionDuration: tokens["--motion-duration-medium"],
		transitionProperty: "background-color, background-image, border-color, box-shadow, color",
		transitionTimingFunction: tokens["--motion-ease-smooth-out"],
		zIndex: 1,
		height: "var(--_stepper-marker-size)",
		width: "var(--_stepper-marker-size)",
	},
	heading: {
		gap: tokens["--space-0-5"],
		display: "flex",
		flexDirection: "column",
		position: "relative",
		zIndex: 1,
		minWidth: 0,
	},
	title: {
		color: {
			default: tokens["--fg-muted"],
			":hover": {
				[media.canHover]: tokens["--fg"],
			},
		},
		minWidth: 0,
	},
	description: {
		color: tokens["--fg-subtle"],
		minWidth: 0,
	},
	content: {
		display: "grid",
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
		alignItems: "stretch",
		gridTemplateColumns: "minmax(0, 1fr)",
		rowGap: tokens["--space-3"],
	},
	vertical: {
		alignItems: "start",
		columnGap: tokens["--space-6"],
		gridTemplateColumns: "minmax(12rem, min(max-content, 24rem)) minmax(0, 1fr)",
		gridTemplateRows: "auto auto",
		rowGap: tokens["--space-4"],
	},
});

const listOrientationStyles = stylex.create({
	horizontal: {
		gridColumn: "1",
		alignItems: "flex-start",
		alignSelf: "stretch",
		flexDirection: "row",
		flexWrap: "nowrap",
		minWidth: 0,
	},
	vertical: {
		gridColumn: "1",
		alignItems: "stretch",
		alignSelf: "stretch",
		flexDirection: "column",
		gridRowEnd: "-1",
		gridRowStart: "1",
		maxWidth: "24rem",
		minHeight: 0,
		minWidth: 0,
	},
});

const indicatorOrientationStyles = stylex.create({
	horizontal: {
		height: "var(--_stepper-connector-thickness)",
		left: "calc(var(--_stepper-list-padding) + var(--_stepper-marker-size) / 2)",
		top: "calc(var(--active-tab-top) + var(--_stepper-marker-size) / 2 - var(--_stepper-connector-thickness) / 2)",
		width: "calc(var(--active-tab-left) - var(--_stepper-list-padding))",
	},
	vertical: {
		height: "calc(var(--active-tab-top) - var(--_stepper-list-padding))",
		insetInlineStart: "calc(var(--active-tab-left) + var(--_stepper-marker-size) / 2 - var(--_stepper-connector-thickness) / 2)",
		top: "calc(var(--_stepper-list-padding) + var(--_stepper-marker-size) / 2)",
		width: "var(--_stepper-connector-thickness)",
	},
});

const stepOrientationStyles = stylex.create({
	horizontal: {
		flexBasis: 0,
		flexGrow: 1,
		flexShrink: 1,
		gridTemplateColumns: "minmax(0, 1fr)",
		justifyItems: "start",
		minWidth: 0,
	},
	vertical: {
		alignItems: "start",
		gridTemplateColumns: "var(--_stepper-marker-size) minmax(0, 1fr)",
		minWidth: 0,
		width: "100%",
	},
});

const stepBreathingStyles = stylex.create({
	horizontal: {
		paddingInlineEnd: {
			default: tokens["--space-6"],
			":last-of-type": 0,
		},
	},
	vertical: {
		paddingBlockEnd: {
			default: tokens["--space-6"],
			":last-of-type": 0,
		},
	},
});

const headingOrientationStyles = stylex.create({
	horizontal: {
		gridColumn: "1",
		paddingInlineEnd: tokens["--space-1"],
		width: "100%",
	},
	vertical: {
		gridColumn: "2",
		paddingBlockStart: tokens["--space-0-5"],
		minWidth: 0,
	},
});

const contentOrientationStyles = stylex.create({
	horizontal: {
		gridColumn: "1",
		minWidth: 0,
	},
	vertical: {
		gridColumn: "2",
		minWidth: 0,
	},
});

const markerToneStyles = stylex.create({
	completed: {
		borderColor: tokens["--bg-success-primary"],
		backgroundImage: `linear-gradient(${tokens["--bg-success-primary"]}, ${tokens["--bg-success-primary"]})`,
		color: tokens["--fg-success-contrast"],
	},
	invalid: {
		borderColor: tokens["--bg-error-primary"],
		backgroundImage: `linear-gradient(${tokens["--bg-error-primary"]}, ${tokens["--bg-error-primary"]})`,
		color: tokens["--fg-error-contrast"],
	},
	currentIncomplete: {
		borderColor: tokens["--bg-primary"],
		backgroundImage: `linear-gradient(${tokens["--bg-primary"]}, ${tokens["--bg-primary"]})`,
		color: tokens["--fg-accent-contrast"],
	},
	current: {
		boxShadow: `0 0 0 2px ${tokens["--canvas"]}, 0 0 0 4px ${tokens["--fill-accent"]}`,
	},
	disabled: {
		borderColor: tokens["--border-disabled"],
		backgroundColor: tokens["--surface"],
		backgroundImage: "none",
		boxShadow: "none",
		color: tokens["--fg-disabled"],
	},
});

const titleStateStyles = stylex.create({
	selected: {
		color: tokens["--fg"],
	},
	disabled: {
		color: tokens["--fg-subtle"],
	},
});

const descriptionStateStyles = stylex.create({
	disabled: {
		color: tokens["--fg-subtle"],
	},
});

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
	Previous,
	Next,
} as const;
