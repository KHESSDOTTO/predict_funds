import CorrelationsModel from "../models/correlationsModel";

async function getLastCorrelationsByCnpj(cnpj: string) {
  try {
    const correlations = await CorrelationsModel.find({
      CNPJ_FUNDO: cnpj,
    });

    return correlations;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export { getLastCorrelationsByCnpj };
