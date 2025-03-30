import {
  DashboardControlFormType,
  PredictionsType,
} from "@/utils/types/generalTypes/types";
import { Schema, model, models } from "mongoose";
import {
  PredictionDocType,
  PredictionModelType,
  RawHistogramData,
} from "./predictionsType";
import { consoleLog } from "@/utils/functions/genericFunctions";

const PredictionSchema = new Schema<PredictionDocType, PredictionModelType>(
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
  const { baseDate, buscaCnpj, weeksAhead } = controlForm;
  const predKeyAbs = "abs_BRL__0_0__0_0__0_0";
  const predKeyPct = "pct_BRL__0_0__0_0__0_0";

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
        Classificacao: 1,
        [predKeyAbs]: 1,
        [predKeyPct]: 1,
        CI90: 1,
        CI95: 1,
        CI99: 1,
        mean: 1,
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
        Classificacao: prediction.Classificacao,
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
        mean: prediction["mean"], // Average deviation from the last predictions
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
): Promise<RawHistogramData[]> {
  /*
    Prediction of all CNPJs for the selected period.
  */

  const { baseDate, buscaCnpj, weeksAhead } = controlForm;
  const predKeyAbs = "abs_BRL__0_0__0_0__0_0";
  const predKeyPct = "pct_PL__0_0__0_0__0_0";

  try {
    let predictions: PredictionsType[] | null = null;

    const projection = {
      CNPJ_FUNDO: 1,
      Classificacao: 1,
      vol_252: 1,
      VL_PATRIM_LIQ: 1,
      NR_COTST: 1,
      QT_DIA_CONVERSAO_COTA: 1,
      QT_DIA_PAGTO_RESGATE: 1,
      [predKeyAbs]: 1,
      [predKeyPct]: 1,
    };

    predictions = await PredictionsModel.find(
      {
        ancora: new Date(baseDate),
        weeks_ahead: weeksAhead,
      },
      projection
    );

    if (!predictions) {
      return [];
    }

    const finalPredictions = predictions.map((cE) => {
      let newElement;

      if (cE.CNPJ_FUNDO === buscaCnpj) {
        newElement = {
          CNPJ_FUNDO: cE["CNPJ_FUNDO"],
          Classificacao: cE["Classificacao"],
          vol_252: cE["vol_252"],
          VL_PATRIM_LIQ: cE["VL_PATRIM_LIQ"],
          NR_COTST: cE["NR_COTST"],
          QT_DIA_CONVERSAO_COTA: cE["QT_DIA_CONVERSAO_COTA"],
          QT_DIA_PAGTO_RESGATE: cE["QT_DIA_PAGTO_RESGATE"],
          CAPTC_LIQ_ABS_ms: cE[predKeyAbs],
          CAPTC_LIQ_PCT_ms: cE[predKeyPct],
        };
      } else {
        newElement = {
          CNPJ_FUNDO: "",
          Classificacao: cE["Classificacao"],
          vol_252: cE["vol_252"],
          VL_PATRIM_LIQ: cE["VL_PATRIM_LIQ"],
          NR_COTST: cE["NR_COTST"],
          QT_DIA_CONVERSAO_COTA: cE["QT_DIA_CONVERSAO_COTA"],
          QT_DIA_PAGTO_RESGATE: cE["QT_DIA_PAGTO_RESGATE"],
          CAPTC_LIQ_ABS_ms: cE[predKeyAbs],
          CAPTC_LIQ_PCT_ms: cE[predKeyPct],
        };
      }

      return newElement;
    });

    return finalPredictions;
  } catch (err) {
    console.log(err);

    return [];
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
    "HN_predictions_cvm175"
  );

export default PredictionsModel;
