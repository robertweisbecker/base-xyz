import stylexjs from "@stylexjs/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

// StyleX-specific linting only; general linting stays with oxlint.
export default [
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
			"@stylexjs/valid-styles": "error",
			"@stylexjs/sort-keys": "warn",
		},
	},
];
