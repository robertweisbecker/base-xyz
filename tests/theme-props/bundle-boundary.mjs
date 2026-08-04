import { gzipSync } from "node:zlib";
import { build } from "vite";

const virtualEntry = {
	name: "theme-props-bundle-boundary",
	resolveId(id) {
		return id === "virtual:theme-props-entry" ? "\0virtual:theme-props-entry" : undefined;
	},
	load(id) {
		if (id !== "\0virtual:theme-props-entry") return undefined;
		return 'import { marginThemeProps } from "/src/theme/theme-props-spacing.stylex.ts"; console.log(marginThemeProps);';
	},
};

const result = await build({
	logLevel: "silent",
	plugins: [virtualEntry],
	build: {
		write: false,
		minify: "esbuild",
		rollupOptions: { input: "virtual:theme-props-entry" },
	},
});
const outputs = Array.isArray(result) ? result.flatMap((item) => item.output) : result.output;
const code = outputs
	.filter((item) => item.type === "chunk")
	.map((item) => item.code)
	.join("\n");
const unrelated = {
	grid: code.includes("gridTemplateColumns"),
	positioning: code.includes("insetInlineStart"),
	shadow: code.includes("boxShadow"),
};

console.log(JSON.stringify({ bytes: code.length, gzip: gzipSync(code).length, unrelated }));
if (Object.values(unrelated).some(Boolean)) process.exitCode = 1;
