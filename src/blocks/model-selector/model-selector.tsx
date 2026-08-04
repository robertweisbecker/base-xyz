import { ArrowCounterClockwiseIcon } from "@phosphor-icons/react/dist/csr/ArrowCounterClockwise";
import { LightningIcon } from "@phosphor-icons/react/dist/csr/Lightning";
import * as stylex from "@stylexjs/stylex";
import { createContext, Fragment, type ComponentProps, type ReactNode, useContext, useState } from "react";
import { Button, type ButtonProps } from "@/components/button/button";
import * as Menu from "@/components/menu/menu";
import { menuItemVars } from "@/components/menu/menu-item.stylex";
import { tokens } from "@/theme/tokens.stylex";
import { breakpoints } from "@/styles/constants.stylex";

export type ModelSelectorOption = {
	value: string;
	label: ReactNode;
	description?: ReactNode;
	icon?: ReactNode;
	disabled?: boolean;
};

export type ModelSelectorGroup = {
	id: string;
	label: ReactNode;
	options: readonly ModelSelectorOption[];
};

export type ModelSelectorValue = {
	model: string;
	effort: string;
	speed: string;
};

export type ModelSelectorChangeReason = "model" | "effort" | "speed" | "reset";

export type ModelSelectorChangeDetails = {
	reason: ModelSelectorChangeReason;
};

type MenuRootProps = Omit<ComponentProps<typeof Menu.Root>, "children">;

export type ModelSelectorRootProps = MenuRootProps & {
	children: ReactNode;
	groups: readonly ModelSelectorGroup[];
	effortOptions: readonly string[];
	speedOptions: readonly string[];
	defaultValue: ModelSelectorValue;
	value?: ModelSelectorValue;
	onValueChange?: (value: ModelSelectorValue, details: ModelSelectorChangeDetails) => void;
};

type MenuTriggerProps = ComponentProps<typeof Menu.Trigger>;

export type ModelSelectorTriggerProps = Omit<MenuTriggerProps, "style"> &
	Pick<ButtonProps, "className" | "shape" | "size" | "style" | "variant"> & {
		showEffort?: boolean;
	};
export type ModelSelectorPopupProps = Omit<ComponentProps<typeof Menu.Popup>, "children">;
export type ModelSelectorListProps = {
	groups: readonly ModelSelectorGroup[];
	value: string;
	onValueChange: (value: string) => void;
};

type ModelSelectorContextValue = {
	defaultValue: ModelSelectorValue;
	effortOptions: readonly string[];
	groups: readonly ModelSelectorGroup[];
	selectedModel: ModelSelectorOption;
	speedOptions: readonly string[];
	updateValue: (value: ModelSelectorValue, reason: ModelSelectorChangeReason) => void;
	value: ModelSelectorValue;
};

const ModelSelectorContext = createContext<ModelSelectorContextValue | null>(null);

export function Root({
	children,
	groups,
	effortOptions,
	speedOptions,
	defaultValue,
	value,
	onValueChange,
	...props
}: ModelSelectorRootProps) {
	const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
	const currentValue = value ?? uncontrolledValue;
	const selectedModel = findModel(groups, currentValue.model) ?? groups[0]?.options[0];

	if (!selectedModel) {
		throw new Error("ModelSelector.Root requires at least one model option.");
	}

	function updateValue(nextValue: ModelSelectorValue, reason: ModelSelectorChangeReason) {
		if (value === undefined) setUncontrolledValue(nextValue);
		onValueChange?.(nextValue, { reason });
	}

	return (
		<ModelSelectorContext.Provider
			value={{
				defaultValue,
				effortOptions,
				groups,
				selectedModel,
				speedOptions,
				updateValue,
				value: currentValue,
			}}>
			<Menu.Root {...props}>{children}</Menu.Root>
		</ModelSelectorContext.Provider>
	);
}

export function Trigger({
	children,
	className,
	"aria-label": ariaLabel,
	render,
	shape,
	showEffort = true,
	size,
	style,
	variant,
	...props
}: ModelSelectorTriggerProps) {
	const { selectedModel, value } = useModelSelectorContext("Trigger");
	const triggerIcon = value.speed === "Fast" ? <LightningIcon size="1em" weight="fill" /> : selectedModel.icon;
	const triggerLabel = showEffort
		? `Choose model, current ${getTextLabel(selectedModel.label)}, ${value.effort} effort`
		: `Choose model, current ${getTextLabel(selectedModel.label)}`;

	return (
		<Menu.Trigger
			aria-label={ariaLabel ?? triggerLabel}
			className={render ? className : undefined}
			render={
				render ?? (
					<Button
						className={className}
						shape={shape}
						size={size}
						startSlot={triggerIcon}
						style={style}
						variant={variant}
					/>
				)
			}
			{...props}>
			{children ?? (
				<>
					{render && triggerIcon ? (
						<span aria-hidden {...stylex.props(parts.triggerIcon)}>
							{triggerIcon}
						</span>
					) : null}
					<span {...stylex.props(parts.triggerModel)}>{selectedModel.label}</span>
					{showEffort ? <span {...stylex.props(parts.triggerSetting)}>{value.effort}</span> : null}
				</>
			)}
		</Menu.Trigger>
	);
}

export function Popup({ positionerProps, style, ...props }: ModelSelectorPopupProps) {
	const context = useModelSelectorContext("Popup");

	return (
		<Menu.Popup
			positionerProps={{ align: "start", side: "top", ...positionerProps }}
			style={[parts.settingsPopup, style]}
			{...props}>
			<Menu.SubmenuRoot>
				<SettingsTrigger label="Model" value={context.selectedModel.label} />
				<Menu.Popup
					positionerProps={{
						align: "start",
						side: "inline-end",
						sideOffset: 4,
						alignOffset: -24,
						collisionAvoidance: {
							side: "shift",
							align: "shift",
							fallbackAxisSide: "none",
						},
					}}
					style={parts.modelPopup}>
					<List
						groups={context.groups}
						value={context.value.model}
						onValueChange={(model) => context.updateValue({ ...context.value, model }, "model")}
					/>
				</Menu.Popup>
			</Menu.SubmenuRoot>
			<ChoiceSubmenu
				label="Effort"
				options={context.effortOptions}
				value={context.value.effort}
				onValueChange={(effort) => context.updateValue({ ...context.value, effort }, "effort")}
			/>
			<ChoiceSubmenu
				label="Speed"
				options={context.speedOptions}
				value={context.value.speed}
				onValueChange={(speed) => context.updateValue({ ...context.value, speed }, "speed")}
			/>
			<Menu.Separator />
			<Menu.Item style={parts.resetItem} onClick={() => context.updateValue(context.defaultValue, "reset")}>
				<span {...stylex.props(parts.resetLabel)}>Reset to default</span>
				<ArrowCounterClockwiseIcon aria-hidden size="1em" weight="regular" {...stylex.props(parts.resetIcon)} />
			</Menu.Item>
		</Menu.Popup>
	);
}

function SettingsTrigger({ label, value, valueIcon }: { label: ReactNode; value: ReactNode; valueIcon?: ReactNode }) {
	return (
		<Menu.SubmenuTrigger openOnHover style={parts.settingsRow}>
			<span {...stylex.props(parts.settingsLabel)}>{label}</span>
			<span {...stylex.props(parts.settingsValue)}>
				<span aria-hidden {...stylex.props(parts.settingsValueIcon)}>
					{valueIcon}
				</span>
				{value}
			</span>
		</Menu.SubmenuTrigger>
	);
}

function ChoiceSubmenu({
	label,
	options,
	value,
	onValueChange,
	valueIcon,
}: {
	label: string;
	options: readonly string[];
	value: string;
	valueIcon?: ReactNode;
	onValueChange: (value: string) => void;
}) {
	return (
		<Menu.SubmenuRoot>
			<SettingsTrigger
				label={label}
				value={value}
				valueIcon={value === "Fast" ? <LightningIcon size="1em" weight="fill" /> : valueIcon}
			/>
			<Menu.Popup
				positionerProps={{
					align: "start",
					side: "inline-end",
					sideOffset: 0,
					alignOffset: -28,
					collisionAvoidance: {
						side: "shift",
						align: "shift",
						fallbackAxisSide: "none",
					},
				}}
				style={parts.choicePopup}>
				<Menu.RadioGroup value={value} onValueChange={onValueChange}>
					<Menu.GroupLabel>{label}</Menu.GroupLabel>
					{options.map((option) => (
						<Menu.RadioItem key={option} value={option}>
							<Menu.ItemLabel>{option}</Menu.ItemLabel>
						</Menu.RadioItem>
					))}
				</Menu.RadioGroup>
			</Menu.Popup>
		</Menu.SubmenuRoot>
	);
}

export function List({ groups, value, onValueChange }: ModelSelectorListProps) {
	return (
		<Menu.RadioGroup value={value} onValueChange={onValueChange}>
			{groups.map((group, index) => (
				<Fragment key={group.id}>
					{index > 0 ? <Menu.Separator /> : null}
					<Menu.Group>
						<Menu.GroupLabel>{group.label}</Menu.GroupLabel>
						{group.options.map((option) => (
							<Menu.RadioItem
								key={option.value}
								value={option.value}
								disabled={option.disabled}
								style={parts.modelItem}>
								{option.icon ? (
									<span aria-hidden {...stylex.props(parts.modelIcon)}>
										{option.icon}
									</span>
								) : null}
								<span {...stylex.props(parts.modelLabel, !option.icon && parts.copyWithoutIcon)}>{option.label}</span>
								{option.description ? (
									<span {...stylex.props(parts.modelDescription, !option.icon && parts.copyWithoutIcon)}>
										{option.description}
									</span>
								) : null}
							</Menu.RadioItem>
						))}
					</Menu.Group>
				</Fragment>
			))}
		</Menu.RadioGroup>
	);
}

function useModelSelectorContext(part: string) {
	const context = useContext(ModelSelectorContext);
	if (!context) {
		throw new Error(`ModelSelector.${part} must be used inside ModelSelector.Root.`);
	}
	return context;
}

function findModel(groups: readonly ModelSelectorGroup[], value: string) {
	return groups.flatMap((group) => group.options).find((option) => option.value === value);
}

function getTextLabel(label: ReactNode) {
	return typeof label === "string" || typeof label === "number" ? String(label) : "selected model";
}

const parts = stylex.create({
	settingsPopup: {
		minWidth: {
			default: null,
			[breakpoints.sm]: "16rem",
		},
	},
	modelPopup: {
		minWidth: {
			default: null,
			[breakpoints.sm]: "16rem",
		},
	},
	choicePopup: {
		// minWidth: "12rem",
	},
	triggerIcon: {
		alignItems: "center",
		display: "inline-flex",
		flexShrink: 0,
		justifyContent: "center",
		height: "1em",
		width: "1em",
	},
	triggerModel: {
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
	},
	triggerSetting: {
		overflow: "hidden",
		fontWeight: tokens["--font-weight-regular"],
		opacity: 0.72,
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
	},
	settingsRow: {
		[menuItemVars.columns]: "auto minmax(0, 1fr) .5rem",
	},
	settingsLabel: {
		gridColumn: "1",
		minWidth: 0,
	},
	settingsValue: {
		gap: tokens["--space-1"],
		gridColumn: "2",
		overflow: "hidden",
		alignItems: "center",
		color: tokens["--fg-muted"],
		display: "flex",
		fontSize: tokens["--font-size-1"],
		justifyContent: "end",
		letterSpacing: tokens["--letter-spacing-1"],
		textAlign: "end",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
	},
	settingsValueIcon: {
		alignItems: "center",
		display: "inline-flex",
		flexShrink: 0,
		justifyContent: "center",
		height: "1em",
		width: "1em",
	},
	resetItem: {
		[menuItemVars.columns]: "minmax(0, 1fr) auto",
		// [menuItemVars.paddingInlineStart]: space[3],
		color: tokens["--fg-muted"],
	},
	resetLabel: {
		gridColumn: "1",
		whiteSpace: "nowrap",
		minWidth: 0,
	},
	resetIcon: {
		gridColumn: "2",
		color: tokens["--fg-muted"],
		justifySelf: "end",
	},
	modelItem: {
		[menuItemVars.columns]: `${tokens["--space-4"]} 1em minmax(0, 1fr)`,
		[menuItemVars.columnGap]: tokens["--space-2"],
		[menuItemVars.minHeight]: "3.375rem",
		[menuItemVars.paddingBlock]: tokens["--space-2"],
		// [menuItemVars.rowGap]: "0.0625rem",
	},
	modelIcon: {
		gridColumn: "2",
		gridRow: "1",
		alignItems: "center",
		display: "inline-flex",
		justifyContent: "center",
		height: "1em",
		width: "1em",
	},
	modelLabel: {
		gridColumn: "3",
		gridRow: "1",
		overflow: "hidden",
		color: tokens["--fg"],
		fontSize: tokens["--font-size-2"],
		letterSpacing: tokens["--letter-spacing-2"],
		lineHeight: tokens["--line-height-2"],
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
	},
	modelDescription: {
		gridColumn: "3",
		gridRow: "2",
		overflow: "hidden",
		color: tokens["--fg-muted"],
		// textOverflow: "ellipsis",
		// whiteSpace: "nowrap",
		display: {
			default: "none",
			[breakpoints.md]: "block",
		},
		fontSize: tokens["--font-size-1"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
	},
	copyWithoutIcon: {
		gridColumn: "2 / 4",
	},
});
