import PredictionsModel from "@/database/models/predictionsModel";
import Predictions4Weeks1Model from "../models/predictions4WeeksModel1";
import Predictions4Weeks2Model from "../models/predictions4WeeksModel2";
import Predictions4Weeks3Model from "../models/predictions4WeeksModel3";
import { DashboardControlFormType, PredictionsType } from "@/utils/types";
import { arrBaseDates } from "@/utils/globalVars";
import CadastroFundosModel from "../models/cadastroFundosModel";
import { buildPredKey } from "@/functions/functions";

async function getPredictions(controlForm: DashboardControlFormType) {
  const { varCota, varCotistas, varNF, baseDate, buscaCnpj } = controlForm;
  const predKey = buildPredKey(varCota, varCotistas, varNF);

  try {
    let prediction4weeks: PredictionsType | null = null;
    switch (baseDate) {
      case arrBaseDates[0]:
        prediction4weeks = await Predictions4Weeks1Model.findOne(
          {
            CNPJ_FUNDO: buscaCnpj,
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
        prediction4weeks = await Predictions4Weeks2Model.findOne(
          {
            CNPJ_FUNDO: buscaCnpj,
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
        prediction4weeks = await Predictions4Weeks3Model.findOne(
          {
            CNPJ_FUNDO: buscaCnpj,
          },
          {
            _id: 0,
            CNPJ_FUNDO: 1,
            CLASSE_ANBIMA: 1,
            [predKey]: 1,
          }
        );
        break;
      default:
        prediction4weeks = await PredictionsModel.findOne(
          {
            CNPJ_FUNDO: buscaCnpj,
          },
          {
            _id: 0,
            CNPJ_FUNDO: 1,
            CLASSE_ANBIMA: 1,
            [predKey]: 1,
          }
        );
    }

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

    return finalPred4weeks;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function getCnpjsByAnbimaClass(anbimaClass: string) {
  try {
    const queryRes = await CadastroFundosModel.distinct("CNPJ_FUNDO", {
      CLASSE_ANBIMA: anbimaClass,
    });

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

async function getPredsForHistogram(controlForm: DashboardControlFormType) {
  /*
    Prediction of all CNPJs to 4 weeks forward. Prediction of the selected CNPJ are based on params (controlForm),
      others default (zero), to build histogram
  */

  const { varCota, varCotistas, varNF, anbimaClass, baseDate, buscaCnpj } =
    controlForm;
  const customPredKey = buildPredKey(varCota, varCotistas, varNF);
  const defaultPredKey = "0_0__0_0__0_0";

  // Erro se não tiver classe anbima
  if (!anbimaClass) {
    console.log("There is no anbima class.");
    return false;
  }
  // Fim: Erro se não tiver classe anbima

  try {
    let prediction4weeks: PredictionsType[] | null = null;

    const projection = {
      CNPJ_FUNDO: 1,
      CLASSE_ANBIMA: 1,
      [customPredKey]: 1,
      [defaultPredKey]: 1,
    };

    switch (baseDate) {
      case arrBaseDates[0]:
        prediction4weeks = await Predictions4Weeks1Model.find(
          { CLASSE_ANBIMA: anbimaClass },
          projection
        );
        break;
      case arrBaseDates[1]:
        prediction4weeks = await Predictions4Weeks2Model.find(
          { CLASSE_ANBIMA: anbimaClass },
          projection
        );
        break;
      case arrBaseDates[2]:
        prediction4weeks = await Predictions4Weeks3Model.find(
          { CLASSE_ANBIMA: anbimaClass },
          projection
        );
        break;
      default:
        prediction4weeks = await PredictionsModel.find(
          { CLASSE_ANBIMA: anbimaClass },
          projection
        );
    }

    if (!prediction4weeks) {
      return false;
    }

    const finalPred4weeks = prediction4weeks.map((cE) => {
      let predKey;

      if (cE.CNPJ_FUNDO === buscaCnpj) {
        predKey = customPredKey;
      } else {
        predKey = defaultPredKey;
      }

      return {
        CNPJ_FUNDO: cE.CNPJ_FUNDO,
        CAPTC_LIQ: cE[predKey],
        CLASSE_ANBIMA: cE.CLASSE_ANBIMA,
      };
    });

    return finalPred4weeks;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function getAncoras() {
  const ancoras = await PredictionsModel.distinct("ancora");
  return ancoras;
}

async function getPredDates() {
  const datahoraPredicao = await PredictionsModel.distinct("datahora_predicao");
  return datahoraPredicao;
}

export {
  getPredictions,
  getPredsForHistogram,
  getCnpjsByAnbimaClass,
  getPredDates,
  getAncoras,
};
