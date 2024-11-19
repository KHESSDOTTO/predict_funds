import { lowerLimitOutliersHistogram, upperLimitOutliersHistogram } from "../histogramSettings";
import { HandleSubmitParamsType } from "../netFundingHistogramChartTypes";
import { filterDataForHistogram, getNumBinsForHistogram, prepareHistogram } from "../netFundingHistogramFunctions";

function handleSubmit({
  e,
  currCnpj,
  isMobile,
  dataForHistogram,
  histogramControlForm,
  setHistogram,
}: HandleSubmitParamsType) {
  e.preventDefault();

  const numBins = getNumBinsForHistogram(isMobile)
  const filteredDataForHistogram = filterDataForHistogram({
    currCnpj,
    dataForHistogram,
    histogramControlForm
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
}

export { handleSubmit };
