import { CheckIcon } from "@phosphor-icons/react/dist/csr/Check";
import { CheckCircleIcon } from "@phosphor-icons/react/dist/csr/CheckCircle";
import { CopyIcon } from "@phosphor-icons/react/dist/csr/Copy";
import { FloppyDiskIcon } from "@phosphor-icons/react/dist/csr/FloppyDisk";
import { PaperPlaneTiltIcon } from "@phosphor-icons/react/dist/csr/PaperPlaneTilt";
import { PencilSimpleIcon } from "@phosphor-icons/react/dist/csr/PencilSimple";
import { PlugIcon } from "@phosphor-icons/react/dist/csr/Plug";
import { WarningCircleIcon } from "@phosphor-icons/react/dist/csr/WarningCircle";
import { XIcon } from "@phosphor-icons/react/dist/csr/X";
import * as stylex from "@stylexjs/stylex";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useRef, useState } from "react";
import { tokens } from "@/theme/tokens.stylex";

import { Button, IconButton } from "@/components/button/button";
import { Loader } from "@/components/loader";
import { Tooltip } from "@/components/tooltip/tooltip";
import { Toast } from "./index";
import { Text } from "../text";
import { Stack } from "../layout";
type PopupSide = "top" | "right" | "bottom" | "left";
type PopupAlign = "start" | "center" | "end";
type SwipeDirection = "up" | "down" | "left" | "right";
type StoryArgs = {
	_side: PopupSide;
	_align: PopupAlign;
	_limit: number;
	_swipeDirection: SwipeDirection;
	_timeout: number;
};

const meta = {
	title: "Components/Toast",
	args: {
		_side: "top",
		_align: "center",
		_limit: 3,
		_swipeDirection: "right",
		_timeout: 5000,
	},
	argTypes: {
		_side: {
			control: "inline-radio",
			options: ["top", "right", "bottom", "left"],
		},
		_align: {
			control: "inline-radio",
			options: ["start", "center", "end"],
		},
		_limit: {
			control: { type: "number", min: 1, max: 10, step: 1 },
		},
		_swipeDirection: {
			control: "inline-radio",
			options: ["up", "down", "left", "right"],
		},
		_timeout: {
			control: { type: "number", min: 0, step: 500 },
		},
	},
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<StoryArgs>;

export const Playground: Story = {
	parameters: {
		controls: { include: ["_limit", "_swipeDirection", "_timeout"] },
	},
	render: ({ _limit, _swipeDirection, _timeout }) => (
		<Toast.Provider limit={_limit} timeout={_timeout}>
			<ToastExample swipeDirection={_swipeDirection} />
		</Toast.Provider>
	),
};

export const Stacking: Story = {
	parameters: {
		controls: { include: ["_limit", "_swipeDirection"] },
	},
	render: ({ _limit, _swipeDirection }) => (
		<Toast.Provider timeout={0} limit={_limit}>
			<ToastExample showStackControls swipeDirection={_swipeDirection} />
		</Toast.Provider>
	),
};

export const AnchoredVariants: Story = {
	parameters: {
		controls: { include: ["_side", "_align", "_limit", "_timeout"] },
	},
	render: ({ _side, _align, _limit, _timeout }) => (
		<Toast.AnchoredProvider limit={_limit} timeout={_timeout}>
			<Tooltip.Provider>
				<div {...stylex.props(storyStyles.anchoredVariants)}>
					<DefaultAnchoredExample _side={_side} _align={_align} />
					<TooltipAnchoredExample _side={_side} _align={_align} />
					<PopoverAnchoredExample _side={_side} _align={_align} />
					<PillAnchoredExample _side={_side} _align={_align} />
				</div>
			</Tooltip.Provider>
		</Toast.AnchoredProvider>
	),
};

const deduplicatedToastManager = Toast.createAnchoredToastManager();

export const AnchoredDeduplicated: Story = {
	parameters: {
		controls: { include: ["_side", "_align", "_limit", "_timeout"] },
	},
	render: ({ _side, _align, _limit, _timeout }) => (
		<Toast.AnchoredProvider toastManager={deduplicatedToastManager} limit={_limit} timeout={_timeout}>
			<DeduplicatedAnchoredExample _side={_side} _align={_align} />
		</Toast.AnchoredProvider>
	),
};

function ToastExample({
	showStackControls = false,
	swipeDirection,
}: {
	showStackControls?: boolean;
	swipeDirection: SwipeDirection;
}) {
	const manager = Toast.useToastManager();
	const count = useRef(0);

	function createToast(description = "Your project settings are up to date.") {
		count.current += 1;
		manager.add({
			title: `Changes saved ${count.current > 1 ? `(${count.current})` : ""}`,
			description,
		});
	}

	function createStack() {
		[
			"Your project settings are up to date.",
			"Three collaborators were notified about your changes.",
			"All checks passed. This longer message demonstrates how differently sized notifications animate in the stack.",
		].forEach(createToast);
	}

	return (
		<>
			<div {...stylex.props(storyStyles.controls)}>
				<Button onClick={() => createToast()}>Create toast</Button>
				{showStackControls ? (
					<>
						<Button variant="secondary" onClick={createStack}>
							Create stack
						</Button>
						<Button variant="ghost" onClick={() => manager.close()}>
							Dismiss all
						</Button>
					</>
				) : null}
			</div>
			<Toast.Portal>
				<Toast.Viewport>
					<ToastList swipeDirection={swipeDirection} />
				</Toast.Viewport>
			</Toast.Portal>
		</>
	);
}

function DefaultAnchoredExample({ _side, _align }: Pick<StoryArgs, "_side" | "_align">) {
	const manager = Toast.useAnchoredToastManager();
	const anchorRef = useRef<HTMLButtonElement | null>(null);

	function showFeedback() {
		manager.add({
			id: "settings-saved",
			title: "Changes saved",
			description: "Your notification preferences are up to date.",
			positionerProps: {
				anchor: anchorRef.current,
				side: _side,
				align: _align,
				sideOffset: 10,
			},
			data: {
				variant: "default",
				tone: "success",
				status: "success",
				icon: <CheckCircleIcon aria-hidden size={20} weight="fill" />,
				dismissible: true,
			},
		});
	}

	return (
		<AnchoredStage hint="A standard toast positioned relative to its trigger.">
			<Button ref={anchorRef} onClick={showFeedback} startSlot={<FloppyDiskIcon aria-hidden />}>
				Save preferences
			</Button>
		</AnchoredStage>
	);
}

function TooltipAnchoredExample({ _side, _align }: Pick<StoryArgs, "_side" | "_align">) {
	const manager = Toast.useAnchoredToastManager();
	const anchorRef = useRef<HTMLButtonElement | null>(null);
	const [feedbackVisible, setFeedbackVisible] = useState(false);

	function copyLink() {
		void navigator.clipboard?.writeText("https://example.com/design-system").catch(() => undefined);
		setFeedbackVisible(true);
		manager.add({
			id: "copy-feedback",
			description: "Copied!",
			timeout: 1600,
			onClose: () => setFeedbackVisible(false),
			positionerProps: {
				anchor: anchorRef.current,
				side: _side,
				align: _align,
				sideOffset: 10,
			},
			data: {
				variant: "tooltip",
				tone: "neutral",
				status: "success",
				dismissible: false,
			},
		});
	}

	return (
		<AnchoredStage hint="The ordinary tooltip is disabled while its anchored feedback is visible.">
			<Tooltip.Root disabled={feedbackVisible}>
				<Tooltip.Trigger
					ref={anchorRef}
					closeOnClick={false}
					render={
						<IconButton
							icon={feedbackVisible ? <CheckIcon aria-hidden weight="bold" /> : <CopyIcon aria-hidden />}
							label="Copy design system link"
							onClick={copyLink}
							tooltip={false}
							variant="neutral"
						/>
					}
				/>
				<Tooltip.Popup positionerProps={{ side: _side, align: _align }}>Copy link</Tooltip.Popup>
			</Tooltip.Root>
		</AnchoredStage>
	);
}

function PopoverAnchoredExample({ _side, _align }: Pick<StoryArgs, "_side" | "_align">) {
	const manager = Toast.useAnchoredToastManager();
	const anchorRef = useRef<HTMLButtonElement | null>(null);
	const timerRef = useRef<number | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(
		() => () => {
			if (timerRef.current !== null) {
				window.clearTimeout(timerRef.current);
			}
		},
		[],
	);

	function submitForm() {
		if (isSubmitting) {
			return;
		}

		manager.close("submit-error");
		setIsSubmitting(true);
		timerRef.current = window.setTimeout(() => {
			setIsSubmitting(false);
			manager.add({
				id: "submit-error",
				title: "Couldn’t submit changes",
				description: "The server is not responding. Check your connection and try again.",
				priority: "high",
				positionerProps: {
					anchor: anchorRef.current,
					side: _side,
					align: _align,
					sideOffset: 8,
				},
				data: {
					variant: "popover",
					tone: "error",
					status: "error",
					icon: <WarningCircleIcon aria-hidden size={20} weight="fill" />,
					dismissible: true,
				},
			});
		}, 3000);
	}

	return (
		<AnchoredStage hint="Contextual feedback can carry a title, description, status, and close action.">
			<Button
				ref={anchorRef}
				disabled={isSubmitting}
				onClick={submitForm}
				startSlot={isSubmitting ? <Loader aria-hidden /> : <PaperPlaneTiltIcon aria-hidden />}>
				{isSubmitting ? "Submitting…" : "Submit changes"}
			</Button>
		</AnchoredStage>
	);
}

type PillDemoStatus = "idle" | "ongoing" | "success" | "error";

const editingSteps = [
	{ files: 4, additions: 12, deletions: 3 },
	{ files: 11, additions: 83, deletions: 24 },
	{ files: 29, additions: 279, deletions: 277 },
	{ files: 37, additions: 341, deletions: 302 },
	{ files: 42, additions: 398, deletions: 331 },
] as const;

function PillAnchoredExample({ _side, _align }: Pick<StoryArgs, "_side" | "_align">) {
	const manager = Toast.useAnchoredToastManager();
	const anchorRef = useRef<HTMLButtonElement | null>(null);
	const [stepIndex, setStepIndex] = useState(0);
	const [status, setStatus] = useState<PillDemoStatus>("idle");

	function positionerProps() {
		return {
			anchor: anchorRef.current,
			side: _side,
			align: _align,
			sideOffset: 12,
		};
	}

	function showEditingStep(nextStepIndex: number) {
		const step = editingSteps[nextStepIndex];

		manager.add({
			id: "agent-editing-progress",
			title: `Step ${nextStepIndex + 1} / ${editingSteps.length} · ${step.files} files changed`,
			description: (
				<Stack orientation="horizontal" gap={1}>
					<Text size="1" color="success" tabular render={<span />} fontFamily="mono">
						+{step.additions}
					</Text>
					<Text size="1" color="error" tabular render={<span />} fontFamily="mono">
						−{step.deletions}
					</Text>
				</Stack>
			),
			timeout: 0,
			positionerProps: positionerProps(),
			onClose: () => {
				setStatus("idle");
				setStepIndex(0);
			},
			data: {
				variant: "pill",
				tone: "accent",
				status: "ongoing",
				dismissible: false,
			},
		});
	}

	function startGoal() {
		setStatus("ongoing");
		setStepIndex(0);
		showEditingStep(0);
	}

	function updateGoal() {
		const nextStepIndex = Math.min(stepIndex + 1, editingSteps.length - 1);
		setStepIndex(nextStepIndex);
		showEditingStep(nextStepIndex);
	}

	function finishGoal(nextStatus: "success" | "error") {
		setStatus(nextStatus);
		manager.add({
			id: "agent-editing-progress",
			title: nextStatus === "success" ? "Editing complete" : "Disconnected from agent",
			description: nextStatus === "success" ? `${editingSteps[stepIndex].files} files updated` : "Editing paused",
			timeout: 2200,
			priority: nextStatus === "error" ? "high" : "low",
			positionerProps: positionerProps(),
			onClose: () => setStatus("idle"),
			data: {
				variant: "pill",
				tone: nextStatus === "success" ? "success" : "error",
				status: nextStatus,
				icon:
					nextStatus === "success" ? (
						<CheckCircleIcon aria-hidden size={16} weight="fill" />
					) : (
						<PlugIcon aria-hidden size={16} weight="fill" />
					),
				dismissible: false,
			},
		});
	}

	return (
		<AnchoredStage hint="Start a goal, update its progress through five editing snapshots, then complete it or disconnect the agent.">
			<div {...stylex.props(storyStyles.pillControls)}>
				<Button
					ref={anchorRef}
					disabled={status === "ongoing"}
					onClick={startGoal}
					startSlot={<PencilSimpleIcon aria-hidden />}>
					Start goal
				</Button>
				<Button
					variant="secondary"
					disabled={status !== "ongoing" || stepIndex >= editingSteps.length - 1}
					onClick={updateGoal}>
					Update
				</Button>
				<Button variant="secondary" disabled={status !== "ongoing"} onClick={() => finishGoal("success")}>
					Complete goal
				</Button>
				<Button
					variant="error"
					disabled={status !== "ongoing"}
					onClick={() => finishGoal("error")}
					startSlot={<PlugIcon aria-hidden />}>
					Disconnect
				</Button>
			</div>
		</AnchoredStage>
	);
}

function DeduplicatedAnchoredExample({ _side, _align }: Pick<StoryArgs, "_side" | "_align">) {
	const manager = Toast.useAnchoredToastManager();
	const anchorRef = useRef<HTMLButtonElement | null>(null);
	const notificationCount = useRef(0);

	function saveDraft() {
		notificationCount.current += 1;
		manager.add({
			id: "draft-saved",
			title: "Draft saved",
			description: `Re-notified ${notificationCount.current} ${
				notificationCount.current === 1 ? "time" : "times"
			}. The toast remains a single instance.`,
			positionerProps: {
				anchor: anchorRef.current,
				side: _side,
				align: _align,
				sideOffset: 10,
			},
			data: {
				variant: "default",
				tone: "accent",
				status: "success",
				icon: <CheckCircleIcon aria-hidden size={20} weight="fill" />,
				dismissible: true,
			},
		});
	}

	return (
		<AnchoredStage hint="Click repeatedly: the stable ID updates one toast and replays its attention animation.">
			<Button ref={anchorRef} onClick={saveDraft} startSlot={<FloppyDiskIcon aria-hidden />}>
				Save draft
			</Button>
		</AnchoredStage>
	);
}

function AnchoredStage({ hint, children }: { hint: string; children: React.ReactNode }) {
	return (
		<div {...stylex.props(storyStyles.stage)}>
			<div {...stylex.props(storyStyles.anchor)}>{children}</div>
			<p {...stylex.props(storyStyles.hint)}>{hint}</p>
		</div>
	);
}

function ToastList({ swipeDirection }: { swipeDirection: SwipeDirection }) {
	const { toasts } = Toast.useToastManager();

	return toasts.map((toast) => (
		<Toast.Root key={toast.id} toast={toast} swipeDirection={swipeDirection}>
			<Toast.Content>
				<Toast.Text>
					<Toast.Title />
					<Toast.Description />
				</Toast.Text>
				<Toast.Close aria-label="Dismiss notification">
					<XIcon aria-hidden size={16} weight="bold" />
				</Toast.Close>
			</Toast.Content>
		</Toast.Root>
	));
}

const storyStyles = stylex.create({
	controls: {
		gap: "8px",
		alignItems: "center",
		display: "flex",
		flexWrap: "wrap",
		justifyContent: "center",
	},
	anchoredVariants: {
		gap: tokens["--space-6"],
		display: "grid",
		gridTemplateColumns: {
			default: "repeat(2, minmax(0, 1fr))",
			"@media (max-width: 900px)": "1fr",
		},
		width: "min(1100px, calc(100vw - 48px))",
	},
	stage: {
		padding: tokens["--space-6"],
		gap: tokens["--space-6"],
		alignItems: "center",
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		minHeight: "240px",
		width: "100%",
	},
	anchor: {
		alignItems: "center",
		display: "flex",
		justifyContent: "center",
		minHeight: "64px",
	},
	hint: {
		margin: 0,
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-1"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
		textAlign: "center",
		textWrap: "balance",
		maxWidth: "440px",
	},
	pillControls: {
		gap: tokens["--space-2"],
		alignItems: "center",
		display: "flex",
		flexWrap: "wrap",
		justifyContent: "center",
	},
	changeCount: {
		gap: tokens["--space-1"],
		display: "inline-flex",
	},
	additions: {
		color: tokens["--fg-success"],
	},
	deletions: {
		color: tokens["--fg-error"],
	},
});
