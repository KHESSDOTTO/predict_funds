import { ax } from "@/database/axios.config";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  DashboardControlFormType,
  PredictionsType,
  RawDataType,
  UserType,
} from "@/utils/types";
import ControlSection from "./controlSection";
import ChartSection from "./chartSection";
import Link from "next/link";
import { UserContext } from "@/contexts/UserContext";
import { addWeeks } from "date-fns";
import { AxiosResponse } from "axios";

interface DashboardProps {
  user: UserType;
}

export default function Dashboard({ user }: DashboardProps) {
  console.log("this is the user:");
  console.log(user);
  const userContext = useContext(UserContext);
  const [historicData, setHistoricData] = useState<RawDataType[]>([]),
    [predictionData, setPredictionData] = useState<PredictionsType[]>([]),
    [controlForm, setControlForm] = useState<DashboardControlFormType>({
      buscaCnpj: "",
      DI: 0.1,
      varCota: 0,
      weeksBack: 8,
      weeksForward: 4,
    });

  useEffect(() => {
    async function getData() {
      const loadingToast = toast.loading("Fetching data...");
      try {
        const encodedParam = encodeURIComponent(user.cnpj);
        const responseHistoric = await ax.get(
          `/rawData/getAllFromCnpj?cnpj=${encodedParam}`
        );
        console.log("Complete historic data:");
        console.log(responseHistoric);
        let slicedHistoricData = [];
        if (responseHistoric.data) {
          slicedHistoricData = responseHistoric.data.slice(
            controlForm.weeksBack * -7,
            responseHistoric.data.length
          );
        }
        console.log("Length of sliced data:");
        console.log(slicedHistoricData.length);
        console.log("Sliced data:");
        console.log(slicedHistoricData);
        let finalHistoricData: RawDataType[] = [];
        if (slicedHistoricData) {
          finalHistoricData = slicedHistoricData.map((cE: RawDataType) => {
            const convDate = new Date(cE.DT_COMPTC);
            return { ...cE, DT_COMPTC: convDate };
          });
        }
        console.log("Final historic data after mapping to convert date:");
        console.log(finalHistoricData);
        setHistoricData(finalHistoricData);
        let responsePreds: AxiosResponse<any, any> | undefined;
        // setTimeout(async () => {
        //   try {
        responsePreds = await ax.get(
          `/prediction/getFromCnpj?cnpj=${encodedParam}`
        );
        console.log("Predictions:");
        console.log(responsePreds);
        let finalPredictionData: PredictionsType[] = [];
        if (responsePreds && responsePreds.data && finalHistoricData) {
          finalPredictionData.push({
            // including last date shown in historic (current date)
            DT_COMPTC:
              finalHistoricData[finalHistoricData.length - 1].DT_COMPTC,
            CNPJ_FUNDO:
              finalHistoricData[finalHistoricData.length - 1].CNPJ_FUNDO,
            CAPTC_LIQ:
              finalHistoricData[finalHistoricData.length - 1].CAPTC_LIQ,
          });
          finalPredictionData.push({
            // including prediction for 4 weeks based on the varCota of the controlForm
            DT_COMPTC: addWeeks(
              finalHistoricData[finalHistoricData.length - 1].DT_COMPTC,
              4
            ),
            CNPJ_FUNDO: responsePreds.data.CNPJ_FUNDO,
            CAPTC_LIQ:
              responsePreds.data[
                (controlForm.varCota * 100).toFixed(1).toString()
              ],
          });
        }
        console.log("Final prediction data:");
        console.log(finalPredictionData);
        if (finalPredictionData) {
          setPredictionData(finalPredictionData);
        }
        toast.success("Done.");
      } catch (err) {
        console.log(err);
        toast.error("Sorry. We had a problem fetching the data.");
      }
      toast.dismiss(loadingToast);
    }
    if (!historicData[0]) {
      getData();
    }
    return;
  }, []);

  function saveCenario() {
    userContext.setCenarios([
      ...userContext.cenarios,
      {
        id: Math.random().toString(),
        params: controlForm,
        historicData: historicData,
        predictionData: predictionData,
      },
    ]);
    toast.success("Saved cenario!");
    return;
  }

  return (
    <section className="flex flex-col items-center gap-4 min-w-full text-sm lg:gap-0">
      <ControlSection
        data={historicData}
        setHistoricData={setHistoricData}
        setPredictionData={setPredictionData}
        controlForm={controlForm}
        setControlForm={setControlForm}
      />
      <div className="lg:mb-2"></div>
      <ChartSection
        data={historicData}
        smallV={false}
        predictions={predictionData}
      />
      <div
        id="cenariosBtnSection"
        className="flex flex-wrap gap-4 mt-[-5px] justify-center items-center lg:w-10/12 lg:pt-2 lg:mt-4"
      >
        <div className="w-full border-gray-100/50 shadow-lg h-2 shadow-white lg:border-b-2"></div>
        <button
          onClick={saveCenario}
          className="text-indigo-300 px-1 transition-all duration-300 border-indigo-300 hover:text-indigo-500 lg:border-b lg:ml-8 lg:hover:border-indigo-500 hover:-translate-y-px"
        >
          + Save Cenario
        </button>
        <Link href={"/loggedin/my_cenarios"} className="lg:right-2">
          <button className="text-red-500 px-1 transition-all duration-200 border-red-500 hover:text-red-700 lg:border-b lg:hover:border-red-700 hover:-translate-y-px">
            Go to Cenarios
          </button>
        </Link>
      </div>
    </section>
  );
}
