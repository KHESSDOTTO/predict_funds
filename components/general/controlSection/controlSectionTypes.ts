import { Dispatch, SetStateAction } from "react";
import type { MouseEventHandler } from "react";
import type {
  CadastroFundosType,
  DashboardControlFormType,
  HistoricType,
  PredictionsType,
} from "@/utils/types";

interface ControlSectionProps {
  controlForm: DashboardControlFormType;
  registration: CadastroFundosType | false;
  ancoras: string[] | null;
  setControlForm: Dispatch<SetStateAction<DashboardControlFormType>>;
  setRegistration: Dispatch<SetStateAction<false | CadastroFundosType>>;
  setHistoricData: Dispatch<SetStateAction<HistoricType[]>>;
  setPredictionData: Dispatch<SetStateAction<PredictionsType[]>>;
  saveCenario: MouseEventHandler<HTMLButtonElement | HTMLDivElement>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setLoadingHistogram: Dispatch<SetStateAction<boolean>>;
  setHistogram: Dispatch<SetStateAction<any>>;
  setCorrels: Dispatch<SetStateAction<any>>;
  setHeatMapObj: Dispatch<SetStateAction<any>>;
}

export type { ControlSectionProps };
