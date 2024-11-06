import type { HistogramTooltipCursor } from "./netFundingHistogramChartTypes";

export default function HistogramTooltipCursor({
  width,
  height,
  x,
  y,
}: HistogramTooltipCursor) {
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill="#ccc"
      opacity={0.4}
      className="recharts-tooltip-cursor"
    />
  );
}
