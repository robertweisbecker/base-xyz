import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import {
	Badge,
	Box,
	Button,
	Card,
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
		<Stack data-testid="fixture-ready" gap={4} p={4}>
			<Stack data-testid="vertical-reverse" reverse>
				<span>First</span>
				<span>Second</span>
			</Stack>
			<Card.Footer data-testid="horizontal-reverse" reverse>
				<span>First</span>
				<span>Second</span>
			</Card.Footer>
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
			<Card.Root
				data-testid="composed-card"
				orientation="horizontal"
				radius="lg"
				shadow="md">
				<span>Card content</span>
			</Card.Root>
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

			<Box width="200px">
				<Badge data-testid="full-badge" width="full">
					Full badge
				</Badge>
			</Box>
			<Box width="200px">
				<Badge data-testid="bounded-badge" maxWidth="100px" width="full">
					Bounded badge
				</Badge>
			</Box>
			<Box width="200px">
				<Button data-testid="full-button" width="full">
					Full width
				</Button>
			</Box>

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
		</Stack>
	),
};

const styles = stylex.create({
	finalPadding: {
		paddingInlineStart: tokens["--space-4"],
	},
	responsiveSpan: {
		gridColumn: {
			default: "span 12 / span 12",
			[breakpoints.md]: "span 6 / span 6",
		},
	},
});
