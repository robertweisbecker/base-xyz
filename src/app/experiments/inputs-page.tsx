import { EnvelopeIcon } from "@phosphor-icons/react/dist/csr/Envelope";
import { GlobeIcon } from "@phosphor-icons/react/dist/csr/Globe";
import { LockIcon } from "@phosphor-icons/react/dist/csr/Lock";
import { CircleIcon } from "@phosphor-icons/react/dist/csr/Circle";
import { PaperclipIcon } from "@phosphor-icons/react/dist/csr/Paperclip";
import { PaperPlaneTiltIcon } from "@phosphor-icons/react/dist/csr/PaperPlaneTilt";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { CopyButton } from "@/blocks";
import {
	Button,
	Checkbox,
	Combobox,
	type FieldSize,
	Grid,
	Heading,
	IconButton,
	InputGroup,
	Kbd,
	KbdGroup,
	NumberField,
	Radio,
	RadioGroup,
	Select,
	Slider,
	Stack,
	Switch,
	Text,
	Textarea,
	TextField,
} from "@/components";
import { breakpoints } from "@/styles/constants.stylex";
import { tokens } from "@/theme/tokens.stylex";
import { ExperimentPage, ExperimentSection } from "./experiment-page";

const fieldSizes = ["sm", "md", "lg"] as const;
const fieldKinds = ["text", "textarea", "number", "select", "combobox", "input-group"] as const;
const fieldStates = ["default", "filled", "invalid", "read-only", "disabled"] as const;
const choiceControlStates = ["off", "on", "read-only", "disabled"] as const;
const valueControlStates = ["resting", "set", "disabled"] as const;

type FieldKind = (typeof fieldKinds)[number];
type FieldState = (typeof fieldStates)[number];
type ChoiceControlState = (typeof choiceControlStates)[number];
type ValueControlState = (typeof valueControlStates)[number];

const fieldKindLabels = {
	text: "Text field",
	textarea: "Textarea",
	number: "Number field",
	select: "Select",
	combobox: "Combobox",
	"input-group": "Input group",
} as const satisfies Record<FieldKind, string>;

const valueControlStateLabels = {
	resting: "Off / minimum",
	set: "On / value",
	disabled: "Disabled",
} as const satisfies Record<ValueControlState, string>;

const frameworkItems = [
	{ label: "React", value: "react" },
	{ label: "Vue", value: "vue" },
] as const;

const regionItems = [
	{ label: "Washington, D.C., USA", value: "iad1" },
	{ label: "Frankfurt, Germany", value: "fra1" },
	{ label: "Tokyo, Japan", value: "hnd1" },
];

export function InputsPage() {
	return (
		<ExperimentPage
			description="Visual parity checks for field sizing, state styling, input-group composition, and control alignment."
			title="Inputs">
			<style>{comparisonLabelReset}</style>

			<ExperimentGroup
				description="Compare the shared field contract across component families before composing complete forms."
				title="Fields">
				<ComparisonContainer
					description="Compare component geometry across the shared small, medium, and large size scale."
					id="field-sizing"
					title="Sizing">
					<FieldSizingMatrix />
					<ComparisonSubsection
						description="Compare a standalone field, composed input group, and action at medium size."
						nested
						title="Cross-component row">
						<CrossComponentRow />
					</ComparisonSubsection>
				</ComparisonContainer>

				<ComparisonContainer
					description="One medium-size matrix keeps the common resting, filled, invalid, read-only, and disabled treatments visible together."
					id="field-states"
					title="States">
					<FieldStateMatrix />
				</ComparisonContainer>
			</ExperimentGroup>

			<ExperimentSection
				description="Realistic compositions exercise inline addons, actions, input types, and multiline content."
				title="Input Group">
				<InputGroupVariations />

				<ComparisonSubsection title="Input padding">
					<InputPaddingComparison />
				</ComparisonSubsection>
			</ExperimentSection>

			<ExperimentGroup
				description="Compare binary choice controls separately from compact controls that represent a changing value."
				title="Controls">
				<ComparisonContainer id="choice-control-sizing" title="Radio and checkbox sizing">
					<ChoiceControlSizeComparison />
				</ComparisonContainer>
				<ComparisonContainer id="choice-control-states" title="Radio and checkbox states">
					<ChoiceControlStateMatrix />
				</ComparisonContainer>
				<ComparisonContainer id="value-control-sizing" title="Switch and slider sizing">
					<ValueControlSizeComparison />
				</ComparisonContainer>
				<ComparisonContainer id="value-control-states" title="Switch and slider states">
					<ValueControlStateMatrix />
				</ComparisonContainer>
			</ExperimentGroup>

			<ExperimentSection
				description="The original product-shaped example remains available after the focused visual comparisons."
				title="Composed form">
				<EnvironmentForm />
			</ExperimentSection>
		</ExperimentPage>
	);
}

function ExperimentGroup({
	children,
	description,
	title,
}: {
	children: ReactNode;
	description?: string;
	title: string;
}) {
	return (
		<Stack gap={5} render={<section />}>
			<Stack gap={1}>
				<Heading render={<h2 />} size="3">
					{title}
				</Heading>
				{description ? (
					<Text color="muted" size="1" wrap="pretty">
						{description}
					</Text>
				) : null}
			</Stack>
			{children}
		</Stack>
	);
}

function ComparisonContainer({
	children,
	description,
	id,
	title,
}: {
	children: ReactNode;
	description?: string;
	id: string;
	title: string;
}) {
	return (
		<Stack
			gap={5}

			render={<section data-comparison-container={id} />}>
			<Stack gap={1}>
				<Heading render={<h3 />} size="2">
					{title}
				</Heading>
				{description ? (
					<Text color="muted" size="1" wrap="pretty">
						{description}
					</Text>
				) : null}
			</Stack>
			<Stack bg="surfaceSubtle" gap={8} p={4} radius="lg">
				{children}
			</Stack>
		</Stack>
	);
}

function ComparisonSubsection({
	children,
	description,
	nested = false,
	title,
}: {
	children: ReactNode;
	description?: string;
	nested?: boolean;
	title: string;
}) {
	return (
		<Stack gap={4} render={<section />}>
			<Stack gap={1}>
				<Heading render={nested ? <h4 /> : <h3 />} size={nested ? "1" : "2"}>
					{title}
				</Heading>
				{description ? (
					<Text color="muted" size="1" wrap="pretty">
						{description}
					</Text>
				) : null}
			</Stack>
			{children}
		</Stack>
	);
}

function FieldSizingMatrix() {
	return (
		<div data-field-sizing-scroll {...stylex.props(styles.horizontalOverflow)}>
			<div {...stylex.props(styles.fieldSizingCanvas)}>
				<div {...stylex.props(styles.fieldHeaderGrid)}>
					<span aria-hidden />
					{fieldKinds.map((kind) => (
						<Text color="muted" key={kind} size="1" wrap="nowrap">
							{fieldKindLabels[kind]}
						</Text>
					))}
				</div>
				<Stack gap={8}>
					{fieldSizes.map((size) => (
						<FieldSizeComparison key={size} size={size} />
					))}
				</Stack>
			</div>
		</div>
	);
}

function FieldSizeComparison({ size }: { size: FieldSize }) {
	return (
		<div data-size-comparison={size} {...stylex.props(styles.fieldSizingRow)}>
			<Text fontWeight="medium" size="1">
				{size}
			</Text>
			<div {...stylex.props(styles.fieldControlGrid, fieldComparisonHeights[size])}>
				{fieldKinds.map((kind) => (
					<div
						data-field-label-hidden={kind === "input-group" ? undefined : ""}
						key={kind}
						{...stylex.props(styles.comparisonControl)}>
						<ComparisonField kind={kind} size={size} state="filled" />
					</div>
				))}
				<HorizontalMeasurementGuides />
			</div>
		</div>
	);
}

function CrossComponentRow() {
	return (
		<div {...stylex.props(styles.horizontalOverflow)}>
			<div {...stylex.props(styles.crossComponentHeaders)}>
				<Text color="muted" size="1">
					Input
				</Text>
				<Text color="muted" size="1">
					Input group
				</Text>
				<Text color="muted" size="1">
					Button
				</Text>
			</div>
			<div {...stylex.props(styles.crossComponentRow, fieldComparisonHeights.md)}>
				<div data-field-label-hidden {...stylex.props(styles.comparisonControl)}>
					<TextField defaultValue="Production" label="Environment" />
				</div>
				<InputGroup.Root>
					<InputGroup.Addon>
						<GlobeIcon aria-hidden />
					</InputGroup.Addon>
					<InputGroup.Input aria-label="Domain" defaultValue="acme.example.com" />
				</InputGroup.Root>
				<Button>Save changes</Button>
				<HorizontalMeasurementGuides />
			</div>
		</div>
	);
}

function FieldStateMatrix() {
	return (
		<div aria-label="Field state comparison" role="region" {...stylex.props(styles.matrixOverflow)}>
			<div {...stylex.props(styles.fieldStateMatrix)}>
				<span aria-hidden />
				{fieldStates.map((state) => (
					<Text color="muted" key={state} size="1" textAlign="center" wrap="nowrap">
						{formatLabel(state)}
					</Text>
				))}
				{fieldKinds.map((kind) => (
					<FieldStateRow key={kind} kind={kind} />
				))}
			</div>
		</div>
	);
}

function FieldStateRow({ kind }: { kind: FieldKind }) {
	return (
		<>
			<Text fontWeight="medium" size="1" wrap="nowrap">
				{fieldKindLabels[kind]}
			</Text>
			{fieldStates.map((state) => (
				<div
					data-field-label-hidden={kind === "input-group" ? undefined : ""}
					key={state}
					{...stylex.props(styles.stateCell)}>
					<ComparisonField kind={kind} size="md" state={state} />
				</div>
			))}
		</>
	);
}

function ComparisonField({ kind, size, state }: { kind: FieldKind; size: FieldSize; state: FieldState }) {
	const disabled = state === "disabled";
	const invalid = state === "invalid";
	const readOnly = state === "read-only";
	const hasValue = state !== "default";
	const label = `${fieldKindLabels[kind]} ${formatLabel(state)}`;

	switch (kind) {
		case "text":
			return (
				<TextField
					defaultValue={hasValue ? (invalid ? "Design Review" : "Design system") : undefined}
					disabled={disabled}
					error={invalid ? "Use lowercase letters only." : undefined}
					label={label}
					placeholder="Enter a value…"
					readOnly={readOnly}
					size={size}
				/>
			);
		case "textarea":
			return (
				<Textarea
					defaultValue={hasValue ? (invalid ? "Missing project context" : "Design system notes") : undefined}
					disabled={disabled}
					error={invalid ? "Add a complete sentence." : undefined}
					label={label}
					placeholder="Enter a value…"
					readOnly={readOnly}
					rows={1}
					size={size}
				/>
			);
		case "number":
			return (
				<NumberField
					defaultValue={hasValue ? 8 : undefined}
					disabled={disabled}
					error={invalid ? "Enter a value below 5." : undefined}
					inputWidth="fill"
					label={label}
					readOnly={readOnly}
					size={size}
				/>
			);
		case "select":
			return (
				<Select.Root<string>
					defaultValue={hasValue ? "react" : null}
					disabled={disabled}
					invalid={invalid}
					items={frameworkItems}
					readOnly={readOnly}
					size={size}>
					<Select.Label>{label}</Select.Label>
					<Select.Trigger placeholder="Choose framework" />
					<Select.Popup>
						<Select.List>
							{frameworkItems.map((item) => (
								<Select.Item key={item.value} value={item.value}>
									{item.label}
								</Select.Item>
							))}
						</Select.List>
					</Select.Popup>
				</Select.Root>
			);
		case "combobox":
			return (
				<Combobox.Root
					defaultValue={hasValue ? "React" : undefined}
					disabled={disabled}
					invalid={invalid}
					items={["React", "Vue"]}
					readOnly={readOnly}
					size={size}>
					<Combobox.Label>{label}</Combobox.Label>
					<Combobox.InputGroup>
						<Combobox.Input placeholder="Choose framework" />
					</Combobox.InputGroup>
					<Combobox.Popup>
						<Combobox.List>
							<Combobox.Item value="React">React</Combobox.Item>
							<Combobox.Item value="Vue">Vue</Combobox.Item>
						</Combobox.List>
					</Combobox.Popup>
				</Combobox.Root>
			);
		case "input-group":
			return (
				<InputGroup.Root size={size}>
					<InputGroup.Input
						aria-invalid={invalid || undefined}
						aria-label={label}
						defaultValue={hasValue ? "Design system" : undefined}
						disabled={disabled}
						placeholder="Search projects…"
						readOnly={readOnly}
					/>
					<InputGroup.Addon position="end">
						<CircleIcon aria-hidden />
					</InputGroup.Addon>
				</InputGroup.Root>
			);
	}
}

function HorizontalMeasurementGuides() {
	return (
		<div aria-hidden {...stylex.props(styles.measurementOverlay)}>
			<MeasurementLine position="top" />
			<MeasurementLine position="baseline" />
			<MeasurementLine position="bottom" />
		</div>
	);
}

function MeasurementLine({ position }: { position: "top" | "baseline" | "bottom" }) {
	return (
		<div
			data-measurement-guide={position}
			{...stylex.props(
				styles.measurementLine,
				position === "top" && styles.topGuide,
				position === "baseline" && styles.baselineGuide,
				position === "bottom" && styles.bottomGuide,
			)}
		/>
	);
}

function InputGroupVariations() {
	return (
		<Grid gap={6} xstyle={styles.inputGroupGrid}>
			<InputGroupSpecimen label="Search projects">
				<InputGroup.Root>
					<InputGroup.Addon>
						<CircleIcon aria-hidden />
					</InputGroup.Addon>
					<InputGroup.Input aria-label="Search projects" placeholder="Search by name…" type="search" />
					<InputGroup.Addon position="end">
						<KbdGroup>
							<Kbd size="sm">⌘</Kbd>
							<Kbd size="sm">K</Kbd>
						</KbdGroup>
					</InputGroup.Addon>
				</InputGroup.Root>
			</InputGroupSpecimen>
			<InputGroupSpecimen label="Configure a domain">
				<InputGroup.Root>
					<InputGroup.Addon>https://</InputGroup.Addon>
					<InputGroup.Input aria-label="Project domain" defaultValue="design-system" type="url" />
					<InputGroup.Addon position="end">.example.com</InputGroup.Addon>
				</InputGroup.Root>
			</InputGroupSpecimen>
			<InputGroupSpecimen label="Invite a teammate">
				<InputGroup.Root>
					<InputGroup.Addon>
						<EnvelopeIcon aria-hidden />
					</InputGroup.Addon>
					<InputGroup.Input aria-label="Teammate email" placeholder="name@company.com" type="email" />
					<InputGroup.Actions>
						<Button size="xs" variant="neutral">
							Invite
						</Button>
					</InputGroup.Actions>
				</InputGroup.Root>
			</InputGroupSpecimen>
			<InputGroupSpecimen label="Copy an API token">
				<InputGroup.Root variant="subtle">
					<InputGroup.Addon>
						<LockIcon aria-hidden />
					</InputGroup.Addon>
					<InputGroup.Input aria-label="API token" defaultValue="sk_live_••••••••42" readOnly />
					<InputGroup.Actions>
						<CopyButton aria-label="Copy API token" size="xs" value="sk_live_••••••••42" variant="ghost" />
					</InputGroup.Actions>
				</InputGroup.Root>
			</InputGroupSpecimen>
			<InputGroupSpecimen label="Set a monthly limit">
				<InputGroup.Root>
					<InputGroup.Addon>$</InputGroup.Addon>
					<InputGroup.Input aria-label="Monthly limit" defaultValue="250" inputMode="decimal" type="number" />
					<InputGroup.Addon position="end">USD</InputGroup.Addon>
				</InputGroup.Root>
			</InputGroupSpecimen>
			<InputGroupSpecimen label="Reply to a review">
				<InputGroup.Root variant="elevated">
					<InputGroup.Header>Design-system review</InputGroup.Header>
					<InputGroup.Textarea aria-label="Review reply" placeholder="Write a reply…" rows={3} />
					<InputGroup.Footer>
						<InputGroup.Actions position="start">
							<IconButton icon={<PaperclipIcon aria-hidden />} label="Attach a file" size="sm" variant="ghost" />
						</InputGroup.Actions>
						<InputGroup.Actions>
							<Button size="sm" startSlot={<PaperPlaneTiltIcon aria-hidden weight="fill" />}>
								Send
							</Button>
						</InputGroup.Actions>
					</InputGroup.Footer>
				</InputGroup.Root>
			</InputGroupSpecimen>
		</Grid>
	);
}

function InputGroupSpecimen({ children, label }: { children: ReactNode; label: string }) {
	return (
		<Stack gap={2}>
			<Text color="muted" size="1">
				{label}
			</Text>
			{children}
		</Stack>
	);
}

function InputPaddingComparison() {
	return (
		<Stack gap={2} maxWidth="36rem">
			<Text color="muted" size="1">
				Standalone input
			</Text>
			<div {...stylex.props(styles.paddingComparison)}>
				<div data-field-label-hidden>
					<TextField defaultValue="design-system" label="Project slug" />
				</div>
				<Text color="muted" size="1">
					Input group
				</Text>
				<InputGroup.Root>
					<InputGroup.Input aria-label="Project domain" defaultValue="design-system.example.com" />
				</InputGroup.Root>
				<div aria-hidden data-padding-guide="start" {...stylex.props(styles.paddingGuide, styles.paddingGuideStart)} />
				<div aria-hidden data-padding-guide="end" {...stylex.props(styles.paddingGuide, styles.paddingGuideEnd)} />
			</div>
		</Stack>
	);
}

function ChoiceControlSizeComparison() {
	return (
		<div {...stylex.props(styles.matrixOverflow)}>
			<div {...stylex.props(styles.choiceControlSizeMatrix)}>
				<span aria-hidden />
				<Text color="muted" size="1" textAlign="center">
					Radio
				</Text>
				<Text color="muted" size="1" textAlign="center">
					Checkbox
				</Text>
				{fieldSizes.map((size) => (
					<ChoiceControlSizeRow key={size} size={size} />
				))}
			</div>
		</div>
	);
}

function ChoiceControlSizeRow({ size }: { size: FieldSize }) {
	const choiceSize = size === "lg" ? null : size;
	return (
		<>
			<Text fontWeight="medium" size="1">
				{size}
			</Text>
			<div {...stylex.props(styles.controlCell)}>
				{choiceSize ? (
					<div data-radio-comparison>
						<RadioGroup defaultValue={size} label={`${size} radio`} size={choiceSize}>
							<Radio label={`${size} radio`} value={size} visuallyHideLabel />
						</RadioGroup>
					</div>
				) : (
					<UnsupportedSize />
				)}
			</div>
			<div {...stylex.props(styles.controlCell)}>
				{choiceSize ? (
					<Checkbox defaultChecked label={`${size} checkbox`} size={choiceSize} visuallyHideLabel />
				) : (
					<UnsupportedSize />
				)}
			</div>
		</>
	);
}

function UnsupportedSize() {
	return (
		<Text color="muted" size="1">
			Not supported
		</Text>
	);
}

function ChoiceControlStateMatrix() {
	return (
		<div aria-label="Radio and checkbox state comparison" role="region" {...stylex.props(styles.matrixOverflow)}>
			<div {...stylex.props(styles.choiceControlStateMatrix)}>
				<span aria-hidden />
				{choiceControlStates.map((state) => (
					<Text color="muted" key={state} size="1" textAlign="center" wrap="nowrap">
						{formatLabel(state)}
					</Text>
				))}
				<ChoiceControlStateRow label="Radio" renderControl={(state) => <ComparisonRadio state={state} />} />
				<ChoiceControlStateRow label="Checkbox" renderControl={(state) => <ComparisonCheckbox state={state} />} />
			</div>
		</div>
	);
}

function ChoiceControlStateRow({
	label,
	renderControl,
}: {
	label: string;
	renderControl: (state: ChoiceControlState) => ReactNode;
}) {
	return (
		<>
			<Text fontWeight="medium" size="1">
				{label}
			</Text>
			{choiceControlStates.map((state) => (
				<div key={state} {...stylex.props(styles.controlCell)}>
					{renderControl(state)}
				</div>
			))}
		</>
	);
}

function ComparisonRadio({ state }: { state: ChoiceControlState }) {
	return (
		<div data-radio-comparison>
			<RadioGroup
				defaultValue={state === "on" ? state : undefined}
				disabled={state === "disabled"}
				label={`Radio ${formatLabel(state)}`}>
				<Radio label={`Radio ${formatLabel(state)}`} readOnly={state === "read-only"} value={state} visuallyHideLabel />
			</RadioGroup>
		</div>
	);
}

function ComparisonCheckbox({ state }: { state: ChoiceControlState }) {
	return (
		<Checkbox
			defaultChecked={state === "on"}
			disabled={state === "disabled"}
			label={`Checkbox ${formatLabel(state)}`}
			readOnly={state === "read-only"}
			visuallyHideLabel
		/>
	);
}

function ValueControlSizeComparison() {
	return (
		<div {...stylex.props(styles.matrixOverflow)}>
			<div {...stylex.props(styles.valueControlSizeMatrix)}>
				<span aria-hidden />
				<Text color="muted" size="1" textAlign="center">
					Switch
				</Text>
				<Text color="muted" size="1" textAlign="center">
					Slider
				</Text>
				{fieldSizes.map((size) => (
					<ValueControlSizeRow key={size} size={size} />
				))}
			</div>
		</div>
	);
}

function ValueControlSizeRow({ size }: { size: FieldSize }) {
	return (
		<>
			<Text fontWeight="medium" size="1">
				{size}
			</Text>
			<div {...stylex.props(styles.controlCell)}>
				<Switch defaultChecked label={`${size} switch`} size={size} visuallyHideLabel />
			</div>
			<div {...stylex.props(styles.sliderCell)}>
				<ComparisonSlider label={`${size} slider`} size={size} value={60} />
			</div>
		</>
	);
}

function ValueControlStateMatrix() {
	return (
		<div aria-label="Switch and slider state comparison" role="region" {...stylex.props(styles.matrixOverflow)}>
			<div {...stylex.props(styles.valueControlStateMatrix)}>
				<span aria-hidden />
				{valueControlStates.map((state) => (
					<Text color="muted" key={state} size="1" textAlign="center" wrap="nowrap">
						{valueControlStateLabels[state]}
					</Text>
				))}
				<ValueControlStateRow label="Switch" renderControl={(state) => <ComparisonSwitch state={state} />} />
				<ValueControlStateRow label="Slider" renderControl={(state) => <ComparisonStateSlider state={state} />} wide />
			</div>
		</div>
	);
}

function ValueControlStateRow({
	label,
	renderControl,
	wide = false,
}: {
	label: string;
	renderControl: (state: ValueControlState) => ReactNode;
	wide?: boolean;
}) {
	return (
		<>
			<Text fontWeight="medium" size="1">
				{label}
			</Text>
			{valueControlStates.map((state) => (
				<div key={state} {...stylex.props(wide ? styles.sliderCell : styles.controlCell)}>
					{renderControl(state)}
				</div>
			))}
		</>
	);
}

function ComparisonSwitch({ state }: { state: ValueControlState }) {
	return (
		<Switch
			defaultChecked={state !== "resting"}
			disabled={state === "disabled"}
			label={`Switch ${valueControlStateLabels[state]}`}
			visuallyHideLabel
		/>
	);
}

function ComparisonStateSlider({ state }: { state: ValueControlState }) {
	return (
		<ComparisonSlider
			disabled={state === "disabled"}
			label={`Slider ${valueControlStateLabels[state]}`}
			value={state === "resting" ? 0 : 65}
		/>
	);
}

function ComparisonSlider({
	disabled = false,
	label,
	size = "md",
	value,
}: {
	disabled?: boolean;
	label: string;
	size?: FieldSize;
	value: number;
}) {
	return (
		<Slider.Root defaultValue={value} disabled={disabled} size={size} step={5}>
			<Slider.Control markers={{ every: 4 }}>
				<Slider.Thumb aria-label={label} />
			</Slider.Control>
		</Slider.Root>
	);
}

function EnvironmentForm() {
	return (
		<form onSubmit={(event) => event.preventDefault()}>
			<Stack gap={6}>
				<Grid gap={4} xstyle={styles.formFieldGrid}>
					<TextField
						description="Used in deployment URLs and CLI commands."
						label="Environment name"
						name="environment-name"
						placeholder="Preview"
						required
					/>
					<Select.Root<string> defaultValue="iad1" items={regionItems} name="region">
						<Select.Label>Primary region</Select.Label>
						<Select.Trigger />
						<Select.Popup>
							<Select.List>
								{regionItems.map((item) => (
									<Select.Item key={item.value} value={item.value}>
										{item.label}
									</Select.Item>
								))}
							</Select.List>
						</Select.Popup>
					</Select.Root>
				</Grid>
				<RadioGroup defaultValue="preview" label="Environment visibility" name="visibility">
					<Radio value="private" label="Private" description="Only invited workspace members can access it." />
					<Radio value="preview" label="Preview" description="Anyone with a signed preview link can access it." />
				</RadioGroup>
				<Textarea
					description="Shown to teammates when they select this environment."
					label="Description"
					maxRows={6}
					minRows={3}
					name="description"
					placeholder="Used for pull request previews and design reviews."
				/>
				<Stack gap={3}>
					<Switch
						defaultChecked
						description="Keep one successful deployment ready for immediate rollback."
						label="Automatic rollback"
						name="automatic-rollback"
					/>
					<Checkbox
						defaultChecked
						description="Use the workspace retention and access policies."
						label="Apply workspace defaults"
						name="workspace-defaults"
					/>
				</Stack>
				<Stack align="center" gap={3} justify="end" orientation="horizontal">
					<Button type="button" variant="secondary">
						Cancel
					</Button>
					<Button type="submit">Create environment</Button>
				</Stack>
			</Stack>
		</form>
	);
}

function formatLabel(value: string) {
	return value.replaceAll("-", " ").replace(/^./, (character) => character.toUpperCase());
}

const comparisonLabelReset = `
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

const styles = stylex.create({
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
	baselineGuide: { borderBlockStartStyle: "dashed", top: "calc(50% + 0.34em)", opacity: 0.5 },
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
	inputGroupGrid: { gridTemplateColumns: { default: "minmax(0, 1fr)", [breakpoints.lg]: "repeat(2, minmax(0, 1fr))" } },
	paddingComparison: { gap: tokens["--space-4"], display: "flex", flexDirection: "column", position: "relative" },
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
	sliderCell: { alignItems: "center", display: "flex", minHeight: tokens["--size-control-lg"], width: "100%" },
	formFieldGrid: { gridTemplateColumns: { default: "minmax(0, 1fr)", [breakpoints.sm]: "repeat(2, minmax(0, 1fr))" } },
});

const fieldComparisonHeights = stylex.create({
	sm: { height: tokens["--size-control-sm"] },
	md: { height: tokens["--size-control-md"] },
	lg: { height: tokens["--size-control-lg"] },
});
