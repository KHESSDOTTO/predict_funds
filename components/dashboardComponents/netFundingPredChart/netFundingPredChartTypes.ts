import {
  AbsOrPctNFFieldsType,
  AbsOrPctType,
  HistoricType,
  PredictionsType,
} from "@/utils/types/generalTypes/types";
import { Dispatch, SetStateAction } from "react";

type UnifiedDataPredsType = HistoricType | PredictionsType;

interface AdjustNetFundingChartAxisParamsType {
  historic: HistoricType[];
  absOrPct: "CAPTC_LIQ_ABS_ms" | "CAPTC_LIQ_PCT_ms";
  predictions: PredictionsType[];
  setDomainYaxisNF: Dispatch<SetStateAction<number[]>>;
  setTicksYaxisNF: Dispatch<SetStateAction<number[]>>;
}

interface PrepareChartNFDataParamsType {
  historic: HistoricType[];
  predictions: PredictionsType[];
  setUnifiedNFData: Dispatch<SetStateAction<UnifiedDataPredsType[]>>;
  setGradientOffset: Dispatch<SetStateAction<number>>;
}

interface HandleAbsOrPctChangeParamsType {
  e: React.ChangeEvent<HTMLInputElement>;
  setAbsOrPct: Dispatch<SetStateAction<AbsOrPctNFFieldsType>>;
  setAbsOrPctShort: Dispatch<SetStateAction<AbsOrPctType>>;
}

interface AbsOrPctPredsViewFormPropsType {
  absOrPct: AbsOrPctNFFieldsType;
  setAbsOrPct: Dispatch<SetStateAction<AbsOrPctNFFieldsType>>;
  setAbsOrPctShort: Dispatch<SetStateAction<AbsOrPctType>>;
  handleAbsOrPctChange: (params: HandleAbsOrPctChangeParamsType) => void;
}

interface NetFundingPredChartPropsType {
  historic: HistoricType[];
  predictions: PredictionsType[];
  smallV: boolean;
  isMobile: boolean;
  predList?: boolean;
  title?: string | string[];
  exportPosition?: "bottom" | "right";
}

interface ExportNetFundingPredParams {
  historic: HistoricType[];
  predictions: PredictionsType[];
}

export type {
  UnifiedDataPredsType,
  AdjustNetFundingChartAxisParamsType,
  PrepareChartNFDataParamsType,
  HandleAbsOrPctChangeParamsType,
  AbsOrPctPredsViewFormPropsType,
  NetFundingPredChartPropsType,
  ExportNetFundingPredParams,
};
