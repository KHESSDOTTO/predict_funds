import type { NFTooltipProps } from "@/utils/types";
import { formatterBrNumber } from "@/utils/numberFormatters";
import { format } from "date-fns";

function NFTooltip({
  active,
  payload,
  label,
  data,
  absOrPct,
  numWeeksPreds,
}: NFTooltipProps) {
  if (!numWeeksPreds) {
    return;
  }
  const isPct = absOrPct === "CAPTC_LIQ_PCT_ms";
  const predsElements = data?.slice(data.length - numWeeksPreds, data.length);
  const predsDates = predsElements?.map((cE) => cE.DT_COMPTC);
  const adjustAbsOrPct = absOrPct || "CAPTC_LIQ_ABS_ms";
  const isPrediction = predsDates?.includes(label);
  let tooltipClass =
    "bg-black/80 text-white p-2 rounded-sm shadow-indigo-700 shadow-sm";
  let CI90_lower: string;
  let CI90_upper: string;
  let CI95_lower: string;
  let CI95_upper: string;
  let CI99_lower: string;
  let CI99_upper: string;
  let CI90_LABEL: string = "";
  let CI95_LABEL: string = "";
  let CI99_LABEL: string = "";
  if (isPrediction && payload && payload[0]) {
    const payloadFirstElement = payload[0];
    tooltipClass =
      "bg-black/50 text-white p-2 rounded-sm shadow-white shadow-sm";

    CI90_lower = isPct
      ? formatterBrNumber.format(
          payloadFirstElement.payload["CI90_PCT_limits"][0]
        )
      : formatterBrNumber.format(
          payloadFirstElement.payload["CI90_ABS_limits"][0]
        );
    CI90_upper = isPct
      ? formatterBrNumber.format(
          payloadFirstElement.payload["CI90_PCT_limits"][1]
        )
      : formatterBrNumber.format(
          payloadFirstElement.payload["CI90_ABS_limits"][1]
        );
    CI95_lower = isPct
      ? formatterBrNumber.format(
          payloadFirstElement.payload["CI95_PCT_limits"][0]
        )
      : formatterBrNumber.format(
          payloadFirstElement.payload["CI95_ABS_limits"][0]
        );
    CI95_upper = isPct
      ? formatterBrNumber.format(
          payloadFirstElement.payload["CI95_PCT_limits"][1]
        )
      : formatterBrNumber.format(
          payloadFirstElement.payload["CI95_ABS_limits"][1]
        );
    CI99_lower = isPct
      ? formatterBrNumber.format(
          payloadFirstElement.payload["CI99_PCT_limits"][0]
        )
      : formatterBrNumber.format(
          payloadFirstElement.payload["CI99_ABS_limits"][0]
        );
    CI99_upper = isPct
      ? formatterBrNumber.format(
          payloadFirstElement.payload["CI99_PCT_limits"][1]
        )
      : formatterBrNumber.format(
          payloadFirstElement.payload["CI99_ABS_limits"][1]
        );

    CI90_LABEL = `Confidence 90%:  ${
      isPct ? CI90_lower + "%" : "R$ " + CI90_lower
    } | ${isPct ? CI90_upper + "%" : "R$ " + CI90_upper}`;
    CI95_LABEL = `Confidence 95%:  ${
      isPct ? CI95_lower + "%" : "R$ " + CI95_lower
    } | ${isPct ? CI95_upper + "%" : "R$ " + CI95_upper}`;
    CI99_LABEL = `Confidence 99%:  ${
      isPct ? CI99_lower + "%" : "R$ " + CI99_lower
    } | ${isPct ? CI99_upper + "%" : "R$ " + CI99_upper}`;
  }

  if (active && label && payload) {
    const formattedValue = formatterBrNumber.format(
      payload[0].payload[adjustAbsOrPct]
    );

    return (
      <div className={tooltipClass}>
        {isPrediction && <h3 className="font-semibold mb-1">Prediction</h3>}
        {!isPrediction && <h3 className="font-semibold ">Historic</h3>}
        <h4 className="">{format(label, "d, MMM, yy")}</h4>
        <p>
          Net Funding:&nbsp;
          {isPct ? formattedValue + "%" : "R$ " + formattedValue}
        </p>
        {isPrediction && payload && (
          <div className="flex flex-col gap-1 py-2 text-xs text-gray-200">
            <p>{CI95_LABEL}</p>
            <p>{CI99_LABEL}</p>
          </div>
        )}
      </div>
    );
  }

  return <></>;
}

export { NFTooltip };
