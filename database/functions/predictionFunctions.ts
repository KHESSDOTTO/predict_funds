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
    for (let key in prediction4Weeks) {
      if (typeof prediction4Weeks[key] === "number") {
        prediction4Weeks[key] = Number(prediction4Weeks[key].toFixed(2));
      }
    }

    return prediction4Weeks;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export { getPredictionsByCnpj };
