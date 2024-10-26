import {
  RawHistogramData,
  FinalHistogramData,
  HistogramSingleTypeData,
} from "@/utils/types";
import { consoleLog } from "./functions";
import { formatNumToPctStr, formatNumToStrMlnK } from "./formatNumbers";

function prepareHistogram(
  histogramData: RawHistogramData[],
  numBars: number,
  selCnpj: string,
  lowerLimitOutliers: number,
  upperLimitOutliers: number
): FinalHistogramData | false {
  if (!histogramData || histogramData.length === 0) return false; // Won't run if there is no histogramData or lenght of array = 0

  const finalDataAbs = handleAbsPctHistogram(
    "abs",
    histogramData,
    numBars,
    selCnpj,
    lowerLimitOutliers,
    upperLimitOutliers
  );

  const finalDataPct = handleAbsPctHistogram(
    "pct",
    histogramData,
    numBars,
    selCnpj,
    lowerLimitOutliers,
    upperLimitOutliers
  );

  const finalData = { abs: finalDataAbs, pct: finalDataPct };

  return finalData;
}

function handleAbsPctHistogram(
  absOrPct: "abs" | "pct",
  histogramData: RawHistogramData[],
  numBars: number,
  selCnpj: string,
  lowerLimitOutliers: number,
  upperLimitOutliers: number
): HistogramSingleTypeData[] {
  const abs = absOrPct === "abs";
  const fieldVal = abs ? "CAPTC_LIQ_ABS_ms" : "CAPTC_LIQ_PCT_ms";

  const adjustedHistogramData = removeOutliersAddPercentiles(
    fieldVal,
    histogramData,
    lowerLimitOutliers,
    upperLimitOutliers,
    selCnpj
  );

  let step: number;
  let currVal: number;
  let nextVal: number;
  let selCnpjBin: boolean[] = [];
  let percentile: number[] = [];
  const limits: number[] = [];
  const xTicks: string[] = [];
  let values: number[] = [];

  const minVal = adjustedHistogramData.reduce((min, cE) => {
    return cE[fieldVal] < min ? cE[fieldVal] : min;
  }, adjustedHistogramData[0][fieldVal]);

  const maxVal = adjustedHistogramData.reduce((max, cE) => {
    return cE[fieldVal] > max ? cE[fieldVal] : max;
  }, adjustedHistogramData[0][fieldVal]);

  step = (maxVal - minVal) / numBars;
  currVal = minVal;

  // Defining values for limits and xTicks arrays
  for (let i = 0; i < numBars; i++) {
    const separator = " | ";
    let tick: string;
    nextVal = currVal + step;

    let lowerEnd: string = abs
      ? formatNumToStrMlnK(currVal, false)
      : formatNumToPctStr(currVal, 1);

    let upperEnd: string = abs
      ? formatNumToStrMlnK(nextVal, i === numBars - 1)
      : formatNumToPctStr(nextVal, 1); // If it is the last limit, than roundUp (true)

    tick = lowerEnd + separator + upperEnd;

    xTicks.push(tick);
    limits.push(nextVal); // No rounding on this array to count the elements in each interval of values
    values.push(0);
    selCnpjBin.push(false);
    percentile.push(0);

    currVal = nextVal;
  }
  // End of limits and xTicks arrays

  // Count elements on each interval of values to be the Yaxis values (based on 'limits' array)
  adjustedHistogramData.forEach((cE) => {
    const index = limits.findIndex((limit) => cE[fieldVal] <= limit);

    if (index !== -1) {
      values[index]++;
    }

    if (cE.CNPJ_FUNDO === selCnpj && cE.percentile && index !== -1) {
      selCnpjBin[index] = true;
      percentile[index] = cE.percentile;
    }
  });
  // End of the counting of values for the histogram

  // Building final data format
  const preparedData = xTicks.map((cE, cI) => ({
    xTick: cE,
    value: values[cI],
    limit: limits[cI],
    selCnpjBin: selCnpjBin[cI],
    percentile: percentile[cI],
  }));

  return preparedData;
}

function removeOutliersAddPercentiles(
  fieldVal: "CAPTC_LIQ_ABS_ms" | "CAPTC_LIQ_PCT_ms",
  histogramData: RawHistogramData[],
  lowerLimit: number,
  upperLimit: number,
  selCnpj: string
) {
  const sortedHistogramData = [...histogramData].sort((a, b) => {
    return a[fieldVal] - b[fieldVal];
  });

  const sortedHistogramDataWithPercentiles: RawHistogramData[] =
    sortedHistogramData.map((cE, cI, arr) => {
      const percentile = (cI + 1) / arr.length;
      return { ...cE, percentile: percentile };
    });

  const noOutliersSortedHistogramData =
    sortedHistogramDataWithPercentiles.filter((cE) => {
      return (
        ((cE.percentile as number) >= lowerLimit &&
          (cE.percentile as number) <= upperLimit) ||
        cE.CNPJ_FUNDO === selCnpj
      );
    });

  return noOutliersSortedHistogramData;
}

export { prepareHistogram };
