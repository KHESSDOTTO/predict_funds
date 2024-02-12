import PredictionModel from "@/database/models/predictionModel";

async function getPredictionsByCnpj(cnpj: string) {
  // Prediction for 4 weeks forward
  try {
    const prediction4Weeks = await PredictionModel.findOne({
      CNPJ_FUNDO: cnpj,
    });
    if (!prediction4Weeks) {
      return false;
    }
    return prediction4Weeks;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export { getPredictionsByCnpj };
