import type { HistogramTooltipProps } from "./netFundingHistogramChartTypes";

export default function HistogramTooltip({
  active,
  payload,
  label,
}: HistogramTooltipProps) {
  if (active && payload && payload.length) {
    const selCnpjBin = payload[0].payload.selCnpjBin;
    const percentile = payload[0].payload.percentile;
    const msg1 = selCnpjBin ? `You are here.` : "";
    const msg2 = selCnpjBin
      ? `Percentile: ${(percentile * 100).toFixed()}%`
      : "";
    const msg3 = `Count: ${payload[0].value}`;
    const txtColor = selCnpjBin ? `rgb(160, 200, 160)` : `rgb(180, 160, 230)`;
    const shadowColor = selCnpjBin ? `rgb(50, 100, 50)` : `rgb(55, 50, 100)`;
    let adjustedLabel = label;

    return (
      <div
        className="bg-black/80 p-2 rounded-md"
        style={{ color: txtColor, boxShadow: `0px 1px 2px ${shadowColor}` }}
      >
        <p className="leading-6">
          {msg1 && (
            <>
              {msg1}
              <br />
            </>
          )}
          {msg2 && (
            <>
              {msg2}
              <br />
            </>
          )}
          {msg3}
        </p>
        <p>{"Interval: " + adjustedLabel}</p>
      </div>
    );
  }
  return <></>;
}
