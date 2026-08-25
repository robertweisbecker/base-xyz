export const fieldSizes = ["sm", "md", "lg"] as const;

export function formatComparisonLabel(value: string) {
	return value.replaceAll("-", " ").replace(/^./, (character) => character.toUpperCase());
}
