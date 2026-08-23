import { expect, test } from "@playwright/test";
import { mergeStyle } from "../../src/styles/props/base";

test("mergeStyle lets native consumer style win over StyleX-produced inline style", () => {
	expect(mergeStyle({ padding: "4px" }, { padding: "8px", color: "red" })).toEqual({
		padding: "8px",
		color: "red",
	});
	expect(mergeStyle(undefined, { color: "blue" })).toEqual({ color: "blue" });
	expect(mergeStyle({ color: "green" }, undefined)).toEqual({ color: "green" });
});
