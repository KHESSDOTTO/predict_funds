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
import { consoleLog } from "@/utils/functions/genericFunctions";

export default function ControlSection({
  registration,
  ancoras,
  setRegistration,
  setHistoricData,
  setPredictionData,
  saveCenario,
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
  const [currSubmitToast, setCurrSubmitToast] = useState("");
  const user = userContext.user;
  const formProps: ControlFormPropsType = {
    ancoras: ancoras,
    arrCnpjName: arrCnpjName,
    nameSelectedFund: nameSelectedFund,
    currSubmitToast: currSubmitToast,
    setNameSelectedFund: setNameSelectedFund,
    setRegistration: setRegistration,
    setIsLoading: setIsLoading,
    setHistoricData: setHistoricData,
    setPredictionData: setPredictionData,
    saveCenario: saveCenario,
    setCurrSubmitToast: setCurrSubmitToast,
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
      setHistoricData,
      setPredictionData,
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
        className="px-4 bg-gradient-to-br from-white from-15% to-white/30 py-4 rounded-xl shadow-lg shadow-white/30 text-gray-900 lg:px-4 lg:max-w-[95vw] lg:w-fit lg:h-fit lg:mt-2 lg:bg-none lg:shadow-none lg:text-white"
      >
        <ControlFormMobile {...formProps} />
        <ControlFormDesk {...formProps} />
      </div>{" "}
    </>
  );
}
