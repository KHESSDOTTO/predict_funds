import PredictionModel from "@/database/models/predictionModel";
import Predictions4Weeks1Model from "../models/predictions4WeeksModel1";
import Predictions4Weeks2Model from "../models/predictions4WeeksModel2";
import Predictions4Weeks3Model from "../models/predictions4WeeksModel3";
import { DashboardControlFormType, PredictionsType } from "@/utils/types";
import { arrBaseDates } from "@/utils/globalVars";
import CadastroFundosModel from "../models/cadastroFundosModel";

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
    (Number(controlForm.varCota) * 100)
      .toFixed(1)
      .replaceAll(".", "_")
      .replaceAll("-", "n"),
    (Number(controlForm.varCotistas) * 100)
      .toFixed(1)
      .replaceAll(".", "_")
      .replaceAll("-", "n"),
    (Number(controlForm.varNF) * 100)
      .toFixed(1)
      .replaceAll(".", "_")
      .replaceAll("-", "n"),
  ].join("__");

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
            CNPJ_FUNDO: 1,
            CLASSE_ANBIMA: 1,
            [predKey]: 1,
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
            CNPJ_FUNDO: 1,
            CLASSE_ANBIMA: 1,
            [predKey]: 1,
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
            CNPJ_FUNDO: 1,
            CLASSE_ANBIMA: 1,
            [predKey]: 1,
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
        CLASSE_ANBIMA: prediction4weeks.CLASSE_ANBIMA,
        CAPTC_LIQ: prediction4weeks[predKey],
      };
    } else {
      return false;
    }

    // console.log("finalPred4weeks");
    // console.log(finalPred4weeks);

    return finalPred4weeks;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function getCnpjsByAnbimaClass(anbimaClass: string) {
  try {
    const queryRes = await CadastroFundosModel.find(
      {
        CLASSE_ANBIMA: anbimaClass,
      },
      {
        _id: 0,
        CNPJ_FUNDO: 1,
      }
    );
    if (!queryRes) {
      console.log("No anbima class:" + anbimaClass + "found in the database.");
      return false;
    }
    const idArr = queryRes.map((cE) => {
      return cE.CNPJ_FUNDO;
    });
    return idArr;
  } catch (err) {
    console.log(err);
    return false;
  }
}

// Function to get predictions based on CNPJ list - used to do the queries to generate the histogram.
async function getPredsForHistogram(controlForm: DashboardControlFormType) {
  // Prediction of all CNPJs to 4 weeks forward based on params to build histogram

  const predKey = [
    (Number(controlForm.varCota) * 100)
      .toFixed(1)
      .replaceAll(".", "_")
      .replaceAll("-", "n"),
    (Number(controlForm.varCotistas) * 100)
      .toFixed(1)
      .replaceAll(".", "_")
      .replaceAll("-", "n"),
    (Number(controlForm.varNF) * 100)
      .toFixed(1)
      .replaceAll(".", "_")
      .replaceAll("-", "n"),
  ].join("__");

  console.log("predKey", predKey);
  console.log("controlForm.buscaCnpj", controlForm.buscaCnpj);
  console.log("controlForm.anbimaClass", controlForm.anbimaClass);

  // Erro se não tiver classe anbima
  if (!controlForm.anbimaClass) {
    console.log("There is no anbima class.");
    return false;
  }
  // Fim: Erro se não tiver classe anbima

  try {
    let prediction4weeks: PredictionsType[] | null = null;

    const projection = {
      CNPJ_FUNDO: 1,
      CLASSE_ANBIMA: 1,
      [predKey]: 1,
    };

    switch (controlForm.baseDate) {
      case arrBaseDates[0]:
        console.log("Matched arrBaseDates[0] in histogram");
        prediction4weeks = await Predictions4Weeks1Model.find(
          { CLASSE_ANBIMA: controlForm.anbimaClass },
          projection
        );
        break;
      case arrBaseDates[1]:
        console.log("Matched arrBaseDates[1] in histogram");
        prediction4weeks = await Predictions4Weeks2Model.find(
          { CLASSE_ANBIMA: controlForm.anbimaClass },
          projection
        );
        break;
      case arrBaseDates[2]:
        console.log("Matched arrBaseDates[2] in histogram");
        prediction4weeks = await Predictions4Weeks3Model.find(
          { CLASSE_ANBIMA: controlForm.anbimaClass },
          projection
        );
        break;
    }

    // console.log("prediction4weeks", prediction4weeks);

    if (!prediction4weeks) {
      return false;
    }

    const finalPred4weeks = prediction4weeks.map((cE) => ({
      CNPJ_FUNDO: cE.CNPJ_FUNDO,
      CAPTC_LIQ: cE[predKey],
      CLASSE_ANBIMA: cE.CLASSE_ANBIMA,
    }));

    console.log("finalPred4weeks", finalPred4weeks);

    return finalPred4weeks;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export {
  getPredictionsByCnpj,
  getPredictions2,
  getPredsForHistogram,
  getCnpjsByAnbimaClass,
};
