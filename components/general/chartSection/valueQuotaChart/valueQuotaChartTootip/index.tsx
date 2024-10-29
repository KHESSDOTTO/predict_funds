import { format } from "date-fns";
import { formatterBrNumber } from "@/utils/numberFormatters";
import type { ValueQuotaTooltipProps } from "../valueQuotaChartTypes";

export default function ValueQuotaTooltip({
  active,
  payload,
  label,
}: ValueQuotaTooltipProps) {
  if (active && label && payload) {
    return (
      <div className="bg-black/80 text-white p-2 rounded-md shadow-yellow-700 shadow-sm">
        <h4 className="font-semibold">{format(label, "d, MMM, yy")}</h4>
        <p>
          Quota: R$&nbsp;
          {formatterBrNumber.format(
            payload[0].payload.VL_QUOTA_ms.toFixed(2).toLocaleString("en-US")
          )}
        </p>
      </div>
    );
  }
  return <></>;
}
