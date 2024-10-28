import type { HistoricType, PredictionsType } from "@/utils/types";
import type { Dispatch, SetStateAction } from "react";

interface PredListPropsType {
  title: string;
  onlyBack: boolean;
  historic: HistoricType[];
  predictions: PredictionsType[];
  varName: "VL_QUOTA_ms" | "CAPTC_LIQ_ABS_ms" | "CAPTC_LIQ_PCT_ms";
}

interface PredRowType {
  id: string;
  direction: string;
  numPer: number;
}

// Types used by functions
interface HandleAddRowArgsType {
  predRows: PredRowType[];
  newRow: PredRowType;
  setPredRows: Dispatch<SetStateAction<PredRowType[]>>;
  setShowAddRow: Dispatch<SetStateAction<boolean>>;
  setNewRow: Dispatch<SetStateAction<PredRowType>>;
}

interface FormatValuePredListArgsType {
  isPct: boolean;
  direction: string;
  varName: string;
  currEntryBack: Record<string, any> | undefined;
  currEntryFront: Record<string, any> | undefined;
  formatter: Intl.NumberFormat;
}

interface HandleDeleteRowArgsType {
  e: React.MouseEvent<HTMLButtonElement>;
  predRows: PredRowType[];
  setPredRows: Dispatch<SetStateAction<PredRowType[]>>;
}
// End: types used by functions

export type {
  PredListPropsType,
  PredRowType,
  HandleAddRowArgsType,
  FormatValuePredListArgsType,
  HandleDeleteRowArgsType,
};
