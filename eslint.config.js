import stylexjs from "@stylexjs/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

// StyleX-specific linting only; general linting stays with oxlint.
export default [
	{
		ignores: ["src/routeTree.gen.ts"],
	},
	{
		files: ["src/**/*.{ts,tsx}"],
		languageOptions: {
			parser: tsParser,
			ecmaVersion: "latest",
			sourceType: "module",
		},
		plugins: {
			"@stylexjs": stylexjs,
		},
		rules: {
			"@stylexjs/no-unused": "error",
			"@stylexjs/valid-styles": "error",
			"@stylexjs/valid-shorthands": "error",
			"@stylexjs/sort-keys": "warn",
		},
	},
];
