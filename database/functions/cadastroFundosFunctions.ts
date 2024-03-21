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

export { getCadastroByCnpj };
