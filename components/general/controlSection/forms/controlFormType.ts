import {
  CadastroFundosType,
  DashboardControlFormType,
  HistoricType,
  PredictionsType,
} from "@/utils/types/generalTypes/types";
import { Dispatch, SetStateAction } from "react";
import type { MouseEventHandler } from "react";

interface ControlFormPropsType {
  controlForm: DashboardControlFormType;
  ancoras: string[] | null;
  arrCnpjName: any;
  nameSelectedFund: string;
  setNameSelectedFund: Dispatch<SetStateAction<string>>;
  setControlForm: Dispatch<SetStateAction<DashboardControlFormType>>;
  setRegistration: Dispatch<SetStateAction<false | CadastroFundosType>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setHistoricData: Dispatch<SetStateAction<HistoricType[]>>;
  setPredictionData: Dispatch<SetStateAction<PredictionsType[]>>;
  saveCenario: MouseEventHandler<HTMLButtonElement | HTMLDivElement>;
}

export type { ControlFormPropsType };
