export function attrJoin(...values: Array<string | undefined>) {
	return values.filter(Boolean).join(" ");
}
