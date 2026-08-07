import { type RefCallback, useCallback, useEffect, useRef, useState } from "react";

export type ScrollFadeAxis = "x" | "y";

export type UseScrollFadeOptions = {
	/** Which axis to gate the fade class on. Defaults to `"y"`. */
	axis?: ScrollFadeAxis;
	/**
	 * Remeasure when this identity changes (for example a controlled textarea
	 * value that updates without an `input` event).
	 */
	contentKey?: unknown;
};

export type UseScrollFadeReturn<ElementType extends HTMLElement> = {
	/** Fade utility class when the element overflows; `undefined` otherwise. */
	className: string | undefined;
	/** Whether the element currently overflows on the gated axis. */
	overflowing: boolean;
	ref: RefCallback<ElementType>;
};

const SCROLL_FADE_CLASS: Record<ScrollFadeAxis, string> = {
	x: "xyz-scroll-fade-x",
	y: "xyz-scroll-fade-y",
};

/** Subpixel layouts can report 1px of false overflow. */
const OVERFLOW_EPSILON_PX = 1;

function hasOverflow(element: HTMLElement, axis: ScrollFadeAxis): boolean {
	if (axis === "x") {
		return element.scrollWidth - element.clientWidth > OVERFLOW_EPSILON_PX;
	}
	return element.scrollHeight - element.clientHeight > OVERFLOW_EPSILON_PX;
}

/**
 * Gates `xyz-scroll-fade-*` on real overflow so scroll-timeline fill and the
 * static fallback do not leave edge masks when content fits (for example after
 * `field-sizing: content` expands a textarea on focus).
 */
export function useScrollFade<ElementType extends HTMLElement = HTMLElement>({
	axis = "y",
	contentKey,
}: UseScrollFadeOptions = {}): UseScrollFadeReturn<ElementType> {
	const [overflowing, setOverflowing] = useState(false);
	const elementRef = useRef<ElementType | null>(null);
	const frameRef = useRef<number | null>(null);
	const axisRef = useRef(axis);
	axisRef.current = axis;

	const scheduleMeasure = useCallback(() => {
		if (frameRef.current != null) return;
		frameRef.current = requestAnimationFrame(() => {
			frameRef.current = null;
			const element = elementRef.current;
			if (!element) {
				setOverflowing(false);
				return;
			}
			const next = hasOverflow(element, axisRef.current);
			setOverflowing((current) => (current === next ? current : next));
		});
	}, []);

	useEffect(() => {
		scheduleMeasure();
	}, [contentKey, scheduleMeasure]);

	const ref = useCallback<RefCallback<ElementType>>(
		(element) => {
			if (frameRef.current != null) {
				cancelAnimationFrame(frameRef.current);
				frameRef.current = null;
			}

			elementRef.current = element;
			if (!element) {
				setOverflowing(false);
				return;
			}

			const onMeasure = () => scheduleMeasure();
			element.addEventListener("scroll", onMeasure, { passive: true });
			element.addEventListener("input", onMeasure);
			element.addEventListener("focus", onMeasure);
			element.addEventListener("blur", onMeasure);

			const resizeObserver =
				typeof ResizeObserver === "undefined" ? null : new ResizeObserver(onMeasure);
			resizeObserver?.observe(element);
			onMeasure();

			return () => {
				element.removeEventListener("scroll", onMeasure);
				element.removeEventListener("input", onMeasure);
				element.removeEventListener("focus", onMeasure);
				element.removeEventListener("blur", onMeasure);
				resizeObserver?.disconnect();
				if (frameRef.current != null) {
					cancelAnimationFrame(frameRef.current);
					frameRef.current = null;
				}
			};
		},
		[scheduleMeasure],
	);

	return {
		className: overflowing ? SCROLL_FADE_CLASS[axis] : undefined,
		overflowing,
		ref,
	};
}
