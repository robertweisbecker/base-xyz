"use client";

import * as stylex from "@stylexjs/stylex";
import { Input, InputClear, InputGroup } from "@ui-sdk/react/input";
import { IconX } from "fyicons";
import { getButtonRootStyleProps } from "@/components/button/button.stylex";
import { createParts, usePart, usePrimitive } from "@ui-sdk/react/primitive";
import { fieldInputStyles } from "@/components/field/field.stylex";
import { focusRing } from "@/styles/recipes/focus";
import { EMOJI_COLUMNS } from "./emoji-data";
import { emojiPicker, type EmojiPickerOptions } from "./emoji-picker-primitive";
import { emojiPickerStyles as styles } from "./emoji-picker.stylex";

const parts = createParts(emojiPicker, { root: "div", grid: "div", row: "div", cell: "div" });

export function EmojiPicker(props: EmojiPickerOptions) {
	const handle = usePrimitive(emojiPicker, props);
	return usePart(
		handle,
		"root",
		{},
		{
			"aria-label": "Emoji picker",
			...stylex.props(styles.root),
			children: (state) => {
				const rows = Array.from(
					{ length: Math.ceil(state.items.length / EMOJI_COLUMNS) },
					(_, index) => state.items.slice(index * EMOJI_COLUMNS, (index + 1) * EMOJI_COLUMNS),
				);
				return (
					<>
						<InputGroup aria-label="Emoji search controls" {...stylex.props(styles.searchGroup)}>
							<Input
								type="search"
								aria-label="Search emoji"
								placeholder="Search emoji…"
								value={state.query}
								onValueChange={(query) => handle.api.search(query)}
								{...stylex.props(fieldInputStyles.md, focusRing.inset, styles.search)}
							/>
							<InputClear
								aria-label="Clear search"
								{...getButtonRootStyleProps(
									{ variant: "ghost", size: "xs", shape: "square", iconOnly: true },
									styles.clear,
								)}
							>
								<IconX aria-hidden size={12} />
							</InputClear>
						</InputGroup>
						<parts.Grid aria-label="Emoji results" {...stylex.props(styles.grid)}>
							{rows.map((row) => (
								<parts.Row key={row[0].value} {...stylex.props(styles.row)}>
									{row.map((item) => (
										<parts.Cell
											key={item.value}
											value={item.value}
											aria-label={item.label}
											title={item.label}
											{...getButtonRootStyleProps(
												{ variant: "ghost", size: "md", shape: "square", iconOnly: true },
												styles.cell,
											)}
										>
											<span aria-hidden="true">{item.value}</span>
											<span {...stylex.props(styles.hidden)}>{item.label}</span>
										</parts.Cell>
									))}
								</parts.Row>
							))}
						</parts.Grid>
						{!state.items.length && <p {...stylex.props(styles.empty)}>No emoji found</p>}
					</>
				);
			},
		},
		"div",
	);
}
