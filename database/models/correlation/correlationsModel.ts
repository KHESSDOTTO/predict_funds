import { Schema, model, models } from "mongoose";
import {
  CorrelationsDocType,
  CorrelationsModelType,
  CorrelationsDocCorrelsQuery,
} from "./correlationsType";

const CorrelationSchema = new Schema<
  CorrelationsDocType,
  CorrelationsModelType
>({
  CNPJ_FUNDO: { type: String, required: true, trim: true, unique: false },
  CLF: { type: Number, required: false, unique: false },
  EURBRLX: { type: Number, required: false, unique: false },
  GOLD11SA: { type: Number, required: false, unique: false },
  USDBRLX: { type: Number, required: false, unique: false },
  BVSP: { type: Number, required: false, unique: false },
  GSPC: { type: Number, required: false, unique: false },
  TNX: { type: Number, required: false, unique: false },
  DIxpre252dc30: { type: Number, required: false, unique: false },
  DIxpre252dc360: { type: Number, required: false, unique: false },
  ancora: { type: Date, required: true, unique: false },
  data_calc_correlacao: {
    type: Date,
    required: true,
    unique: false,
  },
  janela_em_meses: {
    type: Number,
    required: true,
    unique: false,
  },
  Classificacao: {
    type: String,
    required: true,
    unique: false,
  },
});

CorrelationSchema.statics.getMostRecentCorrelsByCnpj = async function (
  cnpj: string
): Promise<any> {
  const mostRecentCorrelations = [];
  const correlPeriods = [6, 12];

  try {
    for (const correlPeriod of correlPeriods) {
      const lastCorrels = await CorrelationsModel.findOne(
        {
          CNPJ_FUNDO: cnpj,
          janela_em_meses: correlPeriod,
        },
        {
          _id: 0,
          CNPJ_FUNDO: 0,
          ancora: 0,
          data_calc_correlacao: 0,
        }
      )
        .sort({ data_calc_correlacao: -1 })
        .exec();

      mostRecentCorrelations.push(lastCorrels);
    }

    return mostRecentCorrelations;
  } catch (err) {
    console.log(err);
    return [];
  }
};

CorrelationSchema.statics.getAvgMostRecentCorrelsByClassificacao =
  async function (classificacao: string): Promise<any> {
    try {
      const correlPeriods = [6, 12];
      const correlFields = [
        "CLF",
        "EURBRLX",
        "GOLD11SA",
        "USDBRLX",
        "BVSP",
        "GSPC",
        "TNX",
        "DIxpre252dc30",
        "DIxpre252dc360",
      ] as (keyof CorrelationsDocCorrelsQuery)[];
      const results: any[] = [];

      for (const correlPeriod of correlPeriods) {
        const lastCorrel = await CorrelationsModel.findOne(
          {
            Classificacao: classificacao,
            janela_em_meses: correlPeriod,
          },
          {
            _id: 0,
            CNPJ_FUNDO: 0,
            ancora: 0,
          }
        )
          .sort({ data_calc_correlacao: -1 })
          .exec();

        if (!lastCorrel) continue; // Skip if no correlation found

        const lastBaseDate = lastCorrel.data_calc_correlacao;

        // Find all correlations with the same base date
        const correls =
          ((await CorrelationsModel.find(
            {
              Classificacao: classificacao,
              janela_em_meses: correlPeriod,
              data_calc_correlacao: lastBaseDate,
            },
            {
              _id: 0,
              CNPJ_FUNDO: 0,
              ancora: 0,
              janela_em_meses: 0,
              data_calc_correlacao: 0,
              Classificacao: 0,
            }
          ).exec()) as CorrelationsDocCorrelsQuery[]) || null;

        const averages: { [field: string]: any } = {};

        // Calculate the averages for each field
        for (const field of correlFields) {
          const sum = correls.reduce((acc, doc) => acc + doc[field], 0);
          averages[field] = sum / correls.length;
        }

        // Push the result for this period into the results array
        results.push({
          ...averages,
          janela_em_meses: correlPeriod,
          Classificacao: classificacao,
        });
      }

      return results;
    } catch (err) {
      console.log(err);
      
      return [];
    }
  };

const CorrelationsModel =
  (models.correlations_model as CorrelationsModelType) ||
  model<CorrelationsDocType, CorrelationsModelType>(
    "correlations",
    CorrelationSchema,
    "HN_correlations_cvm175"
  );

export default CorrelationsModel;
