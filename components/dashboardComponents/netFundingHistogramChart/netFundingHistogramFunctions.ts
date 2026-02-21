import {
  formatNumToPctStr,
  formatNumToStrMlnK,
} from "@/utils/functions/numberFormatters/formatNumbers";
import { numBinsMobile, numBinsDesktop } from "./histogramSettings";
import * as XLSX from "xlsx";
import type { DualRangeSliderWithTippyPropsType } from "@/components/UI/dualRangeSliderWithTippy/dualRangesWithTippyTypes";
import type { RawHistogramData } from "@/database/models/prediction/predictionsType";
import type {
  FilterDataForHistogramParamsType,
  PrepareDualRangeSlidersDataParamsType,
  InitializeSlidersParamsType,
  HistogramSliderInfosType,
  SliderInitialInfosType,
  ExportHistogramParamsType,
} from "./netFundingHistogramChartTypes";
import type {
  FinalHistogramDataType,
  HistogramSingleTypeData,
} from "@/utils/types/generalTypes/types";

function prepareDualRangeSlidersData({
  sliderInfos,
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
  currCnpj,
  dataForHistogram,
  histogramControlForm,
  sliderInitialInfos,
}: FilterDataForHistogramParamsType): RawHistogramData[] {
  if (dataForHistogram.length === 0 || !histogramControlForm) {
    return [];
  }

  const filterKeys = Object.keys(histogramControlForm);
  const filterRangesValues = Object.values(histogramControlForm);

  const newFilteredDataForHistogram: RawHistogramData[] =
    dataForHistogram.filter((cE) => {
      let isSelectedCnpj: boolean = Boolean(cE["CNPJ_FUNDO"] === currCnpj);

      const isOk = !filterKeys.some((currKey, currKeyIndex) => {
        const currVal = cE[currKey as keyof RawHistogramData];
        const filterVal = filterRangesValues[currKeyIndex];

        if (!filterVal) {
          return false;
        }

        // Filter by CVM class (and text fields)
        if (typeof currVal === "string") {
          return currVal !== filterVal;
        }
        // End: filter by CVM class (and text fields)

        // Numeric value check
        if (typeof currVal !== "number") {
          return false; // Include null/NaN values
        }
        // End: Numeric value check

        // Filter by sliders
        const maxValSlider =
          sliderInitialInfos[currKey as keyof SliderInitialInfosType][
            "upperLimit"
          ];
        const lowerLimit: number = filterVal[0];
        const upperLimit: number = filterVal[1];
        const isLowerThanRangeSelected: boolean = currVal < lowerLimit;
        const isHigherThanRangeSelected: boolean = currVal > upperLimit;
        const isHigherThanMaxValSlider: boolean = currVal > maxValSlider;

        return (
          isLowerThanRangeSelected ||
          (isHigherThanRangeSelected && !isHigherThanMaxValSlider)
        );
        // End: filter by sliders
      });

      return isOk || isSelectedCnpj;
    });

  return newFilteredDataForHistogram || [];
}

function initializeSliders({
  dataForHistogram,
  histogramControlForm,
  sliderInitialInfos,
  setCurrAppliedFilters,
  setHistogramControlForm,
  setSliderInfos,
}: InitializeSlidersParamsType): HistogramSliderInfosType[] {
  if (!dataForHistogram) {
    return [];
  }

  const onlySliders = { ...histogramControlForm };
  delete onlySliders["Classificacao"];

  const sliderKeys = Object.keys(onlySliders);

  let newSliderInfos: HistogramSliderInfosType[] = [];

  sliderKeys.forEach((currKey) => {
    const controlFormKey = currKey;
    const minValSlider =
      sliderInitialInfos[currKey as keyof SliderInitialInfosType]["lowerLimit"];
    const maxValSlider =
      sliderInitialInfos[currKey as keyof SliderInitialInfosType]["upperLimit"];
    const title =
      sliderInitialInfos[currKey as keyof SliderInitialInfosType]["title"];
    const formatterFunction =
      sliderInitialInfos[currKey as keyof SliderInitialInfosType][
        "formatterFunction"
      ];

    let step: number = 1;

    if (maxValSlider < 10) {
      step = 0.005;
    }

    const sliderInfoElement: HistogramSliderInfosType = {
      title,
      minValSlider,
      maxValSlider,
      step,
      formatterFunction,
      controlForm: histogramControlForm,
      controlFormKey,
      setControlForm: setHistogramControlForm,
    };

    newSliderInfos.push(sliderInfoElement);
    setHistogramControlForm((prevForm) => ({
      ...prevForm,
      [currKey]: [minValSlider, maxValSlider],
    }));
    setCurrAppliedFilters((prevForm) => ({
      ...prevForm,
      [currKey]: [minValSlider, maxValSlider],
    }));
  });

  setSliderInfos(newSliderInfos);

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

function exportHistogram({
  selCnpj,
  filters,
  histogram,
}: ExportHistogramParamsType) {
  if (!histogram || !histogram["abs"].length) {
    return;
  }

  const workbook = XLSX.utils.book_new();
  const dataForSheet: any[][] = [];
  const visualizations = Object.keys(
    histogram
  ) as (keyof FinalHistogramDataType)[];
  const filterArr = Object.entries(filters);
  const filterTable = filterArr.map((cE) => {
    const isSlider = typeof cE[1] === "object";

    if (cE[0] === "Classificacao" && cE[1] === "") {
      cE[1] = "All";
    }

    return isSlider ? [cE[0], ...cE[1]] : cE;
  });

  dataForSheet.push(["sel_cnpj", selCnpj], []);
  dataForSheet.push(["Filters"], ...filterTable, [], ["Histograms"]);

  const tableHeaders = [
    "interval",
    "exact_upper_limit",
    "cnpj_count",
    "is_selected_cnpj_bin",
    "percentile",
  ];
  const tableHeaderRow: string[] = []; // Mounting first row
  const visualizationsRow: string[] = [];

  visualizations.forEach((currV) => {
    visualizationsRow.push("visualization", currV, "", "", "", "");
    tableHeaderRow.push(...tableHeaders, "");
  });

  dataForSheet.push(visualizationsRow); // Added first row to identify table visualization
  dataForSheet.push(tableHeaderRow); // Added first row table headers for all visualizations

  histogram[visualizations[0]].forEach((currTick, currIndex) => {
    const newRow: (string | number | boolean)[] = [];

    visualizations.forEach((currV, currIndexV) => {
      newRow.push(
        histogram[currV][currIndex]["xTick"],
        histogram[currV][currIndex]["limit"],
        histogram[currV][currIndex]["value"],
        histogram[currV][currIndex]["selCnpjBin"],
        histogram[currV][currIndex]["percentile"],
        ""
      ); // Build row with infos. from all tables/visualizations
    });

    dataForSheet.push(newRow); // Add row to tables
  });

  const sheet = XLSX.utils.aoa_to_sheet(dataForSheet);

  XLSX.utils.book_append_sheet(workbook, sheet);
  XLSX.writeFile(workbook, "export_histogram.xlsx");

  return;
}

export {
  prepareDualRangeSlidersData,
  filterDataForHistogram,
  prepareHistogram,
  initializeSliders,
  getNumBinsForHistogram,
  exportHistogram,
};
