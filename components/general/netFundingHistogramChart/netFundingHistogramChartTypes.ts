import { Dispatch, SetStateAction } from "react";
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
  sliderInfos: HistogramSliderInfosType[];
  dataForHistogram: RawHistogramData[];
  histogramControlForm: HistogramControlFormType;
  setHistogram: Dispatch<SetStateAction<FinalHistogramDataType>>;
}

interface PrepareDualRangeSlidersDataParamsType {
  sliderInfos: HistogramSliderInfosType[];
}

interface InitializeSlidersParamsType {
  dataForHistogram: RawHistogramData[],
  histogramControlForm: HistogramControlFormType,
  sliderTitles: SliderTitlesType,
  setHistogramControlForm: Dispatch<SetStateAction<HistogramControlFormType>>,
  setSliderInfos: Dispatch<SetStateAction<HistogramSliderInfosType[]>>;
}

interface HistogramControlFormType {
  vol_252: [number, number];
  QT_DIA_CONVERSAO_COTA: [number, number];
  QT_DIA_PAGTO_RESGATE: [number, number];
  NR_COTST: [number, number];
  VL_PATRIM_LIQ: [number, number];
  // CLASSE_ANBIMA: [number, number];
}

interface SliderTitlesType {
  vol_252: string;
  QT_DIA_CONVERSAO_COTA: string;
  QT_DIA_PAGTO_RESGATE: string;
  NR_COTST: string;
  VL_PATRIM_LIQ: string;
  // CLASSE_ANBIMA: string;
}

interface FilterDataForHistogramParamsType {
  dataForHistogram: RawHistogramData[],
  histogramControlForm: HistogramControlFormType,
}

interface HandleSubmitParamsType {
  currCnpj: string;
  isMobile: boolean;
  dataForHistogram: RawHistogramData[];
  histogramControlForm: HistogramControlFormType;
  setHistogram: Dispatch<SetStateAction<FinalHistogramDataType>>;
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
  SliderTitlesType,
  HandleSubmitParamsType,
};
