import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { Avatar } from "@/components/avatar/avatar";
import { Item } from "@/components/item/item";
import { userOptions, userSelectItems, type UserOption } from "@/components/storybook/user-options";
import { tokens } from "@/theme/tokens.stylex";

import {
	Select,
	type SelectItemVariant,
	type SelectPopupProps,
	type SelectRootProps,
	type SelectTriggerVariant,
} from "./select";
type Positioning = "item-aligned" | "bottom-start" | "bottom-end" | "top-start";

type PlaygroundArgs = {
	disabled: boolean;
	invalid: boolean;
	_itemVariant: SelectItemVariant;
	_label: string;
	multiple: boolean;
	_placeholder: string;
	_positioning: Positioning;
	readOnly: boolean;
	required: boolean;
	_size: SelectRootProps<string>["size"];
	_variant: SelectTriggerVariant;
};

const meta: Meta<PlaygroundArgs> = {
	title: "Components/Select",
	args: {
		disabled: false,
		invalid: false,
		_itemVariant: "primary",
		_label: "Framework",
		multiple: false,
		_placeholder: "Select a framework",
		_positioning: "item-aligned",
		readOnly: false,
		required: false,
		_size: "md",
		_variant: "default",
	},
	argTypes: {
		disabled: { control: "boolean" },
		invalid: { control: "boolean" },
		_itemVariant: { control: "select", options: ["default", "primary", "error"] },
		_label: { control: "text" },
		multiple: { control: "boolean" },
		_placeholder: { control: "text" },
		_positioning: {
			control: "select",
			options: ["item-aligned", "bottom-start", "bottom-end", "top-start"],
		},
		readOnly: { control: "boolean" },
		required: { control: "boolean" },
		_size: { control: "select", options: ["sm", "md", "lg"] },
		_variant: { control: "select", options: ["default", "inline"] },
	},
	parameters: {
		controls: {
			include: [
				"_label",
				"_placeholder",
				"multiple",
				"disabled",
				"readOnly",
				"required",
				"invalid",
				"_size",
				"_variant",
				"_itemVariant",
				"_positioning",
			],
		},
	},
	decorators: [
		(Story) => (
			<div {...stylex.props(storyParts.frame)}>
				<Story />
			</div>
		),
	],
};

export default meta;
type Story = StoryObj<PlaygroundArgs>;

const frameworks = ["React", "Vue", "Angular", "Svelte", "Solid", "Preact"];
const frameworkItems = frameworks.map((value) => ({ label: value, value }));

export const Playground: Story = {
	render: (args) => <PlaygroundExample {...args} />,
};

function PlaygroundExample({
	disabled,
	invalid,
	_itemVariant,
	_label,
	multiple,
	_placeholder,
	_positioning,
	readOnly,
	required,
	_size,
	_variant,
}: PlaygroundArgs) {
	const selectLabel = _label.trim();
	const sharedProps = {
		disabled,
		invalid,
		readOnly,
		required,
		size: _size,
	};

	if (multiple) {
		return (
			<Select.Root<string, true>
				key="multiple"
				{...sharedProps}
				defaultValue={["React", "Svelte"]}
				items={frameworkItems}
				multiple>
				{selectLabel ? <Select.Label>{selectLabel}</Select.Label> : null}
				<Select.Trigger aria-label={selectLabel || "Framework"} placeholder={_placeholder} variant={_variant}>
					{formatMultipleFrameworks}
				</Select.Trigger>
				<FrameworkPopup itemVariant={_itemVariant} positioning={_positioning} />
			</Select.Root>
		);
	}

	return (
		<Select.Root<string> key="single" {...sharedProps} items={frameworkItems}>
			{selectLabel ? <Select.Label>{selectLabel}</Select.Label> : null}
			<Select.Trigger aria-label={selectLabel || "Framework"} placeholder={_placeholder} variant={_variant} />
			<FrameworkPopup itemVariant={_itemVariant} positioning={_positioning} />
		</Select.Root>
	);
}

export const SelectionModes: Story = {
	name: "Selection modes",
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(storyParts.fieldGrid)}>
			<Select.Root<string> defaultValue="React" items={frameworkItems}>
				<Select.Label>Single selection</Select.Label>
				<Select.Trigger />
				<FrameworkPopup />
			</Select.Root>
			<Select.Root<string> items={frameworkItems}>
				<Select.Label>Placeholder</Select.Label>
				<Select.Trigger placeholder="Choose a framework" />
				<FrameworkPopup />
			</Select.Root>
			<Select.Root<string, true> defaultValue={["TypeScript", "CSS"]} items={languageItems} multiple>
				<Select.Label>Multiple selection</Select.Label>
				<Select.Trigger placeholder="Select languages">{formatMultipleLanguages}</Select.Trigger>
				<Select.Popup positionerProps={{ alignItemWithTrigger: false }}>
					<Select.List>
						{languageItems.map((item) => (
							<Select.Item key={item.value} value={item.value}>
								{item.label}
							</Select.Item>
						))}
					</Select.List>
				</Select.Popup>
			</Select.Root>
		</div>
	),
};

export const Sizes: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(storyParts.sizeStack)}>
			{(["sm", "md", "lg"] as const).map((size) => (
				<Select.Root<string> key={size} defaultValue="React" items={frameworkItems} size={size}>
					<Select.Label>{size === "sm" ? "Small" : size === "md" ? "Medium" : "Large"}</Select.Label>
					<Select.Trigger />
					<FrameworkPopup />
				</Select.Root>
			))}
		</div>
	),
};

export const States: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(storyParts.stateGrid)}>
			<SelectState label="Empty">
				<Select.Root<string> items={frameworkItems}>
					<Select.Label>Framework</Select.Label>
					<Select.Trigger placeholder="Choose a framework" />
					<FrameworkPopup />
				</Select.Root>
			</SelectState>
			<SelectState label="Selected">
				<Select.Root<string> defaultValue="React" items={frameworkItems}>
					<Select.Label>Framework</Select.Label>
					<Select.Trigger />
					<FrameworkPopup />
				</Select.Root>
			</SelectState>
			<SelectState label="Invalid">
				<Select.Root<string> invalid items={frameworkItems}>
					<Select.Label>Framework</Select.Label>
					<Select.Trigger placeholder="Choose a framework" />
					<FrameworkPopup />
				</Select.Root>
			</SelectState>
			<SelectState label="Required">
				<Select.Root<string> required items={frameworkItems}>
					<Select.Label>Framework</Select.Label>
					<Select.Trigger placeholder="Choose a framework" />
					<FrameworkPopup />
				</Select.Root>
			</SelectState>
			<SelectState label="Read-only">
				<Select.Root<string> defaultValue="React" readOnly items={frameworkItems}>
					<Select.Label>Framework</Select.Label>
					<Select.Trigger />
					<FrameworkPopup />
				</Select.Root>
			</SelectState>
			<SelectState label="Disabled">
				<Select.Root<string> defaultValue="React" disabled items={frameworkItems}>
					<Select.Label>Framework</Select.Label>
					<Select.Trigger />
					<FrameworkPopup />
				</Select.Root>
			</SelectState>
		</div>
	),
};

function SelectState({ children, label }: { children: ReactNode; label: string }) {
	return (
		<section {...stylex.props(storyParts.state)}>
			<h2 {...stylex.props(storyParts.stateLabel)}>{label}</h2>
			{children}
		</section>
	);
}

const produceGroups = [
	{
		label: "Fruit",
		items: [
			{ label: "Apple", value: "apple" },
			{ label: "Banana", value: "banana" },
			{ label: "Cherry", value: "cherry" },
		],
	},
	{
		label: "Vegetables",
		items: [
			{ label: "Carrot", value: "carrot" },
			{ label: "Lettuce", value: "lettuce" },
			{ label: "Spinach", value: "spinach" },
		],
	},
] as const;

function GroupedOptionsSelect() {
	return (
		<Select.Root<string> items={produceGroups}>
			<Select.Label>Produce</Select.Label>
			<Select.Trigger placeholder="Select produce" />
			<Select.Popup>
				<Select.List>
					{produceGroups.map((group, index) => (
						<div key={group.label}>
							<Select.Group label={group.label}>
								{group.items.map((item) => (
									<Select.Item key={item.value} value={item.value}>
										{item.label}
									</Select.Item>
								))}
							</Select.Group>
							{index < produceGroups.length - 1 ? <Select.Separator /> : null}
						</div>
					))}
				</Select.List>
			</Select.Popup>
		</Select.Root>
	);
}

type Country = {
	code: string;
	flag: string;
	locale: string;
	name: string;
};

const countries: Country[] = [
	{ code: "US", flag: "🇺🇸", locale: "en-US", name: "United States" },
	{ code: "CA", flag: "🇨🇦", locale: "en-CA", name: "Canada" },
	{ code: "MX", flag: "🇲🇽", locale: "es-MX", name: "Mexico" },
	{ code: "BR", flag: "🇧🇷", locale: "pt-BR", name: "Brazil" },
	{ code: "GB", flag: "🇬🇧", locale: "en-GB", name: "United Kingdom" },
	{ code: "FR", flag: "🇫🇷", locale: "fr-FR", name: "France" },
	{ code: "DE", flag: "🇩🇪", locale: "de-DE", name: "Germany" },
	{ code: "JP", flag: "🇯🇵", locale: "ja-JP", name: "Japan" },
];

const countryItems = countries.map((country) => ({ label: country.name, value: country }));

function ComplexValueSelect() {
	return (
		<Select.Root<Country>
			defaultValue={countries[0]}
			isItemEqualToValue={(item, value) => item.code === value.code}
			itemToStringLabel={(country) => country.name}
			itemToStringValue={(country) => country.code}
			items={countryItems}>
			<Select.Label>Country or region</Select.Label>
			<Select.Trigger placeholder="Select a country">
				{(country: Country | null) =>
					country ? (
						<span {...stylex.props(storyParts.countryValue)}>
							<span aria-hidden {...stylex.props(storyParts.flag)}>
								{country.flag}
							</span>
							<span>{country.name}</span>
						</span>
					) : (
						"Select a country"
					)
				}
			</Select.Trigger>
			<Select.Popup>
				<Select.List>
					{countries.map((country) => (
						<Select.Item key={country.code} label={country.name} value={country}>
							<span {...stylex.props(storyParts.countryItem)}>
								<span aria-hidden {...stylex.props(storyParts.flag)}>
									{country.flag}
								</span>
								<span {...stylex.props(storyParts.countryName)}>{country.name}</span>
								<span {...stylex.props(storyParts.countryMeta)}>
									{country.code} · {country.locale}
								</span>
							</span>
						</Select.Item>
					))}
				</Select.List>
			</Select.Popup>
		</Select.Root>
	);
}

const timeZones = [
	"Pacific/Honolulu",
	"America/Anchorage",
	"America/Los_Angeles",
	"America/Denver",
	"America/Chicago",
	"America/New_York",
	"America/Halifax",
	"America/Sao_Paulo",
	"Atlantic/Reykjavik",
	"Europe/London",
	"Europe/Paris",
	"Europe/Berlin",
	"Europe/Athens",
	"Africa/Cairo",
	"Africa/Johannesburg",
	"Asia/Jerusalem",
	"Asia/Dubai",
	"Asia/Karachi",
	"Asia/Kolkata",
	"Asia/Dhaka",
	"Asia/Bangkok",
	"Asia/Singapore",
	"Asia/Hong_Kong",
	"Asia/Shanghai",
	"Asia/Tokyo",
	"Asia/Seoul",
	"Australia/Perth",
	"Australia/Adelaide",
	"Australia/Sydney",
	"Pacific/Auckland",
];

const timeZoneItems = timeZones.map((value) => ({ label: value.replaceAll("_", " "), value }));

function LongListSelect() {
	return (
		<Select.Root<string> defaultValue="America/Los_Angeles" items={timeZoneItems}>
			<Select.Label>Time zone</Select.Label>
			<Select.Trigger />
			<Select.Popup positionerProps={{ alignItemWithTrigger: false }}>
				<Select.List>
					{timeZoneItems.map((item) => (
						<Select.Item key={item.value} value={item.value}>
							{item.label}
						</Select.Item>
					))}
				</Select.List>
			</Select.Popup>
		</Select.Root>
	);
}

export const Options: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(storyParts.story)}>
			<section {...stylex.props(storyParts.section)}>
				<h2 {...stylex.props(storyParts.heading)}>Grouped options</h2>
				<GroupedOptionsSelect />
			</section>
			<section {...stylex.props(storyParts.section)}>
				<h2 {...stylex.props(storyParts.heading)}>Complex values</h2>
				<ComplexValueSelect />
			</section>
			<section {...stylex.props(storyParts.section)}>
				<h2 {...stylex.props(storyParts.heading)}>Long list</h2>
				<LongListSelect />
			</section>
		</div>
	),
};

export const UserSelection: Story = {
	name: "User selection",
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Select.Root<UserOption>
			defaultValue={userOptions[0]}
			isItemEqualToValue={(item, value) => item.id === value.id}
			itemToStringLabel={(user) => user.name}
			itemToStringValue={(user) => user.id}
			items={userSelectItems}>
			<Select.Label>Assignee</Select.Label>
			<Select.Trigger placeholder="Select a person" style={storyParts.userSelect}>
				{(user: UserOption | null) =>
					user ? (
						<Item
							align="center"
							label={user.name}
							description={user.email}
							render={<span />}
							startSlot={<Avatar initials={user.initials} shape="rounded" size={8} />}
							style={storyParts.userValueItem}
							variant="embedded"
						/>
					) : (
						"Select a person"
					)
				}
			</Select.Trigger>
			<Select.Popup>
				<Select.List>
					{userOptions.map((user) => (
						<Select.Item key={user.id} label={user.name} value={user}>
							<Item
								align="center"
								description={user.email}
								label={user.name}
								startSlot={<Avatar initials={user.initials} shape="rounded" size={8} />}
								style={storyParts.userOptionItem}
								variant="embedded"
							/>
						</Select.Item>
					))}
				</Select.List>
			</Select.Popup>
		</Select.Root>
	),
};

export const InlineWithBackdrop: Story = {
	name: "Inline with backdrop",
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<section {...stylex.props(storyParts.inlineUseCase)}>
			<h2 {...stylex.props(storyParts.heading)}>Campaign brief</h2>
			<div {...stylex.props(storyParts.adLibSentence)}>
				<span>Plan a</span>
				<AdLibSelect defaultValue="product-launch" items={campaignItems} label="Campaign type" />
				<span>for</span>
				<AdLibSelect items={audienceItems} label="Audience" placeholder="choose an audience" />
				<span>focused on</span>
				<AdLibSelect items={goalItems} label="Campaign goal" placeholder="choose a goal" />
			</div>
			<p {...stylex.props(storyParts.adLibHint)}>Open any highlighted phrase to revise the brief.</p>
		</section>
	),
};

function AdLibSelect({
	defaultValue,
	items,
	label,
	placeholder,
}: {
	defaultValue?: string;
	items: { label: string; value: string }[];
	label: string;
	placeholder?: string;
}) {
	return (
		<Select.Root<string> style={storyParts.adLibSelect} defaultValue={defaultValue} items={items}>
			<Select.Trigger aria-label={label} placeholder={placeholder} variant="inline" />
			<Select.Popup backdrop>
				<Select.List>
					{items.map((item) => (
						<Select.Item key={item.value} value={item.value}>
							{item.label}
						</Select.Item>
					))}
				</Select.List>
			</Select.Popup>
		</Select.Root>
	);
}

function FrameworkPopup({
	itemVariant = "primary",
	positioning = "item-aligned",
}: {
	itemVariant?: SelectItemVariant;
	positioning?: Positioning;
}) {
	return (
		<Select.Popup positionerProps={getPositionerProps(positioning)}>
			<Select.List>
				{frameworkItems.map((item) => (
					<Select.Item key={item.value} value={item.value} variant={itemVariant}>
						{item.label}
					</Select.Item>
				))}
			</Select.List>
		</Select.Popup>
	);
}

function getPositionerProps(positioning: Positioning): NonNullable<SelectPopupProps["positionerProps"]> {
	switch (positioning) {
		case "bottom-start":
			return { align: "start", alignItemWithTrigger: false, side: "bottom" };
		case "bottom-end":
			return { align: "end", alignItemWithTrigger: false, side: "bottom" };
		case "top-start":
			return { align: "start", alignItemWithTrigger: false, side: "top" };
		default:
			return { alignItemWithTrigger: true };
	}
}

const languages = ["JavaScript", "TypeScript", "CSS", "HTML", "Rust", "Go"];
const languageItems = languages.map((value) => ({ label: value, value }));
const campaignItems = [
	{ label: "product launch", value: "product-launch" },
	{ label: "brand campaign", value: "brand-campaign" },
	{ label: "customer newsletter", value: "customer-newsletter" },
	{ label: "community event", value: "community-event" },
];
const audienceItems = [
	{ label: "North America", value: "north-america" },
	{ label: "Europe", value: "europe" },
	{ label: "Asia Pacific", value: "asia-pacific" },
	{ label: "a global audience", value: "global" },
];
const goalItems = [
	{ label: "customer retention", value: "customer-retention" },
	{ label: "revenue growth", value: "revenue-growth" },
	{ label: "brand awareness", value: "brand-awareness" },
	{ label: "trial conversion", value: "trial-conversion" },
];

function formatMultipleFrameworks(value: string[]) {
	return formatMultipleValue(value, "Select frameworks");
}

function formatMultipleLanguages(value: string[]) {
	return formatMultipleValue(value, "Select languages");
}

function formatMultipleValue(value: string[], placeholder: string) {
	if (value.length === 0) {
		return placeholder;
	}

	return value.length === 1 ? value[0] : `${value[0]} (+${value.length - 1} more)`;
}

const storyParts = stylex.create({
	frame: {
		padding: tokens["--space-8"],
	},
	story: {
		gap: tokens["--space-8"],
		display: "flex",
		flexDirection: "column",
	},
	section: {
		gap: tokens["--space-4"],
		alignItems: "flex-start",
		display: "flex",
		flexDirection: "column",
	},
	heading: {
		margin: 0,
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-1"],
		fontWeight: tokens["--font-weight-regular"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
	},
	fieldGrid: {
		gap: tokens["--space-6"],
		display: "grid",
		gridTemplateColumns: {
			default: "repeat(3, minmax(0, 1fr))",
			"@media (max-width: 760px)": "1fr",
		},
		width: "100%",
	},
	stateGrid: {
		gap: tokens["--space-8"],
		display: "grid",
		gridTemplateColumns: {
			default: "repeat(2, minmax(0, 1fr))",
			"@media (max-width: 760px)": "1fr",
		},
	},
	state: {
		gap: tokens["--space-3"],
		display: "flex",
		flexDirection: "column",
	},
	stateLabel: {
		margin: 0,
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-1"],
		fontWeight: tokens["--font-weight-regular"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
	},
	sizeStack: {
		gap: tokens["--space-6"],
		display: "flex",
		flexDirection: "column",
	},
	countryValue: {
		gap: tokens["--space-2"],
		alignItems: "center",
		display: "inline-flex",
		minWidth: 0,
	},
	countryItem: {
		alignItems: "center",
		columnGap: tokens["--space-2"],
		display: "grid",
		gridTemplateColumns: "auto minmax(0, 1fr) auto",
		minWidth: "16rem",
	},
	flag: {
		fontSize: tokens["--font-size-3"],
		lineHeight: tokens["--line-height-3"],
	},
	countryName: {
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
	},
	countryMeta: {
		color: "currentColor",
		fontSize: tokens["--font-size-1"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
		opacity: 0.68,
	},
	userSelect: {
		height: "auto",
	},
	userOptionItem: {
		borderRadius: 0,
		// columnGap: tokens["--space-2"],
		minWidth: 0,
	},
	userValueItem: {
		borderRadius: 0,
		// columnGap: tokens["--space-2"],
		maxWidth: "100%",
		minWidth: 0,
	},
	userName: {
		display: "block",
		minWidth: 0,
	},
	inlineUseCase: {
		gap: tokens["--space-6"],
		display: "flex",
		flexDirection: "column",
		minHeight: "12rem",
	},
	adLibSentence: {
		alignItems: "baseline",
		color: tokens["--fg"],
		columnGap: tokens["--space-1"],
		display: "flex",
		flexWrap: "wrap",
		fontSize: tokens["--font-size-2"],
		letterSpacing: tokens["--letter-spacing-2"],
		lineHeight: tokens["--line-height-2"],
		rowGap: 0,
		maxWidth: "44rem",
	},
	adLibSelect: {
		alignSelf: "baseline",
	},
	adLibHint: {
		margin: 0,
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-1"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
	},
});
