import { Document, Model } from "mongoose";

// interface for the actual original document in the collection (_doc property)
export interface CorrelationsDocType_doc {
  CNPJ_FUNDO: String;
  CLF: Number;
  EURBRLX: Number;
  GOLD11SA: Number;
  USDBRLX: Number;
  BVSP: Number;
  GSPC: Number;
  TNX: Number;
  DIxpre252dc30: Number;
  DIxpre252dc360: Number;
  ancora: Date;
  data_calc_correlacao: Date;
  janela_em_meses: Number;
  CLASSE_ANBIMA: String;
}

// Interface to add custom instance methods and properties
export interface CorrelationsDocType extends Document, CorrelationsDocType_doc {
  _doc: CorrelationsDocType_doc;
}

// Interface to add custom static methods
export interface CorrelationsModelType extends Model<CorrelationsDocType> {
  getMostRecentCorrelsByCnpj(cnpj: string): Promise<any>;
  getAvgMostRecentCorrelsByAnbimaClass(anbimaClass: string): Promise<any>;
}

// Interfaces for specific queries
export interface CorrelationsDocCorrelsQuery extends Document {
  CLF: Number;
  EURBRLX: Number;
  GOLD11SA: Number;
  USDBRLX: Number;
  BVSP: Number;
  GSPC: Number;
  TNX: Number;
  DIxpre252dc30: Number;
  DIxpre252dc360: Number;
}
