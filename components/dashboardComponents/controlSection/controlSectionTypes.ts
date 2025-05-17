import { Dispatch, SetStateAction } from "react";
import type { MouseEventHandler } from "react";
import type {
  CadastroFundosType,
  DashboardControlFormType,
  HistoricType,
  PredictionsType,
} from "@/utils/types/generalTypes/types";

interface ControlSectionProps {
  registration: CadastroFundosType | false;
  ancoras: string[] | null;
  setHistoricRendaFixaData: Dispatch<SetStateAction<HistoricType[]>>;
  setHistoricMultimercadoData: Dispatch<SetStateAction<HistoricType[]>>;
  setHistoricAcoesData: Dispatch<SetStateAction<HistoricType[]>>;
  setPredictionRendaFixaData: Dispatch<SetStateAction<PredictionsType[]>>;
  setPredictionMultimercadoData: Dispatch<SetStateAction<PredictionsType[]>>;
  setPredictionAcoesData: Dispatch<SetStateAction<PredictionsType[]>>;
  setRegistration: Dispatch<SetStateAction<false | CadastroFundosType>>;
  setHistoricData: Dispatch<SetStateAction<HistoricType[]>>;
  setPredictionData: Dispatch<SetStateAction<PredictionsType[]>>;
  saveCenario: MouseEventHandler<HTMLButtonElement | HTMLDivElement>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setLoadingHistogram: Dispatch<SetStateAction<boolean>>;
  setDataForHistogram: Dispatch<SetStateAction<any>>;
  setCorrels: Dispatch<SetStateAction<any>>;
  setHeatMapObj: Dispatch<SetStateAction<any>>;
}

export type { ControlSectionProps };
