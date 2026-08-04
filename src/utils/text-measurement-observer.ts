type MeasurementCallback = () => void;

const resizeCallbacks = new Map<Element, Set<MeasurementCallback>>();
let resizeObserver: ResizeObserver | null = null;

const fontCallbacks = new Set<MeasurementCallback>();

function getResizeObserver(): ResizeObserver {
	resizeObserver ??= new ResizeObserver((entries) => {
		for (const entry of entries) {
			for (const callback of resizeCallbacks.get(entry.target) ?? []) callback();
		}
	});

	return resizeObserver;
}

function observeResize(element: Element, callback: MeasurementCallback): () => void {
	if (typeof ResizeObserver === "undefined") {
		callback();
		return () => {};
	}

	let elementCallbacks = resizeCallbacks.get(element);
	if (!elementCallbacks) {
		elementCallbacks = new Set();
		resizeCallbacks.set(element, elementCallbacks);
		getResizeObserver().observe(element);
	}

	elementCallbacks.add(callback);
	callback();

	return () => {
		const currentCallbacks = resizeCallbacks.get(element);
		if (!currentCallbacks) return;

		currentCallbacks.delete(callback);
		if (currentCallbacks.size > 0) return;

		resizeCallbacks.delete(element);
		resizeObserver?.unobserve(element);

		if (resizeCallbacks.size === 0) {
			resizeObserver?.disconnect();
			resizeObserver = null;
		}
	};
}

function notifyFontLoadingDone() {
	for (const callback of fontCallbacks) callback();
}

function observeFontLoading(callback: MeasurementCallback): () => void {
	const fontSet = typeof document === "undefined" ? undefined : document.fonts;
	if (!fontSet) return () => {};

	if (fontCallbacks.size === 0) fontSet.addEventListener("loadingdone", notifyFontLoadingDone);
	fontCallbacks.add(callback);

	return () => {
		fontCallbacks.delete(callback);
		if (fontCallbacks.size === 0) fontSet.removeEventListener("loadingdone", notifyFontLoadingDone);
	};
}

/** Re-measure when an element, its contents, or loaded fonts can change text layout. */
export function observeTextMeasurement(element: Element, callback: MeasurementCallback): () => void {
	const stopObservingResize = observeResize(element, callback);
	const mutationObserver =
		typeof MutationObserver === "undefined" ? null : new MutationObserver(callback);
	mutationObserver?.observe(element, {
		characterData: true,
		childList: true,
		subtree: true,
	});
	const stopObservingFontLoading = observeFontLoading(callback);

	return () => {
		stopObservingResize();
		mutationObserver?.disconnect();
		stopObservingFontLoading();
	};
}
