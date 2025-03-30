import { Schema, model, models } from "mongoose";
import type {
  CadastroFundosDocType,
  CadastroFundosModelType,
} from "./cadastroFundosTypes";
import { consoleLog } from "@/utils/functions/genericFunctions";

const CadastroFundosSchema = new Schema<
  CadastroFundosDocType,
  CadastroFundosModelType
>(
  {
    ID_Registro_Fundo: { type: Number, required: true, unique: false },
    CNPJ_Fundo: { type: String, required: true, unique: false },
    Codigo_CVM: { type: Number, required: true, unique: false },
    Tipo_Fundo: { type: String, required: true, unique: false },
    Denominacao_Social_F: { type: String, required: true, unique: false },
    Situacao_F: { type: String, required: true, unique: false },
    ID_Registro_Classe: { type: Number, required: true, unique: false },
    CNPJ_Classe: { type: String, required: true, unique: false },
    Tipo_Classe: { type: String, required: true, unique: false },
    Denominacao_Social_C: { type: String, required: true, unique: false },
    Situacao_C: { type: String, required: true, unique: false },
    Classificacao: { type: String, required: true, unique: false },
    Publico_Alvo: { type: String, required: true, unique: false },
    CLASSE: { type: String, required: true, unique: false },
    PUBLICO_ALVO: { type: String, required: true, unique: false },
    updated_at: { type: Date, required: true, unique: false },
  },
  { timestamps: true }
);

CadastroFundosSchema.statics.getCadastroByCnpj = async function (cnpj: string) {
  try {
    const cadastro = await CadastroFundosModel.findOne({
      CNPJ_Fundo: cnpj,
    });

    return cadastro;
  } catch (err) {
    console.log(err);

    return false;
  }
};

CadastroFundosSchema.statics.getClassificacaoByCnpj = async function (
  cnpj: string
) {
  try {
    const classificacao = (await CadastroFundosModel.findOne(
      {
        CNPJ_Fundo: cnpj,
      },
      {
        Classificacao: 1,
        _id: 0,
      }
    )) as { Classificacao: string } | null;

    if (!classificacao) {
      return false;
    }

    return classificacao.Classificacao;
  } catch (err) {
    console.log(err);

    return false;
  }
};

CadastroFundosSchema.statics.getArrCnpjName = async function (cnpjs: string[]) {
  try {
    const arrCnpjNames = await CadastroFundosModel.find(
      {
        CNPJ_Fundo: { $in: cnpjs },
      },
      {
        _id: 0,
        CNPJ_Fundo: 1,
        Denominacao_Social_F: 1,
      }
    );

    return arrCnpjNames;
  } catch (err) {
    console.log(err);

    return false;
  }
};

CadastroFundosSchema.index({ CNPJ_Fundo: 1 });

const CadastroFundosModel =
  (models.cadastro_fundos as CadastroFundosModelType) ||
  model<CadastroFundosDocType, CadastroFundosModelType>(
    "cadastro_fundos",
    CadastroFundosSchema,
    "HN_cadastro_fundos_cvm175"
  );

export default CadastroFundosModel;
