import { ArrCnpjNameType } from "@/database/models/cadastroFundos/cadastroFundosTypes";
import {
  CadastroFundosType,
  HistoricType,
  PredictionsType,
} from "@/utils/types/generalTypes/types";
import { Dispatch, SetStateAction } from "react";
import type { MouseEventHandler } from "react";

interface ControlFormPropsType {
  ancoras: string[] | null;
  arrCnpjName: ArrCnpjNameType[];
  nameSelectedFund: string;
  currSubmitToast: string;
  setNameSelectedFund: Dispatch<SetStateAction<string>>;
  setRegistration: Dispatch<SetStateAction<false | CadastroFundosType>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setHistoricData: Dispatch<SetStateAction<HistoricType[]>>;
  setPredictionData: Dispatch<SetStateAction<PredictionsType[]>>;
  saveCenario: MouseEventHandler<HTMLButtonElement | HTMLDivElement>;
  setCurrSubmitToast: Dispatch<SetStateAction<string>>;
}

export type { ControlFormPropsType };
