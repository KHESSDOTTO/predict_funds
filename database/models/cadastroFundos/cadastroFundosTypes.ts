import { Document, Model } from "mongoose";

// Interface for the original document, like it is on the collection (_doc property)
interface CadastroFundosDocType_doc {
  CNPJ_Fundo: string;
  TP_FUNDO: string;
  DENOM_SOCIAL: string;
  DT_REG: string;
  DT_CONST: string;
  CD_CVM: number;
  DT_CANCEL: string;
  SIT: string;
  DT_INI_SIT: string;
  DT_INI_ATIV: string;
  DT_INI_EXERC: string;
  DT_FIM_EXERC: string;
  CLASSE: string;
  DT_INI_CLASSE: string;
  RENTAB_FUNDO: string;
  CONDOM: string;
  FUNDO_COTAS: string;
  FUNDO_EXCLUSIVO: string;
  TRIB_LPRAZO: string;
  PUBLICO_ALVO: string;
  ENTID_INVEST: string;
  TAXA_PERFM: number;
  INF_TAXA_PERFM: string;
  TAXA_ADM: number;
  INF_TAXA_ADM: string;
  VL_PATRIM_LIQ: number;
  DT_PATRIM_LIQ: string;
  DIRETOR: string;
  CNPJ_ADMIN: string;
  ADMIN: string;
  PF_PJ_GESTOR: string;
  CPF_CNPJ_GESTOR: string;
  GESTOR: string;
  CNPJ_AUDITOR: string;
  AUDITOR: string;
  CNPJ_CUSTODIANTE: string;
  CUSTODIANTE: string;
  CNPJ_CONTROLADOR: string;
  CONTROLADOR: string;
  INVEST_CEMPR_EXTER: string;
  Classificacao: string;
}

// Interface for the document, in here should go the custom instance methods and properties
interface CadastroFundosDocType extends Document, CadastroFundosDocType_doc {
  _doc: CadastroFundosDocType_doc;
}

// Interface for the model itself, in here, should be included the static methods
interface CadastroFundosModelType extends Model<CadastroFundosDocType> {
  getCadastroByCnpj(cnpj: string): Promise<CadastroFundosDocType | null>;
  getAnbimaClassByCnpj(cnpj: string): Promise<string | false>;
  getArrCnpjName(cnpjs: string[]): Promise<Array<ArrCnpjNameType> | false>; // THIS SHOULD BE AN INSTANCE METHOD
}

interface ArrCnpjNameType {
  CNPJ_FUNDO: string;
  DENOM_SOCIAL: string;
}

export type {
  CadastroFundosDocType_doc,
  CadastroFundosDocType,
  CadastroFundosModelType,
  ArrCnpjNameType,
};
