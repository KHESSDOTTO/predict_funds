import { AxiosResponse } from "axios";
import { prepareHistogram } from "@/functions/histogramFunctions";
import { ax } from "@/database/axios.config";
import { subWeeks, addWeeks } from "date-fns";
import toast from "react-hot-toast";
import type {
  DashboardControlFormType,
  HistoricType,
  PredictionsType,
  UserType,
} from "@/utils/types";
import type { Dispatch, SetStateAction } from "react";

async function getHistoricData(
  encodedParam: string,
  controlForm: DashboardControlFormType,
  setHistoricData: Dispatch<SetStateAction<HistoricType[]>>
) {
  try {
    const baseDate = controlForm.baseDate;
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
  slicedHistoricData: HistoricType[],
  controlForm: DashboardControlFormType,
  setPredictionData: Dispatch<SetStateAction<PredictionsType[]>>
) {
  let responsePreds: AxiosResponse<any, any> | undefined;
  responsePreds = await ax.post(`/prediction/getWithBaseDate`, {
    ...controlForm,
    buscaCnpj: cnpj,
  });

  let finalPredictionData: PredictionsType[] = [];

  if (responsePreds && responsePreds.data && slicedHistoricData) {
    let lastDate = slicedHistoricData[slicedHistoricData.length - 1].DT_COMPTC; // Last historic date to begin the loop
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

async function selRegistration(
  encodedParam: string,
  controlForm: DashboardControlFormType,
  setControlForm: Dispatch<SetStateAction<DashboardControlFormType>>
) {
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
  windowWidth: number,
  setLoadingHistogram: Dispatch<SetStateAction<boolean>>,
  setHistogram: Dispatch<SetStateAction<any>>
) {
  let numBins = 14;
  const lowerLimitOutliers = 0.05;
  const upperLimitOutliers = 0.95;

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
        controlForm.buscaCnpj,
        lowerLimitOutliers,
        upperLimitOutliers
      );

      setHistogram(histogram);
    }
  } catch (err) {
    console.log(err);
  }
  setLoadingHistogram(false);
  return;
}

async function getCorrels(
  cnpj: string,
  anbimaClass: string,
  setCorrels: Dispatch<SetStateAction<any>>,
  setHeatMapObj: Dispatch<SetStateAction<any>>
) {
  const encodedCnpj = encodeURIComponent(cnpj);
  const encodedAnbimaClass = encodeURIComponent(anbimaClass);

  if (!anbimaClass) {
    return false;
  }

  try {
    const resCnpj = await ax.get(`/correlations/getByCnpj?cnpj=${encodedCnpj}`);

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
      const newheatMapObj = {
        fund: resCnpj.data,
        avg: resAvgAnbimaClass.data,
      };
      setHeatMapObj(newheatMapObj);
    }

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function getRegistration(
  user: UserType,
  controlForm: DashboardControlFormType,
  setControlForm: Dispatch<SetStateAction<DashboardControlFormType>>,
  setRegistration: Dispatch<SetStateAction<any>>,
  setNameSelectedFund: Dispatch<SetStateAction<string>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>
) {
  if (!user) return;

  const cnpj = user.cnpjs[0];
  const encodedCnpj = encodeURIComponent(cnpj);

  try {
    const registration = await selRegistration(
      encodedCnpj,
      controlForm,
      setControlForm
    );

    setRegistration(registration);
    setNameSelectedFund(registration["DENOM_SOCIAL"]);
    setIsLoading(false);
  } catch (err) {
    console.log(err);
  }
}

async function getData(
  user: UserType,
  controlForm: DashboardControlFormType,
  setHistoricData: Dispatch<SetStateAction<HistoricType[]>>,
  setPredictionData: Dispatch<SetStateAction<PredictionsType[]>>
) {
  if (!user) {
    return;
  }

  const loadingToast = toast.loading("Fetching data...");
  const cnpj = user.cnpjs[0];
  const encodedCnpj = encodeURIComponent(cnpj);

  try {
    const slicedHistoricData = await getHistoricData(
      encodedCnpj,
      controlForm,
      setHistoricData
    );

    let predictions: PredictionsType[] | false = [];

    if (slicedHistoricData) {
      predictions = await getPredictions(
        cnpj,
        slicedHistoricData,
        controlForm,
        setPredictionData
      );
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

export {
  getHistoricData,
  getPredictions,
  selRegistration,
  getHistogram,
  getCorrels,
  getRegistration,
  getData,
  getArrCnpjFundName,
};
