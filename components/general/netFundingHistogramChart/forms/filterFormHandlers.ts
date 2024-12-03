import { consoleLog } from "@/utils/functions/genericFunctions";
import { lowerLimitOutliersHistogram, upperLimitOutliersHistogram } from "../histogramSettings";
import { HandleSubmitParamsType } from "../netFundingHistogramChartTypes";
import { filterDataForHistogram, getNumBinsForHistogram, prepareHistogram } from "../netFundingHistogramFunctions";

function handleSubmit({
  e,
  currCnpj,
  isMobile,
  dataForHistogram,
  histogramControlForm,
  sliderInitialInfos,
  setCurrAppliedFilters,
  setHistogram,
}: HandleSubmitParamsType) {
  e.preventDefault();

  const numBins = getNumBinsForHistogram(isMobile)
  const filteredDataForHistogram = filterDataForHistogram({
    currCnpj,
    dataForHistogram,
    histogramControlForm,
    sliderInitialInfos
  });

  const newHistogram = prepareHistogram(
    filteredDataForHistogram,
    numBins,
    currCnpj,
    lowerLimitOutliersHistogram,
    upperLimitOutliersHistogram
  )

  setHistogram(
    newHistogram ?
      newHistogram :
      {
        abs: [],
        pct: [],
      }
  );

  setCurrAppliedFilters(histogramControlForm);
}

export { handleSubmit };
