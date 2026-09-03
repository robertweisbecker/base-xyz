import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export type TextareaAutoResizeOptions = {
	enabled: boolean;
	rows: number;
	minRows?: number;
	maxRows?: number;
};

export type TextareaAutoResizeReturn = {
	minRows: number;
	maxRows: number | undefined;
	ref: (element: HTMLTextAreaElement | null) => void;
	resize: () => void;
};

function normalizeRows(value: number | undefined, fallback: number): number {
	return typeof value === "number" && Number.isFinite(value) && value > 0
		? Math.max(1, Math.round(value))
		: fallback;
}

function parsePixels(value: string): number {
	const parsed = Number.parseFloat(value);
	return Number.isFinite(parsed) ? parsed : 0;
}

/** Grow a textarea while preserving a row-based minimum and optional maximum. */
export function useTextareaAutoResize({
	enabled,
	rows,
	minRows: minRowsProp,
	maxRows: maxRowsProp,
}: TextareaAutoResizeOptions): TextareaAutoResizeReturn {
	const minRows = normalizeRows(minRowsProp, normalizeRows(rows, 1));
	const maxRowsValue = normalizeRows(maxRowsProp, 0);
	const maxRows = maxRowsValue > 0 ? Math.max(maxRowsValue, minRows) : undefined;
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);
	const enabledRef = useRef(enabled);
	const minRowsRef = useRef(minRows);
	const maxRowsRef = useRef(maxRows);

	useIsomorphicLayoutEffect(() => {
		enabledRef.current = enabled;
		minRowsRef.current = minRows;
		maxRowsRef.current = maxRows;
	}, [enabled, maxRows, minRows]);

	const resize = useCallback(() => {
		const textarea = textareaRef.current;
		if (!enabledRef.current || !textarea || typeof window === "undefined") return;

		const computedStyle = window.getComputedStyle(textarea);
		const borderHeight =
			parsePixels(computedStyle.borderTopWidth) + parsePixels(computedStyle.borderBottomWidth);
		const paddingHeight =
			parsePixels(computedStyle.paddingTop) + parsePixels(computedStyle.paddingBottom);
		const isBorderBox = computedStyle.boxSizing === "border-box";
		const lineHeight = getLineHeight(computedStyle.fontSize, computedStyle.lineHeight);
		const boxSpacing = isBorderBox ? paddingHeight + borderHeight : 0;

		// Reset before reading scrollHeight so deleting content can shrink the control.
		textarea.style.height = "auto";
		let height = isBorderBox
			? textarea.scrollHeight + borderHeight
			: textarea.scrollHeight - paddingHeight;
		height = Math.max(height, lineHeight * minRowsRef.current + boxSpacing);

		const currentMaxRows = maxRowsRef.current;
		if (currentMaxRows !== undefined) {
			const maxHeight = lineHeight * currentMaxRows + boxSpacing;
			const isOverflowing = height > maxHeight;
			height = Math.min(height, maxHeight);
			textarea.style.overflowY = isOverflowing ? "auto" : "hidden";
		} else {
			textarea.style.overflowY = "hidden";
		}

		textarea.style.height = `${height}px`;
	}, []);

	const ref = useCallback((element: HTMLTextAreaElement | null) => {
		textareaRef.current = element;
	}, []);

	// Covers controlled values, typography changes, size changes, and caller
	// styles that affect the textarea's layout.
	useIsomorphicLayoutEffect(() => {
		if (enabled) resize();
	});

	useIsomorphicLayoutEffect(() => {
		if (!enabled) return;
		const textarea = textareaRef.current;
		if (!textarea) return;

		let lastWidth = textarea.clientWidth;
		const observer =
			typeof ResizeObserver === "undefined"
				? null
				: new ResizeObserver(() => {
						if (textarea.clientWidth === lastWidth) return;
						lastWidth = textarea.clientWidth;
						resize();
					});

		observer?.observe(textarea);
		return () => {
			observer?.disconnect();
			textarea.style.height = "";
			textarea.style.overflowY = "";
		};
	}, [enabled, resize]);

	return { minRows, maxRows, ref, resize };
}

function getLineHeight(fontSize: string, lineHeightValue: string): number {
	if (lineHeightValue === "normal" || lineHeightValue === "") return parsePixels(fontSize) * 1.2;
	if (lineHeightValue.endsWith("px")) return parsePixels(lineHeightValue);
	return parsePixels(lineHeightValue) * parsePixels(fontSize);
}
