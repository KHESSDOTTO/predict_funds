import { PredictionsType } from "@/utils/types";
import { Schema, model, models } from "mongoose";

const Prediction4Weeks2Schema = new Schema<PredictionsType>(
  {
    CNPJ_FUNDO: { type: String, required: true, trim: true, unique: false },
  },
  { strict: false, timestamps: true }
);

const Predictions4Weeks2Model =
  models.predictions_4weeks2 ||
  model("predictions_4weeks2", Prediction4Weeks2Schema, "predictions_4weeks2");

export default Predictions4Weeks2Model;
