import * as stylex from "@stylexjs/stylex";
import { breakpoints } from "@/styles/constants.stylex";
import { tokens } from "@/theme/tokens.stylex";

export const comparisonLabelReset = `
	[data-field-label-hidden] > * > :first-child,
	[data-radio-comparison] > * > :first-child {
		clip: rect(0 0 0 0);
		clip-path: inset(50%);
		height: 1px;
		overflow: hidden;
		position: absolute;
		white-space: nowrap;
		width: 1px;
	}
`;

export const inputsPageStyles = stylex.create({
	horizontalOverflow: { paddingBlock: tokens["--space-1"], overflowX: "auto" },
	fieldSizingCanvas: { minWidth: "82rem" },
	fieldHeaderGrid: {
		gap: tokens["--space-4"],
		display: "grid",
		gridTemplateColumns: "3rem repeat(6, minmax(11rem, 1fr))",
		marginBlockEnd: tokens["--space-3"],
	},
	fieldSizingRow: {
		gap: tokens["--space-4"],
		alignItems: "start",
		display: "grid",
		gridTemplateColumns: "3rem minmax(0, 1fr)",
	},
	fieldControlGrid: {
		gap: tokens["--space-4"],
		display: "grid",
		gridTemplateColumns: "repeat(6, minmax(11rem, 1fr))",
		position: "relative",
	},
	comparisonControl: { position: "relative", zIndex: 1, minWidth: 0 },
	crossComponentHeaders: {
		gap: tokens["--space-4"],
		display: "grid",
		gridTemplateColumns: "1fr 1fr max-content",
		marginBlockEnd: tokens["--space-2"],
		minWidth: "48rem",
	},
	crossComponentRow: {
		gap: tokens["--space-4"],
		alignItems: "start",
		display: "grid",
		gridTemplateColumns: "1fr 1fr max-content",
		position: "relative",
		minWidth: "48rem",
	},
	measurementOverlay: { inset: 0, pointerEvents: "none", position: "absolute", zIndex: 2 },
	measurementLine: {
		insetInline: 0,
		borderBlockStartColor: tokens["--fg-error"],
		borderBlockStartStyle: "solid",
		borderBlockStartWidth: "1px",
		position: "absolute",
	},
	topGuide: { top: 0 },
	baselineGuide: { borderBlockStartStyle: "dashed", opacity: 0.5, top: "calc(50% + 0.34em)" },
	bottomGuide: { bottom: 0 },
	matrixOverflow: { paddingBlockEnd: tokens["--space-2"], overflowX: "auto" },
	fieldStateMatrix: {
		gap: tokens["--space-4"],
		alignItems: "start",
		display: "grid",
		gridTemplateColumns: "max-content repeat(5, minmax(13rem, 1fr))",
		minWidth: "78rem",
	},
	stateCell: { minWidth: 0 },
	inputGroupGrid: {
		gridTemplateColumns: {
			default: "minmax(0, 1fr)",
			[breakpoints.lg]: "repeat(2, minmax(0, 1fr))",
		},
	},
	paddingComparison: {
		gap: tokens["--space-4"],
		display: "flex",
		flexDirection: "column",
		position: "relative",
	},
	paddingGuide: {
		borderInlineStartColor: tokens["--fg-error"],
		borderInlineStartStyle: "dashed",
		borderInlineStartWidth: "1px",
		pointerEvents: "none",
		position: "absolute",
		zIndex: 2,
		bottom: 0,
		top: 0,
	},
	paddingGuideStart: { insetInlineStart: tokens["--space-2"] },
	paddingGuideEnd: { insetInlineEnd: tokens["--space-2"] },
	choiceControlSizeMatrix: {
		gap: tokens["--space-5"],
		alignItems: "center",
		display: "grid",
		gridTemplateColumns: "max-content repeat(2, minmax(8rem, 1fr))",
		minWidth: "26rem",
	},
	choiceControlStateMatrix: {
		gap: tokens["--space-5"],
		alignItems: "center",
		display: "grid",
		gridTemplateColumns: "max-content repeat(4, minmax(8rem, 1fr))",
		minWidth: "42rem",
	},
	valueControlSizeMatrix: {
		gap: tokens["--space-5"],
		alignItems: "center",
		display: "grid",
		gridTemplateColumns: "max-content minmax(8rem, 0.4fr) minmax(18rem, 1fr)",
		minWidth: "34rem",
	},
	valueControlStateMatrix: {
		gap: tokens["--space-5"],
		alignItems: "center",
		display: "grid",
		gridTemplateColumns: "max-content repeat(3, minmax(14rem, 1fr))",
		minWidth: "48rem",
	},
	controlCell: {
		alignItems: "center",
		display: "flex",
		justifyContent: "center",
		minHeight: tokens["--size-control-lg"],
	},
	sliderCell: {
		alignItems: "center",
		display: "flex",
		minHeight: tokens["--size-control-lg"],
		width: "100%",
	},
	formFieldGrid: {
		gridTemplateColumns: {
			default: "minmax(0, 1fr)",
			[breakpoints.sm]: "repeat(2, minmax(0, 1fr))",
		},
	},
});

export const fieldComparisonHeights = stylex.create({
	sm: { height: tokens["--size-control-sm"] },
	md: { height: tokens["--size-control-md"] },
	lg: { height: tokens["--size-control-lg"] },
});
