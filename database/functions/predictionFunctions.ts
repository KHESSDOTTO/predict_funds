import PredictionModel from "@/database/models/predictionModel";
import Predictions4Weeks1Model from "../models/predictions4WeeksModel1";
import Predictions4Weeks2Model from "../models/predictions4WeeksModel2";
import Predictions4Weeks3Model from "../models/predictions4WeeksModel3";
import { DashboardControlFormType, PredictionsType } from "@/utils/types";
import { arrBaseDates } from "@/utils/globalVars";

// Old -> single prediction
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
// * /Old *

async function getPredictions2(controlForm: DashboardControlFormType) {
  // Prediction for 4 weeks forward

  const predKey = [
    (Number(controlForm.varCota) * 100).toFixed(1),
    (Number(controlForm.varCotistas) * 100).toFixed(1),
    (Number(controlForm.varNF) * 100).toFixed(1),
  ].join("_");

  console.log("predKey");
  console.log(predKey);
  console.log("controlForm.buscaCnpj");
  console.log(controlForm.buscaCnpj);

  try {
    let prediction4weeks: PredictionsType | null = null;
    switch (controlForm.baseDate) {
      case arrBaseDates[0]:
        console.log("Matched arrBaseDates[0]");
        prediction4weeks = await Predictions4Weeks1Model.findOne(
          {
            CNPJ_FUNDO: controlForm.buscaCnpj,
          },
          {
            _id: 0,
          }
        );
        break;
      case arrBaseDates[1]:
        console.log("Matched arrBaseDates[1]");
        prediction4weeks = await Predictions4Weeks2Model.findOne(
          {
            CNPJ_FUNDO: controlForm.buscaCnpj,
          },
          {
            _id: 0,
          }
        );
        break;
      case arrBaseDates[2]:
        console.log("Matched arrBaseDates[2]");
        prediction4weeks = await Predictions4Weeks3Model.findOne(
          {
            CNPJ_FUNDO: controlForm.buscaCnpj,
          },
          {
            _id: 0,
          }
        );
        break;
    }

    // console.log("prediction4weeks");
    // console.log(prediction4weeks);

    let finalPred4weeks = prediction4weeks;

    if (prediction4weeks) {
      finalPred4weeks = {
        CNPJ_FUNDO: prediction4weeks.CNPJ_FUNDO,
        CAPTC_LIQ: prediction4weeks[predKey],
      };
    } else {
      return false;
    }

    console.log("finalPred4weeks");
    console.log(finalPred4weeks);

    return finalPred4weeks;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export { getPredictionsByCnpj, getPredictions2 };
