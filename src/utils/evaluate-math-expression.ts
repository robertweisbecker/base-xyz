export type MathExpressionFailureReason = "empty" | "syntax" | "division-by-zero" | "non-finite";

export type MathExpressionResult = { ok: true; value: number } | { ok: false; reason: MathExpressionFailureReason };

type BinaryOperator = "+" | "-" | "*" | "/";

type Token =
	| { kind: "number"; value: number }
	| { kind: "operator"; value: BinaryOperator }
	| { kind: "open-paren" }
	| { kind: "close-paren" };

const NUMBER_PATTERN = /^(?:\d+(?:\.\d*)?|\.\d+)/;

function tokenize(expression: string): Token[] | null {
	const tokens: Token[] = [];
	let index = 0;
	while (index < expression.length) {
		const char = expression[index];
		if (/\s/.test(char)) {
			index += 1;
			continue;
		}
		if (char === "(") {
			tokens.push({ kind: "open-paren" });
			index += 1;
			continue;
		}
		if (char === ")") {
			tokens.push({ kind: "close-paren" });
			index += 1;
			continue;
		}
		if (char === "+" || char === "-" || char === "*" || char === "/") {
			tokens.push({ kind: "operator", value: char });
			index += 1;
			continue;
		}
		const match = NUMBER_PATTERN.exec(expression.slice(index));
		if (match) {
			tokens.push({ kind: "number", value: Number.parseFloat(match[0]) });
			index += match[0].length;
			continue;
		}
		return null;
	}
	return tokens;
}

/**
 * Evaluate an arithmetic expression supporting decimals, whitespace, unary
 * signs, the four binary operators, and parentheses. Never uses `eval`.
 */
export function evaluateMathExpression(expression: string): MathExpressionResult {
	const tokenized = tokenize(expression);
	if (tokenized === null) return { ok: false, reason: "syntax" };
	if (tokenized.length === 0) return { ok: false, reason: "empty" };
	const tokens: Token[] = tokenized;

	let index = 0;
	let failure: MathExpressionFailureReason | null = null;

	function fail(reason: MathExpressionFailureReason): number {
		failure = failure ?? reason;
		return Number.NaN;
	}

	function parseExpression(): number {
		let left = parseTerm();
		while (failure === null) {
			const token = tokens[index];
			if (!token || token.kind !== "operator" || (token.value !== "+" && token.value !== "-")) break;
			index += 1;
			const right = parseTerm();
			left = token.value === "+" ? left + right : left - right;
		}
		return left;
	}

	function parseTerm(): number {
		let left = parseFactor();
		while (failure === null) {
			const token = tokens[index];
			if (!token || token.kind !== "operator" || (token.value !== "*" && token.value !== "/")) break;
			index += 1;
			const right = parseFactor();
			if (token.value === "*") {
				left = left * right;
			} else if (right === 0) {
				left = fail("division-by-zero");
			} else {
				left = left / right;
			}
		}
		return left;
	}

	function parseFactor(): number {
		const token = tokens[index];
		if (token?.kind === "operator" && (token.value === "+" || token.value === "-")) {
			index += 1;
			const operand = parseFactor();
			return token.value === "-" ? -operand : operand;
		}
		return parsePrimary();
	}

	function parsePrimary(): number {
		const token = tokens[index];
		if (token?.kind === "number") {
			index += 1;
			return token.value;
		}
		if (token?.kind === "open-paren") {
			index += 1;
			const value = parseExpression();
			if (tokens[index]?.kind !== "close-paren") return fail("syntax");
			index += 1;
			return value;
		}
		return fail("syntax");
	}

	const value = parseExpression();
	if (failure === null && index < tokens.length) failure = "syntax";
	if (failure !== null) return { ok: false, reason: failure };
	if (!Number.isFinite(value)) return { ok: false, reason: "non-finite" };
	return { ok: true, value };
}
