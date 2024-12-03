import {
  Dispatch,
  SetStateAction,
  MouseEvent,
} from "react";
import type { TooltipProps } from "recharts";
import type {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";
import type { AbsOrPctType, FinalHistogramDataType } from "@/utils/types/generalTypes/types";
import type { DualRangeSliderWithTippyPropsType } from "@/components/UI/dualRangeSliderWithTippy/dualRangesWithTippyTypes";
import type { RawHistogramData } from "@/database/models/prediction/predictionsType";

interface HistogramTooltipProps extends TooltipProps<ValueType, NameType> {}

interface NetFundingHistogramChartPropsType {
  currCnpj: string;
  smallV: boolean;
  anbimaClass: string;
  isMobile: boolean;
  dataForHistogram: RawHistogramData[];
  loadingHistogram: boolean;
  setLoadingHistogram: Dispatch<SetStateAction<boolean>>;
}

interface HistogramTooltipCursor {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  stroke?: string;
}

interface VisualizationFormPropsType {
  absOrPct: AbsOrPctType;
  setAbsOrPct: Dispatch<SetStateAction<AbsOrPctType>>;
}

interface HistogramSliderInfosType extends DualRangeSliderWithTippyPropsType {
  title: string;
} 

interface FilterFormPropsType {
  currCnpj: string;
  isMobile: boolean;
  sliderInitialInfos: SliderInitialInfosType;
  sliderInfos: HistogramSliderInfosType[];
  dataForHistogram: RawHistogramData[];
  histogramControlForm: HistogramControlFormType;
  setCurrAppliedFilters: Dispatch<SetStateAction<HistogramControlFormType>>;
  setHistogramControlForm: Dispatch<SetStateAction<HistogramControlFormType>>;
  setHistogram: Dispatch<SetStateAction<FinalHistogramDataType>>;
}

interface PrepareDualRangeSlidersDataParamsType {
  sliderInfos: HistogramSliderInfosType[];
}

interface InitializeSlidersParamsType {
  dataForHistogram: RawHistogramData[],
  histogramControlForm: HistogramControlFormType,
  sliderInitialInfos: SliderInitialInfosType,
  setCurrAppliedFilters: Dispatch<SetStateAction<HistogramControlFormType>>,
  setHistogramControlForm: Dispatch<SetStateAction<HistogramControlFormType>>,
  setSliderInfos: Dispatch<SetStateAction<HistogramSliderInfosType[]>>;
}

interface HistogramControlFormType {
  vol_252: [number, number];
  QT_DIA_CONVERSAO_COTA: [number, number];
  QT_DIA_PAGTO_RESGATE: [number, number];
  NR_COTST: [number, number];
  VL_PATRIM_LIQ: [number, number];
  CLASSE?: string;
}

interface SliderInitialInfosItemType {
  title: string;
  formatterFunction: (number: number) => string | number;
  lowerLimit: number;
  upperLimit: number;
}

interface SliderInitialInfosType {
  vol_252: SliderInitialInfosItemType;
  QT_DIA_CONVERSAO_COTA: SliderInitialInfosItemType;
  QT_DIA_PAGTO_RESGATE: SliderInitialInfosItemType;
  NR_COTST: SliderInitialInfosItemType;
  VL_PATRIM_LIQ: SliderInitialInfosItemType;
}

interface FilterDataForHistogramParamsType {
  currCnpj: string;
  dataForHistogram: RawHistogramData[],
  histogramControlForm: HistogramControlFormType,
  sliderInitialInfos: SliderInitialInfosType,
}

interface HandleSubmitStaticParamsType {
  currCnpj: string;
  isMobile: boolean;
  dataForHistogram: RawHistogramData[];
  histogramControlForm: HistogramControlFormType;
  sliderInitialInfos: SliderInitialInfosType;
  setCurrAppliedFilters: Dispatch<SetStateAction<HistogramControlFormType>>;
  setHistogram: Dispatch<SetStateAction<FinalHistogramDataType>>;
}

interface HandleSubmitParamsType extends HandleSubmitStaticParamsType {
  e: MouseEvent<HTMLDivElement>;
}

interface SelFundInfosPropsType {
  currCnpj: string;
  dataForHistogram: RawHistogramData[];
  sliderInitialInfos: SliderInitialInfosType;
}

interface ExportHistogramParamsType {
  filters: HistogramControlFormType;
  histogram: FinalHistogramDataType;
}

export type {
  HistogramTooltipProps,
  NetFundingHistogramChartPropsType,
  HistogramTooltipCursor,
  VisualizationFormPropsType,
  FilterFormPropsType,
  HistogramControlFormType,
  FilterDataForHistogramParamsType,
  PrepareDualRangeSlidersDataParamsType,
  InitializeSlidersParamsType,
  HistogramSliderInfosType,
  SliderInitialInfosItemType,
  SliderInitialInfosType,
  HandleSubmitStaticParamsType,
  HandleSubmitParamsType,
  SelFundInfosPropsType,
  ExportHistogramParamsType,
};
