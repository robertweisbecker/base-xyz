export type DemoItemKind = "task" | "asset";
export type DemoColumnId = "backlog" | "done";

export type DemoItem = Readonly<{
	id: string;
	label: string;
	kind: DemoItemKind;
}>;

export type DemoBoardItem = DemoItem & Readonly<{ columnId: DemoColumnId }>;
export type DemoBoardState = Record<DemoColumnId, DemoItem[]>;

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
		backlog: INITIAL_BOARD.backlog.map((item) => ({ ...item })),
		done: INITIAL_BOARD.done.map((item) => ({ ...item })),
	};
}

export function createInitialBoardItems(): DemoBoardItem[] {
	return BOARD_COLUMNS.flatMap(({ id }) => createInitialBoardState()[id].map((item) => ({ ...item, columnId: id })));
}

export function cloneBoardState(state: DemoBoardState): DemoBoardState {
	return {
		backlog: state.backlog.map((item) => ({ ...item })),
		done: state.done.map((item) => ({ ...item })),
	};
}

export function getItemType(item: DemoItem) {
	return item.kind === "task" ? TASK_TYPE : ASSET_TYPE;
}

