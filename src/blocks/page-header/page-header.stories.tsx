import { GithubLogoIcon } from "@phosphor-icons/react/dist/csr/GithubLogo";
import { GitForkIcon } from "@phosphor-icons/react/dist/csr/GitFork";
import { LockIcon } from "@phosphor-icons/react/dist/csr/Lock";
import { StarIcon } from "@phosphor-icons/react/dist/csr/Star";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, Badge, Breadcrumbs, Button, InputGroup, Tabs } from "@/components";
import { Stack } from "@/components/layout/layout";
import { PageHeader } from "./page-header";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";

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
		<Stack gap={8}>
			<PageHeader
				title="base-stylex-lab"
				description="React primitives and workflow blocks composed with Base UI and StyleX."
				startSlot={
					<Avatar icon={<GithubLogoIcon aria-hidden weight="fill" />} name="GitHub" size={8} />
				}
				breadcrumbs={
					<Breadcrumbs.Root size="sm">
						<Breadcrumbs.Link href="#">Repositories</Breadcrumbs.Link>
						<Breadcrumbs.Separator />
						<Breadcrumbs.Current>base-stylex-lab</Breadcrumbs.Current>
					</Breadcrumbs.Root>
				}
				titleAddon={
					<Badge hue="neutral" startSlot={<LockIcon aria-hidden weight="fill" />}>
						Private
					</Badge>
				}
				actions={
					<>
						<Button size="sm" variant="neutral" startSlot={<StarIcon aria-hidden weight="bold" />}>
							Star
						</Button>
						<Button
							size="sm"
							variant="neutral"
							startSlot={<GitForkIcon aria-hidden weight="bold" />}
						>
							Fork
						</Button>
					</>
				}
				navSlot={
					<Tabs.Root defaultValue="code" variant="underline">
						<Tabs.List aria-label="Repository sections">
							<Tabs.Tab value="code">Code</Tabs.Tab>
							<Tabs.Tab value="issues">Issues</Tabs.Tab>
							<Tabs.Tab value="pulls">Pull requests</Tabs.Tab>
							<Tabs.Tab value="actions">Actions</Tabs.Tab>
						</Tabs.List>
					</Tabs.Root>
				}
			/>

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
				navSlot={
					<Tabs.Root defaultValue="open">
						<Stack orientation="horizontal" gap={2} align="start">
							<Tabs.List aria-label="Pull request states">
								<Tabs.Tab value="open">Open</Tabs.Tab>
								<Tabs.Tab value="merged">Merged</Tabs.Tab>
								<Tabs.Tab value="closed">Closed</Tabs.Tab>
							</Tabs.List>
							<InputGroup.Root>
								<InputGroup.Addon>
									<MagnifyingGlassIcon aria-hidden />
								</InputGroup.Addon>
								<InputGroup.Input
									aria-label="Search pull requests"
									placeholder="Search pull requests"
								/>
							</InputGroup.Root>
						</Stack>
					</Tabs.Root>
				}
			/>
		</Stack>
	),
};
