import { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";
import {
  getHistoricData,
  getPredictions,
  selRegistration,
} from "../controlSectionFunctions";
import type {
  DashboardControlFormType,
  HistoricType,
  PredictionsType,
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
  e: React.FormEvent<HTMLFormElement>,
  controlForm: DashboardControlFormType,
  setControlForm: Dispatch<SetStateAction<DashboardControlFormType>>,
  setRegistration: Dispatch<SetStateAction<any>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setHistoricData: Dispatch<SetStateAction<HistoricType[]>>,
  setPredictionData: Dispatch<SetStateAction<PredictionsType[]>>
) {
  e.preventDefault();
  const loadingToast = toast.loading("Fetching data...");
  const encodedParam = encodeURIComponent(controlForm.buscaCnpj);

  try {
    // Registration fetching - automatically triggers reload of histogram data based on ANBIMA CLASS
    setIsLoading(true);
    const newRegistration = await selRegistration(
      encodedParam,
      controlForm,
      setControlForm
    );
    setRegistration(newRegistration);
  } catch (err) {
    console.log(err);
  }
  setIsLoading(false);

  try {
    // Historic and Predictions fetching
    const slicedHistoricData = await getHistoricData(
      encodedParam,
      controlForm,
      setHistoricData
    );
    let predictions: PredictionsType[] = [];

    if (slicedHistoricData) {
      predictions = await getPredictions(
        controlForm.buscaCnpj,
        slicedHistoricData,
        controlForm,
        setPredictionData
      );
    }

    if (predictions) {
      toast.success("Done.");
      // console.log("Finished fetching historic and prediction.");
    } else {
      toast.error("Something went wrong.");
    }
  } catch (err) {
    console.log(err);
    toast.error("Sorry. We had a problem fetching the data.");
  }

  toast.dismiss(loadingToast);
}

export { handleControlFormChange, handleControlFormSubmit };
