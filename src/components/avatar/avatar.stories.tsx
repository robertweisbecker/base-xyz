import { GearIcon } from "@phosphor-icons/react/dist/csr/Gear";
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import { RobotIcon } from "@phosphor-icons/react/dist/csr/Robot";
import { SignOutIcon } from "@phosphor-icons/react/dist/csr/SignOut";
import { UserIcon } from "@phosphor-icons/react/dist/csr/User";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { colors, fontSize, fontWeight, letterSpacing, lineHeight, space } from "@/styles/tokens.stylex";
import { Button, IconButton } from "../button/button";
import { Stack } from "../layout/layout";
import * as Menu from "../menu/menu";
import { Text } from "../text/text";
import { Avatar, type AvatarProps, type AvatarSize } from "./avatar";

const image = "/avatar-example.svg";
const sizes = [4, 6, 8, 10, 12, 16] as const satisfies readonly AvatarSize[];
const iconOptions = {
	None: undefined,
	Robot: <RobotIcon aria-hidden weight="fill" />,
	User: <UserIcon aria-hidden weight="fill" />,
};

const meta = {
	title: "Components/Avatar",
	component: Avatar,
	args: {
		icon: undefined,
		image: undefined,
		imageAlt: "",
		initials: undefined,
		name: "Ada Lovelace",
		shape: "circle",
		size: 8,
	},
	argTypes: {
		icon: {
			control: "select",
			options: Object.keys(iconOptions),
			mapping: iconOptions,
		},
		image: { control: "text" },
		imageAlt: { control: "text" },
		initials: { control: "text" },
		name: { control: "text" },
		shape: {
			control: "inline-radio",
			options: ["circle", "rounded", "square"],
		},
		size: {
			control: "select",
			options: sizes,
		},
	},
	parameters: {
		controls: {
			include: ["image", "imageAlt", "icon", "initials", "name", "size", "shape"],
		},
	},
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Composition: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<div {...stylex.props(storyStyles.row)}>
			<section {...stylex.props(storyStyles.section)}>
				<span {...stylex.props(storyStyles.label)}>Avatar as menu trigger</span>
				<Menu.Root>
					<Avatar
						aria-label="Open user settings"
						image={image}
						name="Ada Lovelace"
						render={<Menu.Trigger render={<Button nativeButton shape="circle" size="lg" variant="ghost" />} />}
						size={10}
					/>
					<AccountMenu />
				</Menu.Root>
			</section>
			<section {...stylex.props(storyStyles.section)}>
				<span {...stylex.props(storyStyles.label)}>Avatar in menu trigger</span>
				<Menu.Root>
					<Menu.Trigger
						render={<IconButton icon={<Avatar image={image} size={4} />} label="Ada Lovelace" variant="neutral" />}
					/>
					<AccountMenu />
				</Menu.Root>
			</section>
		</div>
	),
};

function AccountMenu() {
	return (
		<Menu.Popup positionerProps={{ align: "end" }} style={storyStyles.accountMenu}>
			<Menu.Group>
				<Menu.GroupLabel style={storyStyles.accountIdentity}>
					<Avatar image={image} size={6} />
					<Stack>
						<Text fontWeight="medium" size="2">
							Ada Lovelace
						</Text>
						<Text color="muted" size="1" truncate>
							ada.lovelace@example.com
						</Text>
					</Stack>
				</Menu.GroupLabel>
				<Menu.Separator />
				<Menu.Item>
					<Menu.ItemIcon>
						<UserIcon size={16} weight="duotone" />
					</Menu.ItemIcon>
					<Menu.ItemLabel>Profile</Menu.ItemLabel>
				</Menu.Item>
				<Menu.Item>
					<Menu.ItemIcon>
						<GearIcon size={16} weight="duotone" />
					</Menu.ItemIcon>
					<Menu.ItemLabel>Settings</Menu.ItemLabel>
				</Menu.Item>
			</Menu.Group>
			<Menu.Separator />
			<Menu.Item>
				<Menu.ItemIcon>
					<PlusIcon size={16} weight="regular" />
				</Menu.ItemIcon>
				<Menu.ItemLabel>Add account</Menu.ItemLabel>
			</Menu.Item>
			<Menu.Item variant="danger">
				<Menu.ItemIcon>
					<SignOutIcon size={16} weight="duotone" />
				</Menu.ItemIcon>
				<Menu.ItemLabel>Log out</Menu.ItemLabel>
			</Menu.Item>
		</Menu.Popup>
	);
}

const options: { label: string; props: AvatarProps }[] = [
	{ label: "Image", props: { image, initials: "AL", name: "Ada Lovelace" } },
	{
		label: "Custom icon overrides initials",
		props: { icon: <RobotIcon aria-hidden weight="fill" />, initials: "GR", name: "Grace Robot" },
	},
	{ label: "Explicit initials", props: { initials: "GH", name: "Grace Hopper" } },
	{ label: "Initials derived from name", props: { name: "Katherine Johnson" } },
	{ label: "Default icon", props: {} },
	{
		label: "Failed image fallback",
		props: { image: "/missing-avatar.svg", initials: "MV", name: "Margaret Hamilton" },
	},
];

export const Options: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<div {...stylex.props(storyStyles.row)}>
			{options.map(({ label, props }) => (
				<div key={label} {...stylex.props(storyStyles.specimen)}>
					<Avatar size={10} {...props} />
					<span {...stylex.props(storyStyles.label)}>{label}</span>
				</div>
			))}
		</div>
	),
};

export const Variants: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<div {...stylex.props(storyStyles.row)}>
			{(["circle", "rounded", "square"] as const).map((shape) => (
				<div key={shape} {...stylex.props(storyStyles.specimen)}>
					<Avatar initials="AS" name={`Avatar ${shape}`} shape={shape} size={10} />
					<span {...stylex.props(storyStyles.label)}>{shape}</span>
				</div>
			))}
		</div>
	),
};

export const Sizes: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<div {...stylex.props(storyStyles.sections)}>
			<section {...stylex.props(storyStyles.section)}>
				<span {...stylex.props(storyStyles.label)}>Spacing scale</span>
				<div {...stylex.props(storyStyles.row, storyStyles.alignEnd)}>
					{sizes.map((size) => (
						<div key={size} {...stylex.props(storyStyles.specimen)}>
							<Avatar initials={String(size)} name={`${size} spacing step avatar`} size={size} />
							<span {...stylex.props(storyStyles.label)}>{size}</span>
						</div>
					))}
				</div>
			</section>
			<section {...stylex.props(storyStyles.section)}>
				<span {...stylex.props(storyStyles.label)}>Responsive</span>
				<div {...stylex.props(storyStyles.specimen)}>
					<Avatar image={image} name="Responsive avatar" size={{ default: 6, md: 12 }} />
					<span {...stylex.props(storyStyles.label)}>6 by default, 12 from medium</span>
				</div>
			</section>
		</div>
	),
};

const storyStyles = stylex.create({
	accountIdentity: {
		padding: space[2],
		gap: space[3],
		alignItems: "center",
		display: "flex",
		minWidth: 0,
	},
	accountMenu: {
		width: "20rem",
	},
	alignEnd: {
		alignItems: "end",
	},
	label: {
		color: colors["--text-muted"],
		fontSize: fontSize.x1,
		fontWeight: fontWeight.regular,
		letterSpacing: letterSpacing.x1,
		lineHeight: lineHeight.x1,
	},
	row: {
		gap: space[6],
		alignItems: "center",
		display: "flex",
		flexWrap: "wrap",
	},
	section: {
		gap: space[3],
		display: "flex",
		flexDirection: "column",
	},
	sections: {
		gap: space[8],
		display: "flex",
		flexDirection: "column",
	},
	specimen: {
		gap: space[2],
		alignItems: "center",
		display: "flex",
		flexDirection: "column",
		textAlign: "center",
	},
});
