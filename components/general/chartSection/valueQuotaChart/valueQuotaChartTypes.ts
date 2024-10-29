import { Dispatch, SetStateAction } from "react";
import type { HistoricType, PredictionsType } from "@/utils/types";
import type { TooltipProps } from "recharts";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

interface ValueQuotaChartPropsType {
  smallV: boolean;
  isMobile: boolean;
  historic: HistoricType[];
  predictions?: PredictionsType[];
}

interface AdjustValueQuotaChartAxisArgsType {
  historic: HistoricType[];
  absOrPct: "CAPTC_LIQ_ABS_ms" | "CAPTC_LIQ_PCT_ms";
  setDomainYaxisVQ: Dispatch<SetStateAction<number[]>>;
  setTicksYaxisVQ: Dispatch<SetStateAction<number[]>>;
}

interface ValueQuotaTooltipProps extends TooltipProps<ValueType, NameType> {}

export type {
  ValueQuotaChartPropsType,
  AdjustValueQuotaChartAxisArgsType,
  ValueQuotaTooltipProps,
};
