import { Schema, model, models } from "mongoose";

const RawDataSchema = new Schema(
  {
    DT_COMPTC: { type: Date, required: true, trim: true, unique: false },
    CNPJ_FUNDO: { type: String, required: true, trim: true, unique: false },
    VL_QUOTA: { type: Number, required: false, trim: true, unique: false },
    VL_TOTAL: { type: Number, required: false, trim: true, unique: false },
    CAPTC_DIA: { type: Number, required: false, trim: true, unique: false },
    NR_COTST: { type: Number, required: false, trim: true, unique: false },
    TP_FUNDO: { type: String, required: true, trim: true, unique: false },
    VL_PATRIM_LIQ: { type: Number, required: false, trim: true, unique: false },
    RESG_DIA: { type: Number, required: false, trim: true, unique: false },
    CAPTC_LIQ: { type: Number, required: false, trim: true, unique: false },
  },
  {
    collection: "raw_data",
    timeseries: {
      timeField: "DT_COMPTC",
      granularity: "hours",
    },
  }
);

const RawDataModel = models.raw_data || model("raw_data", RawDataSchema);

export default RawDataModel;
