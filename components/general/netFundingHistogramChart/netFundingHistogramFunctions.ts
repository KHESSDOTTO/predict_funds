import { formatNumToPctStr, formatNumToStrMlnK } from "@/utils/functions/formatNumbers";
import { numBinsMobile, numBinsDesktop } from "./histogramSettings";
import type { DualRangeSliderWithTippyPropsType } from "@/components/UI/dualRangeSliderWithTippy/dualRangesWithTippyTypes";
import type { FilterDataForHistogramParamsType, PrepareDualRangeSlidersDataParamsType, InitializeSlidersParamsType, HistogramSliderInfosType, SliderTitlesType } from "./netFundingHistogramChartTypes";
import type { RawHistogramData } from "@/database/models/prediction/predictionsType";
import type {
  FinalHistogramDataType,
  HistogramSingleTypeData,
} from "@/utils/types/generalTypes/types";
import { consoleLog } from "@/utils/functions/genericFunctions";

function prepareDualRangeSlidersData ({
  sliderInfos
}: PrepareDualRangeSlidersDataParamsType) {
  const titles: string[] = [];
  const dualRangeSliderWithTippyProps: DualRangeSliderWithTippyPropsType[] = [];

  sliderInfos.forEach((cE) => {
    titles.push(cE.title);
    const copy: any = { ...cE };
    delete copy.title;
    const sliderArgs: DualRangeSliderWithTippyPropsType = copy;
    dualRangeSliderWithTippyProps.push(sliderArgs);
  });

  return { titles, dualRangeSliderWithTippyProps };
}

function filterDataForHistogram({
  dataForHistogram,
  histogramControlForm
}: FilterDataForHistogramParamsType): RawHistogramData[] {

  if (dataForHistogram.length === 0 || !histogramControlForm) {
    return [];
  }

  const filterKeys = Object.keys(histogramControlForm);
  const filterRangesValues = Object.values(histogramControlForm);
  const newFilteredDataForHistogram: RawHistogramData[] = dataForHistogram.filter((cE) => {
    const isInRange = !filterKeys.some((currKey, currKeyIndex) => {
      const currVal = cE[currKey as keyof RawHistogramData];

      if (typeof currVal !== "number") {
        return true;
      }

      const lowerLimit: number = filterRangesValues[currKeyIndex][0];
      const upperLimit: number = filterRangesValues[currKeyIndex][1];
      
      const isLowerThanRangeSelected: boolean = currVal < lowerLimit;
      const isHigherThanRangeSelected: boolean = currVal > upperLimit;
  
      // If out of range, return true to exclude from filtered data
      return isLowerThanRangeSelected || isHigherThanRangeSelected;
    });

    return isInRange;
  });
  

  return newFilteredDataForHistogram ? newFilteredDataForHistogram : [];
}

function initializeSliders({
  dataForHistogram,
  histogramControlForm,
  sliderTitles,
  setHistogramControlForm,
  setSliderInfos,
}: InitializeSlidersParamsType): HistogramSliderInfosType[] {

  if (!dataForHistogram) {
    return [];
  }

  const sliderKeys = Object.keys(histogramControlForm);
  let newSliderInfos: HistogramSliderInfosType[] = [];

  sliderKeys.forEach((currKey) => {
    const controlFormKey = currKey;
    const title = sliderTitles[currKey as keyof SliderTitlesType];
    const startingValue = Number(dataForHistogram[0][currKey as keyof RawHistogramData]);

    const minValSlider = dataForHistogram.reduce(
      (min, cE) => {
        const value = Number(cE[currKey as keyof RawHistogramData]);

        return value < min ? value : min;
      }, startingValue
    ) as number;
    const maxValSlider = dataForHistogram.reduce(
      (max, cE) => {
      const value = Number(cE[currKey as keyof RawHistogramData]);
      let isOutlier: boolean = false;

      // Remove outliers
      if (
        currKey === "QT_DIA_CONVERSAO_COTA" &&
        value >= 999
      ) {
        isOutlier = true;
      }
      // End: Remove outliers

      return (value > max && !isOutlier) ? value : max;
      }, startingValue
    ) as number;

    let step: number = 1;

    if (maxValSlider < 10) {
      step = 0.01;
    }
    
    const sliderInfoElement: HistogramSliderInfosType = {
      title,
      minValSlider,
      maxValSlider,
      step,
      controlForm: histogramControlForm,
      controlFormKey,
      setControlForm: setHistogramControlForm,
    }

    newSliderInfos.push(sliderInfoElement)
  });

  setSliderInfos(newSliderInfos);

  consoleLog({ newSliderInfos });

  return newSliderInfos;
}

function prepareHistogram(
  histogramData: RawHistogramData[],
  numBars: number,
  selCnpj: string,
  lowerLimitOutliers: number,
  upperLimitOutliers: number
): FinalHistogramDataType | false {
  
  if (!histogramData) {
    return false;
  }

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

  if (histogramData.length === 0 || adjustedHistogramData.length === 0) {
    return [];
  }

  consoleLog({ adjustedHistogramData });

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

function getNumBinsForHistogram(isMobile: boolean): number {

  if (isMobile) {
    return numBinsMobile;
  } else {
    return numBinsDesktop;
  }

}

export {
  prepareDualRangeSlidersData,
  filterDataForHistogram,
  prepareHistogram,
  initializeSliders,
  getNumBinsForHistogram,
};
