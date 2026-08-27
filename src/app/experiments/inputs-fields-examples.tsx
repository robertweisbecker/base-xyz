import { CircleIcon } from "@phosphor-icons/react/dist/csr/Circle";
import { GlobeIcon } from "@phosphor-icons/react/dist/csr/Globe";
import * as stylex from "@stylexjs/stylex";
import {
	Button,
	Combobox,
	type FieldSize,
	InputGroup,
	NumberField,
	Select,
	Stack,
	Text,
	Textarea,
	TextField,
} from "@/components";
import { fieldSizes, formatComparisonLabel } from "./inputs-comparison-model";
import { fieldComparisonHeights, inputsPageStyles as styles } from "./inputs-page.styles";

const fieldKinds = ["text", "textarea", "number", "select", "combobox", "input-group"] as const;
const fieldStates = ["default", "filled", "invalid", "read-only", "disabled"] as const;

type FieldKind = (typeof fieldKinds)[number];
type FieldState = (typeof fieldStates)[number];

const fieldKindLabels = {
	text: "Text field",
	textarea: "Textarea",
	number: "Number field",
	select: "Select",
	combobox: "Combobox",
	"input-group": "Input group",
} as const satisfies Record<FieldKind, string>;

const frameworkItems = [
	{ label: "React", value: "react" },
	{ label: "Vue", value: "vue" },
] as const;

export function FieldSizingMatrix() {
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
						{...stylex.props(styles.comparisonControl)}
					>
						<ComparisonField kind={kind} size={size} state="filled" />
					</div>
				))}
				<HorizontalMeasurementGuides />
			</div>
		</div>
	);
}

export function CrossComponentRow() {
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

export function FieldStateMatrix() {
	return (
		<div aria-label="Field state comparison" role="region" {...stylex.props(styles.matrixOverflow)}>
			<div {...stylex.props(styles.fieldStateMatrix)}>
				<span aria-hidden />
				{fieldStates.map((state) => (
					<Text color="muted" key={state} size="1" textAlign="center" wrap="nowrap">
						{formatComparisonLabel(state)}
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
					{...stylex.props(styles.stateCell)}
				>
					<ComparisonField kind={kind} size="md" state={state} />
				</div>
			))}
		</>
	);
}

function ComparisonField({
	kind,
	size,
	state,
}: {
	kind: FieldKind;
	size: FieldSize;
	state: FieldState;
}) {
	const disabled = state === "disabled";
	const invalid = state === "invalid";
	const readOnly = state === "read-only";
	const hasValue = state !== "default";
	const label = `${fieldKindLabels[kind]} ${formatComparisonLabel(state)}`;

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
					defaultValue={
						hasValue ? (invalid ? "Missing project context" : "Design system notes") : undefined
					}
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
					size={size}
				>
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
					size={size}
				>
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
