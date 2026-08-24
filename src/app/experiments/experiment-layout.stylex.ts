import * as stylex from "@stylexjs/stylex";
import { tokens } from "@/theme/tokens.stylex";

export const experimentLayoutVars = stylex.defineVars({
	"--anchor-offset": `calc(48px + ${tokens["--space-4"]})`,
});
