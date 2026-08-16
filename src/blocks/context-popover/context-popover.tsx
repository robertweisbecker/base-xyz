import * as stylex from "@stylexjs/stylex";
import { Button, Meter, MeterGauge, Popover } from "@/components";
import type { ButtonProps } from "@/components";
import { tokens } from "@/theme/tokens.stylex";

export type ContextPopoverProps = Pick<ButtonProps, "size" | "variant"> & {
	/** Number of context tokens currently used. */
	usage: number;
	/** Total context-token capacity. */
	total: number;
};

const tokenFormatter = new Intl.NumberFormat(undefined, {
	compactDisplay: "short",
	maximumFractionDigits: 1,
	notation: "compact",
});

const percentageFormatter = new Intl.NumberFormat(undefined, {
	maximumFractionDigits: 1,
	style: "percent",
});

export function ContextPopover({ size = "md", total, usage, variant = "ghost" }: ContextPopoverProps) {
	const normalizedUsage = normalizeTokenCount(usage);
	const normalizedTotal = normalizeTokenCount(total);
	const boundedUsage = Math.min(normalizedUsage, normalizedTotal);
	const ratio = normalizedTotal > 0 ? boundedUsage / normalizedTotal : 0;
	const percentageText = percentageFormatter.format(ratio);
	const tokenFraction = `${tokenFormatter.format(normalizedUsage).toLowerCase()} / ${tokenFormatter.format(normalizedTotal).toLowerCase()} tokens`;

	return (
		<Popover.Root>
			<Popover.Trigger
				closeDelay={150}
				delay={150}
				openOnHover
				render={
					<Button aria-label={`Context usage: ${percentageText}`} shape="circle" size={size} variant={variant} />
				}>
				<MeterGauge
					aria-hidden
					fillColor="currentColor"
					trackColor="color-mix(in srgb, currentColor 25%, transparent)"
					showValue={false}
					size={size === "lg" ? 20 : 16}
					style={contextPopoverParts.gauge}
					value={ratio * 100}
				/>
			</Popover.Trigger>

			<Popover.Popup
				positionerProps={{ align: "center", side: "top" }}
				showClose={false}
				style={contextPopoverParts.popup}>
				<Popover.Title>Context usage</Popover.Title>
				<Meter.Root
					aria-valuetext={`${tokenFraction}, ${percentageText}`}
					color={tokens["--fill-neutral"]}
					max={normalizedTotal > 0 ? normalizedTotal : 1}
					value={boundedUsage}>
					<Meter.Label>{tokenFraction}</Meter.Label>
					<Meter.Value>{() => percentageText}</Meter.Value>
					<Meter.Track>
						<Meter.Indicator />
					</Meter.Track>
				</Meter.Root>
			</Popover.Popup>
		</Popover.Root>
	);
}

function normalizeTokenCount(value: number) {
	if (!Number.isFinite(value)) return 0;
	return Math.max(0, value);
}

const contextPopoverParts = stylex.create({
	gauge: {
		color: "inherit",
		flexShrink: 0,
	},
	popup: {
		width: "min(12rem, calc(100vw - 2rem))",
	},
});
