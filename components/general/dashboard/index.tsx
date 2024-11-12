import { useContext, useState, useEffect } from "react";
import {
  CadastroFundosType,
  DashboardControlFormType,
  HistoricType,
  PredictionsType,
} from "@/utils/types/generalTypes/types";
import ControlSection from "../controlSection";
import { UserContext } from "@/contexts/UserContext";
import RegistrationInfos from "../registrationInfos";
import CorrelCardsSection from "@/components/general/correlCardsSection";
import HeatMap from "../heatMap";
import type { HeatMapObjType } from "../heatMap/heatMapTypes";
import CenariosBtnSection from "../cenarioBtnSection";
import LogoPredict from "@/components/UI/logoPredict";
import NetFundingPredChart from "../netFundingPredChart";
import NetFundingHistogramChart from "../netFundingHistogramChart";
import ValueQuotaChart from "../valueQuotaChart";
import useWindowWidth from "@/hooks/useWindowWidth";
import { saveCenario } from "./dashboardFunctions";
import type {
  DashboardPropsType,
  SaveCenarioParamsType,
} from "./dashboardTypes";
import type { RawHistogramData } from "@/database/models/prediction/predictionsType";

export default function Dashboard({ user, ancoras }: DashboardPropsType) {
  const userContext = useContext(UserContext);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const screenWidth = useWindowWidth();
  const [historicData, setHistoricData] = useState<HistoricType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [registration, setRegistration] = useState<CadastroFundosType | false>(
    false
  );
  const [predictionData, setPredictionData] = useState<PredictionsType[]>([]);
  const [loadingHistogram, setLoadingHistogram] = useState<boolean>(true);
  const [dataForHistogram, setDataForHistogram] = useState<RawHistogramData[]>([]);
  const [controlForm, setControlForm] = useState<DashboardControlFormType>({
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
    [heatMapObj, setHeatMapObj] = useState<HeatMapObjType | false>(false);
  const saveCenariosArgs: SaveCenarioParamsType = {
    userContext,
    controlForm,
    historicData,
    predictionData,
  };
  const controlSectionProps = {
    setHistoricData: setHistoricData,
    setPredictionData: setPredictionData,
    controlForm: controlForm,
    setControlForm: setControlForm,
    saveCenario: () => saveCenario(saveCenariosArgs),
    setIsLoading: setIsLoading,
    registration: registration,
    setRegistration: setRegistration,
    setLoadingHistogram: setLoadingHistogram,
    setDataForHistogram: setDataForHistogram,
    setCorrels: setCorrels,
    setHeatMapObj: setHeatMapObj,
    ancoras: ancoras,
  };

  useEffect(() => {
    if (screenWidth > 992) {
      setIsMobile(false);
    } else {
      setIsMobile(true);
    }
  }, [screenWidth]);

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
        <div className="w-full flex flex-col justify-center items-center gap-6 lg:gap-8 text-white">
          <NetFundingPredChart
            {...{
              smallV: false,
              isMobile,
              historic: historicData,
              predictions: predictionData,
            }}
          />
          <NetFundingHistogramChart
            {...{
              currCnpj: controlForm.buscaCnpj,
              smallV: false,
              anbimaClass: registration ? registration["CLASSE_ANBIMA"] : "",
              isMobile,
              dataForHistogram,
              loadingHistogram,
              setLoadingHistogram,
            }}
          />
          <ValueQuotaChart
            {...{ smallV: false, isMobile, historic: historicData }}
          />
        </div>
      </div>
      <div className="lg:mt-12 w-screen">
        <CorrelCardsSection padding="5px 0" correls={correls} />
      </div>
      <div className="mt-8 lg:mt-12 w-screen">
        <HeatMap title="Heat Map - Correlations" heatMapObj={heatMapObj} />
      </div>
      <div className="w-screen lg:mt-8 flex justify-center">
        <CenariosBtnSection saveCenario={() => saveCenario(saveCenariosArgs)} />
      </div>
    </main>
  );
}
