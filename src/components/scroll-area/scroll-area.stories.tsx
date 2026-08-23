import type { Meta, StoryObj } from "@storybook/react-vite";
import x from "@stylexjs/atoms";
import * as stylex from "@stylexjs/stylex";
import { Box, Grid, Stack } from "@/components/layout/layout";
import { Separator } from "@/components/separator/separator";
import { Text } from "@/components/text/text";
import { tokens } from "@/theme/tokens.stylex";
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
		disableFade: { control: "boolean" },
		label: { control: "text" },
		orientation: { control: "inline-radio", options: ["vertical", "horizontal", "both"] },
		showScrollbar: { control: "inline-radio", options: ["always", "scroll", "hover"] },
		size: { control: "inline-radio", options: ["fill", "content"] },
		style: { control: false },
	},
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	render: ({ disableFade, label, orientation, showScrollbar, size }) => (
		<Box
			style={
				orientation === "horizontal"
					? styles.playgroundFrameHorizontal
					: orientation === "both"
						? styles.playgroundFrameBoth
						: styles.playgroundFrame
			}>
			<ScrollArea
				disableFade={disableFade}
				label={label}
				orientation={orientation}
				showScrollbar={showScrollbar}
				size={size}
				xstyle={styles.surface}>
				<div {...stylex.props(x.padding(tokens["--space-3"]))}>
					{orientation === "horizontal" ? (
						<div {...stylex.props(styles.horizontalList)}>
							{milestones.map((item) => (
								<div key={item.label} {...stylex.props(styles.milestone)}>
									<span>{item.label}</span>
									<Text color="muted" render={<span />} size="1">
										{item.date}
									</Text>
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
									<Text color="muted" render={<span />} size="1">
										{item.status}
									</Text>
								</div>
							))}
						</div>
					)}
				</div>
			</ScrollArea>
		</Box>
	),
};

export const Orientations: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack gap={6} wrap="wrap" orientation="horizontal">
			<Stack gap={2}>
				<Text color="muted" size="1">
					Vertical
				</Text>
				<Box xstyle={styles.verticalFrame}>
					<ScrollArea label="Recent prototypes" xstyle={styles.surface}>
						<div {...stylex.props(x.padding(tokens["--space-3"]))}>
							<div {...stylex.props(styles.list)}>
								{items.map((item) => (
									<div key={item.label} {...stylex.props(styles.listItem)}>
										<span>{item.label}</span>
										<Text color="muted" render={<span />} size="1">
											{item.status}
										</Text>
									</div>
								))}
							</div>
						</div>
					</ScrollArea>
				</Box>
			</Stack>
			<Stack gap={2}>
				<Text color="muted" size="1">
					Horizontal
				</Text>
				<Box xstyle={styles.horizontalFrame}>
					<ScrollArea
						label="Project milestones"
						orientation="horizontal"
						xstyle={styles.surface}>
						<div {...stylex.props(x.padding(tokens["--space-3"]))}>
							<div {...stylex.props(styles.horizontalList)}>
								{milestones.map((item) => (
									<div key={item.label} {...stylex.props(styles.milestone)}>
										<span>{item.label}</span>
										<Text color="muted" render={<span />} size="1">
											{item.date}
										</Text>
									</div>
								))}
							</div>
						</div>
					</ScrollArea>
				</Box>
			</Stack>
			<Stack gap={2}>
				<Text color="muted" size="1">
					Both axes
				</Text>
				<Box xstyle={styles.bothFrame}>
					<ScrollArea label="Planning board" orientation="both" xstyle={styles.surface}>
						<div {...stylex.props(x.padding(tokens["--space-3"]))}>
							<div {...stylex.props(styles.board)}>
								{Array.from({ length: 48 }, (_, index) => (
									<div key={index} {...stylex.props(styles.boardItem)}>
										{index + 1}
									</div>
								))}
							</div>
						</div>
					</ScrollArea>
				</Box>
			</Stack>
		</Stack>
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
		<Stack gap={8}>
			<Stack gap={4}>
				<Text color="muted" size="1">
					Scrollbar visibility
				</Text>
				<Grid gap={6} xstyle={styles.behaviorExamples}>
					{scrollbarVisibilityModes.map((mode) => (
						<Stack gap={2} key={mode.value}>
							<Text color="muted" size="1">
								{mode.label}
							</Text>
							<Box xstyle={styles.visibilityFrame}>
								<ScrollArea
									label={`${mode.label} scrollbar visibility`}
									showScrollbar={mode.value}
									xstyle={styles.surface}>
									<div {...stylex.props(x.padding(tokens["--space-3"]))}>
										<div {...stylex.props(styles.list)}>
											{items.slice(0, 8).map((item) => (
												<div key={item.label} {...stylex.props(styles.listItem)}>
													<span>{item.label}</span>
													<Text color="muted" render={<span />} size="1">
														{item.status}
													</Text>
												</div>
											))}
										</div>
									</div>
								</ScrollArea>
							</Box>
						</Stack>
					))}
				</Grid>
			</Stack>
			<Separator />
			<Stack gap={4}>
				<Text color="muted" size="1">
					Edge fade
				</Text>
				<Grid gap={6} xstyle={styles.behaviorExamples}>
					{fadeModes.map((mode) => (
						<Stack gap={2} key={mode.label}>
							<Text color="muted" size="1">
								{mode.label}
							</Text>
							<Box xstyle={styles.fadeFrame}>
								<ScrollArea
									label={mode.label}
									disableFade={mode.disableFade}
									xstyle={styles.surface}>
									<div {...stylex.props(x.padding(tokens["--space-3"]))}>
										<div {...stylex.props(styles.list)}>
											{items.map((item) => (
												<div key={item.label} {...stylex.props(styles.listItem)}>
													<span>{item.label}</span>
													<Text color="muted" render={<span />} size="1">
														{item.status}
													</Text>
												</div>
											))}
										</div>
									</div>
								</ScrollArea>
							</Box>
						</Stack>
					))}
				</Grid>
			</Stack>
		</Stack>
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
	visibilityFrame: {
		height: "200px",
		width: "280px",
	},
	behaviorExamples: {
		gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
	},
	fadeFrame: {
		height: "220px",
		width: "280px",
	},
	surface: {
		borderRadius: tokens["--radius-md"],
		backgroundColor: tokens["--color-gray-a1"],
	},
	list: {
		gap: tokens["--space-2"],
		display: "flex",
		flexDirection: "column",
	},
	listItem: {
		borderRadius: tokens["--radius-sm"],
		paddingBlock: tokens["--space-2"],
		paddingInline: tokens["--space-3"],
		alignItems: "center",
		backgroundColor: tokens["--elevated"],
		boxShadow: tokens["--shadow-sm"],
		display: "flex",
		fontSize: tokens["--font-size-2"],
		justifyContent: "space-between",
		letterSpacing: tokens["--letter-spacing-2"],
		lineHeight: tokens["--line-height-2"],
		minHeight: "44px",
	},
	horizontalList: {
		gap: tokens["--space-2"],
		display: "flex",
		width: "980px",
	},
	milestone: {
		borderRadius: tokens["--radius-sm"],
		gap: tokens["--space-1"],
		paddingInline: tokens["--space-4"],
		backgroundColor: tokens["--elevated"],
		display: "flex",
		flexDirection: "column",
		flexShrink: 0,
		fontSize: tokens["--font-size-2"],
		justifyContent: "center",
		letterSpacing: tokens["--letter-spacing-2"],
		lineHeight: tokens["--line-height-2"],
		minHeight: "76px",
		width: "140px",
	},
	board: {
		gap: tokens["--space-2"],
		display: "grid",
		gridTemplateColumns: "repeat(8, 72px)",
		width: "632px",
	},
	boardItem: {
		borderRadius: tokens["--radius-sm"],
		alignItems: "center",
		backgroundColor: tokens["--elevated"],
		display: "flex",
		fontSize: tokens["--font-size-2"],
		justifyContent: "center",
		letterSpacing: tokens["--letter-spacing-2"],
		lineHeight: tokens["--line-height-2"],
		height: "72px",
	},
});
