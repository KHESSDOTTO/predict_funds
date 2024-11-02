import {
  AbsOrPctNFFieldsType,
  AbsOrPctType,
  HistoricType,
  PredictionsType,
} from "@/utils/types";
import { Dispatch, SetStateAction } from "react";

type UnifiedDataPredsType = HistoricType | PredictionsType;

interface AdjustNetFundingChartAxisArgsType {
  historic: HistoricType[];
  absOrPct: "CAPTC_LIQ_ABS_ms" | "CAPTC_LIQ_PCT_ms";
  predictions: PredictionsType[];
  setDomainYaxisNF: Dispatch<SetStateAction<number[]>>;
  setTicksYaxisNF: Dispatch<SetStateAction<number[]>>;
}

interface PrepareChartNFDataArgsType {
  historic: HistoricType[];
  predictions: PredictionsType[];
  setUnifiedNFData: Dispatch<SetStateAction<UnifiedDataPredsType[]>>;
  setGradientOffset: Dispatch<SetStateAction<number>>;
}

interface HandleAbsOrPctChangeArgsType {
  e: React.ChangeEvent<HTMLInputElement>;
  setAbsOrPct: Dispatch<SetStateAction<AbsOrPctNFFieldsType>>;
  setAbsOrPctShort: Dispatch<SetStateAction<AbsOrPctType>>;
}

interface AbsOrPctPredsViewFormPropsType {
  absOrPct: AbsOrPctNFFieldsType;
  setAbsOrPct: Dispatch<SetStateAction<AbsOrPctNFFieldsType>>;
  setAbsOrPctShort: Dispatch<SetStateAction<AbsOrPctType>>;
  handleAbsOrPctChange: (params: HandleAbsOrPctChangeArgsType) => void;
}

interface NetFundingPredChartPropsType {
  historic: HistoricType[];
  predictions: PredictionsType[];
  smallV: boolean;
  isMobile: boolean;
}

export type {
  UnifiedDataPredsType,
  AdjustNetFundingChartAxisArgsType,
  PrepareChartNFDataArgsType,
  HandleAbsOrPctChangeArgsType,
  AbsOrPctPredsViewFormPropsType,
  NetFundingPredChartPropsType,
};
