import ButtonIndigo from "../../UI/buttonIndigo";
import { useContext, useEffect, useState } from "react";
import { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";
import { ax } from "@/database/axios.config";
import { subWeeks, addWeeks, format } from "date-fns";
import { UserContext } from "@/contexts/UserContext";
import { AxiosResponse } from "axios";
import { consoleLog } from "@/functions/functions";
import { prepareHistogram } from "@/functions/histogramFunctions";
import { predictionWeeks } from "@/utils/globalVars";

import type { MouseEventHandler } from "react";
import type {
  CadastroFundosType,
  DashboardControlFormType,
  HistoricType,
  PredictionsType,
} from "@/utils/types";
import useWindowWidth from "@/hooks/useWindowWidth";

interface ControlSectionProps {
  setHistoricData: Dispatch<SetStateAction<HistoricType[]>>;
  setPredictionData: Dispatch<SetStateAction<PredictionsType[]>>;
  controlForm: DashboardControlFormType;
  setControlForm: Dispatch<SetStateAction<DashboardControlFormType>>;
  saveCenario: MouseEventHandler<HTMLButtonElement | HTMLDivElement>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  registration: CadastroFundosType | false;
  setRegistration: Dispatch<SetStateAction<false | CadastroFundosType>>;
  setLoadingHistogram: Dispatch<SetStateAction<boolean>>;
  setHistogram: Dispatch<SetStateAction<any>>;
  setCorrels: Dispatch<SetStateAction<any>>;
  setHeatMapArr: Dispatch<SetStateAction<any>>;
  ancoras: string[] | null;
}

export default function ControlSection({
  setHistoricData,
  setPredictionData,
  controlForm,
  setControlForm,
  saveCenario,
  setIsLoading,
  registration,
  setRegistration,
  setLoadingHistogram,
  setHistogram,
  setCorrels,
  setHeatMapArr,
  ancoras,
}: ControlSectionProps) {
  const userContext = useContext(UserContext);
  const [arrCnpjName, setArrCnpjName] = useState<any[]>([]);
  const [nameSelectedFund, setNameSelectedFund] = useState<string>("");
  const screenWidth = useWindowWidth();
  const user = userContext.user;

  async function getHistoricData(encodedParam: string, baseDate: string) {
    try {
      const responseHistoric = await ax.get(
        `/historic/getAllByCnpj?cnpj=${encodedParam}&baseDate=${baseDate}`
      );
      let slicedHistoricData: HistoricType[] = [];

      if (responseHistoric.data) {
        const adjHistoricData: HistoricType[] = responseHistoric.data.map(
          (cE: HistoricType) => {
            const convDate = new Date(cE.DT_COMPTC);
            return { ...cE, DT_COMPTC: convDate };
          }
        );

        adjHistoricData.sort(
          (a, b) => a.DT_COMPTC.getTime() - b.DT_COMPTC.getTime()
        );

        const higherDate = adjHistoricData.reduce((acc: Date, cE) => {
          return cE.DT_COMPTC > acc ? cE.DT_COMPTC : acc;
        }, new Date("2020-01-01T00:00:00Z"));

        slicedHistoricData = adjHistoricData.filter((cE) => {
          return cE.DT_COMPTC >= subWeeks(higherDate, controlForm.weeksBack);
        });
      }
      setHistoricData(slicedHistoricData);

      return slicedHistoricData;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async function getPredictions(
    cnpj: string,
    slicedHistoricData: HistoricType[]
  ) {
    let responsePreds: AxiosResponse<any, any> | undefined;
    responsePreds = await ax.post(`/prediction/getWithBaseDate`, {
      ...controlForm,
      buscaCnpj: cnpj,
    });

    let finalPredictionData: PredictionsType[] = [];

    if (responsePreds && responsePreds.data && slicedHistoricData) {
      let lastDate =
        slicedHistoricData[slicedHistoricData.length - 1].DT_COMPTC; // Last historic date to begin the loop
      const endPredDate = addWeeks(lastDate, controlForm.weeksAhead); // Last date for a 4 week prediction

      while (lastDate < endPredDate) {
        const newDate = addWeeks(lastDate, 1);

        finalPredictionData.push({
          DT_COMPTC: newDate,
          ...responsePreds.data,
        });

        lastDate = newDate;
      }
    }

    if (finalPredictionData) {
      setPredictionData(finalPredictionData);
    }

    return finalPredictionData;
  }

  async function selRegistration(encodedParam: string) {
    try {
      const registration = await ax.get(
        `/cadastroFundos/getByCnpj?cnpj=${encodedParam}`
      );
      if (registration) {
        setControlForm({
          ...controlForm,
          anbimaClass: registration.data["CLASSE_ANBIMA"],
        });
        return registration.data;
      }
    } catch (err) {
      console.log(err);
    }
    return false;
  }

  async function getHistogram(
    controlForm: DashboardControlFormType,
    windowWidth: number
  ) {
    let numBins = 14;

    const isMobile = windowWidth <= 992;
    if (isMobile) {
      numBins = 8;
    }

    setLoadingHistogram(true);
    if (!controlForm.anbimaClass) return; // Won't execute if there is no anbimaClass
    let responsePreds: AxiosResponse<any, any> | undefined;
    try {
      responsePreds = await ax.post(`/prediction/getHistogramData`, {
        ...controlForm,
      });

      if (responsePreds) {
        const histogram = prepareHistogram(
          responsePreds.data,
          numBins,
          controlForm.buscaCnpj
        );

        setHistogram(histogram);
      }
    } catch (err) {
      console.log(err);
    }
    setLoadingHistogram(false);
    return;
  }

  async function getCorrels(cnpj: string, anbimaClass: string) {
    const encodedCnpj = encodeURIComponent(cnpj);
    const encodedAnbimaClass = encodeURIComponent(anbimaClass);

    if (!anbimaClass) {
      return false;
    }

    try {
      const resCnpj = await ax.get(
        `/correlations/getByCnpj?cnpj=${encodedCnpj}`
      );

      let adjustCorrelCnpj;
      if (resCnpj) {
        adjustCorrelCnpj = resCnpj.data.map((cE: any) => Object.entries(cE));
      }

      if (resCnpj) {
        setCorrels(adjustCorrelCnpj);
      }

      const resAvgAnbimaClass = await ax.get(
        `/correlations/getAvgByAnbimaClass?anbimaClass=${encodedAnbimaClass}`
      );

      if (resCnpj && resAvgAnbimaClass) {
        const newHeatMapArr = {
          fund: resCnpj.data,
          avg: resAvgAnbimaClass.data,
        };
        setHeatMapArr(newHeatMapArr);
      }

      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async function getRegistration() {
    if (!user) return;
    const cnpj = user.cnpjs[0];
    const encodedCnpj = encodeURIComponent(cnpj);
    try {
      const registration = await selRegistration(encodedCnpj);
      setRegistration(registration);
      setNameSelectedFund(registration["DENOM_SOCIAL"]);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  async function getData() {
    if (!user) {
      return;
    }

    const loadingToast = toast.loading("Fetching data...");
    const cnpj = user.cnpjs[0];
    const encodedCnpj = encodeURIComponent(cnpj);
    try {
      const slicedHistoricData = await getHistoricData(
        encodedCnpj,
        controlForm.baseDate
      );
      let predictions: PredictionsType[] | false = [];
      if (slicedHistoricData) {
        predictions = await getPredictions(cnpj, slicedHistoricData);
      }
      if (predictions) {
        toast.success("Done.");
      } else {
        toast.error("Something went wrong.");
      }
    } catch (err) {
      console.log(err);
      toast.error("Sorry. We had a problem fetching the data.");
    }
    toast.dismiss(loadingToast);
  }

  async function getArrCnpjFundName(
    cnpjs: string[],
    setArrCnpjName: Dispatch<SetStateAction<any[]>>
  ): Promise<boolean> {
    if (!cnpjs) {
      return false;
    }

    try {
      const arrCnpjName = await ax.post("/cadastroFundos/getArrCnpjName", {
        cnpjs: cnpjs,
      });

      if (!arrCnpjName.data) {
        return false;
      }

      setArrCnpjName(arrCnpjName.data);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

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

    getData();
    getRegistration();
    getArrCnpjFundName(user.cnpjs, setArrCnpjName);
    return;
  }, [user]);

  // Get Histogram and correlations
  useEffect(() => {
    getHistogram(controlForm, screenWidth);
    getCorrels(controlForm.buscaCnpj, controlForm.anbimaClass);
  }, [registration]);

  function handleControlFormChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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

      setNameSelectedFund(selectedFund[0]["DENOM_SOCIAL"]);
    }

    return;
  }

  async function handleControlFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const loadingToast = toast.loading("Fetching data...");
    const encodedParam = encodeURIComponent(controlForm.buscaCnpj);

    try {
      // Registration fetching - automatically triggers reload of histogram data based on ANBIMA CLASS
      setIsLoading(true);
      const newRegistration = await selRegistration(encodedParam);
      setRegistration(newRegistration);
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);

    try {
      // Historic and Predictions fetching
      const slicedHistoricData = await getHistoricData(
        encodedParam,
        controlForm.baseDate
      );
      let predictions: PredictionsType[] = [];

      if (slicedHistoricData) {
        predictions = await getPredictions(
          controlForm.buscaCnpj,
          slicedHistoricData
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

  return (
    <>
      <div className="w-screen text-white/90 flex justify-center lg:block">
        <h1 className="my-4 font-semibold text-xl text-center border-b border-white/90 p-2 lg:mx-4 lg:text-left">
          Control Section
        </h1>
      </div>
      <div
        id="controls"
        className="px-4 mx-4 bg-gradient-to-br from-white from-15% to-white/30 py-4 rounded-xl shadow-lg shadow-white/30 text-gray-900 lg:px-0 lg:max-w-[95vw] lg:w-fit lg:h-fit lg:mt-2 lg:bg-none lg:shadow-none lg:text-white"
      >
        <form
          id="controlFormMobile"
          className="py-2 lg:hidden"
          onSubmit={handleControlFormSubmit}
        >
          <input
            type="hidden"
            name="anbimaClass"
            id="anbimaClass"
            value={controlForm.anbimaClass}
          />
          <div className="flex flex-row justify-center gap-4 lg:gap-16">
            <div className="flex flex-col gap-1 font-semibold max-w-24 lg:gap-0 text-sm">
              <label htmlFor="baseDate" className="h-8">
                Base Date
              </label>
              <label htmlFor="buscaCnpj" className="h-8">
                Fund Name
              </label>
              <label htmlFor="weeksBack" className="h-8">
                Weeks back
              </label>
              <label htmlFor="weeksAhead" className="h-8">
                Weeks ahead
              </label>
              <label
                htmlFor="varNF"
                className="h-8 whitespace-nowrap overflow-scroll"
              >
                N. Funding var (%)
              </label>
              <label
                htmlFor="varCotistas overflow-scroll"
                className="h-8 whitespace-nowrap overflow-scroll"
              >
                Shareholders qnt. var (%)
              </label>
              <label
                htmlFor="varCota"
                className="h-8 whitespace-nowrap overflow-scroll"
              >
                Quota var (%)
              </label>
            </div>
            <div className="flex flex-col items-stretch gap-1 lg:gap-0 overflow-hidden">
              <div className="h-8">
                <select
                  id="baseDate"
                  name="baseDate"
                  value={controlForm.baseDate}
                  onChange={handleControlFormChange}
                  className="rounded-md shadow-md shadow-gray-500 px-1 bg-white w-full"
                >
                  {ancoras?.map((cE, cI) => {
                    const ancora = new Date(cE);
                    return (
                      <option key={cI} value={cE}>
                        {format(ancora, "dd/MM/yyyy")}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="h-8">
                <select
                  id="buscaCnpj"
                  name="buscaCnpj"
                  value={controlForm.buscaCnpj}
                  onChange={handleControlFormChange}
                  className="rounded-md shadow-md shadow-gray-500 px-1 bg-white w-full"
                  title={controlForm.buscaCnpj}
                >
                  {arrCnpjName &&
                    arrCnpjName.map((cE, cI) => {
                      return (
                        <option
                          key={cI}
                          value={cE["CNPJ_FUNDO"]}
                          className="text-ellipsis max-w-6 overflow-hidden"
                        >
                          {cE["DENOM_SOCIAL"]}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className="h-8">
                <input
                  type="text"
                  id="weeksBack"
                  name="weeksBack"
                  className="rounded-md shadow-md shadow-gray-500 px-2 w-full"
                  value={controlForm.weeksBack}
                  onChange={handleControlFormChange}
                ></input>
              </div>
              <div className="h-8">
                <select
                  id="weeksAhead"
                  name="weeksAhead"
                  className="rounded-md shadow-md shadow-gray-500 px-1 w-full"
                  value={controlForm.weeksAhead}
                  onChange={handleControlFormChange}
                >
                  {predictionWeeks.map((cE, cI) => {
                    return (
                      <option key={cI} value={cE}>
                        {cE}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="flex h-8 gap-4 text-sm">
                <span
                  className="range-value w-12 text-sm"
                  style={{
                    color:
                      controlForm.varNF < 0
                        ? "darkred"
                        : controlForm.varNF == 0
                        ? ""
                        : "darkgreen",
                  }}
                >
                  {(controlForm.varNF * 100).toFixed(2)}%
                </span>
                <input
                  type="range"
                  id="varNF"
                  name="varNF"
                  min={-0.05}
                  max={0.05}
                  step={0.01}
                  className="indigo-500"
                  value={controlForm.varNF}
                  onChange={handleControlFormChange}
                ></input>
              </div>
              <div className="flex h-8 gap-4 text-sm">
                <span
                  className="range-value w-12 text-sm"
                  style={{
                    color:
                      controlForm.varCotistas < 0
                        ? "darkred"
                        : controlForm.varCotistas == 0
                        ? ""
                        : "darkgreen",
                  }}
                >
                  {(controlForm.varCotistas * 100).toFixed(2)}%
                </span>
                <input
                  type="range"
                  id="varCotistas"
                  name="varCotistas"
                  min={-0.05}
                  max={0.05}
                  step={0.01}
                  className="indigo-500"
                  value={controlForm.varCotistas}
                  onChange={handleControlFormChange}
                ></input>
              </div>
              <div className="flex h-8 gap-4">
                <span
                  className="range-value w-12 text-sm"
                  style={{
                    color:
                      controlForm.varCota < 0
                        ? "darkred"
                        : controlForm.varCota == 0
                        ? ""
                        : "darkgreen",
                  }}
                >
                  {(controlForm.varCota * 100).toFixed(2)}%
                </span>
                <input
                  type="range"
                  id="varCota"
                  name="varCota"
                  min={-0.05}
                  max={0.05}
                  step={0.01}
                  className="indigo-500"
                  value={controlForm.varCota}
                  onChange={handleControlFormChange}
                ></input>
              </div>
            </div>
          </div>
          <div className="text-center relative mt-6 lg:mt-4 lg:shadow-md lg:shadow-black">
            <ButtonIndigo shadowSize="md" shadowColor="black">
              Update
            </ButtonIndigo>
            <div
              onClick={saveCenario}
              className="absolute right-0 bottom-1 text-xs text-indigo-800 px-1 transition-all duration-200 border-yellow-700 hover:text-yellow-600 lg:ml-8 lg:hover:border-yellow-800"
            >
              + Save Cenario
            </div>
          </div>
        </form>
        <form
          id="controlFormDesk"
          className="hidden lg:block lg:border-red-500"
          onSubmit={handleControlFormSubmit}
        >
          <input
            type="hidden"
            name="anbimaClass"
            id="anbimaClass"
            value={controlForm.anbimaClass}
          />
          <div className="flex relative flex-row justify-start px-4 gap-x-32 gap-y-16 w-[95vw] border-red-500 lg:mb-4 lg:flex-wrap lg:text-sm lg:text-white/90">
            <div className="flex flex-row justify-start gap-4 border-red-500 w-fit items-start">
              <span className="mr-4">Config.: </span>
              <div className="flex flex-col justify-start gap-4 border-red-500 w-fit items-center">
                <div className="flex flex-col font-semibold items-center gap-1 border-white">
                  <label htmlFor="baseDate" className="whitespace-nowrap">
                    Base Date
                  </label>
                  <select
                    id="baseDate"
                    name="baseDate"
                    value={controlForm.baseDate}
                    onChange={handleControlFormChange}
                    className="border-b-2 rounded-t-sm lg:rounded-md lg:text-black border-black text-center w-40 bg-transparent lg:bg-gradient-to-r from-white/80 via-white to-white/80 focus:outline-none"
                  >
                    {ancoras?.map((cE, cI) => {
                      const ancora = new Date(cE);
                      return (
                        <option key={cI} value={cE}>
                          {format(ancora, "dd/MM/yyyy")}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="flex flex-col font-semibold items-center gap-1">
                  <label htmlFor="buscaCnpj">Fund Name</label>
                  <select
                    id="buscaCnpj"
                    name="buscaCnpj"
                    value={controlForm.buscaCnpj}
                    onChange={handleControlFormChange}
                    className="border-b-2 text-ellipsis rounded-t-sm lg:rounded-md lg:text-black border-black text-center w-40 bg-transparent lg:bg-gradient-to-r from-white/80 via-white to-white/80 focus:outline-none"
                    title={nameSelectedFund}
                  >
                    {arrCnpjName &&
                      arrCnpjName.map((cE, cI) => {
                        return (
                          <option key={cI} value={cE["CNPJ_FUNDO"]}>
                            {cE["DENOM_SOCIAL"]}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className="flex flex-col font-semibold items-center gap-1">
                  <label htmlFor="weeksBack">Weeks back</label>
                  <input
                    type="text"
                    id="weeksBack"
                    name="weeksBack"
                    className="border-b-2 rounded-t-sm border-black px-2 text-center w-40 bg-transparent focus:outline-none lg:bg-gradient-to-r from-white/80 via-white to-white/80 lg:rounded-md lg:text-black"
                    value={controlForm.weeksBack}
                    onChange={handleControlFormChange}
                  ></input>
                </div>
                <div className="flex flex-col font-semibold items-center gap-1">
                  <label htmlFor="weeksAhead">Weeks ahead</label>
                  <select
                    id="weeksAhead"
                    name="weeksAhead"
                    className="border-b-2 rounded-t-sm border-black text-center pl-4 w-40 bg-transparent text-black focus:outline-none lg:bg-gradient-to-r from-white/80 via-white to-white/80 lg:rounded-md"
                    value={controlForm.weeksAhead}
                    onChange={handleControlFormChange}
                  >
                    {predictionWeeks.map((cE, cI) => {
                      return (
                        <option key={cI} value={cE}>
                          {cE}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-start gap-6 border-blue-500 items-start">
              <span className="mr-6">Params: </span>
              <div className="flex flex-col justify-start gap-4 border-red-500 w-fit items-center">
                <div className="flex flex-col font-semibold items-center gap-1">
                  <label htmlFor="varNF">% Net Funding var</label>
                  <div className="flex gap-4 text-sm">
                    <span
                      className="range-value w-10 text-sm"
                      style={{
                        color:
                          controlForm.varNF < 0
                            ? "orange"
                            : controlForm.varNF == 0
                            ? ""
                            : "green",
                      }}
                    >
                      {(controlForm.varNF * 100).toFixed(2)}%
                    </span>
                    <input
                      type="range"
                      id="varNF"
                      name="varNF"
                      min={-0.05}
                      max={0.05}
                      step={0.01}
                      className="indigo-500"
                      value={controlForm.varNF}
                      onChange={handleControlFormChange}
                    ></input>
                  </div>
                </div>
                <div className="flex flex-col font-semibold items-center gap-1">
                  <label htmlFor="varCotistas">% Shareholders qnt. var</label>
                  <div className="flex gap-4 text-sm">
                    <span
                      className="range-value w-10 text-sm"
                      style={{
                        color:
                          controlForm.varCotistas < 0
                            ? "orange"
                            : controlForm.varCotistas == 0
                            ? ""
                            : "green",
                      }}
                    >
                      {(controlForm.varCotistas * 100).toFixed(2)}%
                    </span>
                    <input
                      type="range"
                      id="varCotistas"
                      name="varCotistas"
                      min={-0.05}
                      max={0.05}
                      step={0.01}
                      className="indigo-500"
                      value={controlForm.varCotistas}
                      onChange={handleControlFormChange}
                    ></input>
                  </div>
                </div>
                <div className="flex flex-col font-semibold items-center gap-1">
                  <label htmlFor="varCota">Quota variation (%)</label>
                  <div className="flex gap-4">
                    <span
                      className="range-value w-10 text-sm"
                      style={{
                        color:
                          controlForm.varCota < 0
                            ? "orange"
                            : controlForm.varCota == 0
                            ? ""
                            : "green",
                      }}
                    >
                      {(controlForm.varCota * 100).toFixed(2)}%
                    </span>
                    <input
                      type="range"
                      id="varCota"
                      name="varCota"
                      min={-0.05}
                      max={0.05}
                      step={0.01}
                      className="indigo-500"
                      value={controlForm.varCota}
                      onChange={handleControlFormChange}
                    ></input>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center p-0 ml-6">
              <button
                type="submit"
                className="text-base transition-all duration-300 h-[110%] border-l-2 border-white/80 text-white/80 p-auto flex justify-center items-center pl-4 hover:text-yellow-700 hover:border-yellow-700"
              >
                <div className="shadow-black relative bottom-1 hover:shadow-xl">
                  Update
                </div>
              </button>
            </div>
            <div
              onClick={saveCenario}
              className="absolute bottom-0 right-0 xl:right-24 text-white italic px-1 transition-all duration-200 border-yellow-900 hover:text-indigo-400  lg:ml-4 lg:hover:border-yellow-600 hover:cursor-pointer hover:-translate-y-px"
            >
              + Save Cenario
            </div>
          </div>
        </form>
      </div>{" "}
    </>
  );
}
