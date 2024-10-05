import { Schema, model, models } from "mongoose";
import type {
  CadastroFundosDocType,
  CadastroFundosModelType,
} from "./cadastroFundosTypes";

const CadastroFundosSchema = new Schema(
  {
    CNPJ_FUNDO: { type: String, required: true, trim: true, unique: true },
    TP_FUNDO: { type: String, required: true, trim: true, unique: false },
    DENOM_SOCIAL: { type: String, required: true, trim: true, unique: false },
    DT_REG: { type: String, required: true, trim: true, unique: false },
    DT_CONST: { type: String, required: true, trim: true, unique: false },
    CD_CVM: { type: Number, required: true, trim: true, unique: false },
    DT_CANCEL: { type: String, required: true, trim: true, unique: false },
    SIT: { type: String, required: true, trim: true, unique: false },
    DT_INI_SIT: { type: String, required: true, trim: true, unique: false },
    DT_INI_ATIV: { type: String, required: true, trim: true, unique: false },
    DT_INI_EXERC: { type: String, required: true, trim: true, unique: false },
    DT_FIM_EXERC: { type: String, required: true, trim: true, unique: false },
    CLASSE: { type: String, required: true, trim: true, unique: false },
    DT_INI_CLASSE: { type: String, required: true, trim: true, unique: false },
    RENTAB_FUNDO: { type: String, required: true, trim: true, unique: false },
    CONDOM: { type: String, required: true, trim: true, unique: false },
    FUNDO_COTAS: { type: String, required: true, trim: true, unique: false },
    FUNDO_EXCLUSIVO: {
      type: String,
      required: true,
      trim: true,
      unique: false,
    },
    TRIB_LPRAZO: { type: String, required: true, trim: true, unique: false },
    PUBLICO_ALVO: { type: String, required: true, trim: true, unique: false },
    ENTID_INVEST: { type: String, required: true, trim: true, unique: false },
    TAXA_PERFM: { type: Number, required: true, trim: true, unique: false },
    INF_TAXA_PERFM: { type: String, required: true, trim: true, unique: false },
    TAXA_ADM: { type: Number, required: true, trim: true, unique: false },
    INF_TAXA_ADM: { type: String, required: true, trim: true, unique: false },
    VL_PATRIM_LIQ: { type: Number, required: true, trim: true, unique: false },
    DT_PATRIM_LIQ: { type: String, required: true, trim: true, unique: false },
    DIRETOR: { type: String, required: true, trim: true, unique: false },
    CNPJ_ADMIN: { type: String, required: true, trim: true, unique: false },
    ADMIN: { type: String, required: true, trim: true, unique: false },
    PF_PJ_GESTOR: { type: String, required: true, trim: true, unique: false },
    CPF_CNPJ_GESTOR: {
      type: String,
      required: true,
      trim: true,
      unique: false,
    },
    GESTOR: { type: String, required: true, trim: true, unique: false },
    CNPJ_AUDITOR: { type: String, required: true, trim: true, unique: false },
    AUDITOR: { type: String, required: true, trim: true, unique: false },
    CNPJ_CUSTODIANTE: {
      type: String,
      required: true,
      trim: true,
      unique: false,
    },
    CUSTODIANTE: { type: String, required: true, trim: true, unique: false },
    CNPJ_CONTROLADOR: {
      type: String,
      required: true,
      trim: true,
      unique: false,
    },
    CONTROLADOR: { type: String, required: true, trim: true, unique: false },
    INVEST_CEMPR_EXTER: {
      type: String,
      required: true,
      trim: true,
      unique: false,
    },
    CLASSE_ANBIMA: { type: String, required: true, trim: true, unique: false },
  },
  { timestamps: true }
);

CadastroFundosSchema.statics.getCadastroByCnpj = async function (cnpj: string) {
  try {
    const cadastro = await CadastroFundosModel.findOne({
      CNPJ_FUNDO: cnpj,
    });
    return cadastro;
  } catch (err) {
    console.log(err);
    return false;
  }
};

CadastroFundosSchema.statics.getAnbimaClassByCnpj = async function (
  cnpj: string
) {
  try {
    const anbimaClass = (await CadastroFundosModel.findOne(
      {
        CNPJ_FUNDO: cnpj,
      },
      {
        CLASSE_ANBIMA: 1,
        _id: 0,
      }
    )) as { CLASSE_ANBIMA: string } | null;

    if (!anbimaClass) {
      return false;
    }

    return anbimaClass.CLASSE_ANBIMA;
  } catch (err) {
    console.log(err);
    return false;
  }
};

CadastroFundosSchema.statics.getArrCnpjName = async function (cnpjs: string[]) {
  try {
    const arrCnpjNames = await CadastroFundosModel.find(
      {
        CNPJ_FUNDO: { $in: cnpjs },
      },
      {
        _id: 0,
        CNPJ_FUNDO: 1,
        DENOM_SOCIAL: 1,
      }
    );
    return arrCnpjNames;
  } catch (err) {
    console.log(err);
    return false;
  }
};

CadastroFundosSchema.index({ CNPJ_FUNDO: 1 });

const CadastroFundosModel =
  (models.cadastro_fundos as CadastroFundosModelType) ||
  model<CadastroFundosDocType, CadastroFundosModelType>(
    "cadastro_fundos",
    CadastroFundosSchema,
    "cadastro_fundos"
  );

export default CadastroFundosModel;
