import { CaretRightIcon } from "@phosphor-icons/react/dist/csr/CaretRight";
import { GaugeIcon } from "@phosphor-icons/react/dist/csr/Gauge";
import { LightningIcon } from "@phosphor-icons/react/dist/csr/Lightning";
import { SlidersHorizontalIcon } from "@phosphor-icons/react/dist/csr/SlidersHorizontal";
import { StackSimpleIcon } from "@phosphor-icons/react/dist/csr/StackSimple";
import * as stylex from "@stylexjs/stylex";
import { useState, type ReactNode } from "react";
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
import * as MorphingMenu from "./morphing-menu";
import { morphingMenuStyles } from "./morphing-menu.stylex";
import { morphingModelSelectorStyles } from "./morphing-model-selector.stylex";

export type MorphingModelSelectorProps = {
	/** Opens the selector on first render so the experiment can be inspected immediately. */
	defaultOpen?: boolean;
};

type SelectorRowProps = {
	back?: boolean;
	icon: ReactNode;
	label: string;
	submenu?: boolean;
	value?: string;
};

const openAIModels = getModelOptions("openai");
const claudeModels = getModelOptions("claude");
const models = exampleModelGroups.flatMap((group) => group.options);

/**
 * Model-first composition of the shared experimental morphing menu.
 *
 * Frequent model choices stay at the root. Provider overflow and response
 * tuning morph into focused child levels.
 */
export function MorphingModelSelector({ defaultOpen = true }: MorphingModelSelectorProps) {
	const [value, setValue] = useState<ModelSelectorValue>(exampleDefaultValue);
	const selectedModel = getModel(value.model);
	const selectedModelLabel = String(selectedModel.label);

	return (
		<MorphingMenu.Root
			defaultOpen={defaultOpen}
			menuWidth="17rem"
			rootRowCount={5}
			trigger={
				<>
					<span aria-hidden {...stylex.props(morphingModelSelectorStyles.triggerIcon)}>
						{selectedModel.icon}
					</span>
					<span {...stylex.props(morphingModelSelectorStyles.triggerCopy)}>
						<span {...stylex.props(morphingModelSelectorStyles.triggerLabel)}>
							{selectedModelLabel}
						</span>
						<span {...stylex.props(morphingModelSelectorStyles.triggerMeta)}>{value.effort}</span>
					</span>
				</>
			}
			triggerLabel={`Choose model, current ${selectedModelLabel}, ${value.effort} effort`}
			triggerXstyle={morphingModelSelectorStyles.trigger}
		>
			<MorphingMenu.RadioGroup
				value={value.model}
				onValueChange={(model) => setValue((current) => ({ ...current, model }))}
			>
				{openAIModels.map((model) => (
					<SelectorOption
						key={model.value}
						icon={model.icon}
						label={String(model.label)}
						value={model.value}
					/>
				))}
			</MorphingMenu.RadioGroup>

			<SelectorSubmenu
				icon={<StackSimpleIcon />}
				label="More models"
				value={claudeModels.some((model) => model.value === value.model) ? "Selected" : undefined}
			>
				<MorphingMenu.RadioGroup
					value={value.model}
					onValueChange={(model) => setValue((current) => ({ ...current, model }))}
				>
					{claudeModels.map((model) => (
						<SelectorOption
							key={model.value}
							icon={model.icon}
							label={String(model.label)}
							value={model.value}
						/>
					))}
				</MorphingMenu.RadioGroup>
			</SelectorSubmenu>

			<SelectorSubmenu
				icon={<SlidersHorizontalIcon />}
				label="Tune response"
				value={`${value.effort} · ${value.speed}`}
			>
				<SelectorSubmenu icon={<GaugeIcon />} label="Effort" value={value.effort}>
					<MorphingMenu.RadioGroup
						value={value.effort}
						onValueChange={(effort) => setValue((current) => ({ ...current, effort }))}
					>
						{exampleEffortOptions.map((effort) => (
							<SelectorOption key={effort} icon={<GaugeIcon />} label={effort} value={effort} />
						))}
					</MorphingMenu.RadioGroup>
				</SelectorSubmenu>

				<SelectorSubmenu icon={<LightningIcon />} label="Speed" value={value.speed}>
					<MorphingMenu.RadioGroup
						value={value.speed}
						onValueChange={(speed) => setValue((current) => ({ ...current, speed }))}
					>
						{exampleSpeedOptions.map((speed) => (
							<SelectorOption key={speed} icon={<LightningIcon />} label={speed} value={speed} />
						))}
					</MorphingMenu.RadioGroup>
				</SelectorSubmenu>
			</SelectorSubmenu>
		</MorphingMenu.Root>
	);
}

function SelectorSubmenu({
	children,
	icon,
	label,
	value,
}: {
	children: ReactNode;
	icon: ReactNode;
	label: string;
	value?: string;
}) {
	return (
		<MorphingMenu.Submenu
			label={label}
			renderRow={(back) => (
				<SelectorRow back={back} icon={icon} label={label} submenu value={value} />
			)}
			rowXstyle={morphingModelSelectorStyles.row}
		>
			{children}
		</MorphingMenu.Submenu>
	);
}

function SelectorOption({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
	return (
		<MorphingMenu.RadioItem value={value} xstyle={morphingModelSelectorStyles.row}>
			<SelectorRow icon={icon} label={label} />
		</MorphingMenu.RadioItem>
	);
}

function SelectorRow({ back, icon, label, submenu, value }: SelectorRowProps) {
	return (
		<>
			<span {...stylex.props(morphingModelSelectorStyles.rowCopy)}>
				<span aria-hidden {...stylex.props(morphingMenuStyles.itemIcon)}>
					{icon}
				</span>
				<span {...stylex.props(morphingModelSelectorStyles.rowLabel)}>{label}</span>
			</span>
			{value || submenu ? (
				<span {...stylex.props(morphingModelSelectorStyles.rowEnd)}>
					{value ? (
						<span {...stylex.props(morphingModelSelectorStyles.rowValue)}>{value}</span>
					) : null}
					{submenu ? (
						<CaretRightIcon
							aria-hidden
							size={16}
							weight="bold"
							{...stylex.props(morphingMenuStyles.chevron, back && morphingMenuStyles.chevronBack)}
						/>
					) : null}
				</span>
			) : null}
		</>
	);
}

function getModel(value: string): ModelSelectorOption {
	return models.find((model) => model.value === value) ?? models[0];
}

function getModelOptions(groupId: string) {
	const group = exampleModelGroups.find((candidate) => candidate.id === groupId);
	if (!group) throw new Error(`Missing example model group: ${groupId}`);
	return group.options;
}
