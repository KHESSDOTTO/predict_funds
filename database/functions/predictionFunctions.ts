import PredictionsModel from "@/database/models/predictionsModel";
import {
  ConfidenceIntervalType,
  DashboardControlFormType,
  PredictionsType,
} from "@/utils/types";
import CadastroFundosModel from "../models/cadastroFundosModel";
import { buildPredKey, consoleLog } from "@/functions/functions";
import ConfidenceIntervalModel from "../models/confidenceIntervalModel";

async function getPredictions(controlForm: DashboardControlFormType) {
  const { varCota, varCotistas, varNF, baseDate, buscaCnpj } = controlForm;
  const predKeyAbs = buildPredKey(varCota, varCotistas, varNF, "abs");
  const predKeyPct = buildPredKey(varCota, varCotistas, varNF, "pct");

  try {
    let prediction: PredictionsType | null = null;
    prediction = await PredictionsModel.findOne(
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
    )
      .sort({ datahora_predicao: -1 })
      .exec();

    const confidenceIntervalDoc: ConfidenceIntervalType =
      await ConfidenceIntervalModel.findOne(
        {
          CNPJ_FUNDO: buscaCnpj,
          ancora: new Date(baseDate),
        },
        {
          CI90: 1,
          CI95: 1,
          CI99: 1,
        }
      )
        .sort({ datahora_calc_residual_abs: -1 })
        .exec();

    // Calculating confidence intervals as % of Net Assets
    // CAPTC_ABS / PL = CAPTC_PCT
    // PL = CAPTC_ABS / CAPTC_PCT
    // (CAPTC_ABS + CIX_ABS) / PL = CIX_PCT
    // CIX_PCT = (CAPTC_ABS + CIX_ABS) * CAPTC_PCT / CAPTC_ABS
    for (const key in confidenceIntervalDoc) {
      if (key.slice(0, 2) === "CI" && prediction) {
        const CI_ABS = confidenceIntervalDoc[key] as number;
        const CAPTC_ABS = prediction[predKeyAbs] as number;
        const CAPTC_PCT_TIMES100 = prediction[predKeyPct] as number;
        const CAPTC_PCT = CAPTC_PCT_TIMES100 / 100;
        const PL = CAPTC_ABS / CAPTC_PCT;

        confidenceIntervalDoc[`${key}_PCT`] = (CI_ABS / PL) * 100;
      }
    }

    let finalPred = prediction;
    if (prediction && confidenceIntervalDoc) {
      finalPred = {
        CNPJ_FUNDO: prediction.CNPJ_FUNDO,
        CLASSE_ANBIMA: prediction.CLASSE_ANBIMA,
        CAPTC_LIQ_ABS_ms: prediction[predKeyAbs],
        CAPTC_LIQ_PCT_ms: prediction[predKeyPct],
        CI90_ABS: confidenceIntervalDoc.CI90,
        CI95_ABS: confidenceIntervalDoc.CI95,
        CI99_ABS: confidenceIntervalDoc.CI99,
        CI90_PCT: confidenceIntervalDoc.CI90_PCT as number,
        CI95_PCT: confidenceIntervalDoc.CI95_PCT as number,
        CI99_PCT: confidenceIntervalDoc.CI99_PCT as number,
        CI90_ABS_limits: [
          (prediction[predKeyAbs] as number) - confidenceIntervalDoc.CI90,
          (prediction[predKeyAbs] as number) + confidenceIntervalDoc.CI90,
        ],
        CI95_ABS_limits: [
          (prediction[predKeyAbs] as number) - confidenceIntervalDoc.CI95,
          (prediction[predKeyAbs] as number) + confidenceIntervalDoc.CI95,
        ],
        CI99_ABS_limits: [
          (prediction[predKeyAbs] as number) - confidenceIntervalDoc.CI99,
          (prediction[predKeyAbs] as number) + confidenceIntervalDoc.CI99,
        ],
        CI90_PCT_limits: [
          (prediction[predKeyPct] as number) -
            (confidenceIntervalDoc.CI90_PCT as number),
          (prediction[predKeyPct] as number) +
            (confidenceIntervalDoc.CI90_PCT as number),
        ],
        CI95_PCT_limits: [
          (prediction[predKeyPct] as number) -
            (confidenceIntervalDoc.CI95_PCT as number),
          (prediction[predKeyPct] as number) +
            (confidenceIntervalDoc.CI95_PCT as number),
        ],
        CI99_PCT_limits: [
          (prediction[predKeyPct] as number) -
            (confidenceIntervalDoc.CI99_PCT as number),
          (prediction[predKeyPct] as number) +
            (confidenceIntervalDoc.CI99_PCT as number),
        ],
      };
    } else {
      return false;
    }

    return finalPred;
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
