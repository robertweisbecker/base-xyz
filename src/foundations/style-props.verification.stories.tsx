import type { Meta, StoryObj } from "@storybook/react-vite";
import x from "@stylexjs/atoms";
import * as stylex from "@stylexjs/stylex";
import { useRef, useState } from "react";
import {
	Badge,
	Box,
	Button,
	Card,
	Checkbox,
	CheckboxGroup,
	CodeBlock,
	Combobox,
	Dialog,
	Grid,
	Heading,
	Radio,
	RadioGroup,
	Stack,
	Text,
	TextField,
} from "@/components";
import { breakpoints } from "@/styles/constants.stylex";
import { tokens } from "@/theme/tokens.stylex";

const meta = {
	title: "Design system/Style props verification",
	parameters: {
		controls: { disable: true },
		layout: "fullscreen",
	},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const spacingOverride = stylex.createTheme(tokens, {
	"--space-4": "2rem",
});

function LoginForm() {
	const [submitting, setSubmitting] = useState(false);

	return (
		<Card.Root data-testid="login-card" m={2} xstyle={styles.loginCard}>
			<Card.Header>
				<Card.Title>Sign in</Card.Title>
				<Card.Description>Use your workspace credentials.</Card.Description>
			</Card.Header>
			<Card.Content>
				<Stack gap={3}>
					<TextField label="Email" type="email" />
					<TextField label="Password" type="password" />
					<Button
						aria-pressed={submitting}
						data-testid="atom-submit"
						onClick={() => setSubmitting((value) => !value)}
						xstyle={[styles.submitButton, x.width["100%"], submitting && x.opacity["0.5"]]}
					>
						{submitting ? "Reset" : "Sign in"}
					</Button>
				</Stack>
			</Card.Content>
		</Card.Root>
	);
}

function ChipOverflowFixture() {
	const anchor = useRef<HTMLDivElement>(null);

	return (
		<div ref={anchor}>
			<Combobox.ChipOverflow
				anchor={anchor}
				data-forwarded="true"
				data-testid="chip-overflow-trigger"
				label="+3 more"
				xstyle={x.marginInlineStart._8px}
			>
				<span data-testid="chip-overflow-tooltip">Ada, Grace, Linus</span>
			</Combobox.ChipOverflow>
		</div>
	);
}

export const ConsumerContract: Story = {
	render: () => (
		<Stack data-testid="fixture-ready" gap={4} p={4}>
			<Heading mb={1} size="5">
				Consumer contract
			</Heading>
			<Text mb={2}>
				Broad layout is explicit; semantic roots expose common margins and escape hatches.
			</Text>

			<Grid columns={4} gap={2} width="240px">
				<Box columnSpan={2}>Two columns</Box>
				<Box>One</Box>
				<Box>One</Box>
			</Grid>
			<Grid columns={12} width="240px">
				<Box data-testid="responsive-created-style" xstyle={styles.responsiveSpan}>
					Responsive created style
				</Box>
			</Grid>

			<Button data-testid="margin-precedence" m={1} mx={2.5} mt={3}>
				Margin precedence
			</Button>
			<Badge data-testid="logical-margin" dir="rtl" ms={2} me={4}>
				Logical margins
			</Badge>
			<Box data-testid="auto-margin-row" display="flex" width="240px">
				<Button data-testid="auto-margin" ms="auto">
					Pushed to inline end
				</Button>
			</Box>
			<Card.Root data-testid="negative-margin" mt={-2.5}>
				<Card.Content>Negative margin</Card.Content>
			</Card.Root>
			<Button data-testid="css-margin" mt="13px">
				CSS margin
			</Button>
			<Box data-testid="css-padding" p="7px" position="relative">
				<Box data-testid="css-inset" insetTop="11px" position="absolute">
					CSS inset
				</Box>
			</Box>
			<Stack data-testid="css-gap" gap="9px">
				<span>First</span>
				<span>Second</span>
			</Stack>
			<Box data-testid="border-style-default" borderStyle="dashed">
				Border style default
			</Box>
			<Box
				data-testid="border-width-override"
				borderColor="default"
				borderStyle="dashed"
				borderWidth={5}
			>
				Border width override
			</Box>
			<Button data-testid="xstyle-margin-wins" m={4} xstyle={styles.zeroMargins}>
				xstyle wins
			</Button>
			<Button
				data-testid="native-style-wins"
				style={{ color: "rgb(0, 0, 255)" }}
				xstyle={styles.redText}
			>
				Native style wins
			</Button>
			<Dialog.Header
				data-testid="compound-native-style-wins"
				style={{ color: "rgb(0, 0, 255)" }}
				xstyle={[styles.redText, x.width("123px")]}
			>
				Compound native style wins
			</Dialog.Header>
			<CodeBlock
				aria-label="Example source"
				data-testid="code-block-pre"
				id="code-block-pre"
				mt={4}
			>
				{"const ready = true;"}
			</CodeBlock>
			<ChipOverflowFixture />

			<TextField data-testid="field-control" label="Project name" mt={4} />

			<div data-testid="spacing-theme" {...stylex.props(spacingOverride)}>
				<Button data-testid="themed-margin" m={4}>
					Themed spacing
				</Button>
			</div>

			<LoginForm />

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
	loginCard: {
		maxWidth: 360,
		width: "100%",
	},
	redText: {
		color: "rgb(255, 0, 0)",
	},
	responsiveSpan: {
		gridColumn: {
			default: "span 12 / span 12",
			[breakpoints.md]: "span 6 / span 6",
		},
	},
	submitButton: {
		marginBlockStart: tokens["--space-1"],
	},
	zeroMargins: {
		marginBlockEnd: 0,
		marginBlockStart: 0,
		marginInlineEnd: 0,
		marginInlineStart: 0,
	},
});
