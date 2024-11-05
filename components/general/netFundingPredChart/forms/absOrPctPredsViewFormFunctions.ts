import { HandleAbsOrPctChangeParamsType } from "../netFundingPredChartTypes";

function handleAbsOrPctChange({
  e,
  setAbsOrPct,
  setAbsOrPctShort,
}: HandleAbsOrPctChangeParamsType) {
  setAbsOrPct(e.target.value as "CAPTC_LIQ_ABS_ms" | "CAPTC_LIQ_PCT_ms");
  setAbsOrPctShort(e.target.value === "CAPTC_LIQ_ABS_ms" ? "abs" : "pct");
}

export { handleAbsOrPctChange };
