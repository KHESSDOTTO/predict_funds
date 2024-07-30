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
import { UserContext } from "@/contexts/UserContext";
import RegistrationInfos from "./registrationInfos";
import CorrelCardsSection from "@/components/sections/dashboard/correlCardsSection";
import HeatMap from "./heatMap";
import { correlAssocArr } from "@/dummy-vars-tests/correlAssocArr";
import CenariosBtnSection from "./cenariosBtnSection";

interface DashboardProps {
  user: UserType;
  ancoras: string[] | null;
}

export default function Dashboard({ user, ancoras }: DashboardProps) {
  // console.log("this is the user:");
  // console.log(user);
  const userContext = useContext(UserContext);
  const [historicData, setHistoricData] = useState<RawDataType[]>([]),
    [isLoading, setIsLoading] = useState(true),
    [registration, setRegistration] = useState<CadastroFundosType | false>(
      false
    ),
    [predictionData, setPredictionData] = useState<PredictionsType[]>([]),
    [loadingHistogram, setLoadingHistogram] = useState<boolean>(true),
    [histogram, setHistogram] = useState<any[]>([]),
    [controlForm, setControlForm] = useState<DashboardControlFormType>({
      baseDate: ancoras ? ancoras[0] : "2024-05-31T00:00:00.00Z",
      buscaCnpj: user.cnpj,
      varNF: 0,
      varCotistas: 0,
      varCota: 0,
      weeksBack: 8,
      weeksForward: 4,
      anbimaClass: "",
    }),
    [correls, setCorrels] = useState<any>(false);

  const controlSectionProps = {
    setHistoricData: setHistoricData,
    setPredictionData: setPredictionData,
    controlForm: controlForm,
    setControlForm: setControlForm,
    saveCenario: saveCenario,
    setIsLoading: setIsLoading,
    registration: registration,
    setRegistration: setRegistration,
    setLoadingHistogram: setLoadingHistogram,
    setHistogram: setHistogram,
    setCorrels: setCorrels,
    ancoras: ancoras,
  };

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
      <ControlSection {...controlSectionProps} />
      <RegistrationInfos isLoading={isLoading} registration={registration} />
      <div className="lg:mb-8"></div>
      <ChartSection
        data={historicData}
        smallV={false}
        predictions={predictionData}
        histogram={histogram}
        loadingHistogram={loadingHistogram}
      />
      <CorrelCardsSection padding="20" gap="8" correls={correls} />
      <HeatMap
        title="Heat Map - Correlations"
        correlAssocArr={correlAssocArr}
      />
      <CenariosBtnSection saveCenario={saveCenario} />
    </section>
  );
}
