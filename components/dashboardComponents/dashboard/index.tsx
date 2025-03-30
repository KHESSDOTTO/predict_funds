import { useState, useEffect } from "react";
import {
  CadastroFundosType,
  HistoricType,
  PredictionsType,
} from "@/utils/types/generalTypes/types";
import ControlSection from "../controlSection";
import { useUser } from "@/contexts/userContext";
import RegistrationInfos from "../registrationInfos";
import CorrelCardsSection from "@/components/dashboardComponents/correlCardsSection";
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
import { useControlForm } from "@/contexts/controlFormContext";

export default function Dashboard({ ancoras }: DashboardPropsType) {
  const userContext = useUser();
  const { controlForm, setControlForm } = useControlForm();
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const screenWidth = useWindowWidth();
  const [historicData, setHistoricData] = useState<HistoricType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [registration, setRegistration] = useState<CadastroFundosType | false>(
    false
  );
  const [predictionData, setPredictionData] = useState<PredictionsType[]>([]);
  const [loadingHistogram, setLoadingHistogram] = useState<boolean>(true);
  const [dataForHistogram, setDataForHistogram] = useState<RawHistogramData[]>(
    []
  );
  const [correls, setCorrels] = useState<any>(false);
  const [heatMapObj, setHeatMapObj] = useState<HeatMapObjType | false>(false);
  const saveCenariosArgs: SaveCenarioParamsType = {
    userContext,
    controlForm,
    historicData,
    predictionData,
  };
  const controlSectionProps = {
    setHistoricData: setHistoricData,
    setPredictionData: setPredictionData,
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
  const classificacoes = ["Ações", "Multimercado", "Renda Fixa"];

  useEffect(() => {
    if (screenWidth > 992) {
      setIsMobile(false);
    } else {
      setIsMobile(true);
    }

    return;
  }, [screenWidth]);

  useEffect(() => {
    if (ancoras && ancoras.length > 0) {
      setControlForm({ ...controlForm, baseDate: ancoras[ancoras.length - 1] });
    }

    return;
  }, [ancoras]);

  return (
    <main className="flex flex-col items-center gap-8 lg:gap-12 min-w-full text-sm py-2">
      <div className="mt-14 w-full">
        <LogoPredict bold={false} />
      </div>
      <div className="w-full">
        <ControlSection {...controlSectionProps} />
      </div>
      <div className="w-full">
        <RegistrationInfos isLoading={isLoading} registration={registration} />
      </div>
      {/* <div className="flex flex-col w-full lg:flex-row gap-4">
          {
          cvmClasses.map((currClass) => {
              return (
              <div className="w-full lg:w-1/3">
                  <NetFundingPredChart
                  {...{
                      title: `Net Funding CVM Class - ${currClass}`,
                      smallV: false,
                      isMobile,
                      historic: historicData,
                      predictions: predictionData,
                      predList: false,
                  }}
                  />
              </div>
              )
          })
          }
        </div> */}
      <div className="w-full">
        <NetFundingPredChart
          {...{
            title: `Net Funding ${
              registration ? "- CNPJ: " + registration["CNPJ_Fundo"] : ""
            }`,
            smallV: false,
            isMobile,
            historic: historicData,
            predictions: predictionData,
          }}
        />
      </div>
      <div className="w-full">
        <NetFundingHistogramChart
          {...{
            currCnpj: controlForm.buscaCnpj,
            smallV: false,
            Classificacao: registration ? registration["Classificacao"] : "",
            isMobile,
            dataForHistogram,
            loadingHistogram,
            setLoadingHistogram,
          }}
        />
      </div>
      <div className="w-full">
        <ValueQuotaChart
          {...{ smallV: false, isMobile, historic: historicData }}
        />
      </div>
      <div className="w-full">
        <CorrelCardsSection padding="5px 0" correls={correls} />
      </div>
      <div className="w-full">
        <HeatMap title="Heat Map - Correlations" heatMapObj={heatMapObj} />
      </div>
      <div className="w-full flex justify-center lg:hidden">
        <CenariosBtnSection saveCenario={() => saveCenario(saveCenariosArgs)} />
      </div>
    </main>
  );
}
