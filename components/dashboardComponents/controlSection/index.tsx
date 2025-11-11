import { useEffect, useState } from "react";
import { useUser } from "@/contexts/userContext";
import {
  getData,
  getRegistration,
  getArrCnpjFundName,
  getDataForHistogram,
  getCorrels,
} from "./controlSectionFunctions";
import ControlFormDesk from "./forms/controlFormDesk";
import ControlFormMobile from "./forms/controlFormMobile";
import TitleComponent from "@/components/UI/titleComponent";
import { useControlForm } from "@/contexts/controlFormContext";
import type { ControlSectionProps } from "./controlSectionTypes";
import type { ControlFormPropsType } from "./forms/controlFormType";

export default function ControlSection({
  registration,
  ancoras,
  setHistoricRendaFixaData,
  setHistoricMultimercadoData,
  setHistoricAcoesData,
  setPredictionRendaFixaData,
  setPredictionMultimercadoData,
  setPredictionAcoesData,
  setRegistration,
  setHistoricData,
  setPredictionData,
  setIsLoading,
  setLoadingHistogram,
  setDataForHistogram,
  setCorrels,
  setHeatMapObj,
}: ControlSectionProps) {
  const userContext = useUser();
  const { controlForm, setControlForm } = useControlForm();
  const [arrCnpjName, setArrCnpjName] = useState<any[]>([]);
  const [nameSelectedFund, setNameSelectedFund] = useState<string>("");
  const [currSubmitToast, setCurrSubmitToast] = useState<string>("");
  const user = userContext.user;
  const formProps: ControlFormPropsType = {
    ancoras,
    arrCnpjName,
    nameSelectedFund,
    currSubmitToast,
    setNameSelectedFund,
    setRegistration,
    setIsLoading,
    setHistoricData,
    setPredictionData,
    setCurrSubmitToast,
    setHistoricRendaFixaData,
    setHistoricMultimercadoData,
    setHistoricAcoesData,
    setPredictionRendaFixaData,
    setPredictionMultimercadoData,
    setPredictionAcoesData,
  };

  // Updates the controlForm with the first CNPJ in CNPJs list, initially.
  // Get user registration and array with CNPJ and names of funds.
  // Get historic data and predictions
  useEffect(() => {
    if (!user || !controlForm) {
      return;
    }

    getData(
      user,
      controlForm,
      setControlForm,
      setRegistration,
      setHistoricData,
      setHistoricRendaFixaData,
      setHistoricMultimercadoData,
      setHistoricAcoesData,
      setPredictionData,
      setPredictionRendaFixaData,
      setPredictionMultimercadoData,
      setPredictionAcoesData,
      setCurrSubmitToast
    );

    getRegistration(
      user,
      controlForm,
      setControlForm,
      setRegistration,
      setNameSelectedFund,
      setIsLoading
    );

    getArrCnpjFundName(user.cnpjs, setArrCnpjName);

    return;
  }, [user]);

  // Get Histogram and correlations
  useEffect(() => {
    getDataForHistogram(controlForm, setLoadingHistogram, setDataForHistogram);
    getCorrels(
      controlForm.buscaCnpj,
      controlForm.Classificacao,
      setCorrels,
      setHeatMapObj
    );
  }, [registration]);

  return (
    <>
      <div className="w-full text-white/90 flex justify-center lg:block mb-2 lg:mb-0">
        <TitleComponent>Control Section</TitleComponent>
      </div>
      <div
        id="controls"
        className="px-4 mx-2 lg:mx-0 bg-gradient-to-br from-white from-15% to-white/30 py-4 rounded-xl shadow-lg shadow-white/30 text-gray-900 lg:px-4 lg:max-w-[95vw] lg:w-fit lg:h-fit lg:mt-2 lg:bg-none lg:shadow-none lg:text-white"
      >
        <ControlFormMobile {...formProps} />
        <ControlFormDesk {...formProps} />
      </div>{" "}
    </>
  );
}
