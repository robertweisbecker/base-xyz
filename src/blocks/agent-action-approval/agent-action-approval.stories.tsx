import { ChatCircleDotsIcon } from "@phosphor-icons/react/dist/csr/ChatCircleDots";
import { GitPullRequestIcon } from "@phosphor-icons/react/dist/csr/GitPullRequest";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { Badge, Code } from "@/components";
import { Button } from "@/components/button/button";
import { Checkbox } from "@/components/checkbox/checkbox";
import { CodeBlock } from "@/components/code-block/code-block";
import * as Collapsible from "@/components/collapsible/collapsible";
import { Separator } from "@/components/separator/separator";
import { color, space } from "@/styles/tokens.stylex";
import { fontSize, fontWeight, letterSpacing, lineHeight } from "@/styles/tokens.stylex";
import * as AgentActionApproval from "./agent-action-approval";

const meta = {
	title: "Blocks/Agent action approval",
	component: AgentActionApproval.Root,
	parameters: {
		controls: { disable: true },
	},
} satisfies Meta<typeof AgentActionApproval.Root>;

export default meta;
type Story = StoryObj;

export const Examples: Story = {
	render: () => (
		<div {...stylex.props(storyParts.list)}>
			<Example title="Message approval">
				<AgentActionApproval.Root>
					<AgentActionApproval.Header>
						<AgentActionApproval.Title>Allow this action?</AgentActionApproval.Title>
						<AgentActionApproval.Description>
							Review what the agent will do before it continues.
						</AgentActionApproval.Description>
					</AgentActionApproval.Header>
					<AgentActionApproval.Content>
						<AgentActionApproval.Summary>
							<AgentActionApproval.Icon>
								<ChatCircleDotsIcon aria-hidden size={18} />
							</AgentActionApproval.Icon>
							<AgentActionApproval.SummaryContent>
								<AgentActionApproval.Action>Message #design-systems</AgentActionApproval.Action>
								<AgentActionApproval.ActionDescription>
									"The component audit is ready for review."
								</AgentActionApproval.ActionDescription>
							</AgentActionApproval.SummaryContent>
						</AgentActionApproval.Summary>

						<AgentActionApproval.Details>
							<AgentActionApproval.Detail>
								<AgentActionApproval.DetailLabel>Workspace</AgentActionApproval.DetailLabel>
								<AgentActionApproval.DetailValue>Acme Design</AgentActionApproval.DetailValue>
							</AgentActionApproval.Detail>
							<AgentActionApproval.Detail>
								<AgentActionApproval.DetailLabel>Channel</AgentActionApproval.DetailLabel>
								<AgentActionApproval.DetailValue>#design-systems</AgentActionApproval.DetailValue>
							</AgentActionApproval.Detail>
							<AgentActionApproval.Detail>
								<AgentActionApproval.DetailLabel>Identity</AgentActionApproval.DetailLabel>
								<AgentActionApproval.DetailValue>You</AgentActionApproval.DetailValue>
							</AgentActionApproval.Detail>
						</AgentActionApproval.Details>
						<Collapsible.Root>
							<Collapsible.Trigger size="xs" variant="link">
								Details
								<Collapsible.Icon />
							</Collapsible.Trigger>
							<Collapsible.Panel>
								<Collapsible.Content>
									<CodeBlock>{`{
  "channel": "design-systems",
  "message": "The component audit is ready for review."
}`}</CodeBlock>
								</Collapsible.Content>
							</Collapsible.Panel>
						</Collapsible.Root>
					</AgentActionApproval.Content>
					<AgentActionApproval.Footer>
						<Checkbox
							label={
								<>
									Auto-approve <strong>Send message</strong> actions
								</>
							}
							name="remember-message-approval"
							size="sm"
						/>
						<AgentActionApproval.Actions>
							<Button variant="secondary">Cancel</Button>
							<Button>Allow</Button>
						</AgentActionApproval.Actions>
					</AgentActionApproval.Footer>
				</AgentActionApproval.Root>
			</Example>

			<Separator />

			<Example title="Pull request approval">
				<AgentActionApproval.Root size="sm" variant="elevated">
					<AgentActionApproval.Header>
						<AgentActionApproval.Title>Allow this action?</AgentActionApproval.Title>
						<AgentActionApproval.Description>
							Review what the agent will do before it continues.
						</AgentActionApproval.Description>
					</AgentActionApproval.Header>
					<AgentActionApproval.Content>
						<AgentActionApproval.Summary>
							<AgentActionApproval.Icon>
								<GitPullRequestIcon aria-hidden size={18} />
							</AgentActionApproval.Icon>
							<AgentActionApproval.SummaryContent>
								<AgentActionApproval.Action>Open a pull request</AgentActionApproval.Action>
								<AgentActionApproval.ActionDescription>
									The agent will publish the current branch and create a draft pull request.
								</AgentActionApproval.ActionDescription>
							</AgentActionApproval.SummaryContent>
						</AgentActionApproval.Summary>
						<Separator />
						<AgentActionApproval.Details>
							<AgentActionApproval.Detail>
								<AgentActionApproval.DetailLabel>Repository</AgentActionApproval.DetailLabel>
								<AgentActionApproval.DetailValue>
									<Code>acme/design-system</Code>
								</AgentActionApproval.DetailValue>
							</AgentActionApproval.Detail>
							<AgentActionApproval.Detail>
								<AgentActionApproval.DetailLabel>Branch</AgentActionApproval.DetailLabel>
								<AgentActionApproval.DetailValue>
									<Code>codex/add-progress-blocks</Code>
								</AgentActionApproval.DetailValue>
							</AgentActionApproval.Detail>
							<AgentActionApproval.Detail>
								<AgentActionApproval.DetailLabel>Visibility</AgentActionApproval.DetailLabel>
								<AgentActionApproval.DetailValue>
									<Badge variant="subtle" size="sm">
										Draft
									</Badge>
								</AgentActionApproval.DetailValue>
							</AgentActionApproval.Detail>
						</AgentActionApproval.Details>
					</AgentActionApproval.Content>
					<AgentActionApproval.Footer>
						<AgentActionApproval.Actions>
							<Button size="sm" variant="secondary">
								Cancel
							</Button>
							<Button size="sm">Create draft</Button>
						</AgentActionApproval.Actions>
					</AgentActionApproval.Footer>
				</AgentActionApproval.Root>
			</Example>
		</div>
	),
};

function Example({ children, title }: { children: React.ReactNode; title: string }) {
	return (
		<section {...stylex.props(storyParts.example)}>
			<h2 {...stylex.props(storyParts.heading)}>{title}</h2>
			{children}
		</section>
	);
}

const storyParts = stylex.create({
	list: {
		gap: space.x8,
		display: "flex",
		flexDirection: "column",
	},
	example: {
		gap: space.x3,
		display: "flex",
		flexDirection: "column",
	},
	heading: {
		margin: 0,
		color: color.fgMuted,
		fontSize: fontSize.x1,
		fontWeight: fontWeight.regular,
		letterSpacing: letterSpacing.x1,
		lineHeight: lineHeight.x1,
	},
});
