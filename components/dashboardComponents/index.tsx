import { useState, useEffect, ReactNode } from "react";
import {
  CadastroFundosType,
  HistoricType,
  PredictionsType,
} from "@/utils/types/generalTypes/types";
import ControlSection from "./controlSection";
import { useUser } from "@/contexts/userContext";
import RegistrationInfos from "./registrationInfos";
import CorrelCardsSection from "@/components/dashboardComponents/correlCardsSection";
import HeatMap from "./heatMap";
import type { HeatMapObjType } from "./heatMap/heatMapTypes";
import LogoPredict from "@/components/UI/logoPredict";
import NetFundingPredChart from "./netFundingPredChart";
import NetFundingHistogramChart from "./netFundingHistogramChart";
import ValueQuotaChart from "./valueQuotaChart";
import type { DashboardPropsType } from "./dashboardTypes";
import type { RawHistogramData } from "@/database/models/prediction/predictionsType";
import { useControlForm } from "@/contexts/controlFormContext";
import { classificacoes } from "@/utils/globalVars";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css/pagination";
import styles from "./styles/dashboard.module.css";
import { useDevice } from "@/contexts/deviceContext";

export default function Dashboard({ ancoras }: DashboardPropsType) {
  const userContext = useUser();
  const userPreferences = userContext.user?.preferences?.netFundingDash;
  const { controlForm, setControlForm } = useControlForm();
  const { isMobile } = useDevice();
  const [historicFundData, setHistoricFundData] = useState<HistoricType[]>([]);
  const [historicRendaFixaData, setHistoricRendaFixaData] = useState<
    HistoricType[]
  >([]);
  const [historicMultimercadoData, setHistoricMultimercadoData] = useState<
    HistoricType[]
  >([]);
  const [historicAcoesData, setHistoricAcoesData] = useState<HistoricType[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [registration, setRegistration] = useState<CadastroFundosType | false>(
    false
  );
  const [predictionFundData, setPredictionFundData] = useState<
    PredictionsType[]
  >([]);
  const [predictionRendaFixaData, setPredictionRendaFixaData] = useState<
    PredictionsType[]
  >([]);
  const [predictionMultimercadoData, setPredictionMultimercadoData] = useState<
    PredictionsType[]
  >([]);
  const [predictionAcoesData, setPredictionAcoesData] = useState<
    PredictionsType[]
  >([]);
  const [loadingHistogram, setLoadingHistogram] = useState<boolean>(true);
  const [dataForHistogram, setDataForHistogram] = useState<RawHistogramData[]>(
    []
  );
  const [correls, setCorrels] = useState<any>(false);
  const [heatMapObj, setHeatMapObj] = useState<HeatMapObjType | false>(false);
  const controlSectionProps = {
    setHistoricRendaFixaData,
    setHistoricMultimercadoData,
    setHistoricAcoesData,
    setPredictionRendaFixaData,
    setPredictionMultimercadoData,
    setPredictionAcoesData,
    setHistoricData: setHistoricFundData,
    setPredictionData: setPredictionFundData,
    setIsLoading: setIsLoading,
    registration: registration,
    setRegistration: setRegistration,
    setLoadingHistogram: setLoadingHistogram,
    setDataForHistogram: setDataForHistogram,
    setCorrels: setCorrels,
    setHeatMapObj: setHeatMapObj,
    ancoras: ancoras,
  };
  const mapVars = {
    "Renda Fixa": {
      historic: historicRendaFixaData,
      prediction: predictionRendaFixaData,
    },
    Multimercado: {
      historic: historicMultimercadoData,
      prediction: predictionMultimercadoData,
    },
    Ações: {
      historic: historicAcoesData,
      prediction: predictionAcoesData,
    },
  };

  useEffect(() => {
    if (ancoras && ancoras.length > 0) {
      setControlForm({ ...controlForm, baseDate: ancoras[ancoras.length - 1] });
    }

    return;
  }, [ancoras]);

  const optionalComponentsMap: { [key: number]: ReactNode } = {
    2: (
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
    ),
    3: (
      <ValueQuotaChart
        {...{ smallV: false, isMobile, historic: historicFundData }}
      />
    ),
    4: <CorrelCardsSection padding="5px 0" correls={correls} />,
    5: <HeatMap title="Heat Map - Correlations" heatMapObj={heatMapObj} />,
  };

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
      <div className="nf-classificacoes-container lg:hidden w-full relative">
        <Swiper
          modules={[Pagination, Navigation]}
          pagination
          navigation={{
            nextEl: `.nf-classificacoes-container .swiper-button-next`,
            prevEl: `.nf-classificacoes-container .swiper-button-prev`,
          }}
          loop={true}
          speed={600}
          className={`${styles.swiperContainer} w-11/12`}
        >
          {classificacoes.map((currClass) => {
            return (
              <SwiperSlide
                key={`swiper-dashboard-${currClass}`}
                className="px-2 mb-12"
              >
                <NetFundingPredChart
                  {...{
                    title: ["Net Funding CVM Class", currClass],
                    smallV: false,
                    historic: mapVars[currClass]["historic"],
                    predictions: mapVars[currClass]["prediction"],
                    predList: false,
                    exportPosition: "bottom",
                  }}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div className={`swiper-button-prev ${styles.swiperButtonPrev}`}></div>
        <div className={`swiper-button-next ${styles.swiperButtonNext}`}></div>
      </div>
      <div className="hidden lg:flex lg:w-full lg:flex-row lg:gap-6">
        {classificacoes.map((currClass) => {
          return (
            <div key={currClass} className="w-full mb-4 lg:mb-0 lg:w-1/3">
              <NetFundingPredChart
                {...{
                  title: `Net Funding CVM Class - ${currClass}`,
                  smallV: false,
                  historic: mapVars[currClass]["historic"],
                  predictions: mapVars[currClass]["prediction"],
                  predList: false,
                  exportPosition: "bottom",
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="w-full">
        <NetFundingPredChart
          {...{
            title: `Net Funding ${
              registration ? "- CNPJ: " + registration["CNPJ_Fundo"] : ""
            }`,
            smallV: false,
            historic: historicFundData,
            predictions: predictionFundData,
            exportPosition: isMobile ? "bottom" : "right",
          }}
        />
      </div>

      {userPreferences &&
        userPreferences.map((idComponent) => {
          return (
            <div className="w-full">{optionalComponentsMap[idComponent]}</div>
          );
        })}
    </main>
  );
}
