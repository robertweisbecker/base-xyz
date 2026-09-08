import { gzipSync } from "node:zlib";
import { build } from "vite";

const virtualEntry = {
	name: "style-props-bundle-boundary",
	resolveId(id) {
		return id === "virtual:style-props-entry" ? "\0virtual:style-props-entry" : undefined;
	},
	load(id) {
		if (id !== "\0virtual:style-props-entry") return undefined;
		return 'import { Kbd } from "/src/components/index.ts"; console.log(Kbd);';
	},
};

const result = await build({
	logLevel: "silent",
	plugins: [virtualEntry],
	build: {
		write: false,
		minify: "esbuild",
		rollupOptions: { input: "virtual:style-props-entry" },
	},
});
const outputs = Array.isArray(result) ? result.flatMap((item) => item.output) : result.output;
const code = outputs
	.filter((item) => item.type === "chunk")
	.map((item) => item.code)
	.join("\n");
// A small public component must not retain the broad layout gateway's resolvers.
// Inspect retained exports, not CSS property text or leftover unused constants.
const unrelated = outputs
	.filter((item) => item.type === "chunk")
	.flatMap((item) => Object.entries(item.modules))
	.filter(
		([id, module]) =>
			/\/src\/styles\/props\/(child-layout|flex|grid|position|sizing|surface|typography)\.stylex\.ts$/.test(
				id,
			) && module.renderedExports.length > 0,
	)
	.map(([id]) => id);

console.log(JSON.stringify({ bytes: code.length, gzip: gzipSync(code).length, unrelated }));
if (unrelated.length > 0) process.exitCode = 1;
