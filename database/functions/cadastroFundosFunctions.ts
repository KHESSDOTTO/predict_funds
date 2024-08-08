import CadastroFundosModel from "../models/cadastroFundosModel";

async function getCadastroByCnpj(cnpj: string) {
  try {
    const cadastro = await CadastroFundosModel.findOne({
      CNPJ_FUNDO: cnpj,
    });
    return cadastro;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function getAnbimaClassByCnpj(cnpj: string) {
  try {
    const anbimaClass = await CadastroFundosModel.findOne(
      {
        CNPJ_FUNDO: cnpj,
      },
      {
        CLASSE_ANBIMA: 1,
        _id: 0,
      }
    );

    if (!anbimaClass) {
      return false;
    }

    return anbimaClass.CLASSE_ANBIMA;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export { getCadastroByCnpj, getAnbimaClassByCnpj };
