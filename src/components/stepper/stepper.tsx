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
	type MouseEvent as ReactMouseEvent,
} from "react";
import { Button, type ButtonProps } from "@/components/button/button";
import { fontWeightStyles, textStyles } from "@/components/text/text.stylex";
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

type StepRecord = {
	disabled: boolean;
	node: HTMLElement | null;
	value: StepperValue;
};

type StepperChangeEventDetails = BaseTabs.Root.ChangeEventDetails;

type StepperRootContextValue = {
	effectiveOrientation: StepperOrientation;
	effectiveValue: StepperValue | null;
	goToAdjacent: (delta: -1 | 1, event: ReactMouseEvent<HTMLElement>) => void;
	orderedSteps: readonly StepRecord[];
	registerPanel: (value: StepperValue, node: HTMLElement) => () => void;
	registerStep: (record: StepRecord) => () => void;
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
const DOCUMENT_FOLLOWING = 4;
const DOCUMENT_PRECEDING = 2;

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
	const isControlled = valueProp !== undefined;
	const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
	const requestedValue = isControlled ? valueProp : uncontrolledValue;
	const isMdViewport = useIsMdViewport();
	const effectiveOrientation: StepperOrientation =
		orientation === "vertical" && isMdViewport ? "vertical" : "horizontal";
	const stepsRef = useRef(new Map<StepperValue, StepRecord>());
	const panelsRef = useRef(new Map<StepperValue, HTMLElement>());
	const pendingPanelFocusRef = useRef<StepperValue | null>(null);
	const [stepVersion, setStepVersion] = useState(0);
	const [focusRequest, setFocusRequest] = useState(0);
	const orderedSteps = useMemo(() => {
		void stepVersion;
		return sortStepRecords([...stepsRef.current.values()]);
	}, [stepVersion]);
	const effectiveValue = useMemo(() => {
		if (orderedSteps.length === 0) {
			return null;
		}
		if (requestedValue != null && orderedSteps.some((step) => step.value === requestedValue)) {
			return requestedValue;
		}
		return orderedSteps[0]?.value ?? null;
	}, [orderedSteps, requestedValue]);
	const publishSteps = useCallback(() => {
		setStepVersion((version) => version + 1);
	}, []);
	const registerStep = useCallback(
		(record: StepRecord) => {
			const existing = stepsRef.current.get(record.value);
			if (import.meta.env.DEV && existing != null && existing.node !== record.node) {
				console.error(`Stepper received duplicate step value "${record.value}".`);
			}
			stepsRef.current.set(record.value, record);
			publishSteps();
			return () => {
				const current = stepsRef.current.get(record.value);
				if (current?.node === record.node) {
					stepsRef.current.delete(record.value);
					publishSteps();
				}
			};
		},
		[publishSteps],
	);
	const registerPanel = useCallback((value: StepperValue, node: HTMLElement) => {
		panelsRef.current.set(value, node);
		return () => {
			if (panelsRef.current.get(value) === node) {
				panelsRef.current.delete(value);
			}
		};
	}, []);
	const handleValueChange = useCallback(
		(next: BaseTabs.Tab.Value, details: StepperChangeEventDetails) => {
			if (details.reason !== "none" || typeof next !== "string") {
				pendingPanelFocusRef.current = null;
				return;
			}
			onValueChange?.(next, details);
			if (details.isCanceled) {
				pendingPanelFocusRef.current = null;
				return;
			}
			if (!isControlled) {
				setUncontrolledValue(next);
			}
		},
		[isControlled, onValueChange],
	);
	const requestValue = useCallback(
		(next: StepperValue, event: Event, trigger?: Element) => {
			if (next === effectiveValue) {
				pendingPanelFocusRef.current = null;
				return;
			}
			handleValueChange(next, createCancelableChangeDetails(event, trigger));
		},
		[effectiveValue, handleValueChange],
	);
	const goToAdjacent = useCallback(
		(delta: -1 | 1, event: ReactMouseEvent<HTMLElement>) => {
			const currentIndex = orderedSteps.findIndex((step) => step.value === effectiveValue);
			const target = currentIndex < 0 ? undefined : orderedSteps[currentIndex + delta];
			if (target == null || target.disabled) {
				return;
			}
			pendingPanelFocusRef.current = target.value;
			requestValue(target.value, event.nativeEvent, event.currentTarget);
			setFocusRequest((request) => request + 1);
		},
		[effectiveValue, orderedSteps, requestValue],
	);

	useLayoutEffect(() => {
		const sorted = sortStepRecords([...stepsRef.current.values()]);
		const currentKey = orderedSteps.map((step) => step.value).join("\0");
		const nextKey = sorted.map((step) => step.value).join("\0");
		if (currentKey !== nextKey) {
			publishSteps();
		}
	});

	useLayoutEffect(() => {
		if (effectiveValue == null) {
			pendingPanelFocusRef.current = null;
			return;
		}
		const activeNode = stepsRef.current.get(effectiveValue)?.node;
		if (activeNode != null) {
			scrollStepIntoList(activeNode);
		}
		const pending = pendingPanelFocusRef.current;
		pendingPanelFocusRef.current = null;
		if (pending != null && pending === effectiveValue) {
			panelsRef.current.get(effectiveValue)?.focus();
		}
	}, [effectiveValue, focusRequest]);

	const contextValue = useMemo<StepperRootContextValue>(
		() => ({
			effectiveOrientation,
			effectiveValue,
			goToAdjacent,
			orderedSteps,
			registerPanel,
			registerStep,
		}),
		[effectiveOrientation, effectiveValue, goToAdjacent, orderedSteps, registerPanel, registerStep],
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
			/>
		</StepperRootContext>
	);
}

export type StepperListProps = Omit<BaseTabs.List.Props, "activateOnFocus" | "className" | "loopFocus" | "style"> &
	StepperPartStyleProps;

export function List({ className, style, xstyle, ...props }: StepperListProps) {
	const { effectiveOrientation } = useStepperRootContext();
	const sx = stylex.props(
		stepperParts.list,
		listOrientationStyles[effectiveOrientation],
		xstyle,
	);

	return (
		<BaseTabs.List
			activateOnFocus={false}
			className={attrJoin(sx.className, className)}
			data-stepper-list=""
			loopFocus={false}
			style={mergeStyle(sx.style, style)}
			{...props}
			aria-orientation={effectiveOrientation}
		/>
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
	...props
}: StepperStepProps) {
	const { effectiveOrientation, effectiveValue, orderedSteps, registerStep } = useStepperRootContext();
	const instanceId = useId();
	const titleId = `${instanceId}-title`;
	const descriptionId = `${instanceId}-description`;
	const statusId = `${instanceId}-status`;
	const stepRef = useRef<HTMLElement | null>(null);
	const mergedRef = useMergedRefs(ref, stepRef);
	const index = orderedSteps.findIndex((step) => step.value === value);
	const selected = effectiveValue === value;
	const isLast = index >= 0 && index === orderedSteps.length - 1;
	const currentIndex = orderedSteps.findIndex((step) => step.value === effectiveValue);
	const connector = isLast || index < 0 ? undefined : index < currentIndex ? "filled" : "track";
	const statusLabel = getStatusLabel(status);
	const [hasDescription, setHasDescription] = useState(false);
	const registerDescription = useCallback(() => {
		setHasDescription(true);
		return () => setHasDescription(false);
	}, []);
	const describedBy = attrJoin(hasDescription ? descriptionId : undefined, statusLabel ? statusId : undefined);

	useLayoutEffect(() => {
		return registerStep({ disabled, node: stepRef.current, value });
	}, [disabled, registerStep, value]);

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
	const sx = stylex.props(
		focusRing.offset,
		stepperParts.step,
		stepOrientationStyles[effectiveOrientation],
		connector != null && stepBreathingStyles[effectiveOrientation],
		connector === "filled" && stepperParts.connectorFilled,
		effectiveOrientation === "horizontal" && connector != null && stepperParts.connectorHorizontal,
		effectiveOrientation === "vertical" && connector != null && stepperParts.connectorVertical,
		xstyle,
	);

	return (
		<StepperStepContext value={stepContext}>
			<BaseTabs.Tab
				ref={mergedRef}
				aria-describedby={describedBy || undefined}
				aria-labelledby={titleId}
				className={attrJoin(sx.className, className)}
				data-status={status}
				data-stepper-connector={connector}
				disabled={disabled}
				style={mergeStyle(sx.style, style)}
				type={type}
				value={value}
				{...props}>
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
		selected && status === "incomplete" && markerToneStyles.currentIncomplete,
		selected && markerToneStyles.current,
		disabled && markerToneStyles.disabled,
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
		stepperParts.title,
		selected && titleStateStyles.selected,
		disabled && titleStateStyles.disabled,
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

export type StepperPanelProps = Omit<BaseTabs.Panel.Props, "className" | "style"> & StepperPartStyleProps;

export function Panel({
	ref,
	className,
	keepMounted = true,
	style,
	value,
	xstyle,
	...props
}: StepperPanelProps) {
	const { registerPanel } = useStepperRootContext();
	const panelRef = useRef<HTMLDivElement | null>(null);
	const mergedRef = useMergedRefs(ref, panelRef);
	const sx = stylex.props(stepperParts.panel, focusRing.inset, xstyle);

	useLayoutEffect(() => {
		const node = panelRef.current;
		if (node == null) {
			return;
		}
		return registerPanel(String(value), node);
	}, [registerPanel, value]);

	return (
		<BaseTabs.Panel
			ref={mergedRef}
			className={attrJoin(sx.className, className)}
			keepMounted={keepMounted}
			style={mergeStyle(sx.style, style)}
			value={value}
			{...props}
		/>
	);
}

export function Previous({
	disabled,
	onClick,
	variant = "secondary",
	...props
}: ButtonProps) {
	const { effectiveValue, goToAdjacent, orderedSteps } = useStepperRootContext();
	const currentIndex = orderedSteps.findIndex((step) => step.value === effectiveValue);
	const previous = currentIndex < 0 ? undefined : orderedSteps[currentIndex - 1];
	const adjacencyDisabled = previous == null || previous.disabled;

	return (
		<Button
			disabled={Boolean(disabled) || adjacencyDisabled}
			onClick={(event) => {
				onClick?.(event);
				if (event.defaultPrevented) {
					return;
				}
				goToAdjacent(-1, event);
			}}
			variant={variant}
			{...props}
		/>
	);
}

export function Next({ disabled, onClick, variant = "primary", ...props }: ButtonProps) {
	const { effectiveValue, goToAdjacent, orderedSteps } = useStepperRootContext();
	const currentIndex = orderedSteps.findIndex((step) => step.value === effectiveValue);
	const next = currentIndex < 0 ? undefined : orderedSteps[currentIndex + 1];
	const adjacencyDisabled = next == null || next.disabled;

	return (
		<Button
			disabled={Boolean(disabled) || adjacencyDisabled}
			onClick={(event) => {
				onClick?.(event);
				if (event.defaultPrevented) {
					return;
				}
				goToAdjacent(1, event);
			}}
			variant={variant}
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

function prefersReducedMotion() {
	return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function scrollStepIntoList(step: HTMLElement) {
	const list = step.closest("[data-stepper-list]");
	if (!(list instanceof HTMLElement)) {
		return;
	}
	const listRect = list.getBoundingClientRect();
	const stepRect = step.getBoundingClientRect();
	let deltaInline = 0;
	let deltaBlock = 0;
	if (stepRect.left < listRect.left) {
		deltaInline = stepRect.left - listRect.left;
	} else if (stepRect.right > listRect.right) {
		deltaInline = stepRect.right - listRect.right;
	}
	if (stepRect.top < listRect.top) {
		deltaBlock = stepRect.top - listRect.top;
	} else if (stepRect.bottom > listRect.bottom) {
		deltaBlock = stepRect.bottom - listRect.bottom;
	}
	if (deltaInline === 0 && deltaBlock === 0) {
		return;
	}
	list.scrollBy({
		behavior: prefersReducedMotion() ? "auto" : "smooth",
		left: deltaInline,
		top: deltaBlock,
	});
}

function sortStepRecords(records: StepRecord[]) {
	return [...records].sort((left, right) => {
		if (left.node == null || right.node == null || left.node === right.node) {
			return 0;
		}
		const position = left.node.compareDocumentPosition(right.node);
		if (position & DOCUMENT_FOLLOWING) {
			return -1;
		}
		if (position & DOCUMENT_PRECEDING) {
			return 1;
		}
		return 0;
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
		"--_stepper-connector-fill": tokens["--fill-track"],
		"--_stepper-connector-thickness": "0.125rem",
		"--_stepper-marker-size": tokens["--size-control-md"],
		boxSizing: "border-box",
		display: "grid",
		minWidth: 0,
		width: "100%",
	},
	list: {
		gap: 0,
		paddingBlock: tokens["--space-2"],
		paddingInline: tokens["--space-2"],
		boxSizing: "border-box",
		display: "flex",
		isolation: "isolate",
		minWidth: 0,
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
		isolation: "isolate",
		position: "relative",
		textAlign: "start",
		userSelect: "none",
	},
	connectorFilled: {
		"--_stepper-connector-fill": tokens["--fill-accent"],
	},
	connectorHorizontal: {
		"::after": {
			borderRadius: tokens["--radius-full"],
			backgroundColor: "var(--_stepper-connector-fill)",
			content: '""',
			insetBlockStart: "calc(var(--_stepper-marker-size) / 2 - var(--_stepper-connector-thickness) / 2)",
			insetInlineStart: "calc(var(--_stepper-marker-size) / 2)",
			pointerEvents: "none",
			position: "absolute",
			transitionDuration: {
				default: tokens["--motion-duration-medium"],
				[media.reducedMotion]: "0ms",
			},
			transitionProperty: "background-color",
			transitionTimingFunction: tokens["--motion-ease-smooth-out"],
			zIndex: -1,
			height: "var(--_stepper-connector-thickness)",
			width: "100%",
		},
	},
	connectorVertical: {
		"::after": {
			borderRadius: tokens["--radius-full"],
			backgroundColor: "var(--_stepper-connector-fill)",
			content: '""',
			insetBlockStart: "calc(var(--_stepper-marker-size) / 2)",
			insetInlineStart: "calc(var(--_stepper-marker-size) / 2 - var(--_stepper-connector-thickness) / 2)",
			pointerEvents: "none",
			position: "absolute",
			transitionDuration: {
				default: tokens["--motion-duration-medium"],
				[media.reducedMotion]: "0ms",
			},
			transitionProperty: "background-color",
			transitionTimingFunction: tokens["--motion-ease-smooth-out"],
			zIndex: -1,
			height: "100%",
			width: "var(--_stepper-connector-thickness)",
		},
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
		overflowWrap: "anywhere",
	},
	description: {
		color: tokens["--fg-subtle"],
		overflowWrap: "anywhere",
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
		gridTemplateColumns: "minmax(12rem, max-content) minmax(0, 1fr)",
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
		overflowX: "auto",
		overflowY: "hidden",
	},
	vertical: {
		gridColumn: "1",
		alignItems: "stretch",
		alignSelf: "stretch",
		flexDirection: "column",
		gridRowEnd: "-1",
		gridRowStart: "1",
		minWidth: "12rem",
		overflowX: "hidden",
		overflowY: "auto",
	},
});

const stepOrientationStyles = stylex.create({
	horizontal: {
		flexBasis: "8rem",
		flexGrow: 1,
		flexShrink: 0,
		gridTemplateColumns: "minmax(0, 1fr)",
		justifyItems: "start",
		minWidth: "8rem",
	},
	vertical: {
		alignItems: "start",
		gridTemplateColumns: "var(--_stepper-marker-size) minmax(0, 1fr)",
		width: "100%",
	},
});

const stepBreathingStyles = stylex.create({
	horizontal: {
		paddingInlineEnd: tokens["--space-6"],
	},
	vertical: {
		paddingBlockEnd: tokens["--space-6"],
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
