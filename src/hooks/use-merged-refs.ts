import { type Ref, type RefCallback, useCallback } from "react";

export function useMergedRefs<T>(
	firstRef: Ref<T> | undefined,
	secondRef: Ref<T> | undefined,
): RefCallback<T> {
	return useCallback(
		(value: T | null) => {
			const firstCleanup = setRef(firstRef, value);
			const secondCleanup = setRef(secondRef, value);
			return () => {
				firstCleanup?.();
				secondCleanup?.();
			};
		},
		[firstRef, secondRef],
	);
}

function setRef<T>(ref: Ref<T> | undefined, value: T | null) {
	if (typeof ref === "function") {
		const cleanup = ref(value);
		return typeof cleanup === "function" ? cleanup : () => ref(null);
	}
	if (ref !== null && ref !== undefined) {
		ref.current = value;
		return () => {
			ref.current = null;
		};
	}
	return undefined;
}
