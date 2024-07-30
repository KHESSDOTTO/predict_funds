import { PredictionsType } from "@/utils/types";
import { Schema, model, models } from "mongoose";

const PredictionSchema = new Schema<PredictionsType>(
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

const PredictionsModel =
  models.predictions ||
  model("predictions", PredictionSchema, "HN_predictions");

export default PredictionsModel;
