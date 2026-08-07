import { GithubLogoIcon } from "@phosphor-icons/react/dist/csr/GithubLogo";
import { GitForkIcon } from "@phosphor-icons/react/dist/csr/GitFork";
import { LockIcon } from "@phosphor-icons/react/dist/csr/Lock";
import { StarIcon } from "@phosphor-icons/react/dist/csr/Star";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { Avatar, Badge, Breadcrumbs, Button, Separator, Tabs } from "@/components";
import { PageHeader } from "./page-header";

const meta = {
	title: "Blocks/Page header",
	component: PageHeader,
	parameters: {
		controls: { disable: true },
	},
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj;

export const Examples: Story = {
	render: () => (
		<div {...stylex.props(storyParts.list)}>
			<PageHeader
				title="base-stylex-lab"
				description="React primitives and workflow blocks composed with Base UI and StyleX."
				startSlot={
					<Avatar icon={<GithubLogoIcon aria-hidden weight="fill" size={"inherit"} />} name="GitHub" size={8} />
				}
				breadcrumbs={
					<Breadcrumbs.Root size="sm">
						<Breadcrumbs.Link href="#">Repositories</Breadcrumbs.Link>
						<Breadcrumbs.Separator />
						<Breadcrumbs.Current>base-stylex-lab</Breadcrumbs.Current>
					</Breadcrumbs.Root>
				}
				metadata={
					<Badge hue="neutral" startSlot={<LockIcon aria-hidden weight="fill" />}>
						Private
					</Badge>
				}
				actions={
					<>
						<Button size="sm" variant="neutral" startSlot={<StarIcon aria-hidden weight="bold" />}>
							Star
						</Button>
						<Button size="sm" variant="neutral" startSlot={<GitForkIcon aria-hidden weight="bold" />}>
							Fork
						</Button>
					</>
				}
				navigation={
					<Tabs.Root defaultValue="code" size="sm">
						<Tabs.List aria-label="Repository sections">
							<Tabs.Tab value="code">Code</Tabs.Tab>
							<Tabs.Tab value="issues">Issues</Tabs.Tab>
							<Tabs.Tab value="pulls">Pull requests</Tabs.Tab>
							<Tabs.Tab value="actions">Actions</Tabs.Tab>
						</Tabs.List>
					</Tabs.Root>
				}
			/>

			<Separator />

			<PageHeader
				title="Pull requests"
				description="Review proposed changes before they merge into the design system."
				headingLevel={2}
				breadcrumbs={
					<Breadcrumbs.Root size="sm">
						<Breadcrumbs.Link href="#">base-stylex-lab</Breadcrumbs.Link>
						<Breadcrumbs.Separator />
						<Breadcrumbs.Current>Pull requests</Breadcrumbs.Current>
					</Breadcrumbs.Root>
				}
				actions={
					<Button size="sm" variant="secondary">
						New pull request
					</Button>
				}
				navigation={
					<Tabs.Root defaultValue="open" size="sm">
						<Tabs.List aria-label="Pull request states">
							<Tabs.Tab value="open">Open</Tabs.Tab>
							<Tabs.Tab value="merged">Merged</Tabs.Tab>
							<Tabs.Tab value="closed">Closed</Tabs.Tab>
						</Tabs.List>
					</Tabs.Root>
				}
			/>
		</div>
	),
};

const storyParts = stylex.create({
	list: {
		display: "flex",
		flexDirection: "column",
	},
});
