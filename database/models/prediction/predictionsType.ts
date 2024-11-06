import { Document, Model } from "mongoose";
import { DashboardControlFormType, PredictionsType } from "@/utils/types/generalTypes/types";

// Interface of original document on collection
export interface PredictionDocType_doc {
  DT_COMPTC: Date;
  CNPJ_FUNDO: string;
  [key: string]: string | number | Date;
}

// Interface of mongoose document, here is defined custom properties, original document _doc and custom instance methods
export interface PredictionDocType extends Document, PredictionsType {
  CNPJ_FUNDO: string;
  _doc: PredictionDocType_doc;
}

// Interface for the Model, insert custom static methods here
export interface PredictionModelType extends Model<PredictionDocType> {
  getPredictions(
    controlForm: DashboardControlFormType
  ): Promise<false | PredictionsType>;
  getPredsForHistogram(
    controlForm: DashboardControlFormType
  ): Promise<false | PredForHistogramType[]>;
  getAncoras(): Promise<Date[]>;
  getCalcDatesPred(): Promise<Date[]>;
}

// Interfaces for return values of methods of the class/model
interface PredForHistogramType {
  CNPJ_FUNDO: string;
  CAPTC_LIQ_ABS_ms: string | number | Date | number[] | null | undefined;
  CAPTC_LIQ_PCT_ms: string | number | Date | number[] | null | undefined;
  CLASSE_ANBIMA: string | number | number[] | Date | null | undefined;
}
