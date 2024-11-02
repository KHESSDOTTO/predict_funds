import { Dispatch, SetStateAction } from "react";
import type { HistoricType } from "@/utils/types";
import type { TooltipProps } from "recharts";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

interface ValueQuotaChartPropsType {
  smallV: boolean;
  isMobile: boolean;
  historic: HistoricType[];
}

interface AdjustValueQuotaChartAxisArgsType {
  historic: HistoricType[];
  setDomainYaxisVQ: Dispatch<SetStateAction<number[]>>;
  setTicksYaxisVQ: Dispatch<SetStateAction<number[]>>;
}

interface ValueQuotaTooltipProps extends TooltipProps<ValueType, NameType> {}

export type {
  ValueQuotaChartPropsType,
  AdjustValueQuotaChartAxisArgsType,
  ValueQuotaTooltipProps,
};
