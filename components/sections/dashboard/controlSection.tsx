import { format } from "date-fns";
import ButtonIndigo from "../../UI/buttonIndigo";
import { RawDataType } from "@/utils/types";
import { useContext, useEffect } from "react";
import { Dispatch, SetStateAction } from "react";
import type {
  CadastroFundosType,
  DashboardControlFormType,
  PredictionsType,
} from "@/utils/types";
import toast from "react-hot-toast";
import { ax } from "@/database/axios.config";
import { subWeeks, addDays, getDay, addWeeks } from "date-fns";
import { UserContext } from "@/contexts/UserContext";
import { AxiosResponse } from "axios";
import type { MouseEventHandler } from "react";

interface ControlSectionProps {
  data: RawDataType[];
  setHistoricData: Dispatch<SetStateAction<RawDataType[]>>;
  setPredictionData: Dispatch<SetStateAction<PredictionsType[]>>;
  controlForm: DashboardControlFormType;
  setControlForm: Dispatch<SetStateAction<DashboardControlFormType>>;
  saveCenario: MouseEventHandler<HTMLButtonElement | HTMLDivElement>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setRegistration: Dispatch<SetStateAction<false | CadastroFundosType>>;
}

export default function ControlSection({
  data,
  setHistoricData,
  setPredictionData,
  controlForm,
  setControlForm,
  saveCenario,
  setIsLoading,
  setRegistration,
}: ControlSectionProps) {
  const userContext = useContext(UserContext);
  const user = userContext.user;
  const arrWeeksPreds = [4];
  const arrBaseDates = [
    "2023-11-24T03:00:00Z",
    "2023-12-29T03:00:00Z",
    "2024-01-26T03:00:00Z",
  ];

  async function getHistoricData(encodedParam: string, baseDate: string) {
    try {
      const responseHistoric = await ax.get(
        `/rawData/getAllFromCnpj?cnpj=${encodedParam}&baseDate=${baseDate}`
      );
      console.log("Complete historic data:");
      console.log(responseHistoric);
      let slicedHistoricData: RawDataType[] = [];
      if (responseHistoric.data) {
        // slicedHistoricData = responseHistoric.data.slice(
        //   controlForm.weeksBack * -5 - 1,
        //   responseHistoric.data.length
        // );
        const adjHistoricData: RawDataType[] = responseHistoric.data.map(
          (cE: RawDataType) => {
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
        console.log("higherDate");
        console.log(higherDate);
        console.log("cutDate");
        console.log(subWeeks(higherDate, controlForm.weeksBack));

        slicedHistoricData = adjHistoricData.filter((cE) => {
          return cE.DT_COMPTC >= subWeeks(higherDate, controlForm.weeksBack);
        });
      }
      console.log("Length of sliced data:");
      console.log(slicedHistoricData.length);
      console.log("Sliced data:");
      console.log(slicedHistoricData);
      console.log("Final historic data after mapping to convert date:");
      console.log(slicedHistoricData);
      setHistoricData(slicedHistoricData);
      return slicedHistoricData;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async function getPredictions(
    encodedParam: string,
    slicedHistoricData: RawDataType[]
  ) {
    let responsePreds: AxiosResponse<any, any> | undefined;
    responsePreds = await ax.get(
      `/prediction/getFromCnpj?cnpj=${encodedParam}`
    );
    console.log("Predictions:");
    console.log(responsePreds);
    let finalPredictionData: PredictionsType[] = [];
    if (responsePreds && responsePreds.data && slicedHistoricData) {
      finalPredictionData.push({
        // including last date shown in historic (current date)
        DT_COMPTC: slicedHistoricData[slicedHistoricData.length - 1].DT_COMPTC,
        CNPJ_FUNDO:
          slicedHistoricData[slicedHistoricData.length - 1].CNPJ_FUNDO,
        CAPTC_LIQ: slicedHistoricData[slicedHistoricData.length - 1].CAPTC_LIQ,
      });

      let lastDate =
        slicedHistoricData[slicedHistoricData.length - 1].DT_COMPTC; // Última data do histórico para começar o loop
      const endPredDate = addWeeks(lastDate, 4); // Última data da predição de 4 semanas
      while (lastDate < endPredDate) {
        // const lastDate =
        //   finalPredictionData[finalPredictionData.length - 1].DT_COMPTC;
        // if (!lastDate) {
        //   break;
        // }
        let newDate = lastDate;
        const dayOfWeek = getDay(lastDate);
        if (dayOfWeek === 5) {
          newDate = addDays(lastDate, 3);
        } else {
          newDate = addDays(lastDate, 1);
        }
        finalPredictionData.push({
          // including prediction for 4 weeks based on the varCota of the controlForm
          DT_COMPTC: newDate,
          CNPJ_FUNDO: responsePreds.data.CNPJ_FUNDO,
          CAPTC_LIQ:
            responsePreds.data[
              (controlForm.varCota * 100).toFixed(1).toString()
            ],
        });
        lastDate = newDate;
      }
    }
    console.log("Final prediction data:");
    console.log(finalPredictionData);
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
        return registration.data;
      }
    } catch (err) {
      console.log(err);
    }
    return false;
  }

  useEffect(() => {
    if (data[0]) {
      setControlForm({
        ...controlForm,
        buscaCnpj: data[0].CNPJ_FUNDO ? data[0].CNPJ_FUNDO : "",
      });
    }
  }, [data]);

  function handleControlFormChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    let newVal = e.target.value;
    if (e.target.name === "buscaCnpj") {
      const cnpjNum = e.target.value.replaceAll(/[.\/-]/gm, ""),
        lenNum = cnpjNum.length,
        len = e.target.value.length,
        specialChars = [".", "/", "-"];
      if (!specialChars.includes(e.target.value[len - 2])) {
        switch (lenNum) {
          case 3:
            newVal =
              e.target.value.slice(0, lenNum - 1) +
              "." +
              e.target.value.slice(lenNum - 1, lenNum);
            break;
          case 6:
            newVal =
              e.target.value.slice(0, lenNum) +
              "." +
              e.target.value.slice(lenNum, lenNum + 1);
            break;
          case 9:
            newVal =
              e.target.value.slice(0, lenNum + 1) +
              "/" +
              e.target.value.slice(lenNum + 1, lenNum + 2);
            break;
          case 13:
            newVal =
              e.target.value.slice(0, lenNum + 2) +
              "-" +
              e.target.value.slice(lenNum + 2, lenNum + 3);
            break;
          case 15:
            newVal = e.target.value.slice(0, len - 1);
            break;
          default:
            break;
        }
      }
    }
    setControlForm({ ...controlForm, [e.target.name]: newVal });
    return;
  }

  async function handleControlFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const loadingToast = toast.loading("Fetching data...");
    const encodedParam = encodeURIComponent(controlForm.buscaCnpj);

    try {
      // Registration fetching
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
        predictions = await getPredictions(encodedParam, slicedHistoricData);
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

  return (
    <>
      <div className="w-screen hidden text-white/90 lg:block">
        <h1 className="my-4 font-semibold text-2xl text-center border-b border-white/90 pb-2 mx-[32vw] lg:indent-6 lg:mx-8 lg:text-left">
          Control Section
        </h1>
      </div>
      <div
        id="controls"
        className="px-4 mx-4 bg-gradient-to-br from-white from-15% to-white/30 mt-6 py-4 rounded-xl shadow-lg shadow-indigo-900 lg:px-0 lg:max-w-[70vw] lg:w-fit lg:h-fit lg:mt-2"
      >
        <h1 className="font-bold text-xl text-center w-fit mx-auto px-8 border-black border-b mb-6 lg:hidden">
          Control section
        </h1>
        <form
          id="controlFormMobile"
          className="lg:hidden"
          onSubmit={handleControlFormSubmit}
        >
          <div className="flex flex-row justify-center gap-4 lg:gap-16">
            <div className="flex flex-col gap-1 font-semibold max-w-24 lg:gap-0 text-sm">
              <label htmlFor="baseDate" className="h-8">
                Base Date
              </label>
              <label htmlFor="buscaCnpj" className="h-8">
                CNPJ
              </label>
              <label htmlFor="weeksBack" className="h-8">
                Weeks back
              </label>
              <label htmlFor="weeksForward" className="h-8">
                Weeks forward
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
                Shareholders var (%)
              </label>
              <label
                htmlFor="varCota"
                className="h-8 whitespace-nowrap overflow-scroll"
              >
                Quota var (%)
              </label>
            </div>
            <div className="flex flex-col items-stretch gap-1 lg:gap-0">
              <div className="h-8">
                <select
                  id="baseDate"
                  name="baseDate"
                  value={controlForm.baseDate}
                  onChange={handleControlFormChange}
                  className="rounded-md border-2 border-black px-1 bg-white w-full"
                >
                  {arrBaseDates.map((cE) => {
                    return (
                      <option value={cE}>
                        {format(new Date(cE), "dd/MM/yyyy")}
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
                  className="rounded-md border-2 border-black px-1 bg-white w-full"
                >
                  {user &&
                    user.cnpjs &&
                    user.cnpjs.map((cE) => {
                      return <option value={cE}>{cE}</option>;
                    })}
                </select>
              </div>
              <div className="h-8">
                <input
                  type="text"
                  id="weeksBack"
                  name="weeksBack"
                  className="rounded-md border-2 border-black px-2 w-full"
                  value={controlForm.weeksBack}
                  onChange={handleControlFormChange}
                ></input>
              </div>
              <div className="h-8">
                <select
                  id="weeksForward"
                  name="weeksForward"
                  className="rounded-md border-2 border-black px-1 w-full"
                  value={controlForm.weeksForward}
                  onChange={handleControlFormChange}
                >
                  {arrWeeksPreds.map((cE) => {
                    return <option value={cE}>{cE}</option>;
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
                  min={-0.1}
                  max={0.1}
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
                  min={-0.1}
                  max={0.1}
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
                  step={0.005}
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
              className="absolute right-0 bottom-1 lg:right-40 text-xs text-indigo-800 px-1 transition-all duration-200 border-yellow-700 hover:text-yellow-600 lg:ml-8 lg:hover:border-yellow-800"
            >
              + Save Cenario
            </div>
          </div>
        </form>
        <form
          id="controlFormDesk"
          className="hidden lg:block"
          onSubmit={handleControlFormSubmit}
        >
          <div className="flex flex-row justify-center gap-y-6 lg:flex-wrap">
            <div className="flex flex-col font-semibold items-center w-[30%]">
              <label htmlFor="baseDate">Base Date</label>
              <select
                id="baseDate"
                name="baseDate"
                value={controlForm.baseDate}
                onChange={handleControlFormChange}
                className="border-b-2 rounded-t-sm border-black text-center w-40 bg-transparent focus:outline-none"
              >
                {arrBaseDates.map((cE) => {
                  return (
                    <option value={cE}>
                      {format(new Date(cE), "dd/MM/yyyy")}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="flex flex-col font-semibold items-center w-[30%]">
              <label htmlFor="buscaCnpj">CNPJ</label>
              <select
                id="buscaCnpj"
                name="buscaCnpj"
                value={controlForm.buscaCnpj}
                onChange={handleControlFormChange}
                className="border-b-2 rounded-t-sm border-black text-center w-40 bg-transparent focus:outline-none"
              >
                {user &&
                  user.cnpjs &&
                  user.cnpjs.map((cE) => {
                    return <option value={cE}>{cE}</option>;
                  })}
              </select>
            </div>
            <div className="flex flex-col font-semibold items-center w-[30%]">
              <label htmlFor="weeksBack">Weeks back</label>
              <input
                type="text"
                id="weeksBack"
                name="weeksBack"
                className="border-b-2 rounded-t-sm border-black px-2 text-center w-40 bg-transparent focus:outline-none"
                value={controlForm.weeksBack}
                onChange={handleControlFormChange}
              ></input>
            </div>
            <div className="flex flex-col font-semibold items-center w-[30%]">
              <label htmlFor="weeksForward">Weeks forward</label>
              <select
                id="weeksForward"
                name="weeksForward"
                className="border-b-2 rounded-t-sm border-black text-center pl-4 w-40 bg-transparent text-gray-900 focus:outline-none"
                value={controlForm.weeksForward}
                onChange={handleControlFormChange}
              >
                {arrWeeksPreds.map((cE) => {
                  return <option value={cE}>{cE}</option>;
                })}
              </select>
            </div>
            <div className="flex flex-col font-semibold items-center w-[30%]">
              <label htmlFor="varNF">% Net Funding var</label>
              <div className="flex gap-4 text-sm">
                <span
                  className="range-value w-10 text-sm"
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
                  min={-0.1}
                  max={0.1}
                  step={0.01}
                  className="indigo-500"
                  value={controlForm.varNF}
                  onChange={handleControlFormChange}
                ></input>
              </div>
            </div>
            <div className="flex flex-col font-semibold items-center w-[30%]">
              <label htmlFor="varCotistas">% Shareholders var</label>
              <div className="flex gap-4 text-sm">
                <span
                  className="range-value w-10 text-sm"
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
                  min={-0.1}
                  max={0.1}
                  step={0.01}
                  className="indigo-500"
                  value={controlForm.varCotistas}
                  onChange={handleControlFormChange}
                ></input>
              </div>
            </div>
            <div className="flex flex-col font-semibold items-center w-[30%]">
              <label htmlFor="varCota">Quota variation (%)</label>
              <div className="flex gap-4">
                <span
                  className="range-value w-10 text-sm"
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
                  step={0.005}
                  className="indigo-500"
                  value={controlForm.varCota}
                  onChange={handleControlFormChange}
                ></input>
              </div>
            </div>
            <div className="flex justify-center relative items-center w-full">
              <ButtonIndigo shadowSize="md" shadowColor="black">
                Update
              </ButtonIndigo>
              <div
                onClick={saveCenario}
                className="absolute right-40 bottom-0 text-indigo-900 font-semibold px-1 transition-all duration-200 border-yellow-900 hover:text-yellow-900  lg:ml-8 lg:hover:border-yellow-800 hover:cursor-pointer hover:-translate-y-px"
              >
                + Save Cenario
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
