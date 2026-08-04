import { type RefCallback, useCallback, useState } from "react";
import { observeTextMeasurement } from "@/utils/text-measurement-observer";

export type UseTextTruncationOptions = {
	/** Lines allowed by the consumer's truncation styles. Zero disables measurement. */
	maxLines?: number;
	/** Collapse whitespace in `fullText`, which is useful for tooltip copy. */
	normalizeWhitespace?: boolean;
};

export type UseTextTruncationReturn<ElementType extends HTMLElement> = {
	fullText: string;
	isTruncated: boolean;
	ref: RefCallback<ElementType>;
};

type TruncationMeasurement = Pick<UseTextTruncationReturn<HTMLElement>, "fullText" | "isTruncated">;

const emptyMeasurement: TruncationMeasurement = {
	fullText: "",
	isTruncated: false,
};

function getContentHeight(element: HTMLElement): number {
	let contentHeight = element.scrollHeight;

	try {
		const range = document.createRange();
		range.selectNodeContents(element);
		contentHeight = range.getBoundingClientRect().height;
		range.detach();
	} catch {
		// `scrollHeight` remains the fallback in limited DOM environments.
	}

	return contentHeight;
}

function readMeasurement(
	element: HTMLElement | null,
	maxLines: number,
	normalizeWhitespace: boolean,
): TruncationMeasurement {
	if (!element || maxLines <= 0) return emptyMeasurement;

	const textContent = element.textContent ?? "";
	return {
		fullText: normalizeWhitespace ? textContent.replace(/\s+/g, " ").trim() : textContent,
		isTruncated:
			maxLines === 1
				? element.scrollWidth > element.clientWidth
				: getContentHeight(element) > element.clientHeight,
	};
}

/** Reports whether rendered text is clipped while leaving truncation UI to its consumer. */
export function useTextTruncation<ElementType extends HTMLElement = HTMLElement>({
	maxLines = 1,
	normalizeWhitespace = false,
}: UseTextTruncationOptions = {}): UseTextTruncationReturn<ElementType> {
	const [measurement, setMeasurement] = useState(emptyMeasurement);

	const measure = useCallback(
		(element: ElementType | null) => {
			const nextMeasurement = readMeasurement(element, maxLines, normalizeWhitespace);
			setMeasurement((currentMeasurement) =>
				currentMeasurement.fullText === nextMeasurement.fullText &&
				currentMeasurement.isTruncated === nextMeasurement.isTruncated
					? currentMeasurement
					: nextMeasurement,
			);
		},
		[maxLines, normalizeWhitespace],
	);

	const ref = useCallback<RefCallback<ElementType>>(
		(element) => {
			if (!element) {
				measure(null);
				return;
			}

			const measureElement = () => measure(element);
			return observeTextMeasurement(element, measureElement);
		},
		[measure],
	);

	return { ...measurement, ref };
}
