import { DashboardControlFormType, PredictionsType } from "@/utils/types/generalTypes/types";
import { Schema, model, models } from "mongoose";
import { buildPredKey } from "@/utils/functions/genericFunctions";
import { PredictionDocType, PredictionModelType } from "./predictionsType";

const PredictionSchema = new Schema(
  {
    CNPJ_FUNDO: { type: String, required: true, trim: true, unique: false },
    ancora: { type: Date, required: true, unique: false },
    datahora_predicao: {
      type: Date,
      required: true,
      unique: false,
    },
    notes: { type: String, required: true, trim: true, unique: false },
  },
  { strict: false, timestamps: true }
);

PredictionSchema.statics.getPredictions = async function (
  controlForm: DashboardControlFormType
) {
  const { varCota, varCotistas, varNF, baseDate, buscaCnpj, weeksAhead } =
    controlForm;
  const predKeyAbs = buildPredKey(varCota, varCotistas, varNF, "abs");
  const predKeyPct = buildPredKey(varCota, varCotistas, varNF, "pct");

  try {
    let prediction: PredictionDocType | null = null;
    prediction = await PredictionsModel.findOne(
      {
        CNPJ_FUNDO: buscaCnpj,
        ancora: new Date(baseDate),
        weeks_ahead: weeksAhead,
      },
      {
        _id: 0,
        CNPJ_FUNDO: 1,
        CLASSE_ANBIMA: 1,
        [predKeyAbs]: 1,
        [predKeyPct]: 1,
        CI90: 1,
        CI95: 1,
        CI99: 1,
      }
    )
      .sort({ datahora_predicao: -1 })
      .lean()
      .exec();

    for (const key in prediction) {
      if (prediction && key.slice(0, 2) === "CI") {
        const CI_ABS = prediction[key] as number;
        const CAPTC_ABS = prediction[
          predKeyAbs as keyof PredictionDocType
        ] as number;
        const CAPTC_PCT_TIMES100 = prediction[
          predKeyPct as keyof PredictionDocType
        ] as number;
        const CAPTC_PCT = CAPTC_PCT_TIMES100 / 100;
        const PL = CAPTC_ABS / CAPTC_PCT;

        prediction[`${key}_PCT`] = (CI_ABS / PL) * 100;
      }
    }

    let finalPred: PredictionsType | null;
    if (prediction) {
      finalPred = { ...prediction };
    } else {
      finalPred = prediction;
    }

    if (prediction) {
      finalPred = {
        CNPJ_FUNDO: prediction.CNPJ_FUNDO,
        CLASSE_ANBIMA: prediction.CLASSE_ANBIMA,
        CAPTC_LIQ_ABS_ms: prediction[predKeyAbs],
        CAPTC_LIQ_PCT_ms: prediction[predKeyPct],
        CI90_ABS: prediction.CI90,
        CI95_ABS: prediction.CI95,
        CI99_ABS: prediction.CI99,
        CI90_PCT: prediction.CI90_PCT as number,
        CI95_PCT: prediction.CI95_PCT as number,
        CI99_PCT: prediction.CI99_PCT as number,
        CI90_ABS_limits: [
          (prediction[predKeyAbs] as number) - prediction.CI90,
          (prediction[predKeyAbs] as number) + prediction.CI90,
        ],
        CI95_ABS_limits: [
          (prediction[predKeyAbs] as number) - prediction.CI95,
          (prediction[predKeyAbs] as number) + prediction.CI95,
        ],
        CI99_ABS_limits: [
          (prediction[predKeyAbs] as number) - prediction.CI99,
          (prediction[predKeyAbs] as number) + prediction.CI99,
        ],
        CI90_PCT_limits: [
          (prediction[predKeyPct] as number) - (prediction.CI90_PCT as number),
          (prediction[predKeyPct] as number) + (prediction.CI90_PCT as number),
        ],
        CI95_PCT_limits: [
          (prediction[predKeyPct] as number) - (prediction.CI95_PCT as number),
          (prediction[predKeyPct] as number) + (prediction.CI95_PCT as number),
        ],
        CI99_PCT_limits: [
          (prediction[predKeyPct] as number) - (prediction.CI99_PCT as number),
          (prediction[predKeyPct] as number) + (prediction.CI99_PCT as number),
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
};

PredictionSchema.statics.getPredsForHistogram = async function (
  controlForm: DashboardControlFormType
) {
  /*
    Prediction of all CNPJs to 4 weeks forward. Prediction of the selected CNPJ are based on params (controlForm),
      others default (zero), to build histogram
  */

  const {
    varCota,
    varCotistas,
    varNF,
    baseDate,
    buscaCnpj,
    weeksAhead,
  } = controlForm;
  const customPredKeyAbs = buildPredKey(varCota, varCotistas, varNF, "abs");
  const defaultPredKeyAbs = "abs_BRL__0_0__0_0__0_0";
  const customPredKeyPct = buildPredKey(varCota, varCotistas, varNF, "pct");
  const defaultPredKeyPct = "pct_PL__0_0__0_0__0_0";

  try {
    let predictions: PredictionsType[] | null = null;

    const projection = {
      CNPJ_FUNDO: 1,
      CLASSE_ANBIMA: 1,
      vol_252: 1,
      VL_PATRIM_LIQ: 1,
      NR_COTST: 1,
      QT_DIA_CONVERSAO_COTA: 1,
      QT_DIA_PAGTO_RESGATE: 1,
      [customPredKeyAbs]: 1,
      [defaultPredKeyAbs]: 1,
      [customPredKeyPct]: 1,
      [defaultPredKeyPct]: 1,
    };

    predictions = await PredictionsModel.find(
      {
        ancora: new Date(baseDate),
        weeks_ahead: weeksAhead,
      },
      projection
    );

    if (!predictions) {
      return false;
    }

    const finalPredictions = predictions.map((cE) => {
      let predKeyAbs;
      let predKeyPct;
      let newElement;

      if (cE.CNPJ_FUNDO === buscaCnpj) {
        predKeyAbs = customPredKeyAbs;
        predKeyPct = customPredKeyPct;
        newElement = {
          CNPJ_FUNDO: cE['CNPJ_FUNDO'],
          CLASSE_ANBIMA: cE['CLASSE_ANBIMA'],
          vol_252: cE['vol_252'],
          VL_PATRIM_LIQ: cE['VL_PATRIM_LIQ'],
          NR_COTST: cE['NR_COTST'],
          QT_DIA_CONVERSAO_COTA: cE['QT_DIA_CONVERSAO_COTA'],
          QT_DIA_PAGTO_RESGATE: cE['QT_DIA_PAGTO_RESGATE'],
          CAPTC_LIQ_ABS_ms: cE[predKeyAbs],
          CAPTC_LIQ_PCT_ms: cE[predKeyPct],
        }
      } else {
        predKeyAbs = defaultPredKeyAbs;
        predKeyPct = defaultPredKeyPct;
        newElement = {
          CNPJ_FUNDO: "",
          CLASSE_ANBIMA: cE['CLASSE_ANBIMA'],
          vol_252: cE['vol_252'],
          VL_PATRIM_LIQ: cE['VL_PATRIM_LIQ'],
          NR_COTST: cE['NR_COTST'],
          QT_DIA_CONVERSAO_COTA: cE['QT_DIA_CONVERSAO_COTA'],
          QT_DIA_PAGTO_RESGATE: cE['QT_DIA_PAGTO_RESGATE'],
          CAPTC_LIQ_ABS_ms: cE[predKeyAbs],
          CAPTC_LIQ_PCT_ms: cE[predKeyPct],
        }
      }

      return newElement;
    });

    return finalPredictions;
  } catch (err) {
    console.log(err);

    return false;
  }
};

PredictionSchema.statics.getAncoras = async function () {
  const ancoras: Date[] = await PredictionsModel.distinct("ancora");
  return ancoras;
};

PredictionSchema.statics.getCalcDatesPred = async function () {
  const datahoraPredicao: Date[] = await PredictionsModel.distinct(
    "datahora_predicao"
  );
  return datahoraPredicao;
};

const PredictionsModel =
  (models.predictions as PredictionModelType) ||
  model<PredictionDocType, PredictionModelType>(
    "predictions",
    PredictionSchema,
    "HN_predictions"
  );

export default PredictionsModel;
