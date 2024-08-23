import PredictionsModel from "@/database/models/predictionsModel";
import { DashboardControlFormType, PredictionsType } from "@/utils/types";
import CadastroFundosModel from "../models/cadastroFundosModel";
import { buildPredKey } from "@/functions/functions";

async function getPredictions(controlForm: DashboardControlFormType) {
  const { varCota, varCotistas, varNF, baseDate, buscaCnpj } = controlForm;
  const predKeyAbs = buildPredKey(varCota, varCotistas, varNF, "abs");
  const predKeyPct = buildPredKey(varCota, varCotistas, varNF, "pct");

  try {
    let prediction4weeks: PredictionsType | null = null;
    prediction4weeks = await PredictionsModel.findOne(
      {
        CNPJ_FUNDO: buscaCnpj,
        ancora: new Date(baseDate),
      },
      {
        _id: 0,
        CNPJ_FUNDO: 1,
        CLASSE_ANBIMA: 1,
        [predKeyAbs]: 1,
        [predKeyPct]: 1,
      }
    );

    let finalPred4weeks = prediction4weeks;
    if (prediction4weeks) {
      finalPred4weeks = {
        CNPJ_FUNDO: prediction4weeks.CNPJ_FUNDO,
        CLASSE_ANBIMA: prediction4weeks.CLASSE_ANBIMA,
        CAPTC_LIQ_ABS_ms: prediction4weeks[predKeyAbs],
        CAPTC_LIQ_PCT_ms: prediction4weeks[predKeyPct],
      };
    } else {
      return false;
    }

    return finalPred4weeks;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function getCnpjsByAnbimaClass(anbimaClass: string) {
  try {
    const queryRes = await CadastroFundosModel.distinct("CNPJ_FUNDO", {
      CLASSE_ANBIMA: anbimaClass,
    });

    if (!queryRes) {
      console.log("No anbima class:" + anbimaClass + "found in the database.");
      return false;
    }

    const idArr = queryRes.map((cE) => {
      return cE.CNPJ_FUNDO;
    });

    return idArr;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function getPredsForHistogram(controlForm: DashboardControlFormType) {
  /*
    Prediction of all CNPJs to 4 weeks forward. Prediction of the selected CNPJ are based on params (controlForm),
      others default (zero), to build histogram
  */

  const { varCota, varCotistas, varNF, anbimaClass, baseDate, buscaCnpj } =
    controlForm;
  const customPredKeyAbs = buildPredKey(varCota, varCotistas, varNF, "abs");
  const defaultPredKeyAbs = "abs_BRL__0_0__0_0__0_0";
  const customPredKeyPct = buildPredKey(varCota, varCotistas, varNF, "pct");
  const defaultPredKeyPct = "pct_PL__0_0__0_0__0_0";

  // Erro se não tiver classe anbima
  if (!anbimaClass) {
    console.log("There is no anbima class.");
    return false;
  }
  // Fim: Erro se não tiver classe anbima

  try {
    let prediction4weeks: PredictionsType[] | null = null;

    const projection = {
      CNPJ_FUNDO: 1,
      CLASSE_ANBIMA: 1,
      [customPredKeyAbs]: 1,
      [defaultPredKeyAbs]: 1,
      [customPredKeyPct]: 1,
      [defaultPredKeyPct]: 1,
    };

    console.log("ancora buscada em Histograma (baseDate)");
    console.log(baseDate);

    prediction4weeks = await PredictionsModel.find(
      {
        CLASSE_ANBIMA: anbimaClass,
        ancora: new Date(baseDate),
      },
      projection
    );

    if (!prediction4weeks) {
      return false;
    }

    const finalPred4weeks = prediction4weeks.map((cE) => {
      let predKeyAbs;
      let predKeyPct;

      if (cE.CNPJ_FUNDO === buscaCnpj) {
        predKeyAbs = customPredKeyAbs;
        predKeyPct = customPredKeyPct;
      } else {
        predKeyAbs = defaultPredKeyAbs;
        predKeyPct = defaultPredKeyPct;
      }

      return {
        CNPJ_FUNDO: cE.CNPJ_FUNDO,
        CAPTC_LIQ_ABS_ms: cE[predKeyAbs],
        CAPTC_LIQ_PCT_ms: cE[predKeyPct],
        CLASSE_ANBIMA: cE.CLASSE_ANBIMA,
      };
    });

    return finalPred4weeks;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function getAncoras() {
  const ancoras = await PredictionsModel.distinct("ancora");
  return ancoras;
}

async function getCalcDatesPred() {
  const datahoraPredicao = await PredictionsModel.distinct("datahora_predicao");
  return datahoraPredicao;
}

export {
  getPredictions,
  getPredsForHistogram,
  getCnpjsByAnbimaClass,
  getCalcDatesPred,
  getAncoras,
};
