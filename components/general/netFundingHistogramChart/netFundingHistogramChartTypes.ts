import { AbsOrPctType } from "@/utils/types/generalTypes/types";
import { Dispatch, SetStateAction } from "react";
import { FinalHistogramData } from "@/utils/types/generalTypes/types";
import type { TooltipProps } from "recharts";
import type {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

interface HistogramTooltipProps extends TooltipProps<ValueType, NameType> {}

interface NetFundingHistogramChartPropsType {
  smallV: boolean;
  anbimaClass: string;
  isMobile: boolean;
  loadingHistogram: boolean;
  histogram: FinalHistogramData | false;
}

interface HistogramTooltipCursor {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  stroke?: string;
}

interface AbsOrPctHistogramViewFormPropsType {
  absOrPct: AbsOrPctType;
  setAbsOrPct: Dispatch<SetStateAction<AbsOrPctType>>;
}

export type {
  HistogramTooltipProps,
  NetFundingHistogramChartPropsType,
  HistogramTooltipCursor,
  AbsOrPctHistogramViewFormPropsType,
};
