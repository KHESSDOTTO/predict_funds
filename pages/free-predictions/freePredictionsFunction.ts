import { classificacoes } from "@/utils/globalVars";
import {
  AggregateChartsDataType,
  FetchDataParamsType,
  FetchHistPredsParamsType,
} from "./types/predictionsPageTypes";
import { ax } from "@/database/axios.config";
import { consoleLog } from "@/utils/functions/genericFunctions";

async function fetchData({
  controlForm,
  chartsData,
  setChartsData,
}: FetchDataParamsType): Promise<boolean> {
  const newChartsData = { ...chartsData };

  try {
    classificacoes.forEach(async (cE) => {
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
    });

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

  try {
    const historicResponse = await ax.get(
      `/historic/getAllByCnpj?cnpj=${dataKey}&baseDate=${controlForm.baseDate}`
    );
    const historic = historicResponse.data;

    consoleLog({ historic });

    dataObj[dataKey]["historic"] = historic;
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
    const prediction = predictionResponse.data;

    consoleLog({ prediction });

    dataObj[dataKey]["prediction"] = prediction;
  } catch (err) {
    console.error(err);
  }

  return dataObj;
}

export { fetchData };
