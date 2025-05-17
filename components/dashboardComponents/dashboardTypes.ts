import type { UserContextType } from "@/contexts/userContext/userContextTypes";
import type {
  DashboardControlFormType,
  HistoricType,
  PredictionsType,
  UserType,
} from "@/utils/types/generalTypes/types";
import { Dispatch, SetStateAction } from "react";

interface DashboardPropsType {
  user: UserType;
  ancoras: string[] | null;
}

interface SaveCenarioParamsType {
  userContext: UserContextType;
  controlForm: DashboardControlFormType;
  historicData: HistoricType[];
  predictionData: PredictionsType[];
}

export type { DashboardPropsType, SaveCenarioParamsType };
