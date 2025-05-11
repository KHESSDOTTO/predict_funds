import { Document, Model } from "mongoose";

// interface for the actual original document in the collection (_doc property)
export interface HistoricDocType_doc {
  DT_COMPTC: Date;
  CNPJ_FUNDO: string;
  VL_QUOTA_ms: number;
  VL_TOTAL_ms: number;
  CAPTC_DIA_ms: number;
  NR_COTST_ms: number;
  VL_PATRIM_LIQ_ms: number;
  RESG_DIA_ms: number;
  CAPTC_LIQ_ms: number;
  datahora_proc_informes?: Date;
  updated_at?: Date;
}

// Interface to add custom instance methods and properties
export interface HistoricDocType extends Document, HistoricDocType_doc {
  _doc: HistoricDocType_doc;
}

// Interface to add custom static methods
export interface HistoricModelType extends Model<HistoricDocType> {
  getHistoricByCnpj(
    cnpj: string,
    baseDate: Date,
    weeksBack?: number
  ): Promise<HistoricDocType[] | false>;
}

// Interfaces of query returns
export interface DatahoraQueryDoc {
  _doc: { datahora_proc_informes: Date };
}
