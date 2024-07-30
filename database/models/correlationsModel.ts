import { Schema, model, models } from "mongoose";

const CorrelationSchema = new Schema({
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
});

const CorrelationsModel =
  models.correlations_model ||
  model("correlations_model", CorrelationSchema, "HN_correlations");

export default CorrelationsModel;
