import { ConfidenceIntervalType } from "@/utils/types";
import { Schema, model, models } from "mongoose";

const ConfidenceIntervalSchema = new Schema<ConfidenceIntervalType>(
  {
    CNPJ_FUNDO: { type: String, required: true, trim: true, unique: false },
    mean: { type: Number, required: true, unique: false },
    std: { type: Number, required: true, unique: false },
    CI90: { type: Number, required: true, unique: false },
    CI95: { type: Number, required: true, unique: false },
    CI99: { type: Number, required: true, unique: false },
    ancora: { type: Date, required: true, unique: false },
    datahora_calc_residual_abs: {
      type: Date,
      required: true,
      unique: false,
    },
  },
  { strict: false, timestamps: true }
);

const ConfidenceIntervalModel =
  models.confidence_interval ||
  model(
    "confidence_interval",
    ConfidenceIntervalSchema,
    "HN_confidence_interval"
  );

export default ConfidenceIntervalModel;
