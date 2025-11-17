import toast from "react-hot-toast";
import { AxiosResponse } from "axios";
import { ax } from "@/database/axios.config";
import type {
  CadastroFundosType,
  DashboardControlFormType,
  HistoricType,
  PredictionsType,
  UserType,
} from "@/utils/types/generalTypes/types";
import type { Dispatch, SetStateAction } from "react";
import { classificacoes } from "@/utils/globalVars";
import Helpers from "@/utils/functions/helpers";

async function getHistoricData(
  encodedParam: string,
  controlForm: DashboardControlFormType,
  setHistoricData: Dispatch<SetStateAction<HistoricType[]>>
) {
  try {
    const { baseDate, weeksBack } = controlForm;
    const responseHistoric = await ax.get(
      `/historic/getByCnpj?cnpj=${encodedParam}&baseDate=${baseDate}&weeksBack=${
        weeksBack || 8
      }`
    );

    let adjHistoricData: HistoricType[] = [];

    if (responseHistoric.data) {
      adjHistoricData = responseHistoric.data.map((cE: HistoricType) => {
        const convDate = new Date(cE.DT_COMPTC);
        return { ...cE, DT_COMPTC: convDate };
      });
    }

    setHistoricData(adjHistoricData);

    return adjHistoricData;
  } catch (err) {
    console.log(err);

    return false;
  }
}

async function getPredictions(
  cnpj: string,
  controlForm: DashboardControlFormType,
  setPredictionData: Dispatch<SetStateAction<PredictionsType[]>>
) {
  let responsePreds: AxiosResponse<any, any> | undefined;
  responsePreds = await ax.post(`/prediction/getWithBaseDate`, {
    ...controlForm,
    buscaCnpj: cnpj,
  });

  let finalPredictionData: PredictionsType[] = [];

  // Convert JSON string representation of date into Date object type
  if (responsePreds && responsePreds.data) {
    finalPredictionData = Helpers.convertDtComptcToDate(
      responsePreds.data
    ) as PredictionsType[];
  }
  // End: Convert JSON string representation of date into Date object type

  setPredictionData(finalPredictionData);

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
        buscaCnpj: registration.data["CNPJ_Fundo"],
        Classificacao: registration.data["Classificacao"],
      });

      return registration.data;
    }
  } catch (err) {
    console.log(err);
  }
  return false;
}

async function getDataForHistogram(
  controlForm: DashboardControlFormType,
  setLoadingHistogram: Dispatch<SetStateAction<boolean>>,
  setDataForHistogram: Dispatch<SetStateAction<any>>
) {
  setLoadingHistogram(true);

  let responsePreds: AxiosResponse<any, any> | undefined;

  try {
    responsePreds = await ax.post(`/prediction/getHistogramData`, {
      ...controlForm,
    });

    if (responsePreds) {
      setDataForHistogram(responsePreds.data);
    }
  } catch (err) {
    console.log(err);

    return false;
  }

  return true;
}

async function getCorrels(
  cnpj: string,
  classificacao: string,
  setCorrels: Dispatch<SetStateAction<any>>,
  setHeatMapObj: Dispatch<SetStateAction<any>>
) {
  const encodedCnpj = encodeURIComponent(cnpj);
  const encodedClassificacao = encodeURIComponent(classificacao);

  if (!classificacao) {
    return false;
  }

  try {
    const resCnpj = await ax.get(`/correlations/getByCnpj?cnpj=${encodedCnpj}`);
    let adjustCorrelCnpj;

    if (resCnpj) {
      adjustCorrelCnpj = resCnpj.data.map((cE: any) => Object.entries(cE));

      setCorrels(adjustCorrelCnpj);
    }

    const resAvgClassificacao = await ax.get(
      `/correlations/getAvgByClassificacao?classificacao=${encodedClassificacao}`
    );

    if (resCnpj && resAvgClassificacao) {
      const newheatMapObj = {
        fund: resCnpj.data,
        avg: resAvgClassificacao.data,
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
  let returnValue = {};

  try {
    const registration = await selRegistration(
      encodedCnpj,
      controlForm,
      setControlForm
    );

    setRegistration(registration);
    setNameSelectedFund(registration["Denominacao_Social_F"]);
    setIsLoading(false);

    returnValue = registration;
  } catch (err) {
    console.log(err);
  }

  return returnValue;
}

async function getData(
  user: UserType,
  controlForm: DashboardControlFormType,
  setControlForm: Dispatch<SetStateAction<DashboardControlFormType>>,
  setRegistration: Dispatch<SetStateAction<false | CadastroFundosType>>,
  setHistoricData: Dispatch<SetStateAction<HistoricType[]>>,
  setHistoricRendaFixaData: Dispatch<SetStateAction<HistoricType[]>>,
  setHistoricMultimercadoData: Dispatch<SetStateAction<HistoricType[]>>,
  setHistoricAcoesData: Dispatch<SetStateAction<HistoricType[]>>,
  setPredictionData: Dispatch<SetStateAction<PredictionsType[]>>,
  setPredictionRendaFixaData: Dispatch<SetStateAction<PredictionsType[]>>,
  setPredictionMultimercadoData: Dispatch<SetStateAction<PredictionsType[]>>,
  setPredictionAcoesData: Dispatch<SetStateAction<PredictionsType[]>>,
  setCurrSubmitToast: Dispatch<SetStateAction<string>>
) {
  if (!user) {
    return;
  }

  const loadingToast = toast.loading("Fetching data...");

  setCurrSubmitToast(loadingToast);

  const cnpj = controlForm.buscaCnpj || user.cnpjs[0] || null;
  const encodedCnpj = encodeURIComponent(cnpj || "");
  const mapHistoricSetters = {
    "Renda Fixa": setHistoricRendaFixaData,
    Multimercado: setHistoricMultimercadoData,
    Ações: setHistoricAcoesData,
  };
  const mapPredictionSetters = {
    "Renda Fixa": setPredictionRendaFixaData,
    Multimercado: setPredictionMultimercadoData,
    Ações: setPredictionAcoesData,
  };
  const encodedParam = encodeURIComponent(cnpj || "");
  const newRegistration = await selRegistration(
    encodedParam,
    controlForm,
    setControlForm
  );

  setRegistration(newRegistration);

  try {
    let okClassificacoes = false;

    classificacoes.forEach(async (currClass) => {
      const encodedClassificacao = encodeURIComponent(currClass);
      const slicedHistoricData = await getHistoricData(
        encodedClassificacao,
        controlForm,
        mapHistoricSetters[currClass]
      );

      let predictions: PredictionsType[] | false = [];

      if (slicedHistoricData) {
        predictions = await getPredictions(
          encodedClassificacao,
          controlForm,
          mapPredictionSetters[currClass]
        );
      }

      if (predictions && !okClassificacoes) {
        okClassificacoes = true;
      }
    });

    if (!encodedCnpj && okClassificacoes) {
      toast.success("Done.");

      return;
    } else if (!encodedCnpj && !okClassificacoes) {
      toast.error("Something went wrong.");

      return;
    }

    const slicedHistoricData = await getHistoricData(
      encodedCnpj,
      controlForm,
      setHistoricData
    );

    let predictions: PredictionsType[] | false = [];

    if (slicedHistoricData) {
      predictions = await getPredictions(
        encodedCnpj,
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

  setTimeout(() => {
    setCurrSubmitToast("");
  }, 500);
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
  getDataForHistogram,
  getCorrels,
  getRegistration,
  getData,
  getArrCnpjFundName,
};
