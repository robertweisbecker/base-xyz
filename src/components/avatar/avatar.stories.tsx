import { GearIcon } from "@phosphor-icons/react/dist/csr/Gear";
import { IdentificationCardIcon } from "@phosphor-icons/react/dist/csr/IdentificationCard";
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import { RobotIcon } from "@phosphor-icons/react/dist/csr/Robot";
import { SignOutIcon } from "@phosphor-icons/react/dist/csr/SignOut";
import { UserIcon } from "@phosphor-icons/react/dist/csr/User";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { Button, IconButton } from "@/components/button/button";
import { Stack } from "@/components/layout/layout";
import { Menu } from "@/components/menu/menu";
import { Text } from "@/components/text/text";
import { tokens } from "@/theme/tokens.stylex";
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
		<Stack align="center" gap={6} orientation="horizontal" wrap="wrap">
			<Stack align="start" gap={3}>
				<Text size="1" color="muted">
					Avatar as menu trigger
				</Text>
				<Menu.Root>
					<Avatar
						aria-label="Open user settings"
						image={image}
						name="Ada Lovelace"
						render={
							<Menu.Trigger
								render={<Button nativeButton shape="circle" size="lg" variant="ghost" />}
							/>
						}
						size={10}
					/>
					<AccountMenu />
				</Menu.Root>
			</Stack>
			<Stack align="start" gap={3}>
				<Text size="1" color="muted">
					Avatar in menu trigger
				</Text>
				<Menu.Root>
					<Menu.Trigger
						render={
							<IconButton
								icon={<Avatar image={image} size={4} />}
								label="Ada Lovelace"
								variant="neutral"
							/>
						}
					/>
					<AccountMenu />
				</Menu.Root>
			</Stack>
		</Stack>
	),
};

function AccountMenu() {
	return (
		<Menu.Popup positionerProps={{ align: "end" }} xstyle={storyStyles.accountMenu}>
			<Menu.Group>
				<Menu.GroupLabel xstyle={storyStyles.accountIdentity}>
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
						<IdentificationCardIcon size={16} weight="duotone" />
					</Menu.ItemIcon>
					<Menu.ItemLabel>View profile</Menu.ItemLabel>
				</Menu.Item>
				<Menu.Item>
					<Menu.ItemIcon>
						<GearIcon size={16} weight="duotone" />
					</Menu.ItemIcon>
					<Menu.ItemLabel>Manage account</Menu.ItemLabel>
				</Menu.Item>
			</Menu.Group>
			<Menu.Separator />
			<Menu.Item>
				<Menu.ItemIcon>
					<PlusIcon size={16} weight="regular" />
				</Menu.ItemIcon>
				<Menu.ItemLabel>Add account</Menu.ItemLabel>
			</Menu.Item>
			<Menu.Separator />
			<Menu.Item variant="error">
				<Menu.ItemIcon>
					<SignOutIcon size={16} />
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
		<Stack align="center" gap={6} orientation="horizontal" wrap="wrap">
			{options.map(({ label, props }) => (
				<Stack align="center" gap={2} key={label}>
					<Avatar size={10} {...props} />
					<Text size="1" color="muted">
						{label}
					</Text>
				</Stack>
			))}
		</Stack>
	),
};

export const Variants: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<Stack align="center" gap={6} orientation="horizontal" wrap="wrap">
			{(["circle", "rounded", "square"] as const).map((shape) => (
				<Stack align="center" gap={2} key={shape}>
					<Avatar initials="AS" name={`Avatar ${shape}`} shape={shape} size={10} />
					<Text size="1" color="muted">
						{shape}
					</Text>
				</Stack>
			))}
		</Stack>
	),
};

export const Sizes: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<Stack gap={8}>
			<Stack align="start" gap={3}>
				<Text size="1" color="muted">
					Spacing scale
				</Text>
				<Stack align="end" gap={6} orientation="horizontal" wrap="wrap">
					{sizes.map((size) => (
						<Stack align="center" gap={2} key={size}>
							<Avatar initials={String(size)} name={`${size} spacing step avatar`} size={size} />
							<Text size="1" color="muted">
								{size}
							</Text>
						</Stack>
					))}
				</Stack>
			</Stack>
			<Stack align="start" gap={3}>
				<Text size="1" color="muted">
					Responsive
				</Text>
				<Stack align="center" gap={2}>
					<Avatar image={image} name="Responsive avatar" size={{ default: 6, md: 12 }} />
					<Text size="1" color="muted">
						6 by default, 12 from medium
					</Text>
				</Stack>
			</Stack>
		</Stack>
	),
};

const storyStyles = stylex.create({
	accountIdentity: {
		padding: tokens["--space-2"],
		gap: tokens["--space-3"],
		alignItems: "center",
		display: "flex",
		minWidth: 0,
	},
	accountMenu: {
		width: "20rem",
	},
});
