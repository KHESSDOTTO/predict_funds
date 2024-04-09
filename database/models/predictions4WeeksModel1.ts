import { PredictionsType } from "@/utils/types";
import { Schema, model, models } from "mongoose";

const Prediction4Weeks1Schema = new Schema<PredictionsType>(
  {
    CNPJ_FUNDO: { type: String, required: true, trim: true, unique: false },
  },
  { strict: false, timestamps: true }
);

const Predictions4Weeks1Model =
  models.predictions_4weeks1 ||
  model("predictions_4weeks1", Prediction4Weeks1Schema, "predictions_4weeks1");

export default Predictions4Weeks1Model;
