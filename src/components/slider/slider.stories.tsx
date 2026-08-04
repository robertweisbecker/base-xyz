import { Field as BaseField } from "@base-ui/react/field";
import { MinusIcon } from "@phosphor-icons/react/dist/csr/Minus";
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import { SpeakerHighIcon } from "@phosphor-icons/react/dist/csr/SpeakerHigh";
import { SpeakerLowIcon } from "@phosphor-icons/react/dist/csr/SpeakerLow";
import { SpeakerXIcon } from "@phosphor-icons/react/dist/csr/SpeakerX";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { useState } from "react";
import { IconButton } from "@/components/button/button";
import { NumberField } from "@/components/number-field/number-field";
import { Text } from "@/components/text/text";
import { textStyles } from "@/components/text/text.stylex";
import { Toggle } from "@/components/toggle/toggle";
import { tokens } from "@/theme/tokens.stylex";
import * as Slider from "./slider";

type PlaygroundArgs = Slider.SliderRootProps<number> & {
	_label: string;
	_markers: boolean;
	_markerIncrement: number;
	_valuePlacement: "label" | "slider" | "none";
};

const meta = {
	title: "Components/Slider",
	args: {
		_label: "Volume",
		_markers: true,
		_markerIncrement: 25,
		_valuePlacement: "label",
		defaultValue: 65,
		disabled: false,
		max: 100,
		min: 0,
		orientation: "horizontal",
		size: "md",
		step: 5,
	},
	argTypes: {
		_label: { control: "text", name: "Label" },
		_markers: { control: "boolean", name: "Show markers" },
		_markerIncrement: {
			control: { min: 5, step: 5, type: "number" },
			description: "Value interval between markers; snaps to a multiple of Step.",
			name: "Marker increment",
		},
		_valuePlacement: {
			control: "inline-radio",
			name: "Value placement",
			options: ["label", "slider", "none"],
		},
		defaultValue: { control: { min: 0, max: 100, step: 5, type: "range" } },
		disabled: { control: "boolean" },
		max: { control: "number" },
		min: { control: "number" },
		orientation: {
			control: "inline-radio",
			options: ["horizontal", "vertical"],
		},
		size: {
			control: "inline-radio",
			options: ["sm", "md", "lg"],
		},
		step: { control: "number" },
	},
	parameters: {
		controls: {
			include: [
				"Label",
				"Show markers",
				"Marker increment",
				"Value placement",
				"defaultValue",
				"disabled",
				"max",
				"min",
				"orientation",
				"size",
				"step",
			],
		},
	},
	decorators: [
		(Story) => (
			<div {...stylex.props(styles.frame)}>
				<Story />
			</div>
		),
	],
} satisfies Meta<PlaygroundArgs>;

export default meta;
type Story = StoryObj<PlaygroundArgs>;

export const Playground: Story = {
	render: ({ _label, _markers, _markerIncrement, _valuePlacement, ...args }) => (
		<Slider.Root key={`${args.defaultValue}-${args.disabled}-${args.orientation}-${args.size}-${args.step}`} {...args}>
			<Slider.Header>
				<Slider.Label>{_label}</Slider.Label>
				{_valuePlacement === "label" ? <Slider.Value>{renderPercent}</Slider.Value> : null}
			</Slider.Header>
			<Slider.Row>
				<Slider.Control markers={_markers ? { every: getMarkerFactor(_markerIncrement, args.step) } : false}>
					<Slider.Thumb />
				</Slider.Control>
				{_valuePlacement === "slider" ? <Slider.Value>{renderPercent}</Slider.Value> : null}
			</Slider.Row>
		</Slider.Root>
	),
};

export const Sizes: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<section {...stylex.props(styles.section)}>
			<Slider.Root defaultValue={60} size="sm" step={10}>
				<Slider.Header>
					<Slider.Label>Small</Slider.Label>
					<Slider.Value />
				</Slider.Header>
				<Slider.Row>
					<BasicControl markers />
				</Slider.Row>
			</Slider.Root>
			<Slider.Root defaultValue={60} size="md" step={10}>
				<Slider.Header>
					<Slider.Label>Medium</Slider.Label>
					<Slider.Value />
				</Slider.Header>
				<Slider.Row>
					<BasicControl markers />
				</Slider.Row>
			</Slider.Root>
			<Slider.Root defaultValue={60} size="lg" step={10}>
				<Slider.Header>
					<Slider.Label>Large</Slider.Label>
					<Slider.Value />
				</Slider.Header>
				<Slider.Row>
					<BasicControl markers />
				</Slider.Row>
			</Slider.Root>
		</section>
	),
};

export const Options: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<div {...stylex.props(styles.story)}>
			<section {...stylex.props(styles.section)}>
				<h2 {...stylex.props(textStyles.supporting, styles.heading)}>Value beside label</h2>
				<Slider.Root defaultValue={45} step={5}>
					<Slider.Header>
						<Slider.Label>Brightness</Slider.Label>
						<Slider.Value>{renderPercent}</Slider.Value>
					</Slider.Header>
					<Slider.Row>
						<BasicControl />
					</Slider.Row>
				</Slider.Root>
			</section>
			<section {...stylex.props(styles.section)}>
				<h2 {...stylex.props(textStyles.supporting, styles.heading)}>Value beside slider</h2>
				<Slider.Root defaultValue={7} min={0} max={10} step={1}>
					<Slider.Header>
						<Slider.Label>Intensity</Slider.Label>
					</Slider.Header>
					<Slider.Row>
						<BasicControl markers markerEvery={2} />
						<Slider.Value />
					</Slider.Row>
				</Slider.Root>
			</section>
			<section {...stylex.props(styles.section)}>
				<h2 {...stylex.props(textStyles.supporting, styles.heading)}>Custom side content</h2>
				<Slider.Root defaultValue={70} step={5}>
					<Slider.Header>
						<Slider.Label>Output volume</Slider.Label>
					</Slider.Header>
					<Slider.Row>
						<SpeakerLowIcon aria-hidden {...stylex.props(styles.sideIcon)} />
						<BasicControl />
						<SpeakerHighIcon aria-hidden {...stylex.props(styles.sideIcon)} />
					</Slider.Row>
				</Slider.Root>
			</section>
		</div>
	),
};

export const Range: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<Slider.Root defaultValue={[20, 75]} step={5} minStepsBetweenValues={2}>
			<Slider.Header>
				<Slider.Label>Price range</Slider.Label>
				<Slider.Value>{renderCurrencyRange}</Slider.Value>
			</Slider.Header>
			<Slider.Row>
				<Text color="muted" size="2">
					$0
				</Text>
				<Slider.Control markers={{ every: 4 }}>
					<Slider.Thumb index={0} aria-label="Minimum price" />
					<Slider.Thumb index={1} aria-label="Maximum price" />
				</Slider.Control>
				<Text color="muted" size="2">
					$100
				</Text>
			</Slider.Row>
		</Slider.Root>
	),
};

export const Controlled: Story = {
	parameters: { controls: { disable: true } },
	render: () => <ControlledExamples />,
};

export const Orientations: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<div {...stylex.props(styles.orientationGrid)}>
			<section {...stylex.props(styles.section)}>
				<h2 {...stylex.props(textStyles.supporting, styles.heading)}>Horizontal</h2>
				<Slider.Root defaultValue={60} step={10}>
					<Slider.Header>
						<Slider.Label>Horizontal value</Slider.Label>
						<Slider.Value />
					</Slider.Header>
					<Slider.Row>
						<BasicControl markers />
					</Slider.Row>
				</Slider.Root>
			</section>
			<section {...stylex.props(styles.verticalSection)}>
				<h2 {...stylex.props(textStyles.supporting, styles.heading)}>Vertical</h2>
				<Slider.Root defaultValue={40} orientation="vertical" step={10} style={styles.verticalRoot}>
					<Slider.Header>
						<Slider.Label>Vertical value</Slider.Label>
						<Slider.Value />
					</Slider.Header>
					<Slider.Row>
						<BasicControl markers />
					</Slider.Row>
				</Slider.Root>
			</section>
		</div>
	),
};

export const States: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<div {...stylex.props(styles.story)}>
			<section {...stylex.props(styles.section)}>
				<h2 {...stylex.props(textStyles.supporting, styles.heading)}>Default</h2>
				<Slider.Root defaultValue={35} step={5}>
					<Slider.Header>
						<Slider.Label>Interactive</Slider.Label>
						<Slider.Value>{renderPercent}</Slider.Value>
					</Slider.Header>
					<Slider.Row>
						<BasicControl markers markerEvery={2} />
					</Slider.Row>
				</Slider.Root>
			</section>
			<section {...stylex.props(styles.section)}>
				<h2 {...stylex.props(textStyles.supporting, styles.heading)}>Invalid</h2>
				<BaseField.Root invalid>
					<Slider.Root defaultValue={50} step={5}>
						<Slider.Header>
							<Slider.Label>Outside the recommended range</Slider.Label>
							<Slider.Value>{renderPercent}</Slider.Value>
						</Slider.Header>
						<Slider.Row>
							<BasicControl markers markerEvery={2} />
						</Slider.Row>
					</Slider.Root>
				</BaseField.Root>
			</section>
			<section {...stylex.props(styles.section)}>
				<h2 {...stylex.props(textStyles.supporting, styles.heading)}>Disabled</h2>
				<Slider.Root defaultValue={65} disabled step={5}>
					<Slider.Header>
						<Slider.Label>Unavailable</Slider.Label>
						<Slider.Value>{renderPercent}</Slider.Value>
					</Slider.Header>
					<Slider.Row>
						<BasicControl markers markerEvery={2} />
					</Slider.Row>
				</Slider.Root>
			</section>
		</div>
	),
};

function BasicControl({ markers = false, markerEvery = 1 }: { markers?: boolean; markerEvery?: number }) {
	return (
		<Slider.Control markers={markers ? { every: markerEvery } : false}>
			<Slider.Thumb />
		</Slider.Control>
	);
}

function ControlledExamples() {
	const min = 0;
	const max = 100;
	const step = 5;
	const [numberValue, setNumberValue] = useState(45);
	const [presetValue, setPresetValue] = useState(35);
	const [incrementValue, setIncrementValue] = useState(50);

	return (
		<div {...stylex.props(styles.story)}>
			<section {...stylex.props(styles.section)}>
				<h2 {...stylex.props(textStyles.supporting, styles.heading)}>Number input</h2>
				<Slider.Root max={max} min={min} onValueChange={setNumberValue} step={step} value={numberValue}>
					<Slider.Header>
						<Slider.Label>Opacity</Slider.Label>
					</Slider.Header>
					<Slider.Row style={styles.controlledNumberRow}>
						<Slider.Control markers={{ every: 2 }}>
							<Slider.Thumb />
						</Slider.Control>
						<NumberField
							inputWidth="6ch"
							label="Value"
							max={max}
							min={min}
							onValueChange={(value) => setNumberValue(value ?? min)}
							size="sm"
							step={step}
							value={numberValue}
						/>
					</Slider.Row>
				</Slider.Root>
			</section>

			<section {...stylex.props(styles.section)}>
				<h2 {...stylex.props(textStyles.supporting, styles.heading)}>Minimum and maximum presets</h2>
				<Slider.Root max={max} min={min} onValueChange={setPresetValue} step={step} value={presetValue}>
					<Slider.Header>
						<Slider.Label>Volume</Slider.Label>
						<Slider.Value>{renderPercent}</Slider.Value>
					</Slider.Header>
					<Slider.Row>
						<Toggle
							icon={<SpeakerLowIcon aria-hidden size={16} />}
							pressedIcon={<SpeakerXIcon aria-hidden weight="fill" size={16} />}
							onPressedChange={() => setPresetValue(min)}
							pressed={presetValue === min}
							variant="ghost"
							aria-label="Muted"
						/>

						<Slider.Control markers={{ every: 2 }}>
							<Slider.Thumb />
						</Slider.Control>
						<Toggle
							icon={<SpeakerHighIcon aria-hidden size={16} />}
							pressedIcon={<SpeakerHighIcon aria-hidden weight="fill" size={16} />}
							onPressedChange={() => setPresetValue(max)}
							pressed={presetValue === max}
							variant="ghost"
						/>
					</Slider.Row>
				</Slider.Root>
			</section>

			<section {...stylex.props(styles.section)}>
				<h2 {...stylex.props(textStyles.supporting, styles.heading)}>Increment buttons</h2>
				<Slider.Root max={max} min={min} onValueChange={setIncrementValue} step={step} value={incrementValue}>
					<Slider.Header>
						<Slider.Label>Zoom</Slider.Label>
						<Slider.Value>{renderPercent}</Slider.Value>
					</Slider.Header>
					<Slider.Row>
						<IconButton
							disabled={incrementValue === min}
							icon={<MinusIcon aria-hidden />}
							label="Decrease zoom"
							onClick={() => setIncrementValue((value) => Math.max(min, value - step))}
							size="sm"
							tooltip={false}
							shape="circle"
							variant="secondary"
						/>
						<Slider.Control markers={{ every: 2 }}>
							<Slider.Thumb />
						</Slider.Control>
						<IconButton
							disabled={incrementValue === max}
							icon={<PlusIcon aria-hidden />}
							label="Increase zoom"
							onClick={() => setIncrementValue((value) => Math.min(max, value + step))}
							size="sm"
							tooltip={false}
							shape="circle"
							variant="secondary"
						/>
					</Slider.Row>
				</Slider.Root>
			</section>
		</div>
	);
}

function renderPercent(_formattedValues: readonly string[], values: readonly number[]) {
	return `${values[0]}%`;
}

function renderCurrencyRange(_formattedValues: readonly string[], values: readonly number[]) {
	return `$${values[0]}–$${values[1]}`;
}

function getMarkerFactor(increment: number, step = 1) {
	return step > 0 ? Math.max(1, Math.round(increment / step)) : 1;
}

const styles = stylex.create({
	frame: { maxWidth: "28rem" },
	story: {
		gap: tokens["--space-8"],
		display: "flex",
		flexDirection: "column",
	},
	section: {
		gap: tokens["--space-3"],
		display: "flex",
		flexDirection: "column",
	},
	heading: {
		margin: 0,
		color: tokens["--fg-muted"],
	},
	sideIcon: {
		flex: "none",
		color: tokens["--fg-muted"],
		height: tokens["--space-5"],
		width: tokens["--space-5"],
	},
	orientationGrid: {
		gap: tokens["--space-12"],
		display: "grid",
		gridTemplateColumns: "minmax(0, 1fr) auto",
	},
	verticalSection: {
		gap: tokens["--space-3"],
		alignItems: "center",
		display: "flex",
		flexDirection: "column",
	},
	verticalRoot: {
		width: "max-content",
	},
	controlledNumberRow: {
		alignItems: "flex-end",
	},
});
