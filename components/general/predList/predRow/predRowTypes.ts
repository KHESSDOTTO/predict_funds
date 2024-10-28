import type { HistoricType, PredictionsType } from "@/utils/types";
import type { PredRowType } from "../predListTypes";
import type { Dispatch, SetStateAction } from "react";

interface PredRowPropsType {
  cE: PredRowType;
  isPct: boolean;
  lastHistoricDate: Date;
  historic: HistoricType[];
  predictions: PredictionsType[];
  varName: "VL_QUOTA_ms" | "CAPTC_LIQ_ABS_ms" | "CAPTC_LIQ_PCT_ms";
  predRows: PredRowType[];
  setPredRows: Dispatch<SetStateAction<PredRowType[]>>;
}

export type { PredRowPropsType };
