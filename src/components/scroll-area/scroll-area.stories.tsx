import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { color, fontSize, fontWeight, letterSpacing, lineHeight, radius, shadow, space } from "@/styles/tokens.stylex";
import { ScrollArea } from "./scroll-area";

const items = Array.from({ length: 16 }, (_, index) => ({
	label: `Prototype ${String(index + 1).padStart(2, "0")}`,
	status: index % 3 === 0 ? "In review" : "Draft",
}));

const milestones = Array.from({ length: 12 }, (_, index) => ({
	label: `Milestone ${index + 1}`,
	date: `Week ${index + 2}`,
}));

const meta = {
	title: "Components/Scroll area",
	component: ScrollArea,
	args: {
		children: null,
		disableFade: false,
		label: "Recent prototypes",
		orientation: "vertical",
		showScrollbar: "hover",
		size: "fill",
	},
	argTypes: {
		children: { control: false },
		className: { control: false },
		contentClassName: { control: false },
		contentStyle: { control: false },
		disableFade: { control: "boolean" },
		label: { control: "text" },
		orientation: { control: "inline-radio", options: ["vertical", "horizontal", "both"] },
		scrollbarClassName: { control: false },
		scrollbarStyle: { control: false },
		showScrollbar: { control: "inline-radio", options: ["always", "scroll", "hover"] },
		size: { control: "inline-radio", options: ["fill", "content"] },
		style: { control: false },
		viewportClassName: { control: false },
		viewportStyle: { control: false },
	},
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	render: ({ disableFade, label, orientation, showScrollbar, size }) => (
		<div
			{...stylex.props(
				styles.playgroundFrame,
				orientation === "horizontal" && styles.playgroundFrameHorizontal,
				orientation === "both" && styles.playgroundFrameBoth,
			)}>
			<ScrollArea
				disableFade={disableFade}
				label={label}
				orientation={orientation}
				showScrollbar={showScrollbar}
				size={size}
				style={styles.surface}
				contentStyle={styles.padding}>
				{orientation === "horizontal" ? (
					<div {...stylex.props(styles.horizontalList)}>
						{milestones.map((item) => (
							<div key={item.label} {...stylex.props(styles.milestone)}>
								<span>{item.label}</span>
								<span {...stylex.props(styles.meta)}>{item.date}</span>
							</div>
						))}
					</div>
				) : orientation === "both" ? (
					<div {...stylex.props(styles.board)}>
						{Array.from({ length: 48 }, (_, index) => (
							<div key={index} {...stylex.props(styles.boardItem)}>
								{index + 1}
							</div>
						))}
					</div>
				) : (
					<div {...stylex.props(styles.list)}>
						{items.map((item) => (
							<div key={item.label} {...stylex.props(styles.listItem)}>
								<span>{item.label}</span>
								<span {...stylex.props(styles.meta)}>{item.status}</span>
							</div>
						))}
					</div>
				)}
			</ScrollArea>
		</div>
	),
};

export const Orientations: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(styles.orientationExamples)}>
			<section {...stylex.props(styles.orientationExample)}>
				<h3 {...stylex.props(styles.exampleHeading)}>Vertical</h3>
				<div {...stylex.props(styles.verticalFrame)}>
					<ScrollArea label="Recent prototypes" style={styles.surface} contentStyle={styles.padding}>
						<div {...stylex.props(styles.list)}>
							{items.map((item) => (
								<div key={item.label} {...stylex.props(styles.listItem)}>
									<span>{item.label}</span>
									<span {...stylex.props(styles.meta)}>{item.status}</span>
								</div>
							))}
						</div>
					</ScrollArea>
				</div>
			</section>
			<section {...stylex.props(styles.orientationExample)}>
				<h3 {...stylex.props(styles.exampleHeading)}>Horizontal</h3>
				<div {...stylex.props(styles.horizontalFrame)}>
					<ScrollArea
						label="Project milestones"
						orientation="horizontal"
						style={styles.surface}
						contentStyle={styles.padding}>
						<div {...stylex.props(styles.horizontalList)}>
							{milestones.map((item) => (
								<div key={item.label} {...stylex.props(styles.milestone)}>
									<span>{item.label}</span>
									<span {...stylex.props(styles.meta)}>{item.date}</span>
								</div>
							))}
						</div>
					</ScrollArea>
				</div>
			</section>
			<section {...stylex.props(styles.orientationExample)}>
				<h3 {...stylex.props(styles.exampleHeading)}>Both axes</h3>
				<div {...stylex.props(styles.bothFrame)}>
					<ScrollArea label="Planning board" orientation="both" style={styles.surface} contentStyle={styles.padding}>
						<div {...stylex.props(styles.board)}>
							{Array.from({ length: 48 }, (_, index) => (
								<div key={index} {...stylex.props(styles.boardItem)}>
									{index + 1}
								</div>
							))}
						</div>
					</ScrollArea>
				</div>
			</section>
		</div>
	),
};

const scrollbarVisibilityModes = [
	{ label: "Always", value: "always" },
	{ label: "While scrolling", value: "scroll" },
	{ label: "On hover", value: "hover" },
] as const;

const fadeModes = [
	{ label: "Fade enabled", disableFade: false },
	{ label: "Fade disabled", disableFade: true },
] as const;

export const Options: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(styles.behaviorGroups)}>
			<section {...stylex.props(styles.behaviorGroup)}>
				<h2 {...stylex.props(styles.groupHeading)}>Scrollbar visibility</h2>
				<div {...stylex.props(styles.behaviorExamples)}>
					{scrollbarVisibilityModes.map((mode) => (
						<div key={mode.value} {...stylex.props(styles.behaviorExample)}>
							<h3 {...stylex.props(styles.exampleHeading)}>{mode.label}</h3>
							<div {...stylex.props(styles.visibilityFrame)}>
								<ScrollArea
									label={`${mode.label} scrollbar visibility`}
									showScrollbar={mode.value}
									style={styles.surface}
									contentStyle={styles.padding}>
									<div {...stylex.props(styles.list)}>
										{items.slice(0, 8).map((item) => (
											<div key={item.label} {...stylex.props(styles.listItem)}>
												<span>{item.label}</span>
												<span {...stylex.props(styles.meta)}>{item.status}</span>
											</div>
										))}
									</div>
								</ScrollArea>
							</div>
						</div>
					))}
				</div>
			</section>
			<section {...stylex.props(styles.behaviorGroup)}>
				<h2 {...stylex.props(styles.groupHeading)}>Edge fade</h2>
				<div {...stylex.props(styles.behaviorExamples)}>
					{fadeModes.map((mode) => (
						<div key={mode.label} {...stylex.props(styles.behaviorExample)}>
							<h3 {...stylex.props(styles.exampleHeading)}>{mode.label}</h3>
							<div {...stylex.props(styles.fadeFrame)}>
								<ScrollArea
									label={mode.label}
									disableFade={mode.disableFade}
									style={styles.surface}
									contentStyle={styles.padding}>
									<div {...stylex.props(styles.list)}>
										{items.map((item) => (
											<div key={item.label} {...stylex.props(styles.listItem)}>
												<span>{item.label}</span>
												<span {...stylex.props(styles.meta)}>{item.status}</span>
											</div>
										))}
									</div>
								</ScrollArea>
							</div>
						</div>
					))}
				</div>
			</section>
		</div>
	),
};

const styles = stylex.create({
	playgroundFrame: {
		height: "280px",
		maxWidth: "360px",
	},
	playgroundFrameHorizontal: {
		height: "136px",
		maxWidth: "520px",
	},
	playgroundFrameBoth: {
		height: "280px",
		maxWidth: "360px",
	},
	verticalFrame: {
		height: "280px",
		maxWidth: "360px",
	},
	horizontalFrame: {
		height: "136px",
		maxWidth: "520px",
	},
	bothFrame: {
		height: "280px",
		maxWidth: "360px",
	},
	orientationExamples: {
		gap: space[6],
		display: "flex",
		flexWrap: "wrap",
	},
	orientationExample: {
		gap: space[2],
		display: "grid",
	},
	visibilityFrame: {
		height: "200px",
		width: "280px",
	},
	behaviorGroups: {
		gap: space[8],
		display: "flex",
		flexDirection: "column",
	},
	behaviorGroup: {
		gap: space[4],
		display: "flex",
		flexDirection: "column",
	},
	behaviorExamples: {
		gap: space[6],
		display: "flex",
		flexWrap: "wrap",
	},
	behaviorExample: {
		gap: space[2],
		display: "grid",
	},
	fadeFrame: {
		height: "220px",
		width: "280px",
	},
	groupHeading: {
		margin: 0,
		fontSize: fontSize.x4,
		fontWeight: fontWeight.semibold,
		letterSpacing: letterSpacing.x4,
		lineHeight: lineHeight.x4,
	},
	exampleHeading: {
		margin: 0,
		fontSize: fontSize.x2,
		fontWeight: fontWeight.medium,
		letterSpacing: letterSpacing.x2,
		lineHeight: lineHeight.x2,
	},
	surface: {
		borderRadius: radius.md,
		backgroundColor: color.canvasSubtle,
	},
	padding: {
		padding: space[3],
	},
	list: {
		gap: space[2],
		display: "flex",
		flexDirection: "column",
	},
	listItem: {
		borderRadius: radius.sm,
		paddingBlock: space[2],
		paddingInline: space[3],
		alignItems: "center",
		backgroundColor: color.bgElevated,
		boxShadow: shadow.sm,
		display: "flex",
		fontSize: fontSize.x2,
		justifyContent: "space-between",
		letterSpacing: letterSpacing.x2,
		lineHeight: lineHeight.x2,
		minHeight: "44px",
	},
	horizontalList: {
		gap: space[2],
		display: "flex",
		width: "980px",
	},
	milestone: {
		borderRadius: radius.sm,
		gap: space[1],
		paddingInline: space[4],
		backgroundColor: color.bgElevated,
		display: "flex",
		flexDirection: "column",
		flexShrink: 0,
		fontSize: fontSize.x2,
		justifyContent: "center",
		letterSpacing: letterSpacing.x2,
		lineHeight: lineHeight.x2,
		minHeight: "76px",
		width: "140px",
	},
	meta: {
		color: color.fgMuted,
		fontSize: fontSize.x1,
		letterSpacing: letterSpacing.x1,
		lineHeight: lineHeight.x1,
	},
	board: {
		gap: space[2],
		display: "grid",
		gridTemplateColumns: "repeat(8, 72px)",
		width: "632px",
	},
	boardItem: {
		borderRadius: radius.sm,
		alignItems: "center",
		backgroundColor: color.bgElevated,
		display: "flex",
		fontSize: fontSize.x2,
		justifyContent: "center",
		letterSpacing: letterSpacing.x2,
		lineHeight: lineHeight.x2,
		height: "72px",
	},
});
