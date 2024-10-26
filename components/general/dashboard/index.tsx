import { useContext, useState } from "react";
import toast from "react-hot-toast";
import {
  CadastroFundosType,
  DashboardControlFormType,
  FinalHistogramData,
  HistoricType,
  PredictionsType,
  UserType,
} from "@/utils/types";
import ControlSection from "../controlSection";
import ChartSection from "../chartSection";
import { UserContext } from "@/contexts/UserContext";
import RegistrationInfos from "../registrationInfos";
import CorrelCardsSection from "@/components/general/correlCardsSection";
import HeatMap, { HeatMapObjType } from "../heatMap";
import CenariosBtnSection from "../cenarioBtnSection";
import LogoPredict from "@/components/UI/logoPredict";

interface DashboardProps {
  user: UserType;
  ancoras: string[] | null;
}

export default function Dashboard({ user, ancoras }: DashboardProps) {
  const userContext = useContext(UserContext);
  const [historicData, setHistoricData] = useState<HistoricType[]>([]),
    [isLoading, setIsLoading] = useState(true),
    [registration, setRegistration] = useState<CadastroFundosType | false>(
      false
    ),
    [predictionData, setPredictionData] = useState<PredictionsType[]>([]),
    [loadingHistogram, setLoadingHistogram] = useState<boolean>(true),
    [histogram, setHistogram] = useState<FinalHistogramData | false>(false),
    [controlForm, setControlForm] = useState<DashboardControlFormType>({
      baseDate: ancoras
        ? ancoras[ancoras.length - 1]
        : "2024-05-31T00:00:00.00Z",
      buscaCnpj: user.cnpjs[0],
      varNF: 0,
      varCotistas: 0,
      varCota: 0,
      weeksBack: 8,
      weeksAhead: 4,
      anbimaClass: "",
    }),
    [correls, setCorrels] = useState<any>(false),
    [heatMapArr, setHeatMapArr] = useState<HeatMapObjType | false>(false);

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
    setHeatMapArr: setHeatMapArr,
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
    <main className="flex flex-col items-center gap-4 min-w-full text-sm lg:gap-0">
      <div className="w-full mt-12 px-4 lg:mt-16">
        <LogoPredict bold={false} />
      </div>
      <div className="mt-4 lg:mt-10">
        <ControlSection {...controlSectionProps} />
      </div>
      <div className="mt-6 lg:mt-8 w-screen">
        <RegistrationInfos isLoading={isLoading} registration={registration} />
      </div>
      <div className="mt-6 lg:mt-16 w-screen">
        <ChartSection
          registration={registration}
          historic={historicData}
          smallV={false}
          predictions={predictionData}
          histogram={histogram}
          loadingHistogram={loadingHistogram}
        />
      </div>
      <div className="lg:mt-12 w-screen">
        <CorrelCardsSection padding="5px 0" correls={correls} />
      </div>
      <div className="mt-8 lg:mt-12 w-screen">
        <HeatMap title="Heat Map - Correlations" heatMapArr={heatMapArr} />
      </div>
      <div className="w-screen mt-6 lg:mt-8 flex justify-center">
        <CenariosBtnSection saveCenario={saveCenario} />
      </div>
    </main>
  );
}
