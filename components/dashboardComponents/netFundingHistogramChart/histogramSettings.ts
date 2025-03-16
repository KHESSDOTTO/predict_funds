import { formatNumToPctStr } from "@/utils/functions/formatNumbers";
import { SliderInitialInfosType } from "./netFundingHistogramChartTypes";
import {
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
    lowerLimit: 0,
    upperLimit: 0.5,
  },
  QT_DIA_CONVERSAO_COTA: {
    title: 'Quota conversion period',
    formatterFunction: (number) => formatterBrInteger.format(number),
    lowerLimit: 0,
    upperLimit: 60,
  },
  QT_DIA_PAGTO_RESGATE: {
    title: 'Redemption period',
    formatterFunction: (number) => formatterBrInteger.format(number),
    lowerLimit: 0,
    upperLimit: 60,
  },
  NR_COTST: {
    title: 'Shareholders quantity',
    formatterFunction: (number) => formatterBrInteger.format(number),
    lowerLimit: 0,
    upperLimit: 100000,
  },
  VL_PATRIM_LIQ: {
    title: 'Net Asset',
    formatterFunction: (number) => formatterBrInteger.format(number),
    lowerLimit: 0,
    upperLimit: 9999999999,
  },
}

export {
  lowerLimitOutliersHistogram,
  upperLimitOutliersHistogram,
  numBinsMobile,
  numBinsDesktop,
  sliderInitialInfos,
}
