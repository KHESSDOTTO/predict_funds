import CorrelationsModel from "../models/correlationsModel";

async function getMostRecentCorrelsByCnpj(cnpj: string) {
  try {
    const correl6months = await CorrelationsModel.findOne({
      CNPJ_FUNDO: cnpj,
      janela_em_meses: 6,
    })
      .sort({ data_calc_correlacao: -1 })
      .exec();

    const correl12months = await CorrelationsModel.findOne({
      CNPJ_FUNDO: cnpj,
      janela_em_meses: 12,
    })
      .sort({ data_calc_correlacao: -1 })
      .exec();

    const mostRecentCorrelations = [correl6months, correl12months];

    return mostRecentCorrelations;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export { getMostRecentCorrelsByCnpj };
