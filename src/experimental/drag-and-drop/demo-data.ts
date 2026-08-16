export type DemoItemKind = "task" | "asset";
export type DemoColumnId = "backlog" | "done";

export type DemoItem = Readonly<{
	id: string;
	label: string;
	kind: DemoItemKind;
}>;

export type DemoBoardItem = DemoItem & Readonly<{ columnId: DemoColumnId }>;
export type DemoBoardState = {
	backlog: DemoItem[];
	done: DemoItem[];
};

export const TASK_TYPE = "application/x-stylex-experimental-task";
export const ASSET_TYPE = "application/x-stylex-experimental-asset";

export const TRANSFER_ITEM: DemoItem = {
	id: "quarterly-roadmap",
	label: "Quarterly roadmap",
	kind: "task",
};

export const TRANSFER_DESTINATIONS = {
	planning: {
		id: "planning-queue",
		label: "Planning queue",
		accepts: "task",
	},
	assets: {
		id: "asset-library",
		label: "Asset library",
		accepts: "asset",
	},
} as const;

export const BOARD_COLUMNS: ReadonlyArray<{ id: DemoColumnId; label: string }> = [
	{ id: "backlog", label: "Backlog" },
	{ id: "done", label: "Done" },
];

const INITIAL_BOARD: DemoBoardState = {
	backlog: [
		{ id: "draft-onboarding-checklist", label: "Draft onboarding checklist", kind: "task" },
		{ id: "review-billing-copy", label: "Review billing copy", kind: "task" },
		{ id: "publish-release-notes", label: "Publish release notes", kind: "task" },
		{ id: "confirm-analytics-events", label: "Confirm analytics events", kind: "task" },
	],
	done: [],
};

export function createInitialBoardState(): DemoBoardState {
	return {
		backlog: [...INITIAL_BOARD.backlog],
		done: [...INITIAL_BOARD.done],
	};
}

export function createInitialBoardItems(): DemoBoardItem[] {
	return BOARD_COLUMNS.flatMap(({ id }) => INITIAL_BOARD[id].map((item) => ({ ...item, columnId: id })));
}

export function cloneBoardState(state: DemoBoardState): DemoBoardState {
	return {
		backlog: [...state.backlog],
		done: [...state.done],
	};
}

export function getItemType(item: DemoItem) {
	return item.kind === "task" ? TASK_TYPE : ASSET_TYPE;
}

export function parseDemoItemString(serializedItem: string, key: "id" | "label") {
	const item: unknown = JSON.parse(serializedItem);
	if (typeof item !== "object" || item === null) return null;
	const value = key === "id" && "id" in item ? item.id : key === "label" && "label" in item ? item.label : null;
	return typeof value === "string" ? value : null;
}
