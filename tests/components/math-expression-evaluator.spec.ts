import { expect, test } from "@playwright/test";
import { evaluateMathExpression } from "../../src/utils/evaluate-math-expression";

test("evaluates plain numbers and whitespace", () => {
	expect(evaluateMathExpression("42")).toEqual({ ok: true, value: 42 });
	expect(evaluateMathExpression(" 3.5 ")).toEqual({ ok: true, value: 3.5 });
	expect(evaluateMathExpression(".5")).toEqual({ ok: true, value: 0.5 });
});

test("applies operator precedence, associativity, and parentheses", () => {
	expect(evaluateMathExpression("100 / 5")).toEqual({ ok: true, value: 20 });
	expect(evaluateMathExpression("2 + 3 * 4")).toEqual({ ok: true, value: 14 });
	expect(evaluateMathExpression("(2 + 3) * 4")).toEqual({ ok: true, value: 20 });
	expect(evaluateMathExpression("10 - 2 - 3")).toEqual({ ok: true, value: 5 });
	expect(evaluateMathExpression("12 / 3 / 2")).toEqual({ ok: true, value: 2 });
	expect(evaluateMathExpression("0.1 + 0.2")).toEqual({ ok: true, value: 0.1 + 0.2 });
});

test("supports unary signs", () => {
	expect(evaluateMathExpression("-4")).toEqual({ ok: true, value: -4 });
	expect(evaluateMathExpression("+5")).toEqual({ ok: true, value: 5 });
	expect(evaluateMathExpression("3 * -2")).toEqual({ ok: true, value: -6 });
	expect(evaluateMathExpression("-(2.5 + 1.5) * 2")).toEqual({ ok: true, value: -8 });
});

test("rejects malformed expressions", () => {
	expect(evaluateMathExpression("")).toEqual({ ok: false, reason: "empty" });
	expect(evaluateMathExpression("   ")).toEqual({ ok: false, reason: "empty" });
	expect(evaluateMathExpression("2 +")).toEqual({ ok: false, reason: "syntax" });
	expect(evaluateMathExpression("(2 + 3")).toEqual({ ok: false, reason: "syntax" });
	expect(evaluateMathExpression("2(3)")).toEqual({ ok: false, reason: "syntax" });
	expect(evaluateMathExpression("two + 2")).toEqual({ ok: false, reason: "syntax" });
	expect(evaluateMathExpression("1 2")).toEqual({ ok: false, reason: "syntax" });
	expect(evaluateMathExpression("2 ** 3")).toEqual({ ok: false, reason: "syntax" });
	expect(evaluateMathExpression("1e")).toEqual({ ok: false, reason: "syntax" });
});

test("parses exponent notation so formatted results round-trip", () => {
	expect(evaluateMathExpression("1e21")).toEqual({ ok: true, value: 1e21 });
	expect(evaluateMathExpression("1e+21")).toEqual({ ok: true, value: 1e21 });
	expect(evaluateMathExpression("1e-7")).toEqual({ ok: true, value: 1e-7 });
	expect(evaluateMathExpression("2.5E3")).toEqual({ ok: true, value: 2500 });
});

test("rejects nesting beyond the parser depth limit without overflowing", () => {
	const nested = `${"(".repeat(65)}1${")".repeat(65)}`;
	expect(evaluateMathExpression(nested)).toEqual({ ok: false, reason: "syntax" });
	const deepUnary = `${"-".repeat(65)}1`;
	expect(evaluateMathExpression(deepUnary)).toEqual({ ok: false, reason: "syntax" });
	const allowed = `${"(".repeat(64)}1${")".repeat(64)}`;
	expect(evaluateMathExpression(allowed)).toEqual({ ok: true, value: 1 });
});

test("rejects division by zero and non-finite results", () => {
	expect(evaluateMathExpression("1 / 0")).toEqual({ ok: false, reason: "division-by-zero" });
	expect(evaluateMathExpression("1 / (2 - 2)")).toEqual({ ok: false, reason: "division-by-zero" });
	expect(evaluateMathExpression(`1${"0".repeat(309)}`)).toEqual({
		ok: false,
		reason: "non-finite",
	});
});
