import { HandleAbsOrPctChangeArgsType } from "../netFundingPredChartTypes";

function handleAbsOrPctChange({
  e,
  setAbsOrPct,
  setAbsOrPctShort,
}: HandleAbsOrPctChangeArgsType) {
  setAbsOrPct(e.target.value as "CAPTC_LIQ_ABS_ms" | "CAPTC_LIQ_PCT_ms");
  setAbsOrPctShort(e.target.value === "CAPTC_LIQ_ABS_ms" ? "abs" : "pct");
}

export { handleAbsOrPctChange };
