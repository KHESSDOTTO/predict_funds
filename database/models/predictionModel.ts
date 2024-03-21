import { Schema, model, models } from "mongoose";

const PredictionSchema = new Schema(
  {
    CNPJ_FUNDO: { type: String, required: true, trim: true, unique: false },
    "-5.0": { type: Number, required: false, trim: true, unique: false },
    "-4.5": { type: Number, required: false, trim: true, unique: false },
    "-4.0": { type: Number, required: false, trim: true, unique: false },
    "-3.5": { type: Number, required: false, trim: true, unique: false },
    "-3.0": { type: Number, required: false, trim: true, unique: false },
    "-2.5": { type: Number, required: false, trim: true, unique: false },
    "-2.0": { type: Number, required: false, trim: true, unique: false },
    "-1.5": { type: Number, required: false, trim: true, unique: false },
    "-1.0": { type: Number, required: false, trim: true, unique: false },
    "-0.5": { type: Number, required: false, trim: true, unique: false },
    "0.0": { type: Number, required: false, trim: true, unique: false },
    "0.5": { type: Number, required: false, trim: true, unique: false },
    "1.0": { type: Number, required: false, trim: true, unique: false },
    "1.5": { type: Number, required: false, trim: true, unique: false },
    "2.0": { type: Number, required: false, trim: true, unique: false },
    "2.5": { type: Number, required: false, trim: true, unique: false },
    "3.0": { type: Number, required: false, trim: true, unique: false },
    "3.5": { type: Number, required: false, trim: true, unique: false },
    "4.0": { type: Number, required: false, trim: true, unique: false },
    "4.5": { type: Number, required: false, trim: true, unique: false },
    "5.0": { type: Number, required: false, trim: true, unique: false },
  },
  { timestamps: true }
);

const PredictionModel =
  models.Prediction || model("Prediction", PredictionSchema);

export default PredictionModel;
