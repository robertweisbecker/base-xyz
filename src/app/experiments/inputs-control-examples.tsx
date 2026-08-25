import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import {
	Checkbox,
	type FieldSize,
	Radio,
	RadioGroup,
	Slider,
	Switch,
	Text,
} from "@/components";
import { fieldSizes, formatComparisonLabel } from "./inputs-comparison-model";
import { inputsPageStyles as styles } from "./inputs-page.styles";

const choiceControlStates = ["off", "on", "read-only", "disabled"] as const;
const valueControlStates = ["resting", "set", "disabled"] as const;

type ChoiceControlState = (typeof choiceControlStates)[number];
type ValueControlState = (typeof valueControlStates)[number];

const valueControlStateLabels = {
	resting: "Off / minimum",
	set: "On / value",
	disabled: "Disabled",
} as const satisfies Record<ValueControlState, string>;

export function ChoiceControlSizeComparison() {
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

export function ChoiceControlStateMatrix() {
	return (
		<div aria-label="Radio and checkbox state comparison" role="region" {...stylex.props(styles.matrixOverflow)}>
			<div {...stylex.props(styles.choiceControlStateMatrix)}>
				<span aria-hidden />
				{choiceControlStates.map((state) => (
					<Text color="muted" key={state} size="1" textAlign="center" wrap="nowrap">
						{formatComparisonLabel(state)}
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
				label={`Radio ${formatComparisonLabel(state)}`}>
				<Radio
					label={`Radio ${formatComparisonLabel(state)}`}
					readOnly={state === "read-only"}
					value={state}
					visuallyHideLabel
				/>
			</RadioGroup>
		</div>
	);
}

function ComparisonCheckbox({ state }: { state: ChoiceControlState }) {
	return (
		<Checkbox
			defaultChecked={state === "on"}
			disabled={state === "disabled"}
			label={`Checkbox ${formatComparisonLabel(state)}`}
			readOnly={state === "read-only"}
			visuallyHideLabel
		/>
	);
}

export function ValueControlSizeComparison() {
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

export function ValueControlStateMatrix() {
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
