import { type RefObject, useLayoutEffect, useRef, useState } from "react";

/** Measure the compact width even while expanded, so wrapping cannot oscillate. */
export function useComposerLayout(
	surfaceRef: RefObject<HTMLDivElement | null>,
	layout: "adaptive" | "stacked",
	value: string,
) {
	const [compact, setCompact] = useState(false);
	const measureRef = useRef<(() => void) | null>(null);

	useLayoutEffect(() => {
		const surface = surfaceRef.current;
		if (!surface || layout === "stacked") return;

		const probe = document.createElement("textarea");
		probe.tabIndex = -1;
		probe.setAttribute("aria-hidden", "true");
		probe.rows = 1;
		probe.style.cssText =
			"position:fixed;visibility:hidden;pointer-events:none;top:0;left:0;height:0;min-height:0;max-height:none;overflow:hidden;box-sizing:border-box;border:0;";
		document.body.append(probe);

		function measure() {
			if (!surface) return;
			const input = surface.querySelector("textarea");
			if (!input) return;
			const options = surface.querySelector<HTMLElement>("[data-composer-options]");
			const actions = surface.querySelector<HTMLElement>("[data-composer-actions]");
			const shellStyle = getComputedStyle(surface);
			const inputStyle = getComputedStyle(input);
			const gap = Number.parseFloat(shellStyle.columnGap) || 0;
			const width =
				surface.clientWidth -
				Number.parseFloat(shellStyle.paddingLeft) -
				Number.parseFloat(shellStyle.paddingRight) -
				(options?.scrollWidth ?? 0) -
				(actions?.scrollWidth ?? 0) -
				gap * 2;

			Object.assign(probe.style, {
				width: `${Math.max(1, width)}px`,
				font: inputStyle.font,
				letterSpacing: inputStyle.letterSpacing,
				padding: inputStyle.padding,
				textIndent: inputStyle.textIndent,
				wordBreak: inputStyle.wordBreak,
				overflowWrap: inputStyle.overflowWrap,
				tabSize: inputStyle.tabSize,
			});
			probe.wrap = input.wrap;
			probe.value = input.value || input.placeholder;
			const lineHeight = Number.parseFloat(inputStyle.lineHeight);
			const singleLineHeight =
				lineHeight +
				Number.parseFloat(inputStyle.paddingTop) +
				Number.parseFloat(inputStyle.paddingBottom);
			setCompact(
				input.rows === 1 &&
					!surface.querySelector('[data-slot="header"]') &&
					width >= Number.parseFloat(inputStyle.fontSize) * 8 &&
					!input.value.includes("\n") &&
					probe.scrollHeight <= singleLineHeight + 1,
			);
			if (options) observer.observe(options);
			if (actions) observer.observe(actions);
		}

		const observer = new ResizeObserver(measure);
		observer.observe(surface);
		const mutations = new MutationObserver(measure);
		mutations.observe(surface, { childList: true, characterData: true, subtree: true });
		measureRef.current = measure;
		measure();
		document.fonts.addEventListener("loadingdone", measure);
		return () => {
			observer.disconnect();
			mutations.disconnect();
			document.fonts.removeEventListener("loadingdone", measure);
			probe.remove();
			measureRef.current = null;
		};
	}, [layout, surfaceRef]);

	useLayoutEffect(() => {
		measureRef.current?.();
	}, [value]);

	return layout === "adaptive" && compact;
}
