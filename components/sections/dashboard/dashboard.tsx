import { useContext, useState } from "react";
import toast from "react-hot-toast";
import {
  CadastroFundosType,
  DashboardControlFormType,
  PredictionsType,
  RawDataType,
  UserType,
} from "@/utils/types";
import ControlSection from "./controlSection";
import ChartSection from "./chartSection";
import Link from "next/link";
import { UserContext } from "@/contexts/UserContext";
import RegistrationInfos from "./registrationInfos";

interface DashboardProps {
  user: UserType;
}

export default function Dashboard({ user }: DashboardProps) {
  // console.log("this is the user:");
  // console.log(user);
  const userContext = useContext(UserContext);
  const [historicData, setHistoricData] = useState<RawDataType[]>([]),
    [isLoading, setIsLoading] = useState(true),
    [registration, setRegistration] = useState<CadastroFundosType | false>(
      false
    ),
    [predictionData, setPredictionData] = useState<PredictionsType[]>([]),
    [controlForm, setControlForm] = useState<DashboardControlFormType>({
      baseDate: "2023-11-24T03:00:00Z",
      buscaCnpj: "",
      varNF: 0,
      varCotistas: 0,
      varCota: 0,
      weeksBack: 8,
      weeksForward: 4,
      anbimaClass: "",
    });

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
        setHistoricData={setHistoricData}
        setPredictionData={setPredictionData}
        controlForm={controlForm}
        setControlForm={setControlForm}
        saveCenario={saveCenario}
        setIsLoading={setIsLoading}
        setRegistration={setRegistration}
      />
      <RegistrationInfos isLoading={isLoading} registration={registration} />
      <div className="lg:mb-8"></div>
      <ChartSection
        data={historicData}
        smallV={false}
        predictions={predictionData}
      />
      <div
        id="cenariosBtnSection"
        className="flex flex-wrap gap-2 lg:gap-0 px-4 justify-center items-center lg:w-10/12 lg:pt-2 lg:mt-4 lg:px-0"
      >
        <div className="w-full border-white/90 lg:border-white/20 mb-1 shadow-lg h-2 shadow-white lg:shadow-black lg:border-b-2 lg:mb-0"></div>
        <div className="w-full flex justify-center items-start gap-4 lg:bg-gradient-to-b lg:from-black/50 lg:via-black/40 lg:via-50% lg:pt-[10px] lg:pb-4">
          <button
            onClick={saveCenario}
            className="text-indigo-400 px-1 transition-all duration-300 border-indigo-400 hover:text-indigo-300 lg:hover:border-indigo-500 hover:-translate-y-px"
          >
            + Save Cenario
          </button>
          <Link href={"/loggedin/my_cenarios"} className="lg:right-2">
            <button className="text-red-600 px-1 transition-all duration-200 border-red-500 hover:text-red-500 lg:hover:border-red-700 hover:-translate-y-px">
              Go to Cenarios
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
