import { Schema, model, models } from "mongoose";

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

const HistoricModel = models.historic || model("historic", HistoricSchema);

export default HistoricModel;
