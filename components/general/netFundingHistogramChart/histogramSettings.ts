import { formatNumToPctStr, formatNumToStrMlnK } from "@/utils/functions/formatNumbers";
import { SliderInitialInfosType } from "./netFundingHistogramChartTypes";
import { formatterBrNumber } from "@/utils/numberFormatters";

const lowerLimitOutliersHistogram: number = 0.05;
const upperLimitOutliersHistogram: number = 0.95;
const numBinsMobile: number = 10;
const numBinsDesktop: number = 14;
const sliderInitialInfos: SliderInitialInfosType = {
  vol_252: {
    title: '',
    formatterFunction: (number) => formatNumToPctStr(number, 2),
  },
  QT_DIA_CONVERSAO_COTA: {
    title: '',
    formatterFunction: (number) => formatterBrNumber.format(number),
  },
  QT_DIA_PAGTO_RESGATE: {
    title: '',
    formatterFunction: (number) => formatterBrNumber.format(number),
  },
  NR_COTST: {
    title: '',
    formatterFunction: (number) => formatterBrNumber.format(number),
  },
  VL_PATRIM_LIQ: {
    title: '',
    formatterFunction: (number) => formatterBrNumber.format(number),
  },
}

export {
  lowerLimitOutliersHistogram,
  upperLimitOutliersHistogram,
  numBinsMobile,
  numBinsDesktop,
  sliderInitialInfos,
}
