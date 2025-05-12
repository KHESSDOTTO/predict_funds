import { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";
import {
  getData,
  getHistoricData,
  getPredictions,
  getRegistration,
  selRegistration,
} from "../controlSectionFunctions";
import type {
  DashboardControlFormType,
  HistoricType,
  PredictionsType,
  UserType,
} from "@/utils/types/generalTypes/types";

function handleControlFormChange(
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  arrCnpjName: any[],
  controlForm: DashboardControlFormType,
  setControlForm: Dispatch<SetStateAction<DashboardControlFormType>>,
  setNameSelectedFund: Dispatch<SetStateAction<string>>
) {
  let newVal: string | number = e.target.value;

  if (e.target.name === "weeksAhead") {
    newVal = Number(newVal);
  }

  setControlForm({ ...controlForm, [e.target.name]: newVal });

  if (e.target.name === "buscaCnpj" && arrCnpjName) {
    const selectedFund = arrCnpjName.filter((cE) => {
      return cE["CNPJ_FUNDO"] === e.target.value;
    });

    setNameSelectedFund(selectedFund[0]["Denominacao_Social_F"]);
  }

  return;
}

async function handleControlFormSubmit(
  user: UserType | null,
  e: React.FormEvent<HTMLFormElement>,
  controlForm: DashboardControlFormType,
  currSubmitToast: string,
  setControlForm: Dispatch<SetStateAction<DashboardControlFormType>>,
  setRegistration: Dispatch<SetStateAction<any>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setHistoricData: Dispatch<SetStateAction<HistoricType[]>>,
  setHistoricRendaFixaData: Dispatch<SetStateAction<HistoricType[]>>,
  setHistoricMultimercadoData: Dispatch<SetStateAction<HistoricType[]>>,
  setHistoricAcoesData: Dispatch<SetStateAction<HistoricType[]>>,
  setPredictionData: Dispatch<SetStateAction<PredictionsType[]>>,
  setPredictionRendaFixaData: Dispatch<SetStateAction<PredictionsType[]>>,
  setPredictionMultimercadoData: Dispatch<SetStateAction<PredictionsType[]>>,
  setPredictionAcoesData: Dispatch<SetStateAction<PredictionsType[]>>,
  setCurrSubmitToast: Dispatch<SetStateAction<string>>
) {
  e.preventDefault();

  if (currSubmitToast || !user) {
    return;
  }

  setIsLoading(true);

  getData(
    user,
    controlForm,
    setControlForm,
    setRegistration,
    setHistoricData,
    setHistoricRendaFixaData,
    setHistoricAcoesData,
    setHistoricMultimercadoData,
    setPredictionData,
    setPredictionRendaFixaData,
    setPredictionAcoesData,
    setPredictionMultimercadoData,
    setCurrSubmitToast
  );
}

export { handleControlFormChange, handleControlFormSubmit };
