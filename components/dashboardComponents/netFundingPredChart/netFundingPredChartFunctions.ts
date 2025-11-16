import { AdjustNetFundingChartAxisParamsType } from "./netFundingPredChartTypes";
import AxisFunctions from "@/utils/functions/axisFunctions/axisFunctions";
import type {
  ExportNetFundingPredParams,
  PrepareChartNFDataParamsType,
} from "./netFundingPredChartTypes";
import { consoleLog } from "@/utils/functions/genericFunctions";
import * as XLSX from "xlsx";
import {
  HistoricType,
  PredictionsType,
} from "@/utils/types/generalTypes/types";

function adjustNetFundingChartAxis({
  historic,
  absOrPct,
  predictions,
  setDomainYaxisNF,
  setTicksYaxisNF,
}: AdjustNetFundingChartAxisParamsType) {
  const isPct = absOrPct === "CAPTC_LIQ_PCT_ms";

  // Defining values for domain/axis in Net Funding Chart
  // Max absolute value in historic
  let maxModValueNF = Math.abs(
    historic.reduce((maxAbsObj, currObj) => {
      return Math.abs(currObj[absOrPct] ?? 0) >
        (maxAbsObj[absOrPct] ? Math.abs(maxAbsObj[absOrPct]) : 0)
        ? currObj
        : maxAbsObj;
    }, historic[0])[absOrPct] || 0
  );

  // Value of prediction to compare with highest absolute value of historic.
  const modValuePred = predictions[0][absOrPct]
    ? Math.abs(Number(predictions[0][absOrPct]))
    : 0;

  if (maxModValueNF) {
    // Defyning domain.
    maxModValueNF =
      modValuePred > maxModValueNF
        ? Number(Math.abs(modValuePred).toFixed(2))
        : Number(Math.abs(maxModValueNF).toFixed(2));

    const newDomain = AxisFunctions.generateYaxisDomainBasedOnMaxMod(maxModValueNF, isPct);

    if (newDomain) {
      setDomainYaxisNF(newDomain);
    }

    const newYaxisNFTicks = AxisFunctions.generateYaxisTicksBasedOnDomain(newDomain);

    if (newYaxisNFTicks) {
      setTicksYaxisNF(newYaxisNFTicks);
    }

    return true;
  }

  return false;
}

function prepareChartNFData({
  historic,
  predictions,
  setUnifiedNFData,
  setGradientOffset,
}: PrepareChartNFDataParamsType) {
  // Unifying data
  const newUnifiedNFData = [...historic, ...predictions];
  const newGradientOffset =
    (newUnifiedNFData.length - predictions.length) /
    (newUnifiedNFData.length - 1);
  setUnifiedNFData(newUnifiedNFData);
  setGradientOffset(newGradientOffset);
}

function exportNetFundingPred({
  historic,
  predictions,
}: ExportNetFundingPredParams) {
  const historicIsValid = Array.isArray(historic) && historic.length > 0;
  const predictionsIsValid =
    Array.isArray(predictions) && predictions.length > 0;

  if (!historicIsValid || !predictionsIsValid) {
    consoleLog({ historicIsValid });
    consoleLog({ predictionsIsValid });

    return;
  }

  const workbook = XLSX.utils.book_new();
  const currTime = new Date();
  const selCnpj = historic[0]["CNPJ_FUNDO"];
  const fileName = `export_prediction_${selCnpj.replaceAll(
    "/",
    "."
  )}_${currTime.toISOString()}.xlsx`;
  const predsData = predsToExport(predictions);
  const historicData = historicToExport(historic);

  const sheetData: (string | number)[][] = [];

  sheetData.push(
    ["Predictions"],
    ...predsData,
    [],
    ["Historic"],
    ...historicData
  );

  const sheet = XLSX.utils.aoa_to_sheet(sheetData);

  XLSX.utils.book_append_sheet(
    workbook,
    sheet,
    `preds_${selCnpj.replaceAll("/", ".")}`
  );
  XLSX.writeFile(workbook, fileName);

  return;
}

function predsToExport(predictions: PredictionsType[]) {
  const isValidPreds = Array.isArray(predictions) && predictions.length > 0;

  if (!isValidPreds) {
    consoleLog({ isValidPreds });

    return [[]];
  }

  const formattedPreds: (string | number)[][] = [];

  predictions.forEach((cE, cI) => {
    const cleanedEl = { ...cE };
    const regex = /^(CAPTC|CI|DT_COMPTC)/;

    for (let key of Object.keys(cE)) {
      if (!key.match(regex)) {
        delete cleanedEl[key];
      }
    }

    if (cI === 0) {
      formattedPreds.push(Object.keys(cleanedEl));
    }

    const adjustedVals = Object.values(cleanedEl).map((cE) => {
      if (Array.isArray(cE)) {
        return cE.toString();
      } else {
        return cE;
      }
    });

    formattedPreds.push(adjustedVals);
  });

  return formattedPreds;
}

function historicToExport(historic: HistoricType[]) {
  const isValidHistoric = Array.isArray(historic) && historic.length > 0;

  if (!isValidHistoric) {
    consoleLog({ isValidHistoric });

    return [[]];
  }

  const formattedHistoric: (string | number)[][] = [];

  historic.forEach((cE, cI) => {
    const cleanedEl = { ...cE } as HistoricType;

    delete cleanedEl["_id"];
    delete cleanedEl["datahora_proc_informes"];
    delete cleanedEl["updated_at"];

    if (cI === 0) {
      formattedHistoric.push(Object.keys(cleanedEl));
    }

    formattedHistoric.push(Object.values(cleanedEl));
  });

  return formattedHistoric;
}

function yAxisTickFormats(num: number, absOrPct: "abs" | "pct") {
  const absNum = Math.abs(num);
  const numPct = num.toFixed(2) + "%";
  let numAbsPre = "R$";
  let numAbsDivisor = 1000;
  let numAbsPos = " k";
  let decimal = 0;

  if (absNum > 10 ** 9) {
    numAbsDivisor = 10 ** 9;
    decimal = 1;
    numAbsPos = " bln";
  } else if (absNum > 10 ** 6) {
    numAbsDivisor = 10 ** 6;
    decimal = 0;
    numAbsPos = " mln";
  } else if (absNum === 0) {
    numAbsPre = "R$ ";
    numAbsPos = "";
  }

  const numAbs =
    numAbsPre + String((num / numAbsDivisor).toFixed(decimal)) + numAbsPos;
  const ticks = { pct: numPct, abs: numAbs };

  return ticks[absOrPct];
}

export {
  adjustNetFundingChartAxis,
  prepareChartNFData,
  exportNetFundingPred,
  yAxisTickFormats,
};
