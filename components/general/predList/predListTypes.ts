import type { HistoricType, PredictionsType } from "@/utils/types";
import type { Dispatch, SetStateAction } from "react";

interface PredListPropsType {
  title: string;
  onlyBack: boolean;
  historic: HistoricType[];
  predictions?: PredictionsType[];
  varName: "VL_QUOTA_ms" | "CAPTC_LIQ_ABS_ms" | "CAPTC_LIQ_PCT_ms";
}

interface PredRowStaticParamsType {
  isPct: boolean;
  lastHistoricDate: Date;
  historic: HistoricType[];
  predictions?: PredictionsType[];
  varName: "VL_QUOTA_ms" | "CAPTC_LIQ_ABS_ms" | "CAPTC_LIQ_PCT_ms";
  predRows: PredRowType[];
  setPredRows: Dispatch<SetStateAction<PredRowType[]>>;
}

interface PredRowType {
  id: string;
  direction: string;
  numPer: number;
}

interface AddRowPropsType {
  newRow: PredRowType;
  setNewRow: Dispatch<SetStateAction<PredRowType>>;
  onlyBack: boolean;
}

interface PredRowPropsType {
  cE: PredRowType;
  isPct: boolean;
  lastHistoricDate: Date;
  historic: HistoricType[];
  predictions?: PredictionsType[];
  varName: "VL_QUOTA_ms" | "CAPTC_LIQ_ABS_ms" | "CAPTC_LIQ_PCT_ms";
  predRows: PredRowType[];
  setPredRows: Dispatch<SetStateAction<PredRowType[]>>;
}

// Types used by functions
interface HandleAddRowParamsType {
  predRows: PredRowType[];
  newRow: PredRowType;
  setPredRows: Dispatch<SetStateAction<PredRowType[]>>;
  setShowAddRow: Dispatch<SetStateAction<boolean>>;
  setNewRow: Dispatch<SetStateAction<PredRowType>>;
}

interface FormatValuePredListParamsType {
  isPct: boolean;
  direction: string;
  varName: string;
  currEntryBack: Record<string, any> | undefined;
  currEntryFront: Record<string, any> | undefined;
  formatter: Intl.NumberFormat;
}

interface HandleDeleteRowParamsType {
  e: React.MouseEvent<HTMLButtonElement>;
  predRows: PredRowType[];
  setPredRows: Dispatch<SetStateAction<PredRowType[]>>;
}
// End: types used by functions

export type {
  PredListPropsType,
  PredRowType,
  PredRowStaticParamsType,
  HandleAddRowParamsType,
  FormatValuePredListParamsType,
  HandleDeleteRowParamsType,
  AddRowPropsType,
  PredRowPropsType,
};
