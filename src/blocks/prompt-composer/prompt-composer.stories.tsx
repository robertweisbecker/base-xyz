import { GlobeIcon } from "@phosphor-icons/react/dist/csr/Globe";
import { LinkSimpleIcon } from "@phosphor-icons/react/dist/csr/LinkSimple";
import { PaperclipIcon } from "@phosphor-icons/react/dist/csr/Paperclip";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { useState, type ReactNode } from "react";
import * as Menu from "@/components/menu/menu";
import { Separator } from "@/components/separator/separator";
import * as Toolbar from "@/components/toolbar/toolbar";
import { color, space } from "@/styles/tokens.stylex";
import {
  fontSize,
  letterSpacing,
  lineHeight,
} from "@/styles/tokens.stylex";
import * as ModelSelector from "../model-selector/model-selector";
import {
  exampleDefaultValue,
  exampleEffortOptions,
  exampleModelGroups,
  exampleSpeedOptions,
  getExampleModelLabel,
} from "../model-selector/model-selector.examples";
import * as PromptComposer from "./prompt-composer";

type ComposerDemoProps = Pick<
  PromptComposer.PromptComposerRootProps,
  "clearOnSubmit" | "defaultValue" | "disabled"
>;

const meta = {
  title: "Blocks/Prompt composer",
  component: PromptComposer.Root,
  args: {
    onSubmit: () => undefined,
  },
  argTypes: {
    onSubmit: { control: false },
  },
  parameters: {
    controls: { disable: true },
  },
} satisfies Meta<typeof PromptComposer.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Examples: Story = {
  render: () => (
    <div {...stylex.props(storyParts.examples)}>
      <Example label="Ready, empty">
        <ComposerDemo clearOnSubmit defaultValue="" disabled={false} />
      </Example>
      <Separator />
      <Example label="Ready, filled">
        <ComposerDemo
          clearOnSubmit={false}
          defaultValue="Summarize the open review comments."
          disabled={false}
        />
      </Example>
      <Separator />
      <Example label="Disabled">
        <DisabledDemo />
      </Example>
      <Separator />
      <Example label="Generating">
        <GeneratingDemo />
      </Example>
    </div>
  ),
};

function ComposerSurface({
  children,
  submitting = false,
  onStop,
}: {
  children?: React.ReactNode;
  submitting?: boolean;
  onStop?: () => void;
}) {
  return (
    <PromptComposer.Surface>
      <PromptComposer.Input />
      <PromptComposer.Footer>
        <PromptComposer.Options>{children}</PromptComposer.Options>
        <PromptComposer.Actions>
          {submitting ? (
            <PromptComposer.Stop onClick={onStop} />
          ) : (
            <PromptComposer.Submit />
          )}
        </PromptComposer.Actions>
      </PromptComposer.Footer>
    </PromptComposer.Surface>
  );
}

function AddMenu({ setFeedback }: { setFeedback: (message: string) => void }) {
  return (
    <Menu.Root>
      <PromptComposer.AddTrigger />
      <PromptComposer.AddPopup>
            <Menu.Group>
              <Menu.GroupLabel>Add</Menu.GroupLabel>
              <Menu.Item
                onClick={() => setFeedback("Attachment action requested.")}
              >
                <Menu.ItemIcon>
                  <PaperclipIcon aria-hidden size={16} weight="bold" />
                </Menu.ItemIcon>
                <PromptComposer.AddItemContent>
                  Files and folders
                </PromptComposer.AddItemContent>
              </Menu.Item>
              <Menu.Item onClick={() => setFeedback("Link action requested.")}>
                <Menu.ItemIcon>
                  <LinkSimpleIcon aria-hidden size={16} weight="bold" />
                </Menu.ItemIcon>
                <PromptComposer.AddItemContent>
                  <span>Add a link</span>
                  <PromptComposer.AddItemDescription>
                    Paste a URL
                  </PromptComposer.AddItemDescription>
                </PromptComposer.AddItemContent>
              </Menu.Item>
            </Menu.Group>
      </PromptComposer.AddPopup>
    </Menu.Root>
  );
}

function GeneratingDemo() {
  const [feedback, setFeedback] = useState("Generating a response…");
  const [submitting, setSubmitting] = useState(true);
  const [webSearch, setWebSearch] = useState(false);

  return (
    <div {...stylex.props(storyParts.demo)}>
      <PromptComposer.Root
        defaultValue="Summarize the open review comments."
        onSubmit={(prompt) => setFeedback(`Submitted: ${prompt}`)}
        submitting={submitting}
      >
        <ComposerSurface
          submitting={submitting}
          onStop={() => {
            setSubmitting(false);
            setFeedback("Generation stopped.");
          }}
        >
          <Toolbar.Root aria-label="Prompt options" variant="unstyled">
            <Toolbar.Button
              aria-label="Search the web"
              aria-pressed={webSearch}
              onClick={() => {
                setWebSearch((enabled) => !enabled);
                setFeedback(
                  webSearch ? "Web search disabled." : "Web search enabled.",
                );
              }}
            >
              <GlobeIcon aria-hidden size={16} weight="bold" />
              Search
            </Toolbar.Button>
          </Toolbar.Root>
        </ComposerSurface>
      </PromptComposer.Root>
      <Feedback>{feedback}</Feedback>
    </div>
  );
}

function DisabledDemo() {
  return (
    <PromptComposer.Root
      defaultValue="Summarize the open review comments."
      disabled
      onSubmit={() => undefined}
    >
      <ComposerSurface />
    </PromptComposer.Root>
  );
}

function ComposerDemo({
  clearOnSubmit,
  defaultValue,
  disabled,
}: ComposerDemoProps) {
  const [feedback, setFeedback] = useState(
    "Press Enter to send. Use Shift + Enter for a new line.",
  );

  return (
    <div {...stylex.props(storyParts.demo)}>
      <PromptComposer.Root
        clearOnSubmit={clearOnSubmit}
        defaultValue={defaultValue}
        disabled={disabled}
        onSubmit={(prompt) => setFeedback(`Submitted: ${prompt}`)}
      >
        <ComposerSurface>
          <AddMenu setFeedback={setFeedback} />
          <Toolbar.Root aria-label="Prompt options" variant="unstyled">
            <ModelSelector.Root
              groups={exampleModelGroups}
              effortOptions={exampleEffortOptions}
              speedOptions={exampleSpeedOptions}
              defaultValue={exampleDefaultValue}
              onValueChange={(value, { reason }) => {
                if (reason === "reset") {
                  setFeedback("Model settings reset to defaults.");
                  return;
                }
                if (reason === "model") {
                  setFeedback(
                    `Model changed to ${getExampleModelLabel(value.model)}.`,
                  );
                  return;
                }
                if (reason === "effort") {
                  setFeedback(`Effort changed to ${value.effort}.`);
                  return;
                }
                setFeedback(`Speed changed to ${value.speed}.`);
              }}
            >
              <ModelSelector.Trigger
                render={<Toolbar.Button style={storyParts.modelTrigger} />}
              />
              <ModelSelector.Popup />
            </ModelSelector.Root>
          </Toolbar.Root>
        </ComposerSurface>
      </PromptComposer.Root>
      <Feedback>{feedback}</Feedback>
    </div>
  );
}

function Example({ children, label }: { children: ReactNode; label: string }) {
  return (
    <section {...stylex.props(storyParts.example)}>
      <h2 {...stylex.props(storyParts.label)}>{label}</h2>
      {children}
    </section>
  );
}

function Feedback({ children }: { children: ReactNode }) {
  return (
    <p aria-live="polite" {...stylex.props(storyParts.feedback)}>
      {children}
    </p>
  );
}

const storyParts = stylex.create({
  demo: {
    gap: space[3],
    display: "flex",
    flexDirection: "column",
    maxWidth: "42rem",
    width: "100%",
  },
  examples: {
    gap: space[6],
    display: "flex",
    flexDirection: "column",
    maxWidth: "42rem",
  },
  example: {
    gap: space[3],
    display: "flex",
    flexDirection: "column",
  },
  label: {
    margin: 0,
    color: color.fgMuted,
    fontSize: fontSize.x1,
    letterSpacing: letterSpacing.x1,
    lineHeight: lineHeight.x1,
  },
  feedback: {
    margin: 0,
    color: color.fgMuted,
    fontSize: fontSize.x1,
    letterSpacing: letterSpacing.x1,
    lineHeight: lineHeight.x1,
  },
  modelTrigger: {
    maxWidth: "100%",
  },
});
