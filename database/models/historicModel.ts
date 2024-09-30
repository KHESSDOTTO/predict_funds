import { Schema, model, models, Model } from "mongoose";
import { consoleLog } from "@/functions/functions";

// interface for the actual original document in the collection (_doc property)
interface HistoricDocType_doc {
  DT_COMPTC: Date;
  CNPJ_FUNDO: string;
  VL_QUOTA_ms: number;
  VL_TOTAL_ms: number;
  CAPTC_DIA_ms: number;
  NR_COTST_ms: number;
  VL_PATRIM_LIQ_ms: number;
  RESG_DIA_ms: number;
  CAPTC_LIQ_ms: number;
}

// Interface to add custom instance methods and properties
interface HistoricDocType extends Document {
  _doc: HistoricDocType_doc;
}

// Interface to add custom static methods
interface HistoricModelType extends Model<HistoricDocType> {
  getAllHistoricByCnpj(cnpj: string, baseDate: Date): Promise<any[] | false>;
}

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
  console.log("Running getAllHistoricById");
  try {
    console.log("Inside try block");
    const lastUpdateDateDoc = (await HistoricModel.findOne(
      {},
      {
        _id: 0,
        datahora_proc_informes: 1,
      }
    )
      .sort({ datahora_proc_informes: -1 })
      .exec()) as { _doc: { datahora_proc_informes: Date } } | null;
    console.log("After first query");

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

    consoleLog({ allHistoric });

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
