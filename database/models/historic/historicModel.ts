import { Schema, model, models } from "mongoose";
import {
  HistoricDocType_doc,
  HistoricDocType,
  HistoricModelType,
  DatahoraQueryDoc,
} from "./historicType";

const HistoricSchema = new Schema(
  {
    DT_COMPTC: { type: Date, required: true, trim: true, unique: false },
    CNPJ_FUNDO: { type: String, required: true, trim: true, unique: false },
    VL_QUOTA_ms: { type: Number, required: false, unique: false },
    VL_TOTAL_ms: { type: Number, required: false, unique: false },
    CAPTC_DIA_ms: { type: Number, required: false, unique: false },
    NR_COTST_ms: { type: Number, required: false, unique: false },
    VL_PATRIM_LIQ_ms: { type: Number, required: false, unique: false },
    RESG_DIA_ms: { type: Number, required: false, unique: false },
    CAPTC_LIQ_ms: { type: Number, required: false, unique: false },
    datahora_proc_informes: { type: Date, required: true, unique: false },
    updated_at: { type: Date, required: false, unique: false },
  },
  {
    collection: "HN_informes_ms",
    timeseries: {
      timeField: "DT_COMPTC",
      granularity: "hours",
    },
  }
);

HistoricSchema.statics.getAllHistoricByCnpj = async function (
  cnpj: string,
  baseDate: Date
) {
  try {
    const lastUpdateDateDoc = (await HistoricModel.findOne(
      {},
      {
        _id: 0,
        datahora_proc_informes: 1,
      }
    )
      .sort({ datahora_proc_informes: -1 })
      .exec()) as DatahoraQueryDoc | null;

    if (!lastUpdateDateDoc) {
      console.log("Did not find the last update date for historic");
      return false;
    }

    const lastUpdateDate = lastUpdateDateDoc._doc.datahora_proc_informes;

    const allHistoric = await HistoricModel.find({
      CNPJ_FUNDO: cnpj,
      DT_COMPTC: { $lte: baseDate },
      datahora_proc_informes: lastUpdateDate,
    });

    const finalResult = allHistoric.map((cE) => {
      const newDoc: any = { ...cE._doc };
      for (const key in cE._doc) {
        if (key === "CAPTC_LIQ_ms") {
          const newKey = "CAPTC_LIQ_ABS_ms";
          newDoc[newKey] = cE._doc[key];
        } else {
          newDoc[key] = cE._doc[key as keyof HistoricDocType_doc];
        }
      }

      const captcLiqPct =
        (cE._doc["CAPTC_LIQ_ms"] / cE._doc["VL_PATRIM_LIQ_ms"]) * 100;
      newDoc["CAPTC_LIQ_PCT_ms"] = captcLiqPct;

      cE._doc = newDoc;

      return cE;
    });

    return finalResult;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const HistoricModel =
  (models.historic as HistoricModelType) ||
  model<HistoricDocType, HistoricModelType>(
    "historic",
    HistoricSchema,
    "HN_informes_ms"
  );

export default HistoricModel;
