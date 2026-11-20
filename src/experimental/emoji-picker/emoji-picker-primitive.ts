import {
	announce,
	createChange,
	createFocusRecovery,
	createRovingFocus,
	definePrimitive,
	prepareAnnouncements,
	type ChangeDetails,
} from "@ui-sdk/core";
import { EMOJI_COLUMNS, emojiItems, matchingEmoji } from "./emoji-data";

export type EmojiPickerOptions = {
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string, details: ChangeDetails<"item-press">) => void;
};

type EmojiPickerState = {
	value: string;
	query: string;
	items: typeof emojiItems;
	focused: string | null;
};

export const emojiPicker = definePrimitive({
	name: "emoji-picker",
	options: { value: "string", defaultValue: "string", onValueChange: "callback" },
	controlled: ["value"],
	state: (options: EmojiPickerOptions): EmojiPickerState => ({
		value: options.value ?? options.defaultValue ?? "",
		query: "",
		items: emojiItems,
		focused: null,
	}),
	sync: (options) => (options.value === undefined ? {} : { value: options.value }),
	api: (context) => {
		const change = createChange(context);
		const focusSearch = () => context.element("root")?.querySelector("input")?.focus();
		const roving = createRovingFocus(context, {
			slot: "cell",
			key: "focused",
			move: (event, { from, items, rtl }) => {
				if (event.altKey) return;
				const index = items.findIndex((item) => item.key === from.key);
				const start = Math.floor(index / EMOJI_COLUMNS) * EMOJI_COLUMNS;
				const end = Math.min(start + EMOJI_COLUMNS - 1, items.length - 1);
				const corner = event.ctrlKey || event.metaKey;
				let next: number;
				switch (event.key) {
					case "ArrowLeft":
						next = Math.max(start, Math.min(end, index + (rtl ? 1 : -1)));
						break;
					case "ArrowRight":
						next = Math.max(start, Math.min(end, index + (rtl ? -1 : 1)));
						break;
					case "ArrowUp":
						next = index < EMOJI_COLUMNS ? index : index - EMOJI_COLUMNS;
						break;
					case "ArrowDown":
						next =
							start + EMOJI_COLUMNS >= items.length
								? index
								: Math.min(index + EMOJI_COLUMNS, items.length - 1);
						break;
					case "Home":
						next = corner ? 0 : start;
						break;
					case "End":
						next = corner ? items.length - 1 : end;
						break;
					default:
						return;
				}
				return items[next]?.key ?? from.key;
			},
		});
		const recovery = createFocusRecovery({
			fallback: () => context.element("root")?.querySelector("input"),
		});
		return {
			roving,
			recovery,
			search(query: string) {
				context.store.set({ query, items: matchingEmoji(query), focused: null });
			},
			choose(value: string, event?: Event) {
				const item = context.store.get().items.find((entry) => entry.value === value);
				if (
					item &&
					(context.store.get().value === value ||
						change("value", value, { reason: "item-press", event }))
				) {
					announce(`${item.label} selected`, { doc: context.element("root")?.ownerDocument });
				}
			},
			keydown(event: KeyboardEvent) {
				if (event.defaultPrevented || event.isComposing) return;
				if (event.target instanceof HTMLInputElement) {
					if (event.key === "ArrowDown" && context.store.get().items.length) {
						event.preventDefault();
						roving.focus(context.store.get().items[0].value);
					} else if (event.key === "Escape" && context.store.get().query) {
						event.preventDefault();
						context.store.set({ query: "", items: emojiItems, focused: null });
					}
				} else if (event.key === "Escape") {
					event.preventDefault();
					focusSearch();
				}
			},
		};
	},
	slots: (slot) => ({
		root: slot({
			role: "group",
			state: (state) => state,
			keys: ["ArrowDown", "Escape"],
			on: { keydown: (event, { api }) => api.keydown(event) },
			bind: (el) => prepareAnnouncements(el.ownerDocument),
		}),
		grid: slot({
			role: "grid",
			keys: { none: "Grid cells handle navigation." },
		}),
		row: slot({ role: "row" }),
		cell: slot<{ value: string }>({
			props: { value: "string" },
			role: "gridcell",
			focus: "roving",
			keys: ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "Enter", " "],
			attrs: (state, part) => ({
				tabindex: part.api.roving.tabIndex(state, part),
				"aria-selected": String(state.value === part.key),
				"data-pressed": state.value === part.key ? "" : undefined,
			}),
			press: ({ api, key }, event) => api.choose(key, event),
			on: {
				keydown: (event, { api, el, key }) => {
					if (event.isComposing || event.defaultPrevented) return;
					if (event.key === "Enter" || event.key === " ") {
						event.preventDefault();
						api.choose(key, event);
					} else if (el) api.roving.keydown(event, el);
				},
			},
			bind: (el, part) => {
				const stopFocus = part.api.roving.bind(el, part);
				const stopRecovery = part.api.recovery.bind(el, part);
				return () => {
					stopFocus();
					stopRecovery();
				};
			},
		}),
	}),
	agent: { actions: ["choose"], closed: true },
});
