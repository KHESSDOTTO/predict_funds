import { Document, Model } from "mongoose";

// Interface for the original document, like it is on the collection (_doc property)
interface CadastroFundosDocType_doc {
  ID_Registro_Fundo: number;
  CNPJ_Fundo: string;
  Codigo_CVM: number;
  Tipo_Fundo: string;
  Denominacao_Social_F: string;
  Situacao_F: string;
  ID_Registro_Classe: number;
  CNPJ_Classe: string;
  Tipo_Classe: string;
  Denominacao_Social_C: string;
  Situacao_C: string;
  Classificacao: string;
  Publico_Alvo: string;
  CLASSE: string;
  PUBLICO_ALVO: string;
  updated_at: Date;
}

// Interface for the document, in here should go the custom instance methods and properties
interface CadastroFundosDocType extends Document, CadastroFundosDocType_doc {
  _doc: CadastroFundosDocType_doc;
}

// Interface for the model itself, in here, should be included the static methods
interface CadastroFundosModelType extends Model<CadastroFundosDocType> {
  getCadastroByCnpj(cnpj: string): Promise<CadastroFundosDocType | null>;
  getClassificacaoByCnpj(cnpj: string): Promise<string | false>;
  getArrCnpjName(cnpjs: string[]): Promise<Array<ArrCnpjNameType> | false>; // THIS SHOULD BE AN INSTANCE METHOD
}

interface ArrCnpjNameType {
  CNPJ_Fundo: string;
  Denominacao_Social_F: string;
}

export type {
  CadastroFundosDocType_doc,
  CadastroFundosDocType,
  CadastroFundosModelType,
  ArrCnpjNameType,
};
