import { GaugeIcon } from "@phosphor-icons/react/dist/csr/Gauge";
import { LightningIcon } from "@phosphor-icons/react/dist/csr/Lightning";
import { SlidersHorizontalIcon } from "@phosphor-icons/react/dist/csr/SlidersHorizontal";
import { StackSimpleIcon } from "@phosphor-icons/react/dist/csr/StackSimple";
import { useState } from "react";
import type {
	ModelSelectorOption,
	ModelSelectorValue,
} from "@/blocks/model-selector/model-selector";
import {
	exampleDefaultValue,
	exampleEffortOptions,
	exampleModelGroups,
	exampleSpeedOptions,
} from "@/blocks/model-selector/model-selector.examples";
import {
	MorphingSelectorOption,
	MorphingSelectorRadioGroup,
	MorphingSelectorRoot,
	MorphingSelectorSubmenu,
} from "./morphing-model-selector.internal";

export type MorphingModelSelectorProps = {
	/** Opens the selector on first render so the experiment can be inspected immediately. */
	defaultOpen?: boolean;
};

type RootSubmenu = "more" | "tune" | null;
type TuneSubmenu = "effort" | "speed" | null;

const openAIModels = exampleModelGroups[0].options;
const claudeModels = exampleModelGroups[1].options;
const models = exampleModelGroups.flatMap((group) => group.options);

/**
 * Model-first adaptation of the experimental morphing menu.
 *
 * Frequent model choices stay at the root. Provider overflow and response
 * tuning morph into focused child levels.
 */
export function MorphingModelSelector({ defaultOpen = true }: MorphingModelSelectorProps) {
	const [value, setValue] = useState<ModelSelectorValue>(exampleDefaultValue);
	const [rootSubmenu, setRootSubmenu] = useState<RootSubmenu>(null);
	const [tuneSubmenu, setTuneSubmenu] = useState<TuneSubmenu>(null);
	const selectedModel = getModel(value.model);

	return (
		<MorphingSelectorRoot
			defaultOpen={defaultOpen}
			hasOpenSubmenu={rootSubmenu !== null}
			icon={selectedModel.icon}
			label={String(selectedModel.label)}
			meta={value.effort}
			onOpenChange={(open) => {
				if (!open) {
					setRootSubmenu(null);
					setTuneSubmenu(null);
				}
			}}
			rowCount={5}
		>
			<MorphingSelectorRadioGroup
				value={value.model}
				onValueChange={(model) => setValue((current) => ({ ...current, model }))}
			>
				{openAIModels.map((model) => (
					<MorphingSelectorOption
						key={model.value}
						icon={model.icon}
						label={String(model.label)}
						selected={model.value === value.model}
						value={model.value}
					/>
				))}
			</MorphingSelectorRadioGroup>

			<MorphingSelectorSubmenu
				icon={<StackSimpleIcon />}
				label="More models"
				value={claudeModels.some((model) => model.value === value.model) ? "Selected" : undefined}
				onOpenChange={(open) => setRootSubmenu(open ? "more" : null)}
			>
				<MorphingSelectorRadioGroup
					value={value.model}
					onValueChange={(model) => setValue((current) => ({ ...current, model }))}
				>
					{claudeModels.map((model) => (
						<MorphingSelectorOption
							key={model.value}
							icon={model.icon}
							label={String(model.label)}
							selected={model.value === value.model}
							value={model.value}
						/>
					))}
				</MorphingSelectorRadioGroup>
			</MorphingSelectorSubmenu>

			<MorphingSelectorSubmenu
				hasOpenSubmenu={tuneSubmenu !== null}
				icon={<SlidersHorizontalIcon />}
				label="Tune response"
				value={`${value.effort} · ${value.speed}`}
				onOpenChange={(open) => {
					setRootSubmenu(open ? "tune" : null);
					if (!open) setTuneSubmenu(null);
				}}
			>
				<MorphingSelectorSubmenu
					icon={<GaugeIcon />}
					label="Effort"
					value={value.effort}
					onOpenChange={(open) => setTuneSubmenu(open ? "effort" : null)}
				>
					<MorphingSelectorRadioGroup
						value={value.effort}
						onValueChange={(effort) => setValue((current) => ({ ...current, effort }))}
					>
						{exampleEffortOptions.map((effort) => (
							<MorphingSelectorOption
								key={effort}
								icon={<GaugeIcon />}
								label={effort}
								selected={effort === value.effort}
								value={effort}
							/>
						))}
					</MorphingSelectorRadioGroup>
				</MorphingSelectorSubmenu>

				<MorphingSelectorSubmenu
					icon={<LightningIcon />}
					label="Speed"
					value={value.speed}
					onOpenChange={(open) => setTuneSubmenu(open ? "speed" : null)}
				>
					<MorphingSelectorRadioGroup
						value={value.speed}
						onValueChange={(speed) => setValue((current) => ({ ...current, speed }))}
					>
						{exampleSpeedOptions.map((speed) => (
							<MorphingSelectorOption
								key={speed}
								icon={<LightningIcon />}
								label={speed}
								selected={speed === value.speed}
								value={speed}
							/>
						))}
					</MorphingSelectorRadioGroup>
				</MorphingSelectorSubmenu>
			</MorphingSelectorSubmenu>
		</MorphingSelectorRoot>
	);
}

function getModel(value: string): ModelSelectorOption {
	return models.find((model) => model.value === value) ?? models[0];
}
