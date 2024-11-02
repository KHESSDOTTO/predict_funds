import { AdjustNetFundingChartAxisArgsType } from "./netFundingPredChartTypes";
import {
  generateYaxisDomainBasedOnMaxMod,
  generateYaxisTicksBasedOnMaxMod,
} from "@/functions/axisFunctions";
import type { PrepareChartNFDataArgsType } from "./netFundingPredChartTypes";

function adjustNetFundingChartAxis({
  historic,
  absOrPct,
  predictions,
  setDomainYaxisNF,
  setTicksYaxisNF,
}: AdjustNetFundingChartAxisArgsType) {
  const isPct = absOrPct === "CAPTC_LIQ_PCT_ms";

  // Defining values for domain/axis in Net Funding Chart
  // Max absolute value in historic
  let maxModValueNF = historic.reduce((maxAbsObj, currObj) => {
    return Math.abs(currObj[absOrPct] ?? 0) >
      (maxAbsObj[absOrPct] ? Math.abs(maxAbsObj[absOrPct]) : 0)
      ? currObj
      : maxAbsObj;
  }, historic[0])[absOrPct];

  // Value of prediction to compare with highest absolute value of historic.
  const modValuePred = predictions[0][absOrPct]
    ? Math.abs(Number(predictions[0][absOrPct]))
    : 0;

  if (maxModValueNF) {
    // Defyning domain.
    maxModValueNF =
      modValuePred > Math.abs(maxModValueNF)
        ? Number(Math.abs(modValuePred).toFixed(2))
        : Number(Math.abs(maxModValueNF).toFixed(2));

    const newDomain = generateYaxisDomainBasedOnMaxMod(maxModValueNF, isPct);
    if (newDomain) {
      setDomainYaxisNF(newDomain);
    }

    const newYaxisNFTicks = generateYaxisTicksBasedOnMaxMod(
      maxModValueNF,
      isPct
    );

    if (newYaxisNFTicks) {
      setTicksYaxisNF(newYaxisNFTicks);
    }

    return true;
  }
  return false;
}

function prepareChartNFData({
  historic,
  predictions,
  setUnifiedNFData,
  setGradientOffset,
}: PrepareChartNFDataArgsType) {
  // Unifying data
  const newUnifiedNFData = [...historic, ...predictions];
  const newGradientOffset =
    (newUnifiedNFData.length - predictions.length) /
    (newUnifiedNFData.length - 1);
  setUnifiedNFData(newUnifiedNFData);
  setGradientOffset(newGradientOffset);
}

export { adjustNetFundingChartAxis, prepareChartNFData };
