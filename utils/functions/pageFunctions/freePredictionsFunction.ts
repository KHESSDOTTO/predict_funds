import Helpers from '@/utils/functions/helpers';
import { ax } from "@/database/axios.config";
import { classificacoes } from "@/utils/globalVars";
import {
  AggregateChartsDataType,
  FetchDataParamsType,
  FetchHistPredsParamsType,
} from "@/utils/types/pageTypes/predictionsPageTypes";
import {
  HistoricType,
  PredictionsType,
} from "@/utils/types/generalTypes/types";
import { subWeeks } from "date-fns";

async function fetchData({
  controlForm,
  chartsData,
  setChartsData,
}: FetchDataParamsType): Promise<boolean> {
  const newChartsData = { ...chartsData };

  try {
    await Promise.all(
      classificacoes.map(async (cE) => {
        await fetchHistoric({
          dataName: cE,
          controlForm,
          dataObj: newChartsData,
        });
        await fetchPredictions({
          dataName: cE,
          controlForm,
          dataObj: newChartsData,
        });
      })
    );

    setChartsData(newChartsData);

    return true;
  } catch (err) {
    console.log(err);

    return false;
  }
}

async function fetchHistoric({
  dataName,
  controlForm,
  dataObj,
}: FetchHistPredsParamsType): Promise<AggregateChartsDataType> {
  const dataKey = dataName as keyof AggregateChartsDataType;
  const { baseDate, weeksBack } = controlForm;

  try {
    const historicResponse = await ax.get(
      `/historic/getByCnpj?cnpj=${dataKey}&baseDate=${baseDate}&weeksBack=${weeksBack}`
    );
    const historic = historicResponse.data;

    if (!historic || historic.length === 0) {
      return dataObj;
    }

    const adjHistoricData: HistoricType[] = historic.map((cE: HistoricType) => {
      const convDate = new Date(cE.DT_COMPTC);

      return { ...cE, DT_COMPTC: convDate };
    });

    adjHistoricData.sort(
      (a, b) => a.DT_COMPTC.getTime() - b.DT_COMPTC.getTime()
    );

    const higherDate = adjHistoricData.reduce((acc: Date, cE) => {
      return cE.DT_COMPTC > acc ? cE.DT_COMPTC : acc;
    }, new Date("2020-01-01T00:00:00Z"));
    const slicedHistoricData = adjHistoricData.filter((cE) => {
      return cE.DT_COMPTC >= subWeeks(higherDate, controlForm.weeksBack);
    });

    dataObj[dataKey]["historic"] = slicedHistoricData;
  } catch (err) {
    console.error(err);
  }

  return dataObj;
}

async function fetchPredictions({
  dataName,
  controlForm,
  dataObj,
}: FetchHistPredsParamsType): Promise<AggregateChartsDataType> {
  const dataKey = dataName as keyof AggregateChartsDataType;

  try {
    const predictionResponse = await ax.post(`/prediction/getWithBaseDate`, {
      ...controlForm,
      buscaCnpj: dataKey,
    });
    const rawPrediction = predictionResponse.data;
    const predictionArr = Helpers.convertDtComptcToDate(
      rawPrediction
    ) as PredictionsType[];

    dataObj[dataKey]["prediction"] = predictionArr;
  } catch (err) {
    console.error(err);
  }

  return dataObj;
}

export { fetchData };
