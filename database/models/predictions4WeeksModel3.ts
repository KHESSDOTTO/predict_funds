import { PredictionsType } from "@/utils/types";
import { Schema, model, models } from "mongoose";

const Prediction4Weeks3Schema = new Schema<PredictionsType>(
  {
    CNPJ_FUNDO: { type: String, required: true, trim: true, unique: false },
  },
  { strict: false, timestamps: true }
);

const Predictions4Weeks3Model =
  models.predictions_4weeks3 ||
  model("predictions_4weeks3", Prediction4Weeks3Schema, "predictions_4weeks3");

export default Predictions4Weeks3Model;
