import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/contexts/UserContext";
import useWindowWidth from "@/hooks/useWindowWidth";
import {
  getData,
  getRegistration,
  getArrCnpjFundName,
  getHistogram,
  getCorrels,
} from "./controlSectionFunctions";
import ControlFormDesk from "./forms/controlFormDesk";
import ControlFormMobile from "./forms/controlFormMobile";
import type { ControlSectionProps } from "./controlSectionTypes";
import type { ControlFormPropsType } from "./forms/controlFormType";
import TitleComponent from "@/components/UI/titleComponent";

export default function ControlSection({
  controlForm,
  registration,
  ancoras,
  setControlForm,
  setRegistration,
  setHistoricData,
  setPredictionData,
  saveCenario,
  setIsLoading,
  setLoadingHistogram,
  setHistogram,
  setCorrels,
  setHeatMapObj,
}: ControlSectionProps) {
  const userContext = useContext(UserContext);
  const [arrCnpjName, setArrCnpjName] = useState<any[]>([]);
  const [nameSelectedFund, setNameSelectedFund] = useState<string>("");
  const screenWidth = useWindowWidth();
  const user = userContext.user;
  const formProps: ControlFormPropsType = {
    controlForm: controlForm,
    ancoras: ancoras,
    arrCnpjName: arrCnpjName,
    nameSelectedFund: nameSelectedFund,
    setNameSelectedFund: setNameSelectedFund,
    setControlForm: setControlForm,
    setRegistration: setRegistration,
    setIsLoading: setIsLoading,
    setHistoricData: setHistoricData,
    setPredictionData: setPredictionData,
    saveCenario: saveCenario,
  };

  // Updates the controlForm with the first CNPJ in CNPJs list, initially.
  // Get user registration and array with CNPJ and names of funds.
  // Get historic data and predictions
  useEffect(() => {
    if (!user) {
      return;
    }

    setControlForm((prevForm) => ({
      ...prevForm,
      buscaCnpj: user.cnpjs[0] || "",
    }));

    getData(user, controlForm, setHistoricData, setPredictionData);
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
    getHistogram(controlForm, screenWidth, setLoadingHistogram, setHistogram);
    getCorrels(
      controlForm.buscaCnpj,
      controlForm.anbimaClass,
      setCorrels,
      setHeatMapObj
    );
  }, [registration]);

  return (
    <>
      <div className="w-screen text-white/90 flex justify-center lg:block">
        <TitleComponent>Control Section</TitleComponent>
      </div>
      <div
        id="controls"
        className="px-4 mx-4 bg-gradient-to-br from-white from-15% to-white/30 py-4 rounded-xl shadow-lg shadow-white/30 text-gray-900 lg:px-0 lg:max-w-[95vw] lg:w-fit lg:h-fit lg:mt-2 lg:bg-none lg:shadow-none lg:text-white"
      >
        <ControlFormMobile {...formProps} />
        <ControlFormDesk {...formProps} />
      </div>{" "}
    </>
  );
}
