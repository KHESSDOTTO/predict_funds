import {
  DashboardControlFormType,
  HistoricType,
  PredictionsType,
  UserContextType,
  UserType,
} from "@/utils/types";

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
