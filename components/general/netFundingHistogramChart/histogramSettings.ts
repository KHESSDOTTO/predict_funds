import { formatNumToPctStr } from "@/utils/functions/formatNumbers";
import { SliderInitialInfosType } from "./netFundingHistogramChartTypes";
import {
  formatterBrNumber,
  formatterBrInteger
} from "@/utils/numberFormatters";

const lowerLimitOutliersHistogram: number = 0.05;
const upperLimitOutliersHistogram: number = 0.95;
const numBinsMobile: number = 10;
const numBinsDesktop: number = 14;
const sliderInitialInfos: SliderInitialInfosType = {
  vol_252: {
    title: 'Volatility',
    formatterFunction: (number) => formatNumToPctStr(number * 100, 1),
  },
  QT_DIA_CONVERSAO_COTA: {
    title: 'Quota conversion period',
    formatterFunction: (number) => formatterBrInteger.format(number),
  },
  QT_DIA_PAGTO_RESGATE: {
    title: 'Redemption period',
    formatterFunction: (number) => formatterBrInteger.format(number),
  },
  NR_COTST: {
    title: 'Shareholders quantity',
    formatterFunction: (number) => formatterBrInteger.format(number),
  },
  VL_PATRIM_LIQ: {
    title: 'Net Asset',
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
