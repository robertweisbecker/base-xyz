import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import {
	Badge,
	Box,
	Button,
	Card,
	CardFooter,
	Checkbox,
	CheckboxGroup,
	Grid,
	Radio,
	RadioGroup,
	Stack,
	Switch,
	Text,
	TextField,
} from "@/components";
import { breakpoints } from "@/styles/constants.stylex";
import { tokens } from "@/theme/tokens.stylex";

const meta = {
	title: "Design system/Theme props verification",
	parameters: {
		controls: { disable: true },
		layout: "fullscreen",
	},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const unsupportedButtonProps = { bg: "surface" };

export const AllCapabilities: Story = {
	render: () => (
		<div data-testid="fixture-ready" {...stylex.props(styles.fixture)}>
			<Stack data-testid="vertical-reverse" reverse>
				<span>First</span>
				<span>Second</span>
			</Stack>
			<CardFooter data-testid="horizontal-reverse" reverse>
				<span>First</span>
				<span>Second</span>
			</CardFooter>
			<Stack data-testid="horizontal-stack" orientation="horizontal" reverse>
				<span>First</span>
				<span>Second</span>
			</Stack>
			<Grid data-testid="scalar-grid" columns={4} width="240px">
				<Box data-testid="scalar-span" columnSpan={2}>
					Span
				</Box>
				<Box>Two</Box>
				<Box>Three</Box>
				<Box>Four</Box>
			</Grid>
			<Grid columns={12} width="240px">
				<Box data-testid="predeclared-responsive-span" style={styles.responsiveSpan}>
					Responsive span style
				</Box>
			</Grid>
			<Card
				data-testid="composed-card"
				orientation="horizontal"
				radius="lg"
				shadow="md">
				<span>Card content</span>
			</Card>
			<Box data-testid="scalar-surface" radius="lg" shadow="md">
				Scalar surface
			</Box>

			<Box data-testid="precedence" p={1} ps={3} px={2} style={styles.finalPadding}>
				Precedence
			</Box>
			<Box data-testid="logical-rtl" dir="rtl" me={4} ms={2}>
				Logical spacing
			</Box>
			<Box dir="rtl" height="20px" position="relative">
				<Box data-testid="inset-start-rtl" insetStart={2} position="absolute" />
				<Box data-testid="inset-end-rtl" insetEnd={-2} position="absolute" />
			</Box>

			<div {...stylex.props(styles.fixedWidth)}>
				<Badge data-testid="full-badge" width="full">
					Full badge
				</Badge>
			</div>
			<div {...stylex.props(styles.fixedWidth)}>
				<Badge data-testid="bounded-badge" maxWidth="100px" width="full">
					Bounded badge
				</Badge>
			</div>
			<div {...stylex.props(styles.fixedWidth)}>
				<Button data-testid="full-button" width="full">
					Full width
				</Button>
			</div>

			<Box aria-label="Semantic box" bg="canvas" color="fg" render={<section />}>
				Semantic box
			</Box>
			<Button data-testid="filtered-button" {...unsupportedButtonProps}>
				Filtered prop
			</Button>
			<Text data-testid="aligned-text" mb={2} textAlign="center">
				Aligned text
			</Text>

			<TextField
				data-testid="field-control"
				gap={4}
				label="Project name"
				orientation="horizontal"
			/>
			<Switch
				data-testid="horizontal-switch"
				description="Receive project status changes."
				gap={4}
				label="Project notifications"
				orientation="horizontal"
			/>
			<CheckboxGroup data-testid="inline-checkbox-group" inline label="Inline choices">
				<Checkbox label="First choice" value="first" />
				<Checkbox label="Second choice" value="second" />
			</CheckboxGroup>
			<RadioGroup data-testid="stacked-radio-group" label="Stacked choices" name="stacked-choices">
				<Radio label="First choice" value="first" />
				<Radio label="Second choice" value="second" />
			</RadioGroup>
		</div>
	),
};

const styles = stylex.create({
	fixture: {
		padding: tokens["--space-4"],
		gap: tokens["--space-4"],
		display: "flex",
		flexDirection: "column",
	},
	finalPadding: {
		paddingInlineStart: tokens["--space-4"],
	},
	fixedWidth: {
		width: "200px",
	},
	responsiveSpan: {
		gridColumn: {
			default: "span 12 / span 12",
			[breakpoints.md]: "span 6 / span 6",
		},
	},
});
